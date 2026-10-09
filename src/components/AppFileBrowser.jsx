'use client';
import React, { useState, useMemo } from 'react';
import { ConfigProvider, Tree, Typography } from 'antd';
import {
  FolderOpenOutlined,
  FolderOutlined,
  FileOutlined,
  FileImageOutlined,
  FilePdfOutlined,
  InboxOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import { formatSize } from '@/lib/general';
import log from 'xac-loglevel';
import AppSpinner from './AppSpinner';
import ClipboardCopy from './ClipboardCopy';

const { DirectoryTree } = Tree;
const { Text } = Typography;

const AppFileBrowser = ({ dataSourceId, files }) => {
  const [fileUrl, setFileUrl] = useState(null);
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState(null);
  const previewFileBase = `/sources/${dataSourceId}/about/files/`;

  const onSelect = (selectedKeys, info) => {
    log.debug('AppFileBrowser.onSelect', selectedKeys, info);
    setIsBusy(true);
    setFileUrl(null);
    setError(null);
    const url = `${previewFileBase}${selectedKeys[0]}`;
    fetch(url)
      .then((result) => {
        if (result.ok) {
          setFileUrl(url);
        } else {
          setError(
            { statusText: result.statusText, status: result.status, file: selectedKeys[0] }
          );
        }
        setIsBusy(false);
      })
      .catch((e) => {
        log.error('AppFileBrowser.onSelect', e);
        setIsBusy(false);
        setError('Unexpected Error');
      });
  };

  const treeData = useMemo(() => {
    const root = [];

    files.forEach((file) => {
      const parts = file.path.split('/');
      let currentLevel = root;

      parts.forEach((part, index) => {
        const key = parts.slice(0, index + 1).join('/');

        // Check if node already exists at the current level
        let existingNode = currentLevel.find((node) => node.key === key);
        const isLeaf = index === parts.length - 1;

        if (!existingNode) {
          existingNode = {
            title: part,
            key: key,
            children: [],
            size: isLeaf ? file.size : '-',
            date: file.created_at.toLocaleDateString(),
            source: file,
            isLeaf,
          };
          currentLevel.push(existingNode);
        }

        // If it's a leaf node (file), clear the empty children array
        if (isLeaf) {
          delete existingNode.children;
        } else {
          currentLevel = existingNode.children;
        }
      });
    });

    return root;
  }, [files]);

  const getIcon = (file) => {
    if (file.mime_type.includes('pdf')) return <FilePdfOutlined />;
    if (file.mime_type.includes('image')) return <FileImageOutlined />;
    return <FileOutlined />;
  };

  const renderTitle = (nodeData) => {
    return (
      <div className="c-fileBrowser__row">
        {/* File / Folder Name */}
        <span className="c-fileBrowser__title">
          {nodeData.isLeaf && <span>{getIcon(nodeData.source)}</span>}
          <span>
            &nbsp;{nodeData.title}{' '}
            <ClipboardCopy
              title="Copy url to clipboard"
              text={`${window.location.origin}${previewFileBase}${nodeData.title}`}
            />
          </span>
        </span>

        {/* Metadata Columns */}
        <div className="c-fileBrowser__meta">
          <Text
            type="secondary"
            className="c-fileBrowser__meta__size"
            style={{ width: '80px' }}
          >
            {typeof nodeData.size === 'string'
              ? nodeData.size
              : formatSize(nodeData.size)}
          </Text>
          <Text
            type="secondary"
            className="c-fileBrowser__meta__date"
            style={{ width: '130px' }}
          >
            {nodeData.date}
          </Text>
        </div>
      </div>
    );
  };

  const hasFiles = files && files.length > 0;

  return (
    <div className="c-fileBrowser">
      {/* Ant Design Directory Tree */}
      <div className="row mt-3">
        {!hasFiles && (
          <div className="col-12">
            <div
              className="c-fileBrowser__previewNotice alert alert-secondary"
              role="alert"
            >
              <p className="text-center">
                <InboxOutlined className="fs-1" /> <br />
                <span>No files found for this source.</span>
              </p>
            </div>
          </div>
        )}
        {hasFiles && (<div className="col-8">
          {/* Header Row for columns */}
          <div className="c-fileBrowser__header" style={{}}>
            <span style={{ flex: 1 }}>Name</span>
            <div
              style={{
                display: 'flex',
                gap: '40px',
                width: '250px',
                textAlign: 'right',
              }}
            >
              <span style={{ width: '80px' }}>Size</span>
              <span style={{ width: '130px' }}>Date Modified</span>
            </div>
          </div>
          <ConfigProvider
            theme={{
              components: {
                Tree: {
                  directoryNodeSelectedBg: '#d8eef6',
                  directoryNodeSelectedColor: '#000000',
                },
              },
            }}
          >
            
              <DirectoryTree
                onSelect={onSelect}
                defaultExpandAll
                treeData={treeData}
                titleRender={renderTitle}
                icon={(props) => {
                  if (props.isLeaf) return <></>;
                  return props.expanded ? (
                    <FolderOpenOutlined />
                  ) : (
                    <FolderOutlined />
                  );
                }}
                style={{ background: 'transparent' }}
              />
            
          </ConfigProvider>
        </div>)}
        <div className="col-4">
          {error && (
            <div
              className="c-fileBrowser__previewNotice alert alert-warning"
              role="alert"
            >
             
              <p className="text-center">
                <i class="fs-1">{error.status}</i> <br />
                <span>{error.statusText}</span><br />
                <span>File: <code>{error.file}</code></span>
              </p>
            </div>
          )}
          {isBusy && (
            <div className="text-center p-5">
              <AppSpinner fullscreen={false} />
            </div>
          )}
          {fileUrl && (
            <div style={{ height: '100%' }}>
              <Link
                className="c-btn c-btn--secondary c-btn--sm mb-2"
                href={fileUrl}
                target="_blank"
              >
                View file in new tab
              </Link>
              <iframe src={fileUrl} width={'100%'} height={'90%'} />
            </div>
          )}
          {!fileUrl && !error && !isBusy && hasFiles && (
            <div
              className="c-fileBrowser__previewNotice alert alert-secondary"
              role="alert"
            >
              <p className="text-center">
                <i class="bi bi-easel fs-1"></i> <br />
                <span>Select a file on the left to preview it.</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppFileBrowser;
