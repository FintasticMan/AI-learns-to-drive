let xCar = 10;
let yCar = 200;
let xSize = 800;
let ySize = 360;
let wheelSize = 24;
let value = 0;

function setup() {
  createCanvas(xSize, ySize);
}

function draw() {
  background(220);
  drawCar(xCar, yCar, wheelSize);
  if (keyIsDown(LEFT_ARROW) || keyIsDown(RIGHT_ARROW)) {
    value = 0;
    if (keyIsDown(LEFT_ARROW)) {
      value -= 5;
    }
    if (keyIsDown(RIGHT_ARROW)) {
      value += 5;
    }
  }
  if (keyIsDown(LEFT_ARROW) === false && keyIsDown(RIGHT_ARROW) === false) {
    value = value / 1.04;
  }
  if (value < 0.05 && value > -0.05) {
    value = 0;
  }
  xCar += value;
}

function drawCar(xCar, yCar, wheelSize) {
  noStroke();
  fill(255, 220, 115);
  rect(xCar, yCar, 110, 20);
  rect(xCar + 10, yCar-22, 70, 40);
  // Wielen
  stroke(255);
  strokeWeight(2);
  fill(12, 66, 66);
  ellipse(xCar + 25, yCar + 21, wheelSize, wheelSize);
  ellipse(xCar + 80, yCar + 21, wheelSize, wheelSize);
  stroke(0);
  line(0, yCar + 21 + wheelSize/2, width, yCar + 21 + wheelSize/2);
}
