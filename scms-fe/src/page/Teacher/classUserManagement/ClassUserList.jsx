import React, { useState, useEffect } from 'react';
import AppHeader from '../../../compornent/layout/Header';
import AppFooter from '../../../compornent/layout/Footer';
import AppSidebar from '../../../compornent/layout/Teacher/TeacherSidebar';
import { saveAs } from 'file-saver';
import { Layout, Table, Button, Modal, message, Input, Breadcrumb, Form, Tooltip, Select, notification } from 'antd';
import { Link, useParams } from "react-router-dom";
import { DeleteOutlined, EditOutlined, QuestionCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { UploadDownloadButtons } from '../classUserManagement/UploadDownloadButtons';
import { TeamDetailsModal } from '../classUserManagement/TeamDetailsModal';
import { OGGradingModal } from '../classUserManagement/GradingModal';
import classUserAPI from '../../../api/ClassUserAPI';
import MilestoneAPI from '../../../api/MilestoneAPI';
import SettingAPI from '../../../api/SettingAPI';
import NotificationPopup from '../../../compornent/notifcation'
import iterationServiceInstance from '../../../api/IterationAPI';
import classAPI from '../../../api/ClassAPI';
import SemesterService from '../../../api/SemesterAPI';
import TeamService from '../../../api/TeamAPI';
import PackageEvaluationAPI from '../../../api/PackageEvaluationAPI';
import { FinalPresentationModal } from "./FinalPresentationModal";
import openNotificationWithIcon from '../../../compornent/notifcation';
import ProjectBacklockAPI from '../../../api/ProjectBacklogAPI';
import pointEvaluationService from '../../../api/PointEvaluationAPI';
import ConfirmationModal from '../../../compornent/comfirmModal'
import { Helmet } from 'react-helmet';
import formatDate from '../../../utils/dateTimeFormat';
import FinalPresentationModals from './FinalPresentationModals';
const { Content } = Layout;
const { Option } = Select;

const ClassUserList = () => {
    const [classUser, setClassUsers] = useState([]);
    const [newClassUser, setNewClassUser] = useState({});
    const [isModalVisible, setIsModalVisible] = useState(false);
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
    const [iterations, setIterations] = useState([]);
    const [iterationCount, setIterationCount] = useState(0);
    const [semesters, setSemesters] = useState([]);
    const [classes, setClass] = useState([]);
    const [team, setTeam] = useState([]);
    const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedIteration, setSelectedIteration] = useState(null);
    const [classUserId, setClassUserId] = useState();
    const [finalPresentationMode, setFinalPresentationMode] = useState('grade');
    const [isFinalPresentationModalVisible, setIsFinalPresentationModalVisible] = useState(false);
    const [pointEvaluations, setPointEvaluations] = useState([]);
    const [finalPresentation, setFinalPresentation] = useState({
        projectIntroduction: 0,
        finalSRSWeight: 0,
        finalSDSWeight: 0,
        projectImplementation: 0,
        qandA: 0,
        teamWorkingWeight: 0
    });
    const uniqueTeams = [...new Set(classUser.map(user => user.team))];
    const initialTeamGrades = uniqueTeams.map(team => ({ team, presentation1: 0, presentation2: 0 }));
    const [teamGrades, setTeamGrades] = useState(initialTeamGrades);
    const [api, contextHolder] = notification.useNotification();


    //Get all semester.
    useEffect(() => {
        SemesterService.getAllSemesterActive()
            .then((response) => {
                setSemesters(response.data);
            })
            .catch((error) => {
                console.error('Error fetching active semesters:', error);
            });
    }, []);
    const handleSemesterSelect = (value) => {
        const semester = semesters.find(s => s.semesterId === value);
        setSelectedSemester(semester);
    };
    //Get all class by semester
    useEffect(() => {
        classAPI.getAllClassBySemesterId({
            semesterId: selectedSemester ? selectedSemester.semesterId : '',
        })
            .then(response => {
                setClass(response.data);
                // Find and set the selected class based on the classId from the URL
                if (classId) {
                    const foundClass = response.data.find(c => c.classId.toString() === classId);
                    if (foundClass) {
                        setSelectedClass(foundClass);
                    }
                }

            })
            .catch(error => {
                console.error("Error fetching classes:", error);
            });
    }, [selectedSemester, classId]);
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
    const handleCancelFinal = () => {
         
        setIsFinalPresentationModalVisible(false);
    };
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
            if (classId) {
                const foundClass = classes.find(c => c.classId.toString() === classId);
                if (foundClass) {
                    setSelectedClass(foundClass);
                }
            }
        }
    }, [selectedSemester, classes]);

    useEffect(() => {
        handleSearchClick();
    }, [selectedClass]);
    //Filter
    const handleSearchClick = () => {
        classUserAPI.getAllClassUserFilter({
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

    useEffect(() => {
        handleSearchClick();
    }, []);

    const [form] = Form.useForm();
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
                openNotificationWithIcon('success', 'Sucessfully!', ' Class student import sucessfully!')
            })
            .catch(() => {
                openNotificationWithIcon('error', 'Error', 'Import failed please try again!')
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
        if (!selectedClass || !selectedClass.classId) {
            openNotificationWithIcon('error','Error','No class selected for download');
            return;
        }

        classUserAPI.exportClassUserGrades(selectedClass.classId)
            .then(response => {
                // Creating a new Blob object for the response data
                const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                // Using file-saver to save the file on the client's machine
                saveAs(blob, `class-${selectedClass.classCode}-grades.xlsx`);
                message.success('Grades downloaded successfully');
            })
            .catch(error => {
                console.error('Error downloading grades:', error);
                message.error('Failed to download grades');
            });

    };
    

    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const onSelectChange = newSelectedRowKeys => {
        setSelectedRowKeys(newSelectedRowKeys);
    };
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };
    const deleteSelectedClassUsers = () => {
        Modal.confirm({
            title: 'Confirm Deletion',
            content: 'Are you sure you want to delete the selected users?',
            onOk: async () => {
                try {
                    await classUserAPI.deleteSelectedClassUsers(selectedRowKeys);
                    NotificationPopup('success', 'Successfully','Delete Successfully')
                    setSelectedRowKeys([]);
                    setClassUsers([]);
                } catch (error) {
                    NotificationPopup('error', 'Error', 'You can not delete all class student now because some students already graded!');
                }
            },
        });
    };
    //--------------------
    //Get evlauation criteria
    const [classType, setClassType] = useState();
    useEffect(() => {
        if (selectedClass && selectedClass.isBlock5 !== undefined) {
            // Your existing logic here...
            if (selectedClass.isBlock5 === "YES") {
                setClassType("ITERATION_BLOCK5");
            } else {
                setClassType("ITERATION_BLOCK10");
            }
        }
    }, [selectedClass]);
    const [evaluationCriteria, setEvaluationCriteria] = useState([]);
    useEffect(() => {
        if (selectedSemester?.semesterId && classType) {
            SettingAPI.getEvuationCriteria(selectedSemester.semesterId, classType)
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

    const setSrsGrade = (newGrade) => {
        setPackageEvaluation(prevState => ({
            ...prevState,
            srsGrade: parseFloat(newGrade)
        }));
    };

    const setSdsGrade = (newGrade) => {
        setPackageEvaluation(prevState => ({
            ...prevState,
            sdsGrade: parseFloat(newGrade)
        }));
    };

    const handleGradingOK = () => {
        PackageEvaluationAPI.sendOGGrade({
            srsGrade: packageEvaluation.srsGrade,
            sdsGrade: packageEvaluation.sdsGrade,
            classUserId: selectedUser.classUserId,
            iterationName: selectedIteration,
            semesterId: selectedSemester.semesterId,
            classType: classType,
        })
            .then(() => {
                openNotificationWithIcon('success', 'Grading Successful');
                handleGradingLOCModalClose();
            })
            .catch(error => {
                let errorMessage = error.response?.data || 'Failed to Grading. Please try again later.';
                if (errorMessage == 'Failed: null') {
                    errorMessage = 'You must calculate LOC in Project backlog page first';
                }
                openNotificationWithIcon('error', 'Grading Faild', errorMessage);
            });
            
    };
    const handleGradingLOCModalClose = () => {
        setIsGradingLOCVisible(false);
        handleSearchClick();
    };
    const handleTeamDetailsCancel = () => {
        setIsTeamDetailsModalVisible(false);
    };
    const showTeamDetailsModal = (userId) => {
        if (!selectedClass) {
            // Display warning message
            notification.warning({
                message: 'Select a Class First',
                description: 'You should select a class first before accessing the Team Model.',
            });
            return; // Stop the function execution here
        }
        setUserIdSelected(userId);
        setIsTeamDetailsModalVisible(true);
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
    }, [selectedSemester?.semesterId, selectedClass?.classId, numberIteration, classType]);

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
                    {text != null && !isNaN(text) ? (
                        <>
                            {parseFloat(text).toFixed(2)}
                            {record.isSubmited !== "YES" && (
                                <Button
                                    size="small"
                                    onClick={() => showGradingModal(record, ogIndex)}
                                    style={{ marginLeft: 5 }}
                                >
                                    <EditOutlined />
                                </Button>
                            )}
                        </>
                    ) : (
                        <>

                            {record.isSubmited !== "YES" && (
                                <Button
                                    style={{ marginLeft: 5 }}
                                    size="small"
                                    onClick={() => showGradingModal(record, ogIndex)}
                                >
                                    Grading
                                </Button>
                            )}
                        </>
                    )}
                </div>
            ),
            evaluationWeight: currentEvaluationCriteria?.evaluationWeight || '',
        });

    }
    const showConfirmModal = () => {
        setIsConfirmModalVisible(true);
    };

    const allSubmitted = () => {
        return classUser.every(user => user.isSubmited === "YES");
    };
    const handleChangeInput = (event) => {
        const { name, value } = event.target;
        if (value >= 0 && value <= 10) {
            setFinalPresentation({ ...finalPresentation, [name]: parseInt(value) });
        }
    }
    const handleFinalSubmit = async () => {
        try {
            if (!selectedClass || !selectedClass.classId) {
                openNotificationWithIcon('warning', 'Error', 'Please select a class first');
                return;
            }
            const response = await classUserAPI.updateFinalGrades(selectedClass.classId);
            openNotificationWithIcon('success', 'Successfully');
            handleSearchClick();

        } catch (error) {
            console.log(error);

            let errorMessage = "An unexpected error occurred";

            if (error.response && error.response.data) {
                const fullErrorMessage = error.response.data;
                const splitMessage = fullErrorMessage.split("java.lang.RuntimeException: ");
                if (splitMessage.length > 1) {
                    errorMessage = splitMessage[1];
                } else {
                    errorMessage = fullErrorMessage;
                }
            }

            openNotificationWithIcon('error', 'Failed', errorMessage);
        }
    };
    const fetchPointEvaluations = async (teamId, isResit) => {
        try {
            const response = await pointEvaluationService.getPointEvaluations(teamId, isResit);
            setPointEvaluations(response.data);
        } catch (error) {
            console.error('Error fetching point evaluations:', error);

        }
    };
    const showFinalPresentationModal = (record, mode) => {
        fetchPointEvaluations(record.teamId, false); // Assuming isResit is false
        setIsFinalPresentationModalVisible(true);
        // Set other necessary state variables
    };
    const showFinalPresentationResitModal = (record, mode) => {
        fetchPointEvaluations(record.teamId, true); // Assuming isResit is true
        setIsFinalPresentationModalVisible(true);
        // Set other necessary state variables
    };
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
                    <p style={{ color: text === 'YES' ? 'green' : 'red' }}>
                        {text}
                    </p>
                ) : null
            ),
        },
        {
            title: 'Final Presentation',
            dataIndex: 'finalPresEval',
            key: 'finalPresEval',
            render: (text, record) => (
                <div>
                    {text !== null && (
                        <>
                            <span>{record.finalPresEval.toFixed(2)}</span>
                            <Button
                                size="small" style={{ marginLeft: "10px" }}
                                onClick={() => showFinalPresentationModal(record, 'edit')}
                            >
                                View
                            </Button>
                        </>
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
                            <Button
                                size="small" style={{ marginLeft: "10px" }}
                                onClick={() => showFinalPresentationResitModal(record, 'edit')}
                            >
                                View
                            </Button>
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
                <span>{typeof text === 'number' ? parseFloat(text).toFixed(2) : ''}</span>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'passStatus',
            key: 'passStatus',
            render: (text, record) => (
                record.passStatus !== null ? (
                    <p style={{ color: text === 'PASSED' ? 'green' : 'red' }}>
                        {text}
                    </p>
                ) : null
            ),
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
                            title: <Link to='../teacher/class-list'>Home</Link>
                        },
                        {
                            title: selectedClass?.classCode,
                        },
                    ]}
                    style={{
                        marginLeft: 45, marginTop: 20
                    }}
                />
                <h1 style={{ paddingLeft: '45px' }}> {selectedClass?.classCode} Class Student Management</h1>
                {
                    currentMilestone != null ?
                        <>
                            <p style={{ padding: 5, margin: 0, paddingLeft: '50px' }}> <strong>{currentMilestone?.nameIteration}</strong> | <strong>Start: </strong>{formatDate(currentMilestone?.fromDate)}| <strong>Countdown:</strong> {formatCountdown(countdown)}</p>
                        </>
                        : null
                }
                <Content style={{ textAlign: 'left', padding: '0px', paddingLeft: '45px', paddingRight: '45px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
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
                            <Button type="primary" ghost onClick={handleSearchClick}>
                                Filter
                            </Button>
                            <div>
                                {selectedRowKeys.length > 0 && (
                                    <Tooltip title="Delete all selected Student" color={'red'}>

                                        <Button type="danger" onClick={deleteSelectedClassUsers}>
                                            <DeleteOutlined style={{ color: 'red' }} />
                                        </Button>
                                    </Tooltip>
                                )}
                            </div>
                        </div>

                        <UploadDownloadButtons
                            handleDownload={handleDownload}
                            props={props}
                            handleUpload={handleUpload}
                            fileList={fileList}
                            uploading={uploading}
                        />

                    </div>
                    <FinalPresentationModals
                        isVisible={isFinalPresentationModalVisible}
                        onCancel={handleCancelFinal}
                        onOk={handleCancelFinal}
                        pointEvaluations={pointEvaluations}
                    />
                    <Table
                        rowSelection={rowSelection}
                        dataSource={classUser.map(user => ({ ...user, key: user.classUserId }))}
                        columns={columns}
                        size='small'
                        rowKey="key"
                    />
                    {
                        !allSubmitted() &&
                        <Button type='primary' ghost style={{ marginBottom: 10, float: 'right' }} onClick={showConfirmModal}>
                            Final Submit
                        </Button>
                    }
                    <ConfirmationModal
                        isVisible={isConfirmModalVisible}
                        onConfirm={() => {
                            handleFinalSubmit();
                            setIsConfirmModalVisible(false);
                        }}
                        onCancel={() => setIsConfirmModalVisible(false)}
                        title={<><ExclamationCircleOutlined style={{ color: 'red' }} /> Confirm Final Submission</>}
                        content="Are you sure you want to finalize the grades? This action cannot be undone."
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
                        packageEvaluation={packageEvaluation}
                        setPackageEvaluation={setPackageEvaluation}
                    />
                    <TeamDetailsModal
                        isVisible={isTeamDetailsModalVisible}
                        handleOk={handleTeamDetailsCancel}
                        handleCancel={handleTeamDetailsCancel}
                        userIdSelected={userIdSelected}
                        selectedClass={selectedClass}
                    />
                </Content>
                <AppFooter />
                {contextHolder}
            </Layout>
        </Layout>
    );
};

export default ClassUserList;
