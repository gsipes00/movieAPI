// the following code uses the free api from The Movie DB https://developers.themoviedb.org/3/getting-started
const apiKey = "?api_key=f8347f51cf7a9bbf9757e9f4f92ad804";
const baseURL = "https://api.themoviedb.org/3";
const getMovie = "/movie/";
const reviewsVideos = "&append_to_response=reviews,videos,credits";
const youtubeBase = "https://www.youtube.com/embed/";

// image URLS
const imageBaseURL = "https://image.tmdb.org/t/p";
const imageSize = "/w500";

// selector
const filmDetails = document.querySelector(".film-details");

// call API using film id passed in by the URL params and return object array
async function getMovieData() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const movieID = urlParams.get("id");
  const movieSearchURL = `${baseURL}${getMovie}${movieID}${apiKey}${reviewsVideos}`;
  const response = await fetch(movieSearchURL);
  const movieData = await response.json();
  return movieData;
}

// display film details
const displayFilm = async (data) => {
  const {
    original_title,
    tagline,
    homepage,
    production_companies,
    revenue,
    runtime,
    spoken_languages,
    reviews,
    backdrop_path,
    poster_path,
    videos,
    credits,
  } = data;
  const { logo_path } = data.production_companies;
  const { author_details } = reviews;
  const { results } = data.videos;
  const { cast } = data.credits;

  // return array of production company names
  const companies = production_companies.map((company) => {
    if (!company.logo_path) {
      company.logo_path = "/zlFa3VNua4hJyGEI4X2sqDrtEH9.png";
    }
    return { name: company.name, path: company.logo_path };
  });

  // return array of spoken languages
  const languages = spoken_languages.map((lang) => {
    return lang.english_name;
  });
  // return array of youtube videos
  const trailers = results.map((result) => {
    return {
      key: result.key,
      official: result.official,
      type: result.type,
      name: result.name,
    };
  });
  // return array of reviews
  const filmReview = reviews.results.map((review) => {
    return {
      content: review.content,
      details: review.author_details,
      update: review.updated_at,
      url: review.url,
    };
  });

  //  return array of cast members
  const filmCast = cast.map((credit) => {
    return {
      department: credit.known_for_department,
      name: credit.name,
      character: credit.character,
      id: credit.id,
      photo: credit.profile_path,
      order: credit.order,
    };
  });
  // set html
  filmDetails.innerHTML = `
  <section class="film-section">
    <a href="${homepage}" class="title-tag" target="_blank">
      <h1 class="film-title">${original_title}</h1>
      <h4 class="film-tag">"${tagline}"</h4>
    </a>
    <section class="film-overview">
      <div id="film-image">
        <img class="film-img" src="${imageBaseURL}${imageSize}${poster_path}"></img>
      </div>
      <div class="film-stats">
        <div id="film-companies">
          <h4 class="company-title">production companies</h4>
          <img src="" />
          <ul class="company-list">
            ${companies
              .map((item) => {
                return `<li class="company-name"><h2>${item.name}</h2></li>`;
              })
              .join("")}
          </ul>
        </div>
        <h6 class="film-revenue">revenue: ${Math.floor(revenue / 1000)}k</h6>
        <h6 class="film-runtime">feature length: ${runtime} minutes</h6>
        <div id="film-languages">
          <h4 class="language-title">languages</h4>
          <ul class="language-list">
            ${languages
              .map((lang) => {
                return `<li class="film-lang">${lang}</li>`;
              })
              .join("")}
          </ul>
        </div>
      </div>
    </section>
    <div class="cast">
      <h1>main cast</h1>
      <ul class="cast-list">
        ${filmCast
          .map((cast) => {
            if (cast.department === "Acting" && cast.order < 12) {
              if (cast) {
                return `
              <div class='actor'>
                <a href='./actor.html?id=${cast.id}'>
                <h4>${cast.name} as "${cast.character}"</h4><span><img class="cast-photo" src="${imageBaseURL}${imageSize}${cast.photo}"/></span>
                </a>
              </div>`;
              }
            }
          })
          .join("")}
      </ul>
    </div>
    <div class="embed-video">
      <h1>official trailers</h1>
    ${trailers
      .map((trailer) => {
        if (trailer.official === true && trailer.type === "Trailer") {
          return `
        <div class="trailer">
          <h4>${trailer.name}</h4>
          <iframe width="250" height="250" src="${youtubeBase}${trailer.key}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </div>`;
        } else {
          return ``;
        }
      })
      .join("")}
    </div>
    
    <section class="film-reviews">
      <h1 class="reviews-title">reviews</h1>
      <article class="single-review">
        ${filmReview
          .map((review) => {
            const updateDate = new Date(review.update);
            const year = updateDate.getFullYear();
            const month = updateDate.getMonth() + 1;
            const day = updateDate.getDay();
            return `
              <a href="${review.url}">
                <div class="review-details">
                  <h2 class="reviewer-name">author: ${review.details.name}</h2>
                  <h2 class="reviewer-rating">rating: ${review.details.rating}</h2>
                  <p>last updated: ${month} ${day}, ${year}</p>
                </div>
                <p class="review-desc">${review.content}</p>
              </a>
              `;
          })
          .join("</br>")}  
      </article>;
    </section>
  </section>`;
};

const action = async () => {
  const data = await getMovieData();
  displayFilm(data);
};

action();

// code recycling
// production company logos
/* <span>
  <img class='company-logo' src='${imageBaseURL}${imageSize}${item.path}' />
</span>; */
