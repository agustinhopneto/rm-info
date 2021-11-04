/* eslint-disable camelcase */
export type Character = {
  id: number;
  name: string;
  status: CharacterStatus;
  species: string;
  type: string;
  gender: CharacterGender;
  origin?: Pick<Location, 'name' | 'url'>;
  location?: Pick<Location, 'name' | 'url'>;
  image: string;
  episode: string[];
  url: string;
  created: Date;
};

export type Location = {
  id: number;
  name: string;
  type: string;
  dimension: string;
  residents: string[];
  url: string;
  created: Date;
};

export type Episode = {
  id: number;
  name: string;
  air_date: string;
  episode: string;
  characters: string[];
  url: string;
  created: Date;
};

export type Meta = {
  count: number;
  next: string | null;
  pages: number;
  prev: string | null;
};

export enum CharacterStatus {
  ALIVE = 'Alive',
  DEAD = 'Dead',
  UNKNOWN = 'unknown',
}

export enum CharacterGender {
  MALE = 'Male',
  FEMALE = 'Female',
  GENDERLESS = 'Genderless',
  UNKNOWN = 'unknown',
}

export type CharacterFilters = {
  name: string;
  species: string;
  type: string;
  gender: string;
  status: string;
};

export type CharacterResponse = {
  info: Meta;
  results: Character[];
};

export type EpisodeFilters = {
  name: string;
  episode: string;
};

export type LocationFilters = {
  name: string;
  type: string;
  dimension: string;
};

export enum Entities {
  CHARACTER = 'character',
  EPISODE = 'episode',
  LOCATION = 'location',
}

export enum AppCacheKeys {
  APP = '@rickandmorty',
}
