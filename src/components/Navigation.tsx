import React from 'react';
import { Box } from '@chakra-ui/layout';
import { Image } from '@chakra-ui/react';

import { ColorModeSwitcher } from './ColorModeSwitcher';

import logoImg from '../assets/logo.png';
import { useThemeColors } from '../hooks/themeColors';

export const Navigation: React.FC = () => {
  const { navBackground } = useThemeColors();

  return (
    <Box
      position="fixed"
      left={0}
      width={['24%', '20%', '18%', '14%']}
      top={0}
      height="100vh"
      bg={navBackground}
      shadow="xl"
    >
      <Image src={logoImg} alt="Rick and Morty" p={6} />

      <ColorModeSwitcher position="absolute" bottom={4} left={4} />
    </Box>
  );
};
