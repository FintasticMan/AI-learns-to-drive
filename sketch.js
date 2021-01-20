// Amount of checkpoints reached is the same as the index of the array of
// checkpoints.  This means that you only have to figure out if the car is
// colliding with one of the checkpoints at a time, and that also means that
// it's impossible for it to accidentally count twice or count wrong


// The amount of cars, the amount of frames the direction lags behind the
// rotation (used for drifting), and the positions of the walls of the track
let amount = 256;
let lag = 8;
let innerPos;
let outerPos;
let checkpoints;

let drawRaycasts = false;
let deadCars = 0;

let generation = 0;

const cars = [];
let raceTrack;

let speed;
let visual = true;

// HTML elements
let fpsSpan;
let cpsSpan;
let carsSpan;
let genSpan;
let mouseXSpan;
let mouseYSpan;

// User-controlled values
let pauseButton;
let pause = false;
let visualButton;
let castsButton;
let fitnessButton;
let showFitness = true;
let autoKillButton;
let autoKill = true;
let manualKillButton;
let speedSlider;
let speedSpan;

let canvas;

function setup() {
	canvas = createCanvas(1280, 720);
	canvas.parent("#canvas");
	background(191);
	strokeWeight(4);

	defineTrack();

	raceTrack = new RaceTrack(innerPos, outerPos, checkpoints);

	makeElements();

	newGeneration();

	// noLoop();
}

function draw() {
	checkUserInputs();

	if (!pause) {
		clear();
		background(191);

		for (let j = 0; j < speed; j++) {
			calcPos();
		}

		if (visual) {
			raceTrack.draw();
			drawCars();
		}

		if (deadCars === cars.length) {
			newGeneration();
		}

		cpsSpan.html(round(frameRate() * speed));
	} else {
		cpsSpan.html("0");
	}

	fpsSpan.html(round(frameRate()));
	carsSpan.html(amount - deadCars);
	genSpan.html(generation);
	mouseXSpan.html(round(mouseX));
	mouseYSpan.html(round(mouseY));
}


function checkUserInputs() {
	speed = speedSlider.value();
	speedSpan.html(speed);
}

function makeElements() {
	fpsSpan = select("#fps");
	cpsSpan = select("#cps");
	carsSpan = select("#cars");
	genSpan = select("#gen");
	mouseXSpan = select("#mouseX");
	mouseYSpan = select("#mouseY");

	pauseButton = select("#pause");
	pauseButton.mousePressed(togglePause);
	visualButton = select("#visual");
	visualButton.mousePressed(toggleVisual);
	castsButton = select("#casts");
	castsButton.mousePressed(toggleCasts);
	fitnessButton = select("#fitness");
	fitnessButton.mousePressed(toggleFitness);
	autoKillButton = select("#autoKill");
	autoKillButton.mousePressed(toggleAutoKill);
	manualKillButton = select("#manualKill");
	manualKillButton.mousePressed(manualKill);

	speedSlider = select("#speedSlider");
	speedSpan = select("#speed");
}


function togglePause() {
	pause = !pause;

	if (pause) {
		// noLoop();
		pauseButton.html("play");
	} else {
		// loop();
		pauseButton.html("pause");
	}
}

function toggleVisual() {
	visual = !visual;

	if (visual) {
		visualButton.html("hide everything");
	} else {
		visualButton.html("show everything");
	}
}

function toggleCasts() {
	drawRaycasts = !drawRaycasts;

	if (drawRaycasts) {
		castsButton.html("hide raycasts");
	} else {
		castsButton.html("show raycasts");
	}
}

function toggleFitness() {
	showFitness = !showFitness;

	if (showFitness) {
		fitnessButton.html("hide fitness");
	} else {
		fitnessButton.html("show fitness");
	}
}

function toggleAutoKill() {
	autoKill = !autoKill;

	if (autoKill) {
		autoKillButton.html("don't automatically kill the best");
	} else {
		autoKillButton.html("do automatically kill the best");
	}
}

function manualKill() {
	for (let i = 0; i < cars.length; i++) {
		if (cars[i].alive) {
			cars[i].alive = false;
			deadCars++;
		}
	}
}


function linesCross(line1, line2) {
	let x1 = line1[0].x;
	let y1 = line1[0].y;
	let x2 = line1[1].x;
	let y2 = line1[1].y;

	let x3 = line2[0].x;
	let y3 = line2[0].y;
	let x4 = line2[1].x;
	let y4 = line2[1].y;

	// Calculate t and u
	let den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
	let tNum = (x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4);
	let uNum = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3));
	let t = tNum / den;
	let u = uNum / den;

	// Return true if the intersection is within the two line segments
	if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
		return true;
	} else {
		return false;
	}
}

