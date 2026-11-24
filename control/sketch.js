const firebaseConfig = {
  apiKey: "AIzaSyAkw28N-SJM0UvtpMuoXVwVgjyv17Z4KSs",
  authDomain: "counting-4.firebaseapp.com",
  databaseURL: "https://counting-4-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "counting-4",
  storageBucket: "counting-4.firebasestorage.app",
  messagingSenderId: "407806592091",
  appId: "1:407806592091:web:554df6c9fcfd8a30f16b7e",
  measurementId: "G-KC9MW369CJ"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

let buttonX;
let buttonY;
let buttonRadius;
let buttonH;

let sliderStartX;
let sliderEndX;
let sliderY;
let handleX;
let handleRadius;

function setup() {
  createCanvas(windowWidth, windowHeight);
  init();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  init();
}

function init() {
  buttonX = width * 0.5;
  buttonY = height * 0.5 - 100;
  buttonRadius = 50;
  buttonH = 10;

  sliderStartX = width * 0.5 - 150;
  sliderEndX = width * 0.5 + 150;
  sliderY = height * 0.5 + 100;
  handleX = sliderStartX;
  handleRadius = 20;
}

function draw() {
  background(242, 139, 5);

  button();
  slider();
}

function mousePressed() {
  if (dist(mouseX, mouseY, buttonX, buttonY - buttonH) < buttonRadius) {
    sendGrow();
  }

  if (
    mouseX > sliderStartX &&
    mouseX < sliderEndX &&
    mouseY > sliderY - handleRadius &&
    mouseY < sliderY + handleRadius
  ) {
    handleX = mouseX;
    sendSlider();
  }
}

function mouseDragged() {
  if (
    mouseX > sliderStartX &&
    mouseX < sliderEndX &&
    mouseY > sliderY - handleRadius &&
    mouseY < sliderY + handleRadius
  ) {
    handleX = mouseX;
    sendSlider();
  }
}

function button() {
  let up = 10;
  if (dist(mouseX, mouseY, buttonX, buttonY - buttonH) < buttonRadius) {
    up = 7;
    if (mouseIsPressed) {
      up = 2;
    }
  }

  buttonH = lerp(buttonH, up, 0.5);

  noStroke();
  fill(140);
  ellipse(buttonX, buttonY, buttonRadius * 2, buttonRadius * 2);
  fill(217);
  ellipse(buttonX, buttonY - buttonH, buttonRadius * 2, buttonRadius * 2);
  fill(255);
  ellipse(
    buttonX,
    buttonY - buttonH,
    buttonRadius * 2 - 15,
    buttonRadius * 2 - 15
  );
}

function slider() {
  let radius = 20;
  if (dist(mouseX, mouseY, handleX, sliderY) < handleRadius) {
    radius = 22;
    if (mouseIsPressed) {
      radius = 25;
    }
  }

  handleRadius = lerp(handleRadius, radius, 0.5);

  stroke(255);
  strokeWeight(10);
  line(sliderStartX, sliderY, sliderEndX, sliderY);
  fill(242, 139, 5);
  ellipse(handleX, sliderY, handleRadius * 2, handleRadius * 2);
}

function sendGrow() {
  db.ref("flower/clicks").set(firebase.database.ServerValue.increment(1));
}

function sendSlider() {
  let value = round(map(handleX, sliderStartX, sliderEndX, 0, 100));
  db.ref("flower/slider").set(value);
}