const baseUrl = "https://api.themoviedb.org/3/";
const apiKey = "343bfa68a2540dc900a061c80c308a89";
const imgPath = "https://image.tmdb.org/t/p/original";
const youtubeBaseUrl = "https://youtube.googleapis.com/youtube/v3";
const youtubeApiKey = "AIzaSyCWwZvBUYg411ve_Pi11BhRQZEtf5hd7NQ";
const youtubeSearchBaseUrl = "https://www.youtube.com/watch?v=";

// Another Youtube API: AIzaSyCWwZvBUYg411ve_Pi11BhRQZEtf5hd7NQ

// All API Paths
const apiPaths = {
  fetchAllCategories: `${baseUrl}genre/movie/list?api_key=${apiKey}`,
  fetchMovieList: (id) => {
    return `${baseUrl}/discover/movie?api_key=${apiKey}&with_genres=${id}`;
  },
  fetchTrendingAllMovies: `${baseUrl}trending/movie/week?api_key=${apiKey}`,
  fetchYoutubeMovieTrailer: (movieName) => {
    return `${youtubeBaseUrl}/search?part=snippet&q=${movieName}trailer&key=${youtubeApiKey}`;
  },
};

// Init Function only runs when the window has been loaded completely
function init() {
  fetchAndBuildAllSection();
  fetchTrendingMovies(apiPaths.fetchTrendingAllMovies);
}

// For Fetching and Building the All Movies Sections
function fetchAndBuildAllSection() {
  let p = fetch(apiPaths.fetchAllCategories); // To fetch the data from the API
  p.then((response) => {
    return response.json(); // Tp parse the data through jSon()
  })
    .then((result) => {
      const categories = result.genres; // To get the Array inside the main Object that is result for now.
      if (Array.isArray(categories) && categories.length > 0) {
        // Apply an array condition for future safety.
        categories.forEach((category) => {
          // Run a forEach loop for each object of genres Array.
          fetchAndBuildMovieSection(
            apiPaths.fetchMovieList(category.id), // Fill the id from every array to the API Url.
            category
          );
        });
      }
    })
    .catch((err) => {
      console.log(err); // Catch Error if it rises.
    });

  function fetchAndBuildMovieSection(fetchURL, category) {
    // Initialize the function for fetching URL.
    // console.log(fetchURL, category);
    fetch(fetchURL) // Fetching all data using genres id
      .then((res) => {
        return res.json();
      })
      .then((result) => {
        // Fetching all movies by genres
        let movieArray = result.results; // Array of all movies of a particular genres
        if (Array.isArray(movieArray) && movieArray.length > 0) {
          buildMovieSection(movieArray, category.name);
        }
      })
      .catch((err) => {
        console.log(err);
      });

    function buildMovieSection(listOfMovies, categoryName) {
      //   console.log(listOfMovies, categoryName);

      let movieContainer = document.getElementById("movies-container");
      let moviesListHTML = listOfMovies
        .map((item) => {
          return `
          <div class="movie-banner-hover" onmouseover="fetchYoutubeAPI('${item.title}','yt${item.id}')" >
         <img class="movie_banner"  src="${imgPath}${item.backdrop_path}" alt="${item.title}">
         <iframe width="420" height="315" class="iframeVideo" src="" id='yt${item.id}' allowfullscreen></iframe>
         </div>
         `;
        })
        .join("");

      // HTMl Elements to show the Movies Sections
      let moviesSectionHTML = `
<h2 class="genres_name">${category.name}<span class="explore_nudge">Explore All</span>
  </h2>
  <div class="movieRow actionShows">
  ${moviesListHTML};
  </div>
`;

      let div = document.createElement("div");
      div.className = "movie-section";
      div.innerHTML = moviesSectionHTML;
      // appending to DOM
      movieContainer.appendChild(div);
    }
  }
}

// Fetching All Trending Movies
function fetchTrendingMovies(url) {
  fetch(url)
    .then((res) => {
      return res.json();
    })
    .then((trendingMovies) => {
      let trendingMovieArray = trendingMovies.results;
      console.log(trendingMovieArray);
      if (Array.isArray(trendingMovieArray) && trendingMovieArray.length > 0) {
        buildTrendingSection(trendingMovieArray);
      }
    })
    .catch((err) => {
      console.error(err);
    });

  // Making HTML Elements for Banner
  function buildTrendingSection(listOfTrending) {
    let bannerTextData = document.getElementById("banner-text-data");
    let randomTrendingMovie =
      listOfTrending[Math.floor(Math.random() * listOfTrending.length)];
    // console.log(randomArray);

    //  HTML Content for Banner Section
    let trendingIntroHTML = `
      <h2 class="banner-heading">${randomTrendingMovie.title}</h2>
                  <h4 class="trending-number">#${
                    Math.floor(Math.random() * listOfTrending.length) + 1
                  } in ${randomTrendingMovie.media_type}s Today </h4>
                  <p class="banner-paragraph">Language: ${
                    randomTrendingMovie.original_language
                  }</p>
                  <p class="banner-paragraph">${
                    randomTrendingMovie.overview &&
                    randomTrendingMovie.overview.length > 200
                      ? randomTrendingMovie.overview.slice(0, 200).trim() + // If overview has more than 200 character slice it till 200 char and trim the white space and all three dots.
                        "..."
                      : randomTrendingMovie.overview
                  }</p>
      `;
    let posterURL = `${imgPath}${randomTrendingMovie.backdrop_path}`; // Banner Path for Banner Section
    document.querySelector(
      ".banner-section"
    ).style.backgroundImage = `url(${posterURL})`;

    bannerTextData.innerHTML = trendingIntroHTML;
  }
  // Making HTML Elements for Banner Ends here
}

//   Fetching Movie URl from Youtube API
function fetchYoutubeAPI(movieName, iframeId) {
  fetch(apiPaths.fetchYoutubeMovieTrailer(movieName))
    .then((res) => {
      return res.json();
    })
    .then((result) => {
      if (!result) return res.status;
      else {
        const videoId = result.items[0].id.videoId;
          console.log(videoId);
        if (!videoId) return res.status;
        else {
          document.getElementById(iframeId).src = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`;
        }
      }
    })
    .catch((err) => {
      console.log(err);
    });
}
//   fetchYoutubeAPI("Nowhere")
//   Fetching Movie URl from Youtube API Ends

window.addEventListener("load", () => {
  // An event listener for completely loading webpage.
  init();
  //   Onscroll for Header Event Listener
  window.addEventListener("scroll", () => {
    let header = document.getElementById("mainHeader");
    if (window.scrollY > 5) {
      header.classList.add("bg-color");
    } else {
      header.classList.remove("bg-color");
    }
  });
  //   Onscroll for Header Event Listener Ends here
});
