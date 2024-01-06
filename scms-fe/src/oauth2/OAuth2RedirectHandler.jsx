import React, { useEffect, useState } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { ACCESS_TOKEN , USER_ROLE, TOKEN_EXPITY_TIME} from '../constant/constain.jsx';
import userAPI from '../api/UserAPI.jsx';
import Notification from '../compornent/notifcation/'
function OAuth2RedirectHandler() {
    const location = useLocation();
    const [redirectTo, setRedirectTo] = useState(null);
    const getUrlParameter = (name) => {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');

        var results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    };

    const token = getUrlParameter('token');
    const error = getUrlParameter('error');

    useEffect(() => {
        if (error) {
            Notification('error', 'NOT ALLOWED', error);
        }
        if (token) {
            localStorage.setItem(ACCESS_TOKEN, token);
            const expiryTime = new Date().getTime() + TOKEN_EXPITY_TIME; // Current time + token validity period
            localStorage.setItem('token_expiry', expiryTime);
            userAPI.userProfile()
                .then(response => {
                    const userData = response.data;
                    if (userData && userData.role) {
                       
                        localStorage.setItem(USER_ROLE, JSON.stringify(userData.role));
                        const storedRoles = localStorage.getItem(USER_ROLE);
                        const userRoles = storedRoles ? JSON.parse(storedRoles) : [];
    
                        if (userRoles.includes("HeadOfDepartment")) {
                            setRedirectTo('/hod/dashboard');
                        } else if (userRoles.includes("TEACHER")) {
                            setRedirectTo('/teacher/home');
                        } else if (userRoles.includes("STUDENT")){
                            setRedirectTo('/student/class-list');
                        }
                        else{
                            setRedirectTo('/reviewer/class-list');
                        }
                         
                    } else {
                        console.warn("Unexpected response format:", response);
                        setRedirectTo('/login');
                    }
                })
                .catch(error => {
                    const err = error.response.data ? error.response.data : "Something when wrong!"
                    Notification('error', 'NOT ALLOWED', err );  
                    setRedirectTo('/login');
                });
        } else {
            setRedirectTo('/login');
        }
        
    }, [token]);
    

    if (redirectTo) {
        return <Navigate to={redirectTo} replace />;
    } else {
        return null; 
    }
}

export default OAuth2RedirectHandler;
