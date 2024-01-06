import React, { useState, useEffect } from 'react';
import AppHeader from '../../../src/compornent/layout/Header';
import AppFooter from '../../../src/compornent/layout/Footer';
import AppSidebar from '../../compornent/layout/Student/StudentSidebar';
import { Link } from "react-router-dom";
import userAPI from '../../../src/api/UserAPI';
import SemesterService from '../../../src/api/SemesterAPI';
import classUserAPI from '../../../src/api/ClassUserAPI';
import { Avatar, Card, Row, Col, Layout, Breadcrumb, Select, Button, Modal, Tooltip, message } from 'antd';

const { Content } = Layout;
const { Meta } = Card;
const { Option } = Select;

const ClassListForTeacher = () => {
    const [classList, setClassList] = useState([]);
    const [isMilestoneModalVisible, setMilestoneModalVisible] = useState(false);
    const [currentMilestone, setCurrentMilestone] = useState({
        from_date: '',
        to_date: '',
        iteration: null,
    });
    const [userProfile, setUserProfile] = useState(null);
    const [activeSemesters, setActiveSemesters] = useState([]);
    const [selectedSemester, setSelectedSemester] = useState(null);
    const [selectedIteration, setSelectedIteration] = useState(1);
    const [totalUsers, setTotalUsers] = useState([]);
    const [selectedClassId, setSelectedClassId] = useState(null);
    const [isImportModalVisible, setImportModalVisible] = useState(false);
    const showImportModal = () => {
        setImportModalVisible(true);
    };
    useEffect(() => {
        userAPI.userProfile().then(response => {
            setUserProfile(response.data);
        }).catch(error => {
            console.error("Failed to fetch user profile:", error);
        });
    }, []);

    useEffect(() => {
        if (userProfile && userProfile.userId) {
            const studentId = userProfile.userId;
            // const semesterId = selectedSemester;
            classUserAPI.getClassByStudentId(studentId)
                .then((response) => {
                    setClassList(response.data);
                })
                .catch((error) => {
                    console.error('Error fetching class list:', error);
                });
        }
    }, [userProfile]);


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
                console.error("Failed to fetch data:", error);
            });
    }, [classList]);

    useEffect(() => {
        SemesterService.getAllSemesterActive()
            .then((response) => {
                setActiveSemesters(response.data);
            })
            .catch((error) => {
                console.error('Error fetching active semesters:', error);
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

    const showMilestoneModal = () => {
        setMilestoneModalVisible(true);
    };

    const handleMilestoneOk = () => {
        setMilestoneModalVisible(false);
    };

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
            setSelectedSemester(semester);
        }
    };

    const handleChangeIteration = (iteration) => {
        setSelectedIteration(iteration);
        setCurrentMilestone({ ...currentMilestone, iteration });
    };

    const handleImportClick = (cls) => {
        setSelectedClassId(cls.classId);
        showImportModal();
    };

    let currentUserId = userProfile?.userId;
    return (
        <Layout style={{ minHeight: '100vh' }}>
            <AppSidebar />
            <Layout>
                <AppHeader />
                <Breadcrumb
                    items={[
                        {
                            title: <Link to='../teacher/'>Home</Link>
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
                    <h1 style={{paddingLeft: 20}}> Class List</h1>
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

                 

                    <div style={{ padding: '20px' }}>
                        <Row gutter={[16, 16]}>
                            {classList.map((cls, index) => (
                                <Col key={index} span={8}>
                                    <Card
                                        style={{ width: 250 }}
                                        cover={
                                            <img
                                                alt={cls.className}
                                                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                                            />
                                        }
                                        actions={[
                                            <Link style={{ color: 'blue' }} to={`/student/class-user-list/${selectedSemester}/${cls.classCode}/${cls.classId}/${currentUserId}`}>
                                                <Button ghost type='primary'>Go to Class</Button>
                                            </Link>,
                                        ]}
                                    >
                                        <Link to={`/student/class-user-list/${selectedSemester}/${cls.classCode}/${cls.classId}/${currentUserId}`}>
                                            <Meta
                                                avatar={<Avatar src={userProfile.image} />}
                                                title={cls.classCode}
                                                description={`Total Students: ${totalUsers[index]}`}
                                                
                                            />
                                        </Link>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </div>
                </Content>
                <AppFooter />
            </Layout>
        </Layout>
    );
};

export default ClassListForTeacher;
