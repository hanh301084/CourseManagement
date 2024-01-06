import { useState } from 'react';
import { Modal, Button, Upload, message } from 'antd';
import { DownloadOutlined, UploadOutlined } from '@ant-design/icons';

import ProjectBacklogAPI from '../../../api/ProjectBacklogAPI';
import openNotificationWithIcon from '../../../compornent/notifcation';

const ImportProjectBacklogModal = ({ isVisible, onClose,onRefresh  }) => {

  const [file, setFile] = useState(null); 
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState([]); // to store feedback messages
  const [feedbackModalVisible, setFeedbackModalVisible] = useState(false); // to control visibility of feedback modal
  
  const handleDownloadTemplate = () => {
    // Download template logic
  };

  const handleUpload = (options) => {
    const { onSuccess, onError } = options;

    setFile(options.file);

    onSuccess('Ok');
  };

  const handleSubmit = async () => {
    setSubmitted(true);
    setLoading(true);

    const formData = new FormData();

    formData.append('file', file);

    try {
        const response = await ProjectBacklogAPI.importProjectBacklog(formData);

        if (response.status === 200) {
            if (typeof response.data === 'string') {
               openNotificationWithIcon('error','Error', response.data )
            } else {
                setFeedback(response.data);  // set the feedback
                onRefresh(); 
                setFeedbackModalVisible(true); // show the feedback modal
            }
            setLoading(false);
            onClose(); 
        }
    } catch (err) {
      
        if (err.response && err.response.data) {
          openNotificationWithIcon('error','Error', err.response.data)
        } else {
          openNotificationWithIcon('error','Error', err.response.data)
        }
        setLoading(false);
    }

    setSubmitted(false);
};

  return (
    <>

    <Modal 
      title={null}
      visible={isVisible}
      onCancel={onClose}
      footer={null}
    >
      <div style={{  background: '#fff', borderBottom: '1px solid #f0f0f0' }}>
          <h2 style={{ textAlign: 'center' }}>Import Project WBS</h2>
        </div>
        <Button type='primary' icon={<DownloadOutlined />} ghost style={{float: 'right'}} size='small' onClick={handleDownloadTemplate}>
        Download Template
      </Button>

      <Upload
        customRequest={handleUpload}
        onRemove={() => setFile(null)}
        maxCount={1}
      >
       <Button type='primary' ghost size='small' icon={<UploadOutlined />}>
          Select File
        </Button>
      </Upload>

      {file && (
          <Button
            ghost
            type="primary"
            style={{ marginTop: 10 }}
            loading={loading}
            disabled={loading}
        onClick={handleSubmit}
      >
        Submit
      </Button>
        )}
    </Modal>
    <Modal 
        title="Import Feedback"
        visible={feedbackModalVisible}
        onCancel={() => setFeedbackModalVisible(false)}
        footer={null}
        style={{ maxHeight: '400px', overflowY: 'auto' }}
    >
        {feedback.map((msg, index) => (
            <p key={index} style={{ color: msg.startsWith('Duplicate') ? 'red' : 'green' }}>
                {msg}
            </p>
        ))}
    </Modal>
    </>
  );
}

export default ImportProjectBacklogModal;