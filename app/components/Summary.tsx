import ScoreGauge from "~/components/ScoreGauge";
import ScoreBadge from "~/components/ScoreBadge";

const Category = ({ title, score }: { title: string; score: number }) => {
    const scoreColor =
        score > 70
            ? 'var(--color-badge-green-text)'
            : score > 49
                ? 'var(--color-badge-yellow-text)'
                : 'var(--color-badge-red-text)';

    const bgColor =
        score > 70
            ? 'var(--color-badge-green)/20'
            : score > 49
                ? 'var(--color-badge-yellow)/20'
                : 'var(--color-badge-red)/20';

    return (
        <div className="resume-summary w-full">
            <div
                className="glass-effect neon-border rounded-xl transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,255,0,0.5)]"
                style={{
                    backgroundColor: bgColor,
                    borderColor: `${scoreColor}40`,
                }}
            >
                <div className="flex flex-col sm:flex-row items-center justify-between w-full p-4 gap-4">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                        <p className="text-lg sm:text-2xl font-semibold truncate" style={{ color: scoreColor }}>
                            {title}
                        </p>
                        <ScoreBadge score={score} />
                    </div>
                    <p className="text-lg sm:text-2xl font-bold" style={{ color: scoreColor }}>
                        {score}/100
                    </p>
                </div>
            </div>
        </div>
    );
};

const Summary = ({ feedback }: { feedback: Feedback }) => {
    return (
        <div className="glass-effect neon-border w-full rounded-xl p-4 md:p-6 flex flex-col gap-6 transition-all duration-300 overflow-hidden">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <ScoreGauge score={feedback.overallScore} />

                <div className="flex flex-col gap-2 text-center md:text-left">
                    <h2 className="text-xl md:text-2xl font-bold text-[var(--color-text-primary)]">
                        Your Resume Score
                    </h2>
                    <p className="text-sm md:text-base text-[var(--color-text-secondary)]">
                        This score is calculated based on the variables listed below.
                    </p>
                </div>
            </div>

            {/* Categories */}
            <div className="flex flex-col gap-3">
                <Category title="Tone & Style" score={feedback.toneAndStyle.score} />
                <Category title="Content" score={feedback.content.score} />
                <Category title="Structure" score={feedback.structure.score} />
                <Category title="Skills" score={feedback.skills.score} />
            </div>
        </div>
    );
};

export default Summary;
