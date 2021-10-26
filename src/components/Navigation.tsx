import React from 'react';

import { Link as ReactRouter } from 'react-router-dom';

import { Box, Link } from '@chakra-ui/layout';
import { Icon, Image } from '@chakra-ui/react';

import logoImg from '../assets/logo.png';
import { useNavigation } from '../hooks/useNavigation';
import { useThemeColors } from '../hooks/useThemeColors';
import routes from '../routes/routes';
import { ColorModeSwitcher } from './ColorModeSwitcher';

export const Navigation: React.FC = () => {
  const { path } = useNavigation();
  const { navBackground } = useThemeColors();
  const { linkColor, linkBgHover, linkColorHover } = useThemeColors();

  return (
    <Box
      position="fixed"
      left={0}
      width={['100%', '100%', '20%', '14%']}
      top={0}
      height="100vh"
      bg={navBackground}
      shadow="xl"
    >
      <Image mb={4} src={logoImg} alt="Rick and Morty" pt={8} px={4} />
      {routes.map(route => (
        <Link
          key={route.name}
          to={route.path}
          as={ReactRouter}
          fontSize={18}
          style={{
            textDecoration: 'none',
          }}
          color={route.path === path ? linkColorHover : linkColor}
        >
          <Box
            width="100%"
            display="flex"
            alignItems="center"
            p={6}
            textDecoration="none"
            _hover={{
              backgroundColor: linkBgHover,
              color: linkColorHover,
            }}
            style={{
              transition: '200ms',
            }}
          >
            <Icon as={route.icon} mr={2} fontSize={20} /> {route.name}
          </Box>
        </Link>
      ))}

      <ColorModeSwitcher position="absolute" bottom={4} left={4} />
    </Box>
  );
};
