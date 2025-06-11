document.addEventListener("DOMContentLoaded", () => {
  const tableBody = document.getElementById("clients-table-body");
  let clients = [];

  async function loadClients() {
    try {
      const res = await fetch("/api/clients");
      clients = res.ok ? await res.json() : [];
      render();
    } catch (err) {
      console.error("Failed to load clients", err);
    }
  }

  function render() {
    tableBody.innerHTML = "";
    clients.forEach((c) => {
      const row = document.createElement("tr");
      row.classList.add("client-row");
      row.dataset.id = c.id;
      row.innerHTML = `
        <td>${c.username}</td>
        <td>${c.email}</td>
        <td>${c.pendingApps}</td>
        <td>${c.approvedApps}</td>
        <td>${c.rejectedApps}</td>
        <td>${c.animals.length}</td>
      `;
      tableBody.appendChild(row);

      const detailTr = document.createElement("tr");
      detailTr.classList.add("client-detail");
      detailTr.style.display = "none";
      const td = document.createElement("td");
      td.colSpan = 6;
      td.innerHTML = buildAnimalTable(c.animals);
      detailTr.appendChild(td);
      tableBody.appendChild(detailTr);

      row.addEventListener("click", () => {
        detailTr.style.display =
          detailTr.style.display === "none" ? "table-row" : "none";
      });
    });
  }

  function buildAnimalTable(list) {
    if (!Array.isArray(list) || list.length === 0)
      return "<p>No animals owned.</p>";
    let html =
      "<table class='owned-table'><thead><tr><th>Name</th><th>Species</th><th>Sex</th><th>Age</th><th>Traits</th></tr></thead><tbody>";
    list.forEach((a) => {
      html += `<tr><td>${a.name}</td><td>${a.species}</td><td>${a.sex || ""}</td><td>${a.age || ""}</td><td>${a.traits || ""}</td></tr>`;
    });
    html += "</tbody></table>";
    return html;
  }

  loadClients();
});