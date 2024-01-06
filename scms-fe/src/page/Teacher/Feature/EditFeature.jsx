
import React, { useState } from 'react';
import { Modal, Form, Input, Button } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import featureService from '../../../api/FeatureAPI';
import '../style.css'
import Notification from '../../../compornent/notifcation'
const EditFeature = ({ visibleEdit, close,dataEdit }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handleFormSubmit = async (values) => {
        setLoading(true);
        try {
            featureService.addFeature({...dataEdit,...values})
                .then(() => {
                    form.resetFields();
                    close();
                    Notification('success', 'Success!', 'Feature update successfully!')
                })
                .catch((error) => {
                    Notification('error', 'Error!', 'Error to update feature!')
                });
        } catch (error) {
            Notification('error', 'Error!', 'Error to update feature!')
        } finally {
            setLoading(false);
        }
    };

    const onCancel = () => {
        form.resetFields();
        close();
    };

    return (
        <>
            <Modal 
            title={<span className="centered-title">Edit Feature</span>}
            open={visibleEdit} footer={null} onCancel={onCancel}>
                <Form layout="vertical" form={form} onFinish={handleFormSubmit}  initialValues={dataEdit}>
                    <Form.Item
                        name="featureName"
                        label="Feature Name"
                        rules={[{ required: true, message: 'Please input feature name!' }]}
                    >
                        <Input placeholder="Enter a new feature name"  />
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label="Feature Description"
                        rules={[{ required: true, message: 'Please input feature description!' }]}
                    >
                        <TextArea placeholder="Enter a new feature name" autoSize={{ minRows: 3, maxRows: 6 }}/>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" ghost htmlType="submit" loading={loading}>
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
export default EditFeature;

