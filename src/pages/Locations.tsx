import React, { useCallback, useEffect, useState } from 'react';

import { SearchIcon } from '@chakra-ui/icons';
import { Heading } from '@chakra-ui/layout';
import { IconButton, useDisclosure } from '@chakra-ui/react';

import { api } from '../apis/api';
import { useThemeColors } from '../hooks/themeColors';
import { Location, LocationFilters, Meta } from '../utils/contants';

export const Locations: React.FC = () => {
  const { heading, buttonBg } = useThemeColors();
  const { onOpen: onOpenFilter } = useDisclosure();
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<Meta>({} as Meta);
  const [locations, setLocations] = useState<Location[]>([]);

  const loadLocations = useCallback(async () => {
    try {
      const response = await api.get<{ info: Meta; results: Location[] }>(
        `/location`,
        {
          params: {
            page,
          },
        },
      );

      setMeta(response.data.info);
      setLocations(response.data.results);
    } catch (err) {
      setLocations([]);
    }
  }, [page]);

  useEffect(() => {
    loadLocations();
  }, [loadLocations]);

  return (
    <Heading color={heading} mb={8} display="flex">
      Locations
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
  );
};
