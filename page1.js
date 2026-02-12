const welcomeText = document.getElementById("welcomeText");
const agreeBtn = document.getElementById("agreeBtn");

// Sparkles animation
const sparklesContainer = document.querySelector(".sparkles-container");

function createSparkle() {
  const sparkle = document.createElement("div");
  sparkle.classList.add("sparkle");
  sparkle.innerHTML = "✨";
  sparkle.style.left = Math.random() * 100 + "%";
  sparkle.style.top = Math.random() * 100 + "%";
  sparkle.style.animationDelay = Math.random() * 2 + "s";
  sparklesContainer.appendChild(sparkle);

  setTimeout(() => {
    sparkle.remove();
  }, 3000);
}

// Create sparkles periodically
setInterval(createSparkle, 600);
for (let i = 0; i < 8; i++) {
  setTimeout(createSparkle, i * 200);
}

// get stored name
const username = localStorage.getItem("username");

// if user comes here directly without entering name
if (!username) {
  window.location.href = "index.html";
} else {
  welcomeText.textContent = `Welcome, ${username} 💖`;
}

// proceed after accepting terms
agreeBtn.addEventListener("click", () => {
  // optional: store acceptance
  localStorage.setItem("termsAccepted", "true");

  // go to next page
  window.location.href = "page2.html";
});
