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
    const videoEmbedUrl = getYouTubeEmbedUrl(item.video_url);
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

        
        ${videoEmbedUrl ? `
          <div class="card-video">
            <iframe
              src="${videoEmbedUrl}"
              title="YouTube video player"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowfullscreen
            ></iframe>
          </div>
        ` : ''}
      </article>
        `;
    });
    weeksGrid.innerHTML = titleText;
}
// Helper: convert normal YouTube URL to embed URL
  function getYouTubeEmbedUrl(url){
    if (!url) return null;

    // Already an embed URL
    if (url.includes('youtube.com/embed/')) {
      return url;
    }

    // youtu.be/VIDEO_ID
    const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
    if (shortMatch) {
      return `https://www.youtube.com/embed/${shortMatch[1]}`;
    }

    // youtube.com/watch?v=VIDEO_ID
    const longMatch = url.match(/[?&]v=([a-zA-Z0-9_-]+)/);
    if (longMatch) {
      return `https://www.youtube.com/embed/${longMatch[1]}`;
    }

    return null;
  }

loadData()
    .then(displayWeeks)