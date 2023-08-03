import React, { useState } from 'react';

import MoviesList from './components/MoviesList';
import './App.css';

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  let content=<p>Found No Movies</p>;
  let interval;
  async function  fetchMoviesHandler() {
    try{
      setIsLoading(true);
      setError(null);
      const response=await fetch('https://swapi.dev/api/film/')
   
       if(!response.ok){
         throw new Error('Something went wrong....retrying')
       }
           const data=await response.json();
     
         
           const transformedMovies = data.results.map((movieData) => {
             return {
               id: movieData.episode_id,
               title: movieData.title,
               openingText: movieData.opening_crawl,
               releaseDate: movieData.release_date,
             };
           });
           setIsLoading(false);
           setMovies(transformedMovies);
       
    }
    catch(err){
      setError(err.message)
    }
     
  }

  function stopFetchingHandler(){
    clearInterval(interval);
    setIsLoading(false);
    setError(null);
    content=<p>Found No Movies</p>;
  }
 
  if(isLoading===true){
     content=<p>Loading</p>
  }
  if(error){
    content=<p>{error}</p>
   interval=setInterval(() => {
      fetchMoviesHandler()
    }, 5000);

  }
if(movies.length>0) {
    clearInterval(interval);
    content=<MoviesList movies={movies} />;
  }
  return (
    <React.Fragment>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
        <button onClick={stopFetchingHandler}>Cancel Fetching</button>
      </section>
      <section>
        {content}
      </section>
    </React.Fragment>
  );
}

export default App;
