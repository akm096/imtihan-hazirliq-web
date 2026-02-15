import { useState, useEffect } from "react";
import { getMotivation } from "../constants";
import "./MotivationBanner.css";

export default function MotivationBanner({ progressPercent, streak }) {
    const [message, setMessage] = useState("");

    useEffect(() => {
        let category = "start";
        if (progressPercent >= 100) {
            category = "completed";
        } else if (progressPercent >= 75) {
            category = "progress_high";
        } else if (progressPercent >= 40) {
            category = "progress_mid";
        } else if (progressPercent > 0) {
            category = "progress_low";
        }
        setMessage(getMotivation(category));
    }, [progressPercent]);

    return (
        <div className="motivation-banner glass-card-static">
            <div className="motivation-message">{message}</div>
            {streak > 1 && (
                <div className="motivation-streak">
                    🔥 {streak} gün ardıcıl çalışırsan!
                </div>
            )}
        </div>
    );
}
