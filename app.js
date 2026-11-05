(function(){
"use strict";
const PWA = window.TED_PLATFORM === "pwa";
const APP_VER = window.TED_VERSION || "1.1.0";
const PWA_URL = window.TED_PWA_URL || "";
const D = window.TED_DATA || JSON.parse(document.getElementById("data").textContent);
const ARTS = D.articles, LEX = D.lex, OCC = D.occ;
const AMAP = {}; ARTS.forEach((a, i) => { a.idx = i; AMAP[a.id] = a; });
const CATS = ["科技", "历史", "哲学", "人生感悟", "理财之道", "养生", "旅游"];
const CATCOL = { "科技": ["#2B6A8F", "#4FA3A5"], "历史": ["#8A5A2B", "#C9925A"], "哲学": ["#4E4A8C", "#8C7FD0"], "人生感悟": ["#A0475E", "#E08A8A"], "理财之道": ["#2E7A4F", "#9AC46A"], "养生": ["#2F7F7A", "#7CCBB5"], "旅游": ["#B0662A", "#E8B44E"] };
const CATGLYPH = { "科技": "科", "历史": "史", "哲学": "哲", "人生感悟": "悟", "理财之道": "财", "养生": "养", "旅游": "旅" };
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const DAY = 864e5;
const dkey = d => d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
const parseD = s => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); };
const todayK = () => dkey(new Date());
const addDays = (k, n) => { const d = parseD(k); d.setDate(d.getDate() + n); return dkey(d); };
const diffDays = (a, b) => Math.round((parseD(b) - parseD(a)) / DAY);
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const pick = a => a[Math.floor(Math.random() * a.length)];
const WK = ["日", "一", "二", "三", "四", "五", "六"];

/* ---------- icons ---------- */
const I = {
  sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
  book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M12 6c-2-1.5-5-2-8-1.5v14c3-.5 6 0 8 1.5 2-1.5 5-2 8-1.5v-14c-3-.5-6 0-8 1.5z"/><path d="M12 6v14"/></svg>',
  lib: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><rect x="3" y="4" width="4" height="16" rx="1"/><rect x="9" y="4" width="4" height="16" rx="1"/><path d="M15.5 5.2l3.8-1 3 15.4-3.8 1z"/></svg>',
  mem: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><rect x="4" y="6" width="13" height="15" rx="2"/><path d="M8 3h10a2 2 0 0 1 2 2v12"/><path d="M8 12h5M8 16h3"/></svg>',
  exam: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V3h6v1"/><path d="M8.5 12.5l2 2 4-4.5"/></svg>',
  ear: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect x="3" y="14" width="4" height="6" rx="1.5"/><rect x="17" y="14" width="4" height="6" rx="1.5"/></svg>',
  trophy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M7 6H4a3 3 0 0 0 3 4M17 6h3a3 3 0 0 1-3 4M12 14v3M8 21h8M9 17h6v4H9z"/></svg>',
  out: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12M7 10l5 5 5-5"/><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/></svg>',
  gear: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>',
  down: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>',
  screen: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><rect x="2" y="4" width="14" height="11" rx="1.5"/><path d="M6 19h6M9 15v4"/><rect x="17" y="8" width="5" height="12" rx="1.2"/></svg>',
  play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13a1 1 0 0 0 1.5.9l10-6.5a1 1 0 0 0 0-1.7l-10-6.5A1 1 0 0 0 8 5.5z"/></svg>',
  pause: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4.5" height="14" rx="1"/><rect x="13.5" y="5" width="4.5" height="14" rx="1"/></svg>',
  stop: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>',
  vol: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 10v4h4l5 4V6L8 10z"/><path d="M16.5 8.5a5 5 0 0 1 0 7"/></svg>',
  mic: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg>',
  x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  spark: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8z"/></svg>',
  calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>',
  flag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M5 21V4M5 4h12l-2 4 2 4H5"/></svg>',
  swap: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 7h12l-3-3M17 17H5l3 3"/></svg>',
  gift: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><rect x="3" y="9" width="18" height="12" rx="1.5"/><path d="M3 13h18M12 9v12M12 9c-1-3-5-4-5-1.5S10 9 12 9zm0 0c1-3 5-4 5-1.5S14 9 12 9z"/></svg>',
};
const flameSVG = '<svg class="flame" viewBox="0 0 64 64"><defs><linearGradient id="fg" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#E4572E"/><stop offset=".6" stop-color="#F3A33B"/><stop offset="1" stop-color="#FFD66B"/></linearGradient></defs><path d="M32 6c3 10 14 15 14 30a14 14 0 0 1-28 0c0-8 4-12 7-16 0 6 3 9 6 9-3-8 0-16 1-23z" fill="url(#fg)"/></svg>';

/* ---------- nav model ---------- */
const NAV = [
  { v: "home", n: "本周精读", ic: "sun", subs: [["本周推送", "s-push"], ["下周主题", "s-next"], ["学习规则", "s-rules"]] },
  { v: "read", n: "精读阅读", ic: "book", subs: [["英文原文", "m-en"], ["中英对照", "m-bi"], ["中文全文", "m-zh"]] },
  { v: "lib", n: "资源库", ic: "lib", subs: CATS.map(c => [c, "c-" + c]) },
  { v: "mem", n: "记忆库", ic: "mem", subs: [["单词", "s-words"], ["句子", "s-sents"], ["闪卡复习", "s-flash"]] },
  { v: "exam", n: "考试", ic: "exam", subs: [["本周考试", "s-week"], ["随时练习", "s-prac"], ["终极考试", "s-final"], ["成绩记录", "s-hist"]] },
  { v: "practice", n: "听说练习", ic: "ear", subs: [["听力通读", "s-listen"], ["口语跟读", "s-speak"]] },
  { v: "reward", n: "成就奖励", ic: "trophy", subs: [["等级与连续", "s-level"], ["主题卡收藏", "s-cards"], ["徽章", "s-badges"]] },
  { v: "export", n: "导出", ic: "out", subs: [["导出 PDF", "s-pdf"], ["导出 Excel", "s-xlsx"]] },
  { v: "prefs", n: "设置", ic: "gear", subs: [] },
];
const NAVMAP = Object.fromEntries(NAV.map((n, i) => [n.v, Object.assign(n, { no: i + 1 })]));

/* ---------- state & storage ---------- */
function freshState() {
  const t = todayK();
  return { v: 1, ts: 0, cur: { art: "ai-nature", weekStart: t, ext: 0, bonus: false }, nextTopic: null, prog: {}, done: [], abandoned: [], days: [], xp: 0, coins: 0, badges: [], cards: {}, exams: [], final: null, stats: { listen: 0, speak: 0 },
    set: { fs: 18, skin: "auto", voice: "us", rate: 0.92, font: "yahei", motion: true } };
}
let S = freshState(), VOC = {}, SEN = {}, AIC = {};
const LS = { get(k) { try { return JSON.parse(localStorage.getItem("tedjd:" + k)); } catch (e) { return null; } }, set(k, v) { try { localStorage.setItem("tedjd:" + k, JSON.stringify(v)); } catch (e) {} } };
const Cloud = { db: null, base: null, sample: null, downloads: null, user: null, name: "", ready: false };
const safeId = k => k.toLowerCase().replace(/[^a-z0-9]+/g, "_").slice(0, 80) + "_" + (k.length % 97);
let saveT = null;
function save() {
  S.ts = Date.now(); LS.set("state", S);
  clearTimeout(saveT);
  saveT = setTimeout(() => { if (Cloud.db) Cloud.db.doc(Cloud.base + "/state/main").set(JSON.parse(JSON.stringify(S))).catch(() => {}); }, 800);
}
function putVoc(key) { LS.set("voc", VOC); if (Cloud.db) Cloud.db.doc(Cloud.base + "/vocab/" + safeId(key)).set(VOC[key]).catch(() => {}); }
function putSen(id) { LS.set("sen", SEN); if (Cloud.db) Cloud.db.doc(Cloud.base + "/sents/" + id).set(SEN[id]).catch(() => {}); }
function putAI(id) { LS.set("ai", AIC); if (Cloud.db) Cloud.db.doc(Cloud.base + "/ai/" + id).set({ v: AIC[id] }).catch(() => {}); }
function loadLocal() {
  const s = LS.get("state"); if (s && s.v === 1) S = Object.assign(freshState(), s, { set: Object.assign(freshState().set, s.set || {}) });
  VOC = LS.get("voc") || {}; SEN = LS.get("sen") || {}; AIC = LS.get("ai") || {};
}
async function initCloud() {
  if (PWA) { initPWA(); return; }
  let tries = 0;
  while (!(window.claude && window.claude.use) && tries < 10) { await new Promise(r => setTimeout(r, 100)); tries++; }
  if (!(window.claude && window.claude.use)) { renderChrome(); return; }
  const c = window.claude;
  c.use("downloads").then(d => { Cloud.downloads = d; }).catch(() => {});
  c.use("sample").then(s => { Cloud.sample = s; if (VIEW === "read") rerenderLight(); }).catch(() => {});
  try {
    const [db, user] = await Promise.all([c.use("db"), c.use("user")]);
    if (!db || !user) { renderChrome(); return; }
    const id = await user.id(); if (!id) return;
    try { const me = await user.me(); Cloud.name = (me && me.name) || ""; } catch (e) {}
    Cloud.db = db; Cloud.base = "data/users/" + id;
    const timer = setTimeout(() => { Cloud.ready = true; renderChrome(); }, 10000);
    const [st, vs, ss, as] = await Promise.all([
      db.doc(Cloud.base + "/state/main").get(),
      db.collection(Cloud.base + "/vocab").limit(1000).get(),
      db.collection(Cloud.base + "/sents").limit(1000).get(),
      db.collection(Cloud.base + "/ai").limit(1000).get(),
    ]);
    clearTimeout(timer);
    const remote = st.exists ? st.data() : null;
    if (remote && remote.v === 1 && (remote.ts || 0) >= (S.ts || 0)) S = Object.assign(freshState(), remote, { set: Object.assign(freshState().set, remote.set || {}) });
    else save();
    vs.docs.forEach(d => { const v = d.data(); if (v && v.k && (!VOC[v.k] || (VOC[v.k].l || 0) < (v.l || 0))) VOC[v.k] = v; });
    ss.docs.forEach(d => { const v = d.data(); if (v && v.a) SEN[d.id] = v; });
    as.docs.forEach(d => { const v = d.data(); if (v && v.v) AIC[d.id] = v.v; });
    // push local-only items up
    Object.keys(VOC).forEach(k => putVoc(k)); LS.set("sen", SEN);
    Cloud.ready = true;
    applySettings(); rollover(); render();
  } catch (e) { renderChrome(); }
}

/* ---------- platform: PWA ---------- */
const INSTALL = { evt: null, reg: null };
const isStandalone = () => { try { return matchMedia("(display-mode: standalone)").matches || matchMedia("(display-mode: window-controls-overlay)").matches || navigator.standalone === true; } catch (e) { return false; } };
const isIOS = () => /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
const isMobile = () => isIOS() || /Android/i.test(navigator.userAgent);
function initPWA() {
  document.documentElement.classList.toggle("standalone", isStandalone());
  Cloud.sample = makeAI();
  try { if (navigator.storage && navigator.storage.persist) navigator.storage.persist(); } catch (e) {}
  if ("serviceWorker" in navigator && location.protocol !== "file:") {
    navigator.serviceWorker.register("sw.js", { updateViaCache: "none" }).then(reg => {
      INSTALL.reg = reg;
      if (reg.waiting && navigator.serviceWorker.controller) showUpdate();
      reg.addEventListener("updatefound", () => { const w = reg.installing; if (w) w.addEventListener("statechange", () => { if (w.state === "installed" && navigator.serviceWorker.controller) showUpdate(); }); });
      document.addEventListener("visibilitychange", () => { if (!document.hidden) reg.update().catch(() => {}); });
    }).catch(() => {});
    let reloading = false;
    navigator.serviceWorker.addEventListener("controllerchange", () => { if (reloading) return; reloading = true; location.reload(); });
  }
  window.addEventListener("beforeinstallprompt", e => { e.preventDefault(); INSTALL.evt = e; if (VIEW === "home" || VIEW === "prefs") render(); });
  window.addEventListener("appinstalled", () => { INSTALL.evt = null; toast("已安装，可以从桌面图标打开了"); render(); });
  renderChrome();
}
function showUpdate() {
  if ($("#updbar")) return;
  const b = document.createElement("div"); b.id = "updbar"; b.className = "updbar";
  b.innerHTML = `<span>有新版本可用</span><button class="btn sm" data-act="doupdate">立即更新</button><button class="iconbtn" data-act="closeupd" aria-label="稍后">${I.x}</button>`;
  document.body.appendChild(b);
}
function doUpdate() { const r = INSTALL.reg; if (r && r.waiting) r.waiting.postMessage({ type: "SKIP_WAITING" }); else location.reload(); }
async function checkUpdate(btn) {
  const r = INSTALL.reg; if (!r) { toast("当前环境不支持离线更新检查"); return; }
  btn.disabled = true; btn.textContent = "检查中…";
  try { await r.update(); } catch (e) {}
  setTimeout(() => { btn.disabled = false; btn.textContent = "检查更新"; if (!r.waiting && !r.installing) toast("已是最新版本 " + APP_VER); }, 1500);
}
function installCard() {
  if (!PWA) {
    if (!PWA_URL) return "";
    return `<div class="banner install" style="margin-bottom:12px"><div class="row" style="gap:12px;flex-wrap:nowrap"><img src="${PWA_URL}icons/icon-192.png" alt="" class="appico"><div><b>TED 精读已有 App 版</b><div class="muted" style="font-size:12.5px">可装到手机主屏幕和电脑桌面，离线可用。先在「设置」导出备份，再在 App 里导入，进度就能带过去。</div></div></div><a class="btn" href="${PWA_URL}" target="_blank" rel="noopener">打开 App 版</a></div>`;
  }
  if (isStandalone() || LS.get("instDismiss")) return "";
  return `<div class="banner install" style="margin-bottom:12px"><div class="row" style="gap:12px;flex-wrap:nowrap"><img src="icons/icon-192.png" alt="" class="appico"><div><b>把 TED 精读装到${isMobile() ? "手机主屏幕" : "电脑桌面"}</b><div class="muted" style="font-size:12.5px">像 App 一样全屏打开、离线可用，学习记录保存在本机。</div></div></div><div class="row"><button class="btn ghost sm" data-act="instno">不再提示</button><button class="btn" data-act="install">安装</button></div></div>`;
}
const SHARE_IC = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-3px"><path d="M12 3v12M8 7l4-4 4 4"/><path d="M6 11H5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1h-1"/></svg>';
async function doInstall() {
  if (INSTALL.evt) { const e = INSTALL.evt; INSTALL.evt = null; e.prompt(); try { const r = await e.userChoice; if (r.outcome === "accepted") return; } catch (x) {} return; }
  let steps;
  if (isIOS()) {
    const inApp = /MicroMessenger|QQ\/|Weibo|DingTalk|Lark|Feishu/i.test(navigator.userAgent);
    const notSafari = /CriOS|FxiOS|EdgiOS/.test(navigator.userAgent);
    steps = (inApp ? [["先换到 Safari", "当前是在 App 内置浏览器里，点右上角「…」，选「在 Safari 中打开」。"]] : notSafari ? [["建议用 Safari", "Chrome/Edge 也能添加，但 Safari 的体验最好。"]] : []).concat([
      ["点「分享」", `点地址栏旁的「···」或底部的分享按钮 ${SHARE_IC}。`],
      ["选「添加到主屏幕」", "在菜单里往下滑，找到「添加到主屏幕」。"],
      ["确认「作为网页 App 打开」", "保持开启（iOS 26 起显示此开关），然后点右上角「添加」。"],
      ["从主屏幕打开", "以后点桌面上的「TED精读」图标，全屏启动，没网也能学。"]]);
  } else if (/Android/i.test(navigator.userAgent)) {
    steps = [["打开浏览器菜单", "Chrome 右上角「⋮」。"], ["选「安装应用」或「添加到主屏幕」", "确认后桌面会出现图标。"]];
  } else {
    steps = [["Chrome / Edge", "地址栏右侧的「安装」图标，或菜单「⋮ → 投放、保存和分享 → 安装页面为应用」（Edge：「⋯ → 应用 → 将此站点作为应用安装」）。"], ["Mac 上的 Safari", "菜单栏「文件 → 添加到程序坞」。"], ["安装之后", "会出现在开始菜单 / 启动台 / 程序坞，独立窗口运行，可离线使用。"]];
  }
  modal(`<h2>安装到${isMobile() ? "主屏幕" : "桌面"}</h2><ol class="steps">${steps.map(s => `<li><b>${s[0]}</b><span>${s[1]}</span></li>`).join("")}</ol><div class="acts"><button class="btn" data-act="close">知道了</button></div>`);
}

