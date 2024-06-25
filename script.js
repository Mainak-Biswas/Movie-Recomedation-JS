//Implement all your function here to make it a working application.
const apiKey = `2f7b08399924201761ab8d5e753b484c`;

//DOM elements
const likeOrDislikeBtns = document.getElementById("likeOrDislikeBtns");
const likeBtn = document.getElementById("likeBtn");

//Fetching the Genres
const genresSelect = document.getElementById("genres"); // Select bar for selecting genres

const loadGenre = () => {
    const genreApi = `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}`;
    let genres = "";
    const genreRequest = new XMLHttpRequest();
    genreRequest.open("GET", genreApi);
    genreRequest.send();
    genreRequest.addEventListener("load", () => {
        // jsonData = {genres: Array(19)} > genres: Array(19) > 0:{id: 28, name: 'Action'}
        const jsonData = JSON.parse(genreRequest.responseText);
        genres = jsonData.genres;

        // console.log(jsonData);
        // console.log(genres);

        genres.forEach((genre) => {
            const option = document.createElement("option");
            option.value = genre.id;
            option.textContent = genre.name;

            genresSelect.appendChild(option);
        });
    });
};

loadGenre(); // Initial loading of genre

//Search movies
const searchBtn = document.getElementById("playBtn");
let currPage = 1; // API current Page
let totalPages = 1;
let movies = []; // API movies on current page
let currMovie = 0; // API movie number on current page

const fetchMovies = () => {
    const selectedGenre = genresSelect.value;
    const moviesApi = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${selectedGenre}&page=${currPage}`;
    const moviesRequest = new XMLHttpRequest();
    moviesRequest.open("GET", moviesApi);
    moviesRequest.send();
    moviesRequest.addEventListener("load", () => {
        // jsonData = {page: 1, results: Array(20), total_pages: 2016, total_results: 40308} >
        // > results[] > 0: results> {
        // adult: false, backdrop_path: "/fqv8v6AycXKsivp1T5yKtLbGXce.jpg", genre_ids:(3) [878, 12, 28], id : 653346,
        // original_language: "en", original_title : "Kingdom of the Planet of the Apes",
        // overview : "Several generations in the future following Caesar's reign, apes are now the dominant species and live harmoniously while humans have been reduced to living in the shadows. As a new tyrannical ape leader builds his empire, one young ape undertakes a harrowing journey that will cause him to question all that he has known about the past and to make choices that will define a future for apes and humans alike.",
        // popularity : 4144.345, poster_path : "/gKkl37BQuKTanygYQG1pyYgLVgf.jpg", release_date : "2024-05-08",
        // title: "Kingdom of the Planet of the Apes", video : false, vote_average : 6.881, vote_count : 1210,}

        const jsonData = JSON.parse(moviesRequest.responseText);
        movies = jsonData.results;
        currPage = jsonData.page;
        totalPages = jsonData.total_pages;
        currMovie = 0;

        // console.log(jsonData);
        // console.log(movies, currPage, currMovie);

        renderMovie(movies[currMovie].id);
    });
};

searchBtn.addEventListener("click", fetchMovies);

//Rendering Movie Data
const renderMovie = (movieId) => {
    const movieApi = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`;
    const movieRequest = new XMLHttpRequest();
    movieRequest.open("GET", movieApi);
    movieRequest.send();
    movieRequest.addEventListener("load", () => {
        // console.log(currMovie);
        const movieData = JSON.parse(movieRequest.responseText);

        const moviePoster = document.getElementById("moviePoster");
        const movieText = document.getElementById("movieText");

        moviePoster.textContent = "";
        movieText.textContent = "";

        const poster = document.createElement("img");
        poster.id = "moviePoster";
        poster.src = `https://image.tmdb.org/t/p/w185${movieData.poster_path}`;
        moviePoster.appendChild(poster);

        const movieTitle = document.createElement("h2");
        movieTitle.id = "movieTitle";
        movieTitle.textContent = movieData.title;
        movieText.appendChild(movieTitle);

        const movieOverview = document.createElement("p");
        movieOverview.id = "movieOverview";
        movieOverview.textContent = movieData.overview;
        movieText.appendChild(movieOverview);

        likeOrDislikeBtns.hidden = false;
        likeBtn.addEventListener("click", nextMovie);
    });
};

// Rendering next movie
const nextMovie = () => {
    currMovie++;
    if (currMovie >= movies.length - 1) {
        currPage++;
        if (currPage <= totalPages) {
            fetchMovies();
        } else {
            likeOrDislikeBtns.hidden = true;
            likeBtn.removeEventListener("click", nextMovie);
        }
    } else {
        renderMovie(movies[currMovie].id);
    }
};
