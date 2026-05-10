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
      <circle cx="18" cy="18" r="18" fill="url(#aria-bg)" />
      <ellipse cx="18" cy="12" rx="9" ry="8" fill="#7C3AED" />
      <ellipse cx="18" cy="10" rx="8" ry="6" fill="#8B5CF6" />
      <ellipse cx="9.5" cy="16" rx="3" ry="5" fill="#7C3AED" />
      <ellipse cx="26.5" cy="16" rx="3" ry="5" fill="#7C3AED" />
      <ellipse cx="18" cy="20" rx="8" ry="8.5" fill="#FDDCB5" />
      <ellipse cx="14.5" cy="19" rx="1.3" ry="1.5" fill="#1E1E2E" />
      <ellipse cx="21.5" cy="19" rx="1.3" ry="1.5" fill="#1E1E2E" />
      <circle cx="15.1" cy="18.4" r="0.45" fill="white" />
      <circle cx="22.1" cy="18.4" r="0.45" fill="white" />
      <path d="M15 22.5 Q18 24.5 21 22.5" stroke="#C97D5C" strokeWidth="0.9" strokeLinecap="round" fill="none" />
      <ellipse cx="13" cy="21.5" rx="2" ry="1.1" fill="#F9A8D4" opacity="0.5" />
      <ellipse cx="23" cy="21.5" rx="2" ry="1.1" fill="#F9A8D4" opacity="0.5" />
      <rect x="15.5" y="27" width="5" height="4" rx="2" fill="#FDDCB5" />
      <ellipse cx="18" cy="33" rx="10" ry="4" fill="#6D28D9" />
      <defs>
        <linearGradient id="aria-bg" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
          <stop stopColor="#EDE9FE" />
          <stop offset="1" stopColor="#CCFBF1" />
        </linearGradient>
      </defs>
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
