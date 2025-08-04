document.addEventListener("popupsLoaded", () => {
  const container = document.getElementById("animal-images-popup-container");
  const listEl = document.getElementById("images-list");
  if (!container) return;
  const closeBtn = container.querySelector(".close-button");
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      container.style.display = "none";
    });
  }

  window.openImagesPopup = function (urls = []) {
    listEl.innerHTML = "";
    if (!Array.isArray(urls) || urls.length === 0) {
      listEl.textContent = "No images.";
    } else {
      urls.forEach((u) => {
        const img = document.createElement("img");
        img.src = u;
        img.className = "file-thumb";
        img.addEventListener("click", () => window.open(u, "_blank"));
        listEl.appendChild(img);
      });
    }
    container.style.display = "flex";
  };
});