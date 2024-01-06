import React, { useState, useEffect } from 'react';
import AppHeader from '../../../compornent/layout/Header'
import AppFooter from '../../../compornent/layout/Footer'
import AppSidebar from '../../../compornent/layout/hod/HODSidebar'
import userAPI from '../../../api/UserAPI'
import ConfirmationModal from '../../../compornent/comfirmModal';
import ChangeRoleModal from './ChangeRole';
import Notification from '../../../compornent/notifcation/'
import { Link } from 'react-router-dom';
import '../style.css'
import {
    Layout,
    Switch,
    Table,
    Image,
    Input,
    Button,
    Modal,
    Breadcrumb, Spin
} from 'antd';
import { Helmet } from 'react-helmet';
const { Content } = Layout;

const UserList = () => {
    const { Search } = Input;
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
    const [searchKeyword, setSearchKeyword] = useState('');
    const [isRoleModalVisible, setIsRoleModalVisible] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [statusChange, setStatusChange] = useState({ userId: null, newStatus: null });
    const [isImportModalVisible, setIsImportModalVisible] = useState(false);
    const [importModalContent, setImportModalContent] = useState([]);
    const getAllUser = (page = 1, size = 20, keyword = '') => {
        userAPI.getAll(page, size, keyword).then((response) => {
            const usersWithRoles = response.data.content.map(user => ({
                ...user,
                roleNames: Array.isArray(user.role) ? user.role : []
            }));
            setUsers(usersWithRoles);
            setPagination({
                ...pagination,
                total: response.data.totalElements,
                current: response.data.number + 1
            });
            setLoading(false)
        }).catch(error => {
            setLoading(false)
        });
    };
    const [newRoles, setNewRoles] = useState([]);

    useEffect(() => {
        getAllUser(pagination.current, pagination.pageSize, searchKeyword);
    }, [pagination.current, pagination.pageSize, searchKeyword]);


    const handleTableChange = (pagination) => {
        setPagination(pagination);
    };

    const handleSearch = (value) => {
        setSearchKeyword(value);
        setPagination({ ...pagination, current: 1 });
    };
    const showRoleModal = (user) => {
        setEditingUser(user);
        setIsRoleModalVisible(true);
    };
    const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);

    const handleRoleChange = (roles) => {
        setNewRoles(roles);
        setIsConfirmModalVisible(true);
    };
    const handleConfirmChangeRole = () => {
        userAPI.updateUserRoles(editingUser, newRoles)
            .then((response) => {
                getAllUser(pagination.current, pagination.pageSize, searchKeyword);
                setIsRoleModalVisible(false);
                setIsConfirmModalVisible(false);
                Notification('success', 'Change successfully' + response.data)
            })
            .catch(error => {

            });
    };

    const handleCancel = () => {
        setIsConfirmModalVisible(false);
    };

    const [isConfirmStatusModalVisible, setIsConfirmStatusModalVisible] = useState(false);

    const handleStatusChange = (userId, newStatus) => {
        setStatusChange({ userId, newStatus });
        setIsConfirmStatusModalVisible(true);
    };
    const handleConfirmStatusChange = () => {
        userAPI.updateUserStatus(statusChange.userId, statusChange.newStatus)
            .then(() => {
                getAllUser(pagination.current, pagination.pageSize, searchKeyword);
                Notification('success', 'Change successfully')
                setIsConfirmStatusModalVisible(false);
            })
            .catch(error => {
                Notification('error', 'Change failed!' + error)
            });
    };
    const handleCancelStatusChange = () => {
        setStatusChange({ userId: null, newStatus: null });
        setIsConfirmStatusModalVisible(false);
    };
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('file', file);
            userAPI.importTeacher(formData)
                .then(response => {
                    const messages = response.data.map(msg => ({
                        text: msg,
                        type: msg.startsWith('Added teacher') ? 'success' : 'error'
                    }));
                    setImportModalContent(messages);
                    setIsImportModalVisible(true);
                    getAllUser(pagination.current, pagination.pageSize, searchKeyword);
                })
                .catch(error => {
                    const errorMessages = error.response.data.map(msg => ({
                        text: msg,
                        type: 'error'
                    }));
                    setImportModalContent(errorMessages);
                    setIsImportModalVisible(true);
                });
        }
    };
    const handleDownloadTemplateClick = () => {
        userAPI.downloadTeacherTemplate()
            .catch((error) => {
            });
    };
    // Extract unique roles
    const uniqueRoles = Array.from(new Set(users.flatMap(user => user.roleNames)));

    // Create filters for roles
    const roleFilters = uniqueRoles.map(role => ({
        text: role,
        value: role,
    }));
    const statusFilters = [
        { text: 'Active', value: 'ACTIVE' },
        { text: 'Inactive', value: 'INACTIVE' }
    ];
    const handleImportModalClose = () => {
        setIsImportModalVisible(false);
    };
    const columns = [
        {
            title: 'STT',
            dataIndex: 'index',
            key: 'index',
            render: (text, record, index) => index + 1,
            width: 40
        },
        {
            title: 'Full Name',
            dataIndex: 'fullName',
            key: 'fullName',
            width: 180
        },
        {
            title: 'Role No',
            dataIndex: 'rollNumber',
            key: 'rollNumber',
            width: 150,
            render: (rollNumber) => (
                rollNumber ? <><span className='roll-number'>{rollNumber}</span></> : <span className='null-table'>N/A</span>
            )
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            width: 250

        },
        {
            title: 'Image',
            dataIndex: 'image',
            key: 'image',
            width: 80,
            render: (image) => {
                const defaultAvatar = "https://tse3.mm.bing.net/th?id=OIP.Cl56H6WgxJ8npVqyhefTdQHaHa&pid=Api&P=0&h=220";
                return <Image width={50} style={{ borderRadius: "50%" }} src={image || defaultAvatar} alt="User Avatar" />
            }
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 120,
            filters: statusFilters,
            onFilter: (value, record) => record.status.indexOf(value) === 0,
            render: (status, record) => (
                <>
                    <Switch
                        checkedChildren="Active"
                        unCheckedChildren="Inactive"
                        checked={status === 'ACTIVE'}
                        onChange={(checked) => handleStatusChange(record.userId, checked ? 'ACTIVE' : 'INACTIVE')}
                    />
                </>
            )
        },

        {
            title: 'Role',
            dataIndex: 'roleNames',
            key: 'roleNames',
            width: 150,
            filters: roleFilters,
            onFilter: (value, record) => record.roleNames.includes(value),
            render: (roleNames, record) => (
                <>
                    {roleNames.map((role, idx) => {
                        let roleClass = "";
                        if (role === "TEACHER") {
                            roleClass = "teacher";
                        } else if (role === "REVIEWER") {
                            roleClass = "reviewer";
                        } else if (role === "HeadOfDepartment") {
                            roleClass = "head-of-department";
                        }

                        return (
                            <div key={`${record.userId}-${role}-${idx}`} className={`role-name ${roleClass}`}>
                                {role}
                            </div>
                        );
                    })}

                </>
            )
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 150,
            render: (_, record) => (
                <Button size='small' onClick={() => showRoleModal(record)}>
                    Change Role
                </Button>
            ),
        }
    ];
    if (loading) {
        return (
            <div className="loading-container">
                <Spin size="large" />
            </div>
        );
    }
    return (
        <Layout style={{ minHeight: '100vh' }}>
            <AppSidebar />
            <Layout>
                <AppHeader />
                <Breadcrumb
                    items={[
                        {
                            title: <Link to='../hod/dashboard'>Home</Link>
                        },
                        {
                            title: 'User Management',
                        },
                    ]}
                    style={{
                        marginLeft: 140, marginTop: 20
                    }}
                />
                <Content style={{ padding: '5px 80px' }}>
                    <h1 >User Management</h1>
                    <div>
                        <Button
                            ghost
                            type='primary'
                            style={{ float: 'left', }}
                            onClick={() => document.getElementById('fileInput').click()}
                        >
                            Import Teacher
                        </Button>
                        <Button
                            ghost
                            type='primary'
                            style={{ float: 'left', marginLeft: 16 }}
                            onClick={handleDownloadTemplateClick}>
                            Download Template</Button>
                        <Search
                            placeholder="Enter name or email to search..."
                            style={{ width: 350, marginLeft: 16 }}
                            onSearch={handleSearch}
                        />
                    </div>
                    <input
                        type="file"
                        accept=".xlsx, .xls"
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                        id="fileInput"
                    />
                    <Modal
                        title="Import Result"
                        visible={isImportModalVisible}
                        onOk={handleImportModalClose}
                        onCancel={handleImportModalClose}
                        footer={[
                            <Button key="ok" onClick={handleImportModalClose}>
                                OK
                            </Button>,
                        ]}
                        bodyStyle={{ maxHeight: '60vh', overflowY: 'auto' }}
                    >
                        <div>
                            {importModalContent.map((message, index) => (
                                <div key={index} style={{ color: message.type === 'error' ? 'red' : 'green' }}>
                                    {message.text.split('<br/>').map((line, lineIndex) => (
                                        <React.Fragment key={lineIndex}>
                                            {line}
                                            <br />
                                        </React.Fragment>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </Modal>
                    <Helmet>
                        <title>User Management</title>
                    </Helmet>
                    <ChangeRoleModal
                        isVisible={isRoleModalVisible}
                        user={editingUser}
                        onClose={() => setIsRoleModalVisible(false)}
                        onRoleChange={handleRoleChange}
                    />
                    <ConfirmationModal
                        isVisible={isConfirmModalVisible}
                        onConfirm={handleConfirmChangeRole}
                        onCancel={handleCancel}
                        title="Are you sure you want to update the roles?"
                        content="This action will update the user's roles. Please confirm."
                    />
                    <ConfirmationModal
                        isVisible={isConfirmStatusModalVisible}
                        onConfirm={handleConfirmStatusChange}
                        onCancel={handleCancelStatusChange}
                        title="Are you sure you want to update the user's status?"
                        content="This action will update the user's status. Please confirm."
                    />
                    <Table
                        dataSource={users}
                        columns={columns}
                        rowKey="userId"
                        size='small'
                        scroll={{ y: 600 }}
                        style={{ marginTop: '20px' }}
                        pagination={{
                            current: pagination.current,
                            pageSize: pagination.pageSize,
                            total: pagination.total
                        }}
                        onChange={handleTableChange}
                    />
                </Content>
                <AppFooter />
            </Layout>
        </Layout>
    );
};

export default UserList;