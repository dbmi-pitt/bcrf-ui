'use client';

import React, { useContext, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import LinkButton from '@/components/LinkButton';
import AppContext from '@/context/AppContext';
import Button from 'react-bootstrap/Button';
import AuthContext from '@/context/AuthContext';

const Hero = ({ content }) => {
  const { isAuthenticated } = useContext(AuthContext);

  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

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
                  <LinkButton className=" text-white mt-4" onClick={handleShow}>
                    {content.btns[0].text}
                  </LinkButton>

                  <Modal show={showModal} onHide={handleClose}>
                    <Modal.Header closeButton>
                      <Modal.Title>Sign Up!</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      Thank you for your interest!<br></br>
                      <br></br>
                      Please contact us via
                      <a href="mailto:BCRFGDH@pitt.edu">BCRFGDH@pitt.edu</a>.
                    </Modal.Body>
                    <Modal.Footer>
                      <Button variant="secondary" onClick={handleClose}>
                        Close
                      </Button>
                    </Modal.Footer>
                  </Modal>
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
