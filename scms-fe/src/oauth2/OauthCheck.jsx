// import { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { ACCESS_TOKEN, USER_ROLE, TOKEN_EXPITY_TIME } from '../constant/constain';

// export const useAuthCheck = () => {
//     const navigate = useNavigate();

//     useEffect(() => {
//         const checkAuth = () => {
//             const token = localStorage.getItem(ACCESS_TOKEN);
//             if (!token) {
//                 // No token, user is not logged in
//                 return;
//             }

//             const expiry = localStorage.getItem('token_expiry');
//             if (!expiry || new Date().getTime() > parseInt(expiry)) {
//                 // Token is expired
//                 localStorage.removeItem(ACCESS_TOKEN);
//                 localStorage.removeItem(USER_ROLE);
//                 navigate('/login');
//             }
//         };

//         checkAuth();

//         // Set up a timer for token expiration check
//         const interval = setInterval(checkAuth, 10000); // Check every 10 seconds

//         // Cleanup interval on unmount
//         return () => clearInterval(interval);
//     }, [navigate]);
// }
