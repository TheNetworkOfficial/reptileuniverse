// animalsTab.js

// ————————————————————————————————————————————
// 1) Wait for the DOM to be ready, then wire up everything.
// ————————————————————————————————————————————
document.addEventListener("DOMContentLoaded", () => {
  // Table/filter elements
  const tableBody = document.getElementById("sale-animal-table-body");
  const nameInput = document.getElementById("sale-filter-name");
  const speciesInput = document.getElementById("sale-filter-species");
  const filterBtn = document.getElementById("sale-filter-btn");
  const addBtn = document.getElementById("add-sale-animal-btn");

  // These will be set once the popup HTML is inserted
  let editingId = null; // null → “Add New”; otherwise → the ID being edited
  let popupTitleElem = null; // <h2 id="animal-popup-title">Add New Animal</h2>
  let animals = []; // current array of reptiles from GET /api/reptiles

  // ————————————————————————————
  // 2) Fetch + render “all animals”
  // ————————————————————————————
  async function loadAnimals() {
    try {
      const res = await fetch("/api/reptiles?status=for%20sale");
      if (!res.ok) {
        throw new Error(`Server responded with ${res.status}`);
      }
      animals = await res.json();
      displayAnimals(animals);
    } catch (err) {
      console.error("Error loading reptiles:", err);
      animals = [];
      displayAnimals([]);
    }
  }

  function displayAnimals(list) {
    tableBody.innerHTML = "";
    const arr = Array.isArray(list) ? list : [];
    arr.forEach(async (a) => {
      const row = document.createElement("tr");
      row.dataset.id = a.id;
      row.innerHTML = `
        <td>${a.id}</td>
        <td>${a.name}</td>
        <td>${a.species}</td>
        <td>${a.sex || ""}</td>
        <td>${a.age || ""}</td>
        <td>${a.location || ""}</td>
        <td>${a.price != null ? `$${Number(a.price).toFixed(2)}` : ""}</td>
        <td>${a.traits || ""}</td>
        <td>${a.bio || ""}</td>
        <td>${a.requirements || ""}</td>
        <td class="inspection-cell" data-id="${a.id}">...</td>
        <td>${(a.image_urls || []).join(", ")}</td>
        <td><button class="files-btn btn-option">Files</button></td>
        <td><button class="edit-btn btn-option">Edit</button></td>
        <td><button class="delete-btn btn-option">Delete</button></td>`;
      tableBody.appendChild(row);

      const cell = row.querySelector(".inspection-cell");
      if (cell) {
        try {
          const res = await fetch(`/api/health-inspections/${a.id}`);
          if (res.ok) {
            const list = await res.json();
            cell.innerHTML = list.length > 0 ? "&#10003;" : "&#10007;";
            cell.style.cursor = "pointer";
          } else {
            cell.innerHTML = "&#10007;";
          }
        } catch (err) {
          console.error(err);
          cell.innerHTML = "&#10007;";
        }
      }
    });
  }

  // ——————————————————————————
  // 3) Filter “in-memory”
  // ——————————————————————————
  function applyFilters() {
    const nameFilter = nameInput.value.toLowerCase();
    const speciesFilter = speciesInput.value.toLowerCase();

    const filtered = animals.filter((a) => {
      const nameMatch =
        !nameFilter || a.name.toLowerCase().includes(nameFilter);
      const speciesMatch =
        !speciesFilter || a.species.toLowerCase().includes(speciesFilter);
      return nameMatch && speciesMatch;
    });

    displayAnimals(filtered);
  }

  filterBtn.addEventListener("click", applyFilters);

  // ——————————————————————————
  // 4) Delegate “Edit” / “Delete” / “Open Inspection” clicks
  // ——————————————————————————
  tableBody.addEventListener("click", (e) => {
    const row = e.target.closest("tr");
    if (!row) return;
    const id = row.dataset.id;
    if (e.target.classList.contains("edit-btn")) {
      openEditPopup(id);
    } else if (e.target.classList.contains("delete-btn")) {
      deleteAnimal(id);
    } else if (e.target.classList.contains("inspection-cell")) {
      if (window.openInspectionPopup) window.openInspectionPopup(id);
    } else if (e.target.classList.contains("files-btn")) {
      if (window.openFilesPopup) window.openFilesPopup(id);
    }
  });

  // ———————————————————————————————————————————————————————
  // 5) Once popups are injected (by popupInitilzation.js), wire up the form
  // ———————————————————————————————————————————————————————
  document.addEventListener("popupsLoaded", () => {
    const form = document.getElementById("add-animal-form");
    const cancelBtn = document.getElementById("cancel-add-animal");
    const popup = document.getElementById("animal-popup-container");
    popupTitleElem = document.getElementById("animal-popup-title");
    const closeBtn = popup ? popup.querySelector(".close-button") : null;

    if (form) {
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const statusField = document.getElementById("animal-status");
        if (statusField && statusField.value !== "for sale") return;

        // ———————————————————————————————
        // 5a) Validate file types (PNG/JPG only)
        // ———————————————————————————————
        const imagesInput = document.getElementById("animal-images");
        for (const file of imagesInput.files) {
          if (!(file.type === "image/png" || file.type === "image/jpeg")) {
            alert("Only PNG or JPG images are allowed.");
            return;
          }
        }

        // ———————————————————————————————
        // 5b) Build FormData, including the file(s)
        // ———————————————————————————————
        const formData = new FormData();
        formData.append("name", document.getElementById("animal-name").value);
        formData.append(
          "species",
          document.getElementById("animal-species").value,
        );
        formData.append("age", document.getElementById("animal-age").value);
        formData.append(
          "location",
          document.getElementById("animal-location").value,
        );
        formData.append(
          "price",
          document.getElementById("animal-price").value,
        );
        formData.append("sex", document.getElementById("animal-sex").value);
        formData.append(
          "traits",
          document.getElementById("animal-traits").value,
        );
        formData.append("bio", document.getElementById("animal-bio").value);
        formData.append(
          "requirements",
          document.getElementById("animal-requirements").value,
        );

        // Append each selected file under “images” (backend expects req.files)
        for (const file of imagesInput.files) {
          formData.append("images", file);
        }
        if (!editingId && statusField)
          formData.append("status", statusField.value);

        // ———————————————————————————————
        // 5c) Determine POST vs PUT & send
        // ———————————————————————————————
        try {
          const url = editingId
            ? `/api/reptiles/${editingId}`
            : "/api/reptiles";
          const method = editingId ? "PUT" : "POST";
          // ─── Collect any “delete-image” checkboxes that are checked ────────────
          const existingHolder = document.getElementById("existing-images");
          if (existingHolder) {
            const checkedBoxes = existingHolder.querySelectorAll(
              'input[name="delete-image"]:checked',
            );
            const deleteArr = Array.from(checkedBoxes).map((cb) => cb.value);
            if (deleteArr.length) {
              formData.append("deleteImages", JSON.stringify(deleteArr));
            }
          }
          const res = await fetch(url, {
            method,
            body: formData,
            // Note: Do NOT set “Content-Type” here; letting the browser pick the multipart/form-data boundary
          });

          if (!res.ok) {
            const errJson = await res.json().catch(() => ({}));
            throw new Error(
              errJson.error || `Server responded with ${res.status}`,
            );
          }

          // Success: reset & close popup
          form.reset();
          editingId = null;
          if (popup) popup.style.display = "none";
          if (popupTitleElem) popupTitleElem.textContent = "Add New Animal";
          await loadAnimals();
        } catch (err) {
          console.error("Error adding/updating animal:", err);
          alert("Failed to save. Check console for details.");
        }
      });
    }

    // ———————————————————————————————
    // Cancel / Close buttons simply hide the popup and clear “editingId”
    // ———————————————————————————————
    if (cancelBtn && popup) {
      cancelBtn.addEventListener("click", () => {
        popup.style.display = "none";
        editingId = null;
        if (popupTitleElem) popupTitleElem.textContent = "Add New Animal";
      });
    }
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        editingId = null;
        if (popupTitleElem) popupTitleElem.textContent = "Add New Animal";
      });
    }
  });

  // ————————————————————————————————————————————
  // 6) “Add Animal” button (reset form, switch title)
  // ————————————————————————————————————————————
  if (addBtn) {
    addBtn.addEventListener("click", () => {
      editingId = null;
      if (popupTitleElem) popupTitleElem.textContent = "Add New Animal";
      const form = document.getElementById("add-animal-form");
      if (form) form.reset();
      const statusField = document.getElementById("animal-status");
      if (statusField) statusField.value = "for sale";

      // Clear any thumbnails from a prior “edit”
      const existingHolder = document.getElementById("existing-images");
      if (existingHolder) existingHolder.innerHTML = "";
      // Show popup is handled by popupInitilzation.js
    });
  }

  // ————————————————————————————————————————————
  // 7) Populate the “Edit” popup with existing values
  // ————————————————————————————————————————————
  function openEditPopup(id) {
    const reptile = animals.find((r) => String(r.id) === String(id));
    if (!reptile) return;

    editingId = id;
    if (popupTitleElem) popupTitleElem.textContent = "Edit Animal";
    const form = document.getElementById("add-animal-form");
    const popup = document.getElementById("animal-popup-container");
    if (form && popup) {
      const statusField = document.getElementById("animal-status");
      if (statusField) statusField.value = reptile.status || "for sale";
      document.getElementById("animal-name").value = reptile.name || "";
      document.getElementById("animal-species").value = reptile.species || "";
      document.getElementById("animal-age").value = reptile.age || "";
      document.getElementById("animal-location").value = reptile.location || "";
      document.getElementById("animal-price").value = reptile.price || "";
      document.getElementById("animal-sex").value = reptile.sex || "";
      document.getElementById("animal-traits").value = reptile.traits || "";
      document.getElementById("animal-bio").value = reptile.bio || "";
      document.getElementById("animal-requirements").value =
        reptile.requirements || "";
      // Note: Cannot prefill <input type="file"> for security reasons.
      // If you want to show existing URLs, you can display them elsewhere, but we clear the file input:
      document.getElementById("animal-images").value = "";

      // ─── Render existing images with “Delete” checkboxes ───────────────────
      const existingHolder = document.getElementById("existing-images");
      if (existingHolder) {
        existingHolder.innerHTML = ""; // clear any old content
        (reptile.image_urls || []).forEach((url) => {
          const wrapper = document.createElement("div");
          wrapper.classList.add("existing-image-item");
          wrapper.style.display = "inline-block";
          wrapper.style.margin = "5px";

          const img = document.createElement("img");
          img.src = url;
          img.style.width = "80px";
          img.style.height = "80px";
          img.style.objectFit = "cover";
          img.style.display = "block";
          img.style.marginBottom = "3px";

          const checkbox = document.createElement("input");
          checkbox.type = "checkbox";
          checkbox.name = "delete-image";
          checkbox.value = url;
          checkbox.id = `del-${btoa(url)}`; // unique ID

          const label = document.createElement("label");
          label.htmlFor = checkbox.id;
          label.textContent = "Delete";

          wrapper.appendChild(img);
          wrapper.appendChild(checkbox);
          wrapper.appendChild(label);
          existingHolder.appendChild(wrapper);
        });
      }

      popup.style.display = "flex";
    }
  }

  // ———————————————————————————————
  // 8) Show health inspections (NEW SECTION)
  // ———————————————————————————————
  let inspectionPopup, inspectionList, createInspectionBtn;

  document.addEventListener("popupsLoaded", () => {
    // If another tab already initialized the popup, skip wiring here.
    if (window.openInspectionPopup) {
      console.log("[HI][bind] Skipping forSaleTab; popup already initialized.");
      return;
    }

    inspectionPopup = document.getElementById("inspection-popup-container");
    inspectionList = document.getElementById("inspection-popup-list");
    createInspectionBtn = document.getElementById("create-inspection-btn");
    const closeBtn = inspectionPopup?.querySelector(".close-button");

    console.log("[HI][bind] forSaleTab initializing Health Inspections popup listeners.");

    // Close popup
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        inspectionPopup.style.display = "none";
      });
    }

    // Grab form + cancel
    let isSavingInspection = false;
    const inspectionForm = document.getElementById("inspection-form");
    const cancelInspectionBtn = document.getElementById(
      "cancel-inspection-btn",
    );

    // “Create New” → show form
    if (createInspectionBtn && inspectionForm) {
      createInspectionBtn.addEventListener("click", () => {
        console.log("[HI][ui] Create New inspection clicked.");
        inspectionList.style.display = "none";
        createInspectionBtn.style.display = "none";
        inspectionForm.style.display = "block";
      });
    }

    // “Cancel” → hide form, show list
    if (cancelInspectionBtn && inspectionForm) {
      cancelInspectionBtn.addEventListener("click", () => {
        console.log("[HI][ui] Cancel inspection creation.");
        inspectionForm.reset();
        inspectionForm.style.display = "none";
        inspectionList.style.display = "block";
        createInspectionBtn.style.display = "inline-block";
      });
    }

    // helper: clear invalid styles when user edits inputs
    if (inspectionForm) {
      const clearHandler = (ev) => {
        const t = ev.target;
        if (!(t instanceof HTMLElement)) return;
        t.classList.remove("invalid");
        const fs = t.closest("fieldset");
        if (fs) fs.classList.remove("invalid");
        const lb = t.closest("label");
        if (lb) lb.classList.remove("invalid");
      };
      inspectionForm.addEventListener("input", clearHandler);
      inspectionForm.addEventListener("change", clearHandler);
    }

    function validateInspectionForm(formEl) {
      // remove any previous highlights
      formEl.querySelectorAll(".invalid").forEach((el) => el.classList.remove("invalid"));
      let firstFocus = null;

      function markInvalid(container) {
        if (!container) return;
        container.classList.add("invalid");
        const focusEl = container.querySelector("input, select, textarea") || container;
        if (!firstFocus && focusEl && focusEl.focus) firstFocus = focusEl;
      }

      function requireRadio(name) {
        const checked = formEl.querySelector(`input[name="${name}"]:checked`);
        if (checked) return true;
        const any = formEl.querySelector(`input[name="${name}"]`);
        const container = any?.closest("fieldset") || any?.closest("label") || any?.parentElement;
        markInvalid(container || any);
        return false;
      }

      function requireText(name) {
        const el = formEl.querySelector(`[name="${name}"]`);
        if (!el) return true; // not present
        const val = (el.value || "").trim();
        if (val.length > 0) return true;
        el.classList.add("invalid");
        if (!firstFocus && el.focus) firstFocus = el;
        return false;
      }

      function requireTextIf(name, predicate) {
        if (!predicate()) return true;
        return requireText(name);
      }

      function requireSelect(name) {
        const el = formEl.querySelector(`select[name="${name}"]`);
        if (!el) return true;
        const val = el.value;
        if (val === undefined || val === null || String(val).trim() === "") {
          el.classList.add("invalid");
          if (!firstFocus && el.focus) firstFocus = el;
          return false;
        }
        return true;
      }

      let ok = true;
      ok = requireRadio("hold72") && ok;
      ok = requireRadio("weight") && ok;
      ok = requireRadio("posture") && ok;
      ok = requireSelect("hydration") && ok;
      ok = requireSelect("energy") && ok;
      ok = requireSelect("vent") && ok;
      ok = requireSelect("eyes") && ok;
      ok = requireSelect("nostrils") && ok;
      ok = requireRadio("toes") && ok;
      ok = requireRadio("nails") && ok;
      ok = requireRadio("tail") && ok;
      ok = requireRadio("blemish") && ok;
      ok = requireRadio("kinks") && ok;
      ok = requireRadio("shed") && ok;
      ok = requireRadio("parasites") && ok;

      ok = requireTextIf("postureExplain", () => formEl.querySelector('input[name="posture"]:checked')?.value === "poor") && ok;
      ok = requireTextIf("blemishExplain", () => formEl.querySelector('input[name="blemish"]:checked')?.value === "yes") && ok;
      ok = requireTextIf("kinksExplain", () => formEl.querySelector('input[name="kinks"]:checked')?.value === "yes") && ok;
      ok = requireTextIf("shedExplain", () => formEl.querySelector('input[name="shed"]:checked')?.value === "yes") && ok;
      ok = requireTextIf("parasitesExplain", () => formEl.querySelector('input[name="parasites"]:checked')?.value === "yes") && ok;

      ok = requireText("notes") && ok;

      if (!ok && firstFocus) {
        firstFocus.scrollIntoView({ behavior: "smooth", block: "center" });
        firstFocus.focus();
      }
      return ok;
    }

    // “Save” → validate, POST, then reload list & table
    if (inspectionForm) {
      inspectionForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        if (isSavingInspection) {
          console.log("[HI][submit] Ignored duplicate submit (already saving).");
          return;
        }
        const saveBtn = document.getElementById("save-inspection-btn");
        if (saveBtn) saveBtn.disabled = true;

        // Validate required fields
        if (!validateInspectionForm(inspectionForm)) {
          if (saveBtn) saveBtn.disabled = false;
          return; // do not submit
        }

        isSavingInspection = true;
        const rid = inspectionPopup.dataset.reptileId;
        if (!rid) {
          console.warn("[HI][submit] No reptileId on popup; aborting save.");
          isSavingInspection = false;
          if (saveBtn) saveBtn.disabled = false;
          return;
        }
        const fd = new FormData(inspectionForm);
        const payload = { reptile_id: rid };
        for (const [k, v] of fd.entries()) payload[k] = v;
        try {
          console.log("[HI][submit] POST /api/health-inspections", payload);
          await fetch("/api/health-inspections", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          console.log("[HI][submit] Save succeeded for reptile", rid);
          inspectionForm.reset();
          inspectionForm.style.display = "none";
          inspectionList.style.display = "block";
          createInspectionBtn.style.display = "inline-block";
          loadInspectionList(rid);
          loadAnimals();
        } finally {
          isSavingInspection = false;
          const saveBtn2 = document.getElementById("save-inspection-btn");
          if (saveBtn2) saveBtn2.disabled = false;
        }
      });
    }

    // — Delegate View/Delete/Download clicks INSIDE popupsLoaded —
    if (inspectionList) {
      inspectionList.addEventListener("click", async (e) => {
        const tr = e.target.closest("tr");
        if (!tr) return;
        const iid = tr.dataset.id;
        if (e.target.matches(".delete-inspection")) {
          if (!confirm("Delete this report?")) return;
          console.log("[HI][delete] DELETE /api/health-inspections/" + iid);
          await fetch(`/api/health-inspections/${iid}`, { method: "DELETE" });
          console.log("[HI][delete] Delete completed for id", iid);
          loadInspectionList(inspectionPopup.dataset.reptileId);
        } else if (e.target.matches(".download-inspection")) {
          console.log("[HI][download] Request PDF for inspection", iid);
          window.open(`/api/health-inspections/${iid}/pdf`, "_blank");
        } else if (e.target.matches(".view-inspection")) {
          console.log("[HI][view] View inspection", iid);
          const all = await (
            await fetch(
              `/api/health-inspections/${inspectionPopup.dataset.reptileId}`,
            )
          ).json();
          const ins = all.find((x) => x.id == iid);
          if (ins) alert(JSON.stringify(ins, null, 2));
        }
      });
    }

    function openInspectionPopup(id) {
      console.log("[HI][open] Open inspections popup for reptile", id);
      if (!inspectionPopup) return;
      inspectionPopup.dataset.reptileId = id;
      loadInspectionList(id);
      inspectionPopup.style.display = "flex";
    }
    window.openInspectionPopup = openInspectionPopup;
  });

  // ———————————————————————————————
  // Render & manage inspection list + popup
  // ———————————————————————————————
  async function loadInspectionList(reptileId) {
    if (!inspectionList) return;
    inspectionList.innerHTML = "Loading…";
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
            <button class="delete-inspection btn-danger">Delete</button>
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

  // Local openInspectionPopup removed; use window.openInspectionPopup instead.

  // ———————————————————————————————
  // 9) Delete an animal
  // ———————————————————————————————
  async function deleteAnimal(id) {
    if (!confirm("Are you sure you want to delete this animal?")) return;
    try {
      const res = await fetch(`/api/reptiles/${id}`, { method: "DELETE" });
      if (res.ok) await loadAnimals();
      else console.error("Delete failed:", res.status);
    } catch (err) {
      console.error("Error deleting animal:", err);
    }
  }

  // ————————————————————————————————————————————
  // 10) Initial load
  // ————————————————————————————————————————————
  loadAnimals();
});
