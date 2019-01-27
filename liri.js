require("dotenv").config();
const fs = require("fs");
const axios = require("axios");
const keys = require("./keys.js");
const Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
// function to concatenate arguments after the third into one search
const squigString = "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~";
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
    if (!searchQuery) {
      bandSearch("Rolling Stones")
    } else { bandSearch(searchQuery); }
    break;
  case "movie-this":
    if (!searchQuery) {
      movieSearch("Mr. Nobody")
    } else { movieSearch(searchQuery); }
    break;
  case "do-what-it-says":
    randomSearch();
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
        console.log(squigString);
      }
    };
  });
};
function bandSearch(bandQuery) {
  let q = "https://rest.bandsintown.com/artists/" + bandQuery + "/events?app_id=trinity";
  axios.get(q).then(function (response) {
    // if there are 10 or more hits, only the first 10 will be logged
    if (response.data.length >= 10) {
      for (i = 0; i < 10; i++) {
        let b = response.data[i];
        function logBandData(b) {
          console.log("\nVenue Name: " + b.venue.name);
          console.log("Concert Location: " + b.venue.city + ", " + b.venue.region);
          console.log("Date of Concert: " + b.datetime);
          console.log(squigString);
        }
        logBandData(b)
      }
    }
    // if there are less than ten but more than one hit(s), only the first will be logged. 
    else if (response.data.length >= 1) {
      let b = response.data[0];
      logBandData(b);
    }
    // if no hits, console will tell user via log
    else{
      console.log("Sorry, it seems that band is not currently touring.")
    };
  }).catch(function (error) {
    console.log(error);
  });
};
function movieSearch(movieQuery) {
  let queryURL = "https://www.omdbapi.com/?t=" + movieQuery + "&y=&plot=short&apikey=trilogy";
  axios.get(queryURL).then(function (response) {
    let m = response.data;
    console.log("Movie Title: " + m.Title);
    console.log("Year of Release: " + m.Year);
    console.log("IMDB Rating: " + m.Ratings[0].Value);
    console.log("Rotten Tomatoes Rating: " + m.Ratings[1].Value);
    console.log("Country of Production: " + m.Country)
    console.log("Plot: " + m.Plot)
    console.log("Language: " + m.Language)
    console.log("Starring: " + m.Actors)
  }).catch(function (error) {
    console.log(error);
  });
};
function randomSearch(){
  fs.readFile("random.txt", "utf8", function(error, data){
    if(error){
      console.log(error);
    }
    let dataArray = data.split(",");
    // checks index 0 for question 
    switch(dataArray[0]){
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
}

// list of commands to impliment:

// do-what-it-says