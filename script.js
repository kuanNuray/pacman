/* pacman.js */

/* level.js */
function Block(X, Y, I) {
	I = I || {};

	I.X = X;
	I.Y = Y;
	I.w = 20;
	I.h = 20;
	I.type = 1;

	I.draw = function() {
		ctx.fillStyle="#521466";
		ctx.fillRect(X, Y, I.h, I.w);
	}

	return I;
}

function Level(level) {
	var I = 0;
	var R = 0;
	level.forEach(function(brick){
		switch(brick) {
			case 1:
			blocks.push( new Block(I*20, R*20) );
			break;
			case 2:
			blocks.push( new Dot(I*20, R*20) );
			break;
			case 3:
			players.push( new Player(I*20, R*20) );
			brick = 0;
			break;
			case 4:
			blocks.push( new Pill(I*20, R*20) );
			break;
			case 5:
			ghosts.push( new Ghost(I*20, R*20) );
			brick = 0;
			break;
		}

		if ( I == 39 ) {
			R++;
			I = 0;
		} else {
			I++;
		}
	});
}

/* player.js */
function Player(X, Y, I) {
	I = I || {};
	I.startX = X;
	I.startY = Y;
	I.X = X;
	I.Y = Y
	I.h = 20;
	I.w = 20;
	I.direction = "r";
	I.speed = 4;
	I.pos = new Array();

	var keysdisabled = new Array();

	I.draw = function() {
		ctx.fillStyle="yellow";
		ctx.fillRect(I.X, I.Y, I.h, I.w);
	}

	I.update = function() {
		switch(I.direction) {
			case "r":
			if ( I.X + I.speed >= c.width - I.w) {
				I.X = 0;
			} else {
				I.X = I.X + I.speed;
			}
			break;
			case "l":
			if ( I.X + I.speed <= 0 ) {
				I.X = c.width - I.w;
			} else {
				I.X = I.X - I.speed;
			}
			break;
			case "u":
			if ( I.Y + I.speed <= 0 ) {
				I.direction = "s";
				I.Y = 0;
			} else {
				I.Y = I.Y - I.speed;
			}
			break;
			case "d":
			if ( I.Y + I.speed >= c.height - I.h ) {
				I.direction = "s";
				I.Y = c.height - I.h;
			} else {
				I.Y = I.Y + I.speed;
			}
			break;
		}
		
I.pos['me'] = getPosition(I.X,I.Y);
		I.pos['above'] = I.pos['me'] - 40;
		I.pos['below'] = I.pos['me'] + 40;
		I.pos['right'] = I.pos['me'] + 1;	
		I.pos['left']  = I.pos['me'] - 1;
		
		if ( I.X % 20 === 0 && I.Y % 20 === 0 ) {
			if ( keydown.Right == true && maps[0][I.pos['right']] != 1 ) {
				I.direction = "r";
			}
			if ( keydown.Left == true && maps[0][I.pos['left']] != 1 ) {
				I.direction = "l";
			}
			if ( keydown.Up == true && maps[0][I.pos['above']] != 1 ) {
				I.direction = "u";
			}
			if ( keydown.Down == true && maps[0][I.pos['below']] != 1 ) {
				I.direction = "d";
			}
			if ( keydown.Space == true ) {
			}
		}

		blocks.forEach(function(block) {
		var collide = collideDetect(I, block);
			// Count the remaining dots and pills.
			if ( block.type == 2 || block.type == 4 ) {
				if ( block.active == true ) remainingDots++;
			}

			// Detect collision with wall.
			if ( collide != false && block.type == 1) {
				I.X = collide['X'];
				I.Y = collide['Y'];
				I.direction = 'c';
			}
			// Detect collision with an active dot.
			if ( collide != false && block.type == 2 && block.active == true ) {
				block.collect();
			}
			// Detect collision with an active pill.
			if ( collide != false && block.type == 4 && block.active == true ) {
				block.collect();
				power = 1;
			}
		});

		ghosts.forEach(function(ghost){
			// Detect collision with ghost.
			var collide = collideDetect(I, ghost);
			if ( collide != false  && power == 0) {
				if ( lives == 0 ) paused = 1;
				lives--;
				I.X = I.startX;
				I.Y = I.startY;
				ghosts.forEach(function(ghost){
					ghost.X = ghost.startX;
					ghost.Y = ghost.startY;
				});
			} else if ( collide != false && power ==1 ){
				ghost.X = ghost.startX;
				ghost.Y = ghost.startY;
				score += 100;
			}
		});

	}
	return I;
}

/* player2.js */
(function () {
	var Game = {};

	Game.p = {	// Properties.
		Xpos 		: 100,
		Ypos 		: 100,
		Height 		: 20,
		Width 		: 20,
		speed 		: 4,
		direction 	: 0,
		keysEnabled	: true
	}

	Game.main = function() {

	}

	Game.draw = function() {
		
	}

	console.log(Game);

})();

/* maps.js */
/*
	Contains the map layouts.
	0 = Blank space.
	1 = Wall.
	2 = Dot.
	3 = Player.
	4 = Pill.
	5 = Ghost.
*/
