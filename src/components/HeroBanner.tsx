"use client";

export default function HeroBanner() {
  return (
    <div className="relative rounded-2xl overflow-hidden h-52 bg-[#0C447C] flex items-end">
      {/* SVG school illustration */}
      <svg
        className="absolute inset-0 w-full h-full opacity-35"
        viewBox="0 0 700 210"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <rect width="700" height="210" fill="#0C447C" />
        {/* Left building */}
        <rect x="30" y="70" width="130" height="140" fill="#185FA5" rx="4" />
        <rect x="42" y="82" width="42" height="52" fill="#378ADD" rx="2" opacity="0.6" />
        <rect x="96" y="82" width="42" height="52" fill="#378ADD" rx="2" opacity="0.6" />
        <rect x="42" y="144" width="42" height="52" fill="#378ADD" rx="2" opacity="0.6" />
        <rect x="96" y="144" width="42" height="52" fill="#378ADD" rx="2" opacity="0.6" />
        {/* Center main building */}
        <rect x="170" y="40" width="180" height="170" fill="#0C447C" rx="4" />
        {/* Flag pole */}
        <rect x="256" y="20" width="8" height="28" fill="#185FA5" />
        <rect x="256" y="20" width="28" height="16" fill="#378ADD" opacity="0.9" />
        {/* Windows center */}
        <rect x="183" y="58" width="34" height="42" fill="#185FA5" rx="2" opacity="0.7" />
        <rect x="228" y="58" width="34" height="42" fill="#185FA5" rx="2" opacity="0.7" />
        <rect x="273" y="58" width="34" height="42" fill="#185FA5" rx="2" opacity="0.7" />
        <rect x="183" y="112" width="34" height="42" fill="#185FA5" rx="2" opacity="0.7" />
        <rect x="228" y="112" width="34" height="42" fill="#185FA5" rx="2" opacity="0.7" />
        <rect x="273" y="112" width="34" height="42" fill="#185FA5" rx="2" opacity="0.7" />
        {/* Door */}
        <rect x="222" y="162" width="76" height="48" fill="#378ADD" rx="2" opacity="0.5" />
        {/* Right section */}
        <rect x="360" y="90" width="110" height="120" fill="#185FA5" rx="4" />
        <rect x="373" y="104" width="36" height="36" fill="#378ADD" rx="2" opacity="0.55" />
        <rect x="421" y="104" width="36" height="36" fill="#378ADD" rx="2" opacity="0.55" />
        <rect x="373" y="150" width="84" height="60" fill="#378ADD" rx="2" opacity="0.4" />
        {/* Far right building */}
        <rect x="480" y="74" width="110" height="136" fill="#185FA5" rx="4" />
        <rect x="493" y="88" width="34" height="38" fill="#378ADD" rx="2" opacity="0.6" />
        <rect x="540" y="88" width="34" height="38" fill="#378ADD" rx="2" opacity="0.6" />
        <rect x="493" y="136" width="34" height="38" fill="#378ADD" rx="2" opacity="0.6" />
        <rect x="540" y="136" width="34" height="38" fill="#378ADD" rx="2" opacity="0.6" />
        {/* Ground line */}
        <rect x="0" y="202" width="700" height="8" fill="#0C447C" />
        <rect x="0" y="197" width="700" height="5" fill="#0F6E56" opacity="0.5" />
        {/* Trees */}
        <ellipse cx="155" cy="196" rx="14" ry="9" fill="#1D9E75" opacity="0.6" />
        <ellipse cx="350" cy="198" rx="18" ry="10" fill="#1D9E75" opacity="0.5" />
        <ellipse cx="470" cy="195" rx="12" ry="8" fill="#1D9E75" opacity="0.6" />
        <ellipse cx="630" cy="197" rx="16" ry="9" fill="#1D9E75" opacity="0.5" />
      </svg>

      {/* Content overlay */}
      <div className="relative z-10 p-6 w-full">
        <div className="inline-flex items-center gap-2 bg-white/15 border border-white/30 rounded-full px-3 py-1 text-xs text-white mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
          Academic Year 2025–2026
        </div>
        <h1
          className="text-3xl font-semibold text-white leading-tight"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Maplewood Academy
        </h1>
        <p className="text-sm text-white/70 mt-0.5">
          Excellence in Education · Est. 1987
        </p>
      </div>
    </div>
  );
}
