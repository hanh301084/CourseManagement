import React, { useEffect, useState, createContext } from 'react'
import featureService from '../../../api/FeatureAPI';
import {
  Layout,
  Spin,
  Table,
  Input,
  Button,
  Breadcrumb,
  Modal
} from 'antd';
import {
  EditOutlined, DeleteFilled
} from '@ant-design/icons';
import '../style.css'
import AppSidebar from '../../../compornent/layout/Teacher/TeacherSidebar';
import AppHeader from '../../../compornent/layout/Header';
import { Link } from "react-router-dom";
import { Content } from 'antd/es/layout/layout';
import AddFeature from './AddFeature';
import EditFeature from './EditFeature';
import Notification from '../../../compornent/notifcation'
function FeatureList() {
  const { Search } = Input;
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [data, setData] = useState(null);
  const [modal, contextHolder] = Modal.useModal();
  const [addFeatureVisible, setAddFeatureVisible] = useState(false);
  const [editFeatureVisible, setEditFeatureVisible] = useState(false)
  const [deleteFeatureId, setDeleteFeatureId] = useState(null);
  const [dataEdit, setDataEdit] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [loading, setLoading] = useState(true);
  const configDetail = (featureName, description) => {
    return {
      title: 'Feature Detail !',
      content: (
        <>
          <p>Name: {featureName} !</p>
          <p>Description: {description}</p>
        </>
      ),
    }
  };
  const configDelete = {
    title: 'Confirm delete !',
    content: (
      <p>Are you sure you want to delete this feature?</p>
    ),
    onOk: () => {
      deleteFeature()
    },
  };

  useEffect(() => {
    featureService.getFeaturesByPage(pagination.current - 1, pagination.pageSize)
      .then(response => {
        setData(response.data);
        setLoading(false)
      }) 
      .catch(err => console.error(err))
  }, [pagination.current, pagination])

  useEffect(() => {
    if (deleteFeatureId) {
      modal.confirm(configDelete)
    }
  }, [deleteFeatureId])

  useEffect(() => {
    if (searchKeyword != "") {
      featureService.searchFeatureByName(searchKeyword, 0, pagination.pageSize)
        .then(response => {
          setData(response.data);
        })
        .catch(err => console.error(err))
    }
  }, [searchKeyword])

  const deleteFeature = () => {
    featureService.deleteFeature(deleteFeatureId)
      .then(() => {
        featureService.getFeaturesByPage(pagination.current - 1, pagination.pageSize)
          .then(response => {
            setData(response.data);
            Notification('success', 'Success!', 'Feature delete successfully!')
          })
          .catch(err =>  
            Notification('error', 'Error!', 'This feature is in use!'))
      })
      .catch(err =>  
        Notification('error', 'Error!', 'This feature is in use!'))
  }

  const handleTableChange = (pagination) => {
    setPagination(pagination);
  };

  const handleMouseEnter = () => {
    document.body.style.cursor = 'pointer';
  };

  const handleMouseLeave = () => {
    document.body.style.cursor = 'auto';
  };

  const handleAddFeatureClick = () => {
    setAddFeatureVisible(true);
  };

  const handleAddFeatureClose = () => {
    setAddFeatureVisible(false);
    setPagination({ current: 1, pageSize: 10 })
  };

  const handleSearch = (value) => {
    setSearchKeyword(value);
  };

  const handleClickEdit = (featureName, description, featureId) => {
    setDataEdit({ featureName, description, featureId });
    setEditFeatureVisible(true);
  }

  const handleEditFeatureClose = () => {
    setDataEdit(null);
    setEditFeatureVisible(false);
    setPagination({ current: pagination.current, pageSize: 10 })
  }
  const columns = [
    {
      title: 'No',
      dataIndex: 'index',
      key: 'index',
      render: (text, record, index) => (index + 1) + ((pagination.current - 1) * pagination.pageSize),
    },
    {
      title: 'Name',
      dataIndex: 'featureName',
      key: 'featureName',
      render: (_, { featureName, description }) => (
        <>
          <p color={"green"} key={"Deatil"}
            onClick={async () => {
              modal.info(configDetail(featureName, description));
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {featureName}
          </p>
        </>
      ),
    },
    {
      title: 'Despcription',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Actions',
      key: 'actions',
      dataIndex: 'actions',
      render: (_, { featureName, description, featureId }) => (
        <>
          <EditOutlined
            style={{ fontSize: '15px' }}
            key="Deatil"
            onClick={async () => {
              handleClickEdit(featureName, description, featureId);
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          />
          <span style={{ margin: '0 10px' }}></span>
          
        </>
      ),
    },
  ];
  if (loading) {
    return (
        <div className="loading-container">
            <Spin size="large" />
        </div>
    );
}
  return (
    <>
      <Layout style={{ minHeight: '100vh' }}>
        <AppSidebar />
        <Layout>
          <AppHeader />
          <Breadcrumb
            items={[
              {
                title: <Link to='../home'>Home</Link>
              },
              {
                title: 'Feature Management',
              },
            ]}
            style={{
              marginLeft: 140, marginTop: 20
            }}
          />

          <Content style={{ padding: '0px 140px' }}>
            <h1>Feature Management</h1>
            <Button type="primary" style={{ marginBottom: 16 }}
              onClick={() => handleAddFeatureClick()}
              onMouseEnter={handleMouseEnter}
              ghost
              onMouseLeave={handleMouseLeave}
            >
              Add Feature
            </Button>
            <Search
              placeholder="Enter feature name to search..."
              style={{ width: 300, marginBottom: 16, marginLeft: 16 }}
              onSearch={handleSearch}
            />
            {data &&
              <Table
                dataSource={data.content}
                columns={columns}
                rowKey="featureId"
                size='small'
                pagination={{
                  current: data.number + 1,
                  pageSize: data.size,
                  total: data.totalElements
                }}
                onChange={handleTableChange}
              />
            }
          </Content>
        </Layout>
      </Layout>
      <AddFeature
        visible={addFeatureVisible}
        onClose={handleAddFeatureClose}
      >
      </AddFeature >
      {dataEdit &&
        <EditFeature
          visibleEdit={editFeatureVisible}
          close={handleEditFeatureClose}
          open={handleEditFeatureClose}
          dataEdit={dataEdit}
        >
        </EditFeature>
      }
      {contextHolder}
    </>
  )
}

export default FeatureList

