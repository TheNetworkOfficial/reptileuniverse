// pendingAdoptionsTab.js
// Handles loading and approving/denying adoption applications

document.addEventListener("DOMContentLoaded", () => {
  const tableBody = document.getElementById("pending-apps-body");
  let apps = [];

  async function loadApps() {
    try {
      const res = await fetch("/api/adoption-apps/pending");
      apps = res.ok ? await res.json() : [];
      renderList();
    } catch (err) {
      console.error("Failed to load applications", err);
    }
  }

  function renderList() {
    tableBody.innerHTML = "";
    apps.forEach((app) => {
      const tr = document.createElement("tr");
      tr.dataset.id = app.id;
      tr.innerHTML = `
        <td>${app.reptileDescription || ""}</td>
        <td>${app.primaryName || ""}</td>
        <td>${app.primaryEmail || ""}</td>
        <td><button class="view-app-btn btn-option">View</button></td>`;
      tableBody.appendChild(tr);
    });
  }

  // Popup references populated when popupsLoaded fires
  let popup, detailsElem, approveBtn, denyBtn;
  document.addEventListener("popupsLoaded", () => {
    popup = document.getElementById("adoption-app-popup-container");
    detailsElem = document.getElementById("adoption-app-details");
    approveBtn = document.getElementById("approve-app-btn");
    denyBtn = document.getElementById("deny-app-btn");

    if (approveBtn)
      approveBtn.addEventListener("click", () => updateStatus("approved"));
    if (denyBtn)
      denyBtn.addEventListener("click", () => updateStatus("rejected"));
  });

  tableBody.addEventListener("click", (e) => {
    if (e.target.classList.contains("view-app-btn")) {
      const tr = e.target.closest("tr");
      if (tr) openPopup(tr.dataset.id);
    }
  });

  function openPopup(id) {
    const app = apps.find((a) => String(a.id) === String(id));
    if (!app || !popup) return;
    popup.dataset.id = id;
    let html = "<table class='detail-table'>";
    Object.entries(app).forEach(([k, v]) => {
      if (["id", "createdAt", "updatedAt"].includes(k)) return;
      html += `<tr><th>${k}</th><td>${v || ""}</td></tr>`;
    });
    html += "</table>";
    detailsElem.innerHTML = html;
    popup.style.display = "flex";
  }

  async function updateStatus(status) {
    if (!popup) return;
    const id = popup.dataset.id;
    try {
      const res = await fetch(`/api/adoption-apps/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        popup.style.display = "none";
        loadApps();
      } else {
        console.error("Failed to update status", res.status);
      }
    } catch (err) {
      console.error(err);
    }
  }

  loadApps();
});