/* ---------- AI provider (PWA) ---------- */
const AI_PRESETS = { deepseek: ["DeepSeek", "openai", "https://api.deepseek.com", "deepseek-chat"], qwen: ["通义千问", "openai", "https://dashscope.aliyuncs.com/compatible-mode/v1", "qwen-plus"], anthropic: ["Claude", "anthropic", "https://api.anthropic.com", "claude-haiku-5-5"], custom: ["自定义（OpenAI 兼容）", "openai", "", ""] };
function aiCfg() { return LS.get("aicfg") || { prov: "deepseek", key: "", base: AI_PRESETS.deepseek[2], model: AI_PRESETS.deepseek[3] }; }
function makeAI() {
  const c = aiCfg(); if (!c.key) return null;
  const fmt = (AI_PRESETS[c.prov] || AI_PRESETS.custom)[1];
  const call = async prompt => {
    const base = (c.base || "").replace(/\/+$/, ""); let r, j;
    try {
      if (fmt === "anthropic") {
        r = await fetch(base + "/v1/messages", { method: "POST", headers: { "content-type": "application/json", "x-api-key": c.key, "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-access": "true" }, body: JSON.stringify({ model: c.model, max_tokens: 1500, messages: [{ role: "user", content: prompt }] }) });
      } else {
        r = await fetch(base + "/chat/completions", { method: "POST", headers: { "content-type": "application/json", "authorization": "Bearer " + c.key }, body: JSON.stringify({ model: c.model, temperature: 0.3, messages: [{ role: "user", content: prompt }] }) });
      }
    } catch (e) { throw { code: "network", message: "网络不通或服务商不允许浏览器直连" }; }
    if (!r.ok) { let m = ""; try { const x = await r.json(); m = (x.error && (x.error.message || x.error.type)) || x.message || ""; } catch (e) {} throw { code: "http", message: "HTTP " + r.status + (m ? "：" + String(m).slice(0, 80) : "") }; }
    j = await r.json();
    return fmt === "anthropic" ? (j.content || []).map(x => x.text || "").join("") : ((j.choices || [])[0] || {}).message.content || "";
  };
  return { json: async (prompt) => { const t = await call(prompt + "\n只输出 JSON 对象本身，不要代码块标记。"); const m = t.match(/\{[\s\S]*\}/); try { return JSON.parse(m ? m[0] : t); } catch (e) { throw { code: "parse", message: "返回内容不是有效 JSON" }; } }, text: call };
}
function aiErr(e) {
  if (!PWA) return e && e.code === "not_granted" ? "未授权 AI 功能，可在页面权限中开启。" : "暂时无法生成，请稍后再试。";
  return "AI 调用失败：" + ((e && e.message) || "未知错误") + "。请到「设置 → AI 解析服务」检查。";
}

/* ---------- backup / sync between devices ---------- */
function backupObj() { return { app: "ted-jingdu", v: 1, at: Date.now(), from: PWA ? "app" : "claude", S, VOC, SEN, AIC }; }
async function exportBackup() { await saveFile("TED精读_备份_" + todayK() + ".json", new Blob([JSON.stringify(backupObj())], { type: "application/json" })); }
function mergeBackup(b) {
  const L = S, Rm = Object.assign(freshState(), b.S);
  const newer = (Rm.ts || 0) > (L.ts || 0) ? Rm : L;
  const out = Object.assign(freshState(), JSON.parse(JSON.stringify(newer)));
  out.set = L.set;
  const dm = {}; L.done.concat(Rm.done || []).forEach(d => { if (d && AMAP[d.a] && (!dm[d.a] || d.d < dm[d.a].d)) dm[d.a] = d; });
  out.done = Object.values(dm).sort((x, y) => x.d < y.d ? -1 : 1);
  out.days = [...new Set(L.days.concat(Rm.days || []))].sort();
  out.badges = [...new Set(L.badges.concat(Rm.badges || []))];
  out.cards = Object.assign({}, L.cards); Object.entries(Rm.cards || {}).forEach(([k, v]) => { out.cards[k] = Math.max(out.cards[k] == null ? -1 : out.cards[k], v); });
  out.xp = Math.max(L.xp, Rm.xp || 0); out.coins = Math.max(L.coins, Rm.coins || 0);
  const ek = e => [e.wk, e.n, e.d, e.sc, e.tot, e.prac ? 1 : 0].join("|"); const em = {}; L.exams.concat(Rm.exams || []).forEach(e => em[ek(e)] = e); out.exams = Object.values(em).sort((x, y) => x.d < y.d ? -1 : 1);
  out.prog = {}; new Set(Object.keys(L.prog).concat(Object.keys(Rm.prog || {}))).forEach(k => { out.prog[k] = [...new Set((L.prog[k] || []).concat((Rm.prog || {})[k] || []))]; });
  const doneIds = new Set(out.done.map(d => d.a)); out.abandoned = [...new Set(L.abandoned.concat(Rm.abandoned || []))].filter(x => !doneIds.has(x));
  if ((L.final && L.final.pass) || (Rm.final && Rm.final.pass)) out.final = Object.assign({}, newer.final || L.final || Rm.final, { pass: true });
  out.stats = { listen: Math.max(L.stats.listen || 0, (Rm.stats || {}).listen || 0), speak: Math.max(L.stats.speak || 0, (Rm.stats || {}).speak || 0) };
  S = out;
  let nv = 0, ns = 0;
  Object.values(b.VOC || {}).forEach(v => { if (!v || !v.k) return; const o = VOC[v.k]; if (!o) { VOC[v.k] = v; nv++; } else { VOC[v.k] = Object.assign({}, (v.l || 0) > (o.l || 0) ? v : o, { n: Math.max(o.n || 0, v.n || 0), t: Math.min(o.t || Infinity, v.t || Infinity) }); } });
  Object.entries(b.SEN || {}).forEach(([id, v]) => { if (!v || !v.a) return; const o = SEN[id]; if (!o) { SEN[id] = v; ns++; } else SEN[id] = Object.assign({}, o, { n: Math.max(o.n || 0, v.n || 0), l: Math.max(o.l || 0, v.l || 0), t: Math.min(o.t || Infinity, v.t || Infinity) }); });
  Object.entries(b.AIC || {}).forEach(([id, v]) => { if (!AIC[id]) AIC[id] = v; });
  return { nv, ns };
}
function importBackup(file) {
  const fr = new FileReader();
  fr.onload = () => {
    let b; try { b = JSON.parse(fr.result); } catch (e) { toast("文件无法读取，请选择导出的 .json 备份"); return; }
    if (!b || b.app !== "ted-jingdu" || !b.S) { toast("这不是 TED 精读的备份文件"); return; }
    const r = mergeBackup(b);
    save(); LS.set("voc", VOC); LS.set("sen", SEN); LS.set("ai", AIC);
    if (Cloud.db) { Object.keys(VOC).forEach(k => putVoc(k)); Object.keys(SEN).forEach(id => putSen(id)); Object.keys(AIC).forEach(id => putAI(id)); }
    checkBadges(); render();
    modal(`<h2>导入完成</h2><p class="muted">新增单词 ${r.nv} 个、句子 ${r.ns} 句；已完成文章、连续学习天数、卡片和徽章已合并（经验和金币取两边较大值）。</p><div class="acts"><button class="btn" data-act="close">好的</button></div>`);
  };
  fr.readAsText(file);
}

/* ---------- derived ---------- */
const isDone = id => S.done.some(d => d.a === id);
const doneSet = () => new Set(S.done.map(d => d.a));
function progOf(id) { const a = AMAP[id]; const p = S.prog[id]; return p ? Math.min(1, p.length / a.sents.length) : 0; }
function streak() {
  const set = new Set(S.days); let n = 0; let k = todayK();
  if (!set.has(k)) k = addDays(k, -1);
  while (set.has(k)) { n++; k = addDays(k, -1); }
  return n;
}
function multOf(st) { return st >= 30 ? 3 : st >= 14 ? 2 : st >= 7 ? 1.5 : st >= 3 ? 1.2 : 1; }
const LEVELS = [[0, "初来乍到"], [300, "好奇听众"], [800, "认真读者"], [1500, "笔记达人"], [2500, "思辨者"], [4000, "演讲解读者"], [6000, "TED 策展人"], [8500, "精读大师"]];
function levelOf(xp) { let i = 0; while (i + 1 < LEVELS.length && xp >= LEVELS[i + 1][0]) i++; const nx = LEVELS[i + 1]; return { i: i + 1, name: LEVELS[i][1], base: LEVELS[i][0], next: nx ? nx[0] : null }; }
function markStudy() { const k = todayK(); if (!S.days.includes(k)) { S.days.push(k); if (S.days.length > 400) S.days = S.days.slice(-400); save(); checkBadges(); renderChrome(); } }
function weekDay() { return diffDays(S.cur.weekStart, todayK()); }

/* ---------- weekly rules ---------- */
function pickNext(excl) {
  const ds = doneSet(); const cand = ARTS.filter(a => !ds.has(a.id) && a.id !== excl);
  if (!cand.length) return null;
  if (S.nextTopic) { const c = cand.find(a => a.cat === S.nextTopic); if (c) return c.id; }
  const curCat = S.cur.art && AMAP[S.cur.art] ? AMAP[S.cur.art].cat : null;
  const counts = {}; S.done.forEach(d => { const c = AMAP[d.a].cat; counts[c] = (counts[c] || 0) + 1; });
  cand.sort((x, y) => ((x.cat === curCat) - (y.cat === curCat)) || ((counts[x.cat] || 0) / CATS.length - (counts[y.cat] || 0) / CATS.length) || x.idx - y.idx);
  return cand[0].id;
}
let pendingRoll = false;
function rollover() {
  if (!S.cur.art) return;
  const d = weekDay(); if (d < 7) { pendingRoll = false; return; }
  const k = Math.floor(d / 7);
  if (isDone(S.cur.art)) {
    const nx = pickNext(S.cur.art);
    S.cur = { art: nx, weekStart: addDays(S.cur.weekStart, 7 * k), ext: 0, bonus: false }; S.nextTopic = null; save();
    setTimeout(() => toast("新的一周开始了：" + (nx ? AMAP[nx].titleZh : "20 篇已全部完成")), 400);
  } else pendingRoll = true;
}
function resolveRoll(extend) {
  const k = Math.floor(weekDay() / 7);
  if (extend) { S.cur.weekStart = addDays(S.cur.weekStart, 7 * k); S.cur.ext = (S.cur.ext || 0) + 1; toast("已延期一周，继续加油"); }
  else { const old = S.cur.art; if (!S.abandoned.includes(old)) S.abandoned.push(old); const nx = pickNext(old); S.cur = { art: nx, weekStart: addDays(S.cur.weekStart, 7 * k), ext: 0, bonus: false }; S.nextTopic = null; toast("已推送新文章"); }
  pendingRoll = false; save(); closeModal(); render();
}
function showRollModal() {
  const a = AMAP[S.cur.art];
  modal(`<h2>上一周的文章还没读完</h2><p class="muted">《${esc(a.titleZh)}》阅读进度 ${Math.round(progOf(a.id) * 100)}%。按规则，未完成可以选择延期一周继续学，也可以推送新文章（当前文章进度会保留在资源库里）。</p>
  <div class="acts"><button class="btn ghost" data-act="roll-new">推送新文章</button><button class="btn" data-act="roll-ext">延期一周</button></div>`, { lock: true });
}

/* ---------- rewards & badges ---------- */
const BADGES = [
  ["first", "首篇精读", "完成第一篇文章", "#2B6A5C"], ["s3", "三日之火", "连续学习 3 天", "#E4572E"], ["s7", "一周不断", "连续学习 7 天", "#E4572E"], ["s14", "半月坚守", "连续学习 14 天", "#C44536"], ["s30", "月度传奇", "连续学习 30 天", "#A3122A"],
  ["w50", "词汇 50", "点学 50 个单词", "#2B5FA0"], ["w150", "词汇 150", "点学 150 个单词", "#2B5FA0"], ["w300", "词汇 300", "点学 300 个单词", "#1D3F73"], ["sent30", "句法侦探", "分析 30 个句子", "#7552A3"],
  ["perfect", "满分答卷", "任意考试满分", "#B3801F"], ["ear", "完整聆听", "听完一篇全文", "#2F7F7A"], ["voice", "开口十次", "完成 10 次跟读", "#2F7F7A"],
  ["cats", "七域通览", "七个类别各完成 1 篇", "#8A5A2B"], ["half", "半程", "完成 10 篇", "#B3801F"], ["all20", "二十篇", "完成全部 20 篇", "#B3801F"], ["master", "精读大师", "通过终极考试", "#C99A2E"],
];
function badgeSVG(col) { return `<svg viewBox="0 0 48 48"><path d="M24 3l17 8v13c0 10-7 17-17 21C14 41 7 34 7 24V11z" fill="${col}"/><path d="M24 9l12 5.6V24c0 7-5 12-12 15-7-3-12-8-12-15v-9.4z" fill="none" stroke="#FFFFFF" stroke-opacity=".55" stroke-width="1.5"/><path d="M17 24l5 5 9-10" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>`; }
function checkBadges() {
  const has = new Set(S.badges), got = [];
  const st = streak(), nv = Object.keys(VOC).length, ns = Object.keys(SEN).length, nd = S.done.length;
  const cond = { first: nd >= 1, s3: st >= 3, s7: st >= 7, s14: st >= 14, s30: st >= 30, w50: nv >= 50, w150: nv >= 150, w300: nv >= 300, sent30: ns >= 30,
    perfect: S.exams.some(e => e.sc === e.tot), ear: S.stats.listen >= 1, voice: S.stats.speak >= 10, cats: CATS.every(c => S.done.some(d => AMAP[d.a].cat === c)), half: nd >= 10, all20: nd >= 20, master: !!(S.final && S.final.pass) };
  BADGES.forEach(b => { if (cond[b[0]] && !has.has(b[0])) { S.badges.push(b[0]); got.push(b); } });
  if (got.length) { save(); setTimeout(() => { toast("获得徽章：" + got.map(b => b[1]).join("、")); confetti(60); }, 300); }
}
const RAR = ["普通", "稀有", "史诗", "传说"];
function cardHTML(a, r, big) {
  const [c1, c2] = CATCOL[a.cat];
  return `<div class="tcard r${r}" style="background:linear-gradient(150deg,${c1},${c2})">${r === 3 ? '<span class="foil"></span>' : ""}<span class="rar">${RAR[r]}</span>
  <div class="glyph">${CATGLYPH[a.cat]}</div><div><div class="qt" style="font-family:var(--read)">${esc(a.quote)}</div><div class="qt" style="opacity:.85;margin-top:4px">${esc(a.quoteZh)}</div>
  <div style="margin-top:6px;opacity:.8;font-size:10.5px">${esc(a.sub)} · ${esc(a.title)}</div></div></div>`;
}
function complete(id, quizScore, quizTot) {
  if (isDone(id)) return;
  const st = Math.max(1, streak()); const m = multOf(st);
  const base = 100, qx = quizScore * 20, xp = Math.round((base + qx) * m), coins = 10 + quizScore * 2 + (st >= 7 ? 10 : 0);
  let r = st >= 14 ? 3 : st >= 7 ? 2 : st >= 3 ? 1 : 0; if (quizScore === quizTot && r < 3) r++;
  S.done.push({ a: id, d: todayK(), sc: quizScore, xp }); S.xp += xp; S.coins += coins; S.cards[id] = Math.max(S.cards[id] || 0, r);
  S.abandoned = S.abandoned.filter(x => x !== id);
  save(); checkBadges();
  const a = AMAP[id], n = S.done.length;
  const msgs = ["你又读懂了一个值得思考的观点。", "一周的专注，换来一张新卡片。", "今天的你，比上周多懂了一点世界。", "坚持本身，就是最好的天赋。"];
  modal(`<div class="reveal"><div class="tag g">第 ${n} / 20 篇完成</div>${cardHTML(a, r)}<h2>${esc(pick(msgs))}</h2>
  <div class="xpline"><span class="tag">基础 +${base}</span><span class="tag">测验 +${qx}</span><span class="tag g">连续 ${st} 天 ×${m}</span><span class="tag g">共 +${xp} XP</span><span class="tag">金币 +${coins}</span></div>
  <p class="muted" style="margin:0">获得「${RAR[r]}」主题卡${r === 3 ? "，带流光特效" : ""}。连续学习越久，卡片越稀有。</p>
  ${n === 20 ? '<p><b>20 篇全部完成！终极考试已解锁，通过后领取终极奖励。</b></p>' : ""}</div>
  <div class="acts"><button class="btn ghost" data-act="go" data-v="reward">查看收藏</button><button class="btn" data-act="close">继续</button></div>`);
  confetti(160);
}

