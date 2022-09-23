// the following code uses the free api from The Movie DB https://developers.themoviedb.org/3/getting-started
const apiKey = "?api_key=f8347f51cf7a9bbf9757e9f4f92ad804";
const baseURL = "https://api.themoviedb.org/3";
const actor = "/person/";
const reviewsVideos = "&append_to_response=external_ids,images";
const youtubeBase = "https://www.youtube.com/embed/";

// image URLS
const imageBaseURL = "https://image.tmdb.org/t/p";
const imageSize = "/w500";

// selector
const actorDetails = document.querySelector(".actor-details");

// get Actor deets
const getActor = async () => {
  const urlSearch = window.location.search;
  const urlParams = new URLSearchParams(urlSearch);
  const actorID = urlParams.get("id");
  const actorURL = `${baseURL}${actor}${actorID}${apiKey}${reviewsVideos}`;
  const response = await fetch(actorURL);
  const data = await response.json();
  return data;
};

const displayActor = (list) => {
  // destructure the object
  const {
    name,
    birthday,
    place_of_birth,
    biography,
    profile_path: img,
    external_ids,
  } = list;
  document.title = name;
  // destructure the socials from external ids
  const {
    freebase_mid,
    freebase_id,
    imdb_id,
    tvrage_id,
    facebook_id,
    instagram_id,
    twitter_id,
  } = external_ids;

  // calculate age from birth date.
  const currentDate = new Date();
  const bdayMiliseconds = Date.parse(birthday);
  const currentDateMiliseconds = Date.parse(currentDate);
  const dateDelta = currentDateMiliseconds - bdayMiliseconds;
  const ageYears = Math.floor(dateDelta / 31536000000);

  // format date from ISO date format to long date format
  const monthsOfYear = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const daysOfWeek = ["Sunday"];
  const d = new Date(birthday);
  const year = d.getFullYear();
  const month = monthsOfYear[d.getMonth()];
  const day = d.getDate();
  const formatDate = `${month} ${day}, ${year}`;

  // social URLS
  const imdb = "https://www.imdb.com/name/";
  const instagram = "https://www.instagram.com/";
  const facebook = "https://www.facebook.com/";
  const twitter = "https://www.instagram.com/";

  // get socials from object
  // const myArray = Object.entries(external_ids);
  // console.log(myArray);
  // const myFilteredArray = myArray
  //   .filter((array) => {
  //     if (
  //       (array[0] === "imdb_id" && array[1]) ||
  //       (array[0] === "facebook_id" && array[1])
  //     ) {
  //       console.log(array);
  //       return array;
  //     }
  //   })
  //   .map((item) => {
  //     return `<a href="${item[0]}${item[1]}" target="_blank"><li class="show">IMDB</li></a>`;
  //   })
  //   .join("");
  // console.log(myFilteredArray);

  // return html
  actorDetails.innerHTML = `
      <div class="actor-info">
        <h1 class="actor-name">${name}</h1>
        <h4 class="bio-title">Bio</h4>
        <span class='underline'> <span>
        <p class="actor-bio">${biography}</p> 
      </div>
      <div class="actor-photo">
        <a  href="${imdb}${imdb_id}" target="_blank">
          <img class="actorProfileImg" src="${imageBaseURL}${imageSize}${img}" alt="" />
        </a>
        <h2 class="actor-bd">Birthday:${formatDate} (age: ${ageYears})</h2>
        <h2 class="actor-from">From: ${place_of_birth}</h2>
      </div>`;
};

const seekActor = async () => {
  const actorData = await getActor();
  displayActor(actorData);
};

seekActor();
