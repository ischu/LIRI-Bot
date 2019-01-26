require("dotenv").config();

var keys = require("./keys.js");

var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
// searches spotify API
songQuery = "Ocean Man"
function spotSearch() {
  spotify.search({ type: 'track', query: songQuery }, function (err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }
    // for (i = 0; i < 10; i++) {
    //   console.log(data)
    // }

    // console.logs artists
    console.log("Song Name: "+data.tracks.items[0].name);
    console.log("Artist: "+data.tracks.items[0].artists[0].name);
    console.log("Album: "+data.tracks.items[0].album.name);
    console.log("Preview Link: "+data.tracks.items[0].preview_url);

  });
};
spotSearch();
// list of commands to impliment:
// concert-this
// spotify-this-song
    // Artist(s)
    // The song's name
    // A preview link of the song from Spotify
    // The album that the song is from
// movie-this
// do-what-it-says