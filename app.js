const STORAGE_KEY = "historyMatchingRecords.v2";
const THEME_KEY = "historyMatchingTheme.v1";
const LEADERBOARD_KEY = "historyMatchingLeaderboard.v1";
const ORDER_STORAGE_KEY = "historyOrderingRecords.v1";
const CLASSIFICATION_STORAGE_KEY = "historyClassificationRecords.v1";
const CURRICULUM_SET_KEY = "historyMatchingCurriculumSet.v1";
const LEADERBOARD_VISIBLE_LIMIT = 10;
const BOARD_SIZE = 8;
const MIN_MATCH_PAIRS = BOARD_SIZE / 2;
const START_SECONDS = 60;
const START_MS = START_SECONDS * 1000;
const MATCH_BONUS_SECONDS = 3;
const COMBO_BONUS_SECONDS = 5;
const COMBO_WINDOW_MS = 3000;
const CLASSIFY_BONUS_SECONDS = 1;
const CLASSIFY_COMBO_BONUS_SECONDS = 2;
const HINT_DELAY_MS = 5000;
const DIRECT_RELATION_KEYS = new Set(PAIRS.map(pair => relationKey(pair.left, pair.right)));
const CORE_STUDY_SETS = buildCoreStudySets();
const CORE_STUDY_SET_MAP = new Map(CORE_STUDY_SETS.map(set => [set.id, set]));
const SFX_VOLUME = 0.2;
const SFX_KEY = "historyMatchingSfxEnabled.v1";
let sfxEnabled = true;
let sfxContext = null;
let matchWarningSecond = -1;
let noticeTimer = null;
let orderDrag = null;

const state = {
  records: loadRecords(),
  orderRecords: loadOrderRecords(),
  classificationRecords: loadClassificationRecords(),
  leaderboard: loadLeaderboard(),
  feature: "home",
  pool: [],
  boardCards: [],
  selected: [],
  studyQueue: [],
  studyIndex: 0,
  studyFlipped: false,
  orderPool: [],
  orderQueue: [],
  orderIndex: 0,
  orderItems: [],
  orderSelectedId: null,
  orderChecked: false,
  classificationPool: [],
  classificationQueue: [],
  classificationCurrent: null,
  classificationCount: 0,
  rankingMode: "match",
  score: 0,
  combo: 0,
  matched: 0,
  wrong: 0,
  timeLeft: START_MS,
  endAt: 0,
  lastMatchAt: 0,
  matchSessionId: 0,
  pickStartedAt: 0,
  locked: false,
  finished: false,
  timerId: null,
  hintTimerId: null
};

const els = {
  app: document.querySelector(".app"),
  homeView: document.getElementById("homeView"),
  rankingView: document.getElementById("rankingView"),
  openRankingBtn: document.getElementById("openRankingBtn"),
  rankingBackBtn: document.getElementById("rankingBackBtn"),
  rankingTabs: document.querySelectorAll("button[data-ranking-mode]"),
  rankingListTitle: document.getElementById("rankingListTitle"),
  rankingPageList: document.getElementById("rankingPageList"),
  startStudyBtn: document.getElementById("startStudyBtn"),
  startMatchBtn: document.getElementById("startMatchBtn"),
  startOrderBtn: document.getElementById("startOrderBtn"),
  orderSetCount: document.getElementById("orderSetCount"),
  startClassificationBtn: document.getElementById("startClassificationBtn"),
  classificationCardCount: document.getElementById("classificationCardCount"),
  rangeNotice: document.getElementById("rangeNotice"),
  appNotice: document.getElementById("appNotice"),
  themeToggle: document.getElementById("themeToggle"),
  themeIcon: document.getElementById("themeIcon"),
  themeLabel: document.getElementById("themeLabel"),
  sfxToggle: document.getElementById("sfxToggle"),
  sfxLabel: document.getElementById("sfxLabel"),
  effectLayer: document.getElementById("effectLayer"),
  gameView: document.getElementById("gameView"),
  curriculumSet: document.getElementById("curriculumSetSelect"),
  era: document.getElementById("eraSelect"),
  priority: document.getElementById("prioritySelect"),
  mode: document.getElementById("modeSelect"),
  difficulty: document.getElementById("difficultySelect"),
  totalPairs: document.getElementById("totalPairs"),
  weakPairs: document.getElementById("weakPairs"),
  savedCount: document.getElementById("savedCount"),
  sessionLabel: document.getElementById("sessionLabel"),
  sessionTitle: document.getElementById("sessionTitle"),
  score: document.getElementById("score"),
  combo: document.getElementById("combo"),
  timeLeft: document.getElementById("timeLeft"),
  timerLabel: document.getElementById("timerLabel"),
  feedback: document.getElementById("feedback"),
  modeHint: document.getElementById("modeHint"),
  board: document.getElementById("board"),
  orderArea: document.getElementById("orderArea"),
  orderProgress: document.getElementById("orderProgress"),
  orderSetTitle: document.getElementById("orderSetTitle"),
  orderList: document.getElementById("orderList"),
  orderAnswer: document.getElementById("orderAnswer"),
  orderCheckBtn: document.getElementById("orderCheckBtn"),
  orderRetryBtn: document.getElementById("orderRetryBtn"),
  orderNextBtn: document.getElementById("orderNextBtn"),
  orderShuffleBtn: document.getElementById("orderShuffleBtn"),
  classificationArea: document.getElementById("classificationArea"),
  classificationProgress: document.getElementById("classificationProgress"),
  classificationTitle: document.getElementById("classificationTitle"),
  classificationCard: document.getElementById("classificationCard"),
  classificationPrompt: document.getElementById("classificationPrompt"),
  classificationTerm: document.getElementById("classificationTerm"),
  classificationMeta: document.getElementById("classificationMeta"),
  classificationTargets: document.getElementById("classificationTargets"),
  classificationNote: document.getElementById("classificationNote"),
  timerBox: document.getElementById("timerBox"),
  resultView: document.getElementById("resultView"),
  finalScore: document.getElementById("finalScore"),
  finalMatched: document.getElementById("finalMatched"),
  finalRank: document.getElementById("finalRank"),
  resultEyebrow: document.getElementById("resultEyebrow"),
  leaderboardTitle: document.getElementById("leaderboardTitle"),
  leaderboardList: document.getElementById("leaderboardList"),
  studyArea: document.getElementById("studyArea"),
  studyCard: document.getElementById("studyCard"),
  studySide: document.getElementById("studySide"),
  studyTerm: document.getElementById("studyTerm"),
  studyMeta: document.getElementById("studyMeta"),
  flipBtn: document.getElementById("flipBtn"),
  knowBtn: document.getElementById("knowBtn"),
  weakBtn: document.getElementById("weakBtn"),
  nextStudyBtn: document.getElementById("nextStudyBtn"),
  result: document.getElementById("resultSummary"),
  weakList: document.getElementById("weakList"),
  jsonBox: document.getElementById("jsonBox")
};

els.startStudyBtn.addEventListener("click", startStudy);
els.openRankingBtn.addEventListener("click", () => showRanking("match"));
els.rankingBackBtn.addEventListener("click", showHome);
for (const tab of els.rankingTabs) {
  tab.addEventListener("click", () => renderRankingPage(tab.dataset.rankingMode));
}
els.themeToggle.addEventListener("click", toggleTheme);
els.sfxToggle.addEventListener("click", toggleSfx);
els.startMatchBtn.addEventListener("click", startMatch);
els.startOrderBtn.addEventListener("click", startOrder);
els.startClassificationBtn.addEventListener("click", startClassification);
document.getElementById("homeBtn").addEventListener("click", showHome);
document.getElementById("retryBtn").addEventListener("click", retryCurrentFeature);
els.studyCard.addEventListener("click", flipStudyCard);
els.flipBtn.addEventListener("click", flipStudyCard);
els.knowBtn.addEventListener("click", () => gradeStudy(true));
els.weakBtn.addEventListener("click", () => gradeStudy(false));
els.nextStudyBtn.addEventListener("click", nextStudyCard);
els.orderList.addEventListener("click", handleOrderListClick);
els.orderList.addEventListener("pointerdown", handleOrderPointerDown);
els.orderList.addEventListener("keydown", handleOrderDragKeydown);
els.orderCheckBtn.addEventListener("click", checkOrder);
els.orderRetryBtn.addEventListener("click", retryOrderRound);
els.orderNextBtn.addEventListener("click", nextOrderRound);
els.orderShuffleBtn.addEventListener("click", retryOrderRound);
els.classificationTargets.addEventListener("click", handleClassificationAnswer);
document.getElementById("exportBtn").addEventListener("click", exportRecords);
document.getElementById("importInput").addEventListener("change", importRecords);
document.getElementById("resetBtn").addEventListener("click", resetRecords);

els.curriculumSet.addEventListener("change", handleCurriculumSetChange);
for (const select of [els.era, els.priority, els.mode, els.difficulty]) {
  select.addEventListener("change", updateHomeSummary);
}

initTheme();
initCurriculumSets();
updateHomeSummary();
renderWeakList();
registerServiceWorker();

document.addEventListener("visibilitychange", () => {
  if (!document.hidden && ["match", "classify"].includes(state.feature) && !state.finished) tickTimer();
});

function buildCoreStudySets() {
  const core = era => PAIRS.filter(pair => pair.era === era && ["S", "A"].includes(pair.priority));
  const ancient = core("고대").concat(core("후삼국"));
  const goryeo = core("고려");
  const joseon = core("조선");
  const opening = core("개항기");
  const japanese = core("일제강점기");
  const modernCulture = core("현대사").concat(core("문화재"));
  const makeSet = (number, title, pairs) => ({
    id: `core-${String(number).padStart(2, "0")}`,
    number,
    title,
    pairIds: pairs.map(pair => pair.id)
  });

  return [
    makeSet(1, "선사·초기 국가", ancient.slice(0, 20)),
    makeSet(2, "삼국 발전·남북국", ancient.slice(20)),
    makeSet(3, "고려 전기 왕·제도", goryeo.slice(0, 20)),
    makeSet(4, "고려 대외 항쟁·후기", goryeo.slice(20)),
    makeSet(5, "조선 통치·수취 체제", joseon.slice(0, 21)),
    makeSet(6, "조선 후기 제도·전쟁·사상", joseon.slice(21, 42)),
    makeSet(7, "조선 후기 변동·개항·개혁", joseon.slice(42).concat(opening.slice(0, 15))),
    makeSet(8, "국권 수호·일제 초기", opening.slice(15).concat(japanese.slice(0, 10))),
    makeSet(9, "독립운동·무장 투쟁", japanese.slice(10, 30)),
    makeSet(10, "민족문화·현대사·문화재", japanese.slice(30).concat(modernCulture))
  ];
}

