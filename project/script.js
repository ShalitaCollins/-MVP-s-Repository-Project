const signupForm = document.getElementById("signup-form");
const loginForm = document.getElementById("login-form");
const userInterface = document.getElementById("user-interface");
const videoCallButton = document.getElementById("video-call-button");
const audioCallButton = document.getElementById("audio-call-button");
const chatButton = document.getElementById("chat-button");
const sendMessageButton = document.getElementById("send-message-button");
const messageHistory = document.getElementById("message-history");
const helpButton = document.getElementById("help-button");
const ratingInterface = document.getElementById("rating-interface");
const submitRatingButton = document.getElementById("submit-rating");
const createPassword = document.getElementById("createPassword");
const confirmPassword = document.getElementById("confirmPassword");
const passwordError = document.getElementById("passwordError");
const confirmError = document.getElementById("confirmError");
const localVideo = document.getElementById("localVideo");
const localAudio = document.getElementById("localAudio");
const hangupVideoButton = document.getElementById("hangup-video-button");
const muteVideoButton = document.getElementById("mute-video-button");
const hideCameraButton = document.getElementById("hide-camera-button");
const hangupAudioButton = document.getElementById("hangup-audio-button");
const muteAudioButton = document.getElementById("mute-audio-button");
const getStartedButton = document.getElementById("get-started-button");
let videoStream, audioStream;
let isVideoMuted = false;
let isAudioMuted = false;
let isCameraHidden = false;
let peerConnection;

// Landing Page Logic
getStartedButton.addEventListener("click", () => {
  document.getElementById("landing-page").style.display = "none";
  document.getElementById("signup").style.display = "block";
});

// Signup form validation
signupForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const firstName = document.getElementById("firstName").value;
  const lastName = document.getElementById("lastName").value;
  const phoneNumber = document.getElementById("phoneNumber").value;
  const createPassword = document.getElementById("createPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  // Password validation
  passwordError.textContent = "";
  confirmError.textContent = "";
  if (createPassword.length < 4) {
    passwordError.textContent = "Too low";
  }
  if (confirmPassword !== createPassword) {
    confirmError.textContent = "Error occurred. Retype your password again";
  }

  if (createPassword.length >= 4 && confirmPassword === createPassword) {
    // Store signup data in local storage (or send to a backend)
    localStorage.setItem("firstName", firstName);
    localStorage.setItem("lastName", lastName);
    localStorage.setItem("phoneNumber", phoneNumber);
    localStorage.setItem("password", createPassword);

    // Hide signup form and show login form
    document.getElementById("signup").style.display = "none";
    document.getElementById("login").style.display = "block";
  }
});

// Login form submission
loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  // Retrieve signup data from local storage (or backend)
  const storedFirstName = localStorage.getItem("firstName");
  const storedPassword = localStorage.getItem("password");

  if (username === storedFirstName && password === storedPassword) {
    // Successful login
    document.getElementById("login").style.display = "none";
    userInterface.style.display = "block";
  } else {
    alert("Invalid username or password");
  }
});

// Video call functionality
videoCallButton.addEventListener("click", async () => {
  try {
    videoStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localVideo.srcObject = videoStream;
    document.getElementById("available call-options").style.display = "none";
    document.getElementById("video-call-interface").style.display = "block";

    // ... (WebRTC setup for video call using a library) ...

  } catch (err) {
    console.error("Error accessing media devices:", err);
    alert("Error accessing your camera and/or microphone.");
  }
});

// Audio call functionality
audioCallButton.addEventListener("click", async () => {
  try {
    audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    localAudio.srcObject = audioStream;
    document.getElementById("available call-options").style.display = "none";
    document.getElementById("audio-call-interface").style.display = "block";

    // ... (WebRTC setup for audio call using a library) ...

  } catch (err) {
    console.error("Error accessing media devices:", err);
    alert("Error accessing your microphone.");
  }
});

// Event listener for chat button
chatButton.addEventListener("click", () => {
  // Hide the call options and show the messaging interface
  document.getElementById("available call-options").style.display = "none";
  document.getElementById("messaging-interface").style.display = "block";
});

// Event listener for send message button
sendMessageButton.addEventListener("click", () => {
  const message = document.getElementById("message-input").value;
  if (message) {
    // Code to send the message to the messaging backend or display it in the chat history
    // ...
    document.getElementById("message-input").value = ""; // Clear input field after sending
    messageHistory.innerHTML += `<p>You: ${message}</p>`; // Display sent message in history
    // Show the rating interface after sending a message
    ratingInterface.style.display = "block";
  }
});

// Event listener for help button
helpButton.addEventListener("click", () => {
  // Redirect to a help page or display a help modal
  // You would likely use window.location.href to navigate to a help page, or a modal library to show a help dialog.
  alert("Help content will be displayed here. This is a placeholder.");
  // You could also have a "Back" button on the help page to return to the login interface.
});

// Event listener for submit rating button
submitRatingButton.addEventListener("click", () => {
  // Get the selected rating value
  const selectedRating = document.querySelector('input[name="rating"]:checked').value;
  alert(`Thank you for rating the platform ${selectedRating} out of 5!`);
  // You could use this rating value to send it to a backend for analytics or feedback.
});

// Password validation
createPassword.addEventListener("input", () => {
  if (createPassword.value.length < 4) {
    passwordError.textContent = "Too low";
  } else {
    passwordError.textContent = "";
  }
});

confirmPassword.addEventListener("input", () => {
  if (confirmPassword.value !== createPassword.value) {
    confirmError.textContent = "Error occurred. Retype your password again";
  } else {
    confirmError.textContent = "";
  }
});

// Hang up video call
hangupVideoButton.addEventListener("click", () => {
  if (videoStream) {
    videoStream.getTracks().forEach(track => track.stop());
    videoStream = null;
    localVideo.srcObject = null;
    document.getElementById("video-call-interface").style.display = "none";
    document.getElementById("user-interface").style.display = "none";
    document.getElementById("login").style.display = "block"; // Redirect to login
  }
});

// Mute/Unmute video call
muteVideoButton.addEventListener("click", () => {
  if (videoStream) {
    isVideoMuted = !isVideoMuted;
    videoStream.getTracks().forEach(track => {
      if (track.kind === 'audio') {
        track.enabled = !isVideoMuted;
      }
    });
    muteVideoButton.textContent = isVideoMuted ? "Unmute" : "Mute";
  }
});

// Hide/Show camera
hideCameraButton.addEventListener("click", () => {
  if (videoStream) {
    isCameraHidden = !isCameraHidden;
    if (isCameraHidden) {
      localVideo.srcObject = null;
      localVideo.textContent = "Camera off";
    } else {
      localVideo.srcObject = videoStream;
    }
    hideCameraButton.textContent = isCameraHidden ? "Show Camera" : "Hide Camera";
  }
});

// Hang up audio call
hangupAudioButton.addEventListener("click", () => {
  if (audioStream) {
    audioStream.getTracks().forEach(track => track.stop());
    audioStream = null;
    localAudio.srcObject = null;
    document.getElementById("audio-call-interface").style.display = "none";
    document.getElementById("user-interface").style.display = "none";
    document.getElementById("login").style.display = "block"; // Redirect to login
  }
});

// Mute/Unmute audio call
muteAudioButton.addEventListener("click", () => {
  if (audioStream) {
    isAudioMuted = !isAudioMuted;
    audioStream.getTracks().forEach(track => {
      if (track.kind === 'audio') {
        track.enabled = !isAudioMuted;
      }
    });
    muteAudioButton.textContent = isAudioMuted ? "Unmute" : "Mute";
  }
});

