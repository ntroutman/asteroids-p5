function renderScore(game) {
  fill(255, 255, 255, 200);
  const text_size = 32;
  textAlign(LEFT);
  textSize(text_size);
  text('Lives: ' + game.lives, 5, 5 + 32);
  textAlign(RIGHT);
  text('Score: ' + ("00000" + game.score).substr(-5, 5), width - 5, 5 + 32);  
}
