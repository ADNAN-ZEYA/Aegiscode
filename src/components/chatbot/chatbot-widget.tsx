'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2, RotateCcw, Send, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';
import type { ChatMessage, PageContext } from '@/types/chatbot';

const SUGGESTIONS = [
  'Summarise this page for me',
  'Explain the key concepts',
  'Give me revision notes',
];

// gradientUnits="objectBoundingBox" — all instances share the same gradient ID harmlessly
// because each instance defines the same geometry; the browser uses whichever it finds first.
function AriaAvatar({ size = 'md' }: { size?: 'sm' | 'md' }) {
  const dim = size === 'sm' ? 28 : 36;
  return (
    <svg
      width={dim}
      height={dim}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="aria-bg" x1="0" y1="0" x2="1" y2="1" gradientUnits="objectBoundingBox">
          <stop stopColor="#6D28D9" />
          <stop offset="1" stopColor="#0D9488" />
        </linearGradient>
      </defs>

      {/* Background */}
      <circle cx="18" cy="18" r="18" fill="url(#aria-bg)" />

      {/* Hair — dark, behind face */}
      <ellipse cx="18" cy="13" rx="9.5" ry="9" fill="#1C1033" />
      {/* Hair top arch */}
      <path d="M8.5 18 Q9 7 18 6 Q27 7 27.5 18 Q23 12 18 12 Q13 12 8.5 18 Z" fill="#1C1033" />
      {/* Side hair curtains */}
      <rect x="8" y="16" width="2.8" height="13" rx="1.4" fill="#1C1033" />
      <rect x="25.2" y="16" width="2.8" height="13" rx="1.4" fill="#1C1033" />

      {/* Face */}
      <ellipse cx="18" cy="22" rx="8.5" ry="9" fill="#FDDCB5" />

      {/* Ears */}
      <ellipse cx="9.5" cy="21" rx="1.2" ry="1.6" fill="#F0B896" />
      <ellipse cx="26.5" cy="21" rx="1.2" ry="1.6" fill="#F0B896" />

      {/* Left eyebrow */}
      <path d="M13 18.2 Q14.5 17.2 16.5 17.7" stroke="#2A1508" strokeWidth="0.9" strokeLinecap="round" fill="none" />
      {/* Right eyebrow */}
      <path d="M19.5 17.7 Q21.5 17.2 23 18.2" stroke="#2A1508" strokeWidth="0.9" strokeLinecap="round" fill="none" />

      {/* Left eye */}
      <ellipse cx="14.5" cy="20.5" rx="2.1" ry="1.7" fill="white" />
      <circle cx="14.5" cy="20.5" r="1.2" fill="#6B3D1E" />
      <circle cx="14.5" cy="20.5" r="0.65" fill="#100800" />
      <circle cx="15.2" cy="19.8" r="0.38" fill="white" />

      {/* Right eye */}
      <ellipse cx="21.5" cy="20.5" rx="2.1" ry="1.7" fill="white" />
      <circle cx="21.5" cy="20.5" r="1.2" fill="#6B3D1E" />
      <circle cx="21.5" cy="20.5" r="0.65" fill="#100800" />
      <circle cx="22.2" cy="19.8" r="0.38" fill="white" />

      {/* Nose hint */}
      <path d="M17.3 23.5 Q18 24.2 18.7 23.5" stroke="#D4906A" strokeWidth="0.7" strokeLinecap="round" fill="none" opacity="0.7" />

      {/* Smile */}
      <path d="M15.5 25.5 Q18 27.8 20.5 25.5" stroke="#C07845" strokeWidth="1" strokeLinecap="round" fill="none" />

      {/* Blush */}
      <ellipse cx="12.5" cy="23" rx="2.4" ry="1.3" fill="#F9A8D4" opacity="0.4" />
      <ellipse cx="23.5" cy="23" rx="2.4" ry="1.3" fill="#F9A8D4" opacity="0.4" />

      {/* Neck */}
      <rect x="15.5" y="30" width="5" height="4" rx="1.5" fill="#FDDCB5" />
      {/* Indigo jacket — clips naturally at SVG viewport bottom */}
      <path d="M4 39 Q10 32 15.5 31 L18 34.5 L20.5 31 Q26 32 32 39 Z" fill="#4338CA" />
      {/* White V-collar */}
      <path d="M18 34.5 L15.5 31 Q17 33 18 33.5 Q19 33 20.5 31 Z" fill="white" opacity="0.95" />
    </svg>
  );
}

