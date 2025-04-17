import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Department {
    id: number;
    name: string;
}

interface Onboarding {
    id: number;
    title: string;
    description: string;
    department: Department;
}

export default function OnboardingManager() {
    const [onboardings, setOnboardings] = useState<Onboarding[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [newTitle, setNewTitle] = useState("");
    const [newDescription, setNewDescription] = useState("");
    const [selectedDepartmentId, setSelectedDepartmentId] = useState<number | null>(null);
    const [filterDeptId, setFilterDeptId] = useState<number | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const loadData = async () => {
            try {
                await fetchOnboardings();
                await fetchDepartments();
            } catch (error) {
                console.error("Error loading data", error);
            }
        };

        loadData();
    }, []);

    const fetchOnboardings = async () => {
        try {
            const res = await axios.get("http://localhost:8080/api/onboardings");
            const realArray = Array.isArray(res.data)
                ? res.data
                : res.data.content ?? res.data.data ?? [];

            setOnboardings(Array.isArray(realArray) ? realArray : []);
        } catch (err) {
            console.error("Error al obtener onboardings", err);
            setOnboardings([]);
        }
    };

    const fetchDepartments = async () => {
        try {
            const res = await axios.get("http://localhost:8080/api/departments");
            if (Array.isArray(res.data)) {
                setDepartments(res.data);
            } else {
                console.warn("La respuesta no es un array:", res.data);
                setDepartments([]);
            }
        } catch (err) {
            console.error("Error al obtener departamentos", err);
            setDepartments([]);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTitle.trim() || !selectedDepartmentId) return;

        try {
            await axios.post("http://localhost:8080/api/onboardings", {
                title: newTitle,
                description: newDescription,
                department: { id: selectedDepartmentId }
            });
            setNewTitle("");
            setNewDescription("");
            setSelectedDepartmentId(null);
            fetchOnboardings();
        } catch (err) {
            console.error("Error creating onboarding", err);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await axios.delete(`http://localhost:8080/api/onboardings/${id}`);
            fetchOnboardings();
        } catch (err) {
            console.error("Error deleting onboarding", err);
        }
    };

    // 🔎 Filtrar onboardings por departamento
    const filteredOnboardings = filterDeptId
        ? onboardings.filter((o) => o.department.id === filterDeptId)
        : onboardings;

    return (
        <div className="p-4 bg-white shadow rounded">
            <h2 className="text-2xl font-semibold mb-4">Manage Onboardings</h2>

            <form onSubmit={handleCreate} className="space-y-4 mb-6">
                <input
                    type="text"
                    placeholder="Title"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full border px-3 py-2 rounded"
                />
                <textarea
                    placeholder="Description"
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    className="w-full border px-3 py-2 rounded"
                />
                <select
                    value={selectedDepartmentId ?? ""}
                    onChange={(e) =>
                        setSelectedDepartmentId(e.target.value === "" ? null : Number(e.target.value))
                    }
                    className="w-full border px-3 py-2 rounded"
                >
                    <option value="">Select Department</option>
                    {departments.map((d) => (
                        <option key={d.id} value={d.id}>
                            {d.name}
                        </option>
                    ))}
                </select>

                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Create Onboarding
                </button>
            </form>

            {/* 🔍 Filtro por departamento */}
            <div className="mb-4">
                <label className="block mb-1 text-sm font-medium text-gray-700">
                    Filter by Department
                </label>
                <select
                    value={filterDeptId ?? ""}
                    onChange={(e) =>
                        setFilterDeptId(e.target.value === "" ? null : Number(e.target.value))
                    }
                    className="w-full border px-3 py-2 rounded"
                >
                    <option value="">All Departments</option>
                    {departments.map((d) => (
                        <option key={d.id} value={d.id}>
                            {d.name}
                        </option>
                    ))}
                </select>
            </div>

            <ul className="space-y-2">
                {filteredOnboardings.map((o) => (
                    <li key={o.id} className="flex justify-between items-center border-b py-2">
                        <div>
                            <p className="font-bold">{o.title}</p>
                            <p className="text-sm">{o.description}</p>
                            <p className="text-xs text-gray-500">Dept: {o.department.name}</p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => navigate(`/onboarding/${o.id}/steps`)}
                                className="text-blue-600 hover:underline"
                            >
                                Manage Steps
                            </button>
                            <button
                                onClick={() => handleDelete(o.id)}
                                className="text-red-600 hover:underline"
                            >
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
