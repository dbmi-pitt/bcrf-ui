'use client'

import React from 'react';
import AppNavBar from './AppNavBar';
import AppFooter from './AppFooter';

const BleedLayout = ({ children, classNameMain = '' }) => {
  return (
    <div className="body__wrapper bg--dirtyWhite">
      <AppNavBar />
        <main className={`c-main m-0 ${classNameMain}`}>
          {children}
        </main>
      <AppFooter />
    </div>
  );
};
export default BleedLayout;
