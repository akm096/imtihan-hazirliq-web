# İmtihan Veb — Məhsul Spesifikasiyası (Product Spec)

## 📌 Giriş
Bu sənəd "İmtihan Veb" (Exam Prep) layihəsi üçün məhsul tələblərini və xüsusiyyətlərini təsvir edir. TestSprite bu tələblər əsasında avtomatlaşdırılmış test ssenariləri (plan) yaradacaq.

## 🎯 Hədəf İstifadəçi
- **Persona:** 10-18 yaşlı şagird və abituriyent.
- **Məqsəd:** Fənlər üzrə konkret mövzuları (məs: "Həndəsə" - "Törəməyə qədər") sistemli şəkildə oxuyub imtahana hazırlaşmaq.
- **Ehtiyac:** Gündəlik dərs planına sadiq qalmaq və motivasiyanı itirməmək.

## 🔑 Əsas İstifadəçi Axınları (User Flows)

### 1. Fənn Əlavə Etmə və AI ilə Mövzu Siyahısı Yaratma
- **İstifadəçi Addımları:**
  1. Ana səhifədə "Yeni Fənn Əlavə Et" düyməsini sıxır.
  2. Modal pəncərəda:
      - **Fənn adı:** (məs: Fizika)
      - **Mövzu aralığı:** (məs: İstilik hadisələrinə qədər)
  3. "Əlavə Et" düyməsini sıxır.
  4. Yaranan fənn kartında "Planını Yarat" və ya "Mövzuları Təyin Et" düyməsini sıxır.
  5. **Mövzu Redaktoru (Setup):** "AI ilə Mövzu Siyahısı Yarat" düyməsini seçir.
  6. AI mövzuları JSON formatında hazırlayır (məs: `[{"name": "Mexanika"}, {"name": "Kinematika"}]`).
  7. İstifadəçi siyahını təsdiqləyir və ya redaktə edir.

### 2. Mövzu Redaktəsi (AI Köməkçi və Əl ilə)
- **Problem:** AI bəzən tam istənilən ardıcıllıqda verməyə bilər. İstifadəçi əl ilə müdaxilə etmək istəyir.
- **Həlli:**
  - Siyahıdakı hər mövzu silinə, adı dəyişdirilə və ya yeni mövzu əlavə edilə bilər (TopicList komponenti).
  - **AI Assistant:** İstifadəçi təbii dildə əmr verə bilər: ("Bütün siyahını sil, yalnız Törəmə və İntegral əlavə et"). AI siyahını yeniləyir.
  - "Təsdiqlə və Plan Qur" düyməsi ilə növbəti mərhələyə keçilir.

### 3. Plan Konfiqurasiyası və Generasiya
- **Giriş:**
  - **İmtahan Tarixi:** (Təqvimdən seçim) - Məsələn: 2026-06-15.
  - **Gündəlik Dərs Saatı:** (Slider) - Məsələn: 4 saat.
- **Məntiq:** Tətbiq mövzuların sayını qalan günlərin sayına bölür (bazar günləri istisna ola bilər, və ya bərabər bölgü).
- **Çıxış:** Hər gün üçün konkret mövzular təyin olunur.

### 4. Gündəlik Planın İzlənilməsi
- **İstifadəçi Addımları:**
  - Fənn kartına klikləyib "Gündəlik Plan" səhifəsinə keçir.
  - Cari günün kartını görür.
  - Mövzuları bitirdikcə "check" edir (localStorage yenilənir).
  - **Streak:** Ardıcıl günlərdə mövzuları bitirdikcə "Streak" artır.
  - **Motivasiya:** İrəliləyişə uyğun "Mükəmməl!", "Davam et!" kimi mesajlar göstərilir.

### 5. AI Chat və Quiz (Təlim Dəstəyi)
- **AI Chat:** Gündəlik plan səhifəsində inteqrasiya edilmiş AI köməkçisi mövcuddur. Şagird mövzu ilə bağlı sual verə bilər (məs: "Nyutonun qanunlarını izah et").
- **Quiz Modal:** Hər mövzunun qarşısında "Test Yarat" düyməsi ilə şagird mövzuya aid test (5/10/15 sual) yarada bilər.
   - Sual tipləri: Çoxseçimli (A/B/C/D) və Açıq suallar.
   - Nəticə: Düzgün/Yanlış cavabların sayı və faiz göstərilir.

## 💾 Məlumat Modeli (JSON - LocalStorage)
```json
{
  "subjects": [
    {
      "id": "uuid-1",
      "name": "Fizika",
      "topicRange": "Mexanika",
      "topics": [
        { "id": "t1", "name": "Kinematika", "order": 0 },
        { "id": "t2", "name": "Dinamika", "order": 1 }
      ],
      "examDate": "2026-06-01",
      "dailyHours": 3,
      "plan": [
        {
          "date": "2026-02-15",
          "topics": ["t1"],
          "completedTopics": ["t1"],
          "isCompleted": true
        },
        {
          "date": "2026-02-16",
          "topics": ["t2"],
          "completedTopics": [],
          "isCompleted": false
        }
      ],
      "streak": 1
    }
  ]
}
```

## 🧪 Test Strategiyası (TestSprite üçün)

### 1. Functional Testing (Funksional Test)
- **Fənn yaratmaq:** "Riyaziyyat" fənnini əlavə etmək uğurlu olmalıdır.
- **Mövzu generasiyası (Mock):** AI cavabını mock (təqlid) edərək siyahının düzgün yarandığını yoxlamaq.
- **Plan hesablama:** İmtahan tarixinə qədər günlərin sayı ilə mövzu sayının bölgüsünün düzgünlüyünü yoxlamaq.
- **Gündəlik işarələmə:** Checkbox-a basdıqda `completedTopics` array-inin dolub-dolmadığını yoxlamaq.

### 2. UI/UX Testing
- Səhifələrarası keçidlərin (Router) düzgün işlədiyini yoxlamaq.
- Modal pəncərələrin açılıb-bağlandığını yoxlamaq (Escape düyməsi, Overlay-ə klik).
- Responsivlik (Mobil menyu).

### 3. Edge Case (Sərhəd Halları)
- **Qısa müddət:** İmtahana cəmi 1 gün qalıb, amma mövzu sayı çoxdur (Bütün mövzular 1 günə yığılmalıdır).
- **Uzun müddət:** Mövzu sayı azdır, gün çoxdur (Bəzi günlər boş qala bilər və ya təkrara ayrıla bilər).
- **Boşluqlar:** Fənn adı boş olarsa xəta mesajı çıxmalıdır.
