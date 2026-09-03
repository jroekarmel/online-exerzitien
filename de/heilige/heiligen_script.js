document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(
    "#archiv-cards .archive-grid_filtered"
  );

  if (!container) return;

  const DATA_URL = "/de/data/exerzitien-katalog.json";

  const seasonLabels = {
    lent: "Fastenzeit",
    advent: "Advent"
  };

  const normalize = (value = "") =>
    String(value)
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "");

  const escapeHtml = (value = "") =>
    String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");

  const getLocalizedField = (field, language = "de") => {
    if (!field) return "";

    if (typeof field === "string") {
      return field;
    }

    return field[language] || "";
  };

  // 1. Daten laden
  async function loadData() {
    const response = await fetch(DATA_URL);

    if (!response.ok) {
      throw new Error(
        `JSON konnte nicht geladen werden: ${response.status}`
      );
    }

    const data = await response.json();

    return Array.isArray(data.retreats)
      ? data.retreats
      : [];
  }

  // 2. Daten filtern
  function filterData(retreats) {
    const filterKey = normalize(
      container.id.replace(/^br_/, "")
    );

    return retreats
      .filter((retreat) => {
        const isArchive =
          retreat?.art === "lent" ||
          retreat?.art === "advent";

        const saintKey = normalize(retreat?.heiliger);

        return isArchive && saintKey === filterKey;
      })
      .sort((a, b) => {
        const dateA =
          a.start_datum || `${a.year || 0}-01-01`;

        const dateB =
          b.start_datum || `${b.year || 0}-01-01`;

        return new Date(dateB) - new Date(dateA);
      });
  }

  // 3. Eine Karte erzeugen
  function createCard(retreat) {
    const title = getLocalizedField(retreat.titel).trim();

    if (!title) return "";

    const season =
      seasonLabels[retreat.art] || retreat.art || "";

    const year = retreat.year || "";
    const thema = getLocalizedField(retreat.thema);
    const summary = getLocalizedField(
      retreat.zusammenfassung
    );
    const image = getLocalizedField(retreat.header_img);

    const imagePath = `../${image}`;
    const link = retreat.slug
      ? `../exerzitien-archiv/${retreat.slug}.html`
      : "#";

    const cardClass =
      retreat.art === "advent"
        ? "archive-card archive-card--accent"
        : "archive-card";

    return `
      <article class="${cardClass}">
        <div class="image-zoom">
          <img
            src="${escapeHtml(imagePath)}"
            alt="${escapeHtml(title || thema || season)}"
            loading="lazy"
          >
        </div>

        <div class="archive-meta">
          <span class="archive-season">
            ${escapeHtml(season)}
          </span>

          <span class="archive-year">
            ${escapeHtml(year)}
          </span>
        </div>

        <h3>${escapeHtml(title)}</h3>

        <p class="archive-theme">
          ${escapeHtml(thema)}
        </p>

        <p class="archive-note">
          ${escapeHtml(summary)}
        </p>

        <div class="card-links">
          <a
            href="${escapeHtml(link)}"
            target="_blank"
            rel="noopener noreferrer"
          >
            Mehr zu den Exerzitien
          </a>
        </div>
      </article>
    `;
  }

  // 3. Gefilterte Daten anzeigen
  function displayData(retreats) {
    if (retreats.length === 0) {
      container.innerHTML =
        "<p>Für diesen Heiligen wurden keine Exerzitien gefunden.</p>";
      return;
    }

    container.innerHTML = retreats
      .map(createCard)
      .join("");
  }

  // Ablauf: laden → filtern → anzeigen
  async function initArchive() {
    try {
      const retreats = await loadData();
      const filteredRetreats = filterData(retreats);

      displayData(filteredRetreats);
    } catch (error) {
      console.error("Archivfehler:", error);

      container.innerHTML =
        "<p>Die Archivdaten konnten derzeit nicht geladen werden.</p>";
    }
  }

  initArchive();
});