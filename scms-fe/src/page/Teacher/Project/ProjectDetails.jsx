

import React, { useState, useEffect } from 'react';
import AppHeader from '../../../compornent/layout/Header';
import AppFooter from '../../../compornent/layout/Footer';
import AppSidebar from '../../../compornent/layout/Teacher/TeacherSidebar.jsx';
import { Layout, Button, Descriptions, message, Breadcrumb, Table, Input, Select, InputNumber } from 'antd';
import { CheckOutlined, CloseOutlined, EditOutlined, ExclamationCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import { Link, useParams } from 'react-router-dom';
import ProjectAPI from '../../../api/ProjectAPI';
import ProjectBacklogAPI from '../../../api/ProjectBacklogAPI';
import ImportProjectBacklogModal from '../ProjectBacklog/ImportProjectBacklogModal';
import featureService from '../../../api/FeatureAPI';
import ConfirmationModal from '../../../compornent/comfirmModal';
import { USER_ROLE } from '../../../constant/constain';
import openNotificationWithIcon from '../../../compornent/notifcation/index.jsx'
import { Helmet } from 'react-helmet';
const { Content } = Layout;
const { Item } = Descriptions;

const ProjectDetails = () => {
    const { projectId } = useParams();
    const [project, setProject] = useState(null);
    const [paging, setPaging] = useState({
        current: 1,
        pageSize: 20,
    });
    const [features, setFeatures] = useState([]);
    const handleTableChange = (current, pageSize) => {
        setPaging({
            ...paging,
            current: current,
            pageSize: pageSize,
        });
    };
    const refreshProjects = () => {
        ProjectBacklogAPI.getAllProjectBacklogByProjectId({
            page: paging.current - 1,
            size: paging.pageSize,
            projectId: projectId
        })
            .then(response => {
                const updatedData = response.data.content.map((item, index) => ({ key: index, ...item }));
                setProjectBacklog(updatedData);
                setPaging(prevState => ({ ...prevState, total: response.data.totalElements }));
                featureService.getFeaturesByPage(0, 100000).then(response => {
                    setFeatures(response.data.content);
                });
            });
    }
    const [projectBacklog, setProjectBacklog] = useState('');
    useEffect(() => {
        ProjectBacklogAPI.getAllProjectBacklogByProjectId({
            page: paging.current - 1,
            size: paging.pageSize,
            projectId: projectId
        })
            .then(response => {
                const updatedData = response.data.content.map((item, index) => ({ key: index, ...item }));
                setProjectBacklog(updatedData);
                setPaging(prevState => ({ ...prevState, total: response.data.totalElements }));
                
            })
            .catch(error => {
                console.error("Error fetching projects:", error);
            });
    }, [paging.current, paging.pageSize]);


    useEffect(() => {
        ProjectAPI.getProjectDetails(projectId)
            .then(response => {
                setProject(response.data);
            })
            .catch(error => {
                console.error("Error fetching project details:", error);
            });
    }, [projectId]);
    useEffect(() => {
        featureService.getFeaturesByPage(0, 100000)
            .then(response => {
                setFeatures(response.data.content);
            })
            .catch(error => {
                console.error("Error fetching features:", error);
            });
    }, []);
    const [isImportModalVisible, setIsImportModalVisible] = useState(false);

    const openImportModal = () => {
        setIsImportModalVisible(true);
    }

    const closeImportModal = () => {
        setIsImportModalVisible(false);
    }

    const handleInputChange = (e, field) => {
        const newValue = e.target.value;
        setEditingRecord(prevState => ({
            ...prevState,
            [field]: newValue,
        }));
    };

    const handleSelectChange = (value, field) => {
        const latestValue = value[value.length - 1];
        setEditingRecord(prevState => ({
            ...prevState,
            [field]: latestValue,
        }));
    };
    const handleDelete = (record) => {
        setRecordToDelete(record);
        setIsConfirmModalVisible(true);

    };
    const handleConfirmDelete = () => {
        if (recordToDelete) {
            ProjectBacklogAPI.deleteProjectBacklogs(recordToDelete.functionName, recordToDelete.feature, projectId, recordToDelete.screenName)
                .then(() => {
                    openNotificationWithIcon('success', 'Delete successfully!')
                    refreshProjects();
                })
                .catch(error => {
                    const errorMessage = error.response?.data?.error || 'Failed to delete. Please try again later.';
                    openNotificationWithIcon('error', 'Delete failed', errorMessage);
                });
        }
        setIsConfirmModalVisible(false);
        setRecordToDelete(null);
    };

    const handleCancelDelete = () => {
        setIsConfirmModalVisible(false);
        setRecordToDelete(null);
    };
    const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
    const [recordToDelete, setRecordToDelete] = useState(null);

    const handleNumberChange = (value, field) => {
        setEditingRecord(prevState => ({
            ...prevState,
            [field]: value,
        }));
    };


    const [isEditing, setIsEditing] = useState(null);
    const [editingRecord, setEditingRecord] = useState(null);

    const [originalRecord, setOriginalRecord] = useState(null);
    const [updatedRecord, setUpdatedRecord] = useState(null);

    const save = () => {
        if (!editingRecord) {
            openNotificationWithIcon('warning', 'Please select a record to edit.');
            return;
        }
        const updatedRecord = {
            projectId: projectId,
            featureId: editingRecord.featureId || editingRecord.feature.featureId,
            functionName: editingRecord.functionName,
            screenName: editingRecord.screenName,
            actor: editingRecord.actor,
            complexity: editingRecord.complexity,
            loc: editingRecord.loc
        };
        const record = {
            projectId: projectId,
            featureId: originalRecord.feature,
            functionName: originalRecord.functionName,
            screenName: originalRecord.screenName,

        };
        const combinedDTO = {
            projectBacklog4UpdateDTO: record, // single record for update
            projectBacklogDTOs: [updatedRecord] // array of records
        };
        ProjectBacklogAPI.updateProjectBacklogsForTeacher(
            combinedDTO
        )
            .then(response => {
                openNotificationWithIcon('success', 'Update successfully!');
                refreshProjects();
                setIsEditing(null);
            })
            .catch(error => {
                const errorMessage = error.response?.data?.error || 'Failed to update. Please try again later.';
                openNotificationWithIcon('error', 'Update failed', errorMessage);
            });
    };


    const cancelEditing = () => {
        setIsEditing(null);

    };
    const handleInput = (inputValue) => {
        if (inputValue && !features.some(feature => feature.featureName === inputValue)) {
            const newFeature = {
                featureId: `new-${inputValue}`,
                featureName: inputValue
            };
            setFeatures(prevFeatures => [...prevFeatures, newFeature]);
        }
    };

    const storedRoles = localStorage.getItem(USER_ROLE);
    if (!project) return <div>Loading...</div>;
    const columns = [
        {
            title: 'STT',
            dataIndex: 'index',
            key: 'index',
            width: 60,
            render: (text, record, index) => index + 1,

        },

        {

            title: 'Feature',
            dataIndex: 'feature',
            key: 'feature',
            render: (feature, record) => {
                const featureId = typeof feature === 'object' ? feature.featureId : feature;
                const featureObj = features.find(f => f.featureId === featureId);
                const featureName = featureObj ? featureObj.featureName : 'Unknown';
                if (isEditing === record.key) {
                    return (
                        <Select
                            showSearch
                            mode="tags" // Change this to "combobox" if you want only single selection with input
                            value={editingRecord ? editingRecord.featureId || editingRecord.feature.featureId : featureId}
                            onChange={(value) => handleSelectChange(value, 'featureId', record.key)}
                            style={{ width: 150 }}
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            // Add the option for user input
                            onSearch={(value) => handleInput(value)}
                            dropdownRender={menu => (
                                <>
                                    {menu}

                                </>
                            )}
                        >
                            {features.map((feature) => (
                                <Select.Option key={feature.featureId} value={feature.featureId}>
                                    {feature.featureName}
                                </Select.Option>
                            ))}
                        </Select>

                    );
                } else {
                    return featureName;
                }
            },

        },
        {
            title: 'Function',
            dataIndex: 'functionName',
            key: 'functionName',
            render: (text, record) =>
                isEditing === record.key ? (
                    <Input
                        value={editingRecord ? editingRecord.functionName : text}
                        onChange={(e) => handleInputChange(e, 'functionName')}
                    />
                ) : (
                    text
                ),
        },
        {
            title: 'Screen Name',
            dataIndex: 'screenName',
            key: 'screenName',
            render: (text, record) =>
                isEditing === record.key ? (
                    <Input
                        value={editingRecord ? editingRecord.screenName : text}
                        onChange={(e) => handleInputChange(e, 'screenName')}
                    />
                ) : (
                    text
                ),
        },
        {
            title: 'Complexity',
            dataIndex: 'complexity',
            key: 'complexity',
            render: (text, record) =>
                isEditing === record.key ? (
                    <Select
                        value={editingRecord ? editingRecord.complexity : text}
                        onChange={(value) => handleSelectChange(value, 'complexity', record.projectBacklogId)}
                    >
                        <Select.Option value="SIMPLE">SIMPLE</Select.Option>
                        <Select.Option value="MEDIUM">MEDIUM</Select.Option>
                        <Select.Option value="COMPLEX">COMPLEX</Select.Option>
                    </Select>
                ) : (
                    text
                ),
        },
        {
            title: 'Actor',
            dataIndex: 'actor',
            key: 'actor',
            render: (text, record) =>
                isEditing === record.key ? (
                    <Input
                        value={editingRecord ? editingRecord.actor : text}
                        onChange={(e) => handleInputChange(e, 'actor', record.projectBacklogId)}
                    />
                ) : (
                    text
                ),
        },
        {
            title: 'LOC',
            dataIndex: 'loc',
            key: 'loc',
            render: (text, record) =>
                isEditing === record.key ? (
                    <InputNumber
                        value={editingRecord ? editingRecord.loc : text}
                        onChange={(value) => handleNumberChange(value, 'loc', record.projectBacklogId)}
                    />
                ) : (
                    text
                ),
        },
    ];

    const userHasRoleStudent = storedRoles.includes('HeadOfDepartment', "TEACHER");
    if (userHasRoleStudent && project.lock === false) {
        columns.push({
            title: 'Action',
            key: 'action',

            render: (_, record) => {

                const editable = isEditing === record.key;
                return editable ? (
                    <span>
                        <CheckOutlined onClick={() => save(record.key)} />
                        <CloseOutlined style={{ marginLeft: 10 }} onClick={cancelEditing} />
                    </span>
                ) : (
                    <span>
                        <EditOutlined onClick={() => {
                            setIsEditing(record.key);
                            setEditingRecord(record);
                            setOriginalRecord(record);
                            setUpdatedRecord({ ...record });
                        }} />
                        
                    </span>
                );
            }
        });
    }

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <AppSidebar />
            <Layout>
                <AppHeader />
                <Helmet>
                    <title>Project Details</title>
                </Helmet>
                <Breadcrumb
                    items={[
                        { title: <Link to='../teacher/'>Home</Link> },
                        { title: <Link to='../teacher/project-list'>Projects</Link> },
                        { title: project.topicName },
                    ]}
                    style={{ marginLeft: 140, marginTop: 20 }}
                />
                <Content style={{ padding: '20px 140px' }}>
                    <h1 style={{ textAlign: 'center' }}>Project Details</h1>
                    <Button type="primary" ghost style={{ marginBottom: 20 }} onClick={openImportModal}>
                        Import Project WBS
                    </Button>
                    <Descriptions bordered layout="horizontal">
                        <Item label={<strong>Project Code</strong>}>{project.topicCode}</Item>
                        <Item label={<strong>Project Name</strong>}>{project.topicName}</Item>
                        <Item label={<strong>Created By</strong>}>{project.createdBy.fullName}</Item>
                        <Item label={<strong>Description</strong>}>{project.description}</Item>
                    </Descriptions>
                    <h3>Project WBS</h3>
                    <Table
                        dataSource={projectBacklog}
                        columns={columns}
                        scroll={{

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
                    <Link to={'../teacher/project-list'}>
                        <Button type="primary" style={{ float: 'left', marginTop: 10 }}>
                            Back
                        </Button>
                    </Link>
                    <ConfirmationModal
                        isVisible={isConfirmModalVisible}
                        onConfirm={handleConfirmDelete}
                        onCancel={handleCancelDelete}
                        title={
                            <>
                                <ExclamationCircleOutlined style={{ color: 'red', marginRight: '8px' }} />
                                Confirm Deletion
                            </>
                        }
                        content="Are you sure you want to delete this record?"
                    />
                    <ImportProjectBacklogModal isVisible={isImportModalVisible} onClose={closeImportModal} onRefresh={refreshProjects} />
                </Content>
                <AppFooter />
            </Layout>
        </Layout>
    );
};

export default ProjectDetails;
