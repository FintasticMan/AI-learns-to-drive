class RaceTrack {
	constructor(innerPos, outerPos) {
		this.innerWalls = [];
		this.outerWalls = [];

		for (let i = 0; i < innerPos.length; i++) {
			this.innerWalls.push(new Wall(innerPos[i]));
		}

		for (let i = 0; i < outerPos.length; i++) {
			this.outerWalls.push(new Wall(outerPos[i]));
		}
	}

	draw() {
		for (let i = 0; i < this.innerWalls.length; i++) {
			this.innerWalls[i].draw();
		}
		
		for (let i = 0; i < this.outerWalls.length; i++) {
			this.outerWalls[i].draw();
		}
	}
}
