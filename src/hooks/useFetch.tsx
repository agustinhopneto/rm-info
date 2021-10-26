import React, { createContext, useCallback, useContext, useState } from 'react';

import { api } from '../apis/api';
import {
  Character,
  CharacterFilters,
  CharacterResponse,
  Episode,
  Meta,
} from '../utils/contants';

interface FetchProps {
  characters: Character[];
  charactersMeta: Meta;
  loadCharacters: (filters?: CharacterFilters, page?: number) => void;
  episodesByIds: Episode[];
  loadEpisodesByIds: (episodesList: string) => void;
  isLoading: boolean;
}

const FetchContext = createContext<FetchProps>({} as FetchProps);

const FetchProvider: React.FC = ({ children }) => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [charactersMeta, setCharactersMeta] = useState<Meta>({} as Meta);
  const [episodesByIds, setEpisodesByIds] = useState<Episode[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  const loadCharacters = useCallback(
    async (filters?: CharacterFilters, page?: number) => {
      try {
        setIsLoading(true);
        const response = await api.get<CharacterResponse>(`/character`, {
          params: {
            page: page || 1,
            ...filters,
          },
        });

        setCharactersMeta(response.data.info);
        setCharacters(response.data.results);
      } catch (err) {
        setCharacters([]);
      } finally {
        setIsLoading(false);
      }
    },
    [],
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
