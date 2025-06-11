document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      const res = await fetch("/api/adoption-apps", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) {
        alert(json.error || "Submission failed");
        return;
      }
      window.location.href = "confirmation.html";
    } catch (err) {
      console.error("Submission error:", err);
      alert("Submission failed");
    }
  });
});