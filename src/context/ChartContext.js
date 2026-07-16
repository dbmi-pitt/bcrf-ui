import { createContext, useEffect, useState, useEffectEvent } from 'react';
import API from '@/lib/api';
import ENVS from '@/lib/envs';
import URLS from '@/lib/urls';
import log from 'xac-loglevel';

const CharContext = createContext({});

export const ChartProvider = ({ children }) => {
  useEffect(() => {}, []);

  return (
    <CharContext.Provider
      value={{
  
      }}
    >
      {children}
    </CharContext.Provider>
  );
};

export default CharContext;
