const APP = {
  currentTrack: 5,
  audio: document.getElementById("song-player"),
  player: document.getElementById("player"),
  totalTime: document.getElementById("total-time"),
  currentTime: document.getElementById("current-time"),

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

  covertTime: (second) => {
    return (second - (second %= 60)) / 60 + (9 < second ? ":" : ":0") + second;
  },

  updateTotalTime: (ev) => {
    console.log("Total time updated");
    APP.totalTime.innerHTML = APP.covertTime(parseInt(APP.audio.duration));
  },

  updateCurrentTime: (ev) => {
    console.log("Current time updated");
    APP.currentTime.innerHTML = APP.covertTime(parseInt(APP.audio.currentTime));
  },
};

document.addEventListener("DOMContentLoaded", APP.init);
