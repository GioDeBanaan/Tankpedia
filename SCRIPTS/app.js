// =============================================================================
// TANKPEDIA – JavaScript
// =============================================================================

// ======================== VERTALINGEN (NL / EN) ==============================
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
    compareWinner: "Winnaar op basis van de beschikbare stats.",
    compareCandidate: "Sterke kandidaat in deze selectie.",
    compareSummaryOne: "{winner} staat bovenaan.",
    compareSummaryTwo: "{winner} staat bovenaan. {runnerUp} volgt op plek 2.",
    compareNoStatsRank: "Weinig stats beschikbaar om te scoren.",
    rankingTitle: "Ranglijst",
    rankingHint: "De tanks hieronder zijn automatisch gerangschikt op gevechtswaarde.",
    rankingEmpty: "Voeg 2 of meer favorieten toe om een ranglijst te zien.",
    rankingLoading: "Ranglijst laden...",
    tankType: "Type tank",
    tankCrew: "Crew",
    tankEngine: "Engine",
    tankArmor: "Armour",
    tankMass: "Gewicht",
    tankSize: "Hoogte / Breedte",
    tankManufacturer: "Manufacturer",
    tankCannon: "Kanon",
    tankMachineguns: "Machinegeweren",
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
    compareWinner: "Winner based on the available stats.",
    compareCandidate: "Strong candidate in this selection.",
    compareSummaryOne: "{winner} is on top.",
    compareSummaryTwo: "{winner} is on top. {runnerUp} is second.",
    compareNoStatsRank: "Not enough stats available to score.",
    rankingTitle: "Ranking",
    rankingHint: "The tanks below are automatically ranked by battle value.",
    rankingEmpty: "Add 2 or more favorites to see a ranking.",
    rankingLoading: "Loading ranking...",
    tankType: "Tank type",
    tankCrew: "Crew",
    tankEngine: "Engine",
    tankArmor: "Armor",
    tankMass: "Weight",
    tankSize: "Height / Width",
    tankManufacturer: "Manufacturer",
    tankCannon: "Cannon",
    tankMachineguns: "Machine guns",
  }
};

// Huidige taal (start met Nederlands)
let lang = "nl";

// Haalt vertaalde tekst op voor huidige taal
function _t(key) {
  return LANG[lang][key] || key;
}

// Vervangt placeholders {key} in vertaalde tekst met waarden
function tFormat(key, values) {
  return Object.entries(values).reduce((text, [name, value]) => text.replaceAll(`{${name}}`, value), _t(key));
}

// ========================= TAAL WISSELEN =====================================
function toggleLang() {
  lang = lang === "nl" ? "en" : "nl";
  document.getElementById("lang-btn").textContent = _t("langSwitch");
  const appTitle = document.getElementById("app-title");
  if (appTitle) appTitle.textContent = _t("title");
  document.getElementById("search").placeholder = _t("searchPlaceholder");
  document.getElementById("search-button").textContent = _t("searchBtn");
  document.getElementById("nav-search").textContent = _t("navSearch");
  document.getElementById("nav-fav").textContent = _t("navFav");
  // Als er een actieve zoekopdracht is, herlaad met nieuwe taal
  const q = document.getElementById("search").value.trim();
  if (q) loadTanks(q);
  renderFavorites();
}

// ======================== VLAGGEN ============================================
// Land → ISO-code mapping + vlag-URL (Wikimedia thumbnails voor historische landen)
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
  // Historische landen die niet op flagcdn.com staan → Wikimedia thumbnails met vaste grootte
  if (code === "su") return "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Flag_of_the_Soviet_Union.svg/40px-Flag_of_the_Soviet_Union.svg.png";
  if (code === "yu") return "https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/Flag_of_Yugoslavia_%281946-1992%29.svg/40px-Flag_of_Yugoslavia_%281946-1992%29.svg.png";
  return `https://flagcdn.com/28x21/${code}.png`;
}

