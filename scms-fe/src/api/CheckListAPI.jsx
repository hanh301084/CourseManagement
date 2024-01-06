import axiosClient from "./axiosClient";
import { saveAs } from "file-saver";
const checkListAPI = {
  getAllCheckLists: () => {
    const url = `/checklist/teacher/all`;
    return axiosClient.get(url);
  },

  getAllCheckListItems: () => {
    const url = `/checklistitems/teacher/all`;
    return axiosClient.get(url);
  },
  getAllCheckListItemsById: (param) => {
    return axiosClient.get('/checklistitems/teacher/getById', { params: param });
  },

  createCheckList: (data) => {
    const url = "/checklist/teacher/create";
    return axiosClient.post(url, data);
  },
  createCheckListItems: (data) => {
    const url = "/checklistitems/teacher/create";
    return axiosClient.post(url, data);
  },
  updateCheckList: (data) => {
    const url = "/checklist/teacher/update";
    return axiosClient.put(url, data);
  },
  updateCheckListItems: (data) => {
    const url = "/checklistitems/teacher/update";
    return axiosClient.put(url, data);
  },
  deleteCheckList: (data) => {
    const url = "/checklist/teacher/delete";
    return axiosClient.post(url, data);
  },
  updateCheckListStatus: (checkListId, newStatus) => {
    const url = `/checklist/teacher/updateStatus/${checkListId}`;
    return axiosClient.put(url, null, { params: { status: newStatus } });
  },
  updateCheckListItemStatus: (itemId, newStatus) => {
    const url = `/checklistitems/teacher/updateStatus/${itemId}`;
    return axiosClient.put(url, null, { params: { status: newStatus } });
  },
  importChecklist: (file) => {
    return axiosClient.post('/checklist/teacher/import-checklist', file, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  downloadTemplate: () => {
    const url = '/checklist/teacher/download-template';
    return axiosClient.get(url, {
        responseType: 'blob',  
    }).then((response) => {
        const filename = 'checklist-template.xlsx';
        saveAs(new Blob([response.data]), filename);
    });
},
};
export default checkListAPI;
