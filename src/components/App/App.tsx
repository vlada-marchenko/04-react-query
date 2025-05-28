import { useEffect, useState } from 'react';
import './App.module.css';
import SearchBar from '../SearchBar/SearchBar';
import MovieGrid from '../MovieGrid/MovieGrid';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieModal from '../MovieModal/MovieModal';
import { fetchMovies } from '../../services/movieService'
import { Movie } from '../../types/movie';
import toast, { Toaster } from 'react-hot-toast'
import ReactPaginate from 'react-paginate';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import css from './App.module.css'


export default function App() {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)
  const [page, setPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')

  const { data, isError, isLoading, isSuccess } = useQuery({
    queryKey: ['movies', searchTerm, page],
    queryFn: () => fetchMovies({ query:searchTerm, page }),
    enabled: searchTerm !== "",
    placeholderData: keepPreviousData,
  })

  useEffect(() => {
    if(isSuccess && data?.results.length === 0) {
      toast('No movies found')
    }
  }, [isSuccess, data])

  const totalPages = data?.total_pages ?? 0

  const handleSearch = async (query: string) => {
    setSearchTerm(query)
    setPage(1)
}

const openModal = (movie: Movie) => setSelectedMovie(movie)
const closeModal = () => setSelectedMovie(null)

  return (
    <>
    <Toaster /> 
    <SearchBar onSubmit={handleSearch}/>
    { isSuccess && totalPages > 1 && <ReactPaginate 
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
    { isError ? <ErrorMessage/> : <MovieGrid movies={data?.results ?? []} onSelect={openModal}/> }
    { selectedMovie && <MovieModal movie={selectedMovie} onClose={closeModal}/>}
    </>
  )
}