// Kleine vlag voor zoekkaarten
function flagHtml(country) {
  const url = getFlagUrl(country);
  return url ? `<img class="flag-icon" src="${url}" alt="${country}" title="${country}" />` : "";
}

// Grote vlag voor modals (tankdetails)
function flagHtmlLg(country) {
  const url = getFlagUrl(country);
  return url ? `<img class="flag-icon flag-icon-lg" src="${url}" alt="${country}" title="${country}" />` : "";
}

// ======================== DATA UIT WIKIPEDIA INFOBOX =========================
// Haalt een numerieke waarde uit tekst (bijv. "50 km/h" → 50)
function extractTankNumber(value) {
  if (!value) return null;
  const str = String(value);
  // Bereik zoals "25–185 mm" → neem de hoogste waarde (185)
  const rangeMatch = str.match(/([\d,.]+)\s*[–\-]\s*([\d,.]+)/);
  if (rangeMatch) {
    return Math.max(
      parseFloat(rangeMatch[1].replace(",", ".")),
      parseFloat(rangeMatch[2].replace(",", "."))
    );
  }
  // Enkel getal: pak de eerste match
  const match = str.match(/[\d,.]+/);
  return match ? parseFloat(match[0].replace(",", ".")) : null;
}

// Maakt infobox-tekst schoon: verwijdert referenties, kort in indien nodig
function cleanInfoboxText(value) {
  if (!value) return "";
  let text = String(value).replace(/\[\d+\]/g, "").replace(/\s+/g, " ").trim();
  if (text.length > 180) {
    const firstClause = text.split(/[,.;]/)[0].trim();
    if (firstClause) text = firstClause;
  }
  if (text.length > 140) {
    text = text.substring(0, 140) + "...";
  }
  return text;
}

// Zoekt eerste veld uit een lijst van mogelijke veldnamen
function getInfoboxField(fields, names) {
  for (const name of names) {
    if (fields[name]) return cleanInfoboxText(fields[name]);
  }
  return "";
}

// Stelt pantsertekst samen (voor/zij/achter apart of samengevat)
function getArmorText(fields) {
  // Aparte voor/zij/achter velden (zowel US als Britse spelling)
  const parts = [];
  const front = getInfoboxField(fields, ["Front armor", "Front armour"]);
  const side = getInfoboxField(fields, ["Side armor", "Side armour"]);
  const rear = getInfoboxField(fields, ["Rear armor", "Rear armour"]);

  if (front) parts.push(`Voor: ${front}`);
  if (side) parts.push(`Zij: ${side}`);
  if (rear) parts.push(`Achter: ${rear}`);
  if (parts.length) return parts.join(" / ");

  // Samengevat pantserveld (bv. "Armour 25–185 mm")
  const armor = getInfoboxField(fields, ["Armor", "Armour", "Hull armor", "Hull armour", "Turret armor", "Turret armour"]);
  return armor;
}

// Stelt afmetingtekst samen (hoogte / breedte)
function getSizeText(fields) {
  const height = getInfoboxField(fields, ["Height"]);
  const width = getInfoboxField(fields, ["Width"]);
  const parts = [];
  if (height) parts.push(`Hoogte: ${height}`);
  if (width) parts.push(`Breedte: ${width}`);
  return parts.join(" / ");
}

function getCannonText(fields) {
  return getInfoboxField(fields, ["Main armament", "Primary armament", "Armament"]);
}

function getMachinegunsText(fields) {
  return getInfoboxField(fields, ["Machine guns", "Secondary armament"]);
}

