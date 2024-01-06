import React, { useState, useEffect } from 'react';
import AppHeader from '../../../src/compornent/layout/Header';
import AppFooter from '../../../src/compornent/layout/Footer';
import AppSidebar from '../../compornent/layout/Student/StudentSidebar';
import { saveAs } from 'file-saver';
import { Layout, Table, Button, Modal, message, Input, Breadcrumb, Form, Tooltip, Select, Tag } from 'antd';
import { Link, useParams } from "react-router-dom";
import { EditOutlined, DeleteOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { TeamDetailsModal } from '../Student/TeamDetailsModal';
import classUserAPI from '../../../src/api/ClassUserAPI';
import MilestoneAPI from '../../../src/api/MilestoneAPI';
import SettingAPI from '../../../src/api/SettingAPI';
import iterationServiceInstance from '../../../src/api/IterationAPI';
import { OGGradingModal } from './GradingModal';
import TeamService from '../../../src/api/TeamAPI';
import userAPI from '../../../src/api/UserAPI';
import PackageEvaluationAPI from '../../../src/api/PackageEvaluationAPI';
import ProjectBacklockAPI from '../../../src/api/ProjectBacklogAPI';
import classAPI from '../../api/ClassAPI';
const { Content } = Layout;
const { Option } = Select;

const ClassUserList = () => {
    const [classUser, setClassUsers] = useState([]);
    const [newClassUser, setNewClassUser] = useState({});
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);
    const [finalGrade, setFinalGrade] = useState(false);
    const [userProfile, setUserProfile] = useState(null);
    const [isGradingLOCVisible, setIsGradingLOCVisible] = useState(false);
    const [isTeamDetailsModalVisible, setIsTeamDetailsModalVisible] = useState(false);
    const [userIdSelected, setUserIdSelected] = useState(null);
    const [currentMilestone, setCurrentMilestone] = useState(null);
    const [countdown, setCountdown] = useState(0);
    const [selectedClass, setSelectedClass] = useState(null);
    const { selectedSemester, classCode, classId, currentUserId } = useParams();
    const [classes, setClass] = useState([]);
    const [team, setTeam] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedIteration, setSelectedIteration] = useState(null);
    const [classUserId, setClassUserId] = useState();
    const [finalPresentation, setFinalPresentation] = useState({
        projectIntroduction: 0,
        softwareRequirements: 0,
        softwareDesign: 0,
        implementation: 0,
        qa: 0
    });
    const uniqueTeams = [...new Set(classUser.map(user => user.team))];
    const initialTeamGrades = uniqueTeams.map(team => ({ team, presentation1: 0, presentation2: 0 }));
    const [teamGrades, setTeamGrades] = useState(initialTeamGrades);
    useEffect(() => {
        const interval = setInterval(() => {
            setCountdown(prevCountdown => prevCountdown - 1);
        }, 1000);

        if (countdown === 0) {
            clearInterval(interval);
            handleCountdownEnd();
        }
        return () => {
            clearInterval(interval);
        };
    }, [countdown]);
    const formatCountdown = () => {
        const days = Math.floor(countdown / 86400);
        const hours = Math.floor((countdown % 86400) / 3600);
        const minutes = Math.floor((countdown % 3600) / 60);
        const seconds = countdown % 60;
        return `${days.toString().padStart(2, '0')}d-${hours.toString().padStart(2, '0')}h-${minutes.toString().padStart(2, '0')}m-${seconds.toString().padStart(2, '0')}s`;
    };
    const handleCountdownEnd = () => {
        if (classId) {
            MilestoneAPI.getMilestoneByClassId(classId)
                .then((response) => {
                    if (response.data === "") {
                        setCurrentMilestone(null);
                    } else {
                        const now = new Date();
                        const targetDate = new Date(response.data.toDate);
                        targetDate.setHours(0, 0, 0, 0);

                        const timeRemaining = Math.floor((targetDate - now) / 1000);

                        setCountdown(timeRemaining);
                        setCurrentMilestone(response.data);
                    }
                })
                .catch((error) => {
                    console.error("Error fetching milestone:", error);
                });
        }
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
        classUserAPI.getAllClassUserForStudent(classId, studentId)
            .then((response) => {
                setClassUsers(response.data);
            })
            .catch((error) => {
            });
        MilestoneAPI.getMilestoneByClassId(classId)
            .then((response) => {
                if (response.data === "") {
                    setCurrentMilestone(null)
                } else {
                    const now = new Date();
                    const targetDate = new Date(response.data.toDate);
                    targetDate.setHours(0, 0, 0, 0);

                    const timeRemaining = Math.floor((targetDate - now) / 1000);

                    setCountdown(timeRemaining);
                    setCurrentMilestone(response.data);
                }
            })
            .catch((error) => {
                console.error("Error fetching milestone:", error);
            })
        }
    }, [classId, userProfile]);
    useEffect(() => {
        classAPI.getClassById(classId).then(response => {
            setSelectedClass(response.data);
        }).catch(error => {
            console.error("Failed to fetch user profile:", error);
        });
    }, []);
    //--------------------
    //Get evlauation criteria
    const [classType, setClassType] = useState();
    useEffect(() => {
        if (selectedClass && selectedClass.isBlock5 !== undefined) {
            if (selectedClass.isBlock5 === "YES") {
                setClassType("ITERATION_BLOCK5");
            } else {
                setClassType("ITERATION_BLOCK10");
            }
        }
    }, [selectedClass]);
    const [evaluationCriteria, setEvaluationCriteria] = useState([]);
    useEffect(() => {
        if (selectedSemester && classType) {
            SettingAPI.getEvuationCriteria(selectedSemester, classType)
                .then(response => {
                    setEvaluationCriteria(response.data);
                })
                .catch(error => {
                    console.error("Error fetching classes:", error);
                });
        }
    }, [selectedSemester, classType]);

    const [evaluationCriteriaEachIter, setEvaluationCriteriaEachIter] = useState();
    useEffect(() => {
        if (selectedSemester && classType && selectedIteration) {
            SettingAPI.getEvuationCriteriaIter(selectedSemester, classType, selectedIteration)
                .then(response => {
                    setEvaluationCriteriaEachIter(response.data);
                })
                .catch(error => {
                });
        }
    }, [selectedSemester, classType, selectedIteration]);

    const [totalMaxLoc, setTotalMaxLoc] = useState();
    useEffect(() => {
        if (selectedSemester && classType && selectedIteration && selectedUser?.classUserId) {
            ProjectBacklockAPI.getToalLocByClassUser(selectedSemester, classType, selectedIteration, selectedUser?.classUserId)
                .then(response => {
                    setTotalMaxLoc(response.data);
                })
                .catch(error => {
                });
        }
    }, [selectedSemester, classType, selectedIteration, selectedUser?.classUserId]);

    const [packageEvaluation, setPackageEvaluation] = useState();
    useEffect(() => {
        if (selectedSemester && classType && selectedIteration && selectedUser?.classUserId) {
            PackageEvaluationAPI.getPackageWeight(selectedSemester, classType, selectedIteration, selectedUser?.classUserId)
                .then(response => {
                    setPackageEvaluation(response.data);
                })
                .catch(error => {
                });
        }
    }, [selectedSemester, classType, selectedIteration, selectedUser?.classUserId]);

    const showGradingModal = (record, ogIndex) => {
        setEditingIndex(ogIndex);
        setIsGradingLOCVisible(true);
        const selectedIteration = "Iteration " + ogIndex;
        setSelectedUser(record);
        setSelectedIteration(selectedIteration);
    };

    const [srsGrade, setSrsGrade] = useState();
    const [sdsGrade, setSdsGrade] = useState();
    const [locGrade, setLocGrade] = useState(9);
    const handleGradingOK = () => {
        const parsedSrsGrade = parseFloat(srsGrade);
        const parsedSdsGrade = parseFloat(sdsGrade);
        PackageEvaluationAPI.sendOGGrade({
            srsGrade: parsedSrsGrade,
            sdsGrade: parsedSdsGrade,
            locGrade,
            classUserId: selectedUser.classUserId,
            iterationName: selectedIteration,
            semesterId: selectedSemester.semesterId,
            classType: classType,
        })
            .then(() => {
                handleGradingLOCModalClose();
            })
            .catch((error) => {
            });
    };
    const handleGradingLOCModalClose = () => {
        setIsGradingLOCVisible(false);
    };
    const handleTeamDetailsCancel = () => {
        setIsTeamDetailsModalVisible(false);
    };
    const showTeamDetailsModal = (userId) => {
        setUserIdSelected(userId);
        setIsTeamDetailsModalVisible(true);
    };
    const [numberIteration, setNumberIteration] = useState();
    useEffect(() => {
        if (selectedSemester && classType) {
            iterationServiceInstance.getAllIterationActive(selectedSemester, classType)
                .then((response) => {
                    setNumberIteration(response.data.length);
                })
                .catch((error) => {
                });
        }
    }, [selectedSemester, classType]);
  
    const ogColumns = [];
    for (let ogIndex = 1; ogIndex <= numberIteration; ogIndex++) {
        const currentEvaluationCriteria = evaluationCriteria[ogIndex - 1];

        ogColumns.push({
            title: (
                <div key={`OG${ogIndex}`}>
                    <Tooltip title={`This is grade of iteration ${ogIndex} ( ${currentEvaluationCriteria?.evaluationWeight || ''}%)`}>
                        {`OG ${ogIndex}`} <QuestionCircleOutlined />
                    </Tooltip>
                </div>
            ),
            dataIndex: `ongoingEval${ogIndex}`,
            key: `ongoingEval${ogIndex}`,
            render: (text, record, index) => (
                <div key={`OG${ogIndex}-${index + 1}`}>
                    {text !== undefined && text !== null && !isNaN(text) ? (
                        <>
                            {parseFloat(text).toFixed(2)}
                            <Button
                                size="small"
                                onClick={() => showGradingModal(record, ogIndex)}
                                style={{ marginLeft: 5 }}
                            >
                                View
                            </Button>
                        </>
                    ) : (
                        ""

                    )}
                </div>
            ),
            evaluationWeight: currentEvaluationCriteria?.evaluationWeight || '',
        });

    }

    const showFinalPresentationModal = (record, mode) => {
        setClassUserId(record.classUserId)
        setEditingIndex(record.id);
    };

    const showFinalPresentationResitModal = (record, mode) => {

    }

    async function handleFinalPresentationOk() {
        let newClassUser;
        const updatedClassUser = await Promise.all(
            classUser.map(async (user) => {
                if (user.classUserId === classUserId) {
                    const finalPresEval =
                        finalPresentation.projectIntroduction * 0.1 +
                        finalPresentation.softwareRequirements * 0.2 +
                        finalPresentation.softwareDesign * 0.2 +
                        finalPresentation.implementation * 0.4 +
                        finalPresentation.qa;
                    newClassUser = {
                        ...user,
                        finalPresEval: finalPresEval,
                    };
                    try {
                        await classUserAPI.saveClassUser(newClassUser);
                        return newClassUser;
                    } catch (error) {
                        console.error(error);
                    }
                }
                return user;
            })
        );
        setClassUsers(updatedClassUser);
        setFinalPresentation({
            projectIntroduction: 0,
            softwareRequirements: 0,
            softwareDesign: 0,
            implementation: 0,
            qa: 0
        })
    };

    const handleChangeInput = (event) => {
        const { name, value } = event.target;
        setFinalPresentation({ ...finalPresentation, [name]: value });
    }

    const columns = [
        {
            title: 'No',
            key: 'no',
            render: (text, record, index) => index + 1
        },
        {
            title: 'Roll Number',
            dataIndex: 'rollNumber',
            key: 'rollNumber'
        },
        {
            title: 'Student Name',
            dataIndex: 'studentName',
            key: 'studentName'
        },
        {
            title: 'Team',
            dataIndex: 'teamName',
            key: 'teamName',
            render: (text, record) => (
                <Button onClick={() => showTeamDetailsModal(record.userId)}>{text}</Button>
            ),
        },
        ...ogColumns,
        {
            title: 'Total OG',
            dataIndex: 'totalOngoingEval',
            key: 'totalOngoingEval',
            render: (text) => (
                <span>{typeof text === 'number' ? parseFloat(text).toFixed(2) : ''}</span>
            ),
        },
        {
            title: 'Ongoing Passed',
            dataIndex: 'userNotes',
            key: 'userNotes',
            render: (text, record) => (
                record.toTalOg !== null ? (
                    <p style={{ color: text === 'Yes' ? 'green' : 'red' }}>
                        {text}
                    </p>
                ) : null
            ),
        },
        {
            title: 'Final Presentation',
            dataIndex: 'final_pres',
            key: 'final_pres',
            render: (text, record) => (
                <div>
                    {record.finalPresEval !== null ? (
                        <>
                            {record.finalPresEval.toFixed(2)}
                             
                        </>
                    ) : (
                        'N/A'
                    )}
                </div>
            )
        },
        
        {
            title: 'Final Presentation Resit',
            dataIndex: 'finalPresentationResit',
            key: 'finalPresentationResit',
            render: (text, record) => (
                <div>
                    {text !== null && (
                        <>
                            <span>{record.finalPresentationResit.toFixed(2)}</span>
                             
                        </>
                    )}
                </div>
            )
        },
        {
            title: 'Final Grade',
            dataIndex: 'finalGrade',
            key: 'finalGrade',
            render: (text) => (
                <span>{text !== null && typeof text === 'number' ? parseFloat(text).toFixed(2) : ''}</span>
            ),
        },

    ];

    const packageGradeColumns = [
        {
            title: 'Roll Number',
            dataIndex: 'rollNumber',
            key: 'rollNumber'
        },
        {
            title: 'Team',
            dataIndex: 'teamName',
            key: 'teamName'
        },
        {
            title: 'Project Introduction',
            dataIndex: 'projectIntroduction',
            key: 'projectIntroduction',
            render: (text, record) => (
                <Input type='number' name="projectIntroduction" min={0} value={finalPresentation.projectIntroduction} onChange={(event => handleChangeInput(event))}
                />
            )
        },
        {
            title: 'Software Requirements',
            dataIndex: 'softwareRequirements',
            key: 'softwareRequirements',
            render: (text, record) => (
                <Input type='number' name="softwareRequirements" min={0} value={finalPresentation.softwareRequirements} onChange={(event => handleChangeInput(event))} />
            )
        },
        {
            title: 'Software Design',
            dataIndex: 'softwareDesign',
            key: 'softwareDesign',
            render: () => (
                <Input type='number' name="softwareDesign" min={0} value={finalPresentation.softwareDesign} onChange={(event => handleChangeInput(event))} />
            )
        },
        {
            title: 'Implementation',
            dataIndex: 'implementation',
            key: 'implementation',
            render: () => (
                <Input type='number' name="implementation" min={0} value={finalPresentation.implementation} onChange={(event => handleChangeInput(event))} />
            )
        },
        {
            title: 'Q&A',
            dataIndex: 'q&a',
            key: 'q&a',
            render: () => (
                <Input type='number' name="qa" min={0} value={finalPresentation.qa} onChange={(event => handleChangeInput(event))} />
            )
        }
    ];

    const teamGradeColumns = [
        {
            title: 'Team',
            dataIndex: 'team',
            key: 'team'
        },
        {
            title: 'Presentation 1',
            dataIndex: 'presentation1',
            key: 'presentation1',
            render: (text, record, index) => (
                <Input
                    value={text}
                    onChange={(e) => {
                        const updatedGrades = [...teamGrades];
                        updatedGrades[index].presentation1 = Number(e.target.value);
                        setTeamGrades(updatedGrades);
                    }}
                />
            )
        },
        {
            title: 'Presentation 2',
            dataIndex: 'presentation2',
            key: 'presentation2',
            render: (text, record, index) => (
                <Input
                    value={text}
                    onChange={(e) => {
                        const updatedGrades = [...teamGrades];
                        updatedGrades[index].presentation2 = Number(e.target.value);
                        setTeamGrades(updatedGrades);
                    }}
                />
            )
        }
    ];

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
                            title: <Link to='../teacher/class'>Class</Link>,
                        },
                        {
                            title: classCode,
                        },
                    ]}
                    style={{
                        marginLeft: 40, marginTop: 20
                    }}
                />
                <h1 style={{ paddingLeft: '40px' }}> {classCode} - Class Students</h1>
                {
                    currentMilestone != null ?
                        <>
                            <p style={{ padding: 5, margin: 0, paddingLeft: '40px' }}>Iteration Name: {currentMilestone?.nameIteration} | Start Date: {currentMilestone?.fromDate} 00:00:00 | Countdown: {formatCountdown(countdown)}</p>
                        </>
                        : null
                }
                <Content style={{ textAlign: 'left', padding: '0px', paddingLeft: '40px', paddingRight: '40px' }}>
                    <Table
                        dataSource={classUser.map(user => ({ ...user, key: user.classUserId }))}
                        columns={columns}
                        rowKey="key"
                    />
                    <TeamDetailsModal
                        isVisible={isTeamDetailsModalVisible}
                        handleCancel={handleTeamDetailsCancel}
                        userIdSelected={userIdSelected}
                        selectedClass={classId}
                        currentUserId={currentUserId}
                    />
                    <OGGradingModal
                        isVisible={isGradingLOCVisible}
                        handleOk={handleGradingOK}
                        handleCancel={handleGradingLOCModalClose}
                        selectedSemester={selectedSemester}
                        selectedUser={selectedUser}
                        selectedIteration={selectedIteration}
                        evaluationCriteriaEachIter={evaluationCriteriaEachIter}
                        totalMaxLoc={totalMaxLoc}
                        setSrsGrade={setSrsGrade}
                        setSdsGrade={setSdsGrade}
                        setLocGrade={setLocGrade}
                        packageEvaluation={packageEvaluation}
                    />
                </Content>
                <AppFooter />
            </Layout>
        </Layout>
    );
};

export default ClassUserList;
