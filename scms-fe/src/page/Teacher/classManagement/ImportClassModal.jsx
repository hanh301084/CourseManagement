import { useState } from 'react';
import { Modal, Button, Upload, message } from 'antd';
import { DownloadOutlined, UploadOutlined } from '@ant-design/icons';

import ClassUserAPI from '../../../api/ClassUserAPI';
import openNotificationWithIcon from '../../../compornent/notifcation';

const ImportClassModal = ({ isVisible, onClose, selectedClassId, selectedSemester }) => {

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleDownloadTemplate = () => {
    ClassUserAPI.downloadTeamplateImportStudent()
      .catch((error) => {
        console.error('Error downloading template:', error);
      });
  };

  const handleUpload = (options) => {
    const { onSuccess, onError } = options;

    setFile(options.file);

    onSuccess('Ok');
  }

  const handleSubmit = async () => {
    setSubmitted(true);
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await ClassUserAPI.importClassUser(formData, selectedClassId, selectedSemester);
      if (response.status === 200) {
        openNotificationWithIcon('success', 'Successfully!', 'Student success import to class!')
        setLoading(false);
        onClose();
      } else {
        openNotificationWithIcon('error', 'ERROR!', 'Something went wrong, Please try again later!')
        setLoading(false);
      }
    } catch (err) {
      const errorMess = err.response.data ? err.response.data : "Something went wrong, Please try again later!"
      openNotificationWithIcon('error', 'ERROR!', errorMess)
      setLoading(false);
    }
    setSubmitted(false);
  };

  return (
    <Modal
      title="Import Excel"
      visible={isVisible}
      onCancel={onClose}
      footer={null}
    >
      <Button icon={<DownloadOutlined />} onClick={handleDownloadTemplate}>
        Download Template
      </Button>

      <Upload
        customRequest={handleUpload}
        onRemove={() => setFile(null)}
        maxCount={1}
      >
        <Button icon={<UploadOutlined />}>
          Select File
        </Button>
      </Upload>

      <Button
        type="primary"
        loading={loading}
        disabled={!file || loading}
        onClick={handleSubmit}
      >
        Submit
      </Button>
    </Modal>
  );
}

export default ImportClassModal;