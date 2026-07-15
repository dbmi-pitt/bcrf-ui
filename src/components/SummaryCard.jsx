import React, { useEffect } from 'react';
import { Card, Badge, Tag } from 'antd';
import Accordion from 'react-bootstrap/Accordion';
import THEME from '@/lib/theme';

function SummaryCard({ data, onTagClick }) {
  useEffect(() => {
    console.log('d', data);
  }, []);

  const handleTagClick = (tag, value) => {
    if (onTagClick) {
      onTagClick({data, tag, value})
    }
  }

  const getHighlightedTags = () => {
    const list = [];
    let tags = [];
    for (const h of data.higlighted_tags) {
      tags = [];
      for (const tag of data.tags) {
        if (tag.name === h) {
          for (const v of tag.values) {
            tags.push(
              <Tag className='c-tag' key={v} onClick={() => handleTagClick(tag, v)} 
                    style={{ cursor: 'pointer' }}>
                {v}
              </Tag>
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
      style={{ width: '100%' }}
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
                  <Tag className='c-tag' key={value} onClick={() => handleTagClick(tag, value)} 
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
