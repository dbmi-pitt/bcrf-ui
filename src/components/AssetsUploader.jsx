"use client";

import React from 'react';
import { InboxOutlined } from '@ant-design/icons';
import { message, Upload } from 'antd';
const { Dragger } = Upload;
import log from 'xac-loglevel';

const AssetsUploader = ({ dataSourceId }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [errors, setErrors] = React.useState([]);
  const props = {
    name: 'file',
    multiple: true,
    action: `/api/sources/${dataSourceId}/files`,
    onChange(info) {
      const { status } = info.file;
      if (status !== 'uploading') {
        log.debug('AssetsUploader.onChange', info.file, info.fileList);
      }
      if (status === 'done') {
        messageApi.success(`${info.file.name} file uploaded successfully.`);
      }
      if (status === 'error') {
        console.log('AssetsUploader.onChange', info.file, info.fileList);
        
        setErrors((prevErrors => [...prevErrors, {file: info.file.name, status: info.file.status, response: info.file.response?.error}]));
        messageApi.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      log.debug('AssetsUploader.onDrop', e.dataTransfer.files);
    },
  };
  return (
    <div className="c-assetsUploader mt-3">
      {contextHolder}
      <Dragger {...props}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">
          Click or drag file to this area to upload
        </p>
        <p className="ant-upload-hint">
          Drag files onto the box below, or click to choose files. You can
          select or drop multiple files at once — they&apos;ll upload in
          parallel.
        </p>
      </Dragger>
      {errors.length > 0 && (
        <div className="alert alert-danger mt-2" role="alert">
          <i className="bi bi-exclamation-triangle fs-4 text-capitalize">&nbsp; Error</i> <br />
          {errors.map((error, index) => (
            <div key={index}>
              <strong>{error.file}</strong> upload failed. &nbsp;
              <span>{error.response?.replace(/\.?$/, '.')}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default AssetsUploader;