// import { createContext, useContext, useEffect, useState } from "react";

// const backendUrl = "http://localhost:4000";

// const ChatContext = createContext();

// export const ChatProvider = ({ children }) => {
//   const chat = async (message) => {
//     setLoading(true);
//     const data = await fetch(`${backendUrl}/chat`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ message }),
//     });
//     const resp = (await data.json()).messages;
//     setMessages((messages) => [...messages, ...resp]);
//     setLoading(false);
//   };
//   const [messages, setMessages] = useState([]);
//   const [message, setMessage] = useState();
//   const [loading, setLoading] = useState(false);
//   const [cameraZoomed, setCameraZoomed] = useState(true);
//   const onMessagePlayed = () => {
//     setMessages((messages) => messages.slice(1));
//   };

//   useEffect(() => {
//     if (messages.length > 0) {
//       setMessage(messages[0]);
//     } else {
//       setMessage(null);
//     }
//   }, [messages]);

//   return (
//     <ChatContext.Provider
//       value={{
//         chat,
//         message,
//         onMessagePlayed,
//         loading,
//         cameraZoomed,
//         setCameraZoomed,
//       }}
//     >
//       {children}
//     </ChatContext.Provider>
//   );
// };

// export const useChat = () => {
//   const context = useContext(ChatContext);
//   if (!context) {
//     throw new Error("useChat must be used within a ChatProvider");
//   }
//   return context;
// };
// src/components/hooks/useChat.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { API_BASE_URL } from "../../config";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cameraZoomed, setCameraZoomed] = useState(true);

  // Send text to your Flask route => Node => response
  const chat = async (text) => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const resp = await fetch(`${API_BASE_URL}/api/therapist/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = await resp.json();

      // If Node returns { messages: [] }, handle that
      if (data.messages) {
        setMessages((prev) => [...prev, ...data.messages]);
      }
      // If Node returns { response: "...", audio: "base64..." }, handle that
      else {
        setMessages((prev) => [...prev, data]);
      }
    } catch (err) {
      console.error("Therapist chat error:", err);
    }
    setLoading(false);
  };

  // After we finish playing a message's audio, remove it from the queue
  const onMessagePlayed = () => {
    setMessages((old) => old.slice(1));
  };

  useEffect(() => {
    if (messages.length > 0) {
      setMessage(messages[0]);
    } else {
      setMessage(null);
    }
  }, [messages]);

  return (
    <ChatContext.Provider
      value={{
        chat,
        message,
        onMessagePlayed,
        loading,
        cameraZoomed,
        setCameraZoomed
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
