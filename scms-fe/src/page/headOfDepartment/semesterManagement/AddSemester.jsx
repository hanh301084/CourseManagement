import React, { useState } from 'react';
import { Modal, Form, Input, Button, DatePicker, InputNumber, Tooltip } from 'antd';
import SemesterService from '../../../api/SemesterAPI';
import openNotificationWithIcon from '../../../compornent/notifcation';
import '../style.css'
import { InfoCircleOutlined } from '@ant-design/icons';
const AddSemester = ({ visible, onClose, onSemesterAdded, semesters }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [confirmVisible, setConfirmVisible] = useState(false);
    const [semesterData, setSemesterData] = useState(null);

    const showConfirmModal = () => {
        setConfirmVisible(true);
    };

    const semesterNameValidator = async (_, value) => {
        if (value && value.trim() === '') {
            return Promise.reject('Semester name cannot be just spaces.');
        }
        if (/[!@#$^&*]/.test(value)) {
            return Promise.reject('Semester name cannot contain special characters like "!@#$^&*".');
        }
        if (value.length > 250) {
            return Promise.reject('Semester name cannot exceed 250 characters.');
        }
        return Promise.resolve();
    };

    const handleFormSubmit = async (values) => {
        setLoading(true);
    
        try {
            await form.validateFields(['semesterName', 'startDate', 'endDate', 'minOG', 'minOGTotal', 'minFinal']);
        
            const { semesterName, startDate, endDate, minOG, minOGTotal, minFinal } = values;
            if (startDate.isAfter(endDate)) {
                openNotificationWithIcon('error', 'Start date cannot be later than end date.');
                setLoading(false);
                return;
            }
    
            setSemesterData({
                semesterName,
                startDate: startDate.format("YYYY-MM-DDTHH:mm:ss"),
                endDate: endDate.format("YYYY-MM-DDTHH:mm:ss"),
                minOG,
                minOGTotal,
                minFinal,
            });
    
            showConfirmModal();
        } catch (error) {
            // Handle the error accordingly
        } finally {
            setLoading(false);
        }
    };
    
    


    const isDateOverlap = (startDate, endDate, semesters) => {
        const start = new Date(startDate);
        const end = new Date(endDate);

        return semesters.some(semester => {
            const existingStart = new Date(semester.startDate);
            const existingEnd = new Date(semester.endDate);

            return start <= existingEnd && end >= existingStart;
        });
    };


    const handleConfirm = async () => {

        if (isDateOverlap(semesterData.startDate, semesterData.endDate, semesters)) {
            openNotificationWithIcon('error', 'Date overlap detected. Please choose different dates.');
            return;
        }

        try {
            const response = await SemesterService.addSemester({
                semesterName: semesterData.semesterName,
                startDate: semesterData.startDate,
                endDate: semesterData.endDate,
                minOG: semesterData.minOG,
                minOGTotal: semesterData.minOGTotal,
                minFinal: semesterData.minFinal,
                status: 'ACTIVE',
            });
            openNotificationWithIcon('success', 'Success', 'Semester add successfully!');
            onSemesterAdded(response.data);
            setConfirmVisible(false);
            onClose();
        } catch (error) {
            const mess =  error.response.data.message;
            openNotificationWithIcon('error', 'Error', mess ? mess : 'Add faild! Please try again!');
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
                <p>Are you sure you want to add this semester: {semesterData?.semesterName}?</p>
            </Modal>
            <Modal
               title={<span className="centered-title">Add Semester</span>}
                visible={visible}
                footer={null}
                onCancel={onCancel}
                className="custom-modal"  
            >
                <Form layout="vertical" form={form} onFinish={handleFormSubmit}>
                    <Form.Item
                        name="semesterName"
                        label="Semester Name"
                        rules={[
                            { required: true, message: 'Please input semester name!' },
                            { validator: semesterNameValidator },
                        ]}
                    >
                        <Input placeholder="Enter semester name" />
                    </Form.Item>
                    <Form.Item
                        name="startDate"
                        label="Start Date"
                        rules={[{ required: true, message: 'Please select start date!' }]}
                    >
                        <DatePicker format="DD-MM-YYYY" style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item
                        name="endDate"
                        label="End Date"
                        rules={[{ required: true, message: 'Please select end date!' }]}
                    >
                        <DatePicker format="DD-MM-YYYY" style={{ width: '100%' }} />
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
                        rules={[{ required: true, message: 'Please input min ogoing grade!' }]}
                    >
                        <InputNumber  style={{ width: '100%' }} />
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
                        rules={[{ required: true, message: 'Please input min ogoing total grade!' }]}
                    >
                        <InputNumber   style={{ width: '100%' }} />
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
                        <InputNumber   style={{ width: '100%' }} />
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

export default AddSemester;
