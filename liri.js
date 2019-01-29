// "require" variables
require("dotenv").config();
const moment = require("moment");
const fs = require("fs");
const axios = require("axios");
const keys = require("./keys.js");
const Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
// input data variables
let searchType = process.argv[2];
let searchQuery = validQuery();
// Used to format logged data
const squigString = "\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~";
// default search queries
let defaultSong = "The Sign";
let defaultBand = "The Rolling Stones";
let defaultMovie = "Mr. Nobody";
// function to concatenate arguments after the third into one search
function makeQueryString() {
  let queryString = " ";
  for (i = 3; i < process.argv.length; i++) {
    queryString = queryString + process.argv[i] + " ";
  };
  return queryString.trim();
};
// checks if search query is string of length greater than 0
function validQuery() {
  if (isNaN(makeQueryString()) && makeQueryString().length > 0) {
    return makeQueryString();
  } else {
    // this result will cause LIRI to return default answer to each question
    return false;
  }
};
// search functions
function spotSearch(songQuery) {
  spotify.search({ type: 'track', query: songQuery }, function (err, data) {
    if (err) {
      return console.log('Error occurred: ' + err + "\n Try a different search");
    }
    // appends search to log.txt
    logAppend(`\n${searchType}, "${songQuery}"${squigString}`);
    // loops through first ten results
    for (i = 0; i < data.tracks.items.length, i<10; i++) {
      // logs info only if responses' track name matches query & removes any text case errors
      if (data.tracks.items[i].name.toLowerCase().includes(songQuery.toLowerCase())) {
        let result =
          "\nSong Name: " + data.tracks.items[i].name +
          "\nArtist: " + data.tracks.items[i].artists[0].name +
          "\nAlbum: " + data.tracks.items[i].album.name +
          "\nPreview Link: " + data.tracks.items[i].preview_url;
        // logs search results to the console and log.txt
        console.log(result + squigString);
        logAppend(result + squigString);
      };
    };
  });
};
function bandSearch(bandQuery) {
  let q = "https://rest.bandsintown.com/artists/" + bandQuery + "/events?app_id=trinity";
  axios.get(q).then(function (response) {
    // appends search to log.txt
    logAppend(`\n${searchType}, "${bandQuery}"${squigString}`);
    // function for logging band data
    function logBandData(b) {
      result = "\nVenue Name: " + b.venue.name +
        "\nConcert Location: " + b.venue.city + ", " + b.venue.region +
        "\nDate of Concert: " + moment(b.datetime).format("MM/DD/YYYY");
      return result;
    }
    // if there are 10 or more hits, only the first 10 will be logged
    if (response.data.length >= 10) {
      for (i = 0; i < 10; i++) {
        let b = response.data[i];
        // log to console and log.txt
        console.log(logBandData(b) + squigString);
        logAppend(logBandData(b) + squigString);
      }
    }
    // if there are less than ten but more than one hit(s), only the first will be logged. 
    else if (response.data.length >= 1) {
      let b = response.data[0];
      console.log(logBandData(b) + squigString);
      logAppend(logBandData(b) + squigString);
    }
    // if no hits, console will tell user via log
    else {
      let b = "\nSorry, it seems that band is not currently touring.";
      console.log(b);
      logAppend(b + squigString);
    };
  }).catch(function (error) {
    console.log(error);
  });
};
function movieSearch(movieQuery) {
  // appends search to log.txt
  logAppend(`\n${searchType}, "${movieQuery}"${squigString}`);
  let queryURL = "https://www.omdbapi.com/?t=" + movieQuery + "&y=&plot=short&apikey=trilogy";
  axios.get(queryURL).then(function (response) {
    let m = response.data;
    let result =
      "\nMovie Title: " + m.Title +
      "\nYear of Release: " + m.Year +
      "\nIMDB Rating: " + m.Ratings[0].Value +
      "\nRotten Tomatoes Rating: " + m.Ratings[1].Value +
      "\nCountry of Production: " + m.Country +
      "\nPlot: " + m.Plot +
      "\nLanguage: " + m.Language +
      "\nStarring: " + m.Actors;
    // logs results in log and console
    console.log(result);
    logAppend(result + squigString);
  }).catch(function (error) {
    console.log(error);
  });
};
function randomSearch() {
  fs.readFile("random.txt", "utf8", function (error, data) {
    if (error) {
      console.log(error);
    }
    let dataArray = data.split(",");
    // checks index 0 for question and runs appropriate function
    switch (dataArray[0]) {
      case "spotify-this-song":
        // searches for index 1 after removing quotes
        spotSearch(dataArray[1].replace(/["]+/g, ''));
        break;
      case "concert-this":
        bandSearch(dataArray[1].replace(/["]+/g, ''));
        break;
      case "movie-this":
        movieSearch(dataArray[1].replace(/["]+/g, ''));
        break;
    };
  });
};
// appends to log.txt
function logAppend(x) {
  fs.appendFile("log.txt", x, function (err) {
    if (err) {
      console.log(err);
    };
  })
};
// switch to determine which type of search user wants
switch (searchType) {
  case "spotify-this-song":
    if (!searchQuery) {
      spotSearch(defaultSong)
    } else { spotSearch(searchQuery); }
    break;
  case "concert-this":
    if (!searchQuery) {
      bandSearch(defaultBand)
    } else { bandSearch(searchQuery); }
    break;
  case "movie-this":
    if (!searchQuery) {
      movieSearch(defaultMovie)
    } else { movieSearch(searchQuery); }
    break;
  case "do-what-it-says":
    randomSearch();
    break;
};