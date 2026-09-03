// lanugage support
const languages = {
  fr: "Français",
  de: "Deutsch",
  es: "Español",
  it: "Italiano",
  en: "English",
  pl: "Polski",
  ar: "العربية",
  pt: "Português",
  zh: "中文",
  cs: "Čeština",
  hr: "Hrvatski",
  hu: "Magyar",
  mt: "Malti",
  nl: "Nederlands",
  ro: "Română",
  vi: "Tiếng Việt"
};

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

    console.log({
        key,
        card,
        cardCheckbox,
        formId,
        formCheckbox
    });

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
const constDatenschutzToggle = document.querySelector("#datenschutz-toggle");
const constDatenschutzInhalt = document.querySelector("#datenschutz-wrap")

constDatenschutzToggle.addEventListener("click", (DatenSchutzevent) => {
  DatenSchutzevent.preventDefault();

  const DatenSchutzisOpen = !constDatenschutzInhalt.hidden

  constDatenschutzInhalt.hidden = DatenSchutzisOpen;
  toggle.setAttribute("aria-expanded", String(!DatenSchutzisOpen));
});
//setupToggle('impressum-toggle', 'impressum-wrap', 'Impressum schließen', 'Impressum');

// Exerzitien-Archiv-Rendering
document.addEventListener("DOMContentLoaded", async () => {
  const container = document.querySelector("#archiv-cards .archive-grid");
  if (!container) return;

  const catalogPath =
  container.dataset.json ||
  "../data/exerzitien-katalog.json";

  const seasonLabels = {
    lent: "Lent",
    advent: "Advent"
  };

  const escapeHtml = (value = "") =>
    String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");

  const getLocalizedField = (field, lang = "en") => {
    if (!field) return "";
    if (typeof field === "string") return field;
    return field?.[lang] || "";
  };

  const getRetreatLink = (retreat) => {
    if (!retreat?.slug) return "#";
    return `./retreat_archive/${retreat.slug}.html`;
  };

  const renderCard = (retreat, accented = false) => {
    if (!retreat) return "";
      const localtitle = getLocalizedField(retreat.titel).trim();
  if (!localtitle) return "";

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
            Access the materials
          </a>
        </div>
      </article>
    `;
  };


  
  try {

 const response = await fetch(catalogPath);
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

<<<<<<< HEAD
// list of saints – horizontal scroll with prev/next buttons
document.addEventListener("DOMContentLoaded", async () => {
  const grid = document.getElementById("saints-grid");
  const prevBtn = document.querySelector(".saints-prev");
  const nextBtn = document.querySelector(".saints-next");

  if (!grid || !prevBtn || !nextBtn) return;

  const catalogPath =
    grid.dataset.catalog ||
    "../data/exerzitien-katalog.json";

  const saintsPath =
    grid.dataset.saints ||
    "./saint-info_en.json";
=======
// list of saints (debug + simple fallback)
document.addEventListener("DOMContentLoaded", async () => {

  const container = document.querySelector("#saints-carousel-inner");
  if (!container) return;

  const catalogPath =
    container.dataset.catalog ||
    "../data/exerzitien-katalog.json";

  const saintsPath =
    container.dataset.saints ||
    "./saint-info_en.json";

>>>>>>> a71d6ac7172ec0200a8f1b7a5cceec0692f6abc0

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
      .replaceAll("á", "a")
      .replaceAll("à", "a")
      .replaceAll("â", "a")
      .replaceAll("ä", "ae")
      .replaceAll("é", "e")
      .replaceAll("è", "e")
      .replaceAll("ê", "e")
      .replaceAll("ë", "e")
      .replaceAll("í", "i")
      .replaceAll("ï", "i")
      .replaceAll("ó", "o")
      .replaceAll("ö", "oe")
      .replaceAll("ú", "u")
      .replaceAll("ü", "ue")
      .replaceAll("ß", "ss")
      .replace(/[()]/g, "")
      .replace(/[.,]/g, "")
      .replace(/[-]/g, "")
      .replace(/\s+/g, "_");

<<<<<<< HEAD
  const renderCard = (saint) => {
    const imageSaint = saint.image || "";

    return `
      <article class="saint-card saint-card-featured">
        <div class="image-zoom-saint">
          <img
            src="${escapeHtml(imageSaint)}"
            alt="${escapeHtml(saint.name)}"
            class="saint-image"
            loading="lazy"
          >
        </div>
        <h3>${escapeHtml(saint.name)}</h3>

        <p class="saint-bio">
          ${escapeHtml(saint.bio)}
        </p>

        <div class="card-links">
=======
  const renderCard = (saint, index = 0) => {
    const imageSaint = saint.image || "";
    const activeClass = index === 0 ? " active" : "";

    return `
      <div class="carousel-item${activeClass}">
        <img src="${escapeHtml(imageSaint)}" class="d-block w-100" alt="${escapeHtml(saint.name)}">
        <div class="carousel-caption d-none d-md-block">
          <h5>${escapeHtml(saint.name)}</h5>
          <p>${escapeHtml(saint.bio || "")}</p>
>>>>>>> a71d6ac7172ec0200a8f1b7a5cceec0692f6abc0
          <a href="${escapeHtml(saint.link || "#")}" target="_blank" rel="noopener noreferrer">
            Find out more
          </a>
        </div>
      </div>
    `;
  };

  try {
    const [catalogResponse, infoResponse] = await Promise.all([
      fetch(catalogPath),
      fetch(saintsPath),
    ]);

    console.log("catalogResponse.ok", catalogResponse.ok, catalogResponse.status);
    console.log("infoResponse.ok", infoResponse.ok, infoResponse.status);

    if (!catalogResponse.ok || !infoResponse.ok) {
      throw new Error("Eine oder mehrere JSON-Dateien konnten nicht geladen werden.");
    }

    const [catalogData, infoData] = await Promise.all([
      catalogResponse.json(),
      infoResponse.json(),
    ]);

    console.log("catalogData", catalogData);
    console.log("infoData", infoData);

    const retreats = Array.isArray(catalogData.retreats) ? catalogData.retreats : [];
    const saintsInfo = Array.isArray(infoData) ? infoData : [];

    console.log("retreats count", retreats.length);
    console.log("saintsInfo count", saintsInfo.length);

    const saintsBySlug = Object.fromEntries(
      saintsInfo.map((saint) => [saint.slug, saint])
    );

    const uniqueSaints = [
      ...new Map(
        retreats
          .filter((retreat) => retreat.heiliger)
          .map((retreat) => {
            const name = retreat.heiliger;
            const slug = slugifySaint(name);
            const saintInfo = saintsBySlug[slug] || {};

            return [
              slug,
              {
                slug,
                name: saintInfo.name || name,
                bio: saintInfo.bio_en || saintInfo.bio || "",
                link: saintInfo.link || "#",
                image: saintInfo.image || "",
              },
            ];
          })
      ).values(),
    ];

<<<<<<< HEAD
    if (uniqueSaints.length === 0) {
      grid.innerHTML = `<p>Derzeit sind keine Heiligen verfügbar.</p>`;
      prevBtn.disabled = true;
      nextBtn.disabled = true;
      return;
    }

    grid.innerHTML = uniqueSaints.map(renderCard).join("");

    // Scroll behavior: 4 cards on desktop, 1 on mobile
    const getScrollAmount = () => {
      const card = grid.querySelector(".saint-card");
      if (!card) return 0;
      const cardWidth = card.getBoundingClientRect().width;
      const gap = 16; // approx 1rem

      if (window.innerWidth >= 992) {
        return (cardWidth + gap) * 4;
      }
      return cardWidth + gap;
    };


const isScrolledToEnd = () => {
  // Allow 1px tolerance for rounding errors
  return grid.scrollLeft + grid.clientWidth >= grid.scrollWidth - 1;
};

const isScrolledToStart = () => {
  return grid.scrollLeft <= 0;
};

prevBtn.addEventListener("click", () => {
  const amount = getScrollAmount();

  if (isScrolledToStart()) {
    // Wrap to end
    grid.scrollTo({ left: grid.scrollWidth, behavior: "smooth" });
  } else {
    grid.scrollBy({ left: -amount, behavior: "smooth" });
  }
});

nextBtn.addEventListener("click", () => {
  const amount = getScrollAmount();

  if (isScrolledToEnd()) {
    // Wrap to start
    grid.scrollTo({ left: 0, behavior: "smooth" });
  } else {
    grid.scrollBy({ left: amount, behavior: "smooth" });
  }
});
  } catch (error) {
    console.error("Saints script error", error);
    grid.innerHTML = `<p>Die Archivdaten konnten derzeit nicht geladen werden.</p>`;
=======
    console.log("uniqueSaints length", uniqueSaints.length);
    console.log("uniqueSaints", uniqueSaints);

    // If no saints from catalog, fall back to showing all saints from saint-info_en.json
    if (uniqueSaints.length === 0 && saintsInfo.length > 0) {
      console.log("No matched saints; using fallback to all saints from saint-info_en.json");
      container.innerHTML = saintsInfo
        .map((saint, i) =>
          renderCard(
            {
              name: saint.name || "Saint",
              bio: saint.bio_en || saint.bio || "",
              link: saint.link || "#",
              image: saint.image || "",
            },
            i
          )
        )
        .join("");

      const slides = container.querySelectorAll(".carousel-item");
      console.log("fallback slides count", slides.length);
      return;
    }

    if (uniqueSaints.length === 0) {
      container.innerHTML = `<p>Derzeit sind keine Heiligen verfügbar.</p>`;
      console.warn("No saints to display.");
      return;
    }

    container.innerHTML = uniqueSaints
      .map((saint, i) => renderCard(saint, i))
      .join("");

    const slides = container.querySelectorAll(".carousel-item");
    console.log("final slides count", slides.length);
  } catch (error) {
    console.error("Saints script error", error);
    container.innerHTML = `<p>Die Archivdaten konnten derzeit nicht geladen werden.</p>`;
>>>>>>> a71d6ac7172ec0200a8f1b7a5cceec0692f6abc0
  }
});
// hiding and showing Sonstiges field:
document.addEventListener("DOMContentLoaded", function () {
    const select = document.getElementById("mce-AUFMERKS01");
    const sonstigesField = document.getElementById("sonstiges-field");
    const sonstigesInput = document.getElementById("mce-AUFMERKS02");

      // If any of these are missing, skip this logic entirely
  if (!select || !sonstigesField || !sonstigesInput) {
    return;
  }
    function updateSonstigesField() {
        const isSonstiges =
            select.value === "Other (please specify)";
        console.log({
    select: document.getElementById("mce-AUFMERKS01"),
    field: document.getElementById("sonstiges-field"),
    input: document.getElementById("mce-AUFMERKS02")
});

        sonstigesField.style.display = isSonstiges ? 'contents': 'none';
        sonstigesInput.disabled = !isSonstiges;

        if (!isSonstiges) {
            sonstigesInput.value = "";
        }
    }

    select.addEventListener("change", updateSonstigesField);

    // Zustand auch beim Laden der Seite korrekt setzen
    updateSonstigesField();
});
