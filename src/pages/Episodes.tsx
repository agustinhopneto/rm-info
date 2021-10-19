import React, { useCallback, useEffect, useState } from 'react';

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

import { api } from '../apis/api';
import { DataModal } from '../components/DataModal';
import { Empty } from '../components/Empty';
import { ListPaginator } from '../components/ListPaginator';
import { Loading } from '../components/Loading';
import { MotionBox } from '../components/MotionBox';
import { useThemeColors } from '../hooks/themeColors';
import { Character, Episode, EpisodeFilters, Meta } from '../utils/contants';
import { getIdsFromUrls, scrollToTop } from '../utils/functions';

export const Episodes: React.FC = () => {
  const { heading, buttonBg, shape, title, text, span, linkColorHover } =
    useThemeColors();
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<Meta>({} as Meta);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [selectedEpisode, setSelectedEpisode] = useState<Episode>(
    {} as Episode,
  );
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenFilter,
    onOpen: onOpenFilter,
    onClose: onCloseFilter,
  } = useDisclosure();
  const { register, getValues } = useForm<EpisodeFilters>();

  const loadEpisodes = useCallback(
    async (filters?: EpisodeFilters) => {
      try {
        setIsLoading(true);
        const response = await api.get<{ info: Meta; results: Episode[] }>(
          `/episode`,
          {
            params: {
              page,
              ...filters,
            },
          },
        );

        setMeta(response.data.info);
        setEpisodes(response.data.results);
      } catch (err) {
        setEpisodes([]);
      } finally {
        setIsLoading(false);
      }
    },
    [page],
  );

  useEffect(() => {
    loadEpisodes();
  }, [loadEpisodes]);

  const handlePageChange = useCallback((currentPage: number) => {
    setPage(currentPage);
    scrollToTop();
  }, []);

  const handleSubmit = useCallback(() => {
    setPage(1);
    loadEpisodes(getValues());
    onCloseFilter();
  }, [loadEpisodes, onCloseFilter, getValues]);

  const loadCharacters = useCallback(async (charactersList: string) => {
    try {
      setIsLoading(true);
      const response = await api.get<Character[]>(
        `/character/${charactersList}`,
      );

      setCharacters(response.data);
    } catch (err) {
      setCharacters([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSelectEpisode = useCallback(
    async (episode: Episode) => {
      const charactersList = getIdsFromUrls(episode.characters);

      await loadCharacters(charactersList);

      setSelectedEpisode(episode);

      onOpen();
    },
    [onOpen, loadCharacters],
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
      <SimpleGrid autoColumns="auto" columns={[1, 2, 2, 3, 4]} spacing={3}>
        {episodes.length > 0 ? (
          episodes.map(episode => (
            <MotionBox p={0}>
              <Stat
                onClick={() => handleSelectEpisode(episode)}
                borderWidth={1}
                p={3}
                border={0}
                bg={shape}
                key={episode.id}
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
          ))
        ) : (
          <Empty title="Episodes not found! :(" />
        )}
      </SimpleGrid>
      <ListPaginator
        pagesQuantity={meta.pages}
        currentPage={page}
        onPageChange={handlePageChange}
      />
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
              {characters.length > 0 ? (
                characters.map(character => (
                  <MotionBox p={0}>
                    <Box
                      borderWidth={1}
                      p={3}
                      key={character.id}
                      mb={2}
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