function initCurriculumSets() {
  els.curriculumSet.innerHTML = [
    '<option value="all">전체 핵심 200쌍</option>',
    ...CORE_STUDY_SETS.map(set => (
      `<option value="${set.id}">${set.number}세트 · ${set.title} (${set.pairIds.length}쌍)</option>`
    ))
  ].join("");
  const saved = localStorage.getItem(CURRICULUM_SET_KEY);
  if (saved && CORE_STUDY_SET_MAP.has(saved)) els.curriculumSet.value = saved;
}

function handleCurriculumSetChange() {
  if (els.curriculumSet.value !== "all") els.era.value = "all";
  localStorage.setItem(CURRICULUM_SET_KEY, els.curriculumSet.value);
  updateHomeSummary();
}

function getSelectedCurriculumSet() {
  return CORE_STUDY_SET_MAP.get(els.curriculumSet.value) || null;
}

function loadSfxEnabled() {
  try {
    return localStorage.getItem(SFX_KEY) !== "off";
  } catch {
    return true;
  }
}

function ensureAudioContext() {
  if (!sfxEnabled) return null;
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return null;
  if (!sfxContext) {
    sfxContext = new AudioContext();
  }
  if (sfxContext.state === "suspended") {
    sfxContext.resume().catch(() => {});
  }
  return sfxContext;
}

function playTone(frequency, durationSec, type = "sine", delaySec = 0, volume = SFX_VOLUME) {
  if (!ensureAudioContext()) return;
  const now = sfxContext.currentTime + delaySec;
  const osc = sfxContext.createOscillator();
  const gain = sfxContext.createGain();
  const filter = sfxContext.createBiquadFilter();
  osc.type = type;
  osc.frequency.setValueAtTime(frequency, now);
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(frequency * 2.2, now);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, volume), now + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + durationSec);
  osc.connect(filter);
  filter.connect(gain);
  gain.connect(sfxContext.destination);
  osc.start(now);
  osc.stop(now + durationSec + 0.03);
}

function playMatchSound(type) {
  if (!sfxEnabled) return;
  if (!ensureAudioContext()) return;

  if (type === "correct") {
    playTone(784, 0.08, "triangle", 0, 0.2);
    playTone(1046.5, 0.08, "triangle", 0.06, 0.16);
    return;
  }
  if (type === "select") {
    playTone(440, 0.035, "triangle", 0, 0.055);
    return;
  }
  if (type === "combo") {
    playTone(659.3, 0.06, "triangle", 0, 0.2);
    playTone(783.99, 0.06, "triangle", 0.06, 0.18);
    playTone(1046.5, 0.07, "triangle", 0.12, 0.16);
    return;
  }
  if (type === "wrong") {
    playTone(277.18, 0.08, "square", 0, 0.2);
    playTone(220, 0.1, "square", 0.06, 0.16);
    return;
  }
  if (type === "warning") {
    playTone(587.33, 0.08, "triangle", 0, 0.13);
    return;
  }
  if (type === "urgent") {
    playTone(587.33, 0.07, "triangle", 0, 0.14);
    playTone(466.16, 0.07, "triangle", 0.07, 0.12);
    return;
  }
  if (type === "timeout") {
    playTone(196, 0.12, "sawtooth", 0, 0.16);
    playTone(130.81, 0.12, "sawtooth", 0.1, 0.15);
  }
}

function initTheme() {
  const saved = localStorage.getItem(THEME_KEY) || "dark";
  document.body.dataset.theme = saved;
  sfxEnabled = loadSfxEnabled();
  syncThemeButton();
  syncSfxButton();
}

function toggleTheme() {
  const next = document.body.dataset.theme === "light" ? "dark" : "light";
  document.body.dataset.theme = next;
  localStorage.setItem(THEME_KEY, next);
  syncThemeButton();
}

function syncThemeButton() {
  const isLight = document.body.dataset.theme === "light";
  const label = isLight ? "다크" : "라이트";
  els.themeIcon.textContent = isLight ? "☾" : "☀";
  els.themeLabel.textContent = label;
  els.themeToggle.setAttribute("aria-label", `${label} 모드로 전환`);
  els.themeToggle.title = `${label} 모드로 전환`;
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", isLight ? "#f5f7f8" : "#0f151c");
}

function registerServiceWorker() {
  if (!("serviceWorker" in navigator) || !/^https?:$/.test(location.protocol)) return;
  window.addEventListener("load", () => {
    const hadController = Boolean(navigator.serviceWorker.controller);
    let refreshing = false;
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (!hadController || refreshing) return;
      refreshing = true;
      location.reload();
    });
    navigator.serviceWorker.register("./service-worker.js").catch(() => {});
  });
}

function showNotice(message, tone = "normal") {
  window.clearTimeout(noticeTimer);
  els.appNotice.textContent = message;
  els.appNotice.className = `app-notice visible${tone === "error" ? " error" : ""}`;
  noticeTimer = window.setTimeout(() => {
    els.appNotice.className = "app-notice";
  }, 2400);
}

function toggleSfx() {
  sfxEnabled = !sfxEnabled;
  localStorage.setItem(SFX_KEY, sfxEnabled ? "on" : "off");
  syncSfxButton();
  if (sfxEnabled) {
    ensureAudioContext();
    playTone(880, 0.07, "triangle", 0, 0.12);
  }
}

function syncSfxButton() {
  const action = sfxEnabled ? "끄기" : "켜기";
  els.sfxToggle.setAttribute("aria-pressed", String(sfxEnabled));
  els.sfxToggle.setAttribute("aria-label", `효과음 ${action}`);
  els.sfxToggle.title = `효과음 ${action}`;
  els.sfxLabel.textContent = sfxEnabled ? "효과음" : "무음";
  els.sfxToggle.querySelector(".toggle-icon").textContent = sfxEnabled ? "♪" : "×";
}

function vibrate(pattern) {
  if (typeof navigator.vibrate === "function") navigator.vibrate(pattern);
}

function retriggerClass(element, className, duration = 420) {
  element.classList.remove(className);
  void element.offsetWidth;
  element.classList.add(className);
  window.setTimeout(() => element.classList.remove(className), duration);
}

function showScorePop(text, tone = "good") {
  const pop = document.createElement("span");
  pop.className = `score-pop ${tone === "bad" ? "bad" : tone === "combo" ? "combo-pop" : ""}`;
  pop.textContent = text;
  els.effectLayer.appendChild(pop);
  pop.addEventListener("animationend", () => pop.remove(), { once: true });
}

function playImpact(kind, points = 0, seconds = 0) {
  const isWrong = kind === "wrong";
  retriggerClass(els.app, isWrong ? "impact-wrong" : "impact-correct", 360);
  retriggerClass(els.score.closest(".score-display"), "score-hit", 340);
  if (kind === "combo") retriggerClass(els.score.closest(".score-display"), "combo-hit", 440);
  if (seconds > 0) retriggerClass(els.timerBox, "time-gain", 460);
  showScorePop(`${points > 0 ? "+" : ""}${points}점${seconds ? `  +${seconds}초` : ""}`, isWrong ? "bad" : kind);
  vibrate(isWrong ? [45, 35, 45] : kind === "combo" ? [18, 28, 24] : 22);
}

function loadRecords() {
  try {
    const fresh = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (fresh) return sanitizeRecords(fresh);
    return sanitizeRecords(JSON.parse(localStorage.getItem("historyMatchingRecords.v1")) || {});
  } catch {
    return {};
  }
}

function sanitizeRecords(records) {
  if (!records || typeof records !== "object" || Array.isArray(records)) return {};
  const validIds = new Set(PAIRS.map(pair => pair.id));
  const integerFields = ["attempts", "correct", "wrong", "instant", "sure", "slow", "weak", "streak"];
  const sanitized = {};

  for (const [pairId, record] of Object.entries(records)) {
    if (!validIds.has(pairId) || !record || typeof record !== "object" || Array.isArray(record)) continue;
    const clean = {};
    for (const field of integerFields) {
      const value = Number(record[field]);
      clean[field] = Number.isFinite(value) ? Math.max(0, Math.round(value)) : 0;
    }
    const averageTime = Number(record.averageTime);
    const mastery = Number(record.mastery);
    clean.averageTime = Number.isFinite(averageTime) ? Math.max(0, Number(averageTime.toFixed(2))) : 0;
    clean.mastery = Number.isFinite(mastery) ? Math.max(0, Math.min(100, Math.round(mastery))) : 0;
    clean.lastSeen = Number.isFinite(Date.parse(record.lastSeen)) ? new Date(record.lastSeen).toISOString() : null;
    sanitized[pairId] = clean;
  }
  return sanitized;
}

function saveRecords() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.records));
}

function loadOrderRecords() {
  try {
    return sanitizeOrderRecords(JSON.parse(localStorage.getItem(ORDER_STORAGE_KEY)) || {});
  } catch {
    return {};
  }
}

function sanitizeOrderRecords(records) {
  if (!records || typeof records !== "object" || Array.isArray(records)) return {};
  const validIds = new Set(ORDER_SETS.map(set => set.id));
  const sanitized = {};
  for (const [setId, record] of Object.entries(records)) {
    if (!validIds.has(setId) || !record || typeof record !== "object" || Array.isArray(record)) continue;
    const attempts = Math.max(0, Math.round(Number(record.attempts) || 0));
    const correct = Math.min(attempts, Math.max(0, Math.round(Number(record.correct) || 0)));
    const wrong = Math.max(0, Math.round(Number(record.wrong) || 0));
    const streak = Math.max(0, Math.round(Number(record.streak) || 0));
    const mastery = Math.max(0, Math.min(100, Math.round(Number(record.mastery) || 0)));
    sanitized[setId] = {
      attempts,
      correct,
      wrong,
      streak,
      mastery,
      lastSeen: Number.isFinite(Date.parse(record.lastSeen)) ? new Date(record.lastSeen).toISOString() : null
    };
  }
  return sanitized;
}

