const LONG_INTERVAL = 1500;
const SHORT_INTERVAL = 300;
const ALARM_REPEAT = 3;
let isCurrentIntervalLong = true;
let counterInterval;
let currentTime;
let paused;
let count = 0;

function fancyTimeFormat(duration) {
  var hrs = ~~(duration / 3600);
  var mins = ~~((duration % 3600) / 60);
  var secs = ~~duration % 60;
  var ret = "";

  if (hrs > 0) {
    ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
  }

  ret += "" + mins + ":" + (secs < 10 ? "0" : "");
  ret += "" + secs;
  return ret;
}

function drawLabels() {
  g.setFontAlign(0, 0, 3);
  g.setFont("6x8", 1);
  g.drawString("Reset", 230, 30);
  g.drawString("Pause", 230, g.getHeight() / 2);
}

function drawState() {
  g.setFont("6x8", 2);
  g.setFontAlign(0, 0);
  g.drawString(isCurrentIntervalLong ? "LONG" : "SHORT", 120, 75);

  g.setFont("6x8", 4);
  g.drawString(count, 50, 20);
}

function drawTime() {
  const now = new Date();
  const hoursAndMinutes = now.getHours() + ":" + now.getMinutes();
  g.setFont("6x8", 2);
  g.setFontAlign(0, 0, 0);
  g.drawString(hoursAndMinutes, 20, 200);
}

function draw() {
  g.clear();
  g.setFontAlign(0, 0);
  g.setFont("6x8", 7);
  g.drawString(fancyTimeFormat(currentTime), 120, 120);
  drawLabels();
  drawState();
  drawTime();
}

function pauseHandler() {
  setWatch(() => {
    paused = !paused;
    pauseHandler();
  }, BTN2);
}

function init() {
  currentTime = isCurrentIntervalLong ? LONG_INTERVAL : SHORT_INTERVAL;

  draw();
  drawLabels();
  paused = false;
  setWatch(() => {
    if (counterInterval) {
      clearInterval(counterInterval);
    }
    mainLoop();
  }, BTN1);
}

const wait = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 500);
  });
};

function alarm() {
  return new Promise((resolve) => {
    Bangle.buzz(1000, 1)
      .then(wait)
      .then(() => Bangle.buzz(1000, 0.5))
      .then(wait)
      .then(resolve);
  });
}

function repeatPromise(func, times) {
  let promise = Promise.resolve();
  let repeat = times;
  while (repeat-- > 0) promise = promise.then(func);
  return promise;
}

function mainLoop() {
  init();
  counterInterval = setInterval(() => {
    if (paused) return;
    currentTime = currentTime - 1;
    draw();

    if (currentTime === 0) {
      if (isCurrentIntervalLong) {
        count = count + 1;
      }

      isCurrentIntervalLong = !isCurrentIntervalLong;
      clearInterval(counterInterval);

      repeatPromise(alarm, ALARM_REPEAT);
    }
  }, 1000);
}

pauseHandler();
init();
drawLabels();
drawState();
drawTime();
