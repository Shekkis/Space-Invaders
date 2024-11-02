export class Invader {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.width = type === 'purple' ? 40 : 30;
    this.height = type === 'purple' ? 40 : 30;
    this.type = type;
    this.speed = this.getSpeed();
    this.dx = this.speed;
    this.dy = 0;
    this.health = this.getHealth();
    this.markedForDeletion = false;
    this.reachedBottom = false;
  }

  getSpeed() {
    switch (this.type) {
      case 'yellow': return 1.2;
      case 'orange': return 0.8;
      default: return 1;
    }
  }

  getHealth() {
    switch (this.type) {
      case 'blue': return 2;
      case 'orange': return 4;
      case 'purple': return 4;
      default: return 1;
    }
  }

  update(canvasWidth, canvasHeight) {
    if (this.type === 'black') {
      this.x += this.dx;
      this.y += Math.abs(this.dx);
    } else if (this.type === 'green') {
      this.y += this.speed;
    } else {
      this.x += this.dx;
    }

    if (this.x <= 0 || this.x + this.width >= canvasWidth) {
      this.dx = -this.dx;
      this.y += 20;
    }
  }

  draw(ctx) {
    ctx.fillStyle = this.type;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  hit() {
    this.health--;
    if (this.health <= 0) {
      this.markedForDeletion = true;
    }
  }
}
