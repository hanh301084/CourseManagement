import axiosClient from "./axiosClient";
const FunctionCommentAPI = {
    // Fetch all projects with optional pagination, sorting, and search parameters
    findFunctionCommnet: (params) => {
        return axiosClient.get('/function-comment/find', { params });
    },
    addOrEditComment: (data) => {
        return axiosClient.post('/function-comment/add-edit', data);
    },
    fetchComments: (backlogId) => {
        return axiosClient.get('/function-comment/findByBacklog', { params: { backlogId } });
    }
};

export default FunctionCommentAPI;
