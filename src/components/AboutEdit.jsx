'use client';

import { savePuckData } from '@/lib/actions/puck';
import { Puck } from '@puckeditor/core';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import log from 'xac-loglevel';
import { createFileEmbedConfig } from './puck/file-embed/file-embed-config';


// Create Puck component config
const config = {
  categories: {
    typography: {
      components: ['HeadingBlock', 'Heading', 'Text', 'Markdown'],
      title: 'Text',
    },
    layout: {
      components: ['Space', 'FlexContainer'],
    },
  },
  components: {
    HeadingBlock: {
      fields: {
        children: {
          type: 'text',
        },
      },
      render: ({ children }) => {
        return <h1>{children}</h1>;
      },
    },
    Space: {
      label: 'Space',
      fields: {
        size: {
          type: 'select',
          options: [
            { label: '8px', value: '8px' },
            { label: '16px', value: '16px' },
            { label: '24px', value: '24px' },
            { label: '32px', value: '32px' },
            { label: '40px', value: '40px' },
            { label: '48px', value: '48px' },
            { label: '56px', value: '56px' },
            { label: '64px', value: '64px' },
            { label: '72px', value: '72px' },
            { label: '80px', value: '80px' },
            { label: '88px', value: '88px' },
            { label: '96px', value: '96px' },
            { label: '104px', value: '104px' },
            { label: '112px', value: '112px' },
            { label: '120px', value: '120px' },
            { label: '128px', value: '128px' },
            { label: '136px', value: '136px' },
            { label: '144px', value: '144px' },
            { label: '152px', value: '152px' },
            { label: '160px', value: '160px' },
          ],
        },
        direction: {
          type: 'radio',
          options: [
            { value: 'vertical', label: 'Vertical' },
            { value: 'horizontal', label: 'Horizontal' },
            { value: '', label: 'Both' },
          ],
        },
      },
      defaultProps: {
        direction: 'vertical',
        size: '24px',
      },
      inline: true,
      render: ({ direction, size, puck }) => {
        return (
          <div
            ref={puck.dragRef}
            className={'Space--' + direction + ' Space'}

            style={{ '--size': size }}
          />
        );
      },
    },
    Heading: {
      fields: {
        title: {
          type: 'text',
        },
        level: {
          type: 'number',
        },
      },
      defaultProps: {
        title: 'heading',
        level: 1,
      },
      render: ({ title, level }) => {
        switch (level) {
          case 1:
            return <h1>{title}</h1>;
          case 2:
            return <h2>{title}</h2>;
          case 3:
            return <h3>{title}</h3>;
          case 4:
            return <h4>{title}</h4>;
          default:
            return <h1>{title}</h1>;
        }
      },
    },
    Text: {
      fields: {
        content: {
          type: 'richtext',
        },
      },
      defaultProps: {
        content: "i'm <u>richtext</u>",
      },
      render: ({ content }) => {
        return <div>{content}</div>;
      },
    },
    Markdown: {
      fields: {
        content: {
          type: 'textarea',
        },
      },
      defaultProps: {
        content: 'Insert **markdown**.',
      },
      render: ({ content }) => {
        return <Markdown remarkPlugins={[remarkGfm]}>{content}</Markdown>;
      },
    },
    FlexContainer: {
      fields: {
        direction: {
          type: 'select',
          options: [
            { label: 'Row', value: 'row' },
            { label: 'Column', value: 'column' },
          ],
        },
        items: {
          type: 'slot',
        },
      },
      render: ({ direction = 'row', items: Items }) => {
        return (
          <Items
            zone="flex-zone"
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              flexDirection: direction,
            }}
          />
        );
      },
    },
    
  },
};

const AboutEdit = ({ dataSourceId, data }) => {
  const dataO = JSON.parse(data);
  const fec = createFileEmbedConfig(dataSourceId);
  config.components['FileChooser']=fec;

  return (
    <Puck
      height="100%"
      config={config}
      data={dataO}
      onPublish={(data) => {
        log.debug(JSON.stringify(data));
        savePuckData(dataSourceId, data);
      }}
    />
  );
};

export default AboutEdit;
