// Translations
const LANG = {
  nl: {
    title: "Tankpedia",
    searchPlaceholder: "Zoek tanks...",
    searchBtn: "Zoeken",
    searching: "Zoeken naar",
    noQuery: 'Typ een tanknaam zoals "Leopard" of "Abrams" om te zoeken.',
    noResults: "Geen tanks gevonden in de database. Probeer een andere naam.",
    results: "resultaten",
    result: "resultaat",
    found: " gevonden. Klik op een kaart voor details.",
    viewStats: "Bekijk stats",
    loadingStats: "Bezig met laden van stats voor",
    statsFailed: "Kon tankgegevens niet laden. Probeer het later opnieuw.",
    searchFailed: "Zoeken mislukt. Probeer het later opnieuw.",
    noStats: "Geen tankgegevens gevonden in de infobox.",
    openWiki: "Open volledige Wikipedia pagina",
    favorites: "Favorieten",
    favAdd: "Toevoegen aan favorieten",
    favRemove: "Verwijder uit favorieten",
    favEmpty: "Nog geen favoriete tanks.",
    speed: "Snelheid",
    mass: "Gewicht",
    length: "Lengte",
    crew: "Bemanning",
    armor: "Pantser",
    langSwitch: "EN",
    navSearch: "Zoeken",
    navFav: "Favorieten",
    navHome: "Home",
    compare: "Vergelijk",
    compareTitle: "Tank vergelijking",
    compareSelect: "Selecteer 2 of meer tanks om te vergelijken",
    compareLoading: "Bezig met laden van tankgegevens...",
    compareFail: "Kon tankgegevens niet laden voor",
  },
  en: {
    title: "Tankpedia",
    searchPlaceholder: "Search tanks...",
    searchBtn: "Search",
    searching: "Searching for",
    noQuery: 'Type a tank name like "Leopard" or "Abrams" to search.',
    noResults: "No tanks found in the database. Try a different name.",
    results: "results",
    result: "result",
    found: " found. Click a card for details.",
    viewStats: "View stats",
    loadingStats: "Loading stats for",
    statsFailed: "Failed to load tank details. Try again later.",
    searchFailed: "Search failed. Try again later.",
    noStats: "No tank stats found in the infobox.",
    openWiki: "Open full Wikipedia page",
    favorites: "Favorites",
    favAdd: "Add to favorites",
    favRemove: "Remove from favorites",
    favEmpty: "No favorite tanks yet.",
    speed: "Speed",
    mass: "Mass",
    length: "Length",
    crew: "Crew",
    armor: "Armor",
    langSwitch: "NL",
    navSearch: "Search",
    navFav: "Favorites",
    navHome: "Home",
    compare: "Compare",
    compareTitle: "Tank comparison",
    compareSelect: "Select 2 or more tanks to compare",
    compareLoading: "Loading tank data...",
    compareFail: "Failed to load data for",
  }
};

let lang = "nl";

function _t(key) {
  return LANG[lang][key] || key;
}

function toggleLang() {
  lang = lang === "nl" ? "en" : "nl";
  document.getElementById("lang-btn").textContent = _t("langSwitch");
  document.querySelector("h1").textContent = _t("title");
  document.getElementById("search").placeholder = _t("searchPlaceholder");
  document.getElementById("search-button").textContent = _t("searchBtn");
  document.getElementById("nav-search").textContent = _t("navSearch");
  document.getElementById("nav-fav").textContent = _t("navFav");
  document.getElementById("nav-home").textContent = _t("navHome");
  const q = document.getElementById("search").value.trim();
  if (q) loadTanks(q);
  renderFavorites();
}

// Flags
function getFlagUrl(country) {
  const map = {
    American: "us", Soviet: "su", German: "de", British: "gb",
    French: "fr", Japanese: "jp", Israeli: "il", Italian: "it",
    Chinese: "cn", "South Korean": "kr", Swedish: "se", Polish: "pl",
    Czech: "cz", Turkish: "tr", Canadian: "ca", Australian: "au",
    Indian: "in", Iranian: "ir", "North Korean": "kp", Romanian: "ro",
    Yugoslav: "yu", Hungarian: "hu", Spanish: "es", Brazilian: "br",
    Swiss: "ch", Austrian: "at", Argentine: "ar", "South African": "za",
  };
  const code = map[country];
  if (!code) return null;
  if (code === "su") return "https://upload.wikimedia.org/wikipedia/commons/a/a9/Flag_of_the_Soviet_Union.svg";
  if (code === "yu") return "https://upload.wikimedia.org/wikipedia/commons/6/61/Flag_of_Yugoslavia_%281946-1992%29.svg";
  return `https://flagcdn.com/28x21/${code}.png`;
}

