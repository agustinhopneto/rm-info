import * as React from 'react';
import '@fontsource/paytone-one';
import '@fontsource/nunito-sans';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';

import { ThemeColorsProvider } from './hooks/themeColors';
import { theme } from './styles/theme';

import { AppContent } from './components/AppContent';

import './styles/global.css';
import { NavigationProvider } from './hooks/useNavigation';

export const App: React.FC = () => (
  <BrowserRouter>
    <ChakraProvider theme={theme}>
      <ThemeColorsProvider>
        <NavigationProvider>
          <AppContent />
        </NavigationProvider>
      </ThemeColorsProvider>
    </ChakraProvider>
  </BrowserRouter>
);
