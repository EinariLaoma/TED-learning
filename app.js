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



/* ---------- state & storage ---------- */
function freshState() {
  const t = todayK();
  return { v: 1, ts: 0, cur: { art: null, weekStart: t, ext: 0, bonus: false }, nextTopic: null, prog: {}, done: [], abandoned: [], days: [], xp: 0, coins: 0, badges: [], cards: {}, exams: [], final: null, stats: { listen: 0, speak: 0 },
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
  VOC = LS.get("voc") || {}; SEN = LS.get("sen") || {}; AIC = LS.get("ai") || {}; if (FULL) { TR = LS.get("tr") || {}; ITEMS = LS.get("items") || {}; migrateV13(); } else if (S.cur.art && !isUser(S.cur.art)) S.cur.art = null;
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
  setTimeout(() => { ensureDict().then(() => renderChrome()).catch(() => {}); }, 1200);
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

function aiErr(e) {
  if (!PWA) return e && e.code === "not_granted" ? "未授权 AI 功能，可在页面权限中开启。" : "暂时无法生成，请稍后再试。";
  return "AI 调用失败：" + ((e && e.message) || "未知错误") + "。请到「设置 → AI 解析服务」检查。";
}

/* ---------- backup / sync between devices ---------- */
function backupObj() { return { app: "ted-jingdu", v: 1, at: Date.now(), from: PWA ? "app" : "claude", S, VOC, SEN, AIC, ITEMS: FULL ? ITEMS : undefined, TR: FULL ? JSON.parse(JSON.stringify(TR, (k, v) => k === "audio" ? null : v)) : undefined }; }
async function exportBackup() { await saveFile("TED精读_备份_" + todayK() + ".json", new Blob([JSON.stringify(backupObj())], { type: "application/json" })); }
function mergeBackup(b) {
  if (FULL && b.ITEMS) Object.values(b.ITEMS).forEach(m => { if (m && m.id && isUser(m.id) && !ITEMS[m.id] && b.TR && b.TR[m.id]) { ITEMS[m.id] = m; TR[m.id] = Object.assign(b.TR[m.id], { audio: null }); regItem(m); } });
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
  ["tprog", "mdone"].forEach(f => { out[f] = {}; new Set(Object.keys(L[f] || {}).concat(Object.keys(Rm[f] || {}))).forEach(k => { out[f][k] = [...new Set(((L[f] || {})[k] || []).concat((Rm[f] || {})[k] || []))]; }); });
  out.rmod = Object.assign({}, Rm.rmod || {}, L.rmod || {});
  if (FULL && b.TR) Object.entries(b.TR).forEach(([k, v]) => { if (AMAP[k] && v && v.paras && !TR[k]) { TR[k] = Object.assign(v, { audio: null }); } });
  out.stats = { listen: Math.max(L.stats.listen || 0, (Rm.stats || {}).listen || 0), speak: Math.max(L.stats.speak || 0, (Rm.stats || {}).speak || 0) };
  ["aiq", "aiw", "aibt"].forEach(f => { out.stats[f] = Math.max(L.stats[f] || 0, (Rm.stats || {})[f] || 0); });
  if (L.tm || Rm.tm) {
    const a = L.tm || {}, c = Rm.tm || {}, t = { plan: a.plan || c.plan, day: {}, pool: Math.max(a.pool || 0, c.pool || 0), pend: [], cnt: {}, paid: Object.assign({}, c.paid || {}, a.paid || {}), best: Math.max(a.best || 0, c.best || 0), tot: Math.max(a.tot || 0, c.tot || 0), pause: a.pause, run: a.run || null };
    new Set(Object.keys(a.day || {}).concat(Object.keys(c.day || {}))).forEach(k => { t.day[k] = Math.max((a.day || {})[k] || 0, (c.day || {})[k] || 0); });
    const pm = {}; (a.pend || []).concat(c.pend || []).forEach(x => { pm[x.t + x.at] = x; }); t.pend = Object.values(pm);
    ["c", "f", "g", "w"].forEach(k => { t.cnt[k] = Math.max((a.cnt || {})[k] || 0, (c.cnt || {})[k] || 0); });
    out.tm = t;
  }
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
    if (FULL) { migrateV13(); saveItems(); }
    save(); LS.set("voc", VOC); LS.set("sen", SEN); LS.set("ai", AIC); if (FULL) saveTR();
    if (Cloud.db) { Object.keys(VOC).forEach(k => putVoc(k)); Object.keys(SEN).forEach(id => putSen(id)); Object.keys(AIC).forEach(id => putAI(id)); }
    checkBadges(); render();
    modal(`<h2>导入完成</h2><p class="muted">新增单词 ${r.nv} 个、句子 ${r.ns} 句；已完成文章、连续学习天数、卡片和徽章已合并（经验和金币取两边较大值）。</p><div class="acts"><button class="btn" data-act="close">好的</button></div>`);
  };
  fr.readAsText(file);
}

/* ---------- derived ---------- */
const isDone = id => S.done.some(d => d.a === id);
const doneSet = () => new Set(S.done.map(d => d.a));
function progOf(id) { if (hasTR(id)) { const X = TX(id); return Math.min(1, tprog(id).size / X.flat.length); } const a = AMAP[id]; const p = S.prog[id]; return p ? Math.min(1, p.length / a.sents.length) : 0; }
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

let pendingRoll = false;




/* ---------- rewards & badges ---------- */

function badgeSVG(col) { return `<svg viewBox="0 0 48 48"><path d="M24 3l17 8v13c0 10-7 17-17 21C14 41 7 34 7 24V11z" fill="${col}"/><path d="M24 9l12 5.6V24c0 7-5 12-12 15-7-3-12-8-12-15v-9.4z" fill="none" stroke="#FFFFFF" stroke-opacity=".55" stroke-width="1.5"/><path d="M17 24l5 5 9-10" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>`; }

const RAR = ["普通", "稀有", "史诗", "传说"];
function cardHTML(a, r, big) {
  const [c1, c2] = CATCOL[a.cat];
  return `<div class="tcard r${r}" style="background:linear-gradient(150deg,${c1},${c2})">${r === 3 ? '<span class="foil"></span>' : ""}<span class="rar">${RAR[r]}</span>
  <div class="glyph">${CATGLYPH[a.cat]}</div><div><div class="qt" style="font-family:var(--read)">${esc(a.quote)}</div><div class="qt" style="opacity:.85;margin-top:4px">${esc(a.quoteZh)}</div>
  <div style="margin-top:6px;opacity:.8;font-size:10.5px">${esc(a.sub)} · ${esc(a.title)}</div></div></div>`;
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



const flameSmall = () => '<span style="color:#E4572E">●</span>';

function rerenderLight() { renderChrome(); }



/* ---------- views: home ---------- */

function planHTML(a, wd, done) {
  if (!hasTR(a.id) || done) return "";
  const X = TX(a.id), n = X.mods.length, md = new Set((S.mdone || {})[a.id] || []);
  const today = Math.min(n - 1, Math.floor(Math.min(6, wd) * n / 6));
  return `<div class="plan"><div class="row" style="justify-content:space-between"><b>本周分阶段计划</b><span class="muted" style="font-size:12px">${md.size}/${n} 部分完成 · 建议每天约 ${Math.ceil(n / 6)} 部分</span></div>
  <div class="planrow">${X.mods.map((m, i) => `<button class="pchip ${md.has(i) ? "ok" : ""} ${i === today && !md.has(i) ? "today" : ""}" data-act="readmod" data-id="${a.id}" data-i="${i + 1}"><b>${i + 1}</b><span>${md.has(i) ? "已读" : i === today ? "今天" : Math.round(modProg(a.id, i) * 100) + "%"}</span></button>`).join("")}<span class="pchip quiz ${progOf(a.id) >= 0.9 ? "today" : ""}"><b>测</b><span>完成</span></span></div></div>`;
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
  return `<div class="sechead"><h2>资源库</h2><span class="muted">${ds.size}/20 已完成</span></div>
  <div class="cattabs">${["全部"].concat(CATS).map(c => `<button class="${LIB_CAT === c ? "on" : ""}" data-act="cat" data-c="${c}">${c}${c !== "全部" ? " " + ARTS.filter(a => a.cat === c).length : ""}</button>`).join("")}</div>
  <div class="libgrid">${list.map(a => {
    const p = progOf(a.id), cur = a.id === S.cur.art, d = ds.has(a.id), ab = S.abandoned.includes(a.id);
    const [c1] = CATCOL[a.cat];
    return `<button class="acard" data-act="libopen" data-id="${a.id}"><span class="stripe" style="background:${c1}"></span>
    <span class="state">${d ? '<span class="tag g">已完成</span>' : cur ? '<span class="tag">本周</span>' : ab ? '<span class="tag r">已放弃</span>' : ""}</span>
    <span class="faint" style="font-size:11.5px">${a.cat} · ${esc(a.sub)}</span><h3>${esc(a.title)}</h3><span class="zh">${esc(a.titleZh)}</span>
    <span class="meta">${hasTR(a.id) ? `<span class="tag">全文 ${TX(a.id).mods.length} 部分${TR[a.id].audio ? " · 原声" : ""}</span>` : `<span>导读 ${a.words} 词</span>`}<span>·</span><span>TED ${a.ted.year} · ${esc(a.ted.speaker)}</span>${p > 0 && !d ? `<span class="tag">${Math.round(p * 100)}%</span>` : ""}</span></button>`;
  }).join("")}</div>
  <p class="faint" style="font-size:12px;margin-top:14px">${FULL ? "每篇先附一段约 250 词的原创导读；在阅读页点「导入演讲全文」，把 TED 官网的讲稿粘贴进来，就能分部分精读整场演讲。导入的讲稿和音频只保存在这台设备上。" : "每篇精读文为围绕对应 TED 演讲主题撰写的原创文本，卡片上标注的是可延伸观看的真实 TED 演讲。App 版支持导入演讲全文与现场音频。"}</p>`;
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

let readObs = null, readTick = null;
function afterRead() {
  const a = AMAP[READ_ID]; if (readObs) readObs.disconnect(); clearInterval(readTick);
  const set = new Set(S.prog[a.id] || []); const tset = tprog(a.id); const vis = new Map();
  readObs = new IntersectionObserver(es => { es.forEach(e => { const k = (e.target.dataset.m || "") + ":" + e.target.dataset.s; if (e.isIntersecting) { if (!vis.has(k)) vis.set(k, Date.now()); } else vis.delete(k); }); }, { threshold: 0.6 });
  $$(".sent", $("#reader")).forEach(s => readObs.observe(s));
  readTick = setInterval(() => {
    if (!$("#reader")) { clearInterval(readTick); return; }
    if (READ_MODE === "zh" || document.hidden) return;
    let dirty = false, tdirty = false; const now = Date.now();
    vis.forEach((t0, k) => {
      const [m, si] = k.split(":"), i = +si;
      if (m === "t") { if (tset.has(i)) return; const s = getS(a.id, i, "t"); const need = Math.max(2000, (s ? s.toks.filter(x => x[1]).length : 10) * 230); if (now - t0 >= need) { tset.add(i); tdirty = true; const el = $(`.sent[data-m="t"][data-s="${i}"]`); if (el) el.classList.add("rd"); } }
      else { if (set.has(i)) return; const need = Math.max(2000, a.sents[i].toks.length * 230); if (now - t0 >= need) { set.add(i); dirty = true; } }
    });
    if (dirty) S.prog[a.id] = [...set];
    if (tdirty) { S.tprog = S.tprog || {}; S.tprog[a.id] = [...tset]; checkModDone(a.id); }
    if (dirty || tdirty) { updReadProg(); saveSoon(); }
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
  clearTimeout(lpT); lpT = setTimeout(() => { lpFired = true; const s = w.closest(".sent"); openSent(READ_ID, +s.dataset.s, s.dataset.m); }, 520);
}
function onWordUp() { clearTimeout(lpT); }
function onWordClick(e) {
  const w = e.target.closest(".w"); if (!w || !$("#reader") || !$("#reader").contains(w)) return;
  if (lpFired) { lpFired = false; return; }
  const s = w.closest(".sent"); const key = s.dataset.s + ":" + w.dataset.t;
  if (clickT && lastTap === s.dataset.s) { clearTimeout(clickT); clickT = null; openSent(READ_ID, +s.dataset.s, s.dataset.m); return; }
  lastTap = s.dataset.s;
  clickT = setTimeout(() => { clickT = null; openWord(READ_ID, +s.dataset.s, +w.dataset.t, w, s.dataset.m); }, 260);
}
function recordWord(key, aid, si, m) {
  const now = Date.now(); const v = VOC[key];
  if (v) { v.n++; v.l = now; } else { VOC[key] = { k: key, a: aid, s: si, n: 1, t: now, l: now, box: 0, due: todayK() }; if (m === "t") VOC[key].m = "t"; }
  putVoc(key); markStudy(); checkBadges();
  $$(".w").forEach(el => { const sEl = el.closest(".sent"); if (!sEl || !READ_ID) return; const ss = getS(READ_ID, +sEl.dataset.s, sEl.dataset.m); const t = ss && ss.toks[+el.dataset.t]; if (t && t[1] === key) el.classList.add("seen"); });
  renderChrome();
}
function recordSent(aid, si, m) {
  const id = (m === "t" ? "T_" : "") + aid + "_" + si; const now = Date.now();
  if (SEN[id]) { SEN[id].n++; SEN[id].l = now; } else { SEN[id] = { a: aid, s: si, n: 1, t: now, l: now }; if (m === "t") SEN[id].m = "t"; }
  putSen(id); markStudy(); checkBadges(); renderChrome();
}
function wordInfoHTML(key, aid, si, ti, m) {
  const L = lx(key) || { w: key.replace(/^~/, ""), ph: "", tr: [], def: [], ex: {}, tags: [] };
  const a = AMAP[aid], s = a ? getS(aid, si, m) : null, tok = s && ti != null && ti >= 0 ? s.toks[ti] : null;
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
  const aiId = "w_" + safeId(key) + "_" + (aid || "").slice(0, 6) + (m === "t" ? "t" : "") + si;
  const aiBlk = !aid ? "" : AIC[aiId] ? aiWordHTML(AIC[aiId], key, aid, si, m) : (Cloud.sample ? `<button class="btn sm ghost" style="margin-top:12px" data-act="aiword" data-k="${esc(key)}" data-a="${aid}" data-s="${si}" data-m="${m || ""}">${I.spark}AI 例句</button><div id="aiw"></div>` : PWA ? `<button class="btn sm ghost" style="margin-top:12px" data-act="go" data-v="prefs" data-a="s-ai">${I.spark}开启 AI 例句（需在设置中填写密钥）</button>` : "");
  return `<div class="row" style="align-items:baseline"><span class="wd">${esc(L.w)}</span>${L.ph ? `<span class="ph">/${esc(L.ph)}/</span>` : ""}</div>
  <div class="row" style="margin-top:6px"><button class="say" data-act="say" data-text="${esc(L.w)}" data-acc="us">${I.vol}美音</button><button class="say" data-act="say" data-text="${esc(L.w)}" data-acc="uk">${I.vol}英音</button>${tok && tok[3] ? `<span class="tag">${esc(tok[3])}</span>` : ""}${(L.tags || []).slice(0, 5).map(t => `<span class="tag g">${t}</span>`).join("")}</div>
  ${formLine}
  <div class="blk"><h4>释义</h4><ul class="trl">${(L.tr || []).map(t => `<li>${esc(t)}</li>`).join("") || "<li class='muted'>专有名词或少见词，暂无词典释义</li>"}</ul>${(L.def || []).length ? `<div class="faint" style="font-size:12.5px;margin-top:4px">${esc(L.def[0])}</div>` : ""}</div>
  ${ex ? `<div class="blk"><h4>词形变化</h4><div style="font-size:13px">${ex}</div></div>` : ""}
  ${keyBlk}
  ${s ? `<div class="blk"><h4>原文例句</h4><div class="exs"><div class="ex"><div class="en">${hl(s.en, surface)}</div>${s.zh && !s.zhPara ? `<div class="zh">${esc(s.zh)}</div>` : ""}<div class="from">${esc(a.titleZh)}${m === "t" ? " · 精读全文" : ""} <button class="say" style="margin-left:6px" data-act="say" data-text="${esc(s.en)}">${I.vol}读句子</button></div></div></div></div>` : ""}
  ${others ? `<div class="blk"><h4>资源库中的其他例句</h4><div class="exs">${others}</div></div>` : ""}
  ${aiBlk}`;
}

function openWord(aid, si, ti, el, m) {
  const s = getS(aid, si, m), tok = s.toks[ti], key = tok[1]; if (!key) return;
  $$(".w.act").forEach(x => x.classList.remove("act")); if (el) el.classList.add("act");
  if (!key.startsWith("~")) recordWord(key, aid, si, m);
  sheet(`<div class="t"><b>单词详解</b></div>`, wordInfoHTML(key, aid, si, ti, m), { kind: "float", anchor: el });
  say(lx(key) ? lx(key).w : tok[0], S.set.voice, true);
}
function openWordFromMem(key) {
  const v = VOC[key]; const s = vSent(v); sheet(`<div class="t"><b>单词详解</b></div>`, wordInfoHTML(key, v ? v.a : null, v ? v.s : 0, s ? s.toks.findIndex(t => t[1] === key) : null, v && v.m), { kind: "float" });
}
function sentHTML(aid, si, m) {
  const a = AMAP[aid], s = getS(aid, si, m), an = s && s.an;
  if (!an) return `<div class="ansent">${esc(s ? s.en : "")}</div><p class="muted">分析组件加载中，请稍后再打开。</p>`;
  const T = m === "t" ? TR[aid] : null;
  const roles = an.role; const inCl = new Array(s.toks.length).fill(false);
  an.clauses.forEach(c => { for (let i = c.a; i <= c.b; i++) inCl[i] = true; });
  const toks = s.toks.map((t, i) => { const r = roles[i] || "-"; return `<span class="t ${r !== "-" ? r : ""} ${inCl[i] ? "cl" : ""}">${esc(t[0])}</span>${t[2]}`; }).join("");
  const sk = an.skel;
  const odName = d => ({ dobj: "宾语", attr: "表语", acomp: "表语", oprd: "宾补", dative: "间接宾语", ccomp: "宾语从句", xcomp: "补足语" }[d] || "宾语/表语");
  const verbs = an.verbs.map(v => `<tr><td style="font-family:var(--read)"><b>${esc(v.form)}</b></td><td>${esc(v.role)}</td><td>${esc(v.tense)}</td><td>${esc(v.voice)}</td></tr>`).join("");
  const nf = an.nf.map(n => `<tr><td style="font-family:var(--read)"><b>${esc(n.word)}</b></td><td>${esc(n.type)}</td><td>${esc(n.fn)}</td><td style="font-family:var(--read)">${esc(n.text)}</td></tr>`).join("");
  const aiId = "s_" + aid + "_" + (m === "t" ? "t" : "") + si;
  const audBtns = T ? (T.audio ? `<div class="row" style="margin-top:8px"><button class="btn sm" data-act="segplay" data-g="${si}">${I.play}原声播放这句</button><button class="btn sm ghost" data-act="loopsent" data-g="${si}">单句循环</button><button class="btn sm ghost" data-act="calib" data-g="${si}" title="音频正读到这句开头时点">这句从此刻开始</button></div>` : `<div class="row" style="margin-top:8px"><button class="btn sm ghost" data-act="audiopanel">${I.ear}导入现场原声</button></div>`) : "";
  return `<div class="ansent">${toks}</div>${audBtns}
  <div class="legend" style="margin-top:6px"><span><i style="background:var(--s)"></i>主语</span><span><i style="background:var(--v)"></i>谓语</span><span><i style="background:var(--o)"></i>宾语/表语</span><span><i style="background:color-mix(in srgb,var(--c) 30%,transparent)"></i>从句</span></div>
  <div class="row" style="margin-top:10px"><button class="say" data-act="say" data-text="${esc(s.en)}" data-acc="us">${I.vol}美音朗读</button><button class="say" data-act="say" data-text="${esc(s.en)}" data-acc="uk">${I.vol}英音朗读</button><span class="tag">${esc(an.kind)}</span><span class="tag ${an.passive ? "r" : ""}">${an.passive ? "含被动语态" : "主动语态"}</span>${an.inv ? '<span class="tag g">倒装</span>' : ""}</div>
  <div class="blk"><h4>${s.zhPara ? "本段译文" : "翻译"}</h4><div style="font-size:14.5px">${s.zh ? esc(s.zh) : s.zhPara ? '<span class="muted">没有导入中文讲稿。可以点「AI 深度解析」获取这句的翻译，或重新导入时一并粘贴中文讲稿。</span>' : ""}</div></div>
  <div class="blk"><h4>句子主干</h4><dl class="skel"><dt style="color:var(--s)">主语</dt><dd>${esc(sk.S) || "—"}</dd><dt style="color:var(--v)">谓语</dt><dd>${esc(sk.V) || "—"}</dd>${sk.O ? `<dt style="color:var(--o)">${odName(sk.Od[0])}</dt><dd>${esc(sk.O)}</dd>` : ""}</dl></div>
  ${an.clauses.length ? `<div class="blk"><h4>从句与分句</h4>${an.clauses.map(c => `<div class="ex"><span class="tag" style="background:color-mix(in srgb,var(--c) 16%,transparent);color:var(--c)">${esc(c.type)}</span> <span class="en">${esc(c.text)}</span>${c.detail ? `<div class="zh">${esc(c.detail)}</div>` : ""}</div>`).join("")}</div>` : ""}
  ${verbs ? `<div class="blk"><h4>谓语动词：时态与语态</h4><div class="tblwrap"><table class="tbl"><tr><th>动词</th><th>位置</th><th>时态</th><th>语态</th></tr>${verbs}</table></div></div>` : ""}
  ${nf ? `<div class="blk"><h4>非谓语形式（分词 / 动名词 / 不定式）</h4><div class="tblwrap"><table class="tbl"><tr><th>词</th><th>形式</th><th>作用</th><th>短语</th></tr>${nf}</table></div></div>` : ""}
  ${an.notes.length ? `<div class="blk"><h4>特殊用法</h4>${an.notes.map(n => `<div class="note">${esc(n)}</div>`).join("")}</div>` : ""}
  ${Cloud.sample ? `<div class="row sentai"><button class="btn sm ghost" data-act="hubask" data-a="${aid}" data-s="${si}" data-m="${m || ""}">${I.chat}问 AI 这句</button><button class="btn sm ghost" data-act="bt" data-a="${aid}" data-s="${si}" data-m="${m || ""}">${I.swap}回译练习</button></div>` : ""}
  ${AIC[aiId] ? aiSentHTML(AIC[aiId]) : Cloud.sample ? `<button class="btn sm ghost" style="margin-top:12px" data-act="aisent" data-a="${aid}" data-s="${si}" data-m="${m || ""}">${I.spark}AI 深度解析</button><div id="ais"></div>` : PWA ? `<button class="btn sm ghost" style="margin-top:12px" data-act="go" data-v="prefs" data-a="s-ai">${I.spark}开启 AI 深度解析（需在设置中填写密钥）</button>` : ""}
  <p class="faint" style="font-size:11.5px;margin-top:12px">${an.auto ? "句法成分由本机的浏览器端分析器自动标注，长难句可能有偏差；需要更准确的讲解可用 AI 深度解析。" : "句法成分由依存句法分析自动标注，复杂句可能有个别偏差，可结合翻译与特殊用法理解。"}</p>`;
}
function aiSentHTML(r) {
  if (!r) return "";
  return `<div class="ai"><b>AI 深度解析</b>${r.translation ? `<div style="margin-top:4px">译文：${esc(r.translation)}</div>` : ""}${r.structure ? `<div style="margin-top:4px">${esc(r.structure)}</div>` : ""}${(r.grammar || []).length ? `<ul>${r.grammar.map(g => `<li>${esc(g)}</li>`).join("")}</ul>` : ""}${(r.special || []).length ? `<div>特殊用法：</div><ul>${r.special.map(g => `<li>${esc(g)}</li>`).join("")}</ul>` : ""}${r.tip ? `<div class="faint">${esc(r.tip)}</div>` : ""}</div>`;
}
async function openSent(aid, si, m) {
  if (m === "t") { try { await ensureFull(); } catch (e) {} }
  $$(".sent.picked").forEach(x => x.classList.remove("picked"));
  const el = $(`.sent[data-s="${si}"]${m === "t" ? '[data-m="t"]' : ':not([data-m])'}`); if (el) el.classList.add("picked");
  recordSent(aid, si, m);
  sheet(`<div class="t"><b>整句解析</b><div class="faint" style="font-size:12px">${esc(AMAP[aid].titleZh)} · ${m === "t" ? "全文" : "导读"}第 ${si + 1} 句</div></div>`, sentHTML(aid, si, m), { kind: "drawer" });
}

async function aiSent(aid, si, m) {
  const box = $("#ais"); const btn = $("[data-act=aisent]"); if (btn) btn.disabled = true; if (box) box.innerHTML = '<div class="ai muted">正在解析…</div>';
  const s = getS(aid, si, m);
  try {
    const r = await Cloud.sample.json(`你是资深英语语法老师。请深度解析下面的英文句子，严格输出 JSON（不要其他文字）：{"translation":"这句话的准确中文翻译","structure":"句子结构与成分划分（中文，说明主干与修饰关系）","grammar":["语法要点（时态、语态、从句、非谓语等），每条一句"],"special":["习语、固定搭配、修辞或特殊用法，每条一句"],"tip":"一句学习提示"}\n句子：${s.en}\n${s.zh && !s.zhPara ? "参考译文：" + s.zh : s.zh ? "所在段落译文（仅供参考）：" + s.zh : ""}`, { modelTier: "default" });
    const id = "s_" + aid + "_" + (m === "t" ? "t" : "") + si; AIC[id] = r; putAI(id);
    if (box) box.innerHTML = aiSentHTML(r); if (btn) btn.remove();
  } catch (e) { if (box) box.innerHTML = `<div class="ai muted">${esc(aiErr(e))}</div>`; if (btn) btn.disabled = false; }
}

/* ---------- finish quiz ---------- */


/* ---------- exam generation ---------- */
const firstTr = k => { const L = lx(k); if (!L || !L.tr.length) return null; return L.tr[0].replace(/^\[[^\]]+\]\s*/, "").slice(0, 40); };
const posOf = k => { const L = lx(k); const m = L && L.tr[0] && L.tr[0].match(/^([a-z]+)\./); return m ? m[1] : ""; };
function distract(k, n, f) {
  const pos = posOf(k); const pool = shuffle(Object.keys(OCC)).filter(x => x !== k && firstTr(x) && x.length > 3 && (!pos || posOf(x) === pos));
  const out = []; const seen = new Set([f(k)]);
  for (const x of pool) { const v = f(x); if (v && !seen.has(v)) { seen.add(v); out.push(v); } if (out.length >= n) break; }
  return out;
}
function mkMeaning(k) { const L = lx(k); const ans = firstTr(k); if (!ans) return null; const o = shuffle([ans].concat(distract(k, 3, firstTr))); return { type: "mean", q: `单词 “${L.w}” 的意思是？`, o, a: o.indexOf(ans), exp: `${L.w} /${L.ph}/：${L.tr.slice(0, 2).join("；")}`, k }; }
function mkWord(k) { const L = lx(k); const tr = firstTr(k); if (!tr) return null; const o = shuffle([L.w].concat(distract(k, 3, x => lx(x).w))); return { type: "word", q: `哪个单词的意思是 “${tr}”？`, o, a: o.indexOf(L.w), exp: `${L.w}：${L.tr.slice(0, 2).join("；")}`, k }; }
function mkSpell(k) { const L = lx(k); const tr = firstTr(k); if (!tr || L.w.length < 4 || /[^a-z]/i.test(L.w)) return null; return { type: "spell", q: `拼写单词：${tr}（首字母 ${L.w[0]}，共 ${L.w.length} 个字母）`, ans: L.w.toLowerCase(), exp: `${L.w} /${L.ph}/`, k }; }
function findSentWith(k, prefer) {
  const occ = OCC[k] || []; if (!occ.length) return null;
  const o = (prefer && occ.find(([ai]) => ARTS[ai].id === prefer)) || pick(occ); return [ARTS[o[0]], o[1]];
}
function mkCloze(a, k, si) {
  if (si == null) { const f = a.sents.findIndex(s => s.toks.some(t => t[1] === k)); if (f < 0) { const r = findSentWith(k); if (!r) return null; a = r[0]; si = r[1]; } else si = f; }
  return mkClozeS(a.sents[si], k, a.sents);
}
function mkClozeS(s, k, poolSents, exp) {
  if (!s || !s.toks) return null;
  const ti = s.toks.findIndex(t => t[1] === k); if (ti < 0) return null;
  const surf = s.toks[ti][0]; const text = s.toks.map((t, i) => (i === ti ? "_____" : t[0]) + t[2]).join("");
  const pos = s.toks[ti][3]; const pool = shuffle(poolSents.flatMap(x => x.toks || []).filter(t => t[1] && !t[1].startsWith("~") && t[3] === pos && t[0].toLowerCase() !== surf.toLowerCase() && t[0].length > 3).map(t => t[0]));
  const o = shuffle([surf].concat([...new Set(pool)].slice(0, 3))); if (o.length < 3) return null;
  return { type: "cloze", q: "选词填空", sub: text, o, a: o.indexOf(surf), exp: exp != null ? exp : (s.zhPara ? "" : s.zh), k };
}
/* cloze from the imported full transcript: prefers exam-tagged words in sentences already read */
function mkClozeT(aid, k0) {
  const X = TX(aid); if (!X || !window.nlp) return null;
  const read = [...tprog(aid)]; const pool = read.length > 8 ? read : X.flat.map((_, i) => i);
  for (let tries = 0; tries < 8; tries++) {
    const g = pick(pool), s = getS(aid, g, "t"); if (!s) continue;
    const m = X.mods[X.modOf[g]]; const near = []; for (let x = Math.max(m.gs, g - 8); x <= Math.min(m.ge, g + 8); x++) near.push(getS(aid, x, "t"));
    let k = k0;
    if (!k) { const cands = s.toks.filter(t => t[1] && !t[1].startsWith("~") && t[0].length > 4 && (lx(t[1]) || {}).tags && lx(t[1]).tags.some(x => /CET6|考研|雅思|托福|GRE/.test(x))); if (!cands.length) continue; k = pick(cands)[1]; }
    const q = mkClozeS(s, k, near, "出自精读全文第 " + (X.modOf[g] + 1) + " 部分" + (s.zh ? "；本段译文：" + s.zh.slice(0, 80) + (s.zh.length > 80 ? "…" : "") : ""));
    if (q) { q.sub = q.sub; q.q = "选词填空（精读原文）"; return q; }
  }
  return null;
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
  const arts = (scope === "final" ? ARTS.concat(Object.keys(ITEMS).map(k => AMAP[k])) : [...new Set([curA].concat(S.done.slice(-3).map(d => AMAP[d.a])))]).filter(Boolean);
  const learned = Object.values(VOC).filter(v => lx(v.k)).sort((x, y) => y.l - x.l).map(v => v.k);
  const keyW = arts.flatMap(a => Object.keys(a.keys).filter(k => lx(k) && OCC[k]));
  const wpool = shuffle([...new Set(learned.slice(0, 40).concat(keyW))]);
  let spool = shuffle(Object.values(SEN).filter(x => AMAP[x.a] && !AMAP[x.a].user && x.m !== "t" && AMAP[x.a].sents[x.s]).map(x => [AMAP[x.a], x.s]).concat(arts.flatMap(a => a.sents.map((_, i) => [a, i]))));
  if (spool.length < 6) spool = spool.concat(shuffle((shortDone().length ? shortDone().map(d => AMAP[d.a]) : ARTS).flatMap(a => a.sents.map((_, i) => [a, i]))));
  const qs = []; const total = scope === "final" ? 20 : 10; let wi = 0, si = 0;
  const nextW = () => wpool[wi++ % Math.max(1, wpool.length)];
  const anyT = arts.some(a => hasTR(a.id)) && !!window.nlp;
  let plan = scope === "final" ? ["mean", "word", "spell", "cloze", "cloze", "trans", "comp", "comp", "comp", "gram", "mean", "word", "cloze", "trans", "comp", "comp", "gram", "spell", "mean", "comp"] : ["mean", "word", "mean", "spell", "cloze", "cloze", "trans", "gram", "comp", "comp"];
  if (anyT) plan = scope === "final" ? plan.map((x, i) => [5, 9, 13, 16].includes(i) ? "tclz" : x) : ["mean", "word", "mean", "spell", "cloze", "tclz", "tclz", "tclz", "gram", "comp"];
  const compPool = shuffle(arts.flatMap(a => a.quiz.map(q => ({ type: "comp", q: q.q, o: q.o, a: q.a, art: a.id }))));
  let ci = 0, guard = 0;
  for (const t of plan) {
    let q = null; guard = 0;
    while (!q && guard++ < 12) {
      if (t === "tclz" && guard > 4) { q = mkMeaning(nextW()); if (q) break; }
      if (t === "mean") q = mkMeaning(nextW()); else if (t === "word") q = mkWord(nextW()); else if (t === "spell") q = mkSpell(nextW());
      else if (t === "cloze") { const k = nextW(); const v = VOC[k]; if (v && v.m === "t" && hasTR(v.a) && window.nlp) { const X = TX(v.a); q = mkClozeS(getS(v.a, v.s, "t"), k, [getS(v.a, Math.max(0, v.s - 1), "t"), getS(v.a, Math.min(X.flat.length - 1, v.s + 1), "t")].filter(Boolean).concat(X.flat.slice(0, 40).map((_, i) => getS(v.a, i, "t")))); } else { const r = findSentWith(k, curA.id); q = r ? mkCloze(r[0], k, r[1]) : null; } }
      else if (t === "tclz") { const ids = arts.map(a => a.id).filter(hasTR); q = ids.length && window.nlp ? mkClozeT(pick(ids)) : null; }
      else if (t === "trans") { const [a, i] = spool[si++ % spool.length]; q = mkTrans(a, i); }
      else if (t === "gram") { const [a, i] = spool[si++ % spool.length]; q = mkGrammar(a, i); }
      else if (t === "comp") { q = compPool[ci++] || null; if (q) q.sub = "《" + AMAP[q.art].titleZh + "》"; else { const ids = arts.map(a => a.id).filter(hasTR); q = ids.length && window.nlp && guard < 6 ? mkClozeT(pick(ids)) : mkMeaning(nextW()); } }
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
async function startExam(kind, n) {
  if (FULL && Object.keys(TR).length) { try { await ensureFull(); } catch (e) {} }
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
  const finalOpen = jingDone().length >= 20;
  return `<div class="sechead"><h2>考试</h2></div>
  <div class="grid2">
    <div class="panel" id="s-week"><h3>本周考试</h3><p class="muted" style="font-size:13px">每周两次，每次约 10 题。题目来自你点学过的单词、分析过的句子，以及本周与近期文章内容。第 1 次在本周第 3 天开放，第 2 次在第 6 天开放。</p><div class="row">${examBtn(1, examTaken(1), wd)}${examBtn(2, examTaken(2), wd)}</div></div>
    <div class="panel" id="s-prac"><h3>随时练习</h3><p class="muted" style="font-size:13px">不限次数，题型与考试相同，只给少量经验，适合考前热身。</p><button class="btn ghost" data-act="exam" data-n="prac">开始练习</button></div>
    <div class="panel" id="s-final"><h3>终极考试</h3><p class="muted" style="font-size:13px">完成 20 篇精读后开放，20 题覆盖精读与短篇，80% 及格。通过可获得终极奖励与结业证书。</p>
      ${S.final && S.final.pass ? `<div class="row"><span class="tag g">已通过 ${S.final.sc}/${S.final.tot}</span><button class="btn sm gold" data-act="cert">下载证书</button></div>` : `<div class="bar gold"><i style="width:${Math.min(100, jingDone().length * 5)}%"></i></div><div class="row" style="margin-top:8px"><button class="btn gold" data-act="exam" data-n="final" ${finalOpen ? "" : "disabled"}>${finalOpen ? "开始终极考试" : "精读已完成 " + jingDone().length + "/20"}</button></div>`}</div>
  </div>
  <div class="sec" id="s-hist"><div class="sechead"><h2>成绩记录</h2></div>
  ${hist.length ? `<div class="panel tblwrap"><table class="tbl"><tr><th>日期</th><th>类型</th><th>得分</th></tr>${hist.map(e => `<tr><td class="num">${e.d}</td><td>${e.prac ? "练习" : e.n === 9 ? "终极考试" : "第 " + e.n + " 次周考"}</td><td class="num">${e.sc}/${e.tot}</td></tr>`).join("")}</table></div>` : '<div class="empty">还没有考试记录</div>'}</div>`;
}

/* ---------- views: memory ---------- */
function dueCards() { const t = todayK(); return Object.values(VOC).filter(v => lx(v.k) && (!v.due || v.due <= t)); }
let MEMSORT = "recent";
function vMem() {
  const vs = Object.values(VOC).filter(v => lx(v.k));
  vs.sort(MEMSORT === "az" ? (a, b) => a.k.localeCompare(b.k) : MEMSORT === "freq" ? (a, b) => b.n - a.n : (a, b) => b.l - a.l);
  const ss = Object.entries(SEN).filter(([, v]) => AMAP[v.a] && (v.m !== "t" || hasTR(v.a))).sort((a, b) => b[1].l - a[1].l);
  const due = dueCards().length;
  return `<div class="sechead"><h2>记忆库</h2><span class="muted">单词 ${vs.length} · 句子 ${ss.length}</span></div>
  <div class="panel row" style="justify-content:space-between" id="s-flash"><div><b>今日待复习 ${due} 个</b><div class="muted" style="font-size:12.5px">间隔复习：认识的词会在 1、2、4、7、15 天后再出现</div></div><button class="btn" data-act="flash" ${due ? "" : "disabled"}>开始强化复习</button></div>
  <div id="flashbox"></div>
  <div class="sec" id="s-words"><div class="sechead"><h2>单词</h2><div class="seg"><button class="${MEMSORT === "recent" ? "on" : ""}" data-act="msort" data-m="recent">最近</button><button class="${MEMSORT === "freq" ? "on" : ""}" data-act="msort" data-m="freq">次数</button><button class="${MEMSORT === "az" ? "on" : ""}" data-act="msort" data-m="az">A–Z</button></div></div>
  ${vs.length ? `<div class="wlist">${vs.map(v => { const L = lx(v.k); return `<button class="witem" data-act="memword" data-k="${esc(v.k)}"><span class="top"><b>${esc(L.w)}</b><span class="faint" style="font-size:12px">/${esc(L.ph)}/</span></span><span class="m">${esc((L.tr[0] || "").slice(0, 34))}</span><span class="f">${esc(AMAP[v.a] ? AMAP[v.a].titleZh : "")} · 点击 ${v.n} 次 · 熟练度 ${v.box || 0}/5</span></button>`; }).join("")}</div>` : '<div class="empty">阅读时点击不认识的单词，它们会自动收进这里。</div>'}</div>
  <div class="sec" id="s-sents"><div class="sechead"><h2>句子</h2></div>
  ${ss.length ? `<div class="slist">${ss.map(([id, v]) => { const s = getS(v.a, v.s, v.m); if (!s) return ""; return `<button class="sitem" data-act="memsent" data-a="${v.a}" data-s="${v.s}" data-m="${v.m || ""}">${esc(s.en)}${s.zh && !s.zhPara ? `<div class="zh">${esc(s.zh)}</div>` : `<div class="zh">${esc(AMAP[v.a].titleZh)} · 精读全文</div>`}</button>`; }).join("")}</div>` : '<div class="empty">双击或长按句子中的单词，句子解析会保存在这里。</div>'}</div>`;
}
let FL = null;
function startFlash() { const d = shuffle(dueCards()); if (!d.length) { toast("今天没有待复习的单词"); return; } FL = { list: d, i: 0, flip: false }; drawFlash(); }
function drawFlash() {
  const box = $("#flashbox"); if (!box || !FL) return;
  if (FL.i >= FL.list.length) { box.innerHTML = `<div class="panel" style="margin-top:12px;text-align:center"><b>本轮复习完成</b><p class="muted">复习了 ${FL.list.length} 个单词。</p></div>`; FL = null; renderChrome(); return; }
  const v = FL.list[FL.i], L = lx(v.k), a = AMAP[v.a], s = a ? vSent(v) : null;
  box.innerHTML = `<div class="flash" style="margin-top:12px"><div class="faint num" style="text-align:center;font-size:12px;margin-bottom:6px">${FL.i + 1} / ${FL.list.length}</div>
  <div class="fcard" data-act="flip">${FL.flip ? `<div class="wd">${esc(L.w)}</div><div class="ph">/${esc(L.ph)}/</div><div>${L.tr.slice(0, 3).map(esc).join("<br>")}</div>${s ? `<div class="ex" style="text-align:left;margin-top:6px"><div class="en">${esc(s.en)}</div>${s.zh && !s.zhPara ? `<div class="zh">${esc(s.zh)}</div>` : ""}</div>` : ""}` : `<div class="wd">${esc(L.w)}</div><button class="say" data-act="say" data-text="${esc(L.w)}">${I.vol}发音</button><div class="faint">点击卡片查看释义</div>`}</div>
  ${FL.flip && aiOK() ? `<div id="flex"></div><div class="flexrow"><button class="btn sm ghost" data-act="flex">${I.spark}AI 新例句</button></div>` : ""}
  ${FL.flip ? `<div class="fbtns"><button class="btn warn" data-act="fl" data-r="0">不认识</button><button class="btn ghost" data-act="fl" data-r="1">模糊</button><button class="btn" data-act="fl" data-r="2">认识</button></div>` : ""}</div>`;
}
function rateFlash(r) {
  const v = FL.list[FL.i]; const iv = [0, 1, 2, 4, 7, 15];
  if (r === 0) { v.box = 0; v.due = todayK(); } else if (r === 1) { v.due = addDays(todayK(), 1); } else { v.box = Math.min(5, (v.box || 0) + 1); v.due = addDays(todayK(), iv[v.box]); }
  VOC[v.k] = v; putVoc(v.k); markStudy(); FL.i++; FL.flip = false; drawFlash();
}

/* ---------- views: rewards ---------- */


/* ---------- views: practice (listening & speaking) ---------- */
let PR_ID = null, PR_SI = 0, PR_SRC = null;
function prList() { if (PR_SRC === "t" && hasTR(PR_ID)) return TX(PR_ID).flat.map(f => f.en); return AMAP[PR_ID].sents.map(s => s.en); }
function vPractice() {
  if (!PR_ID || !AMAP[PR_ID]) PR_ID = S.cur.art && AMAP[S.cur.art] ? S.cur.art : ARTS[0].id;
  if (PR_SRC == null || (PR_SRC === "t" && !hasTR(PR_ID)) || isUser(PR_ID)) PR_SRC = hasTR(PR_ID) ? "t" : "i";
  const a = AMAP[PR_ID], L = prList(), T = PR_SRC === "t" ? TR[PR_ID] : null, live = !!(T && T.audio);
  if (PR_SI >= L.length) PR_SI = 0;
  const X = T ? TX(PR_ID) : null;
  return `<div class="sechead"><h2>听说练习</h2><select id="prsel" data-act="prsel" style="max-width:60%;height:34px;border-radius:10px;border:1px solid var(--line);background:var(--card);padding:0 8px">${Object.keys(ITEMS).length ? `<optgroup label="精读学习">${Object.values(ITEMS).sort((x, y) => y.at - x.at).map(x => `<option value="${x.id}" ${x.id === PR_ID ? "selected" : ""}>${esc(x.title)}${TR[x.id] && TR[x.id].audio ? " · 原声" : ""}</option>`).join("")}</optgroup>` : ""}<optgroup label="短篇学习">${ARTS.map(x => `<option value="${x.id}" ${x.id === PR_ID ? "selected" : ""}>${esc(x.titleZh)}</option>`).join("")}</optgroup></select></div>
  ${isUser(PR_ID) ? "" : hasTR(PR_ID) ? `<div class="seg" style="margin-bottom:10px"><button data-act="prsrc" data-x="t" class="${PR_SRC === "t" ? "on" : ""}">演讲全文</button><button data-act="prsrc" data-x="i" class="${PR_SRC === "i" ? "on" : ""}">导读短文</button></div>` : FULL ? `<div class="fullcta" style="margin-bottom:10px"><div class="muted" style="font-size:13px">导入这场演讲的全文和现场音频后，这里可以逐句跟听现场原声。</div><button class="btn sm" data-act="import" data-id="${PR_ID}">导入全文</button></div>` : ""}
  <div class="grid2">
  <div class="panel player" id="s-listen"><h3>听力通读${live ? "（现场原声）" : ""}</h3>
    ${live ? `<div class="pctrl"><button class="pbig" data-act="pplay" id="pplay" title="播放/暂停">${AUD.el && !AUD.el.paused && AUD.aid === PR_ID ? I.pause : I.play}</button><span class="muted" style="font-size:12.5px">播放条在屏幕底部：可变速、单句循环、前后跳 5 秒</span></div>` :
    `<div class="pctrl"><button class="pbig" data-act="pplay" id="pplay" title="播放/暂停">${I.play}</button><button class="iconbtn" data-act="pstop" title="停止">${I.stop}</button>
      <div class="seg"><button data-act="acc" data-a="us" class="${S.set.voice === "us" ? "on" : ""}">美式</button><button data-act="acc" data-a="uk" class="${S.set.voice === "uk" ? "on" : ""}">英式</button></div>
      <label class="muted" style="font-size:12px;display:flex;align-items:center;gap:6px">语速 <input type="range" id="rate" min="0.6" max="1.3" step="0.05" value="${S.set.rate}" style="width:100px"> <span class="num" id="ratev">${S.set.rate.toFixed(2)}</span></label></div>
    <div class="faint" style="font-size:12px" id="vname"></div>`}
    ${T && !live ? `<div class="note" style="margin:0">还没有导入现场音频，现在用设备语音朗读。<button class="linkbtn" data-act="audiopanel">导入现场原声</button></div>` : ""}
    <div class="plist" id="plist">${L.map((s, i) => `${X && X.pStart.includes(i) && T.paras[X.flat[i].p].t != null ? `<div class="plstamp num">${fmtT(T.paras[X.flat[i].p].t)}</div>` : ""}<button class="pl" data-act="pfrom" data-i="${i}" data-g="${i}">${esc(s)}</button>`).join("")}</div>
    <div class="faint" style="font-size:11.5px">点击任意句子从该句开始播放。${live ? "高亮跟随原声；对不上时可在阅读页双击句子校准。" : "朗读使用设备内置语音，不同设备音色不同。"}</div>
  </div>
  <div class="panel player" id="s-speak"><h3>口语跟读</h3>
    <div class="row"><button class="btn sm ghost" data-act="sprev">上一句</button><span class="muted num" id="sidx">第 ${PR_SI + 1}/${L.length} 句</span><button class="btn sm ghost" data-act="snext">下一句</button><div class="seg"><button data-act="sscope" data-x="s" class="${SCOPE === "s" ? "on" : ""}" id="scS">单句</button><button data-act="sscope" data-x="p" class="${SCOPE === "p" ? "on" : ""}" id="scP">整段</button></div></div>
    <div class="ex"><div class="en" id="starget" style="font-size:16px"></div></div>
    <div class="row"><button class="btn ghost" data-act="sorig">${I.vol}${live ? "听现场原声" : "听原声"}</button><button class="btn" data-act="srec" id="srec">${I.mic}开始录音</button><label class="btn ghost sm" style="position:relative;overflow:hidden">上传录音<input type="file" accept="audio/*" capture id="supload" style="position:absolute;inset:0;opacity:0"></label></div>
    <canvas class="wave" id="wave" width="600" height="56"></canvas>
    <div id="sresult"></div>
  </div></div>`;
}
let SCOPE = "s";
function spRange() {
  const L = prList();
  if (SCOPE === "s") return [PR_SI, PR_SI];
  if (PR_SRC === "t" && hasTR(PR_ID)) { const X = TX(PR_ID), p = X.flat[PR_SI].p, a = X.pStart[p], b = p + 1 < X.pStart.length ? X.pStart[p + 1] - 1 : X.flat.length - 1; return [a, b]; }
  const a = AMAP[PR_ID], p = a.paras.find(pi => pi.includes(PR_SI)); return [p[0], p[p.length - 1]];
}
function speakTarget() { const L = prList(), [x, y] = spRange(); return L.slice(x, y + 1).join(" "); }
function afterPractice() {
  $("#starget").textContent = speakTarget();
  const r = $("#rate"); if (r) r.addEventListener("input", e => { S.set.rate = +e.target.value; $("#ratev").textContent = S.set.rate.toFixed(2); save(); });
  $("#supload").addEventListener("change", e => { const f = e.target.files[0]; if (f) gotRecording(f, null, 0); });
  const vn = $("#vname"); if (vn) { const v = pickVoice(S.set.voice); vn.textContent = v ? "当前语音：" + v.name + "（" + v.lang + "）" : "设备语音加载中…"; }
  if (PR_SRC === "t" && hasTR(PR_ID) && TR[PR_ID].audio) audioLoad(PR_ID);
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
  if (PR_SRC === "t" && hasTR(PR_ID) && TR[PR_ID].audio) { playAt(PR_ID, i); return; }
  const L = prList(); PLAY = { i, on: true };
  $("#pplay").innerHTML = I.pause; const step = () => {
    if (!PLAY || !PLAY.on) return; if (PLAY.i >= L.length) { stopSpeak(); S.stats.listen++; save(); checkBadges(); toast("全文播放完毕"); return; }
    $$(".pl").forEach((b, j) => b.classList.toggle("on", j === PLAY.i)); const cur = $$(".pl")[PLAY.i]; if (cur) cur.scrollIntoView({ block: "nearest" });
    say(L[PLAY.i], S.set.voice, false, err => { if (!PLAY || !PLAY.on) return; if (err === true && !PLAY.on) return; PLAY.i++; setTimeout(step, 120); });
  };
  markStudy(); step();
}
function stopSpeak(silent) { if (PLAY) PLAY.on = false; PLAY = null; try { speechSynthesis.cancel(); } catch (e) {} const b = $("#pplay"); if (b) b.innerHTML = I.play; }
function listenArticle(id) {
  if (VIEW === "read") {
    const a = AMAP[id]; if (PLAY) { stopSpeak(); return; }
    if (hasTR(id) && RMOD_VIEW > 0) { const X = TX(id), m = X.mods[RMOD_VIEW - 1]; PLAY = { i: m.gs, on: true }; const step = () => { if (!PLAY || !PLAY.on) return; if (PLAY.i > m.ge) { $$(".sent.speaking").forEach(x => x.classList.remove("speaking")); stopSpeak(); return; } $$(".sent.speaking").forEach(x => x.classList.remove("speaking")); const el = $(`.sent[data-m="t"][data-s="${PLAY.i}"]`); if (el) { el.classList.add("speaking"); el.scrollIntoView({ block: "center", behavior: S.set.motion ? "smooth" : "auto" }); } say(X.flat[PLAY.i].en, S.set.voice, false, () => { if (!PLAY || !PLAY.on) return; PLAY.i++; setTimeout(step, 120); }); }; toast("用设备语音朗读本部分，再点一次停止"); markStudy(); step(); return; }
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
  if (VIEW === "practice" && PR_SRC === "t" && hasTR(PR_ID) && TR[PR_ID].audio) {
    const [x, y] = spRange(); audioLoad(PR_ID).then(() => { const el = audioEl(); const go2 = () => { const d = sEnd(y) - sStart(x); const od = $("#origdur"); if (od) { od.textContent = d.toFixed(1) + " 秒（现场）"; $("#origwpm").textContent = Math.round(speakTarget().split(/\s+/).length / d * 60) + " 词/分"; } el.currentTime = sStart(x); AUD.segEnd = sEnd(y); AUD.segCb = after || null; AUD.bar = true; el.play().catch(() => {}); drawBar(); }; if (el.readyState >= 1) go2(); else el.addEventListener("loadedmetadata", go2, { once: true }); });
    return;
  }
  const t = speakTarget(), t0 = Date.now();
  say(t, S.set.voice, false, () => { const s = (Date.now() - t0) / 1000; const d = $("#origdur"); if (d && s > 0.3) { d.textContent = s.toFixed(1) + " 秒"; $("#origwpm").textContent = Math.round(t.split(/\s+/).length / s * 60) + " 词/分"; } after && after(); });
}

/* ---------- export ---------- */
function vExport() {
  const nv = Object.keys(VOC).filter(k => lx(k)).length, ns = Object.keys(SEN).length;
  return `<div class="sechead"><h2>导出</h2></div>
  <div class="grid2">
   <div class="panel" id="s-pdf"><h3>导出 PDF（详细学习笔记）</h3><p class="muted" style="font-size:13px">包含学习概况、每个点学单词的音标、词性、释义、词形与原文例句，以及每个分析过句子的翻译、主干、从句、时态语态和特殊用法标注。</p><div class="row"><span class="tag">单词 ${nv}</span><span class="tag">句子 ${ns}</span></div><button class="btn" style="margin-top:10px" data-act="pdf" ${nv + ns ? "" : "disabled"}>${I.out}生成 PDF</button></div>
   <div class="panel" id="s-xlsx"><h3>导出 Excel（单词表）</h3><p class="muted" style="font-size:13px">只导出点学过的单词：单词、音标、词性与释义、英文释义、词形变化、出处文章、原文例句与翻译、点击次数、首次学习日期、熟练度。</p><button class="btn" style="margin-top:10px" data-act="xlsx" ${nv ? "" : "disabled"}>${I.out}生成 Excel</button></div>
  </div><div id="expmsg" class="muted" style="margin-top:12px;font-size:13px"></div>`;
}
const LIBS = PWA ? { jspdf: "vendor/jspdf.umd.min.js", h2c: "vendor/html2canvas.min.js", xlsx: "vendor/xlsx.full.min.js", nlp: "vendor/compromise.min.js", pdf: "vendor/pdf.min.js" } : { jspdf: "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js", h2c: "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js", xlsx: "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js" };
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
  if (FULL) { try { await ensureFull(); } catch (e) {} }
  try { await loadLib("xlsx"); } catch (e) { msg.textContent = PWA ? "表格组件加载失败，请刷新应用后重试。" : "表格组件加载失败，请检查网络后重试。"; return; }
  const rows = Object.values(VOC).filter(v => lx(v.k)).sort((a, b) => a.t - b.t).map(v => { const L = lx(v.k), a = AMAP[v.a], s = a ? vSent(v) : null;
    return { "单词": L.w, "音标": L.ph ? "/" + L.ph + "/" : "", "词性与释义": L.tr.join("；"), "英文释义": (L.def || [])[0] || "", "词形变化": Object.entries(L.ex || {}).map(([k, x]) => k + ":" + x).join(" "), "考试标签": (L.tags || []).join(" "), "出处文章": a ? a.title + "（" + a.titleZh + "）" : "", "原文例句": s ? s.en : "", "例句翻译": s ? (s.zhPara ? (s.zh ? "【本段译文】" + s.zh : "") : s.zh) : "", "点击次数": v.n, "首次学习": fmtDate(v.t), "熟练度": (v.box || 0) + "/5" }; });
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
  if (FULL) { try { await ensureFull(); } catch (e) {} }
  const root = $("#pdfroot"); root.innerHTML = "";
  const items = [];
  const vs = Object.values(VOC).filter(v => lx(v.k)).sort((a, b) => a.t - b.t);
  const ss = Object.values(SEN).filter(v => AMAP[v.a] && (v.m !== "t" || hasTR(v.a))).sort((a, b) => a.t - b.t);
  items.push(`<h1>TED 精读学习笔记</h1><div style="color:#5A6B62;margin:4px 0 14px">导出日期 ${todayK()} · 已完成 ${S.done.length}/20 篇 · 点学单词 ${vs.length} 个 · 分析句子 ${ss.length} 句 · 连续学习 ${streak()} 天 · Lv.${levelOf(S.xp).i}</div>`);
  if (S.done.length) items.push(`<h2>已完成文章</h2>` + S.done.map(d => `<div>· ${esc(AMAP[d.a].title)}（${esc(AMAP[d.a].titleZh)}）— ${d.d}</div>`).join(""));
  if (vs.length) { items.push("<h2>一、单词详注</h2>"); vs.forEach((v, i) => { const L = lx(v.k), a = AMAP[v.a], s = a ? vSent(v) : null, K = a && a.keys[v.k];
    items.push(`<div class="pw"><b>${i + 1}. ${esc(L.w)}</b> <span style="color:#5A6B62">/${esc(L.ph)}/</span> ${(L.tags || []).slice(0, 4).map(t => `<span style="font-size:10px;color:#B3801F">${t}</span>`).join(" ")}<div>${L.tr.map(esc).join("；")}</div>${Object.keys(L.ex || {}).length ? `<div style="color:#5A6B62;font-size:11px">${Object.entries(L.ex).map(([k, x]) => k + " " + esc(x)).join(" · ")}</div>` : ""}${K ? `<div><b>用法</b>：${esc(K.use)}<br><i>${esc(K.ex)}</i> ${esc(K.exZh)}</div>` : ""}${s ? `<div style="margin-top:3px"><b>原文</b>：${esc(s.en)}<br><span style="color:#5A6B62">${s.zhPara ? (s.zh ? "【本段译文】" + esc(s.zh) : "") : esc(s.zh)}</span></div>` : ""}<div style="color:#8A9A91;font-size:10.5px">出处：${esc(a ? a.titleZh : "")} · 点击 ${v.n} 次 · ${fmtDate(v.t)}</div></div>`); }); }
  if (ss.length) { items.push("<h2>二、句子解析</h2>"); ss.forEach((v, i) => { const a = AMAP[v.a], s = vSent(v), an = s && s.an; if (!an) return;
    items.push(`<div class="pw"><b>${i + 1}.</b> ${esc(s.en)}<div style="color:#5A6B62">${s.zhPara ? (s.zh ? "【本段译文】" + esc(s.zh) : "") : esc(s.zh)}</div><div class="an">句型：${esc(an.kind)}${an.passive ? " · 含被动" : ""}${an.inv ? " · 倒装" : ""}　主干：<span style="color:#2B5FA0">${esc(an.skel.S)}</span> | <span style="color:#B4433A">${esc(an.skel.V)}</span>${an.skel.O ? " | <span style='color:#2F7D47'>" + esc(an.skel.O) + "</span>" : ""}</div>${an.clauses.map(c => `<div class="an">· ${esc(c.type)}：${esc(c.text)}${c.detail ? "（" + esc(c.detail) + "）" : ""}</div>`).join("")}<div class="an">谓语：${an.verbs.map(x => esc(x.form) + "（" + esc(x.tense) + "，" + esc(x.voice) + "）").join("；")}</div>${an.nf.length ? `<div class="an">非谓语：${an.nf.map(x => esc(x.word) + "（" + esc(x.type) + "作" + esc(x.fn) + "）").join("；")}</div>` : ""}${an.notes.map(n => `<div class="an" style="color:#8A6413">★ ${esc(n)}</div>`).join("")}${AIC["s_" + v.a + "_" + v.s] && AIC["s_" + v.a + "_" + v.s].structure ? `<div class="an">AI：${esc(AIC["s_" + v.a + "_" + v.s].structure)}</div>` : ""}<div style="color:#8A9A91;font-size:10.5px">出处：${esc(a.titleZh)}${v.m === "t" ? " · 精读全文" : ""}</div></div>`); }); }
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
  return `<div class="sechead"><h2>设置</h2></div>
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
${tmPrefs()}${PWA ? aiPrefs() : ""}${aiProfPrefs()}${PWA ? appPrefs() : ""}
   <div class="setrow"><div class="l"><b>重置全部进度</b><span>清空单词、句子、奖励与考试记录</span></div><button class="btn sm warn" data-act="reset1">重置</button></div>
  </div>`;
}


function appPrefs() {
  return `<div class="setrow" id="s-app"><div class="l"><b>App</b><span>版本 ${APP_VER} · ${isStandalone() ? "已安装到桌面" : "尚未安装"} · 联网时自动检查更新</span></div><div class="row">${isStandalone() ? "" : '<button class="btn sm" data-act="install">安装到桌面</button>'}<button class="btn sm ghost" data-act="chkupd">检查更新</button></div></div>`;
}


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
  const m = document.createElement("div"); m.className = "modal" + (o.cls ? " " + o.cls : ""); if (o.wide && !o.cls) m.style.width = "min(680px,94vw)"; m.innerHTML = html;
  document.body.append(scrim, m);
}
function closeModal(force) { if (modalLock && !force) return; modalLock = false; $$(".modal,.mscrim").forEach(x => x.remove()); }
function closeMenus() { $$(".menu").forEach(m => m.remove()); }


let toastT = null;
function toast(t, ms) { const el = $("#toast"); el.textContent = t; el.classList.add("on"); clearTimeout(toastT); toastT = setTimeout(() => el.classList.remove("on"), ms || (t.length > 40 ? 4500 : 2600)); }

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

/* ======================================================================
   v1.2 — full TED transcripts imported by the learner, modules, live audio
   Everything below runs only in the installable App (PWA). Imported text
   and audio stay on the learner's own device.
   ====================================================================== */
const FULL = PWA;
let TR = {};                         // aid -> imported transcript (parsed)
let DICT = null, DICTP = null;       // big offline dictionary (ECDICT subset)
const DCACHE = {};
const TAGC = { z: "中考", g: "高考", "4": "CET4", "6": "CET6", k: "考研", t: "托福", i: "雅思", r: "GRE" };
const EXC = { p: "过去式", d: "过去分词", i: "现在分词", "3": "三单", r: "比较级", t: "最高级", s: "复数" };
function lx(k) {
  if (!k) return null;
  if (LEX[k]) return LEX[k];
  if (DCACHE[k]) return DCACHE[k];
  if (!DICT) return null;
  const r = DICT.w[k]; if (!r) return null;
  const e = { w: k, ph: r[0], tr: r[1].split("\n"), def: [], ex: {}, tags: [...(r[2] || "")].map(c => TAGC[c]).filter(Boolean), c: r[4] };
  (r[3] || "").split("/").forEach(p => { const i = p.indexOf(":"); if (i > 0) { const t = EXC[p.slice(0, i)]; if (t) e.ex[t] = p.slice(i + 1); } });
  return (DCACHE[k] = e);
}
function ensureDict() {
  if (DICT) return Promise.resolve(DICT);
  if (!FULL) return Promise.resolve(null);
  if (!DICTP) DICTP = fetch("dict.json").then(r => { if (!r.ok) throw new Error("dict"); return r.json(); }).then(d => { DICT = d; return d; }).catch(e => { DICTP = null; throw e; });
  return DICTP;
}
function ensureNLP() { return window.nlp ? Promise.resolve(window.nlp) : loadLib("nlp").then(() => window.nlp); }
function ensureFull() { return Promise.all([ensureDict(), ensureNLP()]); }
const hasTR = id => FULL && !!TR[id];
function saveTR() { LS.set("tr", TR); }

/* ---------- dictionary key resolution ---------- */
function keyFor(word) {
  let w = String(word).toLowerCase().replace(/[’‘]/g, "'").replace(/^[-'"]+|[-'"]+$/g, "");
  w = w.replace(/n't$/, "").replace(/'(s|re|ve|ll|d|m)$/, "");
  if (!w || !/[a-z]/.test(w) || /\d/.test(w)) return null;
  const has = k => k && (LEX[k] || (DICT && DICT.w[k]));
  if (has(w)) return w;
  const f = DICT && DICT.f[w]; if (has(f)) return f;
  const c = [];
  if (/ies$/.test(w)) c.push(w.slice(0, -3) + "y");
  if (/(s|x|z|ch|sh)es$/.test(w)) c.push(w.slice(0, -2));
  if (/s$/.test(w) && !/ss$/.test(w)) c.push(w.slice(0, -1));
  if (/ied$/.test(w)) c.push(w.slice(0, -3) + "y");
  if (/ed$/.test(w)) { c.push(w.slice(0, -2), w.slice(0, -1)); if (/(.)\1ed$/.test(w)) c.push(w.slice(0, -3)); }
  if (/ing$/.test(w)) { c.push(w.slice(0, -3), w.slice(0, -3) + "e"); if (/(.)\1ing$/.test(w)) c.push(w.slice(0, -4)); }
  if (/ier$|iest$/.test(w)) c.push(w.replace(/i(er|est)$/, "y"));
  if (/er$|est$/.test(w)) c.push(w.replace(/(er|est)$/, ""), w.replace(/(r|st)$/, ""));
  if (/ly$/.test(w)) c.push(w.slice(0, -2));
  for (const x of c) if (has(x)) return x;
  if (w.includes("-")) { const p = w.split("-").filter(Boolean); if (p.length > 1 && has(p[p.length - 1])) return "~" + w; }
  return "~" + w;
}

/* ---------- transcript parsing ---------- */
const TS_RE = /^(?:(\d{1,2}):)?(\d{1,2}):(\d{2})(?:\s+|$)/;
const JUNK_RE = /^(transcript|read along|english|chinese|简体中文|中文（简体）|中文|繁體中文|share|translated by\b.*|reviewed by\b.*|transcribed by\b.*|翻译人员.*|校对人员.*|译者.*|校对.*|[\d,]+ views?|.*\| ted( talk)?)$/i;
function parseRaw(raw) {
  const lines = String(raw || "").replace(/\r/g, "").replace(/ /g, " ").split("\n").map(l => l.trim()).filter(Boolean);
  const out = []; let pend = null;
  for (let l of lines) {
    const m = l.match(TS_RE);
    if (m) { pend = (+m[1] || 0) * 3600 + (+m[2]) * 60 + (+m[3]); l = l.slice(m[0].length).trim(); if (!l) continue; }
    if (JUNK_RE.test(l)) continue;
    out.push({ t: pend, text: l }); pend = null;
  }
  return out;
}
const cjkRatio = s => { const t = s.replace(/\s/g, ""); if (!t) return 0; return (t.match(/[㐀-鿿]/g) || []).length / t.length; };
function splitSents(text) {
  const arr = [];
  window.nlp(text).sentences().out("array").map(x => x.trim()).filter(Boolean).forEach(x => {
    let m; while ((m = x.match(/^([\(\[][^)\]]{1,40}[\)\]])\s+(?=\S)/))) { arr.push(m[1]); x = x.slice(m[0].length); }
    const t = x.match(/^(.*?[.!?"”])\s+([\(\[][^)\]]{1,40}[\)\]])$/); if (t) { arr.push(t[1], t[2]); return; }
    if (x) arr.push(x);
  });
  return arr.length ? arr : [text];
}
function buildTranscript(enRaw, zhRaw) {
  let en = parseRaw(enRaw);
  if (!en.length) throw new Error("没有识别到英文内容");
  // one giant block → chunk into paragraphs of ~5 sentences
  let paras = [];
  en.forEach(p => {
    const s = splitSents(p.text);
    if (s.length > 9 && en.length < 4) { for (let i = 0; i < s.length; i += 5) paras.push({ t: i === 0 ? p.t : null, s: s.slice(i, i + 5) }); }
    else paras.push({ t: p.t, s });
  });
  const words = paras.reduce((n, p) => n + p.s.join(" ").split(/\s+/).length, 0);
  // Chinese alignment
  let zhMode = "none";
  const zh = zhRaw ? parseRaw(zhRaw) : [];
  if (zh.length) {
    const enT = paras.filter(p => p.t != null).length, zhT = zh.filter(p => p.t != null).length;
    if (enT >= paras.length * 0.6 && zhT >= zh.length * 0.6) {
      zhMode = "ts";
      const byT = zh.filter(p => p.t != null);
      paras.forEach(p => { if (p.t == null) return; let best = null, bd = 3; byT.forEach(z => { const d = Math.abs(z.t - p.t); if (d <= bd) { bd = d; best = z; } }); if (best) { p.zh = (p.zh ? p.zh : "") + best.text; best.used = 1; } });
      byT.filter(z => !z.used).forEach(z => { let k = 0; paras.forEach((p, i) => { if (p.t != null && p.t <= z.t) k = i; }); paras[k].zh = (paras[k].zh || "") + z.text; });
    } else if (zh.length === paras.length) { zhMode = "idx"; paras.forEach((p, i) => p.zh = zh[i].text); }
    else { zhMode = "ratio"; zh.forEach((z, i) => { const k = Math.min(paras.length - 1, Math.floor(i * paras.length / zh.length)); paras[k].zh = (paras[k].zh || "") + z.text; }); }
  }
  // modules ~330–420 words, never splitting a paragraph
  const mods = []; let cur = [], w = 0;
  paras.forEach((p, i) => {
    const pw = p.s.join(" ").split(/\s+/).length;
    if (cur.length && w + pw > 430 && w >= 220) { mods.push(cur); cur = []; w = 0; }
    cur.push(i); w += pw;
    if (w >= 330) { mods.push(cur); cur = []; w = 0; }
  });
  if (cur.length) { if (mods.length && w < 120) mods[mods.length - 1].push(...cur); else mods.push(cur); }
  return { v: 1, at: Date.now(), paras: paras.map(p => ({ t: p.t, s: p.s, zh: p.zh || "" })), mods: mods.map(c => [c[0], c[c.length - 1]]), words, zhMode, off: 0, cal: [], audio: null };
}
/* derived view of a transcript: flat sentence list and module ranges */
const TXC = {};
function TX(aid) {
  const T = TR[aid]; if (!T) return null;
  if (TXC[aid] && TXC[aid].T === T) return TXC[aid];
  const flat = [], pStart = [];
  T.paras.forEach((p, pi) => { pStart.push(flat.length); p.s.forEach(s => flat.push({ p: pi, en: s })); });
  const mods = T.mods.map(([a, b]) => { const gs = pStart[a], ge = (b + 1 < pStart.length ? pStart[b + 1] : flat.length) - 1; return { a, b, gs, ge, n: ge - gs + 1, words: T.paras.slice(a, b + 1).reduce((n, p) => n + p.s.join(" ").split(/\s+/).length, 0), t0: T.align ? T.align.st[gs] : T.paras[a].t, t1: T.align ? (ge + 1 < flat.length ? T.align.st[ge + 1] : null) : b + 1 < T.paras.length ? T.paras[b + 1].t : null }; });
  const modOf = new Array(flat.length); mods.forEach((m, i) => { for (let g = m.gs; g <= m.ge; g++) modOf[g] = i; });
  return (TXC[aid] = { T, flat, pStart, mods, modOf });
}
const fmtT = s => { if (s == null || !isFinite(s)) return "--:--"; s = Math.max(0, Math.round(s)); const h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60), x = s % 60; return (h ? h + ":" + String(m).padStart(2, "0") : String(m).padStart(2, "0")) + ":" + String(x).padStart(2, "0"); };

/* ---------- sentence analysis in the browser (compromise) ---------- */
const MODALS = new Set(["will", "would", "can", "could", "may", "might", "must", "shall", "should", "ought", "'ll", "'d"]);
const BE = new Set(["am", "is", "are", "was", "were", "be", "been", "being", "'s", "'re", "'m"]);
const HAVE = new Set(["have", "has", "had", "'ve", "having"]);
const SUBMARK = { when: "时间", whenever: "时间", while: "时间/让步", before: "时间", after: "时间", until: "时间", till: "时间", once: "时间/条件", since: "原因/时间", as: "方式/原因/时间", because: "原因", if: "条件", unless: "条件", although: "让步", though: "让步", even: "让步", whereas: "对比", whether: "条件/让步", so: "目的/结果", where: "地点", wherever: "地点" };
const RELW = new Set(["which", "who", "whom", "whose"]);
const NOUNCL = new Set(["what", "how", "why", "whatever", "whoever"]);
const COORD = new Set(["and", "but", "or", "yet", "so", "nor"]);
function posZh(tags) {
  const T = new Set(tags);
  if (T.has("Pronoun")) return "代词"; if (T.has("Modal")) return "情态动词"; if (T.has("Auxiliary") || T.has("Copula")) return "助动词/系动词";
  if (T.has("Verb")) return "动词"; if (T.has("ProperNoun")) return "专有名词"; if (T.has("Noun")) return "名词"; if (T.has("Adjective")) return "形容词";
  if (T.has("Adverb")) return "副词"; if (T.has("Preposition")) return "介词"; if (T.has("Conjunction")) return "连词"; if (T.has("Determiner")) return "限定词";
  if (T.has("Value") || T.has("Cardinal")) return "数词"; if (T.has("QuestionWord")) return "疑问词/关系词"; if (T.has("Expression")) return "感叹词"; return "";
}
function formZh(t, prevAux) {
  const T = new Set(t.tags), lw = t.text.toLowerCase();
  if (T.has("Gerund")) return prevAux ? "现在分词" : "动名词/现在分词";
  if (T.has("PastTense") && T.has("Verb")) return prevAux ? "过去分词" : "过去式/过去分词";
  if (T.has("Plural") && T.has("Noun")) return "名词复数";
  if (T.has("Comparative")) return "比较级"; if (T.has("Superlative")) return "最高级";
  if (T.has("PresentTense") && T.has("Verb") && /s$/.test(lw) && !T.has("Infinitive")) return "第三人称单数";
  return "";
}
function analyzeSentence(text) {
  const doc = window.nlp(text);
  const offs = []; let acc = 0; doc.docs.forEach((d, n) => { offs[n] = acc; acc += d.length; });
  const terms = [].concat(...doc.docs).map(t => ({ text: t.text || "", pre: t.pre || "", post: t.post || "", normal: t.text ? (t.normal || "") : (t.implicit || t.normal || ""), tags: Array.from(t.tags || []) }));
  const gix = x => offs[x.index[0]] + x.index[1];
  const toks = [], t2k = [];
  terms.forEach((t, i) => {
    if (t.pre) toks.push([t.pre, null, ""]);
    if (t.text) {
      const prev = i > 0 ? terms[i - 1] : null;
      const prevAux = prev && (BE.has((prev.normal || prev.text).toLowerCase()) || HAVE.has((prev.normal || prev.text).toLowerCase()));
      t2k[i] = toks.length; toks.push([t.text, keyFor(t.text), "", posZh(t.tags), formZh(t, prevAux)]);
    } else t2k[i] = null;
    if (t.post) toks.push([t.post, null, ""]);
  });
  const role = new Array(toks.length).fill("-");
  const tokRange = ids => { const ks = ids.map(i => t2k[i]).filter(x => x != null); return ks.length ? [Math.min(...ks), Math.max(...ks)] : null; };
  // clauses
  const clauses = []; let kind = "简单句", hasSub = false, hasCo = false;
  const clist = doc.clauses();
  clist.forEach((c, ci) => {
    const ids = [].concat(...c.docs).map(gix); if (!ids.length) return;
    const first = terms[ids[0]], fw = (first.normal || first.text).toLowerCase();
    const txt = c.text().trim(); let type = null, detail = "";
    if (RELW.has(fw)) { type = "定语从句"; detail = "关系词 " + first.text; }
    else if (fw === "that") { const prev = ids[0] > 0 ? terms[ids[0] - 1] : null; if (prev && prev.tags.includes("Noun")) { type = "定语从句/同位语从句"; detail = "由 that 引导，修饰 " + prev.text; } else { type = "宾语/表语从句"; detail = "由 that 引导"; } }
    else if (NOUNCL.has(fw)) { type = "名词性从句"; detail = "由 " + first.text + " 引导"; }
    else if (SUBMARK[fw] && !(ci === 0 && fw === "so")) { type = "状语从句"; detail = "由 " + first.text + " 引导，表" + SUBMARK[fw]; }
    else if (ci === 0 && /^(had|were|should)$/.test(fw)) { type = "倒装条件句"; detail = "省略 if 的倒装（虚拟语气）"; }
    else if (COORD.has(fw) && ci > 0) { type = "并列分句"; detail = "由 " + first.text + " 连接"; }
    if (!type || clist.length < 2) return;
    if (type === "并列分句") hasCo = true; else hasSub = true;
    const r = tokRange(ids); if (!r) return;
    clauses.push({ type, text: txt.replace(/[,;]\s*$/, ""), detail, a: r[0], b: r[1] });
  });
  const setKind = () => { kind = hasSub && hasCo ? "并列复合句" : hasSub ? "复合句" : hasCo ? "并列句" : "简单句"; }; setKind();
  const inCl = i => clauses.some(c => c.type !== "并列分句" && i >= c.a && i <= c.b);
  // verbs
  const verbs = [], nf = []; let mainV = null;
  const vps = [];
  doc.verbs().forEach(v => { const j = v.json()[0]; if (!j || !j.verb) return; vps.push({ ids: [].concat(...v.docs).map(gix), vb: j.verb, text: v.text() }); });
  for (let k = 0; k + 1 < vps.length; k++) {
    const A = vps[k], B = vps[k + 1];
    const onlyAux = A.ids.every(i => { const w = (terms[i].normal || terms[i].text).toLowerCase().replace(/n't$/, ""); return !w || BE.has(w) || HAVE.has(w) || MODALS.has(w); });
    const gap = B.ids[0] - A.ids[A.ids.length - 1] - 1;
    const between = terms.slice(A.ids[A.ids.length - 1] + 1, B.ids[0]);
    if (onlyAux && gap >= 0 && gap <= 2 && between.every(t => t.tags.includes("Adverb") || t.tags.includes("Negative") || !["Noun", "Pronoun", "Determiner", "Verb", "Preposition", "Conjunction", "Adjective"].some(x => t.tags.includes(x)))) {
      const ids = A.ids.concat(between.map((_, x) => A.ids[A.ids.length - 1] + 1 + x), B.ids);
      vps.splice(k, 2, { ids, vb: Object.assign({}, B.vb, { grammar: Object.assign({}, B.vb.grammar, { isInfinitive: false }) }), text: ids.map(i => terms[i].text).filter(Boolean).join(" ") });
    }
  }
  vps.forEach((P, pIdx) => {
    const vb = P.vb, g = vb.grammar || {}; const v = { text: () => P.text };
    const ids = P.ids;
    const w0 = (terms[ids[0]].normal || terms[ids[0]].text).toLowerCase();
    if (ids.length === 1 && /^(still|yet|so|like|well|now)$/.test(w0)) return;
    { const lastT = terms[ids[ids.length - 1]], pre = ids[0] > 0 ? terms[ids[0] - 1] : null; if (lastT.tags.includes("Gerund") && pre && pre.tags.includes("Preposition") && !ids.some(i => BE.has((terms[i].normal || terms[i].text).toLowerCase()))) return; }
    if (pIdx === 0 && ids[0] === 0 && ids.length === 1 && vps.length > 1 && terms[0].tags.includes("PastTense") && /,/.test(terms.slice(0, vps[1].ids[0]).map(t => t.post).join(""))) { nf.push({ type: "过去分词", fn: "句首状语（条件/原因）", word: terms[0].text, lemma: terms[0].text, text: terms.slice(0, Math.min(6, vps[1].ids[0])).map(t => t.text).join(" ") }); return; }
    let relV = false; { let k = ids[0] - 1; while (k >= 0 && terms[k].tags.includes("Adverb")) k--; const rw = k >= 0 ? (terms[k].normal || terms[k].text).toLowerCase() : ""; if ((RELW.has(rw) || rw === "that") && k > 0 && terms[k - 1].tags.includes("Noun") && vps.length > 1) relV = true; if (relV && !clauses.some(c => t2k[k] != null && c.a <= t2k[k] && c.b >= t2k[k])) { const end = pIdx + 1 < vps.length ? vps[pIdx + 1].ids[0] - 1 : terms.length - 1; let e2 = ids[ids.length - 1]; for (let x = e2 + 1; x <= end && !/[,;:]/.test(terms[x - 1].post || ""); x++) { if (pIdx + 1 < vps.length && x >= vps[pIdx + 1].ids[0]) break; e2 = x; } const r2 = tokRange([k, e2].concat(ids)); if (r2) { clauses.push({ type: "定语从句", text: terms.slice(k, e2 + 1).map(t => t.text).join(" "), detail: "关系词 " + terms[k].text + "，修饰 " + terms[k - 1].text, a: r2[0], b: r2[1] }); hasSub = true; } } }
    const words = ids.map(i => (terms[i].normal || terms[i].text).toLowerCase().replace(/n't$/, "")).filter(Boolean);
    if (!words.length) return;
    const rootT = terms[ids[ids.length - 1]];
    if (g.isInfinitive) {
      const prev = ids[0] > 0 ? terms[ids[0] - 1] : null;
      if (prev && prev.text.toLowerCase() === "to") nf.push({ type: "不定式", fn: "目的/补足/宾语等", word: "to " + vb.infinitive, lemma: vb.infinitive, text: "to " + v.text().replace(/[,.;:!?]+$/, "") });
      return;
    }
    if (words.length === 1 && /ing$/.test(words[0]) && rootT.tags.includes("Gerund")) return;
    const pw0 = ids[0] > 0 ? (terms[ids[0] - 1].normal || terms[ids[0] - 1].text).toLowerCase() : "";
    if (words.length === 1 && (pw0 === "and" || pw0 === "or") && nf.some(n => n.type === "不定式") && rootT.tags.includes("Infinitive")) { nf.push({ type: "不定式", fn: "与前一个不定式并列", word: rootT.text, lemma: rootT.text, text: v.text() }); return; }
    const aux = words.slice(0, -1).filter(x => MODALS.has(x) || BE.has(x) || HAVE.has(x) || x === "do" || x === "does" || x === "did" || x === "not" || x === "never");
    const modal = words.find(x => MODALS.has(x));
    const passive = !!g.passive || (words.slice(0, -1).some(x => BE.has(x)) && rootT.tags.includes("PastTense") && !/ing$/.test(words[words.length - 1]));
    const perfect = words.slice(0, -1).some(x => HAVE.has(x)) && (rootT.tags.includes("PastTense") || words.includes("been"));
    const progressive = (/ing$/.test(words[words.length - 1]) && words.slice(0, -1).some(x => BE.has(x))) || words.includes("being");
    let tense;
    if (modal) tense = "情态动词 " + modal + " + " + (perfect ? "完成式(have done)" : progressive ? "进行式(be doing)" : "动词原形");
    else {
      const finite = words.find(x => !["not", "never"].includes(x));
      const past = ["was", "were", "had", "did"].includes(finite) || (words.length === 1 && rootT.tags.includes("PastTense")) || (!aux.length && g.tense === "PastTense");
      if (perfect && progressive) tense = past ? "过去完成进行时" : "现在完成进行时";
      else if (perfect) tense = past ? "过去完成时" : "现在完成时";
      else if (progressive) tense = past ? "过去进行时" : "现在进行时";
      else tense = past ? "一般过去时" : "一般现在时";
    }
    const r = tokRange(ids);
    const isMain = r && !inCl(r[0]) && !relV;
    if (isMain && !mainV) mainV = { ids, r, copula: !!g.copula || BE.has(words[words.length - 1]) };
    verbs.push({ form: v.text().replace(/[,.;:!?]+$/, "").replace(/\s+/g, " "), role: isMain ? "主句谓语" : "从句谓语", tense, voice: passive ? "被动语态" : "主动语态" });
  });
  terms.forEach((t, i) => {
    if (!t.tags.includes("Gerund")) return;
    const prev = i > 0 ? terms[i - 1] : null, pw = prev ? (prev.normal || prev.text).toLowerCase() : "";
    if (BE.has(pw)) return;
    const fn = !prev ? "作主语" : prev.tags.includes("Preposition") ? "作介词宾语" : prev.tags.includes("Noun") ? "作后置定语/状语" : "作宾语/状语";
    nf.push({ type: prev && prev.tags.includes("Preposition") || !prev ? "动名词" : "现在分词/动名词", fn, word: t.text, lemma: t.text, text: terms.slice(i, Math.min(terms.length, i + 5)).map(x => x.text).join(" ") });
  });
  setKind();
  if (!mainV && verbs.length) { const vp = vps.find(P => !P.ids.some(i => t2k[i] != null && inCl(t2k[i]))); if (vp) { mainV = { ids: vp.ids, r: tokRange(vp.ids), copula: !!(vp.vb.grammar || {}).copula }; } }
  // skeleton
  const sj = (doc.sentences().json()[0] || {}).sentence || {};
  let S = sj.subject || "", V = sj.verb || "", O = "", Od = [];
  const firstW = terms[0] ? (terms[0].normal || terms[0].text).toLowerCase() : "";
  const inv = /^(had|were|should|never|rarely|seldom|hardly|little|nor|only|not)$/.test(firstW) || (terms[0] && terms[0].tags.includes("Auxiliary") && !text.trim().endsWith("?"));
  if (mainV) {
    mainV.ids.forEach(i => { if (t2k[i] != null) role[t2k[i]] = "V"; });
    let j = mainV.ids[mainV.ids.length - 1] + 1; while (j < terms.length && terms[j].tags.includes("Adverb")) j++;
    const OK = t => ["Determiner", "Adjective", "Noun", "Pronoun", "Value", "Possessive", "Cardinal"].some(x => t.tags.includes(x));
    const oi = []; while (j < terms.length && OK(terms[j])) { oi.push(j); if (/[,.;:!?]/.test(terms[j].post || "")) break; j++; }
    if (oi.length) { O = oi.map(i => terms[i].text).join(" "); Od = [mainV.copula ? "attr" : "dobj"]; oi.forEach(i => { if (t2k[i] != null) role[t2k[i]] = "O"; }); }
    V = mainV.ids.map(i => terms[i].text).filter(Boolean).join(" ");
    const sBad = !S || /^(had|were|should|did|do|does|is|was|are|will|would|can|could|so|and|but|then|well|now|yet)$/i.test(S.trim()) || (() => { const sw = S.toLowerCase().split(/\s+/); const norm = terms.map(t => (t.normal || t.text).toLowerCase()); for (let i = 0; i + sw.length <= norm.length; i++) if (sw.every((w, k) => norm[i + k] === w)) return t2k[i] != null && inCl(t2k[i]); return true; })();
    if (sBad) {
      let k = mainV.ids[0] - 1; while (k >= 0 && terms[k].tags.includes("Adverb")) k--;
      const inRel = x => t2k[x] != null && clauses.some(c => c.type.startsWith("定语") && t2k[x] >= c.a && t2k[x] <= c.b);
      if (k >= 0 && (inRel(k) || /,/.test(terms[k].post || ""))) { while (k >= 0 && (inRel(k) || !terms[k].text)) k--; while (k >= 0 && /^(who|which|that)$/i.test(terms[k].text)) k--; }
      const NP = t => ["Noun", "Pronoun", "Determiner", "Adjective", "Possessive", "Value"].some(x => t.tags.includes(x)) && !/[,;:]/.test(t.post || "");
      const si = []; while (k >= 0 && NP(terms[k])) { si.unshift(k); k--; }
      if (terms[0] && terms[0].tags.includes("Gerund") && mainV.ids[0] > 1) { si.length = 0; for (let x = 0; x < mainV.ids[0]; x++) si.push(x); }
      if (si.length) { S = si.map(i => terms[i].text).join(" "); si.forEach(i => { if (t2k[i] != null) role[t2k[i]] = "S"; }); }
      else S = "";
      if (!S && mainV.ids[0] === 0 && terms[0].tags.includes("Verb") && !text.trim().endsWith("?")) S = "（省略主语 you，祈使句）";
      if (!S && text.trim().endsWith("?")) { let x = mainV.ids[mainV.ids.length - 1] + 1; const NP2 = t => ["Noun", "Pronoun", "Determiner", "Adjective", "Possessive"].some(y => t.tags.includes(y)); const si2 = []; while (x < terms.length && NP2(terms[x]) && si2.length < 4) { si2.push(x); x++; if (terms[x - 1].tags.includes("Noun") || terms[x - 1].tags.includes("Pronoun")) break; } if (si2.length) { S = si2.map(i => terms[i].text).join(" ") + "（疑问句，主谓倒装）"; si2.forEach(i => { if (t2k[i] != null) role[t2k[i]] = "S"; }); } }
    }
  }
  if (S && !role.includes("S")) {
    const sw = S.toLowerCase().split(/\s+/); const norm = terms.map(t => (t.normal || t.text).toLowerCase());
    for (let i = 0; i + sw.length <= norm.length; i++) { if (sw.every((w, k) => norm[i + k] === w)) { for (let k = 0; k < sw.length; k++) if (t2k[i + k] != null && role[t2k[i + k]] === "-") role[t2k[i + k]] = "S"; S = terms.slice(i, i + sw.length).map(t => t.text).join(" "); break; } }
  }
  S = S.replace(/\s+(who|which|that)$/i, "");
  return { toks, an: { kind, skel: { S, V, O, Od }, clauses, verbs, nf: nf.slice(0, 8), passive: verbs.some(v => v.voice === "被动语态"), inv, role: role.join(""), notes: [], auto: 1 } };
}
const SCACHE = {};
/* universal sentence accessor: m = "t" → transcript, else 导读 */
function getS(aid, si, m) {
  const a = AMAP[aid]; if (!a) return null;
  if (m !== "t") return a.sents[si] || null;
  const X = TX(aid); if (!X || !X.flat[si]) return null;
  const key = aid + "|" + si, f = X.flat[si];
  if (SCACHE[key]) return SCACHE[key];
  const zh = X.T.paras[f.p].zh || "";
  if (!window.nlp) return { en: f.en, zh, zhPara: 1, toks: [[f.en, null, ""]], an: null, p: f.p };
  const r = analyzeSentence(f.en);
  return (SCACHE[key] = { en: f.en, zh, zhPara: 1, toks: r.toks, an: r.an, p: f.p });
}
const vSent = v => v ? getS(v.a, v.s, v.m) : null;

/* ---------- module progress & rewards ---------- */
function tprog(aid) { return new Set((S.tprog || {})[aid] || []); }
function modProg(aid, mi) { const X = TX(aid); if (!X) return 0; const m = X.mods[mi], set = tprog(aid); let n = 0; for (let g = m.gs; g <= m.ge; g++) if (set.has(g)) n++; return n / m.n; }
function curMod(aid) {
  const X = TX(aid); if (!X) return 0;
  const saved = (S.rmod || {})[aid]; if (saved != null && saved <= X.mods.length) return saved;
  for (let i = 0; i < X.mods.length; i++) if (modProg(aid, i) < 0.9) return i + 1;
  return 1;
}
function checkModDone(aid) {
  const X = TX(aid); if (!X) return;
  S.mdone = S.mdone || {}; const done = new Set(S.mdone[aid] || []); let got = null;
  X.mods.forEach((m, i) => { if (!done.has(i) && modProg(aid, i) >= 0.9) { done.add(i); got = i; } });
  if (got == null) return;
  S.mdone[aid] = [...done];
  const m = multOf(Math.max(1, streak())), xp = Math.round(25 * m); S.xp += xp; S.coins += 2; save();
  const all = done.size === X.mods.length;
  toast(all ? `全文 ${X.mods.length} 个部分都读完了！+${xp} XP，可以做完成测验了` : `第 ${got + 1} 部分读完 +${xp} XP · 还剩 ${X.mods.length - done.size} 部分`);
  if (all) confetti(90);
  renderChrome();
}

/* ---------- import UI ---------- */

async function doImport(aid) {
  const en = $("#imen").value, zh = $("#imzh").value, msg = $("#immsg");
  if (en.trim().split(/\s+/).length < 120) { msg.textContent = "英文讲稿太短了，请确认复制了完整讲稿（通常 1500 词以上）。"; return; }
  if (cjkRatio(en) > 0.3) { msg.textContent = "英文框里看起来是中文，请把英文讲稿粘贴到第一个框。"; return; }
  if (zh.trim() && cjkRatio(zh) < 0.2) { msg.textContent = "中文框里看起来不是中文讲稿，请检查后再导入（或清空它）。"; return; }
  msg.textContent = "正在拆分句子…";
  try {
    await ensureFull();
    const old = TR[aid];
    const T = buildTranscript(en, zh);
    if (old && old.audio) { T.audio = old.audio; T.off = old.off; T.cal = old.cal || []; }
    TR[aid] = T; delete TXC[aid]; Object.keys(SCACHE).forEach(k => { if (k.startsWith(aid + "|")) delete SCACHE[k]; });
    if (old) { (S.tprog || {})[aid] = []; (S.mdone || {})[aid] = []; }
    saveTR(); save(); closeSheet();
    const X = TX(aid), ts = T.paras.filter(p => p.t != null).length;
    S.rmod = S.rmod || {}; S.rmod[aid] = 1;
    modal(`<h2>全文已导入</h2><p class="muted">共 ${T.words} 词、${X.flat.length} 句，拆成 <b>${X.mods.length}</b> 个部分。${ts ? "已识别 " + ts + " 个时间戳，可以和现场音频对齐。" : "没有识别到时间戳：音频对齐会按文字长度估算，可在句子解析里手动校准。"}${zh.trim() ? (T.zhMode === "ts" ? "中文已按时间戳逐段对齐。" : T.zhMode === "idx" ? "中文已按段落顺序对齐。" : "中文段落数和英文不一致，已按比例大致对齐。") : ""}</p>
      <div class="acts"><button class="btn ghost" data-act="close">稍后</button><button class="btn" data-act="startfull" data-id="${aid}">开始第 1 部分</button></div>`);
    if (VIEW === "read" && READ_ID === aid) render();
  } catch (e) { msg.textContent = "导入失败：" + (e && e.message ? e.message : "请检查网络后重试（首次导入需要加载词典）"); }
}

/* ---------- audio: storage (IndexedDB) ---------- */
let IDBP = null;
function idb() {
  if (IDBP) return IDBP;
  IDBP = new Promise((res, rej) => { const r = indexedDB.open("tedjd", 1); r.onupgradeneeded = () => r.result.createObjectStore("audio"); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); });
  return IDBP;
}
async function idbPut(k, v) { const db = await idb(); return new Promise((res, rej) => { const tx = db.transaction("audio", "readwrite"); tx.objectStore("audio").put(v, k); tx.oncomplete = res; tx.onerror = () => rej(tx.error); }); }
async function idbGet(k) { const db = await idb(); return new Promise((res, rej) => { const q = db.transaction("audio").objectStore("audio").get(k); q.onsuccess = () => res(q.result); q.onerror = () => rej(q.error); }); }
async function idbDel(k) { const db = await idb(); return new Promise(res => { const tx = db.transaction("audio", "readwrite"); tx.objectStore("audio").delete(k); tx.oncomplete = res; tx.onerror = res; }); }
async function importAudio(aid, file) {
  if (!file) return;
  { const c = audioCheck(file); if (!c.ok) { toast(c.msg); return; } }
  try {
    await idbPut(aid, { blob: file, name: file.name, type: file.type || "audio/mpeg" });
    TR[aid].audio = { name: file.name, type: file.type, size: file.size }; TR[aid].cal = []; TR[aid].off = 0; delete TR[aid].align; delete TR[aid].fix; saveTR();
    await idbDel(aid + "#asr").catch(() => {});
    await audioLoad(aid, true);
    toast("音频已导入，正在本机智能对齐，完成后高亮会逐句跟随声音");
    alnQueue(aid, true);
    if (VIEW === "read" || VIEW === "practice") render();
  } catch (e) { toast("音频保存失败：设备存储空间可能不足"); }
}
async function removeAudio(aid) { await idbDel(aid); idbDel(aid + "#asr").catch(() => {}); ALN.q = ALN.q.filter(x => x !== aid); if (ALN.job && ALN.job.aid === aid) ALN.job.cancel = true; if (TR[aid]) { TR[aid].audio = null; delete TR[aid].align; delete TR[aid].fix; saveTR(); } if (AUD.aid === aid) audioUnload(); render(); }

/* ---------- audio: player + sync ---------- */
const AUD = { el: null, aid: null, url: null, starts: null, loop: null, follow: true, segEnd: null, segCb: null, rate: 1, raf: 0, last: -1, bar: false };
function audioEl() {
  if (AUD.el) return AUD.el;
  const el = document.createElement("audio"); el.preload = "metadata"; el.setAttribute("playsinline", ""); el.hidden = true; document.body.appendChild(el);
  el.addEventListener("loadedmetadata", () => { computeStarts(AUD.aid); drawBar(); });
  el.addEventListener("play", () => { tick(); drawBar(); markStudy(); stopSpeak(true); });
  el.addEventListener("pause", () => { cancelAnimationFrame(AUD.raf); drawBar(); });
  el.addEventListener("ended", () => { cancelAnimationFrame(AUD.raf); S.stats.listen++; save(); checkBadges(); drawBar(); });
  el.addEventListener("error", () => { if (!el.getAttribute("src")) return; const T = AUD.aid && TR[AUD.aid], nm = T && T.audio ? T.audio.name : ""; toast("这台设备无法播放" + (nm ? "「" + nm + "」" : "这个音频") + "，请转成 MP3 或 M4A 后在「原声」里重新导入", 6000); });
  return (AUD.el = el);
}
async function audioLoad(aid, force) {
  if (!hasTR(aid) || !TR[aid].audio) return false;
  if (AUD.aid === aid && AUD.url && !force) return true;
  const rec = await idbGet(aid).catch(() => null); if (!rec) { TR[aid].audio = null; saveTR(); return false; }
  const el = audioEl(); if (AUD.url) URL.revokeObjectURL(AUD.url);
  AUD.url = URL.createObjectURL(rec.blob); AUD.aid = aid; AUD.loop = null; AUD.last = -1; AUD.starts = null;
  el.src = AUD.url; el.playbackRate = AUD.rate; el.load();
  computeStarts(aid);
  return true;
}
function audioUnload() { if (AUD.el) { AUD.el.pause(); AUD.el.removeAttribute("src"); AUD.el.load(); } if (AUD.url) URL.revokeObjectURL(AUD.url); AUD.url = null; AUD.aid = null; AUD.bar = false; drawBar(); }
function computeStarts(aid) {
  const X = TX(aid); if (!X) return;
  const T = X.T, dur = AUD.el && isFinite(AUD.el.duration) ? AUD.el.duration : null;
  const P = T.paras, chars = P.map(p => p.s.join(" ").length), total = chars.reduce((a, b) => a + b, 0) || 1;
  const est = dur || total / 15;
  // paragraph anchors: known timestamps, interpolate the rest by characters
  const pt = P.map(p => p.t);
  const anchors = [[-1, 0]]; pt.forEach((t, i) => { if (t != null) anchors.push([i, t]); }); anchors.push([P.length, est]);
  const ps = new Array(P.length);
  for (let k = 0; k < anchors.length - 1; k++) {
    const [i0, t0] = anchors[k], [i1, t1] = anchors[k + 1]; const from = Math.max(0, i0);
    const segChars = chars.slice(from, i1).reduce((a, b) => a + b, 0) || 1; let acc = 0;
    for (let i = from; i < i1; i++) { ps[i] = i === i0 ? t0 : t0 + (t1 - t0) * acc / segChars; acc += chars[i]; }
  }
  const raw = [];
  P.forEach((p, i) => { if (p.st && p.st.length === p.s.length) { p.st.forEach(x => raw.push(x)); return; } const t0 = ps[i], t1 = i + 1 < P.length ? ps[i + 1] : est; const cs = p.s.map(s => s.length + 2), tot = cs.reduce((a, b) => a + b, 0); let acc = 0; p.s.forEach((s, k) => { raw.push(t0 + (t1 - t0) * acc / tot); acc += cs[k]; }); });
  AUD.raw = raw;
  if (T.align && T.align.st && T.align.st.length === raw.length) { const fx = T.fix || {}; AUD.starts = T.align.st.map((x, g) => fx[g] != null ? fx[g] : x); AUD.dur = dur; return; }
  const cal = T.cal || [];
  let fa = 1, fb = T.off || 0;
  if (cal.length >= 2) { const n = cal.length, mx = cal.reduce((s, c) => s + c[0], 0) / n, my = cal.reduce((s, c) => s + c[1], 0) / n; let num = 0, den = 0; cal.forEach(c => { num += (c[0] - mx) * (c[1] - my); den += (c[0] - mx) ** 2; }); if (den > 1) { fa = num / den; fb = my - fa * mx; } }
  else if (cal.length === 1) { fb = cal[0][1] - cal[0][0]; }
  AUD.starts = raw.map(x => Math.max(0, fa * x + fb));
  AUD.dur = dur;
}
const sStart = g => AUD.starts ? AUD.starts[g] : 0;
const sEnd = g => AUD.starts && g + 1 < AUD.starts.length ? AUD.starts[g + 1] : (AUD.dur || 1e9);
function curIdx(t) { const a = AUD.starts; if (!a) return -1; let lo = 0, hi = a.length - 1, r = -1; while (lo <= hi) { const m = (lo + hi) >> 1; if (a[m] <= t + 0.05) { r = m; lo = m + 1; } else hi = m - 1; } return r; }
function tick() {
  cancelAnimationFrame(AUD.raf);
  const el = AUD.el; if (!el || el.paused) return;
  const t = el.currentTime;
  if (AUD.segEnd != null && t >= AUD.segEnd) { el.pause(); const cb = AUD.segCb; AUD.segEnd = null; AUD.segCb = null; if (cb) cb(); return; }
  if (AUD.loop != null && t >= sEnd(AUD.loop) - 0.03) { el.currentTime = sStart(AUD.loop); }
  const g = curIdx(t);
  if (g !== AUD.last) { AUD.last = g; onSentence(g); }
  const tm = $("#abtime"); if (tm) tm.textContent = fmtT(t) + " / " + fmtT(AUD.dur);
  const pb = $("#abprog"); if (pb && AUD.dur) pb.style.width = (t / AUD.dur * 100).toFixed(2) + "%";
  AUD.raf = requestAnimationFrame(tick);
}
function onSentence(g) {
  $$(".sent.speaking").forEach(x => x.classList.remove("speaking"));
  $$(".pl.on").forEach(x => x.classList.remove("on"));
  if (g < 0) return;
  const X = TX(AUD.aid);
  if (VIEW === "read" && READ_ID === AUD.aid && X && AUD.follow) {
    const mi = X.modOf[g] + 1;
    if (RMOD_VIEW !== mi) { setMod(AUD.aid, mi); }
  }
  const el = $(`.sent[data-m="t"][data-s="${g}"]`);
  if (el) { el.classList.add("speaking"); if (AUD.follow) el.scrollIntoView({ block: "center", behavior: S.set.motion ? "smooth" : "auto" }); }
  const pl = $(`.pl[data-g="${g}"]`); if (pl) { pl.classList.add("on"); if (AUD.follow) pl.scrollIntoView({ block: "nearest" }); }
}
async function playAt(aid, g, opts = {}) {
  if (!(await audioLoad(aid))) { toast("这篇还没有导入音频"); return; }
  if (FULL && alnStatus(aid) === "todo") { alnQueue(aid, true); toast("已开始智能对齐，几分钟后高亮会逐句跟随声音", 4000); }
  const el = audioEl(); AUD.bar = true;
  const go2 = () => { el.currentTime = sStart(g); AUD.segEnd = opts.seg ? sEnd(g) : null; AUD.segCb = opts.cb || null; el.playbackRate = AUD.rate; el.play().catch(() => toast("点一下播放键开始")); drawBar(); };
  if (el.readyState >= 1) go2(); else el.addEventListener("loadedmetadata", go2, { once: true });
}
function drawBar() {
  let b = $("#abar");
  const show = AUD.bar && AUD.aid && (VIEW === "read" || VIEW === "practice");
  if (!show) { if (b) b.remove(); document.documentElement.classList.remove("hasabar"); return; }
  if (!b) { b = document.createElement("div"); b.id = "abar"; b.className = "abar"; document.body.appendChild(b); }
  document.documentElement.classList.add("hasabar");
  const el = AUD.el, playing = el && !el.paused, a = AMAP[AUD.aid];
  b.innerHTML = `<div class="abprog"><i id="abprog" style="width:${el && AUD.dur ? (el.currentTime / AUD.dur * 100).toFixed(2) : 0}%"></i></div>
  <div class="abrow"><button class="abbtn big" data-act="ab-play" aria-label="播放/暂停">${playing ? I.pause : I.play}</button>
  <button class="abbtn" data-act="ab-seek" data-d="-5" aria-label="后退 5 秒">−5s</button><button class="abbtn" data-act="ab-seek" data-d="5" aria-label="前进 5 秒">+5s</button>
  <div class="abmeta"><b>${esc(a.titleZh)}</b><span class="num" id="abtime">${fmtT(el ? el.currentTime : 0)} / ${fmtT(AUD.dur)}</span></div>
  <button class="abbtn" data-act="ab-rate">${AUD.rate}×</button>
  <button class="abbtn ${AUD.loop != null ? "on" : ""}" data-act="ab-loop" title="单句循环">单句循环</button>
  <button class="abbtn ${AUD.follow ? "on" : ""}" data-act="ab-follow" title="跟随高亮">跟随</button>
  <button class="abbtn" data-act="ab-close" aria-label="关闭播放条">${I.x}</button></div>`;
}
function calibrateHere(aid, g) {
  const el = AUD.el; if (!el || AUD.aid !== aid || !AUD.raw) { toast("先播放这篇的音频，再在句子开始时点「对齐」"); return; }
  const T = TR[aid];
  if (T.align && T.align.st) { T.fix = T.fix || {}; T.fix[g] = Math.max(0, Math.round((el.currentTime - 0.25) * 100) / 100); saveTR(); computeStarts(aid); AUD.last = -1; toast("这句的起点已修正"); return; }
  T.cal = (T.cal || []).filter(c => Math.abs(c[0] - AUD.raw[g]) > 20).concat([[AUD.raw[g], Math.max(0, el.currentTime - 0.25)]]).slice(-6);
  saveTR(); computeStarts(aid); AUD.last = -1; toast(`已对齐（共 ${T.cal.length} 个校准点）。两处以上校准，整篇会更准`);
}

/* ---------- reader: module rendering ---------- */
let RMOD_VIEW = 0;
function setMod(aid, mi) { S.rmod = S.rmod || {}; S.rmod[aid] = mi; RMOD_VIEW = mi; saveSoon(); const box = $("#reader"); if (!box) return render(); renderReaderBody(); const tb = $("#modtabs"); window.scrollTo({ top: tb ? Math.max(0, tb.getBoundingClientRect().top + window.scrollY - 70) : 0, behavior: "auto" }); }
function modTabs(aid) {
  const X = TX(aid); const mi = RMOD_VIEW;
  const done = new Set((S.mdone || {})[aid] || []);
  return `<div class="modtabs" role="tablist">${isUser(aid) ? "" : `<button class="mt ${mi === 0 ? "on" : ""}" data-act="mod" data-i="0">导读</button>`}${X.mods.map((m, i) => `<button class="mt ${mi === i + 1 ? "on" : ""} ${done.has(i) ? "ok" : ""}" data-act="mod" data-i="${i + 1}"><b>${i + 1}</b>${m.t0 != null ? `<span class="num">${fmtT(m.t0)}</span>` : ""}${done.has(i) ? "<i>✓</i>" : `<em style="--p:${Math.round(modProg(aid, i) * 100)}%"></em>`}</button>`).join("")}</div>`;
}
function moduleHTML(aid, mi) {
  const X = TX(aid), m = X.mods[mi - 1], T = X.T, a = AMAP[aid]; const vset = new Set(Object.keys(VOC)); const set = tprog(aid);
  let html = `<div class="modhead"><div><b>第 ${mi} 部分</b><span class="muted"> / 共 ${X.mods.length} 部分 · ${m.words} 词${m.t0 != null ? " · " + fmtT(m.t0) + (m.t1 != null ? "–" + fmtT(m.t1) : " 起") : ""}</span></div><div class="row">${T.audio ? `<button class="btn sm" data-act="playmod" data-g="${m.gs}">${I.play}从本部分播放</button>` : `<button class="btn sm ghost" data-act="audiopanel">${I.ear}现场原声</button>`}</div></div>`;
  for (let p = m.a; p <= m.b; p++) {
    const P = T.paras[p], g0 = X.pStart[p];
    const en = P.s.map((_, k) => {
      const g = g0 + k, s = getS(aid, g, "t");
      return `<span class="sent${set.has(g) ? " rd" : ""}" data-m="t" data-s="${g}">${s.toks.map((t, ti) => t[1] ? `<span class="w${a.keys[t[1]] ? " kw" : ""}${vset.has(t[1]) ? " seen" : ""}" data-t="${ti}">${esc(t[0])}</span>${t[2]}` : esc(t[0]) + t[2]).join("")}</span>`;
    }).join(" ");
    const stamp = P.t != null || T.audio ? `<button class="pstamp" data-act="playpara" data-g="${g0}" title="从这段播放">${I.play}<span class="num">${T.align && T.align.st[g0] != null ? fmtT(T.align.st[g0]) : P.t != null ? fmtT(P.t) : "播放"}</span></button>` : "";
    html += `<div class="pblock">${stamp}<p class="para">${en}</p>${P.zh ? `<p class="zhp"${READ_MODE === "en" ? " hidden" : ""}>${esc(P.zh)}</p>` : ""}</div>`;
  }
  const nav = `<div class="modnav">${mi > 1 ? `<button class="btn ghost" data-act="mod" data-i="${mi - 1}">上一部分</button>` : `<button class="btn ghost" data-act="mod" data-i="0">导读</button>`}${mi < X.mods.length ? `<button class="btn" data-act="mod" data-i="${mi + 1}">下一部分</button>` : ""}</div>`;
  return html + nav;
}
function renderReaderBody() {
  const a = AMAP[READ_ID], box = $("#reader"); if (!box) return;
  const tabs = $("#modtabs"); if (tabs) tabs.innerHTML = modTabs(a.id);
  box.innerHTML = RMOD_VIEW === 0 ? introHTML(a) : moduleHTML(a.id, RMOD_VIEW);
  box.classList.toggle("zhonly", READ_MODE === "zh");
  updReadProg(); afterRead();
  if (AUD.aid === a.id && AUD.last >= 0) onSentence(AUD.last);
}
function introHTML(a) {
  const vset = new Set(Object.keys(VOC));
  return a.paras.map(pi => {
    const en = pi.map(si => { const s = a.sents[si]; return `<span class="sent" data-s="${si}">${s.toks.map((t, ti) => t[1] ? `<span class="w${a.keys[t[1]] ? " kw" : ""}${vset.has(t[1]) ? " seen" : ""}" data-t="${ti}">${esc(t[0])}</span>${t[2]}` : esc(t[0]) + t[2]).join("")}</span>`; }).join(" ");
    const zh = pi.map(si => esc(a.sents[si].zh)).join("");
    return `<p class="para">${en}</p><p class="zhp"${READ_MODE === "en" ? " hidden" : ""}>${zh}</p>`;
  }).join("");
}
function updReadProg() {
  const a = AMAP[READ_ID]; const p = progOf(a.id);
  const b = $("#rbar"); if (b) { b.style.width = Math.round(p * 100) + "%"; $("#rpct").textContent = Math.round(p * 100) + "%"; }
  const f = $("#finbtn"); if (f) f.disabled = p < 0.9;
  if (hasTR(a.id)) { const X = TX(a.id); $$(".modtabs .mt").forEach(btn => { const i = +btn.dataset.i - 1; if (i < 0) return; const em = btn.querySelector("em"); if (em) em.style.setProperty("--p", Math.round(modProg(a.id, i) * 100) + "%"); }); }
}
function audioPanel(aid) {
  const a = AMAP[aid], T = TR[aid];
  sheet(`<div class="t"><b>现场原声</b><div class="faint" style="font-size:12px">${esc(a.ted.title)}</div></div>`,
  `${T.audio ? `<div class="note" style="background:var(--soft)">已导入：${esc(T.audio.name)}（${(T.audio.size / 1048576).toFixed(1)} MB）${(T.cal || []).length ? " · 已校准 " + T.cal.length + " 处" : ""}</div>
    <div class="row" style="margin-top:10px"><button class="btn" data-act="playpara" data-g="0">${I.play}从头播放</button><label class="btn ghost" style="position:relative;overflow:hidden">更换文件<input type="file" accept="${AUD_ACCEPT}" data-aud="${aid}" style="position:absolute;inset:0;opacity:0"></label><button class="btn warn" data-act="audiodel" data-id="${aid}">删除音频</button></div>` :
  `<div class="blk"><h4>方式一：导入音频或视频文件（推荐，可离线、可逐句对齐）</h4><p class="muted" style="font-size:13px;margin:0 0 8px">选择这场演讲的音频或视频文件，例如 TED 官方播客「TED Talks Daily」对应的单集。文件只存在这台设备上。</p><label class="btn" style="position:relative;overflow:hidden">${I.out}选择文件<input type="file" accept="${AUD_ACCEPT}" data-aud="${aid}" style="position:absolute;inset:0;opacity:0"></label></div>`}
  ${T.audio ? `<div class="blk"><h4>智能对齐</h4><div id="alnpanel" data-id="${aid}">${alnPanelInner(aid)}</div></div>` : ""}
  <div class="blk"><h4>${T.audio ? "使用说明" : "导入后怎么用"}</h4><p class="muted" style="font-size:13px;margin:0">点段落前的时间就从那里播放；播放条上可以单句循环、变速、前后跳 5 秒。播客音频开头常有片头广告，导入音频后会自动在本机做智能对齐，逐句定位，开场白、掌声和观众互动会被跳过。</p></div>
  <div class="blk"><h4>方式二：在线听（TED 官方播放器）</h4><div class="embedbox" id="embedbox"><button class="btn ghost" data-act="embed" data-slug="${esc(a.ted.slug)}">${I.play}加载官方播放器</button><a class="btn ghost" href="${esc(a.ted.url)}" target="_blank" rel="noopener">在 TED 官网打开</a></div><p class="faint" style="font-size:12px;margin:6px 0 0">在线播放需要能访问 TED 网站，不能和讲稿逐句同步。</p></div>`, { kind: "drawer" });
}

/* ======================================================================
   v1.3 — App navigation (bottom tab bar + top-right "…" menu),
   精读学习 (items the learner imports) vs 短篇学习 (20 built-in readings),
   file import (TXT / PDF / Word / subtitles / paste) → one-tap 精读推送
   ====================================================================== */
//@drop NAV,NAVMAP,BADGES,vLib,libOpen
Object.assign(I, {
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
  more: '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></svg>',
  back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>',
  side: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16"/></svg>',
  doc: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M6 3h8l5 5v13H6z"/><path d="M14 3v5h5M9 13h7M9 17h5"/></svg>',
  paste: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><rect x="5" y="5" width="14" height="16" rx="2"/><path d="M9 5V3h6v2M9 11h6M9 15h4"/></svg>',
  globe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18"/></svg>',
  trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/></svg>',
});
const isUser = id => typeof id === "string" && id.slice(0, 2) === "u_";
let ITEMS = {};
const CAT_ALL = CATS.concat(["其他"]);
CATCOL["其他"] = ["#4F6272", "#93A7B5"]; CATGLYPH["其他"] = "读";
const TABS = [
  { v: "home", n: "今日", ic: "sun", subs: [["本周精读", "s-push"], ["下周推送", "s-next"], ["学习规则", "s-rules"]] },
  { v: "jing", n: "精读", ic: "book", subs: [["导入内容", "s-imp"], ["我的精读库", "s-mine"], ["推荐演讲", "s-rec"]] },
  { v: "short", n: "短篇", ic: "lib", subs: CATS.map(c => [c, "c-" + c]) },
  { v: "review", n: "复习", ic: "mem", subs: [["单词", "s-words"], ["句子", "s-sents"], ["闪卡复习", "s-flash"], ["考试", "s-week"]] },
  { v: "practice", n: "听说", ic: "ear", subs: [["听力通读", "s-listen"], ["口语跟读", "s-speak"]] },
];
const VIEWNAMES = new Set(["home", "jing", "short", "review", "practice", "reward", "export", "prefs", "read", "imp"]);
const ALIAS = { mem: ["review", "s-words"], exam: ["review", "s-week"], lib: ["short", null] };
const VTITLE = { home: "今日", jing: "精读学习", short: "短篇学习", review: "复习", practice: "听说练习", reward: "成就奖励", export: "导出", prefs: "设置", imp: "导入内容" };
const MEM_ANCH = new Set(["s-words", "s-sents", "s-flash"]), EXAM_ANCH = new Set(["s-week", "s-prac", "s-final", "s-hist"]);
let LAST_TAB = "home", REVIEW_TAB = "mem";
const jingDone = () => S.done.filter(d => isUser(d.a) && AMAP[d.a]);
const shortDone = () => S.done.filter(d => !isUser(d.a));
function regItem(m) {
  const a = AMAP[m.id] || {};
  Object.assign(a, { id: m.id, user: true, title: m.title, titleZh: m.title, cat: CATCOL[m.cat] ? m.cat : "其他", sub: "精读", ted: { title: m.title, speaker: m.speaker || "", url: m.src || "", year: new Date(m.at).getFullYear(), slug: (m.src || "").split("/talks/")[1] || "", event: "" }, sents: [], paras: [], keys: {}, quiz: [], quote: m.quote || "", quoteZh: "", words: (TR[m.id] || {}).words || 0 });
  AMAP[m.id] = a;
}
function saveItems() { LS.set("items", ITEMS); }
function migrateV13() {
  let changed = false;
  Object.keys(TR).forEach(k => {
    if (isUser(k) || !AMAP[k] || AMAP[k].user) return;
    const id = "u_" + k, a = AMAP[k];
    ITEMS[id] = { id, title: a.ted.title, cat: a.cat, src: a.ted.url, speaker: a.ted.speaker, at: TR[k].at || Date.now(), quote: "" };
    TR[id] = TR[k]; delete TR[k];
    ["tprog", "mdone", "rmod"].forEach(f => { if (S[f] && S[f][k] != null) { S[f][id] = S[f][k]; delete S[f][k]; } });
    Object.values(VOC).forEach(v => { if (v.a === k && v.m === "t") v.a = id; });
    Object.keys(SEN).forEach(sid => { const v = SEN[sid]; if (v.a === k && v.m === "t") { delete SEN[sid]; v.a = id; SEN["T_" + id + "_" + v.s] = v; } });
    if (TR[id].audio) idbGet(k).then(r => { if (r) idbPut(id, r).then(() => idbDel(k)); }).catch(() => {});
    changed = true;
  });
  Object.values(ITEMS).forEach(regItem);
  if (S.cur.art && !isUser(S.cur.art)) { S.cur.art = ITEMS["u_" + S.cur.art] ? "u_" + S.cur.art : null; changed = true; }
  if (S.cur.art && !AMAP[S.cur.art]) { S.cur.art = null; changed = true; }
  if (changed) { saveTR(); saveItems(); LS.set("voc", VOC); LS.set("sen", SEN); save(); }
}

/* ---------- weekly push (精读) ---------- */
function queue() { return Object.values(ITEMS).sort((x, y) => x.at - y.at).map(m => m.id).filter(id => !isDone(id) && id !== S.cur.art); }
function pickNext() { if (S.nextPick && ITEMS[S.nextPick] && !isDone(S.nextPick) && S.nextPick !== S.cur.art) return S.nextPick; return queue()[0] || null; }
function setPush(id, abandonOld) {
  const old = S.cur.art;
  if (abandonOld && old && old !== id && !isDone(old) && !S.abandoned.includes(old)) S.abandoned.push(old);
  S.cur = { art: id, weekStart: todayK(), ext: 0, bonus: false };
  S.abandoned = S.abandoned.filter(x => x !== id); if (S.nextPick === id) S.nextPick = null;
  save();
}
function rollover() {
  if (!S.cur.art || !AMAP[S.cur.art]) return;
  const d = weekDay(); if (d < 7) { pendingRoll = false; return; }
  const k = Math.floor(d / 7);
  if (isDone(S.cur.art)) {
    const nx = pickNext();
    S.cur = { art: nx, weekStart: addDays(S.cur.weekStart, 7 * k), ext: 0, bonus: false }; S.nextPick = null; save();
    setTimeout(() => toast(nx ? "新的一周：《" + AMAP[nx].title + "》" : "精读库没有待读内容了，导入新内容即可生成推送"), 400);
  } else pendingRoll = true;
}
function resolveRoll(mode) {
  const k = Math.floor(weekDay() / 7);
  if (mode === "ext" || mode === true) { S.cur.weekStart = addDays(S.cur.weekStart, 7 * k); S.cur.ext = (S.cur.ext || 0) + 1; toast("已延期一周，继续加油"); }
  else {
    const old = S.cur.art; if (old && !S.abandoned.includes(old)) S.abandoned.push(old);
    const nx = mode === "imp" ? null : pickNext();
    S.cur = { art: nx, weekStart: todayK(), ext: 0, bonus: false }; S.nextPick = null;
    toast(nx ? "已推送新的精读" : "已结束这篇推送");
  }
  pendingRoll = false; save(); closeModal(true);
  if (mode === "imp") go("imp"); else render();
}
function showRollModal() {
  const a = AMAP[S.cur.art]; if (!a) { pendingRoll = false; return; }
  const nx = pickNext();
  modal(`<h2>上一周的精读还没读完</h2><p class="muted">《${esc(a.title)}》阅读进度 ${Math.round(progOf(a.id) * 100)}%。按规则，未完成可以延期一周继续学，也可以换成下一篇（当前进度会保留在精读库里）。</p>
  <div class="acts">${nx ? `<button class="btn ghost" data-act="roll-new">换成《${esc(AMAP[nx].title.slice(0, 18))}》</button>` : `<button class="btn ghost" data-act="roll-imp">导入新内容</button>`}<button class="btn" data-act="roll-ext">延期一周</button></div>`, { lock: true });
}

/* ---------- rewards ---------- */


function complete(id, quizScore, quizTot) {
  if (isDone(id)) return;
  const st = Math.max(1, streak()); const m = multOf(st), user = isUser(id);
  const base = user ? 150 : 60, qx = quizScore * (user ? 20 : 10), xp = Math.round((base + qx) * m), coins = (user ? 15 : 6) + quizScore * 2 + (st >= 7 ? 10 : 0);
  let r = st >= 14 ? 3 : st >= 7 ? 2 : st >= 3 ? 1 : 0; if (quizScore === quizTot && r < 3) r++;
  S.done.push({ a: id, d: todayK(), sc: quizScore, xp }); S.xp += xp; S.coins += coins; S.cards[id] = Math.max(S.cards[id] || 0, r);
  S.abandoned = S.abandoned.filter(x => x !== id);
  save(); checkBadges();
  const a = AMAP[id], n = user ? jingDone().length : shortDone().length;
  const msgs = user ? ["一整篇原文读下来了，这就是精读的力量。", "一周的专注，换来一张新卡片。", "今天的你，比上周多懂了一点世界。", "坚持本身，就是最好的天赋。"] : ["短篇读完，积少成多。", "又解锁了一个话题。", "每天一小步，词汇在悄悄增长。"];
  modal(`<div class="reveal"><div class="tag g">${user ? `第 ${n} 篇精读完成` : `短篇 ${n} / 20`}</div>${cardHTML(a, r)}<h2>${esc(pick(msgs))}</h2>
  <div class="xpline"><span class="tag">基础 +${base}</span><span class="tag">测验 +${qx}</span><span class="tag g">连续 ${st} 天 ×${m}</span><span class="tag g">共 +${xp} XP</span><span class="tag">金币 +${coins}</span></div>
  <p class="muted" style="margin:0">获得「${RAR[r]}」${user ? "精读卡" : "主题卡"}${r === 3 ? "，带流光特效" : ""}。连续学习越久，卡片越稀有。</p>
  ${user && n === 20 ? '<p><b>20 篇精读全部完成！终极考试已解锁，通过后领取终极奖励。</b></p>' : ""}${!user && n === 20 ? '<p><b>20 篇短篇全部读完！</b></p>' : ""}</div>
  <div class="acts"><button class="btn ghost" data-act="go" data-v="reward">查看收藏</button>${user ? `<button class="btn" data-act="go" data-v="jing">选下一篇精读</button>` : `<button class="btn" data-act="close">继续</button>`}</div>`);
  confetti(160);
}
function vReward() {
  const st = streak(), lv = levelOf(S.xp), m = multOf(st);
  const jd = jingDone();
  return `<div class="sechead"><h2>成就奖励</h2></div>
  <div class="grid2" id="s-level">
    <div class="panel"><div class="lvl"><div class="big" style="font-size:36px;color:var(--gold)">Lv.${lv.i}</div><div style="flex:1"><b>${lv.name}</b><div class="bar gold" style="margin-top:6px"><i style="width:${lv.next ? Math.round((S.xp - lv.base) / (lv.next - lv.base) * 100) : 100}%"></i></div><div class="muted num" style="font-size:12px;margin-top:4px">${S.xp} XP${lv.next ? " / 下一级 " + lv.next : " · 满级"} · 金币 ${S.coins}</div></div></div></div>
    <div class="panel"><div class="streak">${flameSVG}<div><div class="big">${st} 天</div><div class="muted">连续学习倍率</div></div></div>
      <div class="mult">${[[1, 1, "起步"], [3, 1.2, "3 天"], [7, 1.5, "7 天"], [14, 2, "14 天"], [30, 3, "30 天"]].map(([d, x, l]) => `<div class="${m === x ? "on" : ""}"><b>×${x}</b>${l}</div>`).join("")}</div></div>
  </div>
  <div class="sec" id="s-cards"><div class="sechead"><h3>精读卡</h3><span class="muted">${jd.length} / 20 · 终极考试目标</span></div>
  ${jd.length ? `<div class="cards">${jd.map(d => cardHTML(AMAP[d.a], S.cards[d.a] || 0)).join("")}</div>` : `<div class="empty">完成第一篇精读后，这里会出现第一张精读卡。</div>`}</div>
  <div class="sec"><div class="sechead"><h3>短篇主题卡</h3><span class="muted">${shortDone().length}/20</span></div>
  <p class="muted" style="font-size:12.5px;margin-top:-4px">每完成一篇得一张卡。连续 3 天以上得「稀有」，7 天「史诗」，14 天「传说」；测验满分再升一级。</p>
  <div class="cards">${ARTS.map(a => S.cards[a.id] != null ? cardHTML(a, S.cards[a.id]) : `<div class="tcard lock"><div class="glyph" style="color:var(--line)">${CATGLYPH[a.cat]}</div><div style="font-size:11.5px">${esc(a.titleZh)}</div></div>`).join("")}</div></div>
  <div class="sec" id="s-badges"><div class="sechead"><h3>徽章</h3><span class="muted">${S.badges.filter(b => BADGES.some(x => x[0] === b)).length}/${BADGES.length}</span></div>
  <div class="badges">${BADGES.map(b => `<div class="badge ${S.badges.includes(b[0]) ? "" : "off"}">${badgeSVG(b[3])}<b>${b[1]}</b><span class="muted">${b[2]}</span></div>`).join("")}</div></div>
  <div class="sec"><div class="panel" style="background:var(--gold-soft)"><b>终极奖励</b><div class="muted" style="font-size:13px">完成 20 篇精读并通过终极考试：解锁「鎏金」阅读主题、精读大师称号、+1000 XP 与结业证书。</div></div></div>`;
}

/* ---------- chrome: top bar, tab bar, sidebar, "…" menu ---------- */
function tabOf(v) { if (v === "read") return READ_ID && isUser(READ_ID) ? "jing" : "short"; if (v === "imp") return "jing"; if (v === "reward" || v === "export" || v === "prefs") return null; return v; }
function isSubView(v) { return v === "read" || v === "imp" || v === "reward" || v === "export" || v === "prefs"; }
function secName() { if (VIEW === "read" && READ_ID && AMAP[READ_ID]) return AMAP[READ_ID].title; return VTITLE[VIEW] || ""; }
function subsOf(n) {
  if (VIEW === "read" && READ_ID && AMAP[READ_ID] && tabOf("read") === n.v) {
    if (FULL && hasTR(READ_ID)) return (isUser(READ_ID) ? [] : [["导读短文", "mod-0"]]).concat(TX(READ_ID).mods.map((m, i) => ["第 " + (i + 1) + " 部分" + (m.t0 != null ? " · " + fmtT(m.t0) : ""), "mod-" + (i + 1)]));
    return [["英文原文", "m-en"], ["中英对照", "m-bi"], ["中文全文", "m-zh"]];
  }
  return n.subs;
}
function renderChrome() {
  const nv = Object.keys(VOC).length, ns = Object.keys(SEN).length, due = dueCards().length, tab = tabOf(VIEW), mode = document.documentElement.dataset.mode;
  $("#side").innerHTML = `<div class="brand">${PWA ? '<img class="logo" src="icons/icon-192.png" alt="">' : '<div class="logo">TED</div>'}<div class="bt"><b>TED 精读计划</b><span>精读 ${jingDone().length} 篇 · 短篇 ${shortDone().length}/20 · Lv.${levelOf(S.xp).i}</span></div></div>
  <nav class="nav">${TABS.map((n, i) => `<button class="ni ${tab === n.v ? "on" : ""}" data-act="go" data-v="${n.v}" title="${n.n}"><span class="ic">${I[n.ic]}</span><span class="no">${i + 1}</span><span class="lbl">${VTITLE[n.v]}</span>${n.v === "review" && due ? `<span class="nb num">${due > 99 ? "99+" : due}</span>` : ""}</button>
  ${tab === n.v && subsOf(n).length ? `<div class="sub">${subsOf(n).map((s, j) => `<button data-act="sub" data-v="${VIEW === "read" ? "read" : n.v}" data-a="${s[1]}"><span class="no">${i + 1}.${j + 1}</span>${esc(s[0])}</button>`).join("")}</div>` : ""}`).join("")}</nav>
  ${FULL ? `<button class="sideimp" data-act="go" data-v="imp">${I.plus}<span class="lbl">导入内容</span></button>` : ""}
  <div class="sidefoot">${PWA ? (isStandalone() ? "已安装 · 离线可用<br>数据保存在本设备" : "离线可用 · 数据保存在本设备") : Cloud.db ? "数据已云端同步，手机与电脑通用" : "数据保存在本机浏览器"}<div class="faint" style="margin-top:4px">版本 ${APP_VER}</div></div>`;
  const left = mode === "S" ? (isSubView(VIEW) ? `<button class="iconbtn" data-act="back" aria-label="返回">${I.back}</button>` : "") : `<button class="iconbtn" data-act="toc" aria-label="折叠侧栏" title="折叠/展开侧栏">${I.side}</button>`;
  const ttl = mode === "S" ? `<div class="bartitle"><b>${esc(VIEW === "read" ? (isUser(READ_ID) ? "精读" : "短篇") : VTITLE[VIEW] || "")}</b>${VIEW === "read" && READ_ID && AMAP[READ_ID] ? `<span class="dot">·</span><span class="secn">${esc(AMAP[READ_ID].title)}</span>` : ""}</div>`
    : `<div class="bartitle"><b>TED 精读</b><span class="dot">·</span><span class="secn">${esc(VIEW === "read" ? (isUser(READ_ID) ? "精读学习" : "短篇学习") : VTITLE[VIEW] || "")}${VIEW === "read" && READ_ID && AMAP[READ_ID] ? " · " + esc(AMAP[READ_ID].title) : ""}</span></div>`;
  const stat = mode === "L" ? `<div class="stat"><span>${flameSmall()} 连续 <b class="num">${streak()}</b> 天</span><span>XP <b class="num">${S.xp}</b></span><span>金币 <b class="num">${S.coins}</b></span></div>` : "";
  $("#topbar").innerHTML = left + ttl + stat + tmBtnHTML() + (FULL ? `<button class="${mode === "L" ? "btn sm" : "iconbtn"} topimp" data-act="go" data-v="imp" aria-label="导入内容">${I.plus}${mode === "L" ? "导入" : ""}</button>` : "") + `<button class="iconbtn" data-act="more" aria-label="更多">${I.more}</button>`;
  $("#bottombar").innerHTML = TABS.map(t => `<button class="tb ${tab === t.v ? "on" : ""}" data-act="go" data-v="${t.v}">${I[t.ic]}<span>${t.n}</span>${t.v === "review" && due ? `<i class="tbdot num">${due > 99 ? "99+" : due}</i>` : ""}</button>`).join("");
  const recent = Object.values(VOC).sort((a, b) => b.l - a.l).slice(0, 14);
  $("#membar").innerHTML = `<div class="mtitle">${I.mem}记忆栏</div><span class="muted num" style="white-space:nowrap">单词 ${nv} · 句子 ${ns} · 待复习 ${due}</span>
  <div class="chips">${recent.length ? recent.map(v => `<button class="chip" data-act="memword" data-k="${esc(v.k)}">${esc(lx(v.k) ? lx(v.k).w : v.k)}</button>`).join("") : '<span class="faint">阅读时点击单词，就会出现在这里</span>'}</div>
  <button class="btn sm" data-act="go" data-v="review" data-a="s-flash">强化复习</button>`;
}
function tocMenu() { const c = !document.documentElement.classList.contains("sidecol"); document.documentElement.classList.toggle("sidecol", c); LS.set("sidecol", c); }
function screenMenu(btn) { moreMenu(btn); }
function moreMenu(btn) {
  if ($(".menu.more")) { closeMenus(); return; }
  closeMenus(); const r = btn.getBoundingClientRect(), cur = document.documentElement.dataset.mode;
  const m = document.createElement("div"); m.className = "menu more";
  m.innerHTML = `<button data-act="timer">${I.timer}学习计时与计划</button>
  <button data-act="airev">${I.spark}AI 复习与学习教练</button>
  <button data-act="go" data-v="reward">${I.trophy}成就奖励</button>
  <button data-act="go" data-v="export">${I.out}导出 PDF / Excel</button>
  <button data-act="go" data-v="prefs" data-a="s-backup">${I.swap}备份与迁移</button>
  <div class="msep"></div>
  <div class="mrow"><span>屏幕</span><div class="seg"><button class="${cur === "L" ? "on" : ""}" data-act="setscreen" data-m="L">大屏</button><button class="${cur === "S" ? "on" : ""}" data-act="setscreen" data-m="S">小屏</button></div></div>
  ${PWA && !isStandalone() ? `<button data-act="install">${I.out}安装到桌面</button>` : ""}${PWA ? `<button data-act="chkupd">${I.spark}检查更新</button>` : ""}
  <div class="msep"></div>
  <button data-act="go" data-v="prefs">${I.gear}设置</button>`;
  document.body.appendChild(m);
  const w = m.offsetWidth; m.style.left = Math.max(10, Math.min(r.right - w, innerWidth - w - 10)) + "px"; m.style.top = (r.bottom + 6) + "px";
}
function render() {
  applySettings();
  if (VIEW === "read" && (!READ_ID || !AMAP[READ_ID])) { VIEW = "home"; READ_ID = null; }
  renderChrome();
  const v = $("#view"); stopSpeak(true); if (VIEW !== "read" && VIEW !== "practice" && AUD.el && !AUD.el.paused) AUD.el.pause();
  if (FULL && ((VIEW === "read" && READ_ID && hasTR(READ_ID)) || (VIEW === "practice" && PR_ID && hasTR(PR_ID))) && (!window.nlp || !DICT)) {
    v.innerHTML = `<div class="empty" style="margin-top:20px">正在载入词典和句法分析组件…</div>`;
    ensureFull().then(() => render()).catch(() => { v.innerHTML = `<div class="empty" style="margin-top:20px">组件加载失败，请检查网络后刷新 App。</div>`; });
    return;
  }
  const fn = { home: vHome, jing: vJing, short: vShort, review: vReview, read: vRead, practice: vPractice, reward: vReward, export: vExport, prefs: vPrefs, imp: vImp }[VIEW] || vHome;
  v.innerHTML = fn();
  if (VIEW === "read") afterRead();
  if (VIEW === "practice") afterPractice();
  if (FULL) drawBar();
  if (pendingRoll) showRollModal();
}

function doSub(v, a) {
  if (v === "read" && a.startsWith("m-")) { READ_MODE = a.slice(2); setReadMode(); return; }
  if (v === "read" && a.startsWith("mod-")) { setMod(READ_ID, +a.slice(4)); renderChrome(); return; }
  if ((v === "short" || v === "lib") && a.startsWith("c-")) { LIB_CAT = a.slice(2); if (VIEW !== "short") go("short"); else render(); return; }
  if (v === "review") { const want = EXAM_ANCH.has(a) ? "exam" : "mem"; if (VIEW !== "review" || REVIEW_TAB !== want) { REVIEW_TAB = want; if (VIEW !== "review") { go("review", a); return; } render(); } if (a === "s-flash") startFlash(); }
  const el = document.getElementById(a); if (el) el.scrollIntoView({ behavior: S.set.motion ? "smooth" : "auto", block: "start" });
}

/* ---------- views: 今日 ---------- */
function weekDaysHTML() {
  const wd = Math.max(0, weekDay()); const days = [];
  for (let i = 0; i < 7; i++) { const k = addDays(S.cur.weekStart, i); const d = parseD(k); days.push(`<div class="d ${i === wd ? "today" : ""} ${i >= 4 ? "pick" : ""} ${S.days.includes(k) ? "studied" : ""}"><b class="num">${d.getDate()}</b>周${WK[d.getDay()]}</div>`); }
  return `<div class="week">${days.join("")}</div><div class="faint" style="font-size:11.5px;margin-top:6px">本周第 ${wd + 1} 天 · 金色为最后 3 天（可选下周推送）· 绿色为已学习的日子</div>`;
}
function vHome() {
  const a = S.cur.art && AMAP[S.cur.art] ? AMAP[S.cur.art] : null;
  const wd = Math.max(0, weekDay()), st = streak(), lv = levelOf(S.xp), m = multOf(st);
  const exA = examTaken(1), exB = examTaken(2), q = queue(), canPick = !!a && wd >= 4;
  let push;
  if (a) {
    const p = progOf(a.id), done = isDone(a.id), T = TR[a.id], X = TX(a.id), [c1, c2] = CATCOL[a.cat] || CATCOL["其他"];
    push = `<div class="push"><svg class="art" viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="${c1}"/><circle cx="70" cy="34" r="24" fill="${c2}"/></svg>
      <div class="eyebrow"><span class="tag" style="background:${c1};color:#FFFFFF">${a.cat}</span><span>本周精读</span><span>·</span><span>第 ${jingDone().length + (done ? 0 : 1)} 篇</span></div>
      <h1>${esc(a.title)}</h1><div class="zh">${a.ted.speaker ? esc(a.ted.speaker) + " · " : ""}${T ? T.words + " 词 · " + X.mods.length + " 个部分" : ""}${T && T.audio ? " · 已导入原声" : ""}${T && T.zhMode && T.zhMode !== "none" ? " · 中英对照" : ""}</div>
      <div class="prog" style="margin-top:14px"><div class="bar"><i style="width:${Math.round(p * 100)}%"></i></div><span class="num">${Math.round(p * 100)}%</span></div>
      <div class="row" style="margin-top:14px">${done ? `<span class="tag g">本周已完成</span><button class="btn ghost" data-act="read" data-id="${a.id}">再读一遍</button><button class="btn" data-act="go" data-v="jing">选下一篇</button>` :
      `<button class="btn" data-act="read" data-id="${a.id}">${p > 0 ? "继续精读" : "开始精读"}</button>${T && T.audio ? `<button class="btn ghost" data-act="go" data-v="practice" data-a="s-listen">${I.ear}听现场原声</button>` : `<button class="btn ghost" data-act="homeaudio">${I.ear}添加现场原声</button>`}`}</div>
      ${planHTML(a, wd, done)}${weekDaysHTML()}</div>`;
  } else {
    push = `<div class="push noitem"><div class="eyebrow"><span class="tag g">精读学习</span></div><h1>还没有本周精读</h1>
      <div class="zh">导入一篇英文材料（TED 讲稿、文章、PDF、Word、字幕都可以），一键生成精读推送：自动拆成几个部分，按一周计划分阶段读完。</div>
      <div class="row" style="margin-top:14px"><button class="btn" data-act="go" data-v="imp">${I.plus}导入内容，生成推送</button><button class="btn ghost" data-act="go" data-v="jing" data-a="s-rec">推荐演讲</button></div>
      ${q.length ? `<div style="margin-top:14px"><b style="font-size:13px">精读库里待读的内容</b><div class="topics">${q.slice(0, 6).map(id => `<button class="topic" data-act="setpush" data-id="${id}">${esc(ITEMS[id].title)}</button>`).join("")}</div><div class="faint" style="font-size:11.5px;margin-top:6px">点一篇即设为本周精读</div></div>` : ""}</div>`;
  }
  const sh = ARTS.find(x => !isDone(x.id));
  return `${installCard()}
  ${S.cur.ext && a ? `<div class="banner" style="margin-bottom:12px"><span>本篇已延期 ${S.cur.ext} 周，保持节奏就好。</span></div>` : ""}
  <div class="hero" id="s-push">${push}
    <div class="statcol">
      <div class="panel streak">${flameSVG}<div><div class="big">${st}<span style="font-size:14px;font-weight:400"> 天</span></div><div class="muted">连续学习 · 当前奖励 ×${m}</div><div class="faint" style="font-size:12px">${st >= 30 ? "已达最高倍率" : "再坚持 " + ([3, 7, 14, 30].find(x => x > st) - st) + " 天，倍率提升"}</div></div></div>
      <div class="panel"><div class="row" style="justify-content:space-between"><b>Lv.${lv.i} ${lv.name}</b><span class="muted num">${S.xp} XP</span></div>
        <div class="bar gold" style="margin-top:8px"><i style="width:${lv.next ? Math.round((S.xp - lv.base) / (lv.next - lv.base) * 100) : 100}%"></i></div>
        <div class="kv" style="margin-top:10px"><div><b>${jingDone().length}</b><span>精读完成</span></div><div><b>${Object.keys(VOC).length}</b><span>点学单词</span></div><div><b>${Object.keys(SEN).length}</b><span>分析句子</span></div></div></div>
      <div class="panel"><div class="row" style="justify-content:space-between"><b>本周考试</b><span class="muted" style="font-size:12px">每周两次 · 约 10 题</span></div>
        <div class="row" style="margin-top:8px">${examBtn(1, exA, wd)}${examBtn(2, exB, wd)}</div></div>
    </div>
  </div>
  ${a ? `<div class="sec" id="s-next"><div class="sechead"><h2>下周推送</h2><span class="muted" style="font-size:12px">${canPick ? "现在可以选择" : "本周最后 3 天开放（还有 " + Math.max(0, 4 - wd) + " 天）"}</span></div>
    <div class="panel">${q.length ? `<div class="muted" style="font-size:13px">${S.nextPick && ITEMS[S.nextPick] ? "已选：<b>" + esc(ITEMS[S.nextPick].title) + "</b>，下周自动推送。" : "从精读库里选一篇作为下周推送；不选则按导入顺序推送。"}</div>
      <div class="topics">${q.map(id => `<button class="topic ${S.nextPick === id ? "on" : ""}" data-act="nextpick" data-id="${id}" ${canPick ? "" : "disabled"}>${esc(ITEMS[id].title)}</button>`).join("")}</div>` : `<div class="muted" style="font-size:13px">精读库里没有待读内容。导入新内容后，下周会自动推送。</div>`}
      <div class="row" style="margin-top:10px"><button class="btn sm ghost" data-act="go" data-v="imp">${I.plus}导入新内容</button></div></div></div>` : ""}
  ${sh ? `<div class="sec"><div class="sechead"><h2>今日短篇</h2><button class="linkbtn" data-act="go" data-v="short">全部 20 篇</button></div>
    <button class="acard wide" data-act="read" data-id="${sh.id}"><span class="stripe" style="background:${CATCOL[sh.cat][0]}"></span><span class="faint" style="font-size:11.5px">${sh.cat} · ${esc(sh.sub)} · 约 ${sh.words} 词</span><h3>${esc(sh.title)}</h3><span class="zh">${esc(sh.titleZh)}</span></button></div>` : ""}
  <div class="sec" id="s-rules"><div class="sechead"><h2>学习规则</h2></div>
    <div class="rules">
      <div class="rule">${I.calendar}<div><b>一周一篇精读</b>导入内容后一键生成推送，自动拆成几个部分，按计划分几天读完，最后通过小测验即算完成。</div></div>
      <div class="rule">${I.flag}<div><b>可以延期</b>到期没读完，可以延期一周继续，也可以换成下一篇。</div></div>
      <div class="rule">${I.swap}<div><b>换文章要"放弃"</b>本周精读没读完时，改学精读库里的另一篇，需要先点"放弃"。</div></div>
      <div class="rule">${I.gift}<div><b>连续越久奖励越大</b>连续 3/7/14/30 天，经验倍率 ×1.2/1.5/2/3，卡片也更稀有。20 篇精读完成后开放终极考试。</div></div>
    </div></div>`;
}

/* ---------- views: 精读学习 / 短篇学习 / 复习 ---------- */
function jingCard(m) {
  const a = AMAP[m.id], p = progOf(m.id), d = isDone(m.id), cur = m.id === S.cur.art, ab = S.abandoned.includes(m.id), T = TR[m.id];
  const [c1] = CATCOL[a.cat] || CATCOL["其他"];
  return `<button class="acard" data-act="jingopen" data-id="${m.id}"><span class="stripe" style="background:${c1}"></span>
  <span class="state">${d ? '<span class="tag g">已完成</span>' : cur ? '<span class="tag">本周</span>' : ab ? '<span class="tag r">已放弃</span>' : m.id === S.nextPick ? '<span class="tag g">下周</span>' : ""}</span>
  <span class="faint" style="font-size:11.5px">${a.cat}${m.speaker ? " · " + esc(m.speaker) : ""}</span><h3>${esc(m.title)}</h3>
  <span class="zh">${T ? T.words + " 词 · " + TX(m.id).mods.length + " 个部分" : ""}${T && T.audio ? " · 原声" : ""}${T && T.zhMode && T.zhMode !== "none" ? " · 中英" : ""}</span>
  <span class="meta"><span>导入于 ${fmtDate(m.at)}</span>${p > 0 && !d ? `<span class="tag">${Math.round(p * 100)}%</span>` : ""}</span></button>`;
}
function recList(btnLabel) {
  return `<div class="reclist">${ARTS.map(a => `<div class="rec"><span class="stripe" style="background:${CATCOL[a.cat][0]}"></span><div class="rt"><b>${esc(a.ted.title)}</b><span>${esc(a.ted.speaker)} · ${a.ted.year} · ${a.cat}</span></div><div class="row"><a class="btn sm ghost" href="${esc(a.ted.url)}/transcript?language=en" target="_blank" rel="noopener">讲稿</a>${FULL ? `<button class="btn sm" data-act="imprec" data-id="${a.id}">${btnLabel}</button>` : ""}</div></div>`).join("")}</div>`;
}
function vJing() {
  const items = Object.values(ITEMS).sort((x, y) => y.at - x.at);
  return `<div class="sechead"><h2>精读学习</h2><span class="muted">完成 ${jingDone().length} 篇 · 库中 ${items.length} 篇</span></div>
  ${FULL ? `<button class="impcard" id="s-imp" data-act="go" data-v="imp"><span class="ib">${I.plus}</span><span class="it"><b>导入内容，生成精读推送</b><span>TXT · PDF · Word · 字幕 · 粘贴文本，可附中文译文和音频</span></span><span class="go">${I.down}</span></button>`
    : `<div class="fullcta" id="s-imp"><div>精读学习需要在 App 版中导入内容。</div>${PWA_URL ? `<a class="btn" href="${PWA_URL}" target="_blank" rel="noopener">打开 App 版</a>` : ""}</div>`}
  ${FULL ? alnLibHTML() : ""}
  <div class="sec" id="s-mine"><div class="sechead"><h3>我的精读库</h3>${items.length ? `<span class="muted" style="font-size:12px">点一篇即可设为本周精读或预览</span>` : ""}</div>
  ${items.length ? `<div class="libgrid">${items.map(jingCard).join("")}</div>` : `<div class="empty">还没有导入内容。导入后会出现在这里，点一下就能开始精读。</div>`}</div>
  <div class="sec" id="s-rec"><div class="sechead"><h3>推荐演讲 · 20 场 TED</h3><span class="muted" style="font-size:12px">打开讲稿复制，再点「导入」粘贴</span></div>${recList("导入")}</div>`;
}
function jingOpen(id) {
  const cur = S.cur.art;
  if (id === cur || isDone(id)) return openRead(id);
  const t = esc(ITEMS[id].title);
  if (!cur || !AMAP[cur] || isDone(cur)) { modal(`<h2>${t}</h2><p class="muted">设为本周精读后，按一周计划分部分读完，完成测验即可获得奖励。</p><div class="acts"><button class="btn ghost" data-act="read" data-id="${id}">只预览</button><button class="btn" data-act="setpush" data-id="${id}">设为本周精读</button></div>`); return; }
  modal(`<h2>更换本周精读？</h2><p class="muted">本周的《${esc(AMAP[cur].title)}》还没读完（进度 ${Math.round(progOf(cur) * 100)}%）。按规则，改学《${t}》需要先放弃当前这篇，进度会保留。也可以把它排到下周。</p>
  <div class="acts"><button class="btn ghost" data-act="read" data-id="${id}">只预览</button><button class="btn ghost" data-act="nextpick" data-id="${id}" data-close="1">排到下周</button><button class="btn warn" data-act="abandonto" data-id="${id}">放弃当前并改学</button></div>`);
}
function vShort() {
  const ds = doneSet();
  const list = ARTS.filter(a => LIB_CAT === "全部" || a.cat === LIB_CAT);
  return `<div class="sechead"><h2>短篇学习</h2><span class="muted">${shortDone().length}/20 已完成</span></div>
  <p class="muted" style="font-size:12.5px;margin-top:-4px">20 篇约 250 词的原创短文，围绕 20 场 TED 演讲的主题写成。随时可读，读完做小测验得主题卡；想读完整演讲，在文章里点「导入这场演讲全文」。</p>
  <div class="cattabs">${["全部"].concat(CATS).map(c => `<button class="${LIB_CAT === c ? "on" : ""}" data-act="cat" data-c="${c}">${c}${c !== "全部" ? " " + ARTS.filter(a => a.cat === c).length : ""}</button>`).join("")}</div>
  <div class="libgrid">${list.map(a => {
    const p = progOf(a.id), d = ds.has(a.id); const [c1] = CATCOL[a.cat];
    return `<button class="acard" data-act="read" data-id="${a.id}"><span class="stripe" style="background:${c1}"></span>
    <span class="state">${d ? '<span class="tag g">已完成</span>' : ""}</span>
    <span class="faint" style="font-size:11.5px">${a.cat} · ${esc(a.sub)}</span><h3>${esc(a.title)}</h3><span class="zh">${esc(a.titleZh)}</span>
    <span class="meta"><span>约 ${a.words} 词</span><span>·</span><span>TED ${a.ted.year} · ${esc(a.ted.speaker)}</span>${p > 0 && !d ? `<span class="tag">${Math.round(p * 100)}%</span>` : ""}</span></button>`;
  }).join("")}</div>`;
}


/* ---------- reader ---------- */
function vRead() {
  const a = AMAP[READ_ID]; const user = isUser(a.id), p = progOf(a.id);
  const isCur = a.id === S.cur.art, d = isDone(a.id), full = hasTR(a.id);
  RMOD_VIEW = full ? Math.max(user ? 1 : 0, curMod(a.id)) : 0;
  const body = RMOD_VIEW === 0 ? introHTML(a) : moduleHTML(a.id, RMOD_VIEW);
  const cta = !user && FULL ? `<div class="fullcta"><div><b>短篇导读（约 250 词）</b><div class="muted" style="font-size:12.5px">想精读这场 TED 演讲的完整讲稿？导入全文会生成一篇新的精读推送：分部分阅读、全文查词解析，还能配现场原声。</div></div><button class="btn" data-act="import" data-id="${a.id}">导入这场演讲全文</button></div>` : "";
  const canFinish = !d && (user ? isCur : true);
  const T = TR[a.id];
  return `<div class="rhead"><div class="row"><span class="tag" style="background:${(CATCOL[a.cat] || CATCOL["其他"])[0]};color:#FFFFFF">${a.cat}</span><span class="muted">${user ? "精读" : "短篇 · " + esc(a.sub)}</span>${d ? '<span class="tag g">已完成</span>' : user ? (isCur ? '<span class="tag">本周精读</span>' : '<span class="tag r">预览</span>') : ""}${full ? `<span class="tag">${TX(a.id).mods.length} 部分 · ${T.words} 词</span>` : ""}</div>
  <h1>${esc(a.title)}</h1><div class="muted">${user ? (a.ted.speaker ? esc(a.ted.speaker) + " · " : "") + "导入于 " + fmtDate(ITEMS[a.id].at) : esc(a.titleZh)}</div>
  <div class="faint" style="font-size:12px">${user ? (a.ted.url ? `来源：<a href="${esc(a.ted.url)}" target="_blank" rel="noopener">${esc(a.ted.url.replace(/^https?:\/\//, "").slice(0, 60))}</a> · ` : "") + `<button class="linkbtn" data-act="itemdel" data-id="${a.id}">删除这篇</button>` : `TED 演讲：<a href="${esc(a.ted.url)}" target="_blank" rel="noopener">${esc(a.ted.title)}</a> — ${esc(a.ted.speaker)}，${a.ted.year}`}</div></div>
  ${cta}
  <div class="rtool glass">
    <div class="seg" role="tablist"><button data-act="rmode" data-m="en" class="${READ_MODE === "en" ? "on" : ""}">原文</button><button data-act="rmode" data-m="bi" class="${READ_MODE === "bi" ? "on" : ""}">对照</button><button data-act="rmode" data-m="zh" class="${READ_MODE === "zh" ? "on" : ""}">中文</button></div>
    <div class="seg"><button data-act="fs" data-d="-1" title="减小字号">A−</button><button data-act="fs" data-d="1" title="增大字号">A+</button></div>
    ${full ? `<button class="btn sm ${T.audio ? "" : "ghost"}" data-act="audiopanel">${I.ear}原声</button>` : ""}<button class="btn sm ghost" data-act="listen" data-id="${a.id}">${I.vol}朗读</button><button class="btn sm aibtn" data-act="hub" data-id="${a.id}">${I.spark}AI 学伴</button>
    <div class="prog"><div class="bar"><i id="rbar" style="width:${Math.round(p * 100)}%"></i></div><span class="num" id="rpct">${Math.round(p * 100)}%</span></div>
  </div>
  ${full && T.audio ? alnBox(a.id) : ""}
  ${full ? `<div id="modtabs">${modTabs(a.id)}</div>` : ""}
  <div class="reader${READ_MODE === "zh" ? " zhonly" : ""}" id="reader">${body}</div>
  <div class="rfoot"><div class="legend"><span><i style="background:color-mix(in srgb,var(--gold) 35%,transparent)"></i>重点词</span><span><i style="background:transparent;border-bottom:2px dotted var(--accent)"></i>已点学</span><span>单击单词：查词 · 双击或长按：整句解析</span></div>
  ${canFinish ? `<button class="btn" data-act="finish" id="finbtn" ${p < 0.9 ? "disabled" : ""}>完成${user ? "精读" : "短篇"}并测验</button>` : user && !d ? `<button class="btn" data-act="setpushhere" data-id="${a.id}">设为本周精读</button>` : ""}</div>
  ${canFinish ? `<p class="faint" style="font-size:12px">${full ? "逐个部分阅读，句子在屏幕上停留足够时间才计入进度；全文读到 90% 即可做完成测验。每读完一个部分都有奖励。" : "在英文原文或对照模式下逐段阅读，句子停留在屏幕上足够时间才计入进度；读到 90% 即可做测验。"}</p>` : user && !d ? `<p class="faint" style="font-size:12px">预览中：设为本周精读后才能完成测验、领取奖励。</p>` : ""}`;
}
async function finishQuiz() {
  const a = AMAP[READ_ID];
  const qs = a.quiz.map(q => ({ type: "comp", q: q.q, o: q.o, a: q.a, art: a.id }));
  if (hasTR(a.id)) {
    try { await ensureFull(); } catch (e) {}
    const want = isUser(a.id) ? 7 : 4; let guard = 0;
    while (qs.filter(x => x.type === "cloze").length < want && guard++ < 30) { const q = mkClozeT(a.id); if (q && !qs.some(x => x.sub === q.sub)) qs.push(q); }
    if (isUser(a.id)) shuffle(Object.values(VOC).filter(v => v.a === a.id && lx(v.k)).map(v => v.k)).slice(0, 3).forEach(k => { const q = mkMeaning(k); if (q) qs.push(q); });
  } else { const keys = shuffle(Object.keys(a.keys).filter(k => a.sents.some(s => s.toks.some(t => t[1] === k)))).slice(0, 2); keys.forEach(k => qs.push(mkCloze(a, k))); }
  const list = qs.filter(Boolean);
  if (list.length < 3) { toast("这篇内容太短，暂时出不了测验，直接记为完成"); complete(a.id, 1, 1); render(); return; }
  runQuiz({ title: "完成测验 · " + a.title, qs: list, onDone: (sc, tot) => {
    if (sc >= Math.ceil(tot * 0.6)) { closeModal(true); complete(a.id, sc, tot); render(); return false; }
    return "答对 " + sc + "/" + tot + "，需答对 " + Math.ceil(tot * 0.6) + " 题才算完成。看看解析，回顾原文后再试一次";
  } });
}
function itemDelete(id) {
  delete ITEMS[id]; delete TR[id]; delete TXC[id]; delete AMAP[id];
  ["tprog", "mdone", "rmod"].forEach(f => { if (S[f]) delete S[f][id]; });
  if (S.cur.art === id) S.cur.art = null; if (S.nextPick === id) S.nextPick = null;
  S.abandoned = S.abandoned.filter(x => x !== id); S.done = S.done.filter(x => x.a !== id);
  Object.keys(SEN).forEach(k => { if (SEN[k].a === id) delete SEN[k]; });
  idbDel(id).catch(() => {}); idbDel(id + "#asr").catch(() => {}); ALN.q = ALN.q.filter(x => x !== id); if (ALN.job && ALN.job.aid === id) ALN.job.cancel = true; if (AUD.aid === id) audioUnload();
  saveTR(); saveItems(); LS.set("sen", SEN); save();
}

/* ---------- import: files, paste, TED transcripts ---------- */

const AUD_ACCEPT = "audio/*,video/*,.mp3,.m4a,.aac,.wav,.flac,.ogg,.oga,.opus,.webm,.mp4,.m4v,.mov,.3gp,.amr,.wma,.aif,.aiff,.caf";
const AUD_TYPES = { mp3: "audio/mpeg", m4a: "audio/mp4", aac: "audio/aac", wav: "audio/wav", flac: "audio/flac", ogg: "audio/ogg", oga: "audio/ogg", opus: 'audio/ogg; codecs="opus"', webm: "audio/webm", mp4: "video/mp4", m4v: "video/mp4", mov: "video/quicktime", "3gp": "video/3gpp", amr: "audio/amr", wma: "audio/x-ms-wma", aif: "audio/aiff", aiff: "audio/aiff", caf: "audio/x-caf" };
function audioCheck(file) {
  const ext = (file.name.split(".").pop() || "").toLowerCase();
  if (!/^(audio|video)\//.test(file.type) && !AUD_TYPES[ext]) return { ok: false, msg: "这不是音频或视频文件" };
  const t = file.type || AUD_TYPES[ext]; let can = "";
  try { can = document.createElement("audio").canPlayType(t); } catch (e) {}
  return { ok: true, warn: can === "" ? `当前设备可能无法播放 .${ext} 格式（例如 iPhone 不支持 WMA、AMR，部分设备不支持 OGG）。如果播放不了，请转成 MP3 或 M4A 再导入。` : "" };
}
let IMP = {};
function impReset(pre) { IMP = Object.assign({ mode: null, raw: null, kind: null, paras: null, title: "", cat: "其他", src: "", speaker: "", zhRaw: "", zhMode: "none", audio: null, err: "", warn: "", busy: false, name: "", pasteText: "", zhPasting: false, files: null, notes: null, zipName: "", zipFolder: "", audioOnly: false, zhRawManual: "" }, pre || {}); }
impReset();
function decodeText(buf) {
  const u = new Uint8Array(buf);
  if (u[0] === 0xFF && u[1] === 0xFE) return new TextDecoder("utf-16le").decode(u);
  if (u[0] === 0xFE && u[1] === 0xFF) return new TextDecoder("utf-16be").decode(u);
  try { return new TextDecoder("utf-8", { fatal: true }).decode(u); } catch (e) { try { return new TextDecoder("gb18030").decode(u); } catch (e2) { return new TextDecoder().decode(u); } }
}
async function docxText(file) {
  await loadLib("xlsx");
  const cfb = XLSX.CFB.read(new Uint8Array(await file.arrayBuffer()), { type: "array" });
  const i = cfb.FullPaths.findIndex(p => /word\/document\.xml$/i.test(p)); if (i < 0) throw new Error("Word 文件里没有找到正文");
  const xml = new TextDecoder().decode(cfb.FileIndex[i].content);
  const doc = new DOMParser().parseFromString(xml, "application/xml");
  const W = "http://schemas.openxmlformats.org/wordprocessingml/2006/main"; const out = [];
  for (const p of doc.getElementsByTagNameNS(W, "p")) {
    let s = ""; for (const n of p.getElementsByTagNameNS(W, "*")) { if (n.localName === "t") s += n.textContent; else if (n.localName === "tab") s += " "; else if (n.localName === "br" || n.localName === "cr") s += "\n"; }
    s = s.trim(); if (s) out.push(s);
  }
  return out.join("\n");
}
async function pdfText(file) {
  await loadLib("pdf"); const lib = window.pdfjsLib; lib.GlobalWorkerOptions.workerSrc = "vendor/pdf.worker.min.js";
  const pdf = await lib.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise;
  const pages = [];
  for (let n = 1; n <= pdf.numPages; n++) {
    const pg = await pdf.getPage(n); const tc = await pg.getTextContent(); const lines = []; let cur = null;
    tc.items.forEach(it => { if (!("str" in it)) return; const y = it.transform[5], h = Math.abs(it.transform[3]) || 10; if (!cur || Math.abs(cur.y - y) > h * 0.5) { cur = { y, h, s: "" }; lines.push(cur); } cur.s += it.str; if (it.hasEOL) cur = null; });
    pages.push(lines.map(l => ({ y: l.y, h: l.h, s: l.s.replace(/\s+/g, " ").trim() })).filter(l => l.s));
  }
  if (!pages.some(p => p.length)) throw new Error("这个 PDF 里没有可提取的文字（可能是扫描版图片），请换成文字版 PDF、Word 或 TXT。");
  const freq = {}; pages.forEach(ls => { new Set([ls[0] && ls[0].s, ls[ls.length - 1] && ls[ls.length - 1].s].filter(Boolean)).forEach(s => freq[s] = (freq[s] || 0) + 1); });
  const out = [];
  pages.forEach(ls => { let prev = null; ls.forEach((l, i) => {
    if (/^\d{1,4}$/.test(l.s) || /^page \d+( of \d+)?$/i.test(l.s)) return;
    if (pages.length > 2 && freq[l.s] > pages.length * 0.5 && (i === 0 || i === ls.length - 1)) return;
    const gap = prev ? prev.y - l.y : 0, lh = Math.max(prev ? prev.h : l.h, l.h);
    const newPara = !prev || gap > lh * 1.75 || gap < 0 || Math.abs(l.h - prev.h) > Math.min(l.h, prev.h) * 0.25 || TS_RE.test(l.s) || TS_RE.test(prev.s) || cjkRatio(l.s) > 0.3 || cjkRatio(prev.s) > 0.3;
    if (newPara) out.push(l.s); else { const k = out.length - 1; out[k] = /-$/.test(out[k]) && /^[a-z]/.test(l.s) ? out[k].slice(0, -1) + l.s : out[k] + " " + l.s; }
    prev = l; }); });
  return out.join("\n");
}

function joinWrapped(text) {
  const blocks = text.replace(/\r/g, "").split(/\n\s*\n/);
  const multi = blocks.filter(b => b.trim().split("\n").length > 1).length;
  if (blocks.length < 3 || multi < blocks.length * 0.4) return text;
  return blocks.map(b => { const ls = b.split("\n").map(x => x.trim()).filter(Boolean); const out = []; ls.forEach(l => { const k = out.length - 1; if (k >= 0 && !TS_RE.test(l) && !TS_RE.test(out[k]) && cjkRatio(l) < 0.3 && cjkRatio(out[k]) < 0.3 && !/^\s*$/.test(out[k].replace(TS_RE, ""))) out[k] = /-$/.test(out[k]) && /^[a-z]/.test(l) ? out[k].slice(0, -1) + l : out[k] + " " + l; else out.push(l); }); return out.join("\n"); }).join("\n");
}
function toParas(text, kind) {
  if (kind === "sub") return subParas(text);
  const lines = joinWrapped(String(text)).replace(/ /g, " ").split("\n").map(l => l.trim()).filter(Boolean);
  const out = []; let pend = null, last = null;
  for (let l of lines) {
    const m = l.match(TS_RE);
    if (m) { pend = (+m[1] || 0) * 3600 + (+m[2]) * 60 + (+m[3]); l = l.slice(m[0].length).trim(); if (!l) continue; }
    if (JUNK_RE.test(l)) continue;
    if (cjkRatio(l) > 0.3) { if (last) last.zh = (last.zh || "") + l; continue; }
    if (!/[A-Za-z]{2}/.test(l)) continue;
    if (last && pend == null && !last.zh && !/[.!?"”’')\]:;]$/.test(last.text) && /^[a-z(“"'‘]/.test(l)) { last.text = /-$/.test(last.text) ? last.text.slice(0, -1) + l : last.text + " " + l; continue; }
    last = { t: pend, text: l }; out.push(last); pend = null;
  }
  return out;
}
function subParas(text) {
  const blocks = text.replace(/\r/g, "").replace(/^﻿?WEBVTT[^\n]*\n/, "").split(/\n\s*\n/); const caps = [];
  const TT = /(?:(\d+):)?(\d{1,2}):(\d{2})[.,](\d{1,3})\s*-->/;
  blocks.forEach(b => { const ls = b.split("\n").map(x => x.trim()).filter(Boolean); const ti = ls.findIndex(l => /-->/.test(l)); if (ti < 0) return; const m = ls[ti].match(TT); if (!m) return;
    const t = (+m[1] || 0) * 3600 + (+m[2]) * 60 + (+m[3]) + (+m[4]) / 1000;
    const body = ls.slice(ti + 1).map(x => x.replace(/<[^>]+>/g, "").replace(/\{[^}]+\}/g, "").trim()).filter(Boolean);
    const en = body.filter(x => cjkRatio(x) < 0.3).join(" "), zh = body.filter(x => cjkRatio(x) >= 0.3).join("");
    if (en || zh) caps.push({ t, en, zh }); });
  if (!caps.some(c => c.en)) return [];
  let full = ""; const marks = [];
  caps.forEach(c => { if (!c.en) return; marks.push([full.length + (full ? 1 : 0), c.t]); full += (full ? " " : "") + c.en; });
  const sents = splitSents(full); let cur = 0; const st = [];
  sents.forEach(s => { const i = full.indexOf(s.slice(0, Math.min(24, s.length)), cur); const pos = i < 0 ? cur : i; let tt = marks[0][1]; for (const [c, t] of marks) { if (c <= pos + 1) tt = t; else break; } st.push(tt); cur = pos + Math.max(1, s.length - 2); });
  const paras = [];
  for (let i = 0; i < sents.length; i += 5) { const s = sents.slice(i, i + 5), stt = st.slice(i, i + 5); const t0 = stt[0], t1 = i + 5 < st.length ? st[i + 5] : Infinity; const zh = caps.filter(c => c.zh && c.t >= t0 - 0.05 && c.t < t1).map(c => c.zh).join(""); paras.push({ t: Math.floor(t0), s, st: stt, zh }); }
  return paras;
}
function normParas(raw) {
  const out = [];
  raw.forEach(p => {
    if (p.s) { out.push(p); return; }
    const s = splitSents(p.text);
    if (s.length > 9 && raw.length < 6) { for (let i = 0; i < s.length; i += 5) out.push({ t: i === 0 ? p.t : null, s: s.slice(i, i + 5), zh: i === 0 ? (p.zh || "") : "" }); }
    else out.push({ t: p.t, s, zh: p.zh || "" });
  });
  return out.filter(p => p.s.length);
}
function alignZh(paras, zhRaw) {
  const zh = parseRaw(zhRaw).filter(z => cjkRatio(z.text) > 0.15); paras.forEach(p => { if (!p._zhInline) p.zh = ""; });
  if (!zh.length) return "none";
  const enT = paras.filter(p => p.t != null).length, zhT = zh.filter(p => p.t != null).length;
  if (enT >= paras.length * 0.6 && zhT >= zh.length * 0.6) {
    const byT = zh.filter(p => p.t != null);
    paras.forEach(p => { if (p.t == null) return; let best = null, bd = 3; byT.forEach(z => { const d = Math.abs(z.t - p.t); if (d <= bd) { bd = d; best = z; } }); if (best) { p.zh += best.text; best.used = 1; } });
    byT.filter(z => !z.used).forEach(z => { let k = 0; paras.forEach((p, i) => { if (p.t != null && p.t <= z.t) k = i; }); paras[k].zh += z.text; });
    return "ts";
  }
  if (zh.length === paras.length) { paras.forEach((p, i) => p.zh = zh[i].text); return "idx"; }
  zh.forEach((z, i) => { const k = Math.min(paras.length - 1, Math.floor(i * paras.length / zh.length)); paras[k].zh += z.text; });
  return "ratio";
}
function buildFromParas(paras, zhMode) {
  const words = paras.reduce((n, p) => n + p.s.join(" ").split(/\s+/).length, 0);
  const mods = []; let cur = [], w = 0;
  paras.forEach((p, i) => { const pw = p.s.join(" ").split(/\s+/).length; if (cur.length && w + pw > 430 && w >= 220) { mods.push(cur); cur = []; w = 0; } cur.push(i); w += pw; if (w >= 330) { mods.push(cur); cur = []; w = 0; } });
  if (cur.length) { if (mods.length && w < 120) mods[mods.length - 1].push(...cur); else mods.push(cur); }
  return { v: 1, at: Date.now(), paras: paras.map(p => { const o = { t: p.t, s: p.s, zh: p.zh || "" }; if (p.st && p.st.length === p.s.length) o.st = p.st; return o; }), mods: mods.map(c => [c[0], c[c.length - 1]]), words, zhMode: zhMode || (paras.some(p => p.zh) ? "inline" : "none"), off: 0, cal: [], audio: null };
}
const estMods = paras => buildFromParas(paras).mods.length;
function guessTitle(name, text) {
  let t = (name || "").replace(/\.[^.]+$/, "").replace(/[_]+/g, " ").replace(/\s+/g, " ").trim();
  if (!t || t.length < 4 || /^(document|untitled|新建|文档|transcript|\d+)$/i.test(t)) { const first = String(text).split("\n").map(x => x.replace(TS_RE, "").trim()).find(x => x && /[A-Za-z]/.test(x) && !JUNK_RE.test(x)) || ""; t = first.length <= 90 && !/[.!?]$/.test(first) ? first : first.split(/\s+/).slice(0, 8).join(" ") + "…"; }
  return t.slice(0, 80) || "导入的精读";
}
function pickQuote(T) {
  let best = "", bs = -1;
  T.paras.forEach(p => p.s.forEach(s => { const n = s.split(/\s+/).length; if (n < 7 || n > 22) return; const sc = s.split(/\s+/).filter(w => { const e = lx(keyFor(w)); return e && e.tags && e.tags.some(x => /CET6|考研|雅思|托福|GRE/.test(x)); }).length - Math.abs(n - 14) / 10; if (sc > bs) { bs = sc; best = s; } }));
  return best || (T.paras[0] && T.paras[0].s[0] || "").slice(0, 120);
}
function impPrep() { IMP.paras = normParas(toParas(IMP.raw, IMP.kind)); if (!IMP.paras.length) throw new Error("没有识别到英文内容。如果是扫描版 PDF（图片），需要先转成文字。");
  const h = IMP.paras[0]; if (IMP.paras.length > 2 && h.s.length === 1 && h.t == null && !h.zh && h.s[0].split(/\s+/).length <= 14 && !/[.!?;:,"”]$/.test(h.s[0])) { IMP.paras.shift(); if (!IMP.titleLocked) IMP.title = h.s[0]; } IMP._zhInline = IMP.paras.some(p => p.zh); IMP.paras.forEach(p => { if (p.zh) p._zhInline = 1; }); IMP.zhMode = IMP._zhInline ? "inline" : "none"; if (IMP.zhRaw) IMP.zhMode = alignZh(IMP.paras, IMP.zhRaw); }

async function impFromPaste() {
  const ta = $("#imptext"); const text = ta ? ta.value : IMP.pasteText; IMP.pasteText = text;
  if (!text || text.trim().split(/\s+/).length < 30) { IMP.err = "内容太短了，请粘贴完整的英文文本（至少几段）。"; render(); return; }
  IMP.busy = true; IMP.err = ""; render();
  try { await ensureFull(); IMP.raw = text; IMP.kind = /-->/.test(text.slice(0, 600)) ? "sub" : "text"; IMP.name = "粘贴的文本"; if (!IMP.titleLocked) IMP.title = guessTitle("", text); impPrep(); }
  catch (e) { IMP.err = (e && e.message) || "识别失败"; IMP.paras = null; }
  IMP.busy = false; render(); setTimeout(() => { const el = $("#s-prev"); if (el) el.scrollIntoView({ behavior: S.set.motion ? "smooth" : "auto", block: "start" }); }, 60);
}
async function impZh(text) { if (!IMP.paras) return; IMP.zhRaw = IMP.zhRawManual = text; (IMP.files || []).forEach(o => { if (o.role === "zh") o.role = "none"; }); IMP.zhMode = alignZh(IMP.paras, text); IMP.zhPasting = false; render(); toast(IMP.zhMode === "none" ? "没有识别到中文内容" : "已添加中文译文"); }
function importSheet(aid) {
  const a = AMAP[aid];
  impReset(a && !a.user ? { mode: "paste", titleLocked: true, title: a.ted.title, src: a.ted.url, cat: a.cat, speaker: a.ted.speaker } : { mode: "paste" });
  go("imp"); if (a && !a.user) toast("在 TED 官网打开讲稿、全选复制，再粘贴到这里");
}
async function impSave(push) {
  const P = IMP; if (!P.paras) return;
  const title = (($("#imptitle") || {}).value || P.title || "导入的精读").trim().slice(0, 80);
  const src = (($("#impsrc") || {}).value || P.src || "").trim();
  const id = "u_" + Date.now().toString(36);
  const T = buildFromParas(P.paras, P.zhMode);
  const meta = { id, title, cat: P.cat || "其他", src, speaker: P.speaker || "", at: Date.now(), quote: "" };
  TR[id] = T; meta.quote = pickQuote(T); ITEMS[id] = meta; regItem(meta);
  if (P.audio) { try { await idbPut(id, { blob: P.audio, name: P.audio.name, type: P.audio.type }); T.audio = { name: P.audio.name, type: P.audio.type, size: P.audio.size }; setTimeout(() => alnQueue(id), 800); } catch (e) { toast("音频保存失败：存储空间可能不足"); } }
  saveTR(); saveItems(); S.rmod = S.rmod || {}; S.rmod[id] = 1; impReset();
  if (!push) { save(); go("jing"); toast("已加入精读库"); return; }
  const cur = S.cur.art;
  if (cur && AMAP[cur] && !isDone(cur)) {
    save(); go("jing");
    modal(`<h2>已加入精读库</h2><p class="muted">本周已有精读《${esc(AMAP[cur].title)}》（进度 ${Math.round(progOf(cur) * 100)}%）。要把新导入的《${esc(title)}》设为本周精读吗？</p>
    <div class="acts"><button class="btn ghost" data-act="nextpick" data-id="${id}" data-close="1">排到下周</button><button class="btn warn" data-act="abandonto" data-id="${id}">放弃当前，改学新的</button></div>`);
    return;
  }
  setPush(id); toast("已生成本周精读推送"); openRead(id);
}

function impPreview() {
  const P = IMP, words = P.paras.reduce((n, p) => n + p.s.join(" ").split(/\s+/).length, 0), ns = P.paras.reduce((n, p) => n + p.s.length, 0);
  const ts = P.paras.filter(p => p.t != null).length, zh = P.paras.filter(p => p.zh).length, mods = estMods(P.paras);
  return `<div class="panel impprev" id="s-prev"><div class="sechead" style="margin:0 0 10px"><h3>预览与设置</h3><span class="muted" style="font-size:12px">${esc(P.name || "")} · <button class="linkbtn" data-act="impclear">重新选择</button></span></div>
  <div class="kv4"><div><b class="num">${words}</b><span>词</span></div><div><b class="num">${ns}</b><span>句</span></div><div><b class="num">${mods}</b><span>个部分</span></div><div><b class="num">${ts}</b><span>时间戳</span></div></div>
  ${words < 150 ? `<div class="note">内容比较短（${words} 词），也可以导入，但只会生成 1 个部分。</div>` : ""}
  ${impFilesHTML()}
  <label class="fld">标题<input type="text" id="imptitle" class="txt" value="${esc(P.title)}" maxlength="80"></label>
  <div class="fld"><span>分类</span><div class="topics">${CAT_ALL.map(c => `<button class="topic ${P.cat === c ? "on" : ""}" data-act="impcat" data-c="${c}">${c}</button>`).join("")}</div></div>
  <label class="fld">来源链接（可选）<input type="url" id="impsrc" class="txt" value="${esc(P.src)}" placeholder="https://www.ted.com/talks/…" spellcheck="false" autocomplete="off"></label>
  <div class="fld"><span>中文译文 <em class="muted">${zh ? "已对齐 " + zh + " 段" + (P.zhMode === "ratio" ? "（段数不一致，按比例大致对齐）" : "") : "未添加（可选）"}</em></span>
    <div class="row"><label class="btn sm ghost fileb">选择中文文件<input type="file" id="impzhfile" accept="${IMP_ACCEPT}"></label><button class="btn sm ghost" data-act="impzhpaste">粘贴中文</button>${zh ? '<button class="btn sm ghost" data-act="impzhclear">清除中文</button>' : ""}</div>
    ${P.zhPasting ? `<textarea id="impzhtext" class="imta sm" placeholder="在这里粘贴中文译文（带时间戳更准）"></textarea><div class="row" style="justify-content:flex-end"><button class="btn sm" data-act="impzhok">添加中文</button></div>` : ""}</div>
  <div class="fld"><span>现场音频 <em class="muted">${P.audio ? esc(P.audio.name) + "（" + (P.audio.size / 1048576).toFixed(1) + " MB）" : "未添加（可选，之后也能在阅读页添加）"}</em></span>
    <div class="row"><label class="btn sm ghost fileb">选择音频 / 视频<input type="file" id="impaudio" accept="${AUD_ACCEPT}"></label>${P.audio ? '<button class="btn sm ghost" data-act="impaudioclear">移除</button>' : ""}</div>
    <div class="faint" style="font-size:11.5px">支持 MP3、M4A、AAC、WAV、FLAC、MP4、MOV 等；OGG / OPUS / WEBM 视设备而定，WMA、AMR 在 iPhone 上无法播放。</div>${P.warn ? `<div class="note">${esc(P.warn)}</div>` : ""}</div>
  <div class="prevtext">${P.paras.slice(0, 3).map(p => `<p>${p.t != null ? `<span class="pstamp num">${fmtT(p.t)}</span> ` : ""}${esc(p.s.join(" "))}</p>${p.zh ? `<p class="zh">${esc(p.zh)}</p>` : ""}`).join("")}${P.paras.length > 3 ? `<p class="faint">…… 共 ${P.paras.length} 段</p>` : ""}</div>
  <div class="impacts"><button class="btn ghost" data-act="impsave" data-push="0">仅加入精读库</button><button class="btn" data-act="impsave" data-push="1">${I.spark}生成精读推送</button></div></div>`;
}

/* ---------- v1.4: ZIP packages, HTML text, multi-file import ---------- */
const IMP_ACCEPT = ".zip,.txt,.md,.text,.html,.htm,.xhtml,.srt,.vtt,.pdf,.docx,.doc,text/plain,text/html,application/zip,application/x-zip-compressed,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document";
const TEXT_EXT = new Set(["txt", "md", "text", "html", "htm", "xhtml", "srt", "vtt", "pdf", "docx", "doc"]);
const extOf = n => ((n || "").split("/").pop().split(".").pop() || "").toLowerCase();
const isAudioName = (n, type) => /^(audio|video)\//.test(type || "") || !!AUD_TYPES[extOf(n)];
function decodeName(b) { try { return new TextDecoder("utf-8", { fatal: true }).decode(b); } catch (e) { try { return new TextDecoder("gb18030").decode(b); } catch (e2) { return new TextDecoder().decode(b); } } }
async function unzipFile(file) {
  const buf = new Uint8Array(await file.arrayBuffer()), dv = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
  let e = -1; for (let i = buf.length - 22; i >= Math.max(0, buf.length - 65557); i--) if (dv.getUint32(i, true) === 0x06054b50) { e = i; break; }
  if (e < 0) throw new Error("这不是有效的 ZIP 压缩包（也可能是 RAR / 7z，请改用 ZIP 格式压缩）");
  let n = dv.getUint16(e + 10, true), cd = dv.getUint32(e + 16, true);
  if ((cd === 0xFFFFFFFF || n === 0xFFFF) && e >= 20 && dv.getUint32(e - 20, true) === 0x07064b50) { const z = Number(dv.getBigUint64(e - 12, true)); n = Number(dv.getBigUint64(z + 32, true)); cd = Number(dv.getBigUint64(z + 48, true)); }
  const ents = []; let p = cd;
  for (let k = 0; k < n && p + 46 <= buf.length; k++) {
    if (dv.getUint32(p, true) !== 0x02014b50) break;
    const flag = dv.getUint16(p + 8, true), method = dv.getUint16(p + 10, true);
    let cs = dv.getUint32(p + 20, true), us = dv.getUint32(p + 24, true), lo = dv.getUint32(p + 42, true);
    const fl = dv.getUint16(p + 28, true), xl = dv.getUint16(p + 30, true), cl = dv.getUint16(p + 32, true);
    const nb = buf.subarray(p + 46, p + 46 + fl);
    if (cs === 0xFFFFFFFF || us === 0xFFFFFFFF || lo === 0xFFFFFFFF) {
      let q = p + 46 + fl; const qe = q + xl;
      while (q + 4 <= qe) { const id = dv.getUint16(q, true), sz = dv.getUint16(q + 2, true); if (id === 1) { let r = q + 4; if (us === 0xFFFFFFFF) { us = Number(dv.getBigUint64(r, true)); r += 8; } if (cs === 0xFFFFFFFF) { cs = Number(dv.getBigUint64(r, true)); r += 8; } if (lo === 0xFFFFFFFF) lo = Number(dv.getBigUint64(r, true)); } q += 4 + sz; }
    }
    p += 46 + fl + xl + cl;
    const name = flag & 0x800 ? new TextDecoder().decode(nb) : decodeName(nb);
    if (/\/$/.test(name) || /(^|\/)(__MACOSX|\.DS_Store|Thumbs\.db|desktop\.ini)(\/|$)/i.test(name) || /(^|\/)\._/.test(name)) continue;
    const ds = lo + 30 + dv.getUint16(lo + 26, true) + dv.getUint16(lo + 28, true);
    ents.push({ name, method, enc: flag & 1, data: buf.subarray(ds, ds + cs), us });
  }
  if (!ents.length) throw new Error("压缩包是空的");
  if (ents.some(x => x.enc)) throw new Error("压缩包设置了密码，无法读取，请去掉密码后重新压缩");
  const want = ents.filter(x => TEXT_EXT.has(extOf(x.name)) || isAudioName(x.name) || extOf(x.name) === "zip");
  const skipped = ents.filter(x => !want.includes(x)).map(x => x.name.split("/").pop());
  const files = []; let cfb = null;
  for (const x of want) {
    let bytes = null;
    if (x.method === 0) bytes = x.data;
    else if (x.method === 8 && typeof DecompressionStream === "function") { try { bytes = new Uint8Array(await new Response(new Blob([x.data]).stream().pipeThrough(new DecompressionStream("deflate-raw"))).arrayBuffer()); } catch (er) { bytes = null; } }
    if (!bytes) {
      if (!cfb) { await loadLib("xlsx"); cfb = XLSX.CFB.read(buf, { type: "array" }); }
      const base = x.name.split("/").pop(); const i = cfb.FullPaths.findIndex(fp => fp.endsWith("/" + x.name) || fp.split("/").pop() === base);
      if (i < 0 || !cfb.FileIndex[i].content) { skipped.push(base + "（无法解压）"); continue; }
      bytes = cfb.FileIndex[i].content instanceof Uint8Array ? cfb.FileIndex[i].content : new Uint8Array(cfb.FileIndex[i].content);
    }
    const base = x.name.split("/").pop(), ext = extOf(base);
    files.push(new File([bytes], base, { type: AUD_TYPES[ext] || (ext === "html" || ext === "htm" ? "text/html" : ext === "pdf" ? "application/pdf" : "") }));
  }
  const tops = new Set(want.map(x => x.name.includes("/") ? x.name.split("/")[0] : ""));
  return { files, skipped, folder: tops.size === 1 ? [...tops][0] : "" };
}
function htmlText(src) {
  const doc = new DOMParser().parseFromString(src, "text/html");
  let title = ((doc.querySelector('meta[property="og:title"]') || {}).content || (doc.querySelector("title") || {}).textContent || "").trim();
  const h1 = doc.querySelector("h1"); const h1t = h1 ? h1.textContent.replace(/\s+/g, " ").trim() : "";
  if (h1t && h1t.length <= 120) title = h1t;
  title = title.split(/\s+[|｜–—]\s+|\s+-\s+(?=[^-]*$)/)[0].replace(/\s+/g, " ").trim();
  doc.querySelectorAll("script,style,noscript,template,svg,canvas,iframe,form,button,select,input,nav,header,footer,aside,[hidden],[aria-hidden=true],[role=navigation],[role=banner],[role=contentinfo]").forEach(n => n.remove());
  const cands = Array.from(doc.querySelectorAll("article,main,[role=main]")).filter(n => n.textContent.trim().length > 400);
  const root = cands.sort((a, b) => b.textContent.length - a.textContent.length)[0] || doc.body || doc.documentElement;
  const BLOCK = /^(P|DIV|SECTION|ARTICLE|MAIN|H[1-6]|LI|UL|OL|BLOCKQUOTE|PRE|TR|TD|TH|TABLE|DD|DT|DL|FIGCAPTION|FIGURE|HR|ADDRESS)$/;
  let out = "";
  (function walk(n) {
    for (const c of n.childNodes) {
      if (c.nodeType === 3) out += c.nodeValue.replace(/\s+/g, " ");
      else if (c.nodeType === 1) { const t = c.tagName; if (t === "BR") { out += "\n"; continue; } const b = BLOCK.test(t); if (b) out += "\n"; walk(c); if (b) out += "\n"; }
    }
  })(root);
  const lines = out.split("\n").map(l => l.trim()).filter(Boolean);
  const keep = lines.filter((l, i) => TS_RE.test(l) || cjkRatio(l) > 0.3 || l.split(/\s+/).length >= 5 || /[.!?"”]$/.test(l) || (i > 0 && TS_RE.test(lines[i - 1])));
  if (keep[0] && h1t && keep[0] === h1t) keep.shift();
  return { text: keep.join("\n"), title };
}
async function extractFile(file) {
  const ext = extOf(file.name);
  if (ext === "pdf" || file.type === "application/pdf") return { kind: "text", text: await pdfText(file) };
  if (ext === "docx") return { kind: "text", text: await docxText(file) };
  if (ext === "doc") throw new Error("暂不支持旧版 .doc 文件，请在 Word / WPS 里另存为 .docx 或 PDF 后再导入。");
  if (["pages", "rtf", "epub", "mobi", "key", "ppt", "pptx", "xls", "xlsx", "rar", "7z"].includes(ext)) throw new Error("暂不支持 ." + ext + "，请导出为 ZIP、HTML、PDF、Word（.docx）或 TXT 后再导入。");
  if (file.size > 40 * 1048576) throw new Error("文件太大（超过 40 MB）");
  const t = decodeText(await file.arrayBuffer());
  if (/\u0000/.test(t.slice(0, 2000))) throw new Error("无法识别的文件类型，请导入 ZIP、TXT、HTML、PDF、Word（.docx）或字幕文件。");
  if (ext === "html" || ext === "htm" || ext === "xhtml" || file.type === "text/html" || /^\s*(<!doctype html|<html[\s>]|<\?xml[^>]*>\s*(<!doctype[^>]*>\s*)?<html)/i.test(t.slice(0, 600))) { const h = htmlText(t); return { kind: "text", text: h.text, title: h.title, html: true }; }
  return { kind: ext === "srt" || ext === "vtt" || /^\s*(WEBVTT|\d+\s*\n\s*\d{1,2}:\d{2}:\d{2}[,.]\d{1,3}\s*-->)/.test(t.slice(0, 400)) ? "sub" : "text", text: t };
}
function textStats(t) { const en = (t.match(/[A-Za-z]{2,}/g) || []).length, zh = (t.match(/[㐀-鿿]/g) || []).length; const ts = (t.match(/^\s*(\d{1,2}:)?\d{1,2}:\d{2}\b/gm) || []).length + (t.match(/-->/g) || []).length; return { en, zh, ts }; }
async function expandFiles(list) {
  const files = [], notes = [];
  for (const f of list) {
    if (extOf(f.name) === "zip" || /zip/.test(f.type)) {
      const r = await unzipFile(f);
      for (const g of r.files) { if (extOf(g.name) === "zip") { const r2 = await unzipFile(g); files.push(...r2.files.filter(h => extOf(h.name) !== "zip")); r2.skipped.length && notes.push(...r2.skipped); } else files.push(g); }
      if (r.skipped.length) notes.push(...r.skipped);
      IMP.zipName = f.name; IMP.zipFolder = r.folder;
    } else files.push(f);
  }
  return { files, notes };
}
async function classifyFiles(files) {
  const out = [];
  for (const f of files) {
    const o = { name: f.name, size: f.size, file: f, role: "none", err: "" };
    if (isAudioName(f.name, f.type)) { o.type = "audio"; const c = audioCheck(f); o.warn = c.warn || ""; }
    else if (TEXT_EXT.has(extOf(f.name)) || /^text\//.test(f.type)) {
      o.type = "text";
      try { const r = await extractFile(f); Object.assign(o, { kind: r.kind, text: r.text, title: r.title || "", html: !!r.html }, textStats(r.text)); }
      catch (e) { o.err = e.message || "无法读取"; }
    } else o.type = "other";
    out.push(o);
  }
  const KP = { srt: 1.05, vtt: 1.05, txt: 1.03, md: 1.03, text: 1.03, docx: 1, html: 0.98, htm: 0.98, xhtml: 0.98, pdf: 0.95 };
  const enC = out.filter(o => o.type === "text" && !o.err && o.en >= 60);
  const main = enC.sort((a, b) => b.en * (KP[extOf(b.name)] || 1) * (b.ts > 3 ? 1.1 : 1) - a.en * (KP[extOf(a.name)] || 1) * (a.ts > 3 ? 1.1 : 1))[0];
  if (main) main.role = "en";
  if (main && main.zh < main.en * 0.5) { const zh = out.filter(o => o.type === "text" && !o.err && o !== main && o.zh >= 80 && o.zh > o.en).sort((a, b) => b.zh - a.zh)[0]; if (zh) zh.role = "zh"; }
  const base = s => s.replace(/\.[^.]+$/, "").toLowerCase();
  const auds = out.filter(o => o.type === "audio").sort((a, b) => (main && base(b.name) === base(main.name) ? 1e12 : 0) + b.size - ((main && base(a.name) === base(main.name) ? 1e12 : 0) + a.size));
  if (auds[0]) auds[0].role = "audio";
  out.forEach(o => { if (o.type === "text" && !o.err && o.role === "none" && o.en < 60 && o.zh < 80) o.err = "内容太少，未使用"; });
  return out;
}
function impApplyRoles() {
  const P = IMP, en = P.files.find(o => o.role === "en"), zh = P.files.find(o => o.role === "zh"), au = P.files.find(o => o.role === "audio");
  P.audio = au ? au.file : (P.files.some(o => o.type === "audio") ? null : P.audio); P.warn = au ? au.warn : "";
  P.zhRaw = zh ? zh.text : (P.zhRawManual || "");
  if (!en) { P.paras = null; return; }
  P.raw = en.text; P.kind = en.kind; P.name = (P.zipName ? P.zipName + " · " : "") + en.name;
  const htmlT = (en.title || (P.files.find(o => o.html && o.title) || {}).title || "").trim();
  const nameT = n => { const t = (n || "").replace(/\.[^.]+$/, "").replace(/[_]+/g, " ").trim(); return t.length >= 4 && !/^(document|untitled|新建|文档|transcript|audio|text|en|english|pack|archive|压缩包|\d+)( ?(en|english|txt|\d+))?$/i.test(t) ? t : ""; };
  if (!P.titleLocked) P.title = htmlT || nameT(P.zipFolder) || nameT(P.zipName) || guessTitle(en.name, en.text);
  impPrep();
  if (htmlT && !P.titleLocked) P.title = htmlT;
}
async function impFromFiles(list) {
  list = Array.from(list || []); if (!list.length) return;
  const onlyAudio = list.every(f => isAudioName(f.name, f.type));
  if (onlyAudio && IMP.paras) { const f = list[0], c = audioCheck(f); if (!c.ok) { toast(c.msg); return; } impKeepFields(); IMP.audio = f; IMP.warn = c.warn; (IMP.files || []).forEach(o => { if (o.role === "audio") o.role = "none"; }); render(); toast("已添加音频：" + f.name); return; }
  const keep = { title: IMP.title, src: IMP.src, cat: IMP.cat, speaker: IMP.speaker, titleLocked: IMP.titleLocked };
  impReset(Object.assign({}, IMP.titleLocked ? keep : { cat: IMP.cat }, { busy: true, name: list.map(f => f.name).join("、") })); render();
  try {
    await ensureFull();
    const ex = await expandFiles(list); IMP.notes = ex.notes;
    IMP.files = await classifyFiles(ex.files);
    if (!IMP.files.some(o => o.role === "en")) {
      const au = IMP.files.find(o => o.role === "audio");
      if (au) { IMP.audio = au.file; IMP.warn = au.warn; IMP.audioOnly = true; }
      else { const er = IMP.files.find(o => o.err); throw new Error(er && IMP.files.length === 1 ? er.err : "没有找到英文原文。" + (IMP.files.length > 1 ? "压缩包里的文件：" + IMP.files.map(o => o.name).join("、") : "") + "。支持 TXT、HTML、PDF、Word（.docx）、字幕。"); }
    } else impApplyRoles();
  } catch (e) { IMP.err = (e && e.message) || "无法读取这个文件"; IMP.paras = null; }
  IMP.busy = false; render(); setTimeout(() => { const el = $("#s-prev") || $("#imperr") || $("#s-aud"); if (el) el.scrollIntoView({ behavior: S.set.motion ? "smooth" : "auto", block: "start" }); }, 60);
}
async function impFromFile(file) { return impFromFiles([file]); }
function impKeepFields() { const ti = $("#imptitle"), sr = $("#impsrc"); if (ti) IMP.title = ti.value; if (sr) IMP.src = sr.value; }
function impSetRole(i, role) {
  impKeepFields(); const o = IMP.files[i]; if (!o) return;
  if (role === "none") o.role = "none"; else { IMP.files.forEach(x => { if (x.role === role) x.role = "none"; }); o.role = role; }
  if (role === "zh") IMP.zhRawManual = "";
  try { impApplyRoles(); IMP.err = ""; } catch (e) { IMP.err = e.message; }
  render();
}
function impFilesHTML() {
  const P = IMP; if (!P.files || P.files.length < 2 && !P.notes) return "";
  const RN = { en: ["英文原文", "g"], zh: ["中文译文", ""], audio: ["音频", ""], none: ["未使用", "off"] };
  const sz = b => b > 1048576 ? (b / 1048576).toFixed(1) + " MB" : Math.max(1, Math.round(b / 1024)) + " KB";
  return `<div class="fld"><span>${P.zipName ? "压缩包内容 · " + esc(P.zipName) : "已选择的文件"} <em class="muted">${P.files.length} 个文件，自动识别了用途，可以改</em></span>
  <div class="zlist">${P.files.map((o, i) => {
    const r = RN[o.role] || RN.none;
    const acts = o.type === "text" && !o.err ? [o.role !== "en" && o.en >= 30 ? `<button class="linkbtn" data-act="improle" data-i="${i}" data-r="en">设为原文</button>` : "", o.role !== "zh" && o.zh >= 30 ? `<button class="linkbtn" data-act="improle" data-i="${i}" data-r="zh">设为译文</button>` : "", o.role === "zh" ? `<button class="linkbtn" data-act="improle" data-i="${i}" data-r="none">不用</button>` : ""]
      : o.type === "audio" ? [o.role !== "audio" ? `<button class="linkbtn" data-act="improle" data-i="${i}" data-r="audio">用这个音频</button>` : `<button class="linkbtn" data-act="improle" data-i="${i}" data-r="none">不用</button>`] : [];
    const info = o.type === "text" ? (o.err ? esc(o.err) : `${o.html ? "HTML · " : ""}${o.en} 英文词${o.zh > 30 ? " · " + o.zh + " 汉字" : ""}${o.ts ? " · " + o.ts + " 个时间戳" : ""}`) : o.type === "audio" ? sz(o.size) + (o.warn ? " · 本机可能无法播放" : "") : "不支持的类型";
    return `<div class="zi"><span class="zic">${o.type === "audio" ? I.ear : I.doc}</span><div class="zt"><b>${esc(o.name)}</b><span>${info}</span></div><span class="tag ${r[1]}">${r[0]}</span><span class="za">${acts.join("")}</span></div>`;
  }).join("")}</div>${P.notes && P.notes.length ? `<div class="faint" style="font-size:11.5px">已忽略：${esc(P.notes.slice(0, 8).join("、"))}${P.notes.length > 8 ? " 等 " + P.notes.length + " 个" : ""}</div>` : ""}</div>`;
}
function impAudioOnlyHTML() {
  const P = IMP; if (!P.audioOnly || !P.audio || P.paras) return "";
  const noAud = Object.values(ITEMS).filter(m => !(TR[m.id] && TR[m.id].audio)).sort((a, b) => b.at - a.at);
  return `<div class="panel impprev" id="s-aud"><div class="sechead" style="margin:0 0 8px"><h3>已选择音频</h3><span class="muted" style="font-size:12px">${esc(P.audio.name)} · ${(P.audio.size / 1048576).toFixed(1)} MB</span></div>
  <p class="muted" style="font-size:13px;margin:0 0 10px">接下来二选一：再选英文原文，和这个音频一起生成新的精读；或者把它添加到精读库里已有的一篇。</p>
  ${P.warn ? `<div class="note">${esc(P.warn)}</div>` : ""}
  <div class="row"><label class="btn fileb">${I.doc}选择英文原文<input type="file" id="imptextfor" accept="${IMP_ACCEPT}"></label><button class="btn ghost" data-act="impmode" data-x="paste" data-keepaud="1">${I.paste}粘贴英文原文</button></div>
  ${noAud.length ? `<div class="fld"><span>添加到已有精读</span><div class="topics">${noAud.slice(0, 12).map(m => `<button class="topic" data-act="audtoitem" data-id="${m.id}">${esc(m.title)}</button>`).join("")}</div></div>` : ""}</div>`;
}
function vImp() {
  if (!FULL) return `<div class="empty">导入功能需要在 App 版中使用。</div>`;
  const P = IMP;
  const pickers = `<div class="impick">
    <label class="pickbig"><input type="file" id="impfile" accept="${IMP_ACCEPT},${AUD_ACCEPT}" multiple><span class="ib">${I.doc}</span><b>选择文件</b><span>ZIP · TXT · HTML · PDF · Word · 字幕 · 音频，可多选</span></label>
    <button class="pickbig ${P.mode === "paste" ? "on" : ""}" data-act="impmode" data-x="paste"><span class="ib">${I.paste}</span><b>粘贴文本</b><span>从网页或其他 App 复制</span></button>
    <button class="pickbig ${P.mode === "rec" ? "on" : ""}" data-act="impmode" data-x="rec"><span class="ib">${I.globe}</span><b>TED 讲稿</b><span>20 场推荐演讲</span></button></div>`;
  let mid = "";
  if (P.mode === "paste") mid = `<div class="panel"><label class="imlab" for="imptext">粘贴英文内容${P.title && P.src ? "：" + esc(P.title) : ""}<button class="btn sm ghost" data-act="paste" data-to="imptext">粘贴</button></label>
    <textarea id="imptext" class="imta" placeholder="00:12&#10;Paste English text here. Chinese lines and timestamps are recognised automatically…" spellcheck="false">${esc(P.pasteText)}</textarea>
    <div class="row" style="justify-content:space-between;margin-top:8px">${P.src ? `<a class="btn sm ghost" href="${esc(P.src)}/transcript?language=en" target="_blank" rel="noopener">打开 TED 讲稿</a>` : "<span></span>"}<button class="btn" data-act="impparse">识别内容</button></div></div>`;
  if (P.mode === "rec") mid = `<div class="panel"><div class="muted" style="font-size:13px;margin-bottom:8px">点「讲稿」在 TED 官网全选复制，回来点「粘贴导入」。标题、分类和链接会自动填好。</div>${recList("粘贴导入")}</div>`;
  const status = P.busy ? `<div class="note" style="background:var(--soft);margin-top:12px">正在解压和识别内容…</div>` : P.err ? `<div class="note" id="imperr" style="background:color-mix(in srgb,var(--rose) 14%,transparent);margin-top:12px">${esc(P.err)}</div>` : "";
  return `<div class="sechead"><h2>导入内容</h2></div>
  <p class="muted" style="margin-top:-4px;font-size:13px">导入英文材料，一键生成精读推送。可以直接选一个 <b>ZIP 压缩包</b>（里面放英文原文、中文译文、MP3 音频，会自动识别），也可以单独选文本或音频，或一次多选几个文件。文本支持 TXT、HTML、PDF、Word（.docx）、字幕（SRT / VTT）。导入的内容只保存在这台设备上。</p>
  ${pickers}<div class="faint dropnote" style="font-size:12px;margin:-4px 0 8px">电脑上也可以把文件直接拖到这个页面。</div>${mid}${status}${!P.busy ? impAudioOnlyHTML() : ""}${P.paras && !P.busy ? impPreview() : ""}`;
}

/* ---------- v1.5: page history + swipe right anywhere to go back ---------- */
const NAV_STACK = []; let NAV_CUR = null, NAV_BACKING = false;
function go(v, anchor) {
  if (ALIAS[v]) { anchor = anchor || ALIAS[v][1]; v = ALIAS[v][0]; }
  if (!VIEWNAMES.has(v)) v = "home";
  if (v === "read" && (!READ_ID || !AMAP[READ_ID])) READ_ID = S.cur.art || ARTS[0].id;
  if (v === "review" && anchor) REVIEW_TAB = EXAM_ANCH.has(anchor) ? "exam" : "mem";
  if (tabOf(v) && !isSubView(v)) LAST_TAB = v;
  const prev = Object.assign({}, NAV_CUR || { v: VIEW, r: VIEW === "read" ? READ_ID : null, rt: REVIEW_TAB }, { y: window.scrollY });
  VIEW = v; closeMenus(); closeSheet(); if (!modalLock) closeModal(true);
  try { history.replaceState(null, "", "#" + v); } catch (e) {}
  NAV_CUR = { v, r: v === "read" ? READ_ID : null, rt: REVIEW_TAB };
  if (!NAV_BACKING && prev && (prev.v !== NAV_CUR.v || prev.r !== NAV_CUR.r)) { NAV_STACK.push(prev); if (NAV_STACK.length > 40) NAV_STACK.shift(); }
  render(); window.scrollTo(0, 0);
  if (anchor) setTimeout(() => doSub(v, anchor), 30);
}
function navTarget() {
  while (NAV_STACK.length) { const e = NAV_STACK[NAV_STACK.length - 1]; if (e.v === "read" && (!e.r || !AMAP[e.r])) { NAV_STACK.pop(); continue; } return e; }
  if (isSubView(VIEW)) return { v: VIEW === "read" ? (isUser(READ_ID) ? "jing" : "short") : VIEW === "imp" ? "jing" : LAST_TAB, fallback: true };
  return null;
}
function canGoBack() { return !!navTarget(); }
function navBack() {
  const t = navTarget(); if (!t) return false;
  if (!t.fallback) NAV_STACK.pop();
  if (t.r) READ_ID = t.r; if (t.rt) REVIEW_TAB = t.rt;
  NAV_BACKING = true; try { go(t.v); } finally { NAV_BACKING = false; }
  if (t.y) { const y = t.y; requestAnimationFrame(() => window.scrollTo(0, y)); setTimeout(() => window.scrollTo(0, y), 60); }
  return true;
}
/* gesture: a rightward swipe that starts anywhere on the page goes back */
const SW = { on: false, x0: 0, y0: 0, t0: 0, dx: 0, lock: null, el: null, can: false, kind: null, lx: 0, lt: 0, v: 0 };
function swipeBlocked(t) {
  if (!t || !t.closest) return true;
  if (t.closest("input,textarea,select,[contenteditable=true],.abar,.menu,#bottombar,#side,.toast,#updbar,canvas,video,iframe")) return true;
  for (let n = t; n && n !== document.body; n = n.parentElement) { if (n.scrollWidth > n.clientWidth + 2 && n.scrollLeft > 2) { const ox = getComputedStyle(n).overflowX; if (ox === "auto" || ox === "scroll") return true; } }
  return false;
}
function swipeHint() { let h = $("#swipehint"); if (!h) { h = document.createElement("div"); h.id = "swipehint"; h.innerHTML = I.back; document.body.appendChild(h); } return h; }
function swipeLayer() {
  if ($(".modal")) return modalLock ? null : { kind: "modal", el: $(".modal") };
  if ($(".sheet")) return { kind: "sheet", el: $(".sheet") };
  return { kind: "page", el: $("#view") };
}
document.addEventListener("touchstart", e => {
  SW.on = false; if (e.touches.length !== 1 || $(".menu")) return;
  const t = e.touches[0]; if (swipeBlocked(e.target)) return;
  const L = swipeLayer(); if (!L || !L.el) return;
  if (window.getSelection && String(window.getSelection()).length) return;
  Object.assign(SW, { on: true, x0: t.clientX, y0: t.clientY, t0: performance.now(), lx: t.clientX, lt: performance.now(), v: 0, dx: 0, lock: null, el: L.el, kind: L.kind, can: L.kind !== "page" || canGoBack() });
}, { passive: true });
document.addEventListener("touchmove", e => {
  if (!SW.on || e.touches.length !== 1) return;
  const t = e.touches[0], dx = t.clientX - SW.x0, dy = t.clientY - SW.y0;
  if (!SW.lock) {
    if (Math.abs(dx) < 10 && Math.abs(dy) < 10) return;
    if (dx > 0 && Math.abs(dx) > Math.abs(dy) * 1.4) { SW.lock = "x"; clearTimeout(lpT); clearTimeout(clickT); clickT = null; SW.el.style.transition = "none"; SW.el.style.willChange = "transform"; document.documentElement.classList.add("swiping"); }
    else { SW.on = false; return; }
  }
  e.preventDefault();
  const now = performance.now(); SW.v = (t.clientX - SW.lx) / Math.max(1, now - SW.lt); SW.lx = t.clientX; SW.lt = now;
  SW.dx = Math.max(0, dx); const W = window.innerWidth;
  const shown = SW.can ? SW.dx : W * 0.12 * (1 - Math.exp(-SW.dx / (W * 0.25)));
  SW.el.style.transform = `translateX(${shown}px)`;
  if (SW.kind === "page") { const h = swipeHint(), p = Math.min(1, SW.dx / (W * 0.3)); h.classList.toggle("ok", SW.can && p >= 1); h.classList.toggle("no", !SW.can); h.style.opacity = SW.can ? Math.min(1, p * 1.4) : Math.min(.5, p); h.style.transform = `translate(${Math.min(SW.dx * 0.35, 46) - 46}px,-50%) scale(${0.7 + 0.3 * p})`; }
}, { passive: false });
function swipeEnd(cancel) {
  if (!SW.on) return; SW.on = false; if (SW.lock !== "x") return;
  document.documentElement.classList.remove("swiping");
  const el = SW.el, W = window.innerWidth, h = $("#swipehint"), mo = S.set.motion !== false;
  const go2 = !cancel && SW.can && (SW.dx > W * 0.3 || (SW.v > 0.45 && SW.dx > 40));
  if (h) { h.style.transition = "opacity .2s,transform .2s"; h.style.opacity = 0; setTimeout(() => { if (h) { h.style.transition = ""; } }, 220); }
  const clear = () => { el.style.transition = ""; el.style.transform = ""; el.style.willChange = ""; el.style.opacity = ""; };
  if (!go2) { el.style.transition = mo ? "transform .28s cubic-bezier(.2,.9,.3,1)" : "none"; el.style.transform = "translateX(0)"; setTimeout(clear, 300); return; }
  if (SW.kind !== "page") { el.style.transition = mo ? "transform .2s ease-out, opacity .2s" : "none"; el.style.transform = `translateX(${W}px)`; el.style.opacity = 0; setTimeout(() => { if (SW.kind === "sheet") closeSheet(); else closeModal(); clear(); }, mo ? 190 : 0); return; }
  el.style.transition = mo ? "transform .18s ease-out, opacity .18s" : "none"; el.style.transform = `translateX(${W}px)`; el.style.opacity = mo ? .3 : 1;
  setTimeout(() => {
    clear(); navBack();
    if (!mo) return; const v = $("#view"); v.style.transition = "none"; v.style.transform = `translateX(${-W * 0.25}px)`; v.style.opacity = .4;
    requestAnimationFrame(() => requestAnimationFrame(() => { v.style.transition = "transform .3s cubic-bezier(.2,.9,.3,1), opacity .3s"; v.style.transform = "translateX(0)"; v.style.opacity = 1; setTimeout(() => { v.style.transition = ""; v.style.transform = ""; v.style.opacity = ""; }, 320); }));
  }, mo ? 170 : 0);
}
document.addEventListener("touchend", () => swipeEnd(false), { passive: true });
document.addEventListener("touchcancel", () => swipeEnd(true), { passive: true });

/* ---------- v1.6: on-device speech recognition → sentence-accurate audio alignment ---------- */
const ALN = { w: null, seq: 0, wait: {}, q: [], job: null, dl: {} };
function alnWorker() {
  if (ALN.w) return ALN.w;
  const w = new Worker("align-worker.js", { type: "module" });
  w.onmessage = e => {
    const m = e.data;
    if (m.type === "dl") { ALN.dl[m.file] = [m.loaded, m.total]; alnUI(); return; }
    const k = m.type === "ready" ? "load" : m.id; const p = ALN.wait[k]; if (!p) return; delete ALN.wait[k];
    if (m.type === "err") p.rej(new Error(m.msg)); else p.res(m);
  };
  w.onerror = e => { Object.values(ALN.wait).forEach(p => p.rej(new Error("识别组件加载失败" + (e && e.message ? "：" + e.message : "")))); ALN.wait = {}; ALN.w = null; };
  return (ALN.w = w);
}
function alnCall(msg, ms) {
  const k = msg.type === "load" ? "load" : (msg.id = ++ALN.seq);
  return new Promise((res, rej) => {
    const to = setTimeout(() => { delete ALN.wait[k]; rej(new Error("timeout")); }, ms || 180000);
    ALN.wait[k] = { res: v => { clearTimeout(to); res(v); }, rej: er => { clearTimeout(to); rej(er); } };
    alnWorker().postMessage(msg, msg.pcm ? [msg.pcm.buffer] : []);
  });
}
function alnReset() { if (ALN.w) { try { ALN.w.terminate(); } catch (e) {} } ALN.w = null; ALN.wait = {}; }
async function decodePCM(blob) {
  const buf = await blob.arrayBuffer();
  const OAC = window.OfflineAudioContext || window.webkitOfflineAudioContext;
  const ctx = new OAC(1, 16000, 16000);
  const ab = await new Promise((res, rej) => { const p = ctx.decodeAudioData(buf, res, rej); if (p && p.then) p.then(res, rej); });
  const n = ab.length, out = new Float32Array(n), ch = ab.numberOfChannels;
  for (let c = 0; c < ch; c++) { const d = ab.getChannelData(c); for (let i = 0; i < n; i++) out[i] += d[i] / ch; }
  return { pcm: out, sr: ab.sampleRate, dur: ab.duration };
}
const normW = w => w.toLowerCase().replace(/[’']/g, "").replace(/[^a-z0-9]+/g, "");
function speechClock(runs) {
  const R = runs.filter(r => r[1] - r[0] >= 0.12), cum = [0]; R.forEach((r, i) => cum.push(cum[i] + r[1] - r[0]));
  const toS = t => { let lo = 0, hi = R.length; while (lo < hi) { const m = (lo + hi) >> 1; if (R[m][0] < t) lo = m + 1; else hi = m; } let p = cum[lo]; if (lo && R[lo - 1][1] > t) p -= R[lo - 1][1] - t; return t - p; };
  const fromS = u => { let lo = 0, hi = R.length; while (lo < hi) { const m = (lo + hi) >> 1; if (R[m][0] - cum[m] <= u) lo = m + 1; else hi = m; } return u + cum[lo]; };
  return { toS, fromS };
}
function segWords(segs, runs) {
  const out = []; let prevTxt = ""; const C = speechClock(runs || []);
  const rs = segs.filter(sg => sg.e != null && sg.e > sg.s && sg.x.trim().length > 20 && !loopy(sg.x)).map(sg => (C.toS(sg.e) - C.toS(sg.s)) / sg.x.trim().length).filter(x => x > 0).sort((a, b) => a - b);
  const cps = rs.length ? rs[Math.floor(rs.length / 2)] : 0.06;
  segs.forEach((sg, si) => {
    const txt = sg.x.trim(); if (!txt || /^[\[(].*[\])]$/.test(txt)) return;
    if (loopy(txt)) return;
    const nt = txt.toLowerCase().replace(/[^a-z ]/g, ""); if (nt === prevTxt) return; prevTxt = nt;
    const ws = txt.split(/\s+/).filter(Boolean); const L = ws.reduce((n, w) => n + w.length + 1, 0) || 1;
    const e = sg.e != null && sg.e > sg.s ? sg.e : sg.s + txt.length * 0.065;
    let us = C.toS(sg.s); const ue = Math.max(us + 0.05, C.toS(e)), needS = txt.length * cps;
    if (ue - us > needS * 1.4 + 0.6) us = ue - needS * 1.1;
    let acc = 0;
    ws.forEach(w => { const n = normW(w); if (n) out.push({ w: n, t: C.fromS(us + (ue - us) * acc / L), sg: si, a: acc, L, us, ue }); acc += w.length + 1; });
  });
  out.C = C; out.cps = cps;
  return out;
}
/* semi-global alignment of transcript words (T) against recognised words (A) */
function alignSeq(T, A) {
  const n = T.length, m = A.length, W = m + 1;
  const tb = new Uint8Array((n + 1) * W); let prev = new Float32Array(W), cur = new Float32Array(W); const colm = new Float32Array(n + 1);
  const sim = (a, b) => { if (a === b) return a.length <= 2 ? 2 : 3; if (a.length >= 4 && b.length >= 4) { if (a.slice(0, 4) === b.slice(0, 4) || a.slice(-4) === b.slice(-4)) return 1; } return -1; };
  for (let i = 1; i <= n; i++) {
    cur[0] = 0; tb[i * W] = 2; const ti = T[i - 1];
    for (let j = 1; j <= m; j++) {
      const d = prev[j - 1] + sim(ti, A[j - 1].w), u = prev[j] - 1, l = cur[j - 1] - 1;
      if (d >= u && d >= l) { cur[j] = d; tb[i * W + j] = 0; } else if (u >= l) { cur[j] = u; tb[i * W + j] = 1; } else { cur[j] = l; tb[i * W + j] = 2; }
    }
    colm[i] = cur[m]; const sw = prev; prev = cur; cur = sw;
  }
  // free end gaps: best cell in last row or last column
  let bi = n, bj = 0, best = -1e9;
  for (let j = 0; j <= m; j++) if (prev[j] > best) { best = prev[j]; bj = j; }
  for (let r = 1; r < n; r++) if (colm[r] > best) { best = colm[r]; bi = r; bj = m; }
  const pairs = new Int32Array(n).fill(-1);
  let i = bi, j = bj;
  while (i > 0 && j > 0) { const d = tb[i * W + j]; if (d === 0) { if (sim(T[i - 1], A[j - 1].w) > 0) pairs[i - 1] = j - 1; i--; j--; } else if (d === 1) i--; else j--; }
  return pairs;
}
function pauseRuns(pcm) {
  const F = 320, n = Math.floor(pcm.length / F), db = new Float32Array(n), zc = new Float32Array(n);
  for (let k = 0; k < n; k++) { let e = 0, z = 0, o = k * F; for (let i = o; i < o + F; i++) { e += pcm[i] * pcm[i]; if (i > o && (pcm[i] >= 0) !== (pcm[i - 1] >= 0)) z++; } db[k] = 10 * Math.log10(e / F + 1e-10); zc[k] = z / F; }
  const blk = 250, quiet = new Uint8Array(n), noisy = new Uint8Array(n);
  for (let b0 = 0; b0 < n; b0 += blk) {
    const a = Math.max(0, b0 - blk), b = Math.min(n, b0 + 2 * blk), arr = Array.from(db.subarray(a, b)).sort((x, y) => x - y);
    const lo = arr[Math.floor(arr.length * 0.1)], hi = arr[Math.floor(arr.length * 0.9)], th = lo + 0.3 * (hi - lo);
    for (let k = b0; k < Math.min(n, b0 + blk); k++) { quiet[k] = db[k] < th ? 1 : 0; noisy[k] = !quiet[k] && zc[k] > 0.28 ? 1 : 0; }
  }
  const runs = [], push = (k0, k1, kind) => { if (runs.length && k0 / 50 - runs[runs.length - 1][1] <= 0.08) { const r = runs[runs.length - 1]; r[1] = k1 / 50; r[2] |= kind; } else runs.push([k0 / 50, k1 / 50, kind]); };
  let k = 0;
  while (k < n) {
    if (quiet[k] || noisy[k]) { let e = k, nq = 0, nn = 0; while (e < n && (quiet[e] || noisy[e])) { if (quiet[e]) nq++; else nn++; e++; } if (nq >= 5 || nn >= 20) push(k, e, nn >= 20 ? 2 : 1); k = e; } else k++;
  }
  return runs;
}
function snapStart(t, runs, win, lo, cm) {
  let best = null, bs = -1e9;
  for (const r of runs) {
    if (r[1] < t - win || r[0] > t + win) continue;
    const end = r[1], d = Math.abs(end - t), len = r[1] - r[0];
    if (end < lo) continue;
    const sc = Math.min(len, r[2] & 2 ? 1.5 : 0.6) - 0.8 * (end > t + win ? 0 : d);
    if (sc > bs) { bs = sc; best = end; }
  }
  return best != null ? Math.max(0, best - 0.04) : t;
}
function buildAlign(aid, words, E, dur) {
  const X = TX(aid); const tw = [], tg = [];
  const TAG = /^\s*[\(\[][^)\]]{1,40}[\)\]][.!]?\s*$/, isTag = X.flat.map(f => TAG.test(f.en));
  X.flat.forEach((f, g) => { if (!isTag[g]) f.en.replace(/\([^)]{1,40}\)/g, " ").split(/\s+/).forEach(w => { const n = normW(w); if (n) { tw.push(n); tg.push(g); } }); });
  const pairs = alignSeq(tw, words);
  const ok = new Uint8Array(tw.length);
  for (let i = 0; i < tw.length; i++) if (pairs[i] >= 0) { let nb = 0; for (let d = -2; d <= 2; d++) if (d && pairs[i + d] >= 0 && pairs[i + d] - pairs[i] === d) nb++; if (nb >= 1) ok[i] = 1; }
  // transcript words the recogniser missed right before a new segment were probably spoken at that segment's start → re-time it
  if (words.C) {
    const tchars = tw.map(w => w.length + 1); let ip = -1;
    for (let i = 0; i < tw.length; i++) {
      if (!ok[i]) continue;
      const j = pairs[i], wj = words[j];
      if (ip >= 0 && i - ip > 1) {
        const jp = pairs[ip], wp = words[jp];
        const firstInSeg = j === 0 || words[j - 1].sg !== wj.sg, prevLast = jp + 1 >= words.length || words[jp + 1].sg !== wp.sg;
        if (wp.sg !== wj.sg && firstInSeg && prevLast) {
          let M = 0; for (let k = ip + 1; k < i; k++) M += tchars[k];
          const sgId = wj.sg, span = wj.ue - wj.us, mt = Math.min(M * words.cps, Math.max(0, span - wj.L * words.cps));
          if (mt > 0.3) for (let q = j; q < words.length && words[q].sg === sgId; q++) { const x = words[q]; x.t = words.C.fromS(x.us + mt + (span - mt) * x.a / x.L); }
        }
      }
      ip = i;
    }
  }
  const anc = []; for (let i = 0; i < tw.length; i++) if (ok[i]) { const t = words[pairs[i]].t; if (!anc.length || t >= anc[anc.length - 1][1]) anc.push([i, t]); }
  const wt = new Float64Array(tw.length).fill(NaN); anc.forEach(([i, t]) => wt[i] = t);
  const RATE = 0.36;
  if (!anc.length) return null;
  for (let i = 0; i < anc[0][0]; i++) wt[i] = Math.max(0, anc[0][1] - (anc[0][0] - i) * RATE);
  for (let k = 0; k + 1 < anc.length; k++) {
    const [i0, t0] = anc[k], [i1, t1] = anc[k + 1]; if (i1 - i0 < 2) continue;
    const need = (i1 - i0) * RATE, span = t1 - t0;
    for (let i = i0 + 1; i < i1; i++) wt[i] = span > need * 1.8 + 2 ? t0 + (i - i0) * RATE : t0 + span * (i - i0) / (i1 - i0);
  }
  const L = anc[anc.length - 1]; for (let i = L[0] + 1; i < tw.length; i++) wt[i] = Math.min(dur || 1e9, L[1] + (i - L[0]) * RATE);
  const n = X.flat.length, st = new Array(n).fill(null), hit = new Array(n).fill(0), cnt = new Array(n).fill(0);
  for (let i = 0; i < tw.length; i++) { const g = tg[i]; if (st[g] == null) st[g] = wt[i]; cnt[g]++; if (ok[i]) hit[g]++; }
  const first = new Array(n).fill(-1); for (let i = tg.length - 1; i >= 0; i--) first[tg[i]] = i;
  const speech = []; for (let g = 0; g < n; g++) if (!isTag[g] && st[g] != null) speech.push(g);
  let prevT = 0;
  speech.forEach((g, k) => {
    const firstOk = first[g] >= 0 && ok[first[g]];
    const gap = k + 1 < speech.length ? st[speech[k + 1]] - st[g] : cnt[g] * 0.33;
    const en = X.flat[g].en, ci = en.search(/[,;:—–]/), cm = ci > 0 && ci < 45 ? ci * 0.062 : 0;
    st[g] = snapStart(st[g], E, Math.min(firstOk ? 0.8 : 1.4, Math.max(0.3, gap * 0.4)), k ? prevT + 0.3 : 0, cm);
    if (k && st[g] < prevT + 0.25) st[g] = prevT + 0.25;
    prevT = st[g];
  });
  for (let g = 0; g < n; g++) {
    if (st[g] != null && !isTag[g]) continue;
    const prev = g ? st[g - 1] : 0; let next = dur || prev + 5; for (let h = g + 1; h < n; h++) if (st[h] != null && !isTag[h]) { next = st[h]; break; }
    const run = isTag[g] ? E.find(r => (r[2] & 2) && r[0] >= prev + 0.5 && r[0] < next - 0.2) : null;
    st[g] = run ? run[0] : Math.min(Math.max(prev + 0.3, next - 2.5), Math.max(prev + 0.05, next - 0.1));
  }
  const matched = hit.filter((h, g) => h >= Math.min(2, cnt[g])).length;
  return { v: 1, st: st.map(x => Math.round(x * 100) / 100), at: Date.now(), cov: Math.round(ok.reduce((a, b) => a + b, 0) / tw.length * 100), sm: Math.round(matched / n * 100), dur: Math.round(dur) };
}
function loopy(x) {
  const w = (x || "").toLowerCase().replace(/[^a-z' ]/g, " ").split(/\s+/).filter(Boolean); if (w.length < 12) return false;
  const c = {}; let mx = 0; for (let i = 0; i + 2 < w.length; i++) { const k = w[i] + " " + w[i + 1] + " " + w[i + 2]; c[k] = (c[k] || 0) + 1; if (c[k] > mx) mx = c[k]; }
  return mx >= 4 && mx * 3 > w.length * 0.25;
}
function alnStatus(aid) { const T = TR[aid]; if (!T || !T.audio) return "none"; if (ALN.job && ALN.job.aid === aid) return "run"; if (ALN.q.includes(aid)) return "queued"; return T.align ? "done" : "todo"; }
function alnQueue(aid, front) {
  if (!FULL || !TR[aid] || !TR[aid].audio) return;
  if (typeof Worker !== "function" || !(window.OfflineAudioContext || window.webkitOfflineAudioContext) || typeof WebAssembly !== "object") { toast("这个浏览器不支持本地语音识别，无法自动对齐"); return; }
  if ((ALN.job && ALN.job.aid === aid) || ALN.q.includes(aid)) return;
  front ? ALN.q.unshift(aid) : ALN.q.push(aid); alnUI(); alnNext();
}
function alnCancel() { if (ALN.job) ALN.job.cancel = true; ALN.q = []; alnUI(); }
async function alnNext() {
  if (ALN.job || !ALN.q.length) return;
  const aid = ALN.q.shift(); const job = ALN.job = { aid, pct: 0, phase: "prep", t0: Date.now(), cancel: false, eta: null };
  alnUI();
  try {
    const rec = await idbGet(aid); if (!rec || !rec.blob) throw new Error("找不到这篇的音频文件");
    job.phase = "decode"; alnUI();
    const { pcm, dur } = await decodePCM(rec.blob);
    if (!dur || dur < 3) throw new Error("音频太短或无法解码");
    const SR = 16000;
    let part = await idbGet(aid + "#asr").catch(() => null);
    if (!part || part.size !== rec.blob.size || Math.abs((part.dur || 0) - dur) > 1) part = { size: rec.blob.size, dur, seek: 0, segs: [] };
    job.phase = "load"; alnUI();
    await alnCall({ type: "load" }, 600000);
    job.phase = "asr"; const tStart = Date.now(), seek0 = part.seek; let fails = 0;
    while (part.seek < dur - 1) {
      if (job.cancel) throw new Error("cancel");
      const s0 = Math.floor(part.seek * SR), win = pcm.slice(s0, Math.min(pcm.length, s0 + 30 * SR)), wl = win.length / SR;
      let r;
      try { r = await alnCall({ type: "run", pcm: win }, 240000); fails = 0; }
      catch (er) { if (job.cancel) throw new Error("cancel"); if (++fails > 2) throw er; alnReset(); await alnCall({ type: "load" }, 600000); continue; }
      if ((r.chunks || []).some(c => loopy(c.x))) {
        for (const temp of [0.4, 0.7]) { let r2 = null; try { r2 = await alnCall({ type: "run", pcm: pcm.slice(s0, Math.min(pcm.length, s0 + 30 * SR)), opts: { do_sample: true, temperature: temp } }, 240000); } catch (er) {} if (r2 && r2.chunks && r2.chunks.length && !r2.chunks.some(c => loopy(c.x))) { r = r2; break; } }
      }
      if ((r.chunks || []).some(c => loopy(c.x))) {
        const halves = wl > 12 ? [[0, wl / 2], [wl / 2, wl]] : [[0, wl]];
        for (const [h0, h1] of halves) {
          let rr = null; if (halves.length > 1) { try { rr = await alnCall({ type: "run", pcm: pcm.slice(s0 + Math.floor(h0 * SR), s0 + Math.floor(h1 * SR)) }, 240000); } catch (er) { rr = null; } } else rr = r;
          ((rr && rr.chunks) || []).filter(c => !loopy(c.x)).forEach(c => part.segs.push({ s: part.seek + h0 + (c.t[0] || 0), e: c.t[1] == null ? null : part.seek + h0 + c.t[1], x: c.x }));
        }
        part.seek += wl; job.pct = Math.min(99, Math.round(part.seek / dur * 100)); idbPut(aid + "#asr", part).catch(() => {}); alnUI(); continue;
      }
      const ch = r.chunks || []; const partial = wl >= 29.5;
      let adv = Math.min(30, wl);
      const keep = ch.filter((c, i) => !(partial && i === ch.length - 1 && ch.length > 1 && (c.t[1] == null || c.t[1] >= wl - 0.5)));
      keep.forEach(c => part.segs.push({ s: part.seek + (c.t[0] || 0), e: c.t[1] == null ? null : part.seek + c.t[1], x: c.x }));
      if (partial) { const last = ch[ch.length - 1]; if (ch.length > 1 && last && (last.t[1] == null || last.t[1] >= wl - 0.5)) adv = Math.max(8, last.t[0]); else if (last && last.t[1] != null && last.t[1] > 8) adv = Math.min(30, last.t[1]); }
      part.seek += adv; job.pct = Math.min(99, Math.round(part.seek / dur * 100));
      const el = (Date.now() - tStart) / 1000, doneS = part.seek - seek0; job.eta = doneS > 20 ? el / doneS * (dur - part.seek) : null;
      idbPut(aid + "#asr", part).catch(() => {}); alnUI();
    }
    job.phase = "match"; alnUI();
    const al = (() => { const R = pauseRuns(pcm); return buildAlign(aid, segWords(part.segs, R), R, dur); })();
    if (!al) throw new Error("没有识别到和原文一致的内容，请确认音频和原文是同一场演讲");
    if (!TR[aid]) return;
    TR[aid].align = al; TR[aid].cal = []; delete TR[aid].fix; delete TXC[aid]; saveTR();
    if (AUD.aid === aid) { computeStarts(aid); AUD.last = -1; }
    toast(al.sm >= 60 ? `「${(AMAP[aid] || {}).title || ""}」对齐完成：${al.sm}% 的句子在音频里精确定位` : `对齐完成，但只有 ${al.sm}% 的句子能在音频里找到，音频和原文可能不完全一致`, 5000);
  } catch (e) {
    if (e.message !== "cancel") { console.error(e); toast("对齐失败：" + (e.message === "timeout" ? "识别超时，请让 App 保持在前台后重试" : e.message), 6000); }
  } finally {
    ALN.job = null; if (VIEW === "read" || VIEW === "jing" || VIEW === "practice") render(); else alnUI();
    setTimeout(alnNext, 300);
  }
}
function alnMsg() {
  const j = ALN.job; if (!j) return "";
  const dl = Object.values(ALN.dl), got = dl.reduce((a, b) => a + b[0], 0), tot = dl.reduce((a, b) => a + b[1], 0);
  if (j.phase === "prep" || j.phase === "decode") return "正在解码音频…";
  if (j.phase === "load") return tot && got < tot ? `首次使用：下载识别模型 ${(got / 1048576).toFixed(0)} / ${(tot / 1048576).toFixed(0)} MB` : "正在加载识别模型…";
  if (j.phase === "match") return "正在逐句匹配…";
  return `正在识别音频 ${j.pct}%${j.eta != null ? " · 约剩 " + (j.eta > 90 ? Math.ceil(j.eta / 60) + " 分钟" : Math.max(5, Math.round(j.eta / 5) * 5) + " 秒") : ""}`;
}
function alnBox(aid) {
  const st = alnStatus(aid), T = TR[aid];
  if (st === "none") return "";
  if (st === "run") return `<div class="alnbox run" id="alnbox"><div class="alnt"><b>智能对齐中</b><span id="alnmsg">${alnMsg()}</span></div><div class="bar"><i id="alnbar" style="width:${ALN.job.pct}%"></i></div><div class="row"><span class="faint" style="font-size:11.5px">识别在本机进行，请让 App 保持在前台；中途退出下次会接着做。</span><button class="btn sm ghost" data-act="alncancel">取消</button></div></div>`;
  if (st === "queued") return `<div class="alnbox" id="alnbox"><div class="alnt"><b>排队等待对齐</b><span>前面还有 ${ALN.q.indexOf(aid) + (ALN.job ? 1 : 0)} 篇</span></div></div>`;
  if (st === "todo") return `<div class="alnbox todo" id="alnbox"><div class="alnt"><b>音频还没逐句对齐</b><span>现在的高亮是按字数估算的，会和声音对不上。智能对齐会在本机识别整段音频，自动跳过主持人开场、掌声和观众互动，把每一句定位到声音开始的位置。</span></div><div class="row"><span class="faint" style="font-size:11.5px">首次需下载约 60 MB 识别组件（之后离线可用）；15 分钟的演讲大约需要 3–6 分钟。</span><button class="btn sm" data-act="alnstart" data-id="${aid}">${I.spark}智能对齐</button></div></div>`;
  return "";
}
function alnUI() {
  const box = $("#alnbox"), aid = READ_ID;
  if (box && aid) { const st = alnStatus(aid); if (st === "run" && box.classList.contains("run")) { const m = $("#alnmsg"), b = $("#alnbar"); if (m) m.textContent = alnMsg(); if (b) b.style.width = ALN.job.pct + "%"; } else { const h = alnBox(aid); if (h) box.outerHTML = h; else box.remove(); } }
  const lb = $("#alnlib"); if (lb) lb.outerHTML = alnLibHTML();
  const ap = $("#alnpanel"); if (ap) ap.innerHTML = alnPanelInner(ap.dataset.id);
}
function alnLibHTML() {
  const todo = Object.keys(ITEMS).filter(id => alnStatus(id) === "todo");
  if (ALN.job) { const a = AMAP[ALN.job.aid]; return `<div class="alnbox run" id="alnlib"><div class="alnt"><b>智能对齐：${esc(a ? a.title : "")}</b><span>${alnMsg()}${ALN.q.length ? " · 还有 " + ALN.q.length + " 篇排队" : ""}</span></div><div class="bar"><i style="width:${ALN.job.pct}%"></i></div></div>`; }
  if (!todo.length) return `<span id="alnlib"></span>`;
  return `<div class="alnbox todo" id="alnlib"><div class="alnt"><b>${todo.length} 篇的音频还没逐句对齐</b><span>对齐后，播放时高亮会准确跟着声音走。</span></div><div class="row" style="justify-content:flex-end"><button class="btn sm" data-act="alnall">${I.spark}一键对齐全部</button></div></div>`;
}
function alnPanelInner(aid) {
  const st = alnStatus(aid), T = TR[aid]; if (!T || !T.audio) return "";
  if (st === "run" || st === "queued") return `<div class="note" style="background:var(--soft)">${st === "run" ? alnMsg() : "排队等待对齐"}</div>`;
  if (st === "done") return `<div class="note" style="background:var(--soft)">已智能对齐：${T.align.sm}% 的句子在音频里精确定位${T.align.sm < 60 ? "（偏低：音频和原文可能不是同一版本）" : ""}。某句还不准时，可在它刚开始读的瞬间双击这句，点「这句从此刻开始」单独修正。</div><div class="row" style="margin-top:8px"><button class="btn sm ghost" data-act="alnstart" data-id="${aid}" data-redo="1">重新对齐</button></div>`;
  return `<div class="row"><button class="btn sm" data-act="alnstart" data-id="${aid}">${I.spark}智能对齐</button><span class="faint" style="font-size:12px">在本机识别音频，逐句定位</span></div>`;
}

/* ---------- v1.7: AI word study — one example in the word card, “更多” opens a deep-study window ---------- */


const aiJson = (prompt, o) => Cloud.sample.json(prompt, PWA ? Object.assign({ modelTier: o && o.big ? "default" : "quick" }, o || {}) : { modelTier: o && o.big ? "default" : "quick" });
function aiHl(en, w) {
  const base = String(w || "").toLowerCase(), e = esc(en || ""); if (!base) return e;
  const stem = base.length >= 5 ? base.replace(/(e|y)$/, "") : base, q = stem.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return e.replace(new RegExp("\\b(" + q + (base.length >= 4 ? "[a-z]*" : "") + ")\\b", "gi"), "<mark>$1</mark>");
}
const deepId = key => "d_" + safeId(key);
function aiOneHTML(r, key, aid, si, m) {
  const more = `<button class="btn sm ghost aimore" data-act="aideep" data-k="${esc(key)}" data-a="${aid}" data-s="${si}" data-m="${m || ""}">${I.spark}更多：AI 深入研究这个词</button>`;
  if (r.one) return `<div class="ai"><b>AI 例句</b><div class="ex" style="margin-top:6px"><div class="en">${aiHl(r.one.en, key)} <button class="say mini" data-act="say" data-text="${esc(r.one.en)}" aria-label="朗读">${I.vol}</button></div><div class="zh">${esc(r.one.zh)}</div></div>${more}</div>`;
  return `<div class="ai"><b>AI 补充</b>${r.ctx ? `<div>语境义：${esc(r.ctx)}</div>` : ""}${r.use ? `<div style="margin-top:4px">${esc(r.use)}</div>` : ""}${(r.coll || []).length ? `<div style="margin-top:4px">搭配：${r.coll.map(esc).join("；")}</div>` : ""}${(r.ex || []).slice(0, 1).map(e => `<div class="ex" style="margin-top:6px"><div class="en">${aiHl(e.en, key)}</div><div class="zh">${esc(e.zh)}</div></div>`).join("")}${more}</div>`;
}
function aiWordHTML(r, key, aid, si, m) { if (!r) return ""; return aiOneHTML(r, key || r.key || "", aid || r.aid || "", si != null ? si : r.si || 0, m != null ? m : r.m || ""); }
async function aiWord(key, aid, si, m) {
  const box = $("#aiw"); const btn = $("[data-act=aiword]"); if (btn) btn.disabled = true; if (box) box.innerHTML = '<div class="ai muted">正在生成例句…</div>';
  const s = getS(aid, si, m); const L = lx(key) || { w: key };
  try {
    const r = await aiJson(`你是资深英语老师。学习者在下面这句英文中点击了单词 "${L.w}"。请为这个词造 1 个全新的、自然地道、长度适中的英文例句（不要照抄原句，用法与原句语境中的含义一致），并给出准确的整句中文翻译。严格输出 JSON：{"one":{"en":"英文例句","zh":"整句中文翻译"}}\n原句：${s.en}`, { temp: 0.7, maxTokens: 400 });
    if (!r || !r.one || !r.one.en) throw { code: "parse", message: "返回内容缺少例句" };
    const id = "w_" + safeId(key) + "_" + aid.slice(0, 6) + (m === "t" ? "t" : "") + si; r.key = key; r.aid = aid; r.si = si; r.m = m || ""; AIC[id] = r; putAI(id);
    if (box) box.innerHTML = aiOneHTML(r, key, aid, si, m); if (btn) btn.remove();
  } catch (e) { if (box) box.innerHTML = `<div class="ai muted">${esc(aiErr(e))}</div>`; if (btn) btn.disabled = false; }
}

/* deep-study window */
const DEEP = { key: null, busy: {} };
function deepPromptCore(key, s) {
  const L = lx(key) || { w: key };
  return `你是资深英语词汇学家兼英语老师，面向中文母语、有理工科背景的成年学习者。请对英文单词 "${L.w}" 做深入研究。学习者是在这句话里遇到它的：${s ? s.en : "（无）"}
要求：信息准确，不编造；专有名词、网络用语、专业义只写真实存在且常见的，没有就给空数组。严格输出 JSON：
{"ph":"美式音标（不带斜杠）","brief":"一句话讲清这个词的核心概念（中文）","ctx":"它在学习者那句话中的具体含义（中文，一句）",
"senses":[{"pos":"词性缩写，如 n. v. adj.","zh":"中文释义","en":"简短英文释义","reg":"语域：通用/正式/书面/口语/俚语/专业","note":"典型语境或使用要点（中文，一句）"}],
"proper":[{"term":"含这个词的专有名词（品牌、机构、产品、作品、地名、人名、学术术语等）","zh":"是什么、为什么这么叫（中文）"}],
"slang":[{"term":"网络用语、俚语、流行梗或新兴用法","zh":"含义与使用场合（中文）","ex":"英文示例","exZh":"示例翻译"}],
"domain":[{"field":"专业领域，如 计算机/金融/医学/工程/法律","zh":"该领域的专门含义（中文）"}],
"coll":[{"en":"常用搭配、短语动词或句型","zh":"中文"}],
"forms":"词形变化与派生词（中文说明，含词性）",
"syn":[{"w":"近义词","diff":"与本词的区别（中文，一句）"}],
"ant":["反义词"],
"ety":"词源与记忆提示（中文）",
"pitfalls":["中国学习者常见误用或易混点（中文，每条一句）"]}
数量：senses 按常用度排序列出全部常用义项（至少 3 条；若确实只有 1–2 个义项就如实给出）；coll 6–10 条；syn 2–4 条；pitfalls 1–3 条。`;
}
function deepPromptEx(key, prev, batch) {
  const L = lx(key) || { w: key };
  const focus = batch === 1 ? "第一组：覆盖这个词最常用的 3 个义项或用法，难度由浅到深" : ["换用不同的义项、词性或固定搭配", "放进科技、工程或商业职场的语境", "用口语、对话或社交媒体风格（可以含真实存在的俚语或网络用法）", "用新闻报道或学术写作风格，句子结构更复杂（含从句或非谓语）", "用习语、比喻或较少见但地道的用法"][(batch - 2) % 5];
  return `为英文单词 "${L.w}" 造 3 个全新的、自然地道的英文例句。本组要求：${focus}。三句之间的场景和句式要明显不同。
${prev.length ? "不要与下面这些已有例句重复或雷同：\n" + prev.slice(-18).map((x, i) => (i + 1) + ". " + x).join("\n") : ""}
每句都要给出整句中文翻译和语法分析。严格输出 JSON：
{"ex":[{"en":"英文例句","zh":"整句中文翻译","sense":"本句中这个词的含义（中文，含词性）","scene":"场景标签，2–4 个字，如 日常/职场/科技/新闻/口语/学术/文学","structure":"句子主干与成分划分（中文，指出主语、谓语、宾语及修饰成分）","grammar":["语法要点：时态、语态、从句类型、非谓语、固定搭配或特殊句式，每条一句（中文）"]}]}`;
}
function deepRec(key) { return AIC[deepId(key)] || null; }
function deepSave(key, rec) { const id = deepId(key); AIC[id] = rec; putAI(id); }
function aiDeepOpen(key, aid, si, m) {
  if (!Cloud.sample) { toast("请先在「设置 → AI 解析服务」填写密钥"); return; }
  DEEP.key = key; DEEP.ctx = aid ? getS(aid, si, m) : null;
  const L = lx(key) || { w: key };
  modal(`<div class="aimod-h"><div><div class="aimod-w">${esc(L.w)}</div><div class="faint" id="aiph">${L.ph ? "/" + esc(L.ph) + "/" : ""}</div></div>
  <div class="row"><button class="say" data-act="say" data-text="${esc(L.w)}" data-acc="us">${I.vol}美音</button><button class="say" data-act="say" data-text="${esc(L.w)}" data-acc="uk">${I.vol}英音</button><button class="iconbtn" data-act="close" aria-label="关闭">${I.x}</button></div></div>
  <div class="aimod-sub faint">AI 深入研究 · 由你连接的大模型生成，请结合词典判断</div>
  <div id="aideepcore"></div><div class="aisec"><h4>AI 例句</h4><div id="aiexlist"></div><div id="aiexmore"></div></div>`, { wide: true, cls: "aimod" });
  const rec = deepRec(key) || { key, ex: [], at: Date.now() };
  drawDeepCore(rec); drawDeepEx(rec);
  if (!rec.core) loadDeepCore(key);
  if (!rec.ex.length) loadDeepEx(key);
}
function drawDeepCore(rec) {
  const box = $("#aideepcore"); if (!box || DEEP.key !== rec.key) return;
  if (DEEP.busy["c" + rec.key]) { box.innerHTML = `<div class="aiload">${I.spark}<span>正在深入研究这个词：义项、专有名词、网络用语、搭配、辨析…</span></div>`; return; }
  if (rec.coreErr && !rec.core) { box.innerHTML = `<div class="ai muted">${esc(rec.coreErr)} <button class="linkbtn" data-act="aideepretry">重试</button></div>`; return; }
  const c = rec.core; if (!c) { box.innerHTML = ""; return; }
  if (c.ph && $("#aiph") && !$("#aiph").textContent) $("#aiph").textContent = "/" + c.ph + "/";
  const sec = (t, h) => h ? `<div class="aisec"><h4>${t}</h4>${h}</div>` : "";
  const arr = a => Array.isArray(a) ? a.filter(Boolean) : [];
  box.innerHTML = (c.brief ? `<div class="aibrief">${esc(c.brief)}</div>` : "") + (c.ctx && DEEP.ctx ? `<div class="aictx"><span class="tag">原句中</span>${esc(c.ctx)}</div>` : "") +
    sec("义项", arr(c.senses).length ? `<ol class="aisenses">${arr(c.senses).map(x => `<li><div><span class="tag">${esc(x.pos || "")}</span><b>${esc(x.zh || "")}</b>${x.reg && x.reg !== "通用" ? `<span class="tag off">${esc(x.reg)}</span>` : ""}</div>${x.en ? `<div class="faint">${esc(x.en)}</div>` : ""}${x.note ? `<div class="muted">${esc(x.note)}</div>` : ""}</li>`).join("")}</ol>` : "") +
    sec("专有名词", arr(c.proper).length ? `<div class="aigrid2">${arr(c.proper).map(x => `<div class="aicell"><b>${esc(x.term || "")}</b><span>${esc(x.zh || "")}</span></div>`).join("")}</div>` : "") +
    sec("网络用语 / 俚语", arr(c.slang).length ? arr(c.slang).map(x => `<div class="aicell wide"><b>${esc(x.term || "")}</b><span>${esc(x.zh || "")}</span>${x.ex ? `<div class="en">${aiHl(x.ex, rec.key)}</div><div class="zh">${esc(x.exZh || "")}</div>` : ""}</div>`).join("") : "") +
    sec("专业领域义", arr(c.domain).length ? `<div class="aigrid2">${arr(c.domain).map(x => `<div class="aicell"><b>${esc(x.field || "")}</b><span>${esc(x.zh || "")}</span></div>`).join("")}</div>` : "") +
    sec("常用搭配", arr(c.coll).length ? `<div class="aicoll">${arr(c.coll).map(x => `<div><span class="en">${aiHl(x.en || "", rec.key)}</span><span class="zh">${esc(x.zh || "")}</span></div>`).join("")}</div>` : "") +
    sec("词形与派生", c.forms ? `<div>${esc(c.forms)}</div>` : "") +
    sec("近义词辨析", arr(c.syn).length || arr(c.ant).length ? `${arr(c.syn).map(x => `<div class="aisyn"><b>${esc(x.w || "")}</b><span>${esc(x.diff || "")}</span></div>`).join("")}${arr(c.ant).length ? `<div class="aisyn"><b>反义</b><span>${arr(c.ant).map(esc).join("、")}</span></div>` : ""}` : "") +
    sec("词源与记忆", c.ety ? `<div>${esc(c.ety)}</div>` : "") +
    sec("易错提醒", arr(c.pitfalls).length ? `<ul>${arr(c.pitfalls).map(x => `<li>${esc(x)}</li>`).join("")}</ul>` : "");
}
function exItemHTML(e, i, key) {
  const g = Array.isArray(e.grammar) ? e.grammar.filter(Boolean) : [];
  return `<div class="aiex"><div class="aiexh"><span class="num">${i + 1}</span>${e.scene ? `<span class="tag">${esc(e.scene)}</span>` : ""}${e.sense ? `<span class="faint">${esc(e.sense)}</span>` : ""}<button class="say mini" data-act="say" data-text="${esc(e.en || "")}" aria-label="朗读">${I.vol}</button></div>
  <div class="en">${aiHl(e.en, key)}</div><div class="zh">${esc(e.zh || "")}</div>
  ${e.structure || g.length ? `<details class="aigram" open><summary>语法分析</summary>${e.structure ? `<div>${esc(e.structure)}</div>` : ""}${g.length ? `<ul>${g.map(x => `<li>${esc(x)}</li>`).join("")}</ul>` : ""}</details>` : ""}</div>`;
}
function drawDeepEx(rec) {
  const list = $("#aiexlist"), more = $("#aiexmore"); if (!list || DEEP.key !== rec.key) return;
  list.innerHTML = rec.ex.map((e, i) => exItemHTML(e, i, rec.key)).join("");
  const busy = DEEP.busy["e" + rec.key];
  more.innerHTML = busy ? `<div class="aiload">${I.spark}<span>正在造新的 3 个例句并做语法分析…</span></div>`
    : `${rec.exErr ? `<div class="ai muted" style="margin-bottom:8px">${esc(rec.exErr)}</div>` : ""}<button class="btn aimorebtn" data-act="aiexmore">${I.spark}更多例句（再造 3 句）</button><div class="faint" style="font-size:11.5px;text-align:center;margin-top:6px">已生成 ${rec.ex.length} 句 · 每次点击都会连接大模型继续造句</div>`;
}
async function loadDeepCore(key) {
  const k = "c" + key; if (DEEP.busy[k]) return; DEEP.busy[k] = 1;
  let rec = deepRec(key) || { key, ex: [], at: Date.now() }; drawDeepCore(rec);
  try {
    const r = await aiJson(deepPromptCore(key, DEEP.key === key ? DEEP.ctx : null), { temp: 0.3, maxTokens: 3000, big: true });
    rec = deepRec(key) || rec; rec.core = r; delete rec.coreErr; deepSave(key, rec);
  } catch (e) { rec = deepRec(key) || rec; rec.coreErr = aiErr(e); }
  delete DEEP.busy[k]; drawDeepCore(rec);
}
async function loadDeepEx(key) {
  const k = "e" + key; if (DEEP.busy[k]) return; DEEP.busy[k] = 1;
  let rec = deepRec(key) || { key, ex: [], at: Date.now() }; drawDeepEx(rec);
  try {
    const batch = Math.floor(rec.ex.length / 3) + 1;
    const r = await aiJson(deepPromptEx(key, rec.ex.map(x => x.en), batch), { temp: 0.85, maxTokens: 2500, big: true });
    const seen = new Set(rec.ex.map(x => (x.en || "").toLowerCase().trim()));
    const add = (Array.isArray(r.ex) ? r.ex : []).filter(x => x && x.en && !seen.has(x.en.toLowerCase().trim())).slice(0, 3);
    if (!add.length) throw { code: "parse", message: "这次没有返回新的例句" };
    rec = deepRec(key) || rec; rec.ex = rec.ex.concat(add); delete rec.exErr; deepSave(key, rec);
    delete DEEP.busy[k]; drawDeepEx(rec);
    const items = $$("#aiexlist .aiex"); const first = items[items.length - add.length]; if (first && rec.ex.length > 3) first.scrollIntoView({ behavior: S.set.motion ? "smooth" : "auto", block: "start" });
    return;
  } catch (e) { rec = deepRec(key) || rec; rec.exErr = aiErr(e); }
  delete DEEP.busy[k]; drawDeepEx(rec);
}

/* ---------- v1.8: study timer + rewards, AI 学伴 (article tutor), AI review ---------- */
//@drop BADGES
Object.assign(I, {
  timer: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><circle cx="12" cy="13.5" r="7.5"/><path d="M12 13.5V9.6M10 2.6h4M12 2.6V6M18.3 6.9l1.3-1.3"/></svg>',
  chat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M4 5h16v11H9l-5 4z"/><path d="M8 9.5h8M8 12.5h5" stroke-linecap="round"/></svg>',
  pen: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13.5 6.5l4 4"/></svg>',
  compass: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/></svg>',
  quill: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4h11l3 3v13H5z"/><path d="M9 9h6M9 12.5h6M9 16h4"/></svg>',
  send: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3.4 20.4l17.5-7.6a1 1 0 0 0 0-1.8L3.4 3.4a.9.9 0 0 0-1.2 1.1L4.5 11 13 12l-8.5 1-2.3 6.5a.9.9 0 0 0 1.2 1.1z"/></svg>',
  copy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/></svg>',
});

/* ===== 1. study timer ===== */
const TM_BLOCK = 900, TM_IDLE = 120, TM_GAP = 120;
const TM_SKIP = new Set(["prefs", "export", "reward", "imp"]);
const TM_COMBO = [1, 1.2, 1.4, 1.5];
const TM_REW = { c: [20, 2], f: [10, 1], g: [30, 5], w: [120, 20] };
const TM = { last: 0, input: Date.now(), iv: null, saveAt: 0, act: false, why: "", btn: "", live: "" };
function tmS() {
  const t = S.tm || (S.tm = {});
  t.plan = t.plan || { days: 5, mins: 30 }; t.day = t.day || {}; t.pool = t.pool || 0; t.pend = t.pend || []; t.cnt = t.cnt || { c: 0, f: 0, g: 0, w: 0 }; t.paid = t.paid || {}; t.best = t.best || 0; t.tot = t.tot || 0;
  return t;
}
function wkStart(k) { const d = parseD(k); return addDays(k, -((d.getDay() + 6) % 7)); }
const tmGoal = () => tmS().plan.mins * 60;
function tmWeek(k) { const t = tmS(), s = wkStart(k || todayK()); const days = []; for (let i = 0; i < 7; i++) { const d = addDays(s, i); days.push({ k: d, sec: t.day[d] || 0 }); } return { s, days, met: days.filter(x => x.sec >= tmGoal()).length }; }
const tmCombo = n => TM_COMBO[Math.min(n, TM_COMBO.length) - 1];
function tmPush(kind, n) {
  const t = tmS(); let [xp, co] = TM_REW[kind];
  if (kind === "c") { xp = Math.round(xp * tmCombo(n)); if (n >= 3) co += 1; }
  t.pend.push({ t: kind, n: n || 0, xp, co, d: todayK(), at: Date.now() }); if (t.pend.length > 200) t.pend = t.pend.slice(-200);
}
function tmEndRun(t) {
  const r = t.run; if (!r) return; t.run = null;
  t.pool += Math.max(0, r.act - r.b * TM_BLOCK);
  let got = 0; while (t.pool >= TM_BLOCK) { t.pool -= TM_BLOCK; tmPush("f"); got++; }
  if (got) setTimeout(() => toast("碎片时间累计满 15 分钟，半额奖励已可领取"), 200);
}
function tmWhy(now) {
  const t = tmS();
  if (document.hidden) return "后台";
  if (t.pause) return "手动暂停";
  if (TM_SKIP.has(VIEW)) return "本页不计时";
  if (AUD.el && !AUD.el.paused) return "";
  if (PLAY && PLAY.on) return "";
  if (REC) return "";
  if (now - TM.input > TM_IDLE * 1000) return "无操作";
  return "";
}
function tmCheckGoals(t) {
  const k = todayK(), g = tmGoal();
  if ((t.day[k] || 0) >= g && !t.paid["g" + k]) { t.paid["g" + k] = 1; tmPush("g"); setTimeout(() => toast("今日学习目标达成，奖励已可领取"), 200); }
  const w = tmWeek(k);
  if (w.met >= t.plan.days && !t.paid["w" + w.s]) { t.paid["w" + w.s] = 1; tmPush("w"); setTimeout(() => { toast("本周学习计划完成！奖励已可领取"); confetti(80); }, 400); }
}
function tmTick() {
  const now = Date.now(), dt = TM.last ? Math.min(2, Math.max(0, (now - TM.last) / 1000)) : 0; TM.last = now;
  const t = tmS();
  if (t.run && now - t.run.last > TM_GAP * 1000) { tmEndRun(t); save(); }
  TM.why = tmWhy(now); TM.act = !TM.why;
  if (TM.act && dt > 0) {
    if (!t.run) t.run = { s: now, last: now, act: 0, b: 0 };
    const k = todayK();
    t.run.act += dt; t.run.last = now; t.day[k] = (t.day[k] || 0) + dt; t.tot += dt; t.best = Math.max(t.best, t.run.act);
    while (t.run.act >= (t.run.b + 1) * TM_BLOCK) { t.run.b++; tmPush("c", t.run.b); toast(t.run.b === 1 ? "连续学习满 15 分钟，奖励已可领取" : `连续第 ${t.run.b} 个 15 分钟，专注加成 ×${tmCombo(t.run.b)}`); }
    tmCheckGoals(t);
    if (now - TM.saveAt > 20000) { TM.saveAt = now; tmPrune(t); save(); }
  }
  tmPaint();
}
function tmPrune(t) {
  const ks = Object.keys(t.day).sort(); if (ks.length > 150) ks.slice(0, ks.length - 150).forEach(k => delete t.day[k]);
  const ps = Object.keys(t.paid); if (ps.length > 120) ps.sort((a, b) => a.slice(1).localeCompare(b.slice(1))).slice(0, ps.length - 120).forEach(k => delete t.paid[k]);
}
const mmss = s => { s = Math.max(0, Math.floor(s)); return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0"); };
function tmBtnInner() {
  const t = tmS(), r = t.run, on = TM.act, L = document.documentElement.dataset.mode === "L";
  const today = Math.floor((t.day[todayK()] || 0) / 60);
  const p = r ? (r.act % TM_BLOCK) / TM_BLOCK : t.pool / TM_BLOCK;
  const txt = r ? mmss(r.act) : today + "分";
  const n = t.pend.length;
  return `<svg class="tmring" viewBox="0 0 32 32" aria-hidden="true"><rect class="tmcrown" x="13.6" y="1" width="4.8" height="2.6" rx="1.1"/><path class="tmcrown" d="M16 3.6v2.2M24.6 7.6l1.6-1.6" stroke-width="2" stroke-linecap="round"/><circle class="tr0" cx="16" cy="18" r="11.6"/><circle class="tr1 ${r ? "" : "pool"}" cx="16" cy="18" r="11.6" pathLength="100" stroke-dasharray="${(p * 100).toFixed(1)} 100" transform="rotate(-90 16 18)"/><line class="tmhand" x1="16" y1="18" x2="16" y2="11.2"/><circle class="tmhub" cx="16" cy="18" r="1.7"/></svg><span class="tmt num">${L ? (r ? (on ? "专注 " : "暂停 ") + txt : "今日 " + today + " 分钟") : txt}</span>${n ? `<i class="tmdot num">${n > 9 ? "9+" : n}</i>` : ""}`;
}
function tmPaint() {
  const b = $("#tmbtn");
  if (b) {
    const h = tmBtnInner(); if (h !== TM.btn) { TM.btn = h; b.innerHTML = h; }
    b.classList.toggle("on", TM.act && !!tmS().run); b.classList.toggle("gift", tmS().pend.length > 0);
    b.title = TM.act ? "学习计时中" : "计时暂停：" + TM.why;
  }
  const lv = $("#tmlive"); if (lv) { const h = tmLiveHTML(); if (h !== TM.live) { TM.live = h; lv.innerHTML = h; } }
}
function tmBtnHTML() { TM.btn = ""; return `<button class="tmbtn" id="tmbtn" data-act="timer" aria-label="学习计时">${tmBtnInner()}</button>`; }
function tmStart() {
  if (TM.iv) return;
  const bump = () => { TM.input = Date.now(); };
  ["pointerdown", "keydown", "wheel", "touchstart"].forEach(ev => document.addEventListener(ev, bump, { capture: true, passive: true }));
  window.addEventListener("scroll", bump, { capture: true, passive: true });
  document.addEventListener("visibilitychange", () => { TM.last = Date.now(); if (document.hidden) save(); else { TM.input = Date.now(); tmTick(); } });
  window.addEventListener("pagehide", () => save());
  const t = tmS(); if (t.run && Date.now() - t.run.last > TM_GAP * 1000) { tmEndRun(t); save(); }
  TM.last = Date.now(); TM.iv = setInterval(tmTick, 1000);
}
function tmClaim() {
  const t = tmS(); if (!t.pend.length) return;
  let xp = 0, co = 0; t.pend.forEach(p => { xp += p.xp; co += p.co; t.cnt[p.t] = (t.cnt[p.t] || 0) + 1; });
  t.pend = []; S.xp += xp; S.coins += co; save(); checkBadges(); renderChrome();
  toast(`已领取：+${xp} XP · +${co} 金币`); confetti(90); tmDraw();
}
const TM_NAME = { c: "连续学习 15 分钟", f: "碎片累计 15 分钟", g: "今日目标达成", w: "本周计划达成" };
function tmLiveHTML() {
  const t = tmS(), k = todayK(), today = t.day[k] || 0, g = tmGoal(), r = t.run, w = tmWeek(k);
  const pg = Math.min(1, today / g), C = 2 * Math.PI * 52;
  const st = TM.act ? "计时中" : "已暂停 · " + TM.why;
  const runLeft = r ? TM_BLOCK - (r.act % TM_BLOCK) : TM_BLOCK, nextN = r ? r.b + 1 : 1;
  const pend = t.pend;
  const sum = pend.reduce((a, p) => [a[0] + p.xp, a[1] + p.co], [0, 0]);
  return `<div class="tmhero"><svg class="tmbig" viewBox="0 0 120 120"><circle cx="60" cy="60" r="52" class="b0"/><circle cx="60" cy="60" r="52" class="b1" stroke-dasharray="${(C * pg).toFixed(1)} ${C.toFixed(1)}" transform="rotate(-90 60 60)"/><text x="60" y="58" text-anchor="middle" class="v num">${Math.floor(today / 60)}</text><text x="60" y="78" text-anchor="middle" class="u">/ ${t.plan.mins} 分钟</text></svg>
   <div class="tmstats"><div><span class="faint">状态</span><b class="${TM.act ? "ok" : ""}">${esc(st)}</b></div><div><span class="faint">本次连续</span><b class="num">${r ? mmss(r.act) : "—"}</b></div><div><span class="faint">碎片累计</span><b class="num">${mmss(t.pool)} / 15:00</b></div><div><span class="faint">本周达标</span><b class="num">${w.met} / ${t.plan.days} 天</b></div></div></div>
  <div class="tmbar"><div class="row"><b>连续进度</b><span class="faint num">${r ? `再学 ${mmss(runLeft)} → 第 ${nextN} 段${nextN > 1 ? " ×" + tmCombo(nextN) : ""}` : "开始学习即开始一段新的连续计时"}</span></div><div class="bar"><i style="width:${r ? Math.round((r.act % TM_BLOCK) / TM_BLOCK * 100) : 0}%"></i></div></div>
  <div class="tmbar gold"><div class="row"><b>碎片进度</b><span class="faint">中断后剩余的零散时间，累计满 15 分钟得半额奖励</span></div><div class="bar gold"><i style="width:${Math.round(t.pool / TM_BLOCK * 100)}%"></i></div></div>
  <div class="tmrew">${pend.length ? `<div class="tmrl">${Object.entries(pend.reduce((m, p) => { const key = p.t + (p.t === "c" ? p.n : ""); (m[key] = m[key] || { p, k: 0, xp: 0, co: 0 }); m[key].k++; m[key].xp += p.xp; m[key].co += p.co; return m; }, {})).map(([, v]) => `<div class="tmri ${v.p.t}"><span class="ic">${v.p.t === "f" ? "½" : v.p.t === "c" ? "15" : v.p.t === "g" ? I.flag : I.trophy}</span><div><b>${TM_NAME[v.p.t]}${v.p.t === "c" && v.p.n > 1 ? ` · 第 ${v.p.n} 段 ×${tmCombo(v.p.n)}` : ""}</b>${v.k > 1 ? `<span class="faint"> × ${v.k}</span>` : ""}</div><span class="num">+${v.xp} XP · +${v.co}</span></div>`).join("")}</div>
   <button class="btn tmclaim" data-act="tmclaim">${I.gift}领取全部奖励（+${sum[0]} XP · +${sum[1]} 金币）</button>` : `<div class="faint" style="font-size:12.5px;text-align:center;padding:6px 0">暂无可领取的奖励。连续学满 15 分钟，或碎片时间累计满 15 分钟，就能领取。</div>`}</div>`;
}
function tmWeekHTML() {
  const t = tmS(), w = tmWeek(), g = tmGoal(), k = todayK(), mx = Math.max(g * 1.3, ...w.days.map(d => d.sec));
  return `<div class="tmweek">${w.days.map((d, i) => { const h = Math.round(d.sec / mx * 100), ok = d.sec >= g; return `<div class="col ${d.k === k ? "today" : ""} ${ok ? "ok" : ""}"><span class="num v">${Math.round(d.sec / 60) || ""}</span><div class="bx"><i style="height:${h}%"></i><em style="bottom:${Math.round(g / mx * 100)}%"></em></div><span>${"一二三四五六日"[i]}</span></div>`; }).join("")}</div>
  <div class="faint" style="font-size:11.5px;margin-top:4px">柱高为当天学习分钟数，虚线为每日目标 ${t.plan.mins} 分钟；本周达标 ${w.met} 天，计划 ${t.plan.days} 天</div>`;
}
function tmPlanHTML() {
  const t = tmS();
  return `<div class="tmplan"><div class="setrow"><div class="l"><b>每周学习天数</b><span>达标天数满足计划即得周奖励</span></div><div class="seg tmdays">${[1, 2, 3, 4, 5, 6, 7].map(n => `<button class="${t.plan.days === n ? "on" : ""}" data-act="tmdays" data-n="${n}">${n}</button>`).join("")}</div></div>
  <div class="setrow"><div class="l"><b>每天学习时长</b><span>单位：分钟</span></div><div class="seg tmmins">${[15, 20, 30, 45, 60, 90, 120].map(n => `<button class="${t.plan.mins === n ? "on" : ""}" data-act="tmmins" data-n="${n}">${n}</button>`).join("")}</div></div></div>`;
}
function tmDraw() {
  const box = $("#tmbody"); if (!box) return; const t = tmS();
  TM.live = "";
  box.innerHTML = `<div id="tmlive">${tmLiveHTML()}</div>
  <div class="aisec"><h4>本周</h4><div id="tmwk">${tmWeekHTML()}</div></div>
  <div class="aisec"><h4>学习计划</h4>${tmPlanHTML()}</div>
  <details class="aisec tmrules"><summary>奖励与计时规则</summary>
   <table class="tbl"><tr><th>奖励单位</th><th>条件</th><th>奖励</th></tr>
   <tr><td>连续 15 分钟</td><td>一次不中断地学满 15 分钟，每满 15 分钟一份</td><td>+20 XP · +2 金币</td></tr>
   <tr><td>专注加成</td><td>同一次连续学习的第 2 / 3 / 4 段起</td><td>×1.2 / ×1.4 / ×1.5，第 3 段起金币 +1</td></tr>
   <tr><td>碎片 15 分钟（最小单位）</td><td>中断后剩下的零散时间累计满 15 分钟</td><td>半额：+10 XP · +1 金币</td></tr>
   <tr><td>每日达标</td><td>当天学习时长达到每日目标</td><td>+30 XP · +5 金币</td></tr>
   <tr><td>每周计划</td><td>本周（周一至周日）达标天数达到计划天数</td><td>+120 XP · +20 金币</td></tr></table>
   <ul class="faint" style="font-size:12px;margin:8px 0 0;padding-left:18px"><li>App 在前台、且 2 分钟内有操作（点、滑、打字）或正在播放音频/录音时计时；2 分钟没有操作自动暂停。</li><li>暂停或切到后台不超过 2 分钟，回来后仍算同一次连续学习；超过 2 分钟即中断，这一次不足 15 分钟的部分转入碎片累计。</li><li>设置、导出、成就、导入页面不计时。奖励需要手动领取，不会过期。</li></ul></details>
  <div class="row" style="justify-content:center;margin-top:12px"><button class="btn sm ghost" data-act="tmpause">${t.pause ? I.play + "继续计时" : I.pause + "暂停计时"}</button></div>`;
}
function tmOpen() {
  modal(`<div class="aimod-h"><div class="row" style="gap:10px"><span class="tmhicon">${I.timer}</span><div><b style="font-size:17px">学习计时</b><div class="faint" style="font-size:12px">累计 ${Math.round(tmS().tot / 3600 * 10) / 10} 小时 · 最长连续 ${Math.floor(tmS().best / 60)} 分钟</div></div></div><button class="iconbtn" data-act="close" aria-label="关闭">${I.x}</button></div><div id="tmbody" class="tmbody"></div>`, { cls: "aimod tmmod" });
  tmDraw();
}

/* badges incl. study-time ones */
const BADGES = [
  ["first", "首篇完成", "完成第一篇精读或短篇", "#2B6A5C"], ["s3", "三日之火", "连续学习 3 天", "#E4572E"], ["s7", "一周不断", "连续学习 7 天", "#E4572E"], ["s14", "半月坚守", "连续学习 14 天", "#C44536"], ["s30", "月度传奇", "连续学习 30 天", "#A3122A"],
  ["w50", "词汇 50", "点学 50 个单词", "#2B5FA0"], ["w150", "词汇 150", "点学 150 个单词", "#2B5FA0"], ["w300", "词汇 300", "点学 300 个单词", "#1D3F73"], ["sent30", "句法侦探", "分析 30 个句子", "#7552A3"],
  ["perfect", "满分答卷", "任意考试满分", "#B3801F"], ["ear", "完整聆听", "听完一篇全文", "#2F7F7A"], ["voice", "开口十次", "完成 10 次跟读", "#2F7F7A"],
  ["j1", "精读起步", "完成第 1 篇精读", "#2B6A8F"], ["half", "精读半程", "完成 10 篇精读", "#B3801F"], ["all20", "精读二十篇", "完成 20 篇精读", "#B3801F"],
  ["cats", "七域通览", "短篇七个类别各读完 1 篇", "#8A5A2B"], ["short20", "短篇全通", "读完全部 20 篇短篇", "#8A5A2B"], ["master", "精读大师", "通过终极考试", "#C99A2E"],
  ["f15", "专注一刻", "领取第一份连续 15 分钟奖励", "#2F6F8F"], ["f60", "深度专注", "一次连续学习满 60 分钟", "#1F4F7A"], ["plan1", "计划达成", "完成一周学习计划", "#6B4FA3"], ["ai10", "AI 学伴", "在 AI 学伴中完成 10 次测验、复述或回译", "#4A6FA5"],
];
function checkBadges() {
  const has = new Set(S.badges), got = [];
  const st = streak(), nv = Object.keys(VOC).length, ns = Object.keys(SEN).length, nj = jingDone().length, nsd = shortDone().length, t = tmS();
  const cond = { first: S.done.length >= 1, s3: st >= 3, s7: st >= 7, s14: st >= 14, s30: st >= 30, w50: nv >= 50, w150: nv >= 150, w300: nv >= 300, sent30: ns >= 30,
    perfect: S.exams.some(e => e.sc === e.tot), ear: S.stats.listen >= 1, voice: S.stats.speak >= 10, j1: nj >= 1, half: nj >= 10, all20: nj >= 20,
    cats: CATS.every(c => shortDone().some(d => AMAP[d.a] && AMAP[d.a].cat === c)), short20: nsd >= 20, master: !!(S.final && S.final.pass),
    f15: (t.cnt.c || 0) >= 1, f60: t.best >= 3600, plan1: (t.cnt.w || 0) >= 1, ai10: ((S.stats.aiq || 0) + (S.stats.aiw || 0) + (S.stats.aibt || 0)) >= 10 };
  BADGES.forEach(b => { if (cond[b[0]] && !has.has(b[0])) { S.badges.push(b[0]); got.push(b); } });
  if (got.length) { save(); setTimeout(() => { toast("获得徽章：" + got.map(b => b[1]).join("、")); confetti(60); }, 300); }
}

/* ===== 2. AI plumbing: chat + streaming ===== */

async function aiAsk(msgs, o = {}) {
  const smp = Cloud.sample; if (!smp) throw { code: "nokey", message: "还没有设置 AI 服务" };
  if (PWA) return (await smp(msgs, o)).text;
  const m = msgs.map(x => ({ role: x.role, content: x.content }));
  if (o.system && m.length) m[0] = { role: m[0].role, content: o.system + "\n\n" + m[0].content };
  const r = await smp(m, { onText: o.onText, signal: o.signal, modelTier: o.big ? "default" : "quick", cache: false });
  return r.text;
}
const aiOK = () => !!Cloud.sample;
function aiNeedKey() { return PWA ? `<div class="empty" style="margin:10px 0">AI 功能需要先在设置里填写你自己的大模型 API 密钥。<div style="margin-top:10px"><button class="btn sm" data-act="go" data-v="prefs" data-a="s-ai">去设置</button></div></div>` : `<div class="empty" style="margin:10px 0">AI 服务暂不可用，请稍后再试。</div>`; }

/* learner profile (personalises every prompt) */
const AP_LV = [["cet4", "四级水平"], ["cet6", "六级水平"], ["ielts6", "雅思 6–6.5"], ["ielts7", "雅思 7+"], ["pro", "接近专业 / 母语"]];
const AP_LANG = [["zh", "中文讲解"], ["bi", "中英双语"], ["en", "英文为主"]];
function aiProf() { return Object.assign({ lv: "cet6", lang: "zh", bg: "", qp: "" }, LS.get("aiprof") || {}); }
function profLine() {
  const p = aiProf(), lv = (AP_LV.find(x => x[0] === p.lv) || AP_LV[1])[1];
  const lang = { zh: "讲解用简体中文，英文术语和例句保留英文", bi: "讲解用中英双语：先英文、再给中文", en: "讲解以简单英文为主，难点附中文" }[p.lang];
  return `学习者画像：中文母语的成年人，英语约「${lv}」。${p.bg ? "背景与兴趣：" + p.bg.slice(0, 120) + "（举例时可贴近这些场景，但不要牵强）。" : ""}${lang}。`;
}
function aiQuick() { return aiProf().qp.split(/\n+/).map(l => l.trim()).filter(Boolean).slice(0, 8).map(l => { const i = l.search(/[|｜]/); return i > 0 ? [l.slice(0, i).trim(), l.slice(i + 1).trim()] : [l.slice(0, 10), l]; }).filter(x => x[1]); }
function aiProfHTML() {
  const p = aiProf();
  return `<div class="approf"><div class="setrow"><div class="l"><b>英语水平</b><span>决定讲解深度、例句和题目难度</span></div><div class="seg wrap">${AP_LV.map(([k, n]) => `<button class="${p.lv === k ? "on" : ""}" data-act="aplv" data-k="${k}">${n}</button>`).join("")}</div></div>
  <div class="setrow"><div class="l"><b>讲解语言</b><span>英文为主更沉浸，中文更省力</span></div><div class="seg">${AP_LANG.map(([k, n]) => `<button class="${p.lang === k ? "on" : ""}" data-act="aplang" data-k="${k}">${n}</button>`).join("")}</div></div>
  <div class="setrow col"><div class="l"><b>背景与兴趣（可选）</b><span>AI 举例、造句、写故事时会贴近这些场景</span></div><input type="text" class="txt" id="apbg" maxlength="120" value="${esc(p.bg)}" placeholder="例：工程师，关注 AI 和足球"></div>
  <div class="setrow col"><div class="l"><b>我的常用指令（可选）</b><span>每行一条，格式「按钮名｜指令」，会出现在 AI 学伴「问答」的快捷按钮里。可用 {句子} {部分} {标题} 引用当前内容</span></div><textarea class="txt" id="apqp" rows="3" placeholder="找搭配｜把{部分}里的动词+名词搭配全部列出来&#10;雅思改写｜把{句子}改写成雅思写作 7 分水平的句子">${esc(p.qp)}</textarea></div>
  <div class="row"><button class="btn sm" data-act="apsave">保存学习档案</button><span class="muted" id="apmsg" style="font-size:12.5px"></span></div></div>`;
}
function aiProfSave() { const p = aiProf(); const bg = $("#apbg"), qp = $("#apqp"); if (bg) p.bg = bg.value.trim(); if (qp) p.qp = qp.value; LS.set("aiprof", p); }

/* small helpers */
function mdHTML(s) {
  const lines = String(s || "").replace(/\r/g, "").split("\n"); let out = "", list = null;
  const inl = t => esc(t).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>").replace(/__(.+?)__/g, "<b>$1</b>").replace(/(^|[^*\w])\*([^*\s][^*\n]*?)\*(?![*\w])/g, "$1<i>$2</i>").replace(/`([^`]+)`/g, "<code>$1</code>");
  const close = () => { if (list) { out += `</${list}>`; list = null; } };
  for (const ln of lines) {
    let m;
    if ((m = ln.match(/^\s*[-*•]\s+(.*)/))) { if (list !== "ul") { close(); out += "<ul>"; list = "ul"; } out += `<li>${inl(m[1])}</li>`; continue; }
    if ((m = ln.match(/^\s*(\d+)[.)、]\s*(.*)/))) { if (list !== "ol") { close(); out += `<ol start="${+m[1] || 1}">`; list = "ol"; } out += `<li>${inl(m[2])}</li>`; continue; }
    if (list && /^\s{2,}\S/.test(ln)) { out = out.replace(/<\/li>$/, "<br>" + inl(ln.trim()) + "</li>"); continue; }
    close();
    if ((m = ln.match(/^#{1,6}\s+(.*)/))) { out += `<h5>${inl(m[1])}</h5>`; continue; }
    if (/^\s*>\s?/.test(ln)) { out += `<blockquote>${inl(ln.replace(/^\s*>\s?/, ""))}</blockquote>`; continue; }
    if (/^\s*(-{3,}|\*{3,})\s*$/.test(ln)) { out += "<hr>"; continue; }
    if (ln.trim()) out += `<p>${inl(ln)}</p>`;
  }
  close(); return out;
}
const normTxt = s => String(s || "").toLowerCase().replace(/[’']/g, "'").replace(/[^a-z0-9']+/g, " ").trim();
function inText(src, q) { const a = normTxt(src), b = normTxt(q); return b.length > 3 && a.includes(b); }
function hlMany(en, words) {
  let e = esc(en || ""); const ws = [...new Set((words || []).map(w => String(w || "").toLowerCase()).filter(w => w.length > 1))].sort((a, b) => b.length - a.length); if (!ws.length) return e;
  const pat = ws.map(w => { const stem = w.length >= 5 ? w.replace(/(e|y)$/, "") : w; return stem.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + (w.length >= 4 ? "[a-z]*" : ""); }).join("|");
  return e.replace(new RegExp("\\b(" + pat + ")\\b", "gi"), "<mark>$1</mark>");
}
const arr = a => Array.isArray(a) ? a.filter(Boolean) : [];
const clampN = (n, a, b) => Math.max(a, Math.min(b, Math.round(+n || 0)));

/* ===== 3. AI 学伴 (article hub) ===== */
const HUB = { aid: null, tab: "guide", mi: 0, focus: null, busy: {}, ctrl: null, prof: false, wtask: "retell", wq: "", draft: {} };
const HUB_TABS = [["guide", "导读", "compass"], ["chat", "问答", "chat"], ["quiz", "测验", "exam"], ["write", "复述", "pen"]];
function hubMods(aid) { return hasTR(aid) ? TX(aid).mods.length : 0; }
function hubText(aid, mi, withZh) {
  const a = AMAP[aid]; if (!a) return "";
  if (hasTR(aid)) {
    const X = TX(aid), T = X.T;
    const part = (m, i) => (X.mods.length > 1 ? `【第 ${i + 1} 部分】\n` : "") + T.paras.slice(m.a, m.b + 1).map(p => p.s.join(" ") + (withZh && p.zh ? "\n（译）" + p.zh : "")).join("\n\n");
    if (mi >= 1 && X.mods[mi - 1]) return part(X.mods[mi - 1], mi - 1);
    let s = X.mods.map(part).join("\n\n"); if (s.length > 24000) s = s.slice(0, 24000) + "\n……（后文过长已截断）"; return s;
  }
  return a.sents.map(s => s.en + (withZh && s.zh ? "（" + s.zh + "）" : "")).join(" ");
}
function hubScopeName(aid, mi) { return mi >= 1 && hubMods(aid) ? `第 ${mi} 部分` : hasTR(aid) ? "全文" : "短文"; }
function hubOpen(aid, o = {}) {
  if (!aid || !AMAP[aid]) { aid = READ_ID && AMAP[READ_ID] ? READ_ID : S.cur.art && AMAP[S.cur.art] ? S.cur.art : null; }
  if (!aid) { toast("先打开一篇文章，再使用 AI 学伴"); return; }
  if (HUB.aid !== aid) { HUB.focus = null; HUB.draft = {}; HUB.wq = ""; }
  HUB.aid = aid; HUB.tab = o.tab || HUB.tab || "guide";
  const nm = hubMods(aid); HUB.mi = o.mi != null ? o.mi : (VIEW === "read" && READ_ID === aid && nm ? Math.max(1, RMOD_VIEW || 1) : nm ? Math.max(1, Math.min(nm, HUB.mi || 1)) : 0);
  if (o.focus !== undefined) HUB.focus = o.focus;
  const a = AMAP[aid];
  modal(`<div class="hubtop"><div class="aimod-h hubh"><div class="hubt"><span class="hubic">${I.spark}</span><div style="min-width:0"><b>AI 学伴</b><div class="faint hubsub">${esc(a.title)}</div></div></div>
  <div class="row"><button class="iconbtn" data-act="hubprof" aria-label="学习档案" title="学习档案">${I.gear}</button><button class="iconbtn" data-act="close" aria-label="关闭">${I.x}</button></div></div>
  <div class="hubtabs" role="tablist">${HUB_TABS.map(([k, n, ic]) => `<button class="${HUB.tab === k ? "on" : ""}" data-act="hubtab" data-k="${k}">${I[ic]}<span>${n}</span></button>`).join("")}</div></div>
  <div id="hubprof" class="hubprof" hidden></div>
  <div id="hubbody" class="hubbody"></div>`, { cls: "aimod hubmod" });
  hubDraw();
}
function hubScopeSel(allowAll) {
  const aid = HUB.aid, n = hubMods(aid); if (!n) return `<span class="tag">短文</span>`;
  return `<select class="hubsel" data-act="hubscope" id="hubscope">${allowAll ? `<option value="0" ${HUB.mi === 0 ? "selected" : ""}>全文</option>` : ""}${Array.from({ length: n }, (_, i) => `<option value="${i + 1}" ${HUB.mi === i + 1 ? "selected" : ""}>第 ${i + 1} 部分</option>`).join("")}</select>`;
}
function hubDraw() {
  const box = $("#hubbody"); if (!box) return;
  $$(".hubtabs button").forEach(b => b.classList.toggle("on", b.dataset.k === HUB.tab));
  box.className = "hubbody t-" + HUB.tab;
  if (!aiOK()) { box.innerHTML = aiNeedKey(); return; }
  ({ guide: drawGuide, chat: drawChat, quiz: drawHubQuiz, write: drawWrite }[HUB.tab] || drawGuide)();
}
function hubFoot(t) { return `<div class="faint hubnote">${t || "内容由你连接的大模型生成，可能出错；带 ✓ 的引文已在原文中核对过。"}</div>`; }

/* -- 导读 -- */
const guideId = aid => "g_" + aid;
function guidePrompt(aid) {
  const a = AMAP[aid], n = hubMods(aid);
  return `你是英语精读老师。下面是一篇 TED 演讲${hasTR(aid) ? "的完整讲稿" : "的导读短文"}《${a.title}》${a.ted && a.ted.speaker ? "（演讲者：" + a.ted.speaker + "）" : ""}。${profLine()}
请为学习者做「阅读前导读」。要求：只依据原文；原文里没有的背景要写在 bg 里并保证真实；quotes 和 expr 的英文必须逐字摘自原文。
原文：
<<<
${hubText(aid, 0)}
>>>
严格输出 JSON：
{"gist":"一句话概括（中文，30 字内）","summary":"3–5 句中文摘要","thesis":{"en":"演讲者核心观点（英文，一句，可以自己概括）","zh":"中文"},
"outline":[{"part":${n > 1 ? "部分编号（整数，对应【第 N 部分】）" : "序号（整数）"},"title":"小标题（中文，10 字内）","point":"这一部分讲了什么（中文，一句）"}],
"quotes":[{"en":"最能体现观点的原句（逐字摘录）","zh":"中文"}],
"expr":[{"en":"值得积累的地道表达/搭配/句型（逐字摘录，2–8 个词）","zh":"中文","note":"用法说明（中文，一句）"}],
"bg":["理解本文需要的背景知识（中文，每条一句）"],
"qs":[{"en":"开放式讨论问题（英文）","zh":"中文"}],
"level":"难度评估：大致 CEFR 等级 + 主要难点（中文，一句）"}
数量：outline ${n > 1 ? "按【第 N 部分】逐部分给出，共 " + n + " 条" : "3–6 条"}；quotes 3–4 条；expr 8–12 条；bg 2–4 条；qs 3 条。`;
}
function drawGuide() {
  const box = $("#hubbody"), aid = HUB.aid, r = AIC[guideId(aid)], busy = HUB.busy["g" + aid];
  if (busy) { box.innerHTML = `<div class="aiload">${I.spark}<span>正在通读全文，生成摘要、结构、关键表达和讨论问题…</span></div>`; return; }
  if (!r || !r.v) { box.innerHTML = `<div class="hubintro"><div class="hubhero">${I.compass}</div><b>AI 导读</b><p class="muted">读之前先看一遍全文的骨架：一句话主旨、分部分结构、核心论点原句、值得积累的表达、背景知识和讨论问题。</p>${r && r.err ? `<div class="ai muted">${esc(r.err)}</div>` : ""}<button class="btn" data-act="hubguide">${I.spark}生成导读</button></div>` + hubFoot(); return; }
  const g = r.v, src = hubText(aid, 0), n = hubMods(aid);
  const ok = en => inText(src, en) ? `<span class="okq" title="已在原文中找到">✓</span>` : `<span class="noq" title="原文中没有逐字找到，可能是 AI 改写">≈</span>`;
  const sec = (t, h) => h ? `<div class="aisec"><h4>${t}</h4>${h}</div>` : "";
  box.innerHTML = `<div class="gdgist">${esc(g.gist || "")}</div>${g.summary ? `<p class="gdsum">${esc(g.summary)}</p>` : ""}
  ${g.thesis && g.thesis.en ? `<div class="gdthesis"><span class="tag">核心观点</span><div class="en">${esc(g.thesis.en)}</div><div class="zh">${esc(g.thesis.zh || "")}</div></div>` : ""}
  ${sec("结构", arr(g.outline).length ? `<ol class="gdout">${arr(g.outline).map((o, i) => { const p = clampN(o.part || i + 1, 1, 99); return `<li>${n > 1 && p <= n ? `<button class="gdpart" data-act="hubgo" data-i="${p}">第 ${p} 部分</button>` : ""}<b>${esc(o.title || "")}</b><span>${esc(o.point || "")}</span></li>`; }).join("")}</ol>` : "")}
  ${sec("核心原句", arr(g.quotes).map(q => `<div class="ex"><div class="en">${ok(q.en)}${esc(q.en)} <button class="say mini" data-act="say" data-text="${esc(q.en)}" aria-label="朗读">${I.vol}</button></div><div class="zh">${esc(q.zh || "")}</div></div>`).join(""))}
  ${sec("值得积累的表达", arr(g.expr).length ? `<div class="gdexpr">${arr(g.expr).map(x => `<div><div class="en">${ok(x.en)}<b>${esc(x.en)}</b></div><div class="zh">${esc(x.zh || "")}${x.note ? `<span class="faint"> · ${esc(x.note)}</span>` : ""}</div></div>`).join("")}</div>` : "")}
  ${sec("背景知识", arr(g.bg).length ? `<ul>${arr(g.bg).map(x => `<li>${esc(x)}</li>`).join("")}</ul>` : "")}
  ${sec("讨论问题", arr(g.qs).map((q, i) => `<div class="gdq"><div><div class="en">${esc(q.en)}</div><div class="zh">${esc(q.zh || "")}</div></div><button class="btn sm ghost" data-act="hubanswer" data-i="${i}">${I.pen}用英文回答</button></div>`).join(""))}
  ${g.level ? `<div class="faint" style="font-size:12.5px;margin-top:10px">${esc(g.level)}</div>` : ""}
  <div class="row" style="justify-content:center;margin-top:12px"><button class="btn sm ghost" data-act="hubguide" data-redo="1">重新生成</button></div>` + hubFoot();
}
async function hubGuide() {
  const aid = HUB.aid, k = "g" + aid; if (HUB.busy[k]) return; HUB.busy[k] = 1; drawGuide();
  try { const v = await aiJson(guidePrompt(aid), { temp: 0.3, maxTokens: 3500, big: true }); if (!v || !v.gist) throw { code: "parse", message: "返回内容缺少摘要" }; AIC[guideId(aid)] = { v, at: Date.now() }; putAI(guideId(aid)); }
  catch (e) { AIC[guideId(aid)] = Object.assign({}, AIC[guideId(aid)] || {}, { err: aiErr(e) }); }
  delete HUB.busy[k]; if (HUB.aid === aid && HUB.tab === "guide") drawGuide();
}

/* -- 问答 (grounded chat) -- */
const chatId = aid => "q_" + aid;
function hubChat() { const id = chatId(HUB.aid); return AIC[id] || (AIC[id] = { msgs: [], at: Date.now() }); }
function hubSys() {
  const aid = HUB.aid, a = AMAP[aid], f = HUB.focus ? getS(aid, HUB.focus.s, HUB.focus.m) : null;
  return `你是一位耐心、严谨的英语精读老师，正在一对一陪学习者精读一篇 TED 演讲。${profLine()}
材料：《${a.title}》${a.ted && a.ted.speaker ? "，演讲者 " + a.ted.speaker : ""}。学习者正在读的范围（${hubScopeName(aid, HUB.mi)}）原文如下：
<<<
${hubText(aid, HUB.mi, true)}
>>>
${f ? "学习者现在关注的句子：「" + f.en + "」\n" : ""}规则：
1. 以上面的原文为依据回答；引用原文时逐字引用并加引号。
2. 原文之外的信息（背景、常识、延伸）要明确标注「补充」；不确定就直说，绝不编造人名、数据或出处。
3. 英文例句都附中文翻译。讲语法时点出具体成分，不要空泛。
4. 用简洁的 Markdown：短段落和要点列表，必要时加粗关键词；不要用表格；一般不超过 300 字，学习者要求展开时再展开。
5. 学习者让你提问、考他时，一次只问一个问题，等他回答后再评判、给出原文依据，然后问下一个。`;
}
function hubFill(p) {
  const aid = HUB.aid, f = HUB.focus ? getS(aid, HUB.focus.s, HUB.focus.m) : null;
  return p.replace(/\{句子\}/g, f ? "「" + f.en + "」" : "这部分的关键句").replace(/\{部分\}/g, hubScopeName(aid, HUB.mi)).replace(/\{标题\}/g, "《" + AMAP[aid].title + "》");
}
function hubChips() {
  const f = !!HUB.focus, sc = hubScopeName(HUB.aid, HUB.mi);
  const base = f ? [["讲透这句", "把这句话讲透：先给准确翻译，再拆主干和修饰成分，最后说说它在上下文里起什么作用。"], ["指代与逻辑", "这句话里的代词、省略和逻辑关系分别指向上下文的什么？"], ["换种说法", "用 3 种不同的地道说法表达这句话的意思，并说明语气或侧重的差别。"], ["发音与断句", "朗读这句时应该在哪里停顿、哪些词重读、有哪些连读或弱读？"]]
    : [["讲了什么", `${sc}讲了什么？先一句话概括，再按顺序列出要点。`], ["难句精讲", `挑出${sc}最难的 3 个句子，逐句翻译并拆解结构。`], ["简单英语版", `用 B1 水平的简单英语改写${sc}，保留全部要点，然后列出改写时替换掉的难词。`], ["积累表达", `${sc}有哪些值得积累的地道表达和搭配？每个给一个我能在工作或生活里用的新例句。`], ["背景知识", `读懂${sc}需要哪些背景知识？`], ["考考我", `就${sc}的内容考我 3 个理解问题，一次只问一个，等我回答后再评判。`]];
  return base.concat(aiQuick());
}
function chatMsgHTML(m, i) {
  if (m.role === "user") return `<div class="cmsg u"><div class="cb">${m.focus ? `<div class="cfocus">${esc(m.focus.slice(0, 120))}</div>` : ""}${esc(m.show || m.content)}</div></div>`;
  return `<div class="cmsg a${m.err ? " err" : ""}" data-i="${i}"><div class="cb">${m.pending && !m.content ? `<span class="typing"><i></i><i></i><i></i></span>` : mdHTML(m.content)}</div>${!m.pending && m.content && !m.err ? `<div class="cact"><button class="linkbtn" data-act="chatcopy" data-i="${i}">${I.copy}复制</button></div>` : ""}</div>`;
}
function drawChat() {
  const box = $("#hubbody"), rec = hubChat(), aid = HUB.aid, f = HUB.focus ? getS(aid, HUB.focus.s, HUB.focus.m) : null;
  const busy = !!HUB.busy.chat;
  box.innerHTML = `<div class="hubbar"><span class="faint">范围</span>${hubScopeSel(true)}${rec.msgs.length ? `<button class="linkbtn" data-act="chatclear" style="margin-left:auto">清空对话</button>` : ""}</div>
  ${f ? `<div class="chatfocus"><span class="tag">关注这句</span><span class="en">${esc(f.en)}</span><button class="iconbtn" data-act="chatunfocus" aria-label="取消">${I.x}</button></div>` : ""}
  <div class="chatlog" id="chatlog">${rec.msgs.length ? rec.msgs.map(chatMsgHTML).join("") : `<div class="hubintro sm"><b>问任何关于这篇文章的问题</b><p class="muted">AI 会以你正在读的原文为依据回答，并标出原文之外的补充。可以问词句、逻辑、背景，也可以让它考你。</p></div>`}</div>
  <div class="chatdock"><div class="chips hubchips">${hubChips().map(([n, p], i) => `<button class="chip" data-act="chatchip" data-i="${i}" ${busy ? "disabled" : ""}>${esc(n)}</button>`).join("")}</div>
  <div class="chatin"><textarea id="chatta" rows="1" placeholder="输入问题，中英文都可以" ${busy ? "disabled" : ""}>${esc(HUB.draft.chat || "")}</textarea>${busy ? `<button class="iconbtn stop" data-act="chatstop" aria-label="停止">${I.stop}</button>` : `<button class="iconbtn send" data-act="chatsend" aria-label="发送">${I.send}</button>`}</div><div class="faint hubnote" style="margin:6px 0 0">回答基于你正在读的原文；标「补充」的是原文之外的信息。每次提问都会消耗你的 API 额度。</div></div>`;
  const md = $(".modal.hubmod"); if (md && rec.msgs.length) md.scrollTop = md.scrollHeight;
}
function chatUpdLast() {
  const rec = hubChat(), i = rec.msgs.length - 1, el = $(`#chatlog .cmsg[data-i="${i}"] .cb`); if (!el) return;
  el.innerHTML = mdHTML(rec.msgs[i].content) || `<span class="typing"><i></i><i></i><i></i></span>`;
  const md = $(".modal.hubmod"); if (md && md.scrollHeight - md.scrollTop - md.clientHeight < 220) md.scrollTop = md.scrollHeight;
}
async function chatSend(text, show) {
  text = String(text || "").trim(); if (!text || HUB.busy.chat || !aiOK()) return;
  const aid = HUB.aid, rec = hubChat(), f = HUB.focus ? getS(aid, HUB.focus.s, HUB.focus.m) : null;
  rec.msgs.push({ role: "user", content: (f ? "（关于这句：" + f.en + "）\n" : "") + text, show: show || text, focus: f ? f.en : "" });
  const last = { role: "assistant", content: "", pending: 1 }; rec.msgs.push(last);
  HUB.draft.chat = ""; HUB.busy.chat = 1; drawChat();
  const hist = rec.msgs.slice(0, -1).filter(m => !m.err).slice(-12).map(m => ({ role: m.role, content: m.content }));
  const ctrl = HUB.ctrl = new AbortController();
  try {
    const out = await aiAsk(hist, { system: hubSys(), temp: 0.5, maxTokens: 1800, big: true, signal: ctrl.signal, onText: ({ text: t }) => { last.content = t; if (HUB.aid === aid && HUB.tab === "chat") chatUpdLast(); } });
    last.content = out || last.content; if (!last.content) { last.content = "（没有返回内容）"; last.err = 1; }
  } catch (e) {
    if (e && (e.code === "abort" || e.name === "AbortError")) last.content = (e.text || last.content || "") + "\n\n（已停止）";
    else { last.content = (e && e.text) || last.content ? (e.text || last.content) + "\n\n（连接中断）" : aiErr(e); if (!e || !e.text) last.err = 1; }
  }
  delete last.pending; HUB.busy.chat = 0; HUB.ctrl = null;
  if (rec.msgs.length > 40) rec.msgs = rec.msgs.slice(-40); rec.at = Date.now(); putAI(chatId(aid));
  if (HUB.aid === aid && HUB.tab === "chat") drawChat();
}

/* -- 测验 (AI comprehension quiz) -- */
const quizHistId = aid => "z_" + aid;
function drawHubQuiz() {
  const box = $("#hubbody"), aid = HUB.aid, hist = (AIC[quizHistId(aid)] || { h: [] }).h, busy = HUB.busy.quiz;
  box.innerHTML = `<div class="hubintro"><div class="hubhero">${I.exam}</div><b>AI 理解测验</b><p class="muted">按你选的范围现出 5 道阅读理解题：主旨、细节、推断、词汇语境义各有覆盖；交卷后每题都有中文解析和原文依据。答对 1 题 +4 XP。</p>
  <div class="hubbar" style="justify-content:center"><span class="faint">范围</span>${hubScopeSel(true)}<div class="seg"><button class="${HUB.qhard ? "" : "on"}" data-act="quizlv" data-k="0">标准</button><button class="${HUB.qhard ? "on" : ""}" data-act="quizlv" data-k="1">挑战</button></div></div>
  ${busy ? `<div class="aiload">${I.spark}<span>正在根据原文出题…</span></div>` : `<button class="btn" data-act="quizgen">${I.spark}出 5 道题</button>`}${HUB.qerr ? `<div class="ai muted">${esc(HUB.qerr)}</div>` : ""}</div>
  ${hist.length ? `<div class="aisec"><h4>测验记录</h4><div class="qhist">${hist.slice(-8).reverse().map(h => `<div><span>${esc(h.sc_name || "")}</span><b class="num">${h.sc}/${h.tot}</b><span class="faint num">${fmtDate(h.at)}</span></div>`).join("")}</div></div>` : ""}` + hubFoot("题目由大模型根据原文生成；解析里给出原文依据，可回到原文核对。");
}
async function quizGen() {
  const aid = HUB.aid, mi = HUB.mi; if (HUB.busy.quiz) return; HUB.busy.quiz = 1; HUB.qerr = ""; drawHubQuiz();
  const hard = !!HUB.qhard;
  const p = `你是英语阅读理解命题老师。根据下面的原文出 5 道单项选择题，考查真实理解而不是死记：1 道主旨、2 道细节、1 道推断、1 道词汇或短语的语境义${hard ? "；挑战难度：推断和态度题为主，干扰项要更有迷惑性、需要细读才能排除" : ""}。${profLine()}
题干和选项用英文；每题 4 个选项，只有一个正确；干扰项要似是而非，但能被原文明确排除。exp 用中文：先说正确答案的依据，再逐个说明错误选项错在哪。ev 给出支撑答案的原文句子（逐字摘录）。
原文（${hubScopeName(aid, mi)}）：
<<<
${hubText(aid, mi)}
>>>
严格输出 JSON：{"qs":[{"type":"主旨|细节|推断|词汇|态度","q":"题干","o":["选项","选项","选项","选项"],"a":正确选项下标0-3,"exp":"中文解析","ev":"原文依据"}]}`;
  try {
    const r = await aiJson(p, { temp: 0.4, maxTokens: 3000, big: true });
    const qs = arr(r && r.qs).filter(q => q.q && Array.isArray(q.o) && q.o.length >= 3 && q.o.length <= 5 && Number.isInteger(+q.a) && +q.a >= 0 && +q.a < q.o.length).slice(0, 5).map(q => {
      const ord = shuffle(q.o.map((_, j) => j)); return { type: "mc", q: q.q, sub: (q.type ? "【" + q.type + "】" : ""), o: ord.map(j => String(q.o[j])), a: ord.indexOf(+q.a), exp: (q.exp || "") + (q.ev ? `　原文依据：${q.ev}${inText(hubText(aid, mi), q.ev) ? " ✓" : ""}` : "") };
    });
    if (qs.length < 3) throw { code: "parse", message: "题目格式不完整，请再试一次" };
    delete HUB.busy.quiz;
    const scName = hubScopeName(aid, mi);
    runQuiz({ title: "AI 理解测验 · " + scName, qs, onDone: (sc, tot) => {
      const xp = sc * 4; S.xp += xp; S.stats.aiq = (S.stats.aiq || 0) + 1; save(); checkBadges(); renderChrome();
      const id = quizHistId(aid), h = AIC[id] || { h: [] }; h.h.push({ mi, sc_name: scName, sc, tot, at: Date.now() }); h.h = h.h.slice(-30); AIC[id] = h; putAI(id);
      return `AI 测验 +${xp} XP · 关闭后可在 AI 学伴里继续`;
    } });
    return;
  } catch (e) { HUB.qerr = aiErr(e); }
  delete HUB.busy.quiz; if (HUB.aid === aid && HUB.tab === "quiz") drawHubQuiz();
}

/* -- 复述 / 写作批改 -- */
const writeId = aid => "r_" + aid;
const W_TASKS = [["retell", "复述要点", "用 3–6 句英文复述所选范围的主要内容"], ["answer", "回答问题", "用英文回答一个讨论问题"], ["opinion", "表达观点", "你同意演讲者吗？用英文写出理由"]];
function drawWrite() {
  const box = $("#hubbody"), aid = HUB.aid, rec = AIC[writeId(aid)] || { h: [] }, busy = HUB.busy.write;
  const g = (AIC[guideId(aid)] || {}).v, qs = g ? arr(g.qs) : [];
  const t = W_TASKS.find(x => x[0] === HUB.wtask) || W_TASKS[0];
  const last = rec.h[rec.h.length - 1];
  box.innerHTML = `<div class="hubbar"><div class="seg">${W_TASKS.map(([k, n]) => `<button class="${HUB.wtask === k ? "on" : ""}" data-act="wtask" data-k="${k}">${n}</button>`).join("")}</div>${HUB.wtask === "retell" ? `<span class="faint">范围</span>${hubScopeSel(true)}` : ""}</div>
  <div class="wtask"><b>${esc(t[2])}</b>${HUB.wtask === "answer" ? (qs.length ? `<div class="wqs">${qs.map((q, i) => `<button class="chip ${HUB.wq === q.en ? "on" : ""}" data-act="wq" data-i="${i}">${esc(q.en)}</button>`).join("")}</div>` : "") + `<input type="text" class="txt" id="wqin" value="${esc(HUB.wq)}" placeholder="${qs.length ? "选上面的问题，或自己输入一个问题" : "输入一个问题（生成导读后会有推荐问题）"}">` : ""}</div>
  <textarea class="txt wta" id="wta" rows="6" placeholder="在这里写英文。不用怕错，AI 只改真正的错误和不地道的地方。" ${busy ? "disabled" : ""}>${esc(HUB.draft.write || "")}</textarea>
  <div class="row" style="justify-content:space-between"><span class="faint num" id="wcount" style="font-size:12px">${(HUB.draft.write || "").trim().split(/\s+/).filter(Boolean).length} 词</span>${busy ? `<div class="aiload" style="margin:0">${I.spark}<span>正在批改…</span></div>` : `<button class="btn" data-act="wsubmit">${I.spark}提交批改</button>`}</div>
  ${HUB.werr ? `<div class="ai muted">${esc(HUB.werr)}</div>` : ""}
  <div id="wres">${last ? writeResHTML(last) : ""}</div>
  ${rec.h.length > 1 ? `<div class="aisec"><h4>历史</h4><div class="qhist">${rec.h.slice(0, -1).slice(-6).reverse().map(h => `<div><span>${esc((W_TASKS.find(x => x[0] === h.task) || W_TASKS[0])[1])}</span><b class="num">${h.res && h.res.score ? Math.round((h.res.score.content + h.res.score.language + h.res.score.structure) / 3 * 10) / 10 : "—"}</b><span class="faint num">${fmtDate(h.at)}</span></div>`).join("")}</div></div>` : ""}` + hubFoot("批改由大模型完成，只供参考；分数用于自己纵向比较。");
}
function writeResHTML(h) {
  const r = h.res || {}, sc = r.score || {};
  const bar = (n, v) => `<div class="wsc"><span>${n}</span><div class="bar"><i style="width:${clampN(v, 0, 10) * 10}%"></i></div><b class="num">${clampN(v, 0, 10)}</b></div>`;
  return `<div class="aisec wres"><h4>批改结果</h4>
  <div class="wscs">${bar("内容", sc.content)}${bar("语言", sc.language)}${bar("结构", sc.structure)}</div>
  ${r.overall ? `<p>${esc(r.overall)}</p>` : ""}
  ${arr(r.fixes).length ? `<div class="wfix">${arr(r.fixes).map(f => `<div><div><del>${esc(f.orig || "")}</del> → <ins>${esc(f.fix || "")}</ins>${f.type ? `<span class="tag off">${esc(f.type)}</span>` : ""}</div><div class="faint">${esc(f.why || "")}</div></div>`).join("")}</div>` : `<p class="muted">没有发现需要修改的错误。</p>`}
  ${r.better ? `<details class="aigram" open><summary>润色后的版本</summary><div class="en">${esc(r.better)}</div></details>` : ""}
  ${arr(r.borrow).length ? `<details class="aigram" open><summary>可以从原文借用的表达</summary>${arr(r.borrow).map(b => `<div style="margin-top:4px"><b class="en">${esc(b.en || "")}</b> <span class="faint">${esc(b.zh || "")}</span><div>${esc(b.how || "")}</div></div>`).join("")}</details>` : ""}
  ${r.model ? `<details class="aigram"><summary>参考范文</summary><div class="en">${esc(r.model)}</div><button class="say mini" data-act="say" data-text="${esc(r.model)}">${I.vol}朗读</button></details>` : ""}
  <details class="aigram"><summary>你写的原文</summary><div class="en">${esc(h.text)}</div></details></div>`;
}
async function writeSubmit() {
  const aid = HUB.aid, ta = $("#wta"), text = (ta ? ta.value : HUB.draft.write || "").trim(); HUB.draft.write = text;
  const qin = $("#wqin"); if (qin) HUB.wq = qin.value.trim();
  if (text.split(/\s+/).filter(Boolean).length < 8) { toast("至少写 8 个英文单词再提交"); return; }
  if (HUB.wtask === "answer" && !HUB.wq) { toast("先选一个问题，或输入你要回答的问题"); return; }
  if (HUB.busy.write) return; HUB.busy.write = 1; HUB.werr = ""; drawWrite();
  const mi = HUB.wtask === "retell" ? HUB.mi : 0;
  const task = HUB.wtask === "retell" ? `复述（${hubScopeName(aid, mi)}）：用自己的话复述原文要点` : HUB.wtask === "answer" ? "回答讨论问题：" + HUB.wq : "表达观点：是否同意演讲者，并给出理由";
  const p = `你是英语写作老师，批改学习者的一段英文。${profLine()}
任务：${task}
参考原文：
<<<
${hubText(aid, mi)}
>>>
学习者写的：
<<<
${text}
>>>
批改要求：先判断内容${HUB.wtask === "retell" ? "是否忠实、完整地复述了原文要点" : "是否切题、论证是否清楚"}，再看语言。只改真正的错误和明显不地道的地方，学习者写对的地方不要改写。fixes 的 orig 必须逐字摘自学习者的文字。borrow 的英文必须逐字摘自原文。
严格输出 JSON：{"score":{"content":0-10整数,"language":0-10整数,"structure":0-10整数},"overall":"总评（中文 2–3 句，先说做得好的地方）","fixes":[{"orig":"","fix":"","why":"原因（中文一句）","type":"语法|用词|搭配|拼写|逻辑|地道性"}],"better":"在学习者原文基础上润色后的完整版本","borrow":[{"en":"","zh":"","how":"怎么用到你的文字里（中文一句）"}],"model":"参考范文（英文，长度与学习者相近或略长）"}`;
  try {
    const res = await aiJson(p, { temp: 0.3, maxTokens: 3000, big: true }); if (!res || !res.score) throw { code: "parse", message: "返回内容缺少评分" };
    const id = writeId(aid), rec = AIC[id] || { h: [] }; rec.h.push({ task: HUB.wtask, q: HUB.wq, mi, text, res, at: Date.now() }); rec.h = rec.h.slice(-12); AIC[id] = rec; putAI(id);
    const avg = (clampN(res.score.content, 0, 10) + clampN(res.score.language, 0, 10) + clampN(res.score.structure, 0, 10)) / 3, xp = Math.round(5 + avg * 2);
    S.xp += xp; S.stats.aiw = (S.stats.aiw || 0) + 1; markStudy(); save(); checkBadges(); renderChrome(); toast(`批改完成 +${xp} XP`);
    HUB.draft.write = "";
  } catch (e) { HUB.werr = aiErr(e); }
  delete HUB.busy.write; if (HUB.aid === aid && HUB.tab === "write") { drawWrite(); const w = $("#wres"); if (w && w.firstChild) w.scrollIntoView({ behavior: S.set.motion ? "smooth" : "auto", block: "start" }); }
}

/* ===== 4. 回译练习 (back-translation, from the sentence drawer) ===== */
const BT = { aid: null, si: 0, m: "", zh: "", busy: false, res: null, err: "", text: "" };
async function btOpen(aid, si, m) {
  if (!aiOK()) { toast(PWA ? "请先在「设置 → AI 解析服务」填写密钥" : "AI 服务暂不可用"); return; }
  closeSheet(); const s = getS(aid, si, m); if (!s) return;
  Object.assign(BT, { aid, si, m: m || "", zh: s.zh && !s.zhPara ? s.zh : ((AIC["s_" + aid + "_" + (m === "t" ? "t" : "") + si] || {}).translation || (AIC["bz_" + aid + "_" + si] || "")), busy: false, res: null, err: "", text: "" });
  modal(`<div class="aimod-h"><div class="row" style="gap:10px"><span class="tmhicon">${I.swap}</span><div><b style="font-size:17px">回译练习</b><div class="faint" style="font-size:12px">看中文写英文，再和原句对比</div></div></div><button class="iconbtn" data-act="close" aria-label="关闭">${I.x}</button></div><div id="btbody" class="tmbody"></div>`, { cls: "aimod btmod" });
  btDraw();
  if (!BT.zh) {
    BT.busy = true; btDraw();
    try { const r = await aiJson(`把这句英文翻译成自然、准确的简体中文，不要增删信息。严格输出 JSON：{"zh":"译文"}\n${s.en}`, { temp: 0.2, maxTokens: 400 }); BT.zh = (r && r.zh) || ""; if (BT.zh) { AIC["bz_" + aid + "_" + si] = BT.zh; putAI("bz_" + aid + "_" + si); } }
    catch (e) { BT.err = aiErr(e); }
    BT.busy = false; btDraw();
  }
}
function btDraw() {
  const box = $("#btbody"); if (!box) return; const s = getS(BT.aid, BT.si, BT.m), r = BT.res;
  BT.next = BT.m === "t" && hasTR(BT.aid) ? (BT.si + 1 < TX(BT.aid).flat.length ? BT.si + 1 : null) : (AMAP[BT.aid] && BT.si + 1 < AMAP[BT.aid].sents.length ? BT.si + 1 : null);
  box.innerHTML = `<div class="btzh">${BT.zh ? esc(BT.zh) : BT.busy && !BT.text ? '<span class="faint">正在准备中文…</span>' : `<span class="faint">${esc(BT.err || "")}</span>`}</div>
  <textarea class="txt wta" id="btta" rows="3" placeholder="用英文写出这句话" ${BT.busy || r ? "disabled" : ""}>${esc(BT.text)}</textarea>
  ${r ? "" : `<div class="row" style="justify-content:space-between"><button class="linkbtn" data-act="btpeek">看一眼原句（放弃本题）</button>${BT.busy && BT.text ? `<div class="aiload" style="margin:0">${I.spark}<span>正在对比…</span></div>` : `<button class="btn" data-act="btsubmit" ${BT.zh ? "" : "disabled"}>${I.spark}对比原句</button>`}</div>`}
  ${BT.err && BT.zh ? `<div class="ai muted">${esc(BT.err)}</div>` : ""}
  ${r ? `<div class="aisec"><div class="btscore"><b class="num">${clampN(r.score, 0, 100)}</b><span>${esc(r.verdict || "")}</span></div>
   <div class="ex"><div class="faint" style="font-size:12px">原句</div><div class="en">${esc(s.en)} <button class="say mini" data-act="say" data-text="${esc(s.en)}" aria-label="朗读">${I.vol}</button></div></div>
   ${r.meaning ? `<p>${esc(r.meaning)}</p>` : ""}
   ${arr(r.errors).length ? `<div class="wfix">${arr(r.errors).map(f => `<div><div><del>${esc(f.mine || "")}</del> → <ins>${esc(f.fix || "")}</ins></div><div class="faint">${esc(f.why || "")}</div></div>`).join("")}</div>` : ""}
   ${arr(r.learn).length ? `<details class="aigram" open><summary>原句值得学的地方</summary>${arr(r.learn).map(l => `<div style="margin-top:4px"><b class="en">${esc(l.orig || "")}</b><div>${esc(l.note || "")}</div></div>`).join("")}</details>` : ""}
   ${arr(r.alt).length ? `<details class="aigram"><summary>其他地道说法</summary>${arr(r.alt).map(x => `<div class="en">${esc(x)}</div>`).join("")}</details>` : ""}
   <div class="row" style="justify-content:center;margin-top:10px"><button class="btn sm ghost" data-act="btretry">再写一次</button>${BT.next != null ? `<button class="btn sm" data-act="btnext">下一句</button>` : ""}</div></div>` : ""}`;
}
async function btSubmit() {
  const ta = $("#btta"); BT.text = (ta ? ta.value : "").trim(); if (BT.text.split(/\s+/).filter(Boolean).length < 2) { toast("先写出英文再对比"); return; }
  const s = getS(BT.aid, BT.si, BT.m); BT.busy = true; BT.err = ""; btDraw();
  try {
    const r = await aiJson(`学习者在做「回译练习」：看中文译文，自己写出英文，再与英文原句对比。${profLine()}
英文原句：${s.en}
中文：${BT.zh}
学习者写的英文：${BT.text}
评判标准：意思是否准确完整、语法是否正确、用词是否地道。不要因为与原句措辞不同就扣分——只要地道且意思一致就算对。errors 只列真正的错误，mine 必须逐字摘自学习者的句子。learn 的 orig 必须逐字摘自原句。
严格输出 JSON：{"score":0-100整数,"verdict":"一句话总评（中文）","meaning":"意思是否准确完整（中文一两句）","errors":[{"mine":"","fix":"","why":"原因（中文）"}],"learn":[{"orig":"","note":"好在哪（中文）"}],"alt":["另外 1–2 种地道说法"]}`, { temp: 0.2, maxTokens: 1500, big: true });
    if (!r || r.score == null) throw { code: "parse", message: "返回内容缺少评分" };
    BT.res = r; S.stats.aibt = (S.stats.aibt || 0) + 1; const xp = r.score >= 80 ? 4 : 2; S.xp += xp; markStudy(); save(); checkBadges(); renderChrome();
  } catch (e) { BT.err = aiErr(e); }
  BT.busy = false; btDraw();
}

/* ===== 5. review: AI 复习 (word story, coach, dynamic flash examples) ===== */
const STY = { n: 10, genre: "story", words: null, busy: false, err: "" };
const STY_GEN = [["story", "小故事"], ["news", "新闻"], ["dialog", "对话"], ["work", "职场邮件"], ["tech", "科技博客"]];
function storyPool() {
  const due = dueCards().map(v => v.k), rest = Object.values(VOC).filter(v => lx(v.k) && !due.includes(v.k)).sort((a, b) => (a.box || 0) - (b.box || 0) || b.l - a.l).map(v => v.k);
  return due.concat(rest);
}
function storyPick(reshuffle) { const pool = storyPool(); const top = pool.slice(0, Math.max(STY.n * 2, 20)); STY.words = (reshuffle ? shuffle(top) : top).slice(0, STY.n); }
function vAIRev() {
  if (!aiOK()) return `<div class="sechead"><h2>AI 复习</h2></div>` + aiNeedKey();
  const nv = Object.keys(VOC).length; if (!STY.words || STY.words.some(k => !VOC[k])) storyPick();
  const st = AIC.st_last, co = AIC.coach;
  return `<div class="sechead"><h2>AI 复习</h2><span class="muted">用你的生词和学习数据个性化生成</span></div>
  <div class="grid2">
   <div class="panel aicard"><div class="aicardh"><span class="aicic">${I.quill}</span><div><b>生词串成短文</b><div class="muted" style="font-size:12.5px">把待复习和最近点学的词放进一篇新文章，在语境里重新见到它们</div></div></div>
    ${nv < 4 ? `<div class="empty">记忆库里至少要有 4 个单词。阅读时点击生词就会加入。</div>` : `<div class="setrow"><div class="l"><b>体裁</b></div><div class="seg wrap">${STY_GEN.map(([k, n]) => `<button class="${STY.genre === k ? "on" : ""}" data-act="stygen" data-k="${k}">${n}</button>`).join("")}</div></div>
    <div class="setrow"><div class="l"><b>词数</b></div><div class="seg">${[6, 10, 15].map(n => `<button class="${STY.n === n ? "on" : ""}" data-act="styn" data-n="${n}">${n} 个</button>`).join("")}</div></div>
    <div class="chips stywords">${STY.words.map(k => `<span class="chip">${esc(lx(k).w)}</span>`).join("")}<button class="linkbtn" data-act="styshuf">换一批</button></div>
    ${STY.busy ? `<div class="aiload">${I.spark}<span>正在用这些词写文章…</span></div>` : `<button class="btn" data-act="stygo">${I.spark}生成短文</button>`}${STY.err ? `<div class="ai muted">${esc(STY.err)}</div>` : ""}
    ${st ? `<button class="linkbtn" data-act="styopen" style="margin-top:8px">打开上一篇：${esc(st.v.title || "")}</button>` : ""}`}</div>
   <div class="panel aicard"><div class="aicardh"><span class="aicic">${I.compass}</span><div><b>AI 学习教练</b><div class="muted" style="font-size:12.5px">读取你的学习时长、生词熟练度、测验成绩，给出诊断和下周计划</div></div></div>
    ${HUB.busy.coach ? `<div class="aiload">${I.spark}<span>正在分析你的学习数据…</span></div>` : `<button class="btn" data-act="coachgo">${I.spark}${co ? "重新分析" : "分析我的学习"}</button>`}${HUB.coachErr ? `<div class="ai muted">${esc(HUB.coachErr)}</div>` : ""}
    ${co ? `<div class="faint" style="font-size:12px;margin-top:6px">上次分析：${fmtDate(co.at)}</div><div id="coachbox">${coachHTML(co.v)}</div>` : ""}</div>
  </div>
  <div class="panel" style="margin-top:12px"><b>其他 AI 复习方式</b><ul class="muted" style="font-size:13px;margin:6px 0 0;padding-left:18px"><li>强化复习（闪卡）翻到背面后，可以点「AI 新例句」，每次给这个词一个新的语境。</li><li>阅读页工具栏的「AI 学伴」：导读、问答、理解测验、复述批改。</li><li>整句解析里的「回译练习」：看中文写英文，再和原句逐处对比。</li></ul></div>`;
}
async function storyGo() {
  if (STY.busy) return; STY.busy = true; STY.err = ""; render();
  const ws = STY.words.map(k => lx(k).w), gn = (STY_GEN.find(x => x[0] === STY.genre) || STY_GEN[0])[1], p = aiProf();
  const len = STY.n <= 6 ? 140 : STY.n <= 10 ? 200 : 280;
  try {
    const v = await aiJson(`用下面这些英文单词写一篇「${gn}」，约 ${len} 词，分 2–4 段。${profLine()}
要求：每个单词至少自然地出现一次（可以用变形），不要生硬堆砌；内容要有意思、前后连贯${p.bg ? "，题材可以贴近学习者的背景兴趣" : ""}。每段给出对应的中文翻译。
单词：${ws.join(", ")}
严格输出 JSON：{"title":"英文标题","titleZh":"中文标题","paras":[{"en":"英文段落","zh":"中文翻译"}],"words":[{"w":"单词原形","form":"文中出现的形式","zh":"在文中的意思"}],"qs":[{"q":"英文理解问题","a":"参考答案（英文，附中文）"}]}
qs 给 3 个。`, { temp: 0.8, maxTokens: 2500, big: true });
    if (!v || !arr(v.paras).length) throw { code: "parse", message: "返回内容缺少正文" };
    AIC.st_last = { v, words: ws, at: Date.now() }; putAI("st_last"); markStudy(); S.xp += 5; save(); renderChrome();
    STY.busy = false; render(); storyOpen(); return;
  } catch (e) { STY.err = aiErr(e); }
  STY.busy = false; render();
}
function storyOpen() {
  const st = AIC.st_last; if (!st) return; const v = st.v, hw = arr(v.words).flatMap(x => [x.w, x.form]).concat(st.words || []);
  const missing = (st.words || []).filter(w => !arr(v.paras).some(p => hlMany(p.en, [w]).includes("<mark>")));
  modal(`<div class="aimod-h"><div style="min-width:0"><div class="aimod-w" style="font-size:20px">${esc(v.title || "")}</div><div class="faint">${esc(v.titleZh || "")}</div></div><button class="iconbtn" data-act="close" aria-label="关闭">${I.x}</button></div>
  <div class="tmbody"><div class="row" style="margin-bottom:8px"><button class="say" data-act="say" data-text="${esc(arr(v.paras).map(p => p.en).join(" "))}">${I.vol}朗读全文</button><button class="say" data-act="stytoggle">显示/隐藏中文</button></div>
  <div class="story" id="story">${arr(v.paras).map(p => `<div class="stp"><p class="en">${hlMany(p.en, hw)}</p><p class="zh">${esc(p.zh || "")}</p></div>`).join("")}</div>
  ${arr(v.words).length ? `<div class="aisec"><h4>本文生词</h4><div class="aicoll">${arr(v.words).map(x => `<div><span class="en"><b>${esc(x.form || x.w)}</b>${x.form && x.w && x.form.toLowerCase() !== x.w.toLowerCase() ? ` <span class="faint">(${esc(x.w)})</span>` : ""}</span><span class="zh">${esc(x.zh || "")}</span></div>`).join("")}</div>${missing.length ? `<div class="faint" style="font-size:12px;margin-top:4px">未在文中找到：${missing.map(esc).join("、")}</div>` : ""}</div>` : ""}
  ${arr(v.qs).length ? `<div class="aisec"><h4>读后问题</h4>${arr(v.qs).map(q => `<details class="aigram"><summary>${esc(q.q)}</summary>${esc(q.a || "")}</details>`).join("")}</div>` : ""}</div>`, { cls: "aimod stymod" });
}
function coachData() {
  const t = tmS(), days = []; for (let i = 6; i >= 0; i--) { const k = addDays(todayK(), -i); days.push(k.slice(5) + ":" + Math.round((t.day[k] || 0) / 60) + "分"); }
  const vs = Object.values(VOC).filter(v => lx(v.k));
  const boxes = [0, 0, 0, 0, 0, 0]; vs.forEach(v => boxes[Math.min(5, v.box || 0)]++);
  const hard = vs.filter(v => (v.box || 0) <= 1).sort((a, b) => b.n - a.n).slice(0, 15).map(v => lx(v.k).w + "(点" + v.n + "次,熟练" + (v.box || 0) + ")");
  const quiz = Object.keys(AIC).filter(k => k.startsWith("z_")).flatMap(k => AIC[k].h || []).slice(-10).map(h => h.sc + "/" + h.tot);
  const wr = Object.keys(AIC).filter(k => k.startsWith("r_")).flatMap(k => AIC[k].h || []).slice(-5).map(h => h.res && h.res.score ? `内容${h.res.score.content}/语言${h.res.score.language}/结构${h.res.score.structure}` : "");
  return `- 连续打卡：${streak()} 天；等级 Lv.${levelOf(S.xp).i}
- 学习计划：每周 ${t.plan.days} 天、每天 ${t.plan.mins} 分钟；本周达标 ${tmWeek().met} 天
- 最近 7 天学习时长：${days.join("，")}
- 计时奖励：连续 15 分钟 ${t.cnt.c || 0} 次，碎片 15 分钟 ${t.cnt.f || 0} 次；最长一次连续 ${Math.floor(t.best / 60)} 分钟
- 已完成：精读 ${jingDone().length} 篇，短篇 ${shortDone().length} 篇；本周精读进度 ${S.cur.art && AMAP[S.cur.art] ? Math.round(progOf(S.cur.art) * 100) + "%" : "无"}
- 生词本：共 ${vs.length} 个，今天待复习 ${dueCards().length} 个；熟练度分布（0→5）：${boxes.join("/")}
- 反复点查但还不熟的词：${hard.join("，") || "无"}
- 收藏句子：${Object.keys(SEN).length} 句；跟读 ${S.stats.speak || 0} 次，听完全文 ${S.stats.listen || 0} 次
- 周考记录（最近）：${S.exams.slice(-5).map(e => e.sc + "/" + e.tot).join("，") || "无"}
- AI 理解测验（最近）：${quiz.join("，") || "无"}；写作批改（最近）：${wr.filter(Boolean).join("；") || "无"}；回译 ${S.stats.aibt || 0} 次`;
}
async function coachGo() {
  if (HUB.busy.coach) return; HUB.busy.coach = 1; HUB.coachErr = ""; render();
  try {
    const v = await aiJson(`你是英语学习教练。下面是一位学习者在「TED 精读」App 里的真实学习数据。${profLine()}
${coachData()}
请只根据这些数据做诊断，数据不足的地方直接说明，不要臆测。App 里可用的功能：本周精读、短篇学习、复习闪卡、单词/句子记忆库、周考、听力通读（现场原声）、口语跟读、AI 学伴（导读/问答/理解测验/复述批改）、回译练习、生词短文、学习计时与每周计划。
严格输出 JSON：{"headline":"一句话诊断（中文）","good":["做得好的地方（中文，引用数据）"],"weak":["需要改进的地方（中文，引用数据并说明原因）"],"plan":[{"when":"时间，如 每天 / 周一 / 本周内","task":"具体、可量化的任务","feature":"对应的 App 功能"}],"words":[{"w":"重点攻克的词","why":"原因或记忆方法（中文一句）"}],"confuse":[{"a":"易混词 A","b":"易混词 B","diff":"区别（中文一句）"}],"tip":"一个学习方法建议，并说明它为什么有效（中文）"}
数量：good 1–3 条，weak 1–3 条，plan 4–6 条，words 不超过 5 个（只能从上面的数据里选），confuse 0–3 组（只在生词里确有易混词时给出）。`, { temp: 0.4, maxTokens: 2500, big: true });
    if (!v || !v.headline) throw { code: "parse", message: "返回内容缺少诊断" };
    AIC.coach = { v, at: Date.now() }; putAI("coach");
  } catch (e) { HUB.coachErr = aiErr(e); }
  delete HUB.busy.coach; render(); const b = $("#coachbox"); if (b) b.scrollIntoView({ behavior: S.set.motion ? "smooth" : "auto", block: "start" });
}
function coachHTML(v) {
  if (!v) return "";
  const li = a => arr(a).map(x => `<li>${esc(x)}</li>`).join("");
  return `<div class="coach"><div class="gdgist">${esc(v.headline || "")}</div>
  <div class="coach2">${arr(v.good).length ? `<div class="cg"><h4>做得好</h4><ul>${li(v.good)}</ul></div>` : ""}${arr(v.weak).length ? `<div class="cw"><h4>要改进</h4><ul>${li(v.weak)}</ul></div>` : ""}</div>
  ${arr(v.plan).length ? `<div class="aisec"><h4>下一步计划</h4><div class="cplan">${arr(v.plan).map(p => `<div><span class="tag">${esc(p.when || "")}</span><span>${esc(p.task || "")}</span><span class="faint">${esc(p.feature || "")}</span></div>`).join("")}</div></div>` : ""}
  ${arr(v.words).length ? `<div class="aisec"><h4>重点攻克</h4>${arr(v.words).map(w => `<div class="aisyn"><b>${esc(w.w || "")}</b><span>${esc(w.why || "")}</span></div>`).join("")}</div>` : ""}
  ${arr(v.confuse).length ? `<div class="aisec"><h4>易混辨析</h4>${arr(v.confuse).map(c => `<div class="aisyn"><b>${esc(c.a || "")} / ${esc(c.b || "")}</b><span>${esc(c.diff || "")}</span></div>`).join("")}</div>` : ""}
  ${v.tip ? `<div class="aictx" style="margin-top:10px"><span class="tag">方法</span>${esc(v.tip)}</div>` : ""}</div>`;
}
async function flashEx() {
  if (!FL || !aiOK()) return; const v = FL.list[FL.i], L = lx(v.k), box = $("#flex"); if (!box) return;
  box.innerHTML = `<div class="aiload" style="margin:6px 0">${I.spark}<span>正在造一个新语境…</span></div>`;
  try {
    const r = await aiJson(`为英文单词 "${L.w}"（${(L.tr[0] || "").slice(0, 30)}）造 1 个全新的、自然地道的英文例句，场景随机，长度 12–25 词，难度适合学习者。${profLine()}严格输出 JSON：{"en":"例句","zh":"整句中文翻译"}`, { temp: 0.95, maxTokens: 300 });
    if (!r || !r.en) throw { code: "parse", message: "没有返回例句" };
    if (FL && FL.list[FL.i] === v) box.innerHTML = `<div class="ex flexex"><div class="en">${aiHl(r.en, L.w)} <button class="say mini" data-act="say" data-text="${esc(r.en)}" aria-label="朗读">${I.vol}</button></div><div class="zh">${esc(r.zh || "")}</div></div>`;
  } catch (e) { if (box.isConnected) box.innerHTML = `<div class="ai muted">${esc(aiErr(e))}</div>`; }
}

/* ===== 6. views touched by v1.8 ===== */
function vReview() {
  const due = dueCards().length;
  const tab = REVIEW_TAB;
  return `<div class="seg wide" role="tablist" style="margin-bottom:14px"><button data-act="rtab" data-x="mem" class="${tab === "mem" ? "on" : ""}">记忆库 <span class="num faint">${Object.keys(VOC).length}</span>${due ? `<i class="tbdot num" style="position:static;margin-left:4px">${due}</i>` : ""}</button><button data-act="rtab" data-x="ai" class="${tab === "ai" ? "on" : ""}">${I.spark}AI 复习</button><button data-act="rtab" data-x="exam" class="${tab === "exam" ? "on" : ""}">考试</button></div>${tab === "mem" ? vMem() : tab === "ai" ? vAIRev() : vExam()}`;
}

function aiProfPrefs() { return `<div class="setrow col" id="s-aiprof"><div class="l"><b>AI 学习档案</b><span>所有 AI 功能都会按这里的水平和偏好来讲解、出题、造句</span></div>${aiProfHTML()}</div>`; }
function tmPrefs() { const t = tmS(); return `<div class="setrow" id="s-plan"><div class="l"><b>学习计划</b><span>每周 ${t.plan.days} 天 · 每天 ${t.plan.mins} 分钟 · 点顶栏的计时按钮可修改并领取奖励</span></div><button class="btn sm ghost" data-act="timer">${I.timer}打开计时</button></div>`; }

/* v1.8 extra click actions (called from the main switch's default) */
function act18(act, ds, t, e) {
  switch (act) {
    case "timer": closeMenus(); closeSheet(); tmOpen(); return true;
    case "tmclaim": tmClaim(); return true;
    case "tmdays": tmS().plan.days = +ds.n; tmCheckGoals(tmS()); save(); $$("[data-act=tmdays]").forEach(b => b.classList.toggle("on", b === t)); TM.live = ""; tmPaint(); const wk = $("#tmwk"); if (wk) wk.innerHTML = tmWeekHTML(); return true;
    case "tmmins": tmS().plan.mins = +ds.n; tmCheckGoals(tmS()); save(); $$("[data-act=tmmins]").forEach(b => b.classList.toggle("on", b === t)); TM.live = ""; tmPaint(); { const w2 = $("#tmwk"); if (w2) w2.innerHTML = tmWeekHTML(); } return true;
    case "tmpause": { const s = tmS(); s.pause = !s.pause; save(); tmTick(); tmDraw(); toast(s.pause ? "计时已暂停" : "计时继续"); return true; }
    case "hub": closeSheet(); hubOpen(ds.id || READ_ID); return true;
    case "hubask": closeSheet(); hubOpen(ds.a, { tab: "chat", focus: { s: +ds.s, m: ds.m || "" }, mi: ds.m === "t" && hasTR(ds.a) ? TX(ds.a).modOf[+ds.s] + 1 : undefined }); return true;
    case "hubtab": HUB.tab = ds.k; hubDraw(); return true;
    case "hubprof": { const p = $("#hubprof"); if (!p) return true; p.hidden = !p.hidden; if (!p.hidden) p.innerHTML = aiProfHTML(); return true; }
    case "hubguide": if (ds.redo) { const r = AIC[guideId(HUB.aid)]; if (r) delete r.v; } hubGuide(); return true;
    case "hubgo": { const aid = HUB.aid, i = +ds.i; closeModal(true); if (READ_ID !== aid || VIEW !== "read") { READ_ID = aid; S.rmod = S.rmod || {}; S.rmod[aid] = i; go("read"); } else setMod(aid, i); return true; }
    case "hubanswer": { const g = (AIC[guideId(HUB.aid)] || {}).v; HUB.tab = "write"; HUB.wtask = "answer"; HUB.wq = g && g.qs && g.qs[+ds.i] ? g.qs[+ds.i].en : ""; hubDraw(); return true; }
    case "chatsend": { const ta = $("#chatta"); if (ta) chatSend(ta.value); return true; }
    case "chatchip": { const c = hubChips()[+ds.i]; if (c) chatSend(hubFill(c[1]), c[0]); return true; }
    case "chatstop": if (HUB.ctrl) HUB.ctrl.abort(); return true;
    case "chatclear": if (HUB.busy.chat) return true; AIC[chatId(HUB.aid)] = { msgs: [], at: Date.now() }; putAI(chatId(HUB.aid)); drawChat(); return true;
    case "chatunfocus": HUB.focus = null; drawChat(); return true;
    case "chatcopy": { const m = hubChat().msgs[+ds.i]; if (m) { try { navigator.clipboard.writeText(m.content).then(() => toast("已复制"), () => toast("复制失败")); } catch (er) { toast("复制失败"); } } return true; }
    case "quizgen": quizGen(); return true;
    case "quizlv": HUB.qhard = ds.k === "1"; drawHubQuiz(); return true;
    case "wtask": { const ta = $("#wta"); if (ta) HUB.draft.write = ta.value; HUB.wtask = ds.k; HUB.werr = ""; drawWrite(); return true; }
    case "wq": { const g = (AIC[guideId(HUB.aid)] || {}).v; const ta = $("#wta"); if (ta) HUB.draft.write = ta.value; HUB.wq = g && g.qs[+ds.i] ? g.qs[+ds.i].en : ""; drawWrite(); return true; }
    case "wsubmit": writeSubmit(); return true;
    case "bt": btOpen(ds.a, +ds.s, ds.m); return true;
    case "btsubmit": btSubmit(); return true;
    case "btpeek": { const ta = $("#btta"); BT.text = ta ? ta.value : ""; BT.res = { score: 0, verdict: "看了原句，本题不计分。对照着再默写一遍会记得更牢。", learn: [] }; btDraw(); return true; }
    case "btretry": BT.res = null; BT.text = ""; btDraw(); setTimeout(() => { const ta = $("#btta"); if (ta) ta.focus(); }, 30); return true;
    case "btnext": if (BT.next != null) btOpen(BT.aid, BT.next, BT.m); return true;
    case "aplv": { aiProfSave(); const q = aiProf(); q.lv = ds.k; LS.set("aiprof", q); $$("[data-act=aplv]").forEach(b => b.classList.toggle("on", b === t)); return true; }
    case "aplang": { aiProfSave(); const q = aiProf(); q.lang = ds.k; LS.set("aiprof", q); $$("[data-act=aplang]").forEach(b => b.classList.toggle("on", b === t)); return true; }
    case "apsave": aiProfSave(); { const m = $("#apmsg"); if (m) m.textContent = "已保存"; } toast("学习档案已保存"); if ($("#hubbody") && HUB.tab === "chat") drawChat(); return true;
    case "stygen": STY.genre = ds.k; render(); return true;
    case "styn": STY.n = +ds.n; storyPick(); render(); return true;
    case "styshuf": storyPick(true); render(); return true;
    case "stygo": storyGo(); return true;
    case "styopen": storyOpen(); return true;
    case "stytoggle": { const s = $("#story"); if (s) s.classList.toggle("nozh"); return true; }
    case "coachgo": coachGo(); return true;
    case "flex": flashEx(); return true;
    case "airev": closeMenus(); REVIEW_TAB = "ai"; if (VIEW === "review") render(); else go("review"); return true;
  }
  return false;
}

document.addEventListener("change", e => {
  if (e.target.id === "hubscope") { const ta = $("#chatta"), wa = $("#wta"); if (ta) HUB.draft.chat = ta.value; if (wa) HUB.draft.write = wa.value; HUB.mi = +e.target.value; hubDraw(); }
});
document.addEventListener("input", e => {
  const id = e.target.id;
  if (id === "chatta") { HUB.draft.chat = e.target.value; e.target.style.height = "auto"; e.target.style.height = Math.min(140, e.target.scrollHeight) + "px"; }
  else if (id === "wta") { HUB.draft.write = e.target.value; const c = $("#wcount"); if (c) c.textContent = e.target.value.trim().split(/\s+/).filter(Boolean).length + " 词"; }
  else if (id === "wqin") HUB.wq = e.target.value;
  else if (id === "btta") BT.text = e.target.value;
});
document.addEventListener("keydown", e => {
  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) { if (e.target.id === "chatta") { e.preventDefault(); chatSend(e.target.value); } else if (e.target.id === "wta") { e.preventDefault(); writeSubmit(); } else if (e.target.id === "btta") { e.preventDefault(); btSubmit(); } }
  else if (e.key === "Enter" && !e.shiftKey && e.target.id === "chatta" && document.documentElement.dataset.mode === "L" && !e.isComposing) { e.preventDefault(); chatSend(e.target.value); }
});

/* ---------- v1.8.1: robust LLM calls (DeepSeek thinking mode, JSON mode, repair, retry) ---------- */




/* tolerant JSON: strips think-tags/fences/prose, escapes stray quotes and raw newlines, closes truncated output */








/* ---------- v1.8.1: robust LLM calls (DeepSeek thinking mode, JSON mode, repair, retry) ---------- */
const AI_RT = { noRF: {}, noTh: {}, last: null };
function aiExtra(c, json) {
  const b = (c.base || "").toLowerCase(), x = {};
  if (!c.think && !AI_RT.noTh[b]) {
    if (/deepseek\.com/.test(b) || /bigmodel\.cn|open\.z\.ai|api\.z\.ai/.test(b)) x.thinking = { type: "disabled" };
    else if (/dashscope|aliyuncs/.test(b)) x.enable_thinking = false;
  }
  if (json && !AI_RT.noRF[b]) x.response_format = { type: "json_object" };
  return x;
}
function makeAI() {
  const c = aiCfg(); if (!c.key) return null;
  const fmt = (AI_PRESETS[c.prov] || AI_PRESETS.custom)[1];
  const base = (c.base || "").replace(/\/+$/, ""), bk = base.toLowerCase();
  const budget = (o) => { let n = o.maxTokens || 1500; if (o.json) n = Math.max(1500, Math.round(n * 1.6)); n = Math.min(8192, n); if (c.think) n = Math.min(32000, n + 8000); return n; };
  const req = async (msgs, o, stream, extra) => {
    const m = msgs.map(x => ({ role: x.role, content: x.content })), maxT = budget(o);
    const temp = o.temp != null ? o.temp : 0.3;
    try {
      if (fmt === "anthropic") return await fetch(base + "/v1/messages", { method: "POST", signal: o.signal, headers: { "content-type": "application/json", "x-api-key": c.key, "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-access": "true" }, body: JSON.stringify(Object.assign({ model: c.model, max_tokens: maxT, temperature: temp, messages: m }, o.system ? { system: o.system } : {}, stream ? { stream: true } : {})) });
      return await fetch(base + "/chat/completions", { method: "POST", signal: o.signal, headers: { "content-type": "application/json", "authorization": "Bearer " + c.key }, body: JSON.stringify(Object.assign({ model: c.model, temperature: temp, max_tokens: maxT, messages: (o.system ? [{ role: "system", content: o.system }] : []).concat(m) }, extra, stream ? { stream: true } : {})) });
    } catch (e) { if (e && e.name === "AbortError") throw { code: "abort", message: "已停止" }; throw { code: "network", message: "网络不通或服务商不允许浏览器直连" }; }
  };
  /* send; if the provider rejects our optional params (JSON mode / thinking switch), remember that and retry without them */
  const post = async (msgs, o, stream) => {
    let extra = fmt === "openai" ? aiExtra(c, !!o.json) : {};
    for (let i = 0; i < 3; i++) {
      const r = await req(msgs, o, stream, extra);
      if (r.ok || ![400, 422].includes(r.status) || !Object.keys(extra).length) return r;
      let msg = ""; try { msg = JSON.stringify(await r.clone().json()).toLowerCase(); } catch (e) {}
      const hasTh = "thinking" in extra || "enable_thinking" in extra;
      if (hasTh && /thinking/.test(msg)) { AI_RT.noTh[bk] = 1; delete extra.thinking; delete extra.enable_thinking; continue; }
      if (extra.response_format) { AI_RT.noRF[bk] = 1; delete extra.response_format; continue; }
      if (hasTh) { AI_RT.noTh[bk] = 1; delete extra.thinking; delete extra.enable_thinking; continue; }
      return r;
    }
    return req(msgs, o, stream, {});
  };
  const fail = async r => { let m = ""; try { const x = await r.json(); m = (x.error && (x.error.message || x.error.type)) || x.message || ""; } catch (e) {} throw { code: "http", message: "HTTP " + r.status + (r.status === 401 ? "：密钥无效" : r.status === 402 ? "：账户余额不足" : r.status === 429 ? "：请求太频繁或额度用完" : "") + (m ? "（" + String(m).slice(0, 80) + "）" : "") }; };
  const pick = j => {
    if (fmt === "anthropic") return { text: (j.content || []).filter(x => x.type === "text").map(x => x.text || "").join(""), finish: j.stop_reason === "max_tokens" ? "length" : j.stop_reason };
    const ch = (j.choices || [])[0] || {}, msg = ch.message || {};
    return { text: msg.content || "", finish: ch.finish_reason, thought: !!msg.reasoning_content };
  };
  const run = async (input, o = {}) => {
    const msgs = typeof input === "string" ? [{ role: "user", content: input }] : input;
    if (o.onText) {
      const r = await post(msgs, o, true); if (!r.ok) await fail(r);
      const ct = r.headers.get("content-type") || "";
      if (!r.body || !r.body.getReader || /application\/json/.test(ct)) { const p = pick(await r.json()); o.onText({ text: p.text, delta: p.text }); return p; }
      const rd = r.body.getReader(), dec = new TextDecoder(); let buf = "", text = "", finish = "";
      try {
        for (;;) {
          const { value, done } = await rd.read(); if (done) break;
          buf += dec.decode(value, { stream: true }); let i;
          while ((i = buf.indexOf("\n")) >= 0) {
            const line = buf.slice(0, i).trim(); buf = buf.slice(i + 1);
            if (!line.startsWith("data:")) continue; const d = line.slice(5).trim(); if (!d || d === "[DONE]") continue;
            let dl = "";
            try {
              const j = JSON.parse(d);
              if (fmt === "anthropic") { if (j.type === "content_block_delta" && j.delta && j.delta.type !== "thinking_delta") dl = j.delta.text || ""; }
              else { const ch = (j.choices || [])[0] || {}; dl = (ch.delta || {}).content || ""; if (ch.finish_reason) finish = ch.finish_reason; }
            } catch (e) {}
            if (dl) { text += dl; o.onText({ text, delta: dl }); }
          }
        }
      } catch (e) { if (e && e.name === "AbortError") throw { code: "abort", message: "已停止", text }; throw { code: "network", message: "连接中断", text }; }
      return { text, finish };
    }
    const r = await post(msgs, o, false); if (!r.ok) await fail(r);
    let j; try { j = await r.json(); } catch (e) { throw { code: "http", message: "服务商返回的不是标准格式，请检查接口地址" }; }
    return pick(j);
  };
  const f = (input, o) => run(input, o || {});
  f.json = async (prompt, o = {}) => {
    let err = null, partial = null, mt = o.maxTokens || 1500;
    for (let i = 0; i < 2; i++) {
      const r = await run(prompt + "\n只输出一个 JSON 对象本身：不要代码块标记，不要任何解释；字符串里如需引号请用中文引号「」或转义 \\\"。", Object.assign({}, o, { json: true, maxTokens: mt }));
      AI_RT.last = { at: Date.now(), finish: r.finish, len: (r.text || "").length, head: String(r.text || "").slice(0, 300) };
      if (r.finish === "length" && i === 0) { try { partial = parseAIJson(r.text); } catch (e) {} mt = Math.min(8192, mt * 2); continue; }
      try { return parseAIJson(r.text); }
      catch (e) {
        const empty = !String(r.text || "").trim();
        err = { code: "parse", message: r.finish === "length" ? "输出太长被截断" : empty ? (r.thought ? "模型把额度都用在了深度思考上，没有给出正文" : "模型返回了空内容") : "返回内容不是有效 JSON" };
        try { console.warn("[AI] JSON parse failed", r.finish, r.text); } catch (x) {}
        if (r.finish === "length" || empty) mt = Math.min(8192, mt * 2);
      }
    }
    if (partial) return partial;
    throw err;
  };
  f.text = async (prompt, o) => (await run(prompt, o || {})).text;
  return f;
}

/* tolerant JSON: strips think-tags/fences/prose, escapes stray quotes and raw newlines, closes truncated output */
function jsonRepair(s) {
  let out = "", inS = false, bs = false; const st = [];
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (inS) {
      if (bs) { out += ch; bs = false; continue; }
      if (ch === "\\") { out += ch; bs = true; continue; }
      if (ch === "\n") { out += "\\n"; continue; }
      if (ch === "\r") continue;
      if (ch === "\t") { out += "\\t"; continue; }
      if (ch === '"') {
        let j = i + 1; while (j < s.length && /\s/.test(s[j])) j++;
        const nx = s[j];
        if (j >= s.length || nx === "," || nx === ":" || nx === "}" || nx === "]") { inS = false; out += ch; }
        else out += '\\"';
        continue;
      }
      out += ch; continue;
    }
    if (ch === '"') { inS = true; out += ch; continue; }
    if (ch === "{") st.push("}"); else if (ch === "[") st.push("]");
    else if (ch === "}" || ch === "]") st.pop();
    out += ch;
  }
  if (bs) out = out.slice(0, -1);
  if (inS) out += '"';
  out = out.replace(/\s+$/, "").replace(/,$/, "").replace(/:$/, ':""').replace(/,\s*"[^"]*"$/, "");
  while (st.length) out += st.pop();
  return out.replace(/,\s*([}\]])/g, "$1");
}
function jsonSpan(t, a) {
  let d = 0, inS = false, bs = false;
  for (let i = a; i < t.length; i++) {
    const ch = t[i];
    if (inS) { if (bs) bs = false; else if (ch === "\\") bs = true; else if (ch === '"') inS = false; continue; }
    if (ch === '"') inS = true; else if (ch === "{") d++; else if (ch === "}") { d--; if (!d) return t.slice(a, i + 1); }
  }
  return t.slice(a);
}
function parseAIJson(t) {
  t = String(t || "").replace(/<think>[\s\S]*?<\/think>/gi, "").replace(/^[\s\S]*?<\/think>/i, "").replace(/```(?:json)?/gi, "").trim();
  const ok = v => v && typeof v === "object" && !Array.isArray(v) && Object.keys(v).length;
  const tries = [];
  const a0 = t.indexOf("{"), b0 = t.lastIndexOf("}");
  if (a0 >= 0) tries.push(b0 > a0 ? t.slice(a0, b0 + 1) : t.slice(a0));
  let n = 0; for (let i = t.indexOf("{"); i >= 0 && n < 25; i = t.indexOf("{", i + 1), n++) tries.push(jsonSpan(t, i));
  const fixes = [x => x, x => x.replace(/,\s*([}\]])/g, "$1"), jsonRepair, x => jsonRepair(x.replace(/[“”]/g, '"'))];
  for (const s of tries) for (const f of fixes) { try { const v = JSON.parse(f(s)); if (ok(v)) return v; } catch (e) {} }
  throw { code: "parse", message: "返回内容不是有效 JSON" };
}

function aiPrefs() {
  const c = aiCfg();
  return `<div class="setrow col" id="s-ai"><div class="l"><b>AI 解析服务（可选）</b><span>AI 例句、整句解析、AI 学伴、AI 复习都需要你自己的 API 密钥。密钥只保存在本设备，不会写入备份文件。部分服务商不允许浏览器直连，可点「测试」确认。</span></div>
  <div class="aigrid"><label>服务商<select id="aiprov">${Object.entries(AI_PRESETS).map(([k, p]) => `<option value="${k}" ${c.prov === k ? "selected" : ""}>${p[0]}</option>`).join("")}</select></label>
  <label>接口地址<input type="text" id="aibase" class="txt" value="${esc(c.base)}" placeholder="https://…" autocomplete="off" spellcheck="false"></label>
  <label>模型<input type="text" id="aimodel" class="txt" value="${esc(c.model)}" autocomplete="off" spellcheck="false"></label>
  <label>API 密钥<input type="password" id="aikey" class="txt" value="${esc(c.key)}" placeholder="sk-…" autocomplete="off"></label></div>
  <label class="aithink"><input type="checkbox" id="aithink" ${c.think ? "checked" : ""}><span><b>允许深度思考</b>　默认关闭。DeepSeek、通义、智谱等模型的思考模式更慢、更耗额度，而且思考过程会占用输出长度；关闭后 App 会请求直接作答。</span></label>
  <div class="row"><button class="btn sm" data-act="aisave">保存</button><button class="btn sm ghost" data-act="aitest">测试</button>${c.key ? '<button class="btn sm warn" data-act="aiclear">清除密钥</button>' : ""}<span id="aimsg" class="muted" style="font-size:12.5px"></span></div></div>`;
}
function readAiForm() { const th = $("#aithink"); return { prov: $("#aiprov").value, base: $("#aibase").value.trim(), model: $("#aimodel").value.trim(), key: $("#aikey").value.trim(), think: !!(th && th.checked) }; }
async function aiTest() {
  const c = readAiForm(), msg = $("#aimsg"); if (!c.key) { msg.textContent = "请先填写密钥"; return; }
  LS.set("aicfg", c); Cloud.sample = makeAI(); AI_RT.noRF = {}; AI_RT.noTh = {};
  msg.textContent = "测试中（按真实用法造一个例句并做语法分析）…"; const t0 = Date.now();
  try {
    const r = await Cloud.sample.json(`你是资深英语老师。为单词 "flourish" 造 1 个自然地道的英文例句，给出整句中文翻译，并用中文简要分析句子语法（主干、从句、短语）。严格输出 JSON：{"en":"英文例句","zh":"整句中文翻译","gram":"语法分析（中文）"}`, { temp: 0.7, maxTokens: 400 });
    if (!r || !r.en || !r.zh) throw { code: "parse", message: "返回 JSON 缺少字段" };
    const b = (c.base || "").toLowerCase(), notes = [];
    notes.push(AI_RT.noRF[b] ? "该服务商不支持 JSON 模式，已用容错解析" : "JSON 模式已启用");
    if (/deepseek\.com|dashscope|aliyuncs|bigmodel\.cn|z\.ai/.test(b)) notes.push(c.think ? "深度思考：开启" : AI_RT.noTh[b] ? "该模型无法关闭思考" : "深度思考：已关闭");
    msg.textContent = `连接成功，耗时 ${((Date.now() - t0) / 1000).toFixed(1)} 秒（${notes.join("，")}）。例句：${r.en}`;
  } catch (e) {
    msg.textContent = aiErr(e) + (AI_RT.last && AI_RT.last.head ? "　原始返回开头：" + AI_RT.last.head.slice(0, 120) : "");
  }
}

/* ---------- events ---------- */
let resetArmed = false;
document.addEventListener("click", e => {
  const t = e.target.closest("[data-act]");
  if (!t) { if (!e.target.closest(".menu")) closeMenus(); onWordClick(e); return; }
  const act = t.dataset.act, ds = t.dataset;
  if (!t.closest(".menu") && act !== "more") closeMenus();
  switch (act) {
    case "go": closeModal(true); closeSheet(); go(ds.v, ds.a); break;
    case "sub": closeMenus(); if (VIEW !== ds.v) go(ds.v, ds.a); else doSub(ds.v, ds.a); break;
    case "toc": tocMenu(t); break;
    case "more": case "screen": moreMenu(t); break;
    case "back": navBack(); break;
    case "rtab": REVIEW_TAB = ds.x; render(); break;
    case "jingopen": jingOpen(ds.id); break;
    case "setpush": case "setpushhere": { const old = S.cur.art; setPush(ds.id, !!(old && !isDone(old) && old !== ds.id)); closeModal(true); toast("已设为本周精读"); if (act === "setpushhere") render(); else openRead(ds.id); break; }
    case "nextpick": { if (S.nextPick === ds.id && !ds.close) { S.nextPick = null; toast("已取消下周推送"); } else { S.nextPick = ds.id; toast("下周推送：《" + ITEMS[ds.id].title + "》"); } save(); if (ds.close) closeModal(true); render(); break; }
    case "abandonto": { const old = S.cur.art; setPush(ds.id, true); closeModal(true); toast(old && AMAP[old] ? "已放弃《" + AMAP[old].title + "》，进度已保留" : "已设为本周精读"); openRead(ds.id); break; }
    case "roll-imp": resolveRoll("imp"); break;
    case "itemdel": if (t.dataset.armed) { const id = ds.id; itemDelete(id); toast("已删除"); go("jing"); } else { t.dataset.armed = 1; t.textContent = "再点一次确认删除（进度和音频一起删除）"; } break;
    case "imprec": importSheet(ds.id); break;
    case "impmode": { const nm = ds.keepaud ? ds.x : IMP.mode === ds.x ? null : ds.x; if (ds.keepaud) { IMP.mode = nm; IMP.audioOnly = false; } else if (!IMP.titleLocked) impReset({ mode: nm }); else IMP.mode = nm; } render(); if (IMP.mode === "paste") setTimeout(() => { const ta = $("#imptext"); if (ta) ta.scrollIntoView({ block: "center" }); }, 40); break;
    case "impparse": impFromPaste(); break;
    case "alnstart": { const id = ds.id; if (ds.redo && TR[id]) { delete TR[id].align; delete TR[id].fix; delete TXC[id]; saveTR(); if (AUD.aid === id) computeStarts(id); } alnQueue(id, true); break; }
    case "alncancel": alnCancel(); break;
    case "alnall": Object.keys(ITEMS).filter(id => alnStatus(id) === "todo").forEach(id => alnQueue(id)); break;
    case "impclear": impReset(); render(); window.scrollTo(0, 0); break;
    case "improle": impSetRole(+ds.i, ds.r); break;
    case "audtoitem": { const f = IMP.audio, id = ds.id; if (!f || !ITEMS[id]) break; impReset(); importAudio(id, f).then(() => openRead(id)); break; }
    case "impcat": IMP.cat = ds.c; { const ti = $("#imptitle"), sr = $("#impsrc"); if (ti) IMP.title = ti.value; if (sr) IMP.src = sr.value; } $$("[data-act=impcat]").forEach(b => b.classList.toggle("on", b.dataset.c === ds.c)); break;
    case "impzhpaste": { const ti = $("#imptitle"), sr = $("#impsrc"); if (ti) IMP.title = ti.value; if (sr) IMP.src = sr.value; IMP.zhPasting = !IMP.zhPasting; render(); setTimeout(() => { const z = $("#impzhtext"); if (z) { z.scrollIntoView({ block: "center" }); } }, 40); break; }
    case "impzhok": { const z = $("#impzhtext"); if (z && z.value.trim()) impZh(z.value); break; }
    case "impzhclear": IMP.zhRaw = ""; IMP.paras.forEach(p => { if (!p._zhInline) p.zh = ""; }); IMP.zhMode = IMP._zhInline ? "inline" : "none"; render(); break;
    case "impaudioclear": IMP.audio = null; IMP.warn = ""; render(); break;
    case "impsave": { const ti = $("#imptitle"), sr = $("#impsrc"); if (ti) IMP.title = ti.value; if (sr) IMP.src = sr.value; t.disabled = true; impSave(ds.push === "1"); break; }
    case "setscreen": LS.set("screen", ds.m); closeMenus(); screenMode(); render(); break;
    case "read": openRead(ds.id); break;
    case "listen": listenArticle(ds.id); break;
    case "close": closeModal(); break;
    case "closesheet": closeSheet(); break;
    case "roll-ext": resolveRoll("ext"); break;
    case "roll-new": resolveRoll("new"); break;
    case "topic": S.nextTopic = S.nextTopic === ds.c ? null : ds.c; save(); render(); toast(S.nextTopic ? "下周主题：" + S.nextTopic : "已取消选择"); break;
    case "cat": LIB_CAT = ds.c; render(); break;
    case "libopen": libOpen(ds.id); break;
    case "abandon": { const old = S.cur.art; if (!S.abandoned.includes(old)) S.abandoned.push(old); S.cur.art = ds.id; S.cur.bonus = false; S.abandoned = S.abandoned.filter(x => x !== ds.id); save(); closeModal(); toast("已放弃《" + AMAP[old].titleZh + "》，进度已保留"); openRead(ds.id); break; }
    case "bonus": S.cur.art = ds.id; S.cur.bonus = true; save(); closeModal(); openRead(ds.id); break;
    case "rmode": READ_MODE = ds.m; setReadMode(); if (READ_MODE === "zh") afterRead(); break;
    case "fs": S.set.fs = Math.max(14, Math.min(26, S.set.fs + +ds.d)); applySettings(); save(); break;
    case "say": say(ds.text, ds.acc || S.set.voice); break;
    case "finish": finishQuiz(); break;
    case "aiword": aiWord(ds.k, ds.a, +ds.s, ds.m); break;
    case "aideep": aiDeepOpen(ds.k, ds.a, +ds.s, ds.m); break;
    case "aiexmore": if (DEEP.key) loadDeepEx(DEEP.key); break;
    case "aideepretry": if (DEEP.key) loadDeepCore(DEEP.key); break;
    case "aisent": aiSent(ds.a, +ds.s, ds.m); break;
    case "qopt": QZ.ans[+ds.qi] = +ds.j; $$("input[data-qi]").forEach(i => QZ.ans[+i.dataset.qi] = i.value); { const sc = $(".modal").scrollTop; drawQuiz(); $(".modal").scrollTop = sc; } break;
    case "qsubmit": { const sc = 0; submitQuiz(); const m = $(".modal"); if (m) m.scrollTop = sc; break; }
    case "exam": closeModal(true); startExam(ds.n === "prac" ? "prac" : ds.n === "final" ? "final" : "week", +ds.n); break;
    case "memword": openWordFromMem(ds.k); break;
    case "memsent": (async () => { if (ds.m === "t") { try { await ensureFull(); } catch (e) {} } sheet(`<div class="t"><b>整句解析</b><div class="faint" style="font-size:12px">${esc(AMAP[ds.a].titleZh)}${ds.m === "t" ? " · 精读全文" : ""}</div></div>`, sentHTML(ds.a, +ds.s, ds.m), { kind: "drawer" }); })(); break;
    case "msort": MEMSORT = ds.m; render(); break;
    case "flash": startFlash(); break;
    case "flip": if (e.target.closest("[data-act=say]")) break; FL.flip = !FL.flip; drawFlash(); break;
    case "fl": rateFlash(+ds.r); break;
    default: act18(act, ds, t, e); break;
    case "pplay": if (PR_SRC === "t" && hasTR(PR_ID) && TR[PR_ID].audio) { if (AUD.el && !AUD.el.paused && AUD.aid === PR_ID) { AUD.el.pause(); t.innerHTML = I.play; } else { playAt(PR_ID, Math.max(0, AUD.aid === PR_ID ? AUD.last : 0)); t.innerHTML = I.pause; } break; } if (PLAY) stopSpeak(); else playFrom(0); break;
    case "pstop": stopSpeak(); $$(".pl").forEach(b => b.classList.remove("on")); break;
    case "pfrom": stopSpeak(); playFrom(+ds.i); break;
    case "acc": S.set.voice = ds.a; save(); $$("[data-act=acc]").forEach(b => b.classList.toggle("on", b.dataset.a === ds.a)); { const n = $("#vname"); if (n) { const v = pickVoice(ds.a); n.textContent = v ? "当前语音：" + v.name + "（" + v.lang + "）" : "设备上没有该口音的语音，将使用默认英语语音"; } } break;
    case "sprev": case "snext": { const n = prList().length; if (SCOPE === "p") { const [x, y] = spRange(); PR_SI = act === "snext" ? Math.min(n - 1, y + 1) : Math.max(0, x - 1); if (act === "sprev") { PR_SI = spRange()[0]; } } else PR_SI = Math.max(0, Math.min(n - 1, PR_SI + (act === "snext" ? 1 : -1))); $("#sidx").textContent = `第 ${PR_SI + 1}/${n} 句`; $("#starget").textContent = speakTarget(); $("#sresult").innerHTML = ""; break; }
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
    case "aitest": aiTest(); break;
    case "readmod": S.rmod = S.rmod || {}; S.rmod[ds.id] = +ds.i; openRead(ds.id); break;
    case "homeaudio": READ_ID = S.cur.art; audioPanel(S.cur.art); break;
    case "import": closeModal(true); importSheet(ds.id || READ_ID); break;
    case "doimport": doImport(ds.id); break;
    case "paste": { const ta = $("#" + ds.to); if (navigator.clipboard && navigator.clipboard.readText) navigator.clipboard.readText().then(x => { ta.value = x; }).catch(() => { ta.focus(); toast("请长按输入框选择「粘贴」"); }); else { ta.focus(); toast("请长按输入框选择「粘贴」"); } break; }
    case "trdel": if (t.dataset.armed) { delete TR[ds.id]; delete TXC[ds.id]; saveTR(); idbDel(ds.id); if (AUD.aid === ds.id) audioUnload(); closeSheet(); render(); toast("已删除导入的全文"); } else { t.dataset.armed = 1; t.textContent = "再点一次确认删除"; } break;
    case "startfull": closeModal(); if (ds.id !== READ_ID || VIEW !== "read") openRead(ds.id); else setMod(ds.id, 1); break;
    case "mod": setMod(READ_ID, +ds.i); break;
    case "playmod": case "playpara": closeSheet(); if (TR[READ_ID] && TR[READ_ID].audio) playAt(READ_ID, +ds.g); else audioPanel(READ_ID); break;
    case "audiopanel": closeSheet(); audioPanel(VIEW === "practice" ? PR_ID : READ_ID); break;
    case "audiodel": if (t.dataset.armed) { closeSheet(); removeAudio(ds.id); toast("音频已删除"); } else { t.dataset.armed = 1; t.textContent = "再点一次确认"; } break;
    case "embed": { const box = $("#embedbox"); if (box) box.innerHTML = `<div class="embed"><iframe src="https://embed.ted.com/talks/${encodeURIComponent(ds.slug)}" allow="autoplay; fullscreen; encrypted-media" allowfullscreen loading="lazy" title="TED 官方播放器"></iframe></div>`; break; }
    case "segplay": playAt(READ_ID || PR_ID, +ds.g, { seg: true }); break;
    case "loopsent": { const id = READ_ID; playAt(id, +ds.g); AUD.loop = +ds.g; drawBar(); toast("单句循环中，点播放条上的「单句循环」取消"); break; }
    case "calib": calibrateHere(READ_ID, +ds.g); break;
    case "ab-play": if (AUD.el) { if (AUD.el.paused) AUD.el.play().catch(() => {}); else AUD.el.pause(); } break;
    case "ab-seek": if (AUD.el) { AUD.el.currentTime = Math.max(0, AUD.el.currentTime + +ds.d); tick(); } break;
    case "ab-rate": { const R2 = [0.75, 0.85, 1, 1.15, 1.25]; AUD.rate = R2[(R2.indexOf(AUD.rate) + 1) % R2.length]; if (AUD.el) AUD.el.playbackRate = AUD.rate; drawBar(); break; }
    case "ab-loop": AUD.loop = AUD.loop != null ? null : Math.max(0, AUD.last); drawBar(); break;
    case "ab-follow": AUD.follow = !AUD.follow; drawBar(); break;
    case "ab-close": if (AUD.el) AUD.el.pause(); AUD.bar = false; AUD.loop = null; drawBar(); break;
    case "prsrc": PR_SRC = ds.x; PR_SI = 0; stopSpeak(); render(); break;
    case "reset1": if (!resetArmed) { resetArmed = true; t.textContent = "再点一次确认"; setTimeout(() => { resetArmed = false; if (t.isConnected) t.textContent = "重置"; }, 3000); } else { const set = S.set; S = freshState(); S.set = set; VOC = {}; SEN = {}; AIC = {}; LS.set("voc", VOC); LS.set("sen", SEN); LS.set("ai", AIC); save(); if (Cloud.db) toast("已重置（云端旧单词记录会在下次覆盖）"); resetArmed = false; go("home"); } break;
  }
});
document.addEventListener("pointerdown", onWordDown); document.addEventListener("pointerup", onWordUp); document.addEventListener("pointercancel", onWordUp);
document.addEventListener("contextmenu", e => { if (e.target.closest(".w")) e.preventDefault(); });
document.addEventListener("change", e => {
  if (e.target.id === "impfile") { const fs = Array.from(e.target.files); e.target.value = ""; if (fs.length) impFromFiles(fs); return; }
  if (e.target.id === "imptextfor") { const fs = Array.from(e.target.files); e.target.value = ""; if (fs.length) impFromFiles(IMP.audio ? fs.concat([IMP.audio]) : fs); return; }
  if (e.target.id === "impzhfile") { const f = e.target.files[0]; e.target.value = ""; if (!f) return; const ti = $("#imptitle"), sr = $("#impsrc"); if (ti) IMP.title = ti.value; if (sr) IMP.src = sr.value; extractFile(f).then(r => impZh(r.text)).catch(err => toast(err.message || "无法读取")); return; }
  if (e.target.id === "impaudio") { (IMP.files || []).forEach(o => { if (o.role === "audio") o.role = "none"; }); }
  if (e.target.id === "impaudio") { const f = e.target.files[0]; e.target.value = ""; if (!f) return; const c = audioCheck(f); if (!c.ok) { toast(c.msg); return; } const ti = $("#imptitle"), sr = $("#impsrc"); if (ti) IMP.title = ti.value; if (sr) IMP.src = sr.value; IMP.audio = f; IMP.warn = c.warn; render(); return; }
  if (e.target.id === "imptitle") { IMP.title = e.target.value; return; }
  if (e.target.id === "bkfile") { const f = e.target.files[0]; if (f) importBackup(f); e.target.value = ""; return; }
  if (e.target.id === "nmin") { S.set.name = e.target.value.trim().slice(0, 20); save(); toast("已保存"); return; }
  if (e.target.id === "aiprov") { const p = AI_PRESETS[e.target.value]; $("#aibase").value = p[2]; $("#aimodel").value = p[3]; return; }
  if (e.target.id === "prsel") { PR_ID = e.target.value; PR_SI = 0; PR_SRC = null; stopSpeak(); render(); }
  if (e.target.dataset && e.target.dataset.aud) { const f = e.target.files[0]; const id = e.target.dataset.aud; closeSheet(); if (f) { const c = audioCheck(f); if (!c.ok) { toast(c.msg); return; } if (c.warn) toast(c.warn); importAudio(id, f); } return; } if (e.target.id === "fsr") { S.set.fs = +e.target.value; save(); } });
document.addEventListener("input", e => { if (e.target.id === "fsr") { S.set.fs = +e.target.value; $("#fsv").textContent = S.set.fs + "px"; applySettings(); } if (e.target.dataset.qi && QZ) QZ.ans[+e.target.dataset.qi] = e.target.value; });
document.addEventListener("keydown", e => { if (e.key === "Escape") { closeSheet(); closeMenus(); closeModal(); } });
window.addEventListener("resize", () => { if (!LS.get("screen")) { const before = document.documentElement.dataset.mode; screenMode(); if (before !== document.documentElement.dataset.mode) render(); } });
document.addEventListener("dragover", e => { if (VIEW === "imp" && FULL) { e.preventDefault(); document.body.classList.add("dragging"); } });
document.addEventListener("dragleave", e => { if (!e.relatedTarget) document.body.classList.remove("dragging"); });
document.addEventListener("drop", e => { document.body.classList.remove("dragging"); if (VIEW !== "imp" || !FULL) return; e.preventDefault(); const fs = Array.from((e.dataTransfer && e.dataTransfer.files) || []); if (fs.length) impFromFiles(fs); });
window.addEventListener("hashchange", () => { const h = location.hash.slice(1); if ((VIEWNAMES.has(h) || ALIAS[h]) && h !== VIEW) go(h); });

/* ---------- boot ---------- */
loadLocal(); screenMode();
const h0 = location.hash.slice(1); if (ALIAS[h0]) { VIEW = ALIAS[h0][0]; if (h0 === "exam") REVIEW_TAB = "exam"; } else if (VIEWNAMES.has(h0) && h0 !== "imp") VIEW = h0;
if (VIEW === "read") READ_ID = S.cur.art || ARTS[0].id;
rollover(); render(); initCloud(); tmStart();
})();
