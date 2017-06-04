class HeadingBasedMovement {
  constructor(position, heading) {
    this.position = position.copy()
    this.heading = heading;
    this.velocity = createVector(0,0);
    this.heading_velocity = 0;
  }

  update() {
    this.heading += this.heading_velocity;
    this.position.add(this.velocity);
  }

  turn(direction) {
     this.heading_velocity = 0.1 * direction;
  }

  boost(direction) {
     var acceleration = p5.Vector.fromAngle(this.heading).mult(0.1 * direction);
     this.velocity.add(acceleration);
  }

  wrapAround(buffer) {
    if (this.position.x < -hwidth + buffer) {
      this.position.x = hwidth - buffer;
    } else if (this.position.x > hwidth - buffer) {
      this.position.x = -hwidth + buffer;
    }
    if (this.position.y < -hheight + buffer) {
      this.position.y = hheight - buffer;
    } else if (this.position.y > hheight - buffer) {
      this.position.y = -hheight + buffer;
    }
  }
}
