const question = document.getElementById("question");
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const container = document.querySelector(".container");
const btnGroup = document.querySelector(".btn-group");
const floatingHearts = document.querySelector(".floating-hearts");

let noInteractCount = 0;
let yesScale = 1;

const EMAILJS_PUBLIC_KEY = "eP2hkjX3RMgkkRXMY";
const EMAILJS_SERVICE_ID = "service_4s4j60r"; 
const EMAILJS_TEMPLATE_ID = "template_oru2dsd"; 

(function() {
  if (typeof emailjs !== 'undefined') {
    emailjs.init(EMAILJS_PUBLIC_KEY);
  }
})();

// Question text
const username = localStorage.getItem("username") || "XYZ";
question.textContent = `${username}, will you be my Valentine? 💖`;

// Set initial NO button position (centered below YES button)
function setInitialNoPosition() {
  const groupRect = btnGroup.getBoundingClientRect();
  const yesRect = yesBtn.getBoundingClientRect();
  const noBtnRect = noBtn.getBoundingClientRect();
  
  // Calculate YES button center relative to button group
  const yesCenterX = yesRect.left - groupRect.left + yesRect.width / 2;
  const yesBottom = yesRect.bottom - groupRect.top;
  
  // Position NO button exactly centered below YES button
  const gap = 28; // Gap between buttons
  const noBtnLeft = yesCenterX;
  const noBtnTop = yesBottom + gap;
  
  noBtn.style.left = `${noBtnLeft}px`;
  noBtn.style.top = `${noBtnTop}px`;
  noBtn.style.transform = 'none';
}

// Initialize position on load with delay to ensure buttons are rendered
window.addEventListener("DOMContentLoaded", () => {
  // Call immediately
  setInitialNoPosition();
  
  // Call again after short delay to ensure proper rendering
  setTimeout(setInitialNoPosition, 100);
});

// SUPER FAST cursor tracking - IMPOSSIBLE TO CATCH mode
let isTracking = true;
let lastFrameTime = 0;

function trackCursor(e) {
  if (!isTracking) return;
  
  // High-frequency updates
  const now = performance.now();
  if (now - lastFrameTime < 8) return; // ~120fps
  lastFrameTime = now;
  
  const groupRect = btnGroup.getBoundingClientRect();
  const noBtnRect = noBtn.getBoundingClientRect();
  const yesRect = yesBtn.getBoundingClientRect();
  
  // Cursor position relative to button group
  const cursorX = e.clientX - groupRect.left;
  const cursorY = e.clientY - groupRect.top;
  
  // Current NO button center
  const noBtnCenterX = noBtnRect.left - groupRect.left + noBtnRect.width / 2;
  const noBtnCenterY = noBtnRect.top - groupRect.top + noBtnRect.height / 2;
  
  // Distance from cursor to NO button
  const dx = noBtnCenterX - cursorX;
  const dy = noBtnCenterY - cursorY;
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  // Activation distance - button only moves when cursor is VERY close (20px)
  const activationDistance = 45;
  
  if (distance < activationDistance && distance > 0) {
    noInteractCount++;
    
    // Escape direction (away from cursor)
    const escapeAngle = Math.atan2(dy, dx);
    
    // MUCH FASTER movement - based on how close cursor is
    const urgency = (activationDistance - distance) / activationDistance;
    const baseSpeed = 150; // Increased from 80
    const moveDistance = baseSpeed * (0.5 + urgency * 1.5); // More aggressive scaling
    
    // Calculate new position with instant escape
    let newX = noBtnCenterX + Math.cos(escapeAngle) * moveDistance - noBtnRect.width / 2;
    let newY = noBtnCenterY + Math.sin(escapeAngle) * moveDistance - noBtnRect.height / 2;
    
    // Boundary constraints with padding
    const padding = 15;
    const maxX = groupRect.width - noBtnRect.width - padding;
    const maxY = groupRect.height - noBtnRect.height - padding;
    
    // Keep within bounds
    newX = Math.max(padding, Math.min(newX, maxX));
    newY = Math.max(padding, Math.min(newY, maxY));
    
    // Avoid YES button with larger safe zone
    const yesCenterX = yesRect.left - groupRect.left + yesRect.width / 2;
    const yesCenterY = yesRect.top - groupRect.top + yesRect.height / 2;
    
    const distToYes = Math.sqrt(
      Math.pow(newX + noBtnRect.width / 2 - yesCenterX, 2) +
      Math.pow(newY + noBtnRect.height / 2 - yesCenterY, 2)
    );
    
    const minDistToYes = (yesRect.width / 2 + noBtnRect.width / 2) + 50; // Larger safe zone
    
    if (distToYes < minDistToYes) {
      // Push strongly away from YES button
      const angleFromYes = Math.atan2(
        newY + noBtnRect.height / 2 - yesCenterY,
        newX + noBtnRect.width / 2 - yesCenterX
      );
      
      newX = yesCenterX + Math.cos(angleFromYes) * (minDistToYes + 20) - noBtnRect.width / 2;
      newY = yesCenterY + Math.sin(angleFromYes) * (minDistToYes + 20) - noBtnRect.height / 2;
      
      // Re-apply bounds
      newX = Math.max(padding, Math.min(newX, maxX));
      newY = Math.max(padding, Math.min(newY, maxY));
    }
    
    // If cornered, jump to opposite corner
    const edgeThreshold = 30;
    const isCornered = (
      (newX < edgeThreshold || newX > maxX - edgeThreshold) &&
      (newY < edgeThreshold || newY > maxY - edgeThreshold)
    );
    
    if (isCornered) {
      // Jump to opposite side
      if (newX < groupRect.width / 2) {
        newX = maxX - 20;
      } else {
        newX = padding + 20;
      }
      if (newY < groupRect.height / 2) {
        newY = maxY - 20;
      } else {
        newY = padding + 20;
      }
    }
    
    // Apply position INSTANTLY (no transition for zero latency)
    noBtn.style.transition = 'none';
    noBtn.style.left = `${newX}px`;
    noBtn.style.top = `${newY}px`;
    
    // Grow YES button faster
    yesScale = Math.min(yesScale + 0.05, 2.5); // Grows bigger and faster
    yesBtn.style.transform = `translate(-50%, -50%) scale(${yesScale})`;
    
    // Alert at interaction 15
    if (noInteractCount === 15) {
      setTimeout(() => {
        alert("Are you absolutely sure? 🥺");
      }, 10);
    }
    
    // Extra alert at interaction 30
    if (noInteractCount === 30) {
      setTimeout(() => {
        alert("Really? Not even a little bit? 💔");
      }, 10);
    }
  }
}

