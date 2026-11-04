import type { AppointmentType } from "@/lib/data";

// Couleur par motif, uniquement avec les tokens de la charte (mode sombre compris).
export const typeTone: Record<AppointmentType, { block: string; swatch: string; header: string }> = {
  Séance: {
    block: "bg-sage-soft text-ink border-l-sage",
    swatch: "bg-sage",
    header: "bg-sage text-on-sage",
  },
  Bilan: {
    block: "bg-honey-soft text-ink border-l-honey",
    swatch: "bg-honey",
    header: "bg-honey text-on-honey",
  },
  "Point parent": {
    block: "bg-surface text-ink border-l-muted",
    swatch: "bg-muted",
    header: "bg-ink text-bg",
  },
};

export const HOUR_START = 8;
export const HOUR_END = 19;
export const HOUR_PX = 96;
