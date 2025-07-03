import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const IdentityVerificationRoute = () => {
    const { isAuthenticated, isIdentityVerified } = useSelector((state) => state.auth);

    if (!isAuthenticated) return <Navigate to="/login" replace />;
    if (isIdentityVerified) return <Navigate to="/dashboard" replace />;

    return <Outlet />;
};

export default IdentityVerificationRoute;
