# YAYIN 08 — Analog Korku Oyunu

Tarayıcıda çalışan, **VHS/CRT estetikli**, tam **seslendirmeli**, **bulmacalı** ve dallanan hikayeli bir *analog korku* (analog horror) oyunu. Tavan arasında etiketsiz bir kaset bulursun. Oynatırsın. Kayıttan sağ çıkmaya — ve içine hapsolmuş sekiz izleyeni kurtarmaya — çalışırsın.

## Özellikler
- 🧩 **4 etkileşimli bulmaca** — şifreli asma kilit, parazitli sinyali netleştirme (canlı statik sesi), sembol dizisi ve kaset kronolojisi sıralama
- 🎒 **Envanter + eşya birleştirme** — parçaları çantada birleştir (bozuk fener + pil → çalışır fener; fotoğrafın iki yarısı → tam fotoğraf)
- 🎵 **Prosedürel ambient korku müziği** — sürekli evrilen, sahneye göre yoğunlaşan atmosfer (pad + detone notalar + derin darbeler + yankı)
- 🎤 **Tam Türkçe seslendirme** — anlatıcı + kasetten "kendi sesinle" konuşan varlık, senkronize altyazılarla
- 🖼️ **Üretilmiş korku görselleri** — 15 VHS estetikli sahne (tavan arası, koridor, merdivendeki yüzsüz kadın, bodrum, dolap, ritüel/kaset duvarı, sembol duvarı, kilit, ipucu panosu, jumpscare yüzü...)
- 👻 **3 bölümlük derin hikaye** — koridor → bodrum → mühürlü ritüel odası
- 🏆 **10 farklı son + kalıcı galeri** — açtığın sonlar `localStorage`'a kaydedilir, başlangıç ekranında galeri olarak görünür
- ❤️ **Akıl sağlığı sistemi** — 4 kademe; düştükçe ekran kırmızı nabız atar
- 🔊 **Prosedürel ses tasarımı** — iki katmanlı uğultu, kalp atışı, fısıltı, geri sarma ve jumpscare sesleri (Web Audio)
- 🎚️ **Gelişmiş VHS/CRT efektleri** — CRT açılış animasyonu, tarama çizgileri, RGB kayması, tracking bozulması, glitch
- 📱 **Mobil dokunmatik desteği** — responsive düzen, dokunma optimizasyonları
- ⌨️ **Klavye** — seçenekler `1`–`9`, çanta `B`, kapat `Esc`

## Çevrimiçi oyna
GitHub Pages üzerinden yayında (yayına alındıktan birkaç dakika sonra):
**https://sikaybigini-gif.github.io/sdfgg/**

## Yerelde çalıştırma
```bash
python3 -m http.server 8000
# tarayıcıda: http://localhost:8000
```
Ya da `index.html` dosyasını doğrudan tarayıcıda aç (ses için sayfaya bir kez tıklaman gerekir).

## Nasıl oynanır
Çıkan seçeneklere tıkla (ya da rakam tuşlarına bas). Kararların hikayeyi dallandırır; topladığın eşyaları **ÇANTA** menüsünden birleştirerek yeni yollar açarsın. Bulmacaların ipuçları önceki sahnelerde ve seslendirmelerde saklı. Kırmızı çerçeveli seçenekler tehlikelidir. **Kulaklık şiddetle önerilir.** 🎧

## Dosyalar
- `index.html` — sahne, CRT katmanları, altyazı, çanta modalı ve ses elemanları
- `style.css` — tüm görsel efektler, bulmaca/çanta arayüzü ve mobil düzen
- `game.js` — oyun motoru, ses+müzik, seslendirme, bulmaca motoru, birleştirme sistemi ve hikaye ağacı (`STORY`)
- `images/` — üretilmiş VHS estetikli sahne görselleri
- `audio/` — üretilmiş Türkçe seslendirme dosyaları

Hikaye tamamen `game.js` içindeki `STORY` nesnesinde. Her düğüme `vo`/`sub` (seslendirme+altyazı) ve `puzzle` (bulmaca) ekleyerek genişletebilirsin.
