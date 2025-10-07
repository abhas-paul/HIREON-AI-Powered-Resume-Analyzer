import { Link, useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import { usePuterStore } from "~/lib/puter";
import Summary from "~/components/Summary";
import ATS from "~/components/ATS";
import Details from "~/components/Details";

export const meta = () => ([
    { title: 'HIREON | Review' },
    { name: 'description', content: 'The Detailed Review of your Resume.' },
]);

const Resume = () => {
    const { auth, isLoading, fs, kv } = usePuterStore();
    const { id } = useParams();
    const [imageUrl, setImageUrl] = useState('');
    const [resumeUrl, setResumeUrl] = useState('');
    const [feedback, setFeedback] = useState<Feedback | null>(null);
    const navigate = useNavigate();

    // Redirect if not authenticated
    useEffect(() => {
        if (!isLoading && !auth.isAuthenticated) navigate(`/auth?next=/resume/${id}`);
    }, [isLoading, auth.isAuthenticated, id, navigate]);

    // Load resume & feedback
    useEffect(() => {
        const loadResume = async () => {
            const resume = await kv.get(`resume:${id}`);
            if (!resume) return;

            const data = JSON.parse(resume);

            const resumeBlob = await fs.read(data.resumePath);
            if (!resumeBlob) return;
            const pdfBlob = new Blob([resumeBlob], { type: 'application/pdf' });
            setResumeUrl(URL.createObjectURL(pdfBlob));

            const imageBlob = await fs.read(data.imagePath);
            if (!imageBlob) return;
            setImageUrl(URL.createObjectURL(imageBlob));

            setFeedback(data.feedback);
        };

        loadResume();
    }, [id, fs, kv]);

    return (
        <main className="!pt-0 bg-[var(--color-bg-primary)] min-h-screen text-[var(--color-text-primary)]">

            {/* Navigation */}
            <nav className="resume-nav px-4 py-4 md:px-8">
                <Link
                    to="/"
                    className="back-button flex items-center gap-2 text-[var(--color-text-secondary)] font-semibold hover:text-[var(--color-text-primary)] transition-colors"
                >
                    <img src="/icons/back.svg" alt="Back" className="w-3 h-3" />
                    <span>Back to Homepage</span>
                </Link>
            </nav>

            {/* Main Content */}
            <div className="flex flex-col lg:flex-row w-full gap-8 px-4 md:px-8">

                {/* Resume Preview */}
                <section className="feedback-section flex-1 bg-[url('/images/bg-small.svg')] bg-cover sticky top-0 flex flex-col justify-between h-auto lg:h-[90vh] p-4 rounded-2xl">

                    {/* Resume image */}
                    <div className="flex items-center justify-center w-full h-full">
                        {imageUrl && resumeUrl ? (
                            <div className="animate-in fade-in duration-1000 gradient-border rounded-2xl w-full max-w-lg h-auto shadow-lg shadow-green-800/30 bg-black/20">
                                <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                                    <img
                                        src={imageUrl}
                                        className="w-full h-full object-contain rounded-2xl"
                                        title="resume"
                                    />
                                </a>
                            </div>
                        ) : (
                            <img src="/images/resume-scan-2.gif" className="w-40 md:w-48 animate-pulse" />
                        )}
                    </div>

                    {/* Bottom filler / design element */}
                    <div className="mt-4 w-full h-24 lg:h-32 bg-gradient-to-t from-black/70 via-black/40 to-transparent rounded-2xl" />
                </section>

                {/* Feedback Sections */}
                <section className="feedback-section flex-1 flex flex-col gap-6">
                    <h2 className="text-2xl md:text-4xl font-bold text-[var(--color-text-primary)]">
                        Resume Review
                    </h2>

                    {feedback ? (
                        <div className="flex flex-col gap-6 animate-in fade-in duration-1000">
                            <Summary feedback={feedback} />
                            <ATS score={feedback.ATS.score || 0} suggestions={feedback.ATS.tips || []} />
                            <Details feedback={feedback} />
                        </div>
                    ) : (
                        <div className="flex justify-center mt-8">
                            <img src="/images/resume-scan-2.gif" className="w-40 md:w-48 animate-pulse" />
                        </div>
                    )}
                </section>
            </div>
        </main>

    );
};

export default Resume;