/* ---------- UI chrome ---------- */
let VIEW = "home", READ_ID = null, READ_MODE = "en", LIB_CAT = "全部";
function applySettings() {
  const r = document.documentElement;
  if (S.set.skin === "auto") delete r.dataset.skin; else r.dataset.skin = S.set.skin;
  r.style.setProperty("--fs", S.set.fs + "px");
  r.style.setProperty("--read", S.set.font === "serif" ? "var(--serif)" : "var(--ui)");
  r.classList.toggle("nomotion", !S.set.motion);
}
function screenMode() {
  const pref = LS.get("screen");
  const m = pref === "L" || pref === "S" ? pref : (window.innerWidth >= 900 ? "L" : "S");
  document.documentElement.dataset.mode = m;
  const col = LS.get("sidecol"); document.documentElement.classList.toggle("sidecol", !!col);
}
function secName() { if (VIEW === "read" && READ_ID) return AMAP[READ_ID].titleZh; return NAVMAP[VIEW].n; }
function renderChrome() {
  const nv = Object.keys(VOC).length, ns = Object.keys(SEN).length, due = dueCards().length;
  // sidebar
  $("#side").innerHTML = `<div class="brand">${PWA ? '<img class="logo" src="icons/icon-192.png" alt="">' : '<div class="logo">TED</div>'}<div class="bt"><b>TED 精读计划</b><span>${S.done.length}/20 篇 · Lv.${levelOf(S.xp).i}</span></div></div>
  <nav class="nav">${NAV.map(n => `<button class="ni ${VIEW === n.v ? "on" : ""}" data-act="go" data-v="${n.v}" title="${n.n}"><span class="ic">${I[n.ic]}</span><span class="no">${n.no}</span><span class="lbl">${n.n}</span></button>
  ${VIEW === n.v && n.subs.length ? `<div class="sub">${n.subs.map((s, j) => `<button data-act="sub" data-v="${n.v}" data-a="${s[1]}"><span class="no">${n.no}.${j + 1}</span>${esc(s[0])}</button>`).join("")}</div>` : ""}`).join("")}</nav>
  <div class="sidefoot">${PWA ? (isStandalone() ? "已安装 · 离线可用<br>数据保存在本设备" : "离线可用 · 数据保存在本设备") : Cloud.db ? "数据已云端同步，手机与电脑通用" : "数据保存在本机浏览器"}<div class="faint" style="margin-top:4px">版本 ${APP_VER}</div></div>`;
  const title = `<button class="capsule" data-act="toc">目录 ${I.down}</button><div class="bartitle"><b>TED 精读</b><span class="dot">·</span><span class="secn">${esc(secName())}</span></div>`;
  $("#topbar").innerHTML = title + `<div class="stat"><span>${flameSmall()} 连续 <b class="num">${streak()}</b> 天</span><span>XP <b class="num">${S.xp}</b></span><span>金币 <b class="num">${S.coins}</b></span></div><button class="iconbtn" data-act="screen" title="屏幕选择">${I.screen}</button>`;
  $("#bottombar").innerHTML = title + `<button class="mempill" data-act="go" data-v="mem">${I.mem}<span class="num">${nv}</span></button><button class="iconbtn" data-act="screen" title="屏幕选择">${I.screen}</button>`;
  const recent = Object.values(VOC).sort((a, b) => b.l - a.l).slice(0, 14);
  $("#membar").innerHTML = `<div class="mtitle">${I.mem}记忆栏</div><span class="muted num" style="white-space:nowrap">单词 ${nv} · 句子 ${ns} · 待复习 ${due}</span>
  <div class="chips">${recent.length ? recent.map(v => `<button class="chip" data-act="memword" data-k="${esc(v.k)}">${esc(LEX[v.k] ? LEX[v.k].w : v.k)}</button>`).join("") : '<span class="faint">阅读时点击单词，就会出现在这里</span>'}</div>
  <button class="btn sm" data-act="go" data-v="mem" data-a="s-flash">强化复习</button>`;
}
const flameSmall = () => '<span style="color:#E4572E">●</span>';
function render() {
  applySettings(); renderChrome();
  const v = $("#view"); stopSpeak(true);
  const fn = { home: vHome, read: vRead, lib: vLib, mem: vMem, exam: vExam, practice: vPractice, reward: vReward, export: vExport, prefs: vPrefs }[VIEW];
  v.innerHTML = fn();
  if (VIEW === "read") afterRead();
  if (VIEW === "practice") afterPractice();
  if (pendingRoll) showRollModal();
}
function rerenderLight() { renderChrome(); }
function go(v, anchor) {
  if (v === "read" && !READ_ID) READ_ID = S.cur.art || ARTS[0].id;
  VIEW = v; closeMenus(); closeSheet(); if (!modalLock) closeModal(true);
  try { history.replaceState(null, "", "#" + v); } catch (e) {}
  render(); window.scrollTo(0, 0);
  if (anchor) setTimeout(() => doSub(v, anchor), 30);
}
function doSub(v, a) {
  if (v === "read" && a.startsWith("m-")) { READ_MODE = a.slice(2); setReadMode(); return; }
  if (v === "lib" && a.startsWith("c-")) { LIB_CAT = a.slice(2); render(); return; }
  if (a === "s-flash" && v === "mem") { startFlash(); }
  const el = document.getElementById(a); if (el) el.scrollIntoView({ behavior: S.set.motion ? "smooth" : "auto", block: "start" });
}

/* ---------- views: home ---------- */
function vHome() {
  if (!S.cur.art) return vAllDone();
  const a = AMAP[S.cur.art], wd = Math.max(0, weekDay()), p = progOf(a.id), done = isDone(a.id);
  const st = streak(), lv = levelOf(S.xp), m = multOf(st);
  const days = []; for (let i = 0; i < 7; i++) { const k = addDays(S.cur.weekStart, i); const d = parseD(k); days.push(`<div class="d ${i === wd ? "today" : ""} ${i >= 4 ? "pick" : ""} ${S.days.includes(k) ? "studied" : ""}"><b class="num">${d.getDate()}</b>周${WK[d.getDay()]}</div>`); }
  const canPick = wd >= 4;
  const remain = c => ARTS.filter(x => x.cat === c && !isDone(x.id) && x.id !== a.id).length;
  const [c1, c2] = CATCOL[a.cat];
  const exA = examTaken(1), exB = examTaken(2);
  return `${installCard()}
  ${S.cur.ext ? `<div class="banner" style="margin-bottom:12px"><span>本文已延期 ${S.cur.ext} 周，保持节奏就好。</span></div>` : ""}
  <div class="hero" id="s-push">
    <div class="push">
      <svg class="art" viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="${c1}"/><circle cx="70" cy="34" r="24" fill="${c2}"/></svg>
      <div class="eyebrow"><span class="tag" style="background:${c1};color:#FFFFFF">${a.cat}</span><span>${esc(a.sub)}</span><span>·</span><span>第 ${S.done.length + (done ? 0 : 1)} 篇 / 20</span>${S.cur.bonus ? '<span class="tag g">额外学习</span>' : ""}</div>
      <h1>${esc(a.title)}</h1><div class="zh">${esc(a.titleZh)} · ${a.words} 词 · ${a.sents.length} 句</div>
      <div class="src">延伸观看：TED 演讲《${esc(a.ted.title)}》— ${esc(a.ted.speaker)}（${esc(a.ted.event)}，${a.ted.year}）</div>
      <div class="prog" style="margin-top:14px"><div class="bar"><i style="width:${Math.round(p * 100)}%"></i></div><span class="num">${Math.round(p * 100)}%</span></div>
      <div class="row" style="margin-top:14px">
        ${done ? `<span class="tag g">本周已完成</span><button class="btn ghost" data-act="read" data-id="${a.id}">再读一遍</button><button class="btn" data-act="go" data-v="lib">去资源库选下一篇</button>` :
        `<button class="btn" data-act="read" data-id="${a.id}">${p > 0 ? "继续精读" : "开始精读"}</button><button class="btn ghost" data-act="listen" data-id="${a.id}">${I.ear}听全文</button>`}
      </div>
      <div class="week">${days.join("")}</div>
      <div class="faint" style="font-size:11.5px;margin-top:6px">本周第 ${wd + 1} 天 · 金色为最后 3 天（可选下周主题）· 绿色为已学习的日子</div>
    </div>
    <div class="statcol">
      <div class="panel streak">${flameSVG}<div><div class="big">${st}<span style="font-size:14px;font-weight:400"> 天</span></div><div class="muted">连续学习 · 当前奖励 ×${m}</div><div class="faint" style="font-size:12px">${st >= 30 ? "已达最高倍率" : "再坚持 " + ([3, 7, 14, 30].find(x => x > st) - st) + " 天，倍率提升"}</div></div></div>
      <div class="panel"><div class="row" style="justify-content:space-between"><b>Lv.${lv.i} ${lv.name}</b><span class="muted num">${S.xp} XP</span></div>
        <div class="bar gold" style="margin-top:8px"><i style="width:${lv.next ? Math.round((S.xp - lv.base) / (lv.next - lv.base) * 100) : 100}%"></i></div>
        <div class="kv" style="margin-top:10px"><div><b>${S.done.length}</b><span>已完成</span></div><div><b>${Object.keys(VOC).length}</b><span>点学单词</span></div><div><b>${Object.keys(SEN).length}</b><span>分析句子</span></div></div></div>
      <div class="panel"><div class="row" style="justify-content:space-between"><b>本周考试</b><span class="muted" style="font-size:12px">每周两次 · 约 10 题</span></div>
        <div class="row" style="margin-top:8px">${examBtn(1, exA, wd)}${examBtn(2, exB, wd)}</div></div>
    </div>
  </div>
  <div class="sec" id="s-next"><div class="sechead"><h2><span class="no">1.2</span>下周主题</h2><span class="muted" style="font-size:12px">${canPick ? "现在可以选择" : "本周最后 3 天开放（还有 " + (4 - wd) + " 天）"}</span></div>
    <div class="panel"><div class="muted" style="font-size:13px">${S.nextTopic ? "已选：<b>" + S.nextTopic + "</b>，下周一将推送该主题中尚未学习的文章。" : "选择一个主题，下周就推送该主题的文章；不选则自动轮换主题。"}</div>
    <div class="topics">${CATS.map(c => `<button class="topic ${S.nextTopic === c ? "on" : ""}" data-act="topic" data-c="${c}" ${!canPick || !remain(c) ? "disabled" : ""}>${c} <span class="num" style="opacity:.7">${remain(c)}</span></button>`).join("")}</div></div></div>
  <div class="sec" id="s-rules"><div class="sechead"><h2><span class="no">1.3</span>学习规则</h2></div>
    <div class="rules">
      <div class="rule">${I.calendar}<div><b>一周一篇</b>每周推送一篇精读文，读完并通过小测验即算完成。</div></div>
      <div class="rule">${I.flag}<div><b>可以延期</b>到期没读完，可延期一周继续，也可以换新文章。</div></div>
      <div class="rule">${I.swap}<div><b>换文章要"放弃"</b>当前文章未完成时，在资源库选别的文章需点击"放弃"。</div></div>
      <div class="rule">${I.gift}<div><b>连续越久奖励越大</b>连续 3/7/14/30 天，经验倍率 ×1.2/1.5/2/3，卡片也更稀有。</div></div>
    </div></div>`;
}
function vAllDone() {
  return `<div class="panel" style="text-align:center;padding:30px"><h1>20 篇已全部完成</h1><p class="muted">你已经读完了整个资源库。最后一步：通过终极考试（80 分及格），领取终极奖励。</p>
  <div class="row" style="justify-content:center"><button class="btn gold" data-act="go" data-v="exam" data-a="s-final">去参加终极考试</button><button class="btn ghost" data-act="go" data-v="reward">查看收藏</button></div></div>`;
}
function examTaken(n) { return S.exams.find(e => e.wk === S.cur.weekStart && e.n === n && !e.prac); }
function examBtn(n, taken, wd) {
  const unlock = n === 1 ? 2 : 5;
  if (taken) return `<span class="tag ${taken.sc === taken.tot ? "g" : ""}">第 ${n} 次 ${taken.sc}/${taken.tot}</span>`;
  if (wd < unlock) return `<button class="btn sm ghost" disabled>第 ${n} 次 · ${unlock - wd} 天后</button>`;
  return `<button class="btn sm" data-act="exam" data-n="${n}">开始第 ${n} 次</button>`;
}

/* ---------- views: library ---------- */
function vLib() {
  const ds = doneSet();
  const list = ARTS.filter(a => LIB_CAT === "全部" || a.cat === LIB_CAT);
  return `<div class="sechead"><h2><span class="no">3</span>资源库</h2><span class="muted">${ds.size}/20 已完成</span></div>
  <div class="cattabs">${["全部"].concat(CATS).map(c => `<button class="${LIB_CAT === c ? "on" : ""}" data-act="cat" data-c="${c}">${c}${c !== "全部" ? " " + ARTS.filter(a => a.cat === c).length : ""}</button>`).join("")}</div>
  <div class="libgrid">${list.map(a => {
    const p = progOf(a.id), cur = a.id === S.cur.art, d = ds.has(a.id), ab = S.abandoned.includes(a.id);
    const [c1] = CATCOL[a.cat];
    return `<button class="acard" data-act="libopen" data-id="${a.id}"><span class="stripe" style="background:${c1}"></span>
    <span class="state">${d ? '<span class="tag g">已完成</span>' : cur ? '<span class="tag">本周</span>' : ab ? '<span class="tag r">已放弃</span>' : ""}</span>
    <span class="faint" style="font-size:11.5px">${a.cat} · ${esc(a.sub)}</span><h3>${esc(a.title)}</h3><span class="zh">${esc(a.titleZh)}</span>
    <span class="meta"><span>${a.words} 词</span><span>·</span><span>TED ${a.ted.year} · ${esc(a.ted.speaker)}</span>${p > 0 && !d ? `<span class="tag">${Math.round(p * 100)}%</span>` : ""}</span></button>`;
  }).join("")}</div>
  <p class="faint" style="font-size:12px;margin-top:14px">每篇精读文为围绕对应 TED 演讲主题撰写的原创文本，卡片上标注的是可延伸观看的真实 TED 演讲。</p>`;
}
function libOpen(id) {
  const a = AMAP[id], cur = S.cur.art ? AMAP[S.cur.art] : null;
  if (!cur || id === cur.id || isDone(id)) { openRead(id); return; }
  if (!isDone(cur.id)) {
    modal(`<h2>更换学习文章？</h2><p class="muted">本周的《${esc(cur.titleZh)}》还没读完（进度 ${Math.round(progOf(cur.id) * 100)}%）。按规则，换学《${esc(a.titleZh)}》需要先放弃当前文章。进度会保留，以后可以回来继续。</p>
    <div class="acts"><button class="btn ghost" data-act="read" data-id="${id}">只预览</button><button class="btn ghost" data-act="close">取消</button><button class="btn warn" data-act="abandon" data-id="${id}">放弃并改学这篇</button></div>`);
  } else {
    modal(`<h2>本周任务已完成</h2><p class="muted">要提前开始《${esc(a.titleZh)}》作为额外学习吗？完成后同样计入 20 篇进度，并获得奖励。</p>
    <div class="acts"><button class="btn ghost" data-act="read" data-id="${id}">只预览</button><button class="btn" data-act="bonus" data-id="${id}">开始额外学习</button></div>`);
  }
}

/* ---------- views: reader ---------- */
function vRead() {
  const a = AMAP[READ_ID]; const vset = new Set(Object.keys(VOC)); const p = progOf(a.id);
  const isCur = a.id === S.cur.art, d = isDone(a.id);
  const paras = a.paras.map(pi => {
    const en = pi.map(si => { const s = a.sents[si]; return `<span class="sent" data-s="${si}">${s.toks.map((t, ti) => t[1] ? `<span class="w${a.keys[t[1]] ? " kw" : ""}${vset.has(t[1]) ? " seen" : ""}" data-t="${ti}">${esc(t[0])}</span>${t[2]}` : esc(t[0]) + t[2]).join("")}</span>`; }).join(" ");
    const zh = pi.map(si => esc(a.sents[si].zh)).join("");
    return `<p class="para">${en}</p><p class="zhp"${READ_MODE === "en" ? " hidden" : ""}>${zh}</p>`;
  }).join("");
  return `<div class="rhead"><div class="row"><span class="tag" style="background:${CATCOL[a.cat][0]};color:#FFFFFF">${a.cat}</span><span class="muted">${esc(a.sub)}</span>${d ? '<span class="tag g">已完成</span>' : isCur ? '<span class="tag">本周精读</span>' : '<span class="tag r">预览</span>'}</div>
  <h1>${esc(a.title)}</h1><div class="muted">${esc(a.titleZh)}</div>
  <div class="faint" style="font-size:12px">延伸观看：<a href="${esc(a.ted.url)}" target="_blank" rel="noopener">${esc(a.ted.title)}</a> — ${esc(a.ted.speaker)}，${a.ted.year}</div></div>
  <div class="rtool glass">
    <div class="seg" role="tablist"><button data-act="rmode" data-m="en" class="${READ_MODE === "en" ? "on" : ""}">原文</button><button data-act="rmode" data-m="bi" class="${READ_MODE === "bi" ? "on" : ""}">对照</button><button data-act="rmode" data-m="zh" class="${READ_MODE === "zh" ? "on" : ""}">中文</button></div>
    <div class="seg"><button data-act="fs" data-d="-1" title="减小字号">A−</button><button data-act="fs" data-d="1" title="增大字号">A+</button></div>
    <button class="btn sm ghost" data-act="listen" data-id="${a.id}">${I.ear}听</button>
    <div class="prog"><div class="bar"><i id="rbar" style="width:${Math.round(p * 100)}%"></i></div><span class="num" id="rpct">${Math.round(p * 100)}%</span></div>
  </div>
  <div class="reader${READ_MODE === "zh" ? " zhonly" : ""}" id="reader">${paras}</div>
  <div class="rfoot"><div class="legend"><span><i style="background:color-mix(in srgb,var(--gold) 35%,transparent)"></i>重点词</span><span><i style="background:transparent;border-bottom:2px dotted var(--accent)"></i>已点学</span><span>单击单词：查词 · 双击或长按：整句解析</span></div>
  ${isCur && !d ? `<button class="btn" data-act="finish" id="finbtn" ${p < 0.9 ? "disabled" : ""}>完成精读并测验</button>` : ""}</div>
  ${isCur && !d ? `<p class="faint" style="font-size:12px">在英文原文或对照模式下逐段阅读，句子停留在屏幕上足够时间才计入进度；读到 90% 即可开始完成测验。</p>` : ""}`;
}
let readObs = null, readTick = null;
function afterRead() {
  const a = AMAP[READ_ID]; if (readObs) readObs.disconnect(); clearInterval(readTick);
  const set = new Set(S.prog[a.id] || []); const vis = new Map();
  readObs = new IntersectionObserver(es => { es.forEach(e => { const i = +e.target.dataset.s; if (e.isIntersecting) { if (!vis.has(i)) vis.set(i, Date.now()); } else vis.delete(i); }); }, { threshold: 0.6 });
  $$(".sent", $("#reader")).forEach(s => readObs.observe(s));
  readTick = setInterval(() => {
    if (!$("#reader")) { clearInterval(readTick); return; }
    if (READ_MODE === "zh" || document.hidden) return;
    let dirty = false; const now = Date.now();
    vis.forEach((t0, i) => { if (set.has(i)) return; const need = Math.max(2000, a.sents[i].toks.length * 230); if (now - t0 >= need) { set.add(i); dirty = true; } });
    if (dirty) { S.prog[a.id] = [...set]; const p = progOf(a.id); const b = $("#rbar"); if (b) { b.style.width = Math.round(p * 100) + "%"; $("#rpct").textContent = Math.round(p * 100) + "%"; } const f = $("#finbtn"); if (f) f.disabled = p < 0.9; saveSoon(); }
  }, 700);
}
let ssT = null; function saveSoon() { clearTimeout(ssT); ssT = setTimeout(() => { markStudy(); save(); }, 1500); }
function setReadMode() {
  const r = $("#reader"); if (!r) return render();
  $$(".rtool [data-act=rmode]").forEach(b => b.classList.toggle("on", b.dataset.m === READ_MODE));
  r.classList.toggle("zhonly", READ_MODE === "zh"); $$(".zhp", r).forEach(z => z.hidden = READ_MODE === "en");
}
function openRead(id) { READ_ID = id; closeModal(); go("read"); }

