import { Heading } from '@chakra-ui/layout';
import React from 'react';
import { useThemeColors } from '../hooks/themeColors';

export const Locations: React.FC = () => {
  const { heading } = useThemeColors();

  return (
    <Heading color={heading} mb={8}>
      Locations
    </Heading>
  );
};
