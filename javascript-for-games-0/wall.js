class Wall {
	constructor(pos) {
		this.posA = pos[0];
		this.posB = pos[1];
	}

	draw() {
		line(this.posA.x, this.posA.y, this.posB.x, this.posB.y);
	}
}
