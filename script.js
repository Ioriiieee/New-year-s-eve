const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const overlay = document.getElementById("overlay");
const countdownEl = document.getElementById("countdown");
const celebrationEl = document.getElementById("celebration");
const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");

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

// TEST MODE
const TEST_MODE = true;

const now = new Date();
const target = TEST_MODE
  ? new Date(now.getTime())
  : new Date(now.getFullYear() + 1, 0, 1, 0, 0, 0);

let countdownDone = false;

function updateCountdown() {
  const diff = target - new Date();
  if (diff <= 0) {
    countdownDone = true;
    countdownEl.style.display = "none";
    celebrationEl.style.display = "flex";
    overlay.style.opacity = "0";
    return;
  }

  const s = Math.floor(diff / 1000);
  daysEl.textContent = Math.floor(s / 86400);
  hoursEl.textContent = String(Math.floor(s % 86400 / 3600)).padStart(2, "0");
  minutesEl.textContent = String(Math.floor(s % 3600 / 60)).padStart(2, "0");
  secondsEl.textContent = String(s % 60).padStart(2, "0");
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

    // ✅ STORE TARGET FOR MESSAGE
    this.msgX = x;
    this.msgY = y;
  }

  update() {
    this.y += this.vy;
    this.trail.push({ x: this.x, y: this.y + 8, alpha: 1 });
    if (this.trail.length > 25) this.trail.shift();

    if (this.y <= this.targetY) {
      this.done = true;
      explode(this.x, this.y, this.msgX, this.msgY); // ✅ PASS DATA
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

  // ✅ MESSAGE APPEARS ON POP
  spawnBubble(msgX, msgY);
}

/* ================= MESSAGES ================= */

const messages = [
  "Wishing you warmth and light ✨",
  "New beginnings look good on you 🌱",
  "Gentle wins this year 💫",
  "Cheers to growth 🎆",
  "May joy find you 🌙"
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

  setTimeout(() => bubble.classList.add("fade-out"), 5000);
  setTimeout(() => bubble.remove(), 5800);
}

/* ================= CELEBRATION ================= */

/* ================= CELEBRATION ================= */

let active = false;

startBtn.onclick = () => {
  active = true;
  startBtn.style.display = "none";
};

resetBtn.onclick = () => location.reload();

/* 🔥 STORE LAST CLICK POSITION */
let lastClick = { x: 0, y: 0 };

window.addEventListener("click", e => {
  if (!active || e.target.tagName === "BUTTON") return;

  lastClick.x = e.clientX;
  lastClick.y = e.clientY;

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
let playing = false;
let autoplayTriggered = false;

// Accessibility attributes
if (musicBtn) {
    musicBtn.setAttribute('aria-label', 'Toggle background music');
    musicBtn.setAttribute('aria-pressed', 'false');
    musicBtn.textContent = "🎵"; // Start with play icon
}

// Ensure audio is paused on page load
if (bgMusic) {
    bgMusic.pause();
    bgMusic.currentTime = 0;
    bgMusic.addEventListener('error', (e) => {
        console.warn('bgMusic failed to load:', e);
    });
}

// Autoplay music on first user interaction
document.addEventListener('click', () => {
    if (!autoplayTriggered && bgMusic && !playing) {
        autoplayTriggered = true;
        bgMusic.play()
            .then(() => {
                musicBtn.textContent = "🔇";
                musicBtn.setAttribute('aria-pressed', 'true');
                playing = true;
            })
            .catch((err) => {
                console.warn('Autoplay prevented:', err);
            });
    }
}, { once: false });

musicBtn.addEventListener("click", () => {
    if (!bgMusic) {
        console.warn('bgMusic element not found');
        return;
    }

    // Check actual playback state instead of our variable
    // (handles cases where user plays via browser controls)
    if (bgMusic.paused) {
        // Audio is paused, so play it
        const playPromise = bgMusic.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                musicBtn.textContent = "🔇";
                musicBtn.setAttribute('aria-pressed', 'true');
                playing = true;
            }).catch((err) => {
                console.warn('Audio play prevented:', err);
            });
        } else {
            // Older browsers may not return a promise
            musicBtn.textContent = "🔇";
            musicBtn.setAttribute('aria-pressed', 'true');
            playing = true;
        }
    } else {
        // Audio is playing, so pause it
        bgMusic.pause();
        musicBtn.textContent = "🎵";
        musicBtn.setAttribute('aria-pressed', 'false');
        playing = false;
    }
});


init();