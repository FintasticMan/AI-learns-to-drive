class RaceTrack {
	constructor(innerPos, outerPos, checkpointsPos) {
		this.innerWalls = [];
		this.outerWalls = [];
		this.checkpoints = [];

		for (let i = 0; i < innerPos.length; i++) {
			this.innerWalls.push(new Wall(innerPos[i]));
		}

		for (let i = 0; i < outerPos.length; i++) {
			this.outerWalls.push(new Wall(outerPos[i]));
		}

		for (let i = 0; i < checkpointsPos.length; i++) {
			this.checkpoints.push(new Checkpoint(checkpointsPos[i]));
		}
	}

	draw() {
		for (let i = 0; i < this.innerWalls.length; i++) {
			this.innerWalls[i].draw();
		}

		for (let i = 0; i < this.outerWalls.length; i++) {
			this.outerWalls[i].draw();
		}

		for (let i = 0; i < this.checkpoints.length; i++) {
			this.checkpoints[i].draw();
		}
	}
}
