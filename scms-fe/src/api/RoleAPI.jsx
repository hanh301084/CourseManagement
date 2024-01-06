import axiosClient from "./axiosClient";

class RoleService {
  getAllRoles(page = 1, size = 10, keyword = '') {
    const url = `/role/hod/all?page=${page - 1}&size=${size}&keyword=${keyword}`;
    return axiosClient.get(url);
  }
  getActiveRoles() {
    return axiosClient.get('/role/hod/active');
  }
  
  addRole(roleData) {
    return axiosClient.post('/role/hod/add', roleData);
  }

  updateRole( updatedRoleData) {
    return axiosClient.post(`/role/hod/update/`, updatedRoleData);
  }
}

const roleServiceInstance = new RoleService();

export default roleServiceInstance; 
