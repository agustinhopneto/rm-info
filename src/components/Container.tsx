import React from 'react';

import { Box } from '@chakra-ui/layout';

import { useThemeColors } from '../hooks/useThemeColors';

export const Container: React.FC = ({ children }) => {
  const { bodyBackground } = useThemeColors();
  return (
    <Box
      id="container"
      bg={bodyBackground}
      display="inline-block"
      verticalAlign="top"
      height="100vh"
      overflow="auto"
      width={['100%', '100%', '80%', '86%']}
      ml={['0%', '0%', '20%', '14%']}
      pt={8}
      px={4}
      pb={4}
    >
      {children}
    </Box>
  );
};
