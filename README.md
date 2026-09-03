# YAYIN 08 — Analog Korku Oyunu

Tarayıcıda çalışan, **VHS/CRT estetikli**, tam **seslendirmeli**, **bulmacalı** ve dallanan hikayeli bir *analog korku* (analog horror) oyunu. Tavan arasında etiketsiz bir kaset bulursun. Oynatırsın. Kayıttan sağ çıkmaya — ve içine hapsolmuş sekiz izleyeni kurtarmaya — çalışırsın.

## Özellikler
- ⚠️ **İçerik / fotosensitivite uyarı ekranı** — girişte net uyarı; “normal gir” veya “efektleri azaltarak gir” seçeneği
- ♿ **Erişilebilirlik** — “⚡ EFEKT” düğmesiyle yanıp sönen/glitch/jumpscare efektlerini kısan güvenli mod (kalıcı), `prefers-reduced-motion` desteği, klavye odak halkaları, `aria-live` canlı bölgeler
- 🌐 **İki dil desteği (TR/EN)** — Türkçe ve İngilizce arasında tek tuşla geçiş; tüm hikaye, arayüz, bulmaca, başarım ve uyarı metinleri çevrili, seçim `localStorage`'a kaydedilir
- 🏆 **Başarım sistemi** — 14 başarım, açıldıkça ekranda şık açılır bildirim; başlangıç ekranında galeri
- 💀 **Zorluk modları** — Normal (4 can) ve Kâbus (2 can, daha hızlı yayın); başlangıç ekranından seçilir
- 📞 **Gizli telefon ara sahnesi** ve 🧠 **hafıza (Simon) bulmacası** (3x3 TV ızgarası)
- 🔦 **Fener tarama mekaniği** — zifiri karanlık odada fareyle/dokunuşla ışık gezdirip gizli çıkışı ve ipuçlarını bulma
- 🪞 **4 bölüm** — koridor → bodrum → mühürlü ritüel odası → kaçış (karanlık + ayna odası + ön kapı)
- 💾 **Checkpoint / kaldığın yerden devam** — bölüm başları otomatik kaydedilir, başlangıç ekranından devam edebilirsin
- 📊 **İstatistikler** — oynanış, kaçış, ölüm ve çözülen bulmaca sayısı kalıcı olarak tutulur
- 🧩 **8 etkileşimli bulmaca** — şifreli asma kilit, parazitli sinyali netleştirme (canlı statik sesi), sembol dizisi, kaset kronolojisi sıralama, hafıza dizisi (Simon), **renk kablosu birleştirme (sigorta kutusu)**, **Sezar şifre çözücü halka (gizli günlük)** ve **kayan parça fotoğraf yap-bozu**
- 🎒 **Envanter + eşya birleştirme** — parçaları çantada birleştir (bozuk fener + pil → çalışır fener; fotoğrafın iki yarısı → tam fotoğraf)
- 🎵 **Prosedürel ambient korku müziği** — sürekli evrilen, sahneye göre yoğunlaşan atmosfer (pad + detone notalar + derin darbeler + yankı)
- 🎤 **Tam Türkçe seslendirme** — anlatıcı + kasetten "kendi sesinle" konuşan varlık, senkronize altyazılarla
- 🖼️ **Üretilmiş korku görselleri** — 22 VHS estetikli sahne (tavan arası, koridor, merdivendeki yüzsüz kadın, bodrum, dolap, ritüel/kaset duvarı, sembol duvarı, kilit, ipucu panosu, sigorta kutusu, şifreli günlük, jumpscare yüzü...)
- 👻 **3 bölümlük derin hikaye** — koridor → bodrum → mühürlü ritüel odası
- 🏆 **13 farklı son + kalıcı galeri** — açtığın sonlar `localStorage`'a kaydedilir, başlangıç ekranında galeri olarak görünür
- ❤️ **Akıl sağlığı sistemi** — 4 kademe; düştükçe ekran kırmızı nabız atar
- 🔊 **Prosedürel ses tasarımı** — iki katmanlı uğultu, kalp atışı, fısıltı, geri sarma ve jumpscare sesleri (Web Audio)
- 🎚️ **Gelişmiş VHS/CRT efektleri** — CRT açılış animasyonu, tarama çizgileri, RGB kayması, tracking bozulması, glitch
- 📱 **Mobil dokunmatik desteği** — responsive düzen, dokunma optimizasyonları, `viewport-fit=cover` çentik desteği
- 🔗 **SEO / paylaşım** — Open Graph & Twitter kart etiketleri, SVG favicon, tema rengi
- ⌨️ **Klavye** — seçenekler `1`–`9`, çanta `B`, kapat `Esc`, uyarı ekranında `Enter`/`Space`

## Çevrimiçi oyna
GitHub Pages üzerinden yayında (yayına alındıktan birkaç dakika sonra):
**https://sikaybigini-gif.github.io/sdfgg/**

## Yerelde çalıştırma
```bash
python3 -m http.server 8000
# tarayıcıda: http://localhost:8000
```
Ya da `index.html` dosyasını doğrudan tarayıcıda aç (ses için sayfaya bir kez tıklaman gerekir).

## Language / Dil
Oyun Türkçe başlar. Kontrol çubuğundaki **🌐 EN / 🌐 TR** düğmesiyle İngilizce ve Türkçe arasında anında geçiş yapabilirsin — mevcut sahne yeni dilde yeniden çizilir ve tercihin kaydedilir.
_The game starts in Turkish. Use the **🌐 EN / 🌐 TR** button in the control bar to switch between English and Turkish at any time; your choice is remembered._

## Nasıl oynanır
Çıkan seçeneklere tıkla (ya da rakam tuşlarına bas). Kararların hikayeyi dallandırır; topladığın eşyaları **ÇANTA** menüsünden birleştirerek yeni yollar açarsın. Bulmacaların ipuçları önceki sahnelerde ve seslendirmelerde saklı. Kırmızı çerçeveli seçenekler tehlikelidir. **Kulaklık şiddetle önerilir.** 🎧

## Dosyalar
- `index.html` — sahne, CRT katmanları, altyazı, çanta modalı ve ses elemanları
- `style.css` — tüm görsel efektler, bulmaca/çanta arayüzü ve mobil düzen
- `game.js` — oyun motoru, ses+müzik, seslendirme, bulmaca motoru, birleştirme sistemi ve hikaye ağacı (`STORY`)
- `i18n.js` — İngilizce çeviri katmanı (`T()` ile TR kaynak metinden çeviri); yeni dil eklemek için buraya bir sözlük eklemen yeterli
- `images/` — üretilmiş VHS estetikli sahne görselleri
- `audio/` — üretilmiş Türkçe seslendirme dosyaları

Hikaye tamamen `game.js` içindeki `STORY` nesnesinde. Her düğüme `vo`/`sub` (seslendirme+altyazı) ve `puzzle` (bulmaca) ekleyerek genişletebilirsin.
