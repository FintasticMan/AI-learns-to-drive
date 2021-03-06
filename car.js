class Car {
	constructor(pos, rot, col) {
		this.speed = 0;
		this.maxSpeed = 10;
		this.invSpeed = this.maxSpeed;
		// Multiplier for the acceleration and decelleration
		this.mult = 0.955;

		// Features of the car
		this.l = 32;
		this.w = 16;
		this.theta = atan(this.w / this.l);
		this.hyp = sqrt(sq(this.l / 2) + sq(this.w / 2));

		this.alive = true;
		this.pos = pos;
		this.rotation = rot;
		this.direction = [];
		this.time = 0;

		for (var i = 0; i < lag; i++) {
			this.direction.push(0);
		}
		this.direction[0] = rot;

		this.raycasts = 9;
		this.fov = PI + HALF_PI / 2;
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

		this.nn = new NeuralNetwork(this.raycasts + 2, 8, 2);

		this.score = 0;

		this.colour = col;

		this.checkpointsReached = 0;
		this.timeSinceCheckpoint = 0;

		this.x1 = 0;
		this.y1 = 0;
		this.x2 = 0;
		this.y2 = 0;
		this.x3 = 0;
		this.y3 = 0;
		this.x4 = 0;
		this.y4 = 0;
	}

	draw(track) {
		push();
		rectMode(CENTER);
		translate(this.pos);
		rotate(this.rotation);
		fill(this.colour);

		rect(0, 0, this.l, this.w);
		pop();

		if (showFitness) {
			push();
			textFont("monospace");
			textSize(24);
			fill(0, 63, 127);
			text(this.score, this.pos.x + 16, this.pos.y);
			let sinceLap = this.checkpointsReached % track.checkpoints.length;
			text((this.checkpointsReached - sinceLap) / track.checkpoints.length + " " + sinceLap, this.pos.x + 16, this.pos.y + 24);
			pop();
		}
	}

	isColliding(track) {
		// // Calculate all four corners of the car
		//
		// let x1 = this.pos.x + this.hyp * cos(this.rotation + this.theta);
		// let y1 = this.pos.y + this.hyp * sin(this.rotation + this.theta);
		//
		// let x2 = this.pos.x + this.hyp * cos(this.rotation - this.theta);
		// let y2 = this.pos.y + this.hyp * sin(this.rotation - this.theta);
		//
		// let x3 = this.pos.x - this.hyp * cos(this.rotation + this.theta);
		// let y3 = this.pos.y - this.hyp * sin(this.rotation + this.theta);
		//
		// let x4 = this.pos.x - this.hyp * cos(this.rotation - this.theta);
		// let y4 = this.pos.y - this.hyp * sin(this.rotation - this.theta);


		// Check if colliding with each separate wall

		for (let i = 0; i < track.innerWalls.length; i++) {

			if (linesCross([createVector(this.x1, this.y1), createVector(this.x2, this.y2)], [track.innerWalls[i].posA, track.innerWalls[i].posB])) {
				return true;
			}
			if (linesCross([createVector(this.x2, this.y2), createVector(this.x3, this.y3)], [track.innerWalls[i].posA, track.innerWalls[i].posB])) {
				return true;
			}
			// if (linesCross([createVector(this.x3, this.y3), createVector(this.x4, this.y4)], [track.innerWalls[i].posA, track.innerWalls[i].posB])) {
			// 	return true;
			// }
			if (linesCross([createVector(this.x4, this.y4), createVector(this.x1, this.y1)], [track.innerWalls[i].posA, track.innerWalls[i].posB])) {
				return true;
			}

		}

		for (let i = 0; i < track.outerWalls.length; i++) {

			if (linesCross([createVector(this.x1, this.y1), createVector(this.x2, this.y2)], [track.outerWalls[i].posA, track.outerWalls[i].posB])) {
				return true;
			}
			if (linesCross([createVector(this.x2, this.y2), createVector(this.x3, this.y3)], [track.outerWalls[i].posA, track.outerWalls[i].posB])) {
				return true;
			}
			// if (linesCross([createVector(this.x3, this.y3), createVector(this.x4, this.y4)], [track.outerWalls[i].posA, track.outerWalls[i].posB])) {
			// 	return true;
			// }
			if (linesCross([createVector(this.x4, this.y4), createVector(this.x1, this.y1)], [track.outerWalls[i].posA, track.outerWalls[i].posB])) {
				return true;
			}

		}

		// If it doesn't, return false

		return false;
	}

	raycast(track, draw) {

		// Calculate the rays' positions and directions
		for (let i = 0; i < this.raycasts; i++) {
			this.rays[i] = new Ray(this.pos, this.rotation - this.fov / 2 + this.fov / (this.raycasts - 1) * i);
		}

		let casts = [];
		let distances = [];

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
				// intersection = undefined;

			}

			for (let j = 0; j < track.outerWalls.length; j++) {

				intersection = this.rays[i].cast([track.outerWalls[j].posA, track.outerWalls[j].posB]);

				if (intersection !== false) {
					intersections.push(intersection);
				}
				// intersection = undefined;

			}

			// For each ray, find out which of the intersections found before is
			// the closest to the car
			for (let j = 0; j < intersections.length; j++) {

				let distanceCurrent = sqrt(sq(intersections[j].x - this.pos.x) + sq(intersections[j].y - this.pos.y));
				if (j === 0) {
					casts.push(intersections[j]);
					distances.push(distanceCurrent);
				} else {
					let distanceSmallest = sqrt(sq(casts[i].x - this.pos.x) + sq(casts[i].y - this.pos.y));

					if (distanceCurrent < distanceSmallest) {
						casts[i] = intersections[j];
						distances[i] = distanceCurrent;
					}
				}

			}
		}

		if (draw) {
			// Draw the rays
			for (let i = 0; i < casts.length; i++) {
				push();
				stroke(255);
				strokeWeight(1);
				line(this.pos.x, this.pos.y, casts[i].x, casts[i].y);
				pop();
			}
		}

		// Return the intersection points
		return [casts, distances];
	}



	move(a) {
		// My weird implementation for drifting, I use an array with the length
		// of the amount I want the direction to lag behind, and move all of the
		// values along it every frame
		for (let i = lag - 1; i > 0; i--) {
			this.direction[i] = this.direction[i - 1];
		}

		// this.invSpeed = this.invSpeed * this.mult;
		//
		// this.speed = this.maxSpeed - this.invSpeed;
		// noLoop();

		// If the up arrow is pressed, accelerate, otherwise decellerate
		if (a[1] >= 0.5) {
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
		if (a[0] < 0.3) {
			this.rotation -= QUARTER_PI / 12;
			this.direction[0] -= QUARTER_PI / 12;
		}
		if (a[0] > 0.7) {
			this.rotation += QUARTER_PI / 12;
			this.direction[0] += QUARTER_PI / 12;
		}

		// Calculate the amount to move the car
		this.pos.x += this.speed * cos(this.direction[lag - 1]);
		this.pos.y += this.speed * sin(this.direction[lag - 1]);
	}

	think(d) {
		let action;
		let inputs = [];
		for (let i = 0; i < d.length; i++) {
			inputs.push(map(d[i], 0, width, 0, 1));
		}
		inputs.push(map(this.speed, 0, this.maxSpeed, 0, 1));
		inputs.push(map(this.direction[lag - 1] - this.rotation, -1, 1, 0, 1));
		action = this.nn.predict(inputs);
		return action;
	}

	calcScore(track) {
		// // Calculate all four corners of the car
		//
		// let x1 = this.pos.x + this.hyp * cos(this.rotation + this.theta);
		// let y1 = this.pos.y + this.hyp * sin(this.rotation + this.theta);
		//
		// let x2 = this.pos.x + this.hyp * cos(this.rotation - this.theta);
		// let y2 = this.pos.y + this.hyp * sin(this.rotation - this.theta);
		//
		// let x3 = this.pos.x - this.hyp * cos(this.rotation + this.theta);
		// let y3 = this.pos.y - this.hyp * sin(this.rotation + this.theta);
		//
		// let x4 = this.pos.x - this.hyp * cos(this.rotation - this.theta);
		// let y4 = this.pos.y - this.hyp * sin(this.rotation - this.theta);


		let index = this.checkpointsReached % track.checkpoints.length;

		// Check if colliding with the next checkpoint

		if (linesCross([createVector(this.x1, this.y1), createVector(this.x2, this.y2)], [track.checkpoints[index].posA, track.checkpoints[index].posB])) {
			this.checkpointsReached++;
			this.timeSinceCheckpoint = 0;
		} else if (linesCross([createVector(this.x2, this.y2), createVector(this.x3, this.y3)], [track.checkpoints[index].posA, track.checkpoints[index].posB])) {
			this.checkpointsReached++;
			this.timeSinceCheckpoint = 0;
		} else if (linesCross([createVector(this.x4, this.y4), createVector(this.x1, this.y1)], [track.checkpoints[index].posA, track.checkpoints[index].posB])) {
			this.checkpointsReached++;
			this.timeSinceCheckpoint = 0;
		} else {
			this.timeSinceCheckpoint++;
		}

		this.time++;

		this.score = this.checkpointsReached;

	}


	calcCorners() {
		// Calculate all four corners of the car

		this.x1 = this.pos.x + this.hyp * cos(this.rotation + this.theta);
		this.y1 = this.pos.y + this.hyp * sin(this.rotation + this.theta);

		this.x2 = this.pos.x + this.hyp * cos(this.rotation - this.theta);
		this.y2 = this.pos.y + this.hyp * sin(this.rotation - this.theta);

		this.x3 = this.pos.x - this.hyp * cos(this.rotation + this.theta);
		this.y3 = this.pos.y - this.hyp * sin(this.rotation + this.theta);

		this.x4 = this.pos.x - this.hyp * cos(this.rotation - this.theta);
		this.y4 = this.pos.y - this.hyp * sin(this.rotation - this.theta);
	}
}
