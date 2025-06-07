import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import MainLayout from "./layouts/MainLayout";
import { useAuth } from "./hooks/useAuth";
import NotFound from "./pages/NotFound";
import OnboardingManager from "./pages/OnboardingManager";
import OnboardingSteps from "./pages/OnboardingSteps.tsx";
import OnboardingStepManager from "./components/OnboardingStepManager";
import DepartmentOnboardings from "./components/DepartmentOnboardings.tsx";
import EmployeeOnboardingSteps from "./components/EmployeeOnboardingSteps.tsx";


function App() {
    const { role, login, logout } = useAuth();

    return (
        <BrowserRouter>
            <MainLayout onLogout={logout} role={role}>
                <Routes>
                    <Route path="/" element={<Navigate to="/login" />} />
                    <Route
                        path="/login"
                        element={
                            role ? <Navigate to={`/${role}`} replace /> : <Login onLogin={login} />
                        }
                    />
                    <Route
                        path="/admin"
                        element={
                            <ProtectedRoute userRole={role} expectedRole="admin">
                                <AdminDashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/employee"
                        element={
                            <ProtectedRoute userRole={role} expectedRole="employee">
                                <EmployeeDashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/onboardings"
                        element={
                            <ProtectedRoute userRole={role} expectedRole="admin">
                                <OnboardingManager />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/onboarding/:onboardingId/steps" element={<OnboardingSteps />} />
                    <Route path="/steps" element={<OnboardingStepManager />} />
                    <Route path="/admin/departments/:id/onboardings" element={<DepartmentOnboardings />} />
                    <Route path="/employee/onboarding/:id/steps" element={<EmployeeOnboardingSteps />} />

                    <Route path="*" element={<NotFound />} />
                </Routes>
            </MainLayout>
        </BrowserRouter>
    );
}

export default App;
