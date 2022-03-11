const INIT = {
  songs: null,

  init: () => {
    //generate the playlist
    PLAYLIST.songList();

    let buttons = document.getElementById("controls");
    buttons.addEventListener("click", INIT.buttonsSwitchListeners);

    APP.audio.src = SONGS[APP.currentTrack].src;

    // automatically play to next track when current track is ended
    APP.audio.addEventListener("ended", APP.nextPlay);

    APP.audio.addEventListener("timeupdate", PROGRESS.progressBar);
    APP.audio.addEventListener("timeupdate", TIME.updateCurrentTime);
    APP.audio.addEventListener("durationchange", TIME.updateTotalTime);

    // when the track clicked, add highlight
    let songList = document.getElementById("songList");
    songList.addEventListener("click", HIGHLIGHT.songSelected);
  },

  buttonsSwitchListeners: (ev) => {
    let target = ev.target.id;
    switch (target) {
      case "btnPlay":
        APP.startPlay();
        break;
      case "pause":
        APP.pausePlay();
        break;
      case "stop":
        APP.stopPlay();
        break;
      case "skip_previous":
        APP.perviousPlay();
        break;
      case "skip_next":
        APP.nextPlay();
        break;
      case "replay_10":
        APP.backTenSec();
        break;
      case "forward_10":
        APP.forwardTenSec();
        break;
      default:
        console.log("buttons are not working!");
    }
  },
};

const APP = {
  currentTrack: 0,

  player: document.getElementById("player"),
  audio: document.getElementById("audio-player"),

  play: document.getElementById("btnPlay"),
  stop: document.getElementById("stop"),

  previous: document.getElementById("skip_previous"),
  next: document.getElementById("skip_next"),

  back10: document.getElementById("replay_10"),
  forward10: document.getElementById("forward_10"),

  progressBar: document.getElementById("progressBar"),

  totalTime: document.getElementById("total-time"),
  currentTime: document.getElementById("current-time"),

  // play track
  startPlay: () => {
    APP.audio.play();
    APP.updateToPause();
    ANIMATION.playAnimation();
  },
  // pause track
  pausePlay: () => {
    APP.audio.pause();
    APP.updateToPlay();
    ANIMATION.pauseAnimation();
  },
  // stop track
  stopPlay: () => {
    APP.audio.pause();
    APP.audio.currentTime = 0;
    APP.updateToPlay();
    ANIMATION.stopAnimation();
  },

  //current track's time back 10 seconds
  backTenSec: () => {
    APP.audio.currentTime = APP.audio.currentTime - 10;
  },
  //current track's time forward 10 seconds
  forwardTenSec: () => {
    APP.audio.currentTime = APP.audio.currentTime + 10;
  },

  // play next track
  nextPlay: () => {
    let len = SONGS.length;
    APP.currentTrack++;
    if (APP.currentTrack >= len) {
      APP.currentTrack = 0;
    }
    APP.audio.src = SONGS[APP.currentTrack].src;
    document.getElementById("track-cover").src = SONGS[APP.currentTrack].img;
    document.getElementById("song-title").textContent =
      SONGS[APP.currentTrack].title;
    document.getElementById("artist").textContent =
      SONGS[APP.currentTrack].artist;
    BUTTONHIGHLIGHT.buttonSelected();
    APP.startPlay();
  },
  // play pervious track
  perviousPlay: () => {
    let len = SONGS.length;
    APP.currentTrack--;
    if (APP.currentTrack < 0) {
      APP.currentTrack = len - 1;
    }
    APP.audio.src = SONGS[APP.currentTrack].src;
    document.getElementById("track-cover").src = SONGS[APP.currentTrack].img;
    document.getElementById("song-title").textContent =
      SONGS[APP.currentTrack].title;
    document.getElementById("artist").textContent =
      SONGS[APP.currentTrack].artist;
    BUTTONHIGHLIGHT.buttonSelected();
    APP.startPlay();
  },

  // update to play button
  updateToPlay: () => {
    APP.play.id = "btnPlay";
    APP.play.innerHTML = "play_arrow";
  },
  // update to pause button
  updateToPause: () => {
    APP.play.id = "pause";
    APP.play.innerHTML = "pause";
  },
};