function saveOrderRecords() {
  localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(state.orderRecords));
}

function getOrderRecord(setId) {
  if (!state.orderRecords[setId]) {
    state.orderRecords[setId] = {
      attempts: 0,
      correct: 0,
      wrong: 0,
      streak: 0,
      mastery: 0,
      lastSeen: null
    };
  }
  return state.orderRecords[setId];
}

function loadClassificationRecords() {
  try {
    return sanitizeClassificationRecords(JSON.parse(localStorage.getItem(CLASSIFICATION_STORAGE_KEY)) || {});
  } catch {
    return {};
  }
}

function getClassificationCardId(set, card) {
  return `${set.id}::${card.term}`;
}

function sanitizeClassificationRecords(records) {
  if (!records || typeof records !== "object" || Array.isArray(records)) return {};
  const validIds = new Set(CLASSIFICATION_SETS.flatMap(set => set.cards.map(card => getClassificationCardId(set, card))));
  const sanitized = {};
  for (const [cardId, record] of Object.entries(records)) {
    if (!validIds.has(cardId) || !record || typeof record !== "object" || Array.isArray(record)) continue;
    const attempts = Math.max(0, Math.round(Number(record.attempts) || 0));
    sanitized[cardId] = {
      attempts,
      correct: Math.min(attempts, Math.max(0, Math.round(Number(record.correct) || 0))),
      wrong: Math.max(0, Math.round(Number(record.wrong) || 0)),
      streak: Math.max(0, Math.round(Number(record.streak) || 0)),
      mastery: Math.max(0, Math.min(100, Math.round(Number(record.mastery) || 0))),
      lastSeen: Number.isFinite(Date.parse(record.lastSeen)) ? new Date(record.lastSeen).toISOString() : null
    };
  }
  return sanitized;
}

function saveClassificationRecords() {
  localStorage.setItem(CLASSIFICATION_STORAGE_KEY, JSON.stringify(state.classificationRecords));
}

function getClassificationRecord(set, card) {
  const cardId = getClassificationCardId(set, card);
  if (!state.classificationRecords[cardId]) {
    state.classificationRecords[cardId] = {
      attempts: 0,
      correct: 0,
      wrong: 0,
      streak: 0,
      mastery: 0,
      lastSeen: null
    };
  }
  return state.classificationRecords[cardId];
}

function loadLeaderboard() {
  try {
    const parsed = JSON.parse(localStorage.getItem(LEADERBOARD_KEY));
    return sanitizeLeaderboard(parsed);
  } catch {
    return [];
  }
}

function saveLeaderboard() {
  localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(state.leaderboard));
}

function getRecord(pairId) {
  if (!state.records[pairId]) {
    state.records[pairId] = {
      attempts: 0,
      correct: 0,
      wrong: 0,
      instant: 0,
      sure: 0,
      slow: 0,
      weak: 0,
      averageTime: 0,
      mastery: 0,
      lastSeen: null,
      streak: 0
    };
  }
  return state.records[pairId];
}

function getPool() {
  let list = PAIRS.slice();
  const curriculumSet = getSelectedCurriculumSet();
  if (curriculumSet) {
    const pairIds = new Set(curriculumSet.pairIds);
    list = list.filter(pair => pairIds.has(pair.id));
  } else if (els.era.value !== "all") {
    list = list.filter(pair => pair.era === els.era.value);
  }
  if (els.priority.value === "SA") list = list.filter(pair => ["S", "A"].includes(pair.priority));
  if (els.priority.value === "S") list = list.filter(pair => pair.priority === "S");
  if (els.priority.value === "ABC") list = list.filter(pair => ["A", "B", "C"].includes(pair.priority));
  if (els.mode.value === "cram") list = list.filter(pair => ["S", "A"].includes(pair.priority));
  if (els.mode.value === "king") list = list.filter(pair => pair.category.startsWith("왕-") || pair.category === "정부-정책" || pair.category === "인물-정책");
  if (els.mode.value === "group") list = list.filter(pair => pair.category.startsWith("단체-"));
  if (els.mode.value === "confusion") list = list.filter(pair => ["왕-정책", "왕-제도", "왕-군사", "사건-특징"].includes(pair.category));
  if (els.mode.value === "wrong") {
    const weak = list.filter(isWeakPair);
    list = weak.length >= 4 ? weak : list.filter(pair => ["S", "A"].includes(pair.priority));
  }
  return list;
}

function getOrderPool() {
  let list = ORDER_SETS.slice();
  if (els.era.value !== "all") list = list.filter(set => set.era === els.era.value);
  if (els.priority.value === "SA") list = list.filter(set => ["S", "A"].includes(set.priority));
  if (els.priority.value === "S") list = list.filter(set => set.priority === "S");
  if (els.priority.value === "ABC") list = list.filter(set => ["A", "B", "C"].includes(set.priority));
  if (els.mode.value === "wrong") {
    const weak = list.filter(set => state.orderRecords[set.id]?.wrong > 0 || state.orderRecords[set.id]?.mastery < 70);
    if (weak.length) list = weak;
  }
  return list;
}

function getClassificationPool() {
  let sets = CLASSIFICATION_SETS.slice();
  if (els.era.value !== "all") sets = sets.filter(set => set.era === els.era.value);
  return sets.map(set => {
    let cards = set.cards.slice();
    if (els.priority.value === "SA") cards = cards.filter(card => ["S", "A"].includes(card.priority));
    if (els.priority.value === "S") cards = cards.filter(card => card.priority === "S");
    if (els.priority.value === "ABC") cards = cards.filter(card => ["A", "B", "C"].includes(card.priority));
    if (els.mode.value === "wrong") {
      const weak = cards.filter(card => {
        const record = state.classificationRecords[getClassificationCardId(set, card)];
        return record && (record.wrong > 0 || record.mastery < 70);
      });
      if (weak.length) cards = weak;
    }
    return { ...set, cards };
  }).filter(set => set.cards.length > 0);
}

function updateHomeSummary() {
  const pool = getPool();
  const orderPool = getOrderPool();
  const classificationPool = getClassificationPool();
  const playableMatch = hasPlayableMatchPool(pool);
  els.era.disabled = Boolean(getSelectedCurriculumSet());
  els.totalPairs.textContent = pool.length;
  els.weakPairs.textContent = pool.filter(isWeakPair).length;
  els.savedCount.textContent = Object.keys(state.records).length
    + Object.keys(state.orderRecords).length
    + Object.keys(state.classificationRecords).length;
  els.orderSetCount.textContent = orderPool.length;
  els.classificationCardCount.textContent = classificationPool.reduce((sum, set) => sum + set.cards.length, 0);
  els.startStudyBtn.disabled = pool.length === 0;
  els.startMatchBtn.disabled = !playableMatch;
  els.startOrderBtn.disabled = orderPool.length === 0;
  els.startClassificationBtn.disabled = classificationPool.length === 0;
  els.rangeNotice.classList.toggle("hidden", pool.length > 0 && playableMatch);
  if (!pool.length) {
    els.rangeNotice.textContent = "선택한 조건에 해당하는 학습 카드가 없습니다.";
  } else if (!playableMatch) {
    els.rangeNotice.textContent = "카드 학습은 가능하지만, 매칭 훈련에는 서로 겹치지 않는 개념 쌍 4개가 필요합니다.";
  }
}

function hasPlayableMatchPool(pool) {
  return pickCompatiblePairs(pool, MIN_MATCH_PAIRS, new Set()).length === MIN_MATCH_PAIRS;
}

function showHome() {
  stopTimer();
  cancelOrderDrag();
  state.feature = "home";
  els.homeView.classList.remove("hidden");
  els.rankingView.classList.add("hidden");
  els.gameView.classList.add("hidden");
  updateHomeSummary();
}

function showGame() {
  els.homeView.classList.add("hidden");
  els.rankingView.classList.add("hidden");
  els.gameView.classList.remove("hidden");
  renderWeakList();
}

function showRanking(mode = "match") {
  stopTimer();
  state.feature = "ranking";
  els.homeView.classList.add("hidden");
  els.gameView.classList.add("hidden");
  els.rankingView.classList.remove("hidden");
  renderRankingPage(mode);
}

function renderRankingPage(mode = "match") {
  state.rankingMode = mode === "classify" ? "classify" : "match";
  for (const tab of els.rankingTabs) {
    const active = tab.dataset.rankingMode === state.rankingMode;
    tab.classList.toggle("active", active);
    tab.setAttribute("aria-selected", String(active));
  }
  els.rankingListTitle.textContent = state.rankingMode === "classify" ? "분류 훈련 랭킹" : "매칭 훈련 랭킹";
  renderLeaderboard(state.rankingMode, null, els.rankingPageList);
}

function startStudy() {
  if (!getPool().length) {
    showNotice("선택한 범위에 학습 카드가 없습니다.", "error");
    return;
  }
  stopTimer();
  state.feature = "study";
  state.pool = weightedPairs(getPool());
  state.studyQueue = shuffle(state.pool).slice();
  state.studyIndex = 0;
  state.studyFlipped = false;
  state.score = 0;
  state.combo = 0;
  state.matched = 0;
  state.wrong = 0;
  showGame();
  const curriculumSet = getSelectedCurriculumSet();
  els.sessionLabel.textContent = curriculumSet ? `${curriculumSet.number}세트 · 카드 넘기기` : "카드 넘기기";
  els.sessionTitle.textContent = curriculumSet ? curriculumSet.title : "개념 학습";
  els.board.classList.add("hidden");
  els.orderArea.classList.add("hidden");
  els.classificationArea.classList.add("hidden");
  els.resultView.classList.add("hidden");
  els.studyArea.classList.remove("hidden");
  els.timeLeft.textContent = "-";
  els.timerLabel.textContent = "제한 없음";
  els.timerBox.classList.remove("danger", "urgent");
  els.feedback.textContent = "앞면을 보고 연결 개념을 떠올린 뒤 넘겨서 확인하세요.";
  els.modeHint.textContent = "알았다 / 다시 볼 카드 기록은 약한 연결에 반영됩니다.";
  renderStudyCard();
  updateHud();
}

