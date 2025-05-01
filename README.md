# Fix-IT Chatbot – Powered by Natan-Tec

מערכת צ'אט חכמה מבוססת GPT שנבנתה במיוחד עבור משתמשים ביתיים הזקוקים לעזרה טכנית במחשב.

## תכונות:
- שילוב עם OpenAI Assistant API
- שליחת שאלות וקבלת תגובות טבעיות
- הצגת בועות שיחה פתיחה
- התאמה מלאה למובייל
- שילוב מחירון תיקונים מקיף
- ממשק עברי מותאם אישית

## התקנה (ב־Render או לוקלית)
1. העלה את כל הקבצים ל־GitHub
2. ב־Render בחר `New Web Service`
3. הגדר:
   - Build Command: `npm install`
   - Start Command: `node server.js`

## קבצים חשובים:
- `server.js` – שרת Node.js המחבר את הבוט ל-OpenAI
- `index.html`, `style.css`, `script.js` – ממשק המשתמש
- `Natan-Tec_Price_List_FULL_updated.csv` – קובץ מחירון לניתוח שאלות