
import React, { useState } from 'react';
import { Modal, Form, Input, Button } from 'antd';
import '../style.css'
import CheckListService from '../../../api/CheckListAPI';
import Notification from '../../../compornent/notifcation'
const AddCheckList = ({ visible, onClose, onNewCheckListAdded }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handleFormSubmit = async (values) => {
        setLoading(true);
        try {
            CheckListService.createCheckList(values)
                .then((response) => {
                    form.resetFields();
                    Notification('success', 'Checklist Add Successfully!')
                    onClose();
                    onNewCheckListAdded(response.data);
                })
                .catch((error) => {
                    const errorMessage = error.response?.data?.message || 'Failed to Add checklist\'s. Please try again later.';
                    Notification('error', 'Add failed', errorMessage);
                });
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to Add checklist\'s. Please try again later.';
            Notification('error', 'Add failed', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const onCancel = () => {
        form.resetFields();
        onClose();
    };

    return (
        <>
            <Modal
                 title={<span className="centered-title">Add Checklist</span>}
                open={visible} footer={null}
                onCancel={onCancel}>
                <Form layout="vertical" form={form} onFinish={handleFormSubmit}>
                    <Form.Item
                        name="name"
                        label="Name"
                        rules={[{ required: true, message: 'Please input check-list name!' }]}
                    >
                        <Input placeholder="Enter a new checkList name" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" ghost htmlType="submit" loading={loading}>
                            Submit
                        </Button>
                        <Button style={{ marginLeft: '10px' }} danger onClick={onCancel}>
                            Cancel
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};
export default AddCheckList;

