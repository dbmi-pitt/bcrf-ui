import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

function AppFooter() {
  const year = new Date().getFullYear();
  return (
    <div className="c-footer bg-dark">
      <Container>
        <footer className={`py-3`}>
          <Row>
            <div className={'text-center nav--copyright'}>
              Copyright {year}
            </div>
          </Row>
        </footer>
      </Container>
    </div>
  );
}

export default AppFooter;
