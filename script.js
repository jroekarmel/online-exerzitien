// syncing Rundbriefe boxes
document.addEventListener("DOMContentLoaded", () => {
  const pairs = [
    { key: "oesterreich", card: "#oesterreich .card-option-input", formId: "mce-group[16777]-16777-0" },
    { key: "wien", card: "#wien .card-option-input", formId: "mce-group[16777]-16777-1" },
    { key: "linz", card: "#linz .card-option-input", formId: "mce-group[16777]-16777-2" },
    { key: "graz", card: "#graz .card-option-input", formId: "mce-group[16777]-16777-3" },
    { key: "online", card: "#online .card-option-input", formId: "mce-group[16777]-16777-4" },
    { key: "edith-stein", card: "#edith-stein .card-option-input", formId: "mce-group[16777]-16777-5" },
    { key: "friedensgebet", card: "#friedensgebet .card-option-input", formId: "mce-group[16777]-16777-6" },
    { key: "exerzitien", card: "#exerzitien .card-option-input", formId: "mce-group[16777]-16777-7" },
    { key: "skapuliernovene", card: "#skapuliernovene .card-option-input", formId: "mce-group[16777]-16777-8" },
    { key: "schritte33", card: "#schritte33 .card-option-input", formId: "mce-group[16777]-16777-9" },
    { key: "jesusgebet", card: "#jesusgebet .card-option-input", formId: "mce-group[16777]-16777-10" }
  ];

  const items = {};

  pairs.forEach(({ key, card, formId }) => {
    const cardCheckbox = document.querySelector(card);
    const formCheckbox = document.getElementById(formId);

    if (!cardCheckbox || !formCheckbox) return;

    items[key] = {
      cardCheckbox,
      formCheckbox,
      featureCard: cardCheckbox.closest(".feature-card")
    };
  });

  const setChecked = (key, checked) => {
    const item = items[key];
    if (!item) return;

    item.cardCheckbox.checked = checked;
    item.formCheckbox.checked = checked;

    if (item.featureCard) {
      item.featureCard.classList.toggle("is-selected", checked);
    }
  };

  const syncVisualState = (key) => {
    const item = items[key];
    if (!item) return;

    const checked = item.formCheckbox.checked;
    item.cardCheckbox.checked = checked;

    if (item.featureCard) {
      item.featureCard.classList.toggle("is-selected", checked);
    }
  };

  const regionalKeys = ["wien", "linz", "graz", "online"];

const applyExclusiveRules = (changedKey, checked) => {
  if (changedKey === "oesterreich") {
    regionalKeys.forEach((key) => setChecked(key, checked));
    return;
  }

  if (regionalKeys.includes(changedKey)) {
    setChecked("oesterreich", false);
  }
};

  Object.keys(items).forEach((key) => {
    syncVisualState(key);

    items[key].cardCheckbox.addEventListener("change", () => {
      const checked = items[key].cardCheckbox.checked;
      setChecked(key, checked);
      applyExclusiveRules(key, checked);
    });

    items[key].formCheckbox.addEventListener("change", () => {
      const checked = items[key].formCheckbox.checked;
      setChecked(key, checked);
      applyExclusiveRules(key, checked);
    });
  });
});
//setupToggle('mailchimp-toggle', 'mailchimp-form-wrap', 'Anmeldung schließen', 'Anmeldung / Mailchimp');
//setupToggle('beschreibung-toggle', 'beschreibung-wrap', 'Beschreibung schließen', 'Beschreibung');
//setupToggle('datenschutz-toggle', 'datenschutz-wrap', 'Datenschutz schließen', 'Datenschutz');
//setupToggle('impressum-toggle', 'impressum-wrap', 'Impressum schließen', 'Impressum');

