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
const _dirname = path.dirname(_filename);

app.use(express.static(__dirname));
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

let priceData = fs.readFileSync(path.join(__dirname, 'Natan-Tec_Price_List_FULL_updated.csv'), 'utf8');

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;
  const messages = [
    { role: "system", content: אתה עוזר אישי בשם Fix-IT מבית Natan-Tec. התשובות שלך מבוססות על מחירון תיקונים:\n\n${priceData} },
    { role: "user", content: userMessage },
  ];

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages,
    });

    res.json({ message: completion.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ message: "⚠ שגיאה: לא ניתן להתחבר לשרת." });
  }
});

app.listen(port, () => {
  console.log(Fix-IT Bot רץ בכתובת http://localhost:${port});
});