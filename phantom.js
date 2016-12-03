var events = require('events');
var eventEmitter = new events.EventEmitter();

var page = require('webpage').create();

// player #1
var player1 = function send_angle() {
   console.log('Player 1 send angle.');
}

// player #2
var player2 = function send_angle() {
  console.log('Player 2 send angle.');
}

// Bind the connection event with the player1 function
eventEmitter.addListener('ready', player1);

// Bind the connection event with the player2 function
eventEmitter.on('ready', player2);

var eventListeners = require('events').EventEmitter.listenerCount
   (eventEmitter,'ready');
console.log(eventListeners + " Player(s) listening to ready event");

// Fire the connection event 
eventEmitter.emit('ready');

player1 = function screenshoot() {
  console.log('Screenshoot');
  page.open('http://github.com/', function() {
  	page.render('github.png');
    phantom.exit();
	});
}

console.log("Program Ended.");