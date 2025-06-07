import { ReactNode } from "react";
import Navbar from "../components/Navbar";

interface Props {
    children: ReactNode;
    onLogout: () => void;
    role: string | null;
}

export default function MainLayout({ children, onLogout, role }: Props) {
    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar onLogout={onLogout} role={role} />
            <main className="max-w-7xl mx-auto px-4 py-10">
                {children}
            </main>
        </div>
    );
}
