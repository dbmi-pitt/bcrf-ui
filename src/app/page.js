'use client';
import React, {useContext, useState, useEffectEvent, useEffect} from 'react';
import BasicLayout from '@/components/layout/BasicLayout';
import AppSpinner from '@/components/AppSpinner';
import AppContext from '@/context/AppContext';
import { Masonry, Tag } from 'antd';
import AppCard from '@/components/SummaryCard';
import { Container, Row } from 'react-bootstrap';

export default function Home() {
  const { content } = useContext(AppContext)
  const [tags, setTags] = useState([])
  const [cards, setCards] =  useState(content?.summary?.data_sources || [])

  const setDataSources = useEffectEvent(() => {
    setCards(content?.summary?.data_sources)
  }, [])

  useEffect(() => {
    if (content.summary) {
      setDataSources()
    }
  }, [content.summary])

  const filterCards = (tag, value, sources = []) => {
    const sourceIds = sources.map((d) => d.source)
    const dict = {}
    sourceIds.forEach(role => {
      dict[role] = true;
    });
    // filter out the cards already included
    const availableSources = content?.summary?.data_sources.filter((d) => dict[d.source] === undefined)
    availableSources.map((data) => {
      data.tags.map((t) => {
        if (dict[data.source] === undefined && (t.name === tag.name && t.values.indexOf(value) !== -1)) {
          sources.push(data)
          dict[data.source] = true
        }
      })
    })
    return sources
  }

  const onCardTagClick = ({data, tag, value}) => {
    const sources = filterCards(tag, value)
    setCards(sources)
    setTags([...tags, {name: tag.name, value, id: data.source}])
  }

  const getHeaderTags = () => {
    const list = [];
    for (const t of tags) {
      list.push(
        <Tag
          className="c-tag"
          key={`${t.name}-${t.value}`}
          closable
          onClose={() => onHeaderTagClick(t)}
        >
          <strong>{t.name}</strong>: {t.value}
        </Tag>,
      );
    }
    return list;
  };

  const onHeaderTagClick = (tag) => {
    const newTags = tags.filter((t) => (t.id === tag.id && t.value !== tag.value))
    let sources = []
    for (const t of newTags) {
      sources = filterCards(t, t.value, sources)
    }
    setCards(sources.length ? sources : content?.summary?.data_sources)
    setTags(newTags)
  }

  return (
    <div>
      <BasicLayout fluid={undefined}>
        <Row className='c-selectedTags'>
          <Container>{getHeaderTags()}</Container>
        </Row>
        {cards && <Masonry
          columns={{xs: 1, sm: 2, md: 3}}
          gutter={10}
          items={cards.map((source, index) => ({
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
