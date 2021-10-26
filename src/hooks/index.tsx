import React from 'react';

import { FetchProvider } from './useFetch';
import { NavigationProvider } from './useNavigation';
import { ThemeColorsProvider } from './useThemeColors';

export const AppProvider: React.FC = ({ children }) => {
  return (
    <ThemeColorsProvider>
      <NavigationProvider>
        <FetchProvider>{children}</FetchProvider>
      </NavigationProvider>
    </ThemeColorsProvider>
  );
};
