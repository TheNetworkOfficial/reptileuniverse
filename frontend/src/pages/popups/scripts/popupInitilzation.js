document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded and parsed");

  // List all popup files to load
  let popupsToLoad = [
    "admin-add-skill-popup.html"
  ];
  let loadedPopupsCount = 0;

  // Function to set up popup events for a specific popup container
  function setupPopup(popupId, triggerSelector, closeButtonSelector) {
    const popup = document.getElementById(popupId);
    if (!popup) {
      console.log(`Popup with ID ${popupId} not found.`);
      return;
    }

    const triggers = document.querySelectorAll(triggerSelector);
    const closeButton = popup.querySelector(closeButtonSelector);

    if (triggers.length > 0 && closeButton) {
      console.log(`Setting up popup and triggers for ${popupId}.`);
      triggers.forEach((trigger) => {
        trigger.addEventListener("click", (e) => {
          e.preventDefault();
          console.log(`Displaying popup: ${popupId}`);
          popup.style.display = "flex";
        });
      });

      closeButton.addEventListener("click", () => {
        console.log(`Hiding popup: ${popupId}`);
        popup.style.display = "none";
      });
    } else {
      if (triggers.length === 0)
        console.log(`No triggers found for selector ${triggerSelector}.`);
      if (!closeButton)
        console.log(
          `Close button with selector ${closeButtonSelector} not found in popup ${popupId}.`
        );
    }
  }

  // Initialize events for all popups using a configuration mapping
  function initializePopupEvents() {
    console.log("Initializing popup events...");
    const popupConfigurations = [
      {
        popupId: "skill-popup-container", // ID from admin-add-skill-popup.html
        triggerSelector: "#add-skill-btn"  // Button in adminSkills.html
      }
    ];

    popupConfigurations.forEach((config) => {
      setupPopup(config.popupId, config.triggerSelector, ".close-button");
    });
  }

  // Load a popup's HTML and append it to the body
  function loadPopupHtml(popupFileName) {
    console.log(`Attempting to load ${popupFileName} into body`);
    const placeholder = document.body;
    fetch(popupFileName)
      .then((response) => response.text())
      .then((data) => {
        console.log(`Successfully loaded ${popupFileName}`);
        const popupContainer = document.createElement("div");
        popupContainer.innerHTML = data;
        placeholder.appendChild(popupContainer);
        loadedPopupsCount++;

        // Once all popups are loaded, initialize events and dispatch event
        if (loadedPopupsCount === popupsToLoad.length) {
          initializePopupEvents();
          document.dispatchEvent(new Event("popupsLoaded"));
        }
      })
      .catch((error) => {
        console.error(`Error loading ${popupFileName}:`, error);
        loadedPopupsCount++;
        if (loadedPopupsCount === popupsToLoad.length) {
          initializePopupEvents();
          document.dispatchEvent(new Event("popupsLoaded"));
        }
      });
  }

  // Load each popup file
  popupsToLoad.forEach((popupFileName) => {
    loadPopupHtml(popupFileName);
  });
});