// Desktop: track mouse movement continuously
document.addEventListener("mousemove", trackCursor);

// Mobile: track touch movement - only for NO button area
let touchTrackingInterval;
let lastTouchPos = { x: 0, y: 0 };

// Track touches anywhere on the button group but allow YES button to be clickable
btnGroup.addEventListener("touchstart", (e) => {
  const touch = e.touches[0];
  lastTouchPos = { x: touch.clientX, y: touch.clientY };
  
  // Check if touch is on YES button
  const yesRect = yesBtn.getBoundingClientRect();
  const touchingYes = (
    touch.clientX >= yesRect.left &&
    touch.clientX <= yesRect.right &&
    touch.clientY >= yesRect.top &&
    touch.clientY <= yesRect.bottom
  );
  
  // Only prevent default and track if NOT touching YES button
  if (!touchingYes) {
    e.preventDefault();
    
    // Start continuous tracking
    touchTrackingInterval = setInterval(() => {
      trackCursor({ 
        clientX: lastTouchPos.x, 
        clientY: lastTouchPos.y 
      });
    }, 16);
    
    trackCursor({ clientX: touch.clientX, clientY: touch.clientY });
  }
}, { passive: false });

btnGroup.addEventListener("touchmove", (e) => {
  const touch = e.touches[0];
  lastTouchPos = { x: touch.clientX, y: touch.clientY };
  
  // Check if touch is on YES button
  const yesRect = yesBtn.getBoundingClientRect();
  const touchingYes = (
    touch.clientX >= yesRect.left &&
    touch.clientX <= yesRect.right &&
    touch.clientY >= yesRect.top &&
    touch.clientY <= yesRect.bottom
  );
  
  // Only prevent and track if NOT touching YES button
  if (!touchingYes) {
    e.preventDefault();
    trackCursor({ clientX: touch.clientX, clientY: touch.clientY });
  }
}, { passive: false });

