import React, { useState, useEffect } from 'react';
import '../sidebar.css';
import {
  SettingFilled,
  UserOutlined,
  CalculatorOutlined,
  AuditOutlined,
  UserSwitchOutlined,
  PieChartOutlined,
  CalendarOutlined,
  HomeOutlined
} from '@ant-design/icons';
import { Layout, Menu, theme } from 'antd';
import { Link, useLocation } from 'react-router-dom';


const { Sider } = Layout;


const HODSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { },
  } = theme.useToken();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 0;
      const siderContainer = document.querySelector('.sider-container');
      if (siderContainer) {
        if (scrolled) {
          siderContainer.classList.add('scrolled');
        } else {
          siderContainer.classList.remove('scrolled');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  const defaultWidth = 230; // Adjust this value as needed
  const collapsedWidth = 50;
  const getSelectedKey = () => {
    const path = location.pathname;
    if (path.includes('role-list')) return '2';
    if (path.includes('semester-list')) return '3';
    if (path.includes('iteration-list')) return '4';
    if (path.includes('user-list')) return '5';
    if (path.includes('class-list')) return '6';
    if (path.includes('setting')) return '7';

    return '1'; // default to 'Dashboard'
  };
  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
      theme="light"
      width={defaultWidth} // Set the default width
      collapsedWidth={collapsedWidth} // Set the collapsed width
    >
      <div className="demo-logo-vertical sider-container">
      <img
          className={`sider-logo ${collapsed ? 'sider-logo-collapsed' : ''}`}
          src="https://upload.wikimedia.org/wikipedia/commons/a/ad/FPT_Education_logo.svg"
          alt=""
        />
      </div>
      <Menu
        theme="light"
        mode="inline"
        defaultSelectedKeys={[getSelectedKey()]}

        items={[
          {
            key: '1',
            icon: <HomeOutlined />,
            label: <Link to='../hod/dashboard'><span style={{ float: 'left' }}>Dashboard</span></Link>,

          },
          {
            key: '2',
            icon: <AuditOutlined />,
            label: <Link to='../hod/role-list'><span style={{ float: 'left' }}>Role Management</span></Link>,

          },
          {
            key: '3',
            icon: <CalendarOutlined />,
            label: <Link to='../hod/semester-list'><span style={{ float: 'left' }}>Semester Management</span></Link>,
          },
          {
            key: '4',
            icon: <PieChartOutlined />,
            label: <Link to='../hod/iteration-list'><span style={{ float: 'left' }}>Iteration Management</span></Link>,
          },
          {
            key: '5',
            icon: <UserOutlined />,
            label: <Link to='../hod/user-list'><span style={{ float: 'left' }}>User Management</span></Link>,
          },
          {
            key: '6',
            icon: <CalculatorOutlined />,
            label: <Link to='../hod/class-list'><span style={{ float: 'left' }}>Class Management</span></Link>,
          },
          {
            key: '7',
            icon: <SettingFilled />,
            label: <Link to='../hod/setting'><span style={{ float: 'left' }}>System Config</span></Link>,
          },
          {
            key: '10',
            icon: <UserSwitchOutlined />,
            label: <span style={{ float: 'left' }}>Switch role</span>,
            children: [
              {
                key: '10-1',
                label: <Link to='/hod/dashboard'><span style={{ float: 'left' }}>Head of department</span></Link>,
              },
              {
                key: '10-2',
                label: <Link to='/teacher/home'><span style={{ float: 'left' }}>Teacher</span></Link>,
              },
              {
                key: '10-3',
                label: <Link to='/reviewer/class-list'><span style={{ float: 'left' }}>Reviewer</span></Link>,
              },
            ],
          },
        ]}
      />
    </Sider>
  );
};

export default HODSidebar;