"use client";

const DAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

// June 2026 starts on Monday (index 1)
const JUNE_START_DAY = 1;
const JUNE_DAYS = 30;
const TODAY = 3;
const EVENT_DAYS = new Set([10, 14, 16, 17, 18, 19, 20, 25]);

export default function MiniCalendar() {
  const cells: (number | null)[] = [
    ...Array(JUNE_START_DAY).fill(null),
    ...Array.from({ length: JUNE_DAYS }, (_, i) => i + 1),
  ];

  return (
    <div className="bg-white dark:bg-[#1a1a18] border border-gray-200 dark:border-white/10 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
          </svg>
          June 2026
        </h2>
        <div className="flex items-center gap-3 text-[10px] text-gray-400 dark:text-gray-500">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#378ADD] inline-block" />
            Today
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-blue-100 inline-block" />
            Event
          </span>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-0.5">
        {DAY_LABELS.map((d) => (
          <div key={d} className="text-center text-[10px] font-medium text-gray-400 dark:text-gray-500 py-1">
            {d}
          </div>
        ))}
        {cells.map((day, i) => {
          if (day === null) return <div key={`empty-${i}`} />;
          const isToday = day === TODAY;
          const isEvent = EVENT_DAYS.has(day);
          const isPast = day < TODAY;
          return (
            <div
              key={day}
              className={`
                text-center text-[11px] py-1.5 rounded-md font-medium transition-colors
                ${isToday ? "bg-[#378ADD] text-white" : ""}
                ${isEvent && !isToday ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" : ""}
                ${!isToday && !isEvent ? (isPast ? "text-gray-300 dark:text-gray-600" : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 cursor-default") : ""}
              `}
            >
              {day}
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-gray-100 dark:border-white/10">
        <p className="text-[11px] text-gray-400 dark:text-gray-500">
          Finals week: <span className="text-gray-600 dark:text-gray-300 font-medium">Jun 16–20</span>
          &nbsp;·&nbsp;
          Parent conf: <span className="text-gray-600 dark:text-gray-300 font-medium">Jun 14</span>
        </p>
      </div>
    </div>
  );
}
