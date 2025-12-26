const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const overlay = document.getElementById("overlay");
const countdownEl = document.getElementById("countdown");
const celebrationEl = document.getElementById("celebration");
const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");

canvas.width = innerWidth;
canvas.height = innerHeight;
window.addEventListener("resize", () => {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
});

/* ================= FIREWORKS ================= */
const particles = [];
function random(min, max) { return Math.random() * (max - min) + min; }

class Particle {
  constructor(x, y, color, power) {
    this.x = x;
    this.y = y;
    this.vx = random(-power, power);
    this.vy = random(-power, power);
    this.alpha = 1;
    this.color = color;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.02;
    this.alpha -= 0.015;
  }
  draw() {
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

function explode(x, y, strong = false) {
  const count = strong ? 80 : 30;
  const power = strong ? 6 : 3;
  for (let i = 0; i < count; i++) {
    particles.push(new Particle(x, y, `hsl(${Math.random()*360},100%,60%)`, power));
  }
}

/* Background fireworks */
setInterval(() => {
  explode(random(100, canvas.width-100), random(100, canvas.height/2), false);
}, 1200);

/* Confetti Burst */
function confettiBurst() {
  for (let i=0; i<200; i++){
    particles.push(new Particle(random(0,canvas.width), random(0,canvas.height), `hsl(${Math.random()*360},100%,70%)`, 4));
  }
}

/* ================= MESSAGE BUBBLES ================= */
const messages = [
  "Wishing you a year full of warmth and light ✨",
  "May this year bring gentle joy and peace 🌙",
  "New beginnings look good on you 🌸",
  "Cheers to growth, healing, and quiet wins 💫",
  "May happiness find you in small moments 🎇"
];
let msgIndex = 0;
let bubbleTimeout = null;

function spawnBubble(x, y) {
  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.textContent = messages[msgIndex % messages.length];
  msgIndex++;
  document.body.appendChild(bubble);

  const rect = bubble.getBoundingClientRect();
  let bx = x - rect.width/2;
  let by = y - 50;
  bx = Math.max(10, Math.min(window.innerWidth - rect.width - 10, bx));
  by = Math.max(10, Math.min(window.innerHeight - rect.height - 10, by));

  bubble.style.left = bx + "px";
  bubble.style.top = by + "px";

  setTimeout(()=>bubble.remove(), 5000);
}

/* ================= CELEBRATION MODE ================= */
let celebrationActive = false;

startBtn.onclick = () => {
  celebrationActive = true;
  startBtn.disabled = true;
  startBtn.style.opacity = "0.6";
  overlay.style.opacity = "0";
  countdownEl.style.display = "none";
  celebrationEl.style.display = "flex";
  confettiBurst();
};

resetBtn.onclick = () => location.reload();

window.addEventListener("click", (e)=>{
  if(!celebrationActive) return;
  if(e.target.tagName==="BUTTON") return;

  const x = e.clientX;
  const y = e.clientY;

  explode(x, y, true);

  // FIX: cancel previous pending bubble
  if(bubbleTimeout) clearTimeout(bubbleTimeout);
  bubbleTimeout = setTimeout(()=>{
    spawnBubble(x, y);
    bubbleTimeout = null;
  }, 600);
});

window.addEventListener("touchstart", (e)=>{
  if(!celebrationActive) return;
  const touch = e.touches[0];
  explode(touch.clientX, touch.clientY, true);

  if(bubbleTimeout) clearTimeout(bubbleTimeout);
  bubbleTimeout = setTimeout(()=>{
    spawnBubble(touch.clientX, touch.clientY);
    bubbleTimeout = null;
  }, 600);
});

/* ================= ANIMATION LOOP ================= */
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach((p,i)=>{
    p.update();
    p.draw();
    if(p.alpha<=0) particles.splice(i,1);
  });
  requestAnimationFrame(animate);
}
animate();

/* ================= TEST MODE ================= */
// immediate celebration for testing
let countdownFinished = true;
if(countdownFinished){
  startBtn.click();
}