/* word / sentence interaction */
let clickT = null, lpT = null, lpFired = false, lastTap = null;
function onWordDown(e) {
  const w = e.target.closest(".w"); if (!w) return; lpFired = false;
  clearTimeout(lpT); lpT = setTimeout(() => { lpFired = true; const s = w.closest(".sent"); openSent(READ_ID, +s.dataset.s); }, 520);
}
function onWordUp() { clearTimeout(lpT); }
function onWordClick(e) {
  const w = e.target.closest(".w"); if (!w || !$("#reader") || !$("#reader").contains(w)) return;
  if (lpFired) { lpFired = false; return; }
  const s = w.closest(".sent"); const key = s.dataset.s + ":" + w.dataset.t;
  if (clickT && lastTap === s.dataset.s) { clearTimeout(clickT); clickT = null; openSent(READ_ID, +s.dataset.s); return; }
  lastTap = s.dataset.s;
  clickT = setTimeout(() => { clickT = null; openWord(READ_ID, +s.dataset.s, +w.dataset.t, w); }, 260);
}
function recordWord(key, aid, si) {
  const now = Date.now(); const v = VOC[key];
  if (v) { v.n++; v.l = now; } else VOC[key] = { k: key, a: aid, s: si, n: 1, t: now, l: now, box: 0, due: todayK() };
  putVoc(key); markStudy(); checkBadges();
  $$(".w").forEach(el => { const sEl = el.closest(".sent"); if (!sEl) return; const t = AMAP[READ_ID].sents[+sEl.dataset.s].toks[+el.dataset.t]; if (t[1] === key) el.classList.add("seen"); });
  renderChrome();
}
function recordSent(aid, si) {
  const id = aid + "_" + si; const now = Date.now();
  if (SEN[id]) { SEN[id].n++; SEN[id].l = now; } else SEN[id] = { a: aid, s: si, n: 1, t: now, l: now };
  putSen(id); markStudy(); checkBadges(); renderChrome();
}
function wordInfoHTML(key, aid, si, ti) {
  const L = LEX[key] || { w: key.replace(/^~/, ""), ph: "", tr: [], def: [], ex: {}, tags: [] };
  const a = AMAP[aid], s = a ? a.sents[si] : null, tok = s && ti != null ? s.toks[ti] : null;
  const K = a && a.keys[key];
  let formLine = "";
  if (tok && tok[0].toLowerCase() !== L.w.toLowerCase()) formLine = `<div class="muted" style="font-size:13px">原文形式 <b>${esc(tok[0])}</b>${tok[4] ? "：" + esc(L.w) + " 的" + esc(tok[4]) : ""}</div>`;
  else if (tok && tok[4]) formLine = `<div class="muted" style="font-size:13px">原文形式：${esc(tok[4])}</div>`;
  const ex = Object.entries(L.ex || {}).map(([k, v]) => `${k} <b>${esc(v)}</b>`).join(" · ");
  const hl = (en, w) => esc(en).replace(new RegExp("\\b(" + w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")\\b", "gi"), "<mark>$1</mark>");
  const surface = tok ? tok[0] : L.w;
  const seenOcc = new Set(); const others = (OCC[key] || []).filter(([ai2, s2]) => { const k2 = ai2 + ":" + s2; if (seenOcc.has(k2) || (ARTS[ai2].id === aid && s2 === si)) return false; seenOcc.add(k2); return true; }).slice(0, 3).map(([ai2, s2]) => {
    const ss = ARTS[ai2].sents[s2]; const sf = ss.toks.find(t => t[1] === key); return `<div class="ex"><div class="en">${hl(ss.en, sf ? sf[0] : L.w)}</div><div class="zh">${esc(ss.zh)}</div><div class="from">${esc(ARTS[ai2].titleZh)}</div></div>`;
  }).join("");
  const keyBlk = K ? `<div class="blk"><h4>用法</h4><div style="font-size:14px">${esc(K.use)}</div><div class="exs" style="margin-top:6px"><div class="ex"><div class="en">${hl(K.ex, L.w)}</div><div class="zh">${esc(K.exZh)}</div><div class="from">例句</div></div></div></div>` : "";
  const aiId = "w_" + safeId(key) + "_" + aid.slice(0, 6) + si;
  const aiBlk = AIC[aiId] ? aiWordHTML(AIC[aiId]) : (Cloud.sample ? `<button class="btn sm ghost" style="margin-top:12px" data-act="aiword" data-k="${esc(key)}" data-a="${aid}" data-s="${si}">${I.spark}AI 补充用法与例句</button><div id="aiw"></div>` : PWA ? `<button class="btn sm ghost" style="margin-top:12px" data-act="go" data-v="prefs" data-a="s-ai">${I.spark}开启 AI 补充（需在设置中填写密钥）</button>` : "");
  return `<div class="row" style="align-items:baseline"><span class="wd">${esc(L.w)}</span>${L.ph ? `<span class="ph">/${esc(L.ph)}/</span>` : ""}</div>
  <div class="row" style="margin-top:6px"><button class="say" data-act="say" data-text="${esc(L.w)}" data-acc="us">${I.vol}美音</button><button class="say" data-act="say" data-text="${esc(L.w)}" data-acc="uk">${I.vol}英音</button>${tok && tok[3] ? `<span class="tag">${esc(tok[3])}</span>` : ""}${(L.tags || []).slice(0, 5).map(t => `<span class="tag g">${t}</span>`).join("")}</div>
  ${formLine}
  <div class="blk"><h4>释义</h4><ul class="trl">${(L.tr || []).map(t => `<li>${esc(t)}</li>`).join("") || "<li class='muted'>专有名词或少见词，暂无词典释义</li>"}</ul>${(L.def || []).length ? `<div class="faint" style="font-size:12.5px;margin-top:4px">${esc(L.def[0])}</div>` : ""}</div>
  ${ex ? `<div class="blk"><h4>词形变化</h4><div style="font-size:13px">${ex}</div></div>` : ""}
  ${keyBlk}
  ${s ? `<div class="blk"><h4>原文例句</h4><div class="exs"><div class="ex"><div class="en">${hl(s.en, surface)}</div><div class="zh">${esc(s.zh)}</div><div class="from">${esc(a.titleZh)} <button class="say" style="margin-left:6px" data-act="say" data-text="${esc(s.en)}">${I.vol}读句子</button></div></div></div></div>` : ""}
  ${others ? `<div class="blk"><h4>资源库中的其他例句</h4><div class="exs">${others}</div></div>` : ""}
  ${aiBlk}`;
}
function aiWordHTML(r) {
  if (!r) return "";
  return `<div class="ai"><b>AI 补充</b>${r.ctx ? `<div>语境义：${esc(r.ctx)}</div>` : ""}${r.use ? `<div style="margin-top:4px">${esc(r.use)}</div>` : ""}${(r.coll || []).length ? `<div style="margin-top:4px">搭配：${r.coll.map(esc).join("；")}</div>` : ""}${(r.ex || []).map(e => `<div class="ex" style="margin-top:6px"><div class="en">${esc(e.en)}</div><div class="zh">${esc(e.zh)}</div></div>`).join("")}</div>`;
}
function openWord(aid, si, ti, el) {
  const a = AMAP[aid], tok = a.sents[si].toks[ti], key = tok[1]; if (!key) return;
  $$(".w.act").forEach(x => x.classList.remove("act")); if (el) el.classList.add("act");
  if (!key.startsWith("~")) recordWord(key, aid, si);
  sheet(`<div class="t"><b>单词详解</b></div>`, wordInfoHTML(key, aid, si, ti), { kind: "float", anchor: el });
  say(LEX[key] ? LEX[key].w : tok[0], S.set.voice, true);
}
function openWordFromMem(key) {
  const v = VOC[key]; sheet(`<div class="t"><b>单词详解</b></div>`, wordInfoHTML(key, v ? v.a : null, v ? v.s : 0, v && AMAP[v.a] ? AMAP[v.a].sents[v.s].toks.findIndex(t => t[1] === key) : null), { kind: "float" });
}
function sentHTML(aid, si) {
  const a = AMAP[aid], s = a.sents[si], an = s.an;
  const roles = an.role; const inCl = new Array(s.toks.length).fill(false);
  an.clauses.forEach(c => { for (let i = c.a; i <= c.b; i++) inCl[i] = true; });
  const toks = s.toks.map((t, i) => { const r = roles[i] || "-"; return `<span class="t ${r !== "-" ? r : ""} ${inCl[i] ? "cl" : ""}">${esc(t[0])}</span>${t[2]}`; }).join("");
  const sk = an.skel;
  const odName = d => ({ dobj: "宾语", attr: "表语", acomp: "表语", oprd: "宾补", dative: "间接宾语", ccomp: "宾语从句", xcomp: "补足语" }[d] || "宾语/表语");
  const verbs = an.verbs.map(v => `<tr><td style="font-family:var(--read)"><b>${esc(v.form)}</b></td><td>${esc(v.role)}</td><td>${esc(v.tense)}</td><td>${esc(v.voice)}</td></tr>`).join("");
  const nf = an.nf.map(n => `<tr><td style="font-family:var(--read)"><b>${esc(n.word)}</b></td><td>${esc(n.type)}</td><td>${esc(n.fn)}</td><td style="font-family:var(--read)">${esc(n.text)}</td></tr>`).join("");
  const aiId = "s_" + aid + "_" + si;
  return `<div class="ansent">${toks}</div>
  <div class="legend" style="margin-top:6px"><span><i style="background:var(--s)"></i>主语</span><span><i style="background:var(--v)"></i>谓语</span><span><i style="background:var(--o)"></i>宾语/表语</span><span><i style="background:color-mix(in srgb,var(--c) 30%,transparent)"></i>从句</span></div>
  <div class="row" style="margin-top:10px"><button class="say" data-act="say" data-text="${esc(s.en)}" data-acc="us">${I.vol}美音朗读</button><button class="say" data-act="say" data-text="${esc(s.en)}" data-acc="uk">${I.vol}英音朗读</button><span class="tag">${esc(an.kind)}</span><span class="tag ${an.passive ? "r" : ""}">${an.passive ? "含被动语态" : "主动语态"}</span>${an.inv ? '<span class="tag g">倒装</span>' : ""}</div>
  <div class="blk"><h4>翻译</h4><div style="font-size:14.5px">${esc(s.zh)}</div></div>
  <div class="blk"><h4>句子主干</h4><dl class="skel"><dt style="color:var(--s)">主语</dt><dd>${esc(sk.S) || "—"}</dd><dt style="color:var(--v)">谓语</dt><dd>${esc(sk.V) || "—"}</dd>${sk.O ? `<dt style="color:var(--o)">${odName(sk.Od[0])}</dt><dd>${esc(sk.O)}</dd>` : ""}</dl></div>
  ${an.clauses.length ? `<div class="blk"><h4>从句与分句</h4>${an.clauses.map(c => `<div class="ex"><span class="tag" style="background:color-mix(in srgb,var(--c) 16%,transparent);color:var(--c)">${esc(c.type)}</span> <span class="en">${esc(c.text)}</span>${c.detail ? `<div class="zh">${esc(c.detail)}</div>` : ""}</div>`).join("")}</div>` : ""}
  ${verbs ? `<div class="blk"><h4>谓语动词：时态与语态</h4><div class="tblwrap"><table class="tbl"><tr><th>动词</th><th>位置</th><th>时态</th><th>语态</th></tr>${verbs}</table></div></div>` : ""}
  ${nf ? `<div class="blk"><h4>非谓语形式（分词 / 动名词 / 不定式）</h4><div class="tblwrap"><table class="tbl"><tr><th>词</th><th>形式</th><th>作用</th><th>短语</th></tr>${nf}</table></div></div>` : ""}
  ${an.notes.length ? `<div class="blk"><h4>特殊用法</h4>${an.notes.map(n => `<div class="note">${esc(n)}</div>`).join("")}</div>` : ""}
  ${AIC[aiId] ? aiSentHTML(AIC[aiId]) : Cloud.sample ? `<button class="btn sm ghost" style="margin-top:12px" data-act="aisent" data-a="${aid}" data-s="${si}">${I.spark}AI 深度解析</button><div id="ais"></div>` : PWA ? `<button class="btn sm ghost" style="margin-top:12px" data-act="go" data-v="prefs" data-a="s-ai">${I.spark}开启 AI 深度解析（需在设置中填写密钥）</button>` : ""}
  <p class="faint" style="font-size:11.5px;margin-top:12px">句法成分由依存句法分析自动标注，复杂句可能有个别偏差，可结合翻译与特殊用法理解。</p>`;
}
function aiSentHTML(r) {
  if (!r) return "";
  return `<div class="ai"><b>AI 深度解析</b>${r.structure ? `<div style="margin-top:4px">${esc(r.structure)}</div>` : ""}${(r.grammar || []).length ? `<ul>${r.grammar.map(g => `<li>${esc(g)}</li>`).join("")}</ul>` : ""}${(r.special || []).length ? `<div>特殊用法：</div><ul>${r.special.map(g => `<li>${esc(g)}</li>`).join("")}</ul>` : ""}${r.tip ? `<div class="faint">${esc(r.tip)}</div>` : ""}</div>`;
}
function openSent(aid, si) {
  $$(".sent.picked").forEach(x => x.classList.remove("picked"));
  const el = $(`.sent[data-s="${si}"]`); if (el) el.classList.add("picked");
  recordSent(aid, si);
  sheet(`<div class="t"><b>整句解析</b><div class="faint" style="font-size:12px">${esc(AMAP[aid].titleZh)} · 第 ${si + 1} 句</div></div>`, sentHTML(aid, si), { kind: "drawer" });
}
async function aiWord(key, aid, si) {
  const box = $("#aiw"); const btn = $("[data-act=aiword]"); if (btn) btn.disabled = true; if (box) box.innerHTML = '<div class="ai muted">正在生成…</div>';
  const s = AMAP[aid].sents[si]; const L = LEX[key] || { w: key };
  try {
    const r = await Cloud.sample.json(`你是资深英语老师。学习者在下面这句英文中点击了单词 "${L.w}"。请严格输出 JSON（不要其他文字）：{"ctx":"该词在本句语境中的具体含义（中文，一句话）","use":"常见用法说明（中文，2-3 个要点合成一段）","coll":["常用搭配1","常用搭配2","常用搭配3"],"ex":[{"en":"自然的英文例句","zh":"中文翻译"},{"en":"","zh":""}]}\n句子：${s.en}\n参考译文：${s.zh}`, { modelTier: "quick" });
    const id = "w_" + safeId(key) + "_" + aid.slice(0, 6) + si; AIC[id] = r; putAI(id);
    if (box) box.innerHTML = aiWordHTML(r); if (btn) btn.remove();
  } catch (e) { if (box) box.innerHTML = `<div class="ai muted">${esc(aiErr(e))}</div>`; if (btn) btn.disabled = false; }
}
async function aiSent(aid, si) {
  const box = $("#ais"); const btn = $("[data-act=aisent]"); if (btn) btn.disabled = true; if (box) box.innerHTML = '<div class="ai muted">正在解析…</div>';
  const s = AMAP[aid].sents[si];
  try {
    const r = await Cloud.sample.json(`你是资深英语语法老师。请深度解析下面的英文句子，严格输出 JSON（不要其他文字）：{"structure":"句子结构与成分划分（中文，说明主干与修饰关系）","grammar":["语法要点（时态、语态、从句、非谓语等），每条一句"],"special":["习语、固定搭配、修辞或特殊用法，每条一句"],"tip":"一句学习提示"}\n句子：${s.en}\n参考译文：${s.zh}`, { modelTier: "default" });
    const id = "s_" + aid + "_" + si; AIC[id] = r; putAI(id);
    if (box) box.innerHTML = aiSentHTML(r); if (btn) btn.remove();
  } catch (e) { if (box) box.innerHTML = `<div class="ai muted">${esc(aiErr(e))}</div>`; if (btn) btn.disabled = false; }
}

