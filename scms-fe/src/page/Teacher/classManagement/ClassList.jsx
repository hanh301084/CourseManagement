import React, { useState, useEffect } from 'react';
import AppHeader from '../../../compornent/layout/Header';
import AppFooter from '../../../compornent/layout/Footer';
import AppSidebar from '../../../compornent/layout/Teacher/TeacherSidebar';
import ReviewerSidebar from '../../../compornent/layout/Reviewer/ReviewerSidebar';
import { Link, useNavigate } from "react-router-dom";
import ClassService from '../../../api/ClassAPI';
import userAPI from '../../../api/UserAPI';
import SemesterService from '../../../api/SemesterAPI';
import IterationService from '../../../api/IterationAPI';
import ImportModal from '../../../page/Teacher/classManagement/ImportClassModal';
import classUserAPI from '../../../api/ClassUserAPI';
import { Avatar, Card, Row, Col, Layout, Breadcrumb, Select, Button, Modal, Tooltip, Spin, Form, Input } from 'antd';
import { DashboardOutlined, UnorderedListOutlined, ArrowRightOutlined, DownloadOutlined } from '@ant-design/icons';
import MilestoneAPI from '../../../api/MilestoneAPI';
import MilestoneListByClass from './MilestoneListByClass';
import { Helmet } from 'react-helmet';
import openNotificationWithIcon from '../../../compornent/notifcation';
const { Content } = Layout;
const { Meta } = Card;
const { Option } = Select;

