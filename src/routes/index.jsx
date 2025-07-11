import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Layout from "../layouts/Layout";
import Profile from "../pages/Profile";
import SignUp from "../pages/SignUp";
import ForgotPassword from "../pages/ForgotPassword";
import VerifyIdentity from "../pages/VerifyIdentity";
import FolderPage from "../pages/FolderPage";
import GroupPage from "../pages/GroupPage";
import FolderMedia from "../components/FolderMedia";
import MediaApproval from "../components/MediaApproval";
import IdentityVerificationRoute from "./IdentityVerificationRoute";
import ChangePassword from "../pages/ChangePassword";

const AppRoutes = ({ isAuthenticated }) => {
    return (
        <Routes>
            {/* Public Route */}
            <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
            <Route path="/signup" element={!isAuthenticated ? <SignUp /> : <Navigate to="/dashboard" />} />
            <Route path="/forgot-password" element={!isAuthenticated ? <ForgotPassword /> : <Navigate to="/dashboard" />} />

            <Route element={<IdentityVerificationRoute />}>
                <Route path="/verify-identity" element={<VerifyIdentity />} />
            </Route>

            {/* Protected Routes with Layout */}
            <Route element={<ProtectedRoute />}>
                <Route element={<Layout />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/folders" element={<FolderPage />} />
                    <Route path="/groups" element={<GroupPage />} />
                    {/* <Route path="/folders/media" element={<FolderMedia />} /> */}
                    <Route path="/approve-media" element={<MediaApproval />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/change-password" element={<ChangePassword />} />
                </Route>
            </Route>

            {/* Fallback */}
            <Route path="*" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
        </Routes>
    )
}

export default AppRoutes;