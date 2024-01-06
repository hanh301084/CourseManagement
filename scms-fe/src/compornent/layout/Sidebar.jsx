import React, { useState, useEffect } from 'react';
import {
  SettingFilled,
  UserOutlined,
  CalculatorOutlined,
  AuditOutlined,
  UserSwitchOutlined ,
  PieChartOutlined ,
  CalendarOutlined,
  HomeOutlined
} from '@ant-design/icons';
import { Layout, Menu, theme } from 'antd';
import { Link } from 'react-router-dom';

const { Sider } = Layout;



const AppSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { },
  } = theme.useToken();

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
            icon:<AuditOutlined />,
            label: <Link to='../hod/role-list'><span style={{float:'left'}}>Role Manager</span></Link>,

          },
          {
            key: '2',
            icon:<CalendarOutlined />,
            label: <Link to='../hod/semester-list'><span style={{float:'left'}}>Semester Management</span></Link>,
          },
          {
            key: '3',
            icon: <PieChartOutlined />,
            label: <Link to='../hod/iteration-list'><span style={{float:'left'}}>Iteration Manager</span></Link>,
          },
          {
            key: '4',
            icon: <UserOutlined />,
            label: <Link to='../hod/user-list'><span style={{float:'left'}}>User Manager</span></Link>,
          },
          {
            key: '5',
            icon: <CalculatorOutlined />,
            label: <Link to='../hod/class-list'><span style={{float:'left'}}>Class Manager</span></Link>,
          }, 
          {
            key: '6',
            icon: <SettingFilled  />,
            label: <Link to='../hod/setting'><span style={{float:'left'}}>System Config</span></Link>,
          },
          {
            key: '7',
            icon: <UserSwitchOutlined />,
            label: <span style={{float:'left'}}>Switch role</span>,
            children: [
              {
                key: '7-1',
                label: <Link to=''><span style={{float:'left'}}>Head of department</span></Link>,
              },
              {
                key: '7-2',
                label: <Link to=''><span style={{float:'left'}}>Teacher</span></Link>,
              },
              {
                key: '7-3',
                label: <Link to=''><span style={{float:'left'}}>Reviewer</span></Link>,
              },
            ],
          },
        ]}
      />
    </Sider>
  );
};

export default AppSidebar;