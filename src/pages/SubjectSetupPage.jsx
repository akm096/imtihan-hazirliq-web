import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSubject, saveSubject } from "../utils/storage";
import { generateTopics } from "../utils/ai";
import { getSubjectEmoji } from "../constants";
import "./SubjectSetupPage.css";

export default function SubjectSetupPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [subject, setSubject] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const sub = getSubject(id);
        if (!sub) {
            navigate("/");
            return;
        }
        setSubject(sub);
    }, [id, navigate]);

    const handleGenerate = async () => {
        if (!subject) return;
        setLoading(true);
        setError("");

        try {
            const topics = await generateTopics(subject.name, subject.topicRange);
            subject.topics = topics;
            saveSubject(subject);
            navigate(`/subject/${id}/topics`);
        } catch (err) {
            setError(err.message || "Xəta baş verdi. Yenidən cəhd edin.");
        } finally {
            setLoading(false);
        }
    };

    if (!subject) return null;

    const emoji = getSubjectEmoji(subject.name);

    return (
        <div className="page">
            <div className="container">
                <div className="page-header">
                    <h1>
                        {emoji} {subject.name}
                    </h1>
                    <p>AI ilə mövzu siyahısı yaradın</p>
                </div>

                <div className="setup-card glass-card-static">
                    <div className="setup-info">
                        <div className="setup-field">
                            <span className="setup-label">Fənn</span>
                            <span className="setup-value">{subject.name}</span>
                        </div>
                        <div className="setup-field">
                            <span className="setup-label">Mövzu aralığı</span>
                            <span className="setup-value">{subject.topicRange}</span>
                        </div>
                    </div>

                    <div className="divider" />

                    <div className="setup-action">
                        <p className="setup-desc">
                            AI bu məlumat əsasında fənn üçün mövzu siyahısı yaradacaq.
                            Siyahını sonra redaktə edə biləcəksiniz.
                        </p>

                        {error && (
                            <div className="setup-error">
                                <span>⚠️</span>
                                <span>{error}</span>
                            </div>
                        )}

                        <button
                            className="btn btn-primary btn-lg setup-btn"
                            onClick={handleGenerate}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner" /> AI mövzuları yaradır...
                                </>
                            ) : (
                                "🤖 AI ilə Mövzu Siyahısı Yarat"
                            )}
                        </button>

                        {subject.topics && subject.topics.length > 0 && (
                            <button
                                className="btn btn-secondary"
                                onClick={() => navigate(`/subject/${id}/topics`)}
                            >
                                ✏️ Mövcud mövzuları redaktə et ({subject.topics.length} mövzu)
                            </button>
                        )}
                    </div>
                </div>

                <button
                    className="btn btn-ghost"
                    onClick={() => navigate("/")}
                    style={{ marginTop: "var(--space-lg)" }}
                >
                    ← Ana səhifəyə qayıt
                </button>
            </div>
        </div>
    );
}
