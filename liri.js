require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
// checks if search query is string of length greater than 0
var validQuery = function() {
  if(isNaN(makeQueryString()) && makeQueryString().length>0){
    return makeQueryString();
  }else{
    // failure results in Rickroll
    console.log("Invalid Search: Initiate Rickroll\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n");
    return("Never Gonna Give You Up");
  }
}
// function to concatenate arguments after the third into one search
var  makeQueryString = function() {
  let queryString = " ";
  for (i = 3; i < process.argv.length; i++) {
    queryString = queryString + process.argv[i]+" ";
  };
  return queryString.trim();
};
// input data variables
let searchType = process.argv[2];
let searchQuery = validQuery();

// function searches spotify API and logs values to cmd line
function spotSearch(songQuery) {
  spotify.search({ type: 'track', query: songQuery }, function (err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }
    // for (i = 0; i < 10; i++) {
    //   console.log(data)
    // }

    // console.logs artists
    console.log("Song Name: " + data.tracks.items[0].name);
    console.log("Artist: " + data.tracks.items[0].artists[0].name);
    console.log("Album: " + data.tracks.items[0].album.name);
    console.log("Preview Link: " + data.tracks.items[0].preview_url);

  });
};
// checks if user wants Spotify search
if (searchType === "spotify-this-song") {
  spotSearch(searchQuery);
};
// list of commands to impliment:
// concert-this
// spotify-this-song
    // Artist(s)
    // The song's name
    // A preview link of the song from Spotify
    // The album that the song is from
// movie-this
// do-what-it-says