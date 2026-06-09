"use client";

import { useEffect, useRef, useState } from "react";
import { Send, Sparkles, User, Loader2 } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useDictionary } from "@/components/DictionaryProvider";
import { sendChat } from "@/lib/api";

type Message = { role: "user" | "assistant"; content: string; pending?: boolean };

const SUGGESTIONS = {
  ru: [
    "С чего начать ремонт в маленькой комнате?",
    "Какой стиль подойдёт для съёмного жилья?",
    "Как выбрать цвет стен под мебель?",
    "Какой бюджет нужен для базового ремонта?",
  ],
  en: [
    "Where to start renovating a small room?",
    "Which style suits rental apartments?",
    "How to pick wall color to match furniture?",
    "What budget do I need for basic renovation?",
  ],
};

export default function ChatPage() {
  const { dict, locale } = useDictionary();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const suggestions = SUGGESTIONS[locale as keyof typeof SUGGESTIONS] ?? SUGGESTIONS.en;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const userMsg: Message = { role: "user", content: trimmed };
    const pendingMsg: Message = { role: "assistant", content: "", pending: true };

    setMessages((prev) => [...prev, userMsg, pendingMsg]);
    setInput("");
    setLoading(true);

    try {
      const history = messages.map((m) => ({ role: m.role, content: m.content }));
      const result = await sendChat(trimmed, history);

      setMessages((prev) => {
        const next = [...prev];
        next[next.length - 1] = { role: "assistant", content: result.reply };
        return next;
      });
    } catch {
      setMessages((prev) => {
        const next = [...prev];
        next[next.length - 1] = {
          role: "assistant",
          content: locale === "ru"
            ? "Извините, не удалось получить ответ. Попробуйте ещё раз."
            : "Sorry, couldn't get a response. Please try again.",
        };
        return next;
      });
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  }

  return (
    <AppShell noPadding>
      <div className="flex h-[calc(100dvh-4rem-5rem)] flex-col">
        {/* Header */}
        <div className="border-b border-border px-5 py-4">
          <h1 className="text-2xl font-bold tracking-tight">{dict.chat.title}</h1>
          <p className="mt-0.5 text-sm text-muted">{dict.chat.subtitle}</p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {messages.length === 0 && (
            <div className="flex flex-col items-center pt-6 pb-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-coral/10 mb-4">
                <Sparkles className="text-coral" size={28} />
              </div>
              <p className="text-center text-sm font-semibold">
                {locale === "ru" ? "Спросите AI о дизайне вашей комнаты" : "Ask AI about your room design"}
              </p>
              <p className="text-center text-xs text-muted mt-1">
                {locale === "ru" ? "Советы по стилю, бюджету и ремонту" : "Tips on style, budget and renovation"}
              </p>

              {/* Suggestion chips */}
              <div className="mt-5 flex flex-col gap-2 w-full">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="rounded-2xl border border-border bg-card/50 px-4 py-3 text-left text-sm text-foreground transition hover:border-coral hover:bg-coral/5"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
            >
              {/* Avatar */}
              <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-white ${
                msg.role === "user" ? "bg-coral" : "bg-foreground/10"
              }`}>
                {msg.role === "user"
                  ? <User size={16} className="text-white" />
                  : <Sparkles size={16} className="text-coral" />
                }
              </div>

              {/* Bubble */}
              <div className={`max-w-[78%] rounded-3xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-coral text-white rounded-tr-sm"
                  : "bg-card border border-border rounded-tl-sm"
              }`}>
                {msg.pending ? (
                  <div className="flex gap-1 items-center h-4">
                    <span className="h-2 w-2 rounded-full bg-muted animate-bounce [animation-delay:0ms]" />
                    <span className="h-2 w-2 rounded-full bg-muted animate-bounce [animation-delay:150ms]" />
                    <span className="h-2 w-2 rounded-full bg-muted animate-bounce [animation-delay:300ms]" />
                  </div>
                ) : (
                  msg.content
                )}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="border-t border-border bg-background px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <div className="flex items-end gap-2 rounded-3xl border border-border bg-card/50 px-4 py-2 focus-within:border-coral transition">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={dict.chat.placeholder}
              rows={1}
              className="flex-1 resize-none bg-transparent text-sm outline-none placeholder:text-muted max-h-28 leading-5 py-1.5"
              style={{ height: "auto" }}
              onInput={(e) => {
                const el = e.currentTarget;
                el.style.height = "auto";
                el.style.height = el.scrollHeight + "px";
              }}
            />
            <button
              onClick={() => send(input)}
              disabled={!input.trim() || loading}
              className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-coral text-white transition disabled:opacity-40 hover:bg-coral-dark active:scale-95"
            >
              {loading
                ? <Loader2 size={16} className="animate-spin" />
                : <Send size={16} />
              }
            </button>
          </div>
          <p className="mt-1.5 text-center text-[10px] text-muted">
            Enter {locale === "ru" ? "для отправки" : "to send"} · Shift+Enter {locale === "ru" ? "для новой строки" : "for new line"}
          </p>
        </div>
      </div>
    </AppShell>
  );
}
