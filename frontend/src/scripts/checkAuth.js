// checkAuth.js

// Check if user is logged in
fetch("http://localhost:3000/api/profile", {
  method: "GET",
  credentials: "include",
})
  .then((response) => {
    if (response.status === 200) {
      return response.json();
    } else {
      // User is not logged in
      window.location.href = "login.html";
    }
  })
  .then((data) => {
    // User is logged in
    const welcomeMessage = document.getElementById("welcome-message");
    if (welcomeMessage) {
      welcomeMessage.innerText = `Welcome, ${data.username}!`;
    }
  })
  .catch((error) => console.error("Error:", error));
