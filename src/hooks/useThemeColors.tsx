import React, { createContext, useContext } from 'react';

import { useColorModeValue } from '@chakra-ui/color-mode';

interface ThemeColorsProps {
  themeButton: string;
  bodyBackground: string;
  navBackground: string;
  heading: string;
  buttonBg: string;
  buttonColor: string;
  buttonBgHover: string;
  title: string;
  text: string;
  shape: string;
  span: string;
  linkColor: string;
  linkBgHover: string;
  linkColorHover: string;
  paginationText: string;
  paginationBgActive: string;
  paginationTextActive: string;
}

const ThemeColorsContext = createContext<ThemeColorsProps>(
  {} as ThemeColorsProps,
);

export const ThemeColorsProvider: React.FC = ({ children }) => (
  <ThemeColorsContext.Provider
    value={{
      themeButton: useColorModeValue('blue.900', 'yellow.300'),
      navBackground: useColorModeValue('white', 'gray.800'),
      bodyBackground: useColorModeValue('gray.50', 'gray.900'),
      heading: useColorModeValue('cyan.500', 'cyan.100'),
      buttonBg: useColorModeValue('cyan.500', 'cyan.100'),
      buttonColor: useColorModeValue('gray.50', 'gray.900'),
      buttonBgHover: useColorModeValue('cyan.700', 'cyan.300'),
      title: useColorModeValue('cyan.700', 'cyan.300'),
      text: useColorModeValue('gray.600', 'gray.300'),
      span: useColorModeValue('gray.400', 'gray.500'),
      linkColor: useColorModeValue('gray.500', 'gray.400'),
      linkBgHover: useColorModeValue('gray.100', 'gray.700'),
      linkColorHover: useColorModeValue('teal.400', 'teal.300'),
      shape: useColorModeValue('white', 'gray.800'),
      paginationText: useColorModeValue('gray.500', 'gray.500'),
      paginationTextActive: useColorModeValue('gray.600', 'gray.300'),
      paginationBgActive: useColorModeValue('gray.600', 'gray.300'),
    }}
  >
    {children}
  </ThemeColorsContext.Provider>
);

export const useThemeColors = (): ThemeColorsProps => {
  return useContext(ThemeColorsContext);
};
