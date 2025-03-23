import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import textToSpeech from "@google-cloud/text-to-speech";
import fetch from "node-fetch";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid";
import { exec } from "child_process";
import { promisify } from "util";

dotenv.config();
const execPromise = promisify(exec);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const geminiApiKey = process.env.GEMINI_API_KEY;
const port = 4300;

const RHUBARB_PATH = path.resolve(
  __dirname,
  "Rhubarb-Lip-Sync-1.13.0-macOS/rhubarb"
);

const ttsClient = new textToSpeech.TextToSpeechClient({
  keyFilename:
    process.env.GOOGLE_APPLICATION_CREDENTIALS ||
    path.join(__dirname, "careful-prism-454505-d9-9743c6e0e78e.json"),
});

const app = express();
app.use(express.json());
app.use(cors());

let conversationHistory = [];

app.get("/", (req, res) => {
  res.send("Hello from Fitness Coach backend!");
});

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  if (!userMessage) {
    return res.send({
      messages: [
        {
          text: "How are you today?",
          facialExpression: "smile",
          animation: "Idle",
          audio: "",
        },
      ],
    });
  }

  if (!geminiApiKey) {
    return res.send({
      messages: [
        {
          text: "Missing Gemini API key.",
          facialExpression: "default",
          animation: "Idle",
          audio: "",
        },
      ],
    });
  }

  conversationHistory.push(`User: ${userMessage}`);

  const prompt = `
You are a virtual professional fitness coach speaking to a user. Your goal is to provide natural, human-like responses while suggesting exercises tailored to the user's fitness level.

You must determine the user's fitness level — beginner, intermediate, or experienced — based on the conversation history, and suggest exercises that match their ability.

Only suggest exercises from this list: "Air_Squats", "Burpee", "Bicycle_Crunches", "Pistols", "Jumping_Jacks", "Cross_Jumps".

Use the following mapping when selecting exercises and animations:

- Beginner: "Cross_Jumps", "Jumping_Jacks"
- Intermediate: "Air_Squats", "Bicycle_Crunches"
- Experienced: "Pistols", "Burpee"

Each time you suggest an exercise, apply the corresponding animation name exactly as listed.

Your response must always be a JSON array (maximum 3 objects).
Each object in the array must include:
- "text": The response text (human-like)
- "facialExpression": Either "smile" or "default"
- "animation": Either "Idle", or one of the 6 allowed exercises

Do not include any exercises outside the list. Avoid medical advice or meal plans. Keep it short, friendly, and motivational.

Conversation history:
${conversationHistory.join("\n")}
Coach:`;

  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
  };

  try {
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    const rawResponse = await geminiResponse.text();
    console.log("Gemini raw:", rawResponse);
    const geminiResult = JSON.parse(rawResponse);
    const candidate = geminiResult?.candidates?.[0];

    let candidateText = candidate?.content?.parts?.[0]?.text || "";
    const match = candidateText.match(/```json\s*([\s\S]*?)\s*```/);
    candidateText = match ? match[1].trim() : candidateText.trim();

    let messages = JSON.parse(candidateText);
    if (messages.messages) messages = messages.messages;

    const msg = messages[0];
    const folderId = uuidv4();
    const folderPath = path.join(__dirname, "audios", folderId);
    fs.mkdirSync(folderPath, { recursive: true });

    const mp3Path = path.join(folderPath, "output.mp3");
const wavPath = path.join(folderPath, "output.wav");
const lipsyncPath = path.join(folderPath, "lipsync.json");

    // 1. Synthesize MP3 for playback
const [mp3Response] = await ttsClient.synthesizeSpeech({
  input: { text: msg.text },
  voice: { languageCode: "en-US", name: "en-US-Neural2-D" },
  audioConfig: { audioEncoding: "MP3" },
});
fs.writeFileSync(mp3Path, mp3Response.audioContent);

// 2. Synthesize WAV for lip sync
const [wavResponse] = await ttsClient.synthesizeSpeech({
  input: { text: msg.text },
  voice: { languageCode: "en-US", name: "en-US-Neural2-D" },
  audioConfig: { audioEncoding: "LINEAR16" },
});
fs.writeFileSync(wavPath, wavResponse.audioContent);

// 3. Run Rhubarb on WAV
try {
  await execPromise(`"${RHUBARB_PATH}" -r phonetic -f json -o "${lipsyncPath}" "${wavPath}"`);
  msg.lipsync = JSON.parse(fs.readFileSync(lipsyncPath, "utf-8"));
} catch (err) {
  console.error("Rhubarb error:", err);
  msg.lipsync = null;
}

// 4. Return only MP3 audio as base64
msg.audio = mp3Response.audioContent.toString("base64");
    conversationHistory.push(`Coach: ${msg.text}`);

    res.send({ messages: [msg] });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).send({ error: "Failed to generate chat response." });
  }
});

app.listen(port, () => {
  console.log(`Fitness Coach backend running on http://localhost:${port}`);
});