function newGeneration() {
	// Create the correct amount of cars
	if (cars.length === 0) {
		for (let i = 0; i < amount; i++) {
			cars.push(new Car(createVector(360, 120), 0.52, color(255, 31)));
		}
	} else {
		let bestScore = [cars[0].score, 0];
		let currentscore;
		for (let i = 0; i < cars.length; i++) {
			currentScore = cars[i].score;
			if (currentScore > bestScore[0]) {
				bestScore = [currentScore, i];
			}
		}
		let nn = cars[bestScore[1]].nn.serialize();
		cars[amount - 1] = new Car(createVector(360, 120), 0.52, color(0, 0, 255, 127));
		cars[amount - 1].nn = NeuralNetwork.deserialize(nn);
		// console.log(nn.serialize());

		for (let i = 0; i < cars.length - 1; i++) {
			cars[i] = new Car(createVector(360, 120), 0.52, color(255, 31));
			cars[i].nn = NeuralNetwork.deserialize(nn);
			// console.log(cars[i].nn.serialize());
			cars[i].nn.mutate(mutateItem);
		}
		// noLoop();
	}

	generation++;
	deadCars = 0;
}

function mutateItem(x) {
	if (random() < 0.2) {
		let offset = randomGaussian(0, 512);
		let newx = x + offset;
		// if (newx < -1) {
		// 	newx = -1;
		// } else if (newx > 1) {
		// 	newx = 1;
		// }
		return newx;
		// return random(-1, 1);
	} else {
		// let newx = randomGaussian(0, 0.1)
		// return newx;
		return x;
	}
}

function calcPos() {
	// Cycle through all of the cars
	for (let i = 0; i < cars.length; i++) {
		if (cars[i].alive) {
			// Read the inputs
			let rays = cars[i].raycast(raceTrack, false);
			let action = cars[i].think(rays[1]);
			cars[i].move(action);

			cars[i].calcCorners();

			cars[i].calcScore(raceTrack);

			// Kill the car if it is hitting the track
			if (cars[i].isColliding(raceTrack)) {
				cars[i].alive = false;
				deadCars++;
			}

		}
	}

	if (autoKill && deadCars === cars.length - 1) {
		let betterThan = 0;
		let aliveCar;
		for (let i = 0; i < cars.length; i++) {
			if (cars[i].alive) {
				aliveCar = i;
				for (let j = 0; j < cars.length; j++) {
					if (i !== j && cars[i].score > cars[j].score) {
						betterThan++;
					}
				}
			}
		}

		if (betterThan === cars.length - 1) {
			cars[aliveCar].alive = false;
			deadCars++;
		}

		// if (cars[bestScore[1]].alive) {
		// 	cars[bestScore[1]].score++;
		// 	cars[bestScore[1]].alive = false;
		// 	deadCars++;
		// }
	}

}

function drawCars() {
	for (let i = 0; i < cars.length; i++) {
		if (cars[i].alive) {
			// Draw the car and the raycasts
			cars[i].draw(raceTrack);
			if (drawRaycasts) {
				cars[i].raycast(raceTrack, true);
			}
		}
	}
}

