import axiosClient from "./axiosClient";

class EstimateLocService{

    addEstimateLoc=(estimateLoc)=>axiosClient.post("/estimateLoc/add",estimateLoc);

    getAllTechnologyActive=()=>axiosClient.get("/estimateLoc/getAllActiveTechnology");

    getAllTechnology=()=>axiosClient.get("/estimateLoc/getAllTechnology");

    getAllFunctionEstimateLoc=()=>axiosClient.get("/estimateLoc/getAllEstimateLoc");

    getAllFunctionTypes=()=>axiosClient.get("/estimateLoc/getAllFunctionTypes");

    getAllFunctionTypesActive=()=>axiosClient.get("/estimateLoc/getAllActiveFunctionTypes");

    addTechnology = (technologyData) => axiosClient.post("/estimateLoc/addTechnology", technologyData);

    addFunctionType = (functionTypeData) => axiosClient.post("/estimateLoc/addFunctionType", functionTypeData);

    findEstimateLocByLanguage=(language)=>axiosClient.get("/estimateLoc/findEstimateLocByLanguage/"+language);

    addFunctionEstimateLoc=(functionEstimateLocDTO)=>axiosClient.post("/estimateLoc/add-function-estimate-loc",functionEstimateLocDTO);

    getFunctionEstimateLoc=(projectBacklogId)=>axiosClient.get("/estimateLoc/get-function-estimate-loc/"+projectBacklogId);

    toggleTechnologyStatus = (technologyDTO) => {
        return axiosClient.put("/estimateLoc/toggle-status-technology", technologyDTO);
    };

    toggleFunctionTypeStatus = (functionTypeDTO) => {
        return axiosClient.put("/estimateLoc/toggle-status-function-type", functionTypeDTO);
    };
    findNumberOfLocInputByLanguageAndFunction=(technologyId,functionTypeId)=>axiosClient.get(`/estimateLoc/findNumberOfLocInputByLanguageAndFunction/${technologyId}/${functionTypeId}`);
}

const estimateLocService=new EstimateLocService();

export default estimateLocService;

