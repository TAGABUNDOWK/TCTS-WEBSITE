"use client";

import { useState } from "react";

type Tag = "new" | "urgent" | "info";

interface Announcement {
  id: number;
  title: string;
  body: string;
  date: string;
  tag: Tag;
  pinned: boolean;
}

const announcements: Announcement[] = [
  {
    id: 1,
    title: "Final exam schedule released",
    body: "Download the full timetable from the portal. Room assignments posted by Jun 10.",
    date: "Jun 3",
    tag: "new",
    pinned: true,
  },
  {
    id: 2,
    title: "Science fair submissions due",
    body: "All project abstracts must be submitted online by June 7, 5 PM.",
    date: "Jun 2",
    tag: "urgent",
    pinned: false,
  },
  {
    id: 3,
    title: "Library hours extended",
    body: "Library will remain open until 9 PM weekdays through June 20.",
    date: "Jun 1",
    tag: "info",
    pinned: false,
  },
  {
    id: 4,
    title: "Parent-teacher conference",
    body: "Booking slots now open for June 14. Reserve via the school app.",
    date: "May 30",
    tag: "new",
    pinned: false,
  },
];

const tagStyles: Record<Tag, string> = {
  new: "bg-blue-50 text-blue-700 border border-blue-200",
  urgent: "bg-red-50 text-red-700 border border-red-200",
  info: "bg-gray-100 text-gray-600 border border-gray-200",
};

export default function AnnouncementPanel() {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div className="bg-white dark:bg-[#1a1a18] border border-gray-200 dark:border-white/10 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
          </svg>
          Announcements
        </h2>
        <span className="text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200 rounded-full px-2.5 py-0.5">
          3 new
        </span>
      </div>

      <ul className="flex flex-col gap-2.5">
        {announcements.map((a) => (
          <li
            key={a.id}
            onClick={() => setExpanded(expanded === a.id ? null : a.id)}
            className={`
              rounded-xl border px-3.5 py-3 cursor-pointer transition-all duration-200
              hover:bg-gray-50 dark:hover:bg-white/5
              ${a.pinned
                ? "border-l-2 border-l-blue-500 border-t-gray-200 border-r-gray-200 border-b-gray-200 dark:border-t-white/10 dark:border-r-white/10 dark:border-b-white/10 rounded-l-none"
                : "border-gray-200 dark:border-white/10"
              }
            `}
          >
            <div className="flex items-start justify-between gap-2">
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100 leading-snug">
                {a.title}
              </span>
              <span className={`text-[10px] font-semibold uppercase tracking-wide rounded-full px-2 py-0.5 flex-shrink-0 ${tagStyles[a.tag]}`}>
                {a.tag}
              </span>
            </div>

            {expanded === a.id && (
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                {a.body}
              </p>
            )}

            <p className="mt-1 text-[11px] text-gray-400 dark:text-gray-500">{a.date}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
