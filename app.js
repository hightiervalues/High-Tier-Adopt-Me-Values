// =========================
// ITEM DATA (Shark values)
// =========================

// value.* = shark value (1 = 1 Shark)
// Frost values are derived in UI from shark totals.
const ITEMS = [
  {
    id: "shadow_dragon",
    name: "Shadow Dragon",
    category: "pets",
    icon: "assets/icons/shadow_dragon.png",
    value: { np: 800, r: 820, f: 830, fr: 850, n: 1600, m: 2600 }
  },
  {
    id: "frost_dragon",
    name: "Frost Dragon",
    category: "pets",
    icon: "assets/icons/frost_dragon.png",
    value: { np: 700, r: 720, f: 730, fr: 750, n: 1400, m: 2200 }
  },
  {
    id: "bat_dragon",
    name: "Bat Dragon",
    category: "pets",
    icon: "assets/icons/bat_dragon.png",
    value: { np: 780, r: 800, f: 810, fr: 830, n: 1550, m: 2500 }
  },
  {
    id: "owl",
    name: "Owl",
    category: "pets",
    icon: "assets/icons/owl.png",
    value: { np: 600, r: 620, f: 630, fr: 650, n: 1200, m: 1900 }
  },
  {
    id: "parrot",
    name: "Parrot",
    category: "pets",
    icon: "assets/icons/parrot.png",
    value: { np: 650, r: 670, f: 680, fr: 700, n: 1300, m: 2000 }
  },
  {
    id: "giraffe",
    name: "Giraffe",
    category: "pets",
    icon: "assets/icons/giraffe.png",
    value: { np: 680, r: 700, f: 710, fr: 730, n: 1350, m: 2100 }
  },
  {
    id: "crow",
    name: "Crow",
    category: "pets",
    icon: "assets/icons/crow.png",
    value: { np: 580, r: 600, f: 610, fr: 630, n: 1150, m: 1850 }
  },
  {
    id: "arctic_reindeer",
    name: "Arctic Reindeer",
    category: "pets",
    icon: "assets/icons/arctic_reindeer.png",
    value: { np: 540, r: 560, f: 570, fr: 590, n: 1100, m: 1750 }
  },
  {
    id: "evil_unicorn",
    name: "Evil Unicorn",
    category: "pets",
    icon: "assets/icons/evil_unicorn.png",
    value: { np: 620, r: 640, f: 650, fr: 670, n: 1250, m: 1950 }
  },
  {
    id: "frost_fury",
    name: "Frost Fury",
    category: "pets",
    icon: "assets/icons/frost_fury.png",
    value: { np: 500, r: 515, f: 525, fr: 540, n: 1000, m: 1600 }
  },
  {
    id: "dalmatian",
    name: "Dalmatian",
    category: "pets",
    icon: "assets/icons/dalmatian.png",
    value: { np: 420, r: 430, f: 440, fr: 460, n: 850, m: 1350 }
  },
  {
    id: "hedgehog",
    name: "Hedgehog",
    category: "pets",
    icon: "assets/icons/hedgehog.png",
    value: { np: 400, r: 410, f: 420, fr: 440, n: 820, m: 1300 }
  },
  {
    id: "turtle",
    name: "Turtle",
    category: "pets",
    icon: "assets/icons/turtle.png",
    value: { np: 450, r: 465, f: 475, fr: 490, n: 900, m: 1500 }
  },
  {
    id: "kangaroo",
    name: "Kangaroo",
    category: "pets",
    icon: "assets/icons/kangaroo.png",
    value: { np: 440, r: 455, f: 465, fr: 480, n: 880, m: 1450 }
  },
  {
    id: "albino_monkey",
    name: "Albino Monkey",
    category: "pets",
    icon: "assets/icons/albino_monkey.png",
    value: { np: 430, r: 445, f: 455, fr: 470, n: 860, m: 1400 }
  },
  {
    id: "blue_dog",
    name: "Blue Dog",
    category: "pets",
    icon: "assets/icons/blue_dog.png",
    value: { np: 380, r: 390, f: 400, fr: 415, n: 780, m: 1200 }
  },
  {
    id: "pink_cat",
    name: "Pink Cat",
    category: "pets",
    icon: "assets/icons/pink_cat.png",
    value: { np: 370, r: 380, f: 390, fr: 405, n: 760, m: 1180 }
  }
];

const VARIANT_LABEL = {
  np: "NP",
  r: "R",
  f: "F",
  fr: "FR",
  n: "Neon",
  m: "Mega"
};

// 1 Frost = 95 Sharks (base ratio)
const FROST_TO_SHARK_RATIO = 95;

// 18 slots each side
const EMPTY_OFFER = () => Array(18).fill(null);

const state = {
  your: EMPTY_OFFER(),
  their: EMPTY_OFFER(),
  currentSide: null,
  currentIndex: null,
  currentCategory: "pets",
  selectedItemId: null
};

function $(sel) {
  return document.querySelector(sel);
}
function $all(sel) {
  return Array.from(document.querySelectorAll(sel));
}

// ----------------------------
// PICKER LOGIC
// ----------------------------

