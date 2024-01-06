import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button } from 'antd';
import RoleService from '../../../api/RoleAPI';
import Notification from '../../../compornent/notifcation'
import '../style.css'
const EditRole = ({ visible, onClose, onRoleEdited, roleData }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [confirmVisible, setConfirmVisible] = useState(false);
    const [updatedRoleData, setUpdatedRoleData] = useState({});

    useEffect(() => {
        form.resetFields();
        form.setFieldsValue({
            role: roleData?.roleName || '',
        });
        setUpdatedRoleData(roleData || {});
    }, [roleData, form]);

    const showConfirmModal = () => {
        setConfirmVisible(true);
    };

    const roleNameValidator = async (_, value) => {
        if (value && value.trim() === '') {
            return Promise.reject('Role name cannot be just spaces.');
        }
        if (/[!@#$^&*]/.test(value)) {
            return Promise.reject('Role name cannot contain special characters like "!@#$^&*".');
        }
        if (value.length > 250) {
            return Promise.reject('Role name cannot exceed 250 characters.');
        }
        return Promise.resolve();
    };

    const handleFormSubmit = async (values) => {
        try {
            await roleNameValidator(null, values.role);

            const updatedData = {
                roleId: roleData?.roleId,
                roleName: values.role,
                status: roleData?.status,
            };
            setUpdatedRoleData(updatedData);
            showConfirmModal();
        } catch (error) {
            console.error('Error updating role:', error);
        }
    };

    const handleConfirm = async () => {
        setLoading(true);
        try {
            if (updatedRoleData) {
                const response = await RoleService.updateRole(updatedRoleData);
                onRoleEdited(response.data);
                Notification('success', 'Success','Role update successfully!')
                setConfirmVisible(false);
                onClose();
            }
        } catch (error) {
            console.error('Error updating role:', error);
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
                    Are you sure you want to update this role: {' '}
                    <span style={{ color: 'green' }}>{roleData?.roleName}</span>
                    {' to '}
                    <span style={{ color: 'blue' }}>{form.getFieldValue('role')}</span>
                </p>
            </Modal>
            <Modal
                 title={<span className="centered-title">Edit Role</span>}
                visible={visible}
                footer={null}
                onCancel={onCancel}
            >
                <Form layout="vertical" form={form} onFinish={handleFormSubmit}>
                    <Form.Item
                        name="role"
                        label="Role Name"
                        rules={[
                            { validator: roleNameValidator },
                            { required: true, message: 'Please input role name!' },
                        ]}
                    >
                        <Input placeholder="Enter the updated role name" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" ghost htmlType="submit" loading={loading}>
                            Save
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

export default EditRole;
