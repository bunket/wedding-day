/* ══════════════════════════════════════════════════════════
   Илес тойы — бет логикасы.
   Деректерді осы CONFIG блогынан өзгертіңіз.
   ══════════════════════════════════════════════════════════ */

const CONFIG = {

  /* ─── Жас жұбайлар ─── */
  couple: { a: "Бекарыс", b: "Айгерім" },

  /* ─── Той ─── */
  event: {
    tag: "Wedding day",
    year: 2027,
    monthIndex: 0,        // 0 = қаңтар
    day: 3,
    hour: 18,
    minute: 0,
    tzOffset: 5,          // Мāңғыстау — UTC+5
    until: false,          // true → «06:00-ға дейін»
  },

  /* ─── Той иелері ───
     Әр жол — бір жұп: «ата - ана». Бос орын қалдырсаңыз көрсетілмейді. */
  hosts: [
    { left: "(Илес)", right: "Оразгуль" },
    { left: "Жақсымұрат", right: "Алина" },
  ],
  hostsNote: "",

  /* ─── Мекенжай ─── */
  venue: {
    name: "Assyl Grant",
    city: "Ақтау қаласы",
    line: "24-квартал, 43/4",
    query: "Assyl Grant, 24-й квартал 43/4, Актау",
  },

  /* ─── Telegram ───
     ЕСКЕРТУ: токен осы файлда ашық жатыр — беттің кодын ашқан адам
     көреді. Жасыру үшін прокси сервер керек.
     chats: [1-адам, 2-адам] chat_id-лері. Бос болса — мәтін көшіріледі. */
  telegram: { token: "9013685554:AAGGdUn-TVWKg8PIEGyxSATiDGUVdih92Ik", chats: ["6715191374", "6715191374"] },

  /* ─── Сөздік ─── */
  words: {
    months: ["Қаңтар","Ақпан","Наурыз","Сәуір","Мамыр","Маусым",
             "Шілде","Тамыз","Қыркүйек","Қазан","Қараша","Желтоқсан"],
    weekdays: ["Дс","Сс","Ср","Бс","Жм","Сн","Жс"],
    answers: { yes: "Иә, әрине", pair: "Жұбайыммен келемін",
               family: "Отбасымен келемін", no: "Келе алмаймын" },
    needName: "Аты-жөніңізді жазыңыз.",
    saved:   "Рақмет! Жауабыңыз жіберілді.",
    sending: "Жіберіліп тұр…",
    sendFail:"Жіберу мүмкін болмады — мәтінді көшіріп жіберіңіз.",
    copied:  "Хабарлама буферге көшірілді.",
    noWish:  "Алдымен тілегіңізді жазыңыз.",
    wishOk:  "Тілегіңіз қосылды. Рақмет!",
  },
};

const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const pad = n => String(n).padStart(2, "0");
const { words: W, event: E } = CONFIG;

/* Тағайындалған сәт — уақыт белдеуіне тәуелсіз */
const EVENT_ISO = (() => {
  const mins = E.hour * 60 + E.minute - E.tzOffset * 60;
  return new Date(Date.UTC(E.year, E.monthIndex, E.day, 0, mins)).toISOString();
})();
const EVENT_DATE = new Date(EVENT_ISO);

const timeText = () =>
  E.until ? `18:00-ға дейін`
          : `18:00-ға дейін`;