// Bouwt volledig display-object van ruwe infobox-velden
function buildTankDisplayData(fields) {
  const type = getInfoboxField(fields, ["Type"]);
  const crew = getInfoboxField(fields, ["Crew"]);
  const engine = getInfoboxField(fields, ["Engine"]);
  const armor = getArmorText(fields);
  const mass = getInfoboxField(fields, ["Mass"]);
  const size = getSizeText(fields);
  const manufacturer = getInfoboxField(fields, ["Manufacturer"]);
  const cannon = getCannonText(fields);
  const machineguns = getMachinegunsText(fields);

  return {
    type, crew, engine, armor, mass, size, manufacturer, cannon, machineguns,
    // Score-velden (alleen getallen) voor gevechtswaarde-berekening
    scoreFields: {
      crew: extractTankNumber(crew),
      speed: extractTankNumber(getInfoboxField(fields, ["Maximum speed", "Speed"])),
      armor: extractTankNumber(armor),
      mass: extractTankNumber(mass),
      length: extractTankNumber(getInfoboxField(fields, ["Length"])),
    }
  };
}

// ======================== GEVECHTSWAARDE SCORE ===============================
// Berekent een gevechtsscore op basis van beschikbare stats
function scoreBattleTank(tank) {
  const metrics = tank.scoreFields || {};
  const crew = metrics.crew;
  const speed = metrics.speed;
  const armor = metrics.armor;
  const mass = metrics.mass;
  const length = metrics.length;

  let score = 0;
  const notes = [];

  // Pantser: de belangrijkste defensieve stat, cap 300 mm
  if (armor !== null) {
    score += Math.min(armor, 300) * 3.0;
    notes.push(`${_t("armor")}: ${armor}`);
  }
  // Snelheid: relevant maar minder bepalend dan pantser
  if (speed !== null) {
    score += Math.min(speed, 100) * 1.5;
    notes.push(`${_t("speed")}: ${speed}`);
  }
  // Bemanning: kleinere bemanning = moderner / geautomatiseerder
  if (crew !== null) {
    const crewBonus = crew <= 3 ? 25 : crew <= 4 ? 18 : crew <= 5 ? 10 : 4;
    score += crewBonus;
    notes.push(`${_t("crew")}: ${crew}`);
  }

  return { score: Math.round(score), notes, crew, speed, armor, mass };
}

// ======================== RANGLIJST HTML =====================================
// Bouwt HTML voor de gerangschikte lijst (vergelijking / favorietenranking)
function buildRankingHtml(ranked) {
  const winner = ranked[0];
  const runnerUp = ranked[1];
  const summaryText = runnerUp
    ? tFormat("compareSummaryTwo", { winner: winner.title, runnerUp: runnerUp.title })
    : tFormat("compareSummaryOne", { winner: winner.title });

  const itemsHtml = ranked.map((tank, index) => {
    const rank = index + 1;
    const isWinner = index === 0;
    const stats = [];
    if (tank.armor !== null) stats.push(`<span class="compare-pill">Armor ${tank.armor}</span>`);
    if (tank.speed !== null) stats.push(`<span class="compare-pill">Speed ${tank.speed}</span>`);
    if (tank.crew !== null) stats.push(`<span class="compare-pill">Crew ${tank.crew}</span>`);
    if (tank.mass !== null) stats.push(`<span class="compare-pill">Mass ${tank.mass}</span>`);

    return `
      <div class="compare-item${isWinner ? " top-one" : ""}">
        <div class="compare-item-header">
          <div style="display:flex;gap:0.8rem;align-items:flex-start;">
            <span class="compare-rank">${rank}</span>
            <div>
              <h3 style="margin:0;">${tank.title}</h3>
              <p class="compare-note">${isWinner ? _t("compareWinner") : _t("compareCandidate")}</p>
            </div>
          </div>
          <div class="compare-score">Score ${tank.score}</div>
        </div>
        <div class="compare-note">${tank.notes.length ? tank.notes.join(" · ") : _t("compareNoStatsRank")}</div>
        <div class="compare-meta">${stats.join("")}</div>
      </div>
    `;
  }).join("");

  return `
    <h3 style="margin:1rem 0 0.35rem;">${_t("rankingTitle")}</h3>
    <p class="compare-note">${summaryText}</p>
    <div class="compare-list">${itemsHtml}</div>
  `;
}