const ClassListForTeacher = ({ reviewerId }) => {
    const [classList, setClassList] = useState([]);
    const [isMilestoneModalVisible, setMilestoneModalVisible] = useState(false);
    const [currentMilestone, setCurrentMilestone] = useState({
        status: "ACTIVE",
    });
    const [loading, setLoading] = useState(true)
    const [userProfile, setUserProfile] = useState(null);
    const [activeSemesters, setActiveSemesters] = useState([]);
    const [selectedSemester, setSelectedSemester] = useState(null);
    const [iterationList, setIterationList] = useState([]);
    const [selectedIteration, setSelectedIteration] = useState(1);
    const [totalUsers, setTotalUsers] = useState([]);
    const [selectedClassId, setSelectedClassId] = useState(null);
    const [duration, setDuration] = useState(1);
    const [form] = Form.useForm();
    const [changeFromDate, setChangeFromDate] = useState(false);
    const [modal, contextHolder] = Modal.useModal();
    const [classId, setClassId] = useState();
    const [milestoneByClass, setMilestoneByClass] = useState([]);
    const [lastDay, setLastDay] = useState(null);
    const [semesterIdByClass, setSemesterIdByClass] = useState();
    const [isMilestoneListByClassVisible, setIsMilestoneListByClassVisible] = useState(false);
    const [isImportModalVisible, setImportModalVisible] = useState(false);
    const navigate = useNavigate();
    const [milestoneUpdateCount, setMilestoneUpdateCount] = useState(0);

    const showImportModal = () => {
        setImportModalVisible(true);
    };

    const hideImportModal = () => setImportModalVisible(false);

    useEffect(() => {
        userAPI.userProfile().then(response => {
            setUserProfile(response.data);
        }).catch(error => {
        });
    }, []);
    const refreshMilestoneList = () => {
        MilestoneAPI.getAllMilestonesByClassId(classId)
            .then((response) => {
                setMilestoneByClass(response.data);
            })
            .catch(err => console.error("Fetch milestone by class ", err));
    };

    useEffect(() => {
        if (reviewerId) {
            ClassService.getAllClassByReviewerIdAndSemesterId(reviewerId, selectedSemester)
                .then((response) => {

                    setClassList(response.data);
                    setLoading(false)
                })
                .catch((error) => {
                    setLoading(false)
                });
        } else if (userProfile?.userId && selectedSemester) { // Changed this line
            const trainerId = userProfile.userId;
            const semesterId = selectedSemester;
            ClassService.getAllClassByTrainerId(trainerId, semesterId)
                .then((response) => {
                    setClassList(response.data);
                    setLoading(false)
                })
                .catch((error) => {
                    setLoading(false)
                });
        }
    }, [userProfile, selectedSemester]);

    useEffect(() => {
        Promise.all(
            classList.map((cls) => classUserAPI.getTotalUserOfClass(cls.classId))
        )
            .then((responses) => {
                const totalUsersArray = responses.map((response) =>
                    response && response.data ? response.data : 0
                );
                setTotalUsers(totalUsersArray);

            })
            .catch((error) => {
            });
    }, [classList]);



    useEffect(() => {
        SemesterService.getAllSemesterActive()
            .then((response) => {
                setActiveSemesters(response.data);
            })
            .catch((error) => {
            });
    }, []);

    //curent semester
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
        const currentSemester = getCurrentSemester();
        if (currentSemester) {
            setSelectedSemester(currentSemester.semesterId);
        }
    }, [activeSemesters]);

    useEffect(() => {
        if (semesterIdByClass !== undefined && classId !== undefined) {
            IterationService.getAllIterationBySemesterAndClass(semesterIdByClass, classId)
                .then((response) => {
                    setIterationList(response.data);
                })
                .catch((error) => {
                });
        }
    }, [semesterIdByClass, classId]);

    useEffect(() => {
        if (changeFromDate) {
            const fromDate = new Date(currentMilestone.fromDate);
            const toDate = new Date(fromDate.setDate(fromDate.getDate() + duration * 7));
            const year = toDate.getFullYear();
            const month = (toDate.getMonth() + 1).toString().padStart(2, '0');
            const day = toDate.getDate().toString().padStart(2, '0');
            setCurrentMilestone({ ...currentMilestone, toDate: `${year}-${month}-${day}` });
            setChangeFromDate(false);
        }
    }, [currentMilestone])

    useEffect(() => {
        if (classId !== undefined) {
            MilestoneAPI.getAllMilestonesByClassId(classId)
                .then((response) => {
                    setMilestoneByClass(response.data);
                    if (response.data.length > 0) {
                        setLastDay(response.data[0].toDate)
                    }
                    else {
                        const currentDate = new Date();
                        const year = currentDate.getFullYear();
                        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
                        const day = String(currentDate.getDate()).padStart(2, '0');
                        setLastDay(`${year}-${month}-${day}`);
                    }
                })
                .catch(err => console.error("Fetch milestone by class ", err))
        }
    }, [classId])

    const showMilestoneModal = () => {
        setMilestoneModalVisible(true);
    };

    const getDurationForIteration = (iteration) => {
        const selectedClass = classList.find(cls => cls.classId === classId);
        const isBlock5 = selectedClass && selectedClass.isBlock5 === 'YES';
        // Determine the duration based on whether the class is Block 5 or not
        return isBlock5 ? iteration.durationBlock5 : iteration.duration;
    };


    const handleMilestoneOk = async (values) => {
        let tempLastDay = new Date(values.fromDate);

        for (let index = 0; index < iterationList.length; index++) {
            const iteration = iterationList[index];
            if (index < milestoneByClass.length) {
                // Skip iterations that already have milestones
                continue;
            }

            const durationWeeks = getDurationForIteration(iteration);
            const fromDate = new Date(tempLastDay);
            const toDate = new Date(fromDate);
            toDate.setDate(toDate.getDate() + durationWeeks * 7);
            const selectedClass = classList.find(cls => cls.classId === classId);
            const milestoneData = {
                milestoneName: `Milestone ${index + 1} for ${selectedClass.classCode} `,
                iterationId: { iterationId: iteration.iterationId },
                classId: { classId: classId },
                fromDate: fromDate.toISOString().split('T')[0],
                toDate: toDate.toISOString().split('T')[0],
                status: "ACTIVE",
            };

            try {
                await MilestoneAPI.add(milestoneData);
                tempLastDay = toDate;
            } catch (error) {
                console.error('Error in setting milestone:', error);
                openNotificationWithIcon('error', 'ERROR', 'Error in setting milestones');
                break; // Stop the loop if an error occurs
            }
        }

        // After the loop is complete
        setMilestoneModalVisible(false);
        form.resetFields();
        setMilestoneUpdateCount(count => count + 1);
        openNotificationWithIcon('success', 'Success', 'All milestones set successfully!');
    };


    const handleMilestonClose = () => {
        setMilestoneModalVisible(false);
        form.resetFields();
    }


    const dropdownContainerStyle = {
        display: 'flex',
        alignItems: 'center',
        marginLeft: 20,
        marginTop: 20
    };

    const labelStyle = {
        marginRight: 10,
        fontSize: 16,
        fontWeight: 'bold'
    };

    const dropdownStyle = {
        width: 150
    };

    const handleChangeSemester = (semester) => {
        if (semester !== '') {
            setLoading(true); // Start loading
            setSelectedSemester(semester);
            setLoading(false);
        }
    };

    const handleImportClick = (cls) => {
        setSelectedClassId(cls.classId);
        setSelectedSemester(selectedClassId);
        showImportModal();
    };

    if (loading) {
        return (
            <div className="loading-container">
                <Spin size="large" />
            </div>
        );
    }
    return (
        <Layout style={{ minHeight: '100vh' }}>
            {reviewerId ?
                <ReviewerSidebar /> :
                <AppSidebar />
            }
            <Helmet>
                <title>Class List</title>
            </Helmet>
            <Layout>
                <AppHeader />
                <Breadcrumb
                    items={[
                        {
                            title: <Link to='../teacher/class-list'>Home</Link>
                        },
                        {
                            title: 'Class',
                        },
                        {
                            title: userProfile ? userProfile.fullName : "Loading...",
                        },
                    ]}
                    style={{
                        marginLeft: 140, marginTop: 20
                    }}
                />
                <Content style={{ padding: '0px 120px' }}>
                    <h1 style={{ paddingLeft: 20 }}> Class List</h1>
                    <div style={dropdownContainerStyle}>
                        <span style={labelStyle}>SEMESTER</span>
                        <Select
                            value={selectedSemester}
                            style={dropdownStyle}
                            onChange={handleChangeSemester}
                        >
                            <Option value={0}>All semester</Option>
                            {activeSemesters.map((semester) => (
                                <Option key={semester.semesterId} value={semester.semesterId}>
                                    {semester.semesterName}
                                </Option>
                            ))}
                        </Select>
                    </div>
                    <Modal
                        title="Set Milestone"
                        visible={isMilestoneModalVisible}
                        onCancel={() => {
                            setClassId(undefined);
                            setMilestoneModalVisible(false)
                        }}
                        onClose={handleMilestonClose}
                        footer={null}
                    >
                        {milestoneByClass && milestoneByClass.length > 0 ? (
                            <div>
                                <p>Milestones for this class are already set.</p>
                               
                            </div>
                        ) : (
                            <Form layout="vertical" form={form} onFinish={handleMilestoneOk}>
                                <Form.Item
                                    name="fromDate"
                                    label="Date start"
                                    rules={[{ required: true, message: 'Please input date start!' }]}
                                >
                                    <Input type='date' min={lastDay} />
                                </Form.Item>

                                <Form.Item>
                                    <Button type="primary" htmlType="submit">
                                        Submit
                                    </Button>
                                    <Button style={{ marginLeft: '10px' }}
                                        onClick={() => {
                                            form.resetFields();
                                            setDuration(1)
                                            setMilestoneModalVisible(false)
                                            setClassId(undefined)
                                        }}>
                                        Cancel
                                    </Button>
                                </Form.Item>
                            </Form>
                        )}
                    </Modal>

                    <div style={{ padding: '20px' }}>
                        <Row gutter={[16, 16]}>
                            {classList.map((cls, index) => {
                                const selectedSemesterId = cls.semester.semesterId;
                                return (
                                    <Col key={index} span={8}>
                                        <Card
                                            style={{ width: 250 }}
                                            cover={
                                                <img
                                                    alt={cls.className}
                                                    src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                                                />
                                            }
                                            actions={
                                                reviewerId ?
                                                    [<Tooltip style={{ marginLeft: '10px' }}>
                                                        <Button
                                                            onClick={() => {
                                                                navigate(`/reviewer/class-user-list/${selectedSemesterId}/${cls.classCode}/${cls.classId}`);
                                                            }}
                                                        >Go to Class</Button>
                                                    </Tooltip>
                                                    ]
                                                    : [
                                                        <Tooltip title="Import" style={{ marginLeft: '10px' }}>
                                                            <Button
                                                                icon={<DownloadOutlined />}
                                                                onClick={() => handleImportClick(cls)}
                                                            />
                                                        </Tooltip>,
                                                        <Tooltip title="Go to Class" style={{ marginLeft: '10px' }}>
                                                            <Button
                                                                icon={<ArrowRightOutlined />}
                                                                onClick={() => {
                                                                    navigate(`/teacher/class-user-list/${selectedSemesterId}/${cls.classCode}/${cls.classId}`);
                                                                }}
                                                            />
                                                        </Tooltip>,
                                                        <Tooltip title="Set Milestone" style={{ marginLeft: '10px' }}>
                                                            <Button
                                                                icon={<DashboardOutlined />}
                                                                onClick={() => {
                                                                    setClassId(cls.classId);
                                                                    setSemesterIdByClass(cls.semester.semesterId)
                                                                    showMilestoneModal();
                                                                }}
                                                            />
                                                        </Tooltip>,
                                                        <Tooltip title="Milestone List" style={{ marginLeft: '10px' }}>
                                                            <Button
                                                                icon={<UnorderedListOutlined />}
                                                                onClick={() => {
                                                                    setClassId(cls.classId);
                                                                    setSemesterIdByClass(cls.semester.semesterId)
                                                                    setIsMilestoneListByClassVisible(true);
                                                                }}
                                                            />
                                                        </Tooltip>
                                                    ]}
                                        >
                                            {reviewerId ?
                                                <Meta
                                                    avatar={<Avatar src={userProfile.image} />}
                                                    title={cls.classCode}
                                                    description={`Total Students: ${totalUsers[index]}`}
                                                />
                                                :
                                                <Link to={`/teacher/class-user-list/${selectedSemesterId}/${cls.classCode}/${cls.classId}`}>
                                                    <Meta
                                                        avatar={<Avatar src={userProfile.image} />}
                                                        title={cls.classCode}
                                                        description={`Total Students: ${totalUsers[index]}`}
                                                    />
                                                </Link>
                                            }
                                        </Card>
                                    </Col>
                                );
                            })}
                        </Row>
                    </div>

                </Content>
                <AppFooter />
            </Layout>
            {contextHolder}
            {/* Render the ImportModal component */}
            <ImportModal isVisible={isImportModalVisible} onClose={hideImportModal} selectedClassId={selectedClassId} />
            <MilestoneListByClass
                isVisible={isMilestoneListByClassVisible}
                onCancel={() => setIsMilestoneListByClassVisible(false)}
                classId={classId}
                semesterIdByClass={semesterIdByClass}
                refreshMilestoneList={refreshMilestoneList}
                updateCount={milestoneUpdateCount} // Pass the counter as a prop
            />
        </Layout>

    );
};

export default ClassListForTeacher;
