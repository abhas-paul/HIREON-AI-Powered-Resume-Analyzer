import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
import ResumeCard from "~/components/ResumeCard";
import { usePuterStore } from "~/lib/puter";
import { Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "HIREON" },
    { name: "description", content: "Smart feedback for your dream job!" },
  ];
}

export default function Home() {
  const { auth, kv } = usePuterStore();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(false);

  useEffect(() => {
    if (!auth.isAuthenticated) navigate('/auth?next=/');
  }, [auth.isAuthenticated]);

  useEffect(() => {
    const loadResumes = async () => {
      setLoadingResumes(true);

      const resumes = (await kv.list('resume:*', true)) as KVItem[];
      const parsedResumes = resumes?.map((resume) => JSON.parse(resume.value) as Resume);
      setResumes(parsedResumes || []);
      setLoadingResumes(false);
    }

    loadResumes();
  }, []);

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover min-h-screen">
      <Navbar />

      <section className="main-section max-w-7xl mx-auto px-4 md:px-8 py-16 flex flex-col gap-12">

        {/* Heading */}
        <div className="page-heading w-full">
          <h1 className="text-3xl md:text-5xl font-bold text-[var(--color-text-primary)] mb-4 text-center">
            Make Your Resume Stand Out From the Crowd
          </h1>
          <div className="w-full flex justify-center items-center min-h-[60px]">
            {!loadingResumes && resumes?.length === 0 ? (
              <h2 className="text-lg md:text-2xl text-[var(--color-text-secondary)] text-center max-w-2xl mx-auto px-4">
                No resumes found. Upload your first resume to get feedback.
              </h2>
            ) : (
              <h2 className="text-lg md:text-2xl text-[var(--color-text-secondary)] text-center max-w-2xl mx-auto px-4">
                Review your submissions and check AI-powered feedback.
              </h2>
            )}
          </div>
        </div>


        {/* Loading */}
        {loadingResumes && (
          <div className="flex flex-col items-center justify-center">
            <img src="/images/resume-scan-2.gif" className="w-40 md:w-48 animate-pulse" />
          </div>
        )}

        {/* Resumes */}
        {!loadingResumes && resumes.length > 0 && (
          <div className="resumes-section grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {resumes.map((resume) => (
              <ResumeCard key={resume.id} resume={resume} />
            ))}
          </div>
        )}

        {/* Upload CTA if no resumes */}
        {!loadingResumes && resumes?.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-10 gap-4">
            <Link
              to="/upload"
              className="primary-button w-fit text-xl font-semibold bg-gradient-to-r from-green-400 to-green-600 text-black py-3 px-6 rounded-xl shadow-md hover:shadow-[0_0_15px_rgba(0,255,0,0.6)] transition-all duration-300"
            >
              Upload Resume
            </Link>
          </div>
        )}

        <div className="flex flex-col items-center justify-center mt-10 gap-4">
          <Link
            to="/wipe"
            className="primary-button w-fit text-xl font-semibold bg-gradient-to-r from-green-400 to-green-600 text-black py-3 px-6 rounded-xl shadow-md hover:shadow-[0_0_15px_rgba(0,255,0,0.6)] transition-all duration-300"
          >
            Wipe Data
          </Link>
        </div>
      </section>
    </main>
  );
}
