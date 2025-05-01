const form = document.getElementById("chat-form");
const input = document.getElementById("user-input");
const chat = document.getElementById("chat-container");
const loading = document.getElementById("loading");
const suggestions = [
  "המחשב לא נדלק לי",
  "כמה יעלה לי לפרמט?",
  "נשפך לי מים על המחשב",
  "שבר במסך",
  "האם כדאי לתקן או לקנות חדש?",
  "כמה עולה להחליף מקלדת?",
  "יש לי בעיה עם וינדוס",
  "איך מגבים קבצים?",
  "אפשר תיקון מרחוק?",
  "האם כדאי להחליף דיסק קשיח?"
];

// בועות פתיחה רנדומליות
const bubbles = document.getElementById("suggestions");
suggestions.sort(() => 0.5 - Math.random());
suggestions.slice(0, 6).forEach((text) => {
  const b = document.createElement("div");
  b.className = "suggestion";
  b.textContent = text;
  b.onclick = () => {
    input.value = text;
    form.dispatchEvent(new Event("submit"));
  };
  bubbles.appendChild(b);
});

// ברכת פתיחה אוטומטית
appendMessage("Fix-IT", "שלום! אני Fix-IT, העוזר האישי שלך. איך אפשר לעזור לך היום?", "bot");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const msg = input.value.trim();
  if (!msg) return;
  appendMessage("אתה", msg, "user");
  input.value = "";
  showTyping();

  try {
    await delay(1500);
    const res = await fetch("/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: msg })
    });
    const data = await res.json();
    hideTyping();
    appendMessage("Fix-IT", data.reply || "שגיאה בקבלת תשובה", "bot");
  } catch (err) {
    hideTyping();
    appendMessage("Fix-IT", "⚠️ שגיאה בשליחה.", "bot");
  }
});

function appendMessage(sender, text, cls) {
  const div = document.createElement("div");
  div.className = "message " + cls;
  div.innerHTML = `<strong>${sender}:</strong> ${text}`;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

function showTyping() {
  loading.style.display = "block";
}
function hideTyping() {
  loading.style.display = "none";
}
function delay(ms) {
  return new Promise((res) => setTimeout(res, ms));
}