// surrenderFormsTab.js
// Loads and manages surrender forms in the admin panel

document.addEventListener("DOMContentLoaded", () => {
  const tableBody = document.getElementById("surrender-forms-body");
  let forms = [];

  async function loadForms() {
    try {
      const res = await fetch("/api/surrenders?formStatus=pending");
      forms = res.ok ? await res.json() : [];
      render();
    } catch (err) {
      console.error("Failed to load surrender forms", err);
    }
  }

  function render() {
    tableBody.innerHTML = "";
    forms.forEach((f) => {
      const tr = document.createElement("tr");
      tr.dataset.id = f.id;
      tr.innerHTML = `
        <td>${f.id}</td>
        <td>${f.animalName || ""}</td>
        <td>${f.printedName || ""}</td>
        <td><button class="view-form-btn btn-option">View</button></td>`;
      tableBody.appendChild(tr);
    });
  }

  let popup, detailsElem, approveBtn, denyBtn;
  document.addEventListener("popupsLoaded", () => {
    popup = document.getElementById("surrender-form-popup-container");
    detailsElem = document.getElementById("surrender-form-details");
    approveBtn = document.getElementById("approve-surrender-btn");
    denyBtn = document.getElementById("deny-surrender-btn");
    if (approveBtn)
      approveBtn.addEventListener("click", () => updateStatus("approved"));
    if (denyBtn)
      denyBtn.addEventListener("click", () => updateStatus("rejected"));
  });

  tableBody.addEventListener("click", (e) => {
    if (e.target.classList.contains("view-form-btn")) {
      const tr = e.target.closest("tr");
      if (tr) openPopup(tr.dataset.id);
    }
  });

  function openPopup(id) {
    const form = forms.find((f) => String(f.id) === String(id));
    if (!form || !popup) return;
    popup.dataset.id = id;
    let html = "<table class='detail-table'>";
    Object.entries(form).forEach(([k, v]) => {
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
      const res = await fetch(`/api/surrenders/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        popup.style.display = "none";
        loadForms();
      } else {
        console.error("Failed to update status", res.status);
      }
    } catch (err) {
      console.error(err);
    }
  }

  loadForms();
});