"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Send, Sparkles, User, Loader2, Plus, History,
  Trash2, X, ImageIcon,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Markdown } from "@/components/Markdown";
import { useDictionary } from "@/components/DictionaryProvider";
import { sendChat } from "@/lib/api";
import { buildChatContext } from "@/lib/chat-context";
import { STYLES } from "@/lib/styles";
import {
  loadConversations, saveConversation, deleteConversation,
  createConversation, titleFrom, type Conversation,
} from "@/lib/chat-store";
import { loadGallery, formatDate, type GalleryItem } from "@/lib/gallery";

type UiMessage = { role: "user" | "assistant"; content: string; pending?: boolean };

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

const DESIGN_SUGGESTIONS = {
  ru: [
    "Что можно улучшить в этом дизайне?",
    "Сколько будет стоить воплотить этот стиль?",
    "Какую мебель посоветуешь для этого интерьера?",
    "Какие материалы лучше выбрать?",
  ],
  en: [
    "What could be improved in this design?",
    "How much would it cost to achieve this style?",
    "What furniture would work best here?",
    "What materials would you recommend?",
  ],
};

function styleLabel(styleId: string) {
  return STYLES.find((s) => s.id === styleId)?.name ?? styleId;
}

export default function ChatPage() {
  const { dict, locale } = useDictionary();
  const searchParams = useSearchParams();

  // Linked design (from deep-link or picker)
  const [linkedDesignId, setLinkedDesignId] = useState<string | null>(
    searchParams.get("designId"),
  );
  const [linkedStyle, setLinkedStyle] = useState<string | null>(
    searchParams.get("style"),
  );

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [active, setActive] = useState<Conversation>(() => createConversation());
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [pending, setPending] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [designPickerOpen, setDesignPickerOpen] = useState(false);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const suggestions =
    linkedDesignId
      ? (DESIGN_SUGGESTIONS[locale as keyof typeof DESIGN_SUGGESTIONS] ?? DESIGN_SUGGESTIONS.en)
      : (SUGGESTIONS[locale as keyof typeof SUGGESTIONS] ?? SUGGESTIONS.en);

  useEffect(() => {
    setConversations(loadConversations());
    setGalleryItems(loadGallery());
  }, []);

  const messages: UiMessage[] = useMemo(() => {
    const base: UiMessage[] = active.messages.map((m) => ({ role: m.role, content: m.content }));
    if (pending) base.push({ role: "assistant", content: "", pending: true });
    return base;
  }, [active.messages, pending]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, pending]);

  function newChat() {
    setActive(createConversation());
    setHistoryOpen(false);
    setInput("");
  }

  function openConversation(c: Conversation) {
    setActive(c);
    setHistoryOpen(false);
  }

  function removeConversation(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    const next = deleteConversation(id);
    setConversations(next);
    if (id === active.id) setActive(createConversation());
  }

  function linkDesign(item: GalleryItem) {
    setLinkedDesignId(item.id);
    setLinkedStyle(item.style);
    setDesignPickerOpen(false);
  }

  function unlinkDesign() {
    setLinkedDesignId(null);
    setLinkedStyle(null);
  }

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const now = Date.now();
    const history = active.messages.map((m) => ({ role: m.role, content: m.content }));
    const conv: Conversation = {
      ...active,
      title: active.title || titleFrom(trimmed),
      messages: [...active.messages, { role: "user", content: trimmed }],
      updatedAt: now,
    };

    setActive(conv);
    setInput("");
    setLoading(true);
    setPending(true);

    try {
      const result = await sendChat(
        trimmed,
        history,
        buildChatContext({
          designId: linkedDesignId ?? undefined,
          style: linkedStyle ?? undefined,
        }),
      );
      finish(conv, result.reply);
    } catch {
      finish(
        conv,
        locale === "ru"
          ? "Извините, не удалось получить ответ. Попробуйте ещё раз."
          : "Sorry, couldn't get a response. Please try again.",
      );
    }
  }

  function finish(conv: Conversation, reply: string) {
    const updated: Conversation = {
      ...conv,
      messages: [...conv.messages, { role: "assistant", content: reply }],
      updatedAt: Date.now(),
    };
    setActive(updated);
    setConversations(saveConversation(updated));
    setPending(false);
    setLoading(false);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  }

  const linkedItem = linkedDesignId
    ? galleryItems.find((g) => g.id === linkedDesignId)
    : null;

  return (
    <AppShell noPadding>
      <div className="flex h-[calc(100dvh-4rem-5rem)] flex-col">

        {/* Chat header */}
        <div className="flex items-center gap-2 border-b border-border px-5 py-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold tracking-tight">{dict.chat.title}</h1>
            <p className="mt-0.5 text-sm text-muted">{dict.chat.subtitle}</p>
          </div>
          <button
            onClick={newChat}
            aria-label={dict.chat.newChat}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted transition hover:border-coral hover:text-coral"
          >
            <Plus size={18} />
          </button>
          <button
            onClick={() => setHistoryOpen(true)}
            aria-label={dict.chat.historyTitle}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted transition hover:border-coral hover:text-coral"
          >
            <History size={18} />
          </button>
        </div>

        {/* Linked design banner */}
        {linkedDesignId && (
          <div className="flex items-center gap-3 border-b border-coral/20 bg-coral/5 px-4 py-2.5">
            {linkedItem ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={linkedItem.resultUrl}
                alt=""
                className="h-10 w-10 flex-shrink-0 rounded-xl object-cover ring-1 ring-coral/30"
              />
            ) : (
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-coral/10">
                <ImageIcon size={16} className="text-coral" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-coral">{dict.chat.linkedDesignLabel}</p>
              <p className="truncate text-[11px] text-muted">{styleLabel(linkedStyle ?? "")}</p>
            </div>
            <button
              onClick={unlinkDesign}
              aria-label="Remove link"
              className="flex-shrink-0 text-muted transition hover:text-coral"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {messages.length === 0 && (
            <div className="flex flex-col items-center pt-6 pb-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-coral/10 mb-4">
                <Sparkles className="text-coral" size={28} />
              </div>
              <p className="text-center text-sm font-semibold">
                {linkedDesignId
                  ? (locale === "ru" ? "Спросите AI об этом дизайне" : "Ask AI about this design")
                  : (locale === "ru" ? "Спросите AI о дизайне вашей комнаты" : "Ask AI about your room design")
                }
              </p>
              <p className="text-center text-xs text-muted mt-1">
                {locale === "ru" ? "Советы по стилю, бюджету и ремонту" : "Tips on style, budget and renovation"}
              </p>

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
              <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${
                msg.role === "user" ? "bg-coral" : "bg-foreground/10"
              }`}>
                {msg.role === "user"
                  ? <User size={16} className="text-white" />
                  : <Sparkles size={16} className="text-coral" />
                }
              </div>

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
                ) : msg.role === "assistant" ? (
                  <Markdown content={msg.content} />
                ) : (
                  msg.content
                )}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Design picker panel */}
        {designPickerOpen && (
          <div className="border-t border-border bg-background px-4 py-3">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-xs font-semibold text-muted">
                {dict.chat.linkDesign}
              </p>
              <button onClick={() => setDesignPickerOpen(false)}>
                <X size={15} className="text-muted" />
              </button>
            </div>
            {galleryItems.length === 0 ? (
              <p className="py-2 text-xs text-muted">{dict.chat.noDesigns}</p>
            ) : (
              <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
                {galleryItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => linkDesign(item)}
                    className={`flex-shrink-0 overflow-hidden rounded-2xl ring-2 transition ${
                      linkedDesignId === item.id ? "ring-coral" : "ring-transparent hover:ring-coral/40"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.resultUrl}
                      alt={styleLabel(item.style)}
                      className="h-16 w-16 object-cover"
                    />
                    <p className="pb-1 text-center text-[10px] text-muted">{styleLabel(item.style)}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Input */}
        <div className="border-t border-border bg-background px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <div className="flex items-end gap-2 rounded-3xl border border-border bg-card/50 px-3 py-2 focus-within:border-coral transition">
            {/* Attach design button */}
            <button
              onClick={() => setDesignPickerOpen((p) => !p)}
              aria-label={dict.chat.linkDesign}
              className={`mb-1 flex-shrink-0 transition ${
                linkedDesignId ? "text-coral" : "text-muted hover:text-coral"
              }`}
            >
              <ImageIcon size={18} />
            </button>

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

      {/* History panel */}
      {historyOpen && (
        <div className="fixed inset-0 z-40 mx-auto w-full max-w-md">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setHistoryOpen(false)}
          />
          <div className="absolute right-0 top-0 flex h-full w-72 flex-col border-l border-border bg-background shadow-xl">
            <div className="flex items-center justify-between border-b border-border px-4 py-4">
              <span className="text-sm font-bold">{dict.chat.historyTitle}</span>
              <button onClick={() => setHistoryOpen(false)} aria-label="Close" className="text-muted transition hover:text-foreground">
                <X size={18} />
              </button>
            </div>

            <button
              onClick={newChat}
              className="flex items-center gap-2 border-b border-border px-4 py-3 text-sm font-semibold text-coral transition hover:bg-coral/5"
            >
              <Plus size={16} /> {dict.chat.newChat}
            </button>

            <div className="flex-1 overflow-y-auto">
              {conversations.length === 0 ? (
                <p className="px-4 py-6 text-center text-xs text-muted">{dict.chat.noHistory}</p>
              ) : (
                conversations.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => openConversation(c)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && openConversation(c)}
                    className={`group flex cursor-pointer items-center gap-2 border-b border-border px-4 py-3 transition hover:bg-card/60 ${
                      c.id === active.id ? "bg-coral/5" : ""
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{c.title || "—"}</p>
                      <p className="mt-0.5 text-[11px] text-muted">{formatDate(c.updatedAt, locale)}</p>
                    </div>
                    <button
                      onClick={(e) => removeConversation(c.id, e)}
                      aria-label="Delete"
                      className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-muted opacity-0 transition group-hover:opacity-100 hover:bg-red-500 hover:text-white"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