/* ---------- finish quiz ---------- */
function finishQuiz() {
  const a = AMAP[READ_ID];
  const qs = a.quiz.map(q => ({ type: "comp", q: q.q, o: q.o, a: q.a, art: a.id }));
  const keys = shuffle(Object.keys(a.keys).filter(k => a.sents.some(s => s.toks.some(t => t[1] === k)))).slice(0, 2);
  keys.forEach(k => qs.push(mkCloze(a, k)));
  runQuiz({ title: "完成测验 · " + a.titleZh, qs: qs.filter(Boolean), onDone: (sc, tot) => {
    if (sc >= Math.ceil(tot * 0.6)) { closeModal(true); complete(a.id, sc, tot); render(); return false; }
    return "答对 " + sc + "/" + tot + "，需答对 " + Math.ceil(tot * 0.6) + " 题才算完成。看看解析，回顾原文后再试一次";
  } });
}

/* ---------- exam generation ---------- */
const firstTr = k => { const L = LEX[k]; if (!L || !L.tr.length) return null; return L.tr[0].replace(/^\[[^\]]+\]\s*/, "").slice(0, 40); };
const posOf = k => { const L = LEX[k]; const m = L && L.tr[0] && L.tr[0].match(/^([a-z]+)\./); return m ? m[1] : ""; };
function distract(k, n, f) {
  const pos = posOf(k); const pool = shuffle(Object.keys(OCC)).filter(x => x !== k && firstTr(x) && x.length > 3 && (!pos || posOf(x) === pos));
  const out = []; const seen = new Set([f(k)]);
  for (const x of pool) { const v = f(x); if (v && !seen.has(v)) { seen.add(v); out.push(v); } if (out.length >= n) break; }
  return out;
}
function mkMeaning(k) { const L = LEX[k]; const ans = firstTr(k); if (!ans) return null; const o = shuffle([ans].concat(distract(k, 3, firstTr))); return { type: "mean", q: `单词 “${L.w}” 的意思是？`, o, a: o.indexOf(ans), exp: `${L.w} /${L.ph}/：${L.tr.slice(0, 2).join("；")}`, k }; }
function mkWord(k) { const L = LEX[k]; const tr = firstTr(k); if (!tr) return null; const o = shuffle([L.w].concat(distract(k, 3, x => LEX[x].w))); return { type: "word", q: `哪个单词的意思是 “${tr}”？`, o, a: o.indexOf(L.w), exp: `${L.w}：${L.tr.slice(0, 2).join("；")}`, k }; }
function mkSpell(k) { const L = LEX[k]; const tr = firstTr(k); if (!tr || L.w.length < 4 || /[^a-z]/i.test(L.w)) return null; return { type: "spell", q: `拼写单词：${tr}（首字母 ${L.w[0]}，共 ${L.w.length} 个字母）`, ans: L.w.toLowerCase(), exp: `${L.w} /${L.ph}/`, k }; }
function findSentWith(k, prefer) {
  const occ = OCC[k] || []; if (!occ.length) return null;
  const o = (prefer && occ.find(([ai]) => ARTS[ai].id === prefer)) || pick(occ); return [ARTS[o[0]], o[1]];
}
function mkCloze(a, k, si) {
  if (si == null) { const f = a.sents.findIndex(s => s.toks.some(t => t[1] === k)); if (f < 0) { const r = findSentWith(k); if (!r) return null; a = r[0]; si = r[1]; } else si = f; }
  const s = a.sents[si]; const ti = s.toks.findIndex(t => t[1] === k); if (ti < 0) return null;
  const surf = s.toks[ti][0]; const text = s.toks.map((t, i) => (i === ti ? "_____" : t[0]) + t[2]).join("");
  const pos = s.toks[ti][3]; const pool = shuffle(a.sents.flatMap(x => x.toks).filter(t => t[1] && t[3] === pos && t[0].toLowerCase() !== surf.toLowerCase() && t[0].length > 3).map(t => t[0]));
  const o = shuffle([surf].concat([...new Set(pool)].slice(0, 3))); if (o.length < 3) return null;
  return { type: "cloze", q: "选词填空", sub: text, o, a: o.indexOf(surf), exp: s.zh, k };
}
function mkTrans(a, si) { const s = a.sents[si]; const others = shuffle(ARTS.flatMap(x => x.sents).filter(x => x !== s && Math.abs(x.zh.length - s.zh.length) < 25)).slice(0, 3).map(x => x.zh); const o = shuffle([s.zh].concat(others)); return { type: "trans", q: "选出这句话的正确翻译", sub: s.en, o, a: o.indexOf(s.zh), exp: "" }; }
function mkGrammar(a, si) {
  const s = a.sents[si]; const vs = s.an.verbs.filter(v => v.form.split(" ").length >= 1); if (!vs.length) return null; const v = pick(vs);
  const ans = v.tense + " · " + v.voice; const all = ["一般现在时", "一般过去时", "现在完成时", "过去完成时", "现在进行时", "过去进行时"].flatMap(t => [t + " · 主动语态", t + " · 被动语态"]);
  const o = shuffle([ans].concat(shuffle(all.filter(x => x !== ans)).slice(0, 3)));
  return { type: "gram", q: `句中 “${v.form}” 的时态与语态是？`, sub: s.en, o, a: o.indexOf(ans), exp: `${v.form}：${v.role}，${v.tense}，${v.voice}` };
}
function genExam(scope) {
  const curA = S.cur.art ? AMAP[S.cur.art] : ARTS[0];
  const arts = scope === "final" ? ARTS : [...new Set([curA].concat(S.done.slice(-3).map(d => AMAP[d.a])))];
  const learned = Object.values(VOC).filter(v => LEX[v.k]).sort((x, y) => y.l - x.l).map(v => v.k);
  const keyW = arts.flatMap(a => Object.keys(a.keys).filter(k => LEX[k] && OCC[k]));
  const wpool = shuffle([...new Set(learned.slice(0, 40).concat(keyW))]);
  const spool = shuffle(Object.values(SEN).filter(x => AMAP[x.a]).map(x => [AMAP[x.a], x.s]).concat(arts.flatMap(a => a.sents.map((_, i) => [a, i]))));
  const qs = []; const total = scope === "final" ? 20 : 10; let wi = 0, si = 0;
  const nextW = () => wpool[wi++ % Math.max(1, wpool.length)];
  const plan = scope === "final" ? ["mean", "word", "spell", "cloze", "cloze", "trans", "comp", "comp", "comp", "gram", "mean", "word", "cloze", "trans", "comp", "comp", "gram", "spell", "mean", "comp"] : ["mean", "word", "mean", "spell", "cloze", "cloze", "trans", "gram", "comp", "comp"];
  const compPool = shuffle(arts.flatMap(a => a.quiz.map(q => ({ type: "comp", q: q.q, o: q.o, a: q.a, art: a.id }))));
  let ci = 0, guard = 0;
  for (const t of plan) {
    let q = null; guard = 0;
    while (!q && guard++ < 12) {
      if (t === "mean") q = mkMeaning(nextW()); else if (t === "word") q = mkWord(nextW()); else if (t === "spell") q = mkSpell(nextW());
      else if (t === "cloze") { const k = nextW(); const r = findSentWith(k, curA.id); q = r ? mkCloze(r[0], k, r[1]) : null; }
      else if (t === "trans") { const [a, i] = spool[si++ % spool.length]; q = mkTrans(a, i); }
      else if (t === "gram") { const [a, i] = spool[si++ % spool.length]; q = mkGrammar(a, i); }
      else if (t === "comp") { q = compPool[ci++] || null; if (q) q.sub = "《" + AMAP[q.art].titleZh + "》"; }
      if (q && qs.some(x => x.q === q.q && x.sub === q.sub)) q = null;
    }
    if (q) qs.push(q);
  }
  return qs.slice(0, total);
}

/* ---------- quiz runner ---------- */
let QZ = null;
function runQuiz(o) { QZ = Object.assign({ ans: {}, sub: false }, o); drawQuiz(); }
function drawQuiz() {
  const q = QZ; const n = q.qs.length; const answered = q.qs.filter((x, i) => q.ans[i] != null && q.ans[i] !== "").length;
  const body = q.qs.map((x, i) => {
    const ua = q.ans[i]; let inner;
    if (x.type === "spell") inner = `<input type="text" id="sp${i}" data-qi="${i}" autocomplete="off" autocapitalize="off" spellcheck="false" value="${esc(ua || "")}" ${q.sub ? "disabled" : ""} placeholder="输入单词">`;
    else inner = `<div class="opts">${x.o.map((op, j) => { let c = ""; if (q.sub) { if (j === x.a) c = "right"; else if (ua === j) c = "wrong"; } else if (ua === j) c = "sel"; return `<button class="opt ${c}" data-act="qopt" data-qi="${i}" data-j="${j}" ${q.sub ? "disabled" : ""}>${String.fromCharCode(65 + j)}. ${esc(op)}</button>`; }).join("")}</div>`;
    const ok = q.sub ? (x.type === "spell" ? (ua || "").trim().toLowerCase() === x.ans : ua === x.a) : null;
    return `<div class="q"><div class="qt"><span class="no">${i + 1}.</span>${esc(x.q)}${q.sub ? (ok ? ' <span class="tag">正确</span>' : ' <span class="tag r">错误</span>') : ""}</div>${x.sub ? `<div class="qs">${esc(x.sub)}</div>` : ""}${inner}${q.sub ? `<div class="exp">${x.type === "spell" ? "答案：" + esc(x.ans) + " · " : ""}${esc(x.exp || "")}</div>` : ""}</div>`;
  }).join("");
  const sc = q.sub ? q.score : 0;
  modal(`<div class="row" style="justify-content:space-between"><h2>${esc(q.title)}</h2>${q.sub ? "" : `<span class="muted num">${answered}/${n}</span>`}</div>
  ${q.sub ? `<div class="score panel" style="margin:8px 0 12px">${ring(sc / n)}<div><div class="big">${sc}/${n}</div><div class="muted">${q.resultText || ""}</div></div></div>` : ""}
  ${body}<div class="acts">${q.sub ? '<button class="btn" data-act="close">完成</button>' : '<button class="btn ghost" data-act="close">退出</button><button class="btn" data-act="qsubmit">交卷</button>'}</div>`, { wide: true });
}
function ring(p) { const r = 34, c = 2 * Math.PI * r; return `<svg class="ring" viewBox="0 0 84 84"><circle cx="42" cy="42" r="${r}" fill="none" stroke="var(--bg2)" stroke-width="8"/><circle cx="42" cy="42" r="${r}" fill="none" stroke="var(--accent)" stroke-width="8" stroke-linecap="round" stroke-dasharray="${c * p} ${c}" transform="rotate(-90 42 42)"/><text x="42" y="47" text-anchor="middle" font-size="16" font-weight="700" fill="var(--ink)">${Math.round(p * 100)}%</text></svg>`; }
function submitQuiz() {
  const q = QZ; $$("input[data-qi]").forEach(i => q.ans[+i.dataset.qi] = i.value);
  let sc = 0; q.qs.forEach((x, i) => { if (x.type === "spell" ? (q.ans[i] || "").trim().toLowerCase() === x.ans : q.ans[i] === x.a) sc++; });
  q.sub = true; q.score = sc; markStudy();
  let redraw = true;
  if (q.onDone) { const r = q.onDone(sc, q.qs.length); if (r === false) redraw = false; else if (r) q.resultText = r; }
  if (redraw) drawQuiz();
}
function startExam(kind, n) {
  const qs = genExam(kind === "final" ? "final" : "week");
  const title = kind === "final" ? "终极考试" : kind === "prac" ? "随时练习" : `本周第 ${n} 次考试`;
  runQuiz({ title, qs, onDone: (sc, tot) => {
    const st = Math.max(1, streak()), m = multOf(st);
    if (kind === "prac") { const xp = Math.round(sc * 3); S.xp += xp; S.exams.push({ wk: S.cur.weekStart, n: 0, prac: 1, d: todayK(), sc, tot }); save(); checkBadges(); renderChrome(); return `练习 +${xp} XP`; }
    if (kind === "final") {
      const pass = sc / tot >= 0.8; S.final = { d: todayK(), sc, tot, pass: pass || (S.final && S.final.pass) }; S.exams.push({ wk: S.cur.weekStart, n: 9, d: todayK(), sc, tot });
      if (pass) { S.xp += 1000; S.coins += 200; save(); checkBadges(); setTimeout(ultimate, 600); return "通过！+1000 XP，终极奖励已解锁"; }
      save(); return "需要 80% 才能通过，复习后再来";
    }
    const xp = Math.round(sc * 10 * m); S.xp += xp; S.coins += sc; S.exams.push({ wk: S.cur.weekStart, n, d: todayK(), sc, tot }); save(); checkBadges(); renderChrome();
    if (sc === tot) confetti(120);
    return `+${xp} XP（×${m}）· 金币 +${sc}`;
  } });
}
function ultimate() {
  S.set.skin = S.set.skin === "auto" ? "gold" : S.set.skin; save(); applySettings();
  const nm = S.set.name || Cloud.name || "学习者";
  modal(`<div class="reveal"><div class="tag g">终极奖励</div><h2>你完成了 20 篇 TED 精读，并通过了终极考试</h2>
  <div class="cards" style="width:100%;grid-template-columns:repeat(5,1fr)">${ARTS.map(a => `<div style="height:44px;border-radius:8px;background:linear-gradient(150deg,${CATCOL[a.cat][0]},${CATCOL[a.cat][1]})"></div>`).join("")}</div>
  <p class="muted">已解锁「鎏金」阅读主题、「精读大师」称号，并可下载你的结业证书（${esc(nm)}）。</p></div>
  <div class="acts"><button class="btn ghost" data-act="close">稍后</button><button class="btn gold" data-act="cert">下载结业证书 PDF</button></div>`);
  confetti(260);
}

/* ---------- views: exam ---------- */
function vExam() {
  const wd = Math.max(0, weekDay());
  const hist = S.exams.slice().reverse().slice(0, 30);
  const finalOpen = S.done.length >= 20;
  return `<div class="sechead"><h2><span class="no">5</span>考试</h2></div>
  <div class="grid2">
    <div class="panel" id="s-week"><h3>5.1 本周考试</h3><p class="muted" style="font-size:13px">每周两次，每次约 10 题。题目来自你点学过的单词、分析过的句子，以及本周与近期文章内容。第 1 次在本周第 3 天开放，第 2 次在第 6 天开放。</p><div class="row">${examBtn(1, examTaken(1), wd)}${examBtn(2, examTaken(2), wd)}</div></div>
    <div class="panel" id="s-prac"><h3>5.2 随时练习</h3><p class="muted" style="font-size:13px">不限次数，题型与考试相同，只给少量经验，适合考前热身。</p><button class="btn ghost" data-act="exam" data-n="prac">开始练习</button></div>
    <div class="panel" id="s-final"><h3>5.3 终极考试</h3><p class="muted" style="font-size:13px">完成全部 20 篇后开放，20 题覆盖整个资源库，80% 及格。通过可获得终极奖励与结业证书。</p>
      ${S.final && S.final.pass ? `<div class="row"><span class="tag g">已通过 ${S.final.sc}/${S.final.tot}</span><button class="btn sm gold" data-act="cert">下载证书</button></div>` : `<div class="bar gold"><i style="width:${S.done.length * 5}%"></i></div><div class="row" style="margin-top:8px"><button class="btn gold" data-act="exam" data-n="final" ${finalOpen ? "" : "disabled"}>${finalOpen ? "开始终极考试" : "已完成 " + S.done.length + "/20"}</button></div>`}</div>
  </div>
  <div class="sec" id="s-hist"><div class="sechead"><h2><span class="no">5.4</span>成绩记录</h2></div>
  ${hist.length ? `<div class="panel tblwrap"><table class="tbl"><tr><th>日期</th><th>类型</th><th>得分</th></tr>${hist.map(e => `<tr><td class="num">${e.d}</td><td>${e.prac ? "练习" : e.n === 9 ? "终极考试" : "第 " + e.n + " 次周考"}</td><td class="num">${e.sc}/${e.tot}</td></tr>`).join("")}</table></div>` : '<div class="empty">还没有考试记录</div>'}</div>`;
}

