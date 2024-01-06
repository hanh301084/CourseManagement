import React, { useState, useEffect } from 'react';
import AppHeader from '../../compornent/layout/Header';
import AppFooter from '../../compornent/layout/Footer';
import { useNavigate } from 'react-router-dom';
import userAPI from '../../api/UserAPI';
import moment from 'moment';
import './profile.css'
import { Layout, Button, Input, Form, Col, Row, DatePicker, Select } from 'antd';
import { MailOutlined, UserOutlined, EditOutlined } from '@ant-design/icons';
import openNotificationWithIcon from '../../compornent/notifcation/index'
import { Helmet } from 'react-helmet';
const { Content } = Layout;
const { Option } = Select;
const Profile = () => {
    const [userProfile, setUserProfile] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const navigate = useNavigate();

    const handleBackClick = () => {
        navigate(-1);
    };
    useEffect(() => {
        userAPI.userProfile().then(response => {
            setUserProfile(response.data);
        }).catch(error => {
            console.error("Failed to fetch user profile:", error);
        });
    }, []);

    const toggleEditMode = () => {
        setIsEditMode(prev => !prev);
    };

    // for edit 
    const handleSave = async (values) => {
        try {

            await userAPI.updateUserProfile(values)


            setUserProfile(prevProfile => ({ ...prevProfile, ...values }));
            ;
            openNotificationWithIcon('success', 'Update Successfully!');
            setIsEditMode(false);
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Failed to update. Please try again later.';
            openNotificationWithIcon('error', 'Update failed', errorMessage);
        }
    };

    if (!userProfile) {
        return <div>No user data available</div>;
    }
    const dateOfBirth = userProfile && userProfile.dateOfBirth ? moment(userProfile.dateOfBirth, "YYYY-MM-DD") : null;

    console.log(dateOfBirth);
    return (
        <Layout style={{ minHeight: '100vh' }}>

            <Layout>
                <AppHeader />
                <Helmet>
                    <title>Profile</title>
                </Helmet>
                <Content style={{ padding: '20px 140px' }}>
                    <Row gutter={1}>
                        <Col span={10}>
                            {
                                userProfile.image ? (
                                    <div className="text-avatar">
                                    <img src={userProfile.image} alt={userProfile.fullName} style={{ width: '400px', height: '400px' , borderRadius: "50%"}} />
                                    <div style={{ textAlign: 'center', marginTop: '10px',  }}><h1>{userProfile.fullName}</h1></div>
                                    </div>
                                    
                                ) : (
                                    <div>
                                        <div className="text-avatar">
                                            <span>{userProfile.fullName && userProfile.fullName[0]}</span>
                                        </div>
                                        <div style={{ textAlign: 'center', marginTop: '10px',  }}><h1>{userProfile.fullName}</h1></div>
                                    </div>

                                )
                            }
                            
                        </Col>
                        <Col span={14}>
                            <Form
                                name="user_profile"
                                className="user-profile-form"
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 13 }}
                                initialValues={{ ...userProfile, dateOfBirth: dateOfBirth }}
                                onFinish={handleSave}
                            >
                                <Form.Item
                                    label="Full Name"
                                    name="fullName"
                                    className="left-float-label"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input your Full Name!',
                                        },
                                    ]}
                                >
                                    <Input prefix={<UserOutlined />} disabled={!isEditMode} defaultValue={userProfile.fullName} />
                                </Form.Item>

                                <Form.Item
                                    className="left-float-label"
                                    label="Email"
                                    name="email"
                                >
                                    <Input prefix={<MailOutlined />} style={{ textAlign: 'left' }} disabled defaultValue={userProfile.email} />
                                </Form.Item>

                                <Form.Item
                                    className="left-float-label"
                                    label="Roll Number"
                                    name="rollNumber"
                                >
                                    <Input disabled defaultValue={userProfile.rollNumber} />
                                </Form.Item>

                                <Form.Item
                                    className="left-float-label"
                                    label="Gender"
                                    name="gender"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please select your gender!',
                                        },
                                    ]}
                                >
                                    <Select disabled={!isEditMode} defaultValue={userProfile.gender}>
                                        <Option value="MALE">Male</Option>
                                        <Option value="FEMALE">Female</Option>
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    className="left-float-label"
                                    label="Date of Birth"
                                    name="dateOfBirth"
                                >
                                    <DatePicker style={{width: '100%'}} format="YYYY-MM-DD" disabled={!isEditMode} defaultValue={dateOfBirth} />

                                </Form.Item>

                                <Form.Item
                                    className="left-float-label"
                                    label="Phone Number"
                                    name="phoneNumber"
                                >
                                    <Input disabled={!isEditMode} defaultValue={userProfile.phoneNumber} />
                                </Form.Item>

                                <Form.Item
                                    className="left-float-label"
                                    label="Facebook Link"
                                    name="facebookLink"
                                >
                                    <Input disabled={!isEditMode} defaultValue={userProfile.facebookLink} />
                                </Form.Item>
                                <Form.Item>
                                    <Button type="default" onClick={toggleEditMode} icon={<EditOutlined />}>
                                        Edit
                                    </Button>

                                    {isEditMode && (
                                        <Button style={{ marginLeft: 10 }} type="primary" htmlType="submit" icon={<EditOutlined />}>
                                            Save
                                        </Button>
                                    )}
                                </Form.Item>
                            </Form>

                        </Col>
                    </Row>
                    <Button style={{   marginTop: 30 }} ghost type='primary' onClick={handleBackClick}>
                        Back
                    </Button>
                </Content>
                <AppFooter />
            </Layout>
        </Layout>
    );
};

export default Profile;