// Exerzitien-Archiv-Rendering
document.addEventListener("DOMContentLoaded", async () => {
  const container = document.querySelector("#archiv-cards .archive-grid");
  if (!container) return;

  const seasonLabels = {
    lent: "Fastenzeit",
    advent: "Advent"
  };

  const escapeHtml = (value = "") =>
    String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");

  const getLocalizedField = (field, lang = "de") => {
    if (!field) return "";
    if (typeof field === "string") return field;
    return field?.[lang] || "";
  };

  const getRetreatLink = (retreat) => {
    if (!retreat?.slug) return "#";
    return `/${retreat.slug}/${retreat.slug}.html`;
  };

  const renderCard = (retreat, accented = false) => {
    if (!retreat) return "";

    const season = seasonLabels[retreat.art] || retreat.art || "";
    const year = retreat.year || "";
    const title = getLocalizedField(retreat.titel);
    const thema = getLocalizedField(retreat.thema);
    const summary = getLocalizedField(retreat.zusammenfassung);
    const image = getLocalizedField(retreat.header_img);
    const link = getRetreatLink(retreat);
        // Advent cards accented, Lent normal
       const articleClass =
      retreat.art === "advent"
        ? "archive-card archive-card--accent"
        : "archive-card";

    return `
      <article class="${articleClass}">
        <div class="image-zoom">
          <img
            src="${escapeHtml(image)}"
            alt="${escapeHtml(title || thema || season)}"
            loading="lazy"
          >
        </div>

        <div class="archive-meta">
          <span class="archive-season">${escapeHtml(season)}</span>
          <span class="archive-year">${escapeHtml(year)}</span>
        </div>

        <h3>${escapeHtml(title)}</h3>

        <p class="archive-theme">
          ${escapeHtml(thema)}
        </p>

        <p class="archive-note">
          ${escapeHtml(summary)}
        </p>

        <div class="card-links">
          <a href="${escapeHtml(link)}" target="_blank" rel="noopener noreferrer">
            Mehr zu den Exerzitien
          </a>
        </div>
      </article>
    `;
  };

  try {
    const response = await fetch("data/exerzitien-katalog.json");
    if (!response.ok) {
      throw new Error("JSON konnte nicht geladen werden.");
    }

    const data = await response.json();
    const retreats = Array.isArray(data.retreats) ? data.retreats : [];

    const archiveRetreats = retreats
      .filter(retreat => retreat?.art === "lent" || retreat?.art === "advent")
      .sort((a, b) => {
        const dateA = a.start_datum || `${a.year || 0}-01-01`;
        const dateB = b.start_datum || `${b.year || 0}-01-01`;
        return new Date(dateB) - new Date(dateA);
      });

    if (archiveRetreats.length === 0) {
      container.innerHTML = `<p>Derzeit sind keine Archivdaten verfügbar.</p>`;
      return;
    }

    container.innerHTML = archiveRetreats.map(renderCard).join("");
  } catch (error) {
    console.error(error);
    container.innerHTML = `<p>Die Archivdaten konnten derzeit nicht geladen werden.</p>`;
  }
});

//list of saints
document.addEventListener("DOMContentLoaded", async () => {
  const container = document.querySelector("#saints-cards .saints-grid");
  if (!container) return;
    const escapeHtml = (value = "") =>
    String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");

        const slugifySaint = (name = "") =>
    String(name)
      .toLowerCase()
      .replace(/^heiliger\s+/i, "")
      .replace(/^heilige\s+/i, "")
      .replaceAll("ä", "ae")
      .replaceAll("ö", "oe")
      .replaceAll("ü", "ue")
      .replaceAll("ß", "ss")
      .replaceAll(" ", "_");

        const getLocalizedField = (field, lang = "de") => {
    if (!field) return "";
    if (typeof field === "string") return field;
    return field?.[lang] || "";
  };

const renderCard = (saint) => {
    const imageSaint = `img/${saint.slug}.jpg`;

return `
      <article class="saint-card saint-card-featured">
        <div class="image-zoom">
          <img
            src="${escapeHtml(imageSaint)}"
            alt="${escapeHtml(saint.name)}"
            loading="lazy"
          >
        </div>
        <h3>${escapeHtml(saint.name)}</h3>

        <p class="saint-bio">
          ${escapeHtml(saint.bio)}
        </p>

        <div class="card-links">
          <a href="" target="_blank" rel="noopener noreferrer">
            Mehr zur Heiliger
          </a>
        </div>
      </article>
    `;
};

   try {
    const response = await fetch("data/exerzitien-katalog.json");
    if (!response.ok) {
      throw new Error("JSON konnte nicht geladen werden.");
    }

    const data = await response.json();
    const retreats = Array.isArray(data.retreats) ? data.retreats : [];
       const saints = retreats
      .map((retreat) => retreat.heiliger)
      .filter(Boolean);

    const uniqueSaints = [...new Set(saints)].map((name) => ({
      name,
      slug: slugifySaint(name)
    }));

    if (uniqueSaints.length === 0) {
      container.innerHTML = `<p>Derzeit sind keine Heiligen verfügbar.</p>`;
      return;
    }

    container.innerHTML = uniqueSaints.map(renderCard).join("");
  } catch (error) {
    console.error(error);
    container.innerHTML = `<p>Die Archivdaten konnten derzeit nicht geladen werden.</p>`;
  }
});