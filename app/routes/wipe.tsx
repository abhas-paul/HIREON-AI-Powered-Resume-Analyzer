import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { usePuterStore } from "~/lib/puter";
import { Link } from "react-router";

export const meta = () => ([
    { title: 'HIREON | Wipe' },
    { name: 'description', content: 'Wipe your pre-existing history.' },
]);

const WipeApp = () => {
    const { auth, isLoading, error, fs, kv } = usePuterStore();
    const navigate = useNavigate();
    const [files, setFiles] = useState<FSItem[]>([]);

    const loadFiles = async () => {
        const files = (await fs.readDir("./")) as FSItem[];
        setFiles(files);
    };

    useEffect(() => {
        loadFiles();
    }, []);

    useEffect(() => {
        if (!isLoading && !auth.isAuthenticated) {
            navigate("/auth?next=/wipe");
        }
    }, [isLoading]);

    const handleDelete = async () => {
        files.forEach(async (file) => {
            await fs.delete(file.path);
        });
        await kv.flush();
        loadFiles();
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen text-[var(--color-text-secondary)]">
                Loading...
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-screen text-red-500">
                Error: {error}
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-start md:justify-center min-h-screen px-4 py-10 gap-8 bg-[var(--color-dark-bg)]">

            {/* Navigation */}
            <nav className="">
                <Link
                    to="/"
                    className="back-button flex items-center gap-2 text-[var(--color-text-secondary)] font-semibold hover:text-[var(--color-text-primary)] transition-colors"
                >
                    <span>Back to Homepage</span>
                </Link>
            </nav>

            {/* Auth Info */}
            <p className="text-[var(--color-text-secondary)] text-center">
                Authenticated as:{" "}
                <span className="font-semibold text-[var(--color-accent-green)]">{auth.user?.username}</span>
            </p>

            {/* Files List */}
            <div className="w-full max-w-xl flex flex-col gap-4">
                <p className="text-[var(--color-accent-green)] font-semibold text-lg">Existing Files:</p>
                {files.length === 0 ? (
                    <p className="text-[var(--color-text-secondary)] text-center py-6 bg-[var(--color-dark-surface)] rounded-xl shadow-md">
                        No files found.
                    </p>
                ) : (
                    <div className="flex flex-col gap-3">
                        {files.map((file) => (
                            <div
                                key={file.id}
                                className="flex items-center p-3 bg-[var(--color-dark-surface)] rounded-xl border border-[rgba(0,255,0,0.2)] shadow-md hover:shadow-[0_0_15px_rgba(0,255,0,0.6)] transition-shadow duration-300"
                            >
                                <p className="truncate text-[var(--color-text-primary)]">{file.name}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Wipe Button */}
            <button
                className="cursor-pointer w-full max-w-xl py-3 text-lg font-semibold rounded-xl bg-gradient-to-r from-[var(--color-accent-green)] to-[#00cc00] text-[var(--color-dark-bg)] shadow-md hover:shadow-[0_0_25px_rgba(0,255,0,0.8)] transition-all duration-300"
                onClick={handleDelete}
            >
                Wipe App Data
            </button>
        </div>
    );
};

export default WipeApp;
