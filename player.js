export class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 40;
    this.height = 20;
    this.speed = 5;
    this.dx = 0;
  }

  update() {
    this.x += this.dx;
    if (this.x < 0) this.x = 0;
    if (this.x > 800 - this.width) this.x = 800 - this.width;
  }

  draw(ctx) {
    ctx.fillStyle = 'lime';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  moveLeft() {
    this.dx = -this.speed;
  }

  moveRight() {
    this.dx = this.speed;
  }

  stop() {
    this.dx = 0;
  }
}
