// The amount of cars, the amount of frames the direction lags behind the
// rotation (used for drifting), and the positions of the walls of the track
let amount = 500;
let lag = 8;
let innerPos;
let outerPos;

let drawRaycasts = false;
let deadCars = 0;

let generation = 0;

const cars = [];
let raceTrack;

function setup() {
	createCanvas(1280, 720);
	background(127);
	strokeWeight(4);

	// All of the lines of the track

	innerPos = [
		[createVector(300, 200), createVector(560, 140)],
		[createVector(560, 140), createVector(720, 230)],
		[createVector(720, 230), createVector(800, 250)],
		[createVector(800, 250), createVector(760, 320)],
		[createVector(760, 320), createVector(590, 350)],
		[createVector(590, 350), createVector(540, 500)],
		[createVector(540, 500), createVector(350, 470)],
		[createVector(350, 470), createVector(340, 350)],
		[createVector(340, 350), createVector(180, 250)],
		[createVector(180, 250), createVector(300, 200)],
	];

	outerPos = [
		[createVector(180, 120), createVector(340, 50)],
		[createVector(340, 50), createVector(600, 60)],
		[createVector(600, 60), createVector(750, 100)],
		[createVector(750, 100), createVector(930, 130)],
		[createVector(930, 130), createVector(1000, 220)],
		[createVector(1000, 220), createVector(920, 400)],
		[createVector(920, 400), createVector(680, 440)],
		// [createVector(680, 440), createVector(650, 520)],
		[createVector(680, 440), createVector(600, 640)],
		[createVector(600, 640), createVector(250, 570)],
		[createVector(250, 570), createVector(210, 410)],
		[createVector(210, 410), createVector(70, 320)],
		[createVector(70, 320), createVector(60, 200)],
		[createVector(60, 200), createVector(180, 120)],
	];

	raceTrack = new RaceTrack(innerPos, outerPos);

	newGeneration();

	// noLoop();
}

function draw() {
	// Clear the screen
	push();
	noStroke();
	fill(127);
	rect(0, 0, width, height);
	pop();

	raceTrack.draw();

	// Cycle through all of the cars
	for (let i = 0; i < cars.length; i++) {
		if (cars[i].alive) {
			// Read the inputs
			let rays = cars[i].raycast(raceTrack, false);
			let action = cars[i].think(rays[1]);
			cars[i].move(action);
			cars[i].score++;

			// Kill the car if it is hitting the track
			if (cars[i].isColliding(raceTrack)) {
				cars[i].alive = false;
				deadCars++;
			} else {
				// Draw the car and the raycasts
				cars[i].draw();
				if (drawRaycasts) {
					cars[i].raycast(raceTrack, true);
				}
			}

		} else {
			deadCars++;
		}
	}
	if (deadCars === cars.length) {
		newGeneration();
	}
	deadCars = 0;
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
			cars.push(new Car(createVector(360, 120), 0));
		}
	} else {
		let bestScore = [cars[0].score, 0];
		let currentscore;
		for (let i = 0; i < cars.length; i++) {
			let currentScore = cars[i].score;
			if (currentScore > bestScore[0]) {
				bestScore = [currentScore, i];
			}
		}
		let nn = cars[bestScore[1]].nn;
		cars[0] = new Car(createVector(360, 120), 0);
		cars[0].nn = nn;

		for (let i = 1; i < cars.length; i++) {
			cars[i] = new Car(createVector(360, 120), 0);
			cars[i].nn.mutate(mutate);
		}
	}

	generation++;
}

function mutate(x) {
  if (random(1) < 0.5) {
    let offset = randomGaussian() * 0.25;
    let newx = x + offset;
    return newx;
  } else {
    return x;
  }
}
