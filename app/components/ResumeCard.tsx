import { Link } from "react-router";
import ScoreCircle from "~/components/ScoreCircle";
import { useEffect, useState } from "react";
import { usePuterStore } from "~/lib/puter";

const ResumeCard = ({ resume: { id, companyName, jobTitle, feedback, imagePath } }: { resume: Resume }) => {
    const { fs } = usePuterStore();
    const [resumeUrl, setResumeUrl] = useState('');

    useEffect(() => {
        const loadResume = async () => {
            const blob = await fs.read(imagePath);
            if (!blob) return;
            let url = URL.createObjectURL(blob);
            setResumeUrl(url);
        }

        loadResume();
    }, [imagePath]);

    return (
        <Link 
            to={`/resume/${id}`} 
            className="resume-card w-full sm:w-80 md:w-96 bg-black/60 rounded-xl shadow-md hover:shadow-[0_0_20px_rgba(0,255,0,0.5)] transition-all duration-300 animate-in fade-in duration-1000 flex flex-col gap-4 overflow-hidden"
        >
            {/* Header */}
            <div className="resume-card-header flex justify-between items-start p-4">
                <div className="flex flex-col gap-1 min-w-0">
                    {companyName ? (
                        <h2 className="text-[var(--color-text-primary)] font-bold text-lg truncate break-words">{companyName}</h2>
                    ) : null}
                    {jobTitle ? (
                        <h3 className="text-[var(--color-text-secondary)] text-sm md:text-base truncate break-words">{jobTitle}</h3>
                    ) : null}
                    {!companyName && !jobTitle && (
                        <h2 className="text-[var(--color-text-primary)] font-bold text-lg">Resume</h2>
                    )}
                </div>
                <div className="flex-shrink-0">
                    <ScoreCircle score={feedback.overallScore} />
                </div>
            </div>

            {/* Resume Preview */}
            {resumeUrl && (
                <div className="glass-effect neon-border p-2 sm:p-3 rounded-b-xl transition-all duration-300 hover:scale-[1.02]">
                    <div className="relative w-full h-[200px] sm:h-[280px] md:h-[350px] rounded-lg overflow-hidden">
                        <img
                            src={resumeUrl}
                            alt="resume preview"
                            className="object-contain w-full h-full w-full h-full object-cover object-top transition-transform duration-300"
                        />
                    </div>
                </div>
            )}
        </Link>
    )
}

export default ResumeCard;
