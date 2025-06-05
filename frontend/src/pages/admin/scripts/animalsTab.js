document.addEventListener('DOMContentLoaded', () => {
  const tableBody = document.getElementById('animal-table-body');
  const nameInput = document.getElementById('filter-name');
  const speciesInput = document.getElementById('filter-species');
  const filterBtn = document.getElementById('filter-btn');

  let animals = [];

  async function loadAnimals() {
    try {
      const res = await fetch('/api/reptiles');
      animals = await res.json();
      displayAnimals(animals);
    } catch (err) {
      console.error('Error loading reptiles:', err);
    }
  }

  function displayAnimals(list) {
    tableBody.innerHTML = '';
    list.forEach((a) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${a.name}</td>
        <td>${a.species}</td>
        <td>${a.sex || ''}</td>
        <td>${a.age || ''}</td>
        <td>${a.location || ''}</td>`;
      tableBody.appendChild(row);
    });
  }

  function applyFilters() {
    const name = nameInput.value.toLowerCase();
    const species = speciesInput.value.toLowerCase();

    const filtered = animals.filter((a) => {
      const nameMatch = !name || a.name.toLowerCase().includes(name);
      const speciesMatch = !species || a.species.toLowerCase().includes(species);
      return nameMatch && speciesMatch;
    });

    displayAnimals(filtered);
  }

  filterBtn.addEventListener('click', applyFilters);

  loadAnimals();
});