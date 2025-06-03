// creatureFeature.js
import allosaurusImg         from '../../../assets/images/animals/allosaurus.jpg';
import ballPythonImg         from '../../../assets/images/animals/ballPython.jpg';
import beardedDragonImg      from '../../../assets/images/animals/beardedDragon.jpg';
import blueTongueSkinkImg    from '../../../assets/images/animals/blueTongueSkink.jpg';
import cornSnakeImg          from '../../../assets/images/animals/cornSnake.jpg';
import crestedGeckoImg       from '../../../assets/images/animals/crestedGecko.jpg';
import leopardGeckoImg       from '../../../assets/images/animals/leopardGecko.jpg';
import redTailBoaImg         from '../../../assets/images/animals/redTailBoa.jpg';
import tortoiseImg           from '../../../assets/images/animals/tortoise.jpg';
import westernFenceLizardImg from '../../../assets/images/animals/westernFenceLizard.jpg';

const sampleAnimals = [
  { id: 1, name: 'Tina',     species: 'Allosaurus',           img: allosaurusImg         },
  { id: 2, name: 'Drago',    species: 'Ball Python',          img: ballPythonImg         },
  { id: 3, name: 'Mortimer', species: 'Bearded Dragon',       img: beardedDragonImg      },
  { id: 4, name: 'Flash',    species: 'Blue Tongue Skink',    img: blueTongueSkinkImg    },
  { id: 5, name: 'Cornie',   species: 'Corn Snake',           img: cornSnakeImg          },
  { id: 6, name: 'Doug',     species: 'Creasted Gecko',       img: crestedGeckoImg       },
  { id: 7, name: 'Leo',      species: 'Leopard Gecko',        img: leopardGeckoImg       },
  { id: 8, name: 'Emily',    species: 'Red Tail Boa',         img: redTailBoaImg         },
  { id: 9, name: 'Sheldon',  species: 'Tortoise',             img: tortoiseImg           },
  { id:10, name: 'Blue',     species: 'Western Fence Lizard', img: westernFenceLizardImg }
];

document.addEventListener('DOMContentLoaded', () => {
  const list = document.getElementById('creature-feature-list');

  // 1) Render only the first 9 real animals
  sampleAnimals.slice(0, 9).forEach(a => {
    const tile = document.createElement('a');
    tile.href      = `details.html?id=${a.id}`;
    tile.className = 'animal-tile';
    tile.innerHTML = `
      <img src="${a.img}" alt="${a.species}" />
      <div class="tile-info">
        <h3>${a.name}</h3>
        <p>${a.species}</p>
      </div>`;
    list.appendChild(tile);
  });

  // 2) Append the “See All” tile in the 10th spot
  const seeAll = document.createElement('a');
  seeAll.href      = 'list.html';
  seeAll.className = 'animal-tile see-all';
  seeAll.innerHTML = `
    <div class="tile-info">
      <i class="fas fa-th-large see-all-icon"></i>
      <h3>See All</h3>
    </div>`;
  list.appendChild(seeAll);
});