import { Layout, Tabs, Form, InputNumber, Button, Select, Modal, Spin, Input, Breadcrumb, Tooltip, Table, Switch } from 'antd';
import AppHeader from '../../compornent/layout/Header'
import AppFooter from '../../compornent/layout/Footer'
import AppSidebar from '../../compornent/layout/hod/HODSidebar'
import { useEffect, useState } from 'react';
import semesterService from '../../api/SemesterAPI';
import SettingAPI from '../../api/SettingAPI';
import IterationService from '../../../src/api/IterationAPI';
import openNotificationWithIcon from '../../compornent/notifcation';
import FeatureAPI from '../../api/FeatureAPI';
import estimateLocService from '../../api/EstimateLocAPI';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import './style.css'
import { InfoCircleOutlined } from '@ant-design/icons';
const { Option } = Select;
const { Content } = Layout;

const { TabPane } = Tabs;
const Setting = () => {
    const layout = {
        labelCol: {
            span: 8,
        },
        wrapperCol: {
            span: 16,
        },
    };
    const [semesters, setSemesters] = useState([]);
    const [block5Setting, setBlock5Setting] = useState(null);
    const [block10Setting, setBlock10Setting] = useState(null);
    const [selectedSemester, setSelectedSemester] = useState(null);
    const [loading, setLoading] = useState(true);
    const [formEstimate] = Form.useForm();
    const [fuatureList, setFuatureList] = useState([]);
    const [estimateLoc, setEstimateLoc] = useState();
    const [modal, contextHolder] = Modal.useModal();
    const [technology, setTechnology] = useState([]);
    const [functionEstimateLocs, setFunctionEstimateLocs] = useState([]);
    const [technologies, setTechnologies] = useState([]);
    const [isModalTechOpen, setIsModalTechOpen] = useState(false);
    const [isModalFuncOpen, setIsModalFuncOpen] = useState(false);
    const [isTechManagemnt, setIsTechManagemnt] = useState(false);
    const [isFuncManagemnt, setIsFuncManagemnt] = useState(false);
    const [isFuncEs, setIsFuncE] = useState(false);
    const [selectedEsimateLoc, setSelectedEsimateLoc] = useState();
    const [techPagination, setTechPagination] = useState({ current: 1, pageSize: 10 });
    const [funcTypePagination, setFuncTypePagination] = useState({ current: 1, pageSize: 10 });
    const [funcEsPagination, setFuncEsPagination] = useState({ current: 1, pageSize: 10 });

    const handleTechSubmit = (values) => {
        const tech = {
            name: values.technology
        };
        estimateLocService.addTechnology(tech)
            .then(response => {
                openNotificationWithIcon("success", "Technology added successfully");
                setIsModalTechOpen(false);
                formTech.resetFields();
                // Update the technology state
                estimateLocService.getAllTechnology()
                    .then(response => {
                        setTechnology(response.data);
                    })
                    .catch(error => {
                        console.error('Error fetching all technologies:', error);
                    });
                estimateLocService.getAllTechnologyActive()
                    .then(response => {
                        setTechnologies(response.data);
                    })
                    .catch(error => {
                        console.error('Error fetching all technologies:', error);
                    });

            })
            .catch(error => {
                const err = error.response.data.message ? error.response.data.message : "Failed to add technology, please try again!";
                openNotificationWithIcon("error", "Error", err);
            });
    };


    const showModalTech = () => {
        setIsModalTechOpen(true);
        setIsTechManagemnt(false)
    };

    const handleTechCancel = () => {
        setIsModalTechOpen(false);
        setIsTechManagemnt(true)
        formTech.resetFields();
    };
    const showFucnModal = () => {
        setIsModalFuncOpen(true);
        setIsFuncManagemnt(true);
        formFunctionType.resetFields();
    };
    const showTechMangement = () => {
        setIsTechManagemnt(true);
        estimateLocService.getAllTechnology()
            .then(response => {
                setTechnology(response.data);
            })
            .catch(error => {
                console.error('Error fetching all technologies:', error);
            });
    };
    const showEsMangement = () => {
        setIsFuncE(true);
        estimateLocService.getAllFunctionEstimateLoc()
            .then(response => {
                setFunctionEstimateLocs(response.data);
            })
            .catch(error => {
                console.error('Error fetching all technologies:', error);
            });
    };
    const cancelEsMangement = () => {
        setIsFuncE(false);
    };
    const cancelTechMangement = () => {
        setIsTechManagemnt(false);

    };
    const showFuncMangement = () => {
        setIsFuncManagemnt(true);
        estimateLocService.getAllFunctionTypes()
            .then(response => {
                setFunctionType(response.data);
            })
            .catch(error => {
                console.error('Error fetching all function types:', error);
            });
    };
    const cancelFuncMangement = () => {
        setIsFuncManagemnt(false);

    };
    const toggleTechStatus = (techId) => {
        Modal.confirm({
            title: 'Are you sure you want to change the status?',
            onOk: async () => {
                try {
                    const tech = technology.find(t => t.id === techId);
                    if (tech) {
                        const updatedTechDTO = { ...tech, status: tech.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' };
                        const updatedTech = await estimateLocService.toggleTechnologyStatus(updatedTechDTO);
                        openNotificationWithIcon('success', 'Success', 'Status update successfully!')
                        estimateLocService.getAllTechnology()
                            .then(response => {
                                setTechnology(response.data);
                            })
                            .catch(error => {
                                console.error('Error fetching all technologies:', error);
                            });
                        estimateLocService.getAllTechnologyActive()
                            .then(response => {
                                setTechnologies(response.data);
                            })
                            .catch(error => {
                                console.error('Error fetching all technologies:', error);
                            });
                    }
                } catch (error) {
                    const err = error.response.data.message ? error.response.data.message : "Failed to update status, please try again!";
                    openNotificationWithIcon('error', 'ERROR', err)
                }
            }
        });
    };
    const columnsTech = [
        { title: 'No', dataIndex: 'index', key: 'index', render: (text, record, index) => index + 1 },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status, record) => (
                <Switch
                    checked={status === 'ACTIVE'}
                    onChange={() => toggleTechStatus(record.id)}
                />
            ),
        },

    ];
    const toggleFuncStatus = (funcId) => {
        Modal.confirm({
            title: 'Are you sure you want to change the status?',
            onOk: async () => {
                try {
                    // Find the function type by id
                    const func = functionType.find(f => f.id === funcId);
                    if (func) {
                        const updatedFuncDTO = { ...func, status: func.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' };
                        // Call API to update the function type status
                        const updatedFunc = await estimateLocService.toggleFunctionTypeStatus(updatedFuncDTO);
                        // Then update the state
                        openNotificationWithIcon('success', 'Success', 'Status update successfully!')
                        estimateLocService.getAllFunctionTypes()
                            .then(response => {
                                setFunctionType(response.data);
                            })
                            .catch(error => {
                                console.error('Error fetching all function types:', error);
                            });
                        estimateLocService.getAllFunctionTypesActive()
                            .then(response => {
                                setFunctionTypes(response.data);
                            })
                            .catch(error => {
                                console.error('Error fetching all function types:', error);
                            });
                    }
                } catch (error) {
                    const err = error.response.data.message ? error.response.data.message : "Failed to update status, please try again!";
                    openNotificationWithIcon('error', 'ERROR', err)
                }
            }
        });
    };
    const columnsFunc = [
        { title: 'No', dataIndex: 'index', key: 'index', render: (text, record, index) => index + 1 },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status, record) => (
                <Switch
                    checked={status === 'ACTIVE'}
                    onChange={() => toggleFuncStatus(record.id)}
                />
            ),
        },
    ];
    const uniqueTechnologyNames = [...new Set(functionEstimateLocs.map(item => item.technology.name))];
    const uniqueFunctionTypeNames = [...new Set(functionEstimateLocs.map(item => item.functionType.name))];

    const technologyNameFilters = uniqueTechnologyNames.map(name => ({ text: name, value: name }));
    const functionTypeNameFilters = uniqueFunctionTypeNames.map(name => ({ text: name, value: name }));
    const columnsFunctionEs = [
        { title: 'No', dataIndex: 'index', key: 'index', render: (text, record, index) => index + 1 },

        {
            title: 'Technology Name',
            key: 'technologyName',
            render: (text, record) => record.technology.name,
            filters: technologyNameFilters,
            onFilter: (value, record) => record.technology.name === value,
        },
        {
            title: 'Function Type Name',
            key: 'functionTypeName',
            render: (text, record) => record.functionType.name,
            filters: functionTypeNameFilters,
            onFilter: (value, record) => record.functionType.name === value,
        },
        {
            title: 'LOC per Input',
            dataIndex: 'numberOfLocPerInput',
            key: 'numberOfLocPerInput'
        },
        {
            title: 'Status',
            key: 'status',
            render: (record) => record.status === 'LOCKED' ? <span style={{ color: 'red' }}>In Use</span> : <span style={{ color: 'green' }}>Not Use</span>
        },

    ];
    const handleFuncSubmit = (values) => {
        const functionType = {
            name: values.functionType
        };
        estimateLocService.addFunctionType(functionType)
            .then(response => {
                openNotificationWithIcon("success", 'Success', "Function Type added successfully");
                setIsModalFuncOpen(false);
                formFunctionType.resetFields();
                // Update the functionType state
                estimateLocService.getAllFunctionTypes()
                    .then(response => {
                        setFunctionType(response.data);
                    })
                    .catch(error => {
                        console.error('Error fetching all function types:', error);
                    });
                    estimateLocService.getAllFunctionTypesActive()
                    .then(response => {
                        setFunctionTypes(response.data);
                    })
                    .catch(error => {
                        console.error('Error fetching all function types:', error);
                    });

            })
            .catch(error => {
                const err = error.response.data.message ? error.response.data.message : "Failed to add function type, please try again!";
                openNotificationWithIcon("error", "Failed", err);
            });
    };
    const handleFuncCancel = () => {
        setIsModalFuncOpen(false);
    };
    useEffect(() => {
        estimateLocService.getAllTechnologyActive()
            .then((response) => {
                const technology = response.data;
                setTechnologies(technology);

            })
            .catch((error) => {
                console.error('Error fetching estimateLoc data:', error);
            });
    }, []);

    const [functionType, setFunctionType] = useState([]);
    const [functionTypes, setFunctionTypes] = useState([]);

    useEffect(() => {
        estimateLocService.getAllFunctionTypesActive()
            .then((response) => {
                const functionTypeData = response.data;
                setFunctionTypes(functionTypeData);
            })
            .catch((error) => {
                console.error('Error fetching function type data:', error);
            });
    }, []);

    useEffect(() => {
        semesterService.getAllSemesterActive()
            .then((response) => {
                setSemesters(response.data);
                if (response.data.length > 0) {
                    setSelectedSemester(response.data[response.data.length - 1].semesterId);
                }
                setLoading(false);
            })
            .catch((error) => {

                setLoading(false);
            });
        FeatureAPI.getFeaturesByPage(0, 100)
            .then((response) => {
                setFuatureList(response.data.content);
            })
            .catch((error) => { console.error(error); });
    }, []);

    useEffect(() => {
        if (estimateLoc?.language !== undefined && estimateLoc?.functionType !== undefined) {
            estimateLocService.findNumberOfLocInputByLanguageAndFunction(estimateLoc.language, estimateLoc.functionType)
                .then(response => {
                    const data = response.data;
                    setSelectedEsimateLoc(data)
                    formEstimate.setFieldsValue({
                        numberOfLocInput: data.numberOfLocPerInput != null ? data.numberOfLocPerInput : 0,
                        status: data.status != null ? data.status : 'NOT LOCK'
                    });
                })
                .catch(error => formEstimate.setFieldsValue({
                    numberOfLocInput: 0
                }));
        }
    }, [estimateLoc, estimateLoc]);
    const handleSemesterChange = (semesterId) => {
        setSelectedSemester(semesterId);
        SettingAPI.getClassBlock5Setting(semesterId)
            .then(response => {
                setBlock5Setting(response.data);
                setLoading(false)
            })
            .catch(error => {

            });

        SettingAPI.getClassBlock10Setting(semesterId)

            .then(response => {
                setBlock10Setting(response.data);

            })
            .catch(error => {
                console.error('Error fetching block 10 setting:', error);
            });
    };
    const [form] = Form.useForm();
    const [formFunctionType] = Form.useForm();
    const [formTech] = Form.useForm();
    useEffect(() => {
        if (block10Setting) {
            form.setFieldsValue({
                block10Setting: {
                    settingValue: block10Setting.settingValue,
                },

            });
        }
        if (block5Setting) {
            form.setFieldsValue({
                block5Setting: {
                    settingValue: block5Setting.settingValue,
                },
            });
        }
    }, [block10Setting, block5Setting, form]);
    const validateMessages = {
        required: '${label} is required!',
        types: {
            email: '${label} is not a valid email!',
            number: '${label} is not a valid number!',
        },
        number: {
            range: '${label} must be between ${min} and ${max}',
        },
    };
    const onFinish = (values) => {
        const block5SettingDTO = {
            settingValue: values.block5Setting.settingValue,
        };

        const block10SettingDTO = {
            settingValue: values.block10Setting.settingValue,
        };

        SettingAPI.updateClassSettings(block5SettingDTO, block10SettingDTO, selectedSemester)
            .then(response => {
                openNotificationWithIcon('success', 'Update Successful', response.data);
            })
            .catch(error => {
                openNotificationWithIcon('error', 'Update Faild!', error.response.data);
            });
    };

    //---------------------------------------------------------------------------------------------------
    //Iteration Evaluation
    //Select semester Iter evaluation

    const [semesterSelected, setSemesterSelected] = useState(null);
    const [apiDataLoaded, setApiDataLoaded] = useState(false);
    const [selectedClassType, setSelectedClassType] = useState();
    const handleEvalSemesterChange = (semesterId) => {
        setSemesterSelected(semesterId);
        setSelectedClassType(null);
        setApiDataLoaded(false);
    };
    //Select class type Iter Evaluation
    const handleClassTypeChange = (value) => {
        setSelectedClassType(value);
        setApiDataLoaded(false);
    }
    const [formIterEval] = Form.useForm();
    useEffect(() => {
        // Reset the form when the selectedSemester changes
        formIterEval.setFieldsValue({
            'block': undefined, // Reset or set to initial value
            'iter': null,  // Reset or set to initial value
        });
    }, [semesterSelected, formIterEval]);
    //getIteration List Iteration Evaluation
    const [iterationList, setIterationList] = useState([]);
    useEffect(() => {
        if (semesterSelected !== null && selectedClassType !== null) {
            IterationService.getAllIterationActive(semesterSelected, selectedClassType)
                .then((response) => {
                    setIterationList(response.data);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error('Error fetching active semesters:', error);
                    setLoading(false);
                });
        }
    }, [semesterSelected, selectedClassType]);
    //getEvaluationCriteria In Iteration Evaluation
    const [evaluationCriteriaList, setEvaluationCriteriaList] = useState([]);
    useEffect(() => {
        if (semesterSelected !== null && selectedClassType !== null && !apiDataLoaded) {
            SettingAPI.getEvuationCriteria(semesterSelected, selectedClassType)
                .then((response) => {
                    setEvaluationCriteriaList(response.data);
                    setApiDataLoaded(true);
                })
                .catch((error) => {
                    console.error('Error fetching Iterations:', error);
                });
        }
    }, [semesterSelected, selectedClassType, apiDataLoaded]);
    //Set Value to Iteration evaluation form.
    useEffect(() => {
        if (evaluationCriteriaList) {
            const updatedWeights = {};
            iterationList.forEach((iteration) => {
                const weight = evaluationCriteriaList.find((criteria) => criteria.iteration.iterationId === iteration.iterationId)?.evaluationWeight ?? 0;
                updatedWeights[`iterationWeights[${iteration.iterationId}]`] = weight;
            });
            formIterEval.setFieldsValue(updatedWeights);

            const finalWeight = evaluationCriteriaList[0]?.finalWeight;
            formIterEval.setFieldsValue({
                finalWeight,
            });
        }
    }, [evaluationCriteriaList, iterationList, formIterEval, selectedClassType]);
    // Update Iteration evaluation criteria
    const onFinishIterEval = () => {
        const formValues = formIterEval.getFieldsValue();
        const updatedCriteriaList = [...evaluationCriteriaList];
        const firstCriteria = evaluationCriteriaList[0];
        let totalWeight = 0;

        // Calculate total weight excluding finalWeight
        Object.keys(formValues).forEach((key) => {
            if (key.startsWith('iterationWeights')) {
                totalWeight += formValues[key];
            }
        });

        // Add finalWeight to total weight
        totalWeight += formValues.finalWeight;

        Object.keys(formValues).forEach((key) => {
            if (key.startsWith('iterationWeights')) {
                const iterationId = parseInt(key.match(/\d+/)[0]);
                const criteria = updatedCriteriaList.find((criteria) => criteria.iteration.iterationId === iterationId);
                const foundSemester = semesters.find((semester) => semester.semesterId === semesterSelected);
                const foundIteration = iterationList.find((iteration) => iteration.iterationId === iterationId);
                if (criteria) {
                    criteria.evaluationWeight = formValues[key];
                    criteria.finalWeight = formValues["finalWeight"];
                } else {
                    const newIterationCriteria = {
                        semester: foundSemester,
                        iteration: foundIteration,
                        classType: selectedClassType,
                        evaluationWeight: formValues[key],
                        finalWeight: formValues[key],
                        projectImplementation: firstCriteria?.projectImplementation,
                        finalSRSWeight: firstCriteria?.finalSRSWeight,
                        finalSDSWeight: firstCriteria?.finalSDSWeight,
                        teamWorkingWeight: firstCriteria?.finalSDSWeight,
                        finalMaxLoc: firstCriteria?.finalMaxLoc,
                        status: firstCriteria?.status,
                        description: firstCriteria?.description,
                        ongoingSRSWeight: 0,
                        ongoingSDSWeight: 0,
                        ongoingCodingWeight: 0,
                        maxLoc: 0
                    };
                    updatedCriteriaList.push(newIterationCriteria);
                }
            }
        });
        if (totalWeight !== 100) {
            openNotificationWithIcon('error', 'Update Total weight must equal 100!');
            return;
        }
        setEvaluationCriteriaList(updatedCriteriaList);
        SettingAPI.updateEvaluationCriteria(updatedCriteriaList)
            .then((response) => {
                openNotificationWithIcon('success', 'Update Successful', response.data);
            })
            .catch((error) => {
                openNotificationWithIcon('error', 'Update Failed!', error.response.data);
            });
    };

    //---------------------------------------------------------------------------------------------------
    //Ongoing Evaluation
    //Select semester ongoing 
    const [formOngoing] = Form.useForm();

    const [semesterSelectedOngoing, setSemesterSelectedOngoing] = useState(null);

    const [apiDataLoadedEachIter, setApiDataLoadedEachIter] = useState(false);
    const [evaluationCriteriaEachIter, setEvaluationCriterEachIter] = useState();
    const [selectedClassTypeEachIter, setSelectedClassTypeEachIter] = useState();
    useEffect(() => {
        // Reset the form when the selectedSemester changes
        formOngoing.setFieldsValue({
            'block': undefined, // Reset or set to initial value
            'iter': undefined,  // Reset or set to initial value
            'maxLoc': undefined,
            'ongoingSRSWeight': undefined,
            'ongoingCodingWeight': undefined,
            'ongoingSDSWeight': undefined
        });
    }, [semesterSelectedOngoing, formOngoing]);
    useEffect(() => {
        // Reset the form when the selectedSemester changes
        formOngoing.setFieldsValue({

            'iter': null,  // Reset or set to initial value
            'maxLoc': undefined,
            'ongoingSRSWeight': undefined,
            'ongoingCodingWeight': undefined,
            'ongoingSDSWeight': undefined
        });
    }, [selectedClassTypeEachIter, formOngoing]);
    //Change semester in Ongoing Evaluation
    const handleOngingSemesterChange = (semesterId) => {
        setSemesterSelectedOngoing(semesterId);
        setSelectedClassTypeEachIter(null);
        setApiDataLoadedEachIter(false);
    };
    //Change class type in Ongoing Evaluation
    const handleClassTypeChangeEachIter = (value) => {
        setSelectedClassTypeEachIter(value);
        setEvaluationCriterEachIter(null)
        setApiDataLoadedEachIter(false);
    }
    //Change Iteration in Ongoing Evaluation
    const handleChangeIterationOngoing = (value) => {
        setEvaluationCriterEachIter(value);
        setApiDataLoadedEachIter(false);
    }
    //getIteration List OngoingEvaluation
    const [iterationListOngoing, setIterationListOngoing] = useState([]);
    useEffect(() => {
        if (semesterSelectedOngoing !== null && selectedClassTypeEachIter !== null) {
            IterationService.getAllIterationActive(semesterSelectedOngoing, selectedClassTypeEachIter)
                .then((response) => {
                    setIterationListOngoing(response.data);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error('Error fetching active semesters:', error);
                    setLoading(false);
                });
        }
    }, [semesterSelectedOngoing, selectedClassTypeEachIter]);
    //getEvaluationCriteria By Each Iteration in Ongoing
    const [eachEvaluationCriteria, setEachEvaluationCriteria] = useState();
    useEffect(() => {
        if (semesterSelectedOngoing !== null && selectedClassTypeEachIter !== null && evaluationCriteriaEachIter !== null && !apiDataLoadedEachIter) {
            SettingAPI.getEvuationCriteriaEachIter(semesterSelectedOngoing, selectedClassTypeEachIter, evaluationCriteriaEachIter)
                .then((response) => {
                    setEachEvaluationCriteria(response.data);

                    setApiDataLoadedEachIter(true);
                })
                .catch((error) => {
                    console.error('Error fetching Iterations:', error);
                });
        }
    }, [semesterSelectedOngoing, selectedClassTypeEachIter, evaluationCriteriaEachIter, apiDataLoadedEachIter]);
    //Set vaule to Final form
    useEffect(() => {
        if (eachEvaluationCriteria) {
            const ongoingSRSWeight = eachEvaluationCriteria?.ongoingSRSWeight || 0;
            const ongoingSDSWeight = eachEvaluationCriteria?.ongoingSDSWeight || 0;
            const ongoingCodingWeight = eachEvaluationCriteria?.ongoingCodingWeight || 0;
            const maxLoc = eachEvaluationCriteria.maxLoc || 0;
            formOngoing.setFieldsValue({
                ongoingSRSWeight: ongoingSRSWeight,
                ongoingSDSWeight: ongoingSDSWeight,
                ongoingCodingWeight: ongoingCodingWeight,
                maxLoc: maxLoc
            });
        }
    }, [eachEvaluationCriteria, formOngoing]);

    //Update Ongoing evaluation criteria
    const onFinishOngoing = () => {
        const formValue = formOngoing.getFieldsValue();
        const foundSemester = semesters.find((semester) => semester.semesterId === semesterSelectedOngoing);
        const foundIteration = iterationListOngoing.find(
            (iteration) => iteration.iterationId === parseInt(evaluationCriteriaEachIter)
        );
        const eachEvaluationCriteria = {
            semester: foundSemester,
            classType: selectedClassTypeEachIter,
            iteration: foundIteration,
            ongoingSRSWeight: formValue?.ongoingSRSWeight,
            ongoingSDSWeight: formValue?.ongoingSDSWeight,
            ongoingCodingWeight: formValue?.ongoingCodingWeight,
            maxLoc: formValue.maxLoc,

        };
        const totalWeight = eachEvaluationCriteria?.ongoingSRSWeight +
            eachEvaluationCriteria?.ongoingSDSWeight +
            eachEvaluationCriteria?.ongoingCodingWeight;

        if (totalWeight !== 100) {
            openNotificationWithIcon('error', 'Update Total weight must equal 100!');
            return;
        }

        SettingAPI.updateEvaluationCriteriaOne(eachEvaluationCriteria)
            .then(response => {
                openNotificationWithIcon('success', 'Update Successful', response.data);
            })
            .catch(error => {
                openNotificationWithIcon('error', 'Update Failed!', error.response.data);
            });
    };
    //--------------------------------------------------------------------------
    //Presentation Evaluation
    const [formPresentarion] = Form.useForm();
    const [semesterSelectedFinal, setSemesterSelectedFinal] = useState(null);
    useEffect(() => {
        // formPresentarion.resetFields();
        // Reset the form when the selectedSemester changes
        formPresentarion.setFieldsValue({
            'projectIntroduction': undefined, // Reset or set to initial value
            'projectImplementation': undefined,  // Reset or set to initial value
            'finalMaxLoc': undefined,
            'qandA': undefined,
            'teamWorkingWeight': undefined,
            'finalSDSWeight': undefined,
            'finalSRSWeight': undefined
        });
    }, [semesterSelectedFinal, formPresentarion]);

    const [apiDataLoadedFinal, setApiDataLoadedFinal] = useState(false);

    const handleFinalSemesterChange = (semesterId) => {
        setSemesterSelectedFinal(semesterId);
        setSelectedClassType(null);
        setApiDataLoadedFinal(false);
    };

    const [finalEvaluationCriteria, setFinalEvaluationCriteria] = useState([]);
    // Get Presetntation Criteria
    useEffect(() => {
        if (semesterSelectedFinal !== null && !apiDataLoadedFinal) {
            SettingAPI.getEvuationCriteriaFinal(semesterSelectedFinal)
                .then((response) => {
                    setFinalEvaluationCriteria(response.data);
                    setApiDataLoadedFinal(true);
                })
                .catch((error) => {
                    console.error('Error fetching Iterations:', error);
                });
        }
    }, [semesterSelectedFinal, apiDataLoadedFinal]);
    //Set value to Presentation criteria 
    useEffect(() => {
        if (finalEvaluationCriteria && finalEvaluationCriteria.length > 0) {
            const dataFinal = finalEvaluationCriteria[0]
            const projectIntroduction = dataFinal?.projectIntroduction;
            const projectImplementation = dataFinal?.projectImplementation;
            const finalSRSWeight = dataFinal?.finalSRSWeight;
            const finalSDSWeight = dataFinal?.finalSDSWeight;
            const teamWorkingWeight = dataFinal?.teamWorkingWeight;
            const qandA = dataFinal?.qandA;
            const finalMaxLoc = dataFinal?.finalMaxLoc;
            formPresentarion.setFieldsValue({
                projectIntroduction: projectIntroduction,
                projectImplementation: projectImplementation,
                finalSRSWeight: finalSRSWeight,
                finalSDSWeight: finalSDSWeight,
                qandA: qandA,
                teamWorkingWeight: teamWorkingWeight,
                finalMaxLoc: finalMaxLoc
            });
        }
    }, [finalEvaluationCriteria, formPresentarion]);

    //Update Prentation Evaluation criteria
    const onFinishFinal = () => {
        const formValues = formPresentarion.getFieldsValue();
        const projectIntroduction = parseInt(formValues?.projectIntroduction);
        const projectImplementation = parseInt(formValues?.projectImplementation);
        const finalSRSWeight = parseInt(formValues?.finalSRSWeight);
        const finalSDSWeight = parseInt(formValues?.finalSDSWeight);
        const qandA = parseInt(formValues?.qandA);
        const teamWorkingWeight = parseInt(formValues?.teamWorkingWeight);

        const totalWeight = projectImplementation + projectIntroduction + finalSRSWeight + finalSDSWeight + qandA + teamWorkingWeight;
        const updatedCriteriaList = [...finalEvaluationCriteria];
        updatedCriteriaList.forEach((criteria) => {
            criteria.projectIntroduction = formValues.projectIntroduction;
            criteria.projectImplementation = formValues.projectImplementation;
            criteria.finalSRSWeight = formValues?.finalSRSWeight;
            criteria.finalSDSWeight = formValues?.finalSDSWeight;
            criteria.qandA = formValues?.qandA;
            criteria.teamWorkingWeight = formValues?.teamWorkingWeight;
            criteria.finalMaxLoc = formValues?.finalMaxLoc;
        });
        if (totalWeight !== 100) {
            openNotificationWithIcon('error', 'Update Total weight must equal 100!');
            return;
        }
        setFinalEvaluationCriteria(updatedCriteriaList);
        SettingAPI.updateEvaluationCriteriaFinal(finalEvaluationCriteria)
            .then((response) => {
                openNotificationWithIcon('success', 'Update Successful', response.data);
            })
            .catch((error) => {
                openNotificationWithIcon('error', 'Update Faild!', error.response.data);
            });
    };

    //Final Evaluation
    const [formFinal] = Form.useForm();
    const [semesterSelectedFinal2, setSemesterSelectedFinal2] = useState(null);
    const [apiDataLoadedFinal2, setApiDataLoadedFinal2] = useState(false);

    const handleFinalSemesterChange2 = (semesterId) => {
        setSemesterSelectedFinal2(semesterId);
        setSelectedClassType(null);
        setApiDataLoadedFinal2(false);
    };

    const [finalEvaluationCriteria2, setFinalEvaluationCriteria2] = useState();
    // Get Final Criteria
    useEffect(() => {
        if (semesterSelectedFinal2 !== null && !apiDataLoadedFinal2) {
            SettingAPI.getEvuationCriteriaFinal2(semesterSelectedFinal2)
                .then((response) => {
                    setFinalEvaluationCriteria2(response.data);
                    setApiDataLoadedFinal2(true);
                })
                .catch((error) => {
                    console.error('Error fetching Iterations:', error);
                });
        }
    }, [semesterSelectedFinal2, apiDataLoadedFinal2]);
    //Set value to Final 
    useEffect(() => {
        if (finalEvaluationCriteria2 && finalEvaluationCriteria2.length > 0) {
            const dataFinal2 = finalEvaluationCriteria2[0]
            const totalOngoingWeight = dataFinal2?.totalOngoingWeight;
            const finalWeight = dataFinal2?.finalWeight;

            formFinal.setFieldsValue({
                totalOngoingWeight: totalOngoingWeight,
                finalWeight: finalWeight,
            });
        }
    }, [finalEvaluationCriteria2, formFinal]);

    //Update Final Evaluation criteria
    const onFinishFinal2 = () => {
        ;
        const formValues = formFinal.getFieldsValue();
        const totalOngoingWeight = parseInt(formValues?.totalOngoingWeight);
        const finalWeight = parseInt(formValues?.finalWeight);

        const totalWeight = totalOngoingWeight + finalWeight;
        const updatedCriteriaList = [...finalEvaluationCriteria2];
        updatedCriteriaList.forEach((criteria) => {
            criteria.totalOngoingWeight = formValues.totalOngoingWeight;
            criteria.finalWeight = formValues?.finalWeight;
        });
        if (totalWeight !== 100) {
            openNotificationWithIcon('error', 'Update Total weight must equal 100!');
            return;
        }
        setFinalEvaluationCriteria2(updatedCriteriaList);
        SettingAPI.updateEvaluationCriteriaFinal2(finalEvaluationCriteria2)
            .then((response) => {
                openNotificationWithIcon('success', 'Update Successful', response.data);
            })
            .catch((error) => {
                openNotificationWithIcon('error', 'Update Faild!', error.response.data);
            });
    };

    const confirm = {
        title: 'Add Estimate Loc!',
        content: (
            <p>Are you sure you want to estimate?</p>
        ),
        onOk: () => {
            onFinishEstimateLoc()
        },
    };


    const onFinishEstimateLoc = () => {
        formEstimate.validateFields()
            .then((values) => {
                const selectedFunctionType = functionTypes.find(ft => ft.id === values.functionType);
                const selectedLanguage = technologies.find(t => t.id === values.language);
                const estimateLocData = {
                    functionType: selectedFunctionType,
                    technology: selectedLanguage,
                    numberOfLocPerInput: values.numberOfLocInput
                };

                estimateLocService.addEstimateLoc(estimateLocData)
                    .then(response => {
                        openNotificationWithIcon("success", "Estimate LOC update successfully");
                        formEstimate.resetFields();
                    })
                    .catch(error => {
                        openNotificationWithIcon("error", "Failed to add Estimate LOC", error.message);
                    });
            })
            .catch(errorInfo => {
                console.error('Validate Failed:', errorInfo);
            });
    };


    if (loading) {
        return (
            <div className="loading-container">
                <Spin size="large" />
            </div>
        );
    }
    return (
        <Layout style={{ minHeight: '100vh' }}>

            <AppSidebar />
            <Layout>
                <AppHeader />
                <Helmet>
                    <title>System Configuration</title>
                </Helmet>
                <Breadcrumb
                    items={[
                        {
                            title: <Link to='..//hod/dashboard'>Home</Link>
                        },
                        {
                            title: <div>System Configuration
                                <Tooltip title="You should add all setting befor senester start">
                                    <Button style={{ marginLeft: 10 }} type="primary" ghost danger shape="circle" icon={< InfoCircleOutlined />} />
                                </Tooltip>
                            </div>,
                        },
                    ]}
                    style={{
                        marginLeft: 140, marginTop: 20
                    }}
                >

                </Breadcrumb>
                <Content style={{ padding: '0px 140px', marginTop: 20 }}>
                    <div>
                        <Tabs defaultActiveKey="1" >

                            <TabPane tab={<strong>Class Setting</strong>} key="1">

                                <Form form={form}
                                    className="custom-form"
                                    key={selectedSemester}
                                    {...layout}
                                    name="nest-messages"
                                    onFinish={onFinish}
                                    style={{ maxWidth: 600, }}
                                    validateMessages={validateMessages}
                                    initialValues={{ semester: { semesterId: selectedSemester } }}

                                >
                                    <Form.Item
                                        name={['semester', 'semesterId']}
                                        label="Semester"
                                        rules={[{ required: true }]}
                                    >
                                        <Select
                                            showSearch
                                            placeholder="Select semester"
                                            optionFilterProp="children"
                                            onChange={handleSemesterChange}
                                            filterOption={(input, option) =>
                                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            }
                                            value={selectedSemester}
                                        >
                                            {semesters.map((semester) => (
                                                <Option key={semester.semesterId} value={semester.semesterId}>
                                                    {semester.semesterName}
                                                </Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                    <Form.Item
                                        name={['block10Setting', 'settingValue']}
                                        label="Block 10 Iteration quantity"
                                        rules={[
                                            {
                                                required: true,
                                            },
                                        ]}
                                    >
                                        <Select value={block10Setting ? block10Setting.settingValue : undefined}>
                                            <Option value="1">1</Option>
                                            <Option value="2">2</Option>
                                            <Option value="3">3</Option>
                                            <Option value="4">4</Option>
                                            <Option value="5">5</Option>
                                            <Option value="6">6</Option>
                                        </Select>
                                    </Form.Item>
                                    <Form.Item
                                        name={['block5Setting', 'settingValue']}
                                        label="Block 5 Iteration quantity"
                                        rules={[
                                            {
                                                required: true,
                                            },
                                        ]}
                                    >
                                        <Select value={block5Setting ? block5Setting.settingValue : undefined}>
                                            <Option value="1">1</Option>
                                            <Option value="2">2</Option>
                                            <Option value="3">3</Option>
                                            <Option value="4">4</Option>
                                            <Option value="5">5</Option>
                                            <Option value="6">6</Option>
                                        </Select>
                                    </Form.Item>
                                    {(block5Setting === null || block5Setting.status !== 'LOCKED') &&
                                        (block10Setting === null || block10Setting.status !== 'LOCKED') ? (

                                        <Form.Item
                                            wrapperCol={{
                                                ...layout.wrapperCol,
                                                offset: 8,
                                            }}
                                        >
                                            <Button type="primary" ghost htmlType="submit">
                                                Save
                                            </Button>
                                        </Form.Item>
                                    ) : (

                                        <Form.Item
                                            wrapperCol={{
                                                ...layout.wrapperCol,
                                                offset: 8,
                                            }}
                                        >
                                            <span style={{ color: 'red' }}>You can't edit this setting now because have classes are using this setting.</span>
                                        </Form.Item>
                                    )}
                                </Form>
                            </TabPane>

                            <TabPane tab={<strong>Iteration Setting</strong>} key="3">
                                <Form
                                    className="custom-form"
                                    form={formIterEval}
                                    {...layout}
                                    name="nest-messages"
                                    onFinish={onFinishIterEval}
                                    style={{
                                        maxWidth: 600,
                                    }}
                                >
                                    <Form.Item
                                        name={['semester', 'semesterId']}
                                        label="Semester"
                                        rules={[{ required: true }]}
                                    >
                                        <Select
                                            showSearch
                                            placeholder="Select semester"
                                            optionFilterProp="children"
                                            onChange={handleEvalSemesterChange}
                                            filterOption={(input, option) =>
                                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            }
                                            value={selectedSemester}
                                        >
                                            {semesters.map((semester) => (
                                                <Option key={semester.semesterId} value={semester.semesterId}>
                                                    {semester.semesterName}
                                                </Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                    <Form.Item
                                        name={['block', 'settingValue']}
                                        label="Class type"
                                        rules={[
                                            {
                                                required: true,
                                            },
                                        ]}
                                    >
                                        <Select
                                            ivalue={selectedClassType}
                                            onChange={handleClassTypeChange}
                                            placeholder="Select class type"
                                        >
                                            <Option value="ITERATION_BLOCK10">Block 10</Option>
                                            <Option value="ITERATION_BLOCK5">Block 5</Option>
                                        </Select>
                                    </Form.Item>
                                    {evaluationCriteriaList !== null && iterationList.map((iteration) => {
                                        const weight = evaluationCriteriaList.find(criteria => criteria.iteration.iterationId === iteration.iterationId)?.evaluationWeight ?? 0;
                                        return (
                                            <Form.Item
                                                name={`iterationWeights[${iteration.iterationId}]`}
                                                key={iteration.iterationId}
                                                label={`${iteration.iterationName} (%)`}
                                                rules={[{ type: 'number', min: 0, max: 99 }]}

                                            >
                                                <InputNumber style={{ width: '100%' }} value={weight}

                                                />
                                            </Form.Item>
                                        );
                                    })}
                                    {selectedClassType && (
                                        <Form.Item
                                            name={"finalWeight"}
                                            label="Final Presentation(%)"
                                            rules={[
                                                {
                                                    type: 'number',
                                                    min: 0,
                                                    max: 99,
                                                },
                                            ]}
                                        >
                                            <InputNumber style={{ width: '100%' }} />
                                        </Form.Item>
                                    )}

                                    {selectedClassType && evaluationCriteriaList.some(criteria => criteria.classType === selectedClassType && criteria.status === 'LOCKED') ? (
                                        <Form.Item
                                            wrapperCol={{ ...layout.wrapperCol, offset: 8 }}
                                        >
                                            <span style={{ color: 'red' }}>You can't edit this setting now because have some  classes are using this setting.</span>
                                        </Form.Item>
                                    ) : (
                                        <Form.Item
                                            wrapperCol={{ ...layout.wrapperCol, offset: 8 }}
                                        >
                                            <Button type="primary" ghost htmlType="submit">
                                                Save
                                            </Button>
                                        </Form.Item>
                                    )}
                                </Form>
                            </TabPane>

                            <TabPane tab={<strong>Package Setting</strong>} key="2">
                                <Tabs defaultActiveKey="2.1">
                                    <TabPane tab={<strong>On going Criteria</strong>} key="2.1">
                                        <Form
                                            className="custom-form"
                                            form={formOngoing}
                                            key={selectedSemester}
                                            {...layout}
                                            name="nest-messages"
                                            onFinish={onFinishOngoing}
                                            style={{
                                                maxWidth: 600,
                                            }}
                                        >
                                            <Form.Item
                                                name={['semester', 'semesterId']}
                                                label="Semester"
                                                rules={[{ required: true }]}
                                            >
                                                <Select
                                                    showSearch
                                                    placeholder="Select semester"
                                                    optionFilterProp="children"
                                                    onChange={handleOngingSemesterChange}
                                                    filterOption={(input, option) =>
                                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                    }
                                                    value={selectedSemester}
                                                >
                                                    {semesters.map((semester) => (
                                                        <Option key={semester.semesterId} value={semester.semesterId}>
                                                            {semester.semesterName}
                                                        </Option>
                                                    ))}
                                                </Select>
                                            </Form.Item>
                                            <Form.Item
                                                name={['block', 'settingValue']}
                                                label="Class Type"
                                                rules={[
                                                    {
                                                        required: true,
                                                    },
                                                ]}
                                            >
                                                <Select
                                                    ivalue={selectedClassType}
                                                    onChange={handleClassTypeChangeEachIter}
                                                    placeholder="Select class type"
                                                >
                                                    <Option value="ITERATION_BLOCK10">Block 10</Option>
                                                    <Option value="ITERATION_BLOCK5">Block 5</Option>
                                                </Select>
                                            </Form.Item>

                                            <Form.Item
                                                name={['iter', 'settingValue']}
                                                label="Iteration"
                                                rules={[
                                                    {
                                                        required: true,
                                                    },
                                                ]}
                                            >
                                                <Select
                                                    value={evaluationCriteriaEachIter}
                                                    onChange={handleChangeIterationOngoing}
                                                >
                                                    {iterationListOngoing && iterationListOngoing.map((iteration) => (
                                                        <Option key={iteration.iterationId}
                                                            value={iteration.iterationId.toString()}>
                                                            {iteration.iterationName}
                                                        </Option>
                                                    ))}
                                                </Select>

                                            </Form.Item>

                                            <Form.Item
                                                name={"ongoingSRSWeight"}
                                                label="SRS(%)"
                                                rules={[
                                                    {
                                                        type: 'number',
                                                        min: 0,
                                                        max: 100,
                                                    },
                                                ]}

                                            >
                                                <InputNumber style={{ width: '100%' }} />
                                            </Form.Item>
                                            <Form.Item
                                                name={"ongoingSDSWeight"}
                                                label="SDS(%)"
                                                rules={[
                                                    {
                                                        type: 'number',
                                                        min: 0,
                                                        max: 100,
                                                    },
                                                ]}
                                            >
                                                <InputNumber style={{ width: '100%' }} />
                                            </Form.Item>
                                            <Form.Item
                                                name={"ongoingCodingWeight"}
                                                label="Coding(%)"
                                                rules={[
                                                    {
                                                        type: 'number',
                                                        min: 0,
                                                        max: 100,
                                                    },
                                                ]}

                                            >
                                                <InputNumber style={{ width: '100%' }} />
                                            </Form.Item>
                                            <Form.Item
                                                name={"maxLoc"}
                                                label="Max LOC"
                                                rules={[
                                                    {
                                                        type: 'number',
                                                        min: 0,
                                                        max: 1000,
                                                    },
                                                ]}

                                            >
                                                <InputNumber style={{ width: '100%' }} />
                                            </Form.Item>

                                            {eachEvaluationCriteria && eachEvaluationCriteria.status === 'LOCKED' || eachEvaluationCriteria && eachEvaluationCriteria.status !== null ? (
                                                <Form.Item
                                                    wrapperCol={{ ...layout.wrapperCol, offset: 8 }}
                                                >
                                                    {console.log(eachEvaluationCriteria.status)}
                                                    <span style={{ color: 'red' }}>You can't edit this setting now because have some classes are using this setting.</span>
                                                </Form.Item>
                                            ) : (
                                                <Form.Item
                                                    wrapperCol={{ ...layout.wrapperCol, offset: 8 }}
                                                >
                                                    <Button type="primary" ghost htmlType="submit">
                                                        Save
                                                    </Button>
                                                </Form.Item>
                                            )}
                                        </Form>
                                    </TabPane>
                                    <TabPane tab={<strong>Presentation Criteria </strong>} key="2.2">
                                        <Form
                                            className="custom-form"
                                            form={formPresentarion}
                                            key={semesterSelected}
                                            {...layout}
                                            name="nest-messages"
                                            onFinish={onFinishFinal}
                                            style={{
                                                maxWidth: 600,
                                            }}
                                        >
                                            <Form.Item
                                                name={['semester', 'semesterId']}
                                                label="Semester"
                                                rules={[{ required: true }]}
                                            >
                                                <Select
                                                    showSearch
                                                    placeholder="Select semester"
                                                    optionFilterProp="children"
                                                    onChange={handleFinalSemesterChange}
                                                    filterOption={(input, option) =>
                                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                    }
                                                    value={semesterSelected}
                                                >
                                                    {semesters.map((semester) => (
                                                        <Option key={semester.semesterId} value={semester.semesterId}>
                                                            {semester.semesterName}
                                                        </Option>
                                                    ))}
                                                </Select>
                                            </Form.Item>
                                            <Form.Item
                                                name={"projectIntroduction"}
                                                label="Project Introduction(%)"
                                                rules={[
                                                    {
                                                        type: 'number',
                                                        min: 0,
                                                        max: 99,
                                                    },
                                                ]}
                                            >
                                                <InputNumber style={{ width: '100%' }} />
                                            </Form.Item>
                                            <Form.Item
                                                name={"projectImplementation"}
                                                label="Project Implimentation(%)"
                                                rules={[
                                                    {
                                                        type: 'number',
                                                        min: 0,
                                                        max: 99,
                                                    },
                                                ]}
                                            >
                                                <InputNumber style={{ width: '100%' }} />
                                            </Form.Item>
                                            <Form.Item
                                                name={"finalSRSWeight"}
                                                label="Software Requirement (SRS%)"
                                                rules={[
                                                    {
                                                        type: 'number',
                                                        min: 0,
                                                        max: 99,
                                                    },
                                                ]}
                                            >
                                                <InputNumber style={{ width: '100%' }} />
                                            </Form.Item>
                                            <Form.Item
                                                name={"finalSDSWeight"}
                                                label="Software Design (SDS%)"
                                                rules={[
                                                    {
                                                        type: 'number',
                                                        min: 0,
                                                        max: 99,
                                                    },
                                                ]}
                                            >
                                                <InputNumber style={{ width: '100%' }} />
                                            </Form.Item>
                                            <Form.Item
                                                name={"teamWorkingWeight"}
                                                label="Team Working(%)"
                                                rules={[
                                                    {
                                                        type: 'number',
                                                        min: 0,
                                                        max: 99,
                                                    },
                                                ]}
                                            >
                                                <InputNumber style={{ width: '100%' }} />
                                            </Form.Item>
                                            <Form.Item
                                                name={"qandA"}
                                                label="Q&A(%)"
                                                rules={[
                                                    {
                                                        type: 'number',
                                                        min: 0,
                                                        max: 99,
                                                    },
                                                ]}
                                            >
                                                <InputNumber style={{ width: '100%' }} />
                                            </Form.Item>
                                            <Form.Item
                                                name={"finalMaxLoc"}
                                                label="Final Max Loc"
                                                rules={[
                                                    {
                                                        type: 'number',
                                                        min: 0,
                                                        max: 1000,
                                                    },
                                                ]}
                                            >
                                                <InputNumber style={{ width: '100%' }} />
                                            </Form.Item>

                                            {finalEvaluationCriteria.some(criteria => criteria.status === 'LOCKED') ? (
                                                <Form.Item
                                                    wrapperCol={{ ...layout.wrapperCol, offset: 8 }}
                                                >
                                                    <span style={{ color: 'red' }}>You can't edit this setting now because have some classes are using this setting.</span>
                                                </Form.Item>
                                            ) : (
                                                <Form.Item
                                                    wrapperCol={{ ...layout.wrapperCol, offset: 8 }}
                                                >
                                                    <Button type="primary" ghost htmlType="submit">
                                                        Save
                                                    </Button>
                                                </Form.Item>
                                            )}
                                        </Form>
                                    </TabPane>

                                </Tabs>
                            </TabPane>
                            <TabPane tab={<strong>Estimate LOC</strong>} key="4">
                                <div style={{ marginBottom: 20 }}>
                                    <Button onClick={showTechMangement}>Teachnology Management</Button>
                                    <Button style={{ marginLeft: 20 }} onClick={showFuncMangement}>Function Type Management</Button>
                                    <Button style={{ marginLeft: 20 }} onClick={showEsMangement}>Estimate Loc Setting</Button>
                                </div>

                                <Form
                                    className="custom-form"
                                    form={formEstimate}
                                    {...layout}
                                    name="estimate"
                                    onFinish={() => {
                                        modal.confirm(confirm)
                                    }}
                                    style={{
                                        maxWidth: 600,
                                    }}
                                >
                                    <Form.Item
                                        name={'functionType'}
                                        label="Function Type"
                                        rules={[
                                            {
                                                required: true, message: 'Please select a function type'
                                            },
                                        ]}
                                    >
                                        <Select
                                            showSearch
                                            placeholder="Select a function type"
                                            optionFilterProp="children"
                                            onChange={(value) => setEstimateLoc({ ...estimateLoc, functionType: value })}
                                            filterOption={(input, option) =>
                                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            }
                                        >
                                            {functionTypes.map((type) => (
                                                <Option key={type.id} value={type.id}>{type.name}</Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                    <Form.Item
                                        name={'language'}
                                        label="Language"
                                        rules={[
                                            {
                                                required: true, message: 'Please select a language'
                                            },
                                        ]}
                                    >
                                        <Select
                                            showSearch
                                            onChange={(value) => setEstimateLoc({ ...estimateLoc, language: value })}
                                            placeholder="Select a technology"
                                            optionFilterProp="children"
                                            filterOption={(input, option) =>
                                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            }
                                        >
                                            {technologies.map((tech) => (
                                                <Option key={tech.id} value={tech.id}>{tech.name}</Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                    <Form.Item
                                        name={'numberOfLocInput'}
                                        label="Number of LOC / Input"
                                        rules={[
                                            { required: true, message: "Please enter a number loc/input", },
                                            { pattern: /^[0-9]+$/, message: 'Please loc/input a valid number!' }
                                        ]}
                                    >
                                        <InputNumber style={{ width: '100%' }}></InputNumber>
                                    </Form.Item>
                                    <Form.Item
                                        wrapperCol={{
                                            ...layout.wrapperCol,
                                            offset: 8,
                                        }}
                                    >

                                        {selectedEsimateLoc && selectedEsimateLoc.status === 'LOCKED' ? (
                                            <Form.Item
                                                wrapperCol={{ ...layout.wrapperCol, offset: 8 }}
                                            >
                                                <span style={{ color: 'red' }}>You can't edit this setting now because have some classes are using this setting.</span>
                                            </Form.Item>
                                        ) : (
                                            <Form.Item
                                                wrapperCol={{ ...layout.wrapperCol, offset: 8 }}
                                            >
                                                <Button type="primary" ghost htmlType="submit">
                                                    Save
                                                </Button>
                                            </Form.Item>
                                        )}
                                    </Form.Item>
                                </Form>
                            </TabPane>

                        </Tabs>
                    </div>
                    <Modal
                        title={<span className="centered-title">Add new function type</span>}
                        open={isModalFuncOpen}
                        onCancel={handleFuncCancel}
                        footer={null}
                    >
                        <Form
                            layout="vertical"
                            form={formFunctionType}
                            onFinish={handleFuncSubmit}
                        >
                            <Form.Item
                                name="functionType"
                                label="Function type"
                                rules={[{ required: true, message: 'Please input the Function type!' }]}
                            >
                                <Input placeholder="Enter Function type" />
                            </Form.Item>
                            <Form.Item>
                                <Button style={{ marginRight: 10 }} key="submit" ghost type="primary" htmlType="submit">
                                    Submit
                                </Button>
                                <Button key="back" danger onClick={handleFuncCancel}>
                                    Cancel
                                </Button>

                            </Form.Item>
                        </Form>
                    </Modal>
                    <Modal
                        title={<span className="centered-title">Add new Technology</span>}
                        open={isModalTechOpen}
                        onCancel={handleTechCancel}
                        footer={null}
                    >
                        <Form
                            layout="vertical"
                            form={formTech}
                            onFinish={handleTechSubmit}
                        >
                            <Form.Item
                                name="technology"
                                label="Technology"
                                rules={[{ required: true, message: 'Please input the Technology!' }]}
                            >
                                <Input placeholder="Enter Technology" />
                            </Form.Item>
                            <Form.Item>
                                <Button style={{ marginRight: 10 }} key="submit" type="primary" ghost htmlType="submit">
                                    Submit
                                </Button>
                                <Button key="back" danger onClick={handleTechCancel}>
                                    Cancel
                                </Button>
                            </Form.Item>
                        </Form>
                    </Modal>
                    <Modal
                        title={<span className="centered-title">Technology Management</span>}
                        open={isTechManagemnt}
                        onCancel={cancelTechMangement}
                        footer={null}
                    >
                        <Button onClick={showModalTech}>Add new Teachnology</Button>
                        <Table
                            dataSource={technology}
                            columns={columnsTech}
                            size='small' rowKey="id"
                            pagination={techPagination}
                            onChange={(pagination) => setTechPagination(pagination)}
                        />
                    </Modal>
                    <Modal
                        title={<span className="centered-title">Function Type Management</span>}
                        open={isFuncManagemnt}
                        onCancel={cancelFuncMangement}
                        footer={null}
                    >
                        <Button onClick={showFucnModal}>Add new Function type</Button>
                        <Table
                            dataSource={functionType}
                            columns={columnsFunc}
                            size='small'
                            rowKey="id"
                            pagination={funcTypePagination}
                            onChange={(pagination) => setFuncTypePagination(pagination)}
                        />
                    </Modal>
                    <Modal
                        title={<span className="centered-title">Function Estimate Management</span>}
                        open={isFuncEs}
                        width={600}
                        onCancel={cancelEsMangement}
                        footer={null}
                    >

                        <Table
                            dataSource={functionEstimateLocs}
                            columns={columnsFunctionEs}
                            size='small'
                            rowKey="id"
                            pagination={funcEsPagination}
                            onChange={(pagination) => setFuncEsPagination(pagination)}
                        />
                    </Modal>
                </Content>
                <AppFooter />
            </Layout>
            {contextHolder}
        </Layout>
    );
}
export default Setting;