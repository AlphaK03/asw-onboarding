import { useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

interface Props {
    onLogout: () => void;
    role: string | null;
}

export default function Navbar({ onLogout, role }: Props) {
    const navigate = useNavigate();
    const location = useLocation();

    const hideBackButton = location.pathname === "/admin"
        || location.pathname === "/employee"
        || location.pathname === "/login";

    const handleLogout = () => {
        onLogout();
        navigate("/login");
    };

    return (
        <nav className="bg-white text-gray-800 px-6 py-4 flex justify-between items-center shadow-md">
            <div className="flex items-center gap-3">
                {!hideBackButton && (
                    <button
                        onClick={() => navigate(-1)}
                        className="text-gray-600 hover:text-blue-600 text-lg"
                        title="Go Back"
                    >
                        ⬅️
                    </button>
                )}
                <img
                    src={logo}
                    alt="ASW Logo"
                    className="h-8 sm:h-10 object-contain"
                />
            </div>

            {role && (
                <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-sm font-medium text-white shadow transition-all"
                >
                    🔒 Logout
                </button>
            )}
        </nav>
    );
}
