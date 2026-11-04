"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { DEMO_TODAY } from "@/lib/data";
import { fmtDayLong, fmtMonth, monthGrid, parseDay } from "@/lib/dates";

const letters = ["L", "M", "M", "J", "V", "S", "D"];

export function MiniCalendar({
  month,
  setMonth,
  selected,
  counts,
  onPick,
}: {
  month: string; // « YYYY-MM »
  setMonth: (m: string) => void;
  selected: string[];
  counts: Record<string, number>;
  onPick: (day: string) => void;
}) {
  const shift = (n: number) => {
    const d = parseDay(`${month}-01`);
    d.setMonth(d.getMonth() + n);
    setMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
  };
  const days = monthGrid(month);

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <button
          type="button"
          onClick={() => shift(-1)}
          className="flex h-8 w-8 items-center justify-center rounded-full text-muted hover:bg-sage-soft hover:text-sage"
          aria-label="Mois précédent"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden />
        </button>
        <p className="font-display font-bold first-letter:uppercase">{fmtMonth.format(parseDay(`${month}-01`))}</p>
        <button
          type="button"
          onClick={() => shift(1)}
          className="flex h-8 w-8 items-center justify-center rounded-full text-muted hover:bg-sage-soft hover:text-sage"
          aria-label="Mois suivant"
        >
          <ChevronRight className="h-4 w-4" aria-hidden />
        </button>
      </div>
      <div className="grid grid-cols-7 text-center text-xs">
        {letters.map((l, i) => (
          <span key={i} className="pb-1 font-semibold text-muted" aria-hidden>
            {l}
          </span>
        ))}
        {days.map((day) => {
          const inMonth = day.startsWith(month);
          const isToday = day === DEMO_TODAY;
          const isSelected = selected.includes(day);
          const n = counts[day] ?? 0;
          return (
            <button
              key={day}
              type="button"
              onClick={() => onPick(day)}
              aria-label={`${fmtDayLong.format(parseDay(day))}, ${n} rendez-vous`}
              aria-current={isToday ? "date" : undefined}
              className={`relative mx-auto my-0.5 flex h-8 w-8 items-center justify-center rounded-full text-sm transition ${
                isToday
                  ? "bg-sage font-bold text-on-sage"
                  : isSelected
                    ? "bg-sage-soft font-semibold text-sage"
                    : inMonth
                      ? "text-ink hover:bg-sage-soft/60"
                      : "text-muted/50 hover:bg-sage-soft/60"
              }`}
            >
              {Number(day.slice(8))}
              {n > 0 && !isToday && (
                <span className="absolute bottom-0.5 h-1 w-1 rounded-full bg-honey" aria-hidden />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
