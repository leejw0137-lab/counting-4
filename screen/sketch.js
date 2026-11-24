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

let step = 1;        // 현재 숫자 (1 -> 2 -> 3 -> 4 -> 1)
let scaleAnim = 1.0; // 클릭 시 커졌다 돌아오는 애니메이션 배율

function setup() {
  createCanvas(400, 400);
  textAlign(CENTER, CENTER);
}

function draw() {
  // 단계별 배경색 (1~4)
  let bgColors = [
    color(255, 107, 107), // 1: 코랄 레드
    color(78, 205, 196),  // 2: 민트
    color(69, 183, 209),  // 3: 스카이 블루
    color(255, 190, 11)   // 4: 옐로우
  ];
  background(bgColors[step - 1]);

  // 클릭 후 원래 크기(1.0)로 부드럽게 복귀
  scaleAnim = lerp(scaleAnim, 1.0, 0.12);

  push();
  translate(width / 2, height / 2);
  scale(scaleAnim);

  // 숨 쉬듯 움직이는 바깥쪽 링
  noFill();
  stroke(255, 180);
  strokeWeight(4);
  let pulse = sin(frameCount * 0.08) * 10;
  circle(0, 0, 180 + pulse);

  // 가운데 흰색 원
  noStroke();
  fill(255);
  circle(0, 0, 150);

  // 현재 숫자 표시
  fill(bgColors[step - 1]);
  textSize(72);
  textStyle(BOLD);
  text(step, 0, 4);
  pop();

  // 하단 안내 문구
  fill(255);
  textSize(14);
  textStyle(NORMAL);
  text("화면을 클릭하거나 컨트롤러를 조작하세요", width / 2, height - 30);
}

// 숫자를 다음 단계(1~4)로 올리고 애니메이션 실행
function nextStep() {
  step = (step % 4) + 1;
  scaleAnim = 1.35;
}

function mousePressed() {
  nextStep(); // 마우스 테스트용
}

// 1. 버튼 신호 받기
let lastClicks = null;

db.ref("flower/clicks").on("value", (snap) => {
  const clicks = snap.val() || 0;
  if (lastClicks !== null && clicks > lastClicks) {
    nextStep();
  }
  lastClicks = clicks;
});

// 2. 슬라이더 신호 받기 (0~100 값을 1~4 단계로 변환)
let sliderValue = 0;
let sliderReady = false;

db.ref("flower/slider").on("value", (snap) => {
  if (sliderReady && snap.val() !== null) {
    sliderValue = snap.val();
    let newStep = constrain(floor(sliderValue / 25) + 1, 1, 4);
    if (newStep !== step) {
      step = newStep;
      scaleAnim = 1.35; // 단계가 바뀔 때 통통 튀는 효과
    }
  }
  sliderReady = true;
});
