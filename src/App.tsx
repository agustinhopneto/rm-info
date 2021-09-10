import * as React from 'react';
import '@fontsource/paytone-one';
import '@fontsource/nunito-sans';
import { ChakraProvider } from '@chakra-ui/react';
import { ThemeColorsProvider } from './hooks/themeColors';

import { Navigation } from './components/Navigation';
import { Container } from './components/Container';

import { Characters } from './pages/Characters';
import { theme } from './styles/theme';

import './styles/global.css';

export const App: React.FC = () => (
  <ChakraProvider theme={theme}>
    <ThemeColorsProvider>
      <Navigation />
      <Container>
        <Characters />
      </Container>
    </ThemeColorsProvider>
  </ChakraProvider>
);
