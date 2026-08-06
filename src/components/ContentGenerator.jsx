import React, { useEffect, useMemo, useState } from 'react'
import Hero from '@/components/Hero'
import BasicHero from '@/components/BasicHero'
import MiniHero from '@/components/MiniHero'
import SiblingsContent from '@/components/SiblingsContent'
import BasicContent from '@/components/BasicContent'
import ContentBoxWrap from '@/components/ContentBoxWrap'

const ContentGenerator = ({ content }) => {
  const [sections, setSections] = useState([]);

  const useMemoizedContent = useMemo(() => {
    return {
      'Hero': Hero,
      'BasicHero': BasicHero,
      'MiniHero': MiniHero,
      'SiblingsContent': SiblingsContent,
      'BasicContent': BasicContent,
      'ContentBoxWrap': ContentBoxWrap,
    };
  }, []);

  useEffect(() => {
    if (content && content.sections) {
      const newSections = [];
      content.sections.forEach((section, index) => {
        const Component = useMemoizedContent[section.component] || BasicContent; // Default to BasicContent if component not found
        if (Component) {
          // Render the component with the provided content
          newSections.push(<Component key={`section-${index}`} content={section} />);
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