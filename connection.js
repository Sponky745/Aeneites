class Connection {
  constructor(a, b, weight, expressed, innovation, outNode) {
    this.a = a;
    this.b = b;
    this.outNode = outNode;
    this.weight = weight;
    this.expressed = expressed;
    this.innovation = innovation;
  }

  enable() {
    this.expressed = true;
  }

  disable() {
    this.expressed = false;
  }

  feedforward(val) {
    this.outNode.addInput(val * this.weight);
  }

  copy() {
    return new Connection(this.a, this.b, this.weight, this.expressed, this.innovation);
  }
}
