import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Image from "next/image";

function AppFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="c-footer text-center text-lg-start">
      <div className="container p-4 pb-0">
        <section aria-label="Footer navigation">
          <div className="row mb-4">
            <div className="col col--filler"></div>
            <div className="col col-lg-6 col-xl-5 mx-auto my-3">
              <div className="c-footer__logos">
                <Image
                  src="/imgs/bcrf-logo-white-text.png"
                  className="w-fixed"
                  alt="BCRF Logo"
                  width={159}
                  height={101}
                />
                <Image
                  src="/imgs/upitt-logo-white-text.png"
                  className="w-fixed"
                  alt="U-Pitt Logo"
                  width={229}
                  height={101}
                />
              </div>
              <p className="c-footer__meta c-footer__tagline my-4">
                A partnership between BCRF and{" "}
                <span> the University of Pittsburgh</span>
              </p>
            </div>
          </div>
        </section>
      </div>
      <div
        aria-label="Footer copyright"
        className="c-footer__meta bg--blue--primary--dk text-center p-3"
      >
        &copy; Copyright {year}, Breast Cancer Research Foundation
      </div>
    </footer>
  );
}

export default AppFooter;
