
/**
 * Ship - Your might ship!
 */
class Ship extends HeadingBasedMovement {
  constructor(x, y) {
    super(createVector(x, y), 0);
    this.r = 15;
  }

  update() {
    super.update();

    // "friction"
    this.velocity.mult(0.99);

    super.wrapAround(this.r);
  }

  render() {
    push();
    {
      translate(this.position.x, this.position.y);
      rotate(this.heading);
      fill(0);
      stroke(255);
      triangle(-this.r, this.r, this.r, 0, -this.r, -this.r);
    }
    pop();
  }


  shoot() {
    // lasers are tracked globally
    Tracker.add(new Laser(this.position, this.heading, this.velocity.mag()));
  }
}
