import { useState } from 'react';
import './App.module.css';
import SearchBar from '../SearchBar/SearchBar';
import MovieGrid from '../MovieGrid/MovieGrid';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieModal from '../MovieModal/MovieModal';
import { fetchMovies } from '../../services/movieService'
import { Movie } from '../../types/movie';
import { defaultFetchParams } from '../../services/tmdbDefaults';
import toast, { Toaster } from 'react-hot-toast'
import ReactPaginate from 'react-paginate';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import css from './App.module.css'


export default function App() {
  // const [movies, setMovies] = useState<Movie[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)
  const [page, setPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')

  const { data } = useQuery({
    queryKey: ['movies', page, searchTerm],
    queryFn: () => fetchMovies({ query:searchTerm, page }),
    enabled: !!searchTerm,
    placeholderData: keepPreviousData
  })

  const totalPages = data?.data.total_pages ?? 0

  const handleSearch = async (query: string) => {
    // setMovies([])
    setIsLoading(true)
    setIsError(false)
    setSearchTerm(query)
    setPage(1)
    if(!query.trim()) {
      return
    }
    try {
      const response = await fetchMovies({query, ...defaultFetchParams})

       if(response.data.results.length === 0){
       toast('No movies found for your request.')
       return
       }

      // setMovies(response.data.results)
    } catch(error) {
      setIsError(true)
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

const openModal = (movie: Movie) => setSelectedMovie(movie)
const closeModal = () => setSelectedMovie(null)

  return (
    <>
    <Toaster />
    <SearchBar onSubmit={handleSearch}/>
    { totalPages > 1 && <ReactPaginate 
      pageCount={totalPages}
      pageRangeDisplayed={5}
      marginPagesDisplayed={1}
      onPageChange={({ selected }) => setPage(selected + 1)}
      forcePage={page - 1}
      containerClassName={css.pagination}
      activeClassName={css.active}
      nextLabel="→"
      previousLabel="←"
    />}
    { isLoading && <Loader/> }
    { isError ? <ErrorMessage/> : <MovieGrid movies={data?.data.results ?? []} onSelect={openModal}/> }
    { selectedMovie && <MovieModal movie={selectedMovie} onClose={closeModal}/>}
    </>
  )
}

