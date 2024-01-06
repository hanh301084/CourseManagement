import React, { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CheckListService from "../../../api/CheckListAPI";
import AppFooter from "../../../compornent/layout/Footer";
import AppHeader from "../../../compornent/layout/Header";
import AppSidebar from "../../../compornent/layout/Teacher/TeacherSidebar";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Breadcrumb, Button, Input, Layout, Modal, Space, Table, Switch, Tooltip } from "antd";
import AddCheckList from "./AddCheckList";
import AddCheckListItems from "./AddCheckListItems";
import EditCheckList from "./EditCheckList";
import Notification from '../../../compornent/notifcation'
import { Helmet } from "react-helmet";
import ImportModal from "./ImportModel";
import EditCheckItemsList from "./EditCheckListItems";
const { TextArea } = Input;
const { Content } = Layout;

const CheckList = () => {
  const [checkList, setCheckList] = useState([]);
  const [selectedCheckList, setSelectedCheckList] = useState(null);
  const [newCheckList, setNewCheckList] = useState(false);
  const [newCheckListItems, setNewCheckListItems] = useState();
  const [checkListItems, setCheckListItems] = useState([]);
  const [editCheckListVisible, setEditCheckListVisible] = useState(false);
  const [editingCheckList, setEditingCheckList] = useState(null);
  const [modal, contextHolder] = Modal.useModal();
  const [editCheckListItemVisible, setEditCheckListItemVisible] = useState(false);
  const [editingCheckListItem, setEditingCheckListItem] = useState(null);
  const handleCheckListItemEdited = (updatedCheckListItem) => {
    const updatedItems = checkListItems.map(item =>
      item.id === updatedCheckListItem.id ? updatedCheckListItem : item
    );
    setCheckListItems(updatedItems);
    setEditCheckListItemVisible(false);
  };
  const getAllCheckListItems = () => {
    CheckListService.getAllCheckListItems()
      .then((response) => {
        setCheckListItems(response.data);

      })
      .catch((error) => {
        console.log(error);
      });
  };
  const [isImportModalVisible, setIsImportModalVisible] = useState(false);
  const handleEditCheckListItemClick = (record) => {
    setEditingCheckListItem(record);
    setEditCheckListItemVisible(true);
  };
  useEffect(() => {
    getAllCheckListItems();
  }, []);
  const handleStatusChange = (checkListId, newStatus) => {
    Modal.confirm({
      title: 'Are you sure you want to change the status?',
      content: `This will change the status to ${newStatus}.`,
      onOk() {
        CheckListService.updateCheckListStatus(checkListId, newStatus)
          .then(response => {
            Notification('success', 'Status Update Successfully!')
            const updatedCheckLists = checkList.map(cl =>
              cl.id === checkListId ? { ...cl, status: newStatus } : cl
            );
            setCheckList(updatedCheckLists);
          })
          .catch(error => {
            const errorMessage = error.response?.data?.error || 'Failed to change checklist\'s Status. Please try again later.';
            Notification('error', 'Change failed', errorMessage);
          });
      },
    });
  };
  const refreshCheckListData = () => {
    getAllCheckList(); 
    getAllCheckListItems();
  };
  const statusFilters = [
    { text: 'Active', value: 'ACTIVE' },
    { text: 'Inactive', value: 'INACTIVE' },
  ];
  const itemStatusFilters = [
    { text: 'Active', value: 'ACTIVE' },
    { text: 'Inactive', value: 'INACTIVE' },
  ];
  const handleItemStatusChange = (itemId, newStatus) => {
    Modal.confirm({
      title: 'Are you sure you want to change the status?',
      content: `This will change the status to ${newStatus}.`,
      onOk() {
        CheckListService.updateCheckListItemStatus(itemId, newStatus)
          .then(response => {
            Notification('success', 'Checklist Item Status Updated Successfully!');
            // Update the state to reflect the change
            const updatedItems = checkListItems.map(item =>
              item.id === itemId ? { ...item, status: newStatus } : item
            );
            setCheckListItems(updatedItems);
          })
          .catch(error => {
            const errorMessage = error.response?.data?.error || 'Failed to change checklist item\'s status. Please try again later.';
            Notification('error', 'Change failed', errorMessage);
          });
      },
    });
  };
  const closeImportModal = () => {
    setIsImportModalVisible(false);
}
const openImportModal = () => {
  setIsImportModalVisible(true);
}
  const expandedRowRender = (record) => {
    const columns = [
      {
        title: "No",
        dataIndex: "id",
        key: "id",
        render: (text, record, index) => index + 1,
      },
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
      },

      {
        title: "Note",
        dataIndex: "description",
        key: "description",
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        filters: itemStatusFilters,
        onFilter: (value, record) => record.status === value,
        render: (status, record) => (
          record.checkList.is_use === "YES" ? 
            <span>{status}</span> :
            <Switch
              size="small"
              checked={status === 'ACTIVE'}
              onChange={(checked) => handleItemStatusChange(record.key, checked ? 'ACTIVE' : 'INACTIVE')}
            />
        )
      },
      
      {
        title: "Action",
        dataIndex: "operation",
        key: "operation",
        render: (_, record) => (
          record.checkList.is_use !== "YES" ? (
            <Space size="middle">
              <Button
                icon={<EditOutlined />}
                onClick={() => handleEditCheckListItemClick(record)}
              />
            </Space>
          ) : (
            <Tooltip title="Editing not allowed when in use">
              <span style={{ color: 'gray' }}>
                <EditOutlined />
              </span>
            </Tooltip>
          )
        ),
      },
      
      
    ];

    const checkListId = record.key; // Lấy checkListId từ dòng hiện tại

    const filteredCheckListItems = checkListItems.filter(
      (item) => item.checkList.id === checkListId
    );

    const data1 = filteredCheckListItems.map((checklistitems) => ({
      key: checklistitems.id,
      name: checklistitems.name,
      description: checklistitems.description,
      checkList: checklistitems.checkList,
      status: checklistitems.status,
      
    }));

    return <Table columns={columns} dataSource={data1}  pagination={false} />;
  };
  const handleAddCheckListClick = () => {
    setNewCheckList(true);
  };

  const handleAddCheckListClose = () => {
    setNewCheckList(false);
  };

  const handleAddCheckListItemsClick = (record) => {
    setSelectedCheckList(record);
    setNewCheckListItems(true);
  };

  const handleAddCheckListItemsClose = () => {
    setNewCheckListItems(false);
    getAllCheckListItems();
  };

  const handleCheckListEdited = (updatedCheckList) => {
    const updatedCheckLists = checkList.map((checklist) =>
      checklist.id === updatedCheckList.id ? updatedCheckList : checklist
    );
    setCheckList(updatedCheckLists);
    setEditCheckListVisible(false);
  };

  const handleEditCheckListClick = (record) => {
    setEditingCheckList(record);
    setEditCheckListVisible(true);
  };

  const handleEditCheckListClose = () => {
    setEditCheckListVisible(false);
  };

  const getAllCheckList = () => {
    CheckListService.getAllCheckLists()
      .then((response) => {
        setCheckList(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleNewCheckListAdded = (newCheckList) => {
    setCheckList([...checkList, newCheckList]);
  };
  useEffect(() => {
    getAllCheckList();
  }, []);

  const columns = [
    {
      title: "NO",
      dataIndex: "id",
      key: "id",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) => <span title={record.name}>{text}</span>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      filters: statusFilters,
      onFilter: (value, record) => record.status === value,
      render: (status, record) => (
        record.is_use === "YES" ? 
          <span>{status}</span> :
          <Switch
            checked={status === 'ACTIVE'}
            onChange={(checked) => handleStatusChange(record.key, checked ? 'ACTIVE' : 'INACTIVE')}
          />
      )
    },

    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        record.is_use !== "YES" ? (
          <div>
            <Button
              icon={<PlusOutlined />}
              style={{ marginRight: "10px" }}
              onClick={() => handleAddCheckListItemsClick(record)}
            />
            <Button
              icon={<EditOutlined />}
              onClick={() => handleEditCheckListClick(record)}
            />
          </div>
        ) : (
          <Tooltip title="Editing not allowed when in use">
            <span style={{ color: 'gray' }}>
              <PlusOutlined style={{ marginRight: "10px" }} />
              <EditOutlined />
            </span>
          </Tooltip>
        )
      ),
    },
    
    
  ];

  const data = checkList.map((checklist) => ({
    key: checklist.id,
    id: checklist.id,
    name: checklist.name,
    status: checklist.status,
    is_use: checklist.is_use
  }));

  return (
    <Fragment>
      <Layout style={{ minHeight: "100vh" }}>
        <AppSidebar />
        <Helmet >
          <title>Checklist Management</title>
        </Helmet>
        <Layout>
          <AppHeader />
          <Breadcrumb
            items={[
              {
                title: <Link to="../teacher/">Home</Link>,
              },

              {
                title: "Check List Management",
              },
            ]}
            style={{
              marginLeft: 140,
              marginTop: 20,
            }}
          />
          <h1 style={{ marginLeft: 140,}}>Check List Management</h1>
          <Content
            style={{
              textAlign: "left",
              padding: '0px 140px',
            }}
          >
            <Button style={{ marginBottom: 16 }} ghost type="primary" onClick={() => handleAddCheckListClick()}>
              Add Check-list
            </Button>
            <Button style={{ marginLeft: 16 }} ghost type="primary" onClick={openImportModal}>
              Import checklist
            </Button>
            <Table
              columns={columns}
              dataSource={data}
              size="small"
              scroll={{y: 500}}
              expandable={{
                expandedRowRender,
              }}
            />
          </Content>
          <AppFooter />
        </Layout>
        <AddCheckList
          visible={newCheckList}
          onClose={handleAddCheckListClose}
          onNewCheckListAdded={handleNewCheckListAdded}
        />
        {editingCheckListItem && (
          <EditCheckItemsList
            visible={editCheckListItemVisible}
            onClose={() => setEditCheckListItemVisible(false)}
            onCheckListEdited={handleCheckListItemEdited}
            CheckListItemsData={editingCheckListItem}
            checkListItems={checkListItems}
            setCheckListItems={setCheckListItems}
            setEditCheckListItemVisible={setEditCheckListItemVisible}
          />
        )}
        <AddCheckListItems
          visible={newCheckListItems}
          onClose={handleAddCheckListItemsClose}
          checkList={selectedCheckList}
        />
   <ImportModal isVisible={isImportModalVisible} onClose={closeImportModal} onRefresh={refreshCheckListData}   />
        {editingCheckList && (
          <EditCheckList
            visible={editCheckListVisible}
            onClose={handleEditCheckListClose}
            onCheckListEdited={handleCheckListEdited}
            CheckListData={editingCheckList}
          />
        )}

        {contextHolder}
      </Layout>
    </Fragment>
  );
};

export default CheckList;
