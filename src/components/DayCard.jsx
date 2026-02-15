import { formatDateAz, isToday, isPast } from "../utils/helpers";
import "./DayCard.css";

export default function DayCard({ day, topics, subjectTopics, onToggleTopic }) {
    const dayTopics = day.topics
        .map((tid) => subjectTopics.find((t) => t.id === tid))
        .filter(Boolean);

    const completedCount = (day.completedTopics || []).length;
    const totalCount = dayTopics.length;
    const allDone = totalCount > 0 && completedCount === totalCount;
    const today = isToday(day.date);
    const past = isPast(day.date);

    return (
        <div
            className={`day-card glass-card ${today ? "day-card-today" : ""} ${allDone ? "day-card-done" : ""} ${past && !allDone ? "day-card-past" : ""}`}
            id={today ? "today-card" : undefined}
        >
            <div className="day-card-header">
                <div className="day-card-date">
                    <span className="day-card-label">{day.dayLabel}</span>
                    <span className="day-card-full-date">{formatDateAz(day.date)}</span>
                </div>
                <div className="day-card-status">
                    {today && <span className="badge badge-info">📍 Bu gün</span>}
                    {allDone && <span className="badge badge-success">✅ Tamamlandı</span>}
                    {past && !allDone && !today && (
                        <span className="badge badge-danger">⚠️ Keçib</span>
                    )}
                    {!past && !today && !allDone && (
                        <span className="day-card-counter">
                            {completedCount}/{totalCount}
                        </span>
                    )}
                </div>
            </div>

            <div className="day-card-topics">
                {dayTopics.map((topic) => {
                    const isDone = (day.completedTopics || []).includes(topic.id);
                    return (
                        <label
                            key={topic.id}
                            className={`day-topic ${isDone ? "day-topic-done" : ""}`}
                        >
                            <input
                                type="checkbox"
                                checked={isDone}
                                onChange={() => onToggleTopic(day.date, topic.id)}
                                className="day-topic-checkbox"
                            />
                            <span className="day-topic-check">{isDone ? "✅" : "⬜"}</span>
                            <span className="day-topic-name">{topic.name}</span>
                        </label>
                    );
                })}
            </div>
        </div>
    );
}
