import React, { createContext, useCallback, useContext } from 'react';

import { CacheKeys } from '../utils/contants';

interface CacheProps {
  setCache: <T>(key: CacheKeys, data: T) => void;
  getCache: <T>(key: CacheKeys) => T | undefined;
}

const CacheContext = createContext<CacheProps>({} as CacheProps);

const CacheProvider: React.FC = ({ children }) => {
  const setCache = useCallback(<T,>(key: CacheKeys, data: T) => {
    const keyName = `${CacheKeys.APP}/${key}`;
    const dataString = JSON.stringify(data);

    localStorage.setItem(keyName, dataString);
  }, []);

  const getCache = useCallback(<T,>(key: CacheKeys): T | undefined => {
    const keyName = `${CacheKeys.APP}/${key}`;
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
