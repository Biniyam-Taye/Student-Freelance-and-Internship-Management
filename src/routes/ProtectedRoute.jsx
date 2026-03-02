import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const roleRedirects = {
    student: '/student',
    recruiter: '/recruiter',
    admin: '/admin',
};

export default function ProtectedRoute({ children, allowedRoles = [] }) {
    const { isAuthenticated, user } = useSelector((s) => s.auth);

    if (!isAuthenticated || !user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        return <Navigate to={roleRedirects[user.role] || '/'} replace />;
    }

    return children;
}
