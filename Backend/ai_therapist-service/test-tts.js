import textToSpeech from '@google-cloud/text-to-speech';
import { promises as fs } from 'fs';

// Creates a client using the credentials from GOOGLE_APPLICATION_CREDENTIALS
const client = new textToSpeech.TextToSpeechClient();

async function synthesizeSpeech() {
  const request = {
    input: { text: "Hello, world! This is a test of Google Cloud Text-to-Speech." },
    voice: { languageCode: "en-US", name: "en-US-Wavenet-D" }, // Adjust voice as needed
    audioConfig: { audioEncoding: "MP3" },
  };

  try {
    const [response] = await client.synthesizeSpeech(request);
    await fs.writeFile('output.mp3', response.audioContent, 'binary');
    console.log("Audio content written to file: output.mp3");
  } catch (error) {
    console.error("Error during TTS synthesis:", error);
  }
}

synthesizeSpeech();