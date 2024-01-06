import React, { useState, useEffect } from 'react';
import '../sidebar.css';
import {
  AuditOutlined, UserSwitchOutlined
} from '@ant-design/icons';
import { Layout, Menu, theme } from 'antd';
import { Link } from 'react-router-dom';

const { Sider } = Layout;



const ReviewerSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { },
  } = theme.useToken();

  const roles = JSON.parse(localStorage.getItem("userRole"));


  const handleSwitchRole = () => {
    let arr = [];
    if (roles.indexOf("HeadOfDepartment") !== -1) {
      arr.push({
        key: "HeadOfDepartment",
        label: <Link to='/hod/user-list'><span style={{ float: 'left' }}>Head of department</span></Link>,
      })
    }
    if (roles.indexOf("TEACHER") !== -1) {
      arr.push({
        key: "TEACHER",
        label: <Link to='/teacher/home' ><span style={{ float: 'left' }}>Teacher</span></Link>,
      })
    }
    if (roles.indexOf("STUDENT") !== -1) {
      arr.push({
        key: "STUDENT",
        label: <Link to='/student/class-list' ><span style={{ float: 'left' }}>Student</span></Link>,
      })
    }
    return arr;
  }

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

  return (
    <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)} theme="light" >
      <div className="demo-logo-vertical sider-container">
        <img
          className="sider-logo"
          src="https://upload.wikimedia.org/wikipedia/commons/a/ad/FPT_Education_logo.svg"
          alt=""
        />
      </div>
      <Menu
        theme="light"
        mode="inline"
        defaultSelectedKeys={['1']}
        items={[

          {
            key: '1',
            icon: <AuditOutlined />,
            label: <Link to='/reviewer/class-list'><span style={{ float: 'left' }}>Class</span></Link>,
          },
          {
            key: '7',
            icon: <UserSwitchOutlined />,
            label: <span style={{ float: 'left' }}>Switch role</span>,
            children: handleSwitchRole()
          }
        ]}
      />
    </Sider>
  );
};

export default ReviewerSidebar;