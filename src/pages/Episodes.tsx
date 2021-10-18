import React, { useCallback, useEffect, useState } from 'react';

import { SearchIcon } from '@chakra-ui/icons';
import { Heading, SimpleGrid } from '@chakra-ui/layout';
import {
  IconButton,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  useDisclosure,
} from '@chakra-ui/react';

import { api } from '../apis/api';
import { Empty } from '../components/Empty';
import { Loading } from '../components/Loading';
import { MotionBox } from '../components/MotionBox';
import { useThemeColors } from '../hooks/themeColors';
import { Episode, EpisodeFilters, Meta } from '../utils/contants';

export const Episodes: React.FC = () => {
  const { heading, buttonBg, span, title, text, shape } = useThemeColors();
  const { onOpen: onOpenFilter } = useDisclosure();
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<Meta>({} as Meta);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadLocations = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await api.get<{ info: Meta; results: Episode[] }>(
        `/episode`,
        {
          params: {
            page,
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
  }, [page]);

  useEffect(() => {
    loadLocations();
  }, [loadLocations]);

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
      <SimpleGrid autoColumns="auto" columns={[1, 2, 2, 3, 4]} spacing={2}>
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
    </>
  );
};
