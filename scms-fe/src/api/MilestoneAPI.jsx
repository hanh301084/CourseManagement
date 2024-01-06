import axiosClient from "./axiosClient"

const MilestoneAPI={
    add:(milestone)=>{
        return axiosClient.post("/milestone/add",milestone)
    },

    getMilestoneByClassId:(classId)=>{
        return axiosClient.get("/milestone/getMilestoneByClassId/"+classId)
    },

    getAllMilestonesByClassId:(classId)=>{
        return axiosClient.get("/milestone/findAllMilestonesByClassId/"+classId)
    }
}

export default MilestoneAPI;