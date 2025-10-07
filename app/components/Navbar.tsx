import { Link } from "react-router";

const Navbar = () => {
    return (
        <nav className="w-full flex flex-col sm:flex-row justify-between items-center py-4 px-6 md:px-12 bg-black/70 backdrop-blur-md shadow-lg sticky top-0 z-50">
            <Link to="/" className="mb-3 sm:mb-0">
                <p className="text-2xl md:text-3xl font-bold text-gradient hover:animate-glow transition-all duration-300 cursor-pointer">
                    HIREON
                </p>
            </Link>
            <Link 
                to="/upload" 
                className="primary-button w-full sm:w-auto px-6 py-2 md:px-8 md:py-3 text-sm md:text-base font-semibold rounded-xl bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-black transition-all duration-300 shadow-md hover:shadow-[0_0_15px_rgba(0,255,0,0.6)] text-center"
            >
                Upload Resume
            </Link>
        </nav>
    )
}

export default Navbar;
