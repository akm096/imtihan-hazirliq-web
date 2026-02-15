import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getSubject, toggleTopicInDay } from "../utils/storage";
import { getPlanStats } from "../utils/planGenerator";
import { getSubjectEmoji, getMotivation } from "../constants";
import { isToday } from "../utils/helpers";
import DayCard from "../components/DayCard";
import ProgressBar from "../components/ProgressBar";
import MotivationBanner from "../components/MotivationBanner";
import AiChat from "../components/AiChat";
import QuizModal from "../components/QuizModal";
import "./DailyPlanPage.css";

export default function DailyPlanPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [subject, setSubject] = useState(null);
    const [quizTopic, setQuizTopic] = useState(null); // {name, subjectName}

    useEffect(() => {
        const sub = getSubject(id);
        if (!sub || !sub.plan || sub.plan.length === 0) {
            navigate("/");
            return;
        }
        setSubject(sub);
    }, [id, navigate]);

    // Scroll to today
    useEffect(() => {
        setTimeout(() => {
            const el = document.getElementById("today-card");
            if (el) {
                el.scrollIntoView({ behavior: "smooth", block: "center" });
            }
        }, 300);
    }, [subject]);

    const handleToggleTopic = (dateStr, topicId) => {
        const updated = toggleTopicInDay(id, dateStr, topicId);
        if (updated) {
            setSubject({ ...updated });
        }
    };

    if (!subject) return null;

    const emoji = getSubjectEmoji(subject.name);
    const stats = getPlanStats(subject);

    // Find today's topic for chat context
    const todayPlan = subject.plan.find((d) => isToday(d.date));
    const todayTopicIds = todayPlan?.topics || [];
    const todayTopics = todayTopicIds
        .map((tid) => subject.topics.find((t) => t.id === tid))
        .filter(Boolean);
    const currentTopicName = todayTopics.length > 0 ? todayTopics[0].name : null;

    return (
        <div className="page daily-page-with-chat">
            <div className="container">
                <div className="page-header">
                    <h1>
                        {emoji} {subject.name} — Gündəlik Plan
                    </h1>
                    <p>Hər gün mövzuları tamamlayaraq irəliləyişinizi izləyin</p>
                </div>

                {/* Progress Overview */}
                <div className="daily-overview glass-card-static">
                    <div className="daily-overview-stats">
                        <div className="daily-stat">
                            <span className="daily-stat-value">{stats.completedTopics}</span>
                            <span className="daily-stat-label">Tamamlandı</span>
                        </div>
                        <div className="daily-stat daily-stat-main">
                            <ProgressBar percent={stats.progressPercent} size="lg" />
                        </div>
                        <div className="daily-stat">
                            <span className="daily-stat-value">{stats.totalTopics - stats.completedTopics}</span>
                            <span className="daily-stat-label">Qalıb</span>
                        </div>
                        <div className="daily-stat">
                            <span className="daily-stat-value">{stats.daysRemaining}</span>
                            <span className="daily-stat-label">Gün qalıb</span>
                        </div>
                    </div>
                </div>

                {/* Motivation */}
                <MotivationBanner
                    progressPercent={stats.progressPercent}
                    streak={stats.streak}
                />

                {/* Topic Quiz Buttons */}
                <div className="topic-quiz-section glass-card-static">
                    <h3>📝 Mövzu Üzrə Test</h3>
                    <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "var(--space-md)" }}>
                        Hər hansı mövzuya klikləyərək AI test yaradın. Sual sayını və çətinliyi siz seçirsiniz.
                    </p>
                    <div className="topic-quiz-grid">
                        {(subject.topics || []).map((topic) => {
                            const isDone = stats.completedTopics > 0 &&
                                subject.plan.some((d) => (d.completedTopics || []).includes(topic.id));
                            return (
                                <button
                                    key={topic.id}
                                    className={`topic-quiz-btn ${isDone ? "done" : ""}`}
                                    onClick={() => setQuizTopic({ name: topic.name, subjectName: subject.name })}
                                >
                                    <span>{isDone ? "✅" : "📝"}</span>
                                    <span>{topic.name}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Day Cards */}
                <div className="daily-cards">
                    {subject.plan.map((day) => (
                        <DayCard
                            key={day.date}
                            day={day}
                            subjectTopics={subject.topics}
                            onToggleTopic={handleToggleTopic}
                        />
                    ))}
                </div>

                <div className="daily-footer">
                    <Link to="/" className="btn btn-ghost">
                        ← Ana Səhifə
                    </Link>
                    <Link
                        to={`/subject/${id}/progress`}
                        className="btn btn-secondary"
                    >
                        📊 İrəliləyiş Ekranı
                    </Link>
                    <Link
                        to={`/subject/${id}/plan-config`}
                        className="btn btn-ghost"
                    >
                        ⚙️ Planı yenidən qur
                    </Link>
                </div>
            </div>

            {/* AI Chat — fixed at bottom */}
            <AiChat
                subjectName={subject.name}
                currentTopicName={currentTopicName}
            />

            {/* Quiz Modal */}
            <QuizModal
                isOpen={!!quizTopic}
                onClose={() => setQuizTopic(null)}
                subjectName={quizTopic?.subjectName || subject.name}
                topicName={quizTopic?.name || ""}
            />
        </div>
    );
}
