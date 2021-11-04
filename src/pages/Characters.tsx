import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { useForm } from 'react-hook-form';

import { SearchIcon } from '@chakra-ui/icons';
import { Image } from '@chakra-ui/image';
import { Box, Heading, SimpleGrid } from '@chakra-ui/layout';
import {
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Select,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tag,
  Text,
  useDisclosure,
} from '@chakra-ui/react';

import { DataModal } from '../components/DataModal';
import { Empty } from '../components/Empty';
import { ListPaginator } from '../components/ListPaginator';
import { Loading } from '../components/Loading';
import { MotionBox } from '../components/MotionBox';
import { useCache } from '../hooks/useCache';
import { useFetch } from '../hooks/useFetch';
import { useThemeColors } from '../hooks/useThemeColors';
import {
  Character,
  CharacterGender,
  CharacterStatus,
  CharacterFilters,
} from '../utils/contants';
import { getIdsFromUrls, scrollToTop } from '../utils/functions';

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
    bodyBackground,
    linkColorHover,
  } = useThemeColors();

  const { getCache } = useCache();

  const {
    characters,
    loadCharacters,
    charactersMeta,
    episodesByIds,
    loadEpisodesByIds,
    isLoading,
  } = useFetch();

  const [page, setPage] = useState(() => {
    const cachedPage = getCache<number>('character-page');

    if (!cachedPage) {
      return 1;
    }

    return cachedPage;
  });

  const [selectedCharacter, setSelectedCharacter] = useState<Character>(
    {} as Character,
  );

  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    isOpen: isOpenFilter,
    onOpen: onOpenFilter,
    onClose: onCloseFilter,
  } = useDisclosure();

  const defaultFilters = useMemo(() => {
    const cachedFilters = getCache<CharacterFilters>('character-filters');

    return cachedFilters;
  }, [getCache]);

  const { register, getValues } = useForm<CharacterFilters>({
    defaultValues: defaultFilters,
  });

  useEffect(() => {
    loadCharacters(getValues(), page);
  }, [loadCharacters, page, getValues]);

  const handlePageChange = useCallback((currentPage: number) => {
    setPage(currentPage);
    scrollToTop();
  }, []);

  const handleSelectCharacter = useCallback(
    async (character: Character) => {
      const episodesList = getIdsFromUrls(character.episode);
      setSelectedCharacter(character);
      await loadEpisodesByIds(episodesList);
      onOpen();
    },
    [onOpen, loadEpisodesByIds],
  );

  const handleSubmit = useCallback(async () => {
    setPage(1);
    onCloseFilter();
    await loadCharacters(getValues(), 1);
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
          <SimpleGrid autoColumns="auto" columns={[2, 3, 4, 5, 6]} spacing={3}>
            {characters.map((character, index) => (
              <MotionBox
                position="relative"
                key={character.id}
                bg={shape}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.1 * index + 0.75 },
                }}
                style={{ opacity: 0, y: 20 }}
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
          <ListPaginator
            pagesQuantity={charactersMeta.pages}
            currentPage={page}
            onPageChange={handlePageChange}
          />
        </>
      ) : (
        <Empty title="Characters not found! :(" />
      )}

      <DataModal
        isOpen={isOpen}
        onClose={onClose}
        title={selectedCharacter.name}
      >
        <Tabs isFitted>
          <TabList color={span} borderColor={span}>
            <Tab
              _selected={{ color: linkColorHover, borderColor: linkColorHover }}
            >
              Info
            </Tab>
            <Tab
              _selected={{ color: linkColorHover, borderColor: linkColorHover }}
            >
              Episodes
            </Tab>
          </TabList>

          <TabPanels>
            <TabPanel p={0} mt={4}>
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
                    {selectedCharacter.origin
                      ? selectedCharacter.origin.name
                      : '--'}
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
            </TabPanel>
            <TabPanel p={0} mt={4}>
              {episodesByIds.length > 0 ? (
                episodesByIds.map(episode => (
                  <MotionBox p={0}>
                    <Stat
                      borderWidth={1}
                      p={3}
                      key={episode.id}
                      mb={2}
                      borderRadius="md"
                      borderColor={span}
                      cursor="pointer"
                      transition="0.2s"
                      _hover={{
                        bg: 'rgba(125, 201, 245, 0.2)',
                      }}
                    >
                      <StatLabel color={title}>{episode.episode}</StatLabel>
                      <StatNumber
                        color={title}
                        fontSize="lg"
                        lineHeight={1.2}
                        mb={1.5}
                      >
                        {episode.name}
                      </StatNumber>
                      <StatHelpText m={0} color={text}>
                        {episode.air_date}
                      </StatHelpText>
                    </Stat>
                  </MotionBox>
                ))
              ) : (
                <Empty title="This character hasn't episodes! :(" />
              )}
            </TabPanel>
          </TabPanels>
        </Tabs>
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
