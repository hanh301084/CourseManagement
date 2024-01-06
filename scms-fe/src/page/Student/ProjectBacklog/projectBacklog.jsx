import React, { useState, useEffect } from 'react';
import AppHeader from '../../../compornent/layout/Header'
import AppFooter from '../../../compornent/layout/Footer'
import AppSidebar from '../../../compornent/layout/Student/StudentSidebar';
import ProjectBacklogAPI from '../../../api/ProjectBacklogAPI';
import SemesterService from '../../../api/SemesterAPI';
import iterationServiceInstance from '../../../api/IterationAPI';
import openNotificationWithIcon from '../../../compornent/notifcation';
import FunctionCommentAPI from '../../../api/FunctionCommentAPI.jsx';
import { QuestionCircleOutlined, CheckOutlined, CloseOutlined, EditOutlined, SearchOutlined, DeleteOutlined } from '@ant-design/icons'
import {
    Layout,
    Table,
    Select,
    Button,
    Tooltip,
    Modal,
    Form,
    Input,
} from 'antd';
import SettingAPI from '../../../api/SettingAPI';
import estimateLocService from '../../../api/EstimateLocAPI';
const { Content } = Layout;
const { Option } = Select;
const Project_Backlog = () => {
    const [paging, setPaging] = useState({
        current: 1,
        pageSize: 10,
    });
    const [projectBacklog, setProjectBacklog] = useState('');
    const [projectName, setProjectName] = useState('');
    const [selectedSemester, setSelectedSemester] = useState(null);
    const semesterId = sessionStorage.getItem('semesterId');
    const [isEditing, setIsEditing] = useState(null);
    const [editingRecord, setEditingRecord] = useState(null);
    const [semesters, setSemesters] = useState([]);
    const [students, setStudents] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [selectedClass, setSelectedClass] = useState([]);
    const [iterationCount, setIterationCount] = useState(0);
    const [iterations, setIterations] = useState([])
    const [pendingSemester, setPendingSemester] = useState(null);
    const [isModalPKGVisible, setIsModalPKGVisible] = useState(false);
    const [isModalLOCVisible, setIsModalLOCVisible] = useState(false);
    const [isModalAddVisible, setIsModalAddVisible] = useState(false);
    const [showTeacherEvaluation, setShowTeacherEvaluation] = useState(true);
    const [isCommentsModalVisible, setIsCommentsModalVisible] = useState(false);
    const [currentComments, setCurrentComments] = useState([]);
    const [team, setTeam] = useState();
    const [pkgStatus, setPkgStatus] = useState({
        srsStatus: '',
        sdsStatus: '',
        codingStatus: '',
        testingStatus: '',
    });
    const [form] = Form.useForm();
    const [numberOfLocInput, setNumberOfLocInput] = useState(null);
    const [selectedFunctionType, setSelectedFunctionType] = useState();
    const [estimateLoc, setEstimateLoc] = useState(null);
    const [functionEstimateLocData, setFunctionEstimateLocData] = useState(null);
    const [number, setNumber] = useState();
    const [estimateLocList, setEstimateLocList] = useState([]);
    const [language, setLanguage] = useState();
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
    const isSelectDisabled = () => {
        return selectedSemester === null || selectedSemester === undefined || isEndDateWithinTwoWeeks();
    };
    const [formAdd] = Form.useForm();
    // const showAddModal = () => {
    //     setIsModalAddVisible(true);
    // };
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
        if (selectedFunctionType && team && team.technology) {
            estimateLocService.findNumberOfLocInputByLanguageAndFunction(team.technology.id, selectedFunctionType.id)
                .then(response => {
                    setEstimateLoc(response.data);
                    setNumberOfLocInput(response.data.numberOfLocPerInput);
                })
                .catch(error => {

                });
        }
    }, [selectedFunctionType, team]);

    useEffect(() => {
        ProjectBacklogAPI.getAllProjectBacklogFroStudent({
            semesterId: selectedSemester ? selectedSemester.semesterId : semesterId,
            page: paging.current - 1,
            size: paging.pageSize,

        })
            .then(response => {
                const dataWithKeys = response.data.content.map((item, index) => ({
                    ...item,
                    key: item.projectBacklogId,
                }));
                setProjectBacklog(dataWithKeys);
                setPaging(prevState => ({ ...prevState, total: response.data.totalElements }));
                setProjectName(response.data.content[0]?.team?.project?.topicName || '');
                setSelectedTeam(response.data.content[0]?.team?.teamId)
                setTeam(response.data.content[0]?.team)
                setSelectedClass(response.data.content[0]?.team?.classEntity)
            })
            .catch(error => {
                console.error("Error fetching projects:", error);
            });
    }, [paging.current, paging.pageSize, selectedSemester]);
    useEffect(() => {
        if (selectedTeam) {
            ProjectBacklogAPI.getTeamUsers(selectedTeam).then(data => {
                setStudents(data.data);
            }).catch(error => {
                console.error("Error fetching team users:", error);
            });
        }
    }, [selectedTeam]);
    const isEndDateWithinTwoWeeks = () => {
        if (!selectedSemester || !selectedSemester.endDate) return false;
        const endDate = new Date(selectedSemester.endDate);
        const today = new Date();
        const twoWeeksTime = 14 * 24 * 60 * 60 * 1000; // 14 days in milliseconds
         
        if( today.getTime() -endDate.getTime()   >= twoWeeksTime){
            return true
        }
        else{
            return false
        }
    };
 
    useEffect(() => {
        estimateLocService.getAllFunctionTypesActive()
            .then(response => {
                setEstimateLocList(response.data);
            })
            .catch(error => console.error("Fecth estimateLoc error", error))
    }, [language])
    const handleTableChange = (pagination) => {
        setPaging({
            ...paging,
            current: pagination.current,
            pageSize: pagination.pageSize,
        });
    };

    const save = async (projectBacklogId) => {

        if (editingRecord) {
            try {
                const response = await ProjectBacklogAPI.updateProjectBacklog(editingRecord);
                setIsEditing(null);
                setEditingRecord(null);
                openNotificationWithIcon('success', 'Update Successful', response.data);
                ProjectBacklogAPI.getAllProjectBacklogFroStudent({
                    semesterId: selectedSemester ? selectedSemester.semesterId : semesterId,
                    page: paging.current - 1,
                    size: paging.pageSize,

                })
                    .then(response => {
                        const dataWithKeys = response.data.content.map((item, index) => ({
                            ...item,
                            key: item.projectBacklogId,
                        }));

                        setProjectBacklog(dataWithKeys);
                        setPaging(prevState => ({ ...prevState, total: response.data.totalElements }));
                        setProjectName(response.data.content[0]?.team?.project?.topicName || '');
                        setSelectedTeam(response.data.content[0]?.team?.teamId)
                        setSelectedClass(response.data.content[0]?.team?.classEntity)
                    })
                    .catch(error => {
                        console.error("Error fetching projects:", error);
                    });


            } catch (error) {
                openNotificationWithIcon('error', 'Update Failed!', error.response.data.message || 'An error occurred');
            }
        }
    };

    const cancelEditing = () => {
        setIsEditing(null);
        setEditingRecord(null);
        setIsModalPKGVisible(false); // Close the modal when canceling
    };
    const toggleTeacherEvaluation = () => {
        setShowTeacherEvaluation(prevState => !prevState);
    };
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
    const handleSemesterChange = value => {
        setPendingSemester(value);
    };
    const applySemesterFilter = () => {
        const selectedSemester = semesters.find(semester => semester.semesterId === pendingSemester);
        setSelectedSemester(selectedSemester);
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
    const handleLOCStatusUpdate = () => {
        form
            .validateFields()
            .then(values => {

                setIsModalLOCVisible(false);
            })
            .catch(errorInfo => {
            });
    };
    useEffect(() => {
        formAdd.setFieldsValue({ teamId: selectedTeam });
    }, [selectedTeam, formAdd]);
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
    // const handleAddBacklog = () => {
    //     formAdd
    //         .validateFields()
    //         .then(values => {
    //             const projectBacklog = {
    //                 ...values,
    //                 teamId: selectedTeam,
    //             };
    //             ProjectBacklogAPI.AddProjectBacklog(projectBacklog)
    //                 .then(response => {
    //                     openNotificationWithIcon('success', 'Add Successful', response.data);
    //                     setIsModalAddVisible(false);
    //                     ProjectBacklogAPI.getAllProjectBacklogFroStudent({
    //                         semesterId: selectedSemester ? selectedSemester.semesterId : semesterId,
    //                         page: paging.current - 1,
    //                         size: paging.pageSize,
    //                         sort: ['projectBacklogId,desc']

    //                     })
    //                         .then(response => {
    //                             const dataWithKeys = response.data.content.map((item, index) => ({
    //                                 ...item,
    //                                 key: item.projectBacklogId,
    //                             }));

    //                             setProjectBacklog(dataWithKeys);
    //                             setPaging(prevState => ({ ...prevState, total: response.data.totalElements }));
    //                             setProjectName(response.data.content[0]?.team?.project?.topicName || '');
    //                             setSelectedTeam(response.data.content[0]?.team?.teamId)
    //                             setSelectedClass(response.data.content[0]?.team?.classEntity)
    //                         })
    //                         .catch(error => {
    //                             console.error("Error fetching projects:", error);
    //                         });
    //                 })
    //                 .catch(error => {
    //                     const errorMessage = error.response?.data?.message || 'Failed to add the backlog. Please try again later.';
    //                     openNotificationWithIcon('error', 'Add Failed', errorMessage);
    //                 });
    //         })
    // };
    const handleDelete = (projectBacklogId) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this backlog?',
            onOk() {
                ProjectBacklogAPI.deleteProjectBacklog(projectBacklogId)
                    .then((response) => {
                        openNotificationWithIcon('success', 'Deletion Successful', 'The backlog has been deleted.');
                        setProjectBacklog(prevBacklog => prevBacklog.filter(item => item.projectBacklogId !== projectBacklogId));
                    })
                    .catch(error => {

                        const errorMessage = error.response?.data?.message || 'Failed to delete the backlog. Please try again later.';
                        openNotificationWithIcon('error', 'Deletion Failed', errorMessage);
                    });
            }
        });
    };
    useEffect(() => {

        if (selectedSemester && selectedSemester.semesterId) {
            SettingAPI.getIterationSettings(selectedSemester.semesterId)
                .then(response => {
                    const settings = response.data;
                    let iterationsSetting;
                    if (selectedClass) {
                        if (selectedClass.isBlock5 === "YES") {
                            iterationsSetting = settings.find(s => s.settingTitle === "ITERATION_BLOCK5");
                        } else {
                            iterationsSetting = settings.find(s => s.settingTitle === "ITERATION_BLOCK10");
                        }

                        if (iterationsSetting) {
                            setIterationCount(parseInt(iterationsSetting.settingValue));
                        }
                    }

                })
                .catch(error => {
                    console.error("Error fetching iteration settings:", error);
                });
        }
    }, [selectedSemester, selectedClass]);
    // console.log(selectedClass.isBlock5)
    const limit = iterationCount;
    useEffect(() => {

        if (iterationCount) {
            iterationServiceInstance.getAllIterationActiveLimit(limit)
                .then(response => {
                    setIterations(response.data)
                })
                .catch(error => {
                    console.error("Error fetching iteration settings:", error);
                });
        }
    }, [limit]);
     if (selectedSemester === null || selectedSemester === undefined || isEndDateWithinTwoWeeks()) {

    }
    const actionColumn = {
        title: 'Action',
        key: 'action',
        width: 100,
        render: (_, record) => {
            // Check if %add is not null
            if (record.locIter1 || record.locIter2 || record.locIter3 || record.locIter4 || record.locIter5 || record.locIter6) {
                return null;
            }

            const editable = isEditing === record.projectBacklogId;

            return editable ? (
                <div style={{ justifyContent: 'inline' }}>
                    <CheckOutlined onClick={() => save(record.projectBacklogId)} />
                    <CloseOutlined style={{ marginLeft: 10 }} onClick={cancelEditing} />
                </div>
            ) : (
                <span>
                    <EditOutlined onClick={() => {
                        setIsEditing(record.projectBacklogId);
                        setEditingRecord({ ...record });
                    }} />
                    <DeleteOutlined
                        style={{ marginLeft: 10, color: 'red' }}
                        onClick={() => handleDelete(record.projectBacklogId)}
                    />
                </span>
            );
        }
    };
    console.log(iterationCount)
    const getTeacherEvaluationColumns = () => {
        if (showTeacherEvaluation) {
            // Create an array for iteration columns
            const iterationColumns = [];
            if (iterationCount) {
                for (let i = 1; i <= iterationCount; i++) {
                    iterationColumns.push({
                        title: `Iteration ${i}`,
                        children: [
                            {
                                title: '% Add',
                                dataIndex: `locIter${i}`,
                                key: `locIter${i}`,
                                width: 120,
                                render: (text) => text || <span style={{ color: 'red' }}>N/A</span>
                            },
                        ]
                    });
                }
                return [{
                    title: 'Teacher Evaluation',
                    children: iterationColumns
                }];
            }
        }
        return [];
    };
    const commentsColumn = {
        title: 'Comments',
        key: 'comments',
        render: (_, record) => (
            <Button onClick={() => handleShowComments(record)}>View Comments</Button>
        ),
        width: 150
    };
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
                    width: 200,

                },
                {
                    title: 'Function',
                    dataIndex: 'functionName',
                    key: 'functionName',
                    width: 200,

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
                    width: 120,
                    render: (text, record) => (
                        record.teacherSetLoc ?
                            <div>
                                {record.loc}
                            </div>
                            : <div>
                                {(record.actualLoc !== null && record.actualLoc !== undefined) || record.loc ? (
                                    <>
                                        {record.actualLoc !== null && record.actualLoc !== undefined ? record.actualLoc : '0'}/{record.loc}{' '}
                                        <Button size='small' onClick={() => showLOCModal(record)}>
                                            <EditOutlined />
                                        </Button>
                                    </>
                                ) : (
                                    <span style={{ color: 'red' }}>N/A</span>
                                )}
                                {record.actualLoc === null || record.actualLoc === undefined && !record.loc && (
                                    <Button size='small' onClick={() => showLOCModal(record)}>
                                        Set
                                    </Button>
                                )}
                            </div>
                    )
                },
            ],
        },
        {
            title: 'Iteration',
            children: [
                {
                    title: 'Planned',
                    dataIndex: ['plannedCodeIteration', 'iterationName'],
                    key: 'iterationName',
                    width: 100,
                    render: (text, record) => {
                        const editable = isEditing === record.projectBacklogId;
                        if (editable) {
                            return (
                                <Select
                                    style={{ width: 100 }}
                                    value={editingRecord && editingRecord.plannedCodeIteration ? editingRecord.plannedCodeIteration.iterationName : ''}
                                    onChange={(value) => {
                                        const iteration = iterations.find(iter => iter.iterationName === value);
                                        if (iteration) {
                                            const newEditingRecord = {
                                                ...editingRecord,
                                                plannedCodeIteration: {
                                                    iterationId: iteration.iterationId, // Assuming you need to set this as well
                                                    iterationName: value,
                                                },
                                            };
                                            setEditingRecord(newEditingRecord);
                                        } else {
                                            console.error('Iteration not found for name:', value);
                                        }
                                    }}
                                >
                                    {iterations.map((iter) => (
                                        <Option key={iter.iterationId} value={iter.iterationName}>
                                            {iter.iterationName}
                                        </Option>
                                    ))}
                                </Select>
                            );
                        }
                        return record.plannedCodeIteration ? text : <span style={{ color: 'red' }}>N/A</span>;
                    }
                },

                {
                    title: 'Actualy',
                    dataIndex: ['actualCodeIteration', 'iterationName'],
                    key: 'iterationName',
                    width: 100,
                    render: (text) => text || <span style={{ color: 'red' }}>N/A</span>

                },
                {
                    title: 'Complete',
                    dataIndex: ['completedIteration', 'iterationName'],
                    key: 'iterationName',
                    width: 100,
                    render: (text) => text || <span style={{ color: 'red' }}>N/A</span>
                },

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
            title: 'Student',
            children: [
                {
                    title: 'Student Name',
                    dataIndex: ['assignee', 'fullName'],
                    key: 'fullName',
                    width: 200,
                    render: (text) => text || <span style={{ color: 'red' }}>N/A</span>
                },
                {
                    title: 'Roll Number',
                    dataIndex: ['assignee', 'rollNumber'],
                    key: 'rollNumber',
                    width: 100,
                    render: (text, record) => {
                        const editable = isEditing === record.projectBacklogId;
                        if (editable) {
                            const rollNumberValue = editingRecord && editingRecord.assignee ? editingRecord.assignee.rollNumber : '';
                            return (
                                <Select
                                    showSearch
                                    style={{ width: 100 }}
                                    placeholder="Select a roll number"
                                    optionFilterProp="children"
                                    value={editingRecord && editingRecord.assignee ? editingRecord.assignee.rollNumber : ''}
                                    onChange={(value, option) => {
                                        const student = students.find(student => student.rollNumber === value);
                                        const newEditingRecord = {
                                            ...editingRecord,
                                            assignee: {
                                                ...editingRecord.assignee,
                                                userId: student.userId, // Make sure this is set
                                                rollNumber: value,
                                                fullName: student.fullName,
                                            },
                                        };
                                        setEditingRecord(newEditingRecord);
                                    }}
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    {students.map((student) => (
                                        <Option key={student.userId} value={student.rollNumber}>
                                            {student.rollNumber}
                                        </Option>
                                    ))}
                                </Select>
                            );
                        }
                        return text || <span style={{ color: 'red' }}>N/A</span>;
                    }
                },


            ],
        },
        {
            title: '% Complete',
            dataIndex: 'completePercentLoc',
            key: 'completePercentLoc',
            width: 100,
            render: (text) => text !== null && text !== undefined ? `${text.toFixed(2)}%` : <span style={{ color: 'red' }}>N/A</span>
        },

    ];

    const teacherEvaluationColumns = getTeacherEvaluationColumns();
    const combinedColumns = showTeacherEvaluation
        ? [...baseColumns, ...teacherEvaluationColumns, commentsColumn, actionColumn]
        : [...baseColumns, commentsColumn, actionColumn];
    useEffect(() => {
        if (selectedFunctionType && team && team.technology) {
            estimateLocService.findNumberOfLocInputByLanguageAndFunction(team.technology.id, selectedFunctionType.id)
                .then(response => {
                    setEstimateLoc(response.data);
                })
                .catch(error => {
                    openNotificationWithIcon('warning', 'ERROR', 'please setting before estimate! Contact Head of department for more info')
                });
        }
    }, [selectedFunctionType, team]);
    async function handleOnFinishEditLoc() {
        let newProjectBacklog;
        if (!estimateLoc) {
            openNotificationWithIcon('error', 'ERROR', 'please setting before estimate! Contact Head of department for more info')

            return;
        }
        const updatedProjectBacklog = await Promise.all(
            projectBacklog.map(projectBacklog => {
                if (projectBacklog.projectBacklogId === editingRecord.projectBacklogId) {
                    newProjectBacklog = {
                        ...projectBacklog,
                        loc: estimateLoc.numberOfLocPerInput * number,
                       
                    }


                    const functionEstimateLocDTO = {
                        projectBacklog: editingRecord,
                        estimateLoc: estimateLoc,
                        numberOfInput: number
                    }

                    try {
                        estimateLocService.addFunctionEstimateLoc(functionEstimateLocDTO);
                        ProjectBacklogAPI.updateProjectBacklogByStudent(estimateLoc.numberOfLocPerInput * number, projectBacklog.projectBacklogId);

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

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <AppSidebar />
            <Layout>
                <AppHeader />
                <h1 style={{ marginLeft: 40 }}>Project Backlog Management</h1>
                <Content style={{ textAlign: 'left', padding: '10px', paddingLeft: '40px', paddingRight: '40px' }}>
                    <Select
                        style={{ width: 200, marginRight: 10 }}
                        placeholder="Select a semester"
                        onChange={handleSemesterChange}
                        value={selectedSemester ? selectedSemester.semesterId : ''}
                    >
                        {semesters.map((semester) => (
                            <Option key={semester.semesterId} value={semester.semesterId}>
                                {semester.semesterName}
                            </Option>
                        ))}
                    </Select>
                    <Button type="primary" onClick={applySemesterFilter}>
                        <SearchOutlined />
                    </Button>
                    <Button ghost type="primary" style={{ marginLeft: 20 }} onClick={toggleTeacherEvaluation}>
                        {showTeacherEvaluation ? 'Hide Evaluation' : 'View Evaluation'}
                    </Button>

                    <Table

                        dataSource={projectBacklog}
                        columns={combinedColumns}
                        headStyle={{
                            background: 'blue',
                            color: 'white'
                        }}
                        scroll={{
                            x: 1500,
                            y: 420,
                        }}
                        size='small'
                        bordered
                        pagination={{
                            current: paging.current,
                            pageSize: paging.pageSize,
                            total: paging.total,

                        }}
                        onChange={handleTableChange}
                    />
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
                            onFinish={() => handleOnFinishEditLoc()}
                        >

                            {team?.technology && (

                                <div style={{ display: 'inline-block', marginBottom: 30 }}>
                                    Using Technology: <span style={{ fontWeight: 'bold' }}>{team.technology.name}</span>
                                </div>
                            )}
                            <Form.Item
                                name={['type', 'settingValue']}
                                label="Function type"
                                rules={[{ required: true, message: 'Please select a function type' }]}
                                style={{ marginLeft: 19 }}
                            >
                                <Select
                                    value={selectedFunctionType ? selectedFunctionType.id : null}
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
                                <p style={{ fontSize: '12px', textAlign: 'center', fontWeight: 'bold' }}>Number of LOC/input field: <span style={{ color: 'red' }}>{numberOfLocInput}</span></p>
                            )}


                            <Form.Item
                                name={['input', 'settingValue']}
                                label="Number of input"
                                rules={[
                                    { required: true, message: "Please enter a number input" },
                                    { pattern: /^[0-9]+$/, message: 'Please input a valid number!' }
                                ]}
                                onChange={(event) => setNumber(parseInt(event.target.value, 10) || 0)}
                            >
                                <Input placeholder='Enter number of inputs'></Input>
                            </Form.Item>
                            {selectedFunctionType !== null && number > 0 && (
                                <p style={{ fontSize: '12px', textAlign: 'center', fontWeight: 'bold' }}>Toatl LOC: <span style={{ color: 'red' }}>{numberOfLocInput * number}</span></p>
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

                    {/* <Modal
                        title="Add Project Backlog"
                        visible={isModalAddVisible}
                        onOk={() => formAdd.validateFields().then(handleAddBacklog)}
                        onCancel={() => {
                            setIsModalAddVisible(false); // Correct usage of the state setter function
                            setEditingRecord(null);
                        }}
                    >
                        <Form
                            layout="horizontal"
                            form={formAdd} // You need to create this instance with Form.useForm()
                        >
                            <Form.Item
                                labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}
                                name="featureName"
                                label="Feature Name"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please enter feature name!',
                                    },
                                ]}
                            >
                                <Input style={{ width: 200 }} placeholder="Enter Feature Name" />
                            </Form.Item>
                            <Form.Item
                                labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}
                                name="functionName"
                                label="Function Name"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please enter function name!',
                                    },
                                ]}
                            >
                                <Input style={{ width: 200 }} placeholder="Enter Function Name" />
                            </Form.Item>
                            <Form.Item
                                labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}
                                name="actor"
                                label="Actor"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please enter Actor!',
                                    },
                                ]}
                            >
                                <Input style={{ width: 200 }} placeholder="Enter Actor" />

                            </Form.Item>
                            <Form.Item
                                labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}
                                name="complexity"
                                label="Complexity"
                                rules={[{ required: true, message: 'Please select the complexity!' }]}
                            >
                                <Select style={{ width: 200 }} placeholder="Select complexity">
                                    <Option value="SIMPLE">Simple</Option>
                                    <Option value="MEDIUM">Medium</Option>
                                    <Option value="HIGH">High</Option>
                                </Select>
                            </Form.Item>
                        </Form>
                    </Modal> */}
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