import React from 'react';

import { Box, Image, Tag, Text } from '@chakra-ui/react';

import { useThemeColors } from '../hooks/useThemeColors';
import { Character } from '../utils/contants';

type Props = {
  character: Character;
};

const tagColors = {
  Alive: 'green.500',
  Dead: 'red.500',
  unknown: 'gray.400',
};

export const CharacterInfo: React.FC<Props> = ({ character }) => {
  const { buttonBg, buttonColor, bodyBackground, title, text } =
    useThemeColors();

  return (
    <>
      <Box position="relative">
        <Image
          objectFit="cover"
          width="100%"
          borderRadius="md"
          src={character.image}
          alt={character.name}
          mb="4"
        />
        <Tag
          position="absolute"
          bg={buttonBg}
          color={buttonColor}
          fontWeight="extrabold"
          bottom={-2}
          right={-2}
          shadow="md"
          size="lg"
        >
          #{character.id}
        </Tag>
      </Box>
      <Box borderRadius="md" bg={bodyBackground} p={4} mb={3}>
        <Text fontWeight="bold" fontSize="lg" color={title}>
          Species:{' '}
          <Text
            as="span"
            color={text}
            fontSize="lg"
            lineHeight={1}
            display="inline-block"
            fontWeight="normal"
          >
            {character.species}
          </Text>
        </Text>

        <Text fontWeight="bold" fontSize="lg" color={title}>
          Gender:{' '}
          <Text
            as="span"
            color={text}
            fontSize="lg"
            lineHeight={1}
            display="inline-block"
            fontWeight="normal"
          >
            {character.gender}
          </Text>
        </Text>

        <Text fontWeight="bold" fontSize="lg" color={title}>
          Type:{' '}
          <Text
            as="span"
            color={text}
            fontSize="lg"
            lineHeight={1}
            display="inline-block"
            fontWeight="normal"
          >
            {character.type ? character.type : '--'}
          </Text>
        </Text>

        <Text fontWeight="bold" fontSize="lg" color={title}>
          Origin:{' '}
          <Text
            as="span"
            color={text}
            fontSize="lg"
            lineHeight={1}
            display="inline-block"
            fontWeight="normal"
          >
            {character.origin ? character.origin.name : '--'}
          </Text>
        </Text>

        <Text fontWeight="bold" fontSize="lg" color={title}>
          Location:{' '}
          <Text
            as="span"
            color={text}
            fontSize="lg"
            lineHeight={1}
            display="inline-block"
            fontWeight="normal"
          >
            {character.location ? character.location.name : '--'}
          </Text>
        </Text>

        <Text fontWeight="bold" fontSize="lg" color={title}>
          Status:{' '}
          <Tag
            bg={tagColors[character.status]}
            color="white"
            fontWeight="extrabold"
          >
            {character.status}
          </Tag>
        </Text>
      </Box>
    </>
  );
};
