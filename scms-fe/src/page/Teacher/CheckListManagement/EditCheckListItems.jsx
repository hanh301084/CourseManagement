import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button } from 'antd';
import CheckListService from '../../../api/CheckListAPI';
import '../style.css'
import Notification from '../../../compornent/notifcation'
import TextArea from 'antd/es/input/TextArea';
const EditCheckItemsList = ({ visible, onClose, onCheckListEdited, CheckListItemsData }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [updatedCheckListItemsData, setUpdatedCheckListItemsData] = useState({});


    useEffect(() => {

        form.resetFields();
        form.setFieldsValue({
            id: CheckListItemsData?.key,
            name: CheckListItemsData?.name || '',
            description: CheckListItemsData?.description || '',
            checkList: CheckListItemsData?.checkList,
            status: CheckListItemsData?.status || ''
        });
        setUpdatedCheckListItemsData(CheckListItemsData || {});
    }, [CheckListItemsData, form]);
    const handleFormSubmit = async (values) => {
        try {
            const updatedData = {
                id: CheckListItemsData?.key,
                name: values.name,
                description: values?.description,
                checkList: CheckListItemsData?.checkList,
                status: CheckListItemsData?.status
            };

            // Make the API call with updatedData directly
            const response = await CheckListService.updateCheckListItems(updatedData);
            onCheckListEdited(response.data);
            Notification('success', 'Successfully', 'Checklist Item update successfully!');

            // Update the state if needed for other purposes
            setUpdatedCheckListItemsData(updatedData);
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to Update checklist item. Please try again later.';
            Notification('error', 'Update failed', errorMessage);
        }
    };

    const onCancel = () => {
        form.resetFields();
        onClose();
    };

    return (
        <>
            <Modal
                title={<span className="centered-title">Edit Check List Itemt</span>}
                open={visible}
                footer={null}
                onCancel={onCancel}
            >
                <Form layout="vertical" form={form} onFinish={handleFormSubmit}>

                    <Form.Item
                        name="name"
                        label="Checklist Item Name"
                        rules={[{ required: true, message: 'Please input check list name!' }]}
                    >
                        <Input placeholder="Enter the updated check list name" />
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label="Check List Note"
                    >
                        <TextArea placeholder="Enter the updated check list note" style={{height:250}} />
                    </Form.Item>
                    <Form.Item>
                        <Button ghost type="primary" htmlType="submit" loading={loading}>
                            Save
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

export default EditCheckItemsList;
