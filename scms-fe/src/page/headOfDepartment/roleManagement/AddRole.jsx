import React, { useState } from 'react';
import { Modal, Form, Input, Button } from 'antd';
import RoleService from '../../../api/RoleAPI';
import Notification from '../../../compornent/notifcation'
import '../style.css'
const AddRole = ({ visible, onClose, onRoleAdded }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [confirmVisible, setConfirmVisible] = useState(false);
    const [roleData, setRoleData] = useState(null);

    const showConfirmModal = () => {
        setConfirmVisible(true);
    };

    const roleNameValidator = async (_, value) => {
        if (value && value.trim() === '') {
            return Promise.reject('Role name cannot be just spaces.');
        }
        if (/[!@#$^&*]/.test(value)) {
            return Promise.reject('Role name cannot contain special characters like "!@#$".');
        }
        if (value.length > 250) {
            return Promise.reject('Role name cannot exceed 250 characters.');
        }
        return Promise.resolve();
    };

    const handleFormSubmit = async (values) => {
        setLoading(true);
        try {
            const roleName = values.role;

            setRoleData({
                roleName: roleName,
            });

            showConfirmModal();
        } catch (error) {
            Notification('error', 'Error', 'Duplicate Role '+values.roleName+'')
        } finally {
            setLoading(false);
        }
    };

    const handleConfirm = async () => {
        setLoading(true);
        try {
            const response = await RoleService.addRole({
                roleName: roleData.roleName,
                status: 'ACTIVE',
            });
            onRoleAdded(response.data);
            setConfirmVisible(false);
            Notification('success', 'Success','Role add successfully!')
            onClose();
        } catch (error) {
            Notification('error', 'Error', 'Duplicate Role '+roleData.roleName+'')
            setConfirmVisible(false);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setConfirmVisible(false);
    };

    const onCancel = () => {
        form.resetFields();
        onClose();
    };

    return (
        <>
            <Modal
                title="Confirm"
                visible={confirmVisible}
                onOk={handleConfirm}
                onCancel={handleCancel}
            >
                <p>
                    Are you sure you want to add this role: {' '}
                    <span style={{ color: 'Green' }}>{roleData?.roleName}</span>
                </p>
            </Modal>
            <Modal
             title={<span className="centered-title">Add Role</span>}
                visible={visible}
                footer={null}
                onCancel={onCancel}
            >
                <Form layout="vertical" form={form} onFinish={handleFormSubmit}>
                    <Form.Item
                        name="role"
                        label="Role Name"
                        rules={[
                            {
                                validator: roleNameValidator,
                            },
                            { required: true, message: 'Please input role name!' },
                        ]}
                    >
                        <Input placeholder="Enter a new role name" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" ghost htmlType="submit" loading={loading}>
                            Submit
                        </Button>
                        <Button style={{ marginLeft: '10px' }}  danger onClick={onCancel}>
                            Cancel
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};
export default AddRole;
