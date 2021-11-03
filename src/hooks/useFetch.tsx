import React, { createContext, useCallback, useContext, useState } from 'react';

import { api } from '../apis/api';
import {
  CacheKeys,
  Character,
  CharacterFilters,
  CharacterResponse,
  Episode,
  Meta,
} from '../utils/contants';
import { useCache } from './useCache';

interface FetchProps {
  characters: Character[];
  charactersMeta: Meta;
  loadCharacters: (filters?: CharacterFilters, page?: number) => Promise<void>;
  episodesByIds: Episode[];
  loadEpisodesByIds: (episodesList: string) => Promise<void>;
  isLoading: boolean;
}

const FetchContext = createContext<FetchProps>({} as FetchProps);

const FetchProvider: React.FC = ({ children }) => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [charactersMeta, setCharactersMeta] = useState<Meta>({} as Meta);
  const [episodesByIds, setEpisodesByIds] = useState<Episode[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  const { getCache, setCache } = useCache();

  const loadCharacters = useCallback(
    async (filters?: CharacterFilters, page?: number) => {
      try {
        const cachedFilters = JSON.stringify(
          getCache<CharacterFilters>(CacheKeys.CHARACTERS_FILTERS),
        );

        const cachedPage = getCache<number>(CacheKeys.CHARACTERS_PAGE);

        if (cachedPage === page && cachedFilters === JSON.stringify(filters)) {
          const cachedCharacters = getCache<Character[]>(CacheKeys.CHARACTERS);
          const cachedMeta = getCache<Meta>(CacheKeys.CHARACTERS_META);

          setCharacters(cachedCharacters as Character[]);
          setCharactersMeta(cachedMeta as Meta);
          return;
        }

        setIsLoading(true);

        setCache<CharacterFilters | undefined>(
          CacheKeys.CHARACTERS_FILTERS,
          filters,
        );

        setCache<number | undefined>(CacheKeys.CHARACTERS_PAGE, page);

        const response = await api.get<CharacterResponse>(`/character`, {
          params: {
            page: page || 1,
            ...filters,
          },
        });

        const { results, info } = response.data;

        setCache<Meta>(CacheKeys.CHARACTERS_META, info);
        setCache<Character[]>(CacheKeys.CHARACTERS, results);

        setCharactersMeta(info);
        setCharacters(results);
      } catch (err) {
        setCharactersMeta({} as Meta);
        setCharacters([]);
      } finally {
        setIsLoading(false);
      }
    },
    [getCache, setCache],
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
        charactersMeta,
        loadCharacters,
        episodesByIds,
        loadEpisodesByIds,
        isLoading,
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
