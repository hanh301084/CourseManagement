import React, { useState, useEffect } from 'react';
import AppFooter from '../../compornent/layout/Footer';
import AppHeader from '../../compornent/layout/Header';
import HODSidebar from '../../compornent/layout/hod/HODSidebar';
import { Helmet } from 'react-helmet';
import axiosClient from '../../api/axiosClient';
import UserEnrollmentChart from './chart/UserEnrollmentChart';
import PassFailChart from './chart/PassFailChart';
import { Layout, Select } from 'antd';

const { Content } = Layout;
const { Option } = Select;

const Dashboard = () => {
    const [userEnrollmentData, setUserEnrollmentData] = useState([]);
    const [passFailData, setPassFailData] = useState([]);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Default to current year
    const [years, setYears] = useState([]);
    const [filteredEnrollmentData, setFilteredEnrollmentData] = useState([]);
    useEffect(() => {
        axiosClient.get('/chart/user-enrollment').then(response => {
            setUserEnrollmentData(response.data);
            filterDataByYear(response.data, new Date().getFullYear());
        });

        fetchPassFailData(selectedYear);
        generateYears();
    }, []);
    const filterDataByYear = (data, year) => {
        const filteredData = data.filter(item => {
            const itemYear = new Date(item.date).getFullYear();
            return itemYear === year;
        });
        setFilteredEnrollmentData(filteredData);
    };
    const fetchPassFailData = (year) => {
        axiosClient.get(`/chart/passFailByYear/${year}`).then(response => {
            setPassFailData(response.data);
        });
    };

    const generateYears = () => {
        const currentYear = new Date().getFullYear();
        const years = Array.from({length: 10}, (_, i) => currentYear - i); // Generate last 10 years
        setYears(years);
    };

    const handleYearChange = (year) => {
        setSelectedYear(year);
        filterDataByYear(userEnrollmentData, year);
        fetchPassFailData(year);
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <HODSidebar />
            <Helmet>
                <title>Dashboard</title>
            </Helmet>
            <Layout>
                <AppHeader />
                <Content style={{ padding: '20px 140px' }}>
                    <h1>Head Of Department Dashboard</h1>

                    <div>
                        <Select
                            defaultValue={selectedYear}
                            style={{ width: 120, marginBottom: 20 }}
                            onChange={handleYearChange}
                        >
                            {years.map(year => (
                                <Option key={year} value={year}>{year}</Option>
                            ))}
                        </Select>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div style={{ flex: 1, marginRight: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <h2 style={{ textAlign: 'center' }}>User Enrollment Chart</h2>
                            <UserEnrollmentChart data={filteredEnrollmentData} />
                        </div>

                        <div style={{ flex: 1, marginLeft: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <h2 style={{ textAlign: 'center' }}>Pass/Fail Chart</h2>
                            <PassFailChart data={passFailData} />
                        </div>
                    </div>
                </Content>
                <AppFooter />
            </Layout>
        </Layout>
    );

};

export default Dashboard;