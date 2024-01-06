import React, { useState , useEffect} from 'react';
import { Modal, Checkbox } from 'antd';
import roleServiceInstance from '../../../api/RoleAPI';
import '../style.css'
const ChangeRoleModal = ({ isVisible, user, onClose, onRoleChange }) => {
    const [selectedRoles, setSelectedRoles] = useState(user ? user.roleNames : []);
    const [roles, setRoles] = useState([]);

    useEffect(() => {
        roleServiceInstance.getActiveRoles()
            .then(response => {
                setRoles(response.data);  
            })
            .catch(error => {
                console.error("Failed to fetch roles:", error);
            });
    }, []); 

    useEffect(() => {
        if (user) {
            setSelectedRoles(user.roleNames);
        }
    }, [user]);

    const handleOk = () => {
        onRoleChange(selectedRoles);
        onClose();
    };

    return (
        <Modal
        title={<span className="centered-title">Change Role</span>}
            visible={isVisible}
            onOk={handleOk}
            onCancel={onClose}
        >
            <h3>Please choose the role to update</h3>
            <Checkbox.Group
                options={roles.map(role => role.roleName)}
                value={selectedRoles}
                onChange={setSelectedRoles}
            />
        </Modal>
    );
};
export default ChangeRoleModal;