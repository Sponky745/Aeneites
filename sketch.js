const size = 10;
const NUM_FOOD = 100;

let innov;
let specieses = [];
let food = [];
let selected = null;

function setup() {
  createCanvas(windowWidth, windowHeight);
  innov = new InnovationGenerator();
  for (let i = 0; i < size; i++) {
    specieses.push(new Aeneite());
    do {} while (specieses[i].brain.mutate(innov) == 0);
    // do {} while (specieses[i].brain.mutate(innov) == 0);
  }
}

function draw() {
  background(51);
  for (let i = specieses.length - 1; i >= 0; i--) {
    let a = specieses[i];

    a.think();
    a.update();
    a.edges();
    a.show(a === selected);

    if (a.dead()) {
      specieses.splice(i, 1);
    }
  }
}

function mousePressed() {
  for (let a of specieses) {
    if (dist(a.pos.x, a.pos.y, mouseX, mouseY) < a.r) {
      selected = a;
      break;
    }
  }
}

function mouseReleased() {
  if (selected !== null) {
    console.log(selected.brain);
    selected = null;
  }
}

// function keyPressed() {
//   switch (key) {
//     case 'N':
//     case 'n':
//       do {} while (g.addNode(i) == 0);
//       logGenome();
//       break;
//     case 'C':
//     case 'c':
//       do {} while (g.addConnection(i) == 0);
//       logGenome();
//       break;
//     default:
//       console.log('CONTROLS: Type "N" to create a new Node, or "C" to create a new Connection');
//   }
// }
//
// function logGenome(g) {
//   console.log(g);
//   console.log(`GEN: ${gen++}`);
// }
