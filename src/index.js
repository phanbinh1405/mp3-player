const songs = [
  {
    name: "Có hẹn với bầu trời",
    link: "https://data17.chiasenhac.com/downloads/2150/0/2149570-63aa97a2/128/Co%20Hen%20Voi%20Bau%20Troi%20-%20Da%20LAB.mp3",
    avatar:
      "https://photo-resize-zmp3.zadn.vn/w240_r1x1_jpeg/cover/7/f/1/c/7f1ccb9461353370aa320060fbd5d547.jpg",
  },
  {
    name: "Thở",
    link: "https://data.chiasenhac.com/down2/2165/0/2164148-0c735066/128/Tho%20-%20Da%20LAB_%20Juky%20San.mp3",
    avatar: "https://i.ytimg.com/vi/pISLmTTklmQ/maxresdefault.jpg",
  },
  {
    name: "Từ Ngày Em Đến",
    link: "https://data3.chiasenhac.com/downloads/1798/0/1797216-1300ac3f/320/Tu%20Ngay%20Em%20Den%20-%20Da%20LAB.mp3",
    avatar:
      "https://photo-resize-zmp3.zadn.vn/w240_r1x1_jpeg/covers/3/2/329fdc7eb248832ef6529d92db0e7eec_1497439510.jpg",
  },
];

let indexMusic = 1;
const playBtn = document.querySelector(".btn-toggle-play");
const nextBtn = document.querySelector(".btn-playnext");
const backBtn = document.querySelector(".btn-playback");
const audio = document.querySelector("#main-audio");
const musicName = document.querySelector("header h2");
const currentProgress = document.querySelector(".current-progress");
const thumb = document.querySelector(".cd-thumb img");
const progressBar = document.querySelector(".progress-bar");
let min = progressBar.getBoundingClientRect().left;
let max = progressBar.getBoundingClientRect().width + min;
let progressBarLen = max - min;
let progressDot = document.querySelector(".current-progress span");

window.addEventListener("load", () => {
  loadMusic(indexMusic);
});

//Load dữ liệu bài hát đầu tiên
function loadMusic(musicNum) {
  musicName.innerText = songs[musicNum - 1].name;
  audio.src = `${songs[musicNum - 1].link}`;
  thumb.src = `${songs[musicNum - 1].avatar}`;
}

// Phát nhạc
function playMusic() {
  playBtn.childNodes.name = "pause";
  playBtn.innerHTML = `<ion-icon name="pause"></ion-icon>`;
  audio.play();
}

//Dừng nhạc
function pauseMusic() {
  playBtn.childNodes.name = "play";
  playBtn.innerHTML = `<ion-icon name="play"></ion-icon>`;
  audio.pause();
}

//Sự kiện click vào nút toggle play
playBtn.addEventListener("click", () => {
  let musicIsPlay = playBtn.childNodes.name === "pause";
  musicIsPlay ? pauseMusic() : playMusic();
});

//cập nhật thời gian thực
audio.addEventListener("timeupdate", (e) => {
  let currentAudioTime = e.target.currentTime;
  let audioLength = e.target.duration;
  let percent = currentAudioTime / audioLength;
  const currentTime = document.querySelector(".current-time");
  const durationTime = document.querySelector(".duration-time");
  currentProgress.style.width = `${percent * 100}%`;

  //audio load xong lấy thời gian của bài hát
  audio.addEventListener("loadeddata", () => {
    let duration = audio.duration;
    let totalMin = Math.floor(duration / 60),
      totalSec = Math.floor(duration % 60);
    if (totalSec < 10) {
      totalSec = `0${totalSec}`;
    }
    if (totalMin < 10) {
      totalMin = `0${totalMin}`;
    }
    durationTime.innerText = `${totalMin}:${totalSec}`;
  });

  // lấy thời gian đang phát hiện tại
  let currentMin = Math.floor(currentAudioTime / 60),
    currentSec = Math.floor(currentAudioTime % 60);
  if (currentSec < 10) {
    currentSec = `0${currentSec}`;
  }
  if (currentMin < 10) {
    currentMin = `0${currentMin}`;
  }
  currentTime.innerText = `${currentMin}:${currentSec}`;
});

//Chuyển bài kế tiếp
function nextAudio() {
  indexMusic++;
  indexMusic > songs.length ? (indexMusic = 1) : (indexMusic = indexMusic);
  loadMusic(indexMusic);
  playMusic();
}
nextBtn.addEventListener("click", () => {
  nextAudio();
});

//Lùi lại bài trước
function backAudio() {
  indexMusic--;
  indexMusic < 1 ? (indexMusic = songs.length) : (indexMusic = indexMusic);
  loadMusic(indexMusic);
  playMusic();
}
backBtn.addEventListener("click", () => {
  backAudio(indexMusic);
});

//Tua bài trên thanh thời gian
let isMove = false;

progressBar.addEventListener("mousedown", (e) => {
  let positionMouse = e.clientX;
  let percent = ((positionMouse - min) / progressBarLen) * 100;
  currentProgress.style.width = `${percent}%`;
  isMove = true;
  playAudioIntime(percent);
});
window.addEventListener("mousemove", (e) => {
  let positionMouse = e.clientX;
  if (isMove && e.clientX >= min && e.clientX <= max) {
    let percent = ((positionMouse - min) / progressBarLen) * 100;
    currentProgress.style.width = `${percent}%`;
    playAudioIntime(percent);
  }
});

window.addEventListener("mouseup", () => {
  isMove = false;
});

function playAudioIntime (time) {
  audio.currentTime = (time * audio.duration)/100;
  playMusic();
}