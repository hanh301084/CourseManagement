import React, { useState, useEffect } from 'react';
import userAPI from '../../api/UserAPI';
import ClassList from '../Teacher/classManagement/ClassList';

const ClassListForReviewer = () => {
    const [userProfile, setUserProfile] = useState(null);

    useEffect(() => {
        userAPI.userProfile().then(response => {
            setUserProfile(response.data);
        }).catch(error => {
            console.error("Failed to fetch user profile:", error);
        });
    }, []);


    return (
        <>
            {userProfile && userProfile.userId && 
                <ClassList reviewerId={userProfile.userId} />
            }
        </>
    );
};

export default ClassListForReviewer;