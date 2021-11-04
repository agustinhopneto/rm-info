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
import { Location, LocationFilters } from '../utils/contants';
import { getIdsFromUrls, scrollToTop } from '../utils/functions';

export const Locations: React.FC = () => {
  const { heading, buttonBg, shape, title, text, span, linkColorHover } =
    useThemeColors();

  const {
    isLoading,
    loadLocations,
    loadCharactersByIds,
    locations,
    locationsMeta,
    charactersByIds,
  } = useFetch();

  const { getCache } = useCache();

  const [page, setPage] = useState(() => {
    const cachedPage = getCache<number>('location-page');

    if (!cachedPage) {
      return 1;
    }

    return cachedPage;
  });

  const [selectedLocation, setSelectedLocation] = useState<Location>(
    {} as Location,
  );

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenFilter,
    onOpen: onOpenFilter,
    onClose: onCloseFilter,
  } = useDisclosure();

  const defaultFilters = useMemo(() => {
    const cachedFilters = getCache<LocationFilters>('location-filters');

    return cachedFilters;
  }, [getCache]);

  const { register, getValues } = useForm<LocationFilters>({
    defaultValues: defaultFilters,
  });

  useEffect(() => {
    loadLocations(getValues(), page);
  }, [loadLocations, getValues, page]);

  const handlePageChange = useCallback((currentPage: number) => {
    setPage(currentPage);
    scrollToTop();
  }, []);

  const handleSubmit = useCallback(async () => {
    setPage(1);
    onCloseFilter();
    await loadLocations(getValues(), 1);
  }, [loadLocations, onCloseFilter, getValues]);

  const handleSelectedLocation = useCallback(
    async (location: Location) => {
      setSelectedLocation(location);
      const charactersList = getIdsFromUrls(location.residents);
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
      <SimpleGrid autoColumns="auto" columns={[1, 2, 2, 3, 4]} spacing={3}>
        {locations.length > 0 ? (
          locations.map((location, index) => (
            <MotionBox
              p={0}
              animate={{
                opacity: 1,
                y: 0,
                transition: { duration: 0.1 * index + 0.75 },
              }}
              style={{ opacity: 0, y: 20 }}
              onClick={() => handleSelectedLocation(location)}
            >
              <Stat
                borderWidth={1}
                p={3}
                border={0}
                bg={shape}
                key={location.id}
                borderRadius="md"
                cursor="pointer"
                transition="0.2s"
                _hover={{
                  bg: 'rgba(125, 201, 245, 0.2)',
                }}
              >
                <StatLabel color={title}>{location.type}</StatLabel>
                <StatNumber
                  color={title}
                  fontSize="lg"
                  lineHeight={1.2}
                  mb={1.5}
                >
                  {location.name}
                </StatNumber>
                <StatHelpText m={0} color={text}>
                  {location.dimension}
                </StatHelpText>
              </Stat>
            </MotionBox>
          ))
        ) : (
          <Empty title="Episodes not found! :(" />
        )}
      </SimpleGrid>
      <ListPaginator
        pagesQuantity={locationsMeta.pages}
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
        <FormControl>
          <FormLabel mb={0} color={span}>
            Dimension
          </FormLabel>
          <Input
            {...register('dimension')}
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
        title={selectedLocation.name}
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
                charactersByIds.map(character => (
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
