class Genome {
  constructor(numI, numO) {
    this.numI = numI + 1;
    this.numO = numO;
    this.nodes = [];
    this.connections = [];

    for (let i = 0; i < this.numI; i++) {
      this.nodes.push(new Node(Node.types.Input , this.nodes.length));
    }
    for (let i = 0; i < this.numO; i++) {
      this.nodes.push(new Node(Node.types.Output, this.nodes.length));
    }
  }

  mutate(i) {
    const chance = random(1);
    if (chance < 0.5) {
      return this.addConnection(i);
    } else if (chance < 0.35) {
      return this.adjustWeight();
    } else if (this.connections.length > 0) {
      return this.addNode(i);
    }
    return 0;
  }

  connect() {
    for (const n of this.nodes) {
      n.outputConnections = [];
      n.inputs = [];
    }

    for (const c of this.connections) {
      this.nodes[c.a].outputConnections.push(c);
    }
  }

  feedforward(inputs) {
    this.connect();
    this.nodes.sort((a, b) => {
      if (a.type == Node.types.Hidden && b.type == Node.types.Output)
        return -1;
      if (b.type == Node.types.Hidden && a.type == Node.types.Output)
        return 1;
      if (b.id < a.id)
        return 1;

      return 0;
    });


    const inputWithBias = [1, ...inputs];
    for (let i = 0; i < this.numI; i++) {
      this.nodes[i].setInputs([inputWithBias[i]]);
    }

    for (let i = 0; i < this.nodes.length; i++) {
      this.nodes[i].engage();
    }

    let out = [];

    for (let i = this.nodes.length - this.numO; i < this.nodes.length; i++) {
      out.push(this.nodes[i].sum);
    }

    return [...out];

  }

  // crossover(parent2) {
  //   let child = new Genome();
  //
  //   for (const node of this.nodes) {
  //     child.addGene(node.copy());
  //   }
  //
  //   for (const con of this.connections) {
  //     if (parent2.connections.includes(con)) {
  //
  //     }
  //   }
  // }

  addGene(gene) {
    if (gene instanceof Connection) {
      this.connections.push(gene);
      return;
    } else if (gene instanceof Node) {
      this.nodes.splice(gene.id, 0, gene);
    }
  }

  adjustWeight() {
    for (let c of this.connections) {
      if (random(1) < 0.9) {
        c.weight += random(-0.05, 0.05);
      } else {
        c.weight = random(-1, 1);
      }
    }
  }

  addConnection(innovation) {
    const a = random(this.nodes);
    const b = random(this.nodes);

    if (a === b) {
      // console.warn('Add Connection Mutation: A is equal to B');
      return 0;
    }
    if ((a.type == b.type) && (a.type == Node.types.Input || a.type == Node.types.Output)) {
      // console.warn('Add Connection Mutation: A is in the same layer as B');
      return 0;
    }

    let reversed = (a.type == Node.types.Hidden && b.type == Node.types.Input ||
                    a.type == Node.types.Output && b.type == Node.types.Input ||
                    a.type == Node.types.Output && b.type == Node.types.Hidden);

    let exists = false;

    for (const con of this.connections) {
      if (con.a == a.id &&
          con.b == b.id) {
        exists = true;
        // console.warn('Add Connection Mutation: The Connection Already Exists');
        return 0;
      } else if (con.a == b.id &&
                 con.b == a.id) {
         exists = true;
         // console.warn('Add Connection Mutation: The Connection Already Exists');
         return 0;
      }
    }
    this.connections.push(new Connection((reversed) ? b.id : a.id, (reversed) ? a.id : b.id, random(-1, 1), true, innovation.next(), (reversed) ? b : a));

    return 1;
  }

  addNode(innovation) {
    const con = random(this.connections);

    if (!con.expressed) {
      // console.warn("Add Node Mutation: The Connection is not Active, failed to make new Node");
      return 0;
    }

    const a = this.nodes[con.a];
    const b = this.nodes[con.b];

    con.disable();

    const newNode = new Node(Node.types.Hidden, this.nodes.length);

    const inToNew  = new Connection(a.id, newNode.id, con.weight, true, innovation.next(), newNode);
    const newToOut = new Connection(newNode.id, b.id, con.weight, true, innovation.next(), b      );

    this.nodes.push(newNode);

    this.connections.push(inToNew );
    this.connections.push(newToOut);

    return 1;
  }

  copy() {
    let clone = new Genome();

    for (let i = 0; i < this.nodes.length; i++){
      clone.nodes[i] = this.nodes[i].copy();
    }

    for (let i = 0; i < this.connections.length; i++){
      clone.connections[i] = this.connections[i].copy();
    }

    return clone();
  }
}
