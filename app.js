const SIZE = 9;
const CYCLE_SECONDS = 20000;
const HULL_MAX_HEAT = 10000;

const COMPONENTS = {
  fuel1: { id: "fuel1", group: "燃料", name: "单联铀棒", symbol: "U1", type: "fuel", rods: 1 },
  fuel2: { id: "fuel2", group: "燃料", name: "双联铀棒", symbol: "U2", type: "fuel", rods: 2 },
  fuel4: { id: "fuel4", group: "燃料", name: "四联铀棒", symbol: "U4", type: "fuel", rods: 4 },

  reflector: { id: "reflector", group: "反射板", name: "中子反射板", symbol: "NR", type: "reflector", maxDamage: 30000 },
  thickReflector: { id: "thickReflector", group: "反射板", name: "加厚中子反射板", symbol: "TNR", type: "reflector", maxDamage: 120000 },
  iridiumReflector: { id: "iridiumReflector", group: "反射板", name: "铱中子反射板", symbol: "INR", type: "reflector", maxDamage: Infinity },

  heatVent: { id: "heatVent", group: "散热器", name: "散热器", symbol: "HV", type: "vent", self: 6, hull: 0, maxHeat: 1000 },
  advancedVent: { id: "advancedVent", group: "散热器", name: "高级散热器", symbol: "AHV", type: "vent", self: 12, hull: 0, maxHeat: 1000 },
  reactorVent: { id: "reactorVent", group: "散热器", name: "反应堆散热器", symbol: "RHV", type: "vent", self: 5, hull: 5, maxHeat: 1000 },
  overclockedVent: { id: "overclockedVent", group: "散热器", name: "超频散热器", symbol: "OCV", type: "vent", self: 20, hull: 36, maxHeat: 1000 },
  componentVent: { id: "componentVent", group: "散热器", name: "元件散热器", symbol: "CHV", type: "componentVent", self: 0, hull: 0, maxHeat: 1000 },

  exchanger: { id: "exchanger", group: "换热器", name: "换热器", symbol: "HX", type: "exchanger", near: 12, hull: 4, maxHeat: 2500 },
  advancedExchanger: { id: "advancedExchanger", group: "换热器", name: "高级换热器", symbol: "AHX", type: "exchanger", near: 24, hull: 8, maxHeat: 10000 },
  reactorExchanger: { id: "reactorExchanger", group: "换热器", name: "反应堆换热器", symbol: "RHX", type: "exchanger", near: 0, hull: 72, maxHeat: 5000 },
  componentExchanger: { id: "componentExchanger", group: "换热器", name: "元件换热器", symbol: "CHX", type: "exchanger", near: 36, hull: 0, maxHeat: 5000 },

  reactorPlating: { id: "reactorPlating", group: "隔板", name: "反应堆隔板", symbol: "RP", type: "plating", hullBonus: 1000 },
  containmentPlating: { id: "containmentPlating", group: "隔板", name: "安全反应堆隔板", symbol: "CP", type: "plating", hullBonus: 500 },
  heatCapacityPlating: { id: "heatCapacityPlating", group: "隔板", name: "热容反应堆隔板", symbol: "HP", type: "plating", hullBonus: 1700 },

  rshCondensator: { id: "rshCondensator", group: "冷凝模块", name: "红石冷凝模块", symbol: "RSH", type: "condensator", maxDamage: 20000 },
  lzhCondensator: { id: "lzhCondensator", group: "冷凝模块", name: "青金石冷凝模块", symbol: "LZH", type: "condensator", maxDamage: 100000 }
};

const DESCRIPTIONS = {
  fuel1: "5-25 EU/t，4-60 hU/s",
  fuel2: "20-60 EU/t，24-168 hU/s",
  fuel4: "60-140 EU/t，96-448 hU/s",
  reflector: "30000 耐久",
  thickReflector: "120000 耐久",
  iridiumReflector: "无限耐久",
  heatVent: "自身 -6，容量 1000",
  advancedVent: "自身 -12，容量 1000",
  reactorVent: "堆体 -5，自身 -5",
  overclockedVent: "堆体 -36，自身 -20",
  componentVent: "相邻元件各 -4",
  exchanger: "相邻 12，堆体 4",
  advancedExchanger: "相邻 24，堆体 8",
  reactorExchanger: "堆体 72，容量 5000",
  componentExchanger: "相邻 36，容量 5000",
  reactorPlating: "堆体容量 +1000",
  containmentPlating: "堆体容量 +500",
  heatCapacityPlating: "堆体容量 +1700",
  rshCondensator: "吸收 20000 hU",
  lzhCondensator: "吸收 100000 hU"
};

