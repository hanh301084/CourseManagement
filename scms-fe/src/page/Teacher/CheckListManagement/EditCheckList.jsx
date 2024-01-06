import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button } from 'antd';
import CheckListService from '../../../api/CheckListAPI';
import '../style.css'
import Notification from '../../../compornent/notifcation'
const EditCheckList = ({ visible, onClose, onCheckListEdited, CheckListData }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        form.resetFields();
        form.setFieldsValue({
            name: CheckListData?.name || '',
            description: CheckListData?.description || ''
        });
    }, [CheckListData, form]);

    const handleFormSubmit = async (values) => {
        setLoading(true);
        try {
            const updatedData = {
                id: CheckListData?.id,
                name: values.name,
                description: values?.description,
                status: CheckListData?.status
            };
            const response = await CheckListService.updateCheckList(updatedData);
            Notification('success', 'Checklist update successfully!')
            onCheckListEdited(response.data);
            onClose();
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to Update checklist\'s. Please try again later.';
            Notification('error', 'Update failed', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const onCancel = () => {
        form.resetFields();
        onClose();
    };

    return (
        <Modal 
        title={<span className="centered-title">Edit Checklist</span>}
         open={visible} footer={null} onCancel={onCancel}>
            <Form layout="vertical" form={form} onFinish={handleFormSubmit}>
                <Form.Item
                    name="name"
                    label="Check List Name"
                    rules={[{ required: true, message: 'Please input check list name!' }]}
                >
                    <Input placeholder="Enter the updated check list name" />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" ghost loading={loading}>
                        Save
                    </Button>
                    <Button style={{ marginLeft: '10px' }} danger onClick={onCancel}>
                        Cancel
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default EditCheckList;