function renderStudyCard() {
  if (!state.studyQueue.length) state.studyQueue = shuffle(state.pool).slice();
  const pair = state.studyQueue[state.studyIndex % state.studyQueue.length];
  const frontIsLeft = state.studyIndex % 2 === 0;
  const front = frontIsLeft ? pair.left : pair.right;
  const back = frontIsLeft ? pair.right : pair.left;
  els.studySide.textContent = state.studyFlipped ? "뒷면" : "앞면";
  els.studyTerm.textContent = state.studyFlipped ? back : front;
  els.studyMeta.textContent = state.studyFlipped
    ? `${pair.era} · ${pair.priority} · ${pair.explanation}`
    : "클릭해서 짝 확인";
  els.studyCard.setAttribute("aria-label", state.studyFlipped ? `${front}의 짝은 ${back}` : `${front}, 짝 확인하기`);
  els.flipBtn.textContent = state.studyFlipped ? "앞면 보기" : "짝 확인";
  els.knowBtn.disabled = !state.studyFlipped;
  els.weakBtn.disabled = !state.studyFlipped;
}

function flipStudyCard() {
  if (state.feature !== "study") return;
  state.studyFlipped = !state.studyFlipped;
  renderStudyCard();
}

function gradeStudy(knew) {
  if (state.feature !== "study" || !state.studyFlipped) return;
  const pair = state.studyQueue[state.studyIndex % state.studyQueue.length];
  const record = getRecord(pair.id);
  record.attempts += 1;
  record.lastSeen = new Date().toISOString();
  if (knew) {
    record.correct += 1;
    record.sure += 1;
    record.streak += 1;
    state.score += 100;
    state.matched += 1;
    els.feedback.textContent = `${pair.left} ↔ ${pair.right} 저장`;
  } else {
    record.wrong += 1;
    record.weak += 1;
    record.streak = 0;
    state.wrong += 1;
    els.feedback.textContent = `${pair.left} ↔ ${pair.right} 다시 볼 카드로 표시`;
  }
  record.mastery = calculateMastery(record);
  saveRecords();
  renderWeakList();
  nextStudyCard();
}

function nextStudyCard() {
  state.studyIndex += 1;
  state.studyFlipped = false;
  renderStudyCard();
  updateHud();
}

function startOrder() {
  stopTimer();
  state.orderPool = getOrderPool();
  if (!state.orderPool.length) {
    state.feature = "home";
    showNotice("선택한 범위에 순서 흐름이 없습니다.", "error");
    updateHomeSummary();
    return;
  }
  state.feature = "order";
  state.orderQueue = state.orderPool.slice().sort((a, b) => getOrderWeight(b) - getOrderWeight(a));
  state.orderIndex = 0;
  state.score = 0;
  state.combo = 0;
  state.matched = 0;
  state.wrong = 0;
  showGame();
  els.sessionLabel.textContent = "순서 배치";
  els.sessionTitle.textContent = "흐름 순서 훈련";
  els.studyArea.classList.add("hidden");
  els.board.classList.add("hidden");
  els.resultView.classList.add("hidden");
  els.classificationArea.classList.add("hidden");
  els.orderArea.classList.remove("hidden");
  els.timeLeft.textContent = "--:--:--";
  els.timerLabel.textContent = "제한 없음";
  els.timerBox.classList.remove("danger", "urgent");
  els.feedback.textContent = "가장 앞선 사건부터 차례대로 배열하세요.";
  els.modeHint.textContent = "손잡이를 끌거나 화살표·카드 두 장 선택으로 순서를 바꾸세요.";
  prepareOrderRound();
  updateHud();
}

function getOrderWeight(set) {
  const priority = set.priority === "S" ? 70 : set.priority === "A" ? 45 : 20;
  const record = state.orderRecords[set.id];
  const weak = record ? Math.max(0, 100 - record.mastery) + record.wrong * 18 : 35;
  return priority + weak + Math.random();
}

function prepareOrderRound() {
  cancelHint();
  cancelOrderDrag();
  const set = state.orderQueue[state.orderIndex % state.orderQueue.length];
  const ordered = set.items.map((text, correctIndex) => ({
    id: `${set.id}-${correctIndex}`,
    text,
    correctIndex
  }));
  state.orderItems = shuffleAwayFromCorrect(ordered);
  state.orderSelectedId = null;
  state.orderChecked = false;
  els.orderProgress.textContent = `${(state.orderIndex % state.orderQueue.length) + 1} / ${state.orderQueue.length}`;
  els.orderSetTitle.textContent = set.title;
  els.orderAnswer.classList.add("hidden");
  els.orderAnswer.textContent = "";
  els.orderCheckBtn.classList.remove("hidden");
  els.orderRetryBtn.classList.add("hidden");
  els.orderNextBtn.classList.add("hidden");
  els.orderShuffleBtn.disabled = false;
  renderOrderList();
  scheduleHint("order");
}

function shuffleAwayFromCorrect(items) {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const shuffled = shuffle(items);
    if (shuffled.some((item, index) => item.correctIndex !== index)) return shuffled;
  }
  return items.slice().reverse();
}

function renderOrderList() {
  els.orderList.innerHTML = state.orderItems.map((item, index) => {
    const selected = item.id === state.orderSelectedId;
    const positionClass = state.orderChecked
      ? item.correctIndex === index ? " correct-position" : " wrong-position"
      : "";
    return `<div class="order-item${selected ? " selected" : ""}${positionClass}" data-order-id="${escapeHtml(item.id)}" role="listitem">`
      + `<button class="order-drag-handle" type="button" data-order-drag aria-label="${escapeHtml(item.text)} 드래그하여 이동. 방향키로도 이동 가능" title="끌어서 순서 이동"${state.orderChecked ? " disabled" : ""}>`
      + `<span class="order-number" aria-hidden="true">${index + 1}</span><span class="order-grip" aria-hidden="true">⠿</span></button>`
      + `<button class="order-card" type="button" data-order-action="select" aria-pressed="${selected}"${state.orderChecked ? " disabled" : ""}>${escapeHtml(item.text)}</button>`
      + `<span class="order-move-controls">`
      + `<button type="button" data-order-action="up" aria-label="${escapeHtml(item.text)} 위로 이동" title="위로 이동"${index === 0 || state.orderChecked ? " disabled" : ""}>↑</button>`
      + `<button type="button" data-order-action="down" aria-label="${escapeHtml(item.text)} 아래로 이동" title="아래로 이동"${index === state.orderItems.length - 1 || state.orderChecked ? " disabled" : ""}>↓</button>`
      + `</span></div>`;
  }).join("");
}

function moveOrderItem(fromIndex, toIndex) {
  if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0 || toIndex >= state.orderItems.length) return false;
  const [item] = state.orderItems.splice(fromIndex, 1);
  state.orderItems.splice(toIndex, 0, item);
  state.orderSelectedId = null;
  playMatchSound("select");
  vibrate(10);
  renderOrderList();
  return true;
}

function handleOrderListClick(event) {
  const button = event.target.closest("button[data-order-action]");
  const row = event.target.closest(".order-item");
  if (!button || !row || state.feature !== "order" || state.orderChecked) return;
  const itemIndex = state.orderItems.findIndex(item => item.id === row.dataset.orderId);
  if (itemIndex < 0) return;
  const action = button.dataset.orderAction;
  if (action === "up" || action === "down") {
    const destination = itemIndex + (action === "up" ? -1 : 1);
    moveOrderItem(itemIndex, destination);
    return;
  }
  const item = state.orderItems[itemIndex];
  if (!state.orderSelectedId) {
    state.orderSelectedId = item.id;
  } else if (state.orderSelectedId === item.id) {
    state.orderSelectedId = null;
  } else {
    const selectedIndex = state.orderItems.findIndex(entry => entry.id === state.orderSelectedId);
    [state.orderItems[selectedIndex], state.orderItems[itemIndex]] = [state.orderItems[itemIndex], state.orderItems[selectedIndex]];
    state.orderSelectedId = null;
    vibrate(10);
  }
  playMatchSound("select");
  renderOrderList();
}

function handleOrderPointerDown(event) {
  const handle = event.target.closest("[data-order-drag]");
  const row = event.target.closest(".order-item");
  if (!handle || !row || state.feature !== "order" || state.orderChecked || event.button > 0) return;
  event.preventDefault();
  cancelOrderDrag();
  orderDrag = {
    pointerId: event.pointerId,
    itemId: row.dataset.orderId,
    targetId: row.dataset.orderId,
    placement: "before",
    startY: event.clientY,
    moved: false
  };
  row.classList.add("dragging");
  els.orderList.classList.add("is-dragging");
  handle.setPointerCapture?.(event.pointerId);
  window.addEventListener("pointermove", handleOrderPointerMove, { passive: false });
  window.addEventListener("pointerup", finishOrderDrag);
  window.addEventListener("pointercancel", cancelOrderDrag);
}

function handleOrderPointerMove(event) {
  if (!orderDrag || event.pointerId !== orderDrag.pointerId) return;
  event.preventDefault();
  if (Math.abs(event.clientY - orderDrag.startY) > 4) orderDrag.moved = true;
  const target = document.elementFromPoint(event.clientX, event.clientY)?.closest(".order-item");
  if (!target || !els.orderList.contains(target)) return;
  const rect = target.getBoundingClientRect();
  orderDrag.targetId = target.dataset.orderId;
  orderDrag.placement = event.clientY < rect.top + rect.height / 2 ? "before" : "after";
  clearOrderDropTargets();
  if (orderDrag.targetId !== orderDrag.itemId) {
    target.classList.add(orderDrag.placement === "before" ? "drag-target-before" : "drag-target-after");
  }
}

function finishOrderDrag(event) {
  if (!orderDrag || (event && event.pointerId !== orderDrag.pointerId)) return;
  const drag = orderDrag;
  const fromIndex = state.orderItems.findIndex(item => item.id === drag.itemId);
  if (drag.moved && drag.targetId !== drag.itemId && fromIndex >= 0) {
    const [item] = state.orderItems.splice(fromIndex, 1);
    let targetIndex = state.orderItems.findIndex(entry => entry.id === drag.targetId);
    if (targetIndex >= 0) {
      if (drag.placement === "after") targetIndex += 1;
      state.orderItems.splice(targetIndex, 0, item);
      state.orderSelectedId = null;
      playMatchSound("select");
      vibrate(12);
      els.feedback.textContent = "순서를 옮겼습니다. 완성되면 순서 확인을 누르세요.";
    } else {
      state.orderItems.splice(fromIndex, 0, item);
    }
  }
  cancelOrderDrag();
  renderOrderList();
}

