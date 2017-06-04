const ASTEROID_MAX_SIZE = 30;
const ASTEROID_MAX_SPEED = 1.25;
const ASTEROID_NUM_VERTS = 12;

class Asteroid extends HeadingBasedMovement {
  constructor(initial_position, heading, size) {
    super(initial_position, heading)
    if (size) {
      this.size = size
    } else {
      this.size = random(5, ASTEROID_MAX_SIZE/5) * 5
    }

    this.velocity = p5.Vector.fromAngle(heading).mult(random(.2, ASTEROID_MAX_SPEED))
    this.build()
  }

  update() {
    super.update()

    super.wrapAround(0)
  }

  containsPoint(point) {
    const dist = (this.position.x - point.x)**2 + (this.position.y - point.y)**2
    return dist < this.size**2
  }

  build() {
    this.verts = []
    const num_verts = ASTEROID_NUM_VERTS;
    for (let i = 0; i < num_verts; i++) {
      let theta = 2 * PI / num_verts * i
      let r = this.size + random(-.2 * this.size, .2 * this.size)
      let x = cos(theta) * r
      let y = sin(theta) * r
      this.verts.push([x, y])
    }
  }

  render() {
    push();
    {
      translate(this.position.x, this.position.y);
      strokeWeight(1);
      stroke(255);
      fill(0);
      beginShape();
      for (let i = 0; i < this.verts.length; i++) {        
        vertex(this.verts[i][0], this.verts[i][1]);
      }
      endShape(CLOSE);
    }
    pop();
  }
}
