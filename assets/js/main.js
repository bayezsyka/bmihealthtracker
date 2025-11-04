import { initThemeToggle } from './theme.js';
import {
  BMI_CATEGORIES,
  HYDRATION_MULTIPLIER,
  ACTIVITY_LABELS,
  FOCUS_MACROS,
  FOCUS_LABELS,
  QUICK_TIPS,
  WEEKLY_CHALLENGES,
} from './data.js';

const HISTORY_KEY = 'bmi-health-history';

const numberFormat = new Intl.NumberFormat('id-ID', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

const weightFormat = new Intl.NumberFormat('id-ID', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 1,
});

const datetimeFormat = new Intl.DateTimeFormat('id-ID', {
  dateStyle: 'medium',
  timeStyle: 'short',
});

function calculateBMI(heightCm, weightKg) {
  const heightMeter = heightCm / 100;
  if (!heightMeter) return 0;
  return weightKg / (heightMeter * heightMeter);
}

function findBMICategory(bmi) {
  return BMI_CATEGORIES.find((category) => bmi >= category.min && bmi <= category.max) ?? BMI_CATEGORIES.at(-1);
}

function calculateIdealWeightRange(heightCm) {
  const heightMeter = heightCm / 100;
  const min = 18.5 * heightMeter * heightMeter;
  const max = 24.9 * heightMeter * heightMeter;
  return { min, max };
}

function calculateHydrationNeed(weightKg, activityLevel) {
  const multiplier = HYDRATION_MULTIPLIER[activityLevel] ?? HYDRATION_MULTIPLIER.sedentary;
  return (weightKg * multiplier) / 1000;
}

function getMacroSuggestion(focus) {
  return FOCUS_MACROS[focus] ?? FOCUS_MACROS.balance;
}

function getRandomItem(items, previous) {
  if (!Array.isArray(items) || items.length === 0) return '';
  if (items.length === 1) return items[0];
  let candidate = items[Math.floor(Math.random() * items.length)];
  if (candidate === previous) {
    candidate = items[(items.indexOf(candidate) + 1) % items.length];
  }
  return candidate;
}

function formatWeightRange({ min, max }) {
  return `${weightFormat.format(min)} - ${weightFormat.format(max)} kg`;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function calculateMarkerPosition(bmi) {
  const lower = 10;
  const upper = 40;
  const percentage = ((bmi - lower) / (upper - lower)) * 100;
  return clamp(Math.round(percentage), 0, 100);
}

function loadHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn('Gagal memuat riwayat BMI', error);
    return [];
  }
}

function saveHistory(history) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

function createId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function createHistoryCard(record) {
  const activityLabel = ACTIVITY_LABELS[record.activity] ?? record.activity;
  const focusLabel = FOCUS_LABELS[record.focus] ?? record.focus;
  return `
    <article class="group flex flex-col justify-between rounded-2xl bg-white/70 p-5 text-sm shadow-sm ring-1 ring-black/5 transition hover:-translate-y-1 hover:shadow-lg dark:bg-slate-950/60 dark:ring-white/10">
      <div class="flex items-center justify-between">
        <h3 class="text-base font-semibold text-slate-900 dark:text-white">BMI ${numberFormat.format(record.bmi)}</h3>
        <span class="rounded-full bg-ocean-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-ocean-600 dark:bg-ocean-400/10 dark:text-ocean-200">${record.category}</span>
      </div>
      <dl class="mt-4 grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300">
        <div>
          <dt class="font-medium text-slate-500 dark:text-slate-400">Tinggi</dt>
          <dd>${record.height} cm</dd>
        </div>
        <div>
          <dt class="font-medium text-slate-500 dark:text-slate-400">Berat</dt>
          <dd>${record.weight} kg</dd>
        </div>
        <div>
          <dt class="font-medium text-slate-500 dark:text-slate-400">Aktivitas</dt>
          <dd>${activityLabel}</dd>
        </div>
        <div>
          <dt class="font-medium text-slate-500 dark:text-slate-400">Fokus</dt>
          <dd>${focusLabel}</dd>
        </div>
      </dl>
      <p class="mt-4 text-xs text-slate-500 dark:text-slate-400">${datetimeFormat.format(new Date(record.timestamp))}</p>
      <button data-history="${record.id}" class="mt-4 inline-flex items-center justify-center gap-2 rounded-xl border border-ocean-200 px-4 py-2 text-xs font-semibold text-ocean-600 transition hover:bg-ocean-500 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-ocean-500 dark:border-ocean-400/40 dark:text-ocean-200">Gunakan data ini</button>
    </article>
  `;
}

function renderHistory(history, container, emptyState, formControls, recalc) {
  if (!container || !emptyState) return;
  if (!Array.isArray(history) || history.length === 0) {
    container.innerHTML = '';
    emptyState.classList.remove('hidden');
    return;
  }

  emptyState.classList.add('hidden');
  container.innerHTML = history.map(createHistoryCard).join('');

  container.querySelectorAll('button[data-history]').forEach((button) => {
    button.addEventListener('click', () => {
      const id = button.getAttribute('data-history');
      const record = history.find((item) => item.id === id);
      if (!record) return;
      const { gender, age, height, weight, activity, focus } = record;
      formControls.gender.value = gender;
      formControls.age.value = age;
      formControls.height.value = height;
      formControls.weight.value = weight;
      formControls.activity.value = activity;
      formControls.focus.value = focus;
      recalc({ addToHistory: false });
    });
  });
}

