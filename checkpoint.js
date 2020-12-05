class Checkpoint {
	constructor(pos) {
		this.posA = pos[0];
		this.posB = pos[1];
	}

	draw() {
		push();
		stroke(0, 255, 0);
		line(this.posA.x, this.posA.y, this.posB.x, this.posB.y);
		pop();
	}
}
