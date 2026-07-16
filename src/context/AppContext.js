import { createContext, useEffect, useState, useEffectEvent } from 'react';
import API from '@/lib/api';
import ENVS from '@/lib/envs';
import URLS from '@/lib/urls';
import log from 'xac-loglevel';

const AppContext = createContext({});

export const AppProvider = ({ children }) => {

  const [content, setContent] = useState({});

  const fetchBannerContent = async () => {
    const url = URLS.api.local('content/banner');
    const results = await API.fetch({ url, method: 'GET' });
    if (Object.values(results).length) {
      setContent({...content, banner: results});
    }
  };

  const fetchSummaryDataSources = async () => {
    const url = URLS.api.local('content/summary');
    const results = await API.fetch({ url, method: 'GET' });
    if (Object.values(results).length) {
      setContent({...content, summary: results});
    }
  };

  const setLoglevel = async () => {
    // Set browser level loglevel
    log.setLevel(ENVS.logLevel);
    console.log('Browser logging in level:', await log.getLevel());
  };

  useEffect(() => {
    const loadData = async () => {
      fetchBannerContent();
      fetchSummaryDataSources();
    }
    loadData();
    setLoglevel();
  }, []);


  return (
    <AppContext.Provider
      value={{
        content,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
