import { Player } from './player.js';
import { Invader } from './invader.js';
import { Bullet } from './bullet.js';

export class Game {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.player = new Player(width / 2, height - 30);
    this.invaders = [];
    this.bullets = [];
    this.score = 0;
    this.hearts = 500;
    this.wave = 0;
    this.spawnTimer = 0;
  }

  start() {
    this.wave = 1;
    this.invaders = this.createInvaders();
  }

  createInvaders() {
    const invaders = [];
    const baseChance = this.wave === 1 ? 0 : Math.min(0.05 + (this.wave - 1) * 0.05, 0.5);
    const rareChance = this.wave === 1 ? 0 : Math.min(0.02 + (this.wave - 1) * 0.05, 0.3);

    for (let y = 0; y < 5; y++) {
      for (let x = 0; x < 10; x++) {
        const random = Math.random();
        let type = 'red';

        if (this.wave > 1) {
          if (random < baseChance) {
            type = ['blue', 'yellow', 'orange'][Math.floor(Math.random() * 3)];
          } else if (random < baseChance + rareChance) {
            type = ['black', 'green', 'purple'][Math.floor(Math.random() * 3)];
          }
        }

        invaders.push(new Invader(x * 50 + 50, y * 40 + 40, type));
      }
    }
    return invaders;
  }

  update() {
    this.player.update();
    this.bullets.forEach(bullet => bullet.update());
    this.invaders.forEach(invader => invader.update(this.width, this.height));

    this.bullets = this.bullets.filter(bullet => !bullet.markedForDeletion);

    this.checkCollisions();
    this.checkInvadersReachedBottom();

    if (this.invaders.length === 0) {
      this.wave++;
      this.invaders = this.createInvaders();
    }

    this.spawnTimer++;
    if (this.spawnTimer >= 600) { // 10 seconds at 60 FPS
      this.spawnTimer = 0;
      this.invaders.forEach(invader => {
        if (invader.type === 'purple') {
          this.invaders.push(new Invader(invader.x, invader.y + 40, 'red'));
        }
      });
    }
  }

  draw(ctx) {
    this.player.draw(ctx);
    this.bullets.forEach(bullet => bullet.draw(ctx));
    this.invaders.forEach(invader => invader.draw(ctx));

    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${this.score}`, 10, 30);
    ctx.fillText(`Hearts: ${this.hearts}`, 10, 60);
    ctx.fillText(`Wave: ${this.wave}`, 10, 90);
  }

  handleKeyDown(e) {
    if (e.key === 'ArrowLeft') this.player.moveLeft();
    if (e.key === 'ArrowRight') this.player.moveRight();
    if (e.key === ' ') this.shoot();
  }

  handleKeyUp(e) {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') this.player.stop();
  }

  shoot() {
    this.bullets.push(new Bullet(this.player.x + this.player.width / 2, this.player.y));
  }

  checkCollisions() {
    this.bullets.forEach(bullet => {
      this.invaders.forEach(invader => {
        if (
          bullet.x < invader.x + invader.width &&
          bullet.x + bullet.width > invader.x &&
          bullet.y < invader.y + invader.height &&
          bullet.y + bullet.height > invader.y
        ) {
          bullet.markedForDeletion = true;
          invader.hit();
          if (invader.health <= 0) {
            invader.markedForDeletion = true;
            this.score += 10;
          }
        }
      });
    });

    this.invaders = this.invaders.filter(invader => !invader.markedForDeletion);
  }

  checkInvadersReachedBottom() {
    this.invaders.forEach(invader => {
      if (invader.y + invader.height >= this.height && !invader.reachedBottom) {
        this.hearts--;
        invader.reachedBottom = true;
      }
    });

    this.invaders = this.invaders.filter(invader => !invader.reachedBottom);
  }
}