const ICON_URLS = {
  fuel1: "https://ftbwiki.org/images/5/51/Grid_Fuel_Rod_%28Uranium%29.png",
  fuel2: "https://ftbwiki.org/images/0/05/Grid_Dual_Fuel_Rod_%28Uranium%29.png",
  fuel4: "https://ftbwiki.org/images/8/8a/Grid_Quad_Fuel_Rod_%28Uranium%29.png",
  reflector: "https://ftbwiki.org/images/2/2f/Grid_Neutron_Reflector.png",
  thickReflector: "https://ftbwiki.org/images/2/23/Grid_Thick_Neutron_Reflector.png",
  iridiumReflector: "https://ftbwiki.org/images/8/80/Grid_Iridium_Neutron_Reflector_%28GregTech_5%29.png",
  heatVent: "https://ftbwiki.org/images/f/ff/Grid_Heat_Vent.png",
  advancedVent: "https://ftbwiki.org/images/9/94/Grid_Advanced_Heat_Vent.png",
  reactorVent: "https://ftbwiki.org/images/6/6b/Grid_Reactor_Heat_Vent.png",
  overclockedVent: "https://ftbwiki.org/images/6/68/Grid_Overclocked_Heat_Vent.png",
  componentVent: "https://ftbwiki.org/images/2/28/Grid_Component_Heat_Vent.png",
  exchanger: "https://ftbwiki.org/images/3/35/Grid_Heat_Exchanger_%28IndustrialCraft_2%29.png",
  advancedExchanger: "https://ftbwiki.org/images/5/52/Grid_Advanced_Heat_Exchanger.png",
  reactorExchanger: "https://ftbwiki.org/images/4/46/Grid_Reactor_Heat_Exchanger.png",
  componentExchanger: "https://ftbwiki.org/images/6/61/Grid_Component_Heat_Exchanger.png",
  reactorPlating: "https://ftbwiki.org/images/f/fa/Grid_Reactor_Plating.png",
  containmentPlating: "https://ftbwiki.org/images/0/07/Grid_Containment_Reactor_Plating.png",
  heatCapacityPlating: "https://ftbwiki.org/images/c/c4/Grid_Heat-Capacity_Reactor_Plating.png",
  rshCondensator: "https://ftbwiki.org/images/3/3e/Grid_RSH-Condensator.png",
  lzhCondensator: "https://ftbwiki.org/images/9/9d/Grid_LZH-Condensator.png"
};

function itemIcon(id, className = "item-icon") {
  const def = COMPONENTS[id];
  const src = ICON_URLS[id] || `./assets/wiki/${id}.png`;
  return `<img class="${className}" src="${src}" alt="${def.name}" loading="lazy" decoding="async">`;
}

const state = {
  layout: Array(SIZE * SIZE).fill(null),
  selectedTool: "inspect",
  selectedCell: null,
  timeline: null,
  currentSecond: 0,
  paletteView: "grid"
};

const gridEl = document.getElementById("grid");
const paletteEl = document.getElementById("palette");
const timeSlider = document.getElementById("timeSlider");
const layoutCode = document.getElementById("layoutCode");

function indexOf(row, col) {
  return row * SIZE + col;
}

function rowCol(index) {
  return { row: Math.floor(index / SIZE), col: index % SIZE };
}

function neighbors(index) {
  const { row, col } = rowCol(index);
  const result = [];
  if (col > 0) result.push(indexOf(row, col - 1));
  if (col < SIZE - 1) result.push(indexOf(row, col + 1));
  if (row < SIZE - 1) result.push(indexOf(row + 1, col));
  if (row > 0) result.push(indexOf(row - 1, col));
  return result;
}

