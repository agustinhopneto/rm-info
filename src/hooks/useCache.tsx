import React, { createContext, useCallback, useContext } from 'react';

import { AppCacheKeys } from '../utils/contants';

interface CacheProps {
  setCache: <T>(key: string, data: T) => void;
  getCache: <T>(key: string) => T | undefined;
}

const CacheContext = createContext<CacheProps>({} as CacheProps);

const CacheProvider: React.FC = ({ children }) => {
  const setCache = useCallback(<T,>(key: string, data: T) => {
    const keyName = `${AppCacheKeys.APP}/${key}`;
    const dataString = JSON.stringify(data);

    localStorage.setItem(keyName, dataString);
  }, []);

  const getCache = useCallback(<T,>(key: string): T | undefined => {
    const keyName = `${AppCacheKeys.APP}/${key}`;
    return JSON.parse(localStorage.getItem(keyName) as string);
  }, []);

  return (
    <CacheContext.Provider value={{ setCache, getCache }}>
      {children}
    </CacheContext.Provider>
  );
};

const useCache = (): CacheProps => {
  const context = useContext(CacheContext);

  return context;
};

export { CacheProvider, useCache };
