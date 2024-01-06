import React, { useState, useEffect } from 'react';
import '../sidebar.css';
import {
  AuditOutlined,
  PieChartOutlined,
  CalendarOutlined,
  UserSwitchOutlined
} from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import { Link, useLocation } from 'react-router-dom';

const { Sider } = Layout;
const { SubMenu } = Menu;

const TeacherSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const findKeysForLocation = (path) => {
    const map = {
      '/teacher/class-list': { open: '3', selected: '3-1' },
      '/teacher/class-user-list': { open: '3', selected: '3-2' },
      '/teacher/project-backlog': { open: '3', selected: '3-3' },
      '/teacher/project-list': { selected: '1' },
      '/teacher/check-list': { selected: '2' },
    };
    return map[path] || {};
  };

  const { open, selected } = findKeysForLocation(location.pathname);

  const [openKeys, setOpenKeys] = useState(open ? [open] : []);
  const [selectedKeys, setSelectedKeys] = useState(selected ? [selected] : []);

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
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const { open, selected } = findKeysForLocation(location.pathname);
    if (open) setOpenKeys([open]);
    if (selected) setSelectedKeys([selected]);
  }, [location.pathname]);

  const onOpenChange = (keys) => {
    setOpenKeys(keys);
  };

  const defaultWidth = 250;
  const collapsedWidth = 50;
  const userRole = localStorage.getItem('userRole');

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={setCollapsed}
      theme="light"
      width={defaultWidth}
      collapsedWidth={collapsedWidth}
    >
      <div className="demo-logo-vertical sider-container">
        <img
          className={`sider-logo ${collapsed ? 'sider-logo-collapsed' : ''}`}
          src="https://upload.wikimedia.org/wikipedia/commons/a/ad/FPT_Education_logo.svg"
          alt="Logo"
        />
      </div>
      <Menu
        theme="light"
        mode="inline"
        openKeys={openKeys}
        selectedKeys={selectedKeys}
        onOpenChange={onOpenChange}
      >
        
        <Menu.Item key="1" icon={<CalendarOutlined />}>
          <Link to='/teacher/project-list'>Project Management</Link>
        </Menu.Item>
        <Menu.Item key="2" icon={<PieChartOutlined />}>
          <Link to='/teacher/check-list'>Checklist Management</Link>
        </Menu.Item>
        <SubMenu
          key="3"
          icon={<AuditOutlined />}
          title="Class Management"
        >
          <Menu.Item key="3-1">
            <Link to='/teacher/class-list'>Class List</Link>
          </Menu.Item>
          <Menu.Item key="3-2">
            <Link to='/teacher/class-user-list'>Class Student</Link>
          </Menu.Item>
          <Menu.Item key="3-3">
            <Link to='/teacher/project-backlog'>Project Backlog</Link>
          </Menu.Item>
        </SubMenu>
        <SubMenu
          key="5"
          icon={<UserSwitchOutlined />}
          title="Switch Role"
        >
          {userRole.includes("HeadOfDepartment") ? (
            <>
              <Menu.Item key="5-1">
                <Link to='/hod/dashboard'>Head of Department</Link>
              </Menu.Item>
              <Menu.Item key="5-2">
                <Link to='/teacher/home'>Teacher</Link>
              </Menu.Item>
              <Menu.Item key="5-3">
                <Link to='/reviewer/class-list'>Reviewer</Link>
              </Menu.Item>
            </>
          ) : (
            <>
              <Menu.Item key="5-2">
                <Link to='/teacher/home'>Teacher</Link>
              </Menu.Item>
              <Menu.Item key="5-3">
                <Link to='/reviewer/class-list'>Reviewer</Link>
              </Menu.Item>
            </>
          )}
        </SubMenu>
      </Menu>
    </Sider>
  );
};

export default TeacherSidebar;
