import axiosClient from "./axiosClient";
import { saveAs } from "file-saver";
const classUserAPI = {
  getTotalUserOfClass: (classId) => {
    const url = `/classUser/teacher/totalUser/?classId=${classId}`;
    return axiosClient.get(url);
  },

  getAllClassUser: (classId) => {
    const url = `/classUser/teacher/all/?classId=${classId}`;
    return axiosClient.get(url);
  },

  getAllClassUserForStudent: (classId, studentId) => {
    const url = `/classUser/student/all/?classId=${classId}&studentId=${studentId}`;
    return axiosClient.get(url);
  },

  getAllClassUserFilter: (params) => {
    return axiosClient.get('/classUser/teacher/allFilter/', { params });
  },
  getAllClassUserFilterForReviewer: (params) => {
    return axiosClient.get('/classUser/reviewer/allFilter/', { params });
  },

  importClassUser: (file, selectedClassId, selectedSemester) => {
    const url = `/classUser/teacher/import-classUser/?classId=${selectedClassId}&selectedSemester=${selectedSemester}`;
    return axiosClient.post(url, file, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  importClassUserForHOD: (file, selectedClassId) => {
    const url = `/classUser/hod/import-classUser/?classId=${selectedClassId}`;
    return axiosClient.post(url, file, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  getClassByStudentId: (studentId) => {
    const url = `/classUser/student/class/?studentId=${studentId}`;
    return axiosClient.get(url);
  },

  saveClassUser: (classUser) => {
    return axiosClient.post("/classUser/teacher/create", classUser)
  },

  updateFinalPresEvalByTeamId: (finalPresEval, teamId) => {
    return axiosClient.put("/classUser/updateFinalPresEvalByTeamId/" + finalPresEval + "/" + teamId);
  },

  updateFinalPresentationResitByTeamId: (finalPresentationResit, teamId) => {
    return axiosClient.put("/classUser/updateFinalPresentationResitByTeamId/" + finalPresentationResit + "/" + teamId);
  },
  downloadTeamplateImportStudent: () => {
    const url = '/classUser/teacher/import-student/download-template';
    return axiosClient.get(url, {
      responseType: 'blob',
    }).then((response) => {
      const filename = 'class-student-template.xlsx';
      saveAs(new Blob([response.data]), filename);
    });
  },
  exportClassUserGrades: (classId) => {
    const url = `/classUser/export/${classId}`;
    return axiosClient.get(url, {
      responseType: 'blob', // Important for handling binary data
    });
  },
  updateFinalGrades: (classId) => {
    return axiosClient.put(`/classUser/updateFinalGrades/${classId}`);
  },
  deleteSelectedClassUsers: (classUserIds) => {
    const url = `/classUser/teacher/deleteSelected`;
    return axiosClient.delete(url, { data: classUserIds });
  },

}
export default classUserAPI;
