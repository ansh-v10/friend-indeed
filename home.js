const button = document.getElementById("submitBtn");
const input = document.getElementById("name");

// Floating hearts animation
const heartsContainer = document.querySelector(".hearts-container");

function createHeart() {
  const heart = document.createElement("div");
  heart.classList.add("heart");
  heart.innerHTML = "💖";
  heart.style.left = Math.random() * 100 + "%";
  heart.style.animationDelay = Math.random() * 2 + "s";
  heartsContainer.appendChild(heart);

  setTimeout(() => {
    heart.remove();
  }, 8000);
}

// Create hearts periodically
setInterval(createHeart, 1000);
for (let i = 0; i < 5; i++) {
  setTimeout(createHeart, i * 300);
}

// function to handle submission
function handleSubmit() {
  const username = input.value.trim();

  if (username === "") {
    alert("Please enter your name 😌");
    return;
  }

  // store name for next pages
  localStorage.setItem("username", username);

  // redirect to next page
  window.location.href = "page1.html";
}

// button click
button.addEventListener("click", handleSubmit);

// enter key press
input.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    handleSubmit();
  }
});
