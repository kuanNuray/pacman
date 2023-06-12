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
		
		
