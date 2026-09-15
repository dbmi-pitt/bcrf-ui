'use client';

import UserIcon from '@/components/icons/UserIcon';
import RegisterIcon from '@/components/icons/RegisterIcon';
import AuthContext from '@/context/AuthContext';
import Image from 'next/image';
import Link from 'next/link';
import { useContext } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Dropdown from 'react-bootstrap/Dropdown'

function AppNavBar() {
  const { isAuthenticated, logOut, user } = useContext(AuthContext);

  return (
    <Navbar sticky={'top'} variant={'light'} expand="lg" className="c-navbar">
      <Container fluid>
        <a href="/" className={'ms-3 align-items-center d-flex gap-3'}>
          <Image
            src={'/imgs/partnership-bcrf-logo.png'}
            className="c-navbar__logo w-fixed"
            width="145"
            height="105"
            alt="BCRF logo"
          />{' '}
          <span className='c-navbar__divider'></span>
          <span className="c-navbar__tagline">
            <span className='font--Inter--ExtraBold text-uppercase'>Global Data Hub</span><br />
            <span className='font--Inter--Medium'>A partnership between BCRF <br />
            and the University of Pittsburgh</span>
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
              {/*<Nav className={'me-4'}>*/}
              {/*  <Link href={'/projects/create'}>*/}
              {/*    <span className="me-1">CREATE PROJECT</span>*/}
              {/*    <RegisterIcon className="align-baseline" />*/}
              {/*  </Link>*/}
              {/*</Nav>*/}
              <Nav className={'me-0'}>
                <Dropdown className="c-navbar__user">
                  <Dropdown.Toggle
                    className="c-navbar__link-button"
                    id="user-menu"
                  >
                    <UserIcon className="align-baseline" />
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item disabled>
                      <span
                        className="me-1 text-truncate text-muted"
                        title={user.email}
                      >
                        {user.email}
                      </span>
                    </Dropdown.Item>
                    <Dropdown.Item href="/users">User Directory</Dropdown.Item>
                    <Dropdown.Item
                      onClick={async () => {
                        await logOut();
                      }}
                    >
                      Log out
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Nav>
            </>
          )}
          {!isAuthenticated && (
            <Nav className={'me-0'}>
              <a href="/login">
                <span className="me-1">LOG IN</span>
                <UserIcon className="align-baseline" />
              </a>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppNavBar;
