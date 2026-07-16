import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import React from 'react';
import { Popover, Tooltip } from 'antd';
import { InfoCircleOutlined, MenuOutlined } from '@ant-design/icons';

export default function GridWidget({ title, widgetKey, onRemove }) {
  return (
    <Card className="h-100" key={widgetKey}>
      <Card.Header className="d-flex justify-content-between align-items-center py-1">
        <span>{title}</span>

        <div className="d-flex align-items-center gap-2">
          <Tooltip title={'Test tooltip'}>
            <InfoCircleOutlined />
          </Tooltip>

          {/*TODO: Define content component */}
          <Popover content={"Test"} title="Title" trigger="click">
              <MenuOutlined />
          </Popover>

          <Button
            variant="link"
            size="sm"
            className="p-0 text-dark text-decoration-none"
            onClick={onRemove}
          >
            ✕
          </Button>
        </div>
      </Card.Header>

      <Card.Body>{/*  TODO: Add graph component here*/}</Card.Body>
    </Card>
  );
}
