import { Modal, Form, Input } from 'antd';
import { useEffect } from 'react';
import '../style.css'
const ModalAddOrEdit = ({ isVisible, project, onClose, onSave }) => {
    const [form] = Form.useForm();

    const handleOk = () => {
        form.validateFields()
            .then(values => {
                onSave(values);
                onClose();
            })
            .catch(info => {
                console.log('Validate Failed:', info);
            });
    };

    useEffect(() => {
        if (project) {
            form.setFieldsValue(project);
        } else {
            form.resetFields();
        }
    }, [project, form]);

    return (
        <Modal
            title={project !== null ? <span className="centered-title">Edit Project</span> : <span className="centered-title">Add Project</span>}
            visible={isVisible}
            onOk={handleOk}
            onCancel={onClose}
        >
            <Form
                form={form}
                layout="vertical"
                name="projectForm"
                initialValues={project}
            >
                <Form.Item
                    name="topicCode"
                    label="Project Code"
                    rules={[{ required: true, message: 'Please input the topic code!' }]}
                >
                    <Input placeholder="Enter topic code" />
                </Form.Item>
                <Form.Item
                    name="topicName"
                    label="Project Name"
                    rules={[{ required: true, message: 'Please input the topic name!' }]}
                >
                    <Input placeholder="Enter topic name" />
                </Form.Item>
                <Form.Item
                    name="description"
                    label="Description"
                    rules={[{ message: 'Please input the description!' }]}
                >
                    <Input.TextArea rows={8} placeholder="Enter description" />
                </Form.Item>
            </Form>
        </Modal>
    );
};
export default ModalAddOrEdit;