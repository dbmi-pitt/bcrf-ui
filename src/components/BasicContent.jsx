import React from 'react'
import { Container, Row } from "react-bootstrap";
import Image from "next/image";

function BasicContent({content}) {
  return (
    <Container className="c-basicContent">
      <Row className="mb-5">
        {content.image && <Image src={content.image} alt={content.title} width="190" height="119" className="c-box--contentPage__image w-fixed" />}
        {content.title && <h1 className="fs-1">{content.title}</h1>}
        <div className="c-box--contentPage__body" dangerouslySetInnerHTML={{ __html: content.body }} />
      </Row>
      </Container>
  )
}

export default BasicContent