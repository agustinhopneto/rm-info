import React from 'react';
import { Box, BoxProps } from '@chakra-ui/layout';
import { CustomDomComponent, motion } from 'framer-motion';

type Props = CustomDomComponent<BoxProps>;

const AnimatedBox = motion<BoxProps>(Box);

export const MotionBox: React.FC<Props | any> = ({ children, ...rest }) => {
  return (
    <AnimatedBox
      p={4}
      borderRadius="md"
      display="flex"
      flexDirection="column"
      shadow="sm"
      cursor="pointer"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.99 }}
      {...rest}
    >
      {children}
    </AnimatedBox>
  );
};
