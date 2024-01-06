
import React, { useState } from 'react';
import { Modal, Form, Input, Button } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import featureService from '../../../api/FeatureAPI';
import '../style.css'
import Notification from '../../../compornent/notifcation'
const AddFeature = ({ visible, onClose }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handleFormSubmit = async (values) => {
        setLoading(true);
        try {
            featureService.addFeature(values)
                .then(() => {
                    form.resetFields();
                    onClose();
                    Notification('success', 'Success!', 'Feature add successfully!')
                })
                .catch((error) => {
                    Notification('error', 'Error!', 'Error to add feature!')
                });
        } catch (error) {
            Notification('error', 'Error!', 'Error to add feature!')
        } finally {
            setLoading(false);
        }
    };

    const onCancel = () => {
        form.resetFields();
        onClose();
    };

    return (
        <>
            <Modal
                title={<span className="centered-title">Add Feature</span>}
                open={visible}
                footer={null}
                onCancel={onCancel}
            >
                <Form layout="vertical" form={form} onFinish={handleFormSubmit}>

                    <Form.Item
                        name="featureName"
                        label="Feature Name"
                        rules={[{ required: true, message: 'Please input feature name!' }]}
                    >
                        <Input placeholder="Enter a new feature name" />
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label="Feature Description"
                        rules={[{ required: true, message: 'Please input feature description!' }]}
                    >
                        <TextArea placeholder="Enter a new feature name" autoSize={{ minRows: 3, maxRows: 6 }} />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" ghost loading={loading}>
                            Submit
                        </Button>
                        <Button style={{ marginLeft: '10px' }} danger onClick={onCancel}>
                            Cancel
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};
export default AddFeature;

