const MIN_ASTEROID_SIZE = 15

var hwidth;
var hheight;

/**
 * Enum of the current game state
 */
class GameState {
  static get PAUSED() {
    return 1;
  }
  static get GAME_OVER() {
    return 2;
  }
  static get GAME_START() {
    return 4;
  }
  static get PLAYING() {
    return 8;
  }
  static get WAVE_START() {
    return 16;
  }
}

/**
 * Man game engine object that holds the current state and anything else
 * that needs to be tracked.
 */
var game = {
  state: GameState.GAME_START,
  ship: null
};

/**
 * P5 Setup
 */
function setup() {
  createCanvas(800, 800);

  hwidth = width * 0.5;
  hheight = height * 0.5;
}


/**
 * P5 Update loop
 */
function draw() {
  background(0);

  push();
  {
    // all game objects have the origin at the center of the canvas
    translate(hwidth, hheight);
    // switch on the current game state
    switch (game.state) {
      case GameState.GAME_START:
        run_game_start(game);
        break;
      case GameState.WAVE_START:
        run_wave_start(game);
        break;
      case GameState.PLAYING:
        run_game_playing(game);
        break;
      case GameState.PAUSED:
        run_game_paused(game);
        break;
      case GameState.GAME_OVER:
        run_game_over(game)
        break;
    }
  }
  pop();

  // ui is rendered last over the existing stuff
  // and is normal cordinates
  renderScore(game);
}

function run_game_start(game) {
  Tracker.renderAll();

  if (game.ship == null) {
    game.ship = new Ship(0, 0);
    game.score = 0;
    game.lives = 3;
    game.wave = 0;
    Tracker.add(game.ship)

    game.state = GameState.WAVE_START;
  }
}

function run_wave_start(game) {
  if (game.animation && !game.animation.is_done) {
    game.animation.tick()
    return
  }

  game.animation = new Sequence([
    new Step(function () {
      game.wave += 1;

      // reset the ship for the beginning of the wave
      game.ship.position.set(0, 0)
      game.ship.velocity.set(0, 0)
      Tracker.removeAll(Laser)

      // create the starting asteroids
      for (let i = 0; i < 5; i++) {
        // random point on the unit circle
        // set its magnitude to between 0 and half the screen width
        // move it from (0, 0) to the center of the screen
        let pos = p5.Vector.random2D().normalize().mult(random(0, hwidth)).add(width * .25, height * .25);

        Tracker.add(new Asteroid(pos, random(2*PI)));
      }
    }),
    new Animation()
      .ticks(20)
      .update(function(t) {
        textAlign(CENTER);
        textSize(32);
        let alpha = lerp(0, 255, t);
        fill(255,255,255, alpha);
        text("Wave " + game.wave, 0, 0);
      }),
    new Animation()
      .ticks(70)
      .update(function(t) {
        Tracker.renderAll()
        textAlign(CENTER);
        textSize(32);
        let alpha = lerp(0, 255, t);
        fill(255,255,255, 255-alpha);
        text("Wave " + game.wave, 0, 0);
      }).done(function() {
         game.state = GameState.PLAYING;
         game.animation = null
      })
  ])
}

function run_game_playing(game) {
  handleKeys(game);

  Tracker.updateAll();

  Tracker.collide(Asteroid, Laser,
    function(asteroid, laser) {
      return asteroid.containsPoint(laser.position)
    },
    function (asteroid, laser) {
      game.score += 10
      // only spawn new asteroids if they will be "big enough"
      if (asteroid.size > MIN_ASTEROID_SIZE) {
        Tracker.add(new Asteroid(asteroid.position, random(2*PI), asteroid.size * 0.5));
        Tracker.add(new Asteroid(asteroid.position, random(2*PI), asteroid.size * 0.5));
      }
      return [true, true]
    }
  );

  Tracker.collide(Asteroid, Ship,
    function(asteroid, ship) {
      return asteroid.containsPoint(ship.position)
    },
    function (asteroid, ship) {
      game.lives -= 1;
      if (game.lives <= 0) {
        game.state = GameState.GAME_OVER
        return [true, true]; // break out of all collision
      } else {
        ship.position.set(0, 0)
        return [true, false, true]; // break out of all collision
      }
    }
  )

  // if all the asteroids are destroyed move onto the next wave!
  if (Tracker.getInstances(Asteroid).length == 0) {
    game.state = GameState.WAVE_START
  }

  Tracker.renderAll();
}

function handleKeys(game) {
  const ship = game.ship;
  if (keyIsDown(LEFT_ARROW)) {
    ship.turn(-1);
  } else if (keyIsDown(RIGHT_ARROW)) {
     ship.turn(1);
  } else {
    ship.turn(0);
  }

  if (keyIsDown(UP_ARROW)) {
    ship.boost(1);
  } else if (keyIsDown(DOWN_ARROW)) {
    ship.boost(-1);
  }
}

// this is globally called by p5
function keyPressed() {
  const ship = game.ship;
  if (game.state === GameState.PLAYING) {
    if (key == ' ') {
      ship.shoot();
    }
  }
}

function game_paused(game) {
  Tracker.renderAll();
}

function run_game_over(game) {
  Tracker.updateAll();
  Tracker.renderAll();
}
