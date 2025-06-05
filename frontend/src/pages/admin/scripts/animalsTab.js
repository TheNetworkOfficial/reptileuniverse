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
        <td>${a.location || ''}</td>
        <td>${a.traits || ''}</td>
        <td>${a.bio || ''}</td>
        <td>${a.requirements || ''}</td>
        <td>${(a.image_urls || []).join(', ')}</td>`;
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

  document.addEventListener('popupsLoaded', () => {
    const form = document.getElementById('add-animal-form');
    const cancelBtn = document.getElementById('cancel-add-animal');
    const popup = document.getElementById('animal-popup-container');

    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const images = form.image_urls.value
          ? form.image_urls.value.split(',').map((s) => s.trim()).filter(Boolean)
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
          const res = await fetch('/api/reptiles', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          });
          if (res.ok) {
            form.reset();
            if (popup) popup.style.display = 'none';
            loadAnimals();
          }
        } catch (err) {
          console.error('Error adding animal:', err);
        }
      });
    }

    if (cancelBtn && popup) {
      cancelBtn.addEventListener('click', () => {
        popup.style.display = 'none';
      });
    }
  });

  loadAnimals();
});
frontend/src/pages/popups/admin-add-animal-popup.html
New
