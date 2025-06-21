import defaultAvatar from "../../../assets/images/icons/defaultAvatar.png";

window.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const reptileId = params.get("reptileId");
  const reptileName = params.get("reptileDescription") || "";

  const imgEl = document.getElementById("animal-image");

  async function loadImage() {
    let url = null;
    if (reptileId) {
      try {
        const res = await fetch("/api/reptiles");
        if (!res.ok) throw new Error(`Fetch error: ${res.status}`);
        const reptiles = await res.json();
        const match = reptiles.find((r) => String(r.id) === reptileId);
        if (
          match &&
          Array.isArray(match.image_urls) &&
          match.image_urls.length > 0
        ) {
          url = `${window.location.origin}${match.image_urls[0]}`;
        }
      } catch (err) {
        console.error("Error loading reptile image:", err);
      }
    }

    imgEl.src = url || defaultAvatar;
    imgEl.alt = reptileName || (url ? "Adopted Reptile" : "Default Avatar");
  }

  loadImage();

  document.getElementById("home-button")?.addEventListener("click", () => {
    window.location.href = "index.html";
  });
});