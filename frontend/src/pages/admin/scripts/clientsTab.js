document.addEventListener("DOMContentLoaded", () => {
  const tableBody = document.getElementById("clients-table-body");
  let clients = [];
  let inspectionPopup;
  let inspectionList;

  tableBody.addEventListener("click", (e) => {
    if (e.target.classList.contains("files-btn")) {
      e.stopPropagation();
      const id = e.target.dataset.id;
      if (window.openFilesPopup) window.openFilesPopup(id);
    } else if (e.target.classList.contains("images-btn")) {
      e.stopPropagation();
      const data = e.target.dataset.images || "[]";
      const urls = JSON.parse(decodeURIComponent(data));
      if (window.openImagesPopup) window.openImagesPopup(urls);
    } else if (e.target.classList.contains("health-btn")) {
      e.stopPropagation();
      const id = e.target.dataset.id;
      openInspectionPopup(id);
    }
  });

  document.addEventListener("popupsLoaded", () => {
    inspectionPopup = document.getElementById("inspection-popup-container");
    inspectionList = document.getElementById("inspection-popup-list");
    if (inspectionList) {
      inspectionList.addEventListener("click", async (e) => {
        const tr = e.target.closest("tr");
        if (!tr) return;
        const iid = tr.dataset.id;
        if (e.target.matches(".download-inspection")) {
          window.open(`/api/health-inspections/${iid}/pdf`, "_blank");
        } else if (e.target.matches(".view-inspection")) {
          const all = await fetch(
            `/api/health-inspections/${inspectionPopup.dataset.reptileId}`,
          ).then((r) => r.json());
          const ins = all.find((x) => x.id == iid);
          if (ins) alert(JSON.stringify(ins, null, 2));
        }
      });
    }
  });

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
      td.innerHTML = buildClientDetails(c);
      detailTr.appendChild(td);
      tableBody.appendChild(detailTr);

      row.addEventListener("click", () => {
        detailTr.style.display =
          detailTr.style.display === "none" ? "table-row" : "none";
      });
    });
  }

  function buildClientDetails(client) {
    let html = "<table class='info-table'><tbody>";
    const info = [
      ["Name", client.primaryName],
      ["Phone Number", client.primaryPhone],
      ["Email Address", client.primaryEmail],
      ["Address", client.address],
      ["City", client.city],
      ["State/Zip", client.stateZip],
      ["Rent or Own", client.rentOrOwn],
      ["Landlord Name", client.landlordName],
      ["Landlord Phone", client.landlordPhone],
      ["Others Residing", client.othersResiding],
      ["Residing Details", client.residingDetails],
      ["Children In The Home", client.childrenLiving],
      ["Employment", client.primaryEmployment],
      ["Work Phone", client.primaryWorkPhone],
      ["Occupation", client.primaryOccupation],
      ["Previous Experience", client.previousExperience],
    ];
    info.forEach(([label, val]) => {
      if (val) {
        html += `<tr><th>${label}</th><td>${val}</td></tr>`;
      }
    });
    html += "</tbody></table>";
    html += buildAnimalTable(client.animals);
    return html;
  }

  function buildAnimalTable(list) {
    if (!Array.isArray(list) || list.length === 0)
      return "<p>No animals owned.</p>";
    let html =
      "<table class='owned-table'><thead><tr><th>Name</th><th>Species</th><th>Sex</th><th>Age</th><th>Traits</th><th>Images</th><th>Health</th><th>Files</th></tr></thead><tbody>";
    list.forEach((a) => {
      const imagesData = encodeURIComponent(JSON.stringify(a.image_urls || []));
      html += `<tr><td>${a.name}</td><td>${a.species}</td><td>${a.sex || ""}</td><td>${a.age || ""}</td><td>${a.traits || ""}</td><td><button class='images-btn btn-option' data-images='${imagesData}'>Images</button></td><td><button class='health-btn btn-option' data-id='${a.id}'>Health</button></td><td><button class='files-btn btn-option' data-id='${a.id}'>Files</button></td></tr>`;
    });
    html += "</tbody></table>";
    return html;
  }

  async function loadInspectionList(reptileId) {
    if (!inspectionList) return;
    inspectionList.innerHTML = "Loading...";
    try {
      const res = await fetch(`/api/health-inspections/${reptileId}`);
      const list = res.ok ? await res.json() : [];
      if (!list.length) {
        inspectionList.textContent = "No inspections.";
        return;
      }
      let html = `<table class="ins-table">
        <thead><tr><th>Date</th><th>Notes</th><th>Actions</th></tr></thead><tbody>`;
      list.forEach((ins) => {
        html += `<tr data-id="${ins.id}">
          <td>${new Date(ins.date).toLocaleDateString()}</td>
          <td>${ins.notes.slice(0, 30)}…</td>
          <td>
            <button class="view-inspection btn-option">View</button>
            <button class="download-inspection btn-secondary">PDF</button>
          </td>
        </tr>`;
      });
      html += `</tbody></table>`;
      inspectionList.innerHTML = html;
    } catch (err) {
      console.error(err);
      inspectionList.textContent = "Error loading inspections.";
    }
  }

  function openInspectionPopup(id) {
    if (!inspectionPopup) return;
    inspectionPopup.dataset.reptileId = id;
    loadInspectionList(id);
    inspectionPopup.style.display = "flex";
  }

  loadClients();
});