function cloneItems(layout) {
  return layout.map((id) => {
    if (!id) return null;
    const def = COMPONENTS[id];
    return {
      id,
      heat: 0,
      damage: 0,
      burn: 0,
      melted: false,
      maxHeat: def.maxHeat || 0,
      maxDamage: def.maxDamage || 0,
      lastEu: 0,
      lastHeat: 0,
      lastCooling: 0,
      lastHullPull: 0,
      lastComponentCooling: 0,
      lastExchange: 0,
      lastReceivedHeat: 0
    };
  });
}

function hullMaxHeat(items) {
  return HULL_MAX_HEAT + items.reduce((sum, item) => {
    if (!item || item.melted) return sum;
    return sum + (COMPONENTS[item.id].hullBonus || 0);
  }, 0);
}

function canAcceptHeat(item) {
  if (!item || item.melted) return false;
  const def = COMPONENTS[item.id];
  if (def.type === "condensator") return Number.isFinite(def.maxDamage) && item.damage < def.maxDamage;
  return Number.isFinite(def.maxHeat) && def.maxHeat > 0 && def.type !== "componentVent";
}

function addHeatToItem(item, amount) {
  if (!item || amount <= 0) return amount;
  const def = COMPONENTS[item.id];
  if (!canAcceptHeat(item)) return amount;
  if (def.type === "condensator") {
    const space = def.maxDamage - item.damage;
    const accepted = Math.max(0, Math.min(space, amount));
    item.damage += accepted;
    item.lastReceivedHeat += accepted;
    if (item.damage >= def.maxDamage) item.melted = true;
    return amount - accepted;
  }
  const space = def.maxHeat - item.heat;
  const accepted = Math.max(0, Math.min(space, amount));
  item.heat += accepted;
  item.lastReceivedHeat += accepted;
  if (item.heat >= def.maxHeat) item.melted = true;
  return amount - accepted;
}

function distributeHeat(items, hull, sourceIndex, amount) {
  const targets = neighbors(sourceIndex).filter((idx) => canAcceptHeat(items[idx]));
  if (targets.length === 0) {
    hull.heat += amount;
    return;
  }

  const baseShare = Math.floor(amount / targets.length);
  let remainder = amount % targets.length;
  let overflow = 0;

  for (const target of targets) {
    const share = baseShare + (remainder > 0 ? 1 : 0);
    if (remainder > 0) remainder -= 1;
    overflow += addHeatToItem(items[target], share);
  }

  hull.heat += overflow;
}

function fuelStats(items, index) {
  const fuel = COMPONENTS[items[index].id];
  const internalPulses = fuel.rods === 1 ? 1 : fuel.rods === 2 ? 2 : 3;
  let externalPulses = 0;
  for (const n of neighbors(index)) {
    const other = items[n];
    if (!other || other.melted) continue;
    const otherDef = COMPONENTS[other.id];
    if (otherDef.type === "fuel") externalPulses += 1;
    if (otherDef.type === "reflector") externalPulses += 1;
  }
  const pulsesPerRod = internalPulses + externalPulses;
  return {
    eu: fuel.rods * pulsesPerRod * 5,
    heat: fuel.rods * 2 * pulsesPerRod * (pulsesPerRod + 1)
  };
}

function exchangeWithHull(item, def, hull) {
  if (!def.hull || !canAcceptHeat(item)) return 0;
  const total = item.heat + hull.heat;
  const desiredItemHeat = Math.round(total * (def.maxHeat / (def.maxHeat + hull.maxHeat)));
  const delta = Math.max(-def.hull, Math.min(def.hull, desiredItemHeat - item.heat));
  if (delta > 0) {
    const moved = Math.min(delta, hull.heat, def.maxHeat - item.heat);
    item.heat += moved;
    hull.heat -= moved;
    return moved;
  }
  if (delta < 0) {
    const moved = Math.min(-delta, item.heat, hull.maxHeat - hull.heat);
    item.heat -= moved;
    hull.heat += moved;
    return -moved;
  }
  return 0;
}

