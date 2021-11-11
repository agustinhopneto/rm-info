import React, { createContext, useCallback, useContext, useState } from 'react';

import { api } from '../services/api';
import {
  Character,
  CharacterFilters,
  Entities,
  Episode,
  EpisodeFilters,
  Location,
  LocationFilters,
  Meta,
} from '../utils/contants';
import { useCache } from './useCache';

interface FetchProps {
  characters: Character[];
  episodes: Episode[];
  locations: Location[];
  charactersMeta: Meta;
  episodesMeta: Meta;
  locationsMeta: Meta;
  charactersByIds: Character[];
  episodesByIds: Episode[];
  locationsByIds: Location[];
  isLoading: boolean;
  loadCharacters: (filters?: CharacterFilters, page?: number) => Promise<void>;
  loadEpisodes: (filters?: EpisodeFilters, page?: number) => Promise<void>;
  loadLocations: (filters?: LocationFilters, page?: number) => Promise<void>;
  loadCharactersByIds: (charactersList: string) => Promise<void>;
  loadEpisodesByIds: (episodesList: string) => Promise<void>;
  loadLocationsByIds: (locationsList: string) => Promise<void>;
}

type LoadDataProps<T, Y> = {
  filters?: Y;
  page?: number;
  entity: Entities;
  setData: React.Dispatch<React.SetStateAction<T[]>>;
  setMeta: React.Dispatch<React.SetStateAction<Meta>>;
};

type LoadDataByIdsProps<T> = {
  ids: string;
  entity: Entities;
  setData: React.Dispatch<React.SetStateAction<T[]>>;
};

const FetchContext = createContext<FetchProps>({} as FetchProps);

export const FetchProvider: React.FC = ({ children }) => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [charactersMeta, setCharactersMeta] = useState<Meta>({} as Meta);
  const [charactersByIds, setCharactersByIds] = useState<Character[]>([]);

  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [episodesMeta, setEpisodesMeta] = useState<Meta>({} as Meta);
  const [episodesByIds, setEpisodesByIds] = useState<Episode[]>([]);

  const [locations, setLocations] = useState<Location[]>([]);
  const [locationsMeta, setLocationsMeta] = useState<Meta>({} as Meta);
  const [locationsByIds, setLocationsByIds] = useState<Location[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  const { getCache, setCache } = useCache();

  const loadData = useCallback(
    async <T, Y>({
      entity,
      filters,
      page,
      setMeta,
      setData,
    }: LoadDataProps<T, Y>): Promise<void> => {
      try {
        const cachedFilters = JSON.stringify(getCache<Y>(`${entity}-filters`));

        const cachedPage = getCache<number>(`${entity}-page`);

        if (cachedPage === page && cachedFilters === JSON.stringify(filters)) {
          const cachedData = getCache<T[]>(`${entity}`);
          const cachedMeta = getCache<Meta>(`${entity}-meta`);

          setMeta(cachedMeta as Meta);
          setData(cachedData as T[]);
          return;
        }

        setIsLoading(true);

        setCache<Y | undefined>(`${entity}-filters`, filters);
        setCache<number | undefined>(`${entity}-page`, page);

        const response = await api.get<{ info: Meta; results: T[] }>(
          `${entity}`,
          {
            params: {
              page: page || 1,
              ...filters,
            },
          },
        );

        const { results, info } = response.data;

        setCache<Meta>(`${entity}-meta`, info);
        setCache<T[]>(`${entity}`, results);

        setMeta(info);
        setData(results as T[]);
      } catch (err) {
        setMeta({} as Meta);
        setData([]);
      } finally {
        setIsLoading(false);
      }
    },
    [getCache, setCache],
  );

  const loadDataByIds = useCallback(
    async <T,>({
      ids,
      entity,
      setData,
    }: LoadDataByIdsProps<T>): Promise<void> => {
      try {
        setIsLoading(true);
        const response = await api.get<T[]>(`/${entity}/${ids}`);

        setData(response.data);
      } catch (err) {
        setData([]);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const loadCharacters = useCallback(
    async (filters?: CharacterFilters, page?: number) => {
      await loadData<Character, CharacterFilters>({
        filters,
        page,
        entity: Entities.CHARACTER,
        setData: setCharacters,
        setMeta: setCharactersMeta,
      });
    },
    [loadData],
  );

  const loadEpisodes = useCallback(
    async (filters?: EpisodeFilters, page?: number) => {
      await loadData<Episode, EpisodeFilters>({
        filters,
        page,
        entity: Entities.EPISODE,
        setData: setEpisodes,
        setMeta: setEpisodesMeta,
      });
    },
    [loadData],
  );

  const loadLocations = useCallback(
    async (filters?: LocationFilters, page?: number) => {
      await loadData<Location, LocationFilters>({
        filters,
        page,
        entity: Entities.LOCATION,
        setData: setLocations,
        setMeta: setLocationsMeta,
      });
    },
    [loadData],
  );

  const loadCharactersByIds = useCallback(
    async (charactersList: string): Promise<void> => {
      await loadDataByIds({
        ids: charactersList,
        entity: Entities.CHARACTER,
        setData: setCharactersByIds,
      });
    },
    [loadDataByIds],
  );

  const loadEpisodesByIds = useCallback(
    async (episodesList: string): Promise<void> => {
      await loadDataByIds({
        ids: episodesList,
        entity: Entities.EPISODE,
        setData: setEpisodesByIds,
      });
    },
    [loadDataByIds],
  );

  const loadLocationsByIds = useCallback(
    async (locationsList: string): Promise<void> => {
      await loadDataByIds({
        ids: locationsList,
        entity: Entities.LOCATION,
        setData: setLocationsByIds,
      });
    },
    [loadDataByIds],
  );

  return (
    <FetchContext.Provider
      value={{
        characters,
        episodes,
        locations,
        charactersMeta,
        episodesMeta,
        locationsMeta,
        charactersByIds,
        episodesByIds,
        locationsByIds,
        isLoading,
        loadCharacters,
        loadEpisodes,
        loadLocations,
        loadCharactersByIds,
        loadEpisodesByIds,
        loadLocationsByIds,
      }}
    >
      {children}
    </FetchContext.Provider>
  );
};

export const useFetch = (): FetchProps => {
  return useContext(FetchContext);
};
