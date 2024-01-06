import axiosClient from "./axiosClient";

class FeatureService{
    getFeaturesByPage=(page,size)=>axiosClient.get("/features/getFeatureByPage/"+page+"/"+size);

    addFeature=(feature)=>axiosClient.post("/features/addFeature",feature);

    deleteFeature=(featureId)=>axiosClient.get("/features/deleteFeature/"+featureId)

    searchFeatureByName=(featureName,page,size)=>axiosClient.get("/features/searchFeatureByName/"+featureName+"/"+page+"/"+size)
}

const featureService=new FeatureService();
export default featureService;

