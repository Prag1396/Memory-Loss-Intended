//Pragun Sharma
//psharma5

//Elias Klein, esklein

var GameStateHandler = { };

GameStateHandler.Preloader = function() {};
GameStateHandler.Preloader.prototype = {
    preload: function() {
      console.log('Preloader: preload');
      this.load.path = 'assets/';
      //adding background
      this.load.image('Background', 'FloorBackground.png');
      //Loading into Asset cache
      this.load.spritesheet('player', 'baddie.png', 32,32);
      //Loading a sprite that will serve as "darkness" around the player. There's probably a better way to do this,
      //and we'll almost definitely use it if there is one, because lighting effects are going to be important to
      //a game like this
      this.load.image('darkness', 'darkness.png');
  },
  create: function() {
    console.log('Preloader: create');
    //Preventing the key to affect browser view
    game.input.keyboard.addKeyCapture([Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT, Phaser.Keyboard.UP, Phaser.Keyboard.DOWN]);
  },
  update: function() {
  this.state.start('Play');
 }
};

GameStateHandler.Play = function() {
  var player, map, darkness;
};
GameStateHandler.Play.prototype = {
  preload: function() {
    console.log('Play: preload');
    this.load.tilemap('map', 'GameMap.json', null, Phaser.Tilemap.TILED_JSON); //Loding the map with tiles
    this.load.image('tiles', 'Tiles.png'); //loading tileset image
  },
  create: function() {
    console.log('Play: create');
    this.add.image(0,0, 'Background');
    map = this.add.tilemap('map'); //creating the map

    var game_width = map.widthInPixels;
    var game_height = map.heightInPixels;
    game.world.setBounds(0,0,game_width, game_height);

    map.addTilesetImage('Tiles', 'tiles');
    groundLayer = map.createLayer('TileLayer'); //creating a layer
    groundLayer.resizeWorld();
    game.time.advancedTiming = true;
    game.physics.startSystem(Phaser.Physics.ARCADE); //The type of physics system to start
    map.setCollisionBetween(0, 10000, true, groundLayer); //enabling collision for tiles used

    //Creating the player sprite
    player = game.add.sprite(110, game.world.height-50, 'player');
    game.physics.arcade.enable(player);
    player.frame = 1;
    player.body.collideWorldBounds = true;

    //Setting up the sprite as a physical body in Arcade Physics Engine
    player.anchor.setTo(0.5,0.5);
    cursors = game.input.keyboard.createCursorKeys();

    //set up darkness
    darkness = game.add.sprite(player.x, player.y, 'darkness');
    darkness.anchor.setTo(0.5,0.5);

    //tell camera to follow the player, and zoom in by sizing up the world by a factor of 2
    game.camera.follow(player);
    //game.world.scale.set(2); //tilemaps seem to be working strangely when it comes to scaling like this

  },
  update: function() {
    game.physics.arcade.collide(player, groundLayer);
    player.body.velocity.x = 0;
    player.body.velocity.y = 0;

    //make the player move
    //Key associated actions (left/right)
    if (cursors.left.isDown) {
        player.scale.x = 1;
        player.body.velocity.x = -200;
    } else if(cursors.right.isDown) {
         player.scale.x = -1;
         player.body.velocity.x = 200;
    } else {
      player.body.velocity.x = 0;
    }
    //(up/down)
    if(cursors.up.isDown) {
      player.body.velocity.y = -200;
    } else if(cursors.down.isDown) {
      player.body.velocity.y = 200;
    } else {
      player.body.velocity.y = 0;
    }
    //(spaghetti diagonals)
    if(player.body.velocity.x != 0 && player.body.velocity.y != 0){
      player.body.velocity.x *= 0.70710678118;//I'm adding spaghetti code to let you go diagonally
      player.body.velocity.y *= 0.70710678118;//after all, this isn't the main place we're working on movement
    }
    //have the darkness surround the player as they move
    darkness.x = player.x;
    darkness.y = player.y;
 }
};

  var game = new Phaser.Game(400, 400, Phaser.AUTO); // ooh, fancy, you can't even see what would be less than the screen size!
  game.state.add('Preloader', GameStateHandler.Preloader);
  game.state.add('Play', GameStateHandler.Play);
  game.state.start('Preloader');
