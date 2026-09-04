/* =====================================================================
   YAYIN 08 — i18n
   Türkçe (kaynak) → İngilizce çeviri sözlüğü.
   T(str) kaynak TR metnini alır, geçerli dile göre çevirir.
   Anahtarlar, game.js'teki TR metinlerle BİREBİR aynı olmalı
   (akıllı tırnaklar “ ” ‘ ’ dahil).
   ===================================================================== */
(function () {
  "use strict";

  const EN = {
    /* ---------- Arayüz ---------- */
    "🎓 ÇANTA": "🎓 BAG",
    "🎤 SESLENDİRME": "🎤 VOICEOVER",
    "🎤 SESLENDİRME KAPALI": "🎤 VOICEOVER OFF",
    "🎵 MÜZİK": "🎵 MUSIC",
    "🎵 MÜZİK KAPALI": "🎵 MUSIC OFF",
    "🔊 SES": "🔊 SOUND",
    "🔇 SESSİZ": "🔇 MUTED",
    "SES": "SOUND",
    "SESSİZ": "MUTED",
    "MÜZİK": "MUSIC",
    "MÜZİK KAPALI": "MUSIC OFF",
    "SESLENDİRME": "VOICEOVER",
    "SESLENDİRME KAPALI": "VOICEOVER OFF",
    "↺ BAŞA": "↺ RESTART",
    "BAŞA": "RESTART",
    "EFEKT": "EFFECTS",
    "EFEKT AZ": "FX LOW",
    "⚠ UYARI": "⚠ WARNING",
    "Bu bir <strong>korku deneyimidir</strong>. Ani sesler, aniden beliren görüntüler (jump-scare) ve yanıp sönen ışıklar içerir. Kulaklık önerilir. Işık hassasiyetiniz (fotosensitif epilepsi) varsa lütfen dikkatli olun — efektleri “⚡ EFEKT” düğmesinden azaltabilirsiniz.": "This is a <strong>horror experience</strong>. It contains sudden sounds, jump-scares and flashing lights. Headphones recommended. If you have photosensitivity (light-sensitive epilepsy), please take care — you can reduce the effects with the “⚡ EFFECTS” button.",
    "▶ GİR": "▶ ENTER",
    "⚡ EFEKTLERİ AZALT & GİR": "⚡ REDUCE EFFECTS & ENTER",
    "Ses için tıklaman gerekir · Kulaklık önerilir 🎧": "Click for sound · Headphones recommended 🎧",
    "ÇANTA — eşya birleştir": "BAG — combine items",
    "İki eşya seç, sonra BİRLEŞTİR'e bas.": "Pick two items, then press COMBINE.",
    "BİRLEŞTİR": "COMBINE",
    "KAPAT": "CLOSE",
    "Oku": "Read",
    "gizli iz": "hidden trace",
    "KAYIP FRAGMAN": "LOST FRAGMENT",
    "⏱ En hızlı kaçış": "⏱ Fastest escape",
    "Meraklı Göz": "Curious Eye",
    "İlk kayıp fragmanı buldun.": "You found the first lost fragment.",
    "Sekiz İsim": "Eight Names",
    "Sekiz kayıp fragmanın hepsini topladın.": "You collected all eight lost fragments.",
    "Hızlı Kaçış": "Speedrunner",
    "8 dakikadan kısa sürede kaçtın.": "You escaped in under 8 minutes.",
    "Fragman I — Tavan Arası": "Fragment I — The Attic",
    "Fragman II — Koridor": "Fragment II — The Hallway",
    "Fragman III — Merdiven": "Fragment III — The Stairs",
    "Fragman IV — Bodrum": "Fragment IV — The Basement",
    "Fragman V — Ritüel Odası": "Fragment V — The Ritual Room",
    "Fragman VI — Karanlık": "Fragment VI — The Dark",
    "Fragman VII — Ayna": "Fragment VII — The Mirror",
    "Fragman VIII — Ön Kapı": "Fragment VIII — The Front Door",
    "“Kaseti ben de tavan arasında buldum. Sadece bir kez izleyeceğimi sandım. Adım artık duvarda. — E.”": "“I found the tape in the attic too. I thought I'd only watch once. My name is on the wall now. — E.”",
    "“Koridorun sonundaki kapı hiç kapanmadı. O nefes benim değildi ama artık benimle nefes alıyor. — M.”": "“The door at the end of the hall never closed. That breathing wasn't mine, but now it breathes with me. — M.”",
    "“Yüzü olmayan kadın annemdi. Beni işaret etti, ben de indim. Keşke inmeseydim. — S.”": "“The faceless woman was my mother. She pointed at me, and I went down. I wish I hadn't. — S.”",
    "“Çentikleri saydım: yedi. Sekizinciyi kazırken elim titriyordu. Sekizinci bendim. — A.”": "“I counted the marks: seven. My hand shook as I carved the eighth. The eighth was me. — A.”",
    "“Mühür bizi içeride tutmuyor; dışarıyı dışarıda tutuyor. Onu kırma. Yalvarırım. — K.”": "“The seal doesn't keep us in; it keeps the outside out. Don't break it. I beg you. — K.”",
    "“Işığı kapattıklarında sekizimiz de aynı anda güldük. Neden güldüğümü hâlâ bilmiyorum. — D.”": "“When they cut the light, all eight of us laughed at once. I still don't know why I laughed. — D.”",
    "“Aynadaki bana el salladım. O el sallamadı. Sonra yer değiştirdik. Şimdi ben camdayım. — N.”": "“I waved at myself in the mirror. It didn't wave back. Then we swapped. Now I'm in the glass. — N.”",
    "“Kapıya en çok yaklaşan bendim. Bir adım kalmıştı. Geriye baktım. Sakın bakma. — T.”": "“I got closest to the door. One step left. I looked back. Never look back. — T.”",
    "Çantan boş.": "Your bag is empty.",
    "İki eşya seçmelisin.": "You must select two items.",
    "Bu ikisi birleşmiyor.": "These two don't combine.",
    "Pili bozuk fenere taktın. Işık yandı!": "You put the battery in the broken flashlight. It lit up!",
    "İki fotoğraf yarısını birleştirdin. Sekiz yüz tamamlandı.": "You joined the two photo halves. Eight faces complete.",

    /* ---------- Eşyalar ---------- */
    "Bozuk fener": "Broken flashlight",
    "Pil": "Battery",
    "El feneri (çalışır)": "Flashlight (working)",
    "Paslı anahtar": "Rusty key",
    "Tebeşir parçası": "Piece of chalk",
    "Fotoğraf (sol yarı)": "Photo (left half)",
    "Fotoğraf (sağ yarı)": "Photo (right half)",
    "Birleşik fotoğraf": "Joined photo",
    "İkinci kaset": "Second tape",
    "Mühür sembolü": "Seal symbol",

    /* ---------- Bölüm adları ---------- */
    "Band 1: Koridor": "Tape 1: Hallway",
    "Band 1: Merdiven": "Tape 1: Stairs",
    "Band 2: Bodrum": "Tape 2: Basement",
    "Band 3: Mühürlü Oda": "Tape 3: Sealed Room",
    "Band 4: Karanlık": "Tape 4: Darkness",
    "Band 4: Ayna Odası": "Tape 4: Mirror Room",
    "bölüm": "chapter",

    /* ---------- Sonlar (galeri) ---------- */
    "GERÇEK SON — Işık Ritüeli": "TRUE ENDING — The Light Ritual",
    "İYİ SON — Yayın Kesildi": "GOOD ENDING — Signal Cut",
    "YARIM KURTULUŞ": "HALF ESCAPE",
    "GİZLİ SON — Sekizi Serbest Bırak": "SECRET ENDING — Free the Eight",
    "KAÇIŞ — Ön Kapıdan": "ESCAPE — Through the Front Door",
    "GİZLİ SON — Aynadaki Sen": "SECRET ENDING — The You in the Mirror",
    "KAYIP — Aklını Kaybettin": "LOST — You Lost Your Mind",
    "ÖLÜM — İçeri Girdi": "DEATH — It Came Inside",
    "DÖNGÜ — İtaat": "LOOP — Obedience",
    "DÖNGÜ — Dokuzuncu Çentik": "LOOP — The Ninth Mark",
    "ÖLÜM — Görüldün": "DEATH — You Were Seen",
    "DÖNGÜ — Sen Oldun": "LOOP — You Became It",
    "ÖLÜM — Ayna Seni Aldı": "DEATH — The Mirror Took You",

    /* ---------- Başarımlar ---------- */
    "İlk Kaset": "First Tape",
    "Kaseti ilk kez oynattın.": "You played the tape for the first time.",
    "Hayatta Kalan": "Survivor",
    "İlk kez kayıttan sağ çıktın.": "You escaped the recording for the first time.",
    "Gerçeği Gören": "Truth Seeker",
    "İkinci kasetin sırrını öğrendin.": "You learned the secret of the second tape.",
    "Kâşif": "Explorer",
    "5 bulmaca çözdün.": "You solved 5 puzzles.",
    "Toplayıcı": "Collector",
    "Feneri ve tam fotoğrafı bir arada taşıdın.": "You carried the flashlight and the full photo together.",
    "Kurtarıcı": "Liberator",
    "Sekiz izleyeni serbest bıraktın.": "You freed the eight viewers.",
    "Aynadaki Sen": "The Mirror You",
    "En iyi sonu buldun.": "You found the best ending.",
    "Arşivci": "Archivist",
    "Tüm sonları keşfettin.": "You discovered every ending.",
    "Kâbus Avcısı": "Nightmare Hunter",
    "Kâbus modunda kaçtın.": "You escaped on Nightmare difficulty.",
    "Meraklı": "Curious",
    "Telefonu açtın.": "You answered the phone.",
    "Tesisatçı": "Electrician",
    "Sigorta kutusunu onardın.": "You repaired the fuse box.",
    "Şifre Kırıcı": "Codebreaker",
    "Günlüğün şifresini çözdün.": "You cracked the diary's cipher.",
    "Bilmececi": "Puzzle Master",
    "8 bulmaca çözdün.": "You solved 8 puzzles.",
    "Zarar Görmeden": "Untouched",
    "Hiç can kaybetmeden kaçtın.": "You escaped without losing any sanity.",

    /* ---------- Galeri / başlangıç UI ---------- */
    "NORMAL · 4 CAN": "NORMAL · 4 LIVES",
    "KÂBUS · 2 CAN": "NIGHTMARE · 2 LIVES",
    "Kâbus: daha az can, daha hızlı yayın, daha karanlık.": "Nightmare: fewer lives, faster broadcast, darker.",
    "Normal: dengeli bir korku deneyimi.": "Normal: a balanced horror experience.",
    "??? — kilitli": "??? — locked",

    /* ---------- Bulmaca mesajları ---------- */
    "KİLİT AÇILDI ▸": "LOCK OPENED ▸",
    "Kilit açılmadı.": "The lock didn't open.",
    " deneme": " attempts",
    "ONAYLA": "CONFIRM",
    "Kadranları ▲▼ ile çevir, sonra ONAYLA.": "Turn the dials with ▲▼, then CONFIRM.",
    "SEMBOLLER HİZALANDI ▸": "SYMBOLS ALIGNED ▸",
    "Duvar titredi… yanlış sıra.": "The wall trembled… wrong order.",
    "Sembollere sırayla dokun. TEMİZLE ile baştan başla.": "Tap the symbols in order. Use CLEAR to restart.",
    "TEMİZLE": "CLEAR",
    "GÖRÜNTÜ NETLEŞTİ ▸": "SIGNAL CLEARED ▸",
    "Hâlâ parazit var. Kadranı oynat.": "Still static. Adjust the dial.",
    "Kadranı sürükle, görüntü netleşince KİLİTLE.": "Drag the dial; LOCK when the image clears.",
    "KİLİTLE": "LOCK",
    "SİNYAL: ● NET": "SIGNAL: ● CLEAR",
    "SİNYAL: ◐ yaklaşıyor…": "SIGNAL: ◐ getting closer…",
    "SİNYAL: ○ parazit": "SIGNAL: ○ static",
    "SİNYAL: —": "SIGNAL: —",
    "DOĞRU SIRA — KAYIT AÇILIYOR ▸": "CORRECT ORDER — RECORDING PLAYS ▸",
    "Tüm kasetleri sıraya koy.": "Put all tapes in order.",
    "Kasetler cızırtıyla durdu. Yanlış sıra.": "The tapes stopped with a screech. Wrong order.",
    "Kasetlere dokunarak sıra numarası ver. OYNAT'a bas.": "Tap tapes to assign order numbers. Press PLAY.",
    "OYNAT": "PLAY",
    "SIFIRLA": "RESET",
    "İZLE ▶": "WATCH ▶",
    "İZLE…": "WATCH…",
    "HAFIZA DOĞRU — YAYIN AÇILIYOR ▸": "MEMORY CORRECT — BROADCAST OPENS ▸",
    "YANLIŞ! Ekranlar çığlık attı. Baştan.": "WRONG! The screens screamed. Start over.",
    "Kâbus modunda daha zorlu. Yanlışta bir can kaybedersin.": "Harder on Nightmare. A wrong tap costs a life.",

    /* ---------- yeni bulmaca mesajları (v9) ---------- */
    "GÜÇ GERİ GELDİ ▸": "POWER RESTORED ▸",
    "Önce sol uca, sonra sağdaki eşine dokun. Yanlış eşleşme sistemi bozar.": "Tap a left terminal, then its match on the right. A wrong pair shorts the system.",
    "İPUCU: Soldaki her renkli ucu, sağdaki aynı renge dokunarak birleştir.": "TIP: Connect each colored terminal on the left to the same color on the right.",
    "ÇÖZ": "SOLVE",
    "ŞİFRE ÇÖZÜLDÜ ▸": "CIPHER SOLVED ▸",
    "Hâlâ anlamsız. Halkayı çevir.": "Still gibberish. Turn the ring.",
    "İPUCU: Halkayı ◀ ▶ ile çevir, kelime okunur hâle gelince ÇÖZ.": "TIP: Turn the ring with ◀ ▶; when the word reads clearly, press SOLVE.",
    "Anlamlı Türkçe bir kelime bulana dek çevir.": "Turn until you find a meaningful word.",
    "FOTOĞRAF TAMAMLANDI ▸": "PHOTO COMPLETE ▸",
    "İPUCU: Boş kareye komşu parçalara dokunarak kaydır.": "TIP: Slide tiles by tapping the ones next to the empty square.",
    "Parçalar tamamlanınca mühür kabul eder.": "The seal accepts it once the pieces align.",

    /* ---------- Toast ---------- */
    "BAŞARIM AÇILDI": "ACHIEVEMENT UNLOCKED",

    /* ---------- HUD ---------- */
    "AKIL SAĞLIĞI": "SANITY",
    "ÇANTA": "BAG",
    "boş": "empty",

    /* =================================================================
       HİKÂYE
       ================================================================= */
    "— bir analog korku deneyimi —": "— an analog horror experience —",
    "Tavan arasında etiketsiz bir kaset buldun. Üstünde tek kelime: İzleme.": "You found an unlabeled tape in the attic. One word on it: Do Not Watch.",
    "Tavan arasında etiketsiz bir VHS kaseti buldun. Üstünde keçeli kalemle: “İZLEME”. Altında titrek bir el yazısı: “sekizinciye kadar sayıyoruz”. Eski oynatıcı hâlâ çalışıyor. Kaseti sürdün.": "You found an unlabeled VHS tape in the attic. In marker: “DO NOT WATCH.” Below it, a shaky handwriting: “we count to eight.” The old player still works. You pushed the tape in.",
    "Kaseti oynatmak istiyor musun?": "Do you want to play the tape?",
    "OYNAT ▶ (yeni oyun)": "PLAY ▶ (new game)",
    "Kaseti geri koy, odadan çık": "Put the tape back and leave the room",
    "SES/SESLENDİRME İÇİN TIKLA · KULAKLIK ÖNERİLİR · 1-9 TUŞLARIYLA SEÇ": "CLICK FOR SOUND/VOICEOVER · HEADPHONES RECOMMENDED · SELECT WITH KEYS 1-9",

    "Kaçış yok. Televizyon kendiliğinden açıldı.": "No escape. The TV turned itself on.",
    "Kaseti yerine koydun. O gece uyuyamadın. Sabah kaset yastığının yanındaydı; bant tıkırdayarak dönüyordu. Kimse oynatmamıştı. Televizyon kendiliğinden açıldı.": "You put the tape back. You couldn't sleep that night. In the morning it was next to your pillow; the reel was clicking, turning. No one had played it. The TV turned itself on.",
    "Kaçış yok.": "There is no escape.",
    "Bu sefer izle": "Watch it this time",

    "Senin evinin koridoru. Sonundaki kapı yavaşça aralanıyor.": "The hallway of your house. The door at the end slowly creaks open.",
    "Ekran karlanıyor, sonra netleşiyor: senin evinin koridoru. Kamera yürüyor. Sonundaki kapı yavaşça aralanıyor; içerisi kapkaranlık ve oradan derin bir nefes sesi geliyor. Yerde bozuk bir el feneri duruyor — pili yok.": "The screen fills with snow, then sharpens: the hallway of your house. The camera walks forward. The door at the end slowly opens; inside is pitch black and a deep breathing comes from within. A broken flashlight lies on the floor — no battery.",
    "Ne yaparsın?": "What do you do?",
    "İPUCU: Eşyaları ÇANTA menüsünden birleştirebilirsin.": "TIP: You can combine items in the BAG menu.",
    "Bozuk el fenerini al": "Take the broken flashlight",
    "Karanlık kapının içini incele": "Examine inside the dark doorway",
    "Lambayı arayıp ışığı yak": "Feel for the lamp and turn on the light",
    "Kaydı geri sar": "Rewind the recording",

    "Kaseti geri sardın ama görüntü aynı: koridor, kapı, nefes. Geri sarılırken nefes sesi hızlanıyor — sanki sana gülüyor. Karlanan ekranda bir an bir yüz beliriyor.": "You rewound the tape but the image stays the same: hallway, door, breathing. As it rewinds the breathing speeds up — as if laughing at you. For a moment a face appears in the static.",
    "Yeniden oynat": "Play again",

    "Feneri kapıya tuttun. Işık huzmesinde bir şey var: tavana yakın, üç metre yükseklikte iki ıslak göz. Yavaşça sana doğru eğiliyorlar.": "You aimed the flashlight at the door. In the beam there's something: near the ceiling, three meters up, two wet eyes. They slowly lean toward you.",
    "Karanlığa baktın ama hiçbir şey göremiyorsun. Sonra iki nokta parlıyor — gözler, hem de tam tepende. El yordamıyla geri çekilirken bir şeye çarptın.": "You stared into the dark but can't see anything. Then two dots gleam — eyes, right above you. Feeling your way backward, you bump into something.",
    "…": "…",
    "Gözlere sabit bak, kıpırdama": "Stare at the eyes, don't move",
    "Kaydı durdurmaya çalış": "Try to stop the recording",

    "Kıpırdamadın. Gözler bir an durakladı… sonra kapandı ve karanlığa gömüldü. Cesaretin işe yaradı — zihnin sağlam kaldı. Kamera kapıdan içeri süzülüyor. Yerde paslı bir anahtar ve bir pil parlıyor.": "You didn't move. The eyes paused for a moment… then closed and sank into the dark. Your courage paid off — your mind held. The camera slips through the door. A rusty key and a battery gleam on the floor.",
    "Anahtarı ve pili aldın. (Pili bozuk fenerle ÇANTA'da birleştirebilirsin.)": "You took the key and the battery. (Combine the battery with the broken flashlight in the BAG.)",
    "Merdivenlere in": "Go down the stairs",

    "Ekrandaki şey artık senin arkanda.": "The thing on the screen is behind you now.",
    "Durdur tuşuna bastın. Oynatıcı reddediyor; kırmızı REC ışığı sönmüyor. Ekrandaki şey artık koridorda değil — senin odanda, arkanda. Kaydın içinden kendi koltuğuna bakıyorsun.": "You pressed stop. The player refuses; the red REC light won't go out. The thing on screen is no longer in the hallway — it's in your room, behind you. From inside the recording, you're looking at your own chair.",
    "Arkanda bir tıkırtı.": "A click behind you.",
    "Arkana bak": "Look behind you",
    "Ekrana kilitlen, sakın arkana bakma": "Fix on the screen, don't look back",

    "Arkana baktın. Hiçbir şey yok. Ama geri döndüğünde ekran senin sırtını gösteriyordu — kamera artık senin arkandaydı, içeri girmişti. Sonra ekran seni içine çekti.": "You looked behind. Nothing. But when you turned back, the screen showed your own back — the camera was behind you now, it had come inside. Then the screen pulled you in.",
    "— BÖLÜM SONU —": "— END OF SEGMENT —",
    "Kaseti baştan al": "Rewind the tape to the start",

    "Işığa uzandın, lamba ipini çektin. Bir an aydınlık: koridor bomboş, duvarda taze bir tebeşir çentiği ve rafta bir pil var. Sonra ampul patladı ve karanlıkta o nefes tam ensendeydi.": "You reached for the light, pulled the lamp cord. A flash of brightness: the hallway is empty, a fresh chalk mark on the wall and a battery on the shelf. Then the bulb burst and in the dark that breathing was right on your neck.",
    "Kayıtta koş, merdivenlere in": "Run in the recording, head to the stairs",
    "Olduğun yerde don, kıpırdama": "Freeze where you are, don't move",

    "Donakaldın. O şey seni uzun uzun kokladı, inceledi… ve geçip gitti. Titriyorsun ama hayattasın. Kamera kendiliğinden merdivenlere yöneliyor.": "You froze. The thing sniffed you a long while, examined you… and moved on. You're shaking but alive. The camera turns toward the stairs on its own.",

    "Aşağıda yüzü olmayan bir kadın seni işaret ediyor.": "A faceless woman below is pointing at you.",
    "Merdiven başındasın. Aşağıda beyaz geceliğiyle bir kadın duruyor — yüzü yok, sadece pürüzsüz bir boşluk. Kolunu ağır ağır kaldırıp seni işaret ediyor. Fısıldıyor: “Sen de bu kasetin içindesin artık.”": "You're at the top of the stairs. Below stands a woman in a white nightgown — no face, just a smooth blank. She slowly raises her arm and points at you. She whispers: “You're inside this tape now, too.”",
    "Yanından sessizce geç": "Slip past her quietly",
    "Bir odaya saklan": "Hide in a room",
    "Çalan telefonu yanıtla": "Answer the ringing phone",
    "Feneri yüzüne tut": "Shine the flashlight on her face",

    "Telefonun öbür ucunda kendi sesin: dört… dokuz… iki.": "Your own voice on the other end: four… nine… two.",
    "Yan odada eski bir çevirmeli telefon çalıyor. Ahizeyi kaldırdın. Parazitin ardından bir ses — senin sesin — üç sayı fısıldıyor: “dört… dokuz… iki. Kapıyı böyle açtım. Ama sonra pişman oldum.” Hat kesildi.": "An old rotary phone rings in the next room. You lift the receiver. Behind the static a voice — your voice — whispers three numbers: “four… nine… two. That's how I opened the door. But then I regretted it.” The line went dead.",
    "Şifreyi öğrendin: 4-9-2.": "You learned the code: 4-9-2.",
    "Merdivene geri dön": "Go back to the stairs",
    "Doğruca aşağı in": "Go straight down",

    "Feneri yüzsüz yüzüne tuttun. O boşluk ışığı emdi ve bir anda yüzün ta kendisi oldu — senin yüzün, çığlık atarak. Kadın koridoru bir hamlede kat etti.": "You shone the light on her faceless face. The blank drank the light and in an instant became your very face — your face, screaming. The woman crossed the hallway in a single lunge.",
    "Baştan al": "Restart",

    "Nefesini tuttun, yanından geçtin. Kadın kımıldamadı; sadece fısıldadı: “Bodrumda saymaya devam ediyor.” Alt kata indin. Bir kapı, üstünde eski bir şifreli asma kilit. Yerde yırtık bir fotoğrafın sol yarısı.": "You held your breath and slipped past. The woman didn't move; she only whispered: “It keeps counting in the basement.” You went downstairs. A door, with an old combination padlock. On the floor, the left half of a torn photo.",
    "Fotoğrafın yarısında dört kişi var; yüzleri kazınmış. Diğer yarısı eksik. Kapı üç haneli bir şifreyle kilitli.": "The photo half shows four people; their faces are scratched out. The other half is missing. The door is locked with a three-digit code.",
    "Duvardaki çocuk çizimini incele (ipucu)": "Examine the child's drawing on the wall (clue)",
    "Şifreli kilidi çözmeye çalış": "Try to crack the combination lock",
    "Anahtarla aç": "Open it with the key",
    "Kapıyı omuzla, zorla": "Shoulder the door open by force",

    "Üç çocuk kayıp. Sayılar kırmızıyla yuvarlanmış: 4, 9, 2.": "Three children missing. Numbers circled in red: 4, 9, 2.",
    "Duvara bir çocuk çizimi ve sararmış bir gazete küpürü iğnelenmiş. Küpürde: “ÜÇ ÇOCUK KAYIP — 1996”. Kenarına kırmızı kalemle üç sayı yuvarlanmış: önce DÖRT, sonra DOKUZ, sonra İKİ. Çizimin altında “kapıyı böyle açtım” yazıyor.": "A child's drawing and a yellowed newspaper clipping are pinned to the wall. The clipping: “THREE CHILDREN MISSING — 1996.” In the margin, three numbers circled in red: first FOUR, then NINE, then TWO. Under the drawing it says “this is how I opened the door.”",
    "Şifreyi aklında tut.": "Keep the code in mind.",
    "Kilide geri dön": "Return to the lock",

    "Paslı şifreli kilit. Üç kadran, sıfırdan dokuza. Kadranları çevirip doğru şifreyi bulman gerek.": "A rusty combination lock. Three dials, zero to nine. Turn the dials to find the right code.",
    "İPUCU: Çocuk çizimindeki üç sayı.": "TIP: The three numbers in the child's drawing.",
    "İpucuna tekrar bak": "Look at the clue again",
    "Vazgeç, kapıyı omuzla": "Give up, shoulder the door",

    "Kapıya yüklendin. Menteşeler haykırdı, omzun zonkluyor ama kapı açıldı. Aşağı inen karanlık bir merdiven. Aşağıdan bir teybin tıkırtısı geliyor.": "You threw yourself at the door. The hinges shrieked, your shoulder throbs but the door opened. A dark staircase leads down. A tape recorder clicks below.",
    "Bodruma in": "Go down to the basement",

    "Bir odaya daldın, dolaba girdin, kapağı çektin. Tık. Tık. Ayak sesleri. Dolabın aralığından tek bir göz seni izliyor. Kapağı açmadı — sadece bekledi. Saatlerce. Elinin altında yırtık fotoğrafın sol yarısı ve paslı bir anahtar var.": "You ducked into a room, into the closet, pulled the door shut. Click. Click. Footsteps. Through the gap a single eye watches you. It didn't open the door — it just waited. For hours. Under your hand: the left half of a torn photo and a rusty key.",
    "Şafak sökerken göz kayboldu.": "At dawn the eye vanished.",
    "Dışarı çık, aşağı in": "Come out, go downstairs",

    "Duvarda sekiz çentik ve senin ismin. Teyp senin sesinle konuşuyor.": "Eight marks on the wall and your name. The recorder speaks in your voice.",
    "Bodrum. Duvarda tebeşirle sekiz çentik ve altında bir isim: SENİN İSMİN. Yerde eski bir teyp, kırmızı kayıt ışığı yanıp sönüyor. Teyp senin sesinle konuşuyor: “Yardım et… buradan çıkamıyorum.” Teybin yanında yırtık fotoğrafın sağ yarısı duruyor.": "The basement. Eight chalk marks on the wall and a name beneath them: YOUR NAME. An old recorder on the floor, its red record light blinking. The recorder speaks in your voice: “Help me… I can't get out of here.” Next to it lies the right half of the torn photo.",
    "Teybe cevap ver": "Answer the recorder",
    "Çentikleri say": "Count the marks",
    "Fotoğrafı çentiklerle karşılaştır": "Compare the photo with the marks",
    "Fotoğraf yarılarını birleştir (ÇANTA)": "Join the photo halves (BAG)",
    "Çıkışı ara": "Search for an exit",

    "Yırtık fotoğrafı duvara tuttun. Sekiz kazınmış yüz, sekiz çentik. Fotoğrafın arkasında bir yazı beliriyor: “Kaseti kırmak yetmez. İçindekini serbest bırakmalısın. İkinci kaseti bul.” Teybin altında bir kaset var.": "You held the torn photo to the wall. Eight scratched faces, eight marks. Writing appears on the back of the photo: “Breaking the tape isn't enough. You must free what's inside it. Find the second tape.” There's a tape under the recorder.",
    "Yeni bir şey öğrendin.": "You learned something new.",
    "İkinci kaseti teype koy": "Put the second tape in the recorder",
    "Önce çıkışı ara": "Search for an exit first",

    "Görüntü parazitli. Kadranı çevirip sinyali netleştir.": "The image is full of static. Turn the dial to clear the signal.",
    "İkinci kaseti taktın ama görüntü baştan sona parazit. Ekranın altında bir ayar kadranı var; karıncalanmanın ardında bir yüz ve bir mesaj gizli. Sinyali netleştirmelisin.": "You inserted the second tape but the image is nothing but static. There's a tuning dial below the screen; a face and a message are hidden behind the noise. You must clear the signal.",
    "İPUCU: Statik azalınca dur; 'NET' yazınca kilitle.": "TIP: Stop when the static fades; lock when it reads 'CLEAR'.",
    "Vazgeç, kaseti çıkar": "Give up, eject the tape",

    "İlk izleyen: kaseti ışığa tut. O karanlıkta yaşıyor.": "The first viewer: hold the tape to the light. It lives in the dark.",
    "Sinyal netleşti. Ekranda ilk izleyen beliriyor: yıllar önce, aynı koltukta, aynı korkuyla. “Kim izliyorsa,” diyor, “kaseti ışığa tut. O karanlıkta yaşıyor; ışık onu çözer. Ama sekizini kurtarmak istersen mühürlü odayı bul — duvardaki sembolleri doğru sırayla izle.” Elinde fener var.": "The signal cleared. The first viewer appears on screen: years ago, in the same chair, with the same fear. “Whoever is watching,” they say, “hold the tape to the light. It lives in the dark; light unravels it. But if you want to save the eight, find the sealed room — follow the symbols on the wall in the right order.” You have the flashlight.",
    "Gerçeği öğrendin.": "You learned the truth.",
    "Kaseti ışığa/fenere tut": "Hold the tape to the light/flashlight",
    "Mühürlü odayı ara": "Search for the sealed room",
    "Yine de kaseti kır": "Break the tape anyway",

    "Ben senim. Sen dokuzuncuyu getireceksin.": "I am you. You will bring the ninth.",
    "“Kimsin?” diye sordun. Teyp sustu. Sonra kendi sesin, tam senin tonlamanla cevap verdi: “Ben senim — bir sonraki izleyeni bekleyen. Sekiz kişiyi ben getirdim. Sen dokuzuncuyu getireceksin.”": "“Who are you?” you asked. The recorder went silent. Then your own voice, in your exact tone, answered: “I am you — the one waiting for the next viewer. I brought the eight. You will bring the ninth.”",
    "Döngüyü kırabilir misin?": "Can you break the loop?",
    "“Hayır. Bu burada biter.” Çıkışı ara": "“No. This ends here.” Search for an exit",
    "Teype itaat et, dinlemeye devam et": "Obey the recorder, keep listening",

    "Sesinin dediğini yaptın. Teyp güçlendi, sen zayıfladın. Artık teypten konuşan sensin, kırmızı ışığın altında, ekranın önüne oturacak dokuzuncuyu bekliyorsun.": "You did what your voice said. The recorder grew stronger, you grew weaker. Now you're the one speaking from the recorder, under the red light, waiting for the ninth to sit before the screen.",
    "— DÖNGÜ TAMAMLANDI —": "— THE LOOP IS COMPLETE —",
    "Yeniden başla": "Start over",

    "Sekiz çentik. Her biri bir izleyen. Sekizincisi taze — bugün kazınmış, tozu hâlâ ıslak. Ayağının dibine bir tebeşir yuvarlandı. Dokuzuncu çentiği kim atacak?": "Eight marks. Each one a viewer. The eighth is fresh — carved today, the dust still wet. A piece of chalk rolled to your feet. Who will make the ninth mark?",
    "Tebeşiri bırak, geri çekil": "Drop the chalk, step back",
    "Dokuzuncu çentiği sen at": "Carve the ninth mark yourself",

    "Çentiği attın. Duvar seni içine kabul etti — artık sen de bir isimsin, bir çentiksin, bir bekleyensin. Onuncuyu birlikte bekleyeceğiz.": "You carved the mark. The wall accepted you — now you too are a name, a mark, a waiting one. We'll wait for the tenth together.",

    "Köşede tozlu bir merdiven, yukarıda ince bir gün ışığı çizgisi. Ama basamaklar sonsuz: her çıktığında yeniden aşağıdasın. Kayıt seni burada tutuyor. Yan duvarda mühürlü bir kapı fark ediyorsun.": "A dusty staircase in the corner, a thin line of daylight above. But the steps are endless: every time you climb, you're back at the bottom. The recording keeps you here. On the side wall you notice a sealed door.",
    "Döngüyü nasıl kırarsın?": "How do you break the loop?",
    "Feneri karanlığa tut (ışık ritüeli)": "Hold the flashlight to the dark (light ritual)",
    "Mühürlü kapıyı aç": "Open the sealed door",
    "İkinci kaseti bul ve oynat": "Find and play the second tape",
    "Gözlerini kapat, ışığa körlemesine yürü": "Close your eyes, walk blindly toward the light",
    "Kaseti bul ve kır": "Find and break the tape",
    "Bağırıp yardım iste": "Scream for help",

    "Bağırdın. Sesin duvarlarda yankılandı ve sekiz farklı ses aynı kelimeleri sana bir saniye gecikmeyle geri bağırdı. Koro seni sardı, kulakların çınlıyor.": "You screamed. Your voice echoed off the walls and eight different voices screamed the same words back at you, one second delayed. The choir surrounded you, your ears ringing.",
    "Sus, çıkışı yeniden ara": "Fall silent, search for the exit again",

    /* ---------- sigorta kutusu (v9) ---------- */
    "BAND 3 — SİGORTA KUTUSU": "TAPE 3 — FUSE BOX",
    "Mühürlü kapı elektrikli. Önce gücü geri getir.": "The sealed door is electrified. Restore power first.",
    "Mühürlü kapının kilidi elektrikli — ama tüm ev karanlık. Duvarda paslı bir sigorta kutusu açık duruyor; renkli kablolar kopmuş, uçları sarkıyor. Her rengi kendi eşine bağlarsan güç geri gelir ve kapı açılır.": "The sealed door's lock is electrified — but the whole house is dark. A rusty fuse box hangs open on the wall; colored wires are severed, their ends dangling. Connect each color to its match and the power returns, opening the door.",
    "Vazgeç, geri dön": "Give up, go back",

    /* ---------- şifreli günlük (v9) ---------- */
    "Duvara bir çocuk çizimi ve sararmış bir gazete küpürü iğnelenmiş. Küpürde: “ÜÇ ÇOCUK KAYIP — 1996”. Kenarına kırmızı kalemle üç sayı yuvarlanmış: önce DÖRT, sonra DOKUZ, sonra İKİ. Çizimin altında “kapıyı böyle açtım” yazıyor. Panonun altında, tozların içinde eski bir günlük duruyor.": "A child's drawing and a yellowed newspaper clipping are pinned to the wall. The clipping: “THREE CHILDREN MISSING — 1996.” In the margin, three numbers circled in red: first FOUR, then NINE, then TWO. Under the drawing it reads “this is how I opened the door.” Below the board, in the dust, lies an old diary.",
    "Şifreli günlüğü incele": "Examine the coded diary",
    "GÜNLÜK — ŞİFRELİ SAYFA": "DIARY — CODED PAGE",
    "Günlük harf kaymasıyla yazılmış. Halkayı çevir, çöz.": "The diary is written with a letter shift. Turn the ring, decode it.",
    "Günlüğün son sayfası anlamsız harflerle dolu — biri bir şeyi gizlemek istemiş. Kenarında bir çözücü halka çizilmiş. Halkayı çevirip harfleri kaydırırsan gizli kelime ortaya çıkar. Yazıyı çöz.": "The diary's last page is full of nonsense letters — someone wanted to hide something. A decoder ring is drawn in the margin. Turn the ring to shift the letters and the hidden word appears. Decode it.",
    "Vazgeç, panoya dön": "Give up, return to the board",
    "“İZLEME. Ama izleyeceksin. Hepimiz izledik.”": "“DO NOT WATCH. But you will. We all did.”",
    "Harfler yerine oturdu: “İZLEME”. Altında normal el yazısı: “Kaseti ilk ben buldum. Sekizden biriyim artık. Sen dokuzuncu olma — ışığı unutma, aynaya bakma, sekizi serbest bırak. Belki o zaman ikimiz de kurtuluruz.” Sayfanın kenarında küçük bir pil çizili — birinin fenere sakladığı yer.": "The letters snapped into place: “DO NOT WATCH.” Below, in ordinary handwriting: “I found the tape first. I'm one of the eight now. Don't become the ninth — remember the light, don't look in the mirror, free the eight. Maybe then we both get out.” A small battery is drawn in the margin — where someone hid it for the flashlight.",
    "Günlük sana yol gösterdi.": "The diary showed you the way.",
    "Panoya geri dön": "Return to the board",
    "Kilide git": "Go to the lock",

    /* ---------- kayan parça (v9) ---------- */
    "MÜHÜR — FOTOĞRAF": "SEAL — PHOTO",
    "Fotoğraf yıpranmış. Parçaları yerine kaydır.": "The photo is worn. Slide the pieces into place.",
    "Fotoğrafı mühre yerleştirmek için parçaları doğru sıraya kaydırman gerek. Kayan parçaları oynatarak sekiz yüzü yeniden birleştir.": "To place the photo on the seal you must slide the pieces into the right order. Move the sliding tiles to reassemble the eight faces.",

    "Yüzlerce kaset. Sekiz mum. Ortada bir mühür.": "Hundreds of tapes. Eight candles. A seal in the center.",
    "Mühürlü kapıyı açtın. İçeride duvarlar tavana kadar kasetle kaplı — yüzlerce “YAYIN”. Ortada, mumlarla çevrili bir mühür ve yerde sekiz eski televizyon, hepsi karlı. Her ekranda bir yüz sana bakıyor. Mührü etkisiz kılmak için önce duvardaki sembolleri doğru sırayla izlemelisin.": "You opened the sealed door. Inside, the walls are covered floor to ceiling in tapes — hundreds of “BROADCASTS.” In the center, a seal ringed with candles, and on the floor eight old televisions, all snow. A face on every screen watches you. To neutralize the seal you must first follow the wall symbols in the right order.",
    "Sembol duvarını incele ve çöz": "Examine and solve the symbol wall",
    "Feneri mühre tut, karanlığı yak": "Hold the flashlight to the seal, burn the dark",
    "Mührü tebeşirle boz": "Break the seal with chalk",
    "Bir kaset al ve kaç": "Grab a tape and run",

    "Göz, ok, hilal, haç. İkinci kaset sırayı söylemişti.": "Eye, arrow, crescent, cross. The second tape told the order.",
    "Duvar tebeşir sembollerle dolu. Mührün etrafında dört sembol parlıyor. İkinci kasetteki fısıltı sırayı vermişti: önce gören GÖZ, sonra yükselen OK, sonra sönen HİLAL, en son çağıran HAÇ. Doğru sırayla dokun.": "The wall is covered in chalk symbols. Four glow around the seal. The whisper on the second tape gave the order: first the watching EYE, then the rising ARROW, then the waning CRESCENT, last the summoning CROSS. Tap them in the right order.",
    "İPUCU: göz ▸ ok ▸ hilal ▸ haç": "TIP: eye ▸ arrow ▸ crescent ▸ cross",
    "Geri çekil": "Step back",

    "Mühür açıldı. Sekiz kaset doğru sırayla oynatılmalı.": "The seal opened. Eight tapes must be played in the right order.",
    "Semboller tek tek yandı ve mühür çözüldü. Ama sekiz televizyon hâlâ karlı. Yerde beş numaralı kaset var — kayıp çocukların kaydı. Kurtuluş için onları doğru kronolojik sırayla oynatmalısın. Etiketlerdeki tarihler ipucu.": "The symbols lit one by one and the seal dissolved. But the eight televisions are still snow. On the floor are five tapes — the recordings of the missing children. To free them you must play them in correct chronological order. The dates on the labels are the clue.",
    "Son bulmaca: kasetleri sırala.": "Final puzzle: order the tapes.",
    "Kasetleri sırala ve oynat": "Order the tapes and play",
    "Fotoğrafı mühre yerleştir (kısa yol)": "Place the photo on the seal (shortcut)",

    "Etiketlerdeki yıllara göre eskiden yeniye sırala.": "Order from oldest to newest by the years on the labels.",
    "Beş kaset, karışık. Etiketlerinde yıllar var. Doğru kronolojik sıra sekizi serbest bırakacak.": "Five tapes, shuffled. Years on their labels. The right chronological order will free the eight.",
    "İPUCU: en eski yıldan en yeniye.": "TIP: from the oldest year to the newest.",
    "Vazgeç, mühre dön": "Give up, return to the seal",

    "Dokuz ekran sırayla yanıyor. Sekizi kurtarmak için hatırla.": "Nine screens light in sequence. Remember it to save the eight.",
    "Kasetler doğru sırayla oynadı ve duvardaki dokuz televizyon canlandı. Ekranlarda “SENİ DUYUYORUM” yazıyor. Sekizi serbest bırakmak için ekranların yanış sırasını hatırlayıp tekrarlamalısın. Her tur bir isim, bir çocuk.": "The tapes played in the right order and the nine televisions on the wall came alive. The screens read “I HEAR YOU.” To free the eight you must remember the order the screens light up and repeat it. Each round is a name, a child.",
    "İZLE ▶ ile başlat. Yanan ekranları aynı sırayla tekrarla.": "Start with WATCH ▶. Repeat the lit screens in the same order.",
    "Çok zor — fotoğrafı mühre yerleştir (kısa yol)": "Too hard — place the photo on the seal (shortcut)",

    "Mührü tebeşirle çizip bozdun. Ama mühür onu içeride tutan şeydi — sekiz televizyon aynı anda söndü ve tek bir ekranda toplandı. Şimdi serbest ve aç. İlk seni buldu.": "You scratched over the seal with chalk and broke it. But the seal was what kept it inside — the eight televisions went dark at once and gathered into a single screen. Now it's free, and hungry. It found you first.",

    "Bir kaset kaptın, kaçtın. Yıllar sonra biri tavan arasında etiketsiz bir kaset buldu — üstünde tek kelime: İZLEME. Oynattı. Ekranda beliren yüz seninkiydi. Artık sen bekleyensin.": "You grabbed a tape and ran. Years later, someone found an unlabeled tape in the attic — one word on it: DO NOT WATCH. They played it. The face that appeared was yours. Now you are the waiting one.",
    "— DÖNGÜ DEVAM EDİYOR —": "— THE LOOP CONTINUES —",

    "Sekiz ekran birer birer karardı. Teşekkür ederek gittiler.": "The eight screens went dark one by one. They left, thanking you.",
    "Fotoğrafı mühre yerleştirdin. Sekiz televizyon birer birer aydınlandı, kazınmış yüzler geri geldi — sonra huzurla karardılar. Sekiz izleyen özgür kaldı; giderken tek tek sana teşekkür etti. Kaset duvarı toza döndü. Ama sen hâlâ evin içindesin ve tüm ışıklar söndü.": "You placed the photo on the seal. The eight televisions lit up one by one, the scratched faces returned — then went peacefully dark. The eight viewers were freed; each thanked you as they left. The tape wall crumbled to dust. But you're still inside the house, and every light just went out.",
    "— GİZLİ SON —  (SEKİZİ SERBEST BIRAKTIN). Şimdi buradan çıkmalısın.": "— SECRET ENDING —  (YOU FREED THE EIGHT). Now you must get out.",
    "İyi işaretlerden birini açtın. Ama macera bitmedi — kaçış kaldı.": "You unlocked one of the good outcomes. But the adventure isn't over — the escape remains.",
    "Zifiri karanlıkta çıkışı ara (fener gerekli)": "Search for the exit in pitch dark (flashlight needed)",
    "Karanlıkta el yordamıyla ilerle": "Feel your way forward in the dark",

    "Feneri gezdir. Karanlıkta çıkışı ve ipuçlarını ara.": "Sweep the flashlight. Find the exit and clues in the dark.",
    "Ev kör karanlık. Elinde fener var. Işığı ekranda gezdirerek üç şeyi bulmalısın: çıkış kapısı, bir ipucu ve saklanan şey. Işığı yavaşça dolaştır.": "The house is pitch black. You have the flashlight. Sweep the light across the screen to find three things: the exit door, a clue, and the thing that hides. Move the light slowly.",
    "Ev kör karanlık ve fenerin yok. El yordamıyla ilerlerken bir şeye çarpıyorsun; parmakların ıslak bir şeye değiyor. Işıksız bu karanlıkta uzun süre dayanamazsın.": "The house is pitch black and you have no flashlight. Feeling your way, you bump into something; your fingers touch something wet. You can't last long in this dark without light.",
    "FENERİ FAREYLE/PARMAKLA GEZDİR — 3 nokta bul": "SWEEP THE FLASHLIGHT WITH MOUSE/FINGER — find 3 spots",
    "Fener olmadan tehlikeli.": "Dangerous without a flashlight.",
    "▸ ÇIKIŞ KAPISI": "▸ EXIT DOOR",
    "▸ DUVARDA YAZI: 'AYNAYA BAKMA'": "▸ WALL WRITING: 'DON'T LOOK IN THE MIRROR'",
    "▸ ...bir şey kıpırdadı": "▸ ...something moved",
    "Karanlıkta ilerlemeye devam et": "Keep moving through the dark",
    "Geri dön ve fener parçalarını birleştir": "Go back and assemble the flashlight parts",

    "Çatlak aynada bir yazı: 'BEN DE GÖRDÜM'. Yansıman gecikiyor.": "Writing on the cracked mirror: 'I SAW IT TOO'. Your reflection lags.",
    "Büyük, çatlak bir aynanın önündesin. Camda kanla yazılmış: “BEN DE GÖRDÜM”. Aynadaki yansıman senin hareketlerini bir saniye geç yapıyor — sanki kendi kararını veriyor. Kapıya giden yol aynanın arkasından geçiyor.": "You stand before a large, cracked mirror. Written in blood on the glass: “I SAW IT TOO.” Your reflection mimics your movements a second late — as if making its own decisions. The way to the door passes behind the mirror.",
    "Aynadaki yansımana dokun": "Touch your reflection in the mirror",
    "Aynayı tebeşirle işaretle / kır": "Mark / break the mirror",
    "Aynaya bakmadan yanından geç": "Pass by without looking at the mirror",
    "Yansımana sırtını dön ve bekle": "Turn your back on the reflection and wait",

    "Sırtını döndün. Camın soğukluğunu ensende hissettin. Yansıman aynadan çıkmaya çalışıyor; nefesi buğulanıyor. Ama sen dönmedin, dönmedin, dönmedin… ve o geri çekildi. Yol açıldı.": "You turned your back. You felt the cold of the glass on your neck. Your reflection tries to climb out of the mirror; its breath fogs the glass. But you didn't turn, didn't turn, didn't turn… and it withdrew. The way opened.",
    "Kapıya koş": "Run to the door",

    "Parmakların cama değdi. Yansıman gülümsedi — sen gülümsemedin. Seni içeri çekti; şimdi camın öbür tarafındasın, dışarıdaki kendine bakıyorsun. O gidiyor, sen kalıyorsun.": "Your fingers touched the glass. Your reflection smiled — you didn't. It pulled you in; now you're on the other side of the glass, watching yourself outside. It leaves, you stay.",

    "Aynayı kırdın. Ama gerçek olan hangisiydi?": "You broke the mirror. But which one was real?",
    "Tebeşiri değil, yumruğunu kullandın. Ayna bin parçaya bölündü ve her parçada bir yüzün var — sekizi mutlu, biri çığlık atıyor. Kırıkların arasından geçtin. Cebinde bir cam parçası: içinde senin gerçek yansıman, huzurlu.": "You used your fist, not the chalk. The mirror shattered into a thousand pieces and every shard holds a face of you — eight happy, one screaming. You walked through the shards. In your pocket, a fragment of glass: your true reflection inside it, at peace.",
    "Cam parçasını sakladın.": "You kept the shard of glass.",
    "Ön kapıya git": "Go to the front door",

    "Ön kapı. Dışarıda gerçek gün ışığı. Zincir ve sürgü.": "The front door. Real daylight outside. Chain and bolt.",
    "Ön kapıdasın. Camdan dışarı süzülen gerçek gün ışığı. Zincir takılı, sürgü çekili. Arkanda kasetin uğultusu, teybin tıkırtısı, kendi sesin: “Gitme.” Kapıyı açmak için sürgüyü ve zinciri çözmelisin.": "You're at the front door. Real daylight seeps through the glass. The chain is on, the bolt is drawn. Behind you: the tape's hum, the recorder's click, your own voice: “Don't go.” To open the door you must undo the bolt and the chain.",
    "Neredeyse çıktın. Son bir karar.": "You're almost out. One last decision.",
    "Sürgüyü çöz, kapıyı aç ve çık": "Undo the bolt, open the door and leave",
    "Kaseti de yanına al": "Take the tape with you",
    "Son bir kez arkana bak": "Look back one last time",

    "Kapı açıldı. Gün ışığı yüzüne vurdu. Kaçtın.": "The door opened. Daylight hit your face. You escaped.",
    "Sürgü geri çekildi, zincir düştü, kapı ardına kadar açıldı. Gün ışığı seni yuttu. Arkana bakmadan koştun. Ev, kaset, o ses — hepsi geride kaldı. Özgürsün. Ama bazı geceler, uzaktan bir teybin tıkırtısını hâlâ duyuyorsun.": "The bolt slid back, the chain dropped, the door swung wide. Daylight swallowed you. You ran without looking back. The house, the tape, that voice — all left behind. You're free. But some nights, you still hear a tape recorder clicking in the distance.",
    "— SON —  (KAÇIŞ: ÖN KAPIDAN)": "— ENDING —  (ESCAPE: THROUGH THE FRONT DOOR)",
    "Baştan oyna": "Play again",

    "Cam parçasındaki gerçek yansımanla dışarı çıktın.": "You walked out with your true reflection in the shard.",
    "Kapı açıldı. Cebindeki cam parçasında gerçek yansıman — huzurlu, bütün, senin. Dışarı çıktığında gölgen tam arkanda, olması gerektiği yerde. Döngüyü sadece kırmadın; onu ait olduğu yere, camın ardına hapsettin. Sekizi özgür, sen özgür. Kaset bir daha asla oynamayacak.": "The door opened. In the shard in your pocket, your true reflection — at peace, whole, you. As you step out, your shadow falls right behind you, where it should be. You didn't just break the loop; you sealed it where it belongs, behind the glass. The eight are free, you are free. The tape will never play again.",
    "— EN İYİ SON —  (AYNADAKİ GERÇEK SEN)": "— BEST ENDING —  (THE TRUE YOU IN THE MIRROR)",

    "O şey ışıkta çığlık attı — sonra tek bir sesle: seninkiyle.": "The thing screamed in the light — then with one voice: yours.",
    "Feneri karanlığın kalbine tuttun. O şey ışıkta çığlık attı — sekiz sesle birden, sonra tek bir sesle: seninkiyle. Duvardaki çentikler birer birer silindi. Bant eriyip aktı.": "You held the flashlight to the heart of the dark. The thing screamed in the light — with eight voices at once, then a single voice: yours. The marks on the wall erased one by one. The tape melted and ran.",
    "— GERÇEK SON —  (DÖNGÜ KIRILDI)": "— TRUE ENDING —  (THE LOOP IS BROKEN)",

    "Gözlerini kapadın. Basamakları saymadın, ışığı düşünmedin — sadece yürüdün. Fısıltılar, nefesler, kendi adın… hiçbirinde durmadın. Sonra yüzüne gerçek bir gün ışığı vurdu.": "You closed your eyes. You didn't count the steps, didn't think of the light — you just walked. Whispers, breaths, your own name… you stopped for none of them. Then real daylight hit your face.",
    "Gözlerini açacak mısın?": "Will you open your eyes?",
    "Gözlerini aç": "Open your eyes",
    "Kapalı tut, dışarı ulaşana dek": "Keep them shut until you're outside",

    "Kaseti iki elinle kavradın. Bant çığlık atar gibi bir ses çıkardı, ekran senin yüzünle doldu ve senin sesinle “YAPMA” diye yalvardı. Yine de kırdın. Manyetik bant her yere savruldu.": "You gripped the tape with both hands. The reel made a screaming sound, the screen filled with your face and begged in your voice: “DON'T.” You broke it anyway. Magnetic tape spilled everywhere.",
    "Sonucu gör": "See the outcome",

    "Ekran karlandı, sonra karardı. Oynatıcı kaseti dışarı tükürdü — artık bomboş bir plastik kabuk. Odan sessiz, pencereden gerçek sabah giriyor. Sekizinci çentik son çentik oldu. Döngüyü kırdın.": "The screen filled with snow, then went black. The player spat out the tape — now just an empty plastic shell. Your room is silent, real morning comes through the window. The eighth mark was the last mark. You broke the loop.",
    "— İYİ SON —": "— GOOD ENDING —",

    "Döngüyü kırdın… ama bir parçan içeride kaldı. Bazen televizyon kendiliğinden açılıyor, karlı ekranda bir siluet sana el sallıyor. Kurtuldun, ama tam olarak değil. Bir daha asla etiketsiz kaset açmayacaksın.": "You broke the loop… but a part of you stayed inside. Sometimes the TV turns itself on, and a silhouette waves at you from the snowy screen. You escaped, but not entirely. You'll never play an unlabeled tape again.",
    "— YARIM KURTULUŞ —": "— HALF ESCAPE —",

    "Şimdi sadece bir sinyalsin.": "Now you are only a signal.",
    "Korku çok fazlaydı. Zihnin kasetin gürültüsüne karıştı, düşüncelerin karlandı. Şimdi sadece bir sinyalsin — bir sonraki izleyeni bekleyen karıncalı bir görüntü.": "The fear was too much. Your mind blended into the tape's noise, your thoughts turned to static. Now you're only a signal — a snowy image waiting for the next viewer.",
    "— OYUN BİTTİ —": "— GAME OVER —",

    /* ---------- Sabit başlıklar (title) ---------- */
    "YAYIN 08": "BROADCAST 08",
    "SİNYAL YOK": "NO SIGNAL",
    "GÖRÜLDÜN": "SEEN",
    "KAYIT DEVAM EDİYOR": "RECORDING CONTINUES",
    "MÜHÜR KIRILDI": "SEAL BROKEN",
    "SEN OLDUN": "YOU BECAME IT",
    "SEKİZİ SERBEST": "THE EIGHT ARE FREE",
    "DIŞARI": "OUTSIDE",
    "GERÇEK SEN": "THE TRUE YOU",
    "IŞIK": "LIGHT",
    "YAYIN KESİLDİ": "SIGNAL CUT",
    "SESSİZLİK": "SILENCE",
    "AKLINI KAYBETTİN": "YOU LOST YOUR MIND",
    "AYNA SENİ ALDI": "THE MIRROR TOOK YOU",

    /* ---------- subtitle etiketleri ---------- */
    "BAND 1 — KAYIT 00:12": "TAPE 1 — REC 00:12",
    "BAND 1 — KAYIT 00:31": "TAPE 1 — REC 00:31",
    "BAND 2 — KAYIT 00:48": "TAPE 2 — REC 00:48",
    "BAND 2 — SİNYAL YOK": "TAPE 2 — NO SIGNAL",
    "BAND 2 — GİZLİ KAYIT": "TAPE 2 — HIDDEN RECORDING",
    "BAND 3 — MÜHÜRLÜ ODA": "TAPE 3 — SEALED ROOM",
    "BAND 4 — ZİFİRİ KARANLIK": "TAPE 4 — PITCH BLACK",
    "BAND 4 — AYNA ODASI": "TAPE 4 — MIRROR ROOM",
    "BAND 4 — ÖN KAPI": "TAPE 4 — FRONT DOOR",
    "MÜHÜR — SEMBOL DİZİSİ": "SEAL — SYMBOL SEQUENCE",
    "SON KAYIT — SIRALAMA": "FINAL RECORDING — ORDER",
    "SON KAYIT — HAFIZA": "FINAL RECORDING — MEMORY",
    "GİZLİ KAYIT — TELEFON": "HIDDEN RECORDING — PHONE",
    "◀◀ GERİ SARMA": "◀◀ REWINDING",
  };

  // dinamik metinler için yardımcılar (regex tabanlı)
  function dynamic(str, lang) {
    if (lang !== "en") return null;
    let m;
    // "KALDIĞIN YERDEN DEVAM ET ▸ (X)"
    m = str.match(/^KALDIĞIN YERDEN DEVAM ET ▸ \((.*)\)$/);
    if (m) { const inner = window.YAYIN_I18N.t(m[1]); return `CONTINUE FROM CHECKPOINT ▸ (${inner})`; }
    // "Kilit açılmadı. (N deneme)"
    m = str.match(/^Kilit açılmadı\. \((\d+) deneme\)$/);
    if (m) return `The lock didn't open. (${m[1]} attempts)`;
    // "ŞİMDİ TEKRARLA (a/b)"
    m = str.match(/^ŞİMDİ TEKRARLA \((\d+)\/(\d+)\)$/);
    if (m) return `NOW REPEAT (${m[1]}/${m[2]})`;
    // "+ Item"
    m = str.match(/^\+ (.*)$/);
    if (m) { const inner = window.YAYIN_I18N.t(m[1]); return `+ ${inner}`; }
    // stats line
    m = str.match(/^▸ Oynanış: (\d+) · Kaçış: (\d+) · Ölüm: (\d+) · Çözülen bulmaca: (\d+)$/);
    if (m) return `▸ Plays: ${m[1]} · Escapes: ${m[2]} · Deaths: ${m[3]} · Puzzles solved: ${m[4]}`;
    m = str.match(/^KEŞFEDİLEN SONLAR: (\d+) \/ (\d+)$/);
    if (m) return `ENDINGS DISCOVERED: ${m[1]} / ${m[2]}`;
    m = str.match(/^BAŞARIMLAR: (\d+) \/ (\d+)$/);
    if (m) return `ACHIEVEMENTS: ${m[1]} / ${m[2]}`;
    m = str.match(/^KAYIP FRAGMANLAR: (\d+) \/ (\d+)$/);
    if (m) return `LOST FRAGMENTS: ${m[1]} / ${m[2]}`;
    return null;
  }

  window.YAYIN_I18N = {
    lang: "tr",
    dict: { en: EN },
    t(str) {
      if (str == null) return str;
      if (this.lang === "tr") return str;
      const table = this.dict[this.lang];
      if (table && Object.prototype.hasOwnProperty.call(table, str)) return table[str];
      const dyn = dynamic(str, this.lang);
      if (dyn != null) return dyn;
      return str; // çevirisi yoksa orijinali göster
    },
  };
})();
