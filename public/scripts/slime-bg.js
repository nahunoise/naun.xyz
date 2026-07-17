/*
----- Slime Molds (Physarum) background -----
Adaptado del tutorial de Patt Vira: https://youtu.be/VyXxSNcgDtg
*/

let molds = [];
let num = 2500; // bajado de 4000 para mejor rendimiento en web
let d;

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('bg-canvas-holder');
  angleMode(DEGREES);
  pixelDensity(1); // clave para rendimiento, si no el índice de pixels se dispara
  d = pixelDensity();
  background(0);

  for (let i = 0; i < num; i++) {
    molds[i] = new Mold();
  }
}

function draw() {
  background(0, 5); // el alpha bajo crea el rastro que se desvanece
  loadPixels();

  for (let i = 0; i < num; i++) {
    molds[i].update();
    molds[i].display();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

class Mold {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.heading = random(360);

    this.sensorAngle = 45;      // grados de apertura de los sensores L/R
    this.sensorDistance = 20;   // distancia del sensor al cuerpo
    this.rotationAngle = 30;    // grados que gira por paso
    this.stepSize = 1.2;        // velocidad de avance
  }

  sense(angleOffset) {
    let angle = this.heading + angleOffset;
    let sx = constrain(this.x + cos(angle) * this.sensorDistance, 0, width - 1);
    let sy = constrain(this.y + sin(angle) * this.sensorDistance, 0, height - 1);
    let index = (floor(sx) + floor(sy) * width) * 4 * d;
    return pixels[index]; // usa el canal rojo como intensidad del rastro
  }

  update() {
    let F  = this.sense(0);
    let FL = this.sense(this.sensorAngle);
    let FR = this.sense(-this.sensorAngle);

    if (F > FL && F > FR) {
      // sigue recto
    } else if (F < FL && F < FR) {
      this.heading += random([-1, 1]) * this.rotationAngle;
    } else if (FL > FR) {
      this.heading += this.rotationAngle;
    } else if (FR > FL) {
      this.heading -= this.rotationAngle;
    }

    this.x += cos(this.heading) * this.stepSize;
    this.y += sin(this.heading) * this.stepSize;

    // envolver en los bordes
    if (this.x < 0) this.x = width;
    if (this.x > width) this.x = 0;
    if (this.y < 0) this.y = height;
    if (this.y > height) this.y = 0;
  }

  display() {
    stroke(160, 255, 0, 90); // verde lima, coherente con tu paleta (#a0ff00)
    point(this.x, this.y);
  }
}