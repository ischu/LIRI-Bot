require("dotenv").config();

var keys = require("./keys.js");

var spotify = new Spotify(keys.spotify);

// list of commands to impliment:
// concert-this
// spotify-this-song
// movie-this
// do-what-it-says