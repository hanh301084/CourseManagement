import axiosClient from "./axiosClient";

class TeamService {

  getTeamByStudent(studentId, classId) {
    return axiosClient.get(`/team/student/?studentId=${studentId}&classId=${classId}`);
  }
  
  getAllProject(){
    return axiosClient.get(`/team/getAllProject`);
  }

  getAllChecklist(){
    return axiosClient.get(`/team/getAllChecklist`);
  }


  updateTeam(updatedTeamData){
    return axiosClient.post(`/team/update`,updatedTeamData);
  }
  getTeamsByClass (param) {
    return axiosClient.get('/team/teacher/allByClass', {  params: param  });
  }

}
const teamServiceInstance = new TeamService();

export default teamServiceInstance; 
