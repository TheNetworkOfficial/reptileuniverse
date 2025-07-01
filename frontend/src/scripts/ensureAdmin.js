// ensureAdmin.js
// Redirect non-admin users away from admin pages

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch("/api/auth/profile", {
      method: "GET",
      credentials: "include",
    });
    if (!res.ok) {
      return (window.location.href = "index.html");
    }
    const user = await res.json();
    if (!user.isAdmin) {
      window.location.href = "index.html";
    }
  } catch (err) {
    console.error("Admin check failed", err);
    window.location.href = "index.html";
  }
});