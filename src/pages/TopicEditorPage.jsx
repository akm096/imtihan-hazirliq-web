import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSubject, updateTopics } from "../utils/storage";
import { editTopicsWithAI } from "../utils/ai";
import { getSubjectEmoji } from "../constants";
import TopicList from "../components/TopicList";
import ModelSelector from "../components/ModelSelector";
import "./TopicEditorPage.css";

export default function TopicEditorPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [subject, setSubject] = useState(null);
    const [topics, setTopics] = useState([]);
    const [aiInput, setAiInput] = useState("");
    const [aiLoading, setAiLoading] = useState(false);
    const [aiError, setAiError] = useState("");
    const [aiSuccess, setAiSuccess] = useState("");

    useEffect(() => {
        const sub = getSubject(id);
        if (!sub) {
            navigate("/");
            return;
        }
        setSubject(sub);
        setTopics(sub.topics || []);
    }, [id, navigate]);

    const handleUpdate = (newTopics) => {
        setTopics(newTopics);
        updateTopics(id, newTopics);
    };

    const handleAiEdit = async () => {
        const instruction = aiInput.trim();
        if (!instruction || aiLoading) return;

        setAiLoading(true);
        setAiError("");
        setAiSuccess("");

        try {
            const newTopics = await editTopicsWithAI(subject.name, topics, instruction);
            setTopics(newTopics);
            updateTopics(id, newTopics);
            setAiSuccess(`✅ ${newTopics.length} mövzu yeniləndi!`);
            setAiInput("");
            // Clear success after 5s
            setTimeout(() => setAiSuccess(""), 5000);
        } catch (err) {
            setAiError(err.message);
        } finally {
            setAiLoading(false);
        }
    };

    const handleAiKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleAiEdit();
        }
    };

    const handleContinue = () => {
        if (topics.length === 0) return;
        navigate(`/subject/${id}/plan-config`);
    };

    if (!subject) return null;

    const emoji = getSubjectEmoji(subject.name);

    return (
        <div className="page">
            <div className="container">
                <div className="page-header">
                    <h1>
                        {emoji} {subject.name} — Mövzular
                    </h1>
                    <p>
                        Mövzu siyahısını əl ilə və ya AI köməkçi ilə redaktə edin.
                    </p>
                </div>

                <div className="topic-editor-card glass-card-static">
                    <TopicList topics={topics} onUpdate={handleUpdate} />
                </div>

                {/* AI Topic Editor */}
                <div className="ai-topic-editor glass-card-static">
                    <div className="ai-topic-editor-header">
                        <h3>🤖 AI ilə Mövzuları Redaktə Et</h3>
                        <ModelSelector />
                    </div>
                    <p className="ai-topic-editor-desc">
                        Aşağıda AI-yə göstəriş verin: mövzuları dəyişdirin, əlavə edin, silin və ya tamamilə yenidən yazın.
                    </p>

                    <div className="ai-topic-suggestions">
                        <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => setAiInput("Bütün siyahını sil və bu mövzuları sıra ilə əlavə et:\n1. ")}
                        >
                            📋 Siyahını əvəzlə
                        </button>
                        <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => setAiInput("Siyahının sonuna bu mövzuları əlavə et:\n1. ")}
                        >
                            ➕ Sona əlavə et
                        </button>
                        <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => setAiInput(`"${topics[0]?.name || ""}" mövzusundan əvvəl bu mövzuları əlavə et:\n1. `)}
                            disabled={topics.length === 0}
                        >
                            ⬆️ Əvvəlinə əlavə et
                        </button>
                        <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => setAiInput("Mövzuları daha xırda alt-mövzulara böl")}
                        >
                            🔀 Alt-mövzulara böl
                        </button>
                    </div>

                    <div className="ai-topic-input-row">
                        <textarea
                            className="ai-topic-input"
                            placeholder="Məs: Bütün listi sil və bu mövzuları sıra ilə əlavə et:&#10;1. Fizikaya Giriş&#10;2. Mexaniki hərəkət..."
                            value={aiInput}
                            onChange={(e) => setAiInput(e.target.value)}
                            onKeyDown={handleAiKeyDown}
                            rows={4}
                            disabled={aiLoading}
                        />
                        <button
                            className="btn btn-primary ai-topic-send"
                            onClick={handleAiEdit}
                            disabled={!aiInput.trim() || aiLoading}
                        >
                            {aiLoading ? (
                                <span className="ai-topic-spinner" />
                            ) : (
                                "🚀 Tətbiq et"
                            )}
                        </button>
                    </div>

                    {aiError && (
                        <div className="ai-topic-error">
                            <span>⚠️</span> {aiError}
                        </div>
                    )}

                    {aiSuccess && (
                        <div className="ai-topic-success animate-scale-in">
                            {aiSuccess}
                        </div>
                    )}
                </div>

                <div className="topic-editor-footer">
                    <button
                        className="btn btn-ghost"
                        onClick={() => navigate(`/subject/${id}/setup`)}
                    >
                        ← AI ilə yenidən yarat
                    </button>
                    <button
                        className="btn btn-primary btn-lg"
                        onClick={handleContinue}
                        disabled={topics.length === 0}
                    >
                        Təsdiqlə və Plan Qur →
                    </button>
                </div>
            </div>
        </div>
    );
}
