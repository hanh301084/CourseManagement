import React from 'react';
import { Modal, Table } from 'antd';
import '../style.css'
const FinalPresentationModals = ({ isVisible, onCancel, onOk,  pointEvaluations }) => {
    // Define columns for the point evaluations table
    const pointEvaluationColumns = [
        
        { title: 'Reviewer', dataIndex: 'reviewer', key: 'reviewer', render: reviewer => reviewer.fullName },
        {
            title: 'Project Introduction',
            dataIndex: 'projectIntroduction',
            key: 'projectIntroduction',
            render: text => text !== null ? text.toFixed(2) : 'N/A'
        },
        {
            title: 'SRS',
            dataIndex: 'finalSRSWeight',
            key: 'finalSRSWeight',
            render: text => text !== null ? text.toFixed(2) : 'N/A'
        },
        {
            title: 'SDS',
            dataIndex: 'finalSDSWeight',
            key: 'finalSDSWeight',
            render: text => text !== null ? text.toFixed(2) : 'N/A'
        },
        {
            title: 'Implementation',
            dataIndex: 'projectImplementation',
            key: 'projectImplementation',
            render: text => text !== null ? text.toFixed(2) : 'N/A'
        },
        {
            title: 'Team Work',
            dataIndex: 'teamWorkingWeight',
            key: 'teamWorkingWeight',
            render: text => text !== null ? text.toFixed(2) : 'N/A'
        },
        {
            title: 'Q&A',
            dataIndex: 'qandA',
            key: 'qandA',
            render: text => text !== null ? text.toFixed(2) : 'N/A'
        }
       
    ];

    return (
        <Modal
            title={<span className="centered-title" style={{marginBottom: 20}}>Final Presentation Evaluations</span>}
            visible={isVisible}
            onOk={onOk}
            onCancel={onCancel}
            width="60%" 
            
            footer={null}
        >
            
            <Table dataSource={pointEvaluations} columns={pointEvaluationColumns} rowKey="pointEvaluationId" />
        </Modal>
    );
};
export default FinalPresentationModals;