function exchangeItems(a, b, rate) {
  if (!rate || !canAcceptHeat(a) || !canAcceptHeat(b)) return 0;
  if (COMPONENTS[a.id].type === "condensator" || COMPONENTS[b.id].type === "condensator") return 0;
  const defA = COMPONENTS[a.id];
  const defB = COMPONENTS[b.id];
  const total = a.heat + b.heat;
  const desiredAHeat = Math.round(total * (defA.maxHeat / (defA.maxHeat + defB.maxHeat)));
  const delta = Math.max(-rate, Math.min(rate, desiredAHeat - a.heat));
  if (delta > 0) {
    const moved = Math.min(delta, b.heat, defA.maxHeat - a.heat);
    a.heat += moved;
    b.heat -= moved;
    return moved;
  }
  if (delta < 0) {
    const moved = Math.min(-delta, a.heat, defB.maxHeat - b.heat);
    a.heat -= moved;
    b.heat += moved;
    return -moved;
  }
  return 0;
}

function simulate(layout) {
  const items = cloneItems(layout);
  const hull = { heat: 0, maxHeat: HULL_MAX_HEAT };
  const frames = [];
  let lastStatus = "MK1 稳定";
  let failedAt = null;

  for (let second = 0; second <= CYCLE_SECONDS; second += 1) {
    let totalEu = 0;
    let totalHeat = 0;
    let totalCooling = 0;
    hull.maxHeat = hullMaxHeat(items);
    for (const item of items) {
      if (!item) continue;
      item.lastEu = 0;
      item.lastHeat = 0;
      item.lastCooling = 0;
      item.lastHullPull = 0;
      item.lastComponentCooling = 0;
      item.lastExchange = 0;
      item.lastReceivedHeat = 0;
    }

    if (second > 0) {
      for (let i = 0; i < items.length; i += 1) {
        const item = items[i];
        if (!item || item.melted || COMPONENTS[item.id].type !== "fuel") continue;
        const stats = fuelStats(items, i);
        const fuel = COMPONENTS[item.id];
        item.burn = Math.min(CYCLE_SECONDS, item.burn + 1);
        item.lastEu = stats.eu;
        item.lastHeat = stats.heat;
        totalEu += stats.eu;
        totalHeat += stats.heat;
        distributeHeat(items, hull, i, stats.heat);

        for (const n of neighbors(i)) {
          const adjacent = items[n];
          if (!adjacent || adjacent.melted) continue;
          const def = COMPONENTS[adjacent.id];
          if (def.type === "reflector" && Number.isFinite(def.maxDamage)) {
            adjacent.damage += fuel.rods;
            if (adjacent.damage >= def.maxDamage) adjacent.melted = true;
          }
        }
      }

      for (let i = 0; i < items.length; i += 1) {
        const item = items[i];
        if (!item || item.melted) continue;
        const def = COMPONENTS[item.id];
        if (def.type !== "exchanger") continue;
        for (const n of neighbors(i)) {
          const beforeOwn = item.heat;
          const target = items[n];
          const beforeTarget = target?.heat || 0;
          const moved = exchangeItems(item, target, def.near);
          if (moved !== 0) {
            item.lastExchange += item.heat - beforeOwn;
            if (target) target.lastExchange += (target.heat || 0) - beforeTarget;
          }
          if (moved < 0) totalCooling += 0;
        }
        const beforeHullExchange = item.heat;
        exchangeWithHull(item, def, hull);
        item.lastExchange += item.heat - beforeHullExchange;
        if (item.heat >= def.maxHeat) item.melted = true;
      }

      for (let i = 0; i < items.length; i += 1) {
        const item = items[i];
        if (!item || item.melted) continue;
        const def = COMPONENTS[item.id];
        if (def.type === "vent") {
          const pulled = Math.min(def.hull || 0, hull.heat);
          hull.heat -= pulled;
          item.heat += pulled;
          item.lastHullPull += pulled;
          if (item.heat >= def.maxHeat) {
            item.melted = true;
            continue;
          }
          const cooled = Math.min(def.self || 0, item.heat);
          item.heat -= cooled;
          item.lastCooling += cooled;
          totalCooling += cooled;
        }
        if (def.type === "componentVent") {
          for (const n of neighbors(i)) {
            const target = items[n];
            if (!target || !canAcceptHeat(target)) continue;
            const cooled = Math.min(4, target.heat);
            target.heat -= cooled;
            target.lastCooling += cooled;
            target.lastComponentCooling += cooled;
            totalCooling += cooled;
          }
        }
      }

      for (const item of items) {
        if (!item || item.melted) continue;
        const def = COMPONENTS[item.id];
        if (def.maxHeat && item.heat >= def.maxHeat) item.melted = true;
      }

      const melted = items.some((item) => item && item.melted);
      if ((hull.heat >= hull.maxHeat || melted) && failedAt === null) {
        failedAt = second;
        lastStatus = hull.heat >= hull.maxHeat ? `堆体过热 @ ${second}s` : `组件损坏 @ ${second}s`;
      }
    }

    frames.push({
      second,
      eu: totalEu,
      heat: totalHeat,
      cooling: totalCooling,
      hullHeat: Math.min(hull.heat, hull.maxHeat),
      hullMaxHeat: hull.maxHeat,
      status: failedAt ? lastStatus : "MK1 稳定",
      failed: failedAt !== null,
      items: items.map((item) => item ? { ...item } : null)
    });
  }

  return { frames, failedAt, finalStatus: failedAt ? lastStatus : "MK1 稳定跑满" };
}

