import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

interface Onboarding {
    id: number;
    title: string;
    description: string;
}
interface Department {
    id: number;
    name: string;
}

export default function DepartmentOnboardings() {
    const { id } = useParams(); // departmentId
    const navigate = useNavigate();

    const [onboardings, setOnboardings] = useState<Onboarding[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [department, setDepartment] = useState<Department | null>(null);
    const [error, setError] = useState("");

    // 🔥 Modal control
    const [editing, setEditing] = useState<Onboarding | null>(null);
    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");

    useEffect(() => {
        if (id) {
            setIsLoading(true);
            setError("");

            axios
                .get(`/api/onboardings/by-department/${id}`)
                .then((res) => setOnboardings(res.data))
                .catch((err) => {
                    console.error("Error loading onboardings", err);
                    setError("Failed to load onboardings.");
                })
                .finally(() => setIsLoading(false));

            axios
                .get(`/api/departments/${id}`)
                .then((res) => setDepartment(res.data))
                .catch((err) => {
                    console.error("Error loading department", err);
                    setDepartment(null);
                    setError("Failed to load department.");
                });
        }
    }, [id]);

    const handleEdit = (ob: Onboarding) => {
        setEditing(ob);
        setEditTitle(ob.title);
        setEditDescription(ob.description);
    };

    const saveEdit = async () => {
        if (!editing || !editTitle.trim()) return;

        try {
            const updated = { ...editing, title: editTitle, description: editDescription };
            await axios.put(`/api/onboardings/${editing.id}`, updated);
            setOnboardings((prev) =>
                prev.map((o) => (o.id === editing.id ? updated : o))
            );
            setEditing(null);
        } catch (err) {
            console.error("Error saving onboarding update", err);
            setError("Error updating onboarding.");
        }
    };

    useEffect(() => {
        const escListener = (e: KeyboardEvent) => {
            if (e.key === "Escape") setEditing(null);
        };
        window.addEventListener("keydown", escListener);
        return () => window.removeEventListener("keydown", escListener);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-10 px-4 sm:px-6 lg:px-8 relative">
            <div className="max-w-5xl mx-auto bg-white shadow-2xl rounded-2xl p-6 sm:p-10 border border-gray-100">
                <h2 className="text-2xl sm:text-3xl font-bold text-center text-blue-700 mb-8">
                    📋 Onboardings for <span className="text-indigo-700">{department?.name ?? "..."}</span>
                </h2>

                {error && (
                    <p className="text-red-600 text-sm text-center mb-4">{error}</p>
                )}

                {isLoading ? (
                    <p className="text-center text-gray-500 italic">Loading...</p>
                ) : onboardings.length === 0 ? (
                    <p className="text-center text-gray-400 italic">No onboardings yet.</p>
                ) : (
                    <ul className="space-y-5">
                        {onboardings.map((ob) => (
                            <li
                                key={ob.id}
                                className="p-5 border border-gray-200 rounded-xl bg-gray-50 shadow hover:shadow-md transition"
                            >
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                    <div className="flex-1">
                                        <h3 className="text-lg sm:text-xl font-semibold text-indigo-700">
                                            🧭 {ob.title}
                                        </h3>
                                        <p className="text-gray-700 text-sm sm:text-base">{ob.description}</p>
                                    </div>
                                    <div className="flex gap-2 text-sm">
                                        <button
                                            onClick={() => navigate(`/onboarding/${ob.id}/steps`)}
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg shadow"
                                        >
                                            ➕ Steps
                                        </button>
                                        <button
                                            onClick={() => handleEdit(ob)}
                                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg shadow"
                                        >
                                            ✏️ Edit
                                        </button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* 🧾 Modal flotante para edición */}
            {editing && (
                <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
                    <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md animate-fadeIn">
                        <h3 className="text-xl font-bold text-indigo-700 mb-4">✏️ Edit Onboarding</h3>
                        <input
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            placeholder="Title"
                            className="w-full mb-3 px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm"
                        />
                        <textarea
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                            placeholder="Description"
                            className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm"
                        />
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setEditing(null)}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={saveEdit}
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm"
                            >
                                💾 Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
