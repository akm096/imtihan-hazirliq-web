import { useState, useRef, useEffect } from "react";
import { askAI } from "../utils/ai";
import ModelSelector from "./ModelSelector";
import MarkdownRenderer from "./MarkdownRenderer";
import "./AiChat.css";

export default function AiChat({ subjectName, currentTopicName }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const chatEndRef = useRef(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async () => {
        const question = input.trim();
        if (!question || loading) return;

        const userMsg = { role: "user", content: question };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setLoading(true);

        try {
            const answer = await askAI(subjectName, currentTopicName, question, messages);
            setMessages((prev) => [...prev, { role: "assistant", content: answer }]);
        } catch (err) {
            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: `⚠️ Xəta: ${err.message}` },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const clearChat = () => {
        setMessages([]);
    };

    return (
        <div className={`ai-chat ${isOpen ? "ai-chat-open" : ""}`}>
            <button
                className="ai-chat-toggle"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="ai-chat-toggle-icon">🤖</span>
                <span className="ai-chat-toggle-text">
                    {isOpen ? "AI Köməkçini bağla" : "AI Köməkçi — Sual ver"}
                </span>
                <span className="ai-chat-toggle-arrow">{isOpen ? "▼" : "▲"}</span>
            </button>

            {isOpen && (
                <div className="ai-chat-body">
                    <div className="ai-chat-toolbar">
                        <ModelSelector />
                        <button className="btn btn-ghost btn-sm" onClick={clearChat}>
                            🗑️ Təmizlə
                        </button>
                    </div>

                    <div className="ai-chat-messages">
                        {messages.length === 0 && (
                            <div className="ai-chat-empty">
                                <p>🎓 {subjectName} fənni üzrə sual verin!</p>
                                <div className="ai-chat-suggestions">
                                    {currentTopicName && (
                                        <button
                                            className="btn btn-secondary btn-sm"
                                            onClick={() => setInput(`"${currentTopicName}" mövzusunu sadə dillə izah et`)}
                                        >
                                            📖 "{currentTopicName}" izah et
                                        </button>
                                    )}
                                    <button
                                        className="btn btn-secondary btn-sm"
                                        onClick={() => setInput(`${subjectName} fənnindən bir nümunə məsələ həll et`)}
                                    >
                                        📝 Nümunə məsələ
                                    </button>
                                    <button
                                        className="btn btn-secondary btn-sm"
                                        onClick={() => setInput(`${subjectName} fənnindən əsas düsturları yaz`)}
                                    >
                                        📐 Düsturlar
                                    </button>
                                </div>
                            </div>
                        )}

                        {messages.map((msg, i) => (
                            <div
                                key={i}
                                className={`ai-chat-msg ${msg.role === "user" ? "ai-chat-msg-user" : "ai-chat-msg-ai"}`}
                            >
                                <div className="ai-chat-msg-avatar">
                                    {msg.role === "user" ? "👤" : "🤖"}
                                </div>
                                <div className="ai-chat-msg-content">
                                    {msg.role === "assistant" ? (
                                        <MarkdownRenderer text={msg.content} />
                                    ) : (
                                        msg.content.split("\n").map((line, j) => (
                                            <p key={j}>{line}</p>
                                        ))
                                    )}
                                </div>
                            </div>
                        ))}

                        {loading && (
                            <div className="ai-chat-msg ai-chat-msg-ai">
                                <div className="ai-chat-msg-avatar">🤖</div>
                                <div className="ai-chat-msg-content ai-chat-typing">
                                    <span></span><span></span><span></span>
                                </div>
                            </div>
                        )}

                        <div ref={chatEndRef} />
                    </div>

                    <div className="ai-chat-input-row">
                        <textarea
                            className="ai-chat-input"
                            placeholder="Sualınızı yazın..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            rows={1}
                            disabled={loading}
                        />
                        <button
                            className="btn btn-primary ai-chat-send"
                            onClick={handleSend}
                            disabled={!input.trim() || loading}
                        >
                            ➤
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
