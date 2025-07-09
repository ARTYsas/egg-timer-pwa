const sizeSlider = document.getElementById("sizeSlider");
const cookSlider = document.getElementById("cookSlider");
const sizeLabel = document.getElementById("sizeLabel");
const cookLabel = document.getElementById("cookLabel");
const startBtn = document.getElementById("start");
const stopBtn = document.getElementById("stop");
const timerDisplay = document.getElementById("timer");
const progressCircle = document.querySelector("#circle-timer circle:last-child");

const radius = 90;
const circumference = 2 * Math.PI * radius;
progressCircle.style.strokeDasharray = `${circumference}`;
progressCircle.style.strokeDashoffset = `${circumference}`;

let startTime = 0;
let duration = 0;
let animationFrame = null;
let timerRunning = false;

const cookTimes = [300, 390, 510];
const sizeMods = [-15, 0, 15];

function formatTime(sec) {
  const m = String(Math.floor(sec / 60)).padStart(2, "0");
  const s = String(Math.floor(sec % 60)).padStart(2, "0");
  return `${m}:${s}`;
}

function animate() {
  const now = performance.now();
  const elapsed = (now - startTime) / 1000;
  const remaining = Math.max(duration - elapsed, 0);

  const offset = circumference * (1 - remaining / duration);
  progressCircle.style.strokeDashoffset = offset;
  timerDisplay.textContent = remaining > 0 ? formatTime(remaining) : "Готово!";

  if (remaining > 0) {
    animationFrame = requestAnimationFrame(animate);
  } else {
    timerRunning = false;
    playSound();
  }
}

function startTimer() {
  cancelAnimationFrame(animationFrame);
  const cookTime = cookTimes[parseInt(cookSlider.value)];
  const sizeMod = sizeMods[parseInt(sizeSlider.value)];
  duration = cookTime + sizeMod;
  startTime = performance.now();
  timerRunning = true;
  animate();
}

function stopTimer() {
  cancelAnimationFrame(animationFrame);
  timerRunning = false;
  progressCircle.style.strokeDashoffset = circumference;
  timerDisplay.textContent = "00:00";
}

function playSound() {
  const audio = new Audio("https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg");
  audio.play().catch(() => {});
}

sizeSlider.addEventListener("input", () => {
  sizeLabel.textContent = ["С0", "С1", "С2"][sizeSlider.value];
});

cookSlider.addEventListener("input", () => {
  cookLabel.textContent = ["Всмятку", "Мешочек", "Вкрутую"][cookSlider.value];
});

startBtn.addEventListener("click", startTimer);
stopBtn.addEventListener("click", stopTimer);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("service-worker.js").catch((err) => {
      console.error("SW registration failed:", err);
    });
  });
}