// ======================== FAVORIETEN RANGLIJST ===============================
// Laadt Wikipedia-data voor alle favorieten en toont gerangschikte lijst
async function renderFavoriteRanking(favs) {
  const rankingContainer = document.getElementById("fav-ranking");
  if (!rankingContainer) return;

  if (favs.length < 2) {
    rankingContainer.innerHTML = `<p class="fav-empty">${_t("rankingEmpty")}</p>`;
    return;
  }

  rankingContainer.innerHTML = `<div class="loading-spinner">${_t("rankingLoading")}</div>`;

  const results = await Promise.all(favs.map(async fav => {
    try {
      const data = await fetchTankDetails(fav.key);
      return { ...data, ...scoreBattleTank(data) };
    } catch (_) {
      return null;
    }
  }));

  const ranked = results.filter(Boolean).sort((a, b) => b.score - a.score);
  if (ranked.length < 2) {
    rankingContainer.innerHTML = `<p>${_t("statsFailed")}</p>`;
    return;
  }

  rankingContainer.innerHTML = buildRankingHtml(ranked);
}

// ======================== FAVORIETEN (localStorage) ==========================
function getFavorites() {
  return JSON.parse(localStorage.getItem("tankpedia_favs") || "[]");
}

function saveFavorites(list) {
  localStorage.setItem("tankpedia_favs", JSON.stringify(list));
}

function isFavorite(key) {
  return getFavorites().some(f => f.key === key);
}

// Voegt toe of verwijdert een favoriet, werkt de weergave bij
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

// Toont alle favorieten + ranking in de favorieten-pagina
function renderFavorites() {
  const container = document.getElementById("fav-list");
  if (!container) return;
  const favs = getFavorites();
  if (favs.length === 0) {
    container.innerHTML = `<p class="fav-empty">${_t("favEmpty")}</p><div id="fav-ranking"></div>`;
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
  container.innerHTML = `<div id="fav-toolbar"><button id="compare-btn">${_t("compare")}</button></div>${cardsHtml}<div id="fav-ranking"></div>`;

  // Klik op favoriet → toon tankdetails
  container.querySelectorAll(".fav-card").forEach(card => {
    card.addEventListener("click", function(e) {
      if (e.target.closest(".fav-del-btn") || e.target.closest(".fav-cb")) return;
      const key = this.dataset.key;
      const f = favs.find(x => x.key === key);
      openTankDetails(key, f ? f.country : "");
    });
  });
  // Verwijderknop
  container.querySelectorAll(".fav-del-btn").forEach(btn => {
    btn.addEventListener("click", function(e) {
      e.stopPropagation();
      let favs = getFavorites().filter(f => f.key !== this.dataset.key);
      saveFavorites(favs);
      renderFavorites();
    });
  });
  // Vergelijkknop
  document.getElementById("compare-btn").addEventListener("click", compareSelectedFavorites);
  renderFavoriteRanking(favs);
}

// ======================== VERGELIJKING =======================================
// Vergelijk geselecteerde favorieten (aangevinkt of alle)
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

  const ranked = results
    .map(tank => ({ ...tank, ...scoreBattleTank(tank) }))
    .sort((a, b) => b.score - a.score);

  modalBody.innerHTML = `
    <div class="modal-top-bar"></div>
    <h2>${_t("compareTitle")}</h2>
    ${buildRankingHtml(ranked)}
  `;
}

// ======================== MODAL (overlay) ====================================
const modalOverlay = document.getElementById("modal-overlay");
const modalBody = document.getElementById("modal-body");
const modalClose = document.getElementById("modal-close");

modalClose.addEventListener("click", closeModal);
// Klik buiten modal inhoud → sluiten
modalOverlay.addEventListener("click", e => {
  if (e.target === modalOverlay) closeModal();
});
// Escape toets → sluiten
document.addEventListener("keydown", e => {
  if (e.key === "Escape") closeModal();
});

