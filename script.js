const DEFAULT_GOAL_TOTAL = 2500;
const PROGRESS_STEP_PERCENT = 2;
const TOTAL_PROGRESS_STEPS = 50;
const DEFAULT_PROGRESS_IMAGE = "assets/progress/progress-picture.png";

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

function getSiteBaseUrl() {
  const scriptTag = document.querySelector('script[src$="script.js"]');
  if (scriptTag && scriptTag.src) {
    return new URL("./", scriptTag.src).href;
  }
  return new URL("./", window.location.href).href;
}

function getDataUrl(fileName) {
  return new URL(`data/${fileName}`, getSiteBaseUrl()).href;
}

function getAssetUrl(path, fallbackPath) {
  const chosenPath = typeof path === "string" && path.trim() ? path.trim() : fallbackPath;
  return new URL(chosenPath, getSiteBaseUrl()).href;
}

function setProgressImage(pathFromConfig) {
  const imageUrl = getAssetUrl(pathFromConfig, DEFAULT_PROGRESS_IMAGE);
  const revealImage = document.getElementById("progress-image-reveal");
  if (revealImage) revealImage.style.backgroundImage = `url("${imageUrl}")`;
}

function renderProgress(currentTotal, goalTotal) {
  const safeGoal = goalTotal > 0 ? goalTotal : DEFAULT_GOAL_TOTAL;
  const rawPercent = (currentTotal / safeGoal) * 100;
  const clampedPercent = Math.min(100, Math.max(0, rawPercent));
  const remaining = Math.max(0, safeGoal - currentTotal);
  const step = Math.min(TOTAL_PROGRESS_STEPS, Math.floor(clampedPercent / PROGRESS_STEP_PERCENT));
  const steppedPercent = step * PROGRESS_STEP_PERCENT;

  document.getElementById("current-total").textContent = formatNumber(currentTotal);
  document.getElementById("goal-total").textContent = formatNumber(safeGoal);
  document.getElementById("percent-complete").textContent = `${clampedPercent.toFixed(1)}%`;
  document.getElementById("remaining-total").textContent = formatNumber(remaining);

  const progressFill = document.getElementById("progress-fill");
  progressFill.style.width = `${clampedPercent}%`;

  const progressBar = document.getElementById("progress-bar");
  progressBar.setAttribute("aria-valuenow", clampedPercent.toFixed(1));

  const revealImage = document.getElementById("progress-image-reveal");
  if (revealImage) {
    revealImage.style.height = `${steppedPercent}%`;
  }

  const stepLabel = document.getElementById("progress-step-label");
  if (stepLabel) {
    stepLabel.textContent = `Picture Step: ${step} / ${TOTAL_PROGRESS_STEPS} (${steppedPercent}%)`;
  }
}

async function init() {
  const status = document.getElementById("status-message");
  status.textContent = "";

  try {
    const [config, progress] = await Promise.all([
      loadJson(getDataUrl("config.json")),
      loadJson(getDataUrl("progress.json")),
    ]);

    const goalTotal = parseWholeNumber(config.goal_total, DEFAULT_GOAL_TOTAL) || DEFAULT_GOAL_TOTAL;
    const currentTotal = parseWholeNumber(progress.current_total, 0);
    setProgressImage(config.progress_image);

    renderProgress(currentTotal, goalTotal);
  } catch (error) {
    setProgressImage("");
    renderProgress(0, DEFAULT_GOAL_TOTAL);
    status.textContent = "Unable to load progress data. Check data/config.json and data/progress.json.";
  }
}

init();
