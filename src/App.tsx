import * as React from 'react';

import { BrowserRouter } from 'react-router-dom';

import '@fontsource/paytone-one';
import '@fontsource/nunito-sans';
import { ChakraProvider } from '@chakra-ui/react';

import { AppContent } from './components/AppContent';
import { AppProvider } from './hooks';
import { theme } from './styles/theme';
import './styles/global.css';

export const App: React.FC = () => (
  <BrowserRouter>
    <ChakraProvider theme={theme}>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ChakraProvider>
  </BrowserRouter>
);
