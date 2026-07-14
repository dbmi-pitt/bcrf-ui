import React, { useContext } from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Image from 'next/image';
import ENVS from '@/lib/envs';
import AppContext from '@/context/AppContext';

function AppNavBar() {
  const { auth } = useContext(AppContext);
  return (
    <Navbar expand="lg" className="c-header" data-bs-theme="light">
      <Container fluid>
        <Navbar.Brand href="/">
          <Image
            alt={ENVS.app.name}
            src="/imgs/logo.png"
            width="30"
            height="30"
            className="w-fixed d-inline-block align-top"
          />{' '}
          <span>{ENVS.app.name}</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
      </Container>
    </Navbar>
  );
}

export default AppNavBar;
