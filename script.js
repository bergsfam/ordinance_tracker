const DEFAULT_GOAL_TOTAL = 2500;
const TEMPLE_THRESHOLDS = [0, 10, 25, 45, 65, 85, 100];

function formatNumber(value) {
  return new Intl.NumberFormat("en-US").format(value);
}

function parseWholeNumber(value, fallback = 0) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.max(0, Math.floor(number));
}

async function loadJson(path) {
  const response = await fetch(path, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Could not load ${path}`);
  }
  return response.json();
}

function renderProgress(currentTotal, goalTotal) {
  const safeGoal = goalTotal > 0 ? goalTotal : DEFAULT_GOAL_TOTAL;
  const rawPercent = (currentTotal / safeGoal) * 100;
  const clampedPercent = Math.min(100, Math.max(0, rawPercent));
  const remaining = Math.max(0, safeGoal - currentTotal);

  document.getElementById("current-total").textContent = formatNumber(currentTotal);
  document.getElementById("goal-total").textContent = formatNumber(safeGoal);
  document.getElementById("percent-complete").textContent = `${clampedPercent.toFixed(1)}%`;
  document.getElementById("remaining-total").textContent = formatNumber(remaining);

  const progressFill = document.getElementById("progress-fill");
  progressFill.style.width = `${clampedPercent}%`;

  const progressBar = document.getElementById("progress-bar");
  progressBar.setAttribute("aria-valuenow", clampedPercent.toFixed(1));

  TEMPLE_THRESHOLDS.forEach((threshold, index) => {
    const layer = document.getElementById(`layer-${index}`);
    if (!layer) return;
    layer.classList.toggle("visible", clampedPercent >= threshold);
  });
}

async function init() {
  const status = document.getElementById("status-message");
  status.textContent = "";

  try {
    const [config, progress] = await Promise.all([
      loadJson("data/config.json"),
      loadJson("data/progress.json"),
    ]);

    const goalTotal = parseWholeNumber(config.goal_total, DEFAULT_GOAL_TOTAL) || DEFAULT_GOAL_TOTAL;
    const currentTotal = parseWholeNumber(progress.current_total, 0);

    renderProgress(currentTotal, goalTotal);
  } catch (error) {
    renderProgress(0, DEFAULT_GOAL_TOTAL);
    status.textContent = "Unable to load progress data. Check data/config.json and data/progress.json.";
  }
}

init();
