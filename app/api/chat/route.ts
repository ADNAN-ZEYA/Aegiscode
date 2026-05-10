import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { GoogleAuth } from 'google-auth-library';
import { adminAuth } from '@/lib/firebase/admin';
import {
  getAISettings,
  getUserDailyCount,
  incrementConversation,
} from '@/services/chatbot.service';
import type { ChatMessage, PageContext } from '@/types/chatbot';

const VERTEX_ENDPOINT =
  'https://us-east5-aiplatform.googleapis.com/v1/projects/emerald-trilogy-495821-a0' +
  '/locations/us-east5/publishers/anthropic/models/claude-sonnet-4-6:rawPredict';

// ADC: resolves from GOOGLE_APPLICATION_CREDENTIALS, Workload Identity, or metadata server.
const googleAuth = new GoogleAuth({
  scopes: ['https://www.googleapis.com/auth/cloud-platform'],
});

interface ChatRequestBody {
  messages: ChatMessage[];
  pageContext: PageContext;
  isNewConversation?: boolean;
}

export async function POST(request: Request) {
  // 1. Verify Firebase session cookie
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session')?.value;
  const devSessionCookie = cookieStore.get('dev-session')?.value;

  let uid: string;

  if (sessionCookie && adminAuth) {
    try {
      const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);
      uid = decoded.uid;
    } catch {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  } else if (devSessionCookie && process.env.NODE_ENV !== 'production') {
    try {
      const parsed = JSON.parse(devSessionCookie);
      uid = parsed.uid ?? 'dev-user';
    } catch {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  } else {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 2. Check global chatbot toggle
  const settings = await getAISettings();
  if (!settings.enabled) {
    return NextResponse.json(
      { error: 'The AI tutor is currently disabled by the administrator.' },
      { status: 403 },
    );
  }

  // 3. Check daily conversation limit
  const dailyCount = await getUserDailyCount(uid);
  if (dailyCount >= settings.dailyLimit) {
    return NextResponse.json(
      { error: `You have reached your daily limit of ${settings.dailyLimit} conversations.` },
      { status: 429 },
    );
  }

  // 4. Parse request body
  let body: ChatRequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { messages, pageContext, isNewConversation } = body;

  if (!Array.isArray(messages) || !pageContext?.title) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  // 5. Increment analytics on each new conversation start
  if (isNewConversation) {
    await incrementConversation(uid);
  }

  // 6. Build system prompt
  const basePrompt = `You are an AI tutor for AegisCode, a reading-first educational platform for engineering students. Your role is to help students understand the material they are currently reading.

Current page:
Title: ${pageContext.title}
Content excerpt: ${pageContext.content.substring(0, 2500)}

Guidelines:
- Provide clear, concise explanations tailored for engineering students.
- Reference the current page content when answering questions.
- When asked for a summary or revision notes, distil the key concepts from the page.
- Use code examples when they aid understanding of technical topics.
- Keep responses focused and educational. Avoid irrelevant tangents.`;

  const systemPrompt = settings.systemPrompt
    ? `${basePrompt}\n\nAdditional instructions from the administrator:\n${settings.systemPrompt}`
    : basePrompt;

  // 7. Call Vertex AI with an ADC Bearer token
  let accessToken: string;
  try {
    const client = await googleAuth.getClient();
    const tokenResponse = await client.getAccessToken();
    if (!tokenResponse.token) throw new Error('Empty access token');
    accessToken = tokenResponse.token;
  } catch (err) {
    console.error('ADC token error:', err);
    return NextResponse.json({ error: 'Failed to obtain credentials.' }, { status: 500 });
  }

  const vertexBody = JSON.stringify({
    anthropic_version: 'vertex-2023-10-16',
    max_tokens: 1024,
    system: systemPrompt,
    messages: messages.map((m) => ({ role: m.role, content: m.content })),
  });

  const fetchVertex = () =>
    fetch(VERTEX_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: vertexBody,
    });

  let vertexRes: Response;
  try {
    vertexRes = await fetchVertex();
    if (vertexRes.status === 429) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      vertexRes = await fetchVertex();
    }
  } catch (err) {
    console.error('Vertex AI fetch error:', err);
    return NextResponse.json({ error: 'Failed to reach AI service.' }, { status: 502 });
  }

  if (vertexRes.status === 429) {
    return NextResponse.json(
      { error: "I'm a bit busy right now, please try again in a moment." },
      { status: 429 },
    );
  }

  if (!vertexRes.ok) {
    const errorText = await vertexRes.text();
    console.error('Vertex AI error response:', vertexRes.status, errorText);
    return NextResponse.json({ error: 'AI service returned an error.' }, { status: 502 });
  }

  const result = await vertexRes.json();
  const content: string = result?.content?.[0]?.text ?? '';

  return NextResponse.json({ content });
}
