'use client';

import React, { useContext, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import LinkButton from '@/components/LinkButton';
import AppContext from '@/context/AppContext';
import AppModal from './AppModal';

const Hero = ({ content }) => {
  const { isAuthenticated } = useContext(AppContext);
  const [modal, setModal] = useState(false);

  const handleShow = () => setModal({...modal, open: true, cancelCSS: 'none'});

  return (
    <section
      className="c-hero"
      style={{ backgroundImage: `url(${content.image})` }}
      aria-label={content.title}
    >
      <div className="c-hero__wrap txt--white">
        <div className="c-hero__row row c-hero__heading">
          <h1>{content.title}</h1>
        </div>
        <div className="c-hero__row row c-hero__body fs-1 lh-sm">
          <p>{content.body}</p>
        </div>
        {content.btns.length > 0 && (
          <Row xs={1} md={2} className="c-hero__footer">
            <Col>
              {!isAuthenticated && content.btns[0] && (
                <>
                  <LinkButton className=" text-white mt-4" onClick={content.btns[0].modal ? handleShow : undefined}>
                    {content.btns[0].text}
                  </LinkButton>

                  {content.btns[0].modal && (
                    <AppModal 
                      modal={{...content.btns[0].modal, ...modal, 
                      body: <div dangerouslySetInnerHTML={{ __html: content.btns[0].modal.body }} />, 
                      }} 
                      setModal={setModal}  
                      />
                  )}
                </>
              )}

              {isAuthenticated && content.btns[1] && (
                <LinkButton
                  className="text-white mt-4"
                  href={content.btns[1].href}
                >
                  {content.btns[1].text}
                </LinkButton>
              )}
            </Col>
          </Row>
        )}
      </div>
    </section>
  );
};

export default Hero;
