const APP = {
  audio: document.getElementById("song-player"),
  player: document.getElementById("player"),
  currentTrack: 0,
  init: (ev) => {
    let play = document.getElementById("btnPlay");
    play.addEventListener("click", APP.startPlay);

    let pause = document.getElementById("pause");
    pause.addEventListener("click", APP.pausePlay);

    let stop = document.getElementById("stop");
    stop.addEventListener("click", APP.stopPlay);
  },
  startPlay: (ev) => {
    if (!APP.audio.paused) return;
    console.log("Song is playing");
    APP.audio.src = SONGS[APP.currentTrack].src;
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

  totalTime: (ev) => {
    console.log("Total time updated");
  },
};

document.addEventListener("DOMContentLoaded", APP.init);
