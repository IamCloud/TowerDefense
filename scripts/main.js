const BOX_SIZE = 16;
const PLAY_AREA_SIZE = {
  width: BOX_SIZE * 60, //960
  height: BOX_SIZE * 40 //640
}
const TOP_MARGIN_BOXES = 3;
const TOP_MARGIN = BOX_SIZE * TOP_MARGIN_BOXES;
let gameScene = new Phaser.Scene('Game');
gameScene.score = 0;
gameScene.scoreDisplay = null;

let config = {
  type: Phaser.AUTO,
  width: PLAY_AREA_SIZE.width, //960 x
  height: PLAY_AREA_SIZE.height, //640 y
  scene: gameScene
};

let game = new Phaser.Game(config);

//USED BY PHASER
gameScene.init = function () {
  gameScene.scoreDisplay = this.add.text(0, 0, 'Score: ' + gameScene.score, { fontSize: '32px', color: "white" });
}

gameScene.preload = function () {
  this.load.image('block', 'assets/block.png');
  this.load.image('wall', 'assets/wall.png');
  this.load.image('frog', 'assets/frog.png');
}

gameScene.create = function () {
  this.drawMap();
  this.initPlayerInputs();
  this.drawMapPath();
}

gameScene.update = function () {
  gameScene.scoreDisplay.text = "Score: " + gameScene.score;
}

//CUSTOM functions
gameScene.drawImage = function (x, y, name) {
  return gameScene.add.image(x, y, name).setOrigin(0, 0);
}

gameScene.initPlayerInputs = function () {
  gameScene.input.keyboard.on('keyup_SPACE', function (event) {
    gameScene.score++;
  });

  gameScene.input.keyboard.on('keyup_BACKSPACE', function (event) {
    gameScene.score--;
  });

  gameScene.input.keyboard.on('keyup_S', function (event) {
    gameScene.spawnEnemyWave('frog', 100);
  });
}

gameScene.drawMap = function () {

  for (let i = TOP_MARGIN; i < config.height; i += BOX_SIZE) {
    this.drawImage(0, i, 'block');
  }
  for (let i = BOX_SIZE; i < config.width; i += BOX_SIZE) {
    this.drawImage(i, config.height - BOX_SIZE, 'block');
  }
  for (let i = TOP_MARGIN; i < config.height; i += BOX_SIZE) {
    this.drawImage(config.width - BOX_SIZE, i, 'block');
  }
  for (let i = BOX_SIZE; i < config.width; i += BOX_SIZE) {
    this.drawImage(i, TOP_MARGIN, 'block');
  }
}

gameScene.spawnEnemyWave = function (enemyName, nbOfEnemies) {
  new EnemyWave(enemyName, nbOfEnemies).spawn();
}


/*     BOX_SIZE,TOP_MARGIN+BOX_SIZE        PLAY_AREA_SIZE.width-(BOX_SIZE*2),TOP_MARGIN+BOX_SIZE*/


/*     BOX_SIZE,PLAY_AREA_SIZE.height-(BOX_SIZE*2)     PLAY_AREA_SIZE.width-(BOX_SIZE*2),PLAY_AREA_SIZE.height(BOX_SIZE*2)*/

const PLAYGROUND_DIMENSIONS = {
  minBoxX: 1,
  maxBoxX: (PLAY_AREA_SIZE.width / BOX_SIZE) - 2,
  minBoxY: TOP_MARGIN_BOXES + 1,
  maxBoxY: (PLAY_AREA_SIZE.height / BOX_SIZE) - 2,
  minX: BOX_SIZE,
  maxX: PLAY_AREA_SIZE.width - (BOX_SIZE * 2),
  minY: TOP_MARGIN + BOX_SIZE,
  maxY: PLAY_AREA_SIZE.height - (BOX_SIZE * 2)
}

const DIRECTION = {
  Up: 1,
  Down: 2,
  Left: 3,
  Right: 4
}

class PathTile {
  constructor() {
    this.x = 0;
    this.y = 0;
  }
}



function GeneratePath(pathTile, direction) {
  let moveDirection

  do {
    moveDirection = getRndInteger(1, 4);
  } while (direction.lastDirection == moveDirection);


    switch (moveDirection) {
      case DIRECTION.Up:
        pathTile.y -= BOX_SIZE;
        break;
      case DIRECTION.Down:
        pathTile.y += BOX_SIZE;
        break;
      case DIRECTION.Left:
        pathTile.x -= BOX_SIZE;
        break;
      case DIRECTION.Right:
        pathTile.x += BOX_SIZE;
        break;
    }
  
  OutOfPlayGroundLimits(pathTile);
}

function OutOfPlayGroundLimits(pathTile) {
  if (pathTile.x > PLAYGROUND_DIMENSIONS.maxX)
    pathTile.x -= BOX_SIZE;
  if (pathTile.x < PLAYGROUND_DIMENSIONS.minX)
    pathTile.x += BOX_SIZE;
  if (pathTile.y > PLAYGROUND_DIMENSIONS.maxY)
    pathTile.y -= BOX_SIZE;
  if (pathTile.y < PLAYGROUND_DIMENSIONS.minY)
    pathTile.y += BOX_SIZE;
}

function PathIsCompleted(pathTile) {
  if (pathTile.x == PLAYGROUND_DIMENSIONS.maxX)
    return true;
  else
    return false;
}

function SetTileToLastTile(lastPathTile, newPathTile) {
  newPathTile.x = lastPathTile.x;
  newPathTile.y = lastPathTile.y;
}

gameScene.drawMapPath = function () {
  class Direction {
    constructor() {
      this.lastDirection = DIRECTION.Up;
    }
  }
  let direction = new Direction()
  let pathTiles = [];
  for (let i = 0; i < 250; i++) {
    pathTiles.push(new PathTile());
  }
  let Tile_x = 0;
  this.drawImage(PLAYGROUND_DIMENSIONS.minX,
    PLAYGROUND_DIMENSIONS.minY,
    'wall');

  do {
    if (Tile_x > 1) {
      SetTileToLastTile(pathTiles[Tile_x], pathTiles[Tile_x + 1]);
    }
    this.drawImage(pathTiles[Tile_x].x, pathTiles[Tile_x].y, 'wall');
    Tile_x++;
    GeneratePath(pathTiles[Tile_x], direction);
  } while (!PathIsCompleted(pathTiles));
}

class EnemyWave {
  constructor(enemyName, nbOfEnemies) {
    this.enemyName = enemyName;
    this.nbOfEnemies = nbOfEnemies;
  }
  spawn() {
    for (let i = 0; i < this.nbOfEnemies; i++) {
      let randomX = getRndInteger(PLAYGROUND_DIMENSIONS.minBoxX, PLAYGROUND_DIMENSIONS.maxBoxX);
      let randomY = getRndInteger(PLAYGROUND_DIMENSIONS.minBoxY, PLAYGROUND_DIMENSIONS.maxBoxY);
      gameScene.drawImage(randomX * BOX_SIZE,
        randomY * BOX_SIZE,
        this.enemyName);
    }
  }
}


//Utilities
function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