function flagHtml(country) {
  const url = getFlagUrl(country);
  return url ? `<img class="flag-icon" src="${url}" alt="${country}" title="${country}" />` : "";
}

function flagHtmlLg(country) {
  const url = getFlagUrl(country);
  return url ? `<img class="flag-icon flag-icon-lg" src="${url}" alt="${country}" title="${country}" />` : "";
}

// Favorites
function getFavorites() {
  return JSON.parse(localStorage.getItem("tankpedia_favs") || "[]");
}

function saveFavorites(list) {
  localStorage.setItem("tankpedia_favs", JSON.stringify(list));
}

function isFavorite(key) {
  return getFavorites().some(f => f.key === key);
}

function toggleFavorite(title, key, country, description) {
  let favs = getFavorites();
  const idx = favs.findIndex(f => f.key === key);
  if (idx > -1) {
    favs.splice(idx, 1);
  } else {
    favs.push({ key, title, country, description });
  }
  saveFavorites(favs);
  renderFavorites();
  return idx > -1 ? "removed" : "added";
}

function renderFavorites() {
  const container = document.getElementById("fav-list");
  if (!container) return;
  const favs = getFavorites();
  if (favs.length === 0) {
    container.innerHTML = `<p class="fav-empty">${_t("favEmpty")}</p>`;
    return;
  }
  const cardsHtml = favs.map(f => {
    const key = f.key;
    const cName = f.country || "";
    return `<div class="fav-card" data-key="${key}">
      <div class="fav-header">
        <span><input type="checkbox" class="fav-cb" data-key="${key}" /> <strong>${f.title}</strong> ${flagHtml(cName)}</span>
        <button class="fav-del-btn" data-key="${key}">&times;</button>
      </div>
    </div>`;
  }).join("");
  container.innerHTML = `<div id="fav-toolbar"><button id="compare-btn">${_t("compare")}</button></div>${cardsHtml}`;

  container.querySelectorAll(".fav-card").forEach(card => {
    card.addEventListener("click", function(e) {
      if (e.target.closest(".fav-del-btn") || e.target.closest(".fav-cb")) return;
      const key = this.dataset.key;
      const f = favs.find(x => x.key === key);
      openTankDetails(key, f ? f.country : "");
    });
  });
  container.querySelectorAll(".fav-del-btn").forEach(btn => {
    btn.addEventListener("click", function(e) {
      e.stopPropagation();
      let favs = getFavorites().filter(f => f.key !== this.dataset.key);
      saveFavorites(favs);
      renderFavorites();
    });
  });
  document.getElementById("compare-btn").addEventListener("click", compareSelectedFavorites);
}

async function compareSelectedFavorites() {
  const cbs = document.querySelectorAll(".fav-cb:checked");
  const selected = Array.from(cbs).map(cb => cb.dataset.key);
  if (selected.length < 2) {
    const favs = getFavorites();
    const keys = favs.map(f => f.key);
    document.querySelectorAll(".fav-cb").forEach(cb => cb.checked = true);
    if (keys.length < 2) return;
    return compareSelectedFavorites();
  }

  modalBody.innerHTML = `<div class="loading-spinner">${_t("compareLoading")}</div>`;
  modalOverlay.classList.add("open");

  const results = [];
  const fetches = selected.map(async key => {
    try {
      const data = await fetchTankDetails(key);
      results.push(data);
    } catch (_) {}
  });
  await Promise.all(fetches);

  if (results.length < 2) {
    modalBody.innerHTML = `<p>${_t("statsFailed")}</p>`;
    return;
  }

  modalBody.innerHTML = `
    <div class="modal-top-bar"></div>
    <h2>${_t("compareTitle")}</h2>
    <div class="chart-wrap"><canvas id="compare-chart"></canvas></div>
  `;

  const canvas = document.getElementById("compare-chart");
  const rect = canvas.parentElement.getBoundingClientRect();
  const cw = Math.max(300, Math.min(600, rect.width || 400));
  canvas.width = cw;
  canvas.height = Math.round(cw * 0.65);
  drawComparisonChart(canvas, results);
}

