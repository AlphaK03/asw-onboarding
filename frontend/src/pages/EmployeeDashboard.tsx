import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface Department {
    id: number;
    name: string;
}

interface Onboarding {
    id: number;
    title: string;
    description: string;
}

export default function EmployeeDashboard() {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [selectedDept, setSelectedDept] = useState<string>("");
    const [onboardings, setOnboardings] = useState<Onboarding[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios
            .get("/api/departments")
            .then((res) => setDepartments(res.data))
            .catch((err) => console.error("Error loading departments", err));
    }, []);

    useEffect(() => {
        if (selectedDept) {
            axios
                .get(`/api/onboardings/by-department/${selectedDept}`)
                .then((res) => setOnboardings(res.data))
                .catch((err) => console.error("Error loading onboardings", err));
        } else {
            setOnboardings([]);
        }
    }, [selectedDept]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-2xl p-6 sm:p-10 border border-gray-100">
                <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-blue-700 text-center">
                    🧑‍💼 Employee Dashboard
                </h2>

                <div className="mb-8">
                    <label className="block text-gray-700 font-medium mb-2">
                        Select your department:
                    </label>
                    <select
                        value={selectedDept}
                        onChange={(e) => setSelectedDept(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring focus:ring-blue-200 shadow"
                    >
                        <option value="">-- Select --</option>
                        {departments.map((dept) => (
                            <option key={dept.id} value={dept.id}>
                                {dept.name}
                            </option>
                        ))}
                    </select>
                </div>

                {onboardings.length > 0 && (
                    <div>
                        <h3 className="text-xl font-semibold mb-4 text-indigo-700">📋 Available Onboardings</h3>
                        <ul className="space-y-4">
                            {onboardings.map((ob) => (
                                <li
                                    key={ob.id}
                                    className="p-4 border border-gray-200 bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition"
                                >
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                        <div>
                                            <h4 className="text-lg font-semibold text-indigo-600">{ob.title}</h4>
                                            <p className="text-sm text-gray-700">{ob.description}</p>
                                        </div>
                                        <button
                                            onClick={() => navigate(`/employee/onboarding/${ob.id}/steps`)}
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow text-sm"
                                        >
                                            🚀 Start
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}
