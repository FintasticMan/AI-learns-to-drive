class Ray {
	constructor(pos, angle) {
		this.pos = pos;
		this.dir = p5.Vector.fromAngle(angle);
	}
	cast(line) {

		let x1 = line[0].x;
		let y1 = line[0].y;
		let x2 = line[1].x;
		let y2 = line[1].y;

		let x3 = this.pos.x;
		let y3 = this.pos.y;
		let x4 = this.pos.x + this.dir.x;
		let y4 = this.pos.y + this.dir.y;


		// Calculate u and t
		let den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
		let tNum = (x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4);
		let uNum = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3));
		let t = tNum / den;
		let u = uNum / den;

		// Check if the intersection is within the wall's segment, and on the
		// positive side of the ray
		if (t >= 0 && t <= 1 && u >= 0) {
			// If it is, calculate the position of the intersection, the
			// distance from the ray's position, and return the distance
			let intersect = createVector(0, 0);
			intersect.x = x1 + t * (x2 - x1);
			intersect.y = y1 + t * (y2 - y1);
			return intersect;
		} else {
			// If it isn't, return false
			return false;
		}

	}
}
