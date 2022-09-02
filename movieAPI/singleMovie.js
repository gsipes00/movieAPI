// the following code uses the free api from The Movie DB https://developers.themoviedb.org/3/getting-started
const apiKey = "?api_key=f8347f51cf7a9bbf9757e9f4f92ad804";
const baseURL = "https://api.themoviedb.org/3";

// end points
const searchMovie = "/search/movie";
const getMovie = "/movie/";
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

async function getMovieData() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const movieID = urlParams.get("id");
  console.log(movieID);
  const movieSearchURL = `${baseURL}${getMovie}${movieID}${apiKey}`;
  console.log(movieSearchURL);
  const response = await fetch(movieSearchURL);
  const movieData = await response.json();
  console.log(movieData);
  displayMovieData(movieData);
}

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

const displayMovieData = async (movieData) => {
  console.log(movieData);
  const genreArray = await getGenres();
  const baseImg = `${imageBaseURL}${imageSize}`;
  console.log(genreArray);
  const {
    title,
    overview,
    release_date: date,
    poster_path: img,
    genres,
    id,
  } = movieData;
  console.log(genres);
  // return the genre names by matching the genre ids
  const namedGenreArray = genreArray.filter((genre) => {
    if (genres.includes(genre.id)) {
      return genre.name;
    }
  });

  const movieDispaly = `
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
  mainSection.innerHTML = movieDispaly;
};

getMovieData();
