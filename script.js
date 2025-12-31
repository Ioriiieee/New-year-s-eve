const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const overlay = document.getElementById("overlay");
const countdownEl = document.getElementById("countdown");
const celebrationEl = document.getElementById("celebration");
const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");
const countdownStartBtn = document.getElementById("countdownStartBtn");

const daysEl = document.getElementById("days");
const hoursEl = document.getElementById("hours");
const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");

canvas.width = innerWidth;
canvas.height = innerHeight;
window.addEventListener("resize", () => {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
});

/* ================= COUNTDOWN ================= */

/* ✅ FIXED UNLOCK DATE (PH TIME) */
const UNLOCK_DATE = new Date("2025-12-25T00:00:00+08:00");

let countdownDone = false;

function updateCountdown() {
  const now = new Date();
  const diff = UNLOCK_DATE - now;

  if (diff <= 0) {
    daysEl.textContent = 0;
    hoursEl.textContent = "00";
    minutesEl.textContent = "00";
    secondsEl.textContent = "00";

    countdownStartBtn.style.display = "inline-block";
    countdownDone = true;
    return;
  }

  const totalSeconds = Math.floor(diff / 1000);

  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  daysEl.textContent = days;
  hoursEl.textContent = String(hours).padStart(2, "0");
  minutesEl.textContent = String(minutes).padStart(2, "0");
  secondsEl.textContent = String(seconds).padStart(2, "0");
}

setInterval(updateCountdown, 1000);
updateCountdown();

/* ================= FIREWORKS ================= */

function random(min, max) {
  return Math.random() * (max - min) + min;
}

const particles = [];
const rockets = [];

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
    this.vy += 0.03;
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

class Rocket {
  constructor(x, y) {
    this.x = x;
    this.y = canvas.height;
    this.targetY = y;
    this.vy = -7;
    this.trail = [];
    this.done = false;
    this.color = `hsl(${Math.random() * 360},100%,60%)`;

    this.msgX = x;
    this.msgY = y;
  }

  update() {
    this.y += this.vy;
    this.trail.push({ x: this.x, y: this.y + 8, alpha: 1 });
    if (this.trail.length > 25) this.trail.shift();

    if (this.y <= this.targetY) {
      this.done = true;
      explode(this.x, this.y, this.msgX, this.msgY);
    }
  }

  draw() {
    this.trail.forEach(t => {
      ctx.globalAlpha = t.alpha;
      ctx.fillStyle = "#fff";
      ctx.fillRect(t.x, t.y, 2, 6);
      t.alpha -= 0.05;
    });
    ctx.globalAlpha = 1;
  }
}

function explode(x, y, msgX, msgY) {
  const color = `hsl(${Math.random() * 360},100%,60%)`;
  for (let i = 0; i < 80; i++) {
    particles.push(new Particle(x, y, color, 6));
  }
  spawnBubble(msgX, msgY);
}

/* ================= MESSAGES ================= */

