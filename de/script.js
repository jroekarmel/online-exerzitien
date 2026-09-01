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
  "../de/data/exerzitien-katalog.json";

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
    return `./exerzitien-archiv/${retreat.slug}.html`;
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
            Mehr zu den Exerzitien
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

//list of saints
document.addEventListener("DOMContentLoaded", async () => {
  const container = document.querySelector("#saints-cards .saints-grid");
  if (!container) return;

const catalogPath =
  container.dataset.catalog ||
  "../de/data/exerzitien-katalog.json";
 
const saintsPath =
  container.dataset.saints ||
  "../de/data/heiliger-info.json";

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

        const getLocalizedField = (field, lang = "de") => {
    if (!field) return "";
    if (typeof field === "string") return field;
    return field?.[lang] || "";
  };

const renderCard = (saint) => {
    const imageSaint = `${saint.image}`;

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
          <a href="${escapeHtml(saint.link || "#")}" target="_blank" rel="noopener noreferrer">
            Mehr zum Heiligen
          </a>
        </div>
      </article>
    `;
};

  try {
    const [catalogResponse, infoResponse] = await Promise.all([
      fetch(catalogPath),
      fetch(saintsPath)
    ]);

    if (!catalogResponse.ok || !infoResponse.ok) {
      throw new Error("Eine oder mehrere JSON-Dateien konnten nicht geladen werden.");
    }

    const [catalogData, infoData] = await Promise.all([
      catalogResponse.json(),
      infoResponse.json()
    ]);

    const retreats = Array.isArray(catalogData.retreats) ? catalogData.retreats : [];
    const saintsInfo = Array.isArray(infoData) ? infoData : [];

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
            bio: saintInfo.bio_de || "",
            link: saintInfo.link || "#",
            image: saintInfo.image || "",
          }
        ];
      })
  ).values()
];

    if (uniqueSaints.length === 0) {
      container.innerHTML = `<p>Derzeit sind keine Heiligen verfügbar.</p>`;
      return;
    }

    container.innerHTML = uniqueSaints.map(renderCard).join("");
    document.dispatchEvent(
  new CustomEvent("saintsRendered", {
    detail: {
      count: uniqueSaints.length
    }
  })
);
  } catch (error) {
    console.error(error);
    container.innerHTML = `<p>Die Archivdaten konnten derzeit nicht geladen werden.</p>`;
  }
});

// Saints carousel: previous, pause/play, next
document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector("#saints-grid");
  const previousButton = document.querySelector(".saints-prev");
  const nextButton = document.querySelector(".saints-next");
  const toggleButton = document.querySelector(".saints-toggle");
  const toggleIcon = document.querySelector(".saints-toggle-icon");

  if (!grid || !previousButton || !nextButton || !toggleButton) return;

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  let currentIndex = 0;
  let autoRotate = null;
  let isPaused = prefersReducedMotion;
  let carouselReady = false;

  function getSlides() {
    return [...grid.querySelectorAll(".saint-card")];
  }

  function getTotalSlides() {
    return getSlides().length;
  }

  function updateButtons() {
    const hasMoreThanOneSlide = getTotalSlides() > 1;

    previousButton.disabled = !hasMoreThanOneSlide;
    nextButton.disabled = !hasMoreThanOneSlide;
    toggleButton.disabled = !hasMoreThanOneSlide;

    previousButton.setAttribute(
      "aria-label",
      "Vorherigen Heiligen anzeigen"
    );

    nextButton.setAttribute(
      "aria-label",
      "Nächsten Heiligen anzeigen"
    );
  }

  function goToSlide(index, behavior = "smooth") {
    const slides = getSlides();
    const totalSlides = slides.length;

    if (totalSlides === 0) return;

    currentIndex = (index + totalSlides) % totalSlides;

    /*
      This is more reliable than:
      currentIndex * grid.clientWidth

      It scrolls precisely to the actual card position, even if your cards
      have a gap, responsive width, padding, or scroll-snap styling.
    */
    grid.scrollTo({
      left: slides[currentIndex].offsetLeft,
      behavior
    });
  }

  function startRotation() {
    if (
      autoRotate ||
      isPaused ||
      !carouselReady ||
      getTotalSlides() < 2
    ) {
      return;
    }

    autoRotate = window.setInterval(() => {
      goToSlide(currentIndex + 1);
    }, 4000);

    toggleButton.setAttribute("aria-label", "Karussell pausieren");
    toggleButton.setAttribute("aria-pressed", "false");

    if (toggleIcon) {
      toggleIcon.textContent = "❚❚";
    }
  }

  function stopRotation() {
    window.clearInterval(autoRotate);
    autoRotate = null;

    toggleButton.setAttribute("aria-label", "Karussell abspielen");
    toggleButton.setAttribute("aria-pressed", "true");

    if (toggleIcon) {
      toggleIcon.textContent = "▶";
    }
  }

  previousButton.addEventListener("click", () => {
    goToSlide(currentIndex - 1);
  });

  nextButton.addEventListener("click", () => {
    goToSlide(currentIndex + 1);
  });

  toggleButton.addEventListener("click", () => {
    if (autoRotate) {
      isPaused = true;
      stopRotation();
    } else {
      isPaused = false;
      startRotation();
    }
  });

  grid.addEventListener("scroll", () => {
    const slides = getSlides();

    if (slides.length === 0) return;

    let nearestIndex = 0;
    let nearestDistance = Infinity;

    slides.forEach((slide, index) => {
      const distance = Math.abs(slide.offsetLeft - grid.scrollLeft);

      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = index;
      }
    });

    currentIndex = nearestIndex;
  });

  grid.addEventListener("mouseenter", () => {
    if (autoRotate) {
      isPaused = true;
      stopRotation();
    }
  });

  grid.addEventListener("focusin", () => {
    if (autoRotate) {
      isPaused = true;
      stopRotation();
    }
  });

  /*
    At initial page load there are no cards yet because fetch() is still
    loading the JSON. Disable controls until the saints-rendering script
    announces that it has inserted the cards.
  */
  updateButtons();

  document.addEventListener(
    "saintsRendered",
    () => {
      carouselReady = true;
      currentIndex = 0;

      updateButtons();
      goToSlide(0, "auto");

      if (!prefersReducedMotion) {
        startRotation();
      } else {
        stopRotation();
      }
    },
    { once: true }
  );
});
// hiding and showing Sonstiges field:
document.addEventListener("DOMContentLoaded", function () {
    const select = document.getElementById("mce-AUFMERKS01");
    const sonstigesField = document.getElementById("sonstiges-field");
    const sonstigesInput = document.getElementById("mce-AUFMERKS02");

    function updateSonstigesField() {
        const isSonstiges =
            select.value === "Sonstiges";
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