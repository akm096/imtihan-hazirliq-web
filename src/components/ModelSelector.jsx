import { useState } from "react";
import { AI_MODELS, getSelectedModel, setSelectedModel } from "../utils/ai";
import "./ModelSelector.css";

export default function ModelSelector() {
    const [current, setCurrent] = useState(getSelectedModel());

    const handleChange = (modelId) => {
        setCurrent(modelId);
        setSelectedModel(modelId);
    };

    return (
        <div className="model-selector">
            <span className="model-selector-label">🤖 AI Model:</span>
            <div className="model-options">
                {AI_MODELS.map((m) => (
                    <button
                        key={m.id}
                        className={`model-option ${current === m.id ? "active" : ""}`}
                        onClick={() => handleChange(m.id)}
                        title={m.desc}
                    >
                        <span className="model-option-name">{m.name}</span>
                        <span className="model-option-desc">{m.desc}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}