/* ---------- views: memory ---------- */
function dueCards() { const t = todayK(); return Object.values(VOC).filter(v => LEX[v.k] && (!v.due || v.due <= t)); }
let MEMSORT = "recent";
function vMem() {
  const vs = Object.values(VOC).filter(v => LEX[v.k]);
  vs.sort(MEMSORT === "az" ? (a, b) => a.k.localeCompare(b.k) : MEMSORT === "freq" ? (a, b) => b.n - a.n : (a, b) => b.l - a.l);
  const ss = Object.entries(SEN).filter(([, v]) => AMAP[v.a]).sort((a, b) => b[1].l - a[1].l);
  const due = dueCards().length;
  return `<div class="sechead"><h2><span class="no">4</span>记忆库</h2><span class="muted">单词 ${vs.length} · 句子 ${ss.length}</span></div>
  <div class="panel row" style="justify-content:space-between" id="s-flash"><div><b>今日待复习 ${due} 个</b><div class="muted" style="font-size:12.5px">间隔复习：认识的词会在 1、2、4、7、15 天后再出现</div></div><button class="btn" data-act="flash" ${due ? "" : "disabled"}>开始强化复习</button></div>
  <div id="flashbox"></div>
  <div class="sec" id="s-words"><div class="sechead"><h2><span class="no">4.1</span>单词</h2><div class="seg"><button class="${MEMSORT === "recent" ? "on" : ""}" data-act="msort" data-m="recent">最近</button><button class="${MEMSORT === "freq" ? "on" : ""}" data-act="msort" data-m="freq">次数</button><button class="${MEMSORT === "az" ? "on" : ""}" data-act="msort" data-m="az">A–Z</button></div></div>
  ${vs.length ? `<div class="wlist">${vs.map(v => { const L = LEX[v.k]; return `<button class="witem" data-act="memword" data-k="${esc(v.k)}"><span class="top"><b>${esc(L.w)}</b><span class="faint" style="font-size:12px">/${esc(L.ph)}/</span></span><span class="m">${esc((L.tr[0] || "").slice(0, 34))}</span><span class="f">${esc(AMAP[v.a] ? AMAP[v.a].titleZh : "")} · 点击 ${v.n} 次 · 熟练度 ${v.box || 0}/5</span></button>`; }).join("")}</div>` : '<div class="empty">阅读时点击不认识的单词，它们会自动收进这里。</div>'}</div>
  <div class="sec" id="s-sents"><div class="sechead"><h2><span class="no">4.2</span>句子</h2></div>
  ${ss.length ? `<div class="slist">${ss.map(([id, v]) => { const s = AMAP[v.a].sents[v.s]; return `<button class="sitem" data-act="memsent" data-a="${v.a}" data-s="${v.s}">${esc(s.en)}<div class="zh">${esc(s.zh)}</div></button>`; }).join("")}</div>` : '<div class="empty">双击或长按句子中的单词，句子解析会保存在这里。</div>'}</div>`;
}
let FL = null;
function startFlash() { const d = shuffle(dueCards()); if (!d.length) { toast("今天没有待复习的单词"); return; } FL = { list: d, i: 0, flip: false }; drawFlash(); }
function drawFlash() {
  const box = $("#flashbox"); if (!box || !FL) return;
  if (FL.i >= FL.list.length) { box.innerHTML = `<div class="panel" style="margin-top:12px;text-align:center"><b>本轮复习完成</b><p class="muted">复习了 ${FL.list.length} 个单词。</p></div>`; FL = null; renderChrome(); return; }
  const v = FL.list[FL.i], L = LEX[v.k], a = AMAP[v.a], s = a ? a.sents[v.s] : null;
  box.innerHTML = `<div class="flash" style="margin-top:12px"><div class="faint num" style="text-align:center;font-size:12px;margin-bottom:6px">${FL.i + 1} / ${FL.list.length}</div>
  <div class="fcard" data-act="flip">${FL.flip ? `<div class="wd">${esc(L.w)}</div><div class="ph">/${esc(L.ph)}/</div><div>${L.tr.slice(0, 3).map(esc).join("<br>")}</div>${s ? `<div class="ex" style="text-align:left;margin-top:6px"><div class="en">${esc(s.en)}</div><div class="zh">${esc(s.zh)}</div></div>` : ""}` : `<div class="wd">${esc(L.w)}</div><button class="say" data-act="say" data-text="${esc(L.w)}">${I.vol}发音</button><div class="faint">点击卡片查看释义</div>`}</div>
  ${FL.flip ? `<div class="fbtns"><button class="btn warn" data-act="fl" data-r="0">不认识</button><button class="btn ghost" data-act="fl" data-r="1">模糊</button><button class="btn" data-act="fl" data-r="2">认识</button></div>` : ""}</div>`;
}
function rateFlash(r) {
  const v = FL.list[FL.i]; const iv = [0, 1, 2, 4, 7, 15];
  if (r === 0) { v.box = 0; v.due = todayK(); } else if (r === 1) { v.due = addDays(todayK(), 1); } else { v.box = Math.min(5, (v.box || 0) + 1); v.due = addDays(todayK(), iv[v.box]); }
  VOC[v.k] = v; putVoc(v.k); markStudy(); FL.i++; FL.flip = false; drawFlash();
}

/* ---------- views: rewards ---------- */
function vReward() {
  const st = streak(), lv = levelOf(S.xp), m = multOf(st);
  return `<div class="sechead"><h2><span class="no">7</span>成就奖励</h2></div>
  <div class="grid2" id="s-level">
    <div class="panel"><div class="lvl"><div class="big" style="font-size:36px;color:var(--gold)">Lv.${lv.i}</div><div style="flex:1"><b>${lv.name}</b><div class="bar gold" style="margin-top:6px"><i style="width:${lv.next ? Math.round((S.xp - lv.base) / (lv.next - lv.base) * 100) : 100}%"></i></div><div class="muted num" style="font-size:12px;margin-top:4px">${S.xp} XP${lv.next ? " / 下一级 " + lv.next : " · 满级"} · 金币 ${S.coins}</div></div></div></div>
    <div class="panel"><div class="streak">${flameSVG}<div><div class="big">${st} 天</div><div class="muted">连续学习倍率</div></div></div>
      <div class="mult">${[[1, 1, "起步"], [3, 1.2, "3 天"], [7, 1.5, "7 天"], [14, 2, "14 天"], [30, 3, "30 天"]].map(([d, x, l]) => `<div class="${m === x ? "on" : ""}"><b>×${x}</b>${l}</div>`).join("")}</div></div>
  </div>
  <div class="sec" id="s-cards"><div class="sechead"><h2><span class="no">7.2</span>主题卡收藏</h2><span class="muted">${Object.keys(S.cards).length}/20</span></div>
  <p class="muted" style="font-size:12.5px;margin-top:-4px">每完成一篇得一张卡。连续 3 天以上得「稀有」，7 天「史诗」，14 天「传说」；测验满分再升一级。</p>
  <div class="cards">${ARTS.map(a => S.cards[a.id] != null ? cardHTML(a, S.cards[a.id]) : `<div class="tcard lock"><div class="glyph" style="color:var(--line)">${CATGLYPH[a.cat]}</div><div style="font-size:11.5px">${esc(a.titleZh)}</div></div>`).join("")}</div></div>
  <div class="sec" id="s-badges"><div class="sechead"><h2><span class="no">7.3</span>徽章</h2><span class="muted">${S.badges.length}/${BADGES.length}</span></div>
  <div class="badges">${BADGES.map(b => `<div class="badge ${S.badges.includes(b[0]) ? "" : "off"}">${badgeSVG(b[3])}<b>${b[1]}</b><span class="muted">${b[2]}</span></div>`).join("")}</div></div>
  <div class="sec"><div class="panel" style="background:var(--gold-soft)"><b>终极奖励</b><div class="muted" style="font-size:13px">完成 20 篇并通过终极考试：解锁「鎏金」阅读主题、精读大师称号、+1000 XP 与结业证书。</div></div></div>`;
}

/* ---------- views: practice (listening & speaking) ---------- */
let PR_ID = null, PR_SI = 0;
function vPractice() {
  if (!PR_ID) PR_ID = S.cur.art || ARTS[0].id;
  const a = AMAP[PR_ID];
  return `<div class="sechead"><h2><span class="no">6</span>听说练习</h2><select id="prsel" data-act="prsel" style="max-width:60%;height:34px;border-radius:10px;border:1px solid var(--line);background:var(--card);padding:0 8px">${ARTS.map(x => `<option value="${x.id}" ${x.id === PR_ID ? "selected" : ""}>${esc(x.titleZh)}</option>`).join("")}</select></div>
  <div class="grid2">
  <div class="panel player" id="s-listen"><h3>6.1 听力通读</h3>
    <div class="pctrl"><button class="pbig" data-act="pplay" id="pplay" title="播放/暂停">${I.play}</button><button class="iconbtn" data-act="pstop" title="停止">${I.stop}</button>
      <div class="seg"><button data-act="acc" data-a="us" class="${S.set.voice === "us" ? "on" : ""}">美式</button><button data-act="acc" data-a="uk" class="${S.set.voice === "uk" ? "on" : ""}">英式</button></div>
      <label class="muted" style="font-size:12px;display:flex;align-items:center;gap:6px">语速 <input type="range" id="rate" min="0.6" max="1.3" step="0.05" value="${S.set.rate}" style="width:100px"> <span class="num" id="ratev">${S.set.rate.toFixed(2)}</span></label></div>
    <div class="faint" style="font-size:12px" id="vname"></div>
    <div class="plist" id="plist">${a.sents.map((s, i) => `<button class="pl" data-act="pfrom" data-i="${i}">${esc(s.en)}</button>`).join("")}</div>
    <div class="faint" style="font-size:11.5px">点击任意句子从该句开始播放。朗读使用设备内置语音，不同设备音色不同。</div>
  </div>
  <div class="panel player" id="s-speak"><h3>6.2 口语跟读</h3>
    <div class="row"><button class="btn sm ghost" data-act="sprev">上一句</button><span class="muted num" id="sidx">第 ${PR_SI + 1}/${a.sents.length} 句</span><button class="btn sm ghost" data-act="snext">下一句</button><div class="seg"><button data-act="sscope" data-x="s" class="on" id="scS">单句</button><button data-act="sscope" data-x="p" id="scP">整段</button></div></div>
    <div class="ex"><div class="en" id="starget" style="font-size:16px"></div></div>
    <div class="row"><button class="btn ghost" data-act="sorig">${I.vol}听原声</button><button class="btn" data-act="srec" id="srec">${I.mic}开始录音</button><label class="btn ghost sm" style="position:relative;overflow:hidden">上传录音<input type="file" accept="audio/*" capture id="supload" style="position:absolute;inset:0;opacity:0"></label></div>
    <canvas class="wave" id="wave" width="600" height="56"></canvas>
    <div id="sresult"></div>
  </div></div>`;
}
let SCOPE = "s";
function speakTarget() { const a = AMAP[PR_ID]; if (SCOPE === "s") return a.sents[PR_SI].en; const p = a.paras.find(pi => pi.includes(PR_SI)); return p.map(i => a.sents[i].en).join(" "); }
function afterPractice() {
  $("#starget").textContent = speakTarget();
  $("#rate").addEventListener("input", e => { S.set.rate = +e.target.value; $("#ratev").textContent = S.set.rate.toFixed(2); save(); });
  $("#supload").addEventListener("change", e => { const f = e.target.files[0]; if (f) gotRecording(f, null, 0); });
  const v = pickVoice(S.set.voice); $("#vname").textContent = v ? "当前语音：" + v.name + "（" + v.lang + "）" : "设备语音加载中…";
}

/* TTS */
let VOICES = [];
function loadVoices() { try { VOICES = speechSynthesis.getVoices() || []; } catch (e) { VOICES = []; } }
if ("speechSynthesis" in window) { loadVoices(); speechSynthesis.onvoiceschanged = () => { loadVoices(); const n = $("#vname"); if (n) { const v = pickVoice(S.set.voice); n.textContent = v ? "当前语音：" + v.name + "（" + v.lang + "）" : ""; } }; }
function pickVoice(acc) {
  const lang = acc === "uk" ? "en-GB" : "en-US";
  const vs = VOICES.filter(v => v.lang && v.lang.replace("_", "-").toLowerCase().startsWith(lang.toLowerCase()));
  const pref = ["Natural", "Premium", "Enhanced", "Neural", "Google", "Samantha", "Daniel", "Serena", "Ava", "Aria", "Libby", "Sonia"];
  for (const p of pref) { const v = vs.find(x => x.name.includes(p)); if (v) return v; }
  return vs[0] || VOICES.find(v => v.lang && v.lang.startsWith("en")) || null;
}
function say(text, acc, quiet, onend, onstart) {
  if (!("speechSynthesis" in window)) { if (!quiet) toast("当前浏览器不支持语音朗读"); return; }
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text); const v = pickVoice(acc || S.set.voice); if (v) { u.voice = v; u.lang = v.lang; } else u.lang = acc === "uk" ? "en-GB" : "en-US";
  u.rate = S.set.rate; if (onend) u.onend = onend; if (onstart) u.onstart = onstart; u.onerror = () => onend && onend(true);
  speechSynthesis.speak(u); return u;
}
let PLAY = null;
function playFrom(i) {
  const a = AMAP[PR_ID]; PLAY = { i, on: true };
  $("#pplay").innerHTML = I.pause; const step = () => {
    if (!PLAY || !PLAY.on) return; if (PLAY.i >= a.sents.length) { stopSpeak(); S.stats.listen++; save(); checkBadges(); toast("全文播放完毕"); return; }
    $$(".pl").forEach((b, j) => b.classList.toggle("on", j === PLAY.i)); const cur = $$(".pl")[PLAY.i]; if (cur) cur.scrollIntoView({ block: "nearest" });
    say(a.sents[PLAY.i].en, S.set.voice, false, err => { if (!PLAY || !PLAY.on) return; if (err === true && !PLAY.on) return; PLAY.i++; setTimeout(step, 120); });
  };
  markStudy(); step();
}
function stopSpeak(silent) { if (PLAY) PLAY.on = false; PLAY = null; try { speechSynthesis.cancel(); } catch (e) {} const b = $("#pplay"); if (b) b.innerHTML = I.play; }
function listenArticle(id) {
  if (VIEW === "read") {
    const a = AMAP[id]; if (PLAY) { stopSpeak(); return; }
    PLAY = { i: 0, on: true }; const step = () => { if (!PLAY || !PLAY.on) return; if (PLAY.i >= a.sents.length) { $$(".sent.speaking").forEach(x => x.classList.remove("speaking")); stopSpeak(); S.stats.listen++; save(); checkBadges(); return; }
      $$(".sent.speaking").forEach(x => x.classList.remove("speaking")); const el = $(`.sent[data-s="${PLAY.i}"]`); if (el) { el.classList.add("speaking"); el.scrollIntoView({ block: "center", behavior: S.set.motion ? "smooth" : "auto" }); }
      say(a.sents[PLAY.i].en, S.set.voice, false, () => { if (!PLAY || !PLAY.on) return; PLAY.i++; setTimeout(step, 120); }); };
    toast("开始通读，再点一次「听」停止"); markStudy(); step(); return;
  }
  PR_ID = id; go("practice", "s-listen");
}