function drawComparisonChart(canvas, tanks) {
  const ctx = canvas.getContext("2d");
  const w = canvas.width, h = canvas.height;
  const pad = { top: 30, bottom: 50, left: 55, right: 20 };
  const chartW = w - pad.left - pad.right;
  const chartH = h - pad.top - pad.bottom;

  const extractNum = (s) => {
    if (!s) return null;
    const m = String(s).match(/[\d,.]+/);
    return m ? parseFloat(m[0].replace(",", ".")) : null;
  };

  const statKeys = [
    { key: "Speed", label: _t("speed"), max: 100 },
    { key: "Maximum speed", label: _t("speed"), max: 100 },
    { key: "Mass", label: _t("mass"), max: 80 },
    { key: "Armor", label: _t("armor"), max: 300 },
    { key: "Crew", label: _t("crew"), max: 8 },
    { key: "Length", label: _t("length"), max: 12 },
  ];

  const categories = [];
  const usedLabels = new Set();
  statKeys.forEach(sk => {
    if (usedLabels.has(sk.label)) return;
    const vals = tanks.map(t => extractNum((t.infobox || {})[sk.key]));
    if (vals.some(v => v !== null && v > 0)) {
      categories.push({ label: sk.label, max: sk.max, values: vals.map((v, i) => ({ tankIdx: i, val: v || 0 })) });
      usedLabels.add(sk.label);
    }
  });

  if (categories.length === 0) {
    ctx.fillStyle = "#94a3b8";
    ctx.font = "13px Arial";
    ctx.textAlign = "center";
    ctx.fillText("—", w / 2, h / 2);
    return;
  }

  const colors = ["#2563eb", "#dc2626", "#16a34a", "#d97706", "#7c3aed", "#ec4899", "#0891b2", "#64748b"];
  const catCount = categories.length;
  const tankCount = tanks.length;
  const groupW = chartW / catCount;
  const barW = Math.min(30, (groupW * 0.7) / tankCount);
  const gap = (groupW - barW * tankCount) / 2;

  const yMax = 100;
  const yStep = 25;

  ctx.font = "10px Arial";
  ctx.fillStyle = "#64748b";
  ctx.textAlign = "right";
  ctx.strokeStyle = "#e2e8f0";
  ctx.lineWidth = 1;
  for (let y = 0; y <= yMax; y += yStep) {
    const yPos = pad.top + chartH - (y / yMax) * chartH;
    ctx.beginPath();
    ctx.moveTo(pad.left, yPos);
    ctx.lineTo(w - pad.right, yPos);
    ctx.stroke();
    ctx.fillText(y, pad.left - 6, yPos + 3);
  }

  categories.forEach((cat, ci) => {
    const groupX = pad.left + ci * groupW;
    cat.values.forEach((v, ti) => {
      const x = groupX + gap + ti * barW;
      const barH = (v.val / yMax) * chartH;
      const y = pad.top + chartH - barH;
      ctx.fillStyle = colors[ti % colors.length];
      ctx.beginPath();
      ctx.roundRect(x, y, barW, barH, [2, 2, 0, 0]);
      ctx.fill();
      if (v.val > 0) {
        ctx.fillStyle = "#1f2937";
        ctx.font = "bold 9px Arial";
        ctx.textAlign = "center";
        ctx.fillText(v.val, x + barW / 2, y - 3);
      }
    });
    ctx.fillStyle = "#475569";
    ctx.font = "10px Arial";
    ctx.textAlign = "center";
    ctx.fillText(cat.label, groupX + groupW / 2, pad.top + chartH + 14);
  });

  const legendY = h - 14;
  let lx = pad.left;
  tanks.forEach((t, i) => {
    const name = t.title || `Tank ${i + 1}`;
    const displayName = name.length > 14 ? name.substring(0, 14) + "..." : name;
    ctx.fillStyle = colors[i % colors.length];
    ctx.fillRect(lx, legendY - 8, 10, 10);
    ctx.fillStyle = "#1f2937";
    ctx.font = "10px Arial";
    ctx.textAlign = "left";
    ctx.fillText(displayName, lx + 14, legendY + 2);
    lx += ctx.measureText(displayName).width + 28;
    if (lx > w - pad.right - 40) { lx = pad.left; }
  });
}

// Modal
const modalOverlay = document.getElementById("modal-overlay");
const modalBody = document.getElementById("modal-body");
const modalClose = document.getElementById("modal-close");

