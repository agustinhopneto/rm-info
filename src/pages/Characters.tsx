import React, { useCallback, useEffect, useState } from 'react';

import { Tag, Text } from '@chakra-ui/react';
import { Box, Heading, SimpleGrid } from '@chakra-ui/layout';
import { Image } from '@chakra-ui/image';

import { useThemeColors } from '../hooks/themeColors';
import { Character } from '../utils/contants';
import { api } from '../apis/api';

export const Characters: React.FC = () => {
  const { heading, shape, title } = useThemeColors();
  const [characters, setCharacters] = useState<Character[]>([]);

  const loadCharacters = useCallback(async () => {
    const response = await api.get<{ results: Character[] }>('/character');

    setCharacters(response.data.results);
  }, []);

  useEffect(() => {
    loadCharacters();
  }, [loadCharacters]);

  return (
    <>
      <Heading color={heading} mb={12}>
        Characters
      </Heading>
      <SimpleGrid autoColumns="auto" columns={[1, 2, 2, 3, 4]} spacing={4}>
        {characters.map(character => (
          <Box
            key={character.id}
            bg={shape}
            p={4}
            borderRadius="md"
            display="flex"
            shadow="sm"
          >
            <Image
              borderRadius="md"
              src={character.image}
              alt={character.name}
              maxWidth={['10rem', '8rem', '6rem']}
            />
            <Box ml={4}>
              <Text
                color={title}
                fontWeight="bold"
                fontSize="xl"
                lineHeight={1.2}
                mb={1}
              >
                {character.name}
              </Text>
              <Tag bg="red.300" color="white" fontWeight="extrabold">
                {character.status}
              </Tag>
            </Box>
          </Box>
        ))}
      </SimpleGrid>
    </>
  );
};
