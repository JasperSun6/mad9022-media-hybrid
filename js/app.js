const INIT = {
  init: (ev) => {
    APP.audio.src = SONGS[APP.currentTrack].src;

    let play = document.getElementById("btnPlay");
    play.addEventListener("click", APP.startPlay);

    let pause = document.getElementById("pause");
    pause.addEventListener("click", APP.pausePlay);

    let stop = document.getElementById("stop");
    stop.addEventListener("click", APP.stopPlay);

    APP.audio.addEventListener("durationchange", APP.updateTotalTime);
    APP.audio.addEventListener("timeupdate", APP.updateCurrentTime);
  },
};

const APP = {
  currentTrack: 0,
  audio: document.getElementById("song-player"),
  player: document.getElementById("player"),
  totalTime: document.getElementById("total-time"),
  currentTime: document.getElementById("current-time"),

  startPlay: (ev) => {
    if (!APP.audio.paused) return;
    console.log("Song is playing");
    APP.audio.play();
  },

  pausePlay: (ev) => {
    console.log("Song is paused");
    APP.audio.pause();
  },

  stopPlay: (ev) => {
    console.log("Song is stopped");
    APP.audio.pause();
    APP.audio.currentTime = 0;
  },

  //Code learned from slackoverflow - credit GitaarLAB
  //https://stackoverflow.com/questions/3733227/javascript-seconds-to-minutes-and-seconds
  covertTime: (seconds) => {
    return (
      (seconds - (seconds %= 60)) / 60 + (9 < seconds ? ":" : ":0") + seconds
    );
  },

  updateTotalTime: (ev) => {
    console.log("Total time updated");
    APP.totalTime.innerHTML = APP.covertTime(parseInt(APP.audio.duration));
  },

  updateCurrentTime: (ev) => {
    console.log("Current time updated");
    APP.currentTime.innerHTML = APP.covertTime(parseInt(APP.audio.currentTime));
  },

  updateSong: (ev) => {},
};

document.addEventListener("DOMContentLoaded", INIT.init);
