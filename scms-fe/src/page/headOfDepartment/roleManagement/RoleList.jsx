import React, { useState, useEffect } from 'react';
import AppHeader from '../../../compornent/layout/Header';
import AppFooter from '../../../compornent/layout/Footer';
import AppSidebar from '../../../compornent/layout/hod/HODSidebar'
import RoleService from '../../../api/RoleAPI';
import { Link } from 'react-router-dom';
import '../style.css'
import {
    Layout,
    Switch,
    Table,
    Input,
    Button,
    Modal,
    Breadcrumb,
    Spin
} from 'antd';
import { Helmet } from 'react-helmet';
import { EditOutlined } from '@ant-design/icons';
import AddRole from './AddRole';
import EditRole from './EditRole';
const { Content } = Layout;
const RoleList = () => {
    const { Search } = Input;
    const [addRoleVisible, setAddRoleVisible] = useState(false);
    const [editRoleVisible, setEditRoleVisible] = useState(false);
    const [roles, setRoles] = useState([]);
    const [editingRoleData, setEditingRoleData] = useState(null);
    const [confirmModalVisible, setConfirmModalVisible] = useState(false);
    const [pendingRoleUpdate, setPendingRoleUpdate] = useState(null);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 8 });
    const [searchKeyword, setSearchKeyword] = useState('');
    //row effect
    const [loading, setLoading] = useState(true);
    const [blinkingRowId, setBlinkingRowId] = useState(null);

    const getAllRoles = (page = 1, size = 8, keyword = '') => {
        RoleService.getAllRoles(page, size, keyword)
            .then((response) => {
                setRoles(response.data.content);
                setPagination({
                    ...pagination,
                    total: response.data.totalElements,
                    current: response.data.number + 1
                });
                setLoading(false);  
            })
            .catch(error => {
                console.error(error);
                setLoading(false); 
            });
    };
    useEffect(() => {
        getAllRoles(pagination.current, pagination.pageSize, searchKeyword);
    }, [pagination.current, searchKeyword]);

    const handleAddRoleClick = () => {
        setAddRoleVisible(true);
    };

    const handleAddRoleClose = () => {
        setAddRoleVisible(false);
    };

    const handleRoleAdded = (newRole) => {
        setRoles([...roles, newRole]);
        setAddRoleVisible(false);
        setBlinkingRowId(newRole.roleId);
        setTimeout(() => {
            setBlinkingRowId(null);
        }, 3000);
        getAllRoles(pagination.current, pagination.pageSize, searchKeyword);
    };

    const handleEditRoleClick = (record) => {
        setEditingRoleData(record);
        setEditRoleVisible(true);
    };

    const handleEditRoleClose = () => {
        setEditRoleVisible(false);
    };

    const handleTableChange = (pagination) => {
        setPagination(pagination);
    };

    const handleSearch = (value) => {
        setSearchKeyword(value);
        setPagination({ ...pagination, current: 1 });
    };

    const handleRoleEdited = (updatedRole) => {
        const updatedRoles = roles.map((role) =>
            role.roleId === updatedRole.roleId ? updatedRole : role
        );
        setRoles(updatedRoles);
        setEditRoleVisible(false);
        setBlinkingRowId(updatedRole.roleId);
        setTimeout(() => {
            setBlinkingRowId(null);
        }, 3000);
        getAllRoles(pagination.current, pagination.pageSize, searchKeyword);
    };

    const handleSwitchChange = (record, checked) => {
        const updatedStatus = checked ? 'ACTIVE' : 'INACTIVE';
        const updatedData = {
            ...record,
            status: updatedStatus,
        };

        setPendingRoleUpdate(updatedData);
        setConfirmModalVisible(true);
    };
    const handleConfirmUpdate = () => {
        if (pendingRoleUpdate) {
            RoleService.updateRole(pendingRoleUpdate)
                .then((response) => {
                    const updatedRoles = roles.map((role) =>
                        role.roleId === pendingRoleUpdate.roleId ? response.data : role
                    );
                    setRoles(updatedRoles);
                })
                .catch((error) => {
                    console.error('Error updating role status:', error);
                });
        }

        setConfirmModalVisible(false);
        setPendingRoleUpdate(null);
    };

    const columns = [
        {
            title: 'No',
            key: 'no',
            render: (text, record, index) => index + 1
        },
        {
            title: 'Name',
            dataIndex: 'roleName',
            key: 'roleName',
            render: (text) => {
                switch (text) {
                    case 'HeadOfDepartment':
                        return 'Head of Department';
                    case 'TEACHER':
                        return 'Teacher';
                    case 'STUDENT':
                        return 'Student';
                    case 'REVIEWER':
                        return 'Reviewer';
                    default:
                        return text; // Return the original text if it doesn't match any case
                }
            }
        },
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
            <style>
                {`
                    @keyframes blink {
                        0% { background-color: white; }
                        50% { background-color: #e6edf7; }
                        100% { background-color: white; }
                    }

                    .blinking-row {
                        animation: blink 0.5s linear infinite;
                    }
                `}
            </style>
            <AppSidebar />
            <Layout>
                <AppHeader />
                <Breadcrumb
                    items={[
                        {
                            title: <Link to="/hod/dashboard">Home</Link>,
                        },
                        {
                            title: 'Role Management',
                        },
                    ]}
                    style={{
                        marginLeft: 140,
                        marginTop: 20
                    }}
                />
                <Helmet>
                    <title>Role Management</title>
                </Helmet>
                <Content style={{ padding: '0px 140px' }}>
                    <h1>Role Management</h1>
                    {/* <Button
                        type="primary"
                        ghost
                        style={{ marginBottom: 16 }}
                        onClick={handleAddRoleClick}
                    >
                        Add Role
                    </Button> */}
                    <Search
                        placeholder="Enter role name to search..."
                        style={{ width: 300}}
                        onSearch={handleSearch}
                        allowClear
                    />
                    <Table
                    
                        dataSource={roles}
                        columns={columns}
                        rowKey="roleId"
                        pagination={{
                            current: pagination.current,
                            pageSize: pagination.pageSize,
                            total: pagination.total
                        }}
                        onChange={handleTableChange}
                        rowClassName={(record) => (record.roleId === blinkingRowId ? 'blinking-row' : '')}
                    />
                </Content>
                <AppFooter />
            </Layout>

            <Modal
                title="Confirm"
                visible={confirmModalVisible}
                onOk={handleConfirmUpdate}
                onCancel={() => setConfirmModalVisible(false)}
            >
                Are you sure you want to switch status of this role?
            </Modal>

            <AddRole
                visible={addRoleVisible}
                onClose={handleAddRoleClose}
                onRoleAdded={handleRoleAdded}
            />
            {editingRoleData && (
                <EditRole
                    visible={editRoleVisible}
                    onClose={handleEditRoleClose}
                    onRoleEdited={handleRoleEdited}
                    roleData={editingRoleData}
                />
            )}
        </Layout>
    );
};

export default RoleList;
