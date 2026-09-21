'use client';

import THEME from '@/lib/theme';
import { Badge, Card, Tag } from 'antd';

function SummaryCard({ data, onTagClick }) {
  const handleTagClick = (e, tag, value) => {
    e.preventDefault();
    e.stopPropagation();
    if (onTagClick) {
      onTagClick({ data, tag, value });
    }
  };

  const getTags = () => {
    return Object.entries(data.tags || {}).map(([id, { title, values }]) => (
      <p key={id}>
        <strong>{title}</strong>
        {values.map((v) => (
          <Tag
            className="c-tag"
            key={v}
            onClick={(e) => handleTagClick(e, id, v)}
            style={{ cursor: 'pointer' }}
          >
            {v}
          </Tag>
        ))}
      </p>
    ));
  };

  const goToSource = (e, d) => {
    e.preventDefault();
    e.stopPropagation();
    window.location = `/sources/${d.source}`;
  };

  const handleHeaderAreaClick = (e) => {
    if (e.target.closest('.ant-card-head')) {
      goToSource(e, data);
    }
  };

  return (
    <Card
      hoverable={true}
      onClick={handleHeaderAreaClick}
      className="c-summaryCard"
      title={
        <span onClick={(e) => goToSource(e, data)}>
          <span className="p2">{data.name}</span>
        </span>
      }
      extra={
        <>
          <span key={`patients-${data.source}`} className="mx-1">
            {' '}
            <Badge
              title={`${data.totalPatientCount} patients`}
              count={data.totalPatientCount}
              overflowCount={THEME.badge.overflow}
              color={THEME.colors.patients}
            />{' '}
            {/*patients*/}
          </span>
          <span key={`samples-${data.source}`}>
            <Badge
              title={`${data.totalSampleCount} samples`}
              count={data.totalSampleCount}
              overflowCount={THEME.badge.overflow}
              color={THEME.colors.samples}
            />{' '}
            {/*samples{' '}*/}
          </span>
        </>
      }
      style={{ width: '100%' }}
      actions={[]}
    >
      <div style={{ maxHeight: 550, overflowY: 'auto' }}>
        <p onClick={(e) => goToSource(e, data)}>{data.description}</p>
        <div className="c-summaryCard__tags">{getTags()}</div>
      </div>
    </Card>
  );
}

export default SummaryCard;
