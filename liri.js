require("dotenv").config();
const axios = require("axios");
const keys = require("./keys.js");
const Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
// function to concatenate arguments after the third into one search
var makeQueryString = function () {
  let queryString = " ";
  for (i = 3; i < process.argv.length; i++) {
    queryString = queryString + process.argv[i] + " ";
  };
  return queryString.trim();
};
// checks if search query is string of length greater than 0
var validQuery = function () {
  if (isNaN(makeQueryString()) && makeQueryString().length > 0) {
    return makeQueryString();
  } else {
    // this result will cause LIRI to return default answer to each question
    return false;
  }
};

// input data variables
let searchType = process.argv[2];
let searchQuery = validQuery();

// switch to determine which type of search user wants
switch (searchType) {
  case "spotify-this-song":
    if (!searchQuery) {
      spotSearch("The Sign")
    } else { spotSearch(searchQuery); }
    break;
  case "concert-this":
    bandSearch(searchQuery);
    break;
  case "movie-this":
    if (!searchQuery) {
      movieSearch("Mr. Nobody")
    } else { movieSearch(searchQuery); }
    break;
  case "do-what-it-says":
    randomSearch(randomQuery);
    break;
};
// function searches spotify API and logs values to cmd line
function spotSearch(songQuery) {
  spotify.search({ type: 'track', query: songQuery }, function (err, data) {
    if (err) {
      return console.log('Error occurred: ' + err + "\n Try a different search");
    }
    // loops through results
    for (i = 0; i < data.tracks.items.length; i++) {
      // logs info only if responses' track name matches query & removes any text case errors
      if (data.tracks.items[i].name.toLowerCase().includes(songQuery.toLowerCase())) {
        console.log("\nSong Name: " + data.tracks.items[i].name);
        console.log("Artist: " + data.tracks.items[i].artists[0].name);
        console.log("Album: " + data.tracks.items[i].album.name);
        console.log("Preview Link: " + data.tracks.items[i].preview_url);
        console.log("~~~~~~~~~~~~~~~~~~~~");
      }
    };
  });
};
function bandSearch(bandQuery) {
  axios.get("https://rest.bandsintown.com/artists/pink/events?app_id=trinity").then(function (data) {
    // for (i = 0; i < data.length; i++) {
      console.log("Venue Name: " + JSON.stringify(data, null, 2));
      // console.log("Concert Location: " + data.EventData.venue.city + ", " + EventData.venue.region);
      // console.log("Date of Concert: " + data.EventData.datetime);
    // };
  });
};
function movieSearch(movieQuery){
  let queryURL = "https://www.omdbapi.com/?t=" + movieQuery + "&y=&plot=short&apikey=trilogy";
  axios.get(queryURL).then(function(response){
    let m = response.data;
    // console.log(JSON.stringify(m, null, 2));
    console.log("Movie Title: " + m.Title);
    console.log("Year of Release: "+m.Year);
    console.log("IMDB Rating: "+m.Ratings[0].Value);
    console.log("Rotten Tomatoes Rating: "+m.Ratings[1].Value);
    console.log("Country of Production: "+ m.Country)
    console.log("Plot: "+ m.Plot)
    console.log("Language: "+ m.Language)
    console.log("Starring: "+ m.Actors)



  }).catch(function(error) {
    console.log(error);
  });
}

// list of commands to impliment:
// concert-this
  // Name of the venue
  // Venue location
  // Date of the Event (use moment to format this as "MM/DD/YYYY")
// movie-this
  // * Title of the movie.
  // * Year the movie came out.
  // * IMDB Rating of the movie.
  // * Rotten Tomatoes Rating of the movie.
  // * Country where the movie was produced.
  // * Language of the movie.
  // * Plot of the movie.
  // * Actors in the movie.
// do-what-it-says