/* ═════════ Мәтіндерді орнату ═════════ */
function paint () {
  const v = CONFIG.venue;

  $("#heroTag").textContent = E.tag;
  $("#footNames").innerHTML = `${CONFIG.couple.a} &amp; ${CONFIG.couple.b}`;

  const monthLow = W.months[E.monthIndex].toLowerCase();
  $("#inviteDate").textContent = `${E.day} ${monthLow}да`;
  $("#bigDate").textContent    = `${E.day} ${monthLow} ${E.year}`;
  $("#bigTime").textContent    = timeText();
  $("#footDate").textContent   = `${pad(E.day)} · ${pad(E.monthIndex + 1)} · ${E.year}`;

  $("#addrCity").textContent  = v.city;
  $("#addrLine").textContent  = v.line;
  $("#addrVenue").textContent = `«${v.name}»`;

  const q = encodeURIComponent(v.query);
  $("#mapBtn").href = `https://2gis.kz/aktau/search/${q}`;

  $("#hostsPairs").innerHTML = CONFIG.hosts
    .filter(h => h.left || h.right)
    .map(h => `<p class="hosts__pair">${h.left || "—"}<em>-</em>${h.right || "—"}</p>`)
    .join("");

  if (CONFIG.hostsNote) $("#hostsNote").textContent = `(${CONFIG.hostsNote})`;

  document.title = `${E.tag} · ${CONFIG.couple.a} мен ${CONFIG.couple.b}`;
}

/* ═════════ Күн тақтшасы ═════════ */
const HEART_PATH =
  "M16 26.4S2.7 18.6 2.7 9.9C2.7 5.6 6 2.5 9.5 2.5c2.8 0 5.1 1.6 6.5 4.1 1.4-2.5 3.7-4.1 6.5-4.1 3.5 0 6.8 3.1 6.8 7.4 0 8.7-13.3 16.5-13.3 16.5Z";

function buildCalendar () {
  $("#calHead").innerHTML = W.weekdays.map(d => `<span>${d}</span>`).join("");

  const first  = new Date(E.year, E.monthIndex, 1);
  const lead   = (first.getDay() + 6) % 7;              // дүйсенбіден бастау
  const days   = new Date(E.year, E.monthIndex + 1, 0).getDate();

  const cell = d => d === E.day
    ? `<span class="cal__d cal__d--day" aria-label="${E.day} ${W.months[E.monthIndex]} ${E.year} — той күні">
         <svg class="cal__heart" viewBox="0 0 32 29" aria-hidden="true"><path d="${HEART_PATH}"/></svg><span>${d}</span></span>`
    : `<span class="cal__d">${d}</span>`;

  let html = "";
  for (let i = 0; i < lead; i++) html += `<span class="cal__d cal__d--off"></span>`;
  for (let d = 1; d <= days; d++) html += cell(d);

  $("#calGrid").innerHTML = html;
}

/* ═════════ Кері саналу ═════════ */
function startClock () {
  const out = { d: $("#cdD"), h: $("#cdH"), m: $("#cdM"), s: $("#cdS") };
  const tick = () => {
    const sec = Math.max(0, Math.floor((EVENT_DATE - Date.now()) / 1000));
    out.d.textContent = pad(Math.floor(sec / 86400));
    out.h.textContent = pad(Math.floor(sec % 86400 / 3600));
    out.m.textContent = pad(Math.floor(sec % 3600 / 60));
    out.s.textContent = pad(sec % 60);
  };
  tick();
  setInterval(tick, 1000);
}