btnGroup.addEventListener("touchend", (e) => {
  // Check if touch ended on YES button
  const touch = e.changedTouches[0];
  const yesRect = yesBtn.getBoundingClientRect();
  const touchingYes = (
    touch.clientX >= yesRect.left &&
    touch.clientX <= yesRect.right &&
    touch.clientY >= yesRect.top &&
    touch.clientY <= yesRect.bottom
  );
  
  // Only prevent if NOT on YES button
  if (!touchingYes) {
    e.preventDefault();
  }
  
  if (touchTrackingInterval) {
    clearInterval(touchTrackingInterval);
  }
}, { passive: false });

// Completely prevent NO button clicks
noBtn.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();
  e.stopImmediatePropagation();
  return false;
});

noBtn.addEventListener("touchend", (e) => {
  e.preventDefault();
  e.stopPropagation();
  e.stopImmediatePropagation();
  return false;
});

noBtn.addEventListener("mousedown", (e) => {
  e.preventDefault();
  e.stopPropagation();
  return false;
});

// Make NO button even harder to catch on hover
noBtn.addEventListener("mouseenter", (e) => {
  trackCursor(e);
});

/* ---------- YES BUTTON ---------- */
function handleYesClick() {
  isTracking = false; // Stop tracking
  
  // Send email notification with name and time
  const username = localStorage.getItem("username") || "Someone";
  const currentTime = new Date().toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  
  // Send email via EmailJS
  if (typeof emailjs !== 'undefined' && EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY') {
    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
      from_name: username,
      timestamp: currentTime,
      message: `${username} said YES to being your Valentine! 💖`
    })
    .then(() => {
      console.log('Email notification sent successfully! 💌');
    })
    .catch((error) => {
      console.error('Email notification failed:', error);
    });
  } else {
    console.log('EmailJS not configured. Would have sent:', {
      name: username,
      time: currentTime
    });
  }
  
  // Continue with celebration
  launchConfetti();
  showFinalMessage();
}

// Handle both click and touch events for YES button
yesBtn.addEventListener("click", handleYesClick);
yesBtn.addEventListener("touchend", (e) => {
  e.preventDefault(); // Prevent double-firing with click event
  handleYesClick();
});

/* ---------- FINAL MESSAGE ---------- */
function showFinalMessage() {
  container.innerHTML = `
    <div class="success-message">
      <h1>YAYYY 💖</h1>
      <h2>You just made someone very happy 😌</h2>
      <p>This is officially the beginning of something adorable.</p>
    </div>
  `;
  document.body.classList.add("celebrate");
  
  // Heart explosion
  for (let i = 0; i < 30; i++) {
    setTimeout(() => createFloatingHeart(), i * 80);
  }
}

/* ---------- CONFETTI ---------- */
function launchConfetti() {
  if (typeof confetti !== 'undefined') {
    // Main burst
    confetti({
      particleCount: 200,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#ff2e88', '#ff69b4', '#ffc0cb', '#ffffff']
    });
    
    // Left burst
    setTimeout(() => {
      confetti({
        particleCount: 120,
        angle: 60,
        spread: 60,
        origin: { x: 0, y: 0.7 },
        colors: ['#ff2e88', '#ff69b4', '#ffc0cb']
      });
    }, 200);
    
    // Right burst
    setTimeout(() => {
      confetti({
        particleCount: 120,
        angle: 120,
        spread: 60,
        origin: { x: 1, y: 0.7 },
        colors: ['#ff2e88', '#ff69b4', '#ffc0cb']
      });
    }, 350);
    
    // Top burst
    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 100,
        origin: { y: 0.3 },
        colors: ['#ff2e88', '#ff69b4', '#ffc0cb', '#ffffff']
      });
    }, 500);
  }
}

// Load confetti library
loadConfettiLibrary();

function loadConfettiLibrary() {
  const script = document.createElement("script");
  script.src = "https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js";
  document.head.appendChild(script);
}

// Floating hearts
function createFloatingHeart() {
  const heart = document.createElement("div");
  heart.classList.add("heart-float");
  heart.innerHTML = "💖";
  heart.style.left = Math.random() * 100 + "%";
  heart.style.animationDelay = Math.random() * 1 + "s";
  heart.style.fontSize = (Math.random() * 15 + 20) + "px";
  floatingHearts.appendChild(heart);

  setTimeout(() => {
    heart.remove();
  }, 4000);
}

// Create ambient hearts
setInterval(createFloatingHeart, 800);

// Initial hearts
for (let i = 0; i < 6; i++) {
  setTimeout(createFloatingHeart, i * 200);
}
