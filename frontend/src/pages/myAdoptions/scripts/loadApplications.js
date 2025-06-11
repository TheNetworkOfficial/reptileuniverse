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

        // normalize status
        const raw = app.status || "pending";
        let label = raw;
        let cls   = raw;
        let btn   = "";

        // for pendingPayment, show "awaiting deposit" + button
        if (raw === "pendingPayment") {
          label = "awaiting deposit";
          cls   = "pendingPayment";
          btn   = `<button class="add-deposit-button">Add Deposit</button>`;
        }

        item.innerHTML = `
          <span class="reptile-name">${app.reptileDescription}</span>
          <span class="status-tag ${cls}">${label}</span>
          ${btn}
        `;
        list.appendChild(item);
      });
    })
    .catch((err) => {
      console.error("Failed to load applications:", err);
      list.innerHTML = "<p>Error loading applications.</p>";
    });
});