function openPicker(side, index) {
  state.currentSide = side;
  state.currentIndex = index;
  state.selectedItemId = null;

  // Reset variant to NP
  const radios = document.querySelectorAll('input[name="variant"]');
  for (let i = 0; i < radios.length; i++) {
    radios[i].checked = radios[i].value === "np";
  }

  // Default category = pets
  setCategory("pets");

  const modal = $("#pickerModal");
  if (modal) modal.classList.remove("hidden");
}

function closePicker() {
  const modal = $("#pickerModal");
  if (modal) modal.classList.add("hidden");
}

function setCategory(cat) {
  state.currentCategory = cat;

  // Tab active states
  const tabs = $all(".picker-tab");
  for (let i = 0; i < tabs.length; i++) {
    const btn = tabs[i];
    btn.classList.toggle("active", btn.dataset.category === cat);
  }

  // Filter items
  const list = ITEMS.filter(item => item.category === cat);
  const container = $("#pickerItems");
  if (!container) return;
  container.innerHTML = "";

  if (list.length === 0) {
    container.innerHTML = '<p class="picker-empty">No items in this category yet.</p>';
    return;
  }

  list.forEach(item => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "picker-item";
    card.dataset.id = item.id;
    card.innerHTML = `
      <img src="${item.icon}" alt="${item.name}" />
      <span>${item.name}</span>
    `;
    card.addEventListener("click", function () {
      state.selectedItemId = item.id;
      const allCards = $all(".picker-item");
      for (let j = 0; j < allCards.length; j++) {
        allCards[j].classList.remove("selected");
      }
      card.classList.add("selected");
    });
    container.appendChild(card);
  });
}

// ----------------------------
// RENDER OFFERS
// ----------------------------

function renderOffers() {
  const yourSlots = $all('.offer-slot[data-side="your"]');
  const theirSlots = $all('.offer-slot[data-side="their"]');

  for (let i = 0; i < yourSlots.length; i++) {
    const slot = yourSlots[i];
    const index = Number(slot.dataset.index);
    const entry = state.your[index];
    renderSlot(slot, entry);
  }

  for (let i = 0; i < theirSlots.length; i++) {
    const slot = theirSlots[i];
    const index = Number(slot.dataset.index);
    const entry = state.their[index];
    renderSlot(slot, entry);
  }
}

function renderSlot(slot, entry) {
  slot.innerHTML = "";
  slot.classList.remove("filled");

  if (!entry) {
    if (slot.classList.contains("plus")) {
      const plusDiv = document.createElement("div");
      plusDiv.className = "slot-plus";
      plusDiv.textContent = "+";
      slot.appendChild(plusDiv);
    }
    return;
  }

  slot.classList.add("filled");
  const item = ITEMS.find(i => i.id === entry.itemId);
  if (!item) return;

  const wrap = document.createElement("div");
  wrap.className = "slot-content";
  wrap.innerHTML = `
    <img src="${item.icon}" alt="${item.name}" />
    <div class="slot-text">
      <span class="slot-name">${item.name}</span>
      <span class="slot-variant">${VARIANT_LABEL[entry.variant] || ""}</span>
    </div>
  `;
  slot.appendChild(wrap);
}

function getSelectedVariant() {
  const radios = document.querySelectorAll('input[name="variant"]');
  for (let i = 0; i < radios.length; i++) {
    if (radios[i].checked) {
      return radios[i].value;
    }
  }
  return "np";
}

function handleAddToOffer() {
  if (!state.selectedItemId) {
    alert("Select an item first.");
    return;
  }

  const variant = getSelectedVariant();
  const sideArray = state.currentSide === "your" ? state.your : state.their;
  sideArray[state.currentIndex] = {
    itemId: state.selectedItemId,
    variant: variant
  };

  renderOffers();
  calculateAndUpdateTotals();
  closePicker();
}

// ----------------------------
// TOTALS (Shark + Frost)
// ----------------------------

function updateTotalsUI(yourShark, theirShark) {
  const yourFrost = yourShark / FROST_TO_SHARK_RATIO;
  const theirFrost = theirShark / FROST_TO_SHARK_RATIO;

  const ys = document.getElementById("yourSharkTotal");
  const ts = document.getElementById("theirSharkTotal");
  const yf = document.getElementById("yourFrostTotal");
  const tf = document.getElementById("theirFrostTotal");

  if (ys) ys.textContent = yourShark.toFixed(2);
  if (ts) ts.textContent = theirShark.toFixed(2);
  if (yf) yf.textContent = yourFrost.toFixed(2);
  if (tf) tf.textContent = theirFrost.toFixed(2);
}

function calculateTotals() {
  let yourSharkTotal = 0;
  let theirSharkTotal = 0;

  for (let i = 0; i < state.your.length; i++) {
    const entry = state.your[i];
    if (!entry) continue;
    const item = ITEMS.find(it => it.id === entry.itemId);
    if (!item) continue;
    const v = item.value[entry.variant] || 0;
    yourSharkTotal += v;
  }

  for (let i = 0; i < state.their.length; i++) {
    const entry = state.their[i];
    if (!entry) continue;
    const item = ITEMS.find(it => it.id === entry.itemId);
    if (!item) continue;
    const v = item.value[entry.variant] || 0;
    theirSharkTotal += v;
  }

  return { yourSharkTotal, theirSharkTotal };
}

