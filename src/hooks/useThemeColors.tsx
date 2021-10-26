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

const ThemeColorsProvider: React.FC = ({ children }) => {
  const themeButton = useColorModeValue('blue.900', 'yellow.300');
  const navBackground = useColorModeValue('white', 'gray.800');
  const bodyBackground = useColorModeValue('gray.50', 'gray.900');
  const heading = useColorModeValue('cyan.500', 'cyan.100');
  const buttonBg = useColorModeValue('cyan.500', 'cyan.100');
  const buttonColor = useColorModeValue('gray.50', 'gray.900');
  const buttonBgHover = useColorModeValue('cyan.700', 'cyan.300');
  const title = useColorModeValue('cyan.700', 'cyan.100');
  const text = useColorModeValue('gray.600', 'gray.300');
  const span = useColorModeValue('gray.400', 'gray.500');
  const linkColor = useColorModeValue('gray.500', 'gray.400');
  const linkBgHover = useColorModeValue('gray.100', 'gray.700');
  const linkColorHover = useColorModeValue('teal.400', 'teal.300');
  const shape = useColorModeValue('white', 'gray.800');
  const paginationText = useColorModeValue('gray.500', 'gray.500');
  const paginationTextActive = useColorModeValue('gray.600', 'gray.300');
  const paginationBgActive = useColorModeValue('gray.300', 'gray.600');

  return (
    <ThemeColorsContext.Provider
      value={{
        themeButton,
        navBackground,
        bodyBackground,
        heading,
        buttonBg,
        buttonColor,
        buttonBgHover,
        shape,
        title,
        text,
        span,
        linkColor,
        linkBgHover,
        linkColorHover,
        paginationText,
        paginationBgActive,
        paginationTextActive,
      }}
    >
      {children}
    </ThemeColorsContext.Provider>
  );
};

const useThemeColors = (): ThemeColorsProps => {
  const context = useContext(ThemeColorsContext);

  return context;
};

export { ThemeColorsProvider, useThemeColors };
