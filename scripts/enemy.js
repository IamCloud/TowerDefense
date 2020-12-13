class EnemyWave {
    constructor(enemyName, nbOfEnemies) {
        this.enemies = [];
        this.overrideActive = true;
        this.spawn(nbOfEnemies, enemyName);
    }
    spawn(nbOfEnemies, enemyName) {
        let wave = this.enemies;
        gameScene.spawnSound.play();
        for (let i = 0; i < nbOfEnemies; i++) {
            setTimeout(function () {
                wave.push(new Enemy(enemyName, i));
            }, 1000 * i);
        }
        this.overrideActive = false;
    }
    update() {          
        this.enemies.forEach(enemy => enemy.move());
    }
    isActive() {
        return this.overrideActive || this.enemies.filter(enemy => enemy.alive).length > 0;
    }
    clear() {
        this.enemies.forEach(enemy => enemy.destroy());
        this.enemies = [];
    }
}

class Enemy {
    constructor(name) {
        this.name = name;
        this.alive = true;
        this.img = null;
        this.targetTileIndex = 1;
        this.spawn();
    }
    spawn() {
        let x = gameScene.pathTiles[0].x;
        let y = gameScene.pathTiles[0].y;
        this.img = gameScene.drawImage(x, y, this.name).setInteractive();
    }
    move() {
        if (this.alive) {
            if (this.targetTileIndex >= gameScene.pathTiles.length || gameScene.pathTiles[this.targetTileIndex] === undefined) {
                this.enemySafe();
                return;
            } else {
                let target = new Coords(gameScene.pathTiles[this.targetTileIndex].x, gameScene.pathTiles[this.targetTileIndex].y)

                if (this.img.x < target.x) {
                    this.img.x ++;
                } else if (this.img.y < target.y) {
                    this.img.y ++;
                } else {
                    this.targetTileIndex++;
                }
            }
        }
    }
    enemySafe() {
        gameScene.destroySound.play();
        gameScene.score--;
        this.destroy();
    }
    destroy() {        
        this.img.destroy();
        this.alive = false;        
    }
}