function cancelOrderDrag() {
  orderDrag = null;
  window.removeEventListener("pointermove", handleOrderPointerMove);
  window.removeEventListener("pointerup", finishOrderDrag);
  window.removeEventListener("pointercancel", cancelOrderDrag);
  els.orderList?.classList.remove("is-dragging");
  clearOrderDropTargets();
}

function clearOrderDropTargets() {
  els.orderList?.querySelectorAll(".dragging, .drag-target-before, .drag-target-after").forEach(row => {
    row.classList.remove("dragging", "drag-target-before", "drag-target-after");
  });
}

function handleOrderDragKeydown(event) {
  const handle = event.target.closest("[data-order-drag]");
  if (!handle || !["ArrowUp", "ArrowDown"].includes(event.key) || state.orderChecked) return;
  const row = handle.closest(".order-item");
  const fromIndex = state.orderItems.findIndex(item => item.id === row?.dataset.orderId);
  const toIndex = fromIndex + (event.key === "ArrowUp" ? -1 : 1);
  event.preventDefault();
  if (moveOrderItem(fromIndex, toIndex)) {
    const movedHandle = els.orderList.querySelector(`[data-order-id="${CSS.escape(row.dataset.orderId)}"] [data-order-drag]`);
    movedHandle?.focus();
  }
}

function checkOrder() {
  if (state.feature !== "order" || state.orderChecked) return;
  cancelHint();
  cancelOrderDrag();
  const set = state.orderQueue[state.orderIndex % state.orderQueue.length];
  const correct = state.orderItems.every((item, index) => item.correctIndex === index);
  const record = getOrderRecord(set.id);
  record.attempts += 1;
  record.lastSeen = new Date().toISOString();
  state.orderChecked = true;
  state.orderSelectedId = null;
  if (correct) {
    record.correct += 1;
    record.streak += 1;
    state.score += 100;
    state.combo += 1;
    state.matched += 1;
    els.feedback.textContent = `${set.title} 순서가 정확합니다. +100점`;
    playMatchSound(state.combo >= 2 ? "combo" : "correct");
    playImpact(state.combo >= 2 ? "combo" : "correct", 100);
  } else {
    record.wrong += 1;
    record.streak = 0;
    state.combo = 0;
    state.wrong += 1;
    els.feedback.textContent = `${set.title} 순서를 다시 확인하세요.`;
    playMatchSound("wrong");
    playImpact("wrong", 0);
  }
  record.mastery = calculateOrderMastery(record);
  saveOrderRecords();
  els.orderAnswer.innerHTML = `<strong>정답</strong><span>${set.items.map(escapeHtml).join(" → ")}</span><small>${escapeHtml(set.explanation)}</small>`;
  els.orderAnswer.classList.remove("hidden");
  els.orderCheckBtn.classList.add("hidden");
  els.orderRetryBtn.classList.remove("hidden");
  els.orderNextBtn.classList.remove("hidden");
  els.orderShuffleBtn.disabled = true;
  renderOrderList();
  updateHud();
  updateHomeSummary();
}

function calculateOrderMastery(record) {
  const accuracy = record.attempts ? record.correct / record.attempts : 0;
  const streak = Math.min(record.streak, 3) / 3;
  return Math.max(0, Math.min(100, Math.round(accuracy * 75 + streak * 25 - Math.min(20, record.wrong * 4))));
}

function retryOrderRound() {
  if (state.feature !== "order") return;
  prepareOrderRound();
  els.feedback.textContent = "같은 흐름을 다시 배열하세요.";
}

function nextOrderRound() {
  if (state.feature !== "order") return;
  state.orderIndex = (state.orderIndex + 1) % state.orderQueue.length;
  prepareOrderRound();
  els.feedback.textContent = "가장 앞선 사건부터 차례대로 배열하세요.";
}

function startClassification() {
  stopTimer();
  state.classificationPool = getClassificationPool();
  const cardCount = state.classificationPool.reduce((sum, set) => sum + set.cards.length, 0);
  if (!cardCount) {
    state.feature = "home";
    showNotice("선택한 범위에 분류 카드가 없습니다.", "error");
    updateHomeSummary();
    return;
  }
  state.feature = "classify";
  state.classificationQueue = buildClassificationQueue();
  state.classificationCurrent = null;
  state.classificationCount = 0;
  state.score = 0;
  state.combo = 0;
  state.matched = 0;
  state.wrong = 0;
  const initialMs = getInitialTimeMs();
  state.timeLeft = initialMs;
  state.endAt = performance.now() + initialMs;
  state.lastMatchAt = 0;
  state.pickStartedAt = performance.now();
  state.locked = false;
  state.finished = false;
  matchWarningSecond = -1;
  showGame();
  els.sessionLabel.textContent = "개념 분류";
  els.sessionTitle.textContent = "1분 분류 훈련";
  els.studyArea.classList.add("hidden");
  els.orderArea.classList.add("hidden");
  els.board.classList.add("hidden");
  els.resultView.classList.add("hidden");
  els.classificationArea.classList.remove("hidden");
  els.timerLabel.textContent = "남은 시간";
  els.timerBox.classList.remove("danger", "urgent");
  els.feedback.textContent = "개념이 속한 국가나 역사 영역을 고르세요.";
  els.modeHint.textContent = "오답이면 정답 분류와 연결 근거가 바로 표시됩니다.";
  renderClassificationQuestion();
  updateHud();
  ensureAudioContext();
  state.timerId = setInterval(tickTimer, 10);
}

function buildClassificationQueue() {
  return state.classificationPool
    .flatMap(set => set.cards.map(card => ({ set, card })))
    .sort((a, b) => getClassificationWeight(b) - getClassificationWeight(a));
}

function getClassificationWeight(question) {
  const record = state.classificationRecords[getClassificationCardId(question.set, question.card)];
  const priority = question.card.priority === "S" ? 65 : 40;
  const weak = record ? Math.max(0, 100 - record.mastery) + record.wrong * 18 : 35;
  return priority + weak + Math.random() * 8;
}

function renderClassificationQuestion() {
  cancelHint();
  if (!state.classificationQueue.length) state.classificationQueue = buildClassificationQueue();
  state.classificationCurrent = state.classificationQueue.shift();
  state.classificationCount += 1;
  state.locked = false;
  state.pickStartedAt = performance.now();
  const { set, card } = state.classificationCurrent;
  els.classificationProgress.textContent = `${state.classificationCount}번째 개념`;
  els.classificationTitle.textContent = set.title;
  els.classificationPrompt.textContent = set.prompt;
  els.classificationTerm.textContent = card.term;
  els.classificationMeta.textContent = `${set.era} · ${card.priority}`;
  els.classificationCard.className = "classification-card";
  els.classificationNote.classList.add("hidden");
  els.classificationNote.textContent = "";
  els.classificationTargets.innerHTML = set.labels.map(label => (
    `<button type="button" data-classification-label="${escapeHtml(label)}">${escapeHtml(label)}</button>`
  )).join("");
  scheduleHint("classify");
}

function handleClassificationAnswer(event) {
  const button = event.target.closest("button[data-classification-label]");
  if (!button || state.feature !== "classify" || state.locked || state.timeLeft <= 0) return;
  cancelHint();
  state.locked = true;
  const { set, card } = state.classificationCurrent;
  const selected = button.dataset.classificationLabel;
  const correct = selected === card.answer;
  const now = performance.now();
  const elapsed = now - state.pickStartedAt;
  const record = getClassificationRecord(set, card);
  record.attempts += 1;
  record.lastSeen = new Date().toISOString();

  for (const target of els.classificationTargets.querySelectorAll("button")) {
    target.disabled = true;
    if (target.dataset.classificationLabel === card.answer) target.classList.add("correct-target");
  }

  if (correct) {
    const isCombo = state.lastMatchAt && now - state.lastMatchAt <= COMBO_WINDOW_MS;
    state.combo = isCombo ? state.combo + 1 : 1;
    state.lastMatchAt = now;
    state.matched += 1;
    const points = isCombo ? Math.min(300, 50 + state.combo * 50) : 100;
    const bonusSeconds = isCombo ? CLASSIFY_COMBO_BONUS_SECONDS : CLASSIFY_BONUS_SECONDS;
    state.score += points;
    state.endAt += bonusSeconds * 1000;
    record.correct += 1;
    record.streak += 1;
    els.classificationCard.classList.add("correct");
    els.feedback.textContent = `${card.term} → ${card.answer} +${points}점 +${bonusSeconds}초`;
    playMatchSound(isCombo ? "combo" : "correct");
    playImpact(isCombo ? "combo" : "correct", points, bonusSeconds);
  } else {
    state.combo = 0;
    state.lastMatchAt = 0;
    state.wrong += 1;
    state.score -= 50;
    record.wrong += 1;
    record.streak = 0;
    button.classList.add("wrong-target");
    els.classificationCard.classList.add("wrong");
    els.feedback.textContent = `정답은 ${card.answer}입니다. -50점`;
    playMatchSound("wrong");
    playImpact("wrong", -50);
  }

  record.mastery = calculateClassificationMastery(record, elapsed);
  saveClassificationRecords();
  els.classificationNote.innerHTML = `<strong>${escapeHtml(card.answer)}</strong><span>${escapeHtml(card.note)}</span>`;
  els.classificationNote.classList.remove("hidden");
  updateHud();
  updateHomeSummary();
  window.setTimeout(() => {
    if (state.feature === "classify" && !state.finished && state.timeLeft > 0) renderClassificationQuestion();
  }, correct ? 430 : 760);
}

function calculateClassificationMastery(record, elapsed) {
  const accuracy = record.attempts ? record.correct / record.attempts : 0;
  const speed = Math.max(0, Math.min(1, 1 - elapsed / 8000));
  const streak = Math.min(record.streak, 4) / 4;
  return Math.max(0, Math.min(100, Math.round(accuracy * 60 + speed * 25 + streak * 15 - Math.min(20, record.wrong * 4))));
}

