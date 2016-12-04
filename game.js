window.test1 = 'hggngbn';
var GAME;

var STATUS = {
    action: 'wait',
    data: {
        angle: 230,
        player: 1
    }
};

var BULLET;

var turnIndex = 0;
var turns = [{
	n: 1,
	angle: 45,
	player: 1
}, {
	n: 2,
	angle: 45,
	player: 2
}, {
	n: 3,
	angle: -45,
	player: 1
}, {
	n: 4,
	angle: -45,
	player: 2
}, {
	n: 5,
	angle: 45,
	player: 1
}, {
	n: 5,
	angle: -45,
	player: 2
}]

function nextTurn() {
	return turns[turnIndex++];
}

(function() {
    'use strict';
    // Settings
    var PLAYER_SIZE = 100;
    var PLAYER_EDGE_DISTANCE = 85;
    var BULLET_SIZE = 80;
    var BULLET_VELOCITY = 800;
    var BULLET_LIFESPAN = 5000;
    var BULLET_MASS = 5;
    var COMPAS_HEIGHT = 290;
    var COMPAS_WIDTH = 155;
    var COMPAS_DISTANCE = 125;
    var OBSTACLE_FRICTION = 999;
    var OBSTACLE_DECELERATION = 2;
    var OBSTACLE_BOUNCE = 0.5;

    var GROUPS = {};

    function initPhaser() {
        GAME = new Phaser.Game(1280, 720,
            Phaser.CANVAS,
            'emoji-wars-space', {
                preload: preload,
                create: create,
                update: update
            });
    }

    window.addEventListener('game-ready', function(event) {
        console.log(event.detail);
    });

    function dispatchEvent(name, data) {
        data = data || {};
        var event = new CustomEvent('game-' + name, { 'detail': data });
        window.dispatchEvent(event);
        console.log('game-' + name);
    }

    function preload() {
        GAME.load.image('bg', 'assets/bg.png');
        GAME.load.image('ob1', 'assets/ob1.png');
        GAME.load.image('ob2', 'assets/ob2.png');
        GAME.load.image('ob3', 'assets/ob3.png');
        GAME.load.image('ob4', 'assets/ob4.png');
        GAME.load.image('ob5', 'assets/ob5.png');
        GAME.load.image('ob6', 'assets/ob6.png');
        GAME.load.image('ob7', 'assets/ob7.png');
        GAME.load.image('pl1_5', 'assets/pl1_5.png');
        GAME.load.image('pl2_5', 'assets/pl2_5.png');
        GAME.load.image('bu1', 'assets/bu1.png');
        GAME.load.image('bu2', 'assets/bu2.png');
        GAME.load.image('bu3', 'assets/bu3.png');
        GAME.load.image('bu4', 'assets/bu4.png');
        GAME.load.image('bu5', 'assets/bu5.png');
        GAME.load.image('bu6', 'assets/bu6.png');
        GAME.load.image('bu7', 'assets/bu7.png');
        GAME.load.image('bu8', 'assets/bu8.png');
        GAME.load.image('bu9', 'assets/bu9.png');
        GAME.load.image('co1', 'assets/co1.png');
        GAME.load.image('co2', 'assets/co2.png');
        GAME.load.image('li1', 'assets/li1.png');
        GAME.load.image('nm1', 'assets/nm1.png');
        GAME.load.image('nm2', 'assets/nm2.png');
    }

    function create() {
        GAME.physics.startSystem(Phaser.Physics.ARCADE);

        GAME.add.sprite(0, 0, 'bg');

        GROUPS.obstacles = createObstacles();
        GROUPS.players = createPlayers();
        // GROUPS.compas = createCompas();
        GROUPS.bullets = GAME.add.group();
        GROUPS.lifes = createLifes();
        GROUPS.bullets.enableBody = true;
        GROUPS.names = createNames();

        setTimeout(function() { dispatchEvent('ready') }, 1000);
    }

    function createCompas(p2) {
        var compas = GAME.add.group();
        var y = (GAME.height / 2) - (COMPAS_HEIGHT / 2);
        var x1 = COMPAS_DISTANCE;
        var x2 = GAME.width - COMPAS_DISTANCE - COMPAS_WIDTH;

        if (!p2) var compas1 = compas.create(x1, y, 'co1');
        if (p2) var compas2 = compas.create(x2, y, 'co2');

        compas.forEach(function(aCompas) {
            aCompas.height = COMPAS_HEIGHT;
            aCompas.width = COMPAS_WIDTH;
        });
    }

    function createObstacles() {
        var obstacles = GAME.add.group();
        obstacles.enableBody = true;

        var obstacle1 = obstacles.create(310, 90, 'ob1');
        var obstacle2 = obstacles.create(550, 104, 'ob2');
        var obstacle3 = obstacles.create(760, 200, 'ob3');
        var obstacle4 = obstacles.create(600, 360, 'ob4');
        var obstacle5 = obstacles.create(450, 460, 'ob5');
        var obstacle6 = obstacles.create(360, 260, 'ob6');
        var obstacle7 = obstacles.create(530, 195, 'ob7');

        obstacles.forEach(function(obstacle) {
           obstacle.height = 133;
           obstacle.width = 200;
           // obstacle.body.collideWorldBounds = true;
           obstacle.body.friction = OBSTACLE_FRICTION;
           obstacle.body.bounce.set(OBSTACLE_BOUNCE);
        });

       obstacle1.body.mass = 2.253;
       obstacle2.body.mass = 1.957;
       obstacle3.body.mass = 0.173;
       obstacle4.body.mass = 1.346;
       obstacle5.body.mass = 2.572;
       obstacle6.body.mass = 1.612;
       obstacle7.body.mass = 0.889;

       obstacle6.height =  obstacle7.height =  200;
       obstacle6.width =  obstacle7.width = 200;

       obstacle5.height = 100;
       obstacle5.width = 100;

       return obstacles;
    }

     function createLifes() {
        var lifes = GAME.add.group();
        var y = 80;
        var dis = 35;
        var bdis = 10;
        var bdis2 = 25;

        var life1 = lifes.create(bdis + dis*2, y, 'li1');
        var life2 = lifes.create(bdis + dis*3, y, 'li1');
        var life3 = lifes.create(bdis + dis*4, y, 'li1');
        var life4 = lifes.create(bdis + dis*5, y, 'li1');
        var life5 = lifes.create(bdis + dis*6, y, 'li1');

        var life6 = lifes.create(GAME.width - bdis2 - dis*2, y, 'li1');
        var life7 = lifes.create(GAME.width - bdis2 - dis*3, y, 'li1');
        var life8 = lifes.create(GAME.width - bdis2 - dis*4, y, 'li1');
        var life9 = lifes.create(GAME.width - bdis2 - dis*5, y, 'li1');
        var life10 = lifes.create(GAME.width - bdis2 - dis*6, y, 'li1');

        lifes.forEach(function(life) {
            life.height = 30;
            life.width = 30;
        });

        return lifes;
    }

     function createNames() {
        var names = GAME.add.group();
        var y = 40;
        var dis = 35;
        var bdis = 10;
        var bdis2 = 25;

        var name1 = names.create(bdis + dis*2, y, 'nm1');
        var name2 = names.create(GAME.width - bdis - dis*6+10, y, 'nm2');
        name1.height = 20;
        name1.width = 150;
        name2.height = 18;
        name2.width = 140;

        return names;
    }

    function createPlayers() {
        var x1 = PLAYER_EDGE_DISTANCE;
        var x2 = GAME.width - PLAYER_EDGE_DISTANCE - PLAYER_SIZE;
        var y = (GAME.height / 2) - (PLAYER_SIZE / 2);
        var size = PLAYER_SIZE;

        var players = GAME.add.group();
        players.enableBody = true;

        var player1 = players.create(x1, y, 'pl1_5');
        var player2 = players.create(x2, y, 'pl2_5');

        players.forEach(function(player) {
            player.width = player.height = size;
            player.body.immovable = true;
        });

        return players;
    }

    function update() {
        if (STATUS.action === 'wait') return;
        if (STATUS.action === 'fire') {
            STATUS.action = 'firing';
            var data = STATUS.data;
            var turn = nextTurn();

            STATUS.data.angle = turn.angle;
            STATUS.data.player = turn.player;

            fireBullet(STATUS.data.angle);
        }

        if (STATUS.action === 'firing') {
            GAME.physics.arcade.collide(GROUPS.bullets, GROUPS.obstacles);
            GAME.physics.arcade.collide(GROUPS.obstacles, GROUPS.obstacles);
            GAME.physics.arcade.collide(GROUPS.players, GROUPS.obstacles);
            GAME.physics.arcade.collide(GROUPS.bullets, GROUPS.players);

            if (!BULLET.alive) console.log('dead');
        }

        GROUPS.obstacles.forEach(function(obstacle) {
            var x = obstacle.body.velocity.x;
            var y = obstacle.body.velocity.y;

            var xchange = x*OBSTACLE_DECELERATION/100;
            var ychange = y*OBSTACLE_DECELERATION/100;

            if((x - xchange) > 0){
                obstacle.body.velocity.x = x - xchange;  
            } else {
                obstacle.body.velocity.x = 0;
            }

            if ((y - ychange) > 0) {
                obstacle.body.velocity.y = y - ychange; 
            } else {
                obstacle.body.velocity.y = 0;
            }
        });
    }

    function randomBullet() {
    	var max = 8;
    	var name = 'bu' + Math.floor(Math.random() * max + 1);
        return name;
    }

    function fireBullet(angle) {
        var pos = calcBulletPosition(angle);
        var player = STATUS.data.player;
        var image = randomBullet();

        BULLET = GROUPS.bullets.create(pos.x, pos.y, image);
        BULLET.height = BULLET.width = BULLET_SIZE;
        BULLET.body.collideWorldBounds = true;
        BULLET.body.bounce.set(0.5);
        BULLET.body.mass = BULLET_MASS;
        BULLET.lifespan = BULLET_LIFESPAN;

        if ([45, 0, -45].indexOf(angle) > -1) {
            BULLET.body.velocity.x = player === 1 ? BULLET_VELOCITY : -BULLET_VELOCITY;
        }

        if ([45, -45, 90, -90].indexOf(angle) > -1) {
            BULLET.body.velocity.y = angle > 0 ? -BULLET_VELOCITY : BULLET_VELOCITY;
        }
    }

    function calcBulletPosition(angle) {
        var x1 = PLAYER_EDGE_DISTANCE + (PLAYER_SIZE / 2) - (BULLET_SIZE / 2);
        var x2 = GAME.width - PLAYER_EDGE_DISTANCE - (PLAYER_SIZE / 2) - (BULLET_SIZE / 2);
        var y = (GAME.height / 2) - (BULLET_SIZE / 2);
        var player = STATUS.data.player;
        var x = player === 1 ? x1 : x2;

        var offset = {
            x: 0,
            y: 0
        };

        var separation = 10;

        switch (angle) {
            case 90:
                offset.y = -(PLAYER_SIZE / 2) - separation;
                break;
            case 45:
                offset.y = -80;
                offset.x = 80;
                break;
            case 0:
            default:
                offset.x = (PLAYER_SIZE / 2) + separation;
                break;
            case -45:
                offset.y = 80;
                offset.x = 80;
                break;
            case -90:
                offset.y = (PLAYER_SIZE / 2) + separation;
                break;
        }

        return {
            x: x + offset.x,
            y: y + offset.y
        }
    }

    function init() {
        initPhaser();
    }

    window.addEventListener('load', init);
})()
