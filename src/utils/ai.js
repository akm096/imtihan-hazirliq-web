// AI integration for topic generation, chat, and quiz
// Uses local proxy: http://127.0.0.1:8045/v1
// API key from environment variable

const BASE_URL = import.meta.env.VITE_OPENAI_BASE_URL || "http://127.0.0.1:8045/v1";
const API_KEY = import.meta.env.VITE_OPENAI_API_KEY || "";

// Available models
export const AI_MODELS = [
    { id: "gemini-3-flash", name: "Gemini 3 Flash", desc: "Sürətli cavablar" },
    { id: "gemini-3-pro-high", name: "Gemini 3 Pro High", desc: "Dərin təhlil və izahlar" },
];

// Get saved model or default
export function getSelectedModel() {
    return localStorage.getItem("imtihan_ai_model") || "gemini-3-flash";
}

export function setSelectedModel(modelId) {
    localStorage.setItem("imtihan_ai_model", modelId);
}

/**
 * Try to repair truncated JSON array.
 */
function repairTruncatedJson(text) {
    let cleaned = text
        .replace(/```json\s*/gi, "")
        .replace(/```\s*/g, "")
        .trim();

    try {
        const parsed = JSON.parse(cleaned);
        if (Array.isArray(parsed)) return parsed;
    } catch { }

    if (cleaned.startsWith("[")) {
        const lastBrace = cleaned.lastIndexOf("}");
        if (lastBrace > 0) {
            const fixed = cleaned.substring(0, lastBrace + 1) + "]";
            try {
                const parsed = JSON.parse(fixed);
                if (Array.isArray(parsed)) return parsed;
            } catch { }
        }
    }

    return null;
}

/**
 * Core API call function
 */
