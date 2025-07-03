import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
    const { isAuthenticated, isIdentityVerified } = useSelector((state) => state.auth);

    if (!isAuthenticated) return <Navigate to="/login" replace />;
    if (!isIdentityVerified) return <Navigate to="/verify-identity" replace />;

    return <Outlet />;
};

export default ProtectedRoute;