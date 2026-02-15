import { Link } from "react-router-dom";
import { getSubjectEmoji } from "../constants";
import { getPlanStats } from "../utils/planGenerator";
import { formatDateShort } from "../utils/helpers";
import "./SubjectCard.css";

export default function SubjectCard({ subject, onDelete }) {
    const emoji = getSubjectEmoji(subject.name);
    const stats = getPlanStats(subject);
    const hasTopics = subject.topics && subject.topics.length > 0;
    const hasPlan = subject.plan && subject.plan.length > 0;

    // Determine the next step link
    let nextLink = `/subject/${subject.id}/setup`;
    let nextLabel = "Mövzuları yarat";
    if (hasTopics && !hasPlan) {
        nextLink = `/subject/${subject.id}/plan-config`;
        nextLabel = "Planı qur";
    } else if (hasPlan) {
        nextLink = `/subject/${subject.id}/daily`;
        nextLabel = "Plana bax";
    }

    return (
        <div className="subject-card glass-card">
            <div className="subject-card-header">
                <div className="subject-card-icon">{emoji}</div>
                <div className="subject-card-info">
                    <h3>{subject.name}</h3>
                    <p className="subject-card-range">{subject.topicRange}</p>
                </div>
                <button
                    className="btn btn-ghost btn-icon subject-card-delete"
                    onClick={(e) => {
                        e.preventDefault();
                        onDelete(subject.id);
                    }}
                    title="Sil"
                >
                    🗑️
                </button>
            </div>

            {hasPlan && (
                <div className="subject-card-progress">
                    <div className="progress-bar-track">
                        <div
                            className="progress-bar-fill"
                            style={{ width: `${stats.progressPercent}%` }}
                        />
                    </div>
                    <div className="subject-card-stats">
                        <span className="stat">
                            📊 {stats.progressPercent}%
                        </span>
                        {subject.examDate && (
                            <span className="stat">
                                📅 {formatDateShort(subject.examDate)}
                            </span>
                        )}
                        <span className="stat">
                            📚 {stats.completedTopics}/{stats.totalTopics}
                        </span>
                    </div>
                </div>
            )}

            {!hasPlan && hasTopics && (
                <div className="subject-card-meta">
                    <span className="badge badge-info">📝 {subject.topics.length} mövzu</span>
                    <span className="badge badge-warning">⏳ Plan yaradılmayıb</span>
                </div>
            )}

            {!hasTopics && (
                <div className="subject-card-meta">
                    <span className="badge badge-warning">⏳ Mövzular yaradılmayıb</span>
                </div>
            )}

            <div className="subject-card-actions">
                <Link to={nextLink} className="btn btn-primary btn-sm">
                    {nextLabel} →
                </Link>
                {hasTopics && (
                    <Link
                        to={`/subject/${subject.id}/topics`}
                        className="btn btn-secondary btn-sm"
                    >
                        ✏️ Mövzuları redaktə et
                    </Link>
                )}
                {hasPlan && (
                    <Link
                        to={`/subject/${subject.id}/progress`}
                        className="btn btn-ghost btn-sm"
                    >
                        📊 İrəliləyiş
                    </Link>
                )}
            </div>
        </div>
    );
}