function closeModal() {
  modalOverlay.classList.remove("open");
  modalBody.innerHTML = "";
}

// ======================== WIKIPEDIA DATA OPHALEN =============================
// Haalt tankdetails op via Wikipedia REST API (page/html)
async function fetchTankDetails(title) {
  const pageTitle = title.replace(/ /g, "_");
  const htmlUrl = `https://en.wikipedia.org/api/rest_v1/page/html/${encodeURIComponent(pageTitle)}`;
  const res = await fetch(htmlUrl);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const html = await res.text();
  const doc = new DOMParser().parseFromString(html, "text/html");
  const infobox = doc.querySelector("table.infobox");
  if (!infobox) throw new Error("No infobox");

  // Eerste afbeelding uit infobox
  const img = infobox.querySelector("img");
  let image = null;
  if (img) {
    image = img.getAttribute("src");
    if (image && image.startsWith("//")) image = "https:" + image;
  }

  // Alle infobox-velden uitlezen (label → waarde)
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

  const display = buildTankDisplayData(fields);
  return {
    title: title.replace(/_/g, " "),
    image,
    display,
    scoreFields: display.scoreFields,
    infobox: fields,
  };
}

// Toont tankdetails in de modal
async function openTankDetails(title, country) {
  const flagH = flagHtmlLg(country) || "";
  const key = title;

  modalBody.innerHTML = `<div class="loading-spinner">${_t("loadingStats")} ${flagH}<strong>${title.replace(/_/g, " ")}</strong>...</div>`;
  modalOverlay.classList.add("open");

  try {
    const data = await fetchTankDetails(key);
    const display = data.display || {};
    const stats = [
      ["tankType", display.type],
      ["tankCrew", display.crew],
      ["tankEngine", display.engine],
      ["tankArmor", display.armor],
      ["tankMass", display.mass],
      ["tankSize", display.size],
      ["tankManufacturer", display.manufacturer],
      ["tankCannon", display.cannon],
      ["tankMachineguns", display.machineguns],
    ].filter(([, value]) => value);

    let statsHtml = stats.map(([labelKey, value]) => `
      <div class="stat-row">
        <span class="stat-label">${_t(labelKey)}</span>
        <span class="stat-value">${value}</span>
      </div>
    `).join("");

    if (!statsHtml) statsHtml = `<div class="stat-row"><span>${_t("noStats")}</span></div>`;

    const imageHtml = data.image
      ? `<div class="stats-image"><img src="${data.image}" alt="${data.title}" /></div>`
      : "";

    const bibiHtml = (country && country.toLowerCase().trim() === "israeli")
      ? `<div class="bibi-section">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Benjamin_Netanyahu_2018.jpg/240px-Benjamin_Netanyahu_2018.jpg"
               alt="Benjamin Netanyahu" class="bibi-photo" loading="lazy" />
          <p class="bibi-caption">🇮🇱 Prime Minister Benjamin Netanyahu approves this tank</p>
        </div>`
      : "";

    const stalinHtml = (country && country.toLowerCase().trim() === "soviet")
      ? `<div class="bibi-section">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Joseph_Stalin_official_portrait.jpg/240px-Joseph_Stalin_official_portrait.jpg"
               alt="Joseph Stalin" class="bibi-photo" loading="lazy" />
          <p class="bibi-caption">🇷🇺 Joseph Stalin approves this tank</p>
        </div>`
      : "";

    modalBody.innerHTML = `
      <h2>${flagH} ${data.title}</h2>
      ${imageHtml}
      <div class="stat-grid">${statsHtml}</div>
      ${bibiHtml}${stalinHtml}
      <div class="stats-footer">
        <a href="https://en.wikipedia.org/wiki/${encodeURIComponent(title)}" target="_blank" rel="noopener">${_t("openWiki")}</a>
      </div>
    `;

  } catch (error) {
    modalBody.innerHTML = `<p>${_t("statsFailed")}</p>`;
    console.error("Tank details error:", error);
  }
}

