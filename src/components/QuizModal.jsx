import { useState } from "react";
import { generateQuiz } from "../utils/ai";
import ModelSelector from "./ModelSelector";
import "./QuizModal.css";

export default function QuizModal({ isOpen, onClose, subjectName, topicName }) {
    const [step, setStep] = useState("config"); // config | loading | quiz | results
    const [questionCount, setQuestionCount] = useState(10);
    const [difficulty, setDifficulty] = useState("medium");
    const [questions, setQuestions] = useState([]);
    const [currentQ, setCurrentQ] = useState(0);
    const [answers, setAnswers] = useState({});
    const [openAnswers, setOpenAnswers] = useState({});
    const [showExplanation, setShowExplanation] = useState(false);
    const [error, setError] = useState("");

    if (!isOpen) return null;

    const handleGenerate = async () => {
        setStep("loading");
        setError("");
        try {
            const qs = await generateQuiz(subjectName, topicName, questionCount, difficulty);
            setQuestions(qs);
            setCurrentQ(0);
            setAnswers({});
            setOpenAnswers({});
            setShowExplanation(false);
            setStep("quiz");
        } catch (err) {
            setError(err.message);
            setStep("config");
        }
    };

    const handleAnswer = (qIndex, answerIndex) => {
        if (answers[qIndex] !== undefined) return; // already answered
        setAnswers({ ...answers, [qIndex]: answerIndex });
        setShowExplanation(true);
    };

    const handleOpenAnswer = (qIndex) => {
        if (answers[qIndex] !== undefined) return;
        setAnswers({ ...answers, [qIndex]: "open" });
        setShowExplanation(true);
    };

    const handleNext = () => {
        setShowExplanation(false);
        if (currentQ < questions.length - 1) {
            setCurrentQ(currentQ + 1);
        } else {
            setStep("results");
        }
    };

    const handleReset = () => {
        setStep("config");
        setQuestions([]);
        setAnswers({});
        setOpenAnswers({});
        setCurrentQ(0);
        setShowExplanation(false);
        setError("");
    };

    const handleClose = () => {
        handleReset();
        onClose();
    };

    // Calculate results
    const getResults = () => {
        let correct = 0;
        let total = questions.length;
        const mcqQuestions = questions.filter((q) => q.type === "mcq");

        mcqQuestions.forEach((q) => {
            if (answers[q.index] === q.correct) correct++;
        });

        return {
            correct,
            total,
            mcqTotal: mcqQuestions.length,
            percent: mcqQuestions.length > 0 ? Math.round((correct / mcqQuestions.length) * 100) : 0,
        };
    };

    const q = questions[currentQ];

    return (
        <div className="quiz-overlay" onClick={handleClose}>
            <div className="quiz-modal glass-card-static" onClick={(e) => e.stopPropagation()}>
                <div className="quiz-header">
                    <h3>📝 {topicName} — Test</h3>
                    <button className="btn btn-ghost btn-icon" onClick={handleClose}>✕</button>
                </div>

                {/* Config Step */}
                {step === "config" && (
                    <div className="quiz-config">
                        <div className="quiz-config-topic">
                            <span className="quiz-config-label">Fənn:</span>
                            <span>{subjectName}</span>
                        </div>
                        <div className="quiz-config-topic">
                            <span className="quiz-config-label">Mövzu:</span>
                            <span>{topicName}</span>
                        </div>

                        <div className="divider" />

                        <ModelSelector />

                        <div className="quiz-setting">
                            <label>Sual sayı</label>
                            <div className="quiz-count-options">
                                {[5, 10, 15, 20].map((n) => (
                                    <button
                                        key={n}
                                        className={`btn btn-sm ${questionCount === n ? "btn-primary" : "btn-secondary"}`}
                                        onClick={() => setQuestionCount(n)}
                                    >
                                        {n}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="quiz-setting">
                            <label>Çətinlik səviyyəsi</label>
                            <div className="quiz-diff-options">
                                {[
                                    { id: "easy", label: "🟢 Asan", color: "var(--success)" },
                                    { id: "medium", label: "🟡 Orta", color: "var(--warning)" },
                                    { id: "hard", label: "🔴 Çətin", color: "var(--danger)" },
                                ].map((d) => (
                                    <button
                                        key={d.id}
                                        className={`quiz-diff-btn ${difficulty === d.id ? "active" : ""}`}
                                        onClick={() => setDifficulty(d.id)}
                                        style={{ "--diff-color": d.color }}
                                    >
                                        {d.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {error && (
                            <div className="setup-error">
                                <span>⚠️</span>
                                <span>{error}</span>
                            </div>
                        )}

                        <button className="btn btn-primary btn-lg quiz-start-btn" onClick={handleGenerate}>
                            🚀 Testi Başlat
                        </button>
                    </div>
                )}

                {/* Loading */}
                {step === "loading" && (
                    <div className="quiz-loading">
                        <div className="spinner-lg" />
                        <p>AI suallar hazırlayır...</p>
                        <p className="quiz-loading-sub">{questionCount} sual · {difficulty === "easy" ? "Asan" : difficulty === "medium" ? "Orta" : "Çətin"}</p>
                    </div>
                )}

                {/* Quiz Step */}
                {step === "quiz" && q && (
                    <div className="quiz-question">
                        <div className="quiz-progress">
                            <span className="quiz-progress-text">
                                Sual {currentQ + 1} / {questions.length}
                            </span>
                            <div className="progress-bar-track">
                                <div
                                    className="progress-bar-fill"
                                    style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
                                />
                            </div>
                        </div>

                        <div className="quiz-q-text">{q.question}</div>

                        {q.type === "mcq" && q.options && (
                            <div className="quiz-options">
                                {q.options.map((opt, i) => {
                                    const answered = answers[q.index] !== undefined;
                                    const isSelected = answers[q.index] === i;
                                    const isCorrect = q.correct === i;

                                    let optClass = "quiz-option";
                                    if (answered) {
                                        if (isCorrect) optClass += " correct";
                                        else if (isSelected && !isCorrect) optClass += " wrong";
                                    }

                                    return (
                                        <button
                                            key={i}
                                            className={optClass}
                                            onClick={() => handleAnswer(q.index, i)}
                                            disabled={answered}
                                        >
                                            {opt}
                                        </button>
                                    );
                                })}
                            </div>
                        )}

                        {q.type === "open" && (
                            <div className="quiz-open">
                                <textarea
                                    className="textarea"
                                    placeholder="Cavabınızı yazın..."
                                    value={openAnswers[q.index] || ""}
                                    onChange={(e) => setOpenAnswers({ ...openAnswers, [q.index]: e.target.value })}
                                    disabled={answers[q.index] !== undefined}
                                />
                                {answers[q.index] === undefined && (
                                    <button
                                        className="btn btn-primary btn-sm"
                                        onClick={() => handleOpenAnswer(q.index)}
                                        disabled={!openAnswers[q.index]?.trim()}
                                    >
                                        Cavabı göstər
                                    </button>
                                )}
                                {answers[q.index] !== undefined && q.correct_answer && (
                                    <div className="quiz-correct-answer">
                                        <strong>Düzgün cavab:</strong> {q.correct_answer}
                                    </div>
                                )}
                            </div>
                        )}

                        {showExplanation && q.explanation && (
                            <div className="quiz-explanation animate-scale-in">
                                <strong>💡 İzah:</strong> {q.explanation}
                            </div>
                        )}

                        {answers[q.index] !== undefined && (
                            <button className="btn btn-primary quiz-next-btn" onClick={handleNext}>
                                {currentQ < questions.length - 1 ? "Növbəti sual →" : "Nəticələrə bax →"}
                            </button>
                        )}
                    </div>
                )}

                {/* Results */}
                {step === "results" && (
                    <div className="quiz-results">
                        {(() => {
                            const res = getResults();
                            const emoji = res.percent >= 80 ? "🏆" : res.percent >= 50 ? "👍" : "📚";
                            return (
                                <>
                                    <div className="quiz-results-icon">{emoji}</div>
                                    <h2>Nəticə: {res.percent}%</h2>
                                    <p>
                                        {res.correct} / {res.mcqTotal} şıqlı suala düzgün cavab
                                    </p>
                                    {res.percent >= 80 && <p className="quiz-results-msg success">Əla nəticə! 🎉</p>}
                                    {res.percent >= 50 && res.percent < 80 && <p className="quiz-results-msg warning">Yaxşı, amma daha çox çalışmaq lazımdır</p>}
                                    {res.percent < 50 && <p className="quiz-results-msg danger">Bu mövzunu yenidən nəzərdən keçirin</p>}

                                    <div className="quiz-results-actions">
                                        <button className="btn btn-primary" onClick={handleReset}>
                                            🔄 Yenidən test et
                                        </button>
                                        <button className="btn btn-secondary" onClick={handleClose}>
                                            Bağla
                                        </button>
                                    </div>
                                </>
                            );
                        })()}
                    </div>
                )}
            </div>
        </div>
    );
}
