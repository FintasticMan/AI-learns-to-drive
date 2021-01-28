# AI Learns to Drive

This repository consists of:

- A simple game where a car drives around a top-down view of a track;  
	- The controls of the game are: accelerate, decelerate, turn left, and turn right;  
	- It incorporates drifting whereby the car skids around corners;  
	- The track is based on the Silverstone grand prix racetrack in the UK;  
	- It is written in JavaScript and uses the [p5.js](https://p5js.org/) library for among others the visuals;

- Raycasts coming from the cars to determine the distance from it to the walls;

- A neural network given to each car, to control it;  
	- It uses matrices of weights and biases to convert the inputs into outputs;  
		- The inputs are:  
			- The raycasts;  
			- The current speed;  
			- The difference between the rotation and direction (this is used for drifting);  
		- The outputs are:  
			- Whether to turn left, right, or carry on;  
			- Whether to accelerate or decelerate;  
	- There are 8 hidden layers in the neural network;  
	- It uses the [Toy-Neural-Network-JS](https://github.com/CodingTrain/Toy-Neural-Network-JS/) library to provide functionality for the neural network and neuro-evolution;

- A neuro-evolution algorithm for the neural networks to "learn";  
	- Every generation, the best car is chosen based on the amount of checkpoints it has passed;  
		- Checkpoints tracking the progress of the cars are placed in strategic points along the track;  
	- The weights and biases of the best car are used as a baseline to seed a new generation;  
	- On all of the new cars, there is then random mutation applied to the neural network;

- A user interface that gives the user some details of the learning progress and other statistics:  
	- The framerate (FPS);  
	- The amount of times the positions of the cars are calculated (CPS);  
	- The amount of cars that are still alive;  
	- The current generation;  
	- The amount of time in this generation (measured from the cars' perspective);  
	- The current coordinates of the mouse (used to ease the creation of the track and checkpoints);

- There are also buttons and sliders that the user can change to their liking:  
	- A pause/play button;  
	- A training mode button, which automatically sets some useful settings for the fastest training;  
	- Some toggles for the visibility of things on the screen;  
	- A button that toggles the automatic killing of the best car.  If there is only one car left, and if that car has the highest score, it will kill it, because for the training there is no reason to keep it alive.  Shouldn't be enabled if the user wants to watch the cars perform;  
	- A button that will kill all the cars.  This might mean that the car that is chosen to be the best during the creation of a new generation is worse than the previous best.  This might set back progress.  Only click this button if you know what you are doing;  
	- A slider for the speed that the simulation runs at.
