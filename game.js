var GAME;

var STATUS = {
    action: 'wait',
    data: {
        angle: 230,
        player: 1
    }
};

var BULLET;
(function() {
    'use strict';
    // Settings
    var PLAYER_SIZE = 100;
    var PLAYER_EDGE_DISTANCE = 200;
    var BULLET_SIZE = 30;
    var BULLET_VELOCITY = 400;

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
    }

    function preload() {
        GAME.load.image('bg', 'assets/bg.png');
        GAME.load.image('ob1', 'assets/ob1.png');
        GAME.load.image('pl1', 'assets/pl1.png');
        GAME.load.image('pl2', 'assets/pl2.png');
        GAME.load.image('bu1', 'assets/bu1.png');
    }

    function create() {
        GAME.physics.startSystem(Phaser.Physics.ARCADE);

        GAME.add.sprite(0, 0, 'bg');

        GROUPS.obstacles = createObstacles();
        GROUPS.players = createPlayers();
        GROUPS.bullets = GAME.add.group();
        GROUPS.bullets.enableBody = true;

        dispatchEvent('ready');
    }

    function createObstacles() {
        var obstacles = GAME.add.group();
        obstacles.enableBody = true;

        var obstacle1 = obstacles.create(50, 50, 'ob1');
        var obstacle2 = obstacles.create(350, 170, 'ob1');
        var obstacle3 = obstacles.create(790, 490, 'ob1');

        obstacles.forEach(function(obstacle) {
            obstacle.body.mass = 3;
            obstacle.body.bounce.set(1);
            obstacle.scale.setTo(0.2, 0.2);
        });

        return obstacles;
    }

    function createPlayers() {
        var x1 = PLAYER_EDGE_DISTANCE;
        var x2 = GAME.width - PLAYER_EDGE_DISTANCE - PLAYER_SIZE;
        var y = (GAME.height / 2) - (PLAYER_SIZE / 2);
        var size = PLAYER_SIZE;

        var players = GAME.add.group();
        players.enableBody = true;

        var player1 = players.create(x1, y, 'pl1');
        var player2 = players.create(x2, y, 'pl2');

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
            fireBullet(STATUS.data.angle);
        }

        if (STATUS.action === 'firing') {
            GAME.physics.arcade.collide(GROUPS.bullets, GROUPS.obstacles);
            GAME.physics.arcade.collide(GROUPS.obstacles, GROUPS.obstacles);
            GAME.physics.arcade.collide(GROUPS.players, GROUPS.obstacles);
            GAME.physics.arcade.collide(GROUPS.bullets, GROUPS.players);

            if (!BULLET.alive) console.log('dead');
        }
    }

    function fireBullet(angle) {
        var pos = calcBulletPosition(angle);
        var player = STATUS.data.player;

        BULLET = GROUPS.bullets.create(pos.x, pos.y, 'bu1');
        BULLET.height = BULLET.width = BULLET_SIZE;
        BULLET.body.collideWorldBounds = true;
        BULLET.body.bounce.set(1);
        BULLET.lifespan = 5000;

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
                offset.y = -45;
                offset.x = 45;
                break;
            case 0:
            default:
                offset.x = (PLAYER_SIZE / 2) + separation;
                break;
            case -45:
                offset.y = 45;
                offset.x = 45;
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
