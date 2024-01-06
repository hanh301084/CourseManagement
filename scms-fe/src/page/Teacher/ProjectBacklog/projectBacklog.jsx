import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import AppHeader from '../../../compornent/layout/Header'
import AppFooter from '../../../compornent/layout/Footer'
import AppSidebar from '../../../compornent/layout/Teacher/TeacherSidebar.jsx';
import ProjectBacklogAPI from '../../../api/ProjectBacklogAPI';
import SemesterService from '../../../api/SemesterAPI';
import classAPI from '../../../api/ClassAPI';
import TeamService from '../../../api/TeamAPI';
import SettingAPI from '../../../api/SettingAPI';
import iterationServiceInstance from '../../../api/IterationAPI';
import classUserAPI from '../../../api/ClassUserAPI.jsx';
import MilestoneAPI from '../../../api/MilestoneAPI.jsx';
import checkListAPI from '../../../api/CheckListAPI.jsx';
import { EditOutlined, PlusOutlined, QuestionCircleOutlined, MinusOutlined, BoldOutlined } from '@ant-design/icons'
import openNotificationWithIcon from '../../../compornent/notifcation/index.jsx';
import FunctionCommentAPI from '../../../api/FunctionCommentAPI.jsx';
import formatDate from '../../../utils/dateTimeFormat.jsx';
import estimateLocService from '../../../api/EstimateLocAPI.jsx';
import { Helmet } from 'react-helmet';
import './style.css'
import {
    Layout,
    Table,
    Select,
    Button,
    Tooltip,
    Modal,
    Input,
    Radio,
    Form,
    Tabs,
    Breadcrumb
} from 'antd';
const { Content } = Layout;
const { Option } = Select;
const Project_Backlog = () => {
    const [paging, setPaging] = useState({
        current: 1,
        pageSize: 10,
    });
    const [semesters, setSemesters] = useState([]);
    const [classes, setClass] = useState([]);
    const [team, setTeam] = useState([]);
    const [projectBacklog, setProjectBacklog] = useState('');
    const [projectName, setProjectName] = useState('');
    const [selectedSemester, setSelectedSemester] = useState(null);
    const [selectedClass, setSelectedClass] = useState(null);
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [iterations, setIterations] = useState([]);
    const [checklistItems, setChecklistItems] = useState([]);
    const [iterationCount, setIterationCount] = useState(0);
    const [showTeacherEvaluation, setShowTeacherEvaluation] = useState(true);
    const [classUser, setClassUsers] = useState([]);
    const [currentMilestone, setCurrentMilestone] = useState(null);
    const [countdown, setCountdown] = useState(0);
    const [packageStatusData, setPackageStatusData] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [initialEvaluations, setInitialEvaluations] = useState({});
    const [isEditAction, setIsEditAction] = useState(false);
    const [currentComment, setCurrentComment] = useState([]);
    const [activeTabId, setActiveTabId] = useState("1");
    const [showStudentName, setShowStudentName] = useState(false);
    const [showActualAndComplete, setShowActualAndComplete] = useState(false);
    const [language, setLanguage] = useState();
    const [editingRecord, setEditingRecord] = useState(null);
    const [isModalLOCVisible, setIsModalLOCVisible] = useState(false);
    const [form] = Form.useForm();
    const [numberOfLocInput, setNumberOfLocInput] = useState(null);
    const [number, setNumber] = useState(0);
    const [estimateLocList, setEstimateLocList] = useState([]);
    const [selectedFunctionType, setSelectedFunctionType] = useState();
    const [estimateLoc, setEstimateLoc] = useState(null);
    const [functionEstimateLocData, setFunctionEstimateLocData] = useState(null);
    const [currentComments, setCurrentComments] = useState([]);
    const [isCommentsModalVisible, setIsCommentsModalVisible] = useState(false);
    const studentNames = Array.isArray(projectBacklog)
        ? [...new Set(projectBacklog.map(item => item.assignee?.fullName).filter(name => name))]
        : [];
    const [selectedRowData, setSelectedRowData] = useState(null);

    const iterationNames = Array.isArray(projectBacklog)
        ? [...new Set(projectBacklog.map(item => item.plannedCodeIteration?.iterationName).filter(name => name))]
        : [];

    useEffect(() => {

        SemesterService.getAllSemesterActive()
            .then((response) => {
                {
                    setSemesters(response.data);
                }
            })
            .catch((error) => {
                console.error('Error fetching active semesters:', error);
            });
        SemesterService.getCurrentSemester()
            .then((response) => {
                const currentSemester = response.data;
                if (currentSemester) {
                    setSelectedSemester(currentSemester);

                }
            })
            .catch((error) => {
                console.error('Error fetching current semester:', error);
            });
    }, []);
    useEffect(() => {
        handleSearchClick();
    }, [paging.current, paging.pageSize, selectedSemester, selectedClass]);
    useEffect(() => {
        if (selectedSemester && selectedSemester.semesterId) {
            classAPI.getAllClassBySemesterId({
                semesterId: selectedSemester.semesterId,
            })
                .then(response => {
                    setClass(response.data);
                    if (response.data && response.data.length > 0) {
                        const firstClass = response.data[0];
                        setSelectedClass(firstClass);
                        fetchTeams(firstClass.classId);
                    }
                })
                .catch(error => {
                    console.error("Error fetching classes:", error);
                });
        }
    }, [selectedSemester]);

    useEffect(() => {
        estimateLocService.getAllFunctionTypesActive()
            .then(response => {
                setEstimateLocList(response.data);
            })
            .catch(error => console.error("Fecth estimateLoc error", error))
    }, [language])


    const fetchTeams = (classId) => {
        TeamService.getTeamsByClass({
            classId: classId,
        })
            .then(response => {
                setTeam(response.data);
                if (response.data && response.data.length > 0) {
                    const firstTeam = response.data[0];
                    setSelectedTeam(firstTeam);
                }
            })
            .catch(error => {
                console.error("Error fetching teams:", error);
            });
    };
    const isEndDateWithinTwoWeeks = () => {
        if (!selectedSemester || !selectedSemester.endDate) return false;
        const endDate = new Date(selectedSemester.endDate);
        const today = new Date();
        const twoWeeksTime = 14 * 24 * 60 * 60 * 1000; // 14 days in milliseconds

        if (today.getTime() - endDate.getTime() >= twoWeeksTime) {
            return true
        }
        else {
            return false
        }
    };
    useEffect(() => {
        if (selectedClass && selectedClass.classId) {
            fetchTeams(selectedClass.classId);
        }
    }, [selectedClass]);
    useEffect(() => {
        if (selectedTeam && selectedTeam.checkList && selectedTeam.checkList.id) {
            checkListAPI.getAllCheckListItemsById({
                id: selectedTeam.checkList.id,
            })
                .then(response => {
                    const transformedData = response.data.map(item => ({
                        key: item.id.toString(),
                        name: item.name,
                        details: item.description,
                        evaluation: 'NOT_PASSED'
                    }));
                    setChecklistItems(transformedData);
                })
                .catch(error => {
                    console.error("Error fetching checklist items:", error);
                });
        }
    }, [selectedTeam]);
    const handleSearchClick = () => {

        ProjectBacklogAPI.getAllProjectBacklog({
            semesterId: selectedSemester ? selectedSemester.semesterId : '',
            classId: selectedClass ? selectedClass.classId : '',
            teamId: selectedTeam ? selectedTeam.teamId : '',
            page: paging.current - 1,
            size: paging.pageSize,
        })
            .then(response => {
                const dataWithKeys = response.data.content.map((item, index) => ({
                    ...item,
                    key: index,
                }));

                setProjectBacklog(dataWithKeys);
                setPaging(prevState => ({ ...prevState, total: response.data.totalElements }));
                setProjectName(response.data.content[0]?.team?.project?.topicName || '');
                const packageStatusData = response.data.content.map(item => ({

                    srsStatus: ["PENDING", "DOING", "DONE"].includes(item.srsStatus) ? item.srsStatus : "",
                    sdsStatus: ["PENDING", "DOING", "DONE"].includes(item.sdsStatus) ? item.sdsStatus : "",
                    codingStatus: ["PENDING", "DOING", "DONE"].includes(item.codingStatus) ? item.codingStatus : "",
                    testingStatus: ["PENDING", "DOING", "DONE"].includes(item.testingStatus) ? item.testingStatus : "",
                }));

                setPackageStatusData(packageStatusData);
                if (selectedClass && selectedClass.classId) {
                    const classId = selectedClass.classId
                    classUserAPI.getAllClassUserFilter(classId)
                        .then((response) => {
                            setClassUsers(response.data);
                        })
                        .catch((error) => {
                            console.error('Error fetching class users:', error);
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
                if (selectedSemester && selectedSemester.semesterId && selectedClass && selectedClass.isBlock5 !== undefined) {
                    SettingAPI.getIterationSettings(selectedSemester.semesterId)
                        .then(response => {
                            const settings = response.data;
                            let iterationsSetting;

                            if (selectedClass.isBlock5 === "YES") {
                                iterationsSetting = settings.find(s => s.settingTitle === "ITERATION_BLOCK5");
                            } else {
                                iterationsSetting = settings.find(s => s.settingTitle === "ITERATION_BLOCK10");
                            }

                            if (iterationsSetting) {
                                setIterationCount(parseInt(iterationsSetting.settingValue));
                            }
                            // console.log(iterationsSetting)
                        })
                        .catch(error => {
                            console.error("Error fetching iteration settings:", error);
                        });
                }
                const limit = iterationCount;
                if (iterationCount) {
                    iterationServiceInstance.getAllIterationActiveLimit(limit)
                        .then(response => {

                            setIterations(response.data)

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
    const setAllEvaluations = (status) => {
        setChecklistItems(checklistItems.map(item => ({ ...item, evaluation: status })));
    };
    const EvaluationControlButtons = () => (
        <Radio.Group style={{ marginBottom: 16, float: 'right', marginLeft: 10 }}>
            <Radio.Button onClick={() => setAllEvaluations('PASSED')}>All Pass</Radio.Button>
            <Radio.Button onClick={() => setAllEvaluations('NOT_PASSED')}>All Not Pass</Radio.Button>
            <Radio.Button onClick={() => setAllEvaluations('NOT_USE')}>All Not Use</Radio.Button>
        </Radio.Group>
    );
    const handleSemesterSelect = (value) => {
        const semester = semesters.find(s => s.semesterId === value);
        setSelectedSemester(semester);
    };
    const handleClassSelect = (value) => {
        const clazz = classes.find(c => c.classId === value);
        setSelectedClass(clazz);
    };
    const handleTeamSelect = (value) => {
        const teamSelected = team.find(t => t.teamId === value);
        setSelectedTeam(teamSelected);
    };
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
    const handleTableChange = (current, pageSize) => {

        setPaging({
            ...paging,
            current: current,
            pageSize: pageSize,
        });
    };
    const formatCountdown = (seconds) => {
        const days = Math.floor(seconds / 86400);
        const hours = Math.floor((seconds % 86400) / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${days.toString().padStart(2, '0')}d-${hours.toString().padStart(2, '0')}h-${minutes.toString().padStart(2, '0')}m-${secs.toString().padStart(2, '0')}s`;
    };
    const fetchEvaluationData = async (projectBacklogId, iterationId) => {
        try {
            const response = await ProjectBacklogAPI.getChecklistEvaluations(projectBacklogId, iterationId);
            const fetchedEvaluations = response.data;
            const evaluationDict = {};
            fetchedEvaluations.forEach(evaluation => {
                evaluationDict[evaluation.checkListItemId] = evaluation.status;
            });
            setInitialEvaluations(evaluationDict); // Set initial evaluations
            const updatedChecklistItems = checklistItems.map(item => {
                return {
                    ...item,
                    evaluation: evaluationDict[item.key] || item.evaluation
                };
            });

            setChecklistItems(updatedChecklistItems);
        } catch (error) {
            console.error('Error fetching evaluation data:', error);
        }
    };
    const haveEvaluationsChanged = () => {
        return checklistItems.some(item => item.evaluation !== initialEvaluations[item.key]);
    };
    const handleEdit = (record, isEdit = false) => {
        let iterationId = 0;

        if (record.completePercentLoc !== null && record.completePercentLoc === 100 && isEdit) {

            if (!currentMilestone.iterationId) {
                openNotificationWithIcon('warning', 'Please set milestone for this class first!')
                return;
            }
            iterationId = currentMilestone.iterationId;
        } else if (record.completePercentLoc !== null && record.completePercentLoc !== 100 && isEdit) {
            if (!currentMilestone.iterationId) {
                openNotificationWithIcon('warning', 'Please set milestone for this class first!')
                return;
                // && record.completePercentLoc && record.completePercentLoc !== null && record.completePercentLoc=== 100 
            }
            iterationId = currentMilestone.iterationId - 1;
        }
        else {

            if (!currentMilestone.iterationId) {
                openNotificationWithIcon('warning', 'Please set milestone for this class first!')
                return;
            }
            iterationId = currentMilestone.iterationId;
        }


        console.log(iterationId)

        fetchEvaluationData(record.projectBacklogId, iterationId);
        setSelectedRowData(record);
        setIsModalVisible(true);
        setIsEditAction(isEdit); // Set the flag based on whether it's an edit
    };

    const fetchCommentsForTab = (tabId) => {
        if (selectedRowData) {
            FunctionCommentAPI.findFunctionCommnet({
                backlogId: selectedRowData.projectBacklogId,
                iterationId: tabId
            })
                .then(response => {
                    setCurrentComment(response.data);
                })
                .catch(error => {
                    console.error('Error fetching comment:', error);
                });
        }
    };
    useEffect(() => {
        fetchCommentsForTab(activeTabId);
    }, [activeTabId, selectedRowData]);
    const handleEditBacklog = (record) => {
        setSelectedRowData(record);
        setIsRowModalVisible(true);

    };
    const prepareChecklistEvaluationData = () => {
        const projectBacklogId = selectedRowData?.projectBacklogId;
        return {
            projectBacklogId,
            functionChecklistDTOS: checklistItems.map(item => ({
                projectBacklogId: projectBacklogId,
                checkListItemId: item.key,
                status: item.evaluation,
                iterationId: currentMilestone.iterationId
            })),
        };
    };
    const submitChecklistEvaluation = () => {
        const evaluationData = prepareChecklistEvaluationData();
        ProjectBacklogAPI.evaluateChecklist(evaluationData.projectBacklogId, [evaluationData], isEditAction)
            .then(response => {
                openNotificationWithIcon('success', 'Update Successful', response.data);
                handleSearchClick();
            })
            .catch(error => {
                const errorMessage = error.response?.data?.error || 'Failed to Update. Please try again later.';
                openNotificationWithIcon('error', 'Update Faild', errorMessage);
            });
    };

    const handleOk = () => {
        submitChecklistEvaluation();
        form.resetFields();
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        form.resetFields();
        setIsModalVisible(false);
    };
    const closeModal = () => {
        setIsRowModalVisible(false);
        setCurrentComment(''); // Reset comment
    };

    useEffect(() => {
        if (currentMilestone) {
            const interval = setInterval(() => {
                const now = new Date();
                const targetDate = new Date(currentMilestone.toDate);
                targetDate.setHours(0, 0, 0, 0);
                const timeRemaining = Math.floor((targetDate - now) / 1000); // Convert to seconds
                if (timeRemaining <= 0) {
                    clearInterval(interval);
                    setCountdown(0);
                } else {
                    setCountdown(timeRemaining);
                }
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [currentMilestone]);
    const [isModalPKGVisible, setIsModalPKGVisible] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isRowModalVisible, setIsRowModalVisible] = useState(false);

    const handlePackageStatusClick = (record) => {
        const { srsStatus, sdsStatus, codingStatus, testingStatus } = record;
        const packageStatusFormData = {
            srsStatus,
            sdsStatus,
            codingStatus,
            testingStatus,
        };
        setPackageStatusData(packageStatusFormData);
        setIsModalPKGVisible(true);
    };
    const handleRadioChange = (e, record) => {
        const { value } = e.target;
        setChecklistItems(prevItems =>
            prevItems.map(item =>
                item.key === record.key ? { ...item, evaluation: value } : item
            )
        );
    };
    const studentColumn = {
        title: 'Student Name',
        dataIndex: ['assignee', 'fullName'],
        key: 'fullName',
        width: 200,
        filters: [
            ...studentNames.map(name => ({ text: name, value: name })),
        ],
        onFilter: (value, record) => record.assignee?.fullName?.includes(value),
        render: (text) => text || <span style={{ color: 'red' }}>N/A</span>
    };
    const isSetButtonDisabled = (iterationNumber) => {
        const milestoneIterationName = currentMilestone?.nameIteration;
        return milestoneIterationName !== `Iteration ${iterationNumber}`;
    };

    const buttonStyle = {
        marginLeft: 5,
        padding: '0 4px',
        fontSize: '12px',
        lineHeight: '14px',
        height: '22px'
    };

    const showLOCModal = (record) => {
        setLanguage(record.team.technology);
        setEditingRecord(record);
        setIsModalLOCVisible(true);

        estimateLocService.getFunctionEstimateLoc(record.projectBacklogId)
            .then(response => {
                setFunctionEstimateLocData(response.data);
                // Pre-select function type and set number of inputs if data exists
                if (response.data && response.data.estimateLoc) {
                    form.setFieldsValue({
                        type: { settingValue: response.data.estimateLoc.functionType.name },
                        input: { settingValue: response.data.numberOfInput }
                    });
                    setSelectedFunctionType(response.data.estimateLoc.functionType);
                    setNumberOfLocInput(response.data.estimateLoc.numberOfLocPerInput);
                    setNumber(response.data.numberOfInput);
                }
            })
            .catch(error => {
                console.error("Error fetching function estimate LOC data:", error);
            });
    };
    useEffect(() => {
        if (selectedFunctionType && selectedTeam && selectedTeam.technology) {
            estimateLocService.findNumberOfLocInputByLanguageAndFunction(selectedTeam.technology.id, selectedFunctionType.id)
                .then(response => {
                    setEstimateLoc(response.data);
                    setNumberOfLocInput(response.data.numberOfLocPerInput);
                })
                .catch(error => {

                });
        }
    }, [selectedFunctionType, selectedTeam]);
    const baseColumns = [
        {
            title: 'Project Name: ' + projectName,
            children: [
                {
                    title: 'STT',
                    dataIndex: 'index',
                    key: 'index',
                    width: 60,
                    render: (text, record, index) => index + 1
                },
                {
                    title: 'Feature',
                    dataIndex: ['feature', 'featureName'],
                    key: 'featureName',
                    width: 120,
                },
                {
                    title: 'Function',
                    dataIndex: 'functionName',
                    key: 'functionName',
                    width: 200,
                },
                {
                    title: 'Screen Name',
                    dataIndex: 'screenName',
                    key: 'screenName',
                    width: 120,
                },
                {
                    title: 'Complexity',
                    dataIndex: 'complexity',
                    key: 'complexity',
                    width: 90,
                },
                {
                    title: 'Actor',
                    dataIndex: 'actor',
                    key: 'actor',
                    width: 80,
                },

                {
                    title: 'Actual LOC/LOC',
                    dataIndex: 'loc',
                    key: 'loc',
                    width: 150,
                    render: (text, record) => (
                        <div>

                            {(selectedSemester === null || selectedSemester === undefined || isEndDateWithinTwoWeeks()) ? (
                                <>
                                    {record.actualLoc !== null && record.actualLoc !== undefined ? record.actualLoc : '0'}/{record.loc}{' '}

                                </>
                            ) : (
                                <>
                                    {record.actualLoc !== null && record.actualLoc !== undefined ? record.actualLoc : '0'}/{record.loc}{' '}
                                    <Button size='small' onClick={() => showLOCModal(record)}>
                                        Edit
                                    </Button>
                                </>
                            )}
                            {record.actualLoc === null || record.actualLoc === undefined && !record.loc && (
                                <Button size='small' onClick={() => showLOCModal(record)}>
                                    Set
                                </Button>
                            )}
                        </div>
                    )
                }
            ],
        },
        {
            title: (
                <div>
                    Student
                    <Button
                        style={buttonStyle}

                        onClick={() => setShowStudentName(!showStudentName)}
                    >
                        {showStudentName ? <MinusOutlined /> : <PlusOutlined />}
                    </Button>
                </div>
            ),
            children: [
                {
                    title: 'Roll Number',
                    dataIndex: ['assignee', 'rollNumber'],
                    key: 'rollNumber',
                    width: 100,
                    render: (text) => text || <span style={{ color: 'red' }}>N/A</span>
                },
                ...(showStudentName ? [studentColumn] : []),
            ],
        },
        {
            title: (
                <div>
                    Iteration
                    <Button
                        style={buttonStyle}
                        onClick={() => setShowActualAndComplete(!showActualAndComplete)}

                    >
                        {showActualAndComplete ? <MinusOutlined /> : <PlusOutlined />}
                    </Button>
                </div>
            ),
            children: [
                {
                    title: 'Planned',
                    dataIndex: ['plannedCodeIteration', 'iterationName'],
                    key: 'plannedIterationName',
                    width: 100,
                    filters: [
                        ...iterationNames.map(name => ({ text: name, value: name })),
                    ],
                    onFilter: (value, record) => record.plannedCodeIteration?.iterationName === value,
                    render: (text) => text || <span style={{ color: 'red' }}>N/A</span>
                },
                ...(showActualAndComplete ? [
                    {
                        title: 'Actual',
                        dataIndex: ['actualCodeIteration', 'iterationName'],
                        key: 'actualIterationName',
                        width: 100,
                        render: (text) => text || <span style={{ color: 'red' }}>N/A</span>
                    },
                    {
                        title: 'Complete',
                        dataIndex: ['completedIteration', 'iterationName'],
                        key: 'completedIterationName',
                        width: 100,
                        render: (text) => text || <span style={{ color: 'red' }}>N/A</span>
                    },
                ] : []),
            ]
        },
        {
            title:
                <div>
                    <Tooltip title="This is show status of package (SRD,SDS...)" color='purple'>
                        PKG<QuestionCircleOutlined />
                    </Tooltip>
                </div>,
            dataIndex: 'pkg_status',
            key: 'pkg_status',
            width: 70,
            render: (text, record) => (
                <Button onClick={() => showPkgStatusModal(record)}>
                    Edit
                </Button>
            )
        },


        {
            title: '% Complete',
            dataIndex: 'completePercentLoc',
            key: 'completePercentLoc',
            width: 100,
            render: (text) => text !== null && text !== undefined ? `${text.toFixed(1)}%` : <span style={{ color: 'red' }}>N/A</span>
        },

    ];
    const handleShowComments = async (record) => {
        try {
            const response = await FunctionCommentAPI.fetchComments(record.projectBacklogId);
            setCurrentComments(response.data); // Assuming the API returns the comments directly
            setIsCommentsModalVisible(true);
        } catch (error) {
            console.error('Error fetching comments:', error);
            setCurrentComments([]);
        }
    };
    const actionColumn = {
        title: 'Comment',
        key: 'action',
        width: 100,
        render: (_, record) => {
            // Check if the end date is within two weeks
            if (selectedSemester === null || selectedSemester === undefined || isEndDateWithinTwoWeeks()) {
                // If it is, show the "View" button
                return (
                    <Button onClick={() => handleShowComments(record)}>View</Button>
                );
            } else {
                // Otherwise, show the "Edit" button
                return (
                    <Button onClick={() => handleEditBacklog(record)}>
                        Edit
                    </Button>
                );
            }
        },
    };


    const getTeacherEvaluationColumns = () => {
        if (showTeacherEvaluation) {
            const iterationColumns = [];
            if (iterationCount) {
                for (let i = 1; i <= iterationCount; i++) {
                    const renderIterationButton = (text, record, iterationNumber) => {

                        if (isEndDateWithinTwoWeeks()) {
                            return <span>{text ? text : 'N/A'}</span>;
                        }

                        const isButtonEnabled = !isSetButtonDisabled(iterationNumber);

                        if (text === null) {
                            if (!isButtonEnabled) {
                                return <span>N/A</span>;
                            }
                            return (
                                <Button onClick={() => handleEdit(record)}>
                                    Set
                                </Button>
                            );
                        }

                        return (
                            <div>
                                <span style={{ marginRight: '10px' }}>{text !== undefined ? text : 'N/A'}</span>
                                {isButtonEnabled && (
                                    <Button
                                        size='small'
                                        onClick={() => handleEdit(record, true)}
                                    >
                                        <EditOutlined />
                                    </Button>
                                )}
                            </div>
                        );
                    };
                    iterationColumns.push({
                        title: `Iteration ${i}`,
                        children: [
                            {
                                title: '% Add',
                                dataIndex: `locIter${i}`,
                                key: `locIter${i}`,
                                width: 120,
                                render: (text, record) => renderIterationButton(text, record, i), // Pass the iteration number here

                            },
                        ],
                    });
                }
                return [
                    {
                        title: 'Teacher Evaluation',
                        children: iterationColumns,
                    },
                ];
            }
        }
        return [];
    };
    const teacherEvaluationColumns = getTeacherEvaluationColumns();
    const combinedColumns = showTeacherEvaluation
        ? [...baseColumns, ...teacherEvaluationColumns, actionColumn]
        : [...baseColumns, actionColumn];
    const columnsChecklist = [

        {
            title: 'No',
            dataIndex: 'index',
            key: 'index',
            width: 60,
            render: (text, record, index) => index + 1
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: text => {
                if (text === null || text === undefined) {
                    return <span>N/A</span>;
                }

                if (text.length > 50) {
                    return (
                        <Tooltip title={text}>
                            <span>{text.substring(0, 50) + '...'}</span>
                        </Tooltip>
                    );
                }

                return <span>{text}</span>;
            }

        },
        {
            title: 'Details',
            dataIndex: 'details',
            key: 'details',
            render: text => {
                if (text === null || text === undefined) {
                    return <span>N/A</span>;
                }

                if (text.length > 50) {
                    return (
                        <Tooltip title={text}>
                            <span>{text.substring(0, 50) + '...'}</span>
                        </Tooltip>
                    );
                }

                return <span>{text}</span>;
            }

        },
        {
            title: 'Evaluation',
            dataIndex: 'evaluation',
            key: 'evaluation',
            render: (text, record) => (
                <Radio.Group
                    value={text}
                    onChange={e => handleRadioChange(e, record)}
                >
                    <Radio value="PASSED">Pass</Radio>
                    <Radio value="NOT_PASSED">Not Pass</Radio>
                    <Radio value="NOT_USE">Not Use</Radio>
                </Radio.Group>
            ),
            width: 300,
        }
    ];
    const layout = {
        labelCol: {
            span: 8,
        },
        wrapperCol: {
            span: 16,
        },
    };
    const validateMessages = {
        required: '${label} is required!',
        types: {
            email: '${label} is not a valid email!',
            number: '${label} is not a valid number!',
        },
        number: {
            range: '${label} must be between ${min} and ${max}',
        },
    };

    const onTabChange = (key) => {
        setActiveTabId(key);
        fetchCommentsForTab(key);
    };
    const onFinish = (values) => {

        const data = {
            projectBacklog: selectedRowData.projectBacklogId,
            iteration: activeTabId,
            comment: values.comment
        };

        FunctionCommentAPI.addOrEditComment(data)
            .then(response => {
                openNotificationWithIcon('success', 'Comment Update success!')
            })
            .catch(error => {
                const errorMessage = error.response?.data?.error || 'Failed to Update. Please try again later.';
                openNotificationWithIcon('error', 'Update Faild', errorMessage);
            });

    };
    useEffect(() => {
        if (selectedFunctionType && selectedTeam && selectedTeam.technology) {
            estimateLocService.findNumberOfLocInputByLanguageAndFunction(selectedTeam.technology.id, selectedFunctionType.id)
                .then(response => {
                    setEstimateLoc(response.data);
                })
                .catch(error => {
                    openNotificationWithIcon('warning', 'ERROR', 'please setting before estimate! Contact Head of department for more info')
                });
        }
    }, [selectedFunctionType, selectedTeam]);

    async function handleOnFinishEditLoc() {
        let newProjectBacklog;

        const updatedProjectBacklog = await Promise.all(
            projectBacklog.map(projectBacklog => {
                if (projectBacklog.projectBacklogId === editingRecord.projectBacklogId) {
                    newProjectBacklog = {
                        ...projectBacklog,
                        loc: estimateLoc.numberOfLocPerInput * number,
                        teacherSetLoc: true
                    }


                    const functionEstimateLocDTO = {
                        projectBacklog: editingRecord,
                        estimateLoc: estimateLoc,
                        numberOfInput: number
                    }

                    try {
                        ProjectBacklogAPI.updateProjectBacklogByTeacher(estimateLoc.numberOfLocPerInput * number, projectBacklog.projectBacklogId);
                        estimateLocService.addFunctionEstimateLoc(functionEstimateLocDTO);
                        openNotificationWithIcon('success', 'Success!', 'Estimate Loc Successfully!')
                        return newProjectBacklog;
                    } catch (error) {
                        console.error(error);
                    }
                }
                return projectBacklog;
            })
        )
        setProjectBacklog(updatedProjectBacklog);
        setIsModalLOCVisible(false);
        setEditingRecord(null);
        setNumberOfLocInput(null);
        setNumber(0);

        form.resetFields();
    }
    const [pkgStatus, setPkgStatus] = useState({
        srsStatus: '',
        sdsStatus: '',
        codingStatus: '',
        testingStatus: '',
    });
    const showPkgStatusModal = (record) => {
        setPkgStatus({
            srsStatus: record.srsStatus,
            sdsStatus: record.sdsStatus,
            codingStatus: record.codingStatus,
            testingStatus: record.testingStatus,
        });
        setEditingRecord(record);
        setIsModalPKGVisible(true);
    };
    const handlePkgStatusUpdate = async () => {
        if (!editingRecord) {
            console.error('No editing record set');
            return;
        }
        try {
            const projectBacklogId = editingRecord.projectBacklogId;
            const response = await ProjectBacklogAPI.updatePkgStatus(projectBacklogId, pkgStatus);
            setProjectBacklog((prevBacklog) =>
                prevBacklog.map((item) =>
                    item.projectBacklogId === projectBacklogId
                        ? { ...item, ...pkgStatus }
                        : item
                )
            );
            setIsModalPKGVisible(false);
            setEditingRecord(null); // Clear the editing record after updating
            openNotificationWithIcon('success', 'Update Successful', 'Package status updated successfully.');
        } catch (error) {
            // Handle error
            openNotificationWithIcon('error', 'Update Failed', error.response);
            console.error("Error updating PKG status:", error);
        }
    };
    const isSelectDisabled = () => {
        return selectedSemester === null || selectedSemester === undefined || isEndDateWithinTwoWeeks();
    };
    return (
        <Layout style={{ minHeight: '100vh' }}>
            <AppSidebar />
            <Layout>
                <AppHeader />
                <Helmet>
                    <title>Project Backlog</title>
                </Helmet>
                <Breadcrumb
                    items={[
                        {
                            title: <Link to='../teacher/class-list'>Home</Link>
                        },
                        {
                            title: selectedClass?.classCode + " / Project Backlog",
                        },
                    ]}
                    style={{
                        marginLeft: 45, marginTop: 20
                    }}
                />
                <h1 style={{ marginLeft: 40, padding: 0 }}>Project Backlog Management</h1>
                {
                    currentMilestone != null ?
                        <>
                            <p style={{ paddingLeft: '40px' }}><strong>Iteration: </strong>{currentMilestone?.iterationId} <strong> Start: </strong> {formatDate(currentMilestone?.fromDate)}  <strong>Countdown: </strong>{formatCountdown(countdown)}</p>

                        </>
                        : <strong style={{ marginLeft: 40, padding: 0 }} >You must set milestone(In class list screen ) first to grading loc</strong>
                }
                <Content style={{ textAlign: 'left', marginLeft: '40px', marginRight: '40px' }}>
                    <div style={{ marginBottom: 16 }}>
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
                    </div>
                    <Table
                        dataSource={projectBacklog}
                        columns={combinedColumns}
                        headStyle={{
                            background: 'blue',
                            color: 'white'
                        }}
                        scroll={{
                            x: 1500,
                            y: 500,
                        }}
                        size='small'
                        bordered
                        pagination={{
                            current: paging.current,
                            pageSize: paging.pageSize,
                            total: paging.total,
                            onChange: (current, pageSize) => handleTableChange(current, pageSize),
                        }}
                    />

                    <Modal
                        title={<span className="centered-title">Estimate Loc</span>}
                        visible={isModalLOCVisible}
                        onCancel={() => {
                            setIsModalLOCVisible(false);
                            setEditingRecord(null);
                            setNumberOfLocInput(null);
                            setNumber(0);
                            form.resetFields();
                        }}
                        footer={null}
                    >

                        <Form
                            layout="horizontal"
                            className='custom-form'
                            form={form}
                            onFinish={handleOnFinishEditLoc}
                        >
                            {selectedTeam?.technology && (
                                <div style={{ display: 'inline-block', marginBottom: 30 }}>
                                    Using Technology: <span style={{ fontWeight: 'bold' }}>{selectedTeam.technology.name}</span>
                                </div>
                            )}
                            <Form.Item
                                className="left-float-label"
                                name={['type', 'settingValue']}
                                label="Function type"
                                rules={[{ required: true, message: 'Please select a function type' }]}

                            >
                                <Select
                                    value={selectedFunctionType ? selectedFunctionType.id : null}
                                    style={{ width: '80%', float: 'right' }}
                                    onChange={(value) => {
                                        const selectedEstimateLoc = estimateLocList.find(estimateLoc => estimateLoc.id === value);
                                        setSelectedFunctionType(selectedEstimateLoc);


                                    }}
                                    placeholder="Select function type"
                                >
                                    {estimateLocList.map(estimateLoc => (
                                        <Option key={estimateLoc.id} value={estimateLoc.id}>
                                            {estimateLoc.name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            {selectedFunctionType !== null && (
                                <div>
                                    <Form.Item
                                        className="left-float-label"
                                        label="Number LOC/input field"
                                    >
                                        <Input style={{ width: '92%', float: 'right' }} disabled value={numberOfLocInput}></Input>
                                    </Form.Item>
                                </div>
                            )}


                            <Form.Item
                                className="left-float-label"
                                name={['input', 'settingValue']}
                                label="Number of input"

                                rules={[
                                    { required: true, message: "Please enter a number input" },
                                    { pattern: /^[0-9]+$/, message: 'Please input a valid number!' }
                                ]}
                                onChange={(event) => setNumber(parseInt(event.target.value, 10) || 0)}
                            >
                                <Input style={{ width: '83%', float: 'right' }} placeholder='Enter number of inputs'></Input>
                            </Form.Item>
                            {selectedFunctionType !== null && number > 0 && (
                                <div>
                                    <Form.Item
                                        className="left-float-label"
                                        label="Total LOC"
                                    >
                                        <Input style={{ width: '72%', float: 'right', color: 'red', fontWeight: 'bold' }} disabled value={numberOfLocInput * number}></Input>
                                    </Form.Item>
                                </div>

                                //    <p style={{ fontSize: '12px', textAlign: 'center', fontWeight: 'bold' }}>Toatl LOC: <span style={{ color: 'red' }}>{numberOfLocInput * number}</span></p>
                            )}
                            <Form.Item>
                                <Button type="primary" ghost htmlType="submit" style={{ marginRight: "10px" }}>
                                    Submit
                                </Button>
                                <Button danger onClick={() => {

                                    setIsModalLOCVisible(false);
                                    setEditingRecord(null);
                                    setNumberOfLocInput(null);
                                    setNumber(0);

                                    form.resetFields();
                                }}>
                                    Cancel
                                </Button>
                            </Form.Item>
                        </Form>
                    </Modal>

                    <Modal
                        title={<span className="centered-title" style={{ marginBottom: 20 }}>Edit Package Status</span>}
                        visible={isModalPKGVisible}
                        onOk={handlePkgStatusUpdate}
                        onCancel={() => {
                            setIsModalPKGVisible(false);
                            setEditingRecord(null);
                        }}
                    >

                        <Form layout="horizontal" className='custom-form'>
                            <Form.Item label="SRS Status" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                                <Select
                                    value={pkgStatus.srsStatus}
                                    onChange={(value) => setPkgStatus({ ...pkgStatus, srsStatus: value })}
                                    disabled={isSelectDisabled()}
                                >
                                    <Option value="PENDING">Pending</Option>
                                    <Option value="DOING">Doing</Option>
                                    <Option value="DONE">Done</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item label="SDS Status" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                                <Select
                                    value={pkgStatus.sdsStatus}
                                    onChange={(value) => setPkgStatus({ ...pkgStatus, sdsStatus: value })}
                                    disabled={isSelectDisabled()}
                                >
                                    <Option value="PENDING">Pending</Option>
                                    <Option value="DOING">Doing</Option>
                                    <Option value="DONE">Done</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item label="Testing Status" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                                <Select
                                    value={pkgStatus.testingStatus}
                                    onChange={(value) => setPkgStatus({ ...pkgStatus, testingStatus: value })}
                                    disabled={isSelectDisabled()}
                                >
                                    <Option value="PENDING">Pending</Option>
                                    <Option value="DOING">Doing</Option>
                                    <Option value="DONE">Done</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item label="Coding Status" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                                <Select
                                    value={pkgStatus.codingStatus}
                                    onChange={(value) => setPkgStatus({ ...pkgStatus, codingStatus: value })}
                                    disabled={isSelectDisabled()}
                                >
                                    <Option value="PENDING">Pending</Option>
                                    <Option value="DOING">Doing</Option>
                                    <Option value="DONE">Done</Option>
                                </Select>
                            </Form.Item>
                        </Form>
                    </Modal>

                    <Modal
                        title={<span className="centered-title">Edit % Add</span>}
                        visible={isModalVisible}
                        onOk={handleOk}
                        onCancel={handleCancel}
                        width={900}
                        bodyStyle={{ maxHeight: '500px', overflowY: 'auto' }} // Set max height and enable scroll
                        footer={[
                            <Button key="back" onClick={handleCancel}>Cancel</Button>,
                            <Button key="submit" type="primary" onClick={handleOk} disabled={!haveEvaluationsChanged()}>Save</Button>,
                        ]}
                    >
                        <>
                            {selectedTeam?.checkList && (
                                <div style={{ display: 'inline-block' }}>
                                    Using Checklist: <span style={{ fontWeight: 'bold' }}>{selectedTeam.checkList.name}</span>
                                </div>
                            )}
                            {selectedRowData?.assignee ? (
                                <>
                                    <EvaluationControlButtons />
                                    <Table columns={columnsChecklist} dataSource={checklistItems} pagination={false} scroll={{ y: 400 }} size='small' />
                                </>
                            ) : (
                                <p style={{ textAlign: 'center', color: 'red' }}>Don't have any student assigned to this task</p>
                            )}
                        </>
                    </Modal>
                    <Modal
                        title={<span className="centered-title">Edit Comment</span>}
                        width={900}
                        visible={isRowModalVisible}
                        onCancel={closeModal}
                        footer={null}
                    >
                        <>
                            {selectedSemester ? (
                                <Tabs
                                    tabPosition={'left'}
                                    activeKey={activeTabId}
                                    onChange={onTabChange}
                                    items={new Array(iterationCount).fill(null).map((_, i) => {
                                        const id = String(i + 1);
                                        return {
                                            label: (
                                                <Tooltip title={`Create at ${formatDate(currentComment.createdAt)}`}>
                                                    Iteration {id}
                                                </Tooltip>
                                            ),
                                            key: id,
                                            children: (
                                                <Form
                                                    key={`${id}-${currentComment.comment}`}
                                                    {...layout}
                                                    onFinish={onFinish}
                                                    validateMessages={validateMessages}
                                                    initialValues={{ comment: currentComment.comment }}
                                                >
                                                    <Form.Item name={['comment']}
                                                        rules={[{ required: true, message: 'Please enter comment!' }]}
                                                    >
                                                        <Input.TextArea
                                                            maxLength={500}
                                                            rows={7}
                                                            style={{ width: '100%', height: '100%' }}
                                                        />
                                                    </Form.Item>
                                                    <Form.Item>
                                                        <Button type="primary" ghost htmlType="submit">
                                                            Submit
                                                        </Button>
                                                    </Form.Item>
                                                </Form>
                                            ),
                                        };
                                    })}
                                />
                            ) : (
                                <p>Please select a semester to view comments.</p>
                            )}
                        </>
                    </Modal>

                    <Modal
                        title={<span className="centered-title">Comment</span>}
                        visible={isCommentsModalVisible}
                        onCancel={() => setIsCommentsModalVisible(false)}
                        onOk={() => setIsCommentsModalVisible(false)}
                        style={{ overflowY: 'auto' }}  // Add this to enable scrolling
                        bodyStyle={{ maxHeight: '60vh', overflowY: 'auto' }}
                    >
                        {currentComments && currentComments.length > 0
                            ? currentComments.map((comment, index) => (
                                <div>
                                    <strong>{comment.iteration.iterationName}</strong>
                                    <p key={`${comment.id}-${index}`}>{comment.comment}</p>
                                </div>

                            ))
                            : <p>No comments</p>
                        }
                    </Modal>
                </Content>
                <AppFooter />
            </Layout>
        </Layout>
    );
};
export default Project_Backlog;