import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Layout, Breadcrumb, Input, Pagination, Tooltip, Button } from 'antd';
import AppHeader from '../../../compornent/layout/Header'
import AppFooter from '../../../compornent/layout/Footer'
import AppSidebar from '../../../compornent/layout/Student/StudentSidebar';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom'
import ProjectAPI from '../../../api/ProjectAPI';
import ModalAddOrEdit from './ModalAddOrEdit.jsx';
import ConfirmationModal from '../../../compornent/comfirmModal';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import openNotificationWithIcon from '../../../compornent/notifcation/index.jsx'
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
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState(null);

    // for getAll project
    useEffect(() => {
        ProjectAPI.getAllProjects4Student({
            page: paging.current - 1,
            size: paging.pageSize,
            search: searchTerm
        })
            .then(response => {
                setProjects(response.data.content);
                setPaging(prevState => ({ ...prevState, total: response.data.totalElements }));
            })
            .catch(error => {
                console.error("Error fetching projects:", error);
            });
    }, [searchTerm, paging.current, paging.pageSize]);
    // for search
    const handleSearch = (value) => {
        setSearchTerm(value);
    }
    // for paging
    const handlePageChange = (page, pageSize) => {
        setPaging(prevState => ({ ...prevState, current: page, pageSize: pageSize }));
    }
    // for refresh
    const refreshProjects = () => {
        ProjectAPI.getAllProjects4Student({
            page: paging.current - 1,
            size: paging.pageSize,
            search: searchTerm,
            sort: ['projectId,desc']
        })
            .then(response => {
                setProjects(response.data.content);
            });
    }
    // for delete
    const handleDelete = (projectId) => {
        setProjectToDelete(projectId);
        setIsDeleteModalVisible(true);
    };

    const confirmDelete = () => {
        ProjectAPI.deleteProject4Student(projectToDelete)
            .then(response => {
                setIsDeleteModalVisible(false);
                setProjectToDelete(null);
                openNotificationWithIcon('success', 'Delete successfully!')

                // Refresh the projects list after successful deletion
                ProjectAPI.getAllProjects4Student({
                    page: paging.current - 1,
                    size: paging.pageSize,
                    search: searchTerm
                })
                    .then(response => {
                        setProjects(response.data.content);
                    });
            })
            .catch(error => {
               
                const errorMessage = error.response?.data?.message ||error.message ||'Failed to Delete. Please try again later.';
                openNotificationWithIcon('error', 'Delete failed', errorMessage);
               
            });
    };

    const cancelDelete = () => {
        setIsDeleteModalVisible(false);
        setProjectToDelete(null);
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
            ProjectAPI.updateProject4Student(values)
                .then(response => {
                    closeModal();
                    openNotificationWithIcon('success', 'Update successfully!')
                    ProjectAPI.getAllProjects4Student({
                        page: paging.current - 1,
                        size: paging.pageSize,
                        search: searchTerm
                    })
                        .then(response => {
                            setProjects(response.data.content);
                        })
                })
                .catch(error => {
                    
                    const errorMessage = error.response?.data?.error ||error.response?.data ||'Failed to Update. Please try again later.';
                    openNotificationWithIcon('error', 'Update failed', errorMessage);
                   
                });
        } else {
            const existingProject = projects.find(project =>
                project.topicCode === values.topicCode || project.topicName === values.topicName
            );

            if (existingProject) {
                openNotificationWithIcon('warning','Update failed', 'Project with this topic or name already exists!');
               
            } else {
                ProjectAPI.createProject(values)
                    .then(response => {
                        closeModal();
                        openNotificationWithIcon('success', 'Create successfully!')
                        ProjectAPI.getAllProjects4Student({
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
                        const errorMessage = error.response?.data?.error ||error.response?.data ||'Failed to Create. Please try again later.';
                        openNotificationWithIcon('error', 'Create failed', errorMessage);
                       
                    });
            }
        }
    };
    return (
        <Layout style={{ minHeight: '100vh' }}>
            <AppSidebar />
            <Layout>
                <AppHeader />
                <Breadcrumb
                    items={[
                        { title: 'Home' },
                        { title: 'Projects' },
                    ]}
                    style={{ marginLeft: 140, marginTop: 20 }}
                />
                <h1 style={{ marginLeft: 140}}>Project Management</h1>
                <Content style={{ padding: '0px 140px' }}>
                    <div >
                        <div style={{ }}>
                            <Button style={{marginRight:10}} ghost type="primary" onClick={() => openModal()} >Add Project</Button>
                             
                            <Input.Search
                                placeholder="Search for projects"
                                onChange={(e) => handleSearch(e.target.value)}
                                style={{ marginBottom: '20px', width: 350}}
                                enterButton
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
                                                // <Button style={{ color: 'red' }} onClick={() => handleDelete(project.projectId)} ><DeleteOutlined /></Button>
                                            ]}
                                        >
                                            <Meta
                                                title={
                                                    <div>
                                                        <Link to={`/student/project-details/${project.projectId}`}>
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
                        <ConfirmationModal
                            isVisible={isDeleteModalVisible}
                            onConfirm={confirmDelete}
                            onCancel={cancelDelete}
                            title={
                                <>
                                    <ExclamationCircleOutlined style={{ color: 'red', marginRight: '8px' }} />
                                    Confirm Deletion
                                </>
                            }
                            content="Are you sure you want to delete this project? This action cannot be undone."
                        />
                       

                    </div>
                </Content>
                <AppFooter />
            </Layout>
        </Layout>
    );
};

export default ProjectList;
