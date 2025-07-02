// loadSpeciesFilter.js

document.addEventListener("DOMContentLoaded", () => {
  const speciesSelect = document.getElementById("filter-species");
  if (!speciesSelect) return;

  // Use a relative path so this works when the site is served from a
  // subdirectory.
  fetch("/api/reptiles/species")
    .then((res) => {
      if (!res.ok) throw new Error(`Fetch error: ${res.status}`);
      return res.json();
    })
    .then((speciesList) => {
      speciesList.forEach((s) => {
        const option = document.createElement("option");
        option.value = s.toLowerCase();
        option.textContent = s;
        speciesSelect.appendChild(option);
      });
    })
    .catch((err) => {
      console.error("Error loading species list:", err);
    });
});