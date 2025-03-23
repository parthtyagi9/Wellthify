import { createContext, useContext, useEffect, useState } from "react";
import { API_BASE_URL } from "../../config";

// 1) Create the context
const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cameraZoomed, setCameraZoomed] = useState(true);

  // 2) Our function to talk to the Flask backend
  const chat = async (userText) => {
    // Don’t send empty or whitespace
    if (!userText.trim()) return;

    setLoading(true);
    try {
      // POST to the Flask route, which calls Node behind the scenes
      const res = await fetch(`${API_BASE_URL}/api/therapist/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText }),
      });
      const data = await res.json();

      // The Node code returns { messages: [ { text, audio, facialExpression, ... }, ... ] }
      if (data.messages) {
        // Store them in our array
        setMessages(prev => [...prev, ...data.messages]);
      } else {
        // If Node returned a single object
        setMessages(prev => [...prev, data]);
      }
    } catch (err) {
      console.error("Therapist chat error:", err);
    }
    setLoading(false);
  };

  // 3) This function is called when the audio finishes
  const onMessagePlayed = () => {
    // Remove the first message from the queue
    setMessages(old => old.slice(1));
  };

  // 4) Whenever our “messages” array changes,
  //    set “currentMessage” to the first item
  useEffect(() => {
    if (messages.length > 0) {
      setCurrentMessage(messages[0]);
    } else {
      setCurrentMessage(null);
    }
  }, [messages]);

  // 5) Whenever we get a new “currentMessage”,
  //    if it has an “audio” field, play it
  useEffect(() => {
    if (!currentMessage) return;

    // If there's an audio field, play it
    if (currentMessage.audio) {
      const audio = new Audio(`data:audio/mp3;base64,${currentMessage.audio}`);
      audio.play();
      // When the audio ends, remove the first message
      audio.onended = onMessagePlayed;
    }
  }, [currentMessage]);

  return (
    <ChatContext.Provider
      value={{
        // Expose things to your UI
        chat,
        loading,
        cameraZoomed,
        setCameraZoomed,
        // If you want to show the entire conversation in a chat box:
        messages
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

// 6) Expose a “useChat” hook for easy usage in React
export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
