"use client";

import { useEffect, useState } from "react";

const grades = [
  { label: "Grade 7",  count: 198, max: 250, color: "#378ADD" },
  { label: "Grade 8",  count: 215, max: 250, color: "#185FA5" },
  { label: "Grade 9",  count: 234, max: 250, color: "#1D9E75" },
  { label: "Grade 10", count: 221, max: 250, color: "#0F6E56" },
  { label: "Grade 11", count: 207, max: 250, color: "#BA7517" },
  { label: "Grade 12", count: 209, max: 250, color: "#D85A30" },
];

const total = grades.reduce((s, g) => s + g.count, 0);

export default function EnrollmentChart() {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 120);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="bg-white dark:bg-[#1a1a18] border border-gray-200 dark:border-white/10 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
          </svg>
          Enrollment by grade
        </h2>
        <span className="text-xs text-gray-400 dark:text-gray-500">
          {total.toLocaleString()} total
        </span>
      </div>

      <div className="flex flex-col gap-2.5">
        {grades.map((g) => (
          <div key={g.label} className="flex items-center gap-3">
            <span className="text-xs text-gray-500 dark:text-gray-400 w-20 flex-shrink-0">
              {g.label}
            </span>
            <div className="flex-1 h-2 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{
                  width: animated ? `${Math.round((g.count / g.max) * 100)}%` : "0%",
                  background: g.color,
                }}
              />
            </div>
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300 w-8 text-right tabular-nums">
              {g.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
