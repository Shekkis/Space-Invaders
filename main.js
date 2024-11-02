import { Game } from './game.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 600;

const game = new Game(canvas.width, canvas.height);

function gameLoop() {
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  game.update();
  game.draw(ctx);

  if (game.hearts > 0) {
    requestAnimationFrame(gameLoop);
  } else {
    gameOver();
  }
}

function gameOver() {
  ctx.fillStyle = 'white';
  ctx.font = '48px Arial';
  ctx.fillText('GAME OVER', canvas.width / 2 - 120, canvas.height / 2);
  ctx.font = '24px Arial';
  ctx.fillText(`Final Score: ${game.score}`, canvas.width / 2 - 70, canvas.height / 2 + 40);
  ctx.fillText(`Waves Survived: ${game.wave}`, canvas.width / 2 - 90, canvas.height / 2 + 80);
}

// Start the game
game.start();
gameLoop();

document.addEventListener('keydown', (e) => game.handleKeyDown(e));
document.addEventListener('keyup', (e) => game.handleKeyUp(e));
