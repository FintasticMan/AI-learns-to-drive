class Car {
	constructor() {
		this.speed = 0;
		this.maxSpeed = 7.5;
		this.invSpeed = this.maxSpeed;
		this.mult = 0.955;
		// this.x = 300;
		// this.y = 239;
		this.pos = createVector(300, 239);
		this.rotation = 0;
		this.direction = [];
		for (var i = 0; i < lag; i++) {
			this.direction.push(0);
		}
		// this.raycasts = 9;
		// this.nn = new NeuralNetwork(this.raycasts + 1, 2 * (this.raycasts + 1), 1);
	}
	draw() {
		push();
		rectMode(CENTER);
		translate(this.pos);
		rotate(this.rotation);
		fill(127, 63);
		rect(0, 0, 50, 25);
		pop();
	}
}