function calculateAndUpdateTotals() {
  const totals = calculateTotals();
  updateTotalsUI(totals.yourSharkTotal, totals.theirSharkTotal);
  return totals;
}

// ----------------------------
// CLEAR & EVALUATE
// ----------------------------

function clearTrade() {
  state.your = EMPTY_OFFER();
  state.their = EMPTY_OFFER();
  renderOffers();
  const resultEl = $("#tradeResult");
  if (resultEl) resultEl.textContent = "";
  updateTotalsUI(0, 0);
}

function evaluateTrade() {
  const totals = calculateAndUpdateTotals();
  const yourSharkTotal = totals.yourSharkTotal;
  const theirSharkTotal = totals.theirSharkTotal;

  const resultEl = $("#tradeResult");
  if (!resultEl) return;

  if (yourSharkTotal === 0 && theirSharkTotal === 0) {
    resultEl.textContent = "Add some items to both offers to evaluate.";
    return;
  }

  let message =
    "Your value: " + yourSharkTotal.toFixed(2) + " sharks • " +
    "Their value: " + theirSharkTotal.toFixed(2) + " sharks – ";

  if (yourSharkTotal > theirSharkTotal + 30) {
    message += "You are overpaying a lot. 🟥";
  } else if (theirSharkTotal > yourSharkTotal + 30) {
    message += "They are over. This looks like a win for you. 🟩";
  } else {
    message += "This is around fair. 🟨";
  }

  resultEl.textContent = message;
}

// ----------------------------
// SIDE MENU / CONTACT / FEEDBACK
// ----------------------------

function initMenuAndFeedback() {
  const menuToggle = $("#menuToggle");
  const menuClose = $("#menuClose");
  const sideMenu = $("#sideMenu");
  const overlay = $("#menuOverlay");
  const contactBtn = $("#contactEmailBtn");
  const feedbackBtn = $("#feedbackSendBtn");
  const feedbackInput = $("#feedbackInput");

  // TODO: change this to your real email:
  const OWNER_EMAIL = "youremail@example.com";

  function openMenu() {
    if (sideMenu) sideMenu.classList.add("open");
    if (overlay) overlay.classList.add("visible");
  }
  function closeMenu() {
    if (sideMenu) sideMenu.classList.remove("open");
    if (overlay) overlay.classList.remove("visible");
  }

  if (menuToggle) {
    menuToggle.addEventListener("click", openMenu);
  }
  if (menuClose) {
    menuClose.addEventListener("click", closeMenu);
  }
  if (overlay) {
    overlay.addEventListener("click", closeMenu);
  }

  if (contactBtn) {
    contactBtn.addEventListener("click", function () {
      window.location.href =
        "mailto:" +
        OWNER_EMAIL +
        "?subject=Adopt%20Me%20Value%20Question";
    });
  }

  if (feedbackBtn && feedbackInput) {
    feedbackBtn.addEventListener("click", function () {
      const text = feedbackInput.value.trim();
      if (!text) {
        alert("Please type some feedback first.");
        return;
      }
      const body = encodeURIComponent(text);
      window.location.href =
        "mailto:" +
        OWNER_EMAIL +
        "?subject=HighTier%20Values%20Feedback&body=" +
        body;
      feedbackInput.value = "";
      alert("Feedback opened in your email app. Thanks!");
    });
  }
}

// ----------------------------
// INIT
// ----------------------------
document.addEventListener("DOMContentLoaded", function () {
  // Slot click handlers
  const slots = $all(".offer-slot");
  for (let i = 0; i < slots.length; i++) {
    const slot = slots[i];
    slot.addEventListener("click", function () {
      const side = slot.dataset.side;
      const index = Number(slot.dataset.index);
      openPicker(side, index);
    });
  }

  // Category tabs
  const tabs = $all(".picker-tab");
  for (let i = 0; i < tabs.length; i++) {
    const btn = tabs[i];
    btn.addEventListener("click", function () {
      setCategory(btn.dataset.category);
    });
  }

  // Picker buttons
  const pickerCancel = $("#pickerCancel");
  const pickerAdd = $("#pickerAdd");
  if (pickerCancel) {
    pickerCancel.addEventListener("click", function () {
      closePicker();
    });
  }
  if (pickerAdd) {
    pickerAdd.addEventListener("click", handleAddToOffer);
  }

  // Clear & evaluate
  const clearBtn = $("#clearTrade");
  const evalBtn = $("#evaluateBtn");
  if (clearBtn) {
    clearBtn.addEventListener("click", clearTrade);
  }
  if (evalBtn) {
    evalBtn.addEventListener("click", evaluateTrade);
  }

  // Menu + feedback
  initMenuAndFeedback();

  // First render + totals
  renderOffers();
  updateTotalsUI(0, 0);
});
