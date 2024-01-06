import React, { useState } from 'react';
import { Button, Card, Layout, Select } from 'antd';
import { GOOGLE_AUTH_URL } from '../../constant/constain.jsx';
import { Helmet } from 'react-helmet';
import './login.css'
const { Content } = Layout;
const { Option } = Select;
const Login = () => {
  const [campus, setCampus] = useState(undefined);
  const handleCampusChange = value => {
    setCampus(value);
  };

  return (
    <Layout style={{ minHeight: '100vh', justifyContent: 'center', alignItems: 'center', background: 'rgb(198, 235, 217)' }}>
      <Helmet>
        <title>Login</title>
      </Helmet>
      <Content style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
       
        <Card style={{ width: 500, height: 450, textAlign: 'center', borderRadius: 40 }}>
          <h1 className='login-h1'>Sign In</h1>
          <span className='login-span'>The first platform for manage course  in University</span>
          <br></br>
          <h2 className='login-span' style={{ textAlign: 'left', marginLeft: 30 }}>Select Campus</h2>
          <Select
            value={campus}
            placeholder="Select Campus"
            optionFilterProp="children"
            onChange={handleCampusChange}
            style={{ width: '88%', marginBottom: '20px' }}
            allowClear

          >
            <Option key="1" value="Hoa Lac">Hoa Lac</Option>
            <Option key="2" value="Ho Chi Minh">Ho Chi Minh</Option>
            <Option key="3" value="Da Nang">Da Nang</Option>
            <Option key="4" value="Can Tho">Can Tho</Option>
            <Option key="5" value="Quy Nhon">Quy Nhon</Option>
          </Select>
          <br></br>
          <Button style={{width:"88%", marginTop:20}} block href={GOOGLE_AUTH_URL} type="primary"  className="login-btn google-btn">
            Log in with Google
          </Button>
          
          <div className="login-or">or</div>
          
          <Button style={{width:"88%"}} type="default" block className="login-btn email-btn">
            Log in with Email and password
          </Button>
        </Card>
      </Content>
    </Layout>
  );
};

export default Login;