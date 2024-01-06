import axiosClient from "./axiosClient"

const PackageEvaluationAPI ={
    getPackageEvaluationByClassUserId:() =>{
        return axiosClient.get("/packageEvaluation/getPackageEvaluationByClassUserId");
    },
    sendOGGrade:(ongoingDataDTO) =>{
        return axiosClient.post('/packageEvaluation/sendOGGrade',ongoingDataDTO);
    },
    getupdateOgGrade:() =>{
        return axiosClient.get("/packageEvaluation/getupdateOgGrade");
    },
    getPackageWeight(semesterId, classType,iterationName,classUserId) {
        return axiosClient.get(`/packageEvaluation/getPackageWeight?semesterId=${semesterId}&classType=${classType}&iterationName=${iterationName}&classUserId=${classUserId}`);
    },

    savePresentation(presentation,classUserId,userId){
        return axiosClient.get(`/packageEvaluation/savePresentation?presentation=${presentation}&classUserId=${classUserId}&userId=${userId}`);
    },

    savePresentationResit(presentation,classUserId,userId){
        return axiosClient.get(`/packageEvaluation/savePresentationResit?presentation=${presentation}&classUserId=${classUserId}&userId=${userId}`);
    },

    calculatePresentationByClassUserId(classUserId,isPresentation,teamId,semesterId,classType){
        return axiosClient.get(`/packageEvaluation/calculatePresentationByClassUserId?classUserId=${classUserId}&isPresentation=${isPresentation}&teamId=${teamId} &semesterId=${semesterId}&classType=${classType}`);
    }

}
export default PackageEvaluationAPI;