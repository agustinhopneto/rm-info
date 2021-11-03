import React from 'react';

import { CacheProvider } from './useCache';
import { FetchProvider } from './useFetch';
import { NavigationProvider } from './useNavigation';
import { ThemeColorsProvider } from './useThemeColors';

export const AppProvider: React.FC = ({ children }) => {
  return (
    <ThemeColorsProvider>
      <NavigationProvider>
        <CacheProvider>
          <FetchProvider>{children}</FetchProvider>
        </CacheProvider>
      </NavigationProvider>
    </ThemeColorsProvider>
  );
};
