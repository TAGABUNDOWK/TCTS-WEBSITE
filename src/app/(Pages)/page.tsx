import HeroBanner from "@/components/HeroBanner";
import AnnouncementPanel from "@/components/AnnouncementPanel";
import EnrollmentChart from "@/components/EnrollmentChart";
import MiniCalendar from "@/components/MiniCalendar";

const stats = [
  {
    label: "Total students",
    value: "1,284",
    delta: "↑ 4.2% vs last year",
    deltaPositive: true,
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
      </svg>
    ),
  },
  {
    label: "Faculty",
    value: "68",
    delta: "↑ 3 new hires",
    deltaPositive: true,
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
      </svg>
    ),
  },
  {
    label: "Days to finals",
    value: "12",
    delta: "Starting Jun 16",
    deltaPositive: false,
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
      </svg>
    ),
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f4f2ed] dark:bg-[#111110] font-[family-name:var(--font-dm)]">
      <main className="max-w-3xl mx-auto px-4 py-10 flex flex-col gap-5">

        {/* Hero */}
        <HeroBanner />

        {/* Stat cards */}
        <div className="grid grid-cols-3 gap-3">
          {stats.map((s) => (
            <div
              key={s.label}
              className="bg-[#eae8e2] dark:bg-[#1a1a18] rounded-2xl p-4 flex flex-col gap-1"
            >
              <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                {s.icon}
                {s.label}
              </div>
              <div
                className="text-2xl font-semibold text-gray-900 dark:text-gray-100 tabular-nums"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {s.value}
              </div>
              <div
                className={`text-xs ${
                  s.deltaPositive
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-red-500 dark:text-red-400"
                }`}
              >
                {s.delta}
              </div>
            </div>
          ))}
        </div>

        {/* Announcements + Enrollment */}
        <div className="grid grid-cols-2 gap-4">
          <AnnouncementPanel />
          <EnrollmentChart />
        </div>

        {/* Calendar full width */}
        <MiniCalendar />

        {/* Footer */}
        <div className="flex items-center justify-between pt-1 border-t border-gray-300/60 dark:border-white/10">
          <p className="text-[11px] text-gray-400 dark:text-gray-500">
            Last updated: Jun 3, 2026, 8:00 AM
          </p>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-gray-400 dark:text-gray-500">Staff online</span>
            <div className="flex">
              {["MR", "JL", "SA", "+5"].map((initials, i) => (
                <div
                  key={initials}
                  className="w-6 h-6 rounded-full border-2 border-[#f4f2ed] dark:border-[#111110] flex items-center justify-center text-[9px] font-semibold"
                  style={{
                    marginLeft: i === 0 ? 0 : "-6px",
                    background: ["#185FA5", "#3B6D11", "#993C1D", "#3a3a38"][i],
                    color: ["#B5D4F4", "#C0DD97", "#F5C4B3", "#aaa"][i],
                    zIndex: 4 - i,
                  }}
                >
                  {initials}
                </div>
              ))}
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