function extractPageContext(): PageContext {
  const title =
    document.querySelector('article h1')?.textContent?.trim() ??
    document.querySelector('h1')?.textContent?.trim() ??
    document.title;

  const article = document.querySelector('article');
  const rawText = article
    ? article.innerText
    : document.querySelector('main')?.innerText ?? document.body.innerText;

  const content = rawText.replace(/\s+/g, ' ').trim().substring(0, 2500);

  return { title, content };
}

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isNewConversation, setIsNewConversation] = useState(true);
  const [pageContext, setPageContext] = useState<PageContext | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleOpen = () => {
    if (!pageContext) {
      setPageContext(extractPageContext());
    }
    setIsOpen(true);
    setTimeout(() => inputRef.current?.focus(), 320);
  };

  const handleClose = () => setIsOpen(false);

  const handleReset = () => {
    setMessages([]);
    setIsNewConversation(true);
    setPageContext(extractPageContext());
  };

  const handleTextareaInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const el = e.currentTarget;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 128)}px`;
  };

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isLoading || !pageContext) return;

      const userMessage: ChatMessage = { role: 'user', content: text.trim() };
      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);
      setInput('');

      if (inputRef.current) {
        inputRef.current.style.height = 'auto';
      }

      setIsLoading(true);

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: updatedMessages,
            pageContext,
            isNewConversation,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          setMessages((prev) => [
            ...prev,
            { role: 'assistant', content: `⚠️ ${data.error ?? 'Something went wrong. Please try again.'}` },
          ]);
        } else {
          setMessages((prev) => [...prev, { role: 'assistant', content: data.content }]);
          setIsNewConversation(false);
        }
      } catch {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: '⚠️ Network error. Please check your connection and try again.' },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, messages, pageContext, isNewConversation],
  );

  const handleSend = () => sendMessage(input);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestion = (text: string) => {
    setInput(text);
    inputRef.current?.focus();
  };

  return (
    <>
      {/* Floating trigger button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            key="chatbot-trigger"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            onClick={handleOpen}
            aria-label="Chat with Aria"
            className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-primary p-0 shadow-lg shadow-primary/30 transition-shadow hover:shadow-xl hover:shadow-primary/40"
          >
            <AriaAvatar size="md" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Side panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Mobile backdrop */}
            <motion.div
              key="chatbot-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden"
            />

            <motion.div
              key="chatbot-panel"
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="fixed bottom-0 right-0 top-0 z-50 flex w-full flex-col border-l border-border bg-background shadow-2xl md:w-[26rem]"
            >
              {/* Panel header */}
              <div className="flex shrink-0 items-center justify-between border-b border-border px-4 py-3">
                <div className="flex items-center gap-2.5">
                  <AriaAvatar size="md" />
                  <div className="leading-tight">
                    <p className="text-sm font-semibold">Aria</p>
                    <p className="text-[11px] text-muted-foreground">Your AI Study Assistant</p>
                  </div>
                </div>

                <div className="flex items-center gap-0.5">
                  {messages.length > 0 && (
                    <button
                      onClick={handleReset}
                      title="Start new conversation"
                      className="rounded-lg p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                    </button>
                  )}
                  <button
                    onClick={handleClose}
                    aria-label="Close Aria"
                    className="rounded-lg p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4">
                {messages.length === 0 && (
                  <div className="space-y-4 pt-2">
                    <div className="flex flex-col items-center gap-2 py-4">
                      <AriaAvatar size="md" />
                      <p className="text-center text-sm text-muted-foreground">
                        Hi! I&apos;m Aria. I&apos;ve read this page — ask me anything!
                      </p>
                    </div>
                    <div className="grid gap-2">
                      {SUGGESTIONS.map((s) => (
                        <button
                          key={s}
                          onClick={() => handleSuggestion(s)}
                          className="rounded-xl border border-border bg-muted/40 px-3.5 py-2.5 text-left text-sm text-muted-foreground transition hover:border-primary/30 hover:bg-primary/5 hover:text-foreground"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-4 pt-2">
                  {messages.map((msg, i) => (
                    <div
                      key={i}
                      className={cn(
                        'flex items-end gap-2',
                        msg.role === 'user' ? 'justify-end' : 'justify-start',
                      )}
                    >
                      {msg.role === 'assistant' && <AriaAvatar size="sm" />}

                      <div
                        className={cn(
                          'max-w-[82%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed',
                          msg.role === 'user'
                            ? 'rounded-br-sm bg-primary text-primary-foreground'
                            : 'rounded-bl-sm bg-muted text-foreground',
                        )}
                      >
                        {msg.role === 'user' && (
                          <p className="mb-1 text-[10px] font-medium opacity-70">You</p>
                        )}
                        {msg.role === 'assistant' ? (
                          <>
                            <p className="mb-1 text-[10px] font-medium text-primary/70">Aria</p>
                            <div className="prose prose-sm max-w-none dark:prose-invert prose-p:my-1 prose-pre:my-2 prose-ul:my-1 prose-ol:my-1 prose-headings:my-2">
                              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {msg.content}
                              </ReactMarkdown>
                            </div>
                          </>
                        ) : (
                          msg.content
                        )}
                      </div>
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex items-end gap-2 justify-start">
                      <AriaAvatar size="sm" />
                      <div className="flex items-center gap-2 rounded-2xl rounded-bl-sm bg-muted px-4 py-3 text-sm text-muted-foreground">
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        Aria is thinking…
                      </div>
                    </div>
                  )}
                </div>

                <div ref={messagesEndRef} />
              </div>

              {/* Input area */}
              <div className="shrink-0 border-t border-border p-3">
                <div className="flex items-end gap-2 rounded-xl border border-border bg-muted/30 px-3 py-2 transition focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onInput={handleTextareaInput}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask Aria anything…"
                    rows={1}
                    disabled={isLoading}
                    className="flex-1 resize-none bg-transparent text-sm outline-none placeholder:text-muted-foreground disabled:opacity-50"
                    style={{ maxHeight: '8rem', overflowY: 'auto' }}
                  />
                  <button
                    onClick={handleSend}
                    disabled={!input.trim() || isLoading}
                    aria-label="Send message"
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground transition hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Send className="h-3.5 w-3.5" />
                  </button>
                </div>
                <p className="mt-1.5 text-center text-[10px] text-muted-foreground/50">
                  Enter to send · Shift+Enter for new line
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
