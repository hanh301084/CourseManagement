import React, { useState, useEffect } from 'react';
import AppHeader from '../../compornent/layout/Header';
import AppFooter from '../../compornent/layout/Footer';
import AppSidebar from '../../compornent/layout/Reviewer/ReviewerSidebar';
import { saveAs } from 'file-saver';
import { Layout, Table, Button, Modal, message, Input, Breadcrumb, Form, Tooltip, Select, Tag, notification } from 'antd';
import { Link, useParams } from "react-router-dom";
import { DeleteOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { UploadDownloadButtons } from '../Teacher/classUserManagement/UploadDownloadButtons';
import { TeamDetailsModal } from '../Teacher/classUserManagement/TeamDetailsModal';
import { OGGradingModal } from '../Teacher/classUserManagement/GradingModal';
import classUserAPI from '../../api/ClassUserAPI';
import MilestoneAPI from '../../api/MilestoneAPI';
import SettingAPI from '../../api/SettingAPI';
import NotificationPopup from '../../compornent/notifcation'
import iterationServiceInstance from '../../api/IterationAPI';
import classAPI from '../../api/ClassAPI';
import SemesterService from '../../api/SemesterAPI';
import TeamService from '../../api/TeamAPI';
import PackageEvaluationAPI from '../../api/PackageEvaluationAPI';
import { FinalPresentationModal } from "../Teacher/classUserManagement/FinalPresentationModal";
import openNotificationWithIcon from '../../compornent/notifcation';
import ProjectBacklockAPI from '../../api/ProjectBacklogAPI';
import userAPI from '../../api/UserAPI';
import { Helmet } from 'react-helmet';
import pointEvaluationService from '../../api/PointEvaluationAPI';
import formatDate from '../../utils/dateTimeFormat';
const { Content } = Layout;
const { Option } = Select;

const ClassUserList = () => {
    const [classUser, setClassUsers] = useState([]);
    const [editingIndex, setEditingIndex] = useState(null);
    const [isGradingLOCVisible, setIsGradingLOCVisible] = useState(false);
    const [isTeamDetailsModalVisible, setIsTeamDetailsModalVisible] = useState(false);
    const [userIdSelected, setUserIdSelected] = useState(null);
    const [currentMilestone, setCurrentMilestone] = useState(null);
    const [countdown, setCountdown] = useState(0);
    const [selectedSemester, setSelectedSemester] = useState(null);
    const [selectedClass, setSelectedClass] = useState(null);
    const [selectedTeam, setSelectedTeam] = useState(null);
    const { selectedSemesterId, classCode, classId } = useParams();
    const [iterationCount, setIterationCount] = useState(0);
    const [semesters, setSemesters] = useState([]);
    const [classes, setClass] = useState([]);
    const [team, setTeam] = useState([]);

    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedIteration, setSelectedIteration] = useState(null);
    const [classUserId, setClassUserId] = useState();
    const [finalPresentationMode, setFinalPresentationMode] = useState('grade');
    const [isFinalPresentationModalVisible, setIsFinalPresentationModalVisible] = useState(false);
    const [finalPresentation, setFinalPresentation] = useState({
        projectIntroduction: null,
        finalSRSWeight: null,
        finalSDSWeight: null,
        projectImplementation: null,
        qandA: null,
        teamWorkingWeight: null
    });
    const uniqueTeams = [...new Set(classUser.map(user => user.team))];
    const [finalPresentationResit, setFinalPresentationResit] = useState(null);
    const [evaluationCriteriaBySemester, setEvaluationCriteriaBySemester] = useState();
    const [api, contextHolder] = notification.useNotification();
    const [teamId, setTeamId] = useState();
    const [userProfile, setUserProfile] = useState(null);
    const regex = /^([0-9]|10)(\.\d{1,2})?$/;

    const openNotification = (content) => {
        api.info({
            message: `Notification`,
            description: content,
        });
    };


    //Get all semester.
    useEffect(() => {
        userAPI.userProfile()
            .then(response => {
                setUserProfile(response.data);
            }).catch(error => {
                console.error("Failed to fetch user profile:", error);
            });
        SemesterService.getAllSemesterActive()
            .then((response) => {
                setSemesters(response.data);
            })
            .catch((error) => {
                console.error('Error fetching active semesters:', error);
            });
        handleCountdownEnd();
        handleSearchClick();
    }, []);

    //curent semester
    const getCurrentSemester = () => {
        const currentDate = new Date();
        for (const semester of semesters) {
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
            setSelectedSemester(currentSemester);
        }
    }, [semesters]);

    useEffect(() => {
        if (selectedSemester && classes.length > 0) {
            setSelectedClass(classes[0]);
        }
    }, [selectedSemester, classes]);

    useEffect(() => {
        if (teamId !== undefined && userProfile !== undefined) {
            if (finalPresentationResit) {
                pointEvaluationService.getPointEvaluationByTeamIdAndReviewerId(teamId, userProfile.userId, true)
                    .then(response => {
                        setFinalPresentation(response.data);
                    })
                    .catch(error => console.error(error))
            } else {
                pointEvaluationService.getPointEvaluationByTeamIdAndReviewerId(teamId, userProfile.userId, false)
                    .then(response => {
                        setFinalPresentation(response.data);
                    })
                    .catch(error => console.error(error))
            }
        }
    }, [teamId, userProfile, finalPresentationResit])
    const handleSemesterSelect = (value) => {
        const semester = semesters.find(s => s.semesterId === value);
        setSelectedSemester(semester);
    };
    //Get all class by semester
    useEffect(() => {
        classAPI.getAllClassBySemesterIdByReviewer({
            semesterId: selectedSemester ? selectedSemester.semesterId : '',
        })
            .then(response => {
                setClass(response.data);
                 
            })
            .catch(error => {
                console.error("Error fetching classes:", error);
            });
        if (selectedSemester) {
            SettingAPI.findEvaluationCriteriaBySemesterId(selectedSemester.semesterId)
                .then(response => {
                    setEvaluationCriteriaBySemester(response.data)
                })
                .catch(error => console.error(error))
        }

    }, [selectedSemester]);
    const handleClassSelect = (value) => {
        const clazz = classes.find(c => c.classId === value);
        setSelectedClass(clazz);
    };
    //Get all team by class
    useEffect(() => {
        TeamService.getTeamsByClass({
            classId: selectedClass ? selectedClass.classId : '',
        })
            .then(response => {
                setTeam(response.data);
                setSelectedTeam(response.data[0]);
            })
            .catch(error => {
                console.error("Error fetching classes:", error);
            });
    }, [selectedClass]);
    const handleTeamSelect = (value) => {
        const teamSelected = team.find(t => t.teamId === value);
        setSelectedTeam(teamSelected);
    };
    // -----------------------------
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


    //Filter
    const handleSearchClick = () => {
        classUserAPI.getAllClassUserFilterForReviewer({
            semesterId: selectedSemester ? selectedSemester.semesterId : '',
            classId: selectedClass ? selectedClass.classId : '',
            teamId: selectedTeam ? selectedTeam.teamId : '',
        })
            .then(response => {
                setClassUsers(response.data);
                if (selectedSemester && selectedSemester.semesterId && selectedClass && selectedClass.isBlock5 !== undefined) {
                    SettingAPI.getIterationSettings(selectedSemester.semesterId)
                        .then(response => {
                            const settings = response.data;
                            let iterationsSetting;

                            if (selectedClass.isBlock5 === true) {
                                iterationsSetting = settings.find(s => s.settingTitle === "ITERATION_BLOCK5");
                            } else {
                                iterationsSetting = settings.find(s => s.settingTitle === "ITERATION_BLOCK10");
                            }

                            if (iterationsSetting) {
                                setIterationCount(parseInt(iterationsSetting.settingValue, 10));
                            }
                        })
                        .catch(error => {
                            console.error("Error fetching iteration settings:", error);
                        });
                }
            })
            .catch(error => {
                console.error("Error fetching projects:", error);
            });
    };
    const [fileList, setFileList] = useState([]);
    const [uploading, setUploading] = useState(false);
    const handleUpload = () => {
        const formData = new FormData();
        fileList.forEach((file) => {
            formData.append('files[]', file);
        });
        setUploading(true);
        fetch('https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188', {
            method: 'POST',
            body: formData,
        })
            .then((res) => res.json())
            .then(() => {
                setFileList([]);
                message.success('upload successfully.');
            })
            .catch(() => {
                message.error('upload failed.');
            })
            .finally(() => {
                setUploading(false);
            });
    };
    const props = {
        onRemove: (file) => {
            const index = fileList.indexOf(file);
            const newFileList = fileList.slice();
            newFileList.splice(index, 1);
            setFileList(newFileList);
        },
        beforeUpload: (file) => {
            const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.type === 'application/vnd.ms-excel';
            if (!isExcel) {
                message.error('You can only upload Excel files!');
                return false;
            }
            setFileList([...fileList, file]);
            return false;
        },
    };

    const handleDownload = () => {
        const className = "SampleClass";
        const grade = "Grade";
        const fileName = `${className}_${grade}.xlsx`;
        const blob = new Blob([""], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        saveAs(blob, fileName);
    };

    const [classType, setClassType] = useState();
    useEffect(() => {
        if (classes.isBlock5) {
            setClassType("ITERATION_BLOCK5");
        } else {
            setClassType("ITERATION_BLOCK10");
        }
    }, [classes]);
    const [evaluationCriteria, setEvaluationCriteria] = useState([]);
    useEffect(() => {
        if (selectedSemester?.semesterId && classType) {
            SettingAPI.getEvuationCriteriaOG(selectedSemester.semesterId, classType)
                .then(response => {
                    setEvaluationCriteria(response.data);
                })
                .catch(error => {
                    console.error("Error fetching classes:", error);
                });
        }
    }, [selectedSemester?.semesterId, classType]);

    const [evaluationCriteriaEachIter, setEvaluationCriteriaEachIter] = useState();
    useEffect(() => {
        if (selectedSemester?.semesterId && classType && selectedIteration) {
            SettingAPI.getEvuationCriteriaIter(selectedSemester.semesterId, classType, selectedIteration)
                .then(response => {
                    setEvaluationCriteriaEachIter(response.data);
                })
                .catch(error => {
                    console.error("Error fetching classes:", error);
                });
        }
    }, [selectedSemester?.semesterId, classType, selectedIteration]);

    const [totalMaxLoc, setTotalMaxLoc] = useState();
    useEffect(() => {
        if (selectedSemester?.semesterId && classType && selectedIteration && selectedUser?.classUserId) {
            ProjectBacklockAPI.getToalLocByClassUser(selectedSemester.semesterId, classType, selectedIteration, selectedUser?.classUserId)
                .then(response => {
                    setTotalMaxLoc(response.data);
                })
                .catch(error => {
                    console.error("Error fetching classes:", error);
                });
        }
    }, [selectedSemester?.semesterId, classType, selectedIteration, selectedUser?.classUserId]);

    const [packageEvaluation, setPackageEvaluation] = useState();
    useEffect(() => {
        if (selectedSemester?.semesterId && classType && selectedIteration && selectedUser?.classUserId) {
            PackageEvaluationAPI.getPackageWeight(selectedSemester.semesterId, classType, selectedIteration, selectedUser?.classUserId)
                .then(response => {
                    setPackageEvaluation(response.data);

                })
                .catch(error => {
                    console.error("Error fetching classes:", error);
                });
        }
    }, [selectedSemester?.semesterId, classType, selectedIteration, selectedUser?.classUserId]);

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
                console.error('API error:', error);
            });
    };
    const handleGradingLOCModalClose = () => {
        setIsGradingLOCVisible(false);
        handleSearchClick();
    };
    const handleTeamDetailsCancel = () => {
        setIsTeamDetailsModalVisible(false);
    };

    const [numberIteration, setNumberIteration] = useState();
    useEffect(() => {
        if (selectedSemester?.semesterId && selectedClass?.classId) {
            iterationServiceInstance.getAllIterationActive(selectedSemester.semesterId, classType)
                .then((response) => {
                    setNumberIteration(response.data.length);
                })
                .catch((error) => {
                    console.error('Error fetching iteration data:', error);
                });
        }
    }, [selectedSemester?.semesterId, selectedClass?.classId]);
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
        setTeamId(record.teamId);
        setClassUserId(record.classUserId)
        setEditingIndex(record.id); // Assuming 'id' is unique for each record
        setFinalPresentationMode(mode); // 'grade' or 'edit'
        if (!evaluationCriteriaBySemester) {
            openNotification("Evaluation criteria have not been selected for the semester ")
        } else {
            setIsFinalPresentationModalVisible(true);
        }


    };

    const showFinalPresentationResitModal = (record, mode) => {
        setTeamId(record.teamId);
       
        setFinalPresentationResit(record);
        setClassUserId(record.classUserId)
        setEditingIndex(record.id); // Assuming 'id' is unique for each record
        setFinalPresentationMode(mode); // 'grade' or 'edit'
        if (!evaluationCriteriaBySemester) {
            openNotification("Evaluation criteria have not been selected for the semester ")
        } else {
            setIsFinalPresentationModalVisible(true);
        }
    }

    const handleFinalPresentationOk = () => {
        let value = 0;
        for (let key in finalPresentation) {
            const criteriaValue = evaluationCriteriaBySemester[key];
            if (criteriaValue !== 0 && criteriaValue !== null && criteriaValue !== undefined) {
                value += finalPresentation[key] * criteriaValue * 0.01
            }
        }
        value = Number(value).toFixed(2)
        if (finalPresentationResit !== null) {
           
            const newPointEvluation = { ...finalPresentation, isResit: true, team: { teamId: teamId }, reviewer: { userId: userProfile.userId } }
            pointEvaluationService.save(true, newPointEvluation).then(() => {
                openNotificationWithIcon('success', 'Update Successful');
                handleSearchClick();
            }).catch(error => {
                openNotificationWithIcon('error', "Update Faild!", error.message)
            })
              
        } else {
            pointEvaluationService.save(false, { ...finalPresentation, isResit: false, team: { teamId: teamId }, reviewer: { userId: userProfile.userId } })
            .then(() => {
                openNotificationWithIcon('success', 'Update Successful');
                handleSearchClick();
            }).catch(error => {
                openNotificationWithIcon('error', "Update Faild!", error.message)
            })
               
        }
        setIsFinalPresentationModalVisible(false);
        setTeamId(undefined);
        setFinalPresentation({
            projectIntroduction: null,
            finalSRSWeight: null,
            finalSDSWeight: null,
            projectImplementation: null,
            qandA: null,
            teamWorkingWeight: null
        })
        if (finalPresentationResit !== null) {
            setFinalPresentationResit(null)
        }
    };


    const handleChangeInput = (event) => {
        let { name, value } = event.target;
        if (value === " ") {
            setFinalPresentation({ ...finalPresentation, [name]: 0 })
        }
        if (regex.test(value) || value === "") {
            setFinalPresentation({ ...finalPresentation, [name]: value });
        }
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
                    {text !== null ?
                        <>
                            {record.finalPresEval ?
                                <span>{record?.finalPresEval.toFixed(2)}</span>
                                : <span>N/A</span>
                            }
                            {record.finalPresentationResit == null && (
                                <Button
                                    size="small" style={{ marginLeft: "10px" }}
                                    onClick={() => showFinalPresentationModal(record, 'edit')}
                                >
                                    Edit
                                </Button>
                            )}
                        </>
                        :
                        record.pStatus === 'yes' ?
                            <Button size="small" onClick={() => showFinalPresentationModal(record, 'grade')}>Grading</Button>
                            : null
                    }
                </div>
            )
        },
        {
            title: 'Final Presentation Resit',
            dataIndex: 'finalPresentationResit',
            key: 'finalPresentationResit',
            render: (text, record) => (
                <>
                    {record.finalPresentationResit ?
                        <span>{record.finalPresentationResit.toFixed(2)}</span>
                        : <span>N/A</span>
                    }
                    {record.finalPresEval < 5 && (
                        <Button
                            size="small" style={{ marginLeft: "10px" }}
                            onClick={() => showFinalPresentationResitModal(record, 'edit')}
                        >
                            Edit
                        </Button>
                    )}
                </>
            )
        },
        
    ];


    const packageGradeColumns = [
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
                <Input type='number' name="projectIntroduction" min={0} max={10} defaultValue={record.projectIntroduction} value={finalPresentation.projectIntroduction} onChange={(event => handleChangeInput(event))}
                />
            )
        },
        {
            title: 'Software Requirements',
            dataIndex: 'finalSRSWeight',
            key: 'finalSRSWeight',
            render: (text, record) => (
                <Input type='number' name="finalSRSWeight" min={0} max={10} defaultValue={record.finalSRSWeight} value={finalPresentation.finalSRSWeight} onChange={(event => handleChangeInput(event))} />
            )
        },
        {
            title: 'Software Design',
            dataIndex: 'finalSDSWeight',
            key: 'finalSDSWeight',
            render: (text, record) => (
                <Input type='number' name="finalSDSWeight" min={0} max={10} defaultValue={record.finalSDSWeight} value={finalPresentation.finalSDSWeight} onChange={(event => handleChangeInput(event))} />
            )
        },
        {
            title: 'Implementation',
            dataIndex: 'projectImplementation',
            key: 'projectImplementation',
            render: (text, record) => (
                <Input type='number' name="projectImplementation" max={10} defaultValue={record.projectImplementation} min={0} value={finalPresentation.projectImplementation} onChange={(event => handleChangeInput(event))} />
            )
        },
        {
            title: 'Team Working',
            dataIndex: 'teamWorkingWeight',
            key: 'teamWorkingWeight',
            render: (text, record) => (
                <Input type='number' name="teamWorkingWeight" min={0} max={10} defaultValue={record.teamWorkingWeight} value={finalPresentation.teamWorkingWeight} onChange={(event => handleChangeInput(event))} />
            )
        },
        {
            title: 'Q&A',
            dataIndex: 'qandA',
            key: 'qandA',
            render: (text, record) => (
                <Input type='number' name="qandA" min={0} max={10} defaultValue={record.qandA} value={finalPresentation.qandA} onChange={(event => handleChangeInput(event))}
                />
            )
        }
    ];




    return (
        <Layout style={{ minHeight: '100vh' }}>
            <AppSidebar />
            <Layout>
                <AppHeader />
                <Helmet>
                    <title>Class Student Management</title>
                </Helmet>
                <Breadcrumb
                    items={[
                        {
                            title: <Link to='/reviewer/class-list'>Home</Link>
                        },
                        {
                            title: classCode,
                        },
                    ]}
                    style={{
                        marginLeft: 10, marginTop: 20
                    }}
                />
                <h1 style={{ paddingLeft: '10px' }}> {classCode} - Class Student Management</h1>
                {
                    currentMilestone != null ?
                        <>
                            <p style={{ padding: 5, margin: 0, paddingLeft: '10px' }}> <strong>{currentMilestone?.nameIteration}</strong> | <strong>Start: </strong>{formatDate(currentMilestone?.fromDate)}| <strong>Countdown:</strong> {formatCountdown(countdown)}</p>
                        </>
                        : <p style={{ paddingLeft: '10px' }}>Not select iteration</p>
                }
                <Content style={{ textAlign: 'left', padding: '0px', paddingLeft: '5px', paddingRight: '5px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Select
                                style={{ width: 200, marginRight: 10 }}
                                value={selectedSemester ? selectedSemester.semesterId : ''}
                                onChange={handleSemesterSelect}
                            >
                                <Option key={"Select Semester "} value={''}>Select Semester </Option>
                                {semesters.map((semester) => (
                                    <Option key={semester.semesterId} value={semester.semesterId}>
                                        {semester.semesterName}
                                    </Option>
                                ))}
                            </Select>
                            <Select
                                style={{ width: 200, marginRight: 10 }}

                                value={selectedClass ? selectedClass.classId : ''}
                                onChange={handleClassSelect}
                            >
                                <Option key={"Select Class "} value={''}>Select Class </Option>
                                {classes.map((clazz) => (
                                    <Option key={clazz.classId} value={clazz.classId}>
                                        {clazz.classCode}
                                    </Option>
                                ))}
                            </Select>
                            <Select
                                style={{ width: 200, marginRight: 10 }}
                                placeholder="Select a team"
                                value={selectedTeam ? selectedTeam.teamId : ''}
                                onChange={handleTeamSelect}
                            >
                                <Option key={"Select Team "} value={''}>Select Team </Option>
                                {team.map((team) => (
                                    <Option key={team.teamId} value={team.teamId}>
                                        {team.teamName}
                                    </Option>
                                ))}
                            </Select>
                            <Button type="primary" onClick={handleSearchClick}>
                                Filter
                            </Button>
                             
                        </div>
                        <UploadDownloadButtons
                            handleDownload={handleDownload}
                            props={props}
                            handleUpload={handleUpload}
                            fileList={fileList}
                            uploading={uploading}
                        />
                    </div>
                    <Table
                        
                        dataSource={classUser.map(user => ({ ...user, key: user.classUserId }))}
                        columns={columns}
                        rowKey="key"
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
                    <TeamDetailsModal
                        isVisible={isTeamDetailsModalVisible}
                        handleOk={handleTeamDetailsCancel}
                        handleCancel={handleTeamDetailsCancel}
                        userIdSelected={userIdSelected}
                        selectedClass={selectedClass}
                    />
                    {evaluationCriteriaBySemester &&
                        <FinalPresentationModal
                            isVisible={isFinalPresentationModalVisible}
                            handleOk={handleFinalPresentationOk}
                            handleCancel={() => {
                                if (finalPresentationResit !== null) {
                                    setFinalPresentationResit(null)
                                }
                                setTeamId(undefined);
                                setFinalPresentation({
                                    projectIntroduction: null,
                                    finalSRSWeight: null,
                                    finalSDSWeight: null,
                                    projectImplementation: null,
                                    qandA: null,
                                    teamWorkingWeight: null
                                })
                                setIsFinalPresentationModalVisible(false)
                            }}
                            classUser={classUser}
                            packageGradeColumns={packageGradeColumns.filter(item => evaluationCriteriaBySemester[item.key] !== 0 && evaluationCriteriaBySemester[item.key] !== null)}
                            classUserId={classUserId}
                            finalPresentationResit={finalPresentationResit}
                        />
                    }
                </Content>
                <AppFooter />
                {contextHolder}
            </Layout>
        </Layout>
    );
};

export default ClassUserList;