function startMatch() {
  stopTimer();
  state.feature = "match";
  state.matchSessionId += 1;
  state.pool = weightedPairs(getPool());
  if (!hasPlayableMatchPool(state.pool)) {
    state.feature = "home";
    showNotice("매칭에 필요한 개념 쌍이 부족합니다.", "error");
    updateHomeSummary();
    return;
  }
  state.boardCards = buildInitialBoard();
  state.selected = [];
  state.score = 0;
  state.combo = 0;
  state.matched = 0;
  state.wrong = 0;
  const initialMs = getInitialTimeMs();
  state.timeLeft = initialMs;
  state.endAt = performance.now() + initialMs;
  matchWarningSecond = -1;
  state.lastMatchAt = 0;
  state.pickStartedAt = performance.now();
  state.locked = false;
  state.finished = false;
  els.timerLabel.textContent = "남은 시간";
  showGame();
  const curriculumSet = getSelectedCurriculumSet();
  els.sessionLabel.textContent = curriculumSet ? `${curriculumSet.number}세트 · 카드 짝 맞추기` : "카드 짝 맞추기";
  els.sessionTitle.textContent = curriculumSet ? curriculumSet.title : "1분 리필 매칭";
  els.studyArea.classList.add("hidden");
  els.orderArea.classList.add("hidden");
  els.classificationArea.classList.add("hidden");
  els.resultView.classList.add("hidden");
  els.board.classList.remove("hidden");
  els.feedback.textContent = "8장 안에는 항상 최소 1쌍이 있습니다.";
  els.modeHint.textContent = "맞추면 빈자리에 새 카드가 들어오고, 3초 안 연속 성공은 콤보입니다.";
  renderBoard();
  scheduleHint("match");
  updateHud();
  ensureAudioContext();
  state.timerId = setInterval(tickTimer, 10);
}

function buildInitialBoard() {
  const minimumPairs = Math.max(1, BOARD_SIZE - state.pool.length);
  for (let attempt = 0; attempt < 30; attempt += 1) {
    const board = [];
    const pairTarget = randomInt(minimumPairs, MIN_MATCH_PAIRS);
    const pairSource = pickCompatiblePairs(state.pool, pairTarget, new Set());
    for (const pair of pairSource) {
      board.push(makeCard(pair, "left"));
      board.push(makeCard(pair, "right"));
    }
    while (board.length < BOARD_SIZE) {
      const card = pickRandomSingle(board, pairSource.map(pair => pair.id));
      if (!card) break;
      board.push(card);
    }
    if (board.length === BOARD_SIZE) return shuffle(board);
  }

  return shuffle(pickCompatiblePairs(state.pool, MIN_MATCH_PAIRS, new Set())
    .flatMap(pair => [makeCard(pair, "left"), makeCard(pair, "right")]));
}

function pickCompatiblePairs(pool, count, usedTerms) {
  const picked = [];
  const pickedCards = [];
  for (const pair of shuffle(pool)) {
    if (picked.length >= count) break;
    if (usedTerms.has(normalize(pair.left)) || usedTerms.has(normalize(pair.right))) continue;
    const leftCard = makeCard(pair, "left");
    const rightCard = makeCard(pair, "right");
    if (!isCardCompatibleWithBoard(pickedCards, leftCard)) continue;
    if (!isCardCompatibleWithBoard(pickedCards.concat(leftCard), rightCard)) continue;
    picked.push(pair);
    pickedCards.push(leftCard, rightCard);
    usedTerms.add(normalize(pair.left));
    usedTerms.add(normalize(pair.right));
  }
  return picked;
}

function pickRandomSingle(board, blockedPairIds = []) {
  const currentPairIds = new Set(board.map(card => card.pairId));
  const options = shuffle(state.pool.flatMap(pair => [
    makeCard(pair, "left"),
    makeCard(pair, "right")
  ])).filter(card => {
    if (!isCardCompatibleWithBoard(board, card)) return false;
    if (blockedPairIds.includes(card.pairId)) return false;
    return !currentPairIds.has(card.pairId);
  });
  return options[0] || null;
}

