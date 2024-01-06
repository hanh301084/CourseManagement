import React from 'react';
import { Button, Upload } from 'antd';
import { DownloadOutlined, UploadOutlined } from '@ant-design/icons';

export const UploadDownloadButtons = ({ classId, handleDownload, props, handleUpload, fileList, uploading }) => {
    return (
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: 16 }}>
            <Button
                type='primary'
                ghost
                icon={<DownloadOutlined />}
                onClick={() => handleDownload(classId)}
                style={{ marginRight: 16 }}
            >
                Export Class User
            </Button>
            {/* <Upload {...props}>
                <Button icon={<UploadOutlined />} type='primary' style={{ marginRight: 32 }}>
                    Import Class User
                </Button>
            </Upload> */}
            {
                fileList.length > 0 && (
                    <Button
                        type="primary"
                        onClick={handleUpload}
                        disabled={fileList.length === 0}
                        loading={uploading}
                        style={{
                            marginTop: 16,
                        }}
                    >
                        {uploading ? 'Uploading' : 'Start Upload'}
                    </Button>
                )
            }
        </div>
    );
};
