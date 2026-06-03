import { useState, useRef, useEffect } from "react";
import "./ChatBot.css";
const baseURL = import.meta.env.VITE_BASE_URL || "http://localhost:5001";
function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5001/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();
      setMessages([...newMessages, data.reply]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-page">
      <div className="chat-window">
        {/* Header */}
        <header className="chat-header">
          <div className="avatar-wrapper">
            <div className="avatar">C</div>
            <span className="status-dot" />
          </div>
          <div>
            <h1 className="header-title">Chat</h1>
            <p className="header-subtitle">Online</p>
          </div>
        </header>

        {/* Messages */}
        <div ref={scrollRef} className="messages">
          {messages.length === 0 && (
            <p className="empty-state">Say something to get started.</p>
          )}

          {messages.map((m, i) => (
            <div
              key={i}
              className={`message-row ${m.role === "user" ? "user" : "bot"}`}
            >
              <div className={`bubble ${m.role === "user" ? "user" : "bot"}`}>
                {m.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="message-row bot">
              <div className="typing-bubble">
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-dot" />
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="input-area">
          <div className="input-pill">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Say something..."
              className="text-input"
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              className="send-button"
              aria-label="Send message"
            >
              →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatBot;
