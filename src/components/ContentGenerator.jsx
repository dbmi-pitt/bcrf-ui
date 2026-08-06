import React, { useEffect, useMemo } from 'react'
import Hero from './Hero'
import MiniHero from './MiniHero'
import SiblingsContent from './SiblingsContent'

const ContentGenerator = ({ content }) => {
  const [sections, setSections] = React.useState([]);

  const useMemoizedContent = useMemo(() => {
    return {
      'Hero': Hero,
      'MiniHero': MiniHero,
      'SiblingsContent': SiblingsContent,
    };
  }, []);

  useEffect(() => {
    if (content && content.sections) {
      const newSections = [];
      content.sections.forEach((section) => {
        const Component = useMemoizedContent[section.component];
        if (Component) {
          // Render the component with the provided content
          newSections.push(<Component key={section.component} content={section} />);
        }
      });
      setSections(newSections);
    }
  }, [content, useMemoizedContent]);

  return (
    <div className="c-contentGenerator">
      {sections}
    </div>
  )
}

export default ContentGenerator