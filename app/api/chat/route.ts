import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { adminAuth } from '@/lib/firebase/admin';
import {
  getAISettings,
  getUserDailyCount,
  incrementConversation,
} from '@/services/chatbot.service';
import type { ChatMessage, PageContext } from '@/types/chatbot';

interface ChatRequestBody {
  messages: ChatMessage[];
  pageContext: PageContext;
  isNewConversation?: boolean;
}

export async function POST(request: Request) {
  // 1. Verify Firebase session cookie
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session')?.value;

  // Support dev-session in non-production environments
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

  // 7. Validate Vertex AI configuration
  const apiKey = process.env.GOOGLE_API_KEY;
  const projectId = process.env.GOOGLE_PROJECT_ID;
  const location = process.env.GOOGLE_LOCATION ?? 'us-east5';

  if (!apiKey || !projectId) {
    console.error('Missing GOOGLE_API_KEY or GOOGLE_PROJECT_ID environment variables');
    return NextResponse.json({ error: 'AI service is not configured.' }, { status: 500 });
  }

  // 8. Call Vertex AI (Anthropic Claude via rawPredict)
  const vertexUrl =
    `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}` +
    `/locations/${location}/publishers/anthropic/models/claude-sonnet-4-6:rawPredict?key=${apiKey}`;

  let vertexResponse: Response;
  try {
    vertexResponse = await fetch(vertexUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        anthropic_version: 'vertex-2023-10-16',
        max_tokens: 1024,
        system: systemPrompt,
        messages: messages.map((m) => ({ role: m.role, content: m.content })),
      }),
    });
  } catch (err) {
    console.error('Vertex AI fetch error:', err);
    return NextResponse.json({ error: 'Failed to reach AI service.' }, { status: 502 });
  }

  if (!vertexResponse.ok) {
    const errorText = await vertexResponse.text();
    console.error('Vertex AI error response:', vertexResponse.status, errorText);
    return NextResponse.json({ error: 'AI service returned an error.' }, { status: 502 });
  }

  const result = await vertexResponse.json();
  const content: string = result?.content?.[0]?.text ?? '';

  return NextResponse.json({ content });
}
