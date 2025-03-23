import React, { useRef, useEffect, useState } from "react";
import { useChat } from "./hooks/useChat.jsx";

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

function UI() {
  const { chat, loading } = useChat();
  const inputRef = useRef(null);

  const [recording, setRecording] = useState(false);
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.lang = "en-US";
      rec.continuous = false;
      rec.interimResults = false;

      rec.onresult = (e) => {
        const transcript = e.results[0][0].transcript;
        if (inputRef.current) {
          inputRef.current.value = transcript;
          sendMessage();
        }
      };
      rec.onerror = (err) => {
        console.error("Speech recognition error:", err);
        setRecording(false);
      };
      rec.onend = () => {
        setRecording(false);
      };
      setRecognition(rec);
    }
  }, []);

  const toggleRecording = () => {
    if (!recognition) return;
    if (recording) {
      recognition.stop();
      setRecording(false);
    } else {
      recognition.start();
      setRecording(true);
    }
  };

  const toggleGreenScreen = () => {
    document.body.classList.toggle("greenScreen");
  };

  const sendMessage = () => {
    if (!loading && inputRef.current) {
      chat(inputRef.current.value);
      inputRef.current.value = "";
    }
  };

  return (
    <div className="ui-container">
      {/* Top right: Title + controls */}
      <div className="top-bar" style={{ alignSelf: "flex-end" }}>
        <h1 className="title">Virtual Therapist</h1>
        <p>Discover Yourself</p>
        <div className="controls">
          <button onClick={toggleGreenScreen} className="control-button">
             Change Office
          </button>

          <button onClick={toggleRecording} className="control-button">
            {recording ? "Stop" : "Record"}
          </button>
        </div>
      </div>

      {/* Bottom row for text input + send */}
      <div className="input-row">
        <input
          ref={inputRef}
          type="text"
          placeholder="Type or record a message..."
          className="chat-input"
          disabled={loading}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
        />
        <button onClick={sendMessage} className="send-button" disabled={loading}>
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}

export default UI;