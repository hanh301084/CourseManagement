import React, { useState, useEffect } from 'react';
import { Button, Descriptions, Modal, Select, Switch, Input, Tooltip } from 'antd';
import { EditOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { Link } from "react-router-dom";
import TeamService from "../../../api/TeamAPI";
import formatDate from '../../../utils/dateTimeFormat';
import estimateLocService from '../../../api/EstimateLocAPI';
const { Item } = Descriptions;
const { Option } = Select;

export const TeamDetailsModal = ({ isVisible, handleOk, handleCancel, userIdSelected, selectedClass }) => {
    const [teamEdited, setTeamEdited] = useState(null);
    const [team, setTeam] = useState(null);
    const [initialTeam, setInitialTeam] = useState(null);
    const [technology, setTechnology] = useState([]);
    useEffect(() => {
        estimateLocService.getAllTechnologyActive()
            .then((response) => {
                const technology = response.data;
                setTechnology(technology);

            })
            .catch((error) => {
                console.error('Error fetching estimateLoc data:', error);
            });
    }, []);

    useEffect(() => {
        if (userIdSelected) {
            TeamService.getTeamByStudent(userIdSelected, selectedClass?.classId)
                .then((response) => {
                    const teamData = response.data;
                    setTeam(teamData);
                    setInitialTeam(teamData);
                })
                .catch((error) => {
                    console.error('Error fetching team data:', error);
                });
        }
    }, [userIdSelected, selectedClass?.classId]);

    // Get all project
    const [projects, setProjects] = useState([]);
    useEffect(() => {
        TeamService.getAllProject()
            .then((response) => {
                const projects = response.data;
                setProjects(projects);
            })
            .catch((error) => {
                console.error('Error fetching team data:', error);
            });
    }, []);

    //Get all checklist
    const [checkLists, setCheckList] = useState([]);
    useEffect(() => {
        TeamService.getAllChecklist()
            .then((response) => {
                const checkLists = response.data;
                setCheckList(checkLists);
            })
            .catch((error) => {
                console.error('Error fetching team data:', error);
            });
    }, []);


    const [isEditing, setIsEditing] = useState(false);
    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = () => {
        setIsEditing(false);
        setTeamEdited(team);
    };

    useEffect(() => {
        if (teamEdited) {
            const projectNameToFind = teamEdited?.project?.topicName;
            const checkListToFind = teamEdited?.checkList?.name
            const selectedProject = projects.find(project => project?.topicName === projectNameToFind);
            const selectedChecklist = checkLists.find(checkList => checkList?.name === checkListToFind);
            if (selectedProject || selectedChecklist) {
                const updatedTeam = { ...team };
                updatedTeam.project = selectedProject;
                updatedTeam.checkList = selectedChecklist
                TeamService.updateTeam(updatedTeam)
            } else {
                console.error("Project not found:", projectNameToFind, checkListToFind);
            }
        }
    }, [teamEdited]);

    const handleCancelEdit = () => {
        setIsEditing(false);
        setTeam(initialTeam);
    };

    const handleSwitchChange = (checked) => {
        if (team) {
            const updatedStatus = checked ? 'ACTIVE' : 'INACTIVE';
            const updatedData = {
                ...team,
                status: updatedStatus,
            };
            setTeam(updatedData);
            setTeamEdited(updatedData);
        }
    };

    return (
        <Modal
            visible={isVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            width={1400}
            footer={null}
            style={{ maxHeight: '600px', overflowY: 'auto', padding: '16px 24px' }}
        >
            {team && (
                <>
                    <div style={{ padding: '8px 16px', background: '#fff', borderBottom: '1px solid #f0f0f0' }}>
                        <h1 style={{ textAlign: 'center' }}>{team.teamName} - Team Details</h1>
                        {!isEditing && team.isLocked !== 'YES' && (
                            <Button type="primary" icon={<EditOutlined />} onClick={handleEdit} style={{ marginBottom: '20px' }}>Edit Information</Button>
                        )}
                        {isEditing && (
                            <>
                                <Button type="primary" icon={<SaveOutlined />} onClick={handleSave} style={{ marginRight: '10px', marginBottom: '20px' }}>Save</Button>
                                <Button type="danger" icon={<CloseOutlined />} onClick={handleCancelEdit} style={{ marginBottom: '20px' }}>Cancel</Button>
                            </>
                        )}
                    </div>
                    <Descriptions bordered layout="vertical">
                        <Item label="Project Name">
                            {isEditing ? (
                                <>
                                    <Select
                                        showSearch
                                        value={team?.project?.topicName || ''}
                                        onChange={(value) => {
                                            setTeam({ ...team, project: { ...team.project, topicName: value } });

                                        }}
                                        style={{ width: '100%', }}
                                        optionFilterProp="children"
                                        filterOption={(input, option) =>
                                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                        notFoundContent="No project found"
                                    >
                                        {projects.map((project, index) => (
                                            <Option key={index} value={project.topicName}>
                                                {project.topicName}
                                            </Option>
                                        ))}
                                    </Select>
                                </>

                            ) : (

                                sessionStorage.setItem("semesterId", team.classEntity.semester.semesterId),
                                sessionStorage.setItem("semesterName", team.classEntity.semester.semesterName),
                                sessionStorage.setItem("classId", team.classEntity.classId),
                                sessionStorage.setItem("classCode", team.classEntity.classCode),
                                sessionStorage.setItem("teamId", team.teamId),
                                sessionStorage.setItem("teamName", team.teamName),
                                <Link to={`/teacher/project-backlog`}>
                                    {team?.project?.topicName || ''}

                                </Link>

                            )}
                        </Item>
                        <Item label="Use Checklist">
                            {isEditing ? (
                                <>
                                    <Select
                                        showSearch
                                        value={team?.checkList?.name || ''}
                                        onChange={(value) => {
                                            setTeam({ ...team, checkList: { ...team.checkList, name: value } });
                                        }}
                                        style={{ width: '100%', }}
                                        optionFilterProp="children"
                                        filterOption={(input, option) =>
                                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                        notFoundContent="No checklist found"
                                    >
                                        {checkLists.map((checkList, index) => (
                                            <Option key={index} value={checkList.name}>
                                                {checkList.name}
                                            </Option>
                                        ))}
                                    </Select>
                                </>
                            )
                                : (
                                    <Link to={``}>
                                        {team?.checkList?.name || ''}

                                    </Link>

                                )}
                        </Item>
                        <Item label="Use Technology">
                            {isEditing ? (
                                <Select
                                    showSearch
                                    style={{ width: '100%' }}
                                    placeholder="Select a technology"
                                    optionFilterProp="children"
                                    onChange={(value, option) => {
                                        setTeam({ ...team, technology: { id: option.key, name: option.value } });
                                    }}
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    {technology.map((tech) => (
                                        <Option key={tech.id} value={tech.name}>{tech.name}</Option>
                                    ))}
                                </Select>
                            ) : (
                                <p>
                                    {team?.technology?.name || 'No technology selected'}
                                </p>
                            )}
                        </Item>

                        <Item label="Created At">{formatDate(team.createdAt) || ''}</Item>
                        <Item label="Updated At">{formatDate(team.updatedAt) || ''}</Item>
                        <Item label="Status">
                            <>
                                <Switch
                                    checked={team.status === 'ACTIVE'}
                                    onChange={(checked) => handleSwitchChange(checked)}
                                    checkedChildren={<span>Active</span>}
                                    unCheckedChildren={<span>Inactive</span>}
                                />
                            </>
                        </Item>
                        <Item label="Code And Document Link URL">
                            {isEditing ?
                                <div>
                                    <div style={{ marginBottom: '2px' }}>
                                        <p style={{ margin: 0, padding: 0 }}>Code link url:</p>
                                        <Input
                                            value={team.gitlabUrl || ''}
                                            placeholder="Input your team code link 1 here!"
                                            onChange={(e) => setTeam({ ...team, gitlabUrl: e.target.value })}
                                        />
                                    </div>
                                    <div style={{ marginBottom: '2px' }}>
                                        <Input
                                            value={team.documentUrl1 || ''}
                                            placeholder="Input your team code link 2 here!"
                                            onChange={(e) => setTeam({ ...team, documentUrl1: e.target.value })}
                                        />
                                    </div>
                                    <div style={{ marginBottom: '2px' }}>
                                        <Input
                                            value={team.documentUrl2 || ''}
                                            placeholder="Input your team code link 3 here!"
                                            onChange={(e) => setTeam({ ...team, documentUrl2: e.target.value })}
                                        />
                                    </div>
                                    <div style={{ marginTop: 5, marginBottom: '2px' }}>
                                        <p style={{ margin: 0, padding: 0 }}>Document link url:</p>
                                        <Input
                                            value={team.documentUrl3 || ''}
                                            placeholder="Input Document 1 link here!"
                                            onChange={(e) => setTeam({ ...team, documentUrl3: e.target.value })}
                                        />
                                    </div>
                                    <div style={{ marginBottom: '2px' }}>
                                        <Input
                                            value={team.documentUrl4 || ''}
                                            placeholder="Input Document 2 link here!"
                                            onChange={(e) => setTeam({ ...team, documentUrl4: e.target.value })}
                                        />
                                    </div>
                                    <div style={{ marginBottom: '2px' }}>
                                        <Input
                                            value={team.documentUrl5 || ''}
                                            placeholder="Input Document 3 link here!"
                                            onChange={(e) => setTeam({ ...team, documentUrl5: e.target.value })}
                                        />
                                    </div>
                                </div>

                                :
                                <div>
                                    <div style={{ marginBottom: '10px' }}>
                                        <p style={{ padding: 0, margin: 0 }}> Code Link : </p>
                                        <a style={{ marginBottom: '2px' }} href={team.gitlabUrl || ''} target="_blank" rel="noopener noreferrer">{team.gitlabUrl || ''} </a>
                                    </div>
                                    <div style={{ marginBottom: '10px' }}>
                                        <a style={{ marginBottom: '2px' }} href={team.documentUrl1 || ''} target="_blank" rel="noopener noreferrer">{team.documentUrl1 || ''}</a>
                                    </div>
                                    <a style={{ marginBottom: '2px' }} href={team.documentUrl2 || ''} target="_blank" rel="noopener noreferrer">{team.documentUrl2 || ''}</a>
                                    <div style={{ marginBottom: '10px' }}>
                                        <p style={{ padding: 0, margin: 0 }}> Document Link : </p>
                                        <a style={{ marginBottom: '2px' }} href={team.documentUrl3 || ''} target="_blank" rel="noopener noreferrer">{team.documentUrl3 || ''}</a>
                                    </div>
                                    <div style={{ marginBottom: '10px' }}>
                                        <a style={{ marginBottom: '2px' }} href={team.documentUrl4 || ''} target="_blank" rel="noopener noreferrer">{team.documentUrl4 || ''}</a>
                                    </div>
                                    <div style={{ marginBottom: '10px' }}>
                                        <a href={team.documentUrl5 || ''} target="_blank" rel="noopener noreferrer">{team.documentUrl5 || ''}</a>
                                    </div>
                                </div>
                            }
                        </Item>

                    </Descriptions>

                </>
            )}
        </Modal>
    );
};
