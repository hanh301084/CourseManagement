import axiosClient from "./axiosClient";
import { saveAs } from "file-saver";
const ProjectAPI = {
    // Fetch all projects with optional pagination, sorting, and search parameters
    getAllProjects: (params) => {
        return axiosClient.get('/projects/teacher/all', { params });
    },
    getAllProjects4Student: (params) => {
        return axiosClient.get('/projects/student/all', { params });
    },

    // Create a new project
    createProject: (projectDTO) => {
        return axiosClient.post('/projects/teacher/create', projectDTO);
    },

    // Update a project
    updateProject: (projectDTO) => {
        return axiosClient.put('/projects/teacher/update', projectDTO);
    },
    updateProject4Student: (projectDTO) => {
        return axiosClient.put('/projects/student/update', projectDTO);
    },

    // Delete a project
    deleteProject: (projectId) => {
        return axiosClient.delete(`/projects/teacher/delete`, { data: { projectId } });
    },
    deleteProject4Student: (projectId) => {
        return axiosClient.delete(`/projects/student/delete`, { data: { projectId } });
    },
    // Import Project from an Excel file
    importProject: (file) => {
        return axiosClient.post('/projects/teacher/import-project', file, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    },
    getProjectDetails: (id) => {
        return axiosClient.get(`/projects/details?id=${id}`);
    },
    downloadProjectTemplate: () => {
        const url = '/projects/hod/import-project/download-template';
        return axiosClient.get(url, {
            responseType: 'blob',  
        }).then((response) => {
            const filename = 'project-template.xlsx';
            saveAs(new Blob([response.data]), filename);
        });
    },
    activateProject: (projectId) => {
        return axiosClient.put(`/projects/teacher/activate`, { projectId });
    },

    // Deactivate a project
    deactivateProject: (projectId) => {
        return axiosClient.put(`/projects/teacher/deactivate`, { projectId });
    },
};

export default ProjectAPI;