/* recording */
let REC = null;
async function toggleRec() {
  if (REC) { REC.stop(); return; }
  let stream;
  try { stream = await navigator.mediaDevices.getUserMedia({ audio: true }); }
  catch (e) { $("#sresult").innerHTML = PWA ? `<div class="note">无法使用麦克风：${e && e.name === "NotAllowedError" ? "麦克风权限被拒绝。iPhone 请到「设置 → App → Safari → 麦克风」（主屏幕 App 跟随 Safari 的权限）改为「询问」或「允许」；电脑请点地址栏/窗口左上角的权限图标开启。" : "当前设备没有可用的麦克风。"}也可以用手机录音后点「上传录音」。</div>` : `<div class="note">无法使用麦克风：此页面在 Claude 内打开时不允许直接录音。可以用手机自带录音（如语音备忘录）录下跟读后，点「上传录音」进行对比；或安装 App 版，即可直接录音并自动比对差异。</div>`; return; }
  const chunks = []; const mr = new MediaRecorder(stream); let rec = null, transcript = "";
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (SR) { try { rec = new SR(); rec.lang = S.set.voice === "uk" ? "en-GB" : "en-US"; rec.continuous = true; rec.interimResults = false; rec.onresult = e => { transcript = [...e.results].map(r => r[0].transcript).join(" "); }; rec.start(); } catch (e) { rec = null; } }
  const ac = new (window.AudioContext || window.webkitAudioContext)(); const src = ac.createMediaStreamSource(stream); const an = ac.createAnalyser(); an.fftSize = 512; src.connect(an);
  const cv = $("#wave"), cx = cv.getContext("2d"), buf = new Uint8Array(an.fftSize); let raf;
  const draw = () => { an.getByteTimeDomainData(buf); cx.clearRect(0, 0, cv.width, cv.height); cx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue("--accent"); cx.lineWidth = 2; cx.beginPath(); buf.forEach((v, i) => { const x = i / buf.length * cv.width, y = v / 255 * cv.height; i ? cx.lineTo(x, y) : cx.moveTo(x, y); }); cx.stroke(); raf = requestAnimationFrame(draw); };
  draw(); const t0 = Date.now();
  mr.ondataavailable = e => chunks.push(e.data);
  mr.onstop = () => { cancelAnimationFrame(raf); stream.getTracks().forEach(t => t.stop()); ac.close(); if (rec) try { rec.stop(); } catch (e) {} REC = null; $("#srec").innerHTML = I.mic + "开始录音"; setTimeout(() => gotRecording(new Blob(chunks, { type: mr.mimeType || "audio/webm" }), transcript, (Date.now() - t0) / 1000), 400); };
  mr.start(); REC = mr; $("#srec").innerHTML = '<span class="recdot"></span> 停止录音'; markStudy();
}
let MYURL = null;
function gotRecording(blob, transcript, secs) {
  if (MYURL) URL.revokeObjectURL(MYURL); MYURL = URL.createObjectURL(blob);
  const target = speakTarget(); const words = target.split(/\s+/).length;
  S.stats.speak++; save(); checkBadges();
  let diff = "";
  if (transcript) {
    const norm = s => s.toLowerCase().replace(/[^a-z0-9'\s-]/g, " ").split(/\s+/).filter(Boolean);
    const A = norm(target), B = norm(transcript); const n = A.length, m = B.length; const dp = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
    for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) dp[i][j] = A[i] === B[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    let i = 0, j = 0; const out = []; while (i < n && j < m) { if (A[i] === B[j]) { out.push(`<span class="ok">${A[i]}</span>`); i++; j++; } else if (dp[i + 1][j] >= dp[i][j + 1]) { out.push(`<span class="miss">${A[i]}</span>`); i++; } else { out.push(`<span class="extra">${B[j]}</span>`); j++; } }
    while (i < n) out.push(`<span class="miss">${A[i++]}</span>`); while (j < m) out.push(`<span class="extra">${B[j++]}</span>`);
    const acc = Math.round(dp[0][0] / Math.max(1, n) * 100);
    diff = `<div class="blk"><h4>发音识别比对（准确率 ${acc}%）</h4><div class="diff">${out.join(" ")}</div><div class="legend"><span style="color:var(--ok)">绿色：读对</span><span style="color:var(--rose)">删除线：漏读/读错</span><span style="color:var(--gold)">斜体：多读或识别为其他词</span></div></div>`;
  } else diff = `<div class="faint" style="font-size:12px;margin-top:8px">当前环境不支持语音识别，可通过下方对比播放自己判断差异。</div>`;
  const myWpm = secs ? Math.round(words / secs * 60) : null;
  $("#sresult").innerHTML = `<div class="cmp" style="margin-top:8px"><div>你的录音<b>${secs ? secs.toFixed(1) + " 秒" : "已载入"}</b>${myWpm ? myWpm + " 词/分" : ""}</div><div>原文朗读参考<b id="origdur">—</b><span id="origwpm"></span></div></div>
  <audio id="myaudio" src="${MYURL}" controls style="width:100%;margin-top:8px"></audio>
  <div class="row" style="margin-top:6px"><button class="btn sm" data-act="ab">先听我的，再听原声</button><button class="btn sm ghost" data-act="sorig">只听原声</button></div>${diff}`;
}
function playOrig(after) {
  const t = speakTarget(), t0 = Date.now();
  say(t, S.set.voice, false, () => { const s = (Date.now() - t0) / 1000; const d = $("#origdur"); if (d && s > 0.3) { d.textContent = s.toFixed(1) + " 秒"; $("#origwpm").textContent = Math.round(t.split(/\s+/).length / s * 60) + " 词/分"; } after && after(); });
}

/* ---------- export ---------- */
function vExport() {
  const nv = Object.keys(VOC).filter(k => LEX[k]).length, ns = Object.keys(SEN).length;
  return `<div class="sechead"><h2><span class="no">8</span>导出</h2></div>
  <div class="grid2">
   <div class="panel" id="s-pdf"><h3>8.1 导出 PDF（详细学习笔记）</h3><p class="muted" style="font-size:13px">包含学习概况、每个点学单词的音标、词性、释义、词形与原文例句，以及每个分析过句子的翻译、主干、从句、时态语态和特殊用法标注。</p><div class="row"><span class="tag">单词 ${nv}</span><span class="tag">句子 ${ns}</span></div><button class="btn" style="margin-top:10px" data-act="pdf" ${nv + ns ? "" : "disabled"}>${I.out}生成 PDF</button></div>
   <div class="panel" id="s-xlsx"><h3>8.2 导出 Excel（单词表）</h3><p class="muted" style="font-size:13px">只导出点学过的单词：单词、音标、词性与释义、英文释义、词形变化、出处文章、原文例句与翻译、点击次数、首次学习日期、熟练度。</p><button class="btn" style="margin-top:10px" data-act="xlsx" ${nv ? "" : "disabled"}>${I.out}生成 Excel</button></div>
  </div><div id="expmsg" class="muted" style="margin-top:12px;font-size:13px"></div>`;
}
const LIBS = PWA ? { jspdf: "vendor/jspdf.umd.min.js", h2c: "vendor/html2canvas.min.js", xlsx: "vendor/xlsx.full.min.js" } : { jspdf: "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js", h2c: "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js", xlsx: "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js" };
const loaded = {};
function loadLib(k) { if (loaded[k]) return loaded[k]; loaded[k] = new Promise((res, rej) => { const s = document.createElement("script"); s.src = LIBS[k]; s.onload = res; s.onerror = () => { loaded[k] = null; rej(new Error("load")); }; document.head.appendChild(s); }); return loaded[k]; }
async function saveFile(name, blob) {
  if (window.claude && window.claude.use) {
    const dl = Cloud.downloads || await window.claude.use("downloads").catch(() => null);
    if (dl) { try { await dl.save({ filename: name, data: blob }); toast("已保存 " + name); return; } catch (e) { if (e && e.code === "declined") return; toast("保存失败：" + ((e && e.message) || "请稍后再试")); return; } }
    toast("当前查看方式不支持下载文件"); return;
  }
  if (isMobile()) { PENDING_FILE = { name, blob }; modal(`<h2>文件已生成</h2><p class="muted" style="word-break:break-all">${esc(name)} · ${(blob.size / 1024).toFixed(0)} KB</p><p class="muted" style="font-size:13px">${isIOS() ? "点「保存 / 分享」后选「存储到文件」，或直接发到微信、邮件。" : "点「保存 / 分享」选择保存位置或发送给其他应用。"}</p><div class="acts"><button class="btn ghost" data-act="filedl">直接下载</button><button class="btn" data-act="fileshare">保存 / 分享</button></div>`); return; }
  downloadBlob(name, blob); toast("已下载 " + name);
}
let PENDING_FILE = null;
function downloadBlob(name, blob) { const u = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = u; a.download = name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(u), 60000); }
async function shareFile() {
  const p = PENDING_FILE; if (!p) return;
  const file = new File([p.blob], p.name, { type: p.blob.type || "application/octet-stream" });
  if (navigator.canShare && navigator.canShare({ files: [file] })) { try { await navigator.share({ files: [file], title: p.name }); closeModal(); return; } catch (e) { if (e && e.name === "AbortError") return; } }
  downloadBlob(p.name, p.blob); closeModal();
}
const fmtDate = t => dkey(new Date(t));
async function exportXlsx() {
  const msg = $("#expmsg"); msg.textContent = "正在生成 Excel…";
  try { await loadLib("xlsx"); } catch (e) { msg.textContent = PWA ? "表格组件加载失败，请刷新应用后重试。" : "表格组件加载失败，请检查网络后重试。"; return; }
  const rows = Object.values(VOC).filter(v => LEX[v.k]).sort((a, b) => a.t - b.t).map(v => { const L = LEX[v.k], a = AMAP[v.a], s = a ? a.sents[v.s] : null;
    return { "单词": L.w, "音标": L.ph ? "/" + L.ph + "/" : "", "词性与释义": L.tr.join("；"), "英文释义": (L.def || [])[0] || "", "词形变化": Object.entries(L.ex || {}).map(([k, x]) => k + ":" + x).join(" "), "考试标签": (L.tags || []).join(" "), "出处文章": a ? a.title + "（" + a.titleZh + "）" : "", "原文例句": s ? s.en : "", "例句翻译": s ? s.zh : "", "点击次数": v.n, "首次学习": fmtDate(v.t), "熟练度": (v.box || 0) + "/5" }; });
  const ws = XLSX.utils.json_to_sheet(rows); ws["!cols"] = [14, 16, 40, 40, 30, 20, 34, 60, 40, 8, 12, 8].map(w => ({ wch: w }));
  const wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, ws, "单词表");
  const out = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  msg.textContent = ""; await saveFile("TED精读_单词表_" + todayK() + ".xlsx", new Blob([out], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }));
}
async function renderPagesToPdf(pages, name, landscape) {
  await Promise.all([loadLib("jspdf"), loadLib("h2c")]);
  const { jsPDF } = window.jspdf; const pdf = new jsPDF({ orientation: landscape ? "l" : "p", unit: "pt", format: "a4" });
  const W = pdf.internal.pageSize.getWidth(), H = pdf.internal.pageSize.getHeight();
  const root = $("#pdfroot"); root.classList.add("rendering"); const sy = window.scrollY;
  try {
    for (let i = 0; i < pages.length; i++) { const c = await html2canvas(pages[i], { scale: 2, backgroundColor: "#FFFFFF", logging: false, scrollX: 0, scrollY: -sy, windowWidth: Math.max(1200, document.documentElement.clientWidth) }); if (i) pdf.addPage(); pdf.addImage(c.toDataURL("image/jpeg", 0.9), "JPEG", 0, 0, W, H); }
  } finally { root.classList.remove("rendering"); }
  await saveFile(name, pdf.output("blob"));
}
async function exportPdf() {
  const msg = $("#expmsg"); msg.textContent = "正在排版 PDF…";
  const root = $("#pdfroot"); root.innerHTML = "";
  const items = [];
  const vs = Object.values(VOC).filter(v => LEX[v.k]).sort((a, b) => a.t - b.t);
  const ss = Object.values(SEN).filter(v => AMAP[v.a]).sort((a, b) => a.t - b.t);
  items.push(`<h1>TED 精读学习笔记</h1><div style="color:#5A6B62;margin:4px 0 14px">导出日期 ${todayK()} · 已完成 ${S.done.length}/20 篇 · 点学单词 ${vs.length} 个 · 分析句子 ${ss.length} 句 · 连续学习 ${streak()} 天 · Lv.${levelOf(S.xp).i}</div>`);
  if (S.done.length) items.push(`<h2>已完成文章</h2>` + S.done.map(d => `<div>· ${esc(AMAP[d.a].title)}（${esc(AMAP[d.a].titleZh)}）— ${d.d}</div>`).join(""));
  if (vs.length) { items.push("<h2>一、单词详注</h2>"); vs.forEach((v, i) => { const L = LEX[v.k], a = AMAP[v.a], s = a ? a.sents[v.s] : null, K = a && a.keys[v.k];
    items.push(`<div class="pw"><b>${i + 1}. ${esc(L.w)}</b> <span style="color:#5A6B62">/${esc(L.ph)}/</span> ${(L.tags || []).slice(0, 4).map(t => `<span style="font-size:10px;color:#B3801F">${t}</span>`).join(" ")}<div>${L.tr.map(esc).join("；")}</div>${Object.keys(L.ex || {}).length ? `<div style="color:#5A6B62;font-size:11px">${Object.entries(L.ex).map(([k, x]) => k + " " + esc(x)).join(" · ")}</div>` : ""}${K ? `<div><b>用法</b>：${esc(K.use)}<br><i>${esc(K.ex)}</i> ${esc(K.exZh)}</div>` : ""}${s ? `<div style="margin-top:3px"><b>原文</b>：${esc(s.en)}<br><span style="color:#5A6B62">${esc(s.zh)}</span></div>` : ""}<div style="color:#8A9A91;font-size:10.5px">出处：${esc(a ? a.titleZh : "")} · 点击 ${v.n} 次 · ${fmtDate(v.t)}</div></div>`); }); }
  if (ss.length) { items.push("<h2>二、句子解析</h2>"); ss.forEach((v, i) => { const a = AMAP[v.a], s = a.sents[v.s], an = s.an;
    items.push(`<div class="pw"><b>${i + 1}.</b> ${esc(s.en)}<div style="color:#5A6B62">${esc(s.zh)}</div><div class="an">句型：${esc(an.kind)}${an.passive ? " · 含被动" : ""}${an.inv ? " · 倒装" : ""}　主干：<span style="color:#2B5FA0">${esc(an.skel.S)}</span> | <span style="color:#B4433A">${esc(an.skel.V)}</span>${an.skel.O ? " | <span style='color:#2F7D47'>" + esc(an.skel.O) + "</span>" : ""}</div>${an.clauses.map(c => `<div class="an">· ${esc(c.type)}：${esc(c.text)}${c.detail ? "（" + esc(c.detail) + "）" : ""}</div>`).join("")}<div class="an">谓语：${an.verbs.map(x => esc(x.form) + "（" + esc(x.tense) + "，" + esc(x.voice) + "）").join("；")}</div>${an.nf.length ? `<div class="an">非谓语：${an.nf.map(x => esc(x.word) + "（" + esc(x.type) + "作" + esc(x.fn) + "）").join("；")}</div>` : ""}${an.notes.map(n => `<div class="an" style="color:#8A6413">★ ${esc(n)}</div>`).join("")}${AIC["s_" + v.a + "_" + v.s] && AIC["s_" + v.a + "_" + v.s].structure ? `<div class="an">AI：${esc(AIC["s_" + v.a + "_" + v.s].structure)}</div>` : ""}<div style="color:#8A9A91;font-size:10.5px">出处：${esc(a.titleZh)}</div></div>`); }); }
  // paginate
  const pages = []; let page = null, used = 0; const LIM = 1123 - 56 - 80;
  const newPage = () => { page = document.createElement("div"); page.className = "pp"; root.appendChild(page); pages.push(page); used = 0; };
  newPage();
  for (const h of items) { const d = document.createElement("div"); d.innerHTML = h; page.appendChild(d); const hgt = d.offsetHeight + 4; if (used + hgt > LIM && used > 0) { page.removeChild(d); newPage(); page.appendChild(d); used = d.offsetHeight + 4; } else used += hgt; }
  pages.forEach((p, i) => { const f = document.createElement("div"); f.className = "ft"; f.innerHTML = `<span>TED 精读计划 · 学习笔记</span><span>${i + 1} / ${pages.length}</span>`; p.appendChild(f); });
  try { msg.textContent = `正在渲染 ${pages.length} 页…`; await renderPagesToPdf(pages, "TED精读_学习笔记_" + todayK() + ".pdf"); msg.textContent = ""; }
  catch (e) { msg.textContent = PWA ? "PDF 组件加载失败，请刷新应用后重试。" : "PDF 组件加载失败，请检查网络后重试。"; }
  root.innerHTML = "";
}
async function exportCert() {
  const root = $("#pdfroot"); root.innerHTML = `<div class="cert"><div style="letter-spacing:6px;color:#8A6413">CERTIFICATE OF COMPLETION</div><div style="font-size:40px;font-weight:700">TED 精读结业证书</div><div style="font-size:18px">授予</div><div style="font-size:32px;font-weight:700;border-bottom:2px solid #C99A2E;padding:0 40px 6px">${esc(S.set.name || Cloud.name || "学习者")}</div>
  <div style="font-size:16px;max-width:760px;line-height:1.8">完成 20 篇 TED 主题精读，点学单词 ${Object.keys(VOC).length} 个，分析句子 ${Object.keys(SEN).length} 句，并以 ${S.final ? S.final.sc + "/" + S.final.tot : ""} 的成绩通过终极考试，获得「精读大师」称号。</div><div style="color:#6E6247">${todayK()}</div></div>`;
  try { await renderPagesToPdf([root.firstChild], "TED精读_结业证书.pdf", true); } catch (e) { toast(PWA ? "证书生成失败，请刷新应用后重试" : "证书生成失败，请检查网络后重试"); }
  root.innerHTML = "";
}

/* ---------- settings ---------- */
function vPrefs() {
  const sk = [["auto", "跟随系统"], ["green", "豆沙绿"], ["paper", "暖纸"], ["night", "夜读"]].concat(S.final && S.final.pass ? [["gold", "鎏金"]] : []);
  return `<div class="sechead"><h2><span class="no">9</span>设置</h2></div>
  <div class="panel set">
   <div class="setrow"><div class="l"><b>正文字号</b><span>阅读区英文与中文字号</span></div><div class="row"><input type="range" id="fsr" min="14" max="26" step="1" value="${S.set.fs}"><span class="num" id="fsv">${S.set.fs}px</span></div></div>
   <div class="setrow"><div class="l"><b>阅读背景</b><span>低饱和护眼配色，长时间阅读更舒适</span></div><div class="seg">${sk.map(([k, n]) => `<button class="${S.set.skin === k ? "on" : ""}" data-act="skin" data-k="${k}">${n}</button>`).join("")}</div></div>
   <div class="setrow"><div class="l"><b>英文正文字体</b><span>默认微软雅黑；Literata 为专为长文阅读设计的衬线体</span></div><div class="seg"><button class="${S.set.font === "yahei" ? "on" : ""}" data-act="font" data-k="yahei">微软雅黑</button><button class="${S.set.font === "serif" ? "on" : ""}" data-act="font" data-k="serif" style="font-family:var(--serif)">Literata</button></div></div>
   <div class="setrow"><div class="l"><b>发音</b><span>查词与通读默认口音</span></div><div class="seg"><button class="${S.set.voice === "us" ? "on" : ""}" data-act="acc" data-a="us">美式</button><button class="${S.set.voice === "uk" ? "on" : ""}" data-act="acc" data-a="uk">英式</button></div></div>
   <div class="setrow"><div class="l"><b>动效</b><span>奖励彩带、火焰与卡片流光</span></div><button class="switch ${S.set.motion ? "on" : ""}" data-act="motion" aria-label="动效开关"></button></div>
   <div class="setrow"><div class="l"><b>你的名字</b><span>显示在结业证书上</span></div><input type="text" id="nmin" class="txt" maxlength="20" placeholder="${esc(Cloud.name || "学习者")}" value="${esc(S.set.name || "")}"></div>
   <div class="setrow"><div class="l"><b>数据存储</b><span>${PWA ? "保存在本设备，断网也能用。手机和电脑之间用下方「备份 / 导入」互传" : Cloud.db ? "已登录，学习记录云端保存，手机和电脑打开同一链接即可同步" : "保存在本机浏览器；清除浏览器数据会丢失进度"}</span></div></div>
   <div class="setrow" id="s-backup"><div class="l"><b>备份与迁移</b><span>导出一个 .json 文件，在另一台设备${PWA ? "或 Claude 网页版" : "或 App 版"}里导入，进度会自动合并</span></div><div class="row"><button class="btn sm ghost" data-act="bkout">导出备份</button><label class="btn sm" style="position:relative;overflow:hidden">导入备份<input type="file" id="bkfile" accept=".json,application/json" style="position:absolute;inset:0;opacity:0"></label></div></div>
   <div class="setrow"><div class="l"><b>本周起始日</b><span>${S.cur.weekStart}（第一次打开的那天起算，每 7 天一周）</span></div></div>
${PWA ? aiPrefs() + appPrefs() : ""}
   <div class="setrow"><div class="l"><b>重置全部进度</b><span>清空单词、句子、奖励与考试记录</span></div><button class="btn sm warn" data-act="reset1">重置</button></div>
  </div>`;
}