modalClose.addEventListener("click", closeModal);
modalOverlay.addEventListener("click", e => {
  if (e.target === modalOverlay) closeModal();
});
document.addEventListener("keydown", e => {
  if (e.key === "Escape") closeModal();
});

function closeModal() {
  modalOverlay.classList.remove("open");
  modalBody.innerHTML = "";
}

async function fetchTankDetails(title) {
  const pageTitle = title.replace(/ /g, "_");
  const htmlUrl = `https://en.wikipedia.org/api/rest_v1/page/html/${encodeURIComponent(pageTitle)}`;
  const res = await fetch(htmlUrl);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const html = await res.text();
  const doc = new DOMParser().parseFromString(html, "text/html");
  const infobox = doc.querySelector("table.infobox");
  if (!infobox) throw new Error("No infobox");
  const img = infobox.querySelector("img");
  let image = null;
  if (img) {
    image = img.getAttribute("src");
    if (image && image.startsWith("//")) image = "https:" + image;
  }
  const fields = {};
  infobox.querySelectorAll("tr").forEach(tr => {
    const th = tr.querySelector("th");
    const td = tr.querySelector("td");
    if (th && td) {
      let label = th.textContent.trim();
      let value = td.textContent.replace(/\[\d+\]/g, "").trim();
      value = value.replace(/\s+/g, " ");
      if (value.length > 200) {
        value = value.split(/[,.;]/)[0].trim();
        if (value.length > 150) value = value.substring(0, 150) + "...";
      }
      if (label && value) fields[label] = value;
    }
  });
  return { title: title.replace(/_/g, " "), infobox: fields, image };
}

async function openTankDetails(title, country) {
  const flagH = flagHtmlLg(country) || "";
  const key = title;

  modalBody.innerHTML = `<div class="loading-spinner">${_t("loadingStats")} ${flagH}<strong>${title.replace(/_/g, " ")}</strong>...</div>`;
  modalOverlay.classList.add("open");

  try {
    const data = await fetchTankDetails(key);
    const fields = data.infobox || {};
    const order = [
      "Type", "Crew", "Primary armament", "Secondary armament",
      "Engine", "Engine power", "Power/weight", "Speed",
      "Maximum speed", "Vehicle range", "Armor", "Mass",
      "Length", "Width", "Height", "Manufacturer",
      "Production", "Production date", "Unit cost",
    ];

    let statsHtml = "";
    order.forEach(key => {
      if (fields[key]) {
        let displayValue = fields[key];
        if (displayValue.length > 100) {
          displayValue = displayValue.substring(0, 100) + "...";
        }
        statsHtml += `
          <div class="stat-row">
            <span class="stat-label">${key}</span>
            <span class="stat-value" data-label="${key}">${displayValue}</span>
          </div>
        `;
      }
    });

    if (!statsHtml) {
      statsHtml = `<div class="stat-row"><span>${_t("noStats")}</span></div>`;
    }

    const imageHtml = data.image
      ? `<div class="stats-image"><img src="${data.image}" alt="${data.title}" /></div>`
      : "";

    modalBody.innerHTML = `
      <h2>${flagH} ${data.title}</h2>
      ${imageHtml}
      <div class="stat-grid">${statsHtml}</div>
      <div class="stats-footer">
        <a href="https://en.wikipedia.org/wiki/${encodeURIComponent(title)}" target="_blank" rel="noopener">${_t("openWiki")}</a>
      </div>
    `;

  } catch (error) {
    modalBody.innerHTML = `<p>${_t("statsFailed")}</p>`;
    console.error("Tank details error:", error);
  }
}

// Local tank database
let tanksDb = null;
async function getTanksDb() {
  if (tanksDb) return tanksDb;
  if (location.protocol === "file:") {
    throw new Error("Tank data needs a web server");
  }
  const res = await fetch("tank-database.json");
  tanksDb = (await res.json()).pages || [];
  return tanksDb;
}