async function callAI(messages, { model = null, maxTokens = 8192, temperature = 0.3 } = {}) {
    if (!API_KEY) {
        throw new Error("API açarı tapılmadı. VITE_OPENAI_API_KEY mühit dəyişənini təyin edin.");
    }

    const useModel = model || getSelectedModel();

    const response = await fetch(`${BASE_URL}/chat/completions`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
            model: useModel,
            messages,
            temperature,
            max_tokens: maxTokens,
        }),
    });

    if (!response.ok) {
        const errText = await response.text().catch(() => "");
        throw new Error(`AI xətası (${response.status}): ${errText || "Bilinməyən xəta"}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content?.trim();
    const finishReason = data.choices?.[0]?.finish_reason;

    if (!content) {
        throw new Error("AI boş cavab qaytardı. Yenidən cəhd edin.");
    }

    return { content, finishReason };
}

// ─────────────────────────────────────
// 1. Topic Generation
// ─────────────────────────────────────

export async function generateTopics(subjectName, topicRange) {
    const prompt = `Sən bir təhsil ekspertisən. Şagird "${subjectName}" fənnindən oxuyur və "${topicRange}" mövzusuna qədər hazırlaşmalıdır.

Bu fənn üçün ən əvvəldən (sıfırdan) başlayaraq "${topicRange}" mövzusuna qədər bütün mövzuları ardıcıl sıra ilə sadala. Mövzular Azərbaycan kurikulumuna uyğun olmalıdır.

QAYDALAR:
- Yalnız JSON array formatında cavab ver
- Hər element {"name": "Mövzu adı"} formatında olsun
- Əlavə mətn, izahat və ya markdown yazma
- Mövzular sadədən çətinə doğru sıralansın
- Hər mövzu konkret və aydın olsun
- Mövzu adları QISA olsun (maksimum 5-6 söz)

Nümunə format:
[{"name": "Mövzu 1"}, {"name": "Mövzu 2"}]`;

    const { content, finishReason } = await callAI([
        {
            role: "system",
            content: "Sən Azərbaycan təhsil sistemi üzrə ekspertisən. Yalnız JSON formatında cavab ver, heç bir əlavə mətn yazma.",
        },
        { role: "user", content: prompt },
    ]);

    const topics = repairTruncatedJson(content);

    if (!topics || !Array.isArray(topics) || topics.length === 0) {
        console.error("AI cavab parse xətası:", content);
        throw new Error("AI cavabını oxumaq mümkün olmadı. Zəhmət olmasa yenidən cəhd edin.");
    }

    console.log(`AI ${topics.length} mövzu qaytardı (finish_reason: ${finishReason})`);

    return topics.map((t, i) => ({
        id: crypto.randomUUID(),
        name: typeof t === "string" ? t : t.name || `Mövzu ${i + 1}`,
        order: i,
    }));
}

// ─────────────────────────────────────
// 2. AI Chat — sual-cavab
// ─────────────────────────────────────

export async function askAI(subjectName, topicName, question, chatHistory = []) {
    const systemMsg = `Sən "${subjectName}" fənni üzrə peşəkar müəllimsən. Şagird "${topicName || subjectName}" mövzusunu öyrənir.

QAYDALAR:
- Azərbaycan dilində cavab ver
- Sadə və aydın izah et
- Riyazi düsturlar varsa, düzgün yaz
- Nümunələrlə izah et
- Cavabın sonunda qısa xülasə ver`;

    const messages = [
        { role: "system", content: systemMsg },
        ...chatHistory.map((m) => ({ role: m.role, content: m.content })),
        { role: "user", content: question },
    ];

    const { content } = await callAI(messages, { temperature: 0.5 });
    return content;
}

// ─────────────────────────────────────
// 3. Quiz Generation
// ─────────────────────────────────────

const DIFFICULTY_MAP = {
    easy: "asan",
    medium: "orta",
    hard: "çətin",
};

export async function generateQuiz(subjectName, topicName, questionCount = 10, difficulty = "medium") {
    const diffLabel = DIFFICULTY_MAP[difficulty] || "orta";

    const prompt = `"${subjectName}" fənnindən "${topicName}" mövzusu üzrə ${questionCount} sual hazırla.

Çətinlik səviyyəsi: ${diffLabel}

QAYDALAR:
- Suallar Azərbaycan dilində olsun
- JSON array formatında cavab ver
- Hər sual aşağıdakı formatda olsun:
{
  "question": "Sual mətni",
  "type": "mcq",
  "options": ["A) variant", "B) variant", "C) variant", "D) variant"],
  "correct": 0,
  "explanation": "Qısa izah"
}
- "correct" düzgün cavabın indeksidir (0=A, 1=B, 2=C, 3=D)
- Hər sualın izahı olsun
- Son 2 sual "open" tipli olsun (şıqsız, yazılı cavab):
{
  "question": "Sual mətni",
  "type": "open",
  "correct_answer": "Düzgün cavab",
  "explanation": "İzah"
}
- Əlavə mətn yazma, yalnız JSON array qaytar

Nümunə:
[{"question": "...", "type": "mcq", "options": ["A) ...", "B) ...", "C) ...", "D) ..."], "correct": 0, "explanation": "..."}]`;

    const { content, finishReason } = await callAI(
        [
            {
                role: "system",
                content: "Sən təhsil ekspertisən. Yalnız JSON formatında suallar hazırla. Əlavə mətn yazma.",
            },
            { role: "user", content: prompt },
        ],
        { maxTokens: 8192, temperature: 0.4 }
    );

    const questions = repairTruncatedJson(content);

    if (!questions || !Array.isArray(questions) || questions.length === 0) {
        console.error("Quiz parse xətası:", content);
        throw new Error("Sualları oxumaq mümkün olmadı. Yenidən cəhd edin.");
    }

    console.log(`AI ${questions.length} sual qaytardı (finish_reason: ${finishReason})`);

    return questions.map((q, i) => ({
        id: crypto.randomUUID(),
        ...q,
        index: i,
    }));
}

// ─────────────────────────────────────
// 4. AI Topic Editing
// ─────────────────────────────────────

/**
 * Use AI to edit/replace the topic list based on user instructions.
 * @param {string} subjectName - Subject name
 * @param {Array} currentTopics - Current topics array
 * @param {string} instruction - Natural language instruction from user
 * @returns {Promise<Array<{name: string}>>} - New topics array
 */
export async function editTopicsWithAI(subjectName, currentTopics, instruction) {
    const currentList = currentTopics.map((t, i) => `${i + 1}. ${t.name}`).join("\n");

    const prompt = `"${subjectName}" fənni üçün mövzu siyahısını redaktə et.

HAZIRKI SİYAHI:
${currentList || "(boş)"}

İSTİFADƏÇİNİN GÖSTƏRİŞİ:
${instruction}

QAYDALAR:
- İstifadəçinin göstərişinə uyğun yeni siyahı hazırla
- Yalnız JSON array formatında cavab ver
- Hər element {"name": "Mövzu adı"} formatında olsun
- Əlavə mətn, izahat və ya markdown yazma
- Mövzuları istifadəçinin istədiyi sıra ilə ver

Nümunə format:
[{"name": "Mövzu 1"}, {"name": "Mövzu 2"}]`;

    const { content, finishReason } = await callAI(
        [
            {
                role: "system",
                content: "Sən mövzu siyahısı redaktoru assistentisən. Yalnız JSON array formatında cavab ver. Əlavə mətn yazma.",
            },
            { role: "user", content: prompt },
        ],
        { maxTokens: 8192, temperature: 0.2 }
    );

    const topics = repairTruncatedJson(content);

    if (!topics || !Array.isArray(topics) || topics.length === 0) {
        console.error("Topic edit parse xətası:", content);
        throw new Error("AI cavabını oxumaq mümkün olmadı. Yenidən cəhd edin.");
    }

    console.log(`AI ${topics.length} mövzu qaytardı (finish_reason: ${finishReason})`);

    return topics.map((t, i) => ({
        id: crypto.randomUUID(),
        name: typeof t === "string" ? t : t.name || `Mövzu ${i + 1}`,
        order: i,
    }));
}
