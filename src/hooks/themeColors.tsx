import React, { createContext, useContext } from 'react';
import { useColorModeValue } from '@chakra-ui/color-mode';

interface ThemeColorsProps {
  bodyBackground: string;
  navBackground: string;
  heading: string;
  title: string;
  shape: string;
}

const ThemeColorsContext = createContext<ThemeColorsProps>(
  {} as ThemeColorsProps,
);

const ThemeColorsProvider: React.FC = ({ children }) => {
  const navBackground = useColorModeValue('white', 'gray.800');
  const bodyBackground = useColorModeValue('gray.50', 'gray.900');
  const heading = useColorModeValue('cyan.500', 'cyan.100');
  const title = useColorModeValue('cyan.700', 'cyan.100');
  const shape = useColorModeValue('white', 'gray.800');

  return (
    <ThemeColorsContext.Provider
      value={{ navBackground, bodyBackground, heading, shape, title }}
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
