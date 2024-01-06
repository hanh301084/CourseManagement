import { useState } from 'react';
import { Modal, Button, Upload } from 'antd';
import { DownloadOutlined, UploadOutlined } from '@ant-design/icons';
import checkListAPI from '../../../api/CheckListAPI';
import Notification from '../../../compornent/notifcation'
import { useEffect } from 'react';
const ImportModal = ({ isVisible, onClose, onRefresh }) => {

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState([]); // to store feedback messages
  const [feedbackModalVisible, setFeedbackModalVisible] = useState(false); // to control visibility of feedback modal

  const handleDownloadTemplate = () => {
    checkListAPI.downloadTemplate()
      .catch((error) => {
        console.error('Error downloading template:', error);
      });
  };

  const handleUpload = (options) => {
    const { onSuccess, onError } = options;

    setFile(options.file);

    onSuccess('Ok');
  };

  const handleSubmit = async () => {

    setLoading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await checkListAPI.importChecklist(formData);

      if (response.status === 200) {
        if (typeof response.data === 'string') {
          Notification('error', 'Import failed', response.data);

        } else {
          const feedbackData = response.data;  // Store response data in a variable

          setFeedback(feedbackData); // Update the feedback state
          onRefresh();
          setFeedbackModalVisible(true); // Show the feedback modal
        }
        setLoading(false);
        onClose();
      }
    } catch (err) {
      const mess = err.response.data
      Notification('error', 'Import failed', mess ? mess : 'Import failed! Please try again');
      setLoading(false);
    }


  };
  useEffect(() => {

  }, [feedback]);
  const messageStyle = {
    color: 'green',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '950px', // Adjust as needed
  };

  return (
    <>

      <Modal
        title={null}

        visible={isVisible}
        onCancel={onClose}
        footer={null}
      >
        <div style={{ background: '#fff', borderBottom: '1px solid #f0f0f0' }}>
          <h2 style={{ textAlign: 'center' }}>Import Checklist</h2>
        </div>
        <Button type='primary' ghost style={{ float: 'right' }} size='small' icon={<DownloadOutlined />} onClick={handleDownloadTemplate}>
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
        title={null}
        visible={feedbackModalVisible}
        onCancel={() => setFeedbackModalVisible(false)}
        footer={null}
        width={1000}
        style={{ maxWidth: '1000px' }}
      >
        <div style={{ padding: '8px 16px', background: '#fff', borderBottom: '1px solid #f0f0f0' }}>
          <h3 style={{ textAlign: 'center' }}>Import Feedback</h3>
        </div>
        <div style={{ maxHeight: '480px', overflowY: 'auto', padding: '16px 24px' }}>
          {feedback.map((msg, index) => (
            <p key={index} style={{ ...messageStyle, color: msg.startsWith('Duplicate') ? 'red' : 'green' }}>
              {msg}
            </p>
          ))}
        </div>
      </Modal>



    </>
  );
}
export default ImportModal;