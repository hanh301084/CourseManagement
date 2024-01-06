import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, DatePicker, InputNumber, Tooltip } from 'antd';
import SemesterService from '../../../api/SemesterAPI';
import openNotificationWithIcon from '../../../compornent/notifcation';
import moment from 'moment';
import { InfoCircleOutlined } from '@ant-design/icons';
import '../style.css'
const EditSemester = ({ visible, onClose, onSemesterEdited, semesterData }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [confirmVisible, setConfirmVisible] = useState(false);
    const [semesterId, setSemesterId] = useState(null);
    const [updatedSemesterData, setUpdatedSemesterData] = useState({});
    const startDate = moment();
    useEffect(() => {
        form.setFieldsValue({
            semesterName: semesterData?.semesterName || '',
            startDate: semesterData?.startDate ? moment(semesterData.startDate, "YYYY-MM-DD") : null,
            endDate: semesterData?.endDate ? moment(semesterData.endDate, "YYYY-MM-DD") : null,
            minOG: semesterData?.minOG || null,
            minOGTotal: semesterData?.minOGTotal || null,
            minFinal: semesterData?.minFinal || null
        });
    }, [semesterData, form]);

    const showConfirmModal = () => {
        setConfirmVisible(true);
    };
    const handleFormSubmit = async (values) => {
        try {
            const updatedData = {
                ...semesterData, // Keep existing data
                ...values, // Update with new form values
                startDate: values.startDate ? values.startDate.format("YYYY-MM-DDTHH:mm:ss") : null,
                endDate: values.endDate ? values.endDate.format("YYYY-MM-DDTHH:mm:ss") : null,
            };
            setConfirmVisible(true);
            setUpdatedSemesterData(updatedData);
        } catch (error) {
            // Handle the error accordingly
        }
    };
    const handleConfirm = async () => {
        setLoading(true);
        try {
            if (updatedSemesterData) {
                const response = await SemesterService.updateSemester(updatedSemesterData);
                openNotificationWithIcon('success', 'Update Successful');
                onSemesterEdited(response.data);
                setConfirmVisible(false);
                onClose();
            }
        } catch (error) {
            const mess = error.response.data.message;
            openNotificationWithIcon('error', 'Error', mess ? mess : 'Update faild! Please try again!');
            setConfirmVisible(false);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setConfirmVisible(false);
    };

    const onCancel = () => {
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
                    Are you sure you want to update this semester?
                </p>
            </Modal>
            <Modal
                title={<span className="centered-title">Edit Semester</span>}
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
                        name="semesterName"
                        label="Semester Name"
                        rules={[{ required: true, message: 'Please input semester name!' }]}
                    >
                        <Input placeholder="Enter semester name" />
                    </Form.Item>
                    <Form.Item
                        name="startDate"
                        label="Start Date"
                        rules={[{ required: true, message: 'Please select start date!' }]}
                    >
                        <DatePicker format={"DD/MM/YYYY"} style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item
                        name="endDate"
                        label="End Date"
                        rules={[{ required: true, message: 'Please select end date!' }]}
                    >
                        <DatePicker format={"DD/MM/YYYY"} style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item
                        name="minOG"
                        label={
                            <span>
                                Min OG&nbsp;
                                <Tooltip title="This is the minimum on-going grade to pass the course.">
                                    <InfoCircleOutlined />
                                </Tooltip>
                            </span>
                        }
                        rules={[{ required: true, message: 'Please input min ongoing grade!' }]}
                    >
                        
                            <InputNumber style={{ width: '100%' }} />
                       
                    </Form.Item>
                    <Form.Item
                        name="minOGTotal"
                        label={
                            <span>
                                Min OG Total&nbsp;
                                <Tooltip title="This is the minimum total on-going grade to pass the course.">
                                    <InfoCircleOutlined />
                                </Tooltip>
                            </span>
                        }
                        rules={[{ required: true, message: 'Please input min ongoing total grade!' }]}
                    >
                            <InputNumber style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item
                        name="minFinal"
                        label={
                            <span>
                                Min Final Grade&nbsp;
                                <Tooltip title="This is the minimum final grade to pass the course.">
                                    <InfoCircleOutlined />
                                </Tooltip>
                            </span>
                        }
                        rules={[{ required: true, message: 'Please input min final grade!' }]}
                    >
                            <InputNumber style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" ghost htmlType="submit" loading={loading}>
                            Save
                        </Button>
                        <Button style={{ marginLeft: '10px' }} type='dashed' danger onClick={onCancel}>
                            Cancel
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default EditSemester;
