import React, { useState,useEffect, useCallback } from 'react';
import AddMovie from './components/AddMovie';
import MoviesList from './components/MoviesList';
import './App.css';

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  let content=<p>Found No Movies</p>;
  let interval;

 async function deleteMovieHandler(id){
  await fetch(`https://react-project-4e57d-default-rtdb.firebaseio.com/movies/${id}.json`,{
    method:'DELETE'
  });
   
  fetchMoviesHandler();
  
 }

 const fetchMoviesHandler= useCallback( async ()=> {
   
    try{
      setIsLoading(true);
      setError(null);
      const response=await fetch('https://react-project-4e57d-default-rtdb.firebaseio.com/movies.json')
   
       if(!response.ok){
         throw new Error('Something went wrong....retrying')
       }
           const data=await response.json();
       
           const loadedMovies = [];

           for (const key in data) {
             loadedMovies.push({
               id: key,
               title: data[key].title,
               openingText: data[key].openingText,
               releaseDate: data[key].releaseDate,
             });
           }
         
           setIsLoading(false);
           setMovies(loadedMovies);
       
    }
    catch(err){
      setError(err.message)
    } 
  },[])

  useEffect( ()=>{
    fetchMoviesHandler();
  },[fetchMoviesHandler])

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
    content=<MoviesList movies={movies} onDeleteMovie={deleteMovieHandler} />;
  }

  async function addMovieHandler(movie) {
     await fetch('https://react-project-4e57d-default-rtdb.firebaseio.com/movies.json', {
      method: 'POST',
      body: JSON.stringify(movie),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    fetchMoviesHandler();
  
  }

  return (
    <React.Fragment>
        <section>
        <AddMovie onAddMovie={addMovieHandler}  />
      </section>
      <section>
        <button onClick={fetchMoviesHandler} >Fetch Movies</button>
        <button onClick={stopFetchingHandler}>Cancel Fetching</button>
      </section>
      <section>
        {content}
      </section>
    </React.Fragment>
  );
}

export default App;
