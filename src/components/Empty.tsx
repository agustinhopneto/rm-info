import React from 'react';

import { Image } from '@chakra-ui/image';
import { Box, Center, Text } from '@chakra-ui/layout';

import sadImg from '../assets/sad.svg';

type Props = {
  title: string;
};

export const Empty: React.FC<Props> = ({ title }) => {
  return (
    <Box width="100%" p={8}>
      <Center flexDirection="column">
        <Image width="200px" src={sadImg} alt="Sad" mb={4} />
        <Text
          fontSize="xl"
          color="teal.400"
          fontWeight="bold"
          lineHeight="1"
          textAlign="center"
        >
          {title}
        </Text>
      </Center>
    </Box>
  );
};
