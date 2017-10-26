 (function() {
     function SongPlayer($rootScope, Fixtures) {
          /**
          * @desc Stores all functions and properties belonging to the service
          * @type {SongPlayer}
          */
          var SongPlayer = {};

          /**
          * @desc Fetches album form list of Fixtures
          * @type {Object}
          */
          var currentAlbum = Fixtures.getAlbum();

          /**
          * @desc Buzz object audio file
          * @type {Object}
          */
          var currentBuzzObject = null;

          /**
          * @function setSong
          * @desc Stops currently playing song and loads new audio file as currentBuzzObject
          * @param {Object} song
          */
          var setSong = function(song) {
            if (currentBuzzObject) {
              currentBuzzObject.stop();
              SongPlayer.currentSong.playing = null;
            }

            currentBuzzObject = new buzz.sound(song.audioUrl, {
              formats: ['mp3'],
              preload: true
            });

            currentBuzzObject.bind('timeupdate', function() {
              $rootScope.$apply(function() {
                SongPlayer.currentTime = currentBuzzObject.getTime();
              });
            });

            SongPlayer.currentSong = song;
          };

          /**
          * @function play
          * @desc Sets and plays the current song, or resumes playing the current song if it is paused
          * @param {Object} song
          */
          SongPlayer.play = function(song) {
            song = song || SongPlayer.currentSong;
            if (SongPlayer.currentSong !== song) {
              setSong(song);
              playSong(song);
            }  else if (SongPlayer.currentSong === song) {
              if (currentBuzzObject.isPaused()) {
                currentBuzzObject.play();
              }
            }
          }

          /**
          * @function pause
          * @desc Pauses the current song
          * @param {Object} song
          */
          SongPlayer.pause = function(song) {
            song = song || SongPlayer.currentSong;
            currentBuzzObject.pause();
            song.playing = false;
          };

          /**
          * @function previous
          * @desc Sets currentSong to the previous song
          */
          SongPlayer.previous = function() {
            var currentSongIndex = getSongIndex(SongPlayer.currentSong);
            currentSongIndex--;

            if (currentSongIndex < 0) {
              currentBuzzObject.stop();
              SongPlayer.currentSong.playing = null;
            } else {
              var song = currentAlbum.songs[currentSongIndex];
              setSong(song);
              playSong(song);
            }
          };

          /**
          * @function next
          * @desc Sets currentSong to the next song
          */
          SongPlayer.next = function() {
            var currentSongIndex = getSongIndex(SongPlayer.currentSong);
            currentSongIndex++;

            if (currentSongIndex >= currentAlbum.songs.length) {
              currentBuzzObject.stop();
              SongPlayer.currentSong.playing = null;
            } else {
              var song = currentAlbum.songs[currentSongIndex];
              setSong(song);
              playSong(song);
            }
          };

          /**
           * @function setCurrentTime
           * @desc Set current time (in seconds) of currently playing song
           * @param {Number} time
           */
          SongPlayer.setCurrentTime = function(time) {
            if (currentBuzzObject) {
              currentBuzzObject.setTime(time);
            }
          };

          SongPlayer.setVolume = function(volume) {
            if (currentBuzzObject) {
              currentBuzzObject.setVolume(volume);
            }
          };

          /**
          * @function stopSong
          * @desc Stops the current song
          * @param {Object} song
          */
          function stopSong(song) {
            currentBuzzObject.stop();
            song.playing = null;
          }

          /**
          * @function playSong
          * @desc Plays the current song
          * @param {Object} song
          */
          function playSong(song) {
            currentBuzzObject.play();
            song.playing = true;
          }

          /**
          * @function getSongIndex
          * @desc Gets the index of the specified song
          * @param {Object} song
          * @returns {Integer} index
          */
          var getSongIndex = function(song) {
            return currentAlbum.songs.indexOf(song);
          };

          /**
          * @desc Creates currentSong property
          * @type {null}
          */
          SongPlayer.currentSong = null;
          /**
           * @desc Current playback time (in seconds) of currently playing song
           * @type {Number}
           */
          SongPlayer.currentTime = null;

          /**
           * @desc Current volume of currently playing song
           * @type {Number}
           */
          SongPlayer.volume = 50;

          return SongPlayer;
     }

     angular
         .module('blocJams')
         .factory('SongPlayer', ['$rootScope', 'Fixtures', SongPlayer]);
 })();
