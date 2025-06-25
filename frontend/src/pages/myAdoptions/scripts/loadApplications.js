document.addEventListener("DOMContentLoaded", () => {
  const list = document.querySelector(".adoption-list");
  if (!list) return;

  const popup = document.getElementById("appointment-popup");
  const closeBtn = popup ? popup.querySelector(".close-button") : null;

  function openPopup() {
    if (popup) popup.style.display = "flex";
  }

  function closePopup() {
    if (popup) popup.style.display = "none";
  }

  if (closeBtn) closeBtn.addEventListener("click", closePopup);

  list.addEventListener("click", (e) => {
    if (e.target.classList.contains("appointment-btn")) {
      e.preventDefault();
      openPopup();
    }
  });

  async function loadApps() {
    try {
      const [appRes, reptileRes] = await Promise.all([
        fetch("/api/adoption-apps/my", { credentials: "include" }),
        fetch("/api/reptiles?status=pendingPayment"),
      ]);

      if (appRes.status === 401) {
        window.location.href = "login.html";
        return;
      }

      if (!appRes.ok) throw new Error(appRes.status);

      const apps = await appRes.json();
      const reptiles = reptileRes.ok ? await reptileRes.json() : [];
      render(apps, reptiles);
    } catch (err) {
      console.error("Failed to load applications:", err);
      list.innerHTML = "<p>Error loading applications.</p>";
    }
  }

  function render(apps, reptiles) {
    if (!apps || apps.length === 0) {
      list.innerHTML = "<p>No applications found.</p>";
      return;
    }

    list.innerHTML = "";
    const pendingIds = new Set((reptiles || []).map((r) => r.id));

    apps.forEach((app) => {
      const item = document.createElement("div");
      item.className = "adoption-item";

      let statusText = app.status || "pending";
      let statusClass = statusText;
      let buttonHTML = "";

      if (statusText === "approved" && pendingIds.has(app.reptile_id)) {
        statusText = "appointment required";
        statusClass = "pending";
        buttonHTML = `<button class="btn appointment-btn">Schedule Appointment</button>`;
      }

      item.innerHTML = `
        <span class="reptile-name">${app.reptileDescription}</span>
        <span class="status-tag ${statusClass}">${statusText}</span>
        ${buttonHTML}
      `;
      list.appendChild(item);
    });
  }

  loadApps();
});
