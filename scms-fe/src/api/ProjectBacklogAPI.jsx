
import axiosClient from "./axiosClient";
import { saveAs } from "file-saver";
const ProjectBacklogAPI = {
    getAllProjectBacklog: (params) => {

        return axiosClient.get('/project-backlog/teacher/all', { params });
    },
    getAllProjectBacklogFroStudent: (params) => {

        return axiosClient.get('/project-backlog/student/all', { params });
    },

    getAllProjectBacklogByProjectId: (params) => {

        return axiosClient.get('/project-backlog/teacher/allByProject', { params });
    },
    importProjectBacklog: (file) => {
        return axiosClient.post('/project-backlog/teacher/import-project-backlog', file, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    },
    updateProjectBacklogs: (combinedDTO) => {
        return axiosClient.put('/project-backlog/update-backlogs', combinedDTO);
    },
    updateProjectBacklogsForTeacher: (combinedDTO) => {
        return axiosClient.put('/project-backlog/teacher/update-backlogs', combinedDTO);
    },
    updateProjectBacklog(projectBacklog) {
        return axiosClient.put('/project-backlog/update-backlog', projectBacklog);
    },
    AddProjectBacklog(projectBacklog) {
        return axiosClient.post('/project-backlog/add-backlog', projectBacklog);
    },
    deleteProjectBacklogs: (functionName, featureId, projectId, screenName) => {
        return axiosClient.delete('/project-backlog/delete', {
            params: {
                functionName,
                featureId,
                projectId,
                screenName
            }
        });
    },
    deleteProjectBacklog: (projectBacklogId) => {
        return axiosClient.delete('/project-backlog/student/delete', { data: { projectBacklogId } });
    },
    getTeamUsers: (teamId) => {
        return axiosClient.get(`/project-backlog/${teamId}/users`);
    },
    updatePkgStatus(projectBacklogId, pkgStatusUpdate) {
        return axiosClient.put(`/project-backlog/${projectBacklogId}/pkg-status`, pkgStatusUpdate);
    },
    downloadProjectWBSTemplate: () => {
        const url = '/project-backlog/hod/import-projectWBS/download-template';
        return axiosClient.get(url, {
            responseType: 'blob',
        }).then((response) => {
            const filename = 'projectWBS-template.xlsx';
            saveAs(new Blob([response.data]), filename);
        });
    },

    evaluateChecklist(projectBacklogId, evaluations, isEdit) {
        return axiosClient.post(`/project-backlog/${projectBacklogId}/evaluate-checklist?isEdit=${isEdit}`, evaluations);
    },
    getChecklistEvaluations: (projectBacklogId, iterationId) => {
        return axiosClient.get(`/project-backlog/evaluation/${projectBacklogId}/${iterationId}`);
    },
    getToalLocByClassUser(semesterId, classType, iterationName, classUserId) {
        return axiosClient.get(`/project-backlog/getToalLocByClassUser?semesterId=${semesterId}&classType=${classType}&iterationName=${iterationName}&classUserId=${classUserId}`);
    },

    editComment: (comment, id) => {
        return axiosClient.post(`/project-backlog/${id}`, { comment });
    },

    updateProjectBacklogByTeacher:(loc,projectBacklogId)=>{
        return axiosClient.get("/project-backlog/updateProjectBacklogByTeacher/"+loc+"/"+projectBacklogId)
    },
    updateProjectBacklogByStudent:(loc,projectBacklogId)=>{
        return axiosClient.get("/project-backlog/updateProjectBacklogByStudent/"+loc+"/"+projectBacklogId)
    }

}
export default ProjectBacklogAPI;