function nearestFrame(second) {
  if (!state.timeline) return null;
  const frames = state.timeline.frames;
  let lo = 0;
  let hi = frames.length - 1;
  while (lo < hi) {
    const mid = Math.floor((lo + hi + 1) / 2);
    if (frames[mid].second <= second) lo = mid;
    else hi = mid - 1;
  }
  return frames[lo];
}

function renderPalette() {
  const groups = [...new Set(Object.values(COMPONENTS).map((item) => item.group))];
  paletteEl.classList.toggle("list-view", state.paletteView === "list");
  paletteEl.innerHTML = groups.map((group) => {
    const items = Object.values(COMPONENTS).filter((item) => item.group === group);
    return `
      <div class="palette-group">
        <div class="palette-title">${group}</div>
        <div class="palette-grid">
          ${items.map((item) => `
          <button class="palette-item" type="button" data-tool="${item.id}" aria-label="${item.name}">
            <span class="palette-icon">${itemIcon(item.id)}</span>
            <span class="palette-tooltip" role="tooltip">
              <span class="palette-label">${item.name}</span>
              <span class="palette-desc">${DESCRIPTIONS[item.id]}</span>
            </span>
          </button>
          `).join("")}
        </div>
      </div>
    `;
  }).join("");
}

function renderGrid() {
  const frame = nearestFrame(state.currentSecond);
  gridEl.innerHTML = state.layout.map((id, index) => {
    const def = id ? COMPONENTS[id] : null;
    const item = frame?.items[index];
    const selected = state.selectedCell === index ? " selected" : "";
    const melted = item?.melted ? " melted" : "";
    let fill = 0;
    if (item && def?.maxHeat) fill = Math.min(100, (item.heat / def.maxHeat) * 100);
    if (item && def?.type === "fuel") fill = Math.max(0, 100 - (item.burn / CYCLE_SECONDS) * 100);
    if (item && def?.maxDamage && Number.isFinite(def.maxDamage)) fill = Math.max(0, 100 - (item.damage / def.maxDamage) * 100);
    if (item && def?.type === "reflector" && !Number.isFinite(def.maxDamage)) fill = 100;
    const barMode = def?.type === "fuel" || def?.type === "reflector" || def?.type === "condensator" ? " durability" : "";
    return `
      <button class="cell${selected}${melted}" type="button" data-index="${index}" title="${def ? def.name : "空"}">
        ${def ? `${itemIcon(def.id, "cell-icon")}<span class="cell-code">${def.symbol}</span><span class="cell-name">${def.name}</span><span class="bar${barMode}"><span style="width:${fill}%"></span></span>${item?.melted ? '<span class="cell-broken">损坏</span>' : ''}` : ""}
      </button>
    `;
  }).join("");
  renderSelectedInfo();
}

