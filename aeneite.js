class Aeneite {
  constructor() {
    this.pos = createVector(random(width), random(height));
    this.vel = p5.Vector.random2D();
    this.acc = createVector();
    this.maxForce = 1;
    this.maxSpeed = 4;
    this.angle = 0;

    this.r = 6;

    this.perception = 100;

    this.brain = new Genome(3, 2);

    this.health = 1;
  }

  applyForce(force) {
    this.acc.add(force);
  }

  edges() {
    if (this.pos.x > width) {
      this.pos.x = 0;
    } else if (this.pos.x < 0) {
      this.pos.x = width;
    }

    if (this.pos.y > height) {
      this.pos.y = 0;
    } else if (this.pos.y < 0) {
      this.pos.y = height;
    }
  }

  think() {
    const inputs = [
      this.pos.x / width,
      this.pos.y / height,
      this.angle / TAU,
    ];
    let thoughts = this.brain.feedforward(inputs);

    let a = max(thoughts);

    let index = -1;

    for (var i = 0; i < thoughts.length; i++) {
      if (a == thoughts[i]) {
        index = i;
        break;
      }
    }

    switch (index) {
      case 0:
        this.angle = this.vel.heading();
        let dir = p5.Vector.fromAngle(this.angle).mult(a * 5);
        this.applyForce(dir);
        break;
      case 1:
        this.vel.rotate(a * 5);
        break;
      default:
        console.log("YOU ARE STUPID");
    }
  }

  update() {
    this.pos.add(this.vel);
    this.vel.add(this.acc);

    this.vel.limit(this.maxSpeed);

    this.acc.mult(0);
  }

  show(highlighted) {
    this.health -= 0.0005;
    fill(lerpColor(color(0), color(255), this.health));

    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.angle + HALF_PI);

    beginShape();
    vertex(0, -this.r * 2);
    vertex(-this.r, this.r * 2);
    vertex(this.r, this.r * 2);
    endShape(CLOSE);

    pop();
  }

  dead() {
    return this.health < 0;
  }
}
