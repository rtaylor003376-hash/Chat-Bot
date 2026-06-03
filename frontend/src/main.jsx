import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import ChatBot from "./components/ChatBot.jsx";
createRoot(document.getElementById("app")).render(
  <StrictMode>
    <ChatBot />
  </StrictMode>
);
