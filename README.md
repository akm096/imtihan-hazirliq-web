# 🎓 İmtahan Veb — Ağıllı İmtahan Hazırlıq Planlayıcısı

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18.0-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?logo=vite)
![Status](https://img.shields.io/badge/Status-Development-orange)

"İmtahan Veb", şagirdlərin və tələbələrin imtahanlara sistemli şəkildə hazırlaşmasına kömək edən müasir veb tətbiqidir. Tətbiq süni intellekt (AI) gücündən istifadə edərək fərdi tədris planları qurur, mövzu siyahılarını avtomatik formalaşdırır və irəliləyişi izləyir.

## 🌟 Əsas Özəlliklər

### 1. 🤖 AI Dəstəkli Planlama
- **Avtomatik Mövzu Siyahısı:** Fənnin adını və hədəf mövzunu daxil edin, AI sizin üçün tam kurs proqramını qursun.
- **Dinamik Redaktə:** Mövzu siyahısını təbii dildə verilən əmrlərlə (məs: "Siyahının sonuna Törəmə mövzusunu əlavə et") asanlıqla dəyişin.

### 2. 📅 Ağıllı Təqvim
- **İmtahan Tarixi:** Hədəf tarixi təyin edin.
- **Gündəlik Yük:** Gündəlik neçə saat ayıracağınızı seçin.
- **Optimal Bölgü:** Sistem qalan günlərə uyğun olaraq mövzuları bərabər şəkildə bölüşdürür.

### 3. 📊 İzləmə və Motivasiya
- **Gündəlik Tapşırıqlar:** Hər gün üçün xüsusi hazırlanmış mövzu planı.
- **Streak Sistemi:** Ardıcıl çalışdığınız günləri izləyərək motivasiyanı artırın.
- **Vizual İrəliləyiş:** Bitirilmiş mövzuların faiz göstəricisi və qrafiklər.

### 4. 🧠 İnteraktiv Öyrənmə
- **AI Müəllim:** Hər fənn daxilində AI ilə söhbət edin, suallarınızı verin. (Riyazi düsturlar dəstəklənir!)
- **Quiz Generator:** İstənilən mövzu üzrə çətinlik dərəcəsinə uyğun (Asan/Orta/Çətin) testlər yaradın və özünüzü yoxlayın.

---

## 🚀 Texnologiyalar

Bu layihə aşağıdakı texnologiyalar əsasında qurulmuşdur:

- **Frontend:** React.js, Vite
- **Stil:** Vanilla CSS (Müasir Glassmorphism dizaynı)
- **Data:** LocalStorage (Məlumatlarınız brauzerdə qalır, serverə ehtiyac yoxdur)
- **AI İnteqrasiya:** OpenAI API / Local AI Proxy (`gemini-3-flash`, `gemini-3-pro-high` modelləri)
- **Routing:** React Router DOM

---

## 🛠️ Quraşdırma və İşə Salma

Layihəni öz kompüterinizdə işlətmək üçün aşağıdakı addımları izləyin:

### 1. Repo-nu Klonlayın

```bash
git clone https://github.com/github-istifadeci-adiniz/imtihan-ai-planner.git
cd imtihan-ai-planner
```

### 2. Lazımi Kitabxanaları Yükləyin

```bash
npm install
```

### 3. Mühit Dəyişənlərini (Environment Variables) Tənzimləyin

Kök qovluqda `.env` faylı yaradın (nümunə üçün `.env.example` faylına baxa bilərsiniz) və aşağıdakı parametrləri əlavə edin:

```env
VITE_OPENAI_API_KEY=sk-sizin-api-keyiniz
VITE_OPENAI_BASE_URL=http://127.0.0.1:8045/v1  # Əgər yerli proxy istifadə edirsinizsə
```

### 4. Tətbiqi İşə Salın

```bash
npm run dev
```

Brauzerdə `http://localhost:5173` ünvanına daxil olun.

---

## 📸 Ekran Görüntüləri

*(Bura tətbiqin ekran görüntülərini əlavə edə bilərsiniz)*

---

## 🤝 Töhfə Vermək (Contributing)

Layihəni inkişaf etdirmək istəyirsinizsə:

1. Bu repo-nu **Fork** edin.
2. Yeni bir **Branch** yaradın (`git checkout -b feature/YeniOzellik`).
3. Dəyişiklikləri **Commit** edin (`git commit -m 'Yeni özəllik əlavə edildi'`).
4. Branch-i **Push** edin (`git push origin feature/YeniOzellik`).
5. **Pull Request** göndərin.

---

## 📄 Lisenziya

Bu layihə [MIT Lisenziyası](LICENSE) altında yayımlanır.
