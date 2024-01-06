import React from 'react';

import AppFooter from '../../compornent/layout/Footer';
import AppHeader from '../../compornent/layout/Header';
import StudentSidebar from '../../compornent/layout/Student/StudentSidebar'


import { Layout } from 'antd';
const { Content } = Layout;


const Dashboard = () => {

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <StudentSidebar />
      <Layout>
        <AppHeader />

        <Content style={{ padding: '20px 140px' }}>
          <h1>Student Dashboard</h1>

        </Content>
        <AppFooter />
      </Layout>
    </Layout>
  );
};

export default Dashboard;
