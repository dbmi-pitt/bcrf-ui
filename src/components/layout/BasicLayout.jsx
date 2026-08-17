import { Container } from 'react-bootstrap';
import AppFooter from './AppFooter';
import AppNavBar from './AppNavBar';

const BasicLayout = ({ children, classNameMain = '', fluid = true }) => {
  return (
    <div className="body__wrapper bg--dirtyWhite">
      <AppNavBar />
      <Container fluid={fluid}>
        <main className={`c-main container--card ${classNameMain}`}>
          {children}
        </main>
      </Container>
      <AppFooter />
    </div>
  );
};

export default BasicLayout;
