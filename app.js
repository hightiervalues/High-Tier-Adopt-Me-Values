// High-tier pets data is now directly in JS so it works without loading pets.json
const pets = [
  { id: "shadow_dragon", name: "Shadow Dragon", tier: "God Tier", rarity: "Legendary", baseValue: 321, demand: 10, icon: "shadow_dragon.png" },
  { id: "bat_dragon", name: "Bat Dragon", tier: "God Tier", rarity: "Legendary", baseValue: 427, demand: 10, icon: "bat_dragon.png" },
  { id: "frost_dragon", name: "Frost Dragon", tier: "God Tier", rarity: "Legendary", baseValue: 164, demand: 9, icon: "frost_dragon.png" },
  { id: "giraffe", name: "Giraffe", tier: "God Tier", rarity: "Legendary", baseValue: 211, demand: 9, icon: "giraffe.png" },
  { id: "crow", name: "Crow", tier: "Very High", rarity: "Legendary", baseValue: 88.5, demand: 9, icon: "crow.png" },
  { id: "owl", name: "Owl", tier: "Very High", rarity: "Legendary", baseValue: 136.5, demand: 9, icon: "owl.png" },
  { id: "parrot", name: "Parrot", tier: "Very High", rarity: "Legendary", baseValue: 107, demand: 9, icon: "parrot.png" },
  { id: "arctic_reindeer", name: "Arctic Reindeer", tier: "Very High", rarity: "Legendary", baseValue: 38, demand: 8, icon: "arctic_reindeer.png" },
  { id: "evil_unicorn", name: "Evil Unicorn", tier: "Very High", rarity: "Legendary", baseValue: 77, demand: 8, icon: "evil_unicorn.png" },
  { id: "frost_fury", name: "Frost Fury", tier: "Very High", rarity: "Legendary", baseValue: 380, demand: 8, icon: "frost_fury.png" },
  { id: "hedgehog", name: "Hedgehog", tier: "Very High", rarity: "Ultra-Rare", baseValue: 5.75, demand: 8, icon: "hedgehog.png" },
  { id: "dalmatian", name: "Dalmatian", tier: "High", rarity: "Ultra-Rare", baseValue: 44.5, demand: 7, icon: "dalmatian.png" },
  { id: "turtle", name: "Turtle", tier: "High", rarity: "Legendary", baseValue: 22.5, demand: 7, icon: "turtle.png" },
  { id: "kangaroo", name: "Kangaroo", tier: "High", rarity: "Legendary", baseValue: 16.5, demand: 7, icon: "kangaroo.png" },
  { id: "blue_dog", name: "Blue Dog", tier: "High", rarity: "Uncommon", baseValue: 12, demand: 7, icon: "blue_dog.png" },
  { id: "pink_cat", name: "Pink Cat", tier: "High", rarity: "Uncommon", baseValue: 5, demand: 7, icon: "pink_cat.png" },
  { id: "albino_monkey", name: "Albino Monkey", tier: "High", rarity: "Legendary", baseValue: 15.5, demand: 7, icon: "albino_monkey.png" }
];

let filteredPets = [];
let tiers = new Set();
let rarities = new Set();

const searchInput = document.getElementById("searchInput");
const tierFilter = document.getElementById("tierFilter");
const rarityFilter = document.getElementById("rarityFilter");
const petGrid = document.getElementById("petGrid");
const tierTabs = document.getElementById("tierTabs");

const giveListEl = document.getElementById("giveList");
const getListEl = document.getElementById("getList");
const clearGiveBtn = document.getElementById("clearGive");
const clearGetBtn = document.getElementById("clearGet");
const evalBtn = document.getElementById("evaluateBtn");
const tradeResult = document.getElementById("tradeResult");

const modal = document.getElementById("petModal");
const modalContent = document.getElementById("modalContent");
const closeModalBtn = document.getElementById("closeModal");

let giveSide = [];
let getSide = [];
let currentTierTab = "All";

window.addEventListener("DOMContentLoaded", () => {
  pets.forEach(p => {
    tiers.add(p.tier);
    rarities.add(p.rarity);
  });

  setupFilters();
  renderTierTabs();
  applyFilters();
  setupEvents();
});

/* Filters, search, tier tabs */

function setupFilters() {
  Array.from(tiers).sort().forEach(t => {
    const opt = document.createElement("option");
    opt.value = t;
    opt.textContent = t;
    tierFilter.appendChild(opt);
  });

  Array.from(rarities).sort().forEach(r => {
    const opt = document.createElement("option");
    opt.value = r;
    opt.textContent = r;
    rarityFilter.appendChild(opt);
  });

  searchInput.addEventListener("input", applyFilters);
  tierFilter.addEventListener("change", applyFilters);
  rarityFilter.addEventListener("change", applyFilters);
}

function renderTierTabs() {
  const allBtn = document.createElement("button");
  allBtn.textContent = "All";
  allBtn.className = "tier-btn active";
  allBtn.onclick = () => setTierTab("All");
  tierTabs.appendChild(allBtn);

  Array.from(tiers).sort().forEach(t => {
    const btn = document.createElement("button");
    btn.textContent = t;
    btn.className = "tier-btn";
    btn.onclick = () => setTierTab(t);
    tierTabs.appendChild(btn);
  });
}

