import { Navigate } from "react-router-dom";
import {JSX} from "react";


interface ProtectedRouteProps {
    children: JSX.Element;
    expectedRole: string;
    userRole: string | null;
}

export default function ProtectedRoute({ children, expectedRole, userRole }: ProtectedRouteProps) {
    if (userRole !== expectedRole) {
        return <Navigate to="/login" replace />;
    }

    return children;
}
