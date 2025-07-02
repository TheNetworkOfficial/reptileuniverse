document.addEventListener("popupsLoaded", () => {
  const container = document.getElementById("animal-files-popup-container");
  const listEl = document.getElementById("files-list");
  const form = document.getElementById("files-form");
  const input = document.getElementById("files-input");
  if (!container) return;

  async function loadList(id) {
    listEl.innerHTML = "Loading...";
    try {
      const res = await fetch(`/api/animal-files/${id}`);
      const files = res.ok ? await res.json() : [];
      if (!files.length) {
        listEl.textContent = "No files.";
        return;
      }
      listEl.innerHTML = "";
      files.forEach((f) => {
        const div = document.createElement("div");
        div.className = "file-item";
        div.dataset.id = f.id;
        let thumb;
        if (f.url.match(/\.(png|jpe?g|gif)$/i)) {
          thumb = document.createElement("img");
          thumb.src = f.url;
          thumb.className = "file-thumb";
        } else {
          thumb = document.createElement("div");
          thumb.className = "file-thumb";
          thumb.textContent = "DOC";
          thumb.style.display = "flex";
          thumb.style.alignItems = "center";
          thumb.style.justifyContent = "center";
          thumb.style.background = "#444";
          thumb.style.color = "#fff";
        }
        div.appendChild(thumb);
        const del = document.createElement("button");
        del.textContent = "Delete";
        del.className = "delete-file btn-option";
        div.appendChild(del);
        listEl.appendChild(div);
      });
    } catch (err) {
      console.error(err);
      listEl.textContent = "Error loading files.";
    }
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = container.dataset.reptileId;
    const fd = new FormData();
    for (const file of input.files) fd.append("files", file);
    await fetch(`/api/animal-files/${id}`, { method: "POST", body: fd });
    input.value = "";
    loadList(id);
  });

  listEl.addEventListener("click", async (e) => {
    if (e.target.classList.contains("delete-file")) {
      const id = e.target.parentElement.dataset.id;
      await fetch(`/api/animal-files/${id}`, { method: "DELETE" });
      loadList(container.dataset.reptileId);
    } else if (e.target.classList.contains("file-thumb")) {
      if (e.target.tagName === "IMG") {
        window.open(e.target.src, "_blank");
      } else {
        const id = e.target.parentElement.dataset.id;
        const f = await fetch(
          `/api/animal-files/${container.dataset.reptileId}`,
        )
          .then((r) => r.json())
          .then((arr) => arr.find((x) => String(x.id) === String(id)));
        if (f) window.open(f.url, "_blank");
      }
    }
  });

  window.openFilesPopup = function (id) {
    container.dataset.reptileId = id;
    loadList(id);
    container.style.display = "flex";
  };
});
