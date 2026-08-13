let data;
const weeksGrid = document.querySelector('#weeks-grid');
let titleText;

async function loadData() {
  const jsonPath = weeksGrid.dataset.json;
  const response = await fetch(jsonPath);

  if (!response.ok) {
    throw new Error(
      `Die JSON-Datei konnte nicht geladen werden: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
}

function displayWeeks(data){
  const weeks = data.weeks;
    titleText ='';
    weeks.forEach(item => {
    
        titleText += `
        <article class="archive-card">
        <div class="image-zoom">
          <img
            src="${item.bild_url}"
            loading="lazy"
          >
        </div>

        <h3>${item.title}</h3>

        <p class="archive-theme">
          ${item.kurz_text}
        </p>
        <div class="card-links">
          <a href="${item.mail_link}" target="_blank" rel="noopener noreferrer">
            Materialien dieses Impulses
          </a>
        </div>
      </article>
        `;
    });
    weeksGrid.innerHTML = titleText;
}
loadData()
    .then(displayWeeks)