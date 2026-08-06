import React, { useContext } from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Link from 'next/link';
import Image from 'next/image';
import ENVS from '@/lib/envs';
import AppContext from '@/context/AppContext';
import RegisterIcon from "@/components/icons/RegisterIcon";
import SignInIcon from "@/components/icons/SignInIcon";
import SignOutIcon from "@/components/icons/SignOutIcon";


function AppNavBar() {
  const { isAuthenticated, signOut } = useContext(AppContext);
  return (
    <Navbar sticky={"top"} variant={"light"} expand="lg" className="c-navbar">
      <Container fluid>
        <Link href="/" className={"ms-3 align-items-center d-flex gap-3"}>
          <Image
            src={"/imgs/brand-logo-cropped.png"}
            className="c-navbar__logo w-fixed"
            width="178"
            height="65"
            alt="BCRF logo"
          />{" "}
          <span className="c-navbar__tagline">
            A partnership between BCRF <br />
            and the University of Pittsburgh
          </span>
        </Link>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end c-navbar__menu">
          {isAuthenticated && (
            <>
              <Nav className={"me-4"}>
                <Link href={"/projects/search"}>
                  <span className="me-1">EXPLORE</span>
                  <i className="bi bi-search"></i>
                </Link>
              </Nav>
              <Nav className={"me-4"}>
                <Link href={"/projects/create"}>
                  <span className="me-1">CREATE PROJECT</span>
                  <RegisterIcon className="align-baseline" />
                </Link>
              </Nav>
              <Nav className={"me-0"}>
                <Link href={"/logout"} onClick={signOut}>
                  <span className="me-1">SIGN OUT</span>
                  <SignOutIcon className="align-baseline" />
                </Link>
              </Nav>
            </>
          )}
          {!isAuthenticated && (
            <Nav className={"me-0"}>
              <Link href={"/login"}>
                <span className="me-1">SIGN IN</span>
                <SignInIcon className="align-baseline" />
              </Link>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppNavBar;
