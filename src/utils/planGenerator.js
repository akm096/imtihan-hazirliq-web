// Plan generator — distributes topics evenly across days until exam date

/**
 * Generate a daily study plan.
 * @param {Array} topics - Array of topic objects with id, name, order
 * @param {string} examDateStr - Exam date in YYYY-MM-DD format
 * @param {number} dailyHours - Hours per day the student wants to study
 * @returns {Array} - Array of day objects { date, topics: [topicIds], completed, completedTopics }
 */
export function generatePlan(topics, examDateStr, dailyHours) {
    if (!topics || topics.length === 0) return [];
    if (!examDateStr) return [];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const examDate = new Date(examDateStr);
    examDate.setHours(0, 0, 0, 0);

    // Calculate available days (excluding exam day itself)
    const diffMs = examDate - today;
    const totalDays = Math.max(1, Math.floor(diffMs / (1000 * 60 * 60 * 24)));

    const totalTopics = topics.length;

    // Base topics per day, distributed evenly
    const topicsPerDay = Math.max(1, Math.ceil(totalTopics / totalDays));

    const plan = [];
    let topicIndex = 0;

    for (let dayNum = 0; dayNum < totalDays && topicIndex < totalTopics; dayNum++) {
        const date = new Date(today);
        date.setDate(date.getDate() + dayNum);

        const dayTopics = [];
        const dayLimit = Math.min(topicsPerDay, totalTopics - topicIndex);

        for (let t = 0; t < dayLimit; t++) {
            dayTopics.push(topics[topicIndex].id);
            topicIndex++;
        }

        if (dayTopics.length > 0) {
            plan.push({
                date: formatDate(date),
                dayLabel: getDayLabel(date),
                topics: dayTopics,
                completed: false,
                completedTopics: [],
            });
        }
    }

    return plan;
}

/**
 * Get plan statistics
 */
export function getPlanStats(subject) {
    if (!subject || !subject.plan || subject.plan.length === 0) {
        return {
            totalDays: 0,
            completedDays: 0,
            totalTopics: 0,
            completedTopics: 0,
            progressPercent: 0,
            daysRemaining: 0,
            streak: 0,
        };
    }

    const totalDays = subject.plan.length;
    const completedDays = subject.plan.filter((d) => d.completed).length;
    const totalTopics = subject.topics?.length || 0;

    // Count all completed topics across all days
    const completedTopicIds = new Set();
    subject.plan.forEach((day) => {
        (day.completedTopics || []).forEach((t) => completedTopicIds.add(t));
    });
    const completedTopics = completedTopicIds.size;

    const progressPercent =
        totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

    // Days remaining until exam
    let daysRemaining = 0;
    if (subject.examDate) {
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        const exam = new Date(subject.examDate);
        exam.setHours(0, 0, 0, 0);
        daysRemaining = Math.max(0, Math.ceil((exam - now) / (1000 * 60 * 60 * 24)));
    }

    // Calculate streak (consecutive completed days ending at today or yesterday)
    let streak = 0;
    const sortedPlan = [...subject.plan].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
    );
    const todayStr = formatDate(new Date());
    let checkDate = new Date();

    for (const day of sortedPlan) {
        const dayStr = day.date;
        const checkStr = formatDate(checkDate);

        if (dayStr === checkStr && day.completed) {
            streak++;
            checkDate.setDate(checkDate.getDate() - 1);
        } else if (dayStr === checkStr && !day.completed) {
            // today not completed yet, check yesterday
            if (dayStr === todayStr) {
                checkDate.setDate(checkDate.getDate() - 1);
                continue;
            }
            break;
        }
    }

    return {
        totalDays,
        completedDays,
        totalTopics,
        completedTopics,
        progressPercent,
        daysRemaining,
        streak,
    };
}

// ─── Helpers ───

function formatDate(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
}

function getDayLabel(date) {
    const days = [
        "Bazar", "B.e.", "Ç.a.", "Çərşənbə", "C.a.", "Cümə", "Şənbə",
    ];
    return days[date.getDay()];
}
