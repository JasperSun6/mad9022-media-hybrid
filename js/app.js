const INIT = {
  songs: document.querySelectorAll(".song"),

  init: (ev) => {
    APP.audio.src = SONGS[APP.currentTrack].src;

    APP.play.addEventListener("click", APP.startPlay);
    APP.stop.addEventListener("click", APP.stopPlay);

    APP.audio.addEventListener("durationchange", TIME.updateTotalTime);
    APP.audio.addEventListener("timeupdate", TIME.updateCurrentTime);

    INIT.songs.forEach((song) => {
      song.addEventListener("click", HIGHLIGHT.songSelected);
    });
  },
};

const APP = {
  currentTrack: 0,
  play: document.getElementById("btnPlay"),
  stop: document.getElementById("stop"),
  audio: document.getElementById("audio-player"),
  player: document.getElementById("player"),
  totalTime: document.getElementById("total-time"),
  currentTime: document.getElementById("current-time"),

  // play song
  startPlay: (ev) => {
    APP.audio.play();
    APP.updateToPause();
    ANIMATION.playAnimation();
  },
  // pause song
  pausePlay: (ev) => {
    APP.audio.pause();
    APP.updateToPlay();
    ANIMATION.pauseAnimation();
  },
  // stop playing
  stopPlay: (ev) => {
    APP.audio.pause();
    APP.audio.currentTime = 0;
    APP.updateToPlay();
    ANIMATION.stopAnimation();
  },

  // update button to play button
  updateToPlay: () => {
    let pause = document.getElementById("pause");
    pause.removeEventListener("click", APP.pausePlay);
    APP.play.id = "btnPlay";
    APP.play.innerHTML = "play_arrow";
    APP.play.addEventListener("click", APP.startPlay);
  },
  // update button to pause button
  updateToPause: () => {
    APP.play.removeEventListener("click", APP.startPlay);
    APP.play.id = "pause";
    APP.play.innerHTML = "pause";
    let pause = document.getElementById("pause");
    pause.addEventListener("click", APP.pausePlay);
  },
};

const TIME = {
  //https://stackoverflow.com/questions/3733227/javascript-seconds-to-minutes-and-seconds
  //Code learned from slackoverflow - credit to GitaarLAB
  // Cover seconds to minutes and seconds
  covertTime: (seconds) => {
    return (
      (seconds - (seconds %= 60)) / 60 + (9 < seconds ? ":" : ":0") + seconds
    );
  },
  // update track's currentTime
  updateCurrentTime: (ev) => {
    APP.currentTime.innerHTML = TIME.covertTime(
      parseInt(APP.audio.currentTime)
    );
  },
  //update track's totalTime
  updateTotalTime: (ev) => {
    APP.totalTime.innerHTML = TIME.covertTime(parseInt(APP.audio.duration));
  },
};

const HIGHLIGHT = {
  // highlight the song that clicked
  songSelected: (ev) => {
    let listItems = ev.target.closest(".song");
    INIT.songs.forEach((song) => {
      song.classList.remove("active");
    });
    listItems.classList.add("active");
  },
};

const ANIMATION = {
  // activated animation
  playAnimation: (ev) => {
    for (let i = 1; i < 10; i++) {
      let visual = document.querySelector(`.r-${i}`);
      visual.id = `r-${i}`;
      visual.style.animationPlayState = "running";
    }
  },
  // paused animation
  pauseAnimation: (ev) => {
    for (let i = 1; i < 10; i++) {
      let visual = document.querySelector(`.r-${i}`);
      visual.style.animationPlayState = "paused";
    }
  },
  // deactivated animation
  stopAnimation: (ev) => {
    for (let i = 1; i < 10; i++) {
      let visual = document.querySelector(`.r-${i}`);
      visual.removeAttribute("id");
    }
  },
};

document.addEventListener("DOMContentLoaded", INIT.init);
