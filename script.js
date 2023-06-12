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


var maps = Array();

maps[0] = Array(
	1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
	1,4,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,1,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,4,1,
	1,2,1,1,1,1,1,1,1,2,1,1,1,1,1,1,1,2,1,1,1,1,2,1,1,1,1,1,1,1,2,1,1,1,1,1,1,1,2,1,
	1,2,1,1,1,1,1,1,1,2,1,1,1,1,1,1,1,2,1,1,1,1,2,1,1,1,1,1,1,1,2,1,1,1,1,1,1,1,2,1,
	1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,
	1,2,1,1,1,1,1,1,1,2,1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,1,2,1,1,1,1,1,1,1,2,1,
	1,2,2,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,2,1,1,2,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,2,2,1,
	1,1,1,1,1,1,1,1,1,2,1,1,1,1,1,1,1,1,2,1,1,2,1,1,1,1,1,1,1,1,2,1,1,1,1,1,1,1,1,1,
	1,0,0,0,0,0,0,0,1,2,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,2,1,0,0,0,0,0,0,0,1,
	1,1,1,1,1,1,1,1,1,2,1,2,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,2,1,2,1,1,1,1,1,1,1,1,1,
	2,2,2,2,2,2,2,2,2,2,2,2,1,0,0,5,0,0,0,0,0,0,0,0,0,0,0,1,2,2,2,2,2,2,2,2,2,2,2,2,
	1,1,1,1,1,1,1,1,1,2,1,2,1,0,0,0,0,0,5,5,5,5,0,0,0,0,0,1,2,1,2,1,1,1,1,1,1,1,1,1,
	1,0,0,0,0,0,0,0,1,2,1,2,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,2,1,2,1,0,0,0,0,0,0,0,1,
	1,1,1,1,1,1,1,1,1,2,1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,1,2,1,1,1,1,1,1,1,1,1,
	1,2,2,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,2,3,2,2,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,2,2,1,
	1,2,1,1,1,1,1,1,1,2,1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,1,2,1,1,1,1,1,1,1,2,1,
	1,2,2,2,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,2,2,2,1,
	1,1,1,2,1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,1,2,1,1,1,
	1,4,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,4,1,
	1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1
);

/* dot.js */
function Dot(X, Y, I) {
	I = I || {};
	I.X = X;
	I.Y = Y;
	I.h = 20;
	I.w = 20;
	I.active = true;
	I.type = 2;

	I.draw = function() {
		if ( I.active == true ) {
			var dotX = (I.X) + (I.w / 2) -1;
			var dotY = (I.Y) + (I.h / 2) -1;
			ctx.fillStyle="yellow";
			ctx.fillRect(dotX, dotY, 2, 2);
		}
	}

	I.collect = function() {
		I.active = false;
		score++;
	}

	return I;
}

/* pill.js */
function Pill(X, Y, I) {
	I = I || {};
	I.X = X;
	I.Y = Y;
	I.h = 20;
	I.w = 20;
	I.active = true;
	I.type = 4;

	I.draw = function() {
		if ( I.active == true ) {
			var dotX = (I.X) + (I.w / 2) -3;
			var dotY = (I.Y) + (I.h / 2) -3;
			ctx.fillStyle="yellow";
			ctx.fillRect(dotX, dotY, 6, 6);
		}
	}

	I.update = function() {

	}

	I.collect = function() {
		I.active = false;
		score += 10;
	}

	return I;
}

