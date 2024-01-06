import React, { useEffect, useState } from 'react';
import MilestoneAPI from '../../../api/MilestoneAPI';
import { EditOutlined } from '@ant-design/icons';
import { Table, Row, Col, Select, Button, Modal, Form, Input } from 'antd';
import IterationService from '../../../api/IterationAPI';
import formatDate from '../../../utils/dateTimeFormat';
import Notification from '../../../compornent/notifcation'
import userAPI from '../../../api/UserAPI';
import ClassService from '../../../api/ClassAPI';
import SemesterService from '../../../api/SemesterAPI';
const MilestoneListByClass = ({ classId, onCancel, isVisible, semesterIdByClass, updateCount }) => {
    const [milestoneList, setMilestoneList] = useState([]);
    const [isEditMilestoneVisible, setIsEditMilestoneVisible] = useState(false)
    const [form] = Form.useForm();
    const [duration, setDuration] = useState(null);
    const [milestoneEdit, setMilestoneEdit] = useState(null);
    const [iterationList, setIterationList] = useState([]);
    const [newStartDate, setNewStartDate] = useState(null);
    const [iterationIdOld, setIterationIdOld] = useState();
    const [classList, setClassList] = useState([]);
    const [userProfile, setUserProfile] = useState(null);
    const [selectedSemester, setSelectedSemester] = useState(null);
    const [activeSemesters, setActiveSemesters] = useState([]);
    const [endDate, setEndDate] = useState(null);
    useEffect(() => {
        if (classId !== undefined) {
            MilestoneAPI.getAllMilestonesByClassId(classId)
                .then(response => {
                    setMilestoneList(response.data);
                })
                .catch(err => console.error("Fetching milestone list failed : ", err));
        }
    }, [classId, updateCount]);
    const calculateEndDate = (startDate) => {
        if (!startDate || !duration) return;

        const start = new Date(startDate);
        const end = new Date(start.getTime() + duration * 7 * 24 * 60 * 60 * 1000);

        // Format the date to yyyy-MM-dd
        const year = end.getFullYear();
        const month = (end.getMonth() + 1).toString().padStart(2, '0');
        const day = end.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    const getCurrentSemester = () => {
        const currentDate = new Date();
        for (const semester of activeSemesters) {
            const startDate = new Date(semester.startDate);
            const endDate = new Date(semester.endDate);
            if (currentDate >= startDate && currentDate <= endDate) {
                return semester;
            }
        }
        return null;
    };

    useEffect(() => {
        SemesterService.getAllSemesterActive()
            .then((response) => {
                setActiveSemesters(response.data);
            })
            .catch((error) => {
            });
    }, []);
    useEffect(() => {
        const currentSemester = getCurrentSemester();

        if (currentSemester) {
            setSelectedSemester(currentSemester.semesterId);
        }
    }, [activeSemesters]);

    useEffect(() => {
        if (userProfile && userProfile.userId && selectedSemester) {
            const trainerId = userProfile.userId;
            const semesterId = selectedSemester;
            ClassService.getAllClassByTrainerId(trainerId, semesterId)
                .then((response) => {
                    setClassList(response.data);
                })
                .catch((error) => {
                    console.error('Error fetching classes:', error);
                });
        }
    }, [userProfile, selectedSemester]);

    useEffect(() => {
        userAPI.userProfile().then(response => {
            setUserProfile(response.data);
        }).catch(error => {
        });
    }, []);
    useEffect(() => {
        if (semesterIdByClass !== undefined && classId !== undefined) {
            IterationService.getAllIterationBySemesterAndClass(semesterIdByClass, classId)
                .then((response) => {
                    setIterationList(response.data)
                })
                .catch((error) => {
                    console.error('Error fetching Iterations:', error);
                });
        }
    }, [semesterIdByClass, classId]);



    const handleMouseEnter = () => {
        document.body.style.cursor = 'pointer';
    };

    const handleMouseLeave = () => {
        document.body.style.cursor = 'auto';
    };

    useEffect(() => {
        if (classId !== undefined) {
            MilestoneAPI.getAllMilestonesByClassId(classId)
                .then(respone => {
                    setMilestoneList(respone.data);
                })
                .catch(err => console.error("Fetching milestone list failed : ", err))
        }
    }, [classId])

    const handleEditOk = (values) => {
        const endDate = calculateEndDate(values.fromDate);
        const updatedMilestone = { ...milestoneEdit, fromDate: values.fromDate, toDate: endDate };
        MilestoneAPI.add(updatedMilestone)

            .then((response) => {
                MilestoneAPI.getAllMilestonesByClassId(classId)
                    .then(respone => {
                        setMilestoneList(respone.data);
                        setMilestoneEdit({ ...milestoneEdit, toDate: endDate });
                    })
                    .catch(err => console.error("Fetching milestone list failed : ", err))
                setIsEditMilestoneVisible(false);
                setMilestoneEdit(null);
                setDuration(null);
                setNewStartDate(null);
                form.resetFields();
                Notification('success', "Success", 'Milestone update successfully!')
            })
            .catch(error => {
                const errorMessage = error.response?.data?.error || 'Failed to Update. Please try again later.';
                Notification('error', 'Update Faild', errorMessage);
            });
    }


    const checkStartDate = (value) => {
        const newStartDate = new Date(value);
        const newEndDate = new Date(newStartDate.getTime() + duration * 7 * 24 * 60 * 60 * 1000);

        // Find the index of the current editing milestone in the list
        const currentIndex = milestoneList.findIndex(milestone => milestone.milestoneId === milestoneEdit.milestoneId);

        // Check against the previous milestone's end date
        if (currentIndex > 0) {
            const previousMilestoneEndDate = new Date(milestoneList[currentIndex - 1].toDate);
            if (newStartDate <= previousMilestoneEndDate) {
                return Promise.reject("Start date must be after the end date of the previous milestone.");
            }
        }

        // Check against the next milestone's start date
        if (currentIndex < milestoneList.length - 1) {
            const nextMilestoneStartDate = new Date(milestoneList[currentIndex + 1].fromDate);
            if (newEndDate >= nextMilestoneStartDate) {
                return Promise.reject("End date must be before the start date of the next milestone.");
            }
        }

        // If all checks pass, update the milestone's dates
        setMilestoneEdit({ ...milestoneEdit, fromDate: value, toDate: newEndDate.toISOString().split('T')[0] });
        return Promise.resolve();
    };


    const columns = [
        {
            title: 'No',
            dataIndex: 'index',
            key: 'index',
            render: (text, record, index) => milestoneList.findIndex(milestone => milestone.milestoneId === record.milestoneId) + 1,
        },
        {
            title: 'Name Iteration',
            dataIndex: 'nameIteration',
            key: 'nameIteration',
        },
        {
            title: 'Start Date',
            dataIndex: 'fromDate',
            key: 'fromDate',
            render: (fromDate) => formatDate(fromDate),
        },
        {
            title: 'End Date',
            dataIndex: 'toDate',
            key: 'toDate',

            render: (toDate) => formatDate(toDate),
        },
        {
            title: 'Actions',
            key: 'actions',
            dataIndex: 'actions',
            render: (_, { milestoneId, milestoneName, iterationId, classId, fromDate, toDate, status, nameIteration }) => {
                const selectedClass = classList.find(cls => cls.classId === classId);

                // Check if the class is in use
                const isClassInUse = selectedClass && selectedClass.is_use === 'YES';

                return (
                    <>
                        {isClassInUse ? (
                            <EditOutlined
                                style={{ fontSize: '20px', color: 'grey' }}
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                                disabled
                            />
                        ) : (
                            <EditOutlined
                                style={{ fontSize: '20px', color: 'green' }}
                                onClick={async () => {
                                    const iteration = iterationList.find(iteration => iteration.iterationId === iterationId);
                                    const isBlock5 = selectedClass && selectedClass.isBlock5 === 'YES';
                                    const chosenDuration = isBlock5 ? iteration.durationBlock5 : iteration.duration;
                                    setDuration(chosenDuration);
                                    setIsEditMilestoneVisible(true);
                                    setMilestoneEdit({ milestoneId, milestoneName, iterationId: { iterationId: iterationId }, classId: { classId: classId }, fromDate, toDate, status, nameIteration });
                                    setIterationIdOld(iterationId);
                                }}
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                            />
                        )}
                    </>
                );
            },
        }
    ];


    return (
        <>
            <Modal title="Milestone List By Class" open={isVisible} footer={null} onCancel={onCancel} width={800}>
                {milestoneList &&
                    <Table
                        dataSource={milestoneList}
                        columns={columns}
                        rowKey="milestoneId"
                        style={{ marginTop: '20px' }}
                        pagination={false}
                    />
                }
            </Modal>
            <Modal
                title="Edit Milestone"
                visible={isEditMilestoneVisible}
                onCancel={() => {
                    setIsEditMilestoneVisible(false);
                    setMilestoneEdit(null);
                    setDuration(null);
                    setNewStartDate(null);
                    form.resetFields();
                }}
                footer={null}
            >
                {milestoneEdit !== null &&
                    <Form layout="vertical" form={form} onFinish={handleEditOk}>
                        <Row gutter={[5, 5]}>
                            <Col span={12}>

                                <Form.Item
                                    name="iterationName"
                                    label="Iteration Name"
                                >
                                    {milestoneEdit.nameIteration}
                                </Form.Item>
                            </Col>

                            <Col span={12}>
                                <Form.Item
                                    name="duration"
                                    label={"Duration "}
                                >
                                    {duration}
                                </Form.Item>
                            </Col>

                        </Row>
                        <Form.Item
                            name="fromDate"
                            label="Start Date"
                            rules={[
                                { required: true, message: "Please input the start date!" },
                                {
                                    validator: (_, value) => checkStartDate(value),
                                },
                            ]}
                        >
                            <Input
                                type='date'
                                min={new Date().toISOString().split("T")[0]}
                                onChange={(e) => form.setFieldsValue({ toDate: calculateEndDate(e.target.value) })}
                            />
                        </Form.Item>
                        <Form.Item
                            name="toDate"
                            label="End Date"
                        >
                            <Input
                                type='text'
                                value={endDate} // Use endDate as the value
                                disabled // Disable input for end date
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Submit
                            </Button>
                            <Button style={{ marginLeft: '10px' }}
                                onClick={() => {
                                    setIsEditMilestoneVisible(false);
                                    setMilestoneEdit(null);
                                    form.resetFields();
                                    setDuration(null);
                                    setNewStartDate(null);
                                }}>
                                Cancel
                            </Button>
                        </Form.Item>
                    </Form>
                }
            </Modal >
        </>
    )
}
export default MilestoneListByClass;