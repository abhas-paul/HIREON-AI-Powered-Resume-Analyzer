import { usePuterStore } from "~/lib/puter";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";

export const meta = () => ([
    { title: 'HIREON | Auth' },
    { name: 'description', content: 'Log with your puter account' },
]);

const Auth = () => {
    const { isLoading, auth } = usePuterStore();
    const location = useLocation();
    const next = location.search.split('next=')[1] || '/';
    const navigate = useNavigate();

    useEffect(() => {
        if(auth.isAuthenticated) navigate(next);
    }, [auth.isAuthenticated, next]);

    return (
        <main className="bg-[url('/images/bg-auth.svg')] bg-cover min-h-screen flex items-center justify-center p-4">
            <div className="gradient-border shadow-2xl rounded-3xl p-1 transition-all duration-300 hover:shadow-[0_0_25px_rgba(0,255,0,0.5)]">
                <section className="flex flex-col gap-8 bg-black/80 backdrop-blur-md rounded-2xl p-8 md:p-12 w-full max-w-md text-center text-white">
                    
                    {/* Header */}
                    <div className="flex flex-col gap-2">
                        <h1 className="text-3xl md:text-4xl font-bold text-gradient">Welcome</h1>
                        <h2 className="text-lg md:text-xl text-[var(--color-text-secondary)]">
                            Log In to Continue Your Job Journey
                        </h2>
                    </div>

                    {/* Auth Buttons */}
                    <div className="flex flex-col gap-4">
                        {isLoading ? (
                            <button className="auth-button animate-pulse bg-gradient-to-r from-green-400 to-green-600 text-black font-semibold py-3 rounded-xl shadow-md hover:shadow-[0_0_15px_rgba(0,255,0,0.6)] transition-all duration-300">
                                <p>Signing you in...</p>
                            </button>
                        ) : (
                            <>
                                {auth.isAuthenticated ? (
                                    <button
                                        className="auth-button bg-gradient-to-r from-red-500 to-red-700 text-black font-semibold py-3 rounded-xl shadow-md hover:shadow-[0_0_15px_rgba(255,0,0,0.6)] transition-all duration-300"
                                        onClick={auth.signOut}
                                    >
                                        <p>Log Out</p>
                                    </button>
                                ) : (
                                    <button
                                        className="auth-button bg-gradient-to-r from-green-400 to-green-600 text-black font-semibold py-3 rounded-xl shadow-md hover:shadow-[0_0_15px_rgba(0,255,0,0.6)] transition-all duration-300"
                                        onClick={auth.signIn}
                                    >
                                        <p>Log In</p>
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                </section>
            </div>
        </main>
    );
};

export default Auth;
