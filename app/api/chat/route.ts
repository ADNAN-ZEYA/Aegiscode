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
  const basePrompt = `You are an expert AI tutor on AegisCode, a premium educational platform for engineering students. You have deep expertise in Data Structures & Algorithms, Operating Systems, DBMS, Computer Networks, System Design, and Web Development.

Your teaching style:
- Explain concepts clearly with real-world analogies
- Use examples and step-by-step breakdowns
- For code questions, provide clean well-commented code
- For theory, connect concepts to practical applications
- Anticipate follow-up questions and address them
- Use formatting (bold, bullets, code blocks) for clarity
- Always relate answers to placement interviews when relevant

You have access to the current page content the student is reading. Use it as primary context for your answers. If the student asks something beyond the page, draw from your broader knowledge but always tie back to their current study topic.

Never give wrong information. If unsure, say so honestly and guide the student to verify.

Current page:
Title: ${pageContext.title}
Content excerpt: ${pageContext.content.substring(0, 2500)}`;

  const systemPrompt = settings.systemPrompt
    ? `${basePrompt}\n\nAdditional instructions from the administrator:\n${settings.systemPrompt}`
    : basePrompt;

  // 7. Call Gemini 2.5 Pro via Google AI Studio
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('GEMINI_API_KEY is not set');
    return NextResponse.json({ error: 'AI service is not configured.' }, { status: 500 });
  }

  const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${apiKey}`;

  const fetchGemini = () =>
    fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: messages.map((m) => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }],
        })),
        systemInstruction: {
          parts: [{ text: systemPrompt }],
        },
        generationConfig: {
          temperature: 0.9,
          maxOutputTokens: 8192,
          topP: 0.95,
          topK: 40,
        },
      }),
    });

  let geminiRes: Response;
  try {
    geminiRes = await fetchGemini();
    if (geminiRes.status === 429) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      geminiRes = await fetchGemini();
    }
  } catch (err) {
    console.error('Gemini fetch error:', err);
    return NextResponse.json({ error: 'Failed to reach AI service.' }, { status: 502 });
  }

  if (geminiRes.status === 429) {
    return NextResponse.json(
      { error: "I'm a bit busy right now, please try again in a moment." },
      { status: 429 },
    );
  }

  if (!geminiRes.ok) {
    const errorText = await geminiRes.text();
    console.error('Gemini error response:', geminiRes.status, errorText);
    return NextResponse.json({ error: 'AI service returned an error.' }, { status: 502 });
  }

  const data = await geminiRes.json();
  const content: string = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

  return NextResponse.json({ content });
}
