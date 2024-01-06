import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ACCESS_TOKEN } from '../constant/constain';

function ProtectedRoute({ component: Component, requiredRole }) {
    const navigate = useNavigate();
    const isAuthenticated = !!localStorage.getItem(ACCESS_TOKEN);
    const userRole = localStorage.getItem('userRole') || ""; // Default to an empty string if null

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
         else if (requiredRole && !userRole.includes(requiredRole)) {
            navigate('/not-authorized');
        }
    }, [isAuthenticated, userRole, requiredRole, navigate]);

    if (!isAuthenticated || (requiredRole && !userRole.includes(requiredRole))) {
        return null;
    }

    return <Component />;
}

export default ProtectedRoute;
