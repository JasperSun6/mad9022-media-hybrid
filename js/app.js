const INIT = {
  songs: document.querySelectorAll(".song"),
  init: (ev) => {
    APP.audio.src = SONGS[APP.currentTrack].src;

    APP.play.addEventListener("click", APP.startPlay);

    let stop = document.getElementById("stop");
    stop.addEventListener("click", APP.stopPlay);

    APP.audio.addEventListener("durationchange", APP.updateTotalTime);
    APP.audio.addEventListener("timeupdate", APP.updateCurrentTime);

    INIT.songs.forEach((song) => {
      song.addEventListener("click", APP.songSelected);
    });
  },
};

const APP = {
  currentTrack: 0,
  audio: document.getElementById("song-player"),
  player: document.getElementById("player"),
  totalTime: document.getElementById("total-time"),
  currentTime: document.getElementById("current-time"),
  play: document.getElementById("btnPlay"),

  // play song
  startPlay: (ev) => {
    APP.audio.play();
    APP.updateToPause();
    APP.playAnimation();
  },

  // update button to pause button
  updateToPause: () => {
    APP.play.removeEventListener("click", APP.startPlay);
    APP.play.id = "pause";
    APP.play.innerHTML = "pause";
    let pause = document.getElementById("pause");
    pause.addEventListener("click", APP.pausePlay);
  },

  // pause song
  pausePlay: (ev) => {
    APP.audio.pause();
    APP.updateToPlay();
    APP.pauseAnimation();
  },

  // update button to play button
  updateToPlay: () => {
    let pause = document.getElementById("pause");
    pause.removeEventListener("click", APP.pausePlay);
    APP.play.id = "btnPlay";
    APP.play.innerHTML = "play_arrow";
    APP.play.addEventListener("click", APP.startPlay);
  },

  // stop playing
  stopPlay: (ev) => {
    APP.audio.pause();
    APP.audio.currentTime = 0;
    APP.updateToPlay();
    APP.stopAnimation();
  },

  //Code learned from slackoverflow - credit GitaarLAB
  //https://stackoverflow.com/questions/3733227/javascript-seconds-to-minutes-and-seconds
  covertTime: (seconds) => {
    return (
      (seconds - (seconds %= 60)) / 60 + (9 < seconds ? ":" : ":0") + seconds
    );
  },

  updateTotalTime: (ev) => {
    APP.totalTime.innerHTML = APP.covertTime(parseInt(APP.audio.duration));
  },

  updateCurrentTime: (ev) => {
    APP.currentTime.innerHTML = APP.covertTime(parseInt(APP.audio.currentTime));
  },

  // highlight the song that clicked
  songSelected: (ev) => {
    let listItems = ev.target.closest(".song");
    INIT.songs.forEach((song) => {
      song.classList.remove("active");
    });
    listItems.classList.add("active");
  },

  // activated / Deactivated
  playAnimation: (ev) => {
    for (let i = 1; i < 10; i++) {
      let visual = document.querySelector(`.r-${i}`);
      visual.id = `r-${i}`;
      visual.style.animationPlayState = "running";
    }
  },
  pauseAnimation: (ev) => {
    for (let i = 1; i < 10; i++) {
      let visual = document.querySelector(`.r-${i}`);
      visual.style.animationPlayState = "paused";
    }
  },
  stopAnimation: (ev) => {
    for (let i = 1; i < 10; i++) {
      let visual = document.querySelector(`.r-${i}`);
      visual.removeAttribute("id");
    }
  },
};

document.addEventListener("DOMContentLoaded", INIT.init);
