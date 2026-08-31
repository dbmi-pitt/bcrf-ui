import React from 'react'
import { Row } from "react-bootstrap";
import Image from "next/image";

function BasicContent({content}) {
  return (
    <div className="c-basicContent">
      <Row className="mb-5">
        {content.image && <Image src={content.image} alt={content.title} width="190" height="119" className="c-box--contentPage__image w-fixed" />}
        {content.title && <h2 className="mt-4 h--subheadline">{content.title}</h2>}
        <div className="c-box--contentPage__body" dangerouslySetInnerHTML={{ __html: content.body }} />
      </Row>
      </div>
  )
}

export default BasicContent