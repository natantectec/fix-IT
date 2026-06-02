const WHATSAPP_NUMBER = "972543505185";
let conversationHistory = [];

const jokes = [
  "אין אחריות על חוסר שינה ממחשבים לא עובדים 😄",
  "הבוט לא אחראי על קפה שנשפך על המקלדת. נתן כן.",
  "אם קראת את זה – המחשב שלך עובד. כבר התקדמנו.",
  "טיפ חינמי: כיבוי והדלקה פותר 90% מהבעיות. השאר – נתן.",
  "אנחנו לא אחראים על כעס שנגרם מעדכון Windows בזמן לא מתאים.",
  "הבוט יודע הכל. חוץ מאיפה שמת את כבל ה-HDMI.",
  "אם המחשב עושה רעשים מוזרים – הוא לא מדבר אליך. תתקשר לנתן.",
  "אחריות מלאה על תשובות. אחריות חלקית על רגשות.",
  "Fix-IT – כי 'למה זה לא עובד?!' זו לא שאלה טכנית, זו תפילה.",
  "כל הזכויות שמורות, כל הבעיות – נפתרות.",
  "אנחנו לא שופטים כמה טאבים פתוחים יש לך בדפדפן.",
  "פורמט הוא לא מוות. זה רק... לידה מחדש.",
  "הסוללה שלך מחזיקה 20 דקות? גם אנחנו עייפים לפעמים.",
  "אם הקרנה לא עובדת – בדוק כבל לפני שאתה מתקשר. בבקשה.",
  "Fix-IT: כי גוגל לא תמיד יודע מה הוא אומר.",
  "אנחנו לא אחראים על טראומות ממסך כחול.",
  "הבוט זמין 24/7. נתן – בשעות סבירות.",
  "אם המחשב חם מדי – הוא לא בוער מאהבה. תנקה אבק.",
  "שנה את הסיסמה שלך. כן, עכשיו. כן, שוב.",
  "אנחנו לא שופטים כמה שנים עבר מהפירמוט האחרון שלך.",
  "Windows 11 זה לא עונש. רק מרגיש ככה.",
  "אם הוצאת את הסוללה ושמת בחזרה – כבר עשית יותר מרוב הטכנאים.",
  "RAM זה לא זיכרון רגשי. אבל כשהוא נגמר – כולם סובלים.",
  "אנחנו לא אחראים על קבצים שנמחקו 'בטעות'.",
  "Fix-IT: הבוט שלא ישאל אותך 'ניסית לכבות ולהדליק?'... בסדר, כן ישאל.",
  "המחשב שלך לא שונא אותך. הוא פשוט צריך קצת אהבה טכנית.",
  "אנחנו לא אחראים על החלטות שנעשו אחרי חצות מול מסך בהיר.",
  "אם קראת עד לפה – כנראה שהבעיה שלך לא דחופה כל כך.",
  "כי מחשב תקוע זה לא גורל, זה תור."
];

document.getElementById('joke-line').innerText = jokes[Math.floor(Math.random() * jokes.length)];

async function sendMessage(text = null) {
  const input = document.getElementById("user-input");
  const message = text || input.value.trim();
  if (!message) return;

  document.querySelectorAll(".suggestion").forEach(el => el.closest('.message-wrapper').remove());

  appendMessage("user", message);
  input.value = "";
  autoResize(input);

  conversationHistory.push({ role: "user", content: message });

  const thinkingId = "thinking-" + Date.now();
  appendThinking(thinkingId);

  try {
    const res = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        history: conversationHistory.slice(-10)
      }),
    });

    const data = await res.json();
    removeThinking(thinkingId);

    if (data.message.includes("##WHATSAPP##")) {
      const cleanMessage = data.message.replace("##WHATSAPP##", "").trim();
      appendMessage("bot", cleanMessage);
      appendWhatsAppButton(message);
    } else {
      appendMessage("bot", data.message);
    }

    conversationHistory.push({ role: "assistant", content: data.message });

  } catch (err) {
    removeThinking(thinkingId);
    appendMessage("bot", "⚠️ שגיאה: לא ניתן להתחבר לשרת. נסה שוב.");
  }
}

function appendMessage(sender, text) {
  const box = document.getElementById("chat-box");
  const wrapper = document.createElement("div");
  wrapper.className = `message-wrapper ${sender}`;
  const msg = document.createElement("div");
  msg.className = `bubble ${sender}`;
  msg.innerText = text;
  wrapper.appendChild(msg);
  box.appendChild(wrapper);
  box.scrollTop = box.scrollHeight;
}

function appendThinking(id) {
  const box = document.getElementById("chat-box");
  const wrapper = document.createElement("div");
  wrapper.className = "message-wrapper bot";
  wrapper.id = id;
  const msg = document.createElement("div");
  msg.className = "bubble bot thinking";
  msg.innerHTML = `<span></span><span></span><span></span>`;
  wrapper.appendChild(msg);
  box.appendChild(wrapper);
  box.scrollTop = box.scrollHeight;
}

function removeThinking(id) {
  const el = document.getElementById(id);
  if (el) el.remove();
}

function appendWhatsAppButton(userQuestion) {
  const box = document.getElementById("chat-box");
  const wrapper = document.createElement("div");
  wrapper.className = "message-wrapper bot";
  const encodedMsg = encodeURIComponent(`שלום נתן! יש לי שאלה לגבי: "${userQuestion}"`);
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMsg}`;
  const btn = document.createElement("a");
  btn.href = url;
  btn.target = "_blank";
  btn.className = "whatsapp-btn";
  btn.innerHTML = `<img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" width="20"/> שלח הודעה לנתן`;
  wrapper.appendChild(btn);
  box.appendChild(wrapper);
  box.scrollTop = box.scrollHeight;
}

function handleKey(e) {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
}

function autoResize(el) {
  el.style.height = "auto";
  el.style.height = Math.min(el.scrollHeight, 120) + "px";
}

document.getElementById("user-input").addEventListener("input", function () {
  autoResize(this);
});
