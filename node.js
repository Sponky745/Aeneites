class Node {
  constructor(type, id) {
    this.type = type;
    this.id = id;
    this.inputs = [];
    this.outputConnections = [];

    this.activation = Node.activations.Tanh;

    this.sum = 0;
  }

  activate(x) {

    switch (this.activation) {
      case Node.activations.ReLU:
        return max(x, 0);
        break;
      case Node.activations.ReLU6:
        return min(max(x, 0), 1);
        break;
      case Node.activations.LeakyReLU:
        return max(x, 0.1 * x);
        break;
      case Node.activations.Sigmoid:
        return 1 / (1 + exp(-x));
        break;
      case Node.activations.Tanh:
        return Math.tanh(x);
        break;
      case Node.activations.Gaussian:
        const sigma = 0.4;
        const mu = 0;

        return (1 / (sigma * sqrt(TAU))) * exp(pow(-(1 / 2) * ((x - mu) / sigma), 2));
        break;
      default:
        return x;
    }
  }

  addInput(input) {
    this.inputs.push(input);
  }

  setInputs(inputs) {
    this.inputs = [...inputs];
  }

  engage() {
    this.sum = 0;

    for (let i = 0; i < this.inputs.length; i++) {
      this.sum += this.inputs[i];
    }

    this.sum = this.activate(this.sum);

    for (let c of this.outputConnections) {
      c.feedforward(this.sum);
    }
  }

  copy() {
    return new Node(this.type, this.id);
  }
}


Node.types = {
  Input: "I",
  Hidden: "H",
  Output: "O",
};

Node.activations = {
  ReLU: "R",
  ReLU6: "R6",
  LeakyReLU: "LR",
  Sigmoid: "S",
  Tanh: "T",
  Gaussian: "G",
};
