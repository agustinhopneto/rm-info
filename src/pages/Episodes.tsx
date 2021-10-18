import React, { useCallback, useEffect, useState } from 'react';

import { useForm } from 'react-hook-form';

import { SearchIcon } from '@chakra-ui/icons';
import { Heading, SimpleGrid } from '@chakra-ui/layout';
import {
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  useDisclosure,
} from '@chakra-ui/react';

import { api } from '../apis/api';
import { DataModal } from '../components/DataModal';
import { Empty } from '../components/Empty';
import { ListPaginator } from '../components/ListPaginator';
import { Loading } from '../components/Loading';
import { MotionBox } from '../components/MotionBox';
import { useThemeColors } from '../hooks/themeColors';
import { Episode, EpisodeFilters, Meta } from '../utils/contants';
import { scrollToTop } from '../utils/functions';

export const Episodes: React.FC = () => {
  const { heading, buttonBg, shape, title, text, span } = useThemeColors();
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<Meta>({} as Meta);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [isLoading, setIsLoading] = useState(false);
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
    </>
  );
};
