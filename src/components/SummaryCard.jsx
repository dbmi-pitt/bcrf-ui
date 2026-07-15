import React, { useEffect } from 'react';
import { Card, Badge } from 'antd';
import THEME from '@/lib/theme';

function SummaryCard({ data }) {
  useEffect(() => {
    console.log('d', data);
  }, []);
  return (
     
      <Card 
      title={data.name} 
      extra={<>
        <span key={`patients-${data.source}`} className='mx-3'> <Badge count={data.patients} overflowCount={THEME.badge.overflow} color={THEME.colors.primary} /> patients</span>
        <span key={`samples-${data.source}`}><Badge count={data.samples} overflowCount={THEME.badge.overflow} color={THEME.colors.secondary} /> samples </span>
      </>} 
      style={{ width: '60%' }}
      actions={[
        
      ]}
    >
      <p>{data.description}</p>

    </Card>
    
    
  );
}

export default SummaryCard;
