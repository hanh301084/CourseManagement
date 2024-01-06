import axiosClient from "./axiosClient";
import { saveAs } from 'file-saver';

const userAPI = {
    getAll: (page = 1, size = 10, keyword = '') => {
        const url = `/user/hod/all?page=${page - 1}&size=${size}&keyword=${keyword}`;
        return axiosClient.get(url);
    },
    userProfile:() => {
        const url ='/user/me'
        return axiosClient.get(url)
    },
    updateUserProfile: (data) => {
        console.log("Sending data to backend:", data);
        const url = '/user/me';
        return axiosClient.put(url, data);
    },
    updateUserRoles(user, roles) {
        // console.log("Sending data to backend:", user, roles);
        
        const userData = {
            userId: user.userId,
            fullName: user.fullName,
            email: user.email,
            image: user.image,
            status: user.status,
            rollNumber: user.rollNumber,
            role: roles 
        };
        return axiosClient.post(`/user/hod/updateRoles`, userData);
    }, 
    updateUserStatus: (userId, status) => {
        console.log ("huhuhuuhuh    ", userId, status)
        const userData = {
            userId: userId,
            
            status: status,
            
        };
        const url = `/user/hod/updateStatus`;
        return axiosClient.put(url, userData);
    },
    importTeacher: (file) => {
        return axiosClient.post('/user/hod/import-teachers', file, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    },
    downloadTeacherTemplate: () => {
        const url = '/user/hod/import-teachers/download-template';
        return axiosClient.get(url, {
            responseType: 'blob',  
        }).then((response) => {
            const filename = 'teacher-template.xlsx';
            saveAs(new Blob([response.data]), filename);
        });
    }
}

export default userAPI; 
