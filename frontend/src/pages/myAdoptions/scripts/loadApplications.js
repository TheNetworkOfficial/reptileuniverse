document.addEventListener("DOMContentLoaded", () => {
  const list = document.querySelector(".adoption-list");
  if (!list) return;

  fetch("/api/adoption-apps/my", { credentials: "include" })
    .then((res) => {
      if (res.status === 401) {
        window.location.href = "login.html";
        return null;
      }
      if (!res.ok) throw new Error(res.status);
      return res.json();
    })
    .then((apps) => {
      if (!apps) return;
      if (apps.length === 0) {
        list.innerHTML = "<p>No applications found.</p>";
        return;
      }
      list.innerHTML = "";
      apps.forEach((app) => {
        const item = document.createElement("div");
        item.className = "adoption-item";
        const status = app.status || "pending";
        item.innerHTML = `
          <span class="reptile-name">${app.reptileDescription}</span>
          <span class="status-tag ${status}">${status}</span>
        `;
        list.appendChild(item);
      });
    })
    .catch((err) => {
      console.error("Failed to load applications:", err);
      list.innerHTML = "<p>Error loading applications.</p>";
    });
});