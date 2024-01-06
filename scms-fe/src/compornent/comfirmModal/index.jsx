import React from 'react';
import { Modal } from 'antd';

const ConfirmationModal = ({ isVisible, onConfirm, onCancel, title, content }) => {
    return (
        <Modal
        
            title={title}
            visible={isVisible}
            onOk={onConfirm}
            onCancel={onCancel}
        >
            {content}
        </Modal>
    );
};

export default ConfirmationModal;