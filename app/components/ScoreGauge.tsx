import { useEffect, useRef, useState } from "react";

const ScoreGauge = ({ score = 75 }: { score: number }) => {
    const [pathLength, setPathLength] = useState(0);
    const pathRef = useRef<SVGPathElement>(null);

    const percentage = Math.min(Math.max(score, 0), 100) / 100; // Clamp 0-100

    useEffect(() => {
        if (pathRef.current) {
            setPathLength(pathRef.current.getTotalLength());
        }
    }, []);

    return (
        <div className="flex flex-col items-center w-full max-w-xs">
            <div className="relative w-full h-24 md:h-28">
                <svg viewBox="0 0 100 50" className="w-full h-full">
                    <defs>
                        <linearGradient
                            id="gaugeGradient"
                            x1="0%"
                            y1="0%"
                            x2="100%"
                            y2="0%"
                        >
                            <stop offset="0%" stopColor="#00ff00" />
                            <stop offset="100%" stopColor="#00cc00" />
                        </linearGradient>
                    </defs>

                    {/* Background arc */}
                    <path
                        d="M10,50 A40,40 0 0,1 90,50"
                        fill="none"
                        stroke="rgba(255, 255, 255, 0.1)"
                        strokeWidth="10"
                        strokeLinecap="round"
                    />

                    {/* Foreground arc with animated stroke */}
                    <path
                        ref={pathRef}
                        d="M10,50 A40,40 0 0,1 90,50"
                        fill="none"
                        stroke="url(#gaugeGradient)"
                        strokeWidth="10"
                        strokeLinecap="round"
                        strokeDasharray={pathLength}
                        strokeDashoffset={pathLength * (1 - percentage)}
                        className="transition-all duration-1000 ease-out"
                    />
                </svg>

                {/* Score label */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
                    <div className="text-lg md:text-xl font-semibold text-[var(--color-text-primary)] drop-shadow-md">
                        {score}/100
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScoreGauge;
