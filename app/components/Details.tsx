"use client";
import React from "react";

// Add custom scrollbar styles
const scrollbarStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: var(--scrollbar-width);
  }

  .custom-scrollbar::-webkit-scrollbar-track {
    background: var(--scrollbar-track-color);
    border-radius: 8px;
    box-shadow: inset 0 0 6px rgba(0, 255, 136, 0.1);
  }

  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: var(--scrollbar-thumb-color);
    border-radius: 8px;
    box-shadow: 0 0 8px rgba(0, 255, 136, 0.3);
    transition: all 0.3s ease;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: var(--scrollbar-thumb-hover-color);
    box-shadow: 0 0 12px rgba(0, 255, 136, 0.5);
  }

  @keyframes glowPulse {
    0% { box-shadow: 0 0 8px rgba(0, 255, 136, 0.3); }
    50% { box-shadow: 0 0 12px rgba(0, 255, 136, 0.5); }
    100% { box-shadow: 0 0 8px rgba(0, 255, 136, 0.3); }
  }

  .custom-scrollbar::-webkit-scrollbar-thumb:active {
    background: rgba(0, 255, 136, 0.6);
    animation: glowPulse 1.5s infinite;
  }
`;

// Add style tag to head
if (typeof document !== 'undefined') {
  const styleTag = document.createElement('style');
  styleTag.textContent = scrollbarStyles;
  document.head.appendChild(styleTag);
}
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "~/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
} from "./Accordion";

interface Tip {
  type: "good" | "improve";
  tip: string;
  explanation: string;
}

interface Category {
  score: number;
  tips: Tip[];
}

interface Feedback {
  toneAndStyle: Category;
  content: Category;
  structure: Category;
  skills: Category;
}

const NeonIcon = ({ type }: { type: "good" | "improve" }) => (
  <motion.svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    className="drop-shadow-[0_0_8px_rgba(0,255,0,0.8)]"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
  >
    {type === "good" ? (
      <path
        d="M5 13l4 4L19 7"
        stroke="#00ff88"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ) : (
      <path
        d="M12 8v4m0 4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
        stroke="#ffcc00"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    )}
  </motion.svg>
);

const ScoreBadge = ({ score }: { score: number }) => {
  const color =
    score > 69 ? "#00ff88" : score > 39 ? "#ffcc00" : "#ff5555";

  return (
    <motion.div
      whileHover={{ scale: 1.08, boxShadow: `0 0 12px ${color}` }}
      className="flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-black/50 text-white backdrop-blur-md"
      style={{ color }}
    >
      <NeonIcon type={score > 69 ? "good" : "improve"} />
      <p className="text-sm font-semibold">{score}/100</p>
    </motion.div>
  );
};

const CategoryHeader = ({
  title,
  categoryScore,
}: {
  title: string;
  categoryScore: number;
}) => (
  <div className="flex flex-row flex-wrap gap-3 items-center py-3">
    <p className="text-xl md:text-2xl font-semibold text-white">{title}</p>
    <ScoreBadge score={categoryScore} />
  </div>
);

const CategoryContent = ({ tips }: { tips: Tip[] }) => (
  <div className="flex flex-col gap-6 w-full">
    <div 
      className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-h-[400px] overflow-y-auto pr-2 custom-scrollbar"
      style={{
        scrollbarWidth: 'thin',
        scrollbarColor: 'rgba(0, 255, 136, 0.3) rgba(0, 255, 136, 0.05)',
        // @ts-ignore
        '--scrollbar-width': '6px',
        '--scrollbar-track-color': 'rgba(0, 255, 136, 0.05)',
        '--scrollbar-thumb-color': 'rgba(0, 255, 136, 0.3)',
        '--scrollbar-thumb-hover-color': 'rgba(0, 255, 136, 0.5)'
      }}>
      {tips.map((tip, index) => (
        <motion.div
          key={index}
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 120 }}
          className={cn(
            "flex flex-col gap-2 p-5 rounded-xl backdrop-blur-md border border-white/10 glass-effect"
          )}
          style={{
            background:
              tip.type === "good"
                ? "linear-gradient(135deg, rgba(0,255,136,0.15), rgba(0,0,0,0.4))"
                : "linear-gradient(135deg, rgba(255,204,0,0.15), rgba(0,0,0,0.4))",
            boxShadow:
              tip.type === "good"
                ? "0 0 12px rgba(0,255,136,0.3)"
                : "0 0 12px rgba(255,204,0,0.2)",
          }}
        >
          <div className="flex flex-row items-center gap-3">
            <NeonIcon type={tip.type} />
            <p
              className={cn(
                "text-lg font-semibold",
                tip.type === "good"
                  ? "text-green-300"
                  : "text-yellow-300"
              )}
            >
              {tip.tip}
            </p>
          </div>
          <p className="text-gray-300 text-sm md:text-base leading-relaxed">
            {tip.explanation}
          </p>
        </motion.div>
      ))}
    </div>
  </div>
);

const Details = ({ feedback }: { feedback: Feedback }) => {
  const categories = [
    { id: "tone-style", title: "Tone & Style", data: feedback.toneAndStyle },
    { id: "content", title: "Content", data: feedback.content },
    { id: "structure", title: "Structure", data: feedback.structure },
    { id: "skills", title: "Skills", data: feedback.skills },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col gap-6 w-full max-w-6xl mx-auto p-6 md:p-10 rounded-3xl bg-gradient-to-b from-[#0c0c0c] to-[#101010] shadow-[0_0_25px_rgba(0,255,136,0.2)] border border-white/10"
    >
      <Accordion>
        {categories.map(({ id, title, data }) => (
          <AccordionItem id={id} key={id}>
            <AccordionHeader itemId={id}>
              <CategoryHeader title={title} categoryScore={data.score} />
            </AccordionHeader>
            <AccordionContent itemId={id}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <CategoryContent tips={data.tips} />
                </motion.div>
              </AnimatePresence>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </motion.div>
  );
};

export default Details;