function setTierTab(t) {
  currentTierTab = t;
  document.querySelectorAll(".tier-btn").forEach(btn => btn.classList.remove("active"));
  Array.from(tierTabs.children).forEach(btn => {
    if (btn.textContent === t) btn.classList.add("active");
    if (t === "All" && btn.textContent === "All") btn.classList.add("active");
  });
  applyFilters();
}

function applyFilters() {
  const search = searchInput.value.trim().toLowerCase();
  const tierSelect = tierFilter.value;
  const raritySelect = rarityFilter.value;

  filteredPets = pets.filter(p => {
    if (search && !p.name.toLowerCase().includes(search)) return false;
    if (tierSelect && p.tier !== tierSelect) return false;
    if (raritySelect && p.rarity !== raritySelect) return false;
    if (currentTierTab !== "All" && p.tier !== currentTierTab) return false;
    return true;
  });

  renderPetGrid();
}

/* Pet cards */

function renderPetGrid() {
  petGrid.innerHTML = "";

  filteredPets.forEach(p => {
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <div class="card-tier-chip">${p.tier}</div>
      <div class="card-rarity-chip">${p.rarity}</div>
      <img src="assets/icons/${p.icon}" alt="${p.name}" />
      <div class="card-name">${p.name}</div>
      <div class="card-meta">
        <span>Base: ${p.baseValue}</span>
        <span>Demand: ${p.demand}/10</span>
      </div>
      <div class="value-pill">NP · R · FR · N · M values inside</div>
      <div class="demand-bar">
        <div class="demand-fill" style="width:${p.demand * 10}%"></div>
      </div>
    `;
    card.addEventListener("click", () => openPetModal(p));
    petGrid.appendChild(card);
  });
}

/* Pet modal */

function openPetModal(pet) {
  const np = pet.baseValue;
  const r = Math.round(np * 1.08);
  const fr = Math.round(np * 1.15);
  const neon = Math.round(np * 1.6);
  const mega = Math.round(np * 3.2);

  modalContent.innerHTML = `
    <div style="text-align:center;">
      <img src="assets/icons/${pet.icon}" alt="${pet.name}"
           style="width:110px;height:110px;object-fit:contain;margin-bottom:6px;" />
      <h3>${pet.name}</h3>
      <p style="margin:0;color:#9ca3af;font-size:0.85rem;">
        ${pet.tier} • ${pet.rarity}
      </p>
      <p style="margin-top:6px;font-size:0.85rem;">
        Demand: ${pet.demand}/10
      </p>
    </div>
    <div style="margin-top:12px;font-size:0.9rem;">
      <strong>Values:</strong>
      <ul style="list-style:none;padding:0;margin-top:6px;">
        <li>No Potion: ${np}</li>
        <li>Ride: ${r}</li>
        <li>Fly Ride: ${fr}</li>
        <li>Neon: ${neon}</li>
        <li>Mega: ${mega}</li>
      </ul>
    </div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:14px;">
      <button class="btn-primary" data-side="give">Add to your offer</button>
      <button class="btn-secondary" data-side="get">Add to their offer</button>
    </div>
  `;

  modalContent.querySelectorAll("button[data-side]").forEach(btn => {
    btn.addEventListener("click", () => {
      const side = btn.dataset.side;
      addToTrade(side, pet, np);
      closeModal();
    });
  });

  modal.classList.remove("hidden");
}

function closeModal() {
  modal.classList.add("hidden");
}

/* Trade calculator */

function setupEvents() {
  closeModalBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", e => {
    if (e.target === modal) closeModal();
  });

  clearGiveBtn.addEventListener("click", () => {
    giveSide = [];
    renderTradeLists();
  });

  clearGetBtn.addEventListener("click", () => {
    getSide = [];
    renderTradeLists();
  });

  evalBtn.addEventListener("click", evaluateTrade);
}

function addToTrade(side, pet, value) {
  const item = { name: pet.name, value };
  if (side === "give") giveSide.push(item);
  else getSide.push(item);
  renderTradeLists();
}

function renderTradeLists() {
  giveListEl.innerHTML = "";
  getListEl.innerHTML = "";

  giveSide.forEach(i => {
    const el = document.createElement("div");
    el.className = "trade-item";
    el.innerHTML = `<span>${i.name}</span><span>(${i.value})</span>`;
    giveListEl.appendChild(el);
  });

  getSide.forEach(i => {
    const el = document.createElement("div");
    el.className = "trade-item";
    el.innerHTML = `<span>${i.name}</span><span>(${i.value})</span>`;
    getListEl.appendChild(el);
  });

  tradeResult.textContent = "";
}

function evaluateTrade() {
  const giveTotal = giveSide.reduce((sum, i) => sum + i.value, 0);
  const getTotal = getSide.reduce((sum, i) => sum + i.value, 0);

  if (!giveSide.length && !getSide.length) {
    tradeResult.textContent = "Add pets to compare a trade.";
    return;
  }

  let verdict = "Fair trade.";
  const diff = giveTotal - getTotal;

  if (diff > 80) verdict = "You are overpaying.";
  else if (diff < -80) verdict = "You are winning.";

  tradeResult.textContent = `You give ${giveTotal} vs they give ${getTotal} → ${verdict}`;
}
