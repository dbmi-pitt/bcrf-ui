import RegisterIcon from '@/components/icons/RegisterIcon';
import LogInIcon from '@/components/icons/LogInIcon';
import LogOutIcon from '@/components/icons/LogOutIcon';
import AuthContext from '@/context/AuthContext';
import Image from 'next/image';
import Link from 'next/link';
import { useContext } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

function AppNavBar() {
  const { isAuthenticated, logOut } = useContext(AuthContext);

  return (
    <Navbar sticky={'top'} variant={'light'} expand="lg" className="c-navbar">
      <Container fluid>
        <a href="/" className={'ms-3 align-items-center d-flex gap-3'}>
          <Image
            src={'/imgs/brand-logo-cropped.png'}
            className="c-navbar__logo w-fixed"
            width="178"
            height="65"
            alt="BCRF logo"
          />{' '}
          <span className="c-navbar__tagline">
            A partnership between BCRF <br />
            and the University of Pittsburgh
          </span>
        </a>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end c-navbar__menu">
          {isAuthenticated && (
            <>
              <Nav className={'me-4'}>
                <Link href={'/sources'}>
                  <span className="me-1">EXPLORE</span>
                  <i className="bi bi-search"></i>
                </Link>
              </Nav>
              <Nav className={'me-4'}>
                <Link href={'/projects/create'}>
                  <span className="me-1">CREATE PROJECT</span>
                  <RegisterIcon className="align-baseline" />
                </Link>
              </Nav>
              <Nav className={'me-0'}>
                <button
                  type="button"
                  className="c-navbar__link-button"
                  onClick={async () => {
                    await logOut();
                  }}
                >
                  <span className="me-1">LOG OUT</span>
                  <LogOutIcon className="align-baseline" />
                </button>
              </Nav>
            </>
          )}
          {!isAuthenticated && (
            <Nav className={'me-0'}>
              <a href="/login">
                <span className="me-1">LOG IN</span>
                <LogInIcon className="align-baseline" />
              </a>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppNavBar;