function aiPrefs() {
  const c = aiCfg();
  return `<div class="setrow col" id="s-ai"><div class="l"><b>AI 解析服务（可选）</b><span>查词和整句解析里的「AI 补充」需要你自己的 API 密钥。密钥只保存在本设备，不会写入备份文件。部分服务商不允许浏览器直连，可点「测试」确认。</span></div>
  <div class="aigrid"><label>服务商<select id="aiprov">${Object.entries(AI_PRESETS).map(([k, p]) => `<option value="${k}" ${c.prov === k ? "selected" : ""}>${p[0]}</option>`).join("")}</select></label>
  <label>接口地址<input type="text" id="aibase" class="txt" value="${esc(c.base)}" placeholder="https://…" autocomplete="off" spellcheck="false"></label>
  <label>模型<input type="text" id="aimodel" class="txt" value="${esc(c.model)}" autocomplete="off" spellcheck="false"></label>
  <label>API 密钥<input type="password" id="aikey" class="txt" value="${esc(c.key)}" placeholder="sk-…" autocomplete="off"></label></div>
  <div class="row"><button class="btn sm" data-act="aisave">保存</button><button class="btn sm ghost" data-act="aitest">测试</button>${c.key ? '<button class="btn sm warn" data-act="aiclear">清除密钥</button>' : ""}<span id="aimsg" class="muted" style="font-size:12.5px"></span></div></div>`;
}
function appPrefs() {
  return `<div class="setrow" id="s-app"><div class="l"><b>App</b><span>版本 ${APP_VER} · ${isStandalone() ? "已安装到桌面" : "尚未安装"} · 联网时自动检查更新</span></div><div class="row">${isStandalone() ? "" : '<button class="btn sm" data-act="install">安装到桌面</button>'}<button class="btn sm ghost" data-act="chkupd">检查更新</button></div></div>`;
}
function readAiForm() { return { prov: $("#aiprov").value, base: $("#aibase").value.trim(), model: $("#aimodel").value.trim(), key: $("#aikey").value.trim() }; }

/* ---------- popups ---------- */
function sheet(head, body, o = {}) {
  closeSheet();
  const scrim = document.createElement("div"); scrim.className = "scrim"; scrim.dataset.act = "closesheet";
  const el = document.createElement("div"); el.className = "sheet " + (o.kind || "float");
  el.innerHTML = `<div class="grab"></div><div class="sh">${head}<button class="iconbtn" data-act="closesheet" aria-label="关闭">${I.x}</button></div><div class="sb">${body}</div>`;
  const mode = document.documentElement.dataset.mode;
  if (mode === "L" && o.kind === "float") scrim.style.background = "transparent";
  document.body.append(scrim, el);
  if (mode === "L" && o.kind === "float") {
    const r = o.anchor ? o.anchor.getBoundingClientRect() : { left: innerWidth / 2 - 200, bottom: 120, top: 100 };
    const w = el.offsetWidth, h = el.offsetHeight;
    let x = Math.min(Math.max(12, r.left - 20), innerWidth - w - 12); let y = r.bottom + 10; if (y + h > innerHeight - 70) y = Math.max(12, r.top - h - 10);
    el.style.left = x + "px"; el.style.top = y + "px";
  }
}
function closeSheet() { $$(".sheet,.scrim").forEach(x => x.remove()); $$(".w.act").forEach(x => x.classList.remove("act")); }
let modalLock = false;
function modal(html, o = {}) {
  closeModal(true); modalLock = !!o.lock;
  const scrim = document.createElement("div"); scrim.className = "scrim mscrim"; if (!o.lock) scrim.dataset.act = "close"; scrim.style.zIndex = 65;
  const m = document.createElement("div"); m.className = "modal"; if (o.wide) m.style.width = "min(680px,94vw)"; m.innerHTML = html;
  document.body.append(scrim, m);
}
function closeModal(force) { if (modalLock && !force) return; modalLock = false; $$(".modal,.mscrim").forEach(x => x.remove()); }
function closeMenus() { $$(".menu").forEach(m => m.remove()); }
function tocMenu(btn) {
  closeMenus(); const mode = document.documentElement.dataset.mode;
  if (mode === "L") { const c = !document.documentElement.classList.contains("sidecol"); document.documentElement.classList.toggle("sidecol", c); LS.set("sidecol", c); return; }
  const m = document.createElement("div"); m.className = "menu tocmenu";
  m.innerHTML = `<h4>目录</h4><div class="tg">${NAV.map(n => `<button class="ni ${VIEW === n.v ? "on" : ""}" data-act="go" data-v="${n.v}">${I[n.ic]}<span>${n.no}. ${n.n}</span></button>${VIEW === n.v && n.subs.length ? `<div class="subs">${n.subs.map((s, j) => `<button data-act="sub" data-v="${n.v}" data-a="${s[1]}">${n.no}.${j + 1} ${esc(s[0])}</button>`).join("")}</div>` : ""}`).join("")}</div>`;
  document.body.appendChild(m);
}
function screenMenu(btn) {
  closeMenus(); const r = btn.getBoundingClientRect(); const cur = document.documentElement.dataset.mode;
  const m = document.createElement("div"); m.className = "menu";
  m.innerHTML = `<button class="${cur === "L" ? "on" : ""}" data-act="setscreen" data-m="L">大屏</button><button class="${cur === "S" ? "on" : ""}" data-act="setscreen" data-m="S">小屏</button>`;
  document.body.appendChild(m);
  const h = m.offsetHeight, w = m.offsetWidth; m.style.left = Math.max(10, Math.min(r.right - w, innerWidth - w - 10)) + "px";
  m.style.top = (cur === "S" ? r.top - h - 8 : r.bottom + 8) + "px";
}
let toastT = null;
function toast(t) { const el = $("#toast"); el.textContent = t; el.classList.add("on"); clearTimeout(toastT); toastT = setTimeout(() => el.classList.remove("on"), 2600); }

/* confetti */
function confetti(n) {
  if (!S.set.motion || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const cv = $("#fx"), cx = cv.getContext("2d"); cv.width = innerWidth * devicePixelRatio; cv.height = innerHeight * devicePixelRatio; cx.scale(devicePixelRatio, devicePixelRatio);
  const cols = ["#E4572E", "#F3A33B", "#2B6A5C", "#7CC3B0", "#B48CF0", "#F2C35B", "#2B5FA0"];
  const ps = Array.from({ length: n }, () => ({ x: innerWidth / 2 + (Math.random() - .5) * 200, y: innerHeight * .35, vx: (Math.random() - .5) * 12, vy: -Math.random() * 12 - 4, r: Math.random() * 6 + 3, c: pick(cols), a: Math.random() * 6, va: (Math.random() - .5) * .3 }));
  const t0 = performance.now();
  const f = t => { const el = t - t0; cx.clearRect(0, 0, innerWidth, innerHeight); ps.forEach(p => { p.vy += .35; p.x += p.vx; p.y += p.vy; p.a += p.va; cx.save(); cx.translate(p.x, p.y); cx.rotate(p.a); cx.fillStyle = p.c; cx.globalAlpha = Math.max(0, 1 - el / 2200); cx.fillRect(-p.r, -p.r / 2, p.r * 2, p.r); cx.restore(); }); if (el < 2200) requestAnimationFrame(f); else cx.clearRect(0, 0, innerWidth, innerHeight); };
  requestAnimationFrame(f);
}

/* ---------- events ---------- */
let resetArmed = false;
document.addEventListener("click", e => {
  const t = e.target.closest("[data-act]");
  if (!t) { if (!e.target.closest(".menu")) closeMenus(); onWordClick(e); return; }
  const act = t.dataset.act, ds = t.dataset;
  if (!t.closest(".menu") && act !== "toc" && act !== "screen") closeMenus();
  switch (act) {
    case "go": closeModal(true); closeSheet(); go(ds.v, ds.a); break;
    case "sub": closeMenus(); if (VIEW !== ds.v) go(ds.v, ds.a); else doSub(ds.v, ds.a); break;
    case "toc": tocMenu(t); break;
    case "screen": screenMenu(t); break;
    case "setscreen": LS.set("screen", ds.m); closeMenus(); screenMode(); render(); break;
    case "read": openRead(ds.id); break;
    case "listen": listenArticle(ds.id); break;
    case "close": closeModal(); break;
    case "closesheet": closeSheet(); break;
    case "roll-ext": resolveRoll(true); break;
    case "roll-new": resolveRoll(false); break;
    case "topic": S.nextTopic = S.nextTopic === ds.c ? null : ds.c; save(); render(); toast(S.nextTopic ? "下周主题：" + S.nextTopic : "已取消选择"); break;
    case "cat": LIB_CAT = ds.c; render(); break;
    case "libopen": libOpen(ds.id); break;
    case "abandon": { const old = S.cur.art; if (!S.abandoned.includes(old)) S.abandoned.push(old); S.cur.art = ds.id; S.cur.bonus = false; S.abandoned = S.abandoned.filter(x => x !== ds.id); save(); closeModal(); toast("已放弃《" + AMAP[old].titleZh + "》，进度已保留"); openRead(ds.id); break; }
    case "bonus": S.cur.art = ds.id; S.cur.bonus = true; save(); closeModal(); openRead(ds.id); break;
    case "rmode": READ_MODE = ds.m; setReadMode(); if (READ_MODE === "zh") afterRead(); break;
    case "fs": S.set.fs = Math.max(14, Math.min(26, S.set.fs + +ds.d)); applySettings(); save(); break;
    case "say": say(ds.text, ds.acc || S.set.voice); break;
    case "finish": finishQuiz(); break;
    case "aiword": aiWord(ds.k, ds.a, +ds.s); break;
    case "aisent": aiSent(ds.a, +ds.s); break;
    case "qopt": QZ.ans[+ds.qi] = +ds.j; $$("input[data-qi]").forEach(i => QZ.ans[+i.dataset.qi] = i.value); { const sc = $(".modal").scrollTop; drawQuiz(); $(".modal").scrollTop = sc; } break;
    case "qsubmit": { const sc = 0; submitQuiz(); const m = $(".modal"); if (m) m.scrollTop = sc; break; }
    case "exam": closeModal(true); startExam(ds.n === "prac" ? "prac" : ds.n === "final" ? "final" : "week", +ds.n); break;
    case "memword": openWordFromMem(ds.k); break;
    case "memsent": sheet(`<div class="t"><b>整句解析</b><div class="faint" style="font-size:12px">${esc(AMAP[ds.a].titleZh)}</div></div>`, sentHTML(ds.a, +ds.s), { kind: "drawer" }); break;
    case "msort": MEMSORT = ds.m; render(); break;
    case "flash": startFlash(); break;
    case "flip": if (e.target.closest("[data-act=say]")) break; FL.flip = !FL.flip; drawFlash(); break;
    case "fl": rateFlash(+ds.r); break;
    case "pplay": if (PLAY) stopSpeak(); else playFrom(0); break;
    case "pstop": stopSpeak(); $$(".pl").forEach(b => b.classList.remove("on")); break;
    case "pfrom": stopSpeak(); playFrom(+ds.i); break;
    case "acc": S.set.voice = ds.a; save(); $$("[data-act=acc]").forEach(b => b.classList.toggle("on", b.dataset.a === ds.a)); { const n = $("#vname"); if (n) { const v = pickVoice(ds.a); n.textContent = v ? "当前语音：" + v.name + "（" + v.lang + "）" : "设备上没有该口音的语音，将使用默认英语语音"; } } break;
    case "sprev": case "snext": { const a = AMAP[PR_ID]; PR_SI = Math.max(0, Math.min(a.sents.length - 1, PR_SI + (act === "snext" ? 1 : -1))); $("#sidx").textContent = `第 ${PR_SI + 1}/${a.sents.length} 句`; $("#starget").textContent = speakTarget(); $("#sresult").innerHTML = ""; break; }
    case "sscope": SCOPE = ds.x; $("#scS").classList.toggle("on", SCOPE === "s"); $("#scP").classList.toggle("on", SCOPE === "p"); $("#starget").textContent = speakTarget(); break;
    case "sorig": playOrig(); break;
    case "srec": toggleRec(); break;
    case "ab": { const au = $("#myaudio"); if (!au) break; au.currentTime = 0; au.onended = () => { au.onended = null; setTimeout(() => playOrig(), 300); }; au.play().catch(() => playOrig()); break; }
    case "pdf": exportPdf(); break;
    case "xlsx": exportXlsx(); break;
    case "cert": closeModal(true); exportCert(); break;
    case "skin": S.set.skin = ds.k; save(); render(); break;
    case "font": S.set.font = ds.k; save(); render(); break;
    case "motion": S.set.motion = !S.set.motion; save(); render(); break;
    case "install": doInstall(); break;
    case "instno": LS.set("instDismiss", 1); render(); break;
    case "doupdate": doUpdate(); break;
    case "closeupd": { const u = $("#updbar"); if (u) u.remove(); break; }
    case "chkupd": checkUpdate(t); break;
    case "fileshare": shareFile(); break;
    case "filedl": if (PENDING_FILE) downloadBlob(PENDING_FILE.name, PENDING_FILE.blob); closeModal(); break;
    case "bkout": exportBackup(); break;
    case "aisave": { const c = readAiForm(); LS.set("aicfg", c); Cloud.sample = makeAI(); $("#aimsg").textContent = c.key ? "已保存" : "已保存（未填密钥，AI 功能关闭）"; break; }
    case "aiclear": { const c = readAiForm(); c.key = ""; LS.set("aicfg", c); Cloud.sample = null; render(); toast("已清除密钥"); break; }
    case "aitest": { const c = readAiForm(); if (!c.key) { $("#aimsg").textContent = "请先填写密钥"; break; } LS.set("aicfg", c); Cloud.sample = makeAI(); $("#aimsg").textContent = "测试中…"; Cloud.sample.json('请输出 {"ok":true,"word":"flourish","zh":"繁荣"}').then(r => { $("#aimsg").textContent = r && r.ok ? "连接成功，AI 补充已开启" : "已连通，但返回格式异常"; }).catch(e => { $("#aimsg").textContent = aiErr(e); }); break; }
    case "reset1": if (!resetArmed) { resetArmed = true; t.textContent = "再点一次确认"; setTimeout(() => { resetArmed = false; if (t.isConnected) t.textContent = "重置"; }, 3000); } else { const set = S.set; S = freshState(); S.set = set; VOC = {}; SEN = {}; AIC = {}; LS.set("voc", VOC); LS.set("sen", SEN); LS.set("ai", AIC); save(); if (Cloud.db) toast("已重置（云端旧单词记录会在下次覆盖）"); resetArmed = false; go("home"); } break;
  }
});
document.addEventListener("pointerdown", onWordDown); document.addEventListener("pointerup", onWordUp); document.addEventListener("pointercancel", onWordUp);
document.addEventListener("contextmenu", e => { if (e.target.closest(".w")) e.preventDefault(); });
document.addEventListener("change", e => {
  if (e.target.id === "bkfile") { const f = e.target.files[0]; if (f) importBackup(f); e.target.value = ""; return; }
  if (e.target.id === "nmin") { S.set.name = e.target.value.trim().slice(0, 20); save(); toast("已保存"); return; }
  if (e.target.id === "aiprov") { const p = AI_PRESETS[e.target.value]; $("#aibase").value = p[2]; $("#aimodel").value = p[3]; return; }
  if (e.target.id === "prsel") { PR_ID = e.target.value; PR_SI = 0; stopSpeak(); render(); } if (e.target.id === "fsr") { S.set.fs = +e.target.value; save(); } });
document.addEventListener("input", e => { if (e.target.id === "fsr") { S.set.fs = +e.target.value; $("#fsv").textContent = S.set.fs + "px"; applySettings(); } if (e.target.dataset.qi && QZ) QZ.ans[+e.target.dataset.qi] = e.target.value; });
document.addEventListener("keydown", e => { if (e.key === "Escape") { closeSheet(); closeMenus(); closeModal(); } });
window.addEventListener("resize", () => { if (!LS.get("screen")) { const before = document.documentElement.dataset.mode; screenMode(); if (before !== document.documentElement.dataset.mode) render(); } });
window.addEventListener("hashchange", () => { const h = location.hash.slice(1); if (NAVMAP[h] && h !== VIEW) go(h); });

/* ---------- boot ---------- */
loadLocal(); screenMode();
const h0 = location.hash.slice(1); if (NAVMAP[h0]) VIEW = h0;
if (VIEW === "read") READ_ID = S.cur.art || ARTS[0].id;
rollover(); render(); initCloud();
})();
