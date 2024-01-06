import axiosClient from "./axiosClient";

class IterationService {
    getAllIterations(page = 1, size = 10, keyword = '') {
        const url = `/iteration/hod/all?page=${page - 1}&size=${size}&keyword=${keyword}`;
        return axiosClient.get(url);
    }

    addIteration(iterationData) {
        return axiosClient.post('/iteration/hod/add', iterationData);
    }

    updateIteration(updatedIterationData) {
        return axiosClient.post(`/iteration/hod/update`, updatedIterationData);
    }
    
    getAllIterationBySemesterAndClass(semesterId,classId){
        const url = `/iteration/getAllIterationBySettingClass/`+semesterId+"/"+classId;
        return axiosClient.get(url);
    }
    getAllIterationActiveLimit(limit){
        const url = `/iteration/active/first/${limit}`;
        return axiosClient.get(url);
    }
    getAllIterationActive(semesterId, classType){
        const url = `/iteration/active?semesterId=${semesterId}&classType=${classType}`;
        return axiosClient.get(url);
    }
    getAllIterationActiveOG(semesterId, classType){
        const url = `/iteration/activeOG?semesterId=${semesterId}&classType=${classType}`;
        return axiosClient.get(url);
    }
}

const iterationServiceInstance = new IterationService();

export default iterationServiceInstance;
