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

// Import your default avatar
import defaultAvatar         from '../../../assets/images/icons/defaultAvatar.png';

const sampleAnimals = [
  { id: 1, name: 'Tina',     species: 'Allosaurus',           img: allosaurusImg         },
  { id: 2, name: 'Drago',    species: 'Ball Python',          img: ballPythonImg         },
  { id: 3, name: 'Mortimer', species: 'Bearded Dragon',       img: beardedDragonImg      },
  { id: 4, name: 'Flash',    species: 'Blue Tongue Skink',    img: blueTongueSkinkImg    },
  { id: 5, name: 'Cornie',   species: 'Corn Snake',           img: cornSnakeImg          },
  { id: 6, name: 'Doug',     species: 'Crested Gecko',       img: crestedGeckoImg       },
  { id: 7, name: 'Leo',      species: 'Leopard Gecko',        img: leopardGeckoImg       },
  { id: 8, name: 'Emily',    species: 'Red Tail Boa',         img: redTailBoaImg         },
  { id: 9, name: 'Sheldon',  species: 'Tortoise',             img: tortoiseImg           },
  { id:10, name: 'Blue',     species: 'Western Fence Lizard', img: westernFenceLizardImg }
];

window.addEventListener('DOMContentLoaded', () => {
  // Read submitted name from URL
  const params = new URLSearchParams(window.location.search);
  const reptileName = params.get('reptileDescription')?.trim().toLowerCase() || '';

  // Find matching animal
  const animal = sampleAnimals.find(
    a => a.name.toLowerCase() === reptileName
  );

  const imgEl = document.getElementById('animal-image');

  if (animal && animal.img) {
    imgEl.src = animal.img;
    imgEl.alt = animal.name;
  } else {
    // Fallback to default avatar
    imgEl.src = defaultAvatar;
    imgEl.alt = 'Default Avatar';
  }

  // Return to home
  document.getElementById('home-button').addEventListener('click', () => {
    window.location.href = 'index.html';
  });
});