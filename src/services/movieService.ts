import axios from 'axios';
import { Movie } from '../types/movie';

export interface FetchParams{
    query: string,
    page?: number,
    include_adult?: boolean,
    language?: string, 
}

export interface HttpResponse {
    page: number,
    results: Movie[],
    total_results: number,
    total_pages: number
}
export async function fetchMovies({ query, page }: FetchParams ): Promise <HttpResponse> {
    const token = import.meta.env.VITE_TMDB_TOKEN 
    const response = await axios.get<HttpResponse>(`https://api.themoviedb.org/3/search/movie`, {
        params: {
            query,
            page,
        } ,
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${token}`
        }
    })
    return response.data
}