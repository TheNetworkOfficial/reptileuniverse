// pendingPaymentsTab.js
// Displays reptiles awaiting payment after application approval

document.addEventListener("DOMContentLoaded", () => {
  const tableBody = document.getElementById("pending-payment-body");
  if (!tableBody) return;

  async function loadList() {
    try {
      const res = await fetch("/api/adoption-apps/pending-payment");
      const items = res.ok ? await res.json() : [];
      render(items);
    } catch (err) {
      console.error("Failed to load pending payments", err);
    }
  }

  function render(items) {
    tableBody.innerHTML = "";
    items.forEach((item) => {
      const tr = document.createElement("tr");
      const reptile = item.reptile || {};
      const user = item.user || {};
      tr.dataset.id = reptile.id;
      tr.innerHTML = `
        <td>${reptile.id}</td>
        <td>${reptile.name || ""}</td>
        <td>${user.username || ""}</td>
        <td>
          <button class="btn pay-btn">Mark Paid</button>
          <button class="btn reject-btn">Reject</button>
        </td>
      `;
      tableBody.appendChild(tr);
    });
  }

  tableBody.addEventListener("click", (e) => {
    const row = e.target.closest("tr");
    if (!row) return;
    const id = row.dataset.id;
    if (e.target.classList.contains("pay-btn")) {
      updatePayment(id, "paid");
    } else if (e.target.classList.contains("reject-btn")) {
      updatePayment(id, "rejected");
    }
  });

  async function updatePayment(id, status) {
    try {
      const res = await fetch(`/api/adoption-apps/payment/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        loadList();
      } else {
        console.error("Failed to update payment", res.status);
      }
    } catch (err) {
      console.error(err);
    }
  }

  loadList();
});