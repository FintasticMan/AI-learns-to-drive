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

		this.raycasts = 7;
		this.fov = PI;
		this.rays = [];

		for (let i = 0; i < this.raycasts; i++) {
			this.rays.push(new Ray(this.pos, this.rotation - this.fov / 2 + this.fov / (this.raycasts - 1) * i));
		}

		// this.rays = [
		// 	new Ray(this.pos, this.rotation - HALF_PI),
		// 	new Ray(this.pos, this.rotation - HALF_PI / 3 * 2),
		// 	new Ray(this.pos, this.rotation - (HALF_PI / 3)),
		// 	new Ray(this.pos, this.rotation),
		// 	new Ray(this.pos, this.rotation + HALF_PI / 3),
		// 	new Ray(this.pos, this.rotation + HALF_PI / 3 * 2),
		// 	new Ray(this.pos, this.rotation + HALF_PI),
		// ];

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

	raycast(track) {

		// Calculate the rays' positions and directions
		for (let i = 0; i < this.raycasts; i++) {
			this.rays[i] = new Ray(this.pos, this.rotation - this.fov / 2 + this.fov / (this.raycasts - 1) * i);
		}

		let casts = [];

		// Cycle through all of the rays
		for (let i = 0; i < this.rays.length; i++) {

			let intersection;
			let intersections = [];

			// For every ray, cycle through all of the walls, and find out if
			// they intersect.  If they do, add the intersection point to an
			// array

			for (let j = 0; j < track.innerWalls.length; j++) {

				intersection = this.rays[i].cast([track.innerWalls[j].posA, track.innerWalls[j].posB]);

				if (intersection !== false) {
					intersections.push(intersection);
				}
				intersection = undefined;

			}

			for (let j = 0; j < track.outerWalls.length; j++) {

				intersection = this.rays[i].cast([track.outerWalls[j].posA, track.outerWalls[j].posB]);

				if (intersection !== false) {
					intersections.push(intersection);
				}
				intersection = undefined;

			}

			// For each ray, find out which of the intersections found before is
			// the closest to the car
			for (let j = 0; j < intersections.length; j++) {

				if (j === 0) {
					casts.push(intersections[j]);
				} else {
					let distanceCurrent = sqrt(sq(intersections[j].x - this.pos.x) + sq(intersections[j].y - this.pos.y));
					let distanceSmallest = sqrt(sq(casts[i].x - this.pos.x) + sq(casts[i].y - this.pos.y));

					if (distanceCurrent < distanceSmallest) {
						casts[i] = intersections[j]
					}
				}

			}
		}

		// Draw the rays
		for (let i = 0; i < casts.length; i++) {
			push();
			stroke(255);
			strokeWeight(2);
			line(this.pos.x, this.pos.y, casts[i].x, casts[i].y);
			pop();
		}

		// Return the intersection points
		return casts;
	}



	move() {
		// My weird implementation for drifting, I use an array with the length
		// of the amount I want the direction to lag behind, and move all of the
		// values along it every frame
		for (let i = lag - 1; i > 0; i--) {
			this.direction[i] = this.direction[i - 1];
		}

		// If the up arrow is pressed, accelerate, otherwise decellerate
		if (keyIsDown(UP_ARROW)) {
			this.invSpeed = this.invSpeed * this.mult;

			this.speed = this.maxSpeed - this.invSpeed;
			// noLoop();
		} else {
			this.speed = this.speed * this.mult;
			this.invSpeed = this.maxSpeed - this.speed;
		}

		// If the current speed is low enough, just stop the car
		if (this.speed < 0.05) {
		  this.speed = 0;
		  this.invSpeed = this.maxSpeed;
		}

		// Rotate the car
		if (keyIsDown(LEFT_ARROW)) {
			this.rotation -= QUARTER_PI / 12;
			this.direction[0] -= QUARTER_PI / 12;
		}
		if (keyIsDown(RIGHT_ARROW)) {
			this.rotation += QUARTER_PI / 12;
			this.direction[0] += QUARTER_PI / 12;
		}

		// Calculate the amount to move the car
		this.pos.x += this.speed * cos(this.direction[lag - 1]);
		this.pos.y += this.speed * sin(this.direction[lag - 1]);
	}
}
