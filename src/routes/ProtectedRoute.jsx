import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfile } from '../features/auth/authSlice';

const roleRedirects = {
    student: '/student',
    recruiter: '/recruiter',
    admin: '/admin',
};

export default function ProtectedRoute({ children, allowedRoles = [] }) {
    const dispatch = useDispatch();
    const { isAuthenticated, user, token, loading } = useSelector((s) => s.auth);

    // Restore session when we have a token but no user (e.g. after refresh)
    useEffect(() => {
        if (token && !user && !loading) {
            dispatch(fetchProfile());
        }
    }, [token, user, loading, dispatch]);

    // Have token but user not loaded yet → show loading so we don't redirect to login
    if (token && !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="animate-spin w-10 h-10 border-2 border-blue-600 border-t-transparent rounded-full" />
            </div>
        );
    }

    // No token and no user → not logged in
    if (!token && !user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        return <Navigate to={roleRedirects[user.role] || '/'} replace />;
    }

    return children;
}