function makeCard(pair, side) {
  return {
    uid: `${pair.id}-${side}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    pairId: pair.id,
    side,
    text: side === "left" ? pair.left : pair.right
  };
}

function renderBoard() {
  const fragment = document.createDocumentFragment();
  state.boardCards.forEach((card, index) => {
    fragment.appendChild(createCardElement(card, index, true));
  });
  els.board.replaceChildren(fragment);
}

function createCardElement(card, slotIndex, isInitial = false) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "card";
  button.dataset.uid = card.uid;
  button.dataset.pairId = card.pairId;
  button.dataset.side = card.side;
  button.dataset.slot = String(slotIndex);
  button.style.setProperty("--enter-delay", isInitial ? `${slotIndex * 22}ms` : "0ms");
  button.textContent = card.text;
  button.addEventListener("click", () => selectCard(button));
  return button;
}

function renderBoardSlots(indexes) {
  const changedIndexes = [...new Set(indexes)].sort((a, b) => a - b);
  for (const index of changedIndexes) {
    const card = state.boardCards[index];
    if (!card) continue;
    const current = els.board.children[index];
    const replacement = createCardElement(card, index);
    if (current) current.replaceWith(replacement);
    else els.board.appendChild(replacement);
  }
}

function selectCard(cardEl) {
  if (state.feature !== "match" || state.locked || state.timeLeft <= 0) return;
  if (cardEl.classList.contains("selected")) {
    cancelHint();
    cardEl.classList.remove("selected");
    state.selected = state.selected.filter(el => el !== cardEl);
    if (!state.selected.length) state.pickStartedAt = performance.now();
    scheduleHint("match");
    return;
  }
  if (state.selected.length === 0) {
    cancelHint();
    state.pickStartedAt = performance.now();
    scheduleHint("match");
  }
  playMatchSound("select");
  cardEl.classList.add("selected");
  state.selected.push(cardEl);
  if (state.selected.length === 2) checkSelection();
}

function checkSelection() {
  cancelHint();
  state.locked = true;
  const matchSessionId = state.matchSessionId;
  const [first, second] = state.selected;
  const elapsed = performance.now() - state.pickStartedAt;
  const correct = first.dataset.pairId === second.dataset.pairId && first.dataset.side !== second.dataset.side;
  const pair = PAIRS.find(item => item.id === first.dataset.pairId);

  if (correct) {
    const isCombo = state.lastMatchAt && performance.now() - state.lastMatchAt <= COMBO_WINDOW_MS;
    playMatchSound(isCombo ? "combo" : "correct");
    state.combo = isCombo ? state.combo + 1 : 1;
    state.lastMatchAt = performance.now();
    state.matched += 1;
    const points = isCombo ? Math.min(300, 50 + state.combo * 50) : 100;
    state.score += points;
    const bonusSeconds = isCombo ? COMBO_BONUS_SECONDS : MATCH_BONUS_SECONDS;
    state.endAt += bonusSeconds * 1000;
    playImpact(isCombo ? "combo" : "correct", points, bonusSeconds);
    updateRecord(first.dataset.pairId, true, elapsed, elapsed <= COMBO_WINDOW_MS ? "instant" : "sure");
    first.classList.add("good");
    second.classList.add("good");
    els.feedback.textContent = `${pair.left} ↔ ${pair.right} +${points}점 +${isCombo ? COMBO_BONUS_SECONDS : MATCH_BONUS_SECONDS}초`;
    setTimeout(() => refillMatchedCards([first.dataset.uid, second.dataset.uid], matchSessionId), 220);
  } else {
    playMatchSound("wrong");
    playImpact("wrong", -50);
    state.combo = 0;
    state.lastMatchAt = 0;
    state.wrong += 1;
    state.score -= 50;
    updateRecord(first.dataset.pairId, false, elapsed, "wrong");
    updateRecord(second.dataset.pairId, false, elapsed, "wrong");
    first.classList.add("bad");
    second.classList.add("bad");
    els.feedback.textContent = "직접 연결이 아닙니다. -50점";
    setTimeout(() => refillMatchedCards([first.dataset.uid, second.dataset.uid], matchSessionId), 360);
  }

  saveRecords();
  renderWeakList();
  updateHud();
}

function refillMatchedCards(uidList, matchSessionId = state.matchSessionId) {
  if (state.feature !== "match" || state.finished || matchSessionId !== state.matchSessionId) return;
  const removedIndexes = uidList.map(uid => state.boardCards.findIndex(card => card.uid === uid)).filter(index => index >= 0);
  for (const index of removedIndexes) state.boardCards[index] = null;
  const remaining = state.boardCards.filter(Boolean);
  const replacements = getReplacements(remaining, removedIndexes.length);
  for (let i = 0; i < removedIndexes.length; i += 1) {
    state.boardCards[removedIndexes[i]] = replacements[i];
  }
  const guaranteedPairIndex = ensureAtLeastOnePair();
  const changedIndexes = guaranteedPairIndex >= 0
    ? removedIndexes.concat(guaranteedPairIndex)
    : removedIndexes;
  state.selected = [];
  state.locked = false;
  state.pickStartedAt = performance.now();
  renderBoardSlots(changedIndexes);
  scheduleHint("match");
  updateHud();
}

function scheduleHint(feature = state.feature) {
  cancelHint();
  if (!["match", "order", "classify"].includes(feature)) return;
  state.hintTimerId = window.setTimeout(() => {
    state.hintTimerId = null;
    if (state.feature !== feature) return;
    if (feature === "order" && state.orderChecked) return;
    if (["match", "classify"].includes(feature) && (state.finished || state.locked || state.timeLeft <= 0)) return;
    if (feature === "match") showMatchHint();
    if (feature === "order") showOrderHint();
    if (feature === "classify") showClassificationHint();
  }, getHintDelayMs());
}

function cancelHint() {
  if (state.hintTimerId) window.clearTimeout(state.hintTimerId);
  state.hintTimerId = null;
  els.board?.querySelectorAll(".hint-target").forEach(card => card.classList.remove("hint-target"));
  els.orderList?.querySelectorAll(".hint-target").forEach(item => item.classList.remove("hint-target"));
  els.classificationTargets?.querySelectorAll(".hint-eliminated").forEach(button => {
    button.classList.remove("hint-eliminated");
    button.disabled = false;
    button.removeAttribute("aria-label");
  });
}

function showMatchHint() {
  const pairs = new Map();
  for (const card of state.boardCards.filter(Boolean)) {
    if (!pairs.has(card.pairId)) pairs.set(card.pairId, []);
    pairs.get(card.pairId).push(card);
  }
  const playablePairs = [...pairs.values()].filter(cards => (
    cards.some(card => card.side === "left") && cards.some(card => card.side === "right")
  ));
  const selectedPairId = state.selected[0]?.dataset.pairId;
  const playable = playablePairs.find(cards => cards[0]?.pairId === selectedPairId) || playablePairs[0];
  if (!playable) return;
  const selectedSide = state.selected[0]?.dataset.side;
  const target = selectedPairId
    ? playable.find(card => card.pairId === selectedPairId && card.side !== selectedSide)
    : playable[0];
  const hintCard = target || playable[0];
  const element = els.board.querySelector(`[data-uid="${CSS.escape(hintCard.uid)}"]`);
  element?.classList.add("hint-target");
  els.feedback.textContent = `힌트: ‘${hintCard.text}’와 직접 연결되는 카드를 찾아보세요.`;
}

function showOrderHint() {
  const mismatchIndex = state.orderItems.findIndex((item, index) => item.correctIndex !== index);
  if (mismatchIndex < 0) return;
  const target = state.orderItems.find(item => item.correctIndex === mismatchIndex);
  const row = target ? els.orderList.querySelector(`[data-order-id="${CSS.escape(target.id)}"]`) : null;
  row?.classList.add("hint-target");
  els.feedback.textContent = `힌트: ${mismatchIndex + 1}번째 칸 → ‘${target.text}’`;
}

function showClassificationHint() {
  const { card } = state.classificationCurrent || {};
  if (!card) return;
  const wrongTarget = [...els.classificationTargets.querySelectorAll("button")]
    .find(button => button.dataset.classificationLabel !== card.answer);
  if (!wrongTarget) return;
  wrongTarget.disabled = true;
  wrongTarget.classList.add("hint-eliminated");
  wrongTarget.setAttribute("aria-label", `${wrongTarget.textContent}, 힌트로 제외된 선택지`);
  els.feedback.textContent = `힌트: 제외할 선택지는 ‘${wrongTarget.textContent}’입니다.`;
}

function getReplacements(remaining, count) {
  const replacements = [];
  if (!count) return replacements;
  if (countPairsOnBoard(remaining) === 0 && remaining.length) {
    const mate = pickMateForExisting(remaining);
    if (mate) replacements.push(mate);
  }
  while (replacements.length < count) {
    const card = pickAnyCard(remaining.concat(replacements));
    if (!card) break;
    replacements.push(card);
  }
  return replacements;
}

function pickMateForExisting(cards) {
  for (const card of shuffle(cards)) {
    const pair = PAIRS.find(item => item.id === card.pairId);
    if (!pair) continue;
    const mateSide = card.side === "left" ? "right" : "left";
    const mate = makeCard(pair, mateSide);
    if (isCardCompatibleWithBoard(cards, mate)) return mate;
  }
  return null;
}

function pickAnyCard(existing) {
  const options = shuffle(state.pool.flatMap(pair => [makeCard(pair, "left"), makeCard(pair, "right")]))
    .filter(card => isCardCompatibleWithBoard(existing, card));
  return options[0] || null;
}

function isCardCompatibleWithBoard(existing, candidate) {
  const candidateTerm = normalize(candidate.text);
  if (existing.some(card => normalize(card.text) === candidateTerm)) return false;
  return existing.every(card => {
    if (!areDirectlyRelated(card.text, candidate.text)) return true;
    return card.pairId === candidate.pairId && card.side !== candidate.side;
  });
}

function areDirectlyRelated(first, second) {
  return DIRECT_RELATION_KEYS.has(relationKey(first, second));
}

function relationKey(first, second) {
  return [normalize(first), normalize(second)].sort().join("\u0000");
}

function findAmbiguousRelations(cards) {
  const ambiguous = [];
  for (let i = 0; i < cards.length; i += 1) {
    for (let j = i + 1; j < cards.length; j += 1) {
      const first = cards[i];
      const second = cards[j];
      if (!areDirectlyRelated(first.text, second.text)) continue;
      if (first.pairId === second.pairId && first.side !== second.side) continue;
      ambiguous.push(`${first.text} ↔ ${second.text}`);
    }
  }
  return ambiguous;
}

function inspectBoard(cards) {
  const validCards = cards.filter(Boolean);
  const terms = validCards.map(card => normalize(card.text));
  return {
    cardCount: validCards.length,
    pairCount: countPairsOnBoard(validCards),
    duplicateTerms: terms.filter((term, index) => terms.indexOf(term) !== index),
    ambiguousRelations: findAmbiguousRelations(validCards)
  };
}

function ensureAtLeastOnePair() {
  if (countPairsOnBoard(state.boardCards) > 0) return -1;
  const mate = pickMateForExisting(state.boardCards);
  if (!mate) return -1;
  const replaceIndex = state.boardCards.findIndex(card => card.pairId !== mate.pairId);
  if (replaceIndex >= 0) {
    state.boardCards[replaceIndex] = mate;
    return replaceIndex;
  }
  return -1;
}

function countPairsOnBoard(cards) {
  const sides = {};
  for (const card of cards.filter(Boolean)) {
    sides[card.pairId] ||= new Set();
    sides[card.pairId].add(card.side);
  }
  return Object.values(sides).filter(set => set.has("left") && set.has("right")).length;
}

function clearSelection() {
  for (const el of state.selected) el.classList.remove("selected", "bad", "good");
  state.selected = [];
  state.locked = false;
  state.pickStartedAt = performance.now();
  updateHud();
}

function tickTimer() {
  state.timeLeft = Math.max(0, state.endAt - performance.now());
  if (state.timeLeft > 0) {
    const warningSecond = Math.floor(state.timeLeft / 1000);
    if (warningSecond <= 10 && warningSecond !== matchWarningSecond) {
      playMatchSound(warningSecond <= 5 ? "urgent" : "warning");
      if (warningSecond <= 3) vibrate(12);
      matchWarningSecond = warningSecond;
    }
  }
  if (state.timeLeft <= 0) {
    state.timeLeft = 0;
    playMatchSound("timeout");
    vibrate([80, 45, 100]);
    if (state.feature === "classify") finishClassification();
    else finishMatch();
    return;
  }
  updateHud();
}

function finishMatch() {
  if (state.feature !== "match" || state.finished) return;
  state.finished = true;
  matchWarningSecond = -1;
  stopTimer();
  state.locked = true;
  state.selected = [];
  els.board.classList.add("hidden");
  els.resultView.classList.remove("hidden");
  els.resultEyebrow.textContent = "매칭 훈련 종료";
  els.feedback.textContent = "시간 종료";
  els.modeHint.textContent = "결과를 확인하고 바로 다시 시작할 수 있습니다.";
  els.finalScore.textContent = `${state.score}점`;
  els.finalMatched.textContent = state.matched;
  els.leaderboardTitle.textContent = "매칭 훈련 랭킹";
  const result = addLeaderboardEntry("match");
  els.finalRank.textContent = `${result.rank}등`;
  renderLeaderboard("match", result.entry.id);
  updateHud();
}

function finishClassification() {
  if (state.feature !== "classify" || state.finished) return;
  state.finished = true;
  matchWarningSecond = -1;
  stopTimer();
  state.locked = true;
  els.classificationArea.classList.add("hidden");
  els.resultView.classList.remove("hidden");
  els.resultEyebrow.textContent = "분류 훈련 종료";
  els.feedback.textContent = "시간 종료";
  els.modeHint.textContent = "틀린 분류는 다음 게임에서 더 자주 등장합니다.";
  els.finalScore.textContent = `${state.score}점`;
  els.finalMatched.textContent = state.matched;
  els.leaderboardTitle.textContent = "분류 훈련 랭킹";
  const result = addLeaderboardEntry("classify");
  els.finalRank.textContent = `${result.rank}등`;
  renderLeaderboard("classify", result.entry.id);
  updateHud();
}

function addLeaderboardEntry(mode = "match") {
  const entry = {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    score: state.score,
    matched: state.matched,
    mode,
    playedAt: new Date().toISOString()
  };
  state.leaderboard = sortLeaderboard(state.leaderboard.concat(entry));
  saveLeaderboard();
  const rankedMode = sortLeaderboard(state.leaderboard.filter(item => item.mode === mode));
  return {
    entry,
    rank: rankedMode.findIndex(item => item.id === entry.id) + 1
  };
}

function sanitizeLeaderboard(entries) {
  if (!Array.isArray(entries)) return [];
  const sanitized = entries
    .filter(entry => entry && Number.isFinite(Number(entry.score)) && Number.isFinite(Number(entry.matched)))
    .map((entry, index) => ({
      id: String(entry.id || `imported-${index}-${entry.playedAt || "unknown"}`),
      score: Math.round(Number(entry.score)),
      matched: Math.max(0, Math.round(Number(entry.matched))),
      mode: entry.mode === "classify" ? "classify" : "match",
      playedAt: Number.isFinite(Date.parse(entry.playedAt)) ? entry.playedAt : new Date(0).toISOString()
    }));
  return sortLeaderboard(sanitized);
}

function sortLeaderboard(entries) {
  return entries.slice().sort((a, b) => (
    b.score - a.score
    || b.matched - a.matched
    || Date.parse(a.playedAt) - Date.parse(b.playedAt)
  ));
}

function renderLeaderboard(mode = "match", currentEntryId = null, target = els.leaderboardList) {
  const ranked = sortLeaderboard(state.leaderboard.filter(entry => entry.mode === mode));
  if (!ranked.length) {
    target.innerHTML = '<li class="leaderboard-empty">아직 기록이 없습니다.</li>';
    return;
  }

  const currentIndex = ranked.findIndex(entry => entry.id === currentEntryId);
  const visible = ranked.slice(0, LEADERBOARD_VISIBLE_LIMIT).map((entry, index) => ({ entry, rank: index + 1 }));
  if (currentIndex >= LEADERBOARD_VISIBLE_LIMIT) {
    visible.push({ separator: true });
    visible.push({ entry: ranked[currentIndex], rank: currentIndex + 1 });
  }

  target.innerHTML = visible.map(item => {
    if (item.separator) return '<li class="leaderboard-separator" aria-hidden="true">···</li>';
    const isCurrent = item.entry.id === currentEntryId;
    return `<li class="leaderboard-item${isCurrent ? " current" : ""}">`
      + `<strong>${item.rank}등</strong>`
      + `<span>${item.entry.score.toLocaleString("ko-KR")}점</span>`
      + `<span>${item.entry.matched}개</span>`
      + `</li>`;
  }).join("");
}

function retryCurrentFeature() {
  if (state.feature === "classify") startClassification();
  else startMatch();
}

function stopTimer() {
  if (state.timerId) clearInterval(state.timerId);
  state.timerId = null;
  cancelHint();
}

function getHintDelayMs() {
  const testDelay = Number(new URLSearchParams(location.search).get("testHintMs"));
  if (Number.isFinite(testDelay) && testDelay >= 20) return testDelay;
  return HINT_DELAY_MS;
}

function updateRecord(pairId, correct, elapsed, bucket) {
  const record = getRecord(pairId);
  record.attempts += 1;
  record.lastSeen = new Date().toISOString();
  if (correct) {
    record.correct += 1;
    record[bucket] += 1;
    record.streak += 1;
    const seconds = elapsed / 1000;
    record.averageTime = record.correct === 1
      ? seconds
      : Number((((record.averageTime * (record.correct - 1)) + seconds) / record.correct).toFixed(2));
  } else {
    record.wrong += 1;
    record.streak = 0;
  }
  record.mastery = calculateMastery(record);
}

function calculateMastery(record) {
  const accuracy = record.attempts ? record.correct / record.attempts : 0;
  const speedScore = record.correct ? ((record.instant * 1) + (record.sure * .75) + (record.slow * .45) + (record.weak * .2)) / record.correct : 0;
  const streakScore = Math.min(record.streak, 5) / 5;
  const wrongPenalty = Math.min(35, record.wrong * 8);
  return Math.max(0, Math.min(100, Math.round(accuracy * 45 + speedScore * 40 + streakScore * 15 - wrongPenalty)));
}

function isWeakPair(pair) {
  const record = state.records[pair.id];
  if (!record) return false;
  return record.wrong > 0 || record.mastery < 70 || record.averageTime > 6;
}

function weightedPairs(list) {
  return list.slice().sort((a, b) => getWeight(b) - getWeight(a));
}

function getWeight(pair) {
  const priority = { S: 90, A: 65, B: 35, C: 15 }[pair.priority] || 20;
  const record = state.records[pair.id];
  const weak = record ? Math.max(0, 100 - record.mastery) + record.wrong * 15 : 30;
  const hard = els.difficulty.value === "hard" ? sameEraDensity(pair) : 0;
  const easy = els.difficulty.value === "easy" ? Math.random() * 80 : 0;
  return priority + weak + hard + easy + Math.random();
}

function sameEraDensity(pair) {
  return PAIRS.filter(other => other.era === pair.era && other.priority !== "C").length;
}

function updateHud() {
  els.score.textContent = state.score;
  els.combo.textContent = state.combo;
  els.timeLeft.textContent = ["study", "order"].includes(state.feature) ? "∞" : formatTime(state.timeLeft);
  const timedFeature = ["match", "classify"].includes(state.feature);
  els.timerBox.classList.toggle("danger", timedFeature && state.timeLeft <= 10000);
  els.timerBox.classList.toggle("urgent", timedFeature && state.timeLeft <= 5000);
  if (state.feature === "match") {
    els.result.innerHTML = [
      `성공 ${state.matched}쌍`,
      `오답 ${state.wrong}회`,
      `현재 점수 ${state.score}점`,
      `보드 내 정답 ${countPairsOnBoard(state.boardCards)}쌍`
    ].join("<br>");
  } else if (state.feature === "study") {
    els.result.innerHTML = [
      `확인 ${state.matched}개`,
      `다시 볼 카드 ${state.wrong}개`,
      `점수 ${state.score}점`
    ].join("<br>");
  } else if (state.feature === "order") {
    els.result.innerHTML = [
      `완료 ${state.matched}개`,
      `오답 ${state.wrong}회`,
      `점수 ${state.score}점`
    ].join("<br>");
  } else if (state.feature === "classify") {
    els.result.innerHTML = [
      `정답 ${state.matched}개`,
      `오답 ${state.wrong}회`,
      `점수 ${state.score}점`
    ].join("<br>");
  }
}

function formatTime(ms) {
  const safe = Math.max(0, Math.ceil(ms / 10));
  const minutes = Math.floor(safe / 6000);
  const seconds = Math.floor((safe % 6000) / 100);
  const centiseconds = safe % 100;
  return `${pad2(minutes)}:${pad2(seconds)}:${pad2(centiseconds)}`;
}

function pad2(value) {
  return String(value).padStart(2, "0");
}

function getInitialTimeMs() {
  const testSeconds = Number(new URLSearchParams(location.search).get("testSeconds"));
  if (Number.isFinite(testSeconds) && testSeconds > 0) return testSeconds * 1000;
  return START_MS;
}

function renderWeakList() {
  const weak = PAIRS
    .map(pair => ({ pair, record: state.records[pair.id] }))
    .filter(item => item.record && (item.record.mastery < 75 || item.record.wrong > 0 || item.record.averageTime > 6))
    .sort((a, b) => a.record.mastery - b.record.mastery || b.record.wrong - a.record.wrong)
    .slice(0, 10);

  if (!weak.length) {
    els.weakList.textContent = "기록이 쌓이면 여기에 표시됩니다.";
    return;
  }

  els.weakList.innerHTML = weak.map(({ pair, record }) => (
    `<div class="weak-item"><strong>${escapeHtml(pair.left)} ↔ ${escapeHtml(pair.right)}</strong><span>${record.mastery}점</span></div>`
  )).join("");
}

function exportRecords() {
  const payload = JSON.stringify({
    schemaVersion: 4,
    app: "한능검 매치",
    exportedAt: new Date().toISOString(),
    records: state.records,
    orderRecords: state.orderRecords,
    classificationRecords: state.classificationRecords,
    leaderboard: state.leaderboard
  }, null, 2);
  els.jsonBox.value = payload;
  const blob = new Blob([payload], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `한능검-매치-기록-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
  showNotice("학습 기록을 내보냈습니다.");
}

function importRecords(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(reader.result);
      const importedRecords = parsed.records || parsed;
      if (!importedRecords || typeof importedRecords !== "object" || Array.isArray(importedRecords)) {
        throw new Error("Invalid records");
      }
      state.records = sanitizeRecords(importedRecords);
      if (parsed.orderRecords && typeof parsed.orderRecords === "object" && !Array.isArray(parsed.orderRecords)) {
        state.orderRecords = sanitizeOrderRecords(parsed.orderRecords);
        saveOrderRecords();
      }
      if (parsed.classificationRecords && typeof parsed.classificationRecords === "object" && !Array.isArray(parsed.classificationRecords)) {
        state.classificationRecords = sanitizeClassificationRecords(parsed.classificationRecords);
        saveClassificationRecords();
      }
      if (Array.isArray(parsed.leaderboard)) {
        state.leaderboard = sanitizeLeaderboard(parsed.leaderboard);
        saveLeaderboard();
      }
      saveRecords();
      updateHomeSummary();
      renderWeakList();
      els.feedback.textContent = "기록을 가져왔습니다.";
      showNotice("학습 기록을 가져왔습니다.");
    } catch {
      els.feedback.textContent = "JSON 형식이 맞지 않습니다.";
      showNotice("가져올 수 없는 JSON 파일입니다.", "error");
    }
  };
  reader.readAsText(file);
  event.target.value = "";
}

