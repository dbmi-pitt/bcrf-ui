import { createContext, useEffect, useState, useEffectEvent } from 'react';
import API from '@/lib/api';
import ENVS from '@/lib/envs';
import URLS from '@/lib/urls';
import log from 'xac-loglevel';

const AppContext = createContext({});

export const AppProvider = ({ children }) => {

  const [content, setContent] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const fetchLocale = async () => {
    let path =  location.pathname
    path = path === '/' ? 'index' : path
    const url = URLS.api.local(`content/locale?p=/en/${path}.json`);
    const results = await API.fetch({ url, method: 'GET' });
    if (Object.values(results).length) {
      setContent({...content, locale: results});
    }
  };

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
      fetchLocale();
      fetchBannerContent();
      fetchSummaryDataSources();
    }
    loadData();
    setLoglevel();
  }, []);

  const signOut = () => {
    // TODO: Implement sign out logic here, such as clearing tokens or session data
    setIsAuthenticated(false);
  };

  return (
    <AppContext.Provider
      value={{
        content,
        isAuthenticated,
        signOut
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
