let amount = 1;
let lag = 8;
let innerPos;
let outerPos;


// const car1 = new Car();
const cars = [];
let raceTrack;

function setup() {
	createCanvas(1280, 720);
	background(127);
	strokeWeight(4);
	innerPos = [
		[createVector(300, 200), createVector(560, 140)],
		[createVector(560, 140), createVector(720, 230)],
		[createVector(720, 230), createVector(800, 250)],
		[createVector(800, 250), createVector(760, 320)],
		[createVector(760, 320), createVector(590, 350)],
		[createVector(590, 350), createVector(540, 500)],
		[createVector(540, 500), createVector(350, 440)],
		[createVector(350, 440), createVector(340, 350)],
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
		[createVector(920, 400), createVector(750, 440)],
		[createVector(750, 440), createVector(650, 520)],
		[createVector(650, 520), createVector(600, 640)],
		[createVector(600, 640), createVector(250, 570)],
		[createVector(250, 570), createVector(210, 410)],
		[createVector(210, 410), createVector(70, 320)],
		[createVector(70, 320), createVector(60, 200)],
		[createVector(60, 200), createVector(180, 120)],
	];
	for (let i = 0; i < amount; i++) {
		cars.push(new Car(createVector(400, 150), 0));
	}
	raceTrack = new RaceTrack(innerPos, outerPos);
}

function draw() {
	// drawTrack();
	push();
	noStroke();
	fill(127);
	rect(0, 0, width, height);
	pop();
	raceTrack.draw();
	// if (cars[0].rotation != cars[0].direction) {
	// 	cars[0].direction = (cars[0].rotation + cars[0].direction * 31) / 32;
	// }
	// if (keyIsDown(DOWN_ARROW) === false && keyIsDown(UP_ARROW) === false) {
	// 	cars[0].direction = cars[0].rotation;
	// }
	// if (keyIsDown(DOWN_ARROW) || keyIsDown(UP_ARROW)) {
	// 	if (cars[0].rotation != cars[0].direction) {
	// 		cars[0].direction = (cars[0].rotation + cars[0].direction * 11) / 12;
	// 	}
	// }
	// if (cars[0].direction - cars[0].rotation > -QUARTER_PI / 16 && cars[0].direction - cars[0].rotation < QUARTER_PI / 16) {
	// 	cars[0].direction = cars[0].rotation;
	// }

	for (let i = lag - 1; i > 0; i--) {
		cars[0].direction[i] = cars[0].direction[i - 1];
	}

	// v1 = createVector(300, 239);


	// if (keyIsDown(DOWN_ARROW)) {
	// 	// if (cars[0].rotation != cars[0].direction) {
	// 	// 	cars[0].direction = (cars[0].rotation + cars[0].direction * 23) / 24;
	// 	// }
	//
	if (keyIsDown(UP_ARROW)) {
		// if (cars[0].rotation != cars[0].direction) {
		// 	cars[0].direction = (cars[0].rotation + cars[0].direction * 23) / 24;
		// }

		cars[0].invSpeed = cars[0].invSpeed * cars[0].mult;

		cars[0].speed = cars[0].maxSpeed - cars[0].invSpeed;
		// noLoop();
	} else {
		cars[0].speed = cars[0].speed * cars[0].mult;
		cars[0].invSpeed = cars[0].maxSpeed - cars[0].speed;
	}

	if (cars[0].speed < 0.05) {
      cars[0].speed = 0;
	  cars[0].invSpeed = cars[0].maxSpeed;
    }

	cars[0].pos.x += cars[0].speed * cos(cars[0].direction[lag - 1]);
	cars[0].pos.y += cars[0].speed * sin(cars[0].direction[lag - 1]);

	if (keyIsDown(LEFT_ARROW)) {
		cars[0].rotation -= QUARTER_PI / 12;
		cars[0].direction[0] -= QUARTER_PI / 12;
		// cars[0].direction -= QUARTER_PI / 12;
	}
	if (keyIsDown(RIGHT_ARROW)) {
		cars[0].rotation += QUARTER_PI / 12;
		cars[0].direction[0] += QUARTER_PI / 12;
		// cars[0].direction += QUARTER_PI / 12;
	}
	for (let i = 0; i < cars.length; i++) {
		cars[i].draw();
		if (cars[i].isColliding(raceTrack) === true) {
			cars[i] = new Car(createVector(400, 150), 0);
			// console.log("ded");
		}
	}
}

function drawTrack() {
	noStroke();
	fill(127);
	rect(0, 0, width, height);
	stroke(0);
	fill(255);
	rect(125, 200, 950, 400, 75);
	fill(127);
	rect(200, 275, 800, 250, 50);
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

	let den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
	let t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den;
	let u = -(((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / den);

	if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
		return true;
	} else {
		return false;
	}
}

// function drawCar() {
// 	fill(127, 63);
// 	rect(0, 0, 50, 25);
// }
