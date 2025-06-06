let allAnimals = [];

document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('search-name');
  const filterSelect = document.getElementById('filter-species');
  const searchButton = document.getElementById('search-btn');
  const tileContainer = document.querySelector('.tile-container');
  if (!tileContainer) return;

  // Helper to render a given array of animal objects
  function renderAnimals(animals) {
    tileContainer.innerHTML = '';
    if (animals.length === 0) {
      tileContainer.innerHTML = '<p>No results found.</p>';
      return;
    }

    animals.forEach(animal => {
      const tile = document.createElement('a');
      tile.href = `details.html?id=${animal.id}`;
      tile.className = 'animal-tile';

      const imgSrc =
        Array.isArray(animal.image_urls) && animal.image_urls.length > 0
          ? animal.image_urls[0]
          : '/path/to/defaultImage.jpg';

      tile.innerHTML = `
        <img src="${imgSrc}" alt="${animal.species}" />
        <div class="tile-info">
          <h3>${animal.name}</h3>
          <p>${animal.species}</p>
        </div>
      `;
      tileContainer.appendChild(tile);
    });
  }

  // Initial fetch of all reptiles
  fetch('/api/reptiles')
    .then(res => {
      if (!res.ok) throw new Error(`Fetch error: ${res.status}`);
      return res.json();
    })
    .then(data => {
      allAnimals = data;
      renderAnimals(allAnimals);
    })
    .catch(err => {
      console.error('Error loading reptile list:', err);
      tileContainer.innerHTML = '<p>Error loading animals.</p>';
    });

  // Wire up search + filter button
  searchButton.addEventListener('click', () => {
    const nameQuery = searchInput.value.trim().toLowerCase();
    const speciesQuery = filterSelect.value.trim().toLowerCase();

    const filtered = allAnimals.filter(a => {
      const matchesName = a.name.toLowerCase().includes(nameQuery);
      const matchesSpecies =
        speciesQuery === '' ||
        a.species.toLowerCase() === speciesQuery;
      return matchesName && matchesSpecies;
    });
    renderAnimals(filtered);
  });
});