function renderMetrics() {
  const frame = nearestFrame(state.currentSecond);
  document.getElementById("timeLabel").textContent = `${state.currentSecond}s`;
  document.getElementById("cycleLabel").textContent = `${(state.currentSecond / CYCLE_SECONDS * 100).toFixed(1)}%`;
  if (!frame) {
    document.getElementById("euMetric").textContent = "0";
    document.getElementById("heatMetric").textContent = "0 hU/s";
    document.getElementById("coolMetric").textContent = "0 hU/s";
    document.getElementById("hullMetric").textContent = "0 / 10000";
    document.getElementById("statusMetric").textContent = "等待布局";
    return;
  }
  document.getElementById("euMetric").textContent = Math.round(frame.eu).toString();
  document.getElementById("heatMetric").textContent = `${Math.round(frame.heat)} hU/s`;
  document.getElementById("coolMetric").textContent = `${Math.round(frame.cooling)} hU/s`;
  document.getElementById("hullMetric").textContent = `${Math.round(frame.hullHeat)} / ${frame.hullMaxHeat}`;
  const status = document.querySelector(".metric.status");
  status.classList.toggle("danger", frame.failed);
  status.classList.toggle("warning", !frame.failed && frame.hullHeat > 0);
  document.getElementById("statusMetric").textContent = frame.status;
}

function renderSelectedInfo() {
  const target = document.getElementById("selectedInfo");
  if (state.selectedCell === null) {
    target.textContent = "选择一个格子查看组件热量与耐久。";
    return;
  }
  const id = state.layout[state.selectedCell];
  if (!id) {
    const { row, col } = rowCol(state.selectedCell);
    target.textContent = `第 ${row + 1} 行，第 ${col + 1} 列：空。`;
    return;
  }
  const def = COMPONENTS[id];
  const frame = nearestFrame(state.currentSecond);
  const item = frame?.items[state.selectedCell];
  const { row, col } = rowCol(state.selectedCell);
  const lines = [`第 ${row + 1} 行，第 ${col + 1} 列`, def.name, DESCRIPTIONS[id]];
  if (item) {
    const details = [];
    if (def.type === "fuel") {
      details.push(`当前输出：${Math.round(item.lastEu)} EU/t`);
      details.push(`当前发热：${Math.round(item.lastHeat)} hU/s`);
    }
    if (item.lastReceivedHeat) details.push(`本秒吸收燃料热：${Math.round(item.lastReceivedHeat)} hU`);
    if (item.lastHullPull) details.push(`本秒从堆体取热：${Math.round(item.lastHullPull)} hU`);
    if (item.lastCooling) details.push(`本秒散热：${Math.round(item.lastCooling)} hU`);
    if (item.lastComponentCooling) details.push(`其中元件散热器：${Math.round(item.lastComponentCooling)} hU`);
    if (item.lastExchange) details.push(`本秒换热净变化：${Math.round(item.lastExchange)} hU`);
    if (details.length) lines.push(...details);
  }
  if (item && def.maxHeat) lines.push(`热量：${Math.round(item.heat)} / ${def.maxHeat}`);
  if (item && def.type === "fuel") lines.push(`燃料：${Math.max(0, CYCLE_SECONDS - item.burn)} / ${CYCLE_SECONDS}s`);
  if (item && def.type === "condensator") lines.push(`剩余吸热：${Math.max(0, def.maxDamage - Math.round(item.damage))} / ${def.maxDamage} hU`);
  else if (item && Number.isFinite(def.maxDamage)) lines.push(`耐久：${Math.max(0, def.maxDamage - Math.round(item.damage))} / ${def.maxDamage}`);
  if (def.hullBonus) lines.push(`堆体容量加成：+${def.hullBonus}`);
  if (item?.melted) lines.push("状态：已损坏");
  target.innerHTML = lines.join("<br>");
}

function renderTools() {
  document.querySelectorAll("[data-tool]").forEach((button) => {
    button.classList.toggle("active", button.dataset.tool === state.selectedTool);
  });
  document.getElementById("gridViewBtn").classList.toggle("active", state.paletteView === "grid");
  document.getElementById("listViewBtn").classList.toggle("active", state.paletteView === "list");
}

