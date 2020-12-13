const BOX_SIZE = 32;
const PLAY_AREA_SIZE = {
  width: BOX_SIZE * 30, //960
  height: BOX_SIZE * 20 //640
}
const TOP_MARGIN_BOXES = 2;
const RIGHT_MARGIN_BOXES = 10;
const TOP_MARGIN = BOX_SIZE * TOP_MARGIN_BOXES;
const RIGHT_MARGIN = BOX_SIZE * RIGHT_MARGIN_BOXES;
let gameScene = new Phaser.Scene('Game');
gameScene.score = 0;
gameScene.scoreDisplay = null;
gameScene.enemyWave = null;

let config = {
  type: Phaser.AUTO,
  width: PLAY_AREA_SIZE.width, //960 x
  height: PLAY_AREA_SIZE.height, //640 y
  scene: gameScene,
  audio: {
    disableWebAudio: true
  }
};

let game = new Phaser.Game(config);

//USED BY PHASER
gameScene.preload = function () {
  this.load.audio('pouf', 'assets/audio/pouf.m4a');
  this.load.audio('shwing', 'assets/audio/Shwing.m4a');
  this.load.audio('allmyfriendsaredead', 'assets/audio/AllMyFriendsAreDead.m4a');
  this.load.audio('spawnsound', 'assets/audio/Spawn.m4a');
  this.load.image('block', 'assets/block.png');
  this.load.image('path', 'assets/path.png');
  this.load.image('frog', 'assets/frog.png');
  this.load.image('tower', 'assets/tower.png');
}

gameScene.init = function () {
  gameScene.scoreDisplay = this.add.text(0, 0, 'Score: ' + gameScene.score, { fontSize: '32px', color: "white" });
  this.add.text(200, 0, 'S: Spawn wave', { fontSize: '12px', color: "white" });
  this.add.text(400, 0, 'D: Generate path', { fontSize: '12px', color: "white" });
  this.add.text(600, 0, 'C: Clear ennemies', { fontSize: '12px', color: "white" });
}

gameScene.create = function () {
  gameScene.poufSound = this.sound.add('pouf');
  gameScene.shwingSound = this.sound.add('shwing');
  gameScene.allMyFriendsAreDeadSound = this.sound.add('allmyfriendsaredead');
  gameScene.spawnSound = this.sound.add('spawnsound');
  this.drawMap();
  this.initPlayerInputs();
}

gameScene.update = function () {
  gameScene.scoreDisplay.text = "Score: " + gameScene.score;

  if (gameScene.enemyWave) {
    gameScene.enemyWave.update();
  }
}

//CUSTOM functions
gameScene.drawImage = function (x, y, name) {
  return gameScene.add.sprite(x, y, name).setOrigin(0, 0);
}

gameScene.initPlayerInputs = function () {
  gameScene.input.keyboard.on('keyup_SPACE', function (event) {
    gameScene.score++;
  });

  gameScene.input.keyboard.on('keyup_BACKSPACE', function (event) {
    gameScene.score--;
  });

  gameScene.input.keyboard.on('keyup_S', function (event) {
    gameScene.spawnSound.play();
    gameScene.spawnEnemyWave('frog', 10);
    
  });

  gameScene.input.keyboard.on('keyup_D', function (event) {
    gameScene.shwingSound.play();
    gameScene.drawMapPath();
    
  });

  gameScene.input.keyboard.on('keyup_C', function (event) {
    gameScene.allMyFriendsAreDeadSound.play();
    gameScene.enemyWave.clear();
    
  });
}

gameScene.drawMap = function () {

  //Vertical left
  for (let i = PLAYGROUND_DIMENSIONS.minY - BOX_SIZE; i < PLAYGROUND_DIMENSIONS.maxY + BOX_SIZE; i += BOX_SIZE) {
    let img = this.drawImage(0, i, 'block').setInteractive();
    img.on('pointerdown', onBlockClick);
  }
  //Horizontal bottom
  for (let i = BOX_SIZE; i < PLAYGROUND_DIMENSIONS.maxX; i += BOX_SIZE) {
    let img = this.drawImage(i, PLAYGROUND_DIMENSIONS.maxY, 'block').setInteractive();
    img.on('pointerdown', onBlockClick);
  }
  //Vertical right
  for (let i = PLAYGROUND_DIMENSIONS.minY - BOX_SIZE; i < PLAYGROUND_DIMENSIONS.maxY + BOX_SIZE; i += BOX_SIZE) {
    let img = this.drawImage(PLAYGROUND_DIMENSIONS.maxX, i, 'block').setInteractive();
    img.on('pointerdown', onBlockClick);
  }
  //Horizontal top
  for (let i = BOX_SIZE; i < PLAYGROUND_DIMENSIONS.maxX; i += BOX_SIZE) {
    let img = this.drawImage(i, PLAYGROUND_DIMENSIONS.minY - BOX_SIZE, 'block').setInteractive();
    img.on('pointerdown', onBlockClick);
  }

  function onBlockClick() {
    this.destroy();
    gameScene.drawImage(this.x, this.y, 'tower');
  }
}

