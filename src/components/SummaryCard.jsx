import React, { useEffect } from 'react';
import { Card, Badge, Tag } from 'antd';
import Accordion from 'react-bootstrap/Accordion';
import THEME from '@/lib/theme';

function SummaryCard({ data }) {
  useEffect(() => {
    console.log('d', data);
  }, []);

  const handleTagClick = () => {
    
  }

  const getHighlightedTags = () => {
    const list = [];
    let tags = [];
    for (const h of data.higlighted_tags) {
      tags = [];
      for (const t of data.tags) {
        if (t.name === h) {
          for (const i of t.values) {
            tags.push(
              <Tag key={i} className="mx-1" onClick={handleTagClick} 
                    style={{ cursor: 'pointer' }}>
                {i}
              </Tag>,
            );
          }
        }
      }
      list.push(
        <p key={h}>
          <strong>{h}</strong>
          {tags}
        </p>,
      );
    }
    return list;
  };
  return (
    <Card
      title={data.name}
      extra={
        <>
          <span key={`patients-${data.source}`} className="mx-3">
            {' '}
            <Badge
              count={data.patients}
              overflowCount={THEME.badge.overflow}
              color={THEME.colors.primary}
            />{' '}
            patients
          </span>
          <span key={`samples-${data.source}`}>
            <Badge
              count={data.samples}
              overflowCount={THEME.badge.overflow}
              color={THEME.colors.secondary}
            />{' '}
            samples{' '}
          </span>
        </>
      }
      style={{ width: '60%' }}
      actions={[]}
    >
      <p>{data.description}</p>
      {getHighlightedTags()}
      <div style={{ maxHeight: 200, overflowY: 'auto' }}>
        <Accordion>
          {data.tags.map((tag) => (
            <Accordion.Item
              eventKey={`${data.source}-${tag.name}`}
              key={`${data.source}-${tag.name}`}
            >
              <Accordion.Header>{tag.name}</Accordion.Header>
              <Accordion.Body>
                {tag.values.map((value) => (
                  <Tag  key={value} className="mx-1" onClick={handleTagClick} 
                    style={{ cursor: 'pointer' }}>
                    {value}
                  </Tag>
                ))}
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      </div>
    </Card>
  );
}

export default SummaryCard;
