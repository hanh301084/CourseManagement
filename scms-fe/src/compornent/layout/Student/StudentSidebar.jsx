import React, { useState, useEffect } from 'react';
import '../sidebar.css';
import {
  AuditOutlined,
  CalendarOutlined,
} from '@ant-design/icons';
import { Layout, Menu, theme } from 'antd';
import { Link , useLocation} from 'react-router-dom';

const { Sider } = Layout;



const StudentSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { },
  } = theme.useToken();
  const defaultWidth = 230; // Adjust this value as needed
  const collapsedWidth = 50;
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
  const location = useLocation();
  const getSelectedKey = () => {
    const path = location.pathname;
    if (path.includes('class-list')) return '1';
    if (path.includes('project-list')) return '2';
    if (path.includes('project-backlog')) return '3';

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
        defaultSelectedKeys={getSelectedKey}
        items={[

          {
            key: '1',
            icon: <AuditOutlined />,
            label: <Link to='../student/class-list'><span style={{ float: 'left' }}>Class</span></Link>,

          },
          {
            key: '2',
            icon: <CalendarOutlined />,
            label: <Link to='../student/project-list'><span style={{ float: 'left' }}>Project</span></Link>,
          },
          {
            key: '3',
            icon: <CalendarOutlined />,
            label: <Link to='../student/project-backlog'><span style={{ float: 'left' }}>Project Backlog</span></Link>,
          },
        ]}
      />
    </Sider>
  );
};

export default StudentSidebar;