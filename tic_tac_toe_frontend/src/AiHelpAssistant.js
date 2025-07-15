import React, { useState } from "react";
import "./AiHelpAssistant.css";

// PUBLIC_INTERFACE
/**
 * AI Help Assistant component with floating button and panel.
 * @returns {JSX.Element} The assistant UI.
 */
const AiHelpAssistant = () => {
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [chat, setChat] = useState([
    {
      role: "assistant",
      content:
        "Hi! I'm the Tic Tac Toe AI Assistant. Ask me anything about the game or how to play!",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSend = async () => {
    if (!prompt.trim()) return;
    setChat((prev) => [
      ...prev,
      { role: "user", content: prompt },
      // Optionally, add an optimistic "thinking..." entry.
    ]);
    setLoading(true);
    setError("");
    setPrompt("");
    // Lazy load OpenAI service to avoid loading unused code if unused.
    try {
      const { askOpenAI } = await import("./openaiService");
      const aiResponse = await askOpenAI(prompt);
      setChat((prev) => [
        ...prev.slice(0, prev.length),
        { role: "assistant", content: aiResponse },
      ]);
    } catch (e) {
      setError("Error getting AI response.");
    }
    setLoading(false);
  };

  return (
    <>
      <button
        className="ai-assistant-fab"
        onClick={() => setOpen((open) => !open)}
        aria-label={open ? "Close AI Assistant" : "Ask AI Assistant"}
      >
        🤖
      </button>
      {open && (
        <div className="ai-assistant-overlay">
          <div className="ai-assistant-panel">
            <button
              className="ai-assistant-close"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
            >
              ×
            </button>
            <div className="ai-assistant-chat">
              {chat.map((entry, i) => (
                <div key={i} className={`msg ${entry.role}`}>
                  <span>{entry.content}</span>
                </div>
              ))}
              {loading && (
                <div className="msg assistant">
                  <span>Thinking...</span>
                </div>
              )}
              {error && (
                <div className="msg error">
                  <span>{error}</span>
                </div>
              )}
            </div>
            <div className="ai-assistant-input-row">
              <input
                type="text"
                value={prompt}
                disabled={loading}
                placeholder="Ask me anything!"
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && !loading && handleSend()
                }
              />
              <button
                onClick={handleSend}
                disabled={loading || !prompt.trim()}
                className="send-btn"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AiHelpAssistant;
