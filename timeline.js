try {
  document.documentElement.dataset.theme = localStorage.getItem("historyMatchingTheme.v1") || "light";
} catch {
  document.documentElement.dataset.theme = "light";
}

const THEME_KEY = "historyMatchingTheme.v1";
const { LANES, COLORS, COLUMNS } = window.TIMELINE_DATA;

const track = document.getElementById("timelineTrack");
const viewport = document.getElementById("timelineViewport");
const progress = document.getElementById("progressBar");
const currentEra = document.getElementById("currentEra");
const nav = document.getElementById("eraNav");
const laneMain = document.getElementById("laneMain");
const laneBranch = document.getElementById("laneBranch");
const laneSouth = document.getElementById("laneSouth");
const laneMainBox = document.getElementById("laneMainBox");
const laneBranchBox = document.getElementById("laneBranchBox");
const laneSouthBox = document.getElementById("laneSouthBox");

function nodeWidth(node) {
  if (node.kind === "milestone") return 116;
  if (!node.important) return 64;
  return node.notes?.length ? 212 : 108;
}

function chainWidth(nodes, offset = 0) {
  if (!nodes?.length) return 0;
  return offset + nodes.reduce((total, node) => total + nodeWidth(node), 0) + Math.max(0, nodes.length - 1) * 12 + 32;
}

function nodeSpanWidth(nodes) {
  if (!nodes?.length) return 0;
  return nodes.reduce((total, node) => total + nodeWidth(node), 0) + Math.max(0, nodes.length - 1) * 12;
}

function estimateEraWidth(column) {
  return Math.max(column.width, ...LANES.map((lane) => chainWidth(column.lanes?.[lane.key] || [], column.laneOffsets?.[lane.key] || 0)));
}

function parseNodeYear(node) {
  if (Number.isFinite(node.year)) return node.year;
  const text = `${node.date || ""} ${node.name || ""}`;
  const match = text.match(/(\d{3,4})/);
  return match ? Number(match[1]) : null;
}

function scaledNodes(nodes, scale, width) {
  const leftPad = 28;
  const rightPad = 132;
  const usable = Math.max(1, width - leftPad - rightPad);
  const span = Math.max(1, scale.end - scale.start);
  const placed = nodes.map((node, index) => {
    const year = parseNodeYear(node);
    const raw = year == null ? leftPad + index * 96 : leftPad + ((year - scale.start) / span) * usable;
    const maxLeft = Math.max(leftPad, width - nodeWidth(node) - 32);
    return { node, x: Math.max(leftPad, Math.min(maxLeft, raw)) };
  });
  placed.sort((a, b) => a.x - b.x);
  for (let index = 1; index < placed.length; index += 1) {
    const minGap = nodeWidth(placed[index - 1].node) + 12;
    if (placed[index].x < placed[index - 1].x + minGap) placed[index].x = placed[index - 1].x + minGap;
  }
  if (placed.length) placed.at(-1).x = Math.min(placed.at(-1).x, width - nodeWidth(placed.at(-1).node) - 32);
  for (let index = placed.length - 2; index >= 0; index -= 1) {
    const minGap = nodeWidth(placed[index].node) + 12;
    const maxX = placed[index + 1].x - minGap;
    if (placed[index].x > maxX) placed[index].x = maxX;
  }
  if (placed.length && placed[0].x < leftPad) {
    const shift = leftPad - placed[0].x;
    placed.forEach((item) => {
      item.x += shift;
    });
  }
  placed.sort((a, b) => nodes.indexOf(a.node) - nodes.indexOf(b.node));
  return placed;
}

function syncLaneLabels(labels, colors) {
  [laneMain, laneBranch, laneSouth].forEach((label, index) => {
    label.textContent = labels[index] || "—";
  });
  [laneMainBox, laneBranchBox, laneSouthBox].forEach((box, index) => {
    box.style.setProperty("--lane-color", colors[index] || "var(--line-strong)");
  });
}

function isConflict(note) {
  return /(전쟁|전투|대첩|왜란|호란|정벌|침입 격퇴|항쟁|황산벌|매소성|기벌포|한성 함락|평양성)/.test(note);
}

function renderAchievement(note) {
  const tag = isConflict(note) ? `<i class="event-tag conflict" title="전쟁·전투" aria-label="전쟁·전투"></i>` : "";
  return `<span class="achievement-node${tag ? " tagged" : ""}">${tag}<span>${note}</span></span>`;
}

function renderNode(node) {
  const date = node.date ? `<small>${node.date}</small>` : "";
  const branches = node.notes?.length ? `<div class="achievement-branch">${node.notes.map(renderAchievement).join("")}</div>` : "";
  if (!node.important) {
    return `<div class="king-unit minor ${node.nation}" data-node-id="${node.id}"><div class="king-node minor">${node.name}</div></div>`;
  }
  if (node.kind === "milestone") {
    return `<div class="king-unit milestone ${node.nation}" data-node-id="${node.id}"><div class="king-node milestone">${date}<span>${node.name}</span></div>${branches}</div>`;
  }
  return `<div class="king-unit ${node.nation}" data-node-id="${node.id}"><div class="king-node key${node.date ? " dated" : ""}">${date}<span>${node.name}</span></div>${branches}</div>`;
}