/* hud.js */
function Hud(X, Y, I) {
	I = I || {};
	I.X = 200;
	I.Y = 10;
	I.h = 20;
	I.w = 20;

	I.draw = function() {
		ctx.fillStyle="red";
		ctx.font="15px Arial";
		ctx.fillText("Score: "+score, 10, 420);
		ctx.fillText("Lives: "+lives, 10, 440);
		if ( lives < 0 ) ctx.fillText("Game Over!", 10, 460);
	}

	return I;
}
/* ghost.js */
function Ghost(X, Y, I) {
	I = I || {};
	I.X = X;
	I.Y = Y;
	I.startX = X;
	I.startY = Y;
	I.h = 20;
	I.w = 20;
	I.direction = "s";
	I.speed = 4;
	I.pos = new Array();

	var keysdisabled = new Array();

	I.draw = function() {
		if ( power == 0 ){
			ctx.fillStyle="red";
			ctx.fillRect(I.X, I.Y, I.h, I.w);
		} else if ( power == 1 ) {
			ctx.fillStyle="blue";
			ctx.fillRect(I.X, I.Y, I.h, I.w);
		}
	}

	I.update = function() {
		switch(I.direction) {
			case "r":
			if ( I.X + I.speed >= c.width - I.w) {
				I.direction = "s";
				I.X = c.width - I.w;
			} else {
				I.X = I.X + I.speed;
			}
			break;
			case "l":
			if ( I.X + I.speed <= 0 ) {
				I.direction = "s";
				I.X = 0;
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
		

		// Random AI for the ghost.
		if ( I.X % 20 === 0 && I.Y % 20 === 0 ) {
			var directions = new Array();
			for ( var key in I.pos ) {
				if ( maps[0][I.pos[key]] != 1 && key != "me") {
					if ( I.direction == 'l' && key != 'right') directions.push(key);
					if ( I.direction == 'r' && key != 'left') directions.push(key);
					if ( I.direction == 'u' && key != 'below') directions.push(key);
					if ( I.direction == 'd' && key != 'above') directions.push(key);
					if ( I.direction == 's' ) directions.push(key);
			}
		}

			var rnd = Math.floor( (Math.random()*directions.length) +0);
			switch(directions[rnd]) {
				case "right":
				I.direction = "r";
				break;
				case "left":
				I.direction = "l";
				break;
				case "above":
				I.direction = "u";
				break;
				case "below":
				I.direction = "d";
				break;
			}
		}

		blocks.forEach(function(block) {
		var collide = collideDetect(I, block);
			// Detect collision with wall.
			if ( collide != false && block.type == 1) {
				I.X = collide['X'];
				I.Y = collide['Y'];
				I.direction = 's';
			}
		});
// Manage the power count down.
		if ( power == 1 ) {
			var H = new Date();
			if ( powerTimer == 0 ) powerTimer = H.getTime();
			if ( H.getTime() > powerTimer + 10000 ) {
				power = 0;
				powerTimer = 0;
			}
		} 

	}
	return I;
}

/* engine.js */
var c = document.getElementById('gameCanvas');
var ctx = c.getContext("2d");
var FPS = 30;

var players		= new Array();
var blocks		= new Array();
var ghosts		= new Array();
var hud 		= new Hud();
var level   	= 0;
var score   	= 0;
var lives		= 3;
var power		= 0;
var powerTimer 	= 0;
var paused		= 0;
var remainingDots = 0;

Level(maps[level]);

function main()  {
	setInterval(function() {
		update();
		draw();
		}, 1000/FPS
	);

}

function update() {
	if ( paused == 1 ) return;
	players.forEach(function(player){
		player.update();
	});

	if ( remainingDots == 0 ) {
		paused = 1;
	} else {
		remainingDots = 0;
	}

	ghosts.forEach(function(ghost){
		ghost.update();
	});
}

function draw() {
	hud.draw();
	if ( paused == 1 ) return;
	ctx.fillStyle="#000000";
	ctx.fillRect(0, 0, 800, 600);

	blocks.forEach(function(block) {
		block.draw();
	});


	players.forEach(function(player){
		player.draw();
	});

	ghosts.forEach(function(ghost){
		ghost.draw();
	});


	hud.draw();
}

function collideDetect(player, block) {
	var X;
	var Y;

	// Detect left collide.
	if ( player.Y == block.Y && player.X < block.X + block.w && player.X > block.X ) {
		X = block.X + block.w;
		Y = player.Y;
		return {'X':X, 'Y':Y, 'D':'l'};
	}
	// Detect right collide.
	if ( player.Y == block.Y && player.X + player.w > block.X && player.X < block.X + block.w ) {
		X = block.X - player.w;
		Y = player.Y;
		return {'X':X, 'Y':Y, 'D':'l'};
	}
	// Detect bottom collide.
	if ( player.X == block.X && player.Y + player.h > block.Y && player.Y + player.h < block.Y + block.h ) {
		X = player.X;
		Y = block.Y - player.h;
		return {'X':X, 'Y':Y, 'D':'l'};
	}
