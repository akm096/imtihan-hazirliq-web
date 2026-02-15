// localStorage wrapper for İmtihan Veb data

const STORAGE_KEY = "imtihan_veb_data";

function getAll() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return { subjects: [] };
        return JSON.parse(raw);
    } catch {
        return { subjects: [] };
    }
}

function saveAll(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// ─── Subjects ───

export function getSubjects() {
    return getAll().subjects || [];
}

export function getSubject(id) {
    return getSubjects().find((s) => s.id === id) || null;
}

export function saveSubject(subject) {
    const data = getAll();
    const idx = data.subjects.findIndex((s) => s.id === subject.id);
    if (idx >= 0) {
        data.subjects[idx] = subject;
    } else {
        data.subjects.push(subject);
    }
    saveAll(data);
    return subject;
}

export function deleteSubject(id) {
    const data = getAll();
    data.subjects = data.subjects.filter((s) => s.id !== id);
    saveAll(data);
}

// ─── Topics within a subject ───

export function updateTopics(subjectId, topics) {
    const subject = getSubject(subjectId);
    if (!subject) return;
    subject.topics = topics;
    saveSubject(subject);
}

// ─── Plan within a subject ───

export function updatePlan(subjectId, plan) {
    const subject = getSubject(subjectId);
    if (!subject) return;
    subject.plan = plan;
    saveSubject(subject);
}

export function toggleDayCompletion(subjectId, dateStr) {
    const subject = getSubject(subjectId);
    if (!subject || !subject.plan) return null;
    const day = subject.plan.find((d) => d.date === dateStr);
    if (day) {
        day.completed = !day.completed;
        saveSubject(subject);
    }
    return subject;
}

export function toggleTopicInDay(subjectId, dateStr, topicId) {
    const subject = getSubject(subjectId);
    if (!subject || !subject.plan) return null;
    const day = subject.plan.find((d) => d.date === dateStr);
    if (day) {
        if (!day.completedTopics) day.completedTopics = [];
        const tIdx = day.completedTopics.indexOf(topicId);
        if (tIdx >= 0) {
            day.completedTopics.splice(tIdx, 1);
        } else {
            day.completedTopics.push(topicId);
        }
        // Mark day as completed if all topics done
        day.completed = day.topics.length > 0 && day.topics.every((t) => day.completedTopics.includes(t));
        saveSubject(subject);
    }
    return subject;
}

// ─── Helper: create new subject object ───

export function createSubjectObj(name, topicRange) {
    return {
        id: crypto.randomUUID(),
        name,
        topicRange,
        topics: [],
        examDate: null,
        dailyHours: 2,
        plan: [],
        createdAt: new Date().toISOString(),
    };
}
