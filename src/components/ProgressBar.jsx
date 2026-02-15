import "./ProgressBar.css";

export default function ProgressBar({ percent, label, size = "md" }) {
    return (
        <div className={`progress-wrap progress-${size}`}>
            {label && <div className="progress-label">{label}</div>}
            <div className="progress-track">
                <div
                    className="progress-fill"
                    style={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
                >
                    {percent > 5 && (
                        <span className="progress-text">{percent}%</span>
                    )}
                </div>
            </div>
            {percent <= 5 && (
                <span className="progress-text-outside">{percent}%</span>
            )}
        </div>
    );
}