/* ═════════ Сақтау ═════════ */
const read  = k => { try { return JSON.parse(localStorage.getItem("iles." + k)); } catch { return null; } };
const save  = (k, v) => { try { localStorage.setItem("iles." + k, JSON.stringify(v)); } catch {} };
const esc   = s => String(s).replace(/[&<>"']/g, c =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

/* ═════════ Telegram-ға тікелей ═════════ */
const TG_API = "https://api.telegram.org/bot";
const tgEsc  = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const tgCut  = (s, n) => String(s).replace(/\s+/g, " ").trim().slice(0, n);

function tgText (p) {
  const when = new Date().toLocaleString("ru-RU", { timeZone: "Asia/Aqtau" });

  if (p.type === "anketa") {
    return `🎉 <b>Анкета жауабы</b>\n\n` +
      `Аты-жөні: <b>${tgEsc(tgCut(p.name, 120))}</b>\n` +
      `Жауабы: ${tgEsc(W.answers[p.come] || p.come)}\n` +
      `Уақыты: ${tgEsc(when)}`;
  }
  if (p.type === "wish") {
    return `💐 <b>Жаңа тілек</b>\n\n` +
      `Аты-жөні: <b>${tgEsc(tgCut(p.name || "Аноним", 120))}</b>\n` +
      `Тілегі: ${tgEsc(String(p.text).trim().slice(0, 600))}\n\n` +
      `Уақыты: ${tgEsc(when)}`;
  }
  return "";
}

const tgOn = () => !!CONFIG.telegram.token && (CONFIG.telegram.chats || []).filter(Boolean).length > 0;

async function sendToBot (payload) {
  const { token } = CONFIG.telegram;
  const chats = (CONFIG.telegram.chats || []).filter(Boolean);
  if (!tgOn()) return false;

  /* spam-тор жасырын өрісті толтырса — ештеңе жібермейміз, бірақ
     «сәтті» деп көрсетеміз, сонда олар тексерісті білмейді */
  if (payload.website) return true;

  const text = tgText(payload);
  if (!text) return false;

  /* form-urlencoded — Telegram-дың CORS-ы JSON preflight-ке 501 береді,
     ал осы түрі тікелей өтеді */
  const res = await Promise.all(chats.map(chat_id => {
    const p = new URLSearchParams({
      chat_id, text, parse_mode: "HTML", disable_web_page_preview: "true",
    });
    return fetch(`${TG_API}${token}/sendMessage`, { method: "POST", body: p })
      .then(r => r.json()).catch(() => ({}));
  }));
  return res.some(j => j && j.ok);
}

/* ═════════ Анкета ═════════ */
function wireForm () {
  const saved = read("anketa");
  if (saved) {
    $("#qName").value = saved.name || "";
    const r = $(`.opt input[value="${saved.come}"]`);
    if (r) { r.checked = true; }
  }

  $("#form").addEventListener("submit", async ev => {
    ev.preventDefault();
    const name = $("#qName").value.trim();
    const msg  = $("#msg");
    msg.classList.remove("is-err");

    if (!name) { msg.textContent = W.needName; msg.classList.add("is-err"); $("#qName").focus(); return; }

    const come = ($(".opt input:checked") || {}).value || "yes";
    const data = { name, come, at: new Date().toISOString() };
    save("anketa", data);

    const text =
      `${E.tag} — анкета жауабы\n\n` +
      `Аты-жөні: ${data.name}\n` +
      `Жауабы: ${W.answers[data.come]}\n`;

    const btn = $("#form .send");
    btn.disabled = true;
    msg.textContent = W.sending;

    const ok = await sendToBot({
      type: "anketa", name: data.name, come: data.come,
      website: $("#qWebsite").value,
    });
    btn.disabled = false;

    if (ok) { msg.textContent = W.saved; return; }
    if (tgOn()) toast(W.sendFail);

    try {
      await navigator.clipboard.writeText(text);
      msg.textContent = W.copied;
    } catch {
      $("#copyText").value = text;
      $("#copybox").hidden = false;
      $("#copyText").select();
      msg.textContent = "Төмендегі мәтінді көшіріп жіберіңіз.";
    }
  });
}

/* ═════════ Тілектер ═════════ */
function renderWishes () {
  const list = read("wishes") || [];
  $("#wishList").innerHTML = list
    .map(w => `<li><p class="who">${esc(w.who)}</p><p class="txt">${esc(w.text)}</p></li>`)
    .join("");
}

function wireWishes () {
  const btn = $("#wishBtn"), form = $("#wishForm");

  btn.addEventListener("click", () => {
    form.hidden = !form.hidden;
    if (form.hidden) return;
    form.scrollIntoView({ behavior: "smooth", block: "center" });
    $("#wWho").focus({ preventScroll: true });
  });

  form.addEventListener("submit", async ev => {
    ev.preventDefault();
    const text = $("#wText").value.trim();
    if (!text) { toast(W.noWish); $("#wText").focus(); return; }

    const who = $("#wWho").value.trim() || "Аноним";
    const btn = $("#wishForm .send");
    btn.disabled = true;
    const ok = await sendToBot({ type: "wish", name: who, text, website: $("#wWebsite").value });
    btn.disabled = false;

    const list = read("wishes") || [];
    list.unshift({ who, text, at: new Date().toISOString() });
    save("wishes", list.slice(0, 40));

    $("#wText").value = "";
    form.hidden = true;
    renderWishes();
    toast(ok || !tgOn() ? W.wishOk : W.sendFail);
  });
}

/* ═════════ Музыка ═════════ */
/* assets/music.mp3 қойылса — сол ойнайды; болмаса WebAudio-мен
   өзгенің әнін қолданбай, жеңил әуен жасалады. */
let synth = null, playing = false;

function makeSynth () {
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) return null;
  const ctx = new Ctx();
  const bus = ctx.createGain();
  bus.gain.value = 0;
  bus.connect(ctx.destination);

  const line = [392, 523.25, 659.25, 587.33, 523.25, 392, 440, 329.63];
  let i = 0, timer = null;

  const note = f => {
    const t = ctx.currentTime;
    [1, 2.004].forEach((h, k) => {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = k ? "triangle" : "sine";
      o.frequency.value = f * h;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(k ? .04 : .13, t + .03);
      g.gain.exponentialRampToValueAtTime(.0006, t + 2.4);
      o.connect(g).connect(bus);
      o.start(t); o.stop(t + 2.5);
    });
  };

  const ramp = to => {
    bus.gain.cancelScheduledValues(ctx.currentTime);
    bus.gain.setValueAtTime(bus.gain.value, ctx.currentTime);
    bus.gain.linearRampToValueAtTime(to, ctx.currentTime + 1.2);
  };

  return {
    play () { ctx.resume(); ramp(.55); timer = setInterval(() => note(line[i++ % line.length]), 1400); },
    stop () { clearInterval(timer); ramp(0); },
  };
}

function wireMusic () {
  const btn = $("#playBtn"), audio = $("#bgm");

  btn.addEventListener("click", () => {
    playing = !playing;
    btn.setAttribute("aria-pressed", String(playing));

    if (!playing) { synth ? synth.stop() : audio.pause(); return; }

    if (synth) { synth.play(); return; }
    audio.volume = .5;
    const p = audio.play();
    if (p?.catch) p.catch(() => { (synth = synth || makeSynth())?.play(); });
  });
}

/* ═════════ Toast ═════════ */
let tt;
function toast (m) {
  const el = $("#toast");
  el.textContent = m;
  el.classList.add("is-on");
  clearTimeout(tt);
  tt = setTimeout(() => el.classList.remove("is-on"), 3200);
}

/* ═════════ Реveal ═════════ */
function wireReveal () {
  const targets = $$(".wrap, .etch-frame, .split");
  targets.forEach(t => t.classList.add("reveal"));
  const io = new IntersectionObserver(es => {
    es.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add("is-in");
      io.unobserve(e.target);
    });
  }, { threshold: .12, rootMargin: "0px 0px -6% 0px" });
  targets.forEach(t => io.observe(t));
}

/* ═════════ Атауларды экранға сыйғызу ═════════
   Қазақ есімдері ұлғайып, бір сөз болып сыныққа бөлінбейді —
   сондықтан өлшеп, сыйғанша кішірейтеміз. */
function fitNames () {
  const names = $$(".hero__name");
  const limit = $("#hero").clientWidth - 32;

  names.forEach(el => {
    el.style.fontSize = "";
    let size = parseFloat(getComputedStyle(el).fontSize);
    while (el.scrollWidth > limit && size > 18) {
      size *= .94;
      el.style.fontSize = size + "px";
    }
  });
}

/* ═════════ Атауларды орнату ═════════ */
function setNames () {
  $("#nameA").textContent = CONFIG.couple.a;
  $("#nameB").textContent = CONFIG.couple.b;
  fitNames();
}

/* ═════════ Басталу ═════════ */
document.addEventListener("DOMContentLoaded", () => {
  paint();
  setNames();
  buildCalendar();
  startClock();
  wireForm();
  wireWishes();
  wireMusic();
  renderWishes();
  wireReveal();
});

window.addEventListener("resize", fitNames);
