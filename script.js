// Product data - easily add more items here
const products = [
  {
    id: "p1",
    title: "Nebula NFT Art",
    price: "0.05 ETH",
    image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=600&q=80",
    wallets: {
      ETH: "0x1234...abcd",
      BTC: "1A1zP1...xyz",
      USDT: "TXYZ...789"
    }
  },
  {
    id: "p2",
    title: "Galactic Theme Skin",
    price: "0.02 ETH",
    image: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=600&q=80",
    wallets: {
      ETH: "0xabcd...5678",
      BTC: "3J98t1...abc",
      USDT: "TYZX...123"
    }
  },
  {
    id: "p3",
    title: "Starship Blueprint",
    price: "0.10 ETH",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
    wallets: {
      ETH: "0xdead...beef",
      BTC: "1BoatSLRH...def",
      USDT: "TABC...456"
    }
  }
];

// DOM Elements
const productsContainer = document.getElementById("products");
const modal = document.getElementById("paymentModal");
const modalTitle = document.getElementById("modalTitle");
const walletsDiv = document.getElementById("wallets");
const modalCloseBtn = document.getElementById("modalClose");
const confirmPaymentBtn = document.getElementById("confirmPaymentBtn");
const discordInfo = document.getElementById("discordInfo");

let currentProduct = null;

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

  for (const [crypto, address] of Object.entries(currentProduct.wallets)) {
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

// Initialize
renderProducts();

// Starry background animation
const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d");
let width, height;
let stars = [];

function initCanvas() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
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
}

function drawStars() {
  ctx.clearRect(0, 0, width, height);
  stars.forEach(star => {
    ctx.beginPath();
    ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
    ctx.shadowColor = 'white';
    ctx.shadowBlur = 4;
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    ctx.fill();

    star.x += star.speed * star.direction;
    if (star.x > width) star.x = 0;
    else if (star.x < 0) star.x = width;
  });
  requestAnimationFrame(drawStars);
}

window.addEventListener("resize", initCanvas);

initCanvas();
drawStars();
