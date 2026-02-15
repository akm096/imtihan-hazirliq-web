// Motivational messages in Azerbaijani
export const MOTIVATION_MESSAGES = {
    start: [
        "🚀 Hər böyük uğur kiçik bir addımla başlayır!",
        "💪 Sən bunu bacarırsan! İlk addımı at!",
        "📖 Bu gün başla, sabah fərqini hiss et!",
    ],
    progress_low: [
        "🎯 Hər gün bir az — böyük nəticə!",
        "🌱 Yavaş-yavaş böyüyürsən, davam et!",
        "💡 Ağıllı çalışma, çox çalışmadan daha vacibdir!",
    ],
    progress_mid: [
        "🔥 Əla gedirsən! Yarısı artıq keçdi!",
        "⭐ Nəticələrin görünür, təbriklər!",
        "💪 Hər keçən gün daha güclü olursan!",
    ],
    progress_high: [
        "🏆 Demək olar ki, hazırsan! Son təkan!",
        "🎉 İnanılmaz irəliləyiş! Sonda zəfər var!",
        "👑 Sən çempionsan! Bir az da qalıb!",
    ],
    completed: [
        "🎊 Təbriklər! Bütün planı tamamladın!",
        "🏅 Əla iş! İmtahana tam hazırsan!",
        "🌟 Sənin əzmkarlığın ilhamvericidir!",
    ],
    daily_done: [
        "✅ Bugünkü hədəfi tamamladın! Əla!",
        "🌙 Gözəl iş! Sabah davam edəcəyik!",
        "💫 Bir gün daha uğurla keçdi!",
    ],
    streak: [
        "🔥 {count} gün ardıcıl! Davam et!",
        "⚡ {count} günlük seriya! Möhtəşəm!",
        "💎 {count} gün fasiləsiz! Sən əfsanəsən!",
    ],
};

// Get a random motivation message based on progress
export function getMotivation(category) {
    const messages = MOTIVATION_MESSAGES[category];
    if (!messages || messages.length === 0) return "";
    return messages[Math.floor(Math.random() * messages.length)];
}

// Subject emoji mapping
export const SUBJECT_EMOJIS = {
    riyaziyyat: "📐",
    fizika: "⚛️",
    kimya: "🧪",
    biologiya: "🧬",
    tarix: "📜",
    coğrafiya: "🌍",
    ədəbiyyat: "📚",
    ingilis: "🇬🇧",
    azərbaycan: "🇦🇿",
    informatika: "💻",
    default: "📖",
};

// Get emoji for a subject name
export function getSubjectEmoji(name) {
    const lower = name.toLowerCase();
    for (const [key, emoji] of Object.entries(SUBJECT_EMOJIS)) {
        if (lower.includes(key)) return emoji;
    }
    return SUBJECT_EMOJIS.default;
}

// Days of the week in Azerbaijani
export const AZ_DAYS = [
    "Bazar",
    "Bazar ertəsi",
    "Çərşənbə axşamı",
    "Çərşənbə",
    "Cümə axşamı",
    "Cümə",
    "Şənbə",
];

// Months in Azerbaijani
export const AZ_MONTHS = [
    "Yanvar", "Fevral", "Mart", "Aprel",
    "May", "İyun", "İyul", "Avqust",
    "Sentyabr", "Oktyabr", "Noyabr", "Dekabr",
];
