const songs = [
  {
    name: "Có hẹn với bầu trời",
    link: "https://vnso-zn-15-tf-mp3-s1-zmp3.zadn.vn/d65745b4cdf324ad7de2/668359467898601539?authen=exp=1639408418~acl=/d65745b4cdf324ad7de2/*~hmac=026524ae6384f65023be29d6a5898b24&fs=MTYzOTIzNTYxODEzMXx3ZWJWNnwwfDQyLjExNS43My4xMDE",
    avatar:
      "https://photo-resize-zmp3.zadn.vn/w240_r1x1_jpeg/cover/7/f/1/c/7f1ccb9461353370aa320060fbd5d547.jpg",
  },
  {
    name: "Thở",
    link: "https://mp3-s1-zmp3.zadn.vn/e7d50099c7de2e8077cf/5966541326435079144?authen=exp=1639411032~acl=/e7d50099c7de2e8077cf/*~hmac=937ca2542ac0ba78ed923ba7f0620612&fs=MTYzOTIzODIzMjQ0Mnx3ZWJWNnwwfDE3MS4yMjUdUngMjU1LjY4",
    avatar: "https://i.ytimg.com/vi/pISLmTTklmQ/maxresdefault.jpg",
  },
  {
    name: "Từ Ngày Em Đến",
    link: "https://mp3-s1-zmp3.zadn.vn/efad11d2c99620c87987/2245834307933820373?authen=exp=1639411265~acl=/efad11d2c99620c87987/*~hmac=be7e4c5f2e6349f6cd0de4ad335a358e&fs=MTYzOTIzODQ2NTY1NHx3ZWJWNnwwfDQ1LjEyNi45NS4z",
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