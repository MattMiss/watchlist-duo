// src/types/tmdb.ts

export interface Base {
    adult?: boolean; // Optional for Firestore compatibility
    id: number; // Required, as it's essential for identifying content
    popularity?: number; // Optional, since it's not saved in Firestore
}

export interface BaseMedia extends Base {
    backdrop_path?: string; // Optional for Firestore compatibility
    genre_ids?: number[]; // Optional for Firestore compatibility
    original_language?: string; // Optional
    overview?: string; // Optional
    poster_path?: string; // Optional
    vote_average?: number; // Optional
    vote_count?: number; // Optional
}

export interface Movie extends BaseMedia {
    original_title?: string; // Optional
    release_date?: string; // Optional
    title?: string; // Optional
    video?: boolean; // Optional
    media_type: "movie";
    isOwner?: boolean; // Is from My List or not
}

export interface TV extends BaseMedia {
    origin_country?: string[]; // Optional
    original_name?: string; // Optional
    first_air_date?: string; // Optional
    name?: string; // Optional
    media_type: "tv";
    isOwner?: boolean; // Is from My List or not
}

export interface Person extends Base {
    gender?: number; // Optional
    known_for_department?: string; // Optional
    name: string; // Required since it's essential
    original_name?: string; // Optional
    profile_path?: string; // Optional
    known_for?: Multi[]; // Optional
    media_type: "person"
}

export type Multi =
    | (Movie & { media_type: "movie" })
    | (TV & { media_type: "tv" })
    | (Person & { media_type: "person" });


export interface BaseResults<T> {
    page: number;
    total_pages: number;
    total_results: number;
    results: T[];
};

export type MovieResults = BaseResults<Movie>;
export type TVResults = BaseResults<TV>;
export type PersonResults = BaseResults<Person>;
export type MultiResults = BaseResults<Multi>;


export interface SearchOptions {
    query: string;
    includeAdult: boolean;
    language: string;
    primaryReleaseYear: string;
    year: string;
    region: string;
    searchType: "movie" | "tv" | "person" | "multi";
    excludeIncomplete: boolean;
    page: number;
  }
  