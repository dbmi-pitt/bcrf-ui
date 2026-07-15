'use client';
import React, {useContext, useState} from 'react';
import BasicLayout from '@/components/layout/BasicLayout';
import AppSpinner from '@/components/AppSpinner';
import AppContext from '@/context/AppContext';
import { Masonry, Tag } from 'antd';
import AppCard from '@/components/SummaryCard';
import { Container, Row } from 'react-bootstrap';

export default function Home() {
  const { content } = useContext(AppContext)
  const [tags, setTags] = useState([])

  const onCardTagClick = ({data, tag, value}) => {
    setTags([...tags, {name: tag.name, value}])
  }

  const getHeaderTags = () => {
    const list = []
    for (const t of tags) {
      list.push(<Tag className='c-tag' key={`${t.name}-${t.value}`} closable onClick={() => onHeaderTagClick(t)} >
                      <strong>{t.name}</strong>: {t.value}
                </Tag>)
    }
    return list;
  }

  const onHeaderTagClick = (tag) => {
    setTags(tags.filter((t) => (t.name !== tag.name && t.value !== tag.value)))
  }

  return (
    <div>
      <BasicLayout fluid={undefined}>
        <Row className='c-selectedTags'>
          <Container>{getHeaderTags()}</Container>
        </Row>
        {content.summary && <Masonry
          columns={{xs: 1, sm: 2, md: 3}}
          gutter={10}
          items={content?.summary?.data_sources.map((source, index) => ({
            key: `item-${index}`,
            data: source,
          }))}
          itemRender={({ data, index }) => (
            <AppCard data={data} index={index} key={`card-${index}`} onTagClick={onCardTagClick} />
          )}
        />}
      </BasicLayout>
    </div>
  );
}
