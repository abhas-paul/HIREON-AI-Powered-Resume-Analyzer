import { type FormEvent, useState } from 'react';
import Navbar from "~/components/Navbar";
import FileUploader from "~/components/FileUploader";
import { usePuterStore } from "~/lib/puter";
import { useNavigate } from "react-router";
import { convertPdfToImage } from "~/lib/pdf2img";
import { generateUUID } from "~/lib/utils";
import { prepareInstructions } from "../../constants";

export const meta = () => ([
    { title: 'HIREON | Upload' },
    { name: 'description', content: 'Upload your resume for the best quality check.' },
]);

const Upload = () => {
    const { auth, isLoading, fs, ai, kv } = usePuterStore();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [statusText, setStatusText] = useState('');
    const [file, setFile] = useState<File | null>(null);

    const handleFileSelect = (file: File | null) => setFile(file);

    const handleAnalyze = async ({ companyName, jobTitle, jobDescription, file }: { companyName: string, jobTitle: string, jobDescription: string, file: File }) => {
        setIsProcessing(true);

        setStatusText('Uploading the file...');
        const uploadedFile = await fs.upload([file]);
        if (!uploadedFile) return setStatusText('Error: Failed to upload file');

        setStatusText('Converting to image...');
        const imageFile = await convertPdfToImage(file);
        if (!imageFile.file) return setStatusText('Error: Failed to convert PDF to image');

        setStatusText('Uploading the image...');
        const uploadedImage = await fs.upload([imageFile.file]);
        if (!uploadedImage) return setStatusText('Error: Failed to upload image');

        setStatusText('Preparing data...');
        const uuid = generateUUID();
        const data = {
            id: uuid,
            resumePath: uploadedFile.path,
            imagePath: uploadedImage.path,
            companyName, jobTitle, jobDescription,
            feedback: '',
        };
        await kv.set(`resume:${uuid}`, JSON.stringify(data));

        setStatusText('Analyzing...');
        const feedback = await ai.feedback(uploadedFile.path, prepareInstructions({ jobTitle, jobDescription }));
        if (!feedback) return setStatusText('Error: Failed to analyze resume');

        const feedbackText = typeof feedback.message.content === 'string' ? feedback.message.content : feedback.message.content[0].text;
        data.feedback = JSON.parse(feedbackText);
        await kv.set(`resume:${uuid}`, JSON.stringify(data));

        setStatusText('Analysis complete, redirecting...');
        navigate(`/resume/${uuid}`);
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget.closest('form');
        if (!form) return;
        const formData = new FormData(form);

        const companyName = formData.get('company-name') as string;
        const jobTitle = formData.get('job-title') as string;
        const jobDescription = formData.get('job-description') as string;

        if (!file) return;
        handleAnalyze({ companyName, jobTitle, jobDescription, file });
    };

    return (
        <main className="bg-[url('/images/bg-main.svg')] bg-cover min-h-screen">
            <Navbar />

            <section className="main-section max-w-4xl mx-auto px-4 md:px-8 py-16">
                <div className="page-heading text-center flex flex-col gap-6">
                    <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-text-primary)]">
                        Smart feedback for your dream job
                    </h1>

                    {isProcessing ? (
                        <>
                            <h2 className="text-lg md:text-xl text-[var(--color-text-secondary)]">{statusText}</h2>
                            <img src="/images/resume-scan.gif" className="w-40 md:w-48 mx-auto animate-pulse" />
                        </>
                    ) : (
                        <h2 className="text-lg md:text-xl text-[var(--color-text-secondary)]">
                            Drop your resume for an ATS score and improvement tips
                        </h2>
                    )}

                    {!isProcessing && (
                        <form id="upload-form" onSubmit={handleSubmit} className="flex flex-col gap-6 mt-6 bg-black/70 backdrop-blur-md p-6 rounded-2xl shadow-lg">
                            
                            <div className="form-div flex flex-col gap-2">
                                <label htmlFor="company-name" className="font-semibold text-[var(--color-text-primary)]">Company Name</label>
                                <input type="text" name="company-name" placeholder="Company Name" id="company-name" className="input-field" />
                            </div>

                            <div className="form-div flex flex-col gap-2">
                                <label htmlFor="job-title" className="font-semibold text-[var(--color-text-primary)]">Job Title</label>
                                <input type="text" name="job-title" placeholder="Job Title" id="job-title" className="input-field" />
                            </div>

                            <div className="form-div flex flex-col gap-2">
                                <label htmlFor="job-description" className="font-semibold text-[var(--color-text-primary)]">Job Description</label>
                                <textarea rows={5} name="job-description" placeholder="Job Description" id="job-description" className="input-field resize-none" />
                            </div>

                            <div className="form-div flex flex-col gap-2">
                                <label htmlFor="uploader" className="font-semibold text-[var(--color-text-primary)]">Upload Resume</label>
                                <FileUploader onFileSelect={handleFileSelect} />
                            </div>

                            <button type="submit" className="primary-button w-full py-3 text-lg font-semibold rounded-xl bg-gradient-to-r from-green-400 to-green-600 text-black shadow-md hover:shadow-[0_0_15px_rgba(0,255,0,0.6)] transition-all duration-300">
                                Analyze Resume
                            </button>
                        </form>
                    )}
                </div>
            </section>
        </main>
    );
};

export default Upload;
