import React, { useCallback, useEffect, useState } from 'react';

import { Tag, Text, useDisclosure } from '@chakra-ui/react';
import { Box, Heading, SimpleGrid } from '@chakra-ui/layout';
import { Image } from '@chakra-ui/image';

import {
  Container,
  Next,
  PageGroup,
  Paginator,
  Previous,
} from 'chakra-paginator';

import { api } from '../apis/api';
import { useThemeColors } from '../hooks/themeColors';
import { Character, Meta } from '../utils/contants';
import { MotionBox } from '../components/MotionBox';
import { DataModal } from '../components/DataModal';

const tagColors = {
  Alive: 'green.500',
  Dead: 'red.500',
  unknown: 'gray.400',
};

export const Characters: React.FC = () => {
  const {
    heading,
    shape,
    title,
    text,
    span,
    paginationBgActive,
    paginationTextActive,
    paginationText,
    bodyBackground,
  } = useThemeColors();
  const [page, setPage] = useState(1);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [meta, setMeta] = useState<Meta>({} as Meta);
  const [selectedCharacter, setSelectedCharacter] = useState<Character>(
    {} as Character,
  );
  const { isOpen, onOpen, onClose } = useDisclosure();

  const loadCharacters = useCallback(async () => {
    const response = await api.get<{ info: Meta; results: Character[] }>(
      `/character/?page=${page}&limit=5`,
    );

    setMeta(response.data.info);

    setCharacters(response.data.results);
  }, [page]);

  useEffect(() => {
    loadCharacters();
  }, [loadCharacters]);

  const handlePageChange = useCallback((currentPage: number) => {
    setPage(currentPage);

    const container = document.querySelector('#container');

    if (container) {
      container.scroll({
        top: 0,
        behavior: 'smooth',
      });
    }
  }, []);

  const handleSelectCharacter = useCallback(
    (character: Character) => {
      setSelectedCharacter(character);
      onOpen();
    },
    [onOpen],
  );

  return (
    <>
      <Heading color={heading} mb={8}>
        Characters
      </Heading>
      <SimpleGrid autoColumns="auto" columns={[2, 3, 4, 5, 6]} spacing={4}>
        {characters.map(character => (
          <MotionBox
            key={character.id}
            bg={shape}
            onClick={() => handleSelectCharacter(character)}
          >
            <Image
              objectFit="cover"
              width="100%"
              borderRadius="md"
              src={character.image}
              alt={character.name}
              mb="2"
            />
            <Box
              display="flex"
              flex="1"
              flexDirection="column"
              justifyContent="space-between"
            >
              <Box mb={4}>
                <Text
                  color={title}
                  fontWeight="bold"
                  fontSize="lg"
                  mb={1}
                  lineHeight={1}
                >
                  #{character.id} {character.name}
                </Text>
                <Text
                  color={span}
                  fontSize="md"
                  lineHeight={1}
                  fontStyle="italic"
                >
                  {character.gender} / {character.species}
                  {character.type && ` / ${character.type}`}
                </Text>
              </Box>
              <Box>
                <Tag
                  bg={tagColors[character.status]}
                  color="white"
                  fontWeight="extrabold"
                >
                  {character.status}
                </Tag>
              </Box>
            </Box>
          </MotionBox>
        ))}
      </SimpleGrid>

      <Paginator
        pagesQuantity={meta.pages}
        currentPage={1}
        onPageChange={currentPage => handlePageChange(currentPage)}
        outerLimit={1}
        innerLimit={1}
        activeStyles={{
          color: paginationTextActive,
          background: paginationBgActive,
        }}
      >
        <Container mt={5} justifyContent="center">
          <Previous color={paginationText}>Previous</Previous>
          <PageGroup color={paginationText} isInline align="center" mx={2} />
          <Next color={paginationText}>Next</Next>
        </Container>
      </Paginator>

      <DataModal
        isOpen={isOpen}
        onClose={onClose}
        title={`#${selectedCharacter.id} ${selectedCharacter.name}`}
      >
        <Image
          objectFit="cover"
          width="100%"
          borderRadius="md"
          src={selectedCharacter.image}
          alt={selectedCharacter.name}
          mb="4"
        />

        <Box borderRadius="md" bg={bodyBackground} p={4}>
          <Text fontWeight="bold" fontSize="lg" color={title}>
            Species:{' '}
            <Text
              color={text}
              fontSize="lg"
              lineHeight={1}
              display="inline-block"
              fontWeight="normal"
            >
              {selectedCharacter.species}
            </Text>
          </Text>

          <Text fontWeight="bold" fontSize="lg" color={title}>
            Gender:{' '}
            <Text
              color={text}
              fontSize="lg"
              lineHeight={1}
              display="inline-block"
              fontWeight="normal"
            >
              {selectedCharacter.gender}
            </Text>
          </Text>

          <Text fontWeight="bold" fontSize="lg" color={title}>
            Type:{' '}
            <Text
              color={text}
              fontSize="lg"
              lineHeight={1}
              display="inline-block"
              fontWeight="normal"
            >
              {selectedCharacter.type ? selectedCharacter.type : '--'}
            </Text>
          </Text>

          <Text fontWeight="bold" fontSize="lg" color={title}>
            Origin:{' '}
            <Text
              color={text}
              fontSize="lg"
              lineHeight={1}
              display="inline-block"
              fontWeight="normal"
            >
              {selectedCharacter.origin ? selectedCharacter.origin.name : '--'}
            </Text>
          </Text>

          <Text fontWeight="bold" fontSize="lg" color={title}>
            Location:{' '}
            <Text
              color={text}
              fontSize="lg"
              lineHeight={1}
              display="inline-block"
              fontWeight="normal"
            >
              {selectedCharacter.location
                ? selectedCharacter.location.name
                : '--'}
            </Text>
          </Text>

          <Text fontWeight="bold" fontSize="lg" color={title}>
            Status:{' '}
            <Tag
              bg={tagColors[selectedCharacter.status]}
              color="white"
              fontWeight="extrabold"
            >
              {selectedCharacter.status}
            </Tag>
          </Text>
        </Box>
      </DataModal>
    </>
  );
};
