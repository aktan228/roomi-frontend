export type ChatRole = "user" | "assistant";

export type ChatMessage = { role: ChatRole; content: string };

export type Conversation = {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
};

const KEY = "roomi.chats";
const MAX_ITEMS = 30;

export function loadConversations(): Conversation[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Conversation[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function persist(list: Conversation[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(list.slice(0, MAX_ITEMS)));
}

export function saveConversation(conv: Conversation): Conversation[] {
  const list = loadConversations().filter((c) => c.id !== conv.id);
  const next = [conv, ...list].sort((a, b) => b.updatedAt - a.updatedAt);
  persist(next);
  return next;
}

export function deleteConversation(id: string): Conversation[] {
  const next = loadConversations().filter((c) => c.id !== id);
  persist(next);
  return next;
}

export function createConversation(): Conversation {
  const now = Date.now();
  return {
    id: Math.random().toString(36).slice(2, 10),
    title: "",
    messages: [],
    createdAt: now,
    updatedAt: now,
  };
}

export function titleFrom(firstUserMessage: string): string {
  const trimmed = firstUserMessage.trim().replace(/\s+/g, " ");
  return trimmed.length > 40 ? trimmed.slice(0, 40) + "…" : trimmed;
}
