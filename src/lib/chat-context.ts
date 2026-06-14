import { getStoredStyle } from "./useSelectedStyle";
import { loadGallery } from "./gallery";

const BUDGET_KEY = "roomi.budget";

/** Pulls the full redesign result (analysis + plan) the design page stored. */
function readStoredDesign(designId: string): Record<string, unknown> | null {
  try {
    const raw = sessionStorage.getItem(`design_${designId}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function buildChatContext(opts?: { designId?: string; style?: string }): string | undefined {
  if (typeof window === "undefined") return undefined;

  const style = opts?.style ?? getStoredStyle().id;
  const budget = window.localStorage.getItem(BUDGET_KEY);

  const parts: string[] = [];
  if (style) parts.push(`Style: ${style}.`);
  if (budget) parts.push(`Budget: ${budget}.`);

  if (opts?.designId) {
    const stored = readStoredDesign(opts.designId);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const a = stored?.analysis as any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const p = stored?.plan as any;

    if (a || p) {
      const bits: string[] = [`The user is discussing a specific room redesign (style: ${style}).`];
      if (a) {
        bits.push(`Room: ${a.room_type}, about ${a.est_area_m2} m² with a ${a.ceiling_height_m} m ceiling.`);
        if (a.surfaces?.wall_m2) bits.push(`Wall area: ~${a.surfaces.wall_m2} m².`);
        if (Array.isArray(a.objects) && a.objects.length) {
          bits.push(`Detected in the room: ${a.objects.map((o: { label: string }) => o.label).join(", ")}.`);
        }
        if (Array.isArray(a.palette) && a.palette.length) {
          bits.push(`Current colour palette: ${a.palette.join(", ")}.`);
        }
      }
      if (p && Array.isArray(p.weeks) && p.weeks.length) {
        const phases = p.weeks.map((w: { title: string }) => w.title).join(" → ");
        bits.push(`Renovation plan phases: ${phases}; estimated total ${p.total_cost} ${p.currency}.`);
      }
      bits.push("Base your advice specifically on THIS room, its measurements and this plan.");
      parts.push(bits.join(" "));
    } else {
      parts.push(`The user is discussing a specific room redesign (ID: ${opts.designId}, style: ${style}). Focus your advice on this design.`);
    }
  } else {
    const lastDesign = loadGallery()[0]?.id;
    if (lastDesign) parts.push(`Last design: ${lastDesign}.`);
  }

  return parts.length ? parts.join(" ") : undefined;
}
