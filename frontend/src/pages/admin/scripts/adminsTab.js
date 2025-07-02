// adminsTab.js
// Handles listing current admins and promoting/removing admin rights

document.addEventListener("DOMContentLoaded", () => {
  const tableBody = document.getElementById("admins-table-body");
  const addBtn = document.getElementById("add-admin-btn");
  let admins = [];

  async function loadAdmins() {
    try {
      const res = await fetch("/api/admin-users");
      admins = res.ok ? await res.json() : [];
      render();
    } catch (err) {
      console.error("Failed to load admins", err);
    }
  }

  function render() {
    tableBody.innerHTML = "";
    admins.forEach((a) => {
      const tr = document.createElement("tr");
      tr.dataset.id = a.id;
      tr.innerHTML = `
        <td>${a.username}</td>
        <td>${a.email}</td>
        <td><button class="remove-admin btn-option">Delete</button></td>`;
      tableBody.appendChild(tr);
    });
  }

  tableBody.addEventListener("click", async (e) => {
    if (e.target.classList.contains("remove-admin")) {
      const id = e.target.closest("tr").dataset.id;
      if (!confirm("Remove admin privileges?")) return;
      await fetch(`/api/admin-users/${id}`, { method: "DELETE" });
      loadAdmins();
    }
  });

  let popup, usersBody;
  document.addEventListener("popupsLoaded", () => {
    popup = document.getElementById("add-admin-popup-container");
    usersBody = document.getElementById("all-users-body");
    if (popup && usersBody) {
      usersBody.addEventListener("click", async (e) => {
        if (e.target.classList.contains("make-admin")) {
          const uid = e.target.dataset.id;
          await fetch(`/api/admin-users/${uid}`, { method: "POST" });
          popup.style.display = "none";
          loadAdmins();
        }
      });
    }
  });

  async function loadAllUsers() {
    if (!usersBody) return;
    usersBody.innerHTML = "Loading...";
    try {
      const res = await fetch("/api/admin-users/all");
      const users = res.ok ? await res.json() : [];
      usersBody.innerHTML = "";
      users.forEach((u) => {
        if (u.isAdmin) return;
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${u.username}</td>
          <td>${u.email}</td>
          <td><button class="make-admin btn-option" data-id="${u.id}">Add</button></td>`;
        usersBody.appendChild(tr);
      });
    } catch (err) {
      console.error("Failed to load users", err);
      usersBody.innerHTML = "Error";
    }
  }

  if (addBtn) {
    addBtn.addEventListener("click", () => {
      if (popup) popup.style.display = "flex";
      loadAllUsers();
    });
  }

  loadAdmins();
});