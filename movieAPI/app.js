// the following code uses the free api from The Movie DB https://developers.themoviedb.org/3/getting-started
const apiKey = "?api_key=f8347f51cf7a9bbf9757e9f4f92ad804";
const baseURL = "https://api.themoviedb.org/3";

// end points
const searchMovie = "/search/movie";
const getMovie = "/movie/{movie_id}";
const discoverMovieEndPoint = "/discover/movie";
const genreEndPoint = "/genre/movie/list";

// image URLS
const imageBaseURL = "https://image.tmdb.org/t/p";
const imageSize = "/w500";
const movieURL = `${baseURL}${discoverMovieEndPoint}${apiKey}`;

// selectors
const mainSection = document.querySelector(".main");
const search = document.querySelector(".search-input");
const form = document.querySelector(".movie-search");

// event listener for search form
form.addEventListener("keyup", async (e) => {
  e.preventDefault();
  const searchValue = search.value;
  const movieSearchURL = `${baseURL}${searchMovie}${apiKey}&query=${searchValue}`;
  const searchedMovie = await getMovies(movieSearchURL);
  displayMovies(searchedMovie);
});

// fetch the movie object from the API
const getMovies = async (url) => {
  try {
    const response = await fetch(url);
    const movieData = await response.json();
    return movieData.results;
  } catch (error) {
    console.log(error);
    console.log("movie fetch error");
  }
};

// returns an object with all genre categories based on genre_id
const getGenres = async () => {
  const genresURL = `${baseURL}${genreEndPoint}${apiKey}`;
  try {
    const genreResponse = await fetch(genresURL);
    const genreData = await genreResponse.json();
    return genreData.genres;
  } catch (error) {
    console.log(error);
    console.log("genre fetch error");
  }
};

// use the returned movie object to display in the page
const displayMovies = async (list) => {
  const genreArray = await getGenres();
  const baseImg = `${imageBaseURL}${imageSize}`;

  // map over each movie in the list
  const configuredMovies = list
    .map((item) => {
      const {
        title,
        overview,
        release_date: date,
        poster_path: img,
        genre_ids,
        id,
      } = item;
      // return the genre names by matching the genre ids
      const namedGenreArray = genreArray.filter((genre) => {
        if (genre_ids.includes(genre.id)) {
          return genre.name;
        }
      });
      return `
      <article class="movie" movieID="${id}">
        <a href="./singleMovie.html?id=${id}">
          <div class="movie-info"
            <h1 class="movie-title">${title}</h1>
            <p class="movie-desc">${overview}</p>
            <span class="movie-date">Release Date: ${date}</span>
            <ul class="movie-genre">
              ${namedGenreArray
                .map((item) => {
                  return `<li>${item.name}</li>`;
                })
                .join("")}
            </ul>
          </div>
        <a/>
      </article>
      <div>
        <img class="movie-img" src="${baseImg}${img}"></img> 
      </div>`;
    })
    .join("");
  mainSection.innerHTML = configuredMovies;
  return mainSection;
};

const setMovieID = (section) => {
  section.addEventListener("click", function (e) {
    console.log("the click event works");
  });
};

const startTheShow = async () => {
  // fetch movies
  const movies = await getMovies(movieURL);
  // display movies in HTML
  const dummyVar = displayMovies(movies);
  // attempt to add event listener to individual movie so that I can grab it's id and use the getMovie endpoint above to display
  // more details about the movie in singleMovie.html
  setMovieID(dummyVar);
};

startTheShow();
