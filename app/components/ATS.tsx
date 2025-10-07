import React from "react";

interface Suggestion {
  type: "good" | "improve";
  tip: string;
}

interface ATSProps {
  score: number;
  suggestions: Suggestion[];
}

const ATS: React.FC<ATSProps> = ({ score, suggestions }) => {
  // Determine glow color based on score
  const glowColor =
    score > 69
      ? "green"
      : score > 49
      ? "yellow"
      : "red";

  const gradientClass =
    score > 69
      ? "from-[#00ff9d30] via-[#00ff9d10] to-[#00ff9d05]"
      : score > 49
      ? "from-[#ffe16830] via-[#ffe16810] to-[#ffe16805]"
      : "from-[#ff4d4d30] via-[#ff4d4d10] to-[#ff4d4d05]";

  const subtitle =
    score > 69 ? "Outstanding Performance!" : score > 49 ? "Decent Start" : "Needs Work";

  const iconSrc =
    score > 69
      ? "/icons/ats-good.svg"
      : score > 49
      ? "/icons/ats-warning.svg"
      : "/icons/ats-bad.svg";

  return (
    <div
      className={`
        relative w-full overflow-hidden rounded-2xl 
        bg-gradient-to-b ${gradientClass} 
        border border-[#1a1a1a] backdrop-blur-xl 
        p-6 sm:p-8 md:p-10 
        shadow-[0_0_25px_${glowColor === "green"
          ? "#00ff9d25"
          : glowColor === "yellow"
          ? "#ffe16825"
          : "#ff4d4d25"}]
        transition-all duration-500 ease-in-out transform
        hover:scale-[1.02] hover:shadow-[0_0_35px_${glowColor === "green"
          ? "#00ff9d45"
          : glowColor === "yellow"
          ? "#ffe16845"
          : "#ff4d4d45"}]
      `}
    >
      {/* Glowing pulse background */}
      <div
        className={`absolute inset-0 bg-gradient-to-b ${gradientClass} blur-3xl opacity-40 animate-pulse`}
      ></div>

      {/* Top section */}
      <div className="relative flex items-center gap-4 mb-6 sm:mb-8 z-10">
        <img
          src={iconSrc}
          alt="ATS Icon"
          className="w-12 h-12 sm:w-14 sm:h-14 drop-shadow-[0_0_10px_rgba(0,255,157,0.4)]"
        />
        <div>
          <h2
            className={`text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-wide`}
          >
            ATS Score -{" "}
            <span
              className={`${
                glowColor === "green"
                  ? "text-[#00ff9d]"
                  : glowColor === "yellow"
                  ? "text-[#ffe168]"
                  : "text-[#ff4d4d]"
              }`}
            >
              {score}/100
            </span>
          </h2>
        </div>
      </div>

      {/* Description section */}
      <div className="relative mb-6 sm:mb-8 z-10">
        <h3
          className={`text-lg sm:text-xl md:text-2xl font-semibold mb-2 ${
            glowColor === "green"
              ? "text-[#00ff9d]"
              : glowColor === "yellow"
              ? "text-[#ffe168]"
              : "text-[#ff4d4d]"
          }`}
        >
          {subtitle}
        </h3>

        <p className="text-gray-400 text-sm sm:text-base leading-relaxed mb-4">
          This score reflects how well your resume can pass through Applicant
          Tracking Systems. A higher score increases your visibility with
          recruiters.
        </p>

        {/* Suggestions */}
        <div className="space-y-3">
          {suggestions.map((s, i) => (
            <div
              key={i}
              className="flex items-start gap-3 text-sm sm:text-base group"
            >
              <img
                src={
                  s.type === "good"
                    ? "/icons/check.svg"
                    : "/icons/warning.svg"
                }
                alt={s.type === "good" ? "Check" : "Warning"}
                className={`w-5 h-5 mt-1 ${
                  s.type === "good"
                    ? "drop-shadow-[0_0_10px_#00ff9d70]"
                    : "drop-shadow-[0_0_10px_#ffae0070]"
                } transition-all group-hover:scale-110`}
              />
              <p
                className={`${
                  s.type === "good"
                    ? "text-[#00ff9d]"
                    : "text-[#ffae00]"
                } transition-colors duration-300`}
              >
                {s.tip}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Closing line */}
      <p className="text-gray-500 italic text-xs sm:text-sm md:text-base">
        Keep refining your resume to boost your ATS compatibility and land more
        interviews.
      </p>
    </div>
  );
};

export default ATS;