function axisInset(node) {
  if (!node.important) return 32;
  if (node.kind === "milestone") return 58;
  return node.notes?.length ? 106 : 44;
}

function shouldConnect(left, right, laneKey) {
  if (!left || !right) return false;
  if (!left.lanes?.[laneKey]?.length || !right.lanes?.[laneKey]?.length) return false;
  if (left.connect?.[laneKey] === false || right.connect?.[laneKey] === false) return false;
  if (left.breakAfter?.[laneKey] || right.breakBefore?.[laneKey]) return false;
  return true;
}

function hasTransitionAfter(position, laneKey) {
  const column = COLUMNS[position];
  if (!column?.transitionAfter?.[laneKey]) return false;
  return COLUMNS.slice(position + 1).some((next) => next.transitionBefore?.[laneKey] && next.lanes?.[laneKey]?.length);
}

function hasTransitionBefore(position, laneKey) {
  const column = COLUMNS[position];
  if (!column?.transitionBefore?.[laneKey]) return false;
  return COLUMNS.slice(0, position).some((prev) => prev.transitionAfter?.[laneKey] && prev.lanes?.[laneKey]?.length);
}

function isTransitionBridge(position, laneKey) {
  const column = COLUMNS[position];
  if (column.lanes?.[laneKey]?.length) return false;
  const hasLeft = COLUMNS.slice(0, position).some((prev) => prev.transitionAfter?.[laneKey] && prev.lanes?.[laneKey]?.length);
  const hasRight = COLUMNS.slice(position + 1).some((next) => next.transitionBefore?.[laneKey] && next.lanes?.[laneKey]?.length);
  return hasLeft && hasRight;
}

function renderChain(column, laneKey, position) {
  const nodes = column.lanes?.[laneKey] || [];
  if (!nodes.length) return "";
  const left = COLUMNS[position - 1];
  const right = COLUMNS[position + 1];
  const connectLeft = shouldConnect(left, column, laneKey);
  const connectRight = shouldConnect(column, right, laneKey);
  if (column.scale) return renderScaledChain(column, laneKey, nodes, connectLeft, connectRight);
  const transitionLeft = hasTransitionBefore(position, laneKey);
  const transitionRight = hasTransitionAfter(position, laneKey);
  const isolated = nodes.every((node) => node.isolated);
  const hasAxis = !isolated && (nodes.length > 1 || connectLeft || connectRight || transitionLeft || transitionRight);
  const leadOffset = column.laneOffsets?.[laneKey] || 0;
  const classes = ["king-chain"];
  if (hasAxis) classes.push("has-axis");
  if (connectLeft) classes.push("connect-left");
  if (connectRight) classes.push("connect-right");
  if (transitionLeft) classes.push("transition-left");
  if (transitionRight) classes.push("transition-right");
  const spanWidth = nodeSpanWidth(nodes);
  const axisStart = axisInset(nodes[0]);
  const axisEndX = Math.max(axisStart, spanWidth - axisInset(nodes.at(-1)));
  const style = `--axis-start:${axisStart}px;--axis-end-x:${axisEndX}px;--axis-end-gap:calc(100% - ${axisEndX}px);--lead-offset:${leadOffset}px`;
  return `<div class="${classes.join(" ")}" style="${style}"><span class="axis-transition left" aria-hidden="true"></span><span class="axis-transition right" aria-hidden="true"></span>${nodes.map(renderNode).join("")}</div>`;
}

function renderScaledChain(column, laneKey, nodes, connectLeft, connectRight) {
  const width = estimateEraWidth(column);
  const placed = scaledNodes(nodes, column.scale, width);
  const axisStart = placed[0]?.x + axisInset(placed[0].node) || 44;
  const last = placed.at(-1);
  const axisEndX = last ? last.x + nodeWidth(last.node) - axisInset(last.node) : axisStart;
  const style = `--axis-start:${axisStart}px;--axis-end-gap:calc(100% - ${axisEndX}px)`;
  const classes = ["king-chain", "scaled", "has-axis"];
  if (connectLeft) classes.push("connect-left");
  if (connectRight) classes.push("connect-right");
  return `<div class="${classes.join(" ")}" style="${style}">${placed.map(({ node, x }) => `<div class="scaled-unit" style="left:${x}px">${renderNode(node)}</div>`).join("")}</div>`;
}

