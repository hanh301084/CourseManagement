import axiosClient from "./axiosClient";

const SettingAPI = {
    getClassBlock5Setting: (params) => {
        return axiosClient.get(`/setting/class-block5-setting/${params}`);
    },    
    getClassBlock10Setting: (params) => {
        return axiosClient.get(`/setting/class-block10-setting/${params}`);
    },     
    updateClassSettings(block5SettingDTO, block10SettingDTO, semesterId) {
        return axiosClient.post('/setting/update', {
            block5Setting: block5SettingDTO,
            block10Setting: block10SettingDTO,
            semesterId: semesterId
        });
    },
    getIterationSettings : (semesterId) => {
        return axiosClient.get(`/setting/iterations/${semesterId}`);
    }, 
    getEvuationCriteriaFinal(semesterId) {
        return axiosClient.get(`/setting/iterationFinal?semesterId=${semesterId}`);
    },
    getEvuationCriteriaFinal2(semesterId) {
        return axiosClient.get(`/setting/iterationFinal2?semesterId=${semesterId}`);
    },

    getEvuationCriteria(semesterId, classType) {
        return axiosClient.get(`/setting/iteration?semesterId=${semesterId}&classType=${classType}`);
    },
    getEvuationCriteriaOG(semesterId, classType) {
        return axiosClient.get(`/setting/iterationOG?semesterId=${semesterId}&classType=${classType}`);
    },
    getEvuationCriteriaEachIter(semesterId, classType,iterationId) {
        return axiosClient.get(`/setting/iterationEachIter?semesterId=${semesterId}&classType=${classType}&iterationId=${iterationId}`);
    },
    updateEvaluationCriteria(data) {
        return axiosClient.post(`/setting/iteration/update`, data);
    },
    updateEvaluationCriteriaOne(data) {
        return axiosClient.post(`/setting/criteria/updateOngoing`, data);
    },
    updateEvaluationCriteriaFinal(data) {
        return axiosClient.post(`/setting/criteria/updateFinal`, data);
    },
    updateEvaluationCriteriaFinal2(data) {
        return axiosClient.post(`/setting/criteria/updateFinal2`, data);
    },
    getEvuationCriteriaIter(semesterId, classType,iterationName) {
        return axiosClient.get(`/setting/getEvaluationCriteriaCalculate?semesterId=${semesterId}&classType=${classType}&iterationName=${iterationName}`);
    },

    findEvaluationCriteriaBySemesterId(semesterId){
        return axiosClient.get("/setting/findEvaluationCriteriaBySemesterId/"+semesterId)
    }

};

export default SettingAPI;
