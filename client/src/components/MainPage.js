import React, { useState, useEffect } from "react";
const API_KEY = '8d6938b';

function MainPage({ userId }) {
  const [apiData, setApiData] = useState(null);
  const [apiRandomData, setApiRandomData] = useState(null)
  const [isMovieInfoVisible, setIsMovieInfoVisible] = useState(false);
  const [comment, setComment] = useState('')
  const [clickedCommentButton, setClickedCommentButton] = useState(false);
  const [clickedOfferButton, setClickedOfferButton] = useState(0);

  const fetchMovies = async (title) => {
    try {
      const response = await fetch(`http://www.omdbapi.com/?apikey=8d6938b&t=${title}`);
      const movieData = await response.json();
      setApiData(movieData);
      console.log(movieData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const generateRandomNumber = () => {
    const randomNumber = Math.floor(Math.random() * 100) + 1;
    return randomNumber;
  };

  useEffect(() => {
    const fetchRandomMovies = async () => {
      try {
        const randomMoviePage = generateRandomNumber();
        const response = await fetch(`http://www.omdbapi.com/?apikey=${API_KEY}&s=movie&type=movie&page=${randomMoviePage}`);
        const movieData = await response.json();
        setApiRandomData(movieData.Search);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchRandomMovies();
  }, [comment, clickedOfferButton]);

  const handleInput = (event) => {
    fetchMovies(event.target.value)
    console.log(event.target.value)
    event.target.value.length === 0 ? setIsMovieInfoVisible(false) : setIsMovieInfoVisible(true)
  };

  const handleCommentButtonClick = () => {
    setClickedCommentButton(true)
  };

  const handleComment = (event) => {
    setComment(event.target.value)
  };

  const sendComment = async (event) => {
    event.preventDefault();
    const movieTitle = apiData.Title;
    try {
      const response = await fetch(`http://localhost:3001/api/users/review/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ movieTitle, comment }),
      });
      const userData = await response.json();
      console.log(userData);
    } catch (error) {
      console.error('Error', error);
    }
    setIsMovieInfoVisible(false)
    setClickedCommentButton(false)
  };


  const backToSearch = () => {
    setIsMovieInfoVisible(false)
    setClickedCommentButton(false)
  };

  const handleRecMov = (e) => {
    e.preventDefault();
    fetchMovies(e.target.innerText)
    setIsMovieInfoVisible(true)
  };

  const offerButton = () => {
      setClickedOfferButton(clickedOfferButton+1);
    };
    

  return (
    clickedCommentButton ? (
      <>
        <div className="commentbox">
          <h2>Title:  {apiData?.Title}</h2>
          <input id="inputcomment" onChange={handleComment} placeholder="Write a comment, if you want...:"></input><br />
          <button id="sendcomment" onClick={sendComment}>Send comment</button>
          <button id="sendcomment" onClick={backToSearch}>Back</button>
        </div>
      </>
    ) : (
      <>
        <input onChange={handleInput} placeholder='Movie title...' id="movie-searchbar"></input>
        <div className="box-model">
          <div id="rec.movies-container">
            <h3>Recommended movies for you:</h3>
            {apiRandomData?.map((x, index) => <p onClick={handleRecMov} key={index} class="clickable-text">{x.Title}</p>)
            }
            <button onClick={offerButton} >Offer me more...</button>
          </div>
        </div>
        {isMovieInfoVisible && (
          <>
            <div className="box-model">
              <div id="search.movies-container">
                <div>
                  <u>Title:</u> {apiData?.Title}
                </div>
                <div>
                  <u>Directed by:</u> {apiData?.Director}
                </div>
                <div>
                  <u>Written by:</u> {apiData?.Writer}
                </div>
                <div>
                  <u>Starring:</u> {apiData?.Actors}
                </div>
                <br />
                <div>
                  <u>Plot:</u>
                  <p>{apiData?.Plot}</p></div>
                <div>
                  <u>Runtime:</u> {apiData?.Runtime}
                </div>
                <div>
                  <u>Rating:</u> {apiData?.imdbRating}
                </div>
                <div>
                  <u>Release Date:</u> {apiData?.Released}
                </div>
                <div>
                  <u>Revenue:</u> {apiData?.BoxOffice}
                </div>
                <button onClick={handleCommentButtonClick}>Comment it!</button>
              </div>
            </div>
          </>
        )}
      </>
    )
  )
        }


export default MainPage;