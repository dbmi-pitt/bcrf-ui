import BasicContent from '@/components/BasicContent';
import BasicHero from '@/components/BasicHero';
import ContentBoxWrap from '@/components/ContentBoxWrap';
import Hero from '@/components/Hero';
import MiniHero from '@/components/MiniHero';
import SiblingsContent from '@/components/SiblingsContent';

const memoizedContent = {
  Hero: Hero,
  BasicHero: BasicHero,
  MiniHero: MiniHero,
  SiblingsContent: SiblingsContent,
  BasicContent: BasicContent,
  ContentBoxWrap: ContentBoxWrap,
};

const ContentGenerator = ({ content }) => {
  const sections = [];
  content.sections.forEach((section, index) => {
    const Component = memoizedContent[section.component] || BasicContent; // Default to BasicContent if component not found
    if (Component) {
      // Render the component with the provided content
      sections.push(<Component key={`section-${index}`} content={section} />);
    }
  });

  return <div className="c-contentGenerator">{sections}</div>;
};

export default ContentGenerator;
