// Optional: Fetch user info to personalize the page
async function fetchUser() {
  try {
    const res = await fetch("/api/auth/me", {
      method: "GET",
      credentials: "include",
    });

    if (res.ok) {
      const data = await res.json();
      document.getElementById("userInfo").innerText = `👤 Hello, ${
        data.data.name || data.data.email || "User"
      }!`;
    }
  } catch (err) {
    console.error("Error fetching user info:", err);
  }
}

// Logout function
async function logout() {
  await fetch("/api/auth/logout", {
    method: "POST",
    credentials: "include",
  });
  window.location.href = "/";
}

fetchUser(); // Call when page loads