function handleCalculation(state, options = {}) {
  const { addToHistory = true } = options;
  const { heightInput, weightInput, ageInput, genderInput, activityInput, focusInput, outputs, historyState } = state;

  const height = Number(heightInput.value);
  const weight = Number(weightInput.value);
  const age = Number(ageInput.value);
  const gender = genderInput.value;
  const activity = activityInput.value;
  const focus = focusInput.value;

  const bmi = calculateBMI(height, weight);
  const category = findBMICategory(bmi);
  const ideal = calculateIdealWeightRange(height);
  const hydrationNeed = calculateHydrationNeed(weight, activity);
  const macroSuggestion = getMacroSuggestion(focus);
  const quickTip = getRandomItem(QUICK_TIPS, outputs.quickTip.textContent);

  outputs.bmiValue.textContent = numberFormat.format(bmi);
  outputs.bmiLabel.textContent = category.label;
  outputs.bmiLabel.className = `font-semibold ${category.tone}`;
  outputs.bmiAdvice.textContent = category.advice;
  outputs.idealWeight.textContent = formatWeightRange(ideal);
  outputs.hydration.textContent = `${numberFormat.format(hydrationNeed)} L / hari`;
  outputs.macro.textContent = macroSuggestion;
  outputs.quickTip.textContent = quickTip;

  const markerPosition = calculateMarkerPosition(bmi);
  outputs.bmiMarker.style.left = `${markerPosition}%`;

  if (addToHistory) {
    const record = {
      id: createId(),
      timestamp: new Date().toISOString(),
      bmi: Number(bmi.toFixed(1)),
      category: category.label,
      height,
      weight,
      activity,
      focus,
      age,
      gender,
    };
    historyState.unshift(record);
    historyState.splice(10);
    saveHistory(historyState);
  }
}

function refreshChallenge(challengeElement, currentChallenge) {
  if (!challengeElement) return currentChallenge;
  const nextChallenge = getRandomItem(WEEKLY_CHALLENGES, currentChallenge);
  challengeElement.textContent = nextChallenge;
  return nextChallenge;
}

function initApp() {
  const form = document.querySelector('#bmi-form');
  const heightInput = document.querySelector('#height');
  const weightInput = document.querySelector('#weight');
  const ageInput = document.querySelector('#age');
  const genderInput = document.querySelector('#gender');
  const activityInput = document.querySelector('#activity');
  const focusInput = document.querySelector('#focus');
  const themeToggle = document.querySelector('#themeToggle');

  const heightLabel = document.querySelector('#heightLabel');
  const weightLabel = document.querySelector('#weightLabel');

  const outputs = {
    bmiValue: document.querySelector('#bmiValue'),
    bmiLabel: document.querySelector('#bmiLabel'),
    bmiAdvice: document.querySelector('#bmiAdvice'),
    bmiMarker: document.querySelector('#bmiMarker'),
    idealWeight: document.querySelector('#idealWeight'),
    hydration: document.querySelector('#hydration'),
    macro: document.querySelector('#macro'),
    quickTip: document.querySelector('#quickTip'),
    weeklyChallenge: document.querySelector('#weeklyChallenge'),
    historyList: document.querySelector('#historyList'),
    historyEmpty: document.querySelector('#historyEmpty'),
  };

  initThemeToggle(themeToggle);

  const historyState = loadHistory();

  const state = {
    heightInput,
    weightInput,
    ageInput,
    genderInput,
    activityInput,
    focusInput,
    outputs,
    historyState,
  };

  const updateLabels = () => {
    if (heightLabel) heightLabel.textContent = `${heightInput.value} cm`;
    if (weightLabel) weightLabel.textContent = `${weightInput.value} kg`;
  };

  const recalc = (options = {}) => {
    updateLabels();
    handleCalculation(state, options);
    renderHistory(
      historyState,
      outputs.historyList,
      outputs.historyEmpty,
      {
        gender: genderInput,
        age: ageInput,
        height: heightInput,
        weight: weightInput,
        activity: activityInput,
        focus: focusInput,
      },
      recalc
    );
  };

  const challengeRefresh = document.querySelector('#challengeRefresh');
  let currentChallenge = refreshChallenge(outputs.weeklyChallenge, '');

  if (challengeRefresh) {
    challengeRefresh.addEventListener('click', () => {
      currentChallenge = refreshChallenge(outputs.weeklyChallenge, currentChallenge);
    });
  }

  const clearHistoryButton = document.querySelector('#clearHistory');
  if (clearHistoryButton) {
    clearHistoryButton.addEventListener('click', () => {
      historyState.length = 0;
      saveHistory(historyState);
      renderHistory(
        historyState,
        outputs.historyList,
        outputs.historyEmpty,
        {
          gender: genderInput,
          age: ageInput,
          height: heightInput,
          weight: weightInput,
          activity: activityInput,
          focus: focusInput,
        },
        recalc
      );
    });
  }

  const recalcWithoutHistory = () => recalc({ addToHistory: false });

  heightInput.addEventListener('input', recalcWithoutHistory);
  weightInput.addEventListener('input', recalcWithoutHistory);
  ageInput.addEventListener('input', recalcWithoutHistory);
  activityInput.addEventListener('change', recalcWithoutHistory);
  focusInput.addEventListener('change', recalcWithoutHistory);
  genderInput.addEventListener('change', recalcWithoutHistory);

  const latestRecord = historyState[0];
  if (latestRecord) {
    genderInput.value = latestRecord.gender;
    ageInput.value = latestRecord.age;
    heightInput.value = latestRecord.height;
    weightInput.value = latestRecord.weight;
    activityInput.value = latestRecord.activity;
    focusInput.value = latestRecord.focus;
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    recalc({ addToHistory: true });
  });

  recalc({ addToHistory: false });
}

initApp();
