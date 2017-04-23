Total functions created/edited-> 5.


1)  	grid.createVals:
	function uses array vals[] and enter numberse from 1 to numOfTiles/2 in pairs.
	then pass vals[] array to grid.shuffle for shuffling the values of vals[] for randomizing the 		game.

2) 	grid.shuffle:
 	function takes array of size numOfTiles containing pairs of numbers from 1 - numOfTiles/2.
	Function generates two random numbers in range 0 - (numOfTiles-1) and swap the numbers present
	at those two random places in the grid.
	This function return the vals[] array to createVals function. 	

3)	grid.tileClicked:
	Funtion flip the tile by toggling the classList of the tile that was clicked.
	if value of both open tiles is same then then add "solved" to classList of both the tiles.

4)	game.getStatus:
	function assign value to game.status.
	if the page was loaded for the first time then it assigns intial value and then.
	second time localStorage is used to update the value of game.status.

5) 	game.setStatus:
	function update the value of localStorage by newly updated game.status.