function defineTrack() {
	// All of the lines of the track

	innerPos = [
		[createVector(350, 150), createVector(525, 300)],
		[createVector(525, 300), createVector(520, 425)],
		[createVector(520, 425), createVector(575, 490)],
		[createVector(575, 490), createVector(580, 515)],
		[createVector(580, 515), createVector(590, 580)],
		[createVector(590, 580), createVector(625, 615)],
		[createVector(625, 615), createVector(675, 615)],
		[createVector(675, 615), createVector(750, 600)],
		[createVector(750, 600), createVector(815, 550)],
		[createVector(815, 550), createVector(965, 350)],
		[createVector(965, 350), createVector(975, 300)],
		[createVector(975, 300), createVector(950, 230)],
		[createVector(950, 230), createVector(880, 180)],
		[createVector(880, 180), createVector(890, 135)],
		[createVector(890, 135), createVector(935, 130)],
		[createVector(935, 130), createVector(1000, 180)],
		[createVector(1000, 180), createVector(1020, 255)],
		[createVector(1020, 255), createVector(1000, 375)],
		[createVector(1000, 375), createVector(1025, 500)],
		[createVector(1025, 500), createVector(1025, 545)],
		[createVector(1025, 545), createVector(975, 565)],
		[createVector(975, 565), createVector(750, 615)],
		[createVector(750, 615), createVector(625, 640)],
		[createVector(625, 640), createVector(525, 625)],
		[createVector(525, 625), createVector(475, 575)],
		[createVector(475, 575), createVector(250, 400)],
		[createVector(250, 400), createVector(175, 375)],
		[createVector(175, 375), createVector(150, 350)],
		[createVector(150, 350), createVector(175, 300)],
		[createVector(175, 300), createVector(250, 250)],
		[createVector(250, 250), createVector(275, 200)],
		[createVector(275, 200), createVector(275, 175)],
		[createVector(275, 175), createVector(255, 130)],
		[createVector(255, 130), createVector(270, 90)],
		[createVector(270, 90), createVector(350, 150)],
	];

	outerPos = [
		[createVector(400, 80), createVector(580, 225)],
		[createVector(580, 225), createVector(600, 270)],
		[createVector(600, 270), createVector(600, 380)],
		[createVector(600, 380), createVector(615, 420)],
		[createVector(615, 420), createVector(675, 475)],
		[createVector(675, 475), createVector(675, 515)],
		[createVector(675, 515), createVector(670, 540)],
		[createVector(670, 540), createVector(700, 540)],
		[createVector(700, 540), createVector(750, 500)],
		[createVector(750, 500), createVector(900, 300)],
		[createVector(900, 300), createVector(900, 275)],
		[createVector(900, 275), createVector(850, 250)],
		[createVector(850, 250), createVector(800, 200)],
		[createVector(800, 200), createVector(780, 150)],
		[createVector(780, 150), createVector(800, 100)],
		[createVector(800, 100), createVector(870, 65)],
		[createVector(870, 65), createVector(950, 65)],
		[createVector(950, 65), createVector(1025, 90)],
		[createVector(1025, 90), createVector(1100, 170)],
		[createVector(1100, 170), createVector(1100, 275)],
		[createVector(1100, 275), createVector(1090, 350)],
		[createVector(1090, 350), createVector(1125, 550)],
		[createVector(1125, 550), createVector(1100, 600)],
		[createVector(1100, 600), createVector(1050, 625)],
		[createVector(1050, 625), createVector(775, 675)],
		[createVector(775, 675), createVector(675, 700)],
		[createVector(675, 700), createVector(630, 685)],
		[createVector(630, 685), createVector(600, 700)],
		[createVector(600, 700), createVector(525, 710)],
		[createVector(525, 710), createVector(470, 690)],
		[createVector(470, 690), createVector(325, 550)],
		[createVector(325, 550), createVector(175, 450)],
		[createVector(175, 450), createVector(125, 425)],
		[createVector(125, 425), createVector(50, 350)],
		[createVector(50, 350), createVector(65, 300)],
		[createVector(65, 300), createVector(150, 225)],
		[createVector(150, 225), createVector(200, 175)],
		[createVector(200, 175), createVector(175, 125)],
		[createVector(175, 125), createVector(160, 70)],
		[createVector(160, 70), createVector(190, 30)],
		[createVector(190, 30), createVector(225, 15)],
		[createVector(225, 15), createVector(275, 10)],
		[createVector(275, 10), createVector(335, 25)],
		[createVector(335, 25), createVector(400, 80)],
	];

	checkpoints = [
		[createVector(350, 150), createVector(400, 80)],
		[createVector(510, 290), createVector(580, 225)],
		[createVector(525, 325), createVector(600, 320)],
		[createVector(520, 425), createVector(600, 380)],
		[createVector(575, 490), createVector(675, 475)],
		[createVector(675, 615), createVector(670, 540)],
		[createVector(750, 600), createVector(700, 540)],
		[createVector(750, 500), createVector(815, 550)],
		[createVector(975, 300), createVector(900, 300)],
		[createVector(950, 230), createVector(900, 275)],
		[createVector(880, 180), createVector(800, 200)],
		[createVector(880, 180), createVector(780, 150)],
		[createVector(890, 135), createVector(800, 100)],
		[createVector(890, 135), createVector(870, 65)],
		[createVector(935, 130), createVector(950, 65)],
		[createVector(965, 155), createVector(1025, 90)],
		[createVector(1000, 180), createVector(1100, 170)],
		[createVector(1020, 255), createVector(1100, 245)],
		[createVector(1000, 375), createVector(1090, 350)],
		[createVector(1025, 545), createVector(1050, 625)],
		[createVector(625, 640), createVector(630, 685)],
		[createVector(525, 625), createVector(470, 690)],
		[createVector(375, 495), createVector(325, 550)],
		[createVector(150, 350), createVector(50, 350)],
		[createVector(275, 200), createVector(200, 175)],
		[createVector(255, 130), createVector(175, 125)],
		[createVector(270, 90), createVector(225, 15)],
		[createVector(285, 105), createVector(335, 25)],
		// [createVector(, ), createVector(, )],
	]
}
