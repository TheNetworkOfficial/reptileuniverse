/**
 * Caches the authenticated user's profile in sessionStorage to limit
 * repeated API calls when navigating between pages. The profile is
 * refreshed every five minutes.
 */
document.addEventListener("dynamicContentLoaded", async () => {
  const loginLi = document.getElementById("login-container");
  const profileLi = document.getElementById("profile-dropdown");
  const adminLi = document.getElementById("admin-link");
  const usernameElem = profileLi?.querySelector(".profile-username");
  const picElem = profileLi?.querySelector(".profile-pic");
  const logoutBtn = document.getElementById("logout-btn");

  const TTL_MS = 5 * 60 * 1000;
  const cached = sessionStorage.getItem("userProfile");
  let user = null;

  if (cached) {
    try {
      const obj = JSON.parse(cached);
      if (Date.now() - obj.timestamp < TTL_MS) {
        user = obj.data;
      }
    } catch {
      // malformed cache, ignore
    }
  }

  if (!user) {
    try {
      const res = await fetch("/api/auth/profile", {
        method: "GET",
        credentials: "include",
      });
      if (res.ok) {
        user = await res.json();
        sessionStorage.setItem(
          "userProfile",
          JSON.stringify({ data: user, timestamp: Date.now() }),
        );
      }
    } catch (err) {
      console.error("Auth check failed:", err);
    }
  }

  if (user) {
    if (loginLi) loginLi.style.display = "none";
    if (profileLi) profileLi.style.display = "block";
    if (adminLi) adminLi.style.display = user.isAdmin ? "block" : "none";

    if (usernameElem) usernameElem.textContent = user.username;
    if (picElem && user.avatarUrl) picElem.src = user.avatarUrl;

    if (logoutBtn) {
      logoutBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        await fetch("/api/auth/logout", {
          method: "POST",
          credentials: "include",
        });
        sessionStorage.removeItem("userProfile");
        loginLi.style.display = "block";
        profileLi.style.display = "none";
        if (adminLi) adminLi.style.display = "none";
      });
    }
  } else {
    if (loginLi) loginLi.style.display = "block";
    if (profileLi) profileLi.style.display = "none";
    if (adminLi) adminLi.style.display = "none";
  }
});