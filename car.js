class Car {
	constructor(pos, rot) {
		this.speed = 0;
		this.maxSpeed = 7.5;
		this.invSpeed = this.maxSpeed;
		// Multiplier for the acceleration and decelleration
		this.mult = 0.955;

		// Features of the car
		this.l = 32;
		this.w = 16;
		this.theta = atan(this.w / this.l);
		this.hyp = sqrt(sq(this.l / 2) + sq(this.w / 2));

		this.pos = pos;
		this.rotation = rot;
		this.direction = [];

		for (var i = 0; i < lag; i++) {
			this.direction.push(0);
		}
	}
	draw() {
		push();
		rectMode(CENTER);
		translate(this.pos);
		rotate(this.rotation);
		fill(127, 63);

		rect(0, 0, this.l, this.w);
		pop();
	}
	isColliding(track) {
		// Calculate all four corners of the car

		let x1 = this.pos.x + this.hyp * cos(this.rotation + this.theta);
		let y1 = this.pos.y + this.hyp * sin(this.rotation + this.theta);

		let x2 = this.pos.x + this.hyp * cos(this.rotation - this.theta);
		let y2 = this.pos.y + this.hyp * sin(this.rotation - this.theta);

		let x3 = this.pos.x - this.hyp * cos(this.rotation + this.theta);
		let y3 = this.pos.y - this.hyp * sin(this.rotation + this.theta);

		let x4 = this.pos.x - this.hyp * cos(this.rotation - this.theta);
		let y4 = this.pos.y - this.hyp * sin(this.rotation - this.theta);


		// Check if colliding with each separate wall

		for (let i = 0; i < track.innerWalls.length; i++) {

			// if (linesCross([createVector(x1, y1), createVector(x2, y2)], [track.innerWalls[i].posA, track.innerWalls[i].posB])) {
			// 	return true;
			// }
			if (linesCross([createVector(x2, y2), createVector(x3, y3)], [track.innerWalls[i].posA, track.innerWalls[i].posB])) {
				return true;
			}
			// if (linesCross([createVector(x3, y3), createVector(x4, y4)], [track.innerWalls[i].posA, track.innerWalls[i].posB])) {
			// 	return true;
			// }
			if (linesCross([createVector(x4, y4), createVector(x1, y1)], [track.innerWalls[i].posA, track.innerWalls[i].posB])) {
				return true;
			}

		}

		for (let i = 0; i < track.outerWalls.length; i++) {

			// if (linesCross([createVector(x1, y1), createVector(x2, y2)], [track.outerWalls[i].posA, track.outerWalls[i].posB])) {
			// 	return true;
			// }
			if (linesCross([createVector(x2, y2), createVector(x3, y3)], [track.outerWalls[i].posA, track.outerWalls[i].posB])) {
				return true;
			}
			// if (linesCross([createVector(x3, y3), createVector(x4, y4)], [track.outerWalls[i].posA, track.outerWalls[i].posB])) {
			// 	return true;
			// }
			if (linesCross([createVector(x4, y4), createVector(x1, y1)], [track.outerWalls[i].posA, track.outerWalls[i].posB])) {
				return true;
			}

		}

		// If it doesn't, return false

		return false;
	}
}
