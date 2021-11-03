import React, { createContext, useCallback, useContext, useState } from 'react';

import { api } from '../apis/api';
import {
  Character,
  CharacterFilters,
  Episode,
  EpisodeFilters,
  Meta,
} from '../utils/contants';
import { useCache } from './useCache';

interface FetchProps {
  characters: Character[];
  episodes: Episode[];
  charactersMeta: Meta;
  episodesMeta: Meta;
  episodesByIds: Episode[];
  isLoading: boolean;
  loadCharacters: (filters?: CharacterFilters, page?: number) => Promise<void>;
  loadEpisodes: (filters?: EpisodeFilters, page?: number) => Promise<void>;
  loadEpisodesByIds: (episodesList: string) => Promise<void>;
}

type LoadDataProps<T, Y> = {
  filters?: Y;
  page?: number;
  entity: 'character' | 'episode' | 'location';
  setData: React.Dispatch<React.SetStateAction<T[]>>;
  setMeta: React.Dispatch<React.SetStateAction<Meta>>;
};

const FetchContext = createContext<FetchProps>({} as FetchProps);

const FetchProvider: React.FC = ({ children }) => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [charactersMeta, setCharactersMeta] = useState<Meta>({} as Meta);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [episodesMeta, setEpisodesMeta] = useState<Meta>({} as Meta);
  const [episodesByIds, setEpisodesByIds] = useState<Episode[]>([]);

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

  const loadCharacters = useCallback(
    async (filters?: CharacterFilters, page?: number) => {
      await loadData<Character, CharacterFilters>({
        filters,
        page,
        entity: 'character',
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
        entity: 'episode',
        setData: setEpisodes,
        setMeta: setEpisodesMeta,
      });
    },
    [loadData],
  );

  const loadEpisodesByIds = useCallback(async (episodesList: string) => {
    try {
      setIsLoading(true);
      const response = await api.get<Episode[]>(`/episode/${episodesList}`);

      setEpisodesByIds(response.data);
    } catch (err) {
      setEpisodesByIds([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <FetchContext.Provider
      value={{
        characters,
        episodes,
        charactersMeta,
        episodesMeta,
        episodesByIds,
        isLoading,
        loadCharacters,
        loadEpisodes,
        loadEpisodesByIds,
      }}
    >
      {children}
    </FetchContext.Provider>
  );
};

const useFetch = (): FetchProps => {
  const context = useContext(FetchContext);

  return context;
};

export { FetchProvider, useFetch };
