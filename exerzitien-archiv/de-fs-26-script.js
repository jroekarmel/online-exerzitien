let fs26Data;
const weeksGrid = document.querySelector('#weeks-grid');
let titleText;

async function loadData(){
let resp = await fetch('../data/exerzitien/2026_fs/2026_fs_de-inhalt.json');
    fs26Data = await resp.json();
}

function displayWeeks(){
  const weeks = fs26Data.weeks;
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
      </article>
        `;
    });
    weeksGrid.innerHTML = titleText;
}
loadData()
    .then(displayWeeks)