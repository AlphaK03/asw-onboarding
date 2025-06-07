import { Link } from "react-router-dom";

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center">
            <h1 className="text-6xl font-bold text-red-600">404</h1>
            <p className="text-xl mt-4">Oops! Page not found.</p>
            <Link
                to="/login"
                className="mt-6 text-blue-600 underline hover:text-blue-800"
            >
                Go to login
            </Link>
        </div>
    );
}
