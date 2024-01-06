import React from 'react';

import AppFooter from '../../compornent/layout/Footer';
import AppHeader from '../../compornent/layout/Header';
import TeacherSidebar from '../../compornent/layout/Teacher/TeacherSidebar';
import { Helmet } from 'react-helmet';

import { Layout } from 'antd';
const { Content } = Layout;


const Dashboard = () => {

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <TeacherSidebar />
      <Layout>
        <AppHeader />
        <Helmet>
                    <title>Dashboard</title>
        </Helmet>
        <Content style={{ padding: '20px 140px' }}>
          <h1>Teacher Dashboard</h1>

        </Content>
        <AppFooter />
      </Layout>
    </Layout>
  );
};

export default Dashboard;
