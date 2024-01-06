import axiosClient from "./axiosClient";

class PointEvaluationService {

  getPointEvaluationByTeamIdAndReviewerId(teamId, reviewerId, isResit) {
    return axiosClient.get(`/pointEvaluation/getPointEvaluationByTeamIdAndReviewerId/${teamId}/${reviewerId}/${isResit}`);
  }
  getPointEvaluations(teamId, isResit) {
    return axiosClient.get(`/pointEvaluation/getPointEvaluations/${teamId}/${isResit}`);
  }

  save(isResit,pointEvaluation) {
    return axiosClient.post(`/pointEvaluation/save/${isResit}`, pointEvaluation);
  }
}
const pointEvaluationService = new PointEvaluationService();

export default pointEvaluationService; 
