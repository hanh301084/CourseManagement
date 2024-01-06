import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Layout, Breadcrumb, Input, Pagination, Select, Button, Switch, Tooltip } from 'antd';
import AppHeader from '../../../compornent/layout/Header'
import AppFooter from '../../../compornent/layout/Footer'
import AppSidebar from '../../../compornent/layout/Teacher/TeacherSidebar.jsx';
import { EditOutlined, StopOutlined, CheckOutlined, SearchOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom'
import ProjectAPI from '../../../api/ProjectAPI';
import ModalAddOrEdit from './ModalAddOrEdit.jsx';
import ConfirmationModal from '../../../compornent/comfirmModal';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import openNotificationWithIcon from '../../../compornent/notifcation/index.jsx'
import ImportModal from './ImportModal';
import { Helmet } from 'react-helmet';
import './style.css'
const { Content } = Layout;
const { Meta } = Card;

const ProjectList = () => {
    const [projects, setProjects] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [paging, setPaging] = useState({
        current: 1,
        pageSize: 6,
        total: 0
    });
    const [isToggleActiveModalVisible, setIsToggleActiveModalVisible] = useState(false);
    const [projectToToggle, setProjectToToggle] = useState(null);
    const [statusFilter, setStatusFilter] = useState('');
    // for getAll project
    useEffect(() => {
        ProjectAPI.getAllProjects({
            page: paging.current - 1,
            size: paging.pageSize,
            search: searchTerm,
            status: statusFilter
        })
            .then(response => {
                setProjects(response.data.content);
                setPaging(prevState => ({ ...prevState, total: response.data.totalElements }));
            })
            .catch(error => {
                console.log(error);
            });
    }, [paging.current, paging.pageSize, searchTerm, statusFilter]);
    // for search
    const handleSearch = (value) => {
        setSearchTerm(value);
        
    };
    // for paging
    const handlePageChange = (page, pageSize) => {
        setPaging(prevState => ({ ...prevState, current: page, pageSize: pageSize }));
    }
    // for refresh
    const refreshProjects = () => {
        ProjectAPI.getAllProjects({
            page: paging.current - 1,
            size: paging.pageSize,
            search: searchTerm,
            sort: ['projectId,desc']
        })
            .then(response => {
                setProjects(response.data.content);
            });
    }
    const handleToggleActive = (project) => {
        setProjectToToggle(project);
        setIsToggleActiveModalVisible(true);
    };
    const confirmToggleActive = () => {
        if (!projectToToggle) {
            console.error('No project selected for toggling');
            return;
        }

        let action;
        if (projectToToggle.status === "ACTIVE") {
            action = ProjectAPI.deactivateProject; // Assuming this API call exists
        } else {
            action = ProjectAPI.activateProject; // Assuming this API call exists
        }

        action(projectToToggle.projectId)
            .then(response => {
                setIsToggleActiveModalVisible(false);
                setProjectToToggle(null);
                ProjectAPI.getAllProjects({
                    page: paging.current - 1,
                    size: paging.pageSize,
                    search: searchTerm
                })
                    .then(response => {
                        setProjects(response.data.content);
                        setPaging(prevState => ({ ...prevState, total: response.data.totalElements }));
                    })
                    .catch(error => {

                    });
                openNotificationWithIcon('success','Success', projectToToggle.status === "ACTIVE" ? 'Project Deactivated Successfully!' : 'Project Activated Successfully!');


            })
            .catch(error => {
                const errorMessage = error.response?.data?.error || 'Failed to toggle. Please try again later.';
                openNotificationWithIcon('error', 'Toggle failed', errorMessage);
            });
    };



    const cancelToggleActive = () => {
        setIsToggleActiveModalVisible(false);
        setProjectToToggle(null);
    };

    // for open modal edit/add 
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);

    const openModal = (project = null) => {
        setSelectedProject(project);
        setIsModalVisible(true);
    }

    const closeModal = () => {
        setIsModalVisible(false);
        setSelectedProject(null);
    }
    // handal submit / save data
    const handleModalOk = (values) => {
        if (selectedProject) { // If we are editing an existing project
            values.projectId = selectedProject.projectId; // Ensure projectId is included
            ProjectAPI.updateProject(values)
                .then(response => {
                    closeModal();
                    openNotificationWithIcon('success', 'Sucess', 'Project Update Successfully!')
                    ProjectAPI.getAllProjects({
                        page: paging.current - 1,
                        size: paging.pageSize,
                        search: searchTerm
                    })
                        .then(response => {
                            setProjects(response.data.content);
                        })
                })
                .catch(error => {
                    const errorMessage = error.response?.data?.error || 'Failed to Update. Please try again later.';
                    openNotificationWithIcon('error', 'Update failed', errorMessage);
                    setIsModalVisible(true);
                });
        } else {
            const existingProject = projects.find(project =>
                project.topicCode === values.topicCode || project.topicName === values.topicName
            );

            if (existingProject) {
                openNotificationWithIcon('warning', 'Update failed', 'Project with this Project code  or Project name already exists!');
                setIsModalVisible(true);
            } else {
                ProjectAPI.createProject(values)
                    .then(response => {
                        closeModal();
                        openNotificationWithIcon('success', 'Success', 'Project Add Successfully!')
                        ProjectAPI.getAllProjects({
                            page: paging.current - 1,
                            size: paging.pageSize,
                            search: searchTerm,
                            sort: ['projectId,desc']
                        })
                            .then(response => {
                                setProjects(response.data.content);
                            })

                    })
                    .catch(error => {
                        const errorMessage = error.response?.data?.error || 'Failed to add new Project. Please try again later.';
                        openNotificationWithIcon('error', 'Add failed', errorMessage);
                        setIsModalVisible(true);
                    });
            }
        }
    };
    // for import
    const [isImportModalVisible, setIsImportModalVisible] = useState(false);

    const openImportModal = () => {
        setIsImportModalVisible(true);
    }

    const closeImportModal = () => {
        setIsImportModalVisible(false);
    }


    return (
        <Layout style={{ minHeight: '100vh' }}>
            <AppSidebar />
            <Layout>
                <AppHeader />
                <Helmet>
                    <title>Project Management</title>
                </Helmet>
                <Breadcrumb
                    items={[
                        { title: 'Home' },
                        { title: 'Projects' },
                    ]}
                    style={{ marginLeft: 140, marginTop: 20 }}
                />
                <h1  style={{ padding: '0px 140px' }}>Project Management</h1>
                <Content style={{ padding: '0px 140px' }}>
                    <div>
                        <div >
                            <Button type="primary" ghost onClick={() => openModal()} >Add Project</Button>
                            <Button type="primary" ghost style={{ marginLeft: 16 }} onClick={openImportModal}>
                                Import Project
                            </Button>
                            <Select defaultValue="" style={{ width: 120,marginLeft: 16 }} onChange={value => setStatusFilter(value)}>
                                <Select.Option value="">All</Select.Option>
                                <Select.Option value="ACTIVE">Active</Select.Option>
                                <Select.Option value="INACTIVE">Inactive</Select.Option>
                            </Select>
                            <Input.Search
                                placeholder="Search for projects"
                                onSearch={handleSearch}
                                style={{ marginBottom: '20px', marginLeft: 20, width: 350 }}
                                enterButton={<SearchOutlined/>}
                            />

                        </div>

                        {projects.length === 0 ? (
                            <p style={{ textAlign: 'center', color: 'red' }}>No projects found.</p>
                        ) : (
                            <Row gutter={[16, 16]}>
                                {projects.map((project, index) => (
                                    <Col key={index} span={8}>
                                        <Card
                                            style={{ width: 250 }}
                                            cover={
                                                <img
                                                    alt={project.topic_name}
                                                    src="https://tse1.mm.bing.net/th?id=OIP.xDT6bi2DLL0_w9Z6UTwz5gHaHa&pid=Api&P=0&h=220"
                                                />
                                            }
                                            actions={[
                                                <Button onClick={() => openModal(project)}><EditOutlined /></Button>,
                                                <Switch
                                                    checked={project.status === "ACTIVE"}
                                                    onChange={() => handleToggleActive(project)}
                                                    checkedChildren={<CheckOutlined />}
                                                    unCheckedChildren={<StopOutlined />}
                                                />
                                            ]}
                                        >
                                            <Meta
                                                title={
                                                    <div>
                                                        <Link to={`/teacher/project-details/${project.projectId}`}>
                                                            {project.topicName}({project.topicCode})
                                                        </Link>
                                                    </div>}
                                                description={
                                                    <Tooltip title={project.description || 'N/A'}>
                                                        <div className="truncate">
                                                            {project.description || 'N/A'}
                                                        </div>
                                                    </Tooltip>
                                                }
                                            />
                                            <ConfirmationModal
                                                isVisible={isToggleActiveModalVisible}
                                                onConfirm={confirmToggleActive}
                                                onCancel={cancelToggleActive}
                                                title={
                                                    <>
                                                        <ExclamationCircleOutlined style={{ color: 'red', marginRight: '8px' }} />
                                                        Confirm {projectToToggle?.isActive ? 'Deactivation' : 'Activation'}
                                                    </>
                                                }
                                                content={`Are you sure you want to ${projectToToggle?.isActive ? 'deactivate' : 'activate'} this project?`}
                                            />
                                        </Card>
                                    </Col>
                                ))}

                            </Row>
                        )}
                        <Pagination
                            current={paging.current}
                            pageSize={paging.pageSize}
                            total={paging.total}
                            onChange={handlePageChange}
                            style={{ marginTop: '20px', textAlign: 'center' }}
                        />
                        <ModalAddOrEdit
                            isVisible={isModalVisible}
                            project={selectedProject}
                            onClose={closeModal}
                            onSave={handleModalOk}
                        />

                        <ImportModal isVisible={isImportModalVisible} onClose={closeImportModal} onRefresh={refreshProjects} />

                    </div>
                </Content>
                <AppFooter />
            </Layout>
        </Layout>
    );
};

export default ProjectList;
