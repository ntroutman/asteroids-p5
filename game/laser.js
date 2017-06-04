
/**
 * Laser - Fire the LASERS!
 *
 * @param  {type} initial_position description
 * @param  {type} heading          description
 */
class Laser {
  constructor(initial_position, heading, speed) {
    this.position = initial_position.copy();
    this.velocity = p5.Vector.fromAngle(heading).mult(speed + 5);
  }

  update() {
      this.position.add(this.velocity);
      if (this.position.x < -hwidth || this.position.x > width || this.position.y < -hheight || this.position.y > height) {
        Tracker.remove(this)
      }
  }

  render() {
    push();
    {
      translate(this.position.x, this.position.y);
      strokeWeight(4);
      stroke(255);
      point(0, 0);
    }
    pop();
  }
}
