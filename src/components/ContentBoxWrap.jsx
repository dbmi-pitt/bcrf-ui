import React from 'react'
import ContentGenerator from './ContentGenerator'

function ContentBoxWrap({content}) {
  return (
    <section className="c-box--contentPage c-box--surrounded c-box--contentPage txt--blue--primary container-fluid">
      <ContentGenerator content={content} />
    </section>
  )
}

export default ContentBoxWrap