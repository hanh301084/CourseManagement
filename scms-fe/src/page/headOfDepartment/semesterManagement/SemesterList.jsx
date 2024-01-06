import React, { useState, useEffect } from 'react';
import AppHeader from '../../../compornent/layout/Header';
import AppFooter from '../../../compornent/layout/Footer';
import AppSidebar from '../../../compornent/layout/hod/HODSidebar'
import SemesterService from '../../../api/SemesterAPI';
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
    Select,
    Spin, 
    Tooltip
} from 'antd';
import { Helmet } from 'react-helmet';
import { EditOutlined, QuestionCircleOutlined, QuestionOutlined } from '@ant-design/icons';
import AddSemester from './AddSemester';
import EditSemester from './EditSemester';
import openNotificationWithIcon from '../../../compornent/notifcation';
import moment from 'moment';
const { Option } = Select;
const { Content } = Layout;
const SemesterList = () => {
    const { Search } = Input;
    const [semesters, setSemesters] = useState([]);
    const [addSemesterVisible, setAddSemesterVisible] = useState(false);
    const [editSemesterVisible, setEditSemesterVisible] = useState(false);
    const [editingSemesterData, setEditingSemesterData] = useState(null);
    const [confirmModalVisible, setConfirmModalVisible] = useState(false);
    const [pendingSemesterUpdate, setPendingSemesterUpdate] = useState(null);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 8 });
    const [searchKeyword, setSearchKeyword] = useState('');
    const [selectedYear, setSelectedYear] = useState(null);
    const [allYears, setAllYears] = useState([]);
    const [blinkingSemesterId, setBlinkingSemesterId] = useState(null);
    const [loading, setLoading] = useState(true);
    const fetchAllYears = () => {
        SemesterService.getAllYears()
            .then(response => {
                setAllYears(response.data);
            })
            .catch(error => {
                console.error("Error fetching years:", error);
            });
    };

    useEffect(() => {
        fetchAllYears();
    }, []);

    const getAllSemesters = (page = 1, size = 8, keyword = '', year = '') => {
        let yearParam = year === "All years" ? "" : year;
        SemesterService.getAllSemesters(page, size, keyword, yearParam)
            .then((response) => {
                setSemesters(response.data.content);
                setPagination({
                    ...pagination,
                    total: response.data.totalElements,
                    current: response.data.number + 1
                });
                setLoading(false)
            })
            .catch(error => {
                console.log(error);
                setLoading(false)
            });
    };

    useEffect(() => {
        getAllSemesters(pagination.current, pagination.pageSize, searchKeyword, selectedYear);
    }, [pagination.current, pagination.pageSize, searchKeyword, selectedYear]);
    const handleAddSemesterClick = () => {
        setAddSemesterVisible(true);
    };

    const handleAddSemesterClose = () => {
        setAddSemesterVisible(false);
    };

    const handleSemesterAdded = (newSemester) => {
        setSemesters([...semesters, newSemester]);
        setAddSemesterVisible(false);
        setBlinkingSemesterId(newSemester.semesterId);
        setTimeout(() => {
            setBlinkingSemesterId(null);
        }, 3000);
        getAllSemesters(pagination.current, pagination.pageSize, searchKeyword);
    };
    const handleTableChange = (pagination) => {
        setPagination(pagination);
    };

    const handleSearch = (value) => {
        setSearchKeyword(value);
        setPagination({ ...pagination, current: 1 });
    };

    const handleEditSemesterClick = (record) => {
        setEditingSemesterData(record);
        setEditSemesterVisible(true);
    };

    const handleEditSemesterClose = () => {

        setEditSemesterVisible(false);
    };

    const handleSemesterEdited = (editedSemester) => {
        const updatedSemesters = semesters.map((semester) =>
            semester.semesterId === editedSemester.semesterId ? editedSemester : semester
        );
        setSemesters(updatedSemesters);
        setEditSemesterVisible(false);
        setBlinkingSemesterId(editedSemester.semesterId);
        setTimeout(() => {
            setBlinkingSemesterId(null);
        }, 3000);
        getAllSemesters(pagination.current, pagination.pageSize, searchKeyword);
    };

    const handleSwitchChange = (record, checked) => {
        const updatedStatus = checked ? 'ACTIVE' : 'INACTIVE';
        const updatedData = {
            ...record,
            status: updatedStatus,
        };

        setPendingSemesterUpdate(updatedData);
        setConfirmModalVisible(true);
    };

    const handleConfirmUpdate = () => {
        if (pendingSemesterUpdate) {
            SemesterService.updateSemester(pendingSemesterUpdate)
                .then((response) => {
                    const updatedSemesters = semesters.map((semester) =>
                        semester.semesterId === pendingSemesterUpdate.semesterId ? response.data : semester
                    );
                    openNotificationWithIcon('success', 'Success','Update Successfully!');
                    setSemesters(updatedSemesters);
                })
                .catch((error) => {
                    console.error('Error updating semester status:', error);
                });
        }

        setConfirmModalVisible(false);
        setPendingSemesterUpdate(null);
    };

    const handleChange = (year) => {
        setSelectedYear(year);
        if (year === "All years") {
            getAllSemesters(pagination.current, pagination.pageSize, searchKeyword);
        } else {
            getAllSemesters(pagination.current, pagination.pageSize, searchKeyword, year);
        }
    };


    const columns = [

        {
            title: 'No',
            key: 'no',
            render: (text, record, index) => index + 1
        },
        {
            title: 'Semester Name',
            dataIndex: 'semesterName',
            key: 'semesterName',
        },
        {
            title: 'Start Date',
            dataIndex: 'startDate',
            key: 'startDate',
            render: (text) => moment(text).format('DD/MM/YYYY')
        },
        {
            title: 'End Date',
            dataIndex: 'endDate',
            key: 'endDate',
            render: (text) => moment(text).format('DD/MM/YYYY')
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status, record) => {
                const startDate = moment(record.startDate);
                const currentDate = moment();
            
                // Check if the end date is before the current date
                if (startDate.isBefore(currentDate, 'day')) {
                    // If the end date is in the past, show the status as text (non-editable)
                    return <span>{status}</span>;
                }
            
                // If the end date is today or in the future, show a switch to change the status
                return (
                    <Switch
                        checked={record.status === 'ACTIVE'}
                        onChange={(checked) => handleSwitchChange(record, checked)}
                        checkedChildren={<span>Active</span>}
                        unCheckedChildren={<span>Inactive</span>}
                    />
                );
            }
        },

        {
            title: 'Action',
            key: 'actions',
            render: (text, record) => {
                const startDate = moment(record.startDate);
                const currentDate = moment();
        
                // Check if the start date is before the current date
                if (startDate.isBefore(currentDate, 'day')) {
                    // Semester has already started, show tooltip
                    return (
                        <Tooltip title="You can't edit this semester because it already started">
                            <Button
                                icon={<QuestionOutlined />}
                                disabled
                                style={{ background: 'none', border: 'none', cursor: 'not-allowed' }}
                            >
                            </Button>
                        </Tooltip>
                    );
                }
        
                // Semester is yet to start or is ongoing, allow editing
                return (
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => handleEditSemesterClick(record)}
                        style={{ background: 'none', border: 'none' }}
                    >
                    </Button>
                );
            },
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
                <Helmet>
                    <title>Semmester Management</title>
                </Helmet>
                <Breadcrumb
                    items={[
                        {
                            title: <Link to='/hod/dashboard'>Home</Link>
                        },
                        {
                            title: 'Semester Management',
                        },
                    ]}
                    style={{
                        marginLeft: 140, marginTop: 20
                    }}
                />
                <Content style={{ padding: '0px 140px' }}>
                    <h1>Semester management</h1>
                    <Button type="primary" ghost style={{ marginBottom: 16 }} onClick={handleAddSemesterClick}>
                        Add Semester
                    </Button>
                    <Select
                        defaultValue={"All years"}
                        style={{ width: 120, margin: '0 0 16px 16px' }}
                        onChange={handleChange}
                    >
                        <Option key="all" value="All years">All Years</Option>
                        {allYears.map(year => (
                            <Option key={year} value={year}>{year}</Option>
                        ))}
                    </Select>

                    <Search
                        placeholder="Enter to search..."
                        style={{ width: 300, margin: '0px 0px 16px 16px' }}
                        onSearch={handleSearch}
                        allowClear
                    />
                    <Table
                        dataSource={semesters}
                        columns={columns}
                        rowKey="semesterId"
                        pagination={{
                            current: pagination.current,
                            pageSize: pagination.pageSize,
                            total: pagination.total
                        }}
                        onChange={handleTableChange}
                        rowClassName={(record) => (record.semesterId === blinkingSemesterId ? 'blinking-row' : '')} // Áp dụng lớp CSS cho semester nhấp nháy
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
                Are you sure you want to switch status of this semester?
            </Modal>
            <AddSemester
                visible={addSemesterVisible}
                onClose={handleAddSemesterClose}
                onSemesterAdded={handleSemesterAdded}
                semesters={semesters}
            />
            <EditSemester
                visible={editSemesterVisible}
                onClose={handleEditSemesterClose}
                onSemesterEdited={handleSemesterEdited}
                semesterData={editingSemesterData}
            />
        </Layout>
    );
};

export default SemesterList;