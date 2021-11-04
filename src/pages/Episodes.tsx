import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { useForm } from 'react-hook-form';

import { SearchIcon } from '@chakra-ui/icons';
import { Heading, SimpleGrid } from '@chakra-ui/layout';
import {
  Box,
  FormControl,
  FormLabel,
  IconButton,
  Image,
  Input,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
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
import { Episode, EpisodeFilters } from '../utils/contants';
import { getIdsFromUrls, scrollToTop } from '../utils/functions';

export const Episodes: React.FC = () => {
  const { heading, buttonBg, shape, title, text, span, linkColorHover } =
    useThemeColors();

  const {
    episodes,
    loadEpisodes,
    episodesMeta,
    charactersByIds,
    loadCharactersByIds,
    isLoading,
  } = useFetch();

  const { getCache } = useCache();

  const [page, setPage] = useState(() => {
    const cachedPage = getCache<number>('episode-page');

    if (!cachedPage) {
      return 1;
    }

    return cachedPage;
  });

  const [selectedEpisode, setSelectedEpisode] = useState<Episode>(
    {} as Episode,
  );

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenFilter,
    onOpen: onOpenFilter,
    onClose: onCloseFilter,
  } = useDisclosure();

  const defaultFilters = useMemo(() => {
    const cachedFilters = getCache<EpisodeFilters>('episode-filters');

    return cachedFilters;
  }, [getCache]);

  const { register, getValues } = useForm<EpisodeFilters>({
    defaultValues: defaultFilters,
  });

  useEffect(() => {
    loadEpisodes(getValues(), page);
  }, [loadEpisodes, getValues, page]);

  const handlePageChange = useCallback((currentPage: number) => {
    setPage(currentPage);
    scrollToTop();
  }, []);

  const handleSubmit = useCallback(async () => {
    setPage(1);
    onCloseFilter();
    await loadEpisodes(getValues(), 1);
  }, [loadEpisodes, onCloseFilter, getValues]);

  const handleSelectEpisode = useCallback(
    async (episode: Episode) => {
      setSelectedEpisode(episode);
      const charactersList = getIdsFromUrls(episode.characters);
      await loadCharactersByIds(charactersList);
      onOpen();
    },
    [onOpen, loadCharactersByIds],
  );

  return (
    <>
      {isLoading && <Loading />}
      <Heading color={heading} mb={8} display="flex">
        Episodes
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
      {episodes.length > 0 ? (
        <>
          <SimpleGrid autoColumns="auto" columns={[1, 2, 2, 3, 4]} spacing={3}>
            {episodes.map((episode, index) => (
              <MotionBox
                p={0}
                key={episode.id}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.1 * index + 0.75 },
                }}
                style={{ opacity: 0, y: 20 }}
                onClick={() => handleSelectEpisode(episode)}
              >
                <Stat
                  p={3}
                  border={0}
                  bg={shape}
                  borderRadius="md"
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
            ))}
          </SimpleGrid>
          <ListPaginator
            pagesQuantity={episodesMeta.pages}
            currentPage={page}
            onPageChange={handlePageChange}
          />
        </>
      ) : (
        <Empty title="Episodes not found! :(" />
      )}
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
        <FormControl>
          <FormLabel mb={0} color={span}>
            Episode
          </FormLabel>
          <Input
            {...register('episode')}
            color={text}
            _focus={{
              borderColor: buttonBg,
            }}
            type="search"
          />
        </FormControl>
      </DataModal>
      <DataModal
        isOpen={isOpen}
        onClose={onClose}
        title={`${selectedEpisode.episode} - ${selectedEpisode.name}`}
      >
        <Tabs isFitted>
          <TabList color={span} borderColor={span}>
            <Tab
              _selected={{ color: linkColorHover, borderColor: linkColorHover }}
            >
              Characters
            </Tab>
          </TabList>

          <TabPanels>
            <TabPanel p={0} mt={4}>
              {charactersByIds.length > 0 ? (
                charactersByIds.map((character, index) => (
                  <MotionBox
                    p={0}
                    animate={{
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.1 * index + 0.75 },
                    }}
                    style={{ opacity: 0, y: 20 }}
                    key={character.id}
                  >
                    <Box
                      p={3}
                      mb={2}
                      borderWidth={1}
                      borderRadius="md"
                      borderColor={span}
                      cursor="pointer"
                      transition="0.2s"
                      _hover={{
                        bg: 'rgba(125, 201, 245, 0.2)',
                      }}
                      display="flex"
                    >
                      <Image
                        display="flex"
                        objectFit="cover"
                        width="100%"
                        maxWidth="80px"
                        borderRadius="md"
                        src={character.image}
                        alt={character.name}
                        mr={4}
                      />
                      <div>
                        <StatLabel color={title}>#{character.id}</StatLabel>
                        <StatNumber
                          color={title}
                          fontSize="lg"
                          lineHeight={1.2}
                          mb={1.5}
                        >
                          {character.name}
                        </StatNumber>
                        <StatHelpText m={0} color={text}>
                          {character.species} / {character.gender}
                        </StatHelpText>
                      </div>
                    </Box>
                  </MotionBox>
                ))
              ) : (
                <Empty title="This episode hasn't characters! :(" />
              )}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </DataModal>
    </>
  );
};
