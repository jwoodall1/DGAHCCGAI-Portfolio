// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
  console.log('Portfolio loaded');

  // Create starfield background
  createStarfield(150);

  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');

  navToggle.addEventListener('click', function() {
    mainNav.classList.toggle('active');
  });
});

// Function to create starfield background
function createStarfield(numStars) {
  const starfield = document.getElementById('starfield');
  starfield.innerHTML = "";
  for (let i = 0; i < numStars; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    star.style.left = Math.random() * 100 + 'vw';
    star.style.top = Math.random() * 100 + 'vh';
    const size = Math.random() * 2 + 1;
    star.style.width = size + 'px';
    star.style.height = size + 'px';
    star.style.animationDelay = Math.random() * 5 + 's';
    starfield.appendChild(star);
  }
}

// ml5.js Pose Detection and Hover-Click Functionality
let video;
let poseNet;
let poses = [];
let trackingEnabled = true;
const hoverDuration = 2000; // 2 seconds
const buttonTimers = {};

document.getElementById("toggleHoverClick").addEventListener("click", () => {
  trackingEnabled = !trackingEnabled;
  document.getElementById("toggleHoverClick").textContent = trackingEnabled ? "Disable Hover Click" : "Enable Hover Click";
});

function setup() {
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();

  poseNet = ml5.poseNet(video, modelLoaded);
  poseNet.on("pose", function(results) {
    poses = results;
  });
}

function modelLoaded() {
  console.log("PoseNet model loaded!");
}

function draw() {
  if (!trackingEnabled) return;
  
  if (poses.length > 0) {
    const keypoints = poses[0].pose.keypoints;
    const indexFinger = keypoints.find(k => k.part === "indexFinger");
    
    if (indexFinger && indexFinger.score > 0.5) {
      const fingerX = indexFinger.position.x;
      const fingerY = indexFinger.position.y;
      
      document.querySelectorAll(".trackable").forEach(button => {
        const rect = button.getBoundingClientRect();
        
        if (fingerX >= rect.left && fingerX <= rect.right &&
            fingerY >= rect.top && fingerY <= rect.bottom) {
          if (!buttonTimers[button]) {
            buttonTimers[button] = Date.now();
          }
          if (Date.now() - buttonTimers[button] > hoverDuration) {
            button.click();
            delete buttonTimers[button];
          }
        } else {
          delete buttonTimers[button];
        }
      });
    }
  }
}

// Start ml5.js when the page loads
window.onload = () => {
  setup();
  setInterval(draw, 100); // Run every 100ms
};
