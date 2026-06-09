import { getStoredStyle } from "./useSelectedStyle";
import { loadGallery } from "./gallery";

const BUDGET_KEY = "roomi.budget";

export function buildChatContext(opts?: { designId?: string; style?: string }): string | undefined {
  if (typeof window === "undefined") return undefined;

  const style = opts?.style ?? getStoredStyle().id;
  const budget = window.localStorage.getItem(BUDGET_KEY);

  const parts: string[] = [];
  if (style) parts.push(`Style: ${style}.`);
  if (budget) parts.push(`Budget: ${budget}.`);

  if (opts?.designId) {
    parts.push(`The user is discussing a specific room redesign (ID: ${opts.designId}, style: ${style}). Focus your advice on this design.`);
  } else {
    const lastDesign = loadGallery()[0]?.id;
    if (lastDesign) parts.push(`Last design: ${lastDesign}.`);
  }

  return parts.length ? parts.join(" ") : undefined;
}