const messages = [ /* SAME MESSAGE ARRAY — UNTOUCHED */ 
  "Wishing you warmth and light ✨",
  "New beginnings look good on you 🌱",
  "Gentle wins this year 💫",
  "CONGRATULATIONS!!!!.",
  "Cheers to growth 🎆",
  "I care about you, always. 💛",
  "May joy find you 🌙",
  "I saw how hard you worked.",
  "Graduating wasn’t small.",
  "Ikaw ay special, hindi lang sa akin. 🌸",
  "You finished something big.",
  "You kept showing up.",
  "CONGRATULATIONS!!!!.",
  "Pa hug",
  "hehe",
  "That counts.",
  "I noticed that.",
  "This year was heavy.",
  "I care about you, always. 💛",
  "You carried it quietly.",
  "You didn’t lose yourself.",
  "You didn’t lose your kindness.",
  "Ikaw yung comfort ko sa mundo. 🤍",
  "Your softness stayed.",
  "Your strength showed.",
  "Hug lang sana, kahit sa isip. 🫂",
  "CONGRATULATIONS!!!!.",
  "Nag  crave ako sa hug mo",
  "Pa hug",
  "hehe",
  "Boundaries didn’t harden you, they protected you",
   "You make my day better, sis. 🥰",
  "You studied even when tired.",
  "Ikaw ay special, hindi lang sa akin. 🌸",
  "I care about you, always. 💛",
  "You stayed even when it was heavy.",
  "Small effort still matters.",
  "Huwag mong kalimutan na mahalaga ka. 🌸",
   "Just a reminder: you’re loved, always. 💛",
  "Quiet effort still matters.",
  "Now you’re reviewing.",
  "No rush.",
  "No noise.",
  "One step at a time.",
  "I’m proud of you sis, always.",
  "I see your effort, even in silence.",
  "You don’t have to rush.",
  "You’re doing enough.",
  "You did well.",
  "You’re doing enough.",
  "Hug lang sana, kahit sa isip. 🫂",
   "Thinking of you, sis. Stay soft. 🌸",
   "Ikaw ay special, hindi lang sa akin. 🌸",
  "Rest when you need to.",
  "Breathe when it feels heavy.",
  "I believe in you — completely.",
  "I care about you, always. 💛",
  "RN is getting closer.",
  "i love you sis. 🥰",
  "RN soon.",
  "You’ve got this. 🤍",
  "CONGRATULATIONS!!!!.",
  "Just so you know — I’m proud.",
  "Congratulations — you earned every part of this year.",
  "Huwag mong kalimutan na mahalaga ka. 🌸",
  "This year you asked a lot from you. You still delivered.",
  "Everything you finished this year matters.",
  "You didn’t just pass time, you made progress.",
  "You showed up for your future.",
  "Ikaw ay special, hindi lang sa akin. 🌸",
  "You kept choosing what mattered.",
   "Thinking of you, sis. Stay soft. 🌸",
   "I care about you, always. 💛",
  "Not everyone sees it, but it’s worth celebrating.",
  "You turned effort into milestones.",
   "You make my day better, sis. 🥰",
   "Just a reminder: you’re loved, always. 💛",
  "CONGRATULATIONS!!!!.",
  "Nag  crave ako sa hug mo",
  "Ikaw yung comfort ko sa mundo. 🤍",
  "Pa hug",
  "hehe",
  "i love you sis. 🥰",
  "You handled more than you let on.",
  "I care about you, always. 💛",
  "This wasn’t easy, and that makes it impressive.",
  "You made it through a hard year.",
  "Hug lang sana, kahit sa isip. 🫂",
  "Ikaw ay special, hindi lang sa akin. 🌸",
  "That alone deserves congratulations.",
  "You kept going when stopping was easier.",
  "You earned every quiet win.",
  "This year counts because you did.",
  "Huwag mong kalimutan na mahalaga ka. 🌸",
  "CONGRATULATIONS!!!!.",
  "You deserve credit for all of this.",
  "Progress like this deserves recognition.",
  "You built something this year.",
  "I care about you, always. 💛",
  "Pa hug",
  "hehe",
  "You should be proud of how far you came.",
   "Just a reminder: you’re loved, always. 💛",
  "Congratulations — sincerely.",
  "Congrats sa lahat ng na achieve mo this year!.",
  "Congrats sa lahat ng na achieve mo this year!.",
  "CONGRATULATIONS!!!!.",
  "Congrats sa lahat ng na achieve mo this year!.",
  "Congrats sa lahat ng na achieve mo this year!.",
  "Thinking of you, sis. Stay soft. 🌸",
  "Congrats sa lahat ng na achieve mo this year!.",
  "Sending love across the distance. 💕",
  "Miss na miss na kita kung alam mo lang, kahit saglit lang",
  
  

  "Congrats sa lahat ng na achieve mo this year!.",
  "Congrats sa lahat ng na achieve mo this year!.",
  "CONGRATULATIONS!!!!.",
   "You make my day better, sis. 🥰",
  "Congrats sa lahat ng na achieve mo this year!.",
  "I care about you, always. 💛",
  "Ikaw yung comfort ko sa mundo. 🤍",
  "heartaches everytime pag namimiss kita (my new 10pm moments pero di siya bad thing)",
  "Congrats sa lahat ng na achieve mo this year!.",
  "Penge hug. 😄",
  "Sending love across the distance. 💕",
  "Hope your heart feels light tonight. 💛",
  "i love you sis. 🥰",

];

let msgIndex = 0;

function spawnBubble(x, y) {
  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.textContent = messages[msgIndex++ % messages.length];
  document.body.appendChild(bubble);

  const rect = bubble.getBoundingClientRect();
  let bx = x - rect.width / 2 + random(-30, 30);
  let by = y - 60 + random(-20, 20);

  bx = Math.max(10, Math.min(innerWidth - rect.width - 10, bx));
  by = Math.max(10, Math.min(innerHeight - rect.height - 10, by));

  bubble.style.left = bx + "px";
  bubble.style.top = by + "px";

  setTimeout(() => bubble.classList.add("fade-out"), 3000);
  setTimeout(() => bubble.remove(), 4600);
}

/* ================= CELEBRATION ================= */

let active = false;

resetBtn.onclick = () => location.reload();

countdownStartBtn.onclick = () => {
  countdownEl.style.display = "none";
  celebrationEl.style.display = "flex";
  overlay.style.opacity = "0";
  active = true;
};

window.addEventListener("click", e => {
  if (!active || e.target.tagName === "BUTTON") return;
  rockets.push(new Rocket(e.clientX, e.clientY));
});

/* ================= LOOP ================= */

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  rockets.forEach((r, i) => {
    r.update();
    r.draw();
    if (r.done) rockets.splice(i, 1);
  });

  particles.forEach((p, i) => {
    p.update();
    p.draw();
    if (p.alpha <= 0) particles.splice(i, 1);
  });

  requestAnimationFrame(animate);
}
animate();

/* ================= MUSIC ================= */

let playing = false;
let autoplayTriggered = false;

if (musicBtn) {
  musicBtn.setAttribute('aria-label', 'Toggle background music');
  musicBtn.setAttribute('aria-pressed', 'false');
  musicBtn.textContent = "🎵";
}

if (bgMusic) {
  bgMusic.pause();
  bgMusic.currentTime = 0;
}

document.addEventListener('click', () => {
  if (!autoplayTriggered && bgMusic && !playing) {
    autoplayTriggered = true;
    bgMusic.play().then(() => {
      musicBtn.textContent = "🔇";
      musicBtn.setAttribute('aria-pressed', 'true');
      playing = true;
    }).catch(() => {});
  }
});

musicBtn.addEventListener("click", () => {
  if (bgMusic.paused) {
    bgMusic.play();
    musicBtn.textContent = "🔇";
    playing = true;
  } else {
    bgMusic.pause();
    musicBtn.textContent = "🎵";
    playing = false;
  }
});

init();
