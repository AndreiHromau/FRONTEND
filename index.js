let data = []; //Массив для хранения данных об изображениях
let timerId; //Идентификатор таймера (для управления setTimeout)
let time = 100;
let selectedIndex = 0;
let loadingCount = 5; //для синхронизации
function updateTimer() {
  time -= 0.2;
  if (time <= 0) {
    selectImage(selectedIndex + 1); // Выбираем следующее изображение
    time = 100; //сброс таймера
  }
  document.querySelector(".bar").style.width = time + "%";
  startTimer();
}

//действия на обработку стоп и старт
function toggleTimer(event) {
  if (event.target.textContent === "STOP") {
    event.target.textContent = "PLAY";
    stopTimer();
  } else {
    event.target.textContent = "STOP";
    startTimer();
  }
}
function stopTimer() {
  time = 100; //сброс в изначальное зн
  document.querySelector(".bar").style.width = time + "%";
  clearTimeout(timerId);
}

function startTimer() {
  //настройки таймера
  timerId = setTimeout(updateTimer, 10);
}

function selectImage(index) {
  selectedIndex = Number(index);
  if (selectedIndex === data.length) {
    loadImages();
  }
  document.querySelectorAll(".thumb div").forEach((item, i) => {
    if (i === selectedIndex) {
      item.classList.add("selected");
    } else {
      item.classList.remove("selected");
    }
  });
  document.querySelector(".preview img").src = data[selectedIndex].download_url;
  document.querySelector(".preview img").classList.add("loading");
  document.querySelector(".preview .author").textContent =
    data[selectedIndex].author;
}

function drawImages() {
  const images = document.querySelectorAll(".thumb img");
  data.forEach((item, i) => {
    images[i].src = item.download_url;
    images[i].classList.add("loading");
  });
  selectImage(0);
}

function loadImages() {
  //загрузка рандома + наша цифра
  loadingCount = 5;
  stopTimer();
  const page = Math.floor(Math.random() * (800 / 4));
  const url = "https://picsum.photos/v2/list?page=" + page + "&limit=4";
  fetch(url)
    .then((res) => res.json())
    .then((json) => {
      data = json;
      drawImages();
    });
}

function onThumbClick(event) {
  if (event.target.tagName !== "IMG") return;
  stopTimer();
  document.querySelector(".play").textContent = "PLAY";
  selectImage(event.target.dataset.index);
}

function removeLoading(event) {
  loadingCount -= 1;
  if (
    loadingCount === 0 &&
    document.querySelector(".play").textContent === "STOP"
  ) {
    startTimer();
  }
  event.target.classList.remove("loading");
}

function init() {
  //сама функция с обработчиками
  loadImages();
  document.querySelector(".thumb").addEventListener("click", onThumbClick);
  document.querySelector(".new").addEventListener("click", loadImages);
  document.querySelectorAll("img").forEach((item) => {
    item.onload = removeLoading;
  });
  document.querySelector(".play").addEventListener("click", toggleTimer);
}

window.addEventListener("DOMContentLoaded", init); //для срабатывания селекторов и обработчика
