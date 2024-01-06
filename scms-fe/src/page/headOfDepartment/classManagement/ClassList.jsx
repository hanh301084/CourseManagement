import { EditOutlined, EyeFilled, QuestionOutlined } from "@ant-design/icons";
import {
  Breadcrumb,
  Button,
  Form,
  Input,
  Layout,
  Modal,
  Select,
  Switch,
  Table,
  Spin,
  Tooltip
} from "antd";
import moment from 'moment';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import React, { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import classAPI from "../../../api/ClassAPI";
import AppFooter from "../../../compornent/layout/Footer";
import AppHeader from "../../../compornent/layout/Header";
import AppSidebar from "../../../compornent/layout/hod/HODSidebar";
import userAPI from "../../../api/UserAPI";
import semesterServiceInstance from "../../../api/SemesterAPI";
import openNotificationWithIcon from "../../../compornent/notifcation";
import { Helmet } from "react-helmet";
import '../style.css'


const { Content } = Layout;
const { Option } = Select;

const ClassList = () => {
  const [classes, setClasses] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isSelectClass, setIsSelectClass] = useState(null);
  const [form] = Form.useForm();
  const [users, setUsers] = useState([]);
  const [semester, setSemester] = useState();
  const [semesters, setSemesters] = useState([]);
  const [isEditDisabled, setIsEditDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [isBlock5, setIsBlock5] = useState();


  const [selectedReviewers, setSelectedReviewers] = useState([]);
  const [selectedReviewerResits, setSelectedReviewerResits] = useState([]);

  // Cập nhật danh sách reviewer khi có sự thay đổi
  const handleReviewerChange = (value, index) => {
    const updatedReviewers = [...selectedReviewers];
    updatedReviewers[index] = value;
    setSelectedReviewers(updatedReviewers);
  };

  // Cập nhật danh sách reviewer resit khi có sự thay đổi
  const handleReviewerResitChange = (value, index) => {
    const updatedResits = [...selectedReviewerResits];
    updatedResits[index] = value;
    setSelectedReviewerResits(updatedResits);
  };

  // Lọc ra các reviewer có sẵn
  const availableReviewers = (currentIndex) => {
    return users
      .filter(user => user.roleNames.includes("REVIEWER"))
      .filter(user => !selectedReviewers.includes(user.userId) || selectedReviewers[currentIndex] === user.userId);
  };

  // Lọc ra các reviewer resit có sẵn
  const availableReviewerResits = (currentIndex) => {
    return users
      .filter(user => user.roleNames.includes("REVIEWER"))
      .filter(user => !selectedReviewerResits.includes(user.userId) || selectedReviewerResits[currentIndex] === user.userId);
  };
  //========================
  const handleSubmit1 = async () => {
    setSubmitted(true);

  };

  useEffect(() => {
    const getAllUser = async () => {
      await userAPI
        .getAll(1, 100, "")
        .then((response) => {
          const usersWithRoles = response.data.content.map((user) => ({
            ...user,
            roleNames: Array.isArray(user.role) ? user.role : [],
          }));
          setUsers(usersWithRoles);
          setLoading(false)
        })
        .catch((error) => {
          setLoading(false)

        });
    };
    getAllUser();
  }, []);

  useEffect(() => {
    const fetchSemesters = async () => {
      try {
        // Fetch all semesters
        const allSemestersResponse = await semesterServiceInstance.getAllSemesters(1, 100, "");
        const allSemestersData = allSemestersResponse.data.content;
        setSemesters(allSemestersData);

        // Fetch current semester
        const currentSemesterResponse = await semesterServiceInstance.getCurrentSemester();

        const currentSemesterData = currentSemesterResponse.data;
        if (currentSemesterData && currentSemesterData.semesterId) {
          setSemester(currentSemesterData.semesterId);
        } else {
          if (allSemestersData.length > 0) {
            setSemester(allSemestersData.at(-1).semesterId);
          }
        }
      } catch (error) {
        console.error("Error fetching semesters:", error);
      }
    };

    fetchSemesters();
  }, []);
  const fetchClasses = async () => {
    try {
      const response = await classAPI.getAllClass();
      setClasses(response.data);
    } catch (error) {
    }
  };
  useEffect(() => {
    fetchClasses();
  }, []);

  const toggleStatus = (value) => {
    Modal.confirm({
      title: "Confirm Status Change",
      content: `Are you sure you want to change the status to ${value.status === "ACTIVE" ? "INACTIVE" : "ACTIVE"
        }?`,
      onOk: () => {
        handleFormSubmit({
          classCode: value.classCode,
          classId: value.classId,
          status: value.status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
          isBlock5: value.isBlock5,
          trainerId: value.trainer.userId,
          reviewer1Id: value.reviewer1 != null ? value.reviewer1.userId : null,
          reviewer2Id: value.reviewer2 != null ? value.reviewer2.userId : null,
          reviewer3Id: value.reviewer3 != null ? value.reviewer3.userId : null,
          reviewer4Id: value.reviewer4 != null ? value.reviewer4.userId : null,
          reviewer1Id: value.reviewerResit1 != null ? value.reviewerResit1.userId : null,
          reviewer2Id: value.reviewerResit2 != null ? value.reviewerResit2.userId : null,
          reviewer3d: value.reviewerResit3 != null ? value.reviewerResit3.userId : null,
          reviewer4Id: value.reviewerResit4 != null ? value.reviewerResit4.userId : null,
        });
      },
    });
  };

  const showModal = (mode, classData = null) => {
    if (mode === "edit" && classData !== null) {
      setIsSelectClass(classData)
      setIsEditDisabled(classData.is_use === "YES");

      const reviewers = [
        classData.reviewer1,
        classData.reviewer2,
        classData.reviewer3,
        classData.reviewer4
      ].filter(reviewer => reviewer != null).map(reviewer => reviewer.userId);

      const reviewerResits = [
        classData.reviewerResit1,
        classData.reviewerResit2,
        classData.reviewerResit3,
        classData.reviewerResit4
      ].filter(reviewerResit => reviewerResit != null).map(reviewerResit => reviewerResit.userId);

      setSelectedReviewers(reviewers);
      setSelectedReviewerResits(reviewerResits);

      form.setFieldsValue({
        classCode: classData.classCode,
        classCode: classData.classCode,
        isBlock5: classData.isBlock5,
        status: classData.status,
        trainerId: classData.trainer ? classData.trainer.userId : null,
        reviewers: reviewers,
        reviewerResits: reviewerResits,
      });
    } else {
      form.resetFields();
      setSelectedReviewers([]);
      setSelectedReviewerResits([]);
      setIsEditDisabled(false);
    }
    setIsFormVisible(true);
  };


  const handleFormSubmit = async (values) => {
    values.semesterId = semester;
    const _isSelectClass = values.classId ? values : isSelectClass;
    try {
      if (_isSelectClass !== null) {
        values.classId = _isSelectClass.classId;
        await classAPI.updateClass(values);
        openNotificationWithIcon('success', 'Successfully', 'Class Updatte sucessfully!')


        fetchClasses();
      } else {
        const existedClass = classes.find((item) => item.classCode === values.classCode);
        if (existedClass != null) {
          openNotificationWithIcon('warning', 'Faild', 'Class already exist!')

          return;
        }
        await classAPI.createClass(values);
        openNotificationWithIcon('success', 'Successfully', 'Add class sucessfully!')

      }
      fetchClasses();
      setIsFormVisible(false);
      form.resetFields();

    } catch (error) {


    }
  };

  const dropdownContainerStyle = {
    display: "flex",
    alignItems: "center",
    marginLeft: 0,
    marginTop: 20,
    marginBottom: 16,
  };


  const dropdownStyle = {
    width: 150,
    marginLeft: 16,
  };



  const columns = [
    { title: 'No', dataIndex: 'index', key: 'index', render: (text, record, index) => index + 1 },
    {
      title: "Class Code",
      dataIndex: "classCode",
      key: "classCode",
      sorter: (a, b) => a.classCode.localeCompare(b.classCode),
    },
    {
      title: "Class Type",
      dataIndex: "isBlock5",
      key: "isBlock5",
      render: (isBlock5) => {
        return isBlock5 === "YES" ? <span style={{ color: 'red' }}>Block 5</span> : <span style={{ color: 'green' }}>Block 10</span>;
      },
    },
    {
      title: "Lecturer",
      dataIndex: "trainer",
      key: "trainer_id",
      render: (trainer) => trainer.fullName,
      onFilter: (value, record) => record.trainer.fullName === value,
    },
    {
      title: "Reviewer",
      key: "reviewer",
      render: (text, record) => {
        const reviewerNames = [record.reviewer1, record.reviewer2, record.reviewer3, record.reviewer4]
          .filter(reviewer => reviewer != null)
          .map(reviewer => reviewer.fullName);

        return reviewerNames.join(", ");
      },
    },
    {
      title: "Reviewer Resit",
      key: "reviewerResit",
      render: (text, record) => {
        const reviewerResitNames = [record.reviewerResit1, record.reviewerResit2, record.reviewerResit3, record.reviewerResit4]
          .filter(reviewer => reviewer != null)
          .map(reviewer => reviewer.fullName);

        return reviewerResitNames.join(", ");
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status, record) => {
        const endDate = moment(record.semester.endDate);
        const currentDate = moment();
        if (endDate.isBefore(currentDate) || record.is_use === "YES") {
          return <span>{status}</span>;
        }
        return (
          <Switch
            checked={record.status === "ACTIVE"}
            onChange={() => toggleStatus(record)}
          />
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => {
        const endDate = moment(record.semester.endDate);
        const currentDate = moment();
        if (endDate.isBefore(currentDate)) {
          return (
            <Tooltip title="You cannot edit class of previous semester">
              <Button
                icon={<QuestionOutlined />}
                disabled
                style={{ marginRight: 5 }}
              />
            </Tooltip>
          );
        }
        return (

          <Button
            icon={<EditOutlined />}
            onClick={() => showModal("edit", record)}
            style={{ marginRight: 5 }}
          />

        );
      },
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
    <Fragment>
      <Layout style={{ minHeight: "100vh" }}>
        <AppSidebar />
        <Layout>
          <AppHeader />
          <Breadcrumb style={{ marginLeft: 140, marginTop: 20 }}>
            <Breadcrumb.Item>
              <Link to='../hod/dashboard'>Home</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>Class Management</Breadcrumb.Item>
          </Breadcrumb>
          <Helmet>
            <title>Class Management</title>
          </Helmet>
          <Content style={{ padding: "0px 140px" }}>
            <h1>Class Management</h1>
            <div style={dropdownContainerStyle}>
              <Button
                ghost
                type="primary"
                onClick={() => showModal("add")}
                style={{ float: "left" }}
              >
                Add Class
              </Button>
              <Select
                style={dropdownStyle}
                onChange={setSemester}
                value={semester}
              >
                {semesters.map((item, index) => (
                  <Select.Option key={item.semesterId} value={item.semesterId}>
                    {item.semesterName}
                  </Select.Option>
                ))}
              </Select>
            </div>
            <div>
              <Modal
                // title={isSelectClass !== null ? "Edit Class" : "Add Class"}
                title={isSelectClass !== null ? <span className="centered-title">Edit Class</span> : <span className="centered-title">Add Class</span>}
                visible={isFormVisible}
                footer={null}
                onCancel={() => setIsFormVisible(false)}

              >
                <Form layout="vertical" form={form} onFinish={handleFormSubmit}>
                  <Form.Item label="Class Code" name="classCode"
                    rules={[{ required: true, message: 'Please input the class code!' }]}
                  >

                    {isEditDisabled ? (
                      <span>{isSelectClass.classCode}</span>
                    ) : (
                      <Form.Item name="classCode" noStyle
                        rules={[{ required: true, message: 'Please input the class code!' }]}
                      >
                        <Input placeholder="Enter class code" />
                      </Form.Item>
                    )}
                  </Form.Item>
                  <Form.Item label="Class Type" name="isBlock5" rules={[{ required: true, message: 'Please select a Lecturer!' }]}>
                    {isEditDisabled ? (
                      <span>{isSelectClass.isBlock5 === "YES" ? "Block 5" : "Block 10"}</span>

                    ) : (
                      <Form.Item name="isBlock5" noStyle rules={[{ required: true, message: 'Please select a Class type!' }]}>
                        <Select showSearch placeholder="Select class type">
                          <Select.Option value="NO">Block 10</Select.Option>
                          <Select.Option value="YES">Block 5</Select.Option>
                        </Select>
                      </Form.Item>
                    )}
                  </Form.Item>
                  <Form.Item
  name="trainerId"
  label="Lecturer"
  rules={[{ required: true, message: "Please select a Lecturer!" }]}
>
  <Select showSearch placeholder="Select a trainer">
    {users
      .filter(user => user.roleNames.includes("TEACHER"))
      .map(user => (
        <Select.Option key={user.userId} value={user.userId}>
          {user.fullName}
        </Select.Option>
    ))}
  </Select>
</Form.Item>

                  <Form.List name="reviewers" initialValue={['']}>
                    {(fields, { add, remove }) => (
                      <>
                        {fields.map((field, index) => (
                          <Form.Item
                            label={index === 0 ? 'Reviewers' : ''}
                            required={false}
                            key={field.key}
                          >
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                              <Form.Item
                                name={[field.name]}
                                noStyle
                                style={{ flexGrow: 1 }} // Cho phép ô Select mở rộng
                              >
                                <Select
                                  placeholder="Choose Reviewer"
                                  style={{ width: '100%' }}
                                  showSearch
                                  filterOption={(input, option) =>
                                    option.children.toLowerCase().includes(input.toLowerCase())
                                  }
                                  onChange={(value) => handleReviewerChange(value, index)}
                                >
                                  {availableReviewers(index).map(user => (
                                    <Select.Option key={user.userId} value={user.userId}>
                                      {user.fullName}
                                    </Select.Option>
                                  ))}
                                </Select>
                              </Form.Item>
                              {fields.length > 1 && (
                                <MinusCircleOutlined
                                  style={{ marginLeft: '2px' }}
                                  onClick={() => remove(field.name)}
                                />
                              )}
                            </div>
                          </Form.Item>
                        ))}
                        {fields.length < 4 && (
                          <Form.Item>
                            <Button
                              type="dashed"
                              onClick={() => add()}
                              style={{ width: '100%' }}
                            >
                              <PlusOutlined /> Add Reviewer
                            </Button>
                          </Form.Item>
                        )}
                      </>
                    )}
                  </Form.List>

                  <Form.List name="reviewerResits" initialValue={['']}>
                    {(fields, { add, remove }) => (
                      <>
                        {fields.map((field, index) => (
                          <Form.Item
                            label={index === 0 ? 'Reviewers Resits' : ''}
                            required={false}
                            key={field.key}
                          >
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                              <Form.Item
                                name={[field.name]}
                                noStyle
                                style={{ flexGrow: 1 }}
                              >
                                <Select
                                  placeholder="Choose Reviewer"
                                  style={{ width: '100%' }}
                                  showSearch
                                  filterOption={(input, option) =>
                                    option.children.toLowerCase().includes(input.toLowerCase())
                                  }
                                  onChange={(value) => handleReviewerResitChange(value, index)}
                                >
                                  {availableReviewerResits(index).map(user => (
                                    <Select.Option key={user.userId} value={user.userId}>
                                      {user.fullName}
                                    </Select.Option>
                                  ))}
                                </Select>
                              </Form.Item>
                              {fields.length > 1 && (
                                <MinusCircleOutlined
                                  style={{ marginLeft: '2px' }}
                                  onClick={() => remove(field.name)}
                                />
                              )}
                            </div>
                          </Form.Item>
                        ))}
                        {fields.length < 4 && (  // Change here
                          <Form.Item>
                            <Button
                              type="dashed"
                              onClick={() => add()}
                              style={{ width: '100%' }}
                            >
                              <PlusOutlined /> Add Reviewer
                            </Button>
                          </Form.Item>
                        )}
                      </>
                    )}
                  </Form.List>



                  {/* ======================== */}

                  <Form.Item>
                    <Button type="primary" htmlType="submit" ghost loading={loading} onClick={handleSubmit1}>
                      Submit
                    </Button>
                    <Button
                      onClick={() => setIsFormVisible(false)}
                      danger
                      style={{ marginLeft: "10px" }}
                    >
                      Cancel
                    </Button>
                  </Form.Item>
                </Form>
              </Modal>
            </div>
            <Table
              dataSource={classes.filter((item) => {
                if (item.semester && item.semester.semesterId)
                  return item.semester.semesterId === semester;
                return false;
              })}
              columns={columns}
              rowKey="classCode"
            />
          </Content>
          <AppFooter />
        </Layout>

      </Layout>

    </Fragment>
  );
};

export default ClassList;