function renderTimeline() {
  track.innerHTML = "";
  nav.innerHTML = "";
  COLUMNS.forEach((column, position) => {
    const section = document.createElement("section");
    section.className = "era-column";
    section.style.setProperty("--width", `${estimateEraWidth(column)}px`);
    section.style.setProperty("--era-color", column.color);
    section.dataset.index = String(position);
    if (column.id) section.id = `era-${column.id}`;
    section.innerHTML = `<header class="era-head"><strong>${column.title}</strong><small>${column.date}</small></header>` + LANES.map((lane) => {
      const graph = renderChain(column, lane.key, position);
      const bridge = !graph && isTransitionBridge(position, lane.key) ? `<span class="axis-transition bridge" aria-hidden="true"></span>` : "";
      return `<div class="timeline-cell ${graph || bridge ? "" : "inactive"}" data-lane="${lane.key}">${graph}${bridge}</div>`;
    }).join("");
    track.appendChild(section);
    if (column.nav && column.id) {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = column.nav;
      button.dataset.target = column.id;
      button.addEventListener("click", () => scrollToEra(column.id));
      nav.appendChild(button);
    }
  });
}

function scrollToEra(id) {
  const target = document.getElementById(`era-${id}`);
  if (!target) return;
  viewport.scrollTo({ left: target.offsetLeft, behavior: "smooth" });
}

function updatePosition() {
  const max = viewport.scrollWidth - viewport.clientWidth;
  progress.style.width = `${max > 0 ? viewport.scrollLeft / max * 100 : 0}%`;
  let active = COLUMNS[0];
  let activeColumn = null;
  [...track.children].forEach((column) => {
    if (column.offsetLeft <= viewport.scrollLeft + viewport.clientWidth * 0.28) activeColumn = column;
  });
  [...track.children].forEach((column) => column.classList.toggle("current", column === activeColumn));
  if (activeColumn) active = COLUMNS[Number(activeColumn.dataset.index)];
  currentEra.textContent = active.title;
  const colors = LANES.map((lane) => COLORS[active.lanes?.[lane.key]?.[0]?.nation] || "var(--line-strong)");
  syncLaneLabels(active.labels, colors);
  let activeNavButton = null;
  [...nav.children].forEach((button) => {
    const target = document.getElementById(`era-${button.dataset.target}`);
    if (target && target.offsetLeft <= viewport.scrollLeft + viewport.clientWidth * 0.28) activeNavButton = button;
  });
  [...nav.children].forEach((button) => {
    const selected = button === activeNavButton;
    button.classList.toggle("active", selected);
    button.setAttribute("aria-current", selected ? "true" : "false");
  });
}

renderTimeline();
viewport.addEventListener("scroll", () => {
  updatePosition();
}, { passive: true });
viewport.addEventListener("wheel", (event) => {
  if (!event.shiftKey || Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
  viewport.scrollLeft += event.deltaY;
  event.preventDefault();
}, { passive: false });
let dragStart = 0;
let scrollStart = 0;
let dragging = false;
viewport.addEventListener("pointerdown", (event) => {
  if (event.button !== 0) return;
  dragging = true;
  dragStart = event.clientX;
  scrollStart = viewport.scrollLeft;
  viewport.classList.add("dragging");
  viewport.setPointerCapture(event.pointerId);
});
viewport.addEventListener("pointermove", (event) => {
  if (dragging) viewport.scrollLeft = scrollStart - (event.clientX - dragStart);
});
const stopDrag = () => {
  dragging = false;
  viewport.classList.remove("dragging");
};
viewport.addEventListener("pointerup", stopDrag);
viewport.addEventListener("pointercancel", stopDrag);
viewport.addEventListener("keydown", (event) => {
  if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
  viewport.scrollBy({ left: (event.key === "ArrowLeft" ? -1 : 1) * viewport.clientWidth * 0.45, behavior: "smooth" });
  event.preventDefault();
});
document.getElementById("prevBtn").addEventListener("click", () => viewport.scrollBy({ left: -viewport.clientWidth * 0.78, behavior: "smooth" }));
document.getElementById("nextBtn").addEventListener("click", () => viewport.scrollBy({ left: viewport.clientWidth * 0.78, behavior: "smooth" }));
document.getElementById("resetViewBtn").addEventListener("click", () => scrollToEra("prehistory"));

const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");
function syncTheme() {
  const light = document.documentElement.dataset.theme === "light";
  themeIcon.textContent = light ? "☾" : "☀";
  const label = light ? "다크" : "라이트";
  themeToggle.setAttribute("aria-label", `${label} 모드로 전환`);
  themeToggle.title = `${label} 모드로 전환`;
  document.querySelector('meta[name="theme-color"]').content = light ? "#f5f7f8" : "#0f151c";
}
themeToggle.addEventListener("click", () => {
  const next = document.documentElement.dataset.theme === "light" ? "dark" : "light";
  document.documentElement.dataset.theme = next;
  try {
    localStorage.setItem(THEME_KEY, next);
  } catch {}
  syncTheme();
});
syncTheme();
updatePosition();