gameScene.spawnEnemyWave = function (enemyName, nbOfEnemies) {
  if (gameScene.enemyWave) {
    gameScene.enemyWave.clear();
  }
  gameScene.enemyWave = new EnemyWave(enemyName, nbOfEnemies).spawn();
}

class EnemyWave {
  constructor(enemyName, nbOfEnemies) {
    this.enemyName = enemyName;
    this.nbOfEnemies = nbOfEnemies;
    this.enemyImages = [];
  }
  spawn() {
    for (let i = 0; i < this.nbOfEnemies; i++) {
      let randomX = getRndInteger(PLAYGROUND_DIMENSIONS.minBoxX, PLAYGROUND_DIMENSIONS.maxBoxX);
      let randomY = getRndInteger(PLAYGROUND_DIMENSIONS.minBoxY, PLAYGROUND_DIMENSIONS.maxBoxY);
      let enemy = gameScene.drawImage(randomX * BOX_SIZE,
        randomY * BOX_SIZE,
        this.enemyName).setInteractive();
      enemy.on('pointerdown', function () {
        this.destroy();
        gameScene.poufSound.play();
      });
      this.enemyImages.push(enemy);
    }
    return this;
  }
  update() {
    for (let i = 0; i < this.enemyImages.length; i++) {
      let moveDirection = getRndInteger(1, 4);
      switch (moveDirection) {
        case DIRECTION.Up:
          this.enemyImages[i].y--;
          break;
        case DIRECTION.Down:
          this.enemyImages[i].y++;
          break;
        case DIRECTION.Left:
          this.enemyImages[i].x--;
          break;
        case DIRECTION.Right:
          this.enemyImages[i].x++;
          break;
      }
    }
  }
  clear() {
    for (let i = 0; i < this.enemyImages.length; i++) {
      this.enemyImages[i].destroy();
    }
  }
}

/*     BOX_SIZE,TOP_MARGIN+BOX_SIZE        PLAY_AREA_SIZE.width-(BOX_SIZE*2),TOP_MARGIN+BOX_SIZE*/


/*     BOX_SIZE,PLAY_AREA_SIZE.height-(BOX_SIZE*2)     PLAY_AREA_SIZE.width-(BOX_SIZE*2),PLAY_AREA_SIZE.height(BOX_SIZE*2)*/

const PLAYGROUND_DIMENSIONS = {
  minBoxX: 1,
  maxBoxX: (PLAY_AREA_SIZE.width / BOX_SIZE) - RIGHT_MARGIN_BOXES - 2,
  minBoxY: TOP_MARGIN_BOXES + 1,
  maxBoxY: (PLAY_AREA_SIZE.height / BOX_SIZE) - 2,
  minX: BOX_SIZE,
  maxX: PLAY_AREA_SIZE.width - RIGHT_MARGIN,
  minY: TOP_MARGIN + BOX_SIZE,
  maxY: PLAY_AREA_SIZE.height - BOX_SIZE
}

const DIRECTION = {
  Up: 1,
  Down: 2,
  Left: 3,
  Right: 4
}

class PathTile {
  constructor() {
    this.x = PLAYGROUND_DIMENSIONS.minX;
    this.y = PLAYGROUND_DIMENSIONS.minY;
  }
}

function GeneratePath(pathTile, direction) {
  let moveDirection;

  do {
    if (getRndInteger(1, 3) != 3)
      moveDirection = getRndInteger(1, 4);
    else
      moveDirection = getRndInteger(2, 4); // a revoir...
  } while (direction.lastDirection == moveDirection);


  switch (moveDirection) {
    case DIRECTION.Up:
      pathTile.y -= BOX_SIZE;
      break;
    case DIRECTION.Down:
      pathTile.y += BOX_SIZE;
      break;
    case DIRECTION.Left+4:
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
  if (pathTile.x >= PLAYGROUND_DIMENSIONS.maxX
    || pathTile.y >= PLAYGROUND_DIMENSIONS.maxY)
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
    pathTiles[i] = new PathTile();
  }
  let Tile_x = 0;
  this.drawImage(PLAYGROUND_DIMENSIONS.minX,
    PLAYGROUND_DIMENSIONS.minY,
    'path');

  do {
    if (Tile_x > 1) {
      SetTileToLastTile(pathTiles[Tile_x], pathTiles[Tile_x + 1]);
    }
    this.drawImage(pathTiles[Tile_x].x, pathTiles[Tile_x].y, 'path');
    Tile_x++;
    GeneratePath(pathTiles[Tile_x], direction);
  } while (!PathIsCompleted(pathTiles[Tile_x]));
}