function renderAll() {
  renderTools();
  renderGrid();
  renderMetrics();
}

function runSimulation() {
  state.timeline = simulate(state.layout);
  const hasComponents = state.layout.some(Boolean);
  const current = Number(timeSlider.value);
  state.currentSecond = hasComponents && current === 0 ? 1 : current;
  timeSlider.value = String(state.currentSecond);
  renderAll();
}

function layoutToCode() {
  const code = [];
  for (let row = 0; row < SIZE; row += 1) {
    code.push(state.layout.slice(row * SIZE, row * SIZE + SIZE).map((id) => id || ".").join(","));
  }
  return code.join("\n");
}

function loadLayoutFromCode(text) {
  const tokens = text.split(/[\s,]+/).filter(Boolean);
  if (tokens.length !== SIZE * SIZE) {
    alert("布局代码需要正好 81 个格子。空位用 . 表示。");
    return;
  }
  state.layout = tokens.map((token) => token === "." ? null : token).map((id) => COMPONENTS[id] ? id : null);
  state.timeline = null;
  state.currentSecond = 0;
  timeSlider.value = "0";
  renderAll();
}

renderPalette();
renderGrid();
renderMetrics();

paletteEl.addEventListener("click", (event) => {
  const button = event.target.closest("[data-tool]");
  if (!button) return;
  state.selectedTool = button.dataset.tool;
  renderTools();
});

document.getElementById("eraserBtn").addEventListener("click", () => {
  state.selectedTool = "eraser";
  renderTools();
});

document.getElementById("inspectBtn").addEventListener("click", () => {
  state.selectedTool = "inspect";
  renderTools();
});

document.getElementById("gridViewBtn").addEventListener("click", () => {
  state.paletteView = "grid";
  renderPalette();
  renderTools();
});

document.getElementById("listViewBtn").addEventListener("click", () => {
  state.paletteView = "list";
  renderPalette();
  renderTools();
});

gridEl.addEventListener("click", (event) => {
  const button = event.target.closest("[data-index]");
  if (!button) return;
  const index = Number(button.dataset.index);
  state.selectedCell = index;
  if (state.selectedTool !== "inspect") {
    state.layout[index] = state.selectedTool === "eraser" ? null : state.selectedTool;
    state.timeline = null;
    state.currentSecond = 0;
    timeSlider.value = "0";
  }
  renderAll();
});

gridEl.addEventListener("contextmenu", (event) => {
  const button = event.target.closest("[data-index]");
  if (!button) return;
  event.preventDefault();
  const index = Number(button.dataset.index);
  state.selectedCell = index;
  if (state.layout[index]) {
    state.layout[index] = null;
    state.timeline = null;
    state.currentSecond = 0;
    timeSlider.value = "0";
  }
  renderAll();
});

document.getElementById("simulateBtn").addEventListener("click", runSimulation);

document.getElementById("clearBtn").addEventListener("click", () => {
  state.layout = Array(SIZE * SIZE).fill(null);
  state.timeline = null;
  state.currentSecond = 0;
  state.selectedCell = null;
  timeSlider.value = "0";
  renderAll();
});

timeSlider.addEventListener("input", () => {
  state.currentSecond = Number(timeSlider.value);
  renderAll();
});

document.getElementById("copyLayoutBtn").addEventListener("click", () => {
  layoutCode.value = layoutToCode();
});

document.getElementById("clipboardLayoutBtn").addEventListener("click", async () => {
  const code = layoutToCode();
  layoutCode.value = code;
  try {
    await navigator.clipboard.writeText(code);
    document.getElementById("clipboardLayoutBtn").textContent = "已复制";
    window.setTimeout(() => {
      document.getElementById("clipboardLayoutBtn").textContent = "复制";
    }, 1200);
  } catch {
    layoutCode.focus();
    layoutCode.select();
    alert("浏览器没有允许写入剪贴板，代码已生成在文本框里。");
  }
});

document.getElementById("loadLayoutBtn").addEventListener("click", () => {
  loadLayoutFromCode(layoutCode.value);
});
