import { useState, useRef, useEffect } from "react";

function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  // Auto-scroll to bottom when messages change
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
    <div className="flex items-center justify-center min-h-screen bg-stone-100 p-4 font-sans">
      {/* Chat window */}
      <div className="flex flex-col w-full max-w-md h-[640px] bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
        {/* Header */}
        <header className="flex items-center gap-3 px-5 py-4 border-b border-stone-200">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-stone-900 flex items-center justify-center text-white text-sm font-medium">
              C
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white" />
          </div>
          <div>
            <h1 className="text-stone-900 font-serif text-lg leading-tight">
              Chat
            </h1>
            <p className="text-stone-500 text-xs">Online</p>
          </div>
        </header>

        {/* Messages */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-5 py-6 space-y-4 bg-stone-50"
        >
          {messages.length === 0 && (
            <p className="text-center text-stone-400 text-sm mt-8">
              Say something to get started.
            </p>
          )}

          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${
                m.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  m.role === "user"
                    ? "bg-stone-900 text-white rounded-br-sm"
                    : "bg-white text-stone-800 border border-stone-200 rounded-bl-sm"
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-white border border-stone-200 rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1">
                <span
                  className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                />
                <span
                  className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                />
                <span
                  className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="px-5 py-4 border-t border-stone-200 bg-white">
          <div className="flex items-center gap-2 bg-stone-100 rounded-full px-4 py-2 focus-within:ring-2 focus-within:ring-stone-300 transition">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Say something..."
              className="flex-1 bg-transparent text-sm text-stone-900 placeholder:text-stone-400 outline-none"
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              className="w-8 h-8 rounded-full bg-stone-900 text-white flex items-center justify-center text-sm disabled:bg-stone-300 disabled:cursor-not-allowed transition hover:bg-stone-700"
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
