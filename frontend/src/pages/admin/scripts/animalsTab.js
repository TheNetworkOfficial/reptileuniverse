document.addEventListener("DOMContentLoaded", () => {
  const tableBody = document.getElementById("animal-table-body");
  const nameInput = document.getElementById("filter-name");
  const speciesInput = document.getElementById("filter-species");
  const filterBtn = document.getElementById("filter-btn");
  const addBtn = document.getElementById("add-animal-btn");

  let editingId = null;
  let popupTitle;
  let animals = [];

  async function loadAnimals() {
    try {
      const res = await fetch("/api/reptiles");
      if (!res.ok) {
        throw new Error(`Server responded with ${res.status}`);
      }
      animals = await res.json();
      displayAnimals(animals);
    } catch (err) {
      console.error("Error loading reptiles:", err);
      displayAnimals([]);
    }
  }

  function displayAnimals(list) {
    tableBody.innerHTML = "";
    const arr = Array.isArray(list) ? list : [];
    arr.forEach((a) => {
      const row = document.createElement("tr");
      row.dataset.id = a.id;
      row.innerHTML = `
        <td>${a.name}</td>
        <td>${a.species}</td>
        <td>${a.sex || ""}</td>
        <td>${a.age || ""}</td>
        <td>${a.location || ""}</td>
        <td>${a.traits || ""}</td>
        <td>${a.bio || ""}</td>
        <td>${a.requirements || ""}</td>
        <td>${(a.image_urls || []).join(", ")}</td>
        <td><button class="edit-btn btn-option">Edit</button></td>
        <td><button class="delete-btn btn-option">Delete</button></td>`;
      tableBody.appendChild(row);
    });
  }

  function applyFilters() {
    const name = nameInput.value.toLowerCase();
    const species = speciesInput.value.toLowerCase();

    const filtered = animals.filter((a) => {
      const nameMatch = !name || a.name.toLowerCase().includes(name);
      const speciesMatch =
        !species || a.species.toLowerCase().includes(species);
      return nameMatch && speciesMatch;
    });

    displayAnimals(filtered);
  }

  filterBtn.addEventListener("click", applyFilters);

  tableBody.addEventListener("click", (e) => {
    const row = e.target.closest("tr");
    if (!row) return;
    const id = row.dataset.id;
    if (e.target.classList.contains("edit-btn")) {
      openEditPopup(id);
    } else if (e.target.classList.contains("delete-btn")) {
      deleteAnimal(id);
    }
  });

  document.addEventListener("popupsLoaded", () => {
    const form = document.getElementById("add-animal-form");
    const cancelBtn = document.getElementById("cancel-add-animal");
    const popup = document.getElementById("animal-popup-container");
    popupTitle = document.getElementById("animal-popup-title");
    const closeBtn = popup ? popup.querySelector(".close-button") : null;

    if (form) {
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const images = form.image_urls.value
          ? form.image_urls.value
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : [];
        const data = {
          name: form.name.value,
          species: form.species.value,
          age: form.age.value,
          location: form.location.value,
          sex: form.sex.value,
          traits: form.traits.value,
          bio: form.bio.value,
          requirements: form.requirements.value,
          image_urls: images,
        };

        try {
          const url = editingId
            ? `/api/reptiles/${editingId}`
            : "/api/reptiles";
          const method = editingId ? "PUT" : "POST";
          const res = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });
          if (res.ok) {
            form.reset();
            if (popup) popup.style.display = "none";
            editingId = null;
            if (popupTitle) popupTitle.textContent = "Add New Animal";
            loadAnimals();
          }
        } catch (err) {
          console.error("Error adding animal:", err);
        }
      });
    }

    if (cancelBtn && popup) {
      cancelBtn.addEventListener("click", () => {
        popup.style.display = "none";
        editingId = null;
        if (popupTitle) popupTitle.textContent = "Add New Animal";
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        editingId = null;
        if (popupTitle) popupTitle.textContent = "Add New Animal";
      });
    }
  });

  if (addBtn) {
    addBtn.addEventListener("click", () => {
      editingId = null;
      if (popupTitle) popupTitle.textContent = "Add New Animal";
      if (document.getElementById("add-animal-form")) {
        document.getElementById("add-animal-form").reset();
      }
    });
  }

  loadAnimals();

  function openEditPopup(id) {
    const reptile = animals.find((r) => String(r.id) === String(id));
    if (!reptile) return;
    editingId = id;
    if (popupTitle) popupTitle.textContent = "Edit Animal";
    const form = document.getElementById("add-animal-form");
    const popup = document.getElementById("animal-popup-container");
    if (form && popup) {
      form.name.value = reptile.name || "";
      form.species.value = reptile.species || "";
      form.age.value = reptile.age || "";
      form.location.value = reptile.location || "";
      form.sex.value = reptile.sex || "";
      form.traits.value = reptile.traits || "";
      form.bio.value = reptile.bio || "";
      form.requirements.value = reptile.requirements || "";
      form.image_urls.value = (reptile.image_urls || []).join(", ");
      popup.style.display = "flex";
    }
  }

  async function deleteAnimal(id) {
    if (!window.confirm("Are you sure you want to delete this animal?")) return;
    try {
      const res = await fetch(`/api/reptiles/${id}`, { method: "DELETE" });
      if (res.ok) {
        loadAnimals();
      }
    } catch (err) {
      console.error("Error deleting animal:", err);
    }
  }
});
