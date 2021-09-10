import React from 'react';
import { Box } from '@chakra-ui/layout';
import { useThemeColors } from '../hooks/themeColors';

export const Container: React.FC = ({ children }) => {
  const { bodyBackground } = useThemeColors();
  return (
    <Box
      bg={bodyBackground}
      display="inline-block"
      verticalAlign="top"
      width={['76%', '80%', '82%', '86%']}
      p={8}
      height="100vh"
      ml={['24%', '20%', '18%', '14%']}
      overflow="auto"
    >
      {children}
    </Box>
  );
};
