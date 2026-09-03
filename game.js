/* =====================================================================
   YAYIN 08  —  bir analog korku oyunu  (v3)
   Etiketsiz bir VHS kaseti buldun. Kaseti oynat. Kayıttan sağ çık.
   ===================================================================== */

(() => {
  "use strict";

  const $ = (s) => document.querySelector(s);
  const screen = $("#screen");
  const crt = $("#crt");
  const scare = $("#scare");
  const staticCanvas = $("#static");
  const bg = $("#bg");
  const osdTime = $("#osd-time");
  const osdDate = $("#osd-date");
  const osdCh = $("#osd-ch");
  const tracking = $(".tracking");
  const subBar = $("#subtitle-bar");
  const voAudio = $("#vo-audio");

  /* ---------- kalıcı ilerleme ---------- */
  const SAVE_KEY = "yayin08_save";
  const ENDINGS = {
    light_ritual: "GERÇEK SON — Işık Ritüeli",
    win_true: "İYİ SON — Yayın Kesildi",
    win_scarred: "YARIM KURTULUŞ",
    free_all: "GİZLİ SON — Sekizi Serbest Bırak",
    escape_door: "KAÇIŞ — Ön Kapıdan",
    mirror_true: "GİZLİ SON — Aynadaki Sen",
    death_sanity: "KAYIP — Aklını Kaybettin",
    look_behind: "ÖLÜM — İçeri Girdi",
    obey: "DÖNGÜ — İtaat",
    ninth_mark: "DÖNGÜ — Dokuzuncu Çentik",
    flash_figure: "ÖLÜM — Görüldün",
    become: "DÖNGÜ — Sen Oldun",
    mirror_death: "ÖLÜM — Ayna Seni Aldı",
  };
  /* başarımlar */
  const ACHIEVEMENTS = {
    first_play: { name: "İlk Kaset", desc: "Kaseti ilk kez oynattın." },
    survivor: { name: "Hayatta Kalan", desc: "İlk kez kayıttan sağ çıktın." },
    truth: { name: "Gerçeği Gören", desc: "İkinci kasetin sırrını öğrendin." },
    puzzle5: { name: "Kâşif", desc: "5 bulmaca çözdün." },
    all_items: { name: "Toplayıcı", desc: "Feneri ve tam fotoğrafı bir arada taşıdın." },
    liberator: { name: "Kurtarıcı", desc: "Sekiz izleyeni serbest bıraktın." },
    mirror: { name: "Aynadaki Sen", desc: "En iyi sonu buldun." },
    all_endings: { name: "Arşivci", desc: "Tüm sonları keşfettin." },
    nightmare: { name: "Kâbus Avcısı", desc: "Kâbus modunda kaçtın." },
    curious: { name: "Meraklı", desc: "Telefonu açtın." },
  };
  let save = loadSave();
  function loadSave() {
    const def = { endings: {}, achievements: {}, voOn: true, musicOn: true, difficulty: "normal",
      stats: { deaths: 0, wins: 0, plays: 0, puzzles: 0 }, checkpoint: null };
    try {
      const s = JSON.parse(localStorage.getItem(SAVE_KEY));
      if (!s) return def;
      return Object.assign(def, s, {
        stats: Object.assign(def.stats, s.stats || {}),
        achievements: s.achievements || {},
        endings: s.endings || {},
      });
    } catch { return def; }
  }
  function persist() { try { localStorage.setItem(SAVE_KEY, JSON.stringify(save)); } catch {} }
  function unlockEnding(id) {
    if (ENDINGS[id] && !save.endings[id]) { save.endings[id] = true; persist(); }
    // tüm sonlar açıldı mı?
    if (Object.keys(ENDINGS).every((k) => save.endings[k])) unlockAch("all_endings");
  }
  function bumpStat(k, n = 1) {
    save.stats[k] = (save.stats[k] || 0) + n; persist();
    if (k === "puzzles" && save.stats.puzzles >= 5) unlockAch("puzzle5");
  }
  function unlockAch(id) {
    if (!ACHIEVEMENTS[id] || save.achievements[id]) return;
    save.achievements[id] = true; persist();
    toast(ACHIEVEMENTS[id]);
  }
  // zorluk: normal 4 can, kâbus 2 can + daha hızlı yazı
  const DIFF = { normal: { sanity: 4, label: "NORMAL" }, nightmare: { sanity: 2, label: "KÂBUS" } };

  /* ---------- durum ---------- */
  function freshState() {
    return { sanity: (DIFF[save.difficulty] || DIFF.normal).sanity, tape: 0, inv: [], flags: {}, node: "start" };
  }
  let state = freshState();

  const has = (item) => state.inv.includes(item);
  const give = (item) => {
    if (!has(item)) {
      state.inv.push(item); flashItem(item);
      if (has("fener") && has("fotograf")) unlockAch("all_items");
    }
  };
  const take = (item) => { state.inv = state.inv.filter((i) => i !== item); };

  const ITEM_NAMES = {
    fener_kirik: "Bozuk fener", pil: "Pil", fener: "El feneri (çalışır)",
    anahtar: "Paslı anahtar", tebesir: "Tebeşir parçası",
    foto_sol: "Fotoğraf (sol yarı)", foto_sag: "Fotoğraf (sağ yarı)", fotograf: "Birleşik fotoğraf",
    kaset: "İkinci kaset", muhur: "Mühür sembolü",
  };
  const ITEM_ICON = {
    fener_kirik: "🔦", pil: "🔋", fener: "🔦", anahtar: "🗝️", tebesir: "✏️",
    foto_sol: "🖼️", foto_sag: "🖼️", fotograf: "🖼️", kaset: "📼", muhur: "🜏",
  };

  /* birleştirme tarifleri: [malzeme A, malzeme B] -> sonuç */
  const RECIPES = [
    { a: "fener_kirik", b: "pil", out: "fener", msg: "Pili bozuk fenere taktın. Işık yandı!" },
    { a: "foto_sol", b: "foto_sag", out: "fotograf", msg: "İki fotoğraf yarısını birleştirdin. Sekiz yüz tamamlandı." },
  ];
  function tryCombine(x, y) {
    return RECIPES.find((r) => (r.a === x && r.b === y) || (r.a === y && r.b === x));
  }

  /* =====================================================================
     SES  —  Web Audio ile prosedürel korku sesleri
     ===================================================================== */
  let actx = null, muted = false, humNode = null, droneNode = null;
  function audioInit() {
    if (actx) return;
    try { actx = new (window.AudioContext || window.webkitAudioContext)(); startBed(); }
    catch (e) {}
  }
  function startBed() {
    if (!actx || humNode) return;
    const osc = actx.createOscillator(), gain = actx.createGain();
    const lfo = actx.createOscillator(), lfoGain = actx.createGain();
    osc.type = "sawtooth"; osc.frequency.value = 52;
    lfo.frequency.value = 0.13; lfoGain.gain.value = 5;
    lfo.connect(lfoGain).connect(osc.frequency);
    gain.gain.value = 0.035;
    const filter = actx.createBiquadFilter();
    filter.type = "lowpass"; filter.frequency.value = 180;
    osc.connect(filter).connect(gain).connect(actx.destination);
    osc.start(); lfo.start();
    humNode = { gain };
    const d = actx.createOscillator(), dg = actx.createGain();
    d.type = "sine"; d.frequency.value = 138.6; dg.gain.value = 0.012;
    d.connect(dg).connect(actx.destination); d.start();
    droneNode = { gain: dg };
    startMusic();
  }
  function tone(freq, dur, type = "sine", vol = 0.12, slideTo = null) {
    if (!actx || muted) return;
    const o = actx.createOscillator(), g = actx.createGain();
    o.type = type; o.frequency.value = freq;
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, actx.currentTime + dur);
    g.gain.setValueAtTime(vol, actx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, actx.currentTime + dur);
    o.connect(g).connect(actx.destination);
    o.start(); o.stop(actx.currentTime + dur);
  }
  function noiseBurst(dur = 0.25, vol = 0.35, type = "white") {
    if (!actx || muted) return;
    const buf = actx.createBuffer(1, actx.sampleRate * dur, actx.sampleRate);
    const data = buf.getChannelData(0); let last = 0;
    for (let i = 0; i < data.length; i++) {
      const w = Math.random() * 2 - 1;
      if (type === "brown") { last = (last + 0.02 * w) / 1.02; data[i] = last * 3.5 * (1 - i / data.length); }
      else data[i] = w * (1 - i / data.length);
    }
    const src = actx.createBufferSource(), g = actx.createGain();
    g.gain.value = vol; src.buffer = buf;
    src.connect(g).connect(actx.destination); src.start();
  }
  const sfx = {
    select: () => tone(440, 0.05, "square", 0.05),
    confirm: () => { tone(300, 0.07, "square", 0.07); setTimeout(() => tone(520, 0.09, "square", 0.06), 60); },
    bad: () => { tone(130, 0.5, "sawtooth", 0.13, 55); noiseBurst(0.35, 0.18, "brown"); },
    scare: () => { noiseBurst(0.8, 0.55); tone(1400, 0.5, "sawtooth", 0.22, 70); setTimeout(() => tone(80, 0.7, "square", 0.2), 50); setTimeout(() => tone(2000, 0.15, "square", 0.12), 120); },
    heart: () => { tone(58, 0.14, "sine", 0.2); setTimeout(() => tone(52, 0.17, "sine", 0.16), 190); },
    pickup: () => { tone(660, 0.08, "triangle", 0.09); setTimeout(() => tone(990, 0.12, "triangle", 0.08), 80); },
    win: () => { [523, 659, 784, 1046, 1318].forEach((f, i) => setTimeout(() => tone(f, 0.28, "triangle", 0.1), i * 120)); },
    whisper: () => { noiseBurst(0.5, 0.06, "brown"); tone(220, 0.3, "sine", 0.03); },
    rewind: () => { tone(400, 0.6, "sawtooth", 0.1, 1600); noiseBurst(0.6, 0.15); },
  };

  /* =====================================================================
     AMBIENT MÜZİK  —  prosedürel, sürekli evrilen korku atmosferi
     ===================================================================== */
  let music = { on: save.musicOn !== false, master: null, nodes: [], timers: [], intensity: 0 };
  function startMusic() {
    if (!actx || music.master) return;
    const master = actx.createGain();
    master.gain.value = music.on && !muted ? 0.0 : 0.0;
    const conv = actx.createConvolver();
    // basit yankı odası (impulse response)
    const len = actx.sampleRate * 2.4;
    const ir = actx.createBuffer(2, len, actx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const d = ir.getChannelData(ch);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.5);
    }
    conv.buffer = ir;
    const wet = actx.createGain(); wet.gain.value = 0.5;
    master.connect(actx.destination);
    master.connect(wet).connect(conv).connect(actx.destination);
    music.master = master;
    // yumuşak giriş
    master.gain.linearRampToValueAtTime(music.on && !muted ? 0.16 : 0, actx.currentTime + 4);

    // Katman A: iki dedone düşük pad osilatörü (Do minör civarı)
    [130.81, 155.56, 196.00].forEach((f, idx) => {
      const o = actx.createOscillator(), g = actx.createGain();
      o.type = "triangle"; o.frequency.value = f;
      o.detune.value = (Math.random() * 12 - 6);
      g.gain.value = 0.0;
      const lp = actx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 500;
      o.connect(lp).connect(g).connect(master);
      o.start();
      // yavaş dalgalanma
      const swell = () => {
        if (!music.master) return;
        const t = actx.currentTime, dur = 6 + Math.random() * 8;
        g.gain.cancelScheduledValues(t);
        g.gain.linearRampToValueAtTime(0.05 + music.intensity * 0.04 + Math.random() * 0.03, t + dur / 2);
        g.gain.linearRampToValueAtTime(0.01, t + dur);
        music.timers.push(setTimeout(swell, dur * 1000));
      };
      setTimeout(swell, idx * 1500);
      music.nodes.push(o);
    });

    // Katman B: ara sıra tek, uzayan, ürkütücü nota (minör pentatonik)
    const scale = [523.25, 622.25, 698.46, 783.99, 932.33];
    const pluck = () => {
      if (!music.master) return;
      if (Math.random() < 0.7) {
        const f = scale[Math.floor(Math.random() * scale.length)] / 2;
        const o = actx.createOscillator(), g = actx.createGain();
        o.type = "sine"; o.frequency.value = f; o.detune.value = Math.random() * 10 - 5;
        const t = actx.currentTime;
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(0.06 + music.intensity * 0.03, t + 0.4);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 3.5);
        o.connect(g).connect(music.master);
        o.start(); o.stop(t + 3.6);
      }
      music.timers.push(setTimeout(pluck, 4000 + Math.random() * 7000));
    };
    setTimeout(pluck, 3000);

    // Katman C: derin, yavaş kalp-darbe/boom (gerilim arttıkça sıklaşır)
    const boom = () => {
      if (!music.master) return;
      const o = actx.createOscillator(), g = actx.createGain();
      o.type = "sine"; o.frequency.value = 44;
      const t = actx.currentTime;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(0.12 + music.intensity * 0.08, t + 0.05);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 1.2);
      o.connect(g).connect(music.master);
      o.start(); o.stop(t + 1.3);
      music.timers.push(setTimeout(boom, (9000 - music.intensity * 4000) + Math.random() * 4000));
    };
    setTimeout(boom, 6000);
  }
  function setMusicVol() {
    if (music.master) music.master.gain.linearRampToValueAtTime(music.on && !muted ? 0.16 : 0, actx.currentTime + 0.6);
  }
  // gerilim seviyesi: 0 (giriş) → 1 (finaller). Müziği yoğunlaştırır.
  function setIntensity(v) { music.intensity = Math.max(0, Math.min(1, v)); }

  /* =====================================================================
     SESLENDİRME (voiceover) + altyazı
     ===================================================================== */
  let voOn = save.voOn !== false;
  let subTimer = null;
  function stopVO() {
    try { voAudio.pause(); voAudio.currentTime = 0; } catch {}
    clearTimeout(subTimer);
    subBar.classList.remove("show");
  }
  function playVO(file, subtitle, entity) {
    stopVO();
    if (subtitle) {
      subBar.textContent = subtitle;
      subBar.classList.toggle("entity", !!entity);
      subBar.classList.add("show");
    }
    if (voOn && file) {
      voAudio.src = "audio/" + file;
      voAudio.volume = 0.9;
      voAudio.play().catch(() => {});
      voAudio.onended = () => { subTimer = setTimeout(() => subBar.classList.remove("show"), 800); };
    } else if (subtitle) {
      // ses kapalıysa altyazıyı süreye göre gizle
      subTimer = setTimeout(() => subBar.classList.remove("show"), 2200 + subtitle.length * 45);
    }
  }

  /* ---------- statik parazit ---------- */
  function drawStatic() {
    const c = staticCanvas, ctx = c.getContext("2d");
    const w = c.width = 240, h = c.height = 150;
    const img = ctx.createImageData(w, h);
    for (let i = 0; i < img.data.length; i += 4) {
      const v = Math.random() * 255;
      img.data[i] = img.data[i + 1] = img.data[i + 2] = v; img.data[i + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
  }
  setInterval(drawStatic, 55);

  /* ---------- OSD ---------- */
  let tapeSecs = 0;
  const months = ["OCA", "ŞUB", "MAR", "NİS", "MAY", "HAZ", "TEM", "AĞU", "EYL", "EKİ", "KAS", "ARA"];
  osdDate.textContent = "13 " + months[Math.floor(Math.random() * 12)] + " 1998";
  setInterval(() => {
    tapeSecs++;
    const h = Math.floor(tapeSecs / 3600), m = Math.floor((tapeSecs % 3600) / 60), s = tapeSecs % 60;
    osdTime.textContent = `SP ${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }, 1000);

  /* ---------- efektler ---------- */
  function trackingGlitch() {
    tracking.classList.remove("show"); void tracking.offsetWidth;
    tracking.classList.add("show"); noiseBurst(0.14, 0.1);
  }
  function glitch() { crt.classList.add("glitch"); setTimeout(() => crt.classList.remove("glitch"), 320); }

  let scareTimer = null;
  function jumpscare({ img = null, glyph = "◉", duration = 800 } = {}) {
    glitch(); sfx.scare();
    if (img) { scare.style.backgroundImage = `url(images/${img})`; scare.innerHTML = ""; }
    else { scare.style.backgroundImage = "none"; scare.innerHTML = `<div class="glyph">${glyph}</div>`; }
    scare.classList.add("fire");
    if (navigator.vibrate) navigator.vibrate([140, 50, 120]);
    clearTimeout(scareTimer);
    scareTimer = setTimeout(() => { scare.classList.remove("fire"); scare.style.opacity = "0"; }, duration);
  }

  function setBg(img) {
    if (!img) { bg.classList.remove("show"); return; }
    bg.style.backgroundImage = `url(images/${img})`;
    bg.classList.add("show");
  }

  /* =====================================================================
     FENER TARAMA MEKANİĞİ
     Karanlık ekranda fareyle/dokunuşla ışık gezdirilir. Belirli
     "sıcak noktalar" aydınlatılınca bulunur; hepsi bulununca çözülür.
     ===================================================================== */
  const darkness = document.getElementById("darkness");
  let scanState = null;
  function startScan({ spots, onComplete, radiusFound = 130 }) {
    stopScan();
    darkness.classList.add("on");
    crt.classList.add("scanning");
    scanState = { spots: spots.map((s) => ({ ...s, found: false })), onComplete, done: 0 };
    moveLight(50, 50);
    crt.addEventListener("pointermove", onPointerMove);
    crt.addEventListener("pointerdown", onPointerMove);
  }
  function stopScan() {
    darkness.classList.remove("on");
    crt.classList.remove("scanning");
    crt.removeEventListener("pointermove", onPointerMove);
    crt.removeEventListener("pointerdown", onPointerMove);
    scanState = null;
  }
  function moveLight(xPct, yPct) {
    darkness.style.setProperty("--mx", xPct + "%");
    darkness.style.setProperty("--my", yPct + "%");
  }
  function onPointerMove(e) {
    if (!scanState) return;
    const r = crt.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    moveLight(x, y);
    if (Math.random() < 0.04) tone(400 + Math.random() * 200, 0.02, "sine", 0.015);
    scanState.spots.forEach((s) => {
      if (s.found) return;
      const dx = (s.x - x), dy = (s.y - y);
      if (Math.hypot(dx, dy) < 9) {
        s.found = true; scanState.done++;
        sfx.pickup(); flashDiscovery(s.label, s.x, s.y);
        if (s.scare) setTimeout(() => jumpscare({ img: "jumpscare_face.png", duration: 700 }), 200);
        if (scanState.done >= scanState.spots.length) {
          const cb = scanState.onComplete; stopScan(); setTimeout(cb, 800);
        }
      }
    });
  }
  function flashDiscovery(label, x, y) {
    const t = document.createElement("div");
    t.textContent = label;
    t.style.cssText = `position:absolute;left:${x}%;top:${y}%;transform:translate(-50%,-50%);z-index:11;color:var(--amber);font-size:22px;text-shadow:0 0 12px var(--amber),0 2px 6px #000;pointer-events:none;transition:all 1.4s;letter-spacing:1px;`;
    crt.appendChild(t);
    requestAnimationFrame(() => { t.style.top = (y - 6) + "%"; t.style.opacity = "0"; });
    setTimeout(() => t.remove(), 1500);
  }

  /* ---------- HUD ---------- */
  function renderHUD() {
    let hud = $(".hud");
    if (!hud) { hud = document.createElement("div"); hud.className = "hud"; crt.appendChild(hud); }
    const s = Math.max(0, state.sanity);
    const maxS = (DIFF[save.difficulty] || DIFF.normal).sanity;
    const hearts = "◆".repeat(s) + `<span class="empty">${"◇".repeat(Math.max(0, maxS - s))}</span>`;
    const items = state.inv.length ? state.inv.map((i) => ITEM_NAMES[i] || i).join(" · ") : "<span class='empty'>boş</span>";
    hud.innerHTML =
      `<div><span class="lbl">AKIL SAĞLIĞI</span><br>${hearts}</div>` +
      `<div style="margin-top:6px"><span class="lbl">ÇANTA</span><br><span class="inv">${items}</span></div>`;
    crt.classList.toggle("lowsanity", state.sanity <= 1);
  }
  function flashItem(item) {
    sfx.pickup();
    const t = document.createElement("div");
    t.textContent = "+ " + (ITEM_NAMES[item] || item);
    t.style.cssText = "position:absolute;left:50%;top:20%;transform:translateX(-50%);z-index:11;color:var(--amber);font-size:26px;text-shadow:0 0 10px var(--amber);pointer-events:none;transition:all 1.2s;letter-spacing:1px;";
    crt.appendChild(t);
    requestAnimationFrame(() => { t.style.top = "13%"; t.style.opacity = "0"; });
    setTimeout(() => t.remove(), 1300);
  }

  /* ---------- başarım bildirimi ---------- */
  const toastQueue = [];
  let toastBusy = false;
  function toast(ach) {
    toastQueue.push(ach);
    if (!toastBusy) nextToast();
  }
  function nextToast() {
    if (!toastQueue.length) { toastBusy = false; return; }
    toastBusy = true;
    const ach = toastQueue.shift();
    const el = document.createElement("div");
    el.className = "ach-toast";
    el.innerHTML = `<div class="ach-ic">🏆</div><div><div class="ach-h">BAŞARIM AÇILDI</div><div class="ach-n">${ach.name}</div><div class="ach-d">${ach.desc}</div></div>`;
    crt.appendChild(el);
    sfx.pickup(); setTimeout(() => tone(1046, 0.2, "triangle", 0.07), 120);
    requestAnimationFrame(() => el.classList.add("show"));
    setTimeout(() => { el.classList.remove("show"); setTimeout(() => { el.remove(); nextToast(); }, 500); }, 3200);
  }

  function damage(n = 1) {
    state.sanity -= n; sfx.bad(); trackingGlitch(); renderHUD();
    if (state.sanity <= 0) { setTimeout(() => go("death_sanity"), 420); return true; }
    return false;
  }

  /* ---------- yazıcı efekti ---------- */
  let typing = null;
  function typeText(el, text, speed, done) {
    if (typing) clearInterval(typing);
    el.textContent = ""; el.classList.add("blink-cursor");
    let i = 0;
    typing = setInterval(() => {
      el.textContent = text.slice(0, i);
      if (Math.random() < 0.1) tone(600 + Math.random() * 500, 0.015, "square", 0.015);
      i++;
      if (i > text.length) { clearInterval(typing); typing = null; el.classList.remove("blink-cursor"); done && done(); }
    }, speed);
  }

  /* ---------- render ---------- */
  function render(node) {
    if (node.bg !== undefined) setBg(node.bg);
    const cls = node.cls ? " " + node.cls : "";
    screen.innerHTML = `
      <div class="frame${cls}">
        ${node.title ? `<h1 class="title">${node.title}</h1>` : ""}
        ${node.subtitle ? `<div class="subtitle">${node.subtitle}</div>` : ""}
        ${node.gallery ? galleryHTML() : ""}
        <p class="story"></p>
        ${node.prompt ? `<div class="prompt">${node.prompt}</div>` : ""}
        <div class="choices"></div>
        ${node.hint ? `<div class="hint">${node.hint}</div>` : ""}
      </div>`;

    const storyEl = screen.querySelector(".story");
    const choicesEl = screen.querySelector(".choices");
    const buildChoices = () => {
      if (!node.choices) return;
      let n = 1;
      node.choices.forEach((ch) => {
        if (ch.if && !ch.if()) return;
        const b = document.createElement("button");
        b.className = "choice" + (ch.danger ? " danger" : "");
        const label = typeof ch.text === "function" ? ch.text() : ch.text;
        b.innerHTML = `<span class="key">${n}</span>${label}`;
        b.dataset.key = n; n++;
        b.onmouseenter = () => sfx.select();
        b.onclick = () => {
          sfx.confirm();
          if (ch.action) ch.action();
          if (ch.to) go(typeof ch.to === "function" ? ch.to() : ch.to);
        };
        choicesEl.appendChild(b);
      });
    };
    const baseSpeed = node.speed || 20;
    const spd = save.difficulty === "nightmare" ? Math.max(10, baseSpeed - 8) : baseSpeed;
    typeText(storyEl, node.text || "", spd, () => {
      buildChoices();
      if (node.puzzle) mountPuzzle(node.puzzle);
      if (node.scan) startScan(node.scan);
    });
    // zorluk seçici butonları
    if (node.gallery) {
      screen.querySelectorAll(".diff-btn").forEach((b) => {
        b.onclick = () => {
          save.difficulty = b.dataset.diff; persist(); sfx.select();
          state.sanity = (DIFF[save.difficulty] || DIFF.normal).sanity;
          render(node); // galeriyi yeniden çiz
        };
      });
    }
    if (node.onEnter) node.onEnter();
    renderHUD();
  }

  function galleryHTML() {
    const keys = Object.keys(ENDINGS);
    const got = keys.filter((k) => save.endings[k]).length;
    const badges = keys.map((k) =>
      `<span class="badge ${save.endings[k] ? "got" : ""}">${save.endings[k] ? ENDINGS[k] : "??? — kilitli"}</span>`
    ).join("");
    const st = save.stats || {};
    const stats = `<div class="stats-line">▸ Oynanış: ${st.plays || 0} · Kaçış: ${st.wins || 0} · Ölüm: ${st.deaths || 0} · Çözülen bulmaca: ${st.puzzles || 0}</div>`;
    // zorluk seçici
    const d = save.difficulty || "normal";
    const diff = `<div class="diff-row">
      <button class="diff-btn ${d === "normal" ? "active" : ""}" data-diff="normal">NORMAL · 4 CAN</button>
      <button class="diff-btn nm ${d === "nightmare" ? "active" : ""}" data-diff="nightmare">KÂBUS · 2 CAN</button>
    </div><div class="diff-note">${d === "nightmare" ? "Kâbus: daha az can, daha hızlı yayın, daha karanlık." : "Normal: dengeli bir korku deneyimi."}</div>`;
    // başarımlar
    const aKeys = Object.keys(ACHIEVEMENTS);
    const aGot = aKeys.filter((k) => save.achievements[k]).length;
    const aBadges = aKeys.map((k) =>
      `<span class="ach-badge ${save.achievements[k] ? "got" : ""}" title="${ACHIEVEMENTS[k].desc}">${save.achievements[k] ? "🏆 " + ACHIEVEMENTS[k].name : "🔒 ???"}</span>`
    ).join("");
    const ach = `<div class="ach-wrap"><div class="ach-line">BAŞARIMLAR: ${aGot} / ${aKeys.length}</div><div class="ach-grid">${aBadges}</div></div>`;
    return `<div class="progress-line">KEŞFEDİLEN SONLAR: ${got} / ${keys.length}</div><div class="gallery">${badges}</div>${stats}${diff}${ach}`;
  }

  // hangi düğümde müzik ne kadar gergin olsun
  const INTENSITY = {
    start: 0, coward: 0.3,
    tape1: 0.2, rewind1: 0.5, look_dark: 0.5, cant_stop: 0.7, stairs: 0.55,
    basement_enter: 0.6, answer_tape: 0.7, count_marks: 0.65, find_exit: 0.7,
    tune_tape: 0.6, second_tape: 0.75, ritual_room: 0.85, symbol_wall: 0.8,
    seal_open: 0.85, tape_order: 0.85, door_lock: 0.6, mem_wall: 0.9, phone: 0.55,
    dark_room: 0.75, mirror_room: 0.85, mirror_touch: 0.95, front_door: 0.7,
    light_ritual: 1, free_all: 0.9, win_true: 0.4, win_scarred: 0.5, escape_door: 0.6,
    mirror_true: 0.9, death_sanity: 1, look_behind: 1, obey: 0.9, ninth_mark: 1,
    flash_figure: 1, break_seal: 1, steal_tape: 0.9, mirror_death: 1,
  };
  // checkpoint kaydedilecek bölüm başları
  const CHECKPOINTS = new Set(["tape1", "stairs", "basement_enter", "ritual_room", "dark_room", "mirror_room"]);
  const CHAPTER_NAME = {
    tape1: "Band 1: Koridor", stairs: "Band 1: Merdiven", basement_enter: "Band 2: Bodrum",
    ritual_room: "Band 3: Mühürlü Oda", dark_room: "Band 4: Karanlık", mirror_room: "Band 4: Ayna Odası",
  };
  function resumeCheckpoint() {
    const cp = save.checkpoint; if (!cp) { go("tape1"); return; }
    state.sanity = cp.sanity; state.inv = [...cp.inv]; state.flags = { ...cp.flags }; state.tape = cp.tape || 0;
    go(cp.node);
  }
  function updateResumeBtn() { /* start ekranı yeniden çizilince buton otomatik güncellenir */ }

  function go(id) {
    const node = STORY[id];
    if (!node) { console.warn("eksik düğüm:", id); return; }
    state.node = id;
    if (ENDINGS[id]) { unlockEnding(id); recordEndingStat(id); }
    if (id in INTENSITY) setIntensity(INTENSITY[id]);
    // checkpoint: bölüm başına gelince mevcut durumu kaydet
    if (CHECKPOINTS.has(id)) {
      save.checkpoint = { node: id, sanity: state.sanity, inv: [...state.inv], flags: { ...state.flags }, tape: state.tape };
      persist(); updateResumeBtn();
    }
    osdCh.innerHTML = `CH 08 &bull; ${node.osd || "PLAY &#9658;"}`;
    stopVO();
    stopScan();
    if (node.vo || node.sub) playVO(node.vo, node.sub, node.entity);
    render(node);
  }

  let endingCounted = null;
  function recordEndingStat(id) {
    if (endingCounted === id) return; // aynı ekranda iki kez sayma
    endingCounted = id;
    const winIds = ["light_ritual", "win_true", "win_scarred", "free_all", "escape_door", "mirror_true"];
    if (winIds.includes(id)) {
      bumpStat("wins"); unlockAch("survivor");
      if (save.difficulty === "nightmare") unlockAch("nightmare");
    } else bumpStat("deaths");
    if (id === "free_all") unlockAch("liberator");
    if (id === "mirror_true") unlockAch("mirror");
    save.checkpoint = null; persist(); updateResumeBtn(); // son gelince checkpoint temizlenir
  }

  /* =====================================================================
     BULMACA MOTORU
     Her bulmaca ekranın alt kısmına etkileşimli bir arayüz basar.
     Çözülünce onSolve() çağrılır (genelde bir düğüme gider).
     ===================================================================== */
  function mountPuzzle(builder) {
    const frame = screen.querySelector(".frame");
    if (!frame) return;
    const wrap = document.createElement("div");
    wrap.className = "puzzle";
    const msg = document.createElement("div");
    msg.className = "puzzle-msg";
    frame.querySelector(".choices").before(wrap);
    builder(wrap, msg);
    wrap.appendChild(msg);
  }
  function setMsg(msg, text, type) {
    msg.textContent = text;
    msg.className = "puzzle-msg" + (type ? " " + type : "");
  }

  /* --- 1) ŞİFRELİ KİLİT --- */
  function puzzleLock({ answer, hint, onSolve, digits = 3 }) {
    return (wrap, msg) => {
      const cur = Array(digits).fill(0);
      const dials = document.createElement("div");
      dials.className = "dials";
      const nums = [];
      for (let i = 0; i < digits; i++) {
        const d = document.createElement("div");
        d.className = "dial";
        const up = document.createElement("button"); up.textContent = "▲";
        const nn = document.createElement("div"); nn.className = "num"; nn.textContent = "0";
        const dn = document.createElement("button"); dn.textContent = "▼";
        up.onclick = () => { cur[i] = (cur[i] + 1) % 10; nn.textContent = cur[i]; sfx.select(); };
        dn.onclick = () => { cur[i] = (cur[i] + 9) % 10; nn.textContent = cur[i]; sfx.select(); };
        d.append(up, nn, dn); dials.appendChild(d); nums.push(nn);
      }
      const btn = document.createElement("button");
      btn.className = "puzzle-btn"; btn.textContent = "ONAYLA";
      let tries = 0;
      btn.onclick = () => {
        const guess = cur.join("");
        if (guess === answer) {
          setMsg(msg, "KİLİT AÇILDI ▸", "ok"); bumpStat("puzzles"); sfx.confirm(); tone(880, 0.3, "triangle", 0.09);
          setTimeout(onSolve, 900);
        } else {
          tries++; setMsg(msg, "Kilit açılmadı. (" + tries + " deneme)", "err"); sfx.bad(); trackingGlitch();
        }
      };
      if (hint) { const h = document.createElement("div"); h.className = "attempts"; h.textContent = hint; wrap.appendChild(h); }
      wrap.append(dials, btn);
    };
  }

  /* --- 2) SEMBOL DİZİSİ --- */
  function puzzleSequence({ symbols, answer, hint, onSolve }) {
    return (wrap, msg) => {
      const disp = document.createElement("div");
      disp.className = "seq-display"; disp.textContent = "";
      const grid = document.createElement("div");
      grid.className = "sym-grid";
      let picks = [];
      symbols.forEach((s) => {
        const b = document.createElement("button");
        b.className = "sym"; b.textContent = s;
        b.onclick = () => {
          picks.push(s); disp.textContent = picks.join(" "); sfx.select();
          if (picks.length === answer.length) {
            if (picks.join("") === answer.join("")) { setMsg(msg, "SEMBOLLER HİZALANDI ▸", "ok"); bumpStat("puzzles"); sfx.confirm(); tone(880, 0.3, "triangle", 0.09); setTimeout(onSolve, 900); }
            else { setMsg(msg, "Duvar titredi… yanlış sıra.", "err"); sfx.bad(); trackingGlitch(); picks = []; disp.textContent = ""; }
          }
        };
        grid.appendChild(b);
      });
      const clr = document.createElement("button");
      clr.className = "puzzle-btn"; clr.textContent = "TEMİZLE";
      clr.onclick = () => { picks = []; disp.textContent = ""; sfx.select(); };
      if (hint) { const h = document.createElement("div"); h.className = "attempts"; h.textContent = hint; wrap.appendChild(h); }
      wrap.append(disp, grid, clr);
    };
  }

  /* --- 3) SİNYAL AYARLAMA --- */
  function puzzleTune({ target, tolerance = 4, onSolve, hint }) {
    return (wrap, msg) => {
      const tuner = document.createElement("div");
      tuner.className = "tuner";
      const bar = document.createElement("div"); bar.className = "bar";
      const fill = document.createElement("div"); fill.className = "fill"; bar.appendChild(fill);
      const range = document.createElement("input");
      range.type = "range"; range.min = 0; range.max = 100; range.value = Math.random() < 0.5 ? 8 : 92;
      const lock = document.createElement("div"); lock.className = "lock"; lock.textContent = "SİNYAL: —";
      const btn = document.createElement("button"); btn.className = "puzzle-btn"; btn.textContent = "KİLİTLE";
      let locked = false, noiseGain = null;
      // canlı statik sesi: hedefe yaklaştıkça netleşir
      function upd() {
        const v = +range.value;
        const dist = Math.abs(v - target);
        const clarity = Math.max(0, 1 - dist / 50);
        fill.style.opacity = clarity;
        fill.style.width = (2 + clarity * 8) + "px";
        bg.style.filter = `brightness(${0.5 + clarity * 0.5}) saturate(${0.7 + clarity * 0.6})`;
        if (dist <= tolerance) lock.textContent = "SİNYAL: ● NET";
        else if (dist <= 18) lock.textContent = "SİNYAL: ◐ yaklaşıyor…";
        else lock.textContent = "SİNYAL: ○ parazit";
        if (Math.random() < 0.3) noiseBurst(0.04, 0.03 + (1 - clarity) * 0.12);
      }
      range.oninput = () => { if (!locked) { upd(); if (Math.random() < 0.4) sfx.select(); } };
      btn.onclick = () => {
        const dist = Math.abs(+range.value - target);
        if (dist <= tolerance) { locked = true; setMsg(msg, "GÖRÜNTÜ NETLEŞTİ ▸", "ok"); bumpStat("puzzles"); sfx.confirm(); tone(880, 0.3, "triangle", 0.09); bg.style.filter = ""; setTimeout(onSolve, 900); }
        else { setMsg(msg, "Hâlâ parazit var. Kadranı oynat.", "err"); sfx.bad(); trackingGlitch(); }
      };
      if (hint) { const h = document.createElement("div"); h.className = "attempts"; h.textContent = hint; wrap.appendChild(h); }
      tuner.append(lock, bar, range); wrap.append(tuner, btn);
      upd();
    };
  }

  /* --- 4) KASET SIRALAMA --- */
  function puzzleOrder({ tapes, answer, hint, onSolve }) {
    return (wrap, msg) => {
      const row = document.createElement("div"); row.className = "tape-row";
      let order = [];
      const cards = [];
      tapes.forEach((t) => {
        const c = document.createElement("div"); c.className = "tapecard";
        c.innerHTML = `<div class="ord"></div><div class="tnum">${t.n}</div><div class="tlbl">${t.lbl}</div>`;
        c.onclick = () => {
          if (order.includes(t.n)) { order = order.filter((x) => x !== t.n); c.classList.remove("sel"); }
          else { order.push(t.n); c.classList.add("sel"); }
          sfx.select();
          cards.forEach((cc) => { const pos = order.indexOf(cc.n); cc.el.querySelector(".ord").textContent = pos >= 0 ? (pos + 1) : ""; });
        };
        row.appendChild(c); cards.push({ n: t.n, el: c });
      });
      const btn = document.createElement("button"); btn.className = "puzzle-btn"; btn.textContent = "OYNAT";
      btn.onclick = () => {
        if (order.length !== answer.length) { setMsg(msg, "Tüm kasetleri sıraya koy.", "err"); return; }
        if (order.join("") === answer.join("")) { setMsg(msg, "DOĞRU SIRA — KAYIT AÇILIYOR ▸", "ok"); bumpStat("puzzles"); sfx.confirm(); tone(880, 0.3, "triangle", 0.09); setTimeout(onSolve, 900); }
        else { setMsg(msg, "Kasetler cızırtıyla durdu. Yanlış sıra.", "err"); sfx.bad(); trackingGlitch(); order.forEach(() => {}); }
      };
      const clr = document.createElement("button"); clr.className = "puzzle-btn"; clr.textContent = "SIFIRLA";
      clr.onclick = () => { order = []; cards.forEach((cc) => { cc.el.classList.remove("sel"); cc.el.querySelector(".ord").textContent = ""; }); sfx.select(); };
      if (hint) { const h = document.createElement("div"); h.className = "attempts"; h.textContent = hint; wrap.appendChild(h); }
      wrap.append(row, btn, clr);
    };
  }

  /* --- 5) HAFIZA (SIMON) : 3x3 TV IZGARASI --- */
  function puzzleMemory({ rounds = 4, onSolve, hint }) {
    return (wrap, msg) => {
      const grid = document.createElement("div"); grid.className = "mem-grid";
      const cells = [];
      for (let i = 0; i < 9; i++) {
        const c = document.createElement("div"); c.className = "mem-cell";
        c.dataset.i = i; grid.appendChild(c); cells.push(c);
      }
      const btn = document.createElement("button"); btn.className = "puzzle-btn"; btn.textContent = "İZLE ▶";
      const seq = []; let playerIdx = 0; let accepting = false; let level = 0;
      const freqs = [262, 294, 330, 349, 392, 440, 494, 523, 587];
      function light(i, on) { cells[i].classList.toggle("lit", on); }
      function flash(i, cb) {
        light(i, true); tone(freqs[i], 0.32, "sine", 0.09); noiseBurst(0.05, 0.03);
        setTimeout(() => { light(i, false); setTimeout(cb, 180); }, 380);
      }
      function playSeq() {
        accepting = false; setMsg(msg, "İZLE…", ""); let k = 0;
        (function step() {
          if (k >= seq.length) { accepting = true; playerIdx = 0; setMsg(msg, "ŞİMDİ TEKRARLA (" + (level) + "/" + rounds + ")", ""); return; }
          flash(seq[k++], step);
        })();
      }
      function nextLevel() {
        level++;
        if (level > rounds) { setMsg(msg, "HAFIZA DOĞRU — YAYIN AÇILIYOR ▸", "ok"); bumpStat("puzzles"); sfx.confirm(); tone(880, 0.3, "triangle", 0.09); accepting = false; setTimeout(onSolve, 1000); return; }
        seq.push(Math.floor(Math.random() * 9));
        setTimeout(playSeq, 600);
      }
      cells.forEach((c, i) => c.onclick = () => {
        if (!accepting) return;
        flash(i, () => {});
        if (seq[playerIdx] === i) {
          playerIdx++;
          if (playerIdx >= seq.length) { accepting = false; sfx.pickup(); setTimeout(nextLevel, 500); }
        } else {
          accepting = false; setMsg(msg, "YANLIŞ! Ekranlar çığlık attı. Baştan.", "err");
          sfx.bad(); trackingGlitch(); if (damage(1)) return;
          seq.length = 0; level = 0; setTimeout(nextLevel, 1200);
        }
      });
      btn.onclick = () => { if (level === 0) nextLevel(); else playSeq(); };
      if (hint) { const h = document.createElement("div"); h.className = "attempts"; h.textContent = hint; wrap.appendChild(h); }
      wrap.append(grid, btn);
    };
  }

  /* =====================================================================
     HİKÂYE
     ===================================================================== */
  const STORY = {

    start: {
      title: "YAYIN 08", subtitle: "— bir analog korku deneyimi —", bg: "bg_attic.png",
      gallery: true,
      vo: "vo_intro.mp3",
      sub: "Tavan arasında etiketsiz bir kaset buldun. Üstünde tek kelime: İzleme.",
      text: "Tavan arasında etiketsiz bir VHS kaseti buldun. Üstünde keçeli kalemle: “İZLEME”. Altında titrek bir el yazısı: “sekizinciye kadar sayıyoruz”. Eski oynatıcı hâlâ çalışıyor. Kaseti sürdün.",
      prompt: "Kaseti oynatmak istiyor musun?",
      onEnter: () => { updateResumeBtn(); },
      choices: [
        { text: "OYNAT ▶ (yeni oyun)", to: "tape1", action: () => { audioInit(); bumpStat("plays"); unlockAch("first_play"); } },
        { text: () => `KALDIĞIN YERDEN DEVAM ET ▸ (${save.checkpoint ? CHAPTER_NAME[save.checkpoint.node] || "bölüm" : ""})`, action: () => { audioInit(); resumeCheckpoint(); }, if: () => !!save.checkpoint },
        { text: "Kaseti geri koy, odadan çık", to: "coward" },
      ],
      hint: "SES/SESLENDİRME İÇİN TIKLA · KULAKLIK ÖNERİLİR · 1-9 TUŞLARIYLA SEÇ",
    },

    coward: {
      title: "…", cls: "ending", bg: "bg_tv.png",
      sub: "Kaçış yok. Televizyon kendiliğinden açıldı.",
      text: "Kaseti yerine koydun. O gece uyuyamadın. Sabah kaset yastığının yanındaydı; bant tıkırdayarak dönüyordu. Kimse oynatmamıştı. Televizyon kendiliğinden açıldı.",
      prompt: "Kaçış yok.",
      onEnter: () => setTimeout(trackingGlitch, 700),
      choices: [{ text: "Bu sefer izle", to: "tape1", action: () => audioInit() }],
    },

    /* ================= BAND 1 : KORİDOR ================= */
    tape1: {
      subtitle: "BAND 1 — KAYIT 00:12", bg: "bg_hallway.png",
      vo: "vo_hallway.mp3",
      sub: "Senin evinin koridoru. Sonundaki kapı yavaşça aralanıyor.",
      text: "Ekran karlanıyor, sonra netleşiyor: senin evinin koridoru. Kamera yürüyor. Sonundaki kapı yavaşça aralanıyor; içerisi kapkaranlık ve oradan derin bir nefes sesi geliyor. Yerde bozuk bir el feneri duruyor — pili yok.",
      onEnter: () => { state.tape = 1; sfx.heart(); setTimeout(trackingGlitch, 900); },
      prompt: "Ne yaparsın?",
      hint: "İPUCU: Eşyaları ÇANTA menüsünden birleştirebilirsin.",
      choices: [
        { text: "Bozuk el fenerini al", to: "tape1", action: () => give("fener_kirik"), if: () => !has("fener_kirik") && !has("fener") },
        { text: "Karanlık kapının içini incele", to: "look_dark" },
        { text: "Lambayı arayıp ışığı yak", to: "reach_light" },
        { text: "Kaydı geri sar", to: "rewind1" },
      ],
    },

    rewind1: {
      subtitle: "◀◀ GERİ SARMA", osd: "REW &#9668;&#9668;", bg: "bg_static.png",
      text: "Kaseti geri sardın ama görüntü aynı: koridor, kapı, nefes. Geri sarılırken nefes sesi hızlanıyor — sanki sana gülüyor. Karlanan ekranda bir an bir yüz beliriyor.",
      onEnter: () => { sfx.rewind(); glitch(); setTimeout(() => jumpscare({ img: "jumpscare_face.png", duration: 500 }), 1200); },
      choices: [{ text: "Yeniden oynat", to: "tape1" }],
    },

    look_dark: {
      bg: "bg_hallway.png",
      text: has("fener")
        ? "Feneri kapıya tuttun. Işık huzmesinde bir şey var: tavana yakın, üç metre yükseklikte iki ıslak göz. Yavaşça sana doğru eğiliyorlar."
        : "Karanlığa baktın ama hiçbir şey göremiyorsun. Sonra iki nokta parlıyor — gözler, hem de tam tepende. El yordamıyla geri çekilirken bir şeye çarptın.",
      onEnter: () => { sfx.heart(); if (!has("fener")) setTimeout(() => jumpscare({ img: "jumpscare_face.png" }), 1500); },
      prompt: "…",
      choices: [
        { text: "Gözlere sabit bak, kıpırdama", to: "stare" },
        { text: "Kaydı durdurmaya çalış", to: "cant_stop", danger: true, action: () => damage(1) },
      ],
    },

    stare: {
      bg: "bg_hallway.png",
      text: "Kıpırdamadın. Gözler bir an durakladı… sonra kapandı ve karanlığa gömüldü. Cesaretin işe yaradı — zihnin sağlam kaldı. Kamera kapıdan içeri süzülüyor. Yerde paslı bir anahtar ve bir pil parlıyor.",
      onEnter: () => { tone(660, 0.3, "triangle", 0.08); give("anahtar"); give("pil"); },
      prompt: "Anahtarı ve pili aldın. (Pili bozuk fenerle ÇANTA'da birleştirebilirsin.)",
      choices: [{ text: "Merdivenlere in", to: "stairs" }],
    },

    cant_stop: {
      bg: "bg_viewer.png",
      sub: "Ekrandaki şey artık senin arkanda.", entity: true,
      text: "Durdur tuşuna bastın. Oynatıcı reddediyor; kırmızı REC ışığı sönmüyor. Ekrandaki şey artık koridorda değil — senin odanda, arkanda. Kaydın içinden kendi koltuğuna bakıyorsun.",
      onEnter: () => setTimeout(() => jumpscare({ img: "jumpscare_face.png" }), 900),
      prompt: "Arkanda bir tıkırtı.",
      choices: [
        { text: "Arkana bak", to: "look_behind", danger: true },
        { text: "Ekrana kilitlen, sakın arkana bakma", to: "stairs" },
      ],
    },

    look_behind: {
      cls: "death", title: "SİNYAL YOK", osd: "NO SIGNAL", bg: "bg_static.png",
      text: "Arkana baktın. Hiçbir şey yok. Ama geri döndüğünde ekran senin sırtını gösteriyordu — kamera artık senin arkandaydı, içeri girmişti. Sonra ekran seni içine çekti.",
      onEnter: () => jumpscare({ img: "jumpscare_face.png", duration: 1000 }),
      prompt: "— BÖLÜM SONU —",
      choices: [{ text: "Kaseti baştan al", to: "start", action: reset }],
    },

    reach_light: {
      bg: "bg_hallway.png",
      text: "Işığa uzandın, lamba ipini çektin. Bir an aydınlık: koridor bomboş, duvarda taze bir tebeşir çentiği ve rafta bir pil var. Sonra ampul patladı ve karanlıkta o nefes tam ensendeydi.",
      onEnter: () => { give("tebesir"); give("pil"); setTimeout(() => { jumpscare({ img: "jumpscare_face.png" }); damage(1); }, 1600); },
      choices: [
        { text: "Kayıtta koş, merdivenlere in", to: "stairs" },
        { text: "Olduğun yerde don, kıpırdama", to: "freeze1", action: () => damage(1) },
      ],
    },

    freeze1: {
      bg: "bg_hallway.png",
      text: "Donakaldın. O şey seni uzun uzun kokladı, inceledi… ve geçip gitti. Titriyorsun ama hayattasın. Kamera kendiliğinden merdivenlere yöneliyor.",
      choices: [{ text: "Merdivenlere in", to: "stairs" }],
    },

    /* ================= MERDİVEN : YÜZSÜZ KADIN ================= */
    stairs: {
      subtitle: "BAND 1 — KAYIT 00:31", bg: "bg_stairs.png",
      vo: "vo_stairs.mp3",
      sub: "Aşağıda yüzü olmayan bir kadın seni işaret ediyor.",
      text: "Merdiven başındasın. Aşağıda beyaz geceliğiyle bir kadın duruyor — yüzü yok, sadece pürüzsüz bir boşluk. Kolunu ağır ağır kaldırıp seni işaret ediyor. Fısıldıyor: “Sen de bu kasetin içindesin artık.”",
      onEnter: () => { sfx.heart(); sfx.whisper(); },
      prompt: "Ne yaparsın?",
      choices: [
        { text: "Yanından sessizce geç", to: "pass_figure" },
        { text: "Bir odaya saklan", to: "hide_room" },
        { text: "Çalan telefonu yanıtla", to: "phone", if: () => !state.flags.phoned },
        { text: "Feneri yüzüne tut", to: "flash_figure", danger: true, if: () => has("fener") },
      ],
    },

    phone: {
      subtitle: "GİZLİ KAYIT — TELEFON", osd: "PAUSE &#10073;&#10073;", bg: "bg_phone.png",
      sub: "Telefonun öbür ucunda kendi sesin: dört… dokuz… iki.",
      text: "Yan odada eski bir çevirmeli telefon çalıyor. Ahizeyi kaldırdın. Parazitin ardından bir ses — senin sesin — üç sayı fısıldıyor: “dört… dokuz… iki. Kapıyı böyle açtım. Ama sonra pişman oldum.” Hat kesildi.",
      onEnter: () => { sfx.heart(); sfx.whisper(); state.flags.phoned = true; state.flags.lockClue = true; unlockAch("curious"); },
      prompt: "Şifreyi öğrendin: 4-9-2.",
      choices: [
        { text: "Merdivene geri dön", to: "stairs" },
        { text: "Doğruca aşağı in", to: "pass_figure" },
      ],
    },

    flash_figure: {
      cls: "death", title: "GÖRÜLDÜN", bg: "bg_stairs.png",
      text: "Feneri yüzsüz yüzüne tuttun. O boşluk ışığı emdi ve bir anda yüzün ta kendisi oldu — senin yüzün, çığlık atarak. Kadın koridoru bir hamlede kat etti.",
      onEnter: () => jumpscare({ img: "jumpscare_face.png", duration: 1000 }),
      prompt: "— BÖLÜM SONU —",
      choices: [{ text: "Baştan al", to: "start", action: reset }],
    },

    pass_figure: {
      bg: "bg_stairs.png",
      text: "Nefesini tuttun, yanından geçtin. Kadın kımıldamadı; sadece fısıldadı: “Bodrumda saymaya devam ediyor.” Alt kata indin. Bir kapı, üstünde eski bir şifreli asma kilit. Yerde yırtık bir fotoğrafın sol yarısı.",
      onEnter: () => { tone(120, 0.5, "sawtooth", 0.09, 70); give("foto_sol"); },
      prompt: "Fotoğrafın yarısında dört kişi var; yüzleri kazınmış. Diğer yarısı eksik. Kapı üç haneli bir şifreyle kilitli.",
      choices: [
        { text: "Duvardaki çocuk çizimini incele (ipucu)", to: "clue_note" },
        { text: "Şifreli kilidi çözmeye çalış", to: "door_lock" },
        { text: "Anahtarla aç", to: "basement_enter", if: () => has("anahtar") },
        { text: "Kapıyı omuzla, zorla", to: "force_door", action: () => damage(1) },
      ],
    },

    clue_note: {
      bg: "bg_clue.png",
      sub: "Üç çocuk kayıp. Sayılar kırmızıyla yuvarlanmış: 4, 9, 2.",
      text: "Duvara bir çocuk çizimi ve sararmış bir gazete küpürü iğnelenmiş. Küpürde: “ÜÇ ÇOCUK KAYIP — 1996”. Kenarına kırmızı kalemle üç sayı yuvarlanmış: önce DÖRT, sonra DOKUZ, sonra İKİ. Çizimin altında “kapıyı böyle açtım” yazıyor.",
      onEnter: () => { sfx.whisper(); state.flags.lockClue = true; },
      prompt: "Şifreyi aklında tut.",
      choices: [
        { text: "Kilide geri dön", to: "door_lock" },
      ],
    },

    door_lock: {
      bg: "bg_lock.png", osd: "PAUSE &#10073;&#10073;",
      text: "Paslı şifreli kilit. Üç kadran, sıfırdan dokuza. Kadranları çevirip doğru şifreyi bulman gerek.",
      onEnter: () => sfx.heart(),
      hint: "İPUCU: Çocuk çizimindeki üç sayı.",
      puzzle: puzzleLock({
        answer: "492", digits: 3,
        hint: "Kadranları ▲▼ ile çevir, sonra ONAYLA.",
        onSolve: () => go("basement_enter"),
      }),
      choices: [
        { text: "İpucuna tekrar bak", to: "clue_note", if: () => !state.flags.lockClue },
        { text: "Vazgeç, kapıyı omuzla", to: "force_door", danger: true, action: () => damage(1) },
      ],
    },

    force_door: {
      bg: "bg_stairs.png",
      text: "Kapıya yüklendin. Menteşeler haykırdı, omzun zonkluyor ama kapı açıldı. Aşağı inen karanlık bir merdiven. Aşağıdan bir teybin tıkırtısı geliyor.",
      choices: [{ text: "Bodruma in", to: "basement_enter" }],
    },

    hide_room: {
      bg: "bg_closet.png",
      text: "Bir odaya daldın, dolaba girdin, kapağı çektin. Tık. Tık. Ayak sesleri. Dolabın aralığından tek bir göz seni izliyor. Kapağı açmadı — sadece bekledi. Saatlerce. Elinin altında yırtık fotoğrafın sol yarısı ve paslı bir anahtar var.",
      onEnter: () => setTimeout(() => { jumpscare({ img: "bg_closet.png", glyph: "👁" }); damage(1); give("foto_sol"); if (!has("anahtar")) give("anahtar"); }, 1900),
      prompt: "Şafak sökerken göz kayboldu.",
      choices: [{ text: "Dışarı çık, aşağı in", to: "basement_enter" }],
    },

    /* ================= BAND 2 : BODRUM ================= */
    basement_enter: {
      subtitle: "BAND 2 — KAYIT 00:48", osd: "PLAY &#9658;", bg: "bg_basement.png",
      vo: "vo_basement.mp3",
      sub: "Duvarda sekiz çentik ve senin ismin. Teyp senin sesinle konuşuyor.",
      text: "Bodrum. Duvarda tebeşirle sekiz çentik ve altında bir isim: SENİN İSMİN. Yerde eski bir teyp, kırmızı kayıt ışığı yanıp sönüyor. Teyp senin sesinle konuşuyor: “Yardım et… buradan çıkamıyorum.” Teybin yanında yırtık fotoğrafın sağ yarısı duruyor.",
      onEnter: () => { state.tape = 2; sfx.heart(); give("foto_sag"); setTimeout(trackingGlitch, 700); },
      prompt: "Ne yaparsın?",
      choices: [
        { text: "Teybe cevap ver", to: "answer_tape" },
        { text: "Çentikleri say", to: "count_marks" },
        { text: "Fotoğrafı çentiklerle karşılaştır", to: "compare_photo", if: () => has("fotograf") },
        { text: "Fotoğraf yarılarını birleştir (ÇANTA)", action: () => openBag(), if: () => has("foto_sol") && has("foto_sag") && !has("fotograf") },
        { text: "Çıkışı ara", to: "find_exit" },
      ],
    },

    compare_photo: {
      bg: "bg_basement.png",
      text: "Yırtık fotoğrafı duvara tuttun. Sekiz kazınmış yüz, sekiz çentik. Fotoğrafın arkasında bir yazı beliriyor: “Kaseti kırmak yetmez. İçindekini serbest bırakmalısın. İkinci kaseti bul.” Teybin altında bir kaset var.",
      onEnter: () => { give("kaset"); tone(440, 0.3, "triangle", 0.07); },
      prompt: "Yeni bir şey öğrendin.",
      choices: [
        { text: "İkinci kaseti teype koy", to: "tune_tape", if: () => has("kaset") },
        { text: "Önce çıkışı ara", to: "find_exit" },
      ],
    },

    tune_tape: {
      subtitle: "BAND 2 — SİNYAL YOK", osd: "TRACKING", bg: "bg_tune.png",
      sub: "Görüntü parazitli. Kadranı çevirip sinyali netleştir.",
      text: "İkinci kaseti taktın ama görüntü baştan sona parazit. Ekranın altında bir ayar kadranı var; karıncalanmanın ardında bir yüz ve bir mesaj gizli. Sinyali netleştirmelisin.",
      onEnter: () => sfx.heart(),
      hint: "İPUCU: Statik azalınca dur; 'NET' yazınca kilitle.",
      puzzle: puzzleTune({
        target: 68, tolerance: 5,
        hint: "Kadranı sürükle, görüntü netleşince KİLİTLE.",
        onSolve: () => go("second_tape"),
      }),
      choices: [
        { text: "Vazgeç, kaseti çıkar", to: "basement_enter" },
      ],
    },

    second_tape: {
      subtitle: "BAND 2 — GİZLİ KAYIT", bg: "bg_static.png",
      vo: "vo_entity1.mp3", entity: true,
      sub: "İlk izleyen: kaseti ışığa tut. O karanlıkta yaşıyor.",
      text: "Sinyal netleşti. Ekranda ilk izleyen beliriyor: yıllar önce, aynı koltukta, aynı korkuyla. “Kim izliyorsa,” diyor, “kaseti ışığa tut. O karanlıkta yaşıyor; ışık onu çözer. Ama sekizini kurtarmak istersen mühürlü odayı bul — duvardaki sembolleri doğru sırayla izle.” Elinde fener var.",
      onEnter: () => { glitch(); sfx.whisper(); state.flags.knowsTruth = true; unlockAch("truth"); },
      prompt: "Gerçeği öğrendin.",
      choices: [
        { text: "Kaseti ışığa/fenere tut", to: "light_ritual", if: () => has("fener") },
        { text: "Mühürlü odayı ara", to: "ritual_room", if: () => has("fener") },
        { text: "Yine de kaseti kır", to: "break_tape" },
      ],
    },

    answer_tape: {
      bg: "bg_basement.png",
      vo: "vo_entity2.mp3", entity: true,
      sub: "Ben senim. Sen dokuzuncuyu getireceksin.",
      text: "“Kimsin?” diye sordun. Teyp sustu. Sonra kendi sesin, tam senin tonlamanla cevap verdi: “Ben senim — bir sonraki izleyeni bekleyen. Sekiz kişiyi ben getirdim. Sen dokuzuncuyu getireceksin.”",
      onEnter: () => glitch(),
      prompt: "Döngüyü kırabilir misin?",
      choices: [
        { text: "“Hayır. Bu burada biter.” Çıkışı ara", to: "find_exit" },
        { text: "Teype itaat et, dinlemeye devam et", to: "obey", danger: true, action: () => damage(2) },
      ],
    },

    obey: {
      cls: "death", title: "KAYIT DEVAM EDİYOR", osd: "REC &#9679;", bg: "bg_viewer.png",
      text: "Sesinin dediğini yaptın. Teyp güçlendi, sen zayıfladın. Artık teypten konuşan sensin, kırmızı ışığın altında, ekranın önüne oturacak dokuzuncuyu bekliyorsun.",
      onEnter: () => jumpscare({ glyph: "∞", duration: 900 }),
      prompt: "— DÖNGÜ TAMAMLANDI —",
      choices: [{ text: "Yeniden başla", to: "start", action: reset }],
    },

    count_marks: {
      bg: "bg_basement.png",
      text: "Sekiz çentik. Her biri bir izleyen. Sekizincisi taze — bugün kazınmış, tozu hâlâ ıslak. Ayağının dibine bir tebeşir yuvarlandı. Dokuzuncu çentiği kim atacak?",
      onEnter: () => { sfx.heart(); if (!has("tebesir")) give("tebesir"); },
      prompt: "…",
      choices: [
        { text: "Tebeşiri bırak, geri çekil", to: "find_exit" },
        { text: "Dokuzuncu çentiği sen at", to: "ninth_mark", danger: true, action: () => damage(2) },
      ],
    },

    ninth_mark: {
      cls: "death", title: "IX", bg: "bg_basement.png",
      text: "Çentiği attın. Duvar seni içine kabul etti — artık sen de bir isimsin, bir çentiksin, bir bekleyensin. Onuncuyu birlikte bekleyeceğiz.",
      onEnter: () => jumpscare({ glyph: "✚", duration: 900 }),
      choices: [{ text: "Yeniden başla", to: "start", action: reset }],
    },

    find_exit: {
      bg: "bg_basement.png",
      text: "Köşede tozlu bir merdiven, yukarıda ince bir gün ışığı çizgisi. Ama basamaklar sonsuz: her çıktığında yeniden aşağıdasın. Kayıt seni burada tutuyor. Yan duvarda mühürlü bir kapı fark ediyorsun.",
      onEnter: () => sfx.heart(),
      prompt: "Döngüyü nasıl kırarsın?",
      choices: [
        { text: "Feneri karanlığa tut (ışık ritüeli)", to: "light_ritual", if: () => has("fener") && (state.flags.knowsTruth || has("kaset")) },
        { text: "Mühürlü kapıyı aç", to: "ritual_room", if: () => has("fener") },
        { text: "İkinci kaseti bul ve oynat", to: "tune_tape", if: () => has("kaset") && !state.flags.knowsTruth },
        { text: "Gözlerini kapat, ışığa körlemesine yürü", to: "eyes_closed" },
        { text: "Kaseti bul ve kır", to: "break_tape" },
        { text: "Bağırıp yardım iste", to: "scream", danger: true, action: () => damage(1) },
      ],
    },

    scream: {
      bg: "bg_basement.png",
      text: "Bağırdın. Sesin duvarlarda yankılandı ve sekiz farklı ses aynı kelimeleri sana bir saniye gecikmeyle geri bağırdı. Koro seni sardı, kulakların çınlıyor.",
      onEnter: () => { noiseBurst(0.5, 0.3); glitch(); sfx.whisper(); },
      choices: [{ text: "Sus, çıkışı yeniden ara", to: "find_exit" }],
    },

    /* ================= YENİ BÖLÜM : RİTÜEL ODASI ================= */
    ritual_room: {
      subtitle: "BAND 3 — MÜHÜRLÜ ODA", osd: "PLAY &#9658;", bg: "bg_tapewall.png",
      sub: "Yüzlerce kaset. Sekiz mum. Ortada bir mühür.",
      text: "Mühürlü kapıyı açtın. İçeride duvarlar tavana kadar kasetle kaplı — yüzlerce “YAYIN”. Ortada, mumlarla çevrili bir mühür ve yerde sekiz eski televizyon, hepsi karlı. Her ekranda bir yüz sana bakıyor. Mührü etkisiz kılmak için önce duvardaki sembolleri doğru sırayla izlemelisin.",
      onEnter: () => { sfx.heart(); sfx.whisper(); setTimeout(trackingGlitch, 900); },
      prompt: "Ne yaparsın?",
      choices: [
        { text: "Sembol duvarını incele ve çöz", to: "symbol_wall" },
        { text: "Feneri mühre tut, karanlığı yak", to: "light_ritual" },
        { text: "Mührü tebeşirle boz", to: "break_seal", danger: true, if: () => has("tebesir") },
        { text: "Bir kaset al ve kaç", to: "steal_tape", danger: true },
      ],
    },

    symbol_wall: {
      subtitle: "MÜHÜR — SEMBOL DİZİSİ", osd: "PAUSE &#10073;&#10073;", bg: "bg_symbols.png",
      sub: "Göz, ok, hilal, haç. İkinci kaset sırayı söylemişti.",
      text: "Duvar tebeşir sembollerle dolu. Mührün etrafında dört sembol parlıyor. İkinci kasetteki fısıltı sırayı vermişti: önce gören GÖZ, sonra yükselen OK, sonra sönen HİLAL, en son çağıran HAÇ. Doğru sırayla dokun.",
      onEnter: () => { sfx.heart(); sfx.whisper(); },
      hint: "İPUCU: göz ▸ ok ▸ hilal ▸ haç",
      puzzle: puzzleSequence({
        symbols: ["✚", "☾", "👁", "↑"],
        answer: ["👁", "↑", "☾", "✚"],
        hint: "Sembollere sırayla dokun. TEMİZLE ile baştan başla.",
        onSolve: () => { give("muhur"); go("seal_open"); },
      }),
      choices: [
        { text: "Geri çekil", to: "ritual_room" },
      ],
    },

    seal_open: {
      bg: "bg_tapewall.png",
      sub: "Mühür açıldı. Sekiz kaset doğru sırayla oynatılmalı.",
      text: "Semboller tek tek yandı ve mühür çözüldü. Ama sekiz televizyon hâlâ karlı. Yerde beş numaralı kaset var — kayıp çocukların kaydı. Kurtuluş için onları doğru kronolojik sırayla oynatmalısın. Etiketlerdeki tarihler ipucu.",
      onEnter: () => { sfx.confirm(); setTimeout(trackingGlitch, 700); },
      prompt: "Son bulmaca: kasetleri sırala.",
      choices: [
        { text: "Kasetleri sırala ve oynat", to: "tape_order" },
        { text: "Fotoğrafı mühre yerleştir (kısa yol)", to: "free_all", if: () => has("fotograf") },
      ],
    },

    tape_order: {
      subtitle: "SON KAYIT — SIRALAMA", osd: "PLAY &#9658;", bg: "bg_tapes.png",
      sub: "Etiketlerdeki yıllara göre eskiden yeniye sırala.",
      text: "Beş kaset, karışık. Etiketlerinde yıllar var. Doğru kronolojik sıra sekizi serbest bırakacak.",
      onEnter: () => sfx.heart(),
      hint: "İPUCU: en eski yıldan en yeniye.",
      puzzle: puzzleOrder({
        tapes: [
          { n: 3, lbl: "'94" },
          { n: 1, lbl: "'88" },
          { n: 5, lbl: "'99" },
          { n: 2, lbl: "'91" },
          { n: 4, lbl: "'96" },
        ],
        answer: [1, 2, 3, 4, 5],
        hint: "Kasetlere dokunarak sıra numarası ver. OYNAT'a bas.",
        onSolve: () => go("mem_wall"),
      }),
      choices: [
        { text: "Vazgeç, mühre dön", to: "seal_open" },
      ],
    },

    mem_wall: {
      subtitle: "SON KAYIT — HAFIZA", osd: "PLAY &#9658;", bg: "bg_grid.png",
      sub: "Dokuz ekran sırayla yanıyor. Sekizi kurtarmak için hatırla.",
      text: "Kasetler doğru sırayla oynadı ve duvardaki dokuz televizyon canlandı. Ekranlarda “SENİ DUYUYORUM” yazıyor. Sekizi serbest bırakmak için ekranların yanış sırasını hatırlayıp tekrarlamalısın. Her tur bir isim, bir çocuk.",
      onEnter: () => { sfx.heart(); sfx.whisper(); },
      hint: "İZLE ▶ ile başlat. Yanan ekranları aynı sırayla tekrarla.",
      puzzle: puzzleMemory({
        rounds: 4,
        hint: "Kâbus modunda daha zorlu. Yanlışta bir can kaybedersin.",
        onSolve: () => go("free_all"),
      }),
      choices: [
        { text: "Çok zor — fotoğrafı mühre yerleştir (kısa yol)", to: "free_all", if: () => has("fotograf") },
      ],
    },

    break_seal: {
      cls: "death", title: "MÜHÜR KIRILDI", bg: "bg_tapewall.png",
      text: "Mührü tebeşirle çizip bozdun. Ama mühür onu içeride tutan şeydi — sekiz televizyon aynı anda söndü ve tek bir ekranda toplandı. Şimdi serbest ve aç. İlk seni buldu.",
      onEnter: () => jumpscare({ img: "jumpscare_face.png", duration: 1100 }),
      prompt: "— BÖLÜM SONU —",
      choices: [{ text: "Baştan al", to: "start", action: reset }],
    },

    steal_tape: {
      cls: "death", title: "SEN OLDUN", osd: "REC &#9679;", bg: "bg_tapewall.png",
      text: "Bir kaset kaptın, kaçtın. Yıllar sonra biri tavan arasında etiketsiz bir kaset buldu — üstünde tek kelime: İZLEME. Oynattı. Ekranda beliren yüz seninkiydi. Artık sen bekleyensin.",
      onEnter: () => { unlockEnding("become"); jumpscare({ img: "jumpscare_face.png", duration: 1100 }); },
      prompt: "— DÖNGÜ DEVAM EDİYOR —",
      choices: [{ text: "Yeniden başla", to: "start", action: reset }],
    },

    free_all: {
      cls: "win", title: "SEKİZİ SERBEST", bg: "bg_tapewall.png",
      sub: "Sekiz ekran birer birer karardı. Teşekkür ederek gittiler.",
      text: "Fotoğrafı mühre yerleştirdin. Sekiz televizyon birer birer aydınlandı, kazınmış yüzler geri geldi — sonra huzurla karardılar. Sekiz izleyen özgür kaldı; giderken tek tek sana teşekkür etti. Kaset duvarı toza döndü. Ama sen hâlâ evin içindesin ve tüm ışıklar söndü.",
      onEnter: () => { sfx.win(); glitch(); },
      prompt: "— GİZLİ SON —  (SEKİZİ SERBEST BIRAKTIN). Şimdi buradan çıkmalısın.",
      hint: "İyi işaretlerden birini açtın. Ama macera bitmedi — kaçış kaldı.",
      choices: [
        { text: "Zifiri karanlıkta çıkışı ara (fener gerekli)", to: "dark_room", if: () => has("fener") },
        { text: "Karanlıkta el yordamıyla ilerle", to: "dark_room", if: () => !has("fener") },
      ],
    },

    /* ================= BÖLÜM 4 : KAÇIŞ (KARANLIK + AYNA) ================= */
    dark_room: {
      subtitle: "BAND 4 — ZİFİRİ KARANLIK", osd: "PLAY &#9658;", bg: "bg_dark.png",
      sub: "Feneri gezdir. Karanlıkta çıkışı ve ipuçlarını ara.",
      text: has("fener")
        ? "Ev kör karanlık. Elinde fener var. Işığı ekranda gezdirerek üç şeyi bulmalısın: çıkış kapısı, bir ipucu ve saklanan şey. Işığı yavaşça dolaştır."
        : "Ev kör karanlık ve fenerin yok. El yordamıyla ilerlerken bir şeye çarpıyorsun; parmakların ıslak bir şeye değiyor. Işıksız bu karanlıkta uzun süre dayanamazsın.",
      onEnter: () => { sfx.heart(); sfx.whisper(); },
      hint: has("fener") ? "FENERİ FAREYLE/PARMAKLA GEZDİR — 3 nokta bul" : "Fener olmadan tehlikeli.",
      scan: has("fener") ? {
        spots: [
          { x: 78, y: 42, label: "▸ ÇIKIŞ KAPISI" },
          { x: 24, y: 58, label: "▸ DUVARDA YAZI: 'AYNAYA BAKMA'" },
          { x: 50, y: 72, label: "▸ ...bir şey kıpırdadı", scare: true },
        ],
        onComplete: () => go("mirror_room"),
      } : null,
      choices: has("fener") ? [] : [
        { text: "Karanlıkta ilerlemeye devam et", to: "mirror_room", action: () => damage(1) },
        { text: "Geri dön ve fener parçalarını birleştir", to: "free_all", if: () => has("fener_kirik") && has("pil") },
      ],
    },

    mirror_room: {
      subtitle: "BAND 4 — AYNA ODASI", osd: "PLAY &#9658;", bg: "bg_mirror.png",
      sub: "Çatlak aynada bir yazı: 'BEN DE GÖRDÜM'. Yansıman gecikiyor.",
      text: "Büyük, çatlak bir aynanın önündesin. Camda kanla yazılmış: “BEN DE GÖRDÜM”. Aynadaki yansıman senin hareketlerini bir saniye geç yapıyor — sanki kendi kararını veriyor. Kapıya giden yol aynanın arkasından geçiyor.",
      onEnter: () => { sfx.heart(); setTimeout(trackingGlitch, 800); },
      prompt: "Ne yaparsın?",
      choices: [
        { text: "Aynadaki yansımana dokun", to: "mirror_touch", danger: true },
        { text: "Aynayı tebeşirle işaretle / kır", to: "mirror_break", if: () => has("tebesir") },
        { text: "Aynaya bakmadan yanından geç", to: "front_door" },
        { text: "Yansımana sırtını dön ve bekle", to: "mirror_wait", danger: true, action: () => damage(1) },
      ],
    },

    mirror_wait: {
      bg: "bg_mirror.png",
      text: "Sırtını döndün. Camın soğukluğunu ensende hissettin. Yansıman aynadan çıkmaya çalışıyor; nefesi buğulanıyor. Ama sen dönmedin, dönmedin, dönmedin… ve o geri çekildi. Yol açıldı.",
      onEnter: () => { sfx.whisper(); glitch(); },
      choices: [{ text: "Kapıya koş", to: "front_door" }],
    },

    mirror_touch: {
      cls: "death", title: "AYNA SENİ ALDI", osd: "NO SIGNAL", bg: "bg_mirror.png",
      text: "Parmakların cama değdi. Yansıman gülümsedi — sen gülümsemedin. Seni içeri çekti; şimdi camın öbür tarafındasın, dışarıdaki kendine bakıyorsun. O gidiyor, sen kalıyorsun.",
      onEnter: () => jumpscare({ img: "jumpscare_face.png", duration: 1100 }),
      prompt: "— BÖLÜM SONU —",
      choices: [{ text: "Baştan al", to: "start", action: reset }],
    },

    mirror_break: {
      bg: "bg_mirror.png",
      sub: "Aynayı kırdın. Ama gerçek olan hangisiydi?",
      text: "Tebeşiri değil, yumruğunu kullandın. Ayna bin parçaya bölündü ve her parçada bir yüzün var — sekizi mutlu, biri çığlık atıyor. Kırıkların arasından geçtin. Cebinde bir cam parçası: içinde senin gerçek yansıman, huzurlu.",
      onEnter: () => { noiseBurst(0.5, 0.35); glitch(); state.flags.brokeMirror = true; },
      prompt: "Cam parçasını sakladın.",
      choices: [
        { text: "Ön kapıya git", to: "front_door" },
      ],
    },

    front_door: {
      subtitle: "BAND 4 — ÖN KAPI", osd: "PLAY &#9658;", bg: "bg_frontdoor.png",
      sub: "Ön kapı. Dışarıda gerçek gün ışığı. Zincir ve sürgü.",
      text: "Ön kapıdasın. Camdan dışarı süzülen gerçek gün ışığı. Zincir takılı, sürgü çekili. Arkanda kasetin uğultusu, teybin tıkırtısı, kendi sesin: “Gitme.” Kapıyı açmak için sürgüyü ve zinciri çözmelisin.",
      onEnter: () => sfx.heart(),
      hint: "Neredeyse çıktın. Son bir karar.",
      choices: [
        { text: "Sürgüyü çöz, kapıyı aç ve çık", to: () => (state.flags.brokeMirror ? "mirror_true" : "escape_door") },
        { text: "Kaseti de yanına al", to: "steal_tape", danger: true },
        { text: "Son bir kez arkana bak", to: "look_behind", danger: true },
      ],
    },

    escape_door: {
      cls: "win", title: "DIŞARI", bg: "bg_frontdoor.png",
      sub: "Kapı açıldı. Gün ışığı yüzüne vurdu. Kaçtın.",
      text: "Sürgü geri çekildi, zincir düştü, kapı ardına kadar açıldı. Gün ışığı seni yuttu. Arkana bakmadan koştun. Ev, kaset, o ses — hepsi geride kaldı. Özgürsün. Ama bazı geceler, uzaktan bir teybin tıkırtısını hâlâ duyuyorsun.",
      onEnter: () => { sfx.win(); if (humNode) humNode.gain.gain.value = 0; },
      prompt: "— SON —  (KAÇIŞ: ÖN KAPIDAN)",
      choices: [{ text: "Baştan oyna", to: "start", action: reset }],
    },

    mirror_true: {
      cls: "win", title: "GERÇEK SEN", bg: "bg_frontdoor.png",
      sub: "Cam parçasındaki gerçek yansımanla dışarı çıktın.",
      text: "Kapı açıldı. Cebindeki cam parçasında gerçek yansıman — huzurlu, bütün, senin. Dışarı çıktığında gölgen tam arkanda, olması gerektiği yerde. Döngüyü sadece kırmadın; onu ait olduğu yere, camın ardına hapsettin. Sekizi özgür, sen özgür. Kaset bir daha asla oynamayacak.",
      onEnter: () => { sfx.win(); glitch(); if (humNode) humNode.gain.gain.value = 0; },
      prompt: "— EN İYİ SON —  (AYNADAKİ GERÇEK SEN)",
      choices: [{ text: "Baştan oyna", to: "start", action: reset }],
    },

    /* ================= FİNALLER ================= */
    light_ritual: {
      cls: "win", title: "IŞIK", bg: "bg_basement.png",
      vo: "vo_win.mp3", entity: true,
      sub: "O şey ışıkta çığlık attı — sonra tek bir sesle: seninkiyle.",
      text: "Feneri karanlığın kalbine tuttun. O şey ışıkta çığlık attı — sekiz sesle birden, sonra tek bir sesle: seninkiyle. Duvardaki çentikler birer birer silindi. Bant eriyip aktı.",
      onEnter: () => { sfx.win(); glitch(); if (humNode) humNode.gain.gain.value = 0; },
      prompt: "— GERÇEK SON —  (DÖNGÜ KIRILDI)",
      choices: [{ text: "Baştan oyna", to: "start", action: reset }],
    },

    eyes_closed: {
      bg: "bg_basement.png",
      text: "Gözlerini kapadın. Basamakları saymadın, ışığı düşünmedin — sadece yürüdün. Fısıltılar, nefesler, kendi adın… hiçbirinde durmadın. Sonra yüzüne gerçek bir gün ışığı vurdu.",
      onEnter: () => { tone(523, 0.4, "triangle", 0.08); setTimeout(() => tone(784, 0.4, "triangle", 0.08), 250); },
      prompt: "Gözlerini açacak mısın?",
      choices: [
        { text: "Gözlerini aç", to: "check_win" },
        { text: "Kapalı tut, dışarı ulaşana dek", to: "check_win" },
      ],
    },

    break_tape: {
      bg: "bg_basement.png",
      text: "Kaseti iki elinle kavradın. Bant çığlık atar gibi bir ses çıkardı, ekran senin yüzünle doldu ve senin sesinle “YAPMA” diye yalvardı. Yine de kırdın. Manyetik bant her yere savruldu.",
      onEnter: () => { glitch(); noiseBurst(0.6, 0.4); tone(1400, 0.4, "sawtooth", 0.15, 60); },
      prompt: "…",
      choices: [{ text: "Sonucu gör", to: "check_win" }],
    },

    check_win: {
      bg: null, text: "",
      onEnter: () => {
        setTimeout(() => {
          if (state.flags.knowsTruth && state.sanity >= 2) go("light_ritual");
          else if (state.sanity >= 3) go("win_true");
          else go("win_scarred");
        }, 60);
      },
      choices: [],
    },

    win_true: {
      cls: "win", title: "YAYIN KESİLDİ", bg: "bg_tv.png",
      text: "Ekran karlandı, sonra karardı. Oynatıcı kaseti dışarı tükürdü — artık bomboş bir plastik kabuk. Odan sessiz, pencereden gerçek sabah giriyor. Sekizinci çentik son çentik oldu. Döngüyü kırdın.",
      onEnter: () => { sfx.win(); if (humNode) humNode.gain.gain.value = 0; },
      prompt: "— İYİ SON —",
      choices: [{ text: "Baştan oyna", to: "start", action: reset }],
    },

    win_scarred: {
      cls: "ending", title: "SESSİZLİK", bg: "bg_tv.png",
      text: "Döngüyü kırdın… ama bir parçan içeride kaldı. Bazen televizyon kendiliğinden açılıyor, karlı ekranda bir siluet sana el sallıyor. Kurtuldun, ama tam olarak değil. Bir daha asla etiketsiz kaset açmayacaksın.",
      onEnter: () => { tone(220, 0.6, "sine", 0.08); setTimeout(trackingGlitch, 700); },
      prompt: "— YARIM KURTULUŞ —",
      choices: [{ text: "Baştan oyna", to: "start", action: reset }],
    },

    death_sanity: {
      cls: "death", title: "AKLINI KAYBETTİN", osd: "NO SIGNAL", bg: "bg_static.png",
      vo: "vo_gameover.mp3",
      sub: "Şimdi sadece bir sinyalsin.",
      text: "Korku çok fazlaydı. Zihnin kasetin gürültüsüne karıştı, düşüncelerin karlandı. Şimdi sadece bir sinyalsin — bir sonraki izleyeni bekleyen karıncalı bir görüntü.",
      onEnter: () => jumpscare({ img: "jumpscare_face.png", duration: 1000 }),
      prompt: "— OYUN BİTTİ —",
      choices: [{ text: "Kaseti baştan al", to: "start", action: reset }],
    },
  };

  function reset() {
    state = freshState();
    tapeSecs = 0; setBg(null); stopVO(); setIntensity(0);
    if (humNode) humNode.gain.gain.value = 0.035;
  }

  /* =====================================================================
     ÇANTA / EŞYA BİRLEŞTİRME
     ===================================================================== */
  const bagModal = $("#bag-modal"), bagGrid = $("#bag-grid"), bagMsg = $("#bag-msg");
  let bagSel = [];
  function openBag() {
    bagSel = []; bagMsg.textContent = ""; bagMsg.className = "bag-msg";
    renderBag(); bagModal.classList.add("show"); sfx.select();
  }
  function closeBag() { bagModal.classList.remove("show"); }
  function renderBag() {
    if (!state.inv.length) { bagGrid.innerHTML = '<div class="bag-empty">Çantan boş.</div>'; return; }
    bagGrid.innerHTML = "";
    state.inv.forEach((it) => {
      const d = document.createElement("div");
      d.className = "bag-item" + (bagSel.includes(it) ? " sel" : "");
      d.innerHTML = `<span class="ic">${ITEM_ICON[it] || "▪"}</span><span class="nm">${ITEM_NAMES[it] || it}</span>`;
      d.onclick = () => {
        if (bagSel.includes(it)) bagSel = bagSel.filter((x) => x !== it);
        else { bagSel.push(it); if (bagSel.length > 2) bagSel.shift(); }
        sfx.select(); renderBag();
      };
      bagGrid.appendChild(d);
    });
  }
  function combine() {
    if (bagSel.length !== 2) { bagMsg.textContent = "İki eşya seçmelisin."; bagMsg.className = "bag-msg err"; return; }
    const r = tryCombine(bagSel[0], bagSel[1]);
    if (r) {
      take(r.a); take(r.b); give(r.out);
      bagMsg.textContent = r.msg; bagMsg.className = "bag-msg";
      sfx.confirm(); tone(880, 0.3, "triangle", 0.09);
      bagSel = []; renderBag(); renderHUD();
    } else {
      bagMsg.textContent = "Bu ikisi birleşmiyor.";
      bagMsg.className = "bag-msg err"; sfx.bad();
    }
  }
  $("#bag-btn").onclick = openBag;
  $("#bag-close").onclick = () => { closeBag(); sfx.select(); };
  $("#bag-combine").onclick = combine;
  bagModal.onclick = (e) => { if (e.target === bagModal) closeBag(); };

  /* ---------- kontroller ---------- */
  $("#mute-btn").onclick = () => {
    muted = !muted;
    $("#mute-btn").innerHTML = muted ? "&#128263; SESSİZ" : "&#128266; SES";
    $("#mute-btn").classList.toggle("off", muted);
    if (humNode) humNode.gain.gain.value = muted ? 0 : 0.035;
    if (droneNode) droneNode.gain.gain.value = muted ? 0 : 0.012;
    setMusicVol();
  };
  const musicBtn = $("#music-btn");
  function updateMusicBtn() { musicBtn.classList.toggle("off", !music.on); musicBtn.innerHTML = music.on ? "&#127925; MÜZİK" : "&#127925; MÜZİK KAPALI"; }
  musicBtn.onclick = () => { music.on = !music.on; save.musicOn = music.on; persist(); setMusicVol(); updateMusicBtn(); sfx.select(); };
  updateMusicBtn();
  const voBtn = $("#vo-btn");
  function updateVoBtn() { voBtn.classList.toggle("off", !voOn); voBtn.innerHTML = voOn ? "&#127908; SESLENDİRME" : "&#127908; SESLENDİRME KAPALI"; }
  voBtn.onclick = () => { voOn = !voOn; save.voOn = voOn; persist(); if (!voOn) stopVO(); updateVoBtn(); sfx.select(); };
  updateVoBtn();
  $("#restart-btn").onclick = () => { sfx.confirm(); reset(); go("start"); };

  /* ---------- klavye ---------- */
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") { closeBag(); return; }
    if ((e.key === "b" || e.key === "B") && !bagModal.classList.contains("show")) { openBag(); return; }
    const choices = [...document.querySelectorAll(".choice")];
    if (e.key >= "1" && e.key <= "9") {
      const b = choices.find((c) => c.dataset.key === e.key);
      if (b) b.click();
    }
  });

  /* ---------- ortam gerilimi ---------- */
  setInterval(() => {
    if (Math.random() < 0.28) trackingGlitch();
    if (Math.random() < 0.14 && actx && !muted) { Math.random() < 0.5 ? sfx.heart() : sfx.whisper(); }
  }, 8500);

  /* ---------- boot ---------- */
  setTimeout(() => crt.classList.remove("booting"), 1700);
  drawStatic();
  go("start");
  document.addEventListener("click", audioInit, { once: true });
})();
