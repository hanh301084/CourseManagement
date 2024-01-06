import React, { useEffect, useState } from 'react';
import AppFooter from '../../compornent/layout/Footer';
import AppHeader from '../../compornent/layout/Header';
import StudentSidebar from '../../compornent/layout/Student/StudentSidebar';
import { Layout, Breadcrumb,Table} from 'antd';
import { Link, useParams } from "react-router-dom";
import PackageEvaluationAPI from '../../api/PackageEvaluationAPI';

const { Content } = Layout;
const Grade = () => {

    const { classCode } = useParams();
    const [packageEvaluationList, setPackageEvaluationList] = useState([])
    const [pageSize,setPageSize]=useState(8);

    useEffect(()=>{
        PackageEvaluationAPI.getPackageEvaluationByClassUserId()
        .then((response)=>{
            setPackageEvaluationList(response.data);
        })
        .catch((error)=>console.error("Failed to get package evaluation ",error))
    },[])
    const columns = [
        {
            title: 'STT',
            dataIndex: 'index',
            key: 'index',
            render: (text, record, index) => packageEvaluationList.findIndex(packageEvaluation=>packageEvaluation.packageEvaluationId===record.packageEvaluationId)+1,
        },
        {
            title: 'Tracking Grade',
            dataIndex: 'trackingGrade',
            key: 'trackingGrade',
        },
        {
            title: 'SRS Grade',
            dataIndex: 'srsGrade',
            key: 'srsGrade',
        },
        {
            title: 'SDS Grade',
            key: 'sdsGrade',
            dataIndex: 'sdsGrade',
        },
        {
            title: 'Team Grade',
            key: 'teamGrade',
            dataIndex: 'sdsGrade',
        },
        {
            title: 'LOC',
            key: 'loc',
            dataIndex: 'loc',
        },
        {
            title: 'LOC Grade',
            key: 'locGrade',
            dataIndex: 'locGrade',
        },
        {
            title: 'Fianl Tracking Grade',
            key: 'finalTrackingGrade',
            dataIndex: 'finalTrackingGrade',
        },
        {
            title: 'Fianl SRS Grade',
            key: 'finalSrsGrade',
            dataIndex: 'finalSrsGrade',
        },
        {
            title: 'Fianl SDS Grade',
            key: 'finalSdsGrade',
            dataIndex: 'finalSdsGrade',
        },
        {
            title: 'Fianl Issue Grade',
            key: 'finalIssueGrade',
            dataIndex: 'finalIssueGrade',
        },
        {
            title: 'Fianl Team Grade',
            key: 'finalTeamGrade',
            dataIndex: 'finalTeamGrade',
        },
        {
            title: 'Fianl LOC',
            key: 'finalLoc',
            dataIndex: 'finalLoc',
        },
        {
            title: 'Fianl LOC Grade',
            key: 'finalLocGrade',
            dataIndex: 'finalLocGrade',
        },
        {
            title: 'Presentation 1',
            key: 'presentation1',
            dataIndex: 'presentation1',
        },
        {
            title: 'Presentation 2',
            key: 'presentation2',
            dataIndex: 'presentation2',
        },
    ];
    return (
        <>
            <Layout style={{ minHeight: '100vh' }}>
                <StudentSidebar />
                <Layout>
                    <AppHeader />
                    <Content>
                        <Breadcrumb 
                            items={[
                                {
                                    title: <Link to='/reviewer'>Home</Link>
                                },
                                {
                                    title: <Link to='/reviewer'>Class</Link>
                                },
                                {
                                    title: classCode,
                                },

                            ]}
                            style={{
                                marginLeft: 100, marginTop: 20
                            }}
                        />
                        <h1  style={{
                                marginLeft: 100, marginTop: 20
                            }}>{classCode }- Grande</h1>
                            <Table
                                dataSource={packageEvaluationList}
                                columns={columns}
                                rowKey="packageEvaluationId"
                                style={{ marginTop: '20px' }}
                                pagination={{
                                    pageSize: pageSize,
                                    total: packageEvaluationList.length
                                }}
                            />
                    </Content>
                    <AppFooter />
                </Layout>
            </Layout>
        </>
    )
}

export default Grade;