function resetRecords() {
  if (!confirm("학습 기록을 모두 지울까요?")) return;
  state.records = {};
  state.orderRecords = {};
  state.classificationRecords = {};
  state.leaderboard = [];
  saveRecords();
  saveOrderRecords();
  saveClassificationRecords();
  saveLeaderboard();
  updateHomeSummary();
  renderWeakList();
  els.jsonBox.value = "";
  showNotice("학습 기록을 초기화했습니다.");
}

function normalize(text) {
  return String(text).replace(/\s+/g, " ").trim();
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(items) {
  const copy = items.slice();
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

window.__HANNEUNG_TEST__ = {
  simulateBoards(iterations = 1000) {
    const failures = [];
    state.pool = weightedPairs(getPool());
    for (let i = 0; i < iterations; i += 1) {
      state.boardCards = buildInitialBoard();
      const inspection = inspectBoard(state.boardCards);
      if (inspection.cardCount !== BOARD_SIZE || inspection.pairCount < 1 || inspection.pairCount > 4 || inspection.duplicateTerms.length || inspection.ambiguousRelations.length) {
        failures.push({ ...inspection, cards: state.boardCards });
        break;
      }
    }
    return { iterations, failures };
  },
  simulateRefills(iterations = 1000, refillsPerBoard = 20) {
    const failures = [];
    state.pool = weightedPairs(getPool());
    for (let i = 0; i < iterations; i += 1) {
      state.boardCards = buildInitialBoard();
      for (let step = 0; step < refillsPerBoard; step += 1) {
        const removedIndexes = shuffle([...Array(BOARD_SIZE).keys()]).slice(0, 2);
        for (const index of removedIndexes) state.boardCards[index] = null;
        const remaining = state.boardCards.filter(Boolean);
        const replacements = getReplacements(remaining, removedIndexes.length);
        for (let j = 0; j < removedIndexes.length; j += 1) {
          state.boardCards[removedIndexes[j]] = replacements[j];
        }
        ensureAtLeastOnePair();
        const inspection = inspectBoard(state.boardCards);
        if (inspection.cardCount !== BOARD_SIZE || inspection.pairCount < 1 || inspection.duplicateTerms.length || inspection.ambiguousRelations.length) {
          failures.push({ iteration: i, step, ...inspection, cards: state.boardCards });
          return { iterations, refillsPerBoard, failures };
        }
      }
    }
    return { iterations, refillsPerBoard, failures };
  },
  forceDangerAndFinish() {
    state.timeLeft = 9950;
    state.endAt = performance.now() + 9950;
    updateHud();
    const dangerClass = els.timerBox.className;
    state.endAt = performance.now() - 1;
    tickTimer();
    return {
      dangerClass,
      resultVisible: !els.resultView.classList.contains("hidden"),
      boardHidden: els.board.classList.contains("hidden"),
      finalScore: els.finalScore.textContent,
      finalMatched: els.finalMatched.textContent,
      finalRank: els.finalRank.textContent,
      leaderboardRows: els.leaderboardList.children.length,
      retryText: document.getElementById("retryBtn").textContent,
      timeText: els.timeLeft.textContent
    };
  }
};