// ======================== LOKALE TANK DATABASE ===============================
let tanksDb = null;

// Laadt tank-database.json één keer en cacht deze in geheugen
async function getTanksDb() {
  if (tanksDb) return tanksDb;
  if (location.protocol === "file:") {
    throw new Error("Tank data needs a web server");
  }
  const res = await fetch("SCRIPTS/tank-database.json");
  tanksDb = (await res.json()).pages || [];
  return tanksDb;
}

// ======================== ZOEKFUNCTIE ========================================
async function loadTanks(q = "") {
  const box = document.getElementById("output");
  const trimmedQuery = q.trim();

  // Zet status- en resultaatcontainers klaar
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

    // Filter op titel of beschrijving (hoofdletterongevoelig)
    let pages = allTanks.filter(t =>
      t.title.toLowerCase().includes(qLower) ||
      (t.description && t.description.toLowerCase().includes(qLower))
    );

    // Sorteer: exacte match → begint met → alfabetisch
    pages.sort((a, b) => {
      const at = a.title.toLowerCase(), bt = b.title.toLowerCase();
      if (at === qLower) return -1;
      if (bt === qLower) return 1;
      if (at.startsWith(qLower) && !bt.startsWith(qLower)) return -1;
      if (!at.startsWith(qLower) && bt.startsWith(qLower)) return 1;
      return at.localeCompare(bt);
    });

    // Max 30 resultaten tonen
    pages = pages.slice(0, 30);

    if (pages.length === 0) {
      statusDiv.innerHTML = `<p>${_t("noResults")}</p>`;
      return;
    }

    const label = pages.length === 1 ? _t("result") : _t("results");
    statusDiv.innerHTML = `<p>${pages.length} ${label}${_t("found")}</p>`;

    // Genereer zoekkaarten
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

      // Bekijk stats knop
      card.querySelector(".details-button").addEventListener("click", e => {
        e.stopPropagation();
        openTankDetails(pageKey, cName);
      });
      // Fav ster klik
      card.querySelector(".fav-star").addEventListener("click", function(e) {
        e.stopPropagation();
        const key = this.dataset.title;
        const country = this.dataset.country;
        const result = toggleFavorite(title, key, country, description);
        this.classList.toggle("active", result === "added");
        this.textContent = result === "added" ? "\u2605" : "\u2606";
      });
      // Klik op hele kaart → details
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

// ======================== INITIALISATIE ======================================
// Zoekbalk event listeners
const searchInput = document.getElementById("search");
const searchButton = document.getElementById("search-button");

if (searchInput && searchButton) {
  const triggerSearch = () => loadTanks(searchInput.value);
  searchButton.addEventListener("click", triggerSearch);
  searchInput.addEventListener("keydown", e => {
    if (e.key === "Enter") { e.preventDefault(); triggerSearch(); }
  });
}

// ======================== TAB-NAVIGATIE ======================================
function switchTab(tab) {
  document.getElementById("nav-search").classList.toggle("active", tab === "search");
  document.getElementById("nav-fav").classList.toggle("active", tab === "fav");
  document.getElementById("page-search").classList.toggle("active", tab === "search");
  document.getElementById("page-fav").classList.toggle("active", tab === "fav");
  if (tab === "fav") renderFavorites();
}

document.getElementById("nav-search").addEventListener("click", () => switchTab("search"));
document.getElementById("nav-fav").addEventListener("click", () => switchTab("fav"));
document.getElementById("lang-btn").addEventListener("click", toggleLang);

// Start op zoek-tab, tenzij ?view=fav in URL staat
const startView = new URLSearchParams(location.search).get("view");
switchTab(startView === "fav" ? "fav" : "search");

// Service worker registreren (alleen via HTTP, niet file://)
if (location.protocol !== "file:" && "serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js");
}
