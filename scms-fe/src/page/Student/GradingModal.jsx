import React, { useState, useEffect } from 'react';
import { Modal, Input, Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import './style.css'
export const OGGradingModal = ({ isVisible, handleOk, handleCancel, evaluationCriteriaEachIter, selectedIteration, setSrsGrade, setSdsGrade, totalMaxLoc, packageEvaluation,  }) => {
    const handleSrsGradeChange = (e) => {
        const value = e.target.value;
        if (!isNaN(value) && value >= 0 && value <= 10) {
            setSrsGrade(value);
        }
    };

    const handleSdsGradeChange = (e) => {
        const value = e.target.value;
        if (!isNaN(value) && value >= 0 && value <= 10) {
            setSdsGrade(value);
        }
    };

    const handleOkClick = () => {
        handleOk();
    };

    let selectedLoc = 0;
    if (selectedIteration === "Iteration 1") {
        selectedLoc = totalMaxLoc?.sumLocIter1
    }
    else if (selectedIteration === "Iteration 2") {
        selectedLoc = totalMaxLoc?.sumLocIter2
    }
    else if (selectedIteration === "Iteration 3") {
        selectedLoc = totalMaxLoc?.sumLocIter3
    }
    else if (selectedIteration === "Iteration 4") {
        selectedLoc = totalMaxLoc?.sumLocIter4
    }
    else if (selectedIteration === "Iteration 5") {
        selectedLoc = totalMaxLoc?.sumLocIter5
    }
    else if (selectedIteration === "Iteration 6") {
        selectedLoc = totalMaxLoc?.sumLocIter6
    }
    ;
    let locGrade = (selectedLoc / evaluationCriteriaEachIter?.maxLoc) * 10;
    locGrade = Math.min(locGrade, 10);
    return (
        <Modal
        title={<span className="centered-title" style={{marginBottom: 20}}>Grade of {selectedIteration}</span>}
            visible={isVisible}
            onOk={handleOk}
            onCancel={handleCancel}
        >
            <span>SRS Grade </span>
            <Tooltip title={`SRS grade will account for ${evaluationCriteriaEachIter?.ongoingSDSWeight}%`}>
                <QuestionCircleOutlined />
            </Tooltip>
            <br></br>
            <Input
                type='number'
                style={{ marginTop: 10, color: "black"}}
                onChange={handleSrsGradeChange}
                min={0}
                max={10}
                value={packageEvaluation?.srsGrade}
                readOnly
                disabled
            />
            <br /><br />
            <span>SRS Grade </span>
            <Tooltip title={`SDS grade will account for ${evaluationCriteriaEachIter?.ongoingSRSWeight}%`}>
                <QuestionCircleOutlined />
            </Tooltip>
            <br></br>
            <Input
                type='number'
                style={{ marginTop: 10, color: "black"}}
                onChange={handleSdsGradeChange}
                min={0}
                max={10}
                value={packageEvaluation?.sdsGrade}
                readOnly
                disabled
            />

            <br /><br />
            <span>LOC Grade </span>
            <Tooltip title={`Ongoing coding grade will account for ${evaluationCriteriaEachIter?.ongoingCodingWeight}%`}>
                <QuestionCircleOutlined />
            </Tooltip>
            <br />
            <Input
                style={{ marginTop: 10, color: "black" }}
                value={typeof locGrade === 'number' && !isNaN(locGrade) ? locGrade.toFixed(2) : '0'}
                readOnly
                disabled
            />
            <br /><br />
            <span>Achieved LOC / Total LOC </span>
            <Tooltip title={`total loc student achieved / total max loc of ${selectedIteration}: ${evaluationCriteriaEachIter?.maxLoc}`}>
                <QuestionCircleOutlined />
            </Tooltip>
            <br />
            <Input
                style={{ marginTop: 10, color: "black" }}
                value={`${selectedLoc || 0}/${evaluationCriteriaEachIter?.maxLoc || ''}`}
                readOnly
                disabled
            />
            <br /><br />
        </Modal>
    );
}