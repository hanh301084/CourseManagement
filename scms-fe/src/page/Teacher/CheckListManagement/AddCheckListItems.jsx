import { Button, Form, Input, Modal } from "antd";
import React, { Fragment, useState } from "react";
import CheckListService from "../../../api/CheckListAPI";
import Notification from '../../../compornent/notifcation'
import '../style.css'
import TextArea from "antd/es/input/TextArea";
const AddCheckListItems = ({ visible, onClose, checkList }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = async (value) => {
    setLoading(true);
    try {
      CheckListService.createCheckListItems({
        ...value,
        checkList: checkList,
      })
        .then(() => {
          form.resetFields();
          Notification('success', 'Successfully', 'Checklist item add successfully!');
          setLoading(false)
          onClose();
        })
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to add checklist item. Please try again later.';
      Notification('error', 'add failed', errorMessage);
    }
  };

  const onCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Fragment>
      <Modal
          title={<span className="centered-title">Add Checklist Item</span>}
        open={visible}
        footer={null}
        onCancel={onCancel}
      >
        <Form layout="vertical" form={form} onFinish={handleFormSubmit}>
          <Form.Item
            name="name"
            label="Name"
            rules={[
              { required: true, message: "Please input check-list name!" },
            ]}
          >
            <Input placeholder="Enter a new checkList name" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
             
          >
            <TextArea placeholder="Enter a new description" style={{height:240}} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" ghost htmlType="submit" loading={loading}>
              Submit
            </Button>
            <Button style={{ marginLeft: "10px" }} danger onClick={onCancel}>
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Fragment>
  );
};
export default AddCheckListItems;
