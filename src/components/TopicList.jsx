import { useState } from "react";
import "./TopicList.css";

export default function TopicList({ topics, onUpdate }) {
    const [editingId, setEditingId] = useState(null);
    const [editValue, setEditValue] = useState("");
    const [newTopicValue, setNewTopicValue] = useState("");
    const [insertAfter, setInsertAfter] = useState(null); // topic id to insert after
    const [insertValue, setInsertValue] = useState("");

    const handleDelete = (id) => {
        const updated = topics.filter((t) => t.id !== id);
        updated.forEach((t, i) => (t.order = i));
        onUpdate(updated);
    };

    const handleEdit = (id) => {
        const topic = topics.find((t) => t.id === id);
        if (topic) {
            setEditingId(id);
            setEditValue(topic.name);
        }
    };

    const handleEditSave = () => {
        if (!editValue.trim()) return;
        const updated = topics.map((t) =>
            t.id === editingId ? { ...t, name: editValue.trim() } : t
        );
        onUpdate(updated);
        setEditingId(null);
        setEditValue("");
    };

    const handleEditCancel = () => {
        setEditingId(null);
        setEditValue("");
    };

    const handleAddEnd = () => {
        if (!newTopicValue.trim()) return;
        const newTopic = {
            id: crypto.randomUUID(),
            name: newTopicValue.trim(),
            order: topics.length,
        };
        onUpdate([...topics, newTopic]);
        setNewTopicValue("");
    };

    const handleInsertShow = (afterId) => {
        setInsertAfter(afterId);
        setInsertValue("");
    };

    const handleInsertSave = () => {
        if (!insertValue.trim()) return;
        const afterIdx = topics.findIndex((t) => t.id === insertAfter);
        const newTopic = {
            id: crypto.randomUUID(),
            name: insertValue.trim(),
            order: afterIdx + 1,
        };
        const updated = [...topics];
        updated.splice(afterIdx + 1, 0, newTopic);
        updated.forEach((t, i) => (t.order = i));
        onUpdate(updated);
        setInsertAfter(null);
        setInsertValue("");
    };

    const handleMoveUp = (idx) => {
        if (idx === 0) return;
        const updated = [...topics];
        [updated[idx - 1], updated[idx]] = [updated[idx], updated[idx - 1]];
        updated.forEach((t, i) => (t.order = i));
        onUpdate(updated);
    };

    const handleMoveDown = (idx) => {
        if (idx === topics.length - 1) return;
        const updated = [...topics];
        [updated[idx], updated[idx + 1]] = [updated[idx + 1], updated[idx]];
        updated.forEach((t, i) => (t.order = i));
        onUpdate(updated);
    };

    return (
        <div className="topic-list">
            <div className="topic-list-header">
                <span className="topic-count">{topics.length} mövzu</span>
            </div>

            <div className="topic-items">
                {topics.map((topic, idx) => (
                    <div key={topic.id}>
                        <div className="topic-item animate-fade-in">
                            <span className="topic-number">{idx + 1}</span>

                            {editingId === topic.id ? (
                                <div className="topic-edit-row">
                                    <input
                                        className="input topic-edit-input"
                                        value={editValue}
                                        onChange={(e) => setEditValue(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") handleEditSave();
                                            if (e.key === "Escape") handleEditCancel();
                                        }}
                                        autoFocus
                                    />
                                    <button
                                        className="btn btn-success btn-icon btn-sm"
                                        onClick={handleEditSave}
                                        title="Saxla"
                                    >
                                        ✓
                                    </button>
                                    <button
                                        className="btn btn-ghost btn-icon btn-sm"
                                        onClick={handleEditCancel}
                                        title="Ləğv et"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <span className="topic-name">{topic.name}</span>
                                    <div className="topic-actions">
                                        <button
                                            className="btn btn-ghost btn-icon btn-sm"
                                            onClick={() => handleMoveUp(idx)}
                                            disabled={idx === 0}
                                            title="Yuxarı"
                                        >
                                            ↑
                                        </button>
                                        <button
                                            className="btn btn-ghost btn-icon btn-sm"
                                            onClick={() => handleMoveDown(idx)}
                                            disabled={idx === topics.length - 1}
                                            title="Aşağı"
                                        >
                                            ↓
                                        </button>
                                        <button
                                            className="btn btn-ghost btn-icon btn-sm"
                                            onClick={() => handleInsertShow(topic.id)}
                                            title="Araya əlavə et"
                                        >
                                            ➕
                                        </button>
                                        <button
                                            className="btn btn-ghost btn-icon btn-sm"
                                            onClick={() => handleEdit(topic.id)}
                                            title="Redaktə et"
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            className="btn btn-ghost btn-icon btn-sm"
                                            onClick={() => handleDelete(topic.id)}
                                            title="Sil"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>

                        {insertAfter === topic.id && (
                            <div className="topic-insert-row animate-scale-in">
                                <input
                                    className="input"
                                    placeholder="Yeni mövzu adı..."
                                    value={insertValue}
                                    onChange={(e) => setInsertValue(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") handleInsertSave();
                                        if (e.key === "Escape") setInsertAfter(null);
                                    }}
                                    autoFocus
                                />
                                <button
                                    className="btn btn-success btn-sm"
                                    onClick={handleInsertSave}
                                    disabled={!insertValue.trim()}
                                >
                                    Əlavə et
                                </button>
                                <button
                                    className="btn btn-ghost btn-sm"
                                    onClick={() => setInsertAfter(null)}
                                >
                                    Ləğv et
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Add topic at end */}
            <div className="topic-add-row">
                <input
                    className="input"
                    placeholder="Yeni mövzu əlavə et..."
                    value={newTopicValue}
                    onChange={(e) => setNewTopicValue(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") handleAddEnd();
                    }}
                />
                <button
                    className="btn btn-primary btn-sm"
                    onClick={handleAddEnd}
                    disabled={!newTopicValue.trim()}
                >
                    ➕ Əlavə et
                </button>
            </div>
        </div>
    );
}
