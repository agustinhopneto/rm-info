import React, { useCallback, useEffect, useState } from 'react';
import {
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Select,
  Tag,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { Box, Heading, SimpleGrid } from '@chakra-ui/layout';
import { Image } from '@chakra-ui/image';
import {
  Container,
  Next,
  PageGroup,
  Paginator,
  Previous,
} from 'chakra-paginator';
import { SearchIcon } from '@chakra-ui/icons';
import { useForm } from 'react-hook-form';

import { api } from '../apis/api';
import { useThemeColors } from '../hooks/themeColors';
import {
  Character,
  CharacterGender,
  CharacterStatus,
  CharacterFilters,
  Meta,
} from '../utils/contants';
import { MotionBox } from '../components/MotionBox';
import { DataModal } from '../components/DataModal';
import { Empty } from '../components/Empty';
import { Loading } from '../components/Loading';

const tagColors = {
  Alive: 'green.500',
  Dead: 'red.500',
  unknown: 'gray.400',
};

export const Characters: React.FC = () => {
  const {
    heading,
    buttonColor,
    buttonBg,
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
  const [isLoading, setIsLoading] = useState(false);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [meta, setMeta] = useState<Meta>({} as Meta);
  const [selectedCharacter, setSelectedCharacter] = useState<Character>(
    {} as Character,
  );
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenFilter,
    onOpen: onOpenFilter,
    onClose: onCloseFilter,
  } = useDisclosure();
  const { register, getValues } = useForm<CharacterFilters>();

  const loadCharacters = useCallback(
    async (filters?: CharacterFilters) => {
      try {
        setIsLoading(true);
        const response = await api.get<{ info: Meta; results: Character[] }>(
          `/character`,
          {
            params: {
              page,
              ...filters,
            },
          },
        );

        setMeta(response.data.info);
        setCharacters(response.data.results);
      } catch (err) {
        setCharacters([]);
      } finally {
        setIsLoading(false);
      }
    },
    [page],
  );

  useEffect(() => {
    loadCharacters(getValues());
  }, [loadCharacters, getValues]);

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

  const handleSubmit = useCallback(() => {
    setPage(1);
    loadCharacters(getValues());
    onCloseFilter();
  }, [loadCharacters, onCloseFilter, getValues]);

  return (
    <>
      {isLoading && <Loading />}
      <Heading color={heading} mb={8} display="flex">
        Characters
        <IconButton
          ml={6}
          onClick={onOpenFilter}
          variant="outline"
          aria-label="Search database"
          icon={<SearchIcon />}
          size="md"
          color={buttonBg}
          borderColor={buttonBg}
        />
      </Heading>

      {characters.length > 0 ? (
        <>
          <SimpleGrid autoColumns="auto" columns={[2, 3, 4, 5, 6]} spacing={4}>
            {characters.map(character => (
              <MotionBox
                position="relative"
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
                  <Box>
                    <Text
                      color={title}
                      fontWeight="bold"
                      fontSize="lg"
                      mb={1}
                      lineHeight={1}
                    >
                      {character.name}
                    </Text>
                    <Text
                      color={span}
                      fontSize="md"
                      lineHeight={1}
                      fontStyle="italic"
                    >
                      {character.species} / {character.gender}
                    </Text>
                  </Box>
                </Box>
                <Tag
                  position="absolute"
                  bg={buttonBg}
                  color={buttonColor}
                  fontWeight="extrabold"
                  top={2}
                  right={2}
                  shadow="md"
                >
                  #{character.id}
                </Tag>
              </MotionBox>
            ))}
          </SimpleGrid>
          <Paginator
            pagesQuantity={meta.pages}
            currentPage={page}
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
              <PageGroup
                color={paginationText}
                isInline
                align="center"
                mx={2}
              />
              <Next color={paginationText}>Next</Next>
            </Container>
          </Paginator>
        </>
      ) : (
        <Empty title="Characters not found! :(" />
      )}

      <DataModal
        isOpen={isOpen}
        onClose={onClose}
        title={selectedCharacter.name}
      >
        <Box position="relative">
          <Image
            objectFit="cover"
            width="100%"
            borderRadius="md"
            src={selectedCharacter.image}
            alt={selectedCharacter.name}
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
            #{selectedCharacter.id}
          </Tag>
        </Box>
        <Box borderRadius="md" bg={bodyBackground} p={4} mb={3}>
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

      <DataModal
        isOpen={isOpenFilter}
        onClose={onCloseFilter}
        title="Filters"
        actionButtonTitle="Search"
        actionButton={handleSubmit}
      >
        <FormControl mb={4}>
          <FormLabel mb={0} color={span}>
            Name
          </FormLabel>
          <Input
            {...register('name')}
            color={text}
            _focus={{
              borderColor: buttonBg,
            }}
            type="search"
          />
        </FormControl>
        <FormControl mb={4}>
          <FormLabel mb={0} color={span}>
            Species
          </FormLabel>
          <Input
            {...register('species')}
            color={text}
            _focus={{
              borderColor: buttonBg,
            }}
            type="search"
          />
        </FormControl>
        <FormControl mb={4}>
          <FormLabel mb={0} color={span}>
            Type
          </FormLabel>
          <Input
            {...register('type')}
            color={text}
            _focus={{
              borderColor: buttonBg,
            }}
            type="search"
          />
        </FormControl>
        <FormControl mb={4}>
          <FormLabel mb={0} color={span}>
            Status
          </FormLabel>
          <Select
            {...register('status')}
            color={text}
            placeholder="Select status"
            _focus={{
              borderColor: buttonBg,
            }}
          >
            {Object.values(CharacterStatus).map(status => (
              <option key={status}>{status}</option>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <FormLabel mb={0} color={span}>
            Gender
          </FormLabel>
          <Select
            {...register('gender')}
            color={text}
            placeholder="Select gender"
            _focus={{
              borderColor: buttonBg,
            }}
          >
            {Object.values(CharacterGender).map(gender => (
              <option key={gender}>{gender}</option>
            ))}
          </Select>
        </FormControl>
      </DataModal>
    </>
  );
};
