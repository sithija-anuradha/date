// ===================== CONFIGURATION =====================
// Optional EmailJS setup: create a service + email template at https://www.emailjs.com/
// Then enter your public key, service ID, template ID and destination email in the template.
const EMAILJS_PUBLIC_KEY = "zQrblugJvuwbl58hC";
const EMAILJS_SERVICE_ID = "service_z0058hn";
const EMAILJS_TEMPLATE_ID = "template_7rnwpzs";
const OWNER_EMAIL = "sithijaanuradhalap2004@gmail.com";

// Approximate Sri Lankan menu estimates in LKR. Edit these to match your area.
const MENU = [
  { name: "Pizza", emoji: "🍕", price: 1800 },
  { name: "Burger", emoji: "🍔", price: 950 },
  { name: "Hotdog", emoji: "🌭", price: 650 },
  { name: "Chocolate", emoji: "🍫", price: 450 },
  { name: "Doughnut", emoji: "🍩", price: 350 },
  { name: "Custard", emoji: "🍮", price: 400 },
  { name: "Ice cream", emoji: "🍨", price: 500 },
  { name: "Rice & curry", emoji: "🍛", price: 850 },
  { name: "Fried rice", emoji: "🥘", price: 1100 },
  { name: "Pancake", emoji: "🥞", price: 450 },
  { name: "Coca-Cola", emoji: "🥤", price: 300 },
  { name: "Coffee", emoji: "☕", price: 550 }
];
// Custom suggestions use a placeholder estimate until a real price is entered/verified.
const CUSTOM_SUGGESTION_ESTIMATE = 700;
// ==========================================================

const $ = (id) => document.getElementById(id);
const state = { date: "", time: "", venue: "", selected: [], suggestions: [] };
const pages = ["page1", "page2", "page3", "successPage"];

function showPage(pageId, step) {
  pages.forEach(id => $(id).classList.toggle("active", id === pageId));
  $("stepIndicator").innerHTML = pageId === "successPage" ? "♥" : `${String(step).padStart(2, "0")} <span>/</span> 03`;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

const yesBtn = $("yesBtn");
const noBtn = $("noBtn");
let noClicks = 0;
noBtn.addEventListener("click", () => {
  noClicks++;
  const yesScale = Math.min(1 + noClicks * 0.22, 2.25);
  const noScale = Math.max(1 - noClicks * 0.13, 0.42);
  yesBtn.style.transform = `scale(${yesScale})`;
  noBtn.style.transform = `scale(${noScale})`;
  $("noMessage").textContent = [
    "Are you sure? 🥺",
    "Maybe think about it one more time? 💗",
    "The Yes button is getting excited…",
    "No worries — you can still choose either answer. 💕"
  ][Math.min(noClicks - 1, 3)];
  if (noClicks >= 5) {
    noBtn.classList.add("faded");
    noBtn.style.opacity = "0.25";
  }
});
yesBtn.addEventListener("click", () => showPage("page2", 2));

$("dateInput").min = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);
$("toFoodBtn").addEventListener("click", () => {
  const date = $("dateInput").value, time = $("timeInput").value, venue = $("venueInput").value.trim();
  if (!date || !time || !venue) {
    $("planError").textContent = "Please choose a date, time and venue before continuing.";
    return;
  }
  state.date = date; state.time = time; state.venue = venue;
  $("locationInput").value = venue;
  $("planError").textContent = "";
  showPage("page3", 3);
});
document.querySelectorAll("[data-back]").forEach(btn => btn.addEventListener("click", () => {
  showPage(btn.dataset.back === "1" ? "page1" : "page2", Number(btn.dataset.back));
}));

function renderMenu() {
  $("foodGrid").innerHTML = MENU.map(item => `
    <button type="button" class="food-option ${state.selected.includes(item.name) ? "selected" : ""}" data-food="${item.name}">
      <span class="food-emoji">${item.emoji}</span>
      <span class="food-name">${item.name}</span>
      <span class="food-price">~ LKR ${item.price.toLocaleString("en-LK")}</span>
    </button>`).join("");
  document.querySelectorAll("[data-food]").forEach(btn => btn.addEventListener("click", () => {
    const name = btn.dataset.food;
    state.selected = state.selected.includes(name) ? state.selected.filter(x => x !== name) : [...state.selected, name];
    renderMenu(); updateTotal();
  }));
}
function updateTotal() {
  const known = state.selected.reduce((sum, name) => sum + (MENU.find(x => x.name === name)?.price || 0), 0);
  const custom = state.suggestions.length * CUSTOM_SUGGESTION_ESTIMATE;
  $("totalCost").textContent = `LKR ${(known + custom).toLocaleString("en-LK")}`;
}
function renderSuggestions() {
  $("suggestionList").innerHTML = state.suggestions.map((s, i) =>
    `<li>${escapeHTML(s)} <button class="remove-suggestion" data-remove="${i}" aria-label="Remove ${escapeHTML(s)}">×</button></li>`
  ).join("");
  document.querySelectorAll("[data-remove]").forEach(btn => btn.addEventListener("click", () => {
    state.suggestions.splice(Number(btn.dataset.remove), 1); renderSuggestions(); updateTotal();
  }));
}
function escapeHTML(value) {
  return value.replace(/[&<>"']/g, ch => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[ch]));
}
function addSuggestion() {
  const input = $("suggestionInput"), value = input.value.trim();
  $("suggestionError").textContent = "";
  if (!value) return;
  if (state.suggestions.length >= 5) { $("suggestionError").textContent = "You can add up to five suggestions."; return; }
  if ([...state.selected, ...state.suggestions].some(x => x.toLowerCase() === value.toLowerCase())) {
    $("suggestionError").textContent = "That item is already on your list."; return;
  }
  state.suggestions.push(value); input.value = ""; renderSuggestions(); updateTotal();
}
$("addSuggestionBtn").addEventListener("click", addSuggestion);
$("suggestionInput").addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); addSuggestion(); } });

