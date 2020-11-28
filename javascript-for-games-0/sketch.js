let amount = 1;
let lag = 12;

// class Car {
// 	constructor() {
// 		this.speed = 5;
// 		// this.x = 300;
// 		// this.y = 239;
// 		this.pos = createVector(300, 239);
// 		this.rotation = 0;
// 		this.direction = [];
// 		for (var i = 0; i < lag; i++) {
// 			this.direction.push(0);
// 		}
// 		// this.raycasts = 9;
// 		// this.nn = new NeuralNetwork(this.raycasts, 2 * this.raycasts, 1);
// 	}
// 	draw() {
// 		push();
// 		rectMode(CENTER);
// 		translate(this.pos);
// 		rotate(this.rotation);
// 		fill(127, 63);
// 		rect(0, 0, 50, 25);
// 		pop();
// 	}
// }


// const car1 = new Car();
const cars = [];

function setup() {
	createCanvas(1280, 720);
	background(127);
	strokeWeight(4);
	for (let i = 0; i < amount; i++) {
		cars.push(new Car());
	}
}

function draw() {
	drawTrack();
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

	if (keyIsDown(DOWN_ARROW)) {
		// if (cars[0].rotation != cars[0].direction) {
		// 	cars[0].direction = (cars[0].rotation + cars[0].direction * 23) / 24;
		// }
		cars[0].pos.x -= cars[0].speed * cos(cars[0].direction[lag - 1]);
		cars[0].pos.y -= cars[0].speed * sin(cars[0].direction[lag - 1]);
	}
	if (keyIsDown(UP_ARROW)) {
		// if (cars[0].rotation != cars[0].direction) {
		// 	cars[0].direction = (cars[0].rotation + cars[0].direction * 23) / 24;
		// }
		cars[0].pos.x += cars[0].speed * cos(cars[0].direction[lag - 1]);
		cars[0].pos.y += cars[0].speed * sin(cars[0].direction[lag - 1]);
	}
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

// function drawCar() {
// 	fill(127, 63);
// 	rect(0, 0, 50, 25);
// }
