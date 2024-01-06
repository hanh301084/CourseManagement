import React, { useState } from 'react';
import { Button, Descriptions, Modal, Select, Switch, Input, Tooltip } from 'antd';
import { EditOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { Link } from "react-router-dom";
const { Item } = Descriptions;
const { Option } = Select;

export const TeamDetailsModal = ({ isVisible, handleOk, handleCancel }) => {
    const initialTeam = {
        team_name: 'Team 1',
        project_name: 'Course Management System',
        gitlab_url: 'https://gitlab.com/thaidt15/swp391',
        status: 'Active',
        created_at: '2023-01-01 10:00',
        updated_at: '2023-01-10 10:00'
    };

    const [team, setTeam] = useState(initialTeam);
    const [isEditing, setIsEditing] = useState(false);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = () => {
        setIsEditing(false);
        // Here you would potentially send the updated team details to your backend.
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setTeam(initialTeam); // Reset the changes.
    };

    const [isInputMode, setIsInputMode] = useState(false); // State to track the switch's state
    const handleStatusChange = (checked) => {
        Modal.confirm({
            title: 'Confirm Status Change',
            content: `Are you sure you want to change the status to ${checked ? 'Active' : 'Inactive'}?`,
            onOk: () => updateStatus(checked),
            onCancel: () => { },
        });
    };

    const updateStatus = (isActive) => {
        // Update your team state here.
        setTeam({ ...team, status: isActive ? 'Active' : 'Inactive' });
    };
    return (
        <Modal
            title="Team Details"
            visible={isVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            width={800}
        >
            <h1>Team Details</h1>
            {!isEditing && <Button type="primary" icon={<EditOutlined />} onClick={handleEdit} style={{ marginBottom: '20px' }}>Edit Information</Button>}
            {isEditing && (
                <>
                    <Button type="primary" icon={<SaveOutlined />} onClick={handleSave} style={{ marginRight: '10px', marginBottom: '20px' }}>Save</Button>
                    <Button type="danger" icon={<CloseOutlined />} onClick={handleCancel} style={{ marginBottom: '20px' }}>Cancel</Button>
                </>
            )}
            <Descriptions bordered layout="vertical">
                <Item label="Project Name">
                    {isEditing ? (
                        <>
                         <Tooltip title="Click to create new Project" > <Switch checked={isInputMode} onChange={setIsInputMode} style={{ marginBottom: '7px' }} /></Tooltip>  
                            {isInputMode ? (
                                <Input
                                    value={team.project_name}
                                    onChange={e => setTeam({ ...team, project_name: e.target.value })}
                                    style={{ width: 200 , marginLeft: 30}}
                                />
                            ) : (
                                <Select
                                    showSearch
                                    value={team.project_name}
                                    onChange={value => setTeam({ ...team, project_name: value })}
                                    style={{ width: 200 , marginLeft: 30}}
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                    notFoundContent="No project found"
                                >
                                    <Option value="Course Management System">Course Management System</Option>
                                    <Option value="Shopping Online (Shope)">Shopping Online (Shope)</Option>
                                    <Option value="Social Media (Facebook)">Social Media (Facebook)</Option>
                                </Select>
                                
                                
                            )}
                        </>
                    ) : <Link to={'../teacher/project-backlog'}>{team.project_name}</Link>}
                </Item>
                <Item label="GitLab URL">
                            {isEditing ? <Input value={team.gitlab_url} onChange={e => setTeam({ ...team, gitlab_url: e.target.value })} /> : <a href={team.gitlab_url} target="_blank" rel="noopener noreferrer">{team.gitlab_url}</a>}
                        </Item>
                        <Item label="Status">
                            {isEditing ? (
                                <>
                                    <Switch
                                        checked={team.status === 'Active'}
                                        onChange={handleStatusChange}
                                        disabled={!isEditing}
                                    />
                                    <span style={{ marginLeft: '10px' }}>{team.status}</span>
                                </>
                            ) : (
                                team.status
                            )}
                        </Item>
                        <Item label="Created At">{team.created_at}</Item>
                        <Item label="Updated At">{team.updated_at}</Item>
            </Descriptions>
        </Modal>
    );
};
