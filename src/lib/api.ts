const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

// ── Types ─────────────────────────────────────────

export interface RoomObject {
  label: string;
  confidence: number;
  bbox: [number, number, number, number];
  area_ratio: number;
  suggestion: "keep" | "replace" | "remove";
}

export interface RoomAnalysis {
  room_type: string;
  est_area_m2: number;
  ceiling_height_m: number;
  objects: RoomObject[];
  surfaces: { wall_m2: number; floor_m2: number; ceiling_m2: number };
  palette: string[];
  lighting: string;
  is_stub: boolean;
}

export interface RedesignResult {
  design_id: string;
  original_url: string;
  result_url: string;
  style: string;
  is_mock: boolean;
  analysis?: RoomAnalysis;
  products?: ProductsResult;
  plan?: PlanResult;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  currency: string;
  image: string;
  shop: string;
  url: string;
  priority: number;
}

export interface ProductsResult {
  style: string;
  budget: number | null;
  products: Product[];
  total_price: number;
  currency: string;
  is_mock: boolean;
}

export interface PlanWeek {
  week: number;
  title: string;
  tasks: string[];
  estimated_cost: number;
  currency: string;
  icon: string;
}

export interface PlanResult {
  design_id: string;
  total_weeks: number;
  total_cost: number;
  currency: string;
  weeks: PlanWeek[];
  is_mock: boolean;
}

export interface ChatResult {
  reply: string;
  is_mock: boolean;
}

// ── API calls ─────────────────────────────────────

/** Returns a job_id immediately; poll /api/redesign/job/:id for progress. */
export async function startRedesign(
  file: File,
  style: string,
  roomType = "bedroom",
  budget?: number,
  description?: string,
): Promise<{ job_id: string } | null> {
  const form = new FormData();
  form.append("file", file);
  form.append("style", style);
  form.append("room_type", roomType);
  if (budget) form.append("budget", String(budget));
  if (description) form.append("preferences", description);

  try {
    const res = await fetch(`${BASE}/api/redesign`, { method: "POST", body: form });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function getProducts(
  style: string,
  budget?: number,
): Promise<ProductsResult> {
  const params = new URLSearchParams({ style });
  if (budget) params.set("budget", String(budget));

  const res = await fetch(`${BASE}/api/products?${params}`);
  if (!res.ok) throw new Error("Failed to load products");
  return res.json();
}

export async function getPlan(designId: string): Promise<PlanResult> {
  const res = await fetch(`${BASE}/api/plan/${designId}`);
  if (!res.ok) throw new Error("Failed to load plan");
  return res.json();
}

export async function sendChat(
  message: string,
  history: { role: string; content: string }[] = [],
  context?: string,
): Promise<ChatResult> {
  const res = await fetch(`${BASE}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, history, context }),
  });
  if (!res.ok) throw new Error("Chat failed");
  return res.json();
}
