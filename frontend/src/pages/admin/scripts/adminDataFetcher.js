document.addEventListener("DOMContentLoaded", () => {
    const endpoints = {
      races: "/api/races",
      subraces: "/api/subraces",
      skills: "/api/skills",
      talents: "/api/talents",
    };
  
    const fetchAndPopulate = async (endpoint, containerId) => {
      try {
        const response = await fetch(endpoint);
        const data = await response.json();
        const container = document.getElementById(containerId);
        container.innerHTML = "";
  
        data.forEach((item) => {
          const div = document.createElement("div");
          div.textContent = JSON.stringify(item);
          div.classList.add("data-item");
          container.appendChild(div);
        });
      } catch (error) {
        console.error(`Error fetching ${endpoint}:`, error);
      }
    };
  
    // Fetch and populate data
    fetchAndPopulate(endpoints.races, "races-container");
    fetchAndPopulate(endpoints.subraces, "subraces-container");
    fetchAndPopulate(endpoints.skills, "skills-container");
    fetchAndPopulate(endpoints.talents, "talents-container");
  });