/* ========== main.js ========== */

/* ---------- 1. Teks ucapan dengan efek ketik ---------- */
const pesan =
  "Hai... aku mau ngomong sesuatu 🥺\n\n" +
  "Aku tau aku salah. Aku yang bikin dede kecewa, " +
  "aku dingin kayak kulkas 2 pintu, dan aku mau minta bicara sebentar buat kamu 😔\n\n" +
  "Padahal kamu udah sabar banget sama aku yang kadang nyebelin ini.\n\n" +
  "Aku cuma pengen kita balikan... biar aku bisa perbaiki semuanya " +
  "dan jadi versi aku yang lebih baik buat kamu, bucket naaa dijalan yaa 💖";

const elMessage = document.getElementById("message");
let index = 0;

function typeWriter() {
  if (index < pesan.length) {
    elMessage.innerHTML =
      pesan.slice(0, index + 1).replace(/\n/g, "<br>") +
      '<span class="cursor">&nbsp;</span>';
    index++;
    const char = pesan[index - 1];
    const delay = char === "\n" ? 220 : 32;
    setTimeout(typeWriter, delay);
  } else {
    elMessage.innerHTML = pesan.replace(/\n/g, "<br>");
    document.getElementById("buttons").style.opacity = "1";
  }
}

/* Sembunyikan tombol dulu */
document.getElementById("buttons").style.opacity = "0";
setTimeout(typeWriter, 600);

/* ---------- 2. Tombol "Enggak" yang tukar posisi + kabur ---------- */
const btnNo = document.getElementById("btnNo");
const btnYes = document.getElementById("btnYes");
const buttonsWrap = document.getElementById("buttons");
const hint = document.getElementById("hint");

const kalimatHint = [
  "eh kok dihindarin? 🥺",
  "yakin nih? aku sedih loh...",
  "tombolnya pindah, tandanya kamu klik yang pink 😌",
  "udah, nyerah aja deh 😆",
  "aku bakal nungguin kamu terus 💗",
];

let hintIndex = 0;
let noCount = 0;
let swapped = false;

/* Tukar posisi tombol "Iya" dan "Enggak" pakai flex order */
function swapButtons() {
  swapped = !swapped;
  if (swapped) {
    btnYes.style.order = "2";
    btnNo.style.order = "1";
  } else {
    btnYes.style.order = "1";
    btnNo.style.order = "2";
  }
  // animasi pop kecil saat tukar posisi
  btnYes.animate(
    [
      { transform: "scale(1)" },
      { transform: "scale(1.15)" },
      { transform: "scale(1)" },
    ],
    { duration: 300, easing: "ease-out" }
  );
}

function dodgeNoButton() {
  noCount++;

  // 1) Tukar posisi tombol
  swapButtons();

  // 2) Geser posisi "No" secara acak biar makin susah dipencet
  const x = (Math.random() - 0.5) * 220;
  const y = (Math.random() - 0.5) * 120;
  btnNo.style.transform = `translate(${x}px, ${y}px) scale(${Math.max(
    0.5,
    1 - noCount * 0.12
  )})`;

  // 3) Tampilkan hint lucu
  hint.textContent = kalimatHint[hintIndex % kalimatHint.length];
  hintIndex++;

  // 4) Setelah 6 kali nyoba, tombol "Enggak" hilang sendiri
  if (noCount >= 6) {
    btnNo.style.opacity = "0";
    btnNo.style.pointerEvents = "none";
    hint.textContent = "ya udah, tombolnya kabur 😂 tinggal satu pilihan deh~";
  }
}

/* Desktop: kabur saat kursor mendekat */
btnNo.addEventListener("mouseenter", dodgeNoButton);

/* Mobile & desktop: cegah klik, kabur saat disentuh */
btnNo.addEventListener("click", (e) => {
  e.preventDefault();
  dodgeNoButton();
});

/* Sentuh di HP */
btnNo.addEventListener("touchstart", (e) => {
  e.preventDefault();
  dodgeNoButton();
}, { passive: false });

/* ---------- 3. Tombol "Iya" ---------- */
btnYes.addEventListener("click", () => {
  document.getElementById("overlay").classList.add("show");
  createConfetti(80);
  burstHearts(20);
});

/* ---------- 4. Tombol ulangi ---------- */
document.getElementById("btnAgain").addEventListener("click", () => {
  document.getElementById("overlay").classList.remove("show");

  // Reset tombol "Enggak"
  btnNo.style.opacity = "1";
  btnNo.style.pointerEvents = "auto";
  btnNo.style.transform = "translate(0, 0) scale(1)";
  btnNo.style.order = "2";
  btnYes.style.order = "1";
  swapped = false;
  noCount = 0;
  hintIndex = 0;
  hint.textContent = "";

  // Reset teks
  index = 0;
  elMessage.innerHTML = "";
  document.getElementById("buttons").style.opacity = "0";
  setTimeout(typeWriter, 300);
});

/* ---------- 5. Hati melayang di background ---------- */
const heartEmojis = ["💖", "💗", "💕", "🩷", "💞", "❤️", "🌸"];
const heartsBg = document.getElementById("heartsBg");

function spawnHeart() {
  const heart = document.createElement("div");
  heart.className = "heart-float";
  heart.textContent =
    heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
  heart.style.left = Math.random() * 100 + "vw";
  heart.style.fontSize = 16 + Math.random() * 22 + "px";
  heart.style.animationDuration = 6 + Math.random() * 6 + "s";

  heartsBg.appendChild(heart);
  setTimeout(() => heart.remove(), 12000);
}

setInterval(spawnHeart, 500);

/* ---------- 6. Konfeti ---------- */
const confettiColors = [
  "#ff8fb8",
  "#ffd166",
  "#7cc2ff",
  "#a6f0c6",
  "#c9a7ff",
  "#ff9ec2",
];

function createConfetti(amount) {
  for (let i = 0; i < amount; i++) {
    const conf = document.createElement("div");
    conf.className = "confetti";
    conf.style.left = Math.random() * 100 + "vw";
    conf.style.background =
      confettiColors[Math.floor(Math.random() * confettiColors.length)];
    conf.style.animationDuration = 2 + Math.random() * 2 + "s";
    conf.style.animationDelay = Math.random() * 0.6 + "s";
    conf.style.borderRadius = Math.random() > 0.5 ? "50%" : "2px";

    document.body.appendChild(conf);
    setTimeout(() => conf.remove(), 5000);
  }
}

/* ---------- 7. Ledakan hati dari tengah ---------- */
function burstHearts(amount) {
  for (let i = 0; i < amount; i++) {
    const h = document.createElement("div");
    h.textContent = "💖";
    h.style.position = "fixed";
    h.style.left = "50%";
    h.style.top = "50%";
    h.style.fontSize = "24px";
    h.style.zIndex = "30";
    h.style.pointerEvents = "none";
    h.style.transition = "transform 1.2s ease-out, opacity 1.2s ease-out";

    document.body.appendChild(h);

    requestAnimationFrame(() => {
      const angle = Math.random() * Math.PI * 2;
      const dist = 120 + Math.random() * 220;
      h.style.transform = `translate(${Math.cos(angle) * dist}px, ${
        Math.sin(angle) * dist
      }px) scale(${0.6 + Math.random()})`;
      h.style.opacity = "0";
    });

    setTimeout(() => h.remove(), 1400);
  }
      }
