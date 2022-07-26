const INTERVAL = 1500;
let counterInterval, currentTime, paused;

function drawLabels() {
  g.setFontAlign(-1, 0);
  g.setFont("6x8", 7);
  g.setFontAlign(0, 0, 3);
  g.setFont("6x8", 1);
  g.drawString("Reset", 230, 30);
  g.drawString("Pause", 230, g.getHeight() / 2);
}

function draw() {
  g.clear();
  g.setFontAlign(0, 0);
  g.setFont("6x8", 7);
  g.drawString(currentTime, 120, 120);
  drawLabels();
}

function pauseHandler() {
  setWatch(() => {
    paused = !paused;
    pauseHandler();
  }, BTN2);
}

function init() {
  currentTime = INTERVAL;
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

const wait = () => new Promise(resolve => {
  setTimeout(() => {
    resolve(true);
  }, 500);
});

function alarm() {
  return new Promise(resolve => {
    Bangle.buzz(1000, 1)
      .then(wait)
      .then(() => Bangle.buzz(1000, 0.5))
      .then(wait)
      .then(resolve);
  });

}

function mainLoop() {
  init();
  counterInterval = setInterval(() => {
    if (paused) return;
    currentTime = currentTime - 1;
    draw();

    if (currentTime === 0) {
      clearInterval(counterInterval);
      alarm().then(alarm).then(alarm).then(alarm);

      E.showMessage("Congratulations! You've finished your tomato.", {
        img: atob(
          "FBQBAfgAf+Af/4P//D+fx/n+f5/v+f//n//5//+f//n////3//5/n+P//D//wf/4B/4AH4A="
        ),
      });
    }
  }, 1000);
}

pauseHandler();
init();
drawLabels();