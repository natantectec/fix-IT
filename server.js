import express from "express";
import path from "path";
import { config } from "dotenv";
import OpenAI from "openai";
import { fileURLToPath } from "url";

config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAI_ORG_ID,
});

const app = express();
const port = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(__dirname));
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/ask", async (req, res) => {
  const userMessage = req.body.message;

  try {
    const thread = await openai.beta.threads.create();
    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: userMessage,
    });

    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: process.env.OPENAI_ASSISTANT_ID,
    });

    let completedRun;
    while (!completedRun) {
      const checkRun = await openai.beta.threads.runs.retrieve(thread.id, run.id);
      if (checkRun.status === "completed") {
        completedRun = checkRun;
        break;
      } else if (["failed", "cancelled", "expired"].includes(checkRun.status)) {
        throw new Error("Run failed or expired.");
      }
      await new Promise((resolve) => setTimeout(resolve, 1500));
    }

    const messages = await openai.beta.threads.messages.list(thread.id);
    const reply = messages.data[0].content[0].text.value;
    res.json({ reply });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ reply: "⚠️ שגיאה: לא ניתן להתחבר לבוט כרגע." });
  }
});

app.listen(port, () => {
  console.log(`Fix-IT Assistant רץ על http://localhost:${port}`);
});