$("findPlacesBtn").addEventListener("click", () => {
  const area = $("locationInput").value.trim() || state.venue;
  if (!area) { $("locationHelp").textContent = "Please enter a venue or area first."; return; }
  const query = encodeURIComponent(`restaurants cafes food near ${area}`);
  const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
  $("mapLinks").innerHTML = `<a href="${url}" target="_blank" rel="noopener noreferrer">Open nearby food & drink places in Google Maps ↗</a>`;
  window.open(url, "_blank", "noopener");
  $("locationHelp").textContent = "Google Maps will show nearby places. Check opening hours and current prices there.";
});

function getReceiptData() {
  const selected = [...state.selected, ...state.suggestions];
  const knownTotal = state.selected.reduce((sum, name) => sum + (MENU.find(x => x.name === name)?.price || 0), 0);
  return {
    date: state.date, time: state.time, venue: state.venue,
    items: selected.length ? selected.join(", ") : "No food or drinks selected",
    places: `Google Maps search near ${state.venue}`,
    total: `LKR ${(knownTotal + state.suggestions.length * CUSTOM_SUGGESTION_ESTIMATE).toLocaleString("en-LK")} (estimate)`
  };
}
function renderReceipt() {
  const d = getReceiptData();
  const rows = [
    ["Date", d.date], ["Time", d.time], ["Venue", d.venue],
    ["Food & drinks", d.items], ["Where to find places", d.places], ["Estimated total", d.total]
  ];
  $("receipt").innerHTML = rows.map((r, i) =>
    `<div class="receipt-row ${i === 5 ? "receipt-total" : ""}"><span>${r[0]}</span><span>${escapeHTML(r[1])}</span></div>`
  ).join("");
}
$("finalizeBtn").addEventListener("click", () => {
  $("finalError").textContent = "";
  renderReceipt();
  showPage("successPage", 3);
});
$("emailBtn").addEventListener("click", async () => {
  const configured = ![EMAILJS_PUBLIC_KEY, EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID].some(x => x.startsWith("YOUR_"));
  if (!configured || !window.emailjs) {
    $("emailStatus").textContent = "Email isn't configured yet. Add your EmailJS IDs in app.js, then publish again. Your receipt is shown above.";
    return;
  }
  try {
    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
    const d = getReceiptData();
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
      to_email: OWNER_EMAIL, date: d.date, time: d.time, venue: d.venue,
      food_and_drinks: d.items, nearby_places: d.places, total_cost: d.total,
      message: `Date: ${d.date}\nTime: ${d.time}\nVenue: ${d.venue}\nFood & drinks: ${d.items}\nPlaces: ${d.places}\nEstimated total: ${d.total}`
    });
    $("emailStatus").textContent = "Your plan has been emailed successfully. 💌";
    $("emailBtn").textContent = "Email sent ✓";
    $("emailBtn").disabled = true;
  } catch (err) {
    $("emailStatus").textContent = "Email could not be sent. Check your EmailJS service and template settings.";
  }
});
$("restartBtn").addEventListener("click", () => {
  state.date = ""; state.time = ""; state.venue = ""; state.selected = []; state.suggestions = [];
  $("dateInput").value = ""; $("timeInput").value = ""; $("venueInput").value = "";
  $("suggestionInput").value = ""; $("locationInput").value = ""; $("mapLinks").innerHTML = "";
  $("emailStatus").textContent = ""; $("emailBtn").disabled = false; $("emailBtn").innerHTML = 'Send my plan by email <span>♥</span>';
  noClicks = 0; yesBtn.style.transform = ""; noBtn.style.transform = ""; noBtn.style.opacity = "";
  renderMenu(); renderSuggestions(); updateTotal(); showPage("page1", 1);
});
renderMenu(); renderSuggestions(); updateTotal();
