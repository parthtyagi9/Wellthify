import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import textToSpeech from "@google-cloud/text-to-speech";
import fetch from "node-fetch"; // If Node version <18; Node 18+ includes fetch globally
dotenv.config();

const geminiApiKey = process.env.GEMINI_API_KEY;
const port = 4000;

// Create a Google Cloud TTS client using explicit credentials.
const ttsClient = new textToSpeech.TextToSpeechClient({
  keyFilename:
    process.env.GOOGLE_APPLICATION_CREDENTIALS ||
    "/Users/kshitijkaria/Downloads/careful-prism-454505-d9-94c6320054ff.json",
});

const app = express();
app.use(express.json());
app.use(cors());

// Global conversation history (demo purposes only)
let conversationHistory = [];

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  // If no message provided, return some default responses.
  if (!userMessage) {
    return res.send({
      messages: [
        {
          text: "How are you feeling today?",
          facialExpression: "smile",
          animation: "Talking",
          audio: "",
        },
        {
          text: "How are you feeling today?",
          facialExpression: "smile",
          animation: "Meeting",
          audio: "",
        },
      ],
    });
  }

  // If Gemini API key is missing, return an error response.
  if (!geminiApiKey) {
    return res.send({
      messages: [
        {
          text: "Don't forget to add your Gemini API key!",
          facialExpression: "smile",
          animation: "Meeting",
          audio: "",
        },
      ],
    });
  }

  // Append user's message to conversation history.
  conversationHistory.push(`User: ${userMessage}`);

  // Build the prompt with conversation context.
  const prompt = `
You are a virtual professional therapist.
You will always reply with a JSON array of messages (maximum 3 messages).
Each message has a "text", "facialExpression", and "animation" property.
Available facial expressions: "smile" and "default".
Available animations: "Idle" and "Talking".
Conversation history:
${conversationHistory.join("\n")}
Therapist:`;

  const payload = {
    contents: [
      {
        parts: [{ text: prompt }],
      },
    ],
  };

  try {
    // Call Gemini API
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    // Log and parse the raw response.
    const rawResponse = await geminiResponse.text();
    console.log("Raw Gemini API response:", rawResponse);
    const geminiResult = JSON.parse(rawResponse);
    if (
      !geminiResult ||
      !geminiResult.candidates ||
      geminiResult.candidates.length === 0
    ) {
      throw new Error("Gemini API did not return any candidates");
    }

    const candidate = geminiResult.candidates[0];
    if (
      !candidate.content ||
      !candidate.content.parts ||
      candidate.content.parts.length === 0
    ) {
      throw new Error("Candidate content is undefined or empty");
    }

    // Extract text from the candidate's first part.
    let candidateText = candidate.content.parts[0].text;
    // Remove Markdown code block delimiters (if present)
    const match = candidateText.match(/```json\s*([\s\S]*?)\s*```/);
    if (match && match[1]) {
      candidateText = match[1].trim();
    } else {
      candidateText = candidateText.trim();
    }

    let messages = JSON.parse(candidateText);
    if (messages.messages) {
      messages = messages.messages;
    }

    // For each therapist message, synthesize speech with Google Cloud TTS.
    for (let i = 0; i < messages.length; i++) {
      const msg = messages[i];
      const ttsRequest = {
        input: { text: msg.text },
        // Change name to a female voice (e.g., en-US-Wavenet-F).
        voice: { languageCode: "en-US", name: "en-US-Neural2-F" },
        audioConfig: { audioEncoding: "MP3" },
      };

      const [ttsResponse] = await ttsClient.synthesizeSpeech(ttsRequest);
      const audioBase64 = ttsResponse.audioContent.toString("base64");
      msg.audio = audioBase64;

      // Append therapist's response to conversation history.
      conversationHistory.push(`Therapist: ${msg.text}`);
    }

    res.send({ messages });
  } catch (error) {
    console.error("Error in Gemini API call:", error);
    res.status(500).send({ error: "Failed to generate response" });
  }
});

app.listen(port, () => {
  console.log(`Therapist listening on port ${port}`);
});