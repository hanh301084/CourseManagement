import React, { useState } from 'react';
import { Modal, Form, Button, InputNumber } from 'antd';
import IterationService from '../../../api/IterationAPI';
import '../style.css'
const AddIteration = ({ visible, onClose, onIterationAdded, totalElements }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [confirmVisible, setConfirmVisible] = useState(false);
    const [newIterationData, setNewIterationData] = useState({});

    const showConfirmModal = () => {
        setConfirmVisible(true);
    };

    const handleFormSubmit = async (values) => {
        const newData = {
            iterationName: "Iteration " + (totalElements + 1),
            duration: values.duration,
            durationBlock5: values.durationBlock5,
            status: 'ACTIVE', // Assuming default status is ACTIVE
        };
        setNewIterationData(newData);
        showConfirmModal();
    };

    const handleConfirm = async () => {
        setLoading(true);
        try {
            if (newIterationData) {
                const response = await IterationService.addIteration(newIterationData);
                onIterationAdded(response.data);
                form.resetFields();
                setConfirmVisible(false);
                onClose();
            } else {
                console.error('Invalid new iteration data');
            }
        } catch (error) {
            console.error('Error adding iteration:', error);
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
                    {"Are you sure you want to add this iteration: Iteration" + (totalElements + 1) + "?"}
                </p>
            </Modal>
            <Modal
                 title={<span className="centered-title">Add Iteration</span>}
                visible={visible}
                footer={null}
                onCancel={onCancel}
            >
                <p>{"Name: Iteration " + (totalElements + 1)}</p>
                <Form
                    layout="vertical"
                    form={form}
                    onFinish={handleFormSubmit}
                >

                    <Form.Item
                        name="duration"
                        label="Duration(week)"
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
                        <Button type="primary" ghost htmlType="submit" loading={loading}>
                            Add
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

export default AddIteration;
