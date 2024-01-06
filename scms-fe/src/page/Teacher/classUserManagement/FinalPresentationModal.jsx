import React from 'react';
import { Modal, Table } from 'antd';

export const FinalPresentationModal = ({ isVisible, handleOk, handleCancel, classUser, packageGradeColumns, classUserId, finalPresentationResit }) => {
    const title = finalPresentationResit !== null ? "Final Presentation Resit" : "Final Presentation"

    return (
        <Modal
            title={title}
            visible={isVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            width="80%"  // Optional: Increase the width of the modal if needed
        >
            <Table
                dataSource={classUser.filter(user => user.classUserId === classUserId)}
                columns={packageGradeColumns}
                rowKey="classUserId"   
                scroll={{ y: 240 }}   
                pagination={false}
            />
        </Modal>
    );
};