// Search
async function loadTanks(q = "") {
  const box = document.getElementById("output");
  const trimmedQuery = q.trim();

  box.innerHTML = `
    <div id="search-status"></div>
    <div id="search-results"></div>
  `;

  const statusDiv = document.getElementById("search-status");
  const resultsDiv = document.getElementById("search-results");

  if (!trimmedQuery) {
    statusDiv.innerHTML = `<p>${_t("noQuery")}</p>`;
    return;
  }

  statusDiv.innerHTML = `<p>${_t("searching")} <strong>${trimmedQuery}</strong>...</p>`;

  try {
    const allTanks = await getTanksDb();
    const qLower = trimmedQuery.toLowerCase();
    let pages = allTanks.filter(t =>
      t.title.toLowerCase().includes(qLower) ||
      (t.description && t.description.toLowerCase().includes(qLower))
    );
    pages.sort((a, b) => {
      const at = a.title.toLowerCase(), bt = b.title.toLowerCase();
      if (at === qLower) return -1;
      if (bt === qLower) return 1;
      if (at.startsWith(qLower) && !bt.startsWith(qLower)) return -1;
      if (!at.startsWith(qLower) && bt.startsWith(qLower)) return 1;
      return at.localeCompare(bt);
    });
    pages = pages.slice(0, 30);

    if (pages.length === 0) {
      statusDiv.innerHTML = `<p>${_t("noResults")}</p>`;
      return;
    }

    const label = pages.length === 1 ? _t("result") : _t("results");
    statusDiv.innerHTML = `<p>${pages.length} ${label}${_t("found")}</p>`;

    pages.forEach(page => {
      const card = document.createElement("div");
      card.className = "search-card";
      const title = page.title || page.page_key || page.key;
      const description = page.description || "";
      const thumbnail = page.thumbnail_url || (page.thumbnail && page.thumbnail.url) || null;
      const pageKey = page.page_key || page.key;
      const cName = page.country || "";
      const countryHtml = flagHtml(cName) || (cName ? `<span class="country-badge">${cName}</span>` : "");

      const isFav = isFavorite(pageKey);

      card.innerHTML = `
        <div class="result-header">
          <div>
            <h3>${title} ${countryHtml}</h3>
            <p>${description}</p>
          </div>
          <div style="display:flex;gap:0.3rem;align-items:center">
            <span class="fav-star${isFav ? ' active' : ''}" data-title="${pageKey}" data-country="${cName}">${isFav ? '\u2605' : '\u2606'}</span>
            <button type="button" class="details-button" data-title="${pageKey}">${_t("viewStats")}</button>
          </div>
        </div>
        ${thumbnail ? `<img class="result-thumb" src="${thumbnail}" alt="${title}" />` : ""}
      `;

      card.querySelector(".details-button").addEventListener("click", e => {
        e.stopPropagation();
        openTankDetails(pageKey, cName);
      });
      card.querySelector(".fav-star").addEventListener("click", function(e) {
        e.stopPropagation();
        const key = this.dataset.title;
        const country = this.dataset.country;
        const result = toggleFavorite(title, key, country, description);
        this.classList.toggle("active", result === "added");
        this.textContent = result === "added" ? "\u2605" : "\u2606";
      });
      card.addEventListener("click", () => openTankDetails(pageKey, cName));
      resultsDiv.appendChild(card);
    });
  } catch (error) {
    statusDiv.innerHTML = location.protocol === "file:"
      ? `<p>Open de site via GitHub Pages of een lokale webserver om te zoeken.</p>`
      : `<p>${_t("searchFailed")}</p>`;
    console.error("Search error:", error);
  }
}

// Init
const searchInput = document.getElementById("search");
const searchButton = document.getElementById("search-button");

if (searchInput && searchButton) {
  const triggerSearch = () => loadTanks(searchInput.value);
  searchButton.addEventListener("click", triggerSearch);
  searchInput.addEventListener("keydown", e => {
    if (e.key === "Enter") { e.preventDefault(); triggerSearch(); }
  });
}

function switchTab(tab) {
  document.getElementById("nav-search").classList.toggle("active", tab === "search");
  document.getElementById("nav-fav").classList.toggle("active", tab === "fav");
  document.getElementById("page-search").classList.toggle("active", tab === "search");
  document.getElementById("page-fav").classList.toggle("active", tab === "fav");
  if (tab === "fav") renderFavorites();
}

document.getElementById("nav-search").addEventListener("click", () => switchTab("search"));
document.getElementById("nav-fav").addEventListener("click", () => switchTab("fav"));
document.getElementById("nav-home").addEventListener("click", () => { location.href = "./index.html?view=home"; });

document.getElementById("lang-btn").addEventListener("click", toggleLang);

if (location.protocol !== "file:" && "serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js");
}
