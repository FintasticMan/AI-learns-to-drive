class Car {
	constructor(pos, rot) {
		this.speed = 0;
		this.maxSpeed = 7.5;
		this.invSpeed = this.maxSpeed;
		this.mult = 0.955;
		this.l = 32;
		this.w = 16;
		this.theta = atan(this.w / this.l);
		this.hyp = sqrt(sq(this.l / 2) + sq(this.w / 2));
		// this.x = 300;
		// this.y = 239;
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
		let x1 = this.pos.x + this.hyp * cos(this.rotation + this.theta);
		let y1 = this.pos.y + this.hyp * sin(this.rotation + this.theta);

		let x2 = this.pos.x + this.hyp * cos(this.rotation - this.theta);
		let y2 = this.pos.y + this.hyp * sin(this.rotation - this.theta);

		// console.log(x1, y1, x2, y2);

		// check if colliding with each separate wall
		for (let i = 0; i < track.innerWalls.length; i++) {
			// console.log(track.innerWalls[i])
			if (linesCross([createVector(x1, y1), createVector(x2, y2)], [track.innerWalls[i].posA, track.innerWalls[i].posB])) {
				return true;
			}
		}
		for (let i = 0; i < track.outerWalls.length; i++) {
			// console.log(track.innerWalls[i])
			if (linesCross([createVector(x1, y1), createVector(x2, y2)], [track.outerWalls[i].posA, track.outerWalls[i].posB])) {
				return true;
			}
		}
		return false;
	}
}
