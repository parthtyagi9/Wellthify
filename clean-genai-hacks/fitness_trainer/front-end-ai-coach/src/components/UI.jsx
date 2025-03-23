import { useRef, useEffect, useState } from "react";
import { useChat } from "../hooks/useChat.jsx";

export const UI = ({ hidden, ...props }) => {
  const input = useRef();
  const audioRef = useRef();
  // Ref to track the last played message text.
  const lastMessageRef = useRef("");

  const {
    chat,
    message,
    loading,
    cameraZoomed,
    setCameraZoomed,
    onMessagePlayed,
  } = useChat();

  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState("");

  // Setup Speech Recognition for voice input.
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  if (recognition) {
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onresult = (event) => {
      const result = event.results[0][0].transcript;
      setTranscript(result);
      if (input.current) {
        input.current.value = result;
      }
    };
    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setRecording(false);
    };
    recognition.onend = () => {
      setRecording(false);
    };
  }

  const startRecording = () => {
    if (recognition) {
      setRecording(true);
      recognition.start();
    }
  };

  const stopRecording = () => {
    if (recognition) {
      recognition.stop();
      setRecording(false);
    }
  };

  const sendMessage = () => {
    const text = input.current.value;
    if (!loading && text.trim() !== "") {
      chat(text);
      input.current.value = "";
      setTranscript("");
    }
  };

  // When a new message arrives, play its synthesized audio only if it's new.
  useEffect(() => {
    console.log("useChat message state:", message);
    if (message && message.audio && message.text) {
      // If this message's text is the same as the last played, do nothing.
      if (lastMessageRef.current === message.text) {
        return;
      }
      // Mark this message as "played" to avoid double‐play.
      lastMessageRef.current = message.text;

      const audioDataUrl = "data:audio/mp3;base64," + message.audio;
      if (audioRef.current) {
        audioRef.current.src = audioDataUrl;
        audioRef.current.play();
        audioRef.current.onended = () => {
          // Call the callback but don't reset lastMessageRef!
          onMessagePlayed();
        };
      }
    }
  }, [message, onMessagePlayed]);

  if (hidden) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 z-10 flex flex-col justify-between p-4 pointer-events-none">
      <div className="self-start backdrop-blur-md bg-white bg-opacity-50 p-4 rounded-lg">
        <h1 className="font-black text-xl">Virtual Fitness Coach</h1>
        <p>Your Personal Trainer</p>
      </div>
      <div className="w-full flex flex-col items-end justify-center gap-4">
        <div className="flex gap-2">
          <button
            onClick={() => setCameraZoomed(!cameraZoomed)}
            className="pointer-events-auto bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-md"
          >
            {cameraZoomed ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM13.5 10.5h-6"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6"
                />
              </svg>
            )}
          </button>
          <button
            onClick={() => {
              const body = document.querySelector("body");
              if (body.classList.contains("greenScreen")) {
                body.classList.remove("greenScreen");
              } else {
                body.classList.add("greenScreen");
              }
            }}
            className="pointer-events-auto bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-md"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 004.5 7.5v9a2.25 2.25 0 002.25 2.25z"
              />
            </svg>
          </button>
          <button
            onClick={recording ? stopRecording : startRecording}
            className="pointer-events-auto bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-md"
          >
            {recording ? "Stop" : "Record"}
          </button>
        </div>
        <div className="flex items-center gap-2 pointer-events-auto max-w-screen-sm w-full mx-auto">
          <input
            className="w-full placeholder:text-gray-800 placeholder:italic p-4 rounded-md bg-opacity-50 bg-white backdrop-blur-md"
            placeholder="Type or record a message..."
            ref={input}
            defaultValue={transcript}
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage();
            }}
          />
          <button
            disabled={loading}
            onClick={sendMessage}
            className={`bg-blue-500 hover:bg-blue-600 text-white p-4 px-10 font-semibold uppercase rounded-md ${
              loading ? "cursor-not-allowed opacity-30" : ""
            }`}
          >
            Send
          </button>
        </div>
      </div>
      {/* Hidden audio element for playing synthesized audio */}
      <audio ref={audioRef} style={{ display: "none" }} />
    </div>
  );
};

export default UI;