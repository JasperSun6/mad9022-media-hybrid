const INIT = {
  songs: null,

  init: (ev) => {
    //generate the playlist
    PLAYLIST.songList();

    INIT.songs = document.querySelectorAll(".songList-item");

    APP.audio.src = SONGS[APP.currentTrack].src;

    // play and pause buttons listeners
    APP.play.addEventListener("click", APP.startPlay);
    APP.stop.addEventListener("click", APP.stopPlay);

    // previous and next buttons listeners
    APP.previous.addEventListener("click", APP.perviousPlay);
    APP.next.addEventListener("click", APP.nextPlay);

    // back 10 seconds and forward 10 seconds buttons listeners
    APP.back10.addEventListener("click", APP.backTenSec);
    APP.forward10.addEventListener("click", APP.forwardTenSec);

    // automatically play to next track when current track is ended
    APP.audio.addEventListener("ended", APP.nextPlay);

    APP.audio.addEventListener("timeupdate", PROGRESS.progressBar);
    APP.audio.addEventListener("timeupdate", TIME.updateCurrentTime);
    APP.audio.addEventListener("durationchange", TIME.updateTotalTime);

    // when the track clicked, add highlight
    INIT.songs.forEach((song) => {
      song.addEventListener("click", HIGHLIGHT.songSelected);
    });
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
  startPlay: (ev) => {
    APP.audio.play();
    APP.updateToPause();
    ANIMATION.playAnimation();
  },
  // pause track
  pausePlay: (ev) => {
    APP.audio.pause();
    APP.updateToPlay();
    ANIMATION.pauseAnimation();
  },
  // stop track
  stopPlay: (ev) => {
    APP.audio.pause();
    APP.audio.currentTime = 0;
    APP.updateToPlay();
    ANIMATION.stopAnimation();
  },

  //current track's time back 10 seconds
  backTenSec: (ev) => {
    APP.audio.currentTime = APP.audio.currentTime - 10;
  },
  //current track's time forward 10 seconds
  forwardTenSec: (ev) => {
    APP.audio.currentTime = APP.audio.currentTime + 10;
  },

  // play next track
  nextPlay: (ev) => {
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
  perviousPlay: (ev) => {
    if (APP.currentTrack === 0) {
      APP.currentTrack = 0;
    } else {
      APP.currentTrack--;
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
    let pause = document.getElementById("pause");
    if (APP.audio.paused) {
      APP.play.id = "btnPlay";
      APP.play.innerHTML = "play_arrow";
      APP.play.addEventListener("click", APP.startPlay);
    } else {
      pause.removeEventListener("click", APP.pausePlay);
    }
  },
  // update to pause button
  updateToPause: () => {
    APP.play.removeEventListener("click", APP.startPlay);
    APP.play.id = "pause";
    APP.play.innerHTML = "pause";
    let pause = document.getElementById("pause");
    pause.addEventListener("click", APP.pausePlay);
  },
};

const PLAYLIST = {
  // build the player list
  songList: () => {
    let list = document.getElementById("playerList-area");
    let df = document.createDocumentFragment();
    let listTitle = document.createElement("p");
    listTitle.classList.add("list-title");
    listTitle.innerHTML = "Playlist";
    let ol = document.createElement("ol");
    ol.setAttribute("id", "songList");
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
    df.append(listTitle, ol);
    list.append(df);
  },
};

const PROGRESS = {
  // player progress bar
  progressBar: (ev) => {
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
  updateCurrentTime: (ev) => {
    APP.currentTime.innerHTML = TIME.covertTime(
      parseInt(APP.audio.currentTime)
    );
  },
  //update track's total time
  updateTotalTime: (ev) => {
    APP.totalTime.innerHTML = TIME.covertTime(parseInt(APP.audio.duration));
  },
};

const HIGHLIGHT = {
  // highlight the song that clicked from the playlist
  songSelected: (ev) => {
    let listItems = ev.target.closest(".songList-item");
    INIT.songs.forEach((song) => {
      song.classList.remove("active");
    });
    listItems.classList.add("active");

    let trackName =
      ev.currentTarget.querySelector(".songList-title").textContent;

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
  buttonSelected: (ev) => {
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
