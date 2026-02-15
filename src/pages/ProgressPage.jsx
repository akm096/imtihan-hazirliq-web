import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getSubject } from "../utils/storage";
import { getPlanStats } from "../utils/planGenerator";
import { getSubjectEmoji, getMotivation } from "../constants";
import { formatDateAz } from "../utils/helpers";
import ProgressBar from "../components/ProgressBar";
import "./ProgressPage.css";

export default function ProgressPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [subject, setSubject] = useState(null);

    useEffect(() => {
        const sub = getSubject(id);
        if (!sub) {
            navigate("/");
            return;
        }
        setSubject(sub);
    }, [id, navigate]);

    if (!subject) return null;

    const emoji = getSubjectEmoji(subject.name);
    const stats = getPlanStats(subject);

    // Get completed & remaining topic names
    const completedTopicIds = new Set();
    (subject.plan || []).forEach((day) => {
        (day.completedTopics || []).forEach((t) => completedTopicIds.add(t));
    });

    const completedTopics = (subject.topics || []).filter((t) =>
        completedTopicIds.has(t.id)
    );
    const remainingTopics = (subject.topics || []).filter(
        (t) => !completedTopicIds.has(t.id)
    );

    // Determine motivation level
    let motivCategory = "start";
    if (stats.progressPercent >= 100) motivCategory = "completed";
    else if (stats.progressPercent >= 75) motivCategory = "progress_high";
    else if (stats.progressPercent >= 40) motivCategory = "progress_mid";
    else if (stats.progressPercent > 0) motivCategory = "progress_low";

    return (
        <div className="page">
            <div className="container">
                <div className="page-header">
                    <h1>
                        {emoji} {subject.name} — İrəliləyiş
                    </h1>
                    {subject.examDate && (
                        <p>İmtahan tarixi: {formatDateAz(subject.examDate)}</p>
                    )}
                </div>

                {/* Main Progress */}
                <div className="progress-hero glass-card-static">
                    <div className="progress-hero-circle">
                        <svg viewBox="0 0 120 120" className="progress-ring">
                            <circle
                                cx="60"
                                cy="60"
                                r="52"
                                fill="none"
                                stroke="rgba(255,255,255,0.08)"
                                strokeWidth="8"
                            />
                            <circle
                                cx="60"
                                cy="60"
                                r="52"
                                fill="none"
                                stroke="url(#progressGrad)"
                                strokeWidth="8"
                                strokeLinecap="round"
                                strokeDasharray={`${(stats.progressPercent / 100) * 327} 327`}
                                transform="rotate(-90 60 60)"
                                className="progress-ring-fill"
                            />
                            <defs>
                                <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#667eea" />
                                    <stop offset="100%" stopColor="#764ba2" />
                                </linearGradient>
                            </defs>
                        </svg>
                        <div className="progress-hero-percent">
                            <span className="progress-hero-value">{stats.progressPercent}</span>
                            <span className="progress-hero-sign">%</span>
                        </div>
                    </div>
                    <div className="progress-hero-message">{getMotivation(motivCategory)}</div>
                </div>

                {/* Stats Grid */}
                <div className="progress-stats-grid">
                    <div className="progress-stat-card glass-card-static">
                        <div className="progress-stat-icon">📚</div>
                        <div className="progress-stat-value">{stats.totalTopics}</div>
                        <div className="progress-stat-label">Ümumi mövzu</div>
                    </div>
                    <div className="progress-stat-card glass-card-static">
                        <div className="progress-stat-icon">✅</div>
                        <div className="progress-stat-value">{stats.completedTopics}</div>
                        <div className="progress-stat-label">Tamamlandı</div>
                    </div>
                    <div className="progress-stat-card glass-card-static">
                        <div className="progress-stat-icon">📅</div>
                        <div className="progress-stat-value">{stats.daysRemaining}</div>
                        <div className="progress-stat-label">Gün qalıb</div>
                    </div>
                    <div className="progress-stat-card glass-card-static">
                        <div className="progress-stat-icon">🔥</div>
                        <div className="progress-stat-value">{stats.streak}</div>
                        <div className="progress-stat-label">Gün ardıcıl</div>
                    </div>
                </div>

                {/* Topic Status */}
                <div className="topic-status-section">
                    {remainingTopics.length > 0 && (
                        <div className="topic-status-block glass-card-static">
                            <h3>📝 Qalan mövzular ({remainingTopics.length})</h3>
                            <div className="topic-status-list">
                                {remainingTopics.map((t) => (
                                    <div key={t.id} className="topic-status-item remaining">
                                        <span>⬜</span>
                                        <span>{t.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {completedTopics.length > 0 && (
                        <div className="topic-status-block glass-card-static">
                            <h3>✅ Tamamlanan mövzular ({completedTopics.length})</h3>
                            <div className="topic-status-list">
                                {completedTopics.map((t) => (
                                    <div key={t.id} className="topic-status-item completed">
                                        <span>✅</span>
                                        <span>{t.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="progress-footer">
                    <Link to={`/subject/${id}/daily`} className="btn btn-primary">
                        📋 Gündəlik Plana Qayıt
                    </Link>
                    <Link to="/" className="btn btn-ghost">
                        ← Ana Səhifə
                    </Link>
                </div>
            </div>
        </div>
    );
}