const PLAYLIST = {
  // build the player list
  songList: () => {
    let list = document.getElementById("playerList-area");
    let df = document.createDocumentFragment();
    let ol = document.getElementById("songList");
    SONGS.forEach((item, index) => {
      let li = document.createElement("li");
      if (index === 0) {
        li.classList.add("active");
      }
      li.classList.add("songList-item");
      let cover = document.createElement("div");
      cover.classList.add("songList-cover");
      let img = document.createElement("img");
      img.src = item.img;
      img.alt = `${item.title}`;
      let text = document.createElement("div");
      text.classList.add("songList-text");
      let title = document.createElement("p");
      title.classList.add("songList-title");
      title.innerHTML = item.title;
      let artist = document.createElement("p");
      artist.classList.add("songList-artist");
      artist.innerHTML = item.artist;
      text.append(title, artist);
      cover.append(img);
      li.append(cover, text);
      ol.append(li);
    });
    df.append(ol);
    list.append(df);
  },
};

const PROGRESS = {
  // player progress bar
  progressBar: () => {
    APP.progressBar.setAttribute("max", APP.audio.duration);
    APP.progressBar.setAttribute("value", APP.audio.currentTime);
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
  // update track's current time
  updateCurrentTime: () => {
    APP.currentTime.innerHTML = TIME.covertTime(
      parseInt(APP.audio.currentTime)
    );
  },
  //update track's total time
  updateTotalTime: () => {
    APP.totalTime.innerHTML = TIME.covertTime(parseInt(APP.audio.duration));
  },
};

const HIGHLIGHT = {
  // highlight the song that clicked from the playlist
  songSelected: (ev) => {
    let listItems = ev.target.closest(".songList-item");

    document
      .querySelectorAll("li.active")
      .forEach((item) => item.classList.remove("active"));

    listItems.classList.add("active");

    let trackName = listItems.querySelector(".songList-title").textContent;

    SONGS.forEach((track) => {
      if (track.title == trackName) {
        APP.currentTrack = SONGS.indexOf(track);
        document.getElementById("track-cover").src = track.img;
        document.getElementById("song-title").textContent = track.title;
        document.getElementById("artist").textContent = track.artist;
        APP.audio.src = track.src;
      }
    });
    APP.updateToPlay();
    ANIMATION.stopAnimation();
    APP.startPlay();
  },
};

const BUTTONHIGHLIGHT = {
  // hightLight the playlist song when press back/forward buttons
  buttonSelected: () => {
    let currentTrack = SONGS[APP.currentTrack].title;
    let tracks = document.querySelectorAll(".songList-item");
    // remove the hightLight from previous song
    tracks.forEach((song) => song.classList.remove("active"));
    //add the hightLight to current song
    tracks.forEach((song) => {
      if (song.querySelector(".songList-title").textContent == currentTrack) {
        song.classList.add("active");
      }
    });
  },
};

const ANIMATION = {
  // activated animation
  playAnimation: () => {
    for (let i = 1; i < 10; i++) {
      let visual = document.querySelector(`.r-${i}`);
      visual.id = `r-${i}`;
      visual.style.animationPlayState = "running";
    }
  },
  // paused animation
  pauseAnimation: () => {
    for (let i = 1; i < 10; i++) {
      let visual = document.querySelector(`.r-${i}`);
      visual.style.animationPlayState = "paused";
    }
  },
  // deactivated animation
  stopAnimation: () => {
    for (let i = 1; i < 10; i++) {
      let visual = document.querySelector(`.r-${i}`);
      visual.removeAttribute("id");
    }
  },
};

document.addEventListener("DOMContentLoaded", INIT.init);
