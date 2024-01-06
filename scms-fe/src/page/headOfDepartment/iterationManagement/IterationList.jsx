import React, { useState, useEffect } from 'react';
import AppHeader from '../../../compornent/layout/Header';
import AppFooter from '../../../compornent/layout/Footer';
import AppSidebar from '../../../compornent/layout/hod/HODSidebar'
import IterationService from '../../../api/IterationAPI';
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
import AddIteration from './AddIteration';
import EditIteration from './EditIteration';
import openNotificationWithIcon from '../../../compornent/notifcation';
const { Content } = Layout;

const IterationList = () => {
    const { Search } = Input;
    const [iterations, setIterations] = useState([]);
    const [addIterationVisible, setAddIterationVisible] = useState(false);
    const [editIterationVisible, setEditIterationVisible] = useState(false);
    const [editingIterationData, setEditingIterationData] = useState(null);
    const [confirmModalVisible, setConfirmModalVisible] = useState(false);
    const [pendingIterationUpdate, setPendingIterationUpdate] = useState(null);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 8 });
    const [searchKeyword, setSearchKeyword] = useState('');
    const [loading, setLoading] = useState(true);
    const getAllIterations = (page = 1, size = 8, keyword = '') => {
        IterationService.getAllIterations(page, size, keyword)
            .then((response) => {
                setIterations(response.data.content);
                setPagination({
                    ...pagination,
                    total: response.data.totalElements,
                    current: response.data.number + 1
                });
                setLoading(false)
            })
            .catch(error => {
                setLoading(false)
            });
    };

    useEffect(() => {
        getAllIterations(pagination.current, pagination.pageSize, searchKeyword);
    }, [pagination.current, searchKeyword]);

    const handleAddIterationClick = () => {
        setAddIterationVisible(true);
    };

    const handleAddIterationClose = () => {
        setAddIterationVisible(false);
    };

    const handleIterationAdded = (newIteration) => {
        setIterations([...iterations, newIteration]);
        setPagination({ ...pagination, total: pagination.total + 1 })
        setAddIterationVisible(false);
    };

    const handleTableChange = (pagination) => {
        setPagination(pagination);
    };

    const handleSearch = (value) => {
        setSearchKeyword(value);
        setPagination({ ...pagination, current: 1 });
    };

    const handleEditIterationClick = (record) => {
        setEditingIterationData(record);
        setEditIterationVisible(true);
    };

    const handleEditIterationClose = () => {
        setEditIterationVisible(false);
    };

    const handleIterationEdited = (editedIteration) => {
        const updatedIterations = iterations.map((iteration) =>
            iteration.iterationId === editedIteration.iterationId ? editedIteration : iteration
        );
        setIterations(updatedIterations);
        setEditIterationVisible(false);
    };

    const handleSwitchChange = (record, checked) => {
        const updatedStatus = checked ? 'ACTIVE' : 'INACTIVE';
        const updatedData = {
            ...record,
            status: updatedStatus,
        };
         
        setPendingIterationUpdate(updatedData);
        setConfirmModalVisible(true);
    };

    const handleConfirmUpdate = () => {
        if (pendingIterationUpdate) {
            IterationService.updateIteration(pendingIterationUpdate)
                .then((response) => {
                    const updatedIterations = iterations.map((iteration) =>
                        iteration.iterationId === pendingIterationUpdate.iterationId ? response.data : iteration
                    );
                    setIterations(updatedIterations);
                    openNotificationWithIcon('success', 'Success', 'Status update successfully!')

                })
                .catch((error) => {
                    openNotificationWithIcon('error', 'ERROR', 'Faild to update, Please try agaim!')
                });
        }

        setConfirmModalVisible(false);
        setPendingIterationUpdate(null);
    };

    const columns = [
        {
            title: 'No',
            dataIndex: 'iterationId',
            key: 'iterationId',
            render: (text, record, index) => (index + 1) + ((pagination.current - 1) * pagination.pageSize),
        },
        {
            title: 'Iteration Name',
            dataIndex: 'iterationName',
            key: 'iterationName',
        },
        {
            title: 'Duration(Week)',
            dataIndex: 'duration',
            key: 'duration',
        },
        {
            title: 'Block 5 Duration(Week)',
            dataIndex: 'durationBlock5',
            key: 'durationBlock5',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status, record, index) => (
                <Switch
                    checked={record.status === 'ACTIVE'}
                    onChange={(checked) => handleSwitchChange(record, checked)}
                    checkedChildren={<span>Active</span>}
                    unCheckedChildren={<span>Inactive</span>}
                />
            )
        },
        {
            title: 'Action',
            key: 'actions',
            render: (text, record) => (
                <Button
                    icon={<EditOutlined />}
                    onClick={() => handleEditIterationClick(record)}
                    style={{ background: 'none', border: 'none' }}
                >
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
                <Helmet>
                    <title>Iteration Management</title>
                </Helmet>
                <Breadcrumb
                    items={[
                        {
                            title: <Link to='..//hod/dashboard'>Home</Link>
                        },
                        {
                            title: 'Iteration Management',
                        },
                    ]}
                    style={{
                        marginLeft: 140, marginTop: 20
                    }}
                />
                <Content style={{ padding: '0px 140px' }}>
                    <h1>Iteration Management</h1>
                    <Button type="primary" ghost style={{ marginBottom: 16 }} onClick={handleAddIterationClick}>
                        Add Iteration
                    </Button>
                    <Search
                        placeholder="Enter iteration name to search..."
                        style={{ width: 300, margin: '0 0 16px 16px'  }}
                        onSearch={handleSearch}
                    />
                    <Table
                        dataSource={iterations}
                        columns={columns}
                        rowKey="iterationId"
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
            <Modal
                title="Confirm"
                visible={confirmModalVisible}
                onOk={handleConfirmUpdate}
                onCancel={() => setConfirmModalVisible(false)}
            >
                Are you sure you want to switch status of this iteration?
            </Modal>
            <AddIteration
                visible={addIterationVisible}
                onClose={handleAddIterationClose}
                onIterationAdded={handleIterationAdded}
                totalElements={pagination.total}
            />
            <EditIteration
                visible={editIterationVisible}
                onClose={handleEditIterationClose}
                onIterationEdited={handleIterationEdited}
                iterationData={editingIterationData}
            />
        </Layout>
    );
};

export default IterationList;
