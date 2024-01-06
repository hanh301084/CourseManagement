import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, InputNumber } from 'antd';
import IterationService from '../../../api/IterationAPI';
import Notification from '../../../compornent/notifcation'
const EditIteration = ({ visible, onClose, onIterationEdited, iterationData }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        form.setFieldsValue({
            iterationName: iterationData?.iterationName || '',
            duration: iterationData?.duration || '',
            durationBlock5: iterationData?.durationBlock5 || '',
        });


    }, [iterationData, form]);



    const handleFormSubmit = async (values) => {
        const updatedData = {
            iterationId: iterationData?.iterationId,
            iterationName: values.iterationName,
            duration: values.duration,
            durationBlock5: values.durationBlock5,
            status: iterationData?.status,
        };

        try {
            const response = await IterationService.updateIteration(updatedData);
            onIterationEdited(response.data);
            onClose();
            Notification('success', 'Success', ' Iteration updated successfully!')
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Failed to Update. Please try again later.';
            Notification('error', 'Update Faild', errorMessage);
        }
    };



    const onCancel = () => {
        onClose();
    };

    return (
        <>

            <Modal
                title={<span className="centered-title">Edit Iteration</span>}
                visible={visible}
                footer={null}
                onCancel={onCancel}
            >
                <Form
                    layout="vertical"
                    form={form}
                    onFinish={handleFormSubmit}
                >
                    <Form.Item
                        name="iterationName"
                        label="Iteration Name"
                        rules={[{ required: true, message: 'Please input iteration name!' }]}
                    >
                        <Input placeholder="Enter iteration name" disabled />
                    </Form.Item>
                    <Form.Item
                        name="duration"
                        label="Duration"
                        rules={[
                            {
                                required: true,
                                validator: (_, value) => {
                                    if (!value) {
                                        return Promise.reject(new Error('Please input duration!'));
                                    }
                                    if (value < 1 || value > 10) {
                                        return Promise.reject(new Error('Duration must be a number between 1 and 10'));
                                    }
                                    return Promise.resolve();
                                }
                            }
                        ]}
                    >
                        <InputNumber placeholder="Enter duration" style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item
                        name="durationBlock5"
                        label="Block 5 Duration"
                        rules={[
                            {
                                required: true,
                                validator: (_, value) => {
                                    if (!value) {
                                        return Promise.reject(new Error('Please input block 5 duration!'));
                                    }
                                    if (value < 1 || value > 10) {
                                        return Promise.reject(new Error('Duration must be a number between 1 and 10'));
                                    }
                                    return Promise.resolve();
                                }
                            }
                        ]}
                    >
                        <InputNumber placeholder="Enter block 5 duration" style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" ghost htmlType="submit" >
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

export default EditIteration;
