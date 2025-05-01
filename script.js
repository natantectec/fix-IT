async function sendMessage(text = null) {
  const input = document.getElementById("user-input");
  const message = text || input.value.trim();
  if (!message) return;

  appendMessage("user", message);
  input.value = "";
  appendMessage("bot", "חושב...");

  try {
    const res = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
    const data = await res.json();

    document.querySelectorAll(".bot").forEach(el => el.remove()); // הסר את "חושב"
    appendMessage("bot", data.message);
  } catch (err) {
    appendMessage("bot", "שגיאה: לא ניתן להתחבר לשרת.");
  }
}

function appendMessage(sender, text) {
  const box = document.getElementById("chat-box");
  const msg = document.createElement("div");
  msg.className = bubble ${sender};
  msg.innerText = text;
  box.appendChild(msg);
  box.scrollTop = box.scrollHeight;
}

function handleKey(e) {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
}