 (function() {
     function SongPlayer() {
          /**
          * @desc Stores all functions and properties belonging to the service
          */
          var SongPlayer = {};

          var currentSong = null;
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
              currentSong.playing = null;
            }

            currentBuzzObject = new buzz.sound(song.audioUrl, {
              formats: ['mp3'],
              preload: true
            });

            currentSong = song;
          };

          /**
          * @function play
          * @desc Sets and plays the current song, or resumes playing the current song if it is paused
          * @param {Object} song
          */
          SongPlayer.play = function(song) {
            if (currentSong !== song) {
              setSong(song);
              playSong(song);
            }  else if (currentSong === song) {
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
            currentBuzzObject.pause();
            song.playing = false;
          };

          /**
          * @function playSong
          * @desc Plays the current song
          * @param {Object} song
          */
          function playSong(song) {
            currentBuzzObject.play();
            song.playing = true;
          }

          return SongPlayer;
     }

     angular
         .module('blocJams')
         .factory('SongPlayer', SongPlayer);
 })();
