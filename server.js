import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import OpenAI from 'openai';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

app.use(express.static(__dirname));
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

let priceData = fs.readFileSync(path.join(__dirname, 'Natan-Tec_Price_List_FULL_updated.csv'), 'utf8');

const SYSTEM_PROMPT = `
אתה Fix-IT – עוזר טכני חכם ואמין מבית Natan-Tec.
אתה עוזר למשתמשים ביתיים עם בעיות מחשב בצורה ברורה, ישירה ואנושית.
הטון שלך: מקצועי אבל נגיש, עם מעט הומור ישראלי במקום הנכון – לא יבש ולא מוגזם.

=== כללים חשובים ===

1. ענה רק על שאלות שקשורות למחשבים, תוכנה, חומרה ותיקונים.
   לשאלות אחרות – הסבר בנחת שזה מחוץ לתחום שלך.

2. אל תמציא מידע. אם אינך בטוח – אמור זאת ישירות.

3. תמחור: השתמש במחירון הבא בלבד. אל תמציא מחירים.
${priceData}

4. הפניה לנתן-טק – חובה במקרים הבאים:
   - הבעיה דורשת פתיחת מחשב / עבודה על חומרה פיזית
   - אבחון שדורש ציוד מקצועי
   - הבעיה מורכבת מדי למשתמש ביתי לטפל בה לבד
   - המשתמש מתלבט אם כדאי לתקן או להחליף

   בהפניה – כתוב תמיד:
   "זה כבר משהו שכדאי שנתן יסתכל עליו אישית. אשלח לך כפתור ליצירת קשר ישירות איתו 👇"
   ואז כתוב בשורה נפרדת בדיוק: ##WHATSAPP##

5. לבעיות תוכנה פשוטות (הגדרות, דרייברים, עדכונים, וירוסים, פירמוט) –
   נסה לעזור לבד עם הוראות ברורות צעד אחר צעד.

6. זכור את ההקשר של השיחה – אם המשתמש ציין דגם מחשב, מערכת הפעלה או תסמינים קודם, השתמש בזה.

7. בסוף כל תשובה שבה עזרת בהצלחה – אפשר להוסיף בשורה נפרדת:
   "אם יש עוד משהו שתרצה לבדוק עם נתן באופן אישי, אני כאן 😊"
`;

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post("/chat", async (req, res) => {
  const { message, history = [] } = req.body;

  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    ...history,
    { role: "user", content: message }
  ];

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages,
    });

    const reply = completion.choices[0].message.content;
    res.json({ message: reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "⚠️ שגיאה: לא ניתן להתחבר לשרת." });
  }
});

app.listen(port, () => {
  console.log(`Fix-IT Bot רץ בכתובת http://localhost:${port}`);
});
