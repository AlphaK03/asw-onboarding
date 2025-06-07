import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Department {
    id: number;
    name: string;
}

export default function DepartmentForm() {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [name, setName] = useState("");
    const [editingDept, setEditingDept] = useState<Department | null>(null);
    const navigate = useNavigate();

    const fetchDepartments = async () => {
        try {
            const res = await axios.get("http://localhost:8080/api/departments");
            setDepartments(res.data);
        } catch (err) {
            console.error("Error fetching departments", err);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        try {
            await axios.post("http://localhost:8080/api/departments", { name });
            setName("");
            fetchDepartments();
        } catch (err) {
            console.error("Error saving department", err);
        }
    };

    const handleUpdate = async () => {
        if (!editingDept || !editingDept.name.trim()) return;
        try {
            await axios.put(`http://localhost:8080/api/departments/${editingDept.id}`, { name: editingDept.name });
            setEditingDept(null);
            fetchDepartments();
        } catch (err) {
            console.error("Error updating department", err);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await axios.delete(`http://localhost:8080/api/departments/${id}`);
            fetchDepartments();
        } catch (err) {
            console.error("Error deleting department", err);
        }
    };

    useEffect(() => {
        fetchDepartments();
    }, []);

    return (
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-md border border-gray-100">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-blue-700">📁 Departments</h2>
                <button
                    onClick={() => navigate("/onboardings")}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg shadow transition"
                >
                    📋 Manage Onboardings
                </button>
            </div>

            <form onSubmit={handleCreate} className="flex flex-col sm:flex-row gap-3 mb-6">
                <input
                    type="text"
                    placeholder="Enter department name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="flex-1 border border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 rounded-xl px-4 py-2 text-sm shadow transition-all"
                />
                <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl shadow transition text-sm"
                >
                    Add
                </button>
            </form>

            <ul className="space-y-3">
                {departments.map((dept) => (
                    <li
                        key={dept.id}
                        className="flex justify-between items-center px-4 py-2 border border-gray-200 rounded-xl shadow-sm bg-gray-50 hover:bg-gray-100 transition"
                    >
                        <span className="text-gray-800 font-medium">{dept.name}</span>
                        <div className="flex gap-3 text-sm">
                            <button
                                onClick={() => setEditingDept(dept)}
                                className="text-green-600 hover:text-green-700 font-medium"
                            >
                                ✏️ Edit
                            </button>
                            <button
                                onClick={() => navigate(`/admin/departments/${dept.id}/onboardings`)}
                                className="text-blue-600 hover:text-blue-800 font-medium"
                            >
                                📋 View
                            </button>
                        </div>
                    </li>
                ))}
            </ul>

            {/* 🧾 Modal para editar departamento */}
            {editingDept && (
                <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm space-y-4">
                        <h3 className="text-xl font-bold text-blue-700">✏️ Edit Department</h3>
                        <input
                            value={editingDept.name}
                            onChange={(e) =>
                                setEditingDept({ ...editingDept, name: e.target.value })
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm"
                            placeholder="Department name"
                        />
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => handleDelete(editingDept.id)}
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm"
                            >
                                🗑 Delete
                            </button>
                            <button
                                onClick={() => setEditingDept(null)}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdate}
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
