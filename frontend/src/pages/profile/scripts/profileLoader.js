const form = document.getElementById("profile-form");
const editBtn = document.getElementById("edit-btn");
const saveBtn = document.getElementById("save-btn");
const cancelBtn = document.getElementById("cancel-btn");
const inputs = form.querySelectorAll("input");
let initialData = {};

async function loadProfile() {
  try {
    const res = await fetch("/api/auth/profile", { credentials: "include" });
    if (res.status === 401) {
      window.location.href = "login.html";
      return;
    }
    if (!res.ok) throw new Error(res.status);
    const data = await res.json();
    initialData = data;
    inputs.forEach((input) => {
      const name = input.name;
      if (data[name] !== undefined && data[name] !== null) {
        input.value = data[name];
      } else {
        input.value = "";
      }
    });
  } catch (err) {
    console.error("Load profile failed:", err);
  }
}

function toggleEdit(editing) {
  inputs.forEach((input) => {
    if (input.id === "username") return; // username not editable
    input.disabled = !editing;
  });
  editBtn.style.display = editing ? "none" : "inline-block";
  saveBtn.style.display = editing ? "inline-block" : "none";
  cancelBtn.style.display = editing ? "inline-block" : "none";
}

editBtn.addEventListener("click", () => toggleEdit(true));

cancelBtn.addEventListener("click", () => {
  inputs.forEach((input) => {
    const name = input.name;
    input.value = initialData[name] || "";
    input.disabled = true;
  });
  toggleEdit(false);
});

saveBtn.addEventListener("click", async () => {
  const payload = {};
  inputs.forEach((input) => {
    payload[input.name] = input.value;
  });
  try {
    const res = await fetch("/api/auth/profile", {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(res.status);
    const data = await res.json();
    initialData = data;
    toggleEdit(false);
    inputs.forEach((i) => (i.disabled = true));
  } catch (err) {
    console.error("Save profile failed:", err);
  }
});

document.addEventListener("DOMContentLoaded", loadProfile);