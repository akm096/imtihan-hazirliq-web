import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSubject, saveSubject } from "../utils/storage";
import { generatePlan } from "../utils/planGenerator";
import { getSubjectEmoji } from "../constants";
import { formatDateAz, daysBetween, getTodayStr } from "../utils/helpers";
import CalendarPicker from "../components/CalendarPicker";
import "./PlanConfigPage.css";

export default function PlanConfigPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [subject, setSubject] = useState(null);
    const [examDate, setExamDate] = useState("");
    const [dailyHours, setDailyHours] = useState(2);

    useEffect(() => {
        const sub = getSubject(id);
        if (!sub) {
            navigate("/");
            return;
        }
        setSubject(sub);
        if (sub.examDate) setExamDate(sub.examDate);
        if (sub.dailyHours) setDailyHours(sub.dailyHours);
    }, [id, navigate]);

    const handleCreatePlan = () => {
        if (!examDate || !subject) return;

        const plan = generatePlan(subject.topics, examDate, dailyHours);
        subject.examDate = examDate;
        subject.dailyHours = dailyHours;
        subject.plan = plan;
        saveSubject(subject);
        navigate(`/subject/${id}/daily`);
    };

    if (!subject) return null;

    const emoji = getSubjectEmoji(subject.name);
    const topicCount = subject.topics?.length || 0;
    const daysLeft = examDate ? daysBetween(getTodayStr(), examDate) : 0;
    const topicsPerDay = daysLeft > 0 ? Math.ceil(topicCount / daysLeft) : topicCount;

    return (
        <div className="page">
            <div className="container">
                <div className="page-header">
                    <h1>
                        {emoji} {subject.name} — Plan Qur
                    </h1>
                    <p>İmtahan tarixini seçin və gündəlik çalışma saatını təyin edin</p>
                </div>

                <div className="plan-config-layout">
                    {/* Calendar */}
                    <div className="plan-config-calendar">
                        <h3>📅 İmtahan Tarixi</h3>
                        <CalendarPicker value={examDate} onChange={setExamDate} />
                        {examDate && (
                            <p className="selected-date">
                                Seçilmiş: <strong>{formatDateAz(examDate)}</strong>
                            </p>
                        )}
                    </div>

                    {/* Settings + Summary */}
                    <div className="plan-config-settings">
                        <div className="glass-card-static">
                            <h3>⏰ Gündəlik Çalışma Saatı</h3>
                            <div className="hours-slider">
                                <input
                                    type="range"
                                    min="0.5"
                                    max="8"
                                    step="0.5"
                                    value={dailyHours}
                                    onChange={(e) => setDailyHours(Number(e.target.value))}
                                    className="slider"
                                />
                                <div className="hours-display">
                                    <span className="hours-value">{dailyHours}</span>
                                    <span className="hours-label">saat/gün</span>
                                </div>
                            </div>
                        </div>

                        {/* Summary */}
                        {examDate && (
                            <div className="plan-summary glass-card-static animate-scale-in">
                                <h3>📊 Plan Xülasəsi</h3>
                                <div className="summary-grid">
                                    <div className="summary-item">
                                        <span className="summary-value">{topicCount}</span>
                                        <span className="summary-label">Mövzu</span>
                                    </div>
                                    <div className="summary-item">
                                        <span className="summary-value">{daysLeft}</span>
                                        <span className="summary-label">Gün</span>
                                    </div>
                                    <div className="summary-item">
                                        <span className="summary-value">~{topicsPerDay}</span>
                                        <span className="summary-label">Mövzu/gün</span>
                                    </div>
                                    <div className="summary-item">
                                        <span className="summary-value">{dailyHours}s</span>
                                        <span className="summary-label">Gündəlik</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <button
                            className="btn btn-primary btn-lg plan-create-btn"
                            onClick={handleCreatePlan}
                            disabled={!examDate}
                        >
                            🚀 Planı Yarat
                        </button>
                    </div>
                </div>

                <button
                    className="btn btn-ghost"
                    onClick={() => navigate(`/subject/${id}/topics`)}
                    style={{ marginTop: "var(--space-lg)" }}
                >
                    ← Mövzulara qayıt
                </button>
            </div>
        </div>
    );
}
