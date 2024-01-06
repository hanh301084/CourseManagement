import axiosClient from "./axiosClient";

class SemesterService {
  getAllSemesters(page = 1, size = 10, keyword = '', year = null) {
    let url = `/semester/hod/all?page=${page - 1}&size=${size}&keyword=${keyword}`;
    
    if (year !== null) {
      url += `&year=${year}`;
    }

    return axiosClient.get(url);
  }

  
  getAllYears() {
    const url = `/semester/hod/years`;
    return axiosClient.get(url);
  }
  

  getAllSemesterActive() {
    const url = `/semester/hod/allActive`;
    return axiosClient.get(url);
  }
  getCurrentSemester() {
    const url = `/semester/currentSemester`;
    return axiosClient.get(url);
  }

  addSemester(semesterData) {
    return axiosClient.post('/semester/hod/add', semesterData);
  }

  updateSemester(updatedSemesterData) {
    return axiosClient.post(`/semester/hod/update`, updatedSemesterData);
  }

}
  
const semesterServiceInstance = new SemesterService();

export default semesterServiceInstance; 
