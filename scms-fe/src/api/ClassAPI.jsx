import axiosClient from "./axiosClient";
const classAPI = {
  getAllClass: () => {
    const url = `/class/hod/all`;
    return axiosClient.get(url);
  },
  createClass: (data) => {
    const url = "/class/hod/create";
    return axiosClient.post(url, data);
  },
  updateClass: (data) => {
    const url = "/class/hod/update";
    return axiosClient.put(url, data);
  },
  getProjectDetails: (projectId) => {
    return axiosClient.post('/projects/details', { projectId });
  },
  getAllClassByTrainerId: (trainerId, semesterId) => {
    const url = `/class/teacher/allByTrainer/?trainerId=${trainerId}&semesterId=${semesterId}`;
    return axiosClient.get(url);
  },
  getAllClassBySemesterId: (param) => {
    return axiosClient.get('/class/teacher/allBySemester', {  params: param  });
  },
  getAllClassBySemesterIdByReviewer: (param) => {
    return axiosClient.get('/class/reviewer/allBySemester', {  params: param  });
  },
  getAllClassByReviewerId: (reviewerId, semesterId) => {
    const url = `/class/teacher/allByTrainer/?reviewerId=${reviewerId}&semesterId=${semesterId}`;
    return axiosClient.get(url);
  },

  getClassById(data) {
    const url = `/class/student/detail/${data}`;
    return axiosClient.get(url);
  },

  getAllClassByReviewerIdAndSemesterId:(reviewerId, semesterId)=> {
    return axiosClient.get(`/class/reviewer/allByReviewer/?reviewerId=${reviewerId}&semesterId=${semesterId}`)
  }
};
export default classAPI;
