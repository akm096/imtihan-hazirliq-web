import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SubjectCard from "../components/SubjectCard";
import Modal from "../components/Modal";
import { getSubjects, deleteSubject, saveSubject, createSubjectObj } from "../utils/storage";
import "./HomePage.css";

export default function HomePage() {
    const [subjects, setSubjects] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newName, setNewName] = useState("");
    const [newRange, setNewRange] = useState("");
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    useEffect(() => {
        setSubjects(getSubjects());
    }, []);

    const handleAdd = () => {
        if (!newName.trim() || !newRange.trim()) return;
        const subject = createSubjectObj(newName.trim(), newRange.trim());
        saveSubject(subject);
        setSubjects(getSubjects());
        setNewName("");
        setNewRange("");
        setShowAddModal(false);
    };

    const handleDelete = (id) => {
        setDeleteConfirm(id);
    };

    const confirmDelete = () => {
        if (deleteConfirm) {
            deleteSubject(deleteConfirm);
            setSubjects(getSubjects());
            setDeleteConfirm(null);
        }
    };

    return (
        <div className="page">
            <div className="container">
                {/* Hero Section */}
                <div className="hero">
                    <div className="hero-bg-glow" />
                    <h1 className="hero-title">
                        📖 İmtahana <span className="gradient-text">Hazırlıq</span> Planı
                    </h1>
                    <p className="hero-subtitle">
                        AI dəstəyi ilə mövzu siyahısı yarat, imtahan tarixinə qədər gündəlik
                        plan qur və irəliləyişini izlə.
                    </p>
                    <button
                        className="btn btn-primary btn-lg"
                        onClick={() => setShowAddModal(true)}
                    >
                        ➕ Yeni Fənn Əlavə Et
                    </button>
                </div>

                {/* Subject Cards */}
                {subjects.length > 0 ? (
                    <div className="subjects-grid">
                        {subjects.map((sub) => (
                            <SubjectCard key={sub.id} subject={sub} onDelete={handleDelete} />
                        ))}
                    </div>
                ) : (
                    <div className="empty-state glass-card-static">
                        <div className="empty-state-icon">📚</div>
                        <h3>Hələ heç bir fənn əlavə edilməyib</h3>
                        <p>
                            Fənn əlavə edərək imtahan hazırlığına başlayın.<br />
                            AI sizə mövzu siyahısı yaratmaqda kömək edəcək!
                        </p>
                        <button
                            className="btn btn-primary"
                            onClick={() => setShowAddModal(true)}
                        >
                            ➕ İlk Fənni Əlavə Et
                        </button>
                    </div>
                )}

                {/* How it works */}
                {subjects.length === 0 && (
                    <div className="how-it-works">
                        <h2>🎯 Necə İşləyir?</h2>
                        <div className="steps-grid">
                            <div className="step-card glass-card-static">
                                <div className="step-number">1</div>
                                <h4>Fənn Əlavə Et</h4>
                                <p>Fənn adını və hansı mövzuya qədər çalışacağınızı yazın</p>
                            </div>
                            <div className="step-card glass-card-static">
                                <div className="step-number">2</div>
                                <h4>AI Mövzu Siyahısı</h4>
                                <p>AI avtomatik mövzu siyahısı yaradır, siz redaktə edirsiniz</p>
                            </div>
                            <div className="step-card glass-card-static">
                                <div className="step-number">3</div>
                                <h4>Plan Qur</h4>
                                <p>İmtahan tarixini seçin, gündəlik saat təyin edin</p>
                            </div>
                            <div className="step-card glass-card-static">
                                <div className="step-number">4</div>
                                <h4>Çalış & İzlə</h4>
                                <p>Hər gün mövzuları tamamlayın və irəliləyişinizi görün</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Add Subject Modal */}
            <Modal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                title="➕ Yeni Fənn Əlavə Et"
            >
                <div className="input-group">
                    <label>Fənn adı</label>
                    <input
                        className="input"
                        placeholder="Məs: Riyaziyyat, Fizika, Tarix..."
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                        autoFocus
                    />
                </div>
                <div className="input-group">
                    <label>Hansı mövzuya qədər?</label>
                    <textarea
                        className="textarea"
                        placeholder="Məs: Triqonometriyaya qədər, və ya Mexanika bölməsinə qədər..."
                        value={newRange}
                        onChange={(e) => setNewRange(e.target.value)}
                    />
                </div>
                <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
                    <button
                        className="btn btn-secondary"
                        onClick={() => setShowAddModal(false)}
                    >
                        Ləğv et
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={handleAdd}
                        disabled={!newName.trim() || !newRange.trim()}
                    >
                        Əlavə et →
                    </button>
                </div>
            </Modal>

            {/* Delete Confirm Modal */}
            <Modal
                isOpen={!!deleteConfirm}
                onClose={() => setDeleteConfirm(null)}
                title="🗑️ Fənni Sil"
            >
                <p>
                    Bu fənni silmək istədiyinizdən əminsiniz?<br />
                    Bütün mövzular və plan da silinəcək.
                </p>
                <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
                    <button
                        className="btn btn-secondary"
                        onClick={() => setDeleteConfirm(null)}
                    >
                        Ləğv et
                    </button>
                    <button className="btn btn-danger" onClick={confirmDelete}>
                        🗑️ Sil
                    </button>
                </div>
            </Modal>
        </div>
    );
}
