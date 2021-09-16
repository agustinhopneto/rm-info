import React from 'react';
import { Box } from '@chakra-ui/layout';
import { Spinner } from '@chakra-ui/react';

export const Loading: React.FC = () => {
  return (
    <Box
      position="absolute"
      top={0}
      left={0}
      width="100%"
      height="100%"
      bg="rgba(0, 0, 0, 0.15)"
      style={{
        backdropFilter: 'blur(5px)',
      }}
      zIndex={2}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Spinner size="xl" color="teal.500" thickness="4px" emptyColor="white" />
    </Box>
  );
};
