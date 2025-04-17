import DepartmentForm from "../components/DepartmentForm";

export default function AdminDashboard() {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

            {/* Módulo de Departamentos */}
            <DepartmentForm />
        </div>
    );
}
