
# Asteroids!

This currently represents several hours of work, maybe 6-8 or so and multiple refactors later. Its moved beyond just a couple quick files into something with some structure and order. At some point I switched from Javascript to EMCA6, just so I could have a nice class syntax...it was killing me trying to do inheritence in JS.

## sketch.js
This is the main entry point called by p5, it has a game object which controls the state of the game. the update loop calls different run_<state> functions based on the current game state.

## ship.js, asteroid.js, laser.js
These a re exactly what they sound like, nothing to fancy. They all inherity from HeadingBasedMovement (in movement.js) which abstracts simple movement code.

## tracker.js
This defines the Tracker singleton which tracks all game objects and handles the update and render loop when requested. Its the responsibility of the run_<state> functions to actuall call Tracker.updateAll and Tracker.rednerAll as appropriate. The Tracker also implements a collision detection callback system to all simple collision checks between all objects of a given type to another type.

## animation.js
This defines a couple very simple animation primitives, Sequence which is a sequence of steps executed in order, moving from one to the next only after the current step is complete. The Step class is a single tick "animation", usuall used at the start or the end of sequence as a way to do initialization or cleanup. The Animation class allows for easy creation of animations that are of a fixed legth, it has both an update() function called every tick and a done() function called on completion of the animation.

## scoreboard.js 
This is the UI compoment. it is still really rough as there should be a seperate UI layer to allow drawing to it at anypoint, not just outside the main update loop.