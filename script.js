let products = [];
let wallets = {};

// DOM Elements
const productsContainer = document.getElementById("products");
const modal = document.getElementById("paymentModal");
const modalTitle = document.getElementById("modalTitle");
const walletsDiv = document.getElementById("wallets");
const modalCloseBtn = document.getElementById("modalClose");
const confirmPaymentBtn = document.getElementById("confirmPaymentBtn");
const discordInfo = document.getElementById("discordInfo");

let currentProduct = null;

// Fetch JSON files and initialize
async function fetchData() {
  try {
    const [productsRes, walletsRes] = await Promise.all([
      fetch('products.json'),
      fetch('wallets.json')
    ]);
    products = await productsRes.json();
    wallets = await walletsRes.json();
    renderProducts();
  } catch (err) {
    console.error("Failed to load product or wallet data:", err);
  }
}

// Render products
function renderProducts() {
  productsContainer.innerHTML = "";
  products.forEach(product => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${product.image}" alt="${product.title}" />
      <h3>${product.title}</h3>
      <p class="price">${product.price}</p>
      <button class="btn-buy" data-id="${product.id}">Buy</button>
    `;
    productsContainer.appendChild(card);
  });
}

// Open modal and show wallets
function openModal(productId) {
  currentProduct = products.find(p => p.id === productId);
  if (!currentProduct) return;
  
  modalTitle.textContent = `Buy "${currentProduct.title}"`;
  walletsDiv.innerHTML = "";

  for (const [crypto, address] of Object.entries(wallets)) {
    const walletDiv = document.createElement("div");
    walletDiv.className = "wallet";
    walletDiv.textContent = `${crypto}: ${address}`;
    walletDiv.title = "Click to copy";
    walletDiv.onclick = () => {
      navigator.clipboard.writeText(address);
      walletDiv.textContent = `${crypto}: ${address} ✅ Copied!`;
      setTimeout(() => {
        walletDiv.textContent = `${crypto}: ${address}`;
      }, 1500);
    };
    walletsDiv.appendChild(walletDiv);
  }

  discordInfo.classList.add("hidden");
  confirmPaymentBtn.style.display = "inline-block";
  modal.classList.remove("hidden");
}

// Close modal
modalCloseBtn.onclick = () => {
  modal.classList.add("hidden");
};

// Confirm payment button click
confirmPaymentBtn.onclick = () => {
  confirmPaymentBtn.style.display = "none";
  discordInfo.classList.remove("hidden");
};

// Close modal on clicking outside content
window.onclick = function(event) {
  if (event.target === modal) {
    modal.classList.add("hidden");
  }
};

// Event delegation for buy buttons
productsContainer.onclick = function(e) {
  if (e.target.classList.contains("btn-buy")) {
    const id = e.target.getAttribute("data-id");
    openModal(id);
  }
};

// Starry background animation
const starsCanvas = document.getElementById("stars");
const shootingCanvas = document.getElementById("shootingStars");
const starsCtx = starsCanvas.getContext("2d");
const shootingCtx = shootingCanvas.getContext("2d");

let width, height;
let stars = [];
let shootingStars = [];

function initCanvas() {
  width = starsCanvas.width = shootingCanvas.width = window.innerWidth;
  height = starsCanvas.height = shootingCanvas.height = window.innerHeight;

  stars = [];
  for (let i = 0; i < 200; i++) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.2 + 0.3,
      speed: (Math.random() * 0.5) + 0.1,
      alpha: Math.random() * 0.8 + 0.2,
      direction: Math.random() < 0.5 ? -1 : 1
    });
  }

  shootingStars = [];
  for (let i = 0; i < 5; i++) {
    shootingStars.push(createShootingStar());
  }
}

function createShootingStar() {
  return {
    x: Math.random() * width,
    y: Math.random() * height / 2,
    length: Math.random() * 300 + 100,
    speed: Math.random() * 10 + 6,
    size: Math.random() * 1.2 + 0.5,
    waitTime: Date.now() + Math.random() * 5000,
    active: false
  };
}

function drawStars() {
  starsCtx.clearRect(0, 0, width, height);
  stars.forEach(star => {
    starsCtx.beginPath();
    starsCtx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
    starsCtx.shadowColor = 'white';
    starsCtx.shadowBlur = 4;
    starsCtx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    starsCtx.fill();

    star.x += star.speed * star.direction;
    if (star.x > width) star.x = 0;
    else if (star.x < 0) star.x = width;
  });
  requestAnimationFrame(drawStars);
}

function drawShootingStars() {
  shootingCtx.clearRect(0, 0, width, height);
  let now = Date.now();

  shootingStars.forEach(star => {
    if (!star.active && now > star.waitTime) {
      star.active = true;
      star.x = Math.random() * width;
      star.y = Math.random() * height / 2;
      star.length = Math.random() * 300 + 100;
      star.speed = Math.random() * 10 + 6;
      star.size = Math.random() * 1.2 + 0.5;
    }

    if (star.active) {
      shootingCtx.beginPath();
      shootingCtx.strokeStyle = 'rgba(255,255,255,0.8)';
      shootingCtx.lineWidth = star.size;
      shootingCtx.shadowColor = 'white';
      shootingCtx.shadowBlur = 8;
      shootingCtx.moveTo(star.x, star.y);
      shootingCtx.lineTo(star.x - star.length, star.y + star.length * 0.3);
      shootingCtx.stroke();

      star.x += star.speed;
      star.y += star.speed * 0.3;

      if (star.x > width + star.length || star.y > height) {
        star.active = false;
        star.waitTime = now + Math.random() * 8000 + 2000;
      }
    }
  });

  requestAnimationFrame(drawShootingStars);
}

window.addEventListener("resize", initCanvas);

// Initialize everything
fetchData();
initCanvas();
drawStars();
drawShootingStars();
