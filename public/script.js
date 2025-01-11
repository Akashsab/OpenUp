const socket = io();
const usernameInput = document.getElementById("username");
const joinBtn = document.getElementById("join-btn");
const roomInput = document.getElementById("room-name");
const joinRoomBtn = document.getElementById("join-room-btn");
const messagesContainer = document.getElementById("messages");
const messageInput = document.getElementById("message-input");
const sendBtn = document.getElementById("send-btn");
const chatBox = document.getElementById("chat-box");
const clearChatBtn = document.getElementById("clear-chat-btn");

let username = "";
let room = "";

// Join Chat
joinBtn.addEventListener("click", () => {
  username = usernameInput.value.trim();
  if (username) {
    document.getElementById("user-setup").classList.add("hidden");
    chatBox.classList.remove("hidden");
  } else {
    alert("Please enter a username.");
  }
});

// Join Room
joinRoomBtn.addEventListener("click", () => {
  const newRoom = roomInput.value.trim();
  if (newRoom) {
    if (room) {
      // Leave the current room before joining a new one
      socket.emit("leaveRoom", { username, room });
      addMessage(`You left the room: ${room}`, "system");
    }
    room = newRoom;
    socket.emit("joinRoom", { username, room });
    addMessage(`You joined the room: ${room}`, "system");

    // Reset event listeners to avoid duplicates
    socket.off("message").on("message", (data) => {
      if (data.username === username) {
        addMessage(`You: ${data.message}`, "sent");
      } else {
        addMessage(`${data.username}: ${data.message}`, "received");
      }
    });
  } else {
    alert("Please enter a room name.");
  }
});

// Send Message
sendBtn.addEventListener("click", () => {
  const message = messageInput.value.trim();
  if (message) {
    socket.emit("chatMessage", { username, room, message });
    messageInput.value = "";
  }
});

// Add Message to Chat
function addMessage(content, type) {
  const message = document.createElement("div");
  message.classList.add("message", type);
  message.textContent = content;
  messagesContainer.appendChild(message);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Clear Chat Functionality
clearChatBtn.addEventListener("click", () => {
  messagesContainer.innerHTML = "";
  addMessage("Chat has been cleared!", "system");
});
