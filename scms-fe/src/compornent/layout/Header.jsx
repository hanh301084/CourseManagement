import React from 'react';
import { Menu as AntMenu, Layout, Dropdown, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import Notification from '../notifcation';
import userAPI from '../../api/UserAPI';
import { useState, useEffect } from 'react';

const { Header } = Layout;

const AppHeader = () => {
  const userRole = localStorage.getItem('userRole');
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    userAPI.userProfile().then(response => {
      setUserProfile(response.data);
    }).catch(error => {
      console.error("Failed to fetch user profile:", error);
    });
  }, []);

  // Handle Logout
  const handleLogout = () => {
    Notification('warning', 'Good Bye!');
    setTimeout(() => {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('userRole');
      window.location.href = '/login';
    }, 1000);
  };

  // Generate profile link based on user role
  let profileLink = "/profile"; // Default profile link
  if (userRole && userRole.includes("STUDENT")) {
    profileLink = "/student/profile";
  } else if (userRole && userRole.includes("REVIEWER")) {
    profileLink = "/reviewer/profile";
  } else if (userRole && userRole.includes("TEACHER")) {
    profileLink = "/teacher/profile";
  }

  // Menu for dropdown
  const menu = (
    <AntMenu>
      <AntMenu.Item key="0">
        <a href={profileLink}>Profile</a>
      </AntMenu.Item>
      <AntMenu.Divider />
      <AntMenu.Item key="3" onClick={handleLogout}>
        Logout
      </AntMenu.Item>
    </AntMenu>
  );

  return (
    <Header
      style={{
        padding: '0 24px',
        backgroundColor: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <div style={{ flex: 1, textAlign: 'center' }}>
        <h1>COURSE MANAGEMENT</h1>
      </div>

      <Dropdown overlay={menu} trigger={['click']} placement="bottomRight">
        <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()} style={{ display: 'flex', alignItems: 'center' }}>
        {userProfile ? userProfile.fullName : 'User'}
          <Avatar
            src={userProfile && userProfile.image ? userProfile.image : undefined}
            alt={userProfile ? userProfile.fullName : 'User'}
            icon={!userProfile || !userProfile.image ? <UserOutlined/> : null}
            style={{ marginLeft: 8 }} // Add some space between the avatar and the name
          />
        </a>
      </Dropdown>
    </Header>
  );
};
export default AppHeader;