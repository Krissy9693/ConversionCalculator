const stageOptions = [
  "New Lead",
  "Qualification Call",
  "Discovery Call",
  "Call One",
  "Onsite Consultation",
  "Call Two",
  "Agreement Sent",
  "Agreement Signed",
];

const monthNames = ["Month 1", "Month 2", "Month 3"];

const stagePicker = document.querySelector("#stage-picker");
const continueButton = document.querySelector("#continue-button");
const processStep = document.querySelector("#process-step");
const dataStep = document.querySelector("#data-step");
const resultsStep = document.querySelector("#results-step");
const backToProcessButton = document.querySelector("#back-to-process-button");
const backToDataButton = document.querySelector("#back-to-data-button");
const backToProcessFromResultsButton = document.querySelector("#back-to-process-from-results-button");
const generateResultsButton = document.querySelector("#generate-results-button");
const monthsPanel = document.querySelector("#months-panel");
const selectedProcess = document.querySelector("#selected-process");
const selectedProcessResults = document.querySelector("#selected-process-results");
const quarterTotal = document.querySelector("#quarter-total");
const quarterTotalLabel = document.querySelector("#quarter-total-label");
const quarterTotalNote = document.querySelector("#quarter-total-note");
const monthlyAverage = document.querySelector("#monthly-average");
const conversionList = document.querySelector("#conversion-list");
const summaryHeadline = document.querySelector("#summary-headline");
const summaryPercent = document.querySelector("#summary-percent");
const summaryCopy = document.querySelector("#summary-copy");
const warningCopy = document.querySelector("#warning-copy");
const goalLabel = document.querySelector("#goal-label");
const goalInput = document.querySelector("#goal-input");
const forecastNote = document.querySelector("#forecast-note");
const forecastList = document.querySelector("#forecast-list");
const emailInput = document.querySelector("#email-input");
const emailReportButton = document.querySelector("#email-report-button");
const hero = document.querySelector(".hero");
const widgetTitle = document.querySelector("#widget-title");
const heroCopy = document.querySelector("#hero-copy");

let latestReport = "";

const heroContent = {
  process: {
    title: "Stop Guessing. Start Converting.",
    body: [
      "First, build your funnel the way it actually works today.",
      "Choose the stages that match your process from first contact to signed agreement.",
      "Then, enter your numbers from the last three months.",
      "This allows us to calculate your conversion rates at each step, not just the end result.",
      "Once complete, you will see where your opportunities are, where deals are falling off, and exactly what needs to improve to reach your next quarter goals.",
    ],
  },
  data: {
    title: "Turn Your Data Into Direction",
    body: [
      "This is where most people realize what is actually happening in their funnel.",
      "Add your numbers for each stage across the last three months.",
      "We are measuring movement, not just outcomes.",
      "When you generate your results, you will see exactly where deals are being lost and what needs to improve to change your next quarter.",
    ],
  },
  results: {
    title: "Your Funnel, Broken Down Clearly",
    body: [
      "Start with the snapshot, then break it down step by step to see exactly where you are losing momentum and what needs to change.",
    ],
  },
};

function setHeroContent(step) {
  const content = heroContent[step];
  if (!content) {
    return;
  }

  if (step === "process") {
    hero.classList.remove("hidden-hero");
  } else {
    hero.classList.add("hidden-hero");
  }

  widgetTitle.textContent = content.title;
  heroCopy.innerHTML = content.body.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("");
}

function renderStageOptions() {
  stagePicker.innerHTML = stageOptions.map((stage, index) => `
    <div class="stage-option">
      <input id="stage-${index}" type="checkbox" value="${stage}" ${index === 0 || index === stageOptions.length - 1 ? "checked" : ""}>
      <label for="stage-${index}">${stage}</label>
    </div>
  `).join("");
}

function getSelectedStages() {
  return Array.from(stagePicker.querySelectorAll("input:checked")).map((input) => input.value);
}

function parseCount(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) {
    return 0;
  }
  return parsed;
}

function formatPercent(numerator, denominator) {
  if (denominator <= 0) {
    return "0.0%";
  }
  return `${((numerator / denominator) * 100).toFixed(1)}%`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;")
    .replaceAll("'", "&#39;");
}

function renderMonthInputs(stages) {
  monthsPanel.innerHTML = monthNames.map((monthName, monthIndex) => `
    <section class="month-card">
      <h3 class="month-title">${monthName}</h3>
      <div class="month-fields">
        ${stages.map((stage, stageIndex) => `
          <label class="field">
            <span>${stage}</span>
            <input
              type="number"
              min="0"
              step="1"
              inputmode="numeric"
              data-month-index="${monthIndex}"
              data-stage-index="${stageIndex}"
              value="0"
            >
          </label>
        `).join("")}
      </div>
    </section>
  `).join("");
}

function getQuarterData(stages) {
  return monthNames.map((_, monthIndex) => {
    return stages.map((_, stageIndex) => {
      const input = monthsPanel.querySelector(`[data-month-index="${monthIndex}"][data-stage-index="${stageIndex}"]`);
      return parseCount(input?.value ?? 0);
    });
  });
}

function buildForecast(stages, stageTotals) {
  const finalStageName = stages[stages.length - 1] ?? "Final Stage";
  const goal = parseCount(goalInput.value);

  if (finalStageName === "Agreement Signed") {
    goalLabel.textContent = "Target Agreements Signed for Next Quarter";
  } else {
    goalLabel.textContent = `Target ${finalStageName} for Next Quarter`;
  }

  if (goal <= 0) {
    forecastNote.textContent =
      "Enter your target and we will map out exactly what your funnel needs to produce at each stage to hit it.";
    forecastList.innerHTML = "";
    return [];
  }

  const ratios = [];
  for (let i = 0; i < stages.length - 1; i += 1) {
    const fromTotal = stageTotals[i];
    const toTotal = stageTotals[i + 1];
    ratios.push(fromTotal > 0 ? toTotal / fromTotal : 0);
  }

  if (ratios.some((ratio) => ratio <= 0)) {
    forecastNote.textContent =
      "Enter enough quarter data for each stage before using the KPI planner. Right now at least one conversion step has no usable baseline.";
    forecastList.innerHTML = "";
    return [];
  }

  const recommendedTotals = new Array(stages.length).fill(0);
  recommendedTotals[stages.length - 1] = goal;

  for (let i = stages.length - 2; i >= 0; i -= 1) {
    recommendedTotals[i] = Math.ceil(recommendedTotals[i + 1] / ratios[i]);
  }

  forecastNote.textContent =
    `Based on your current quarter conversion rates, these are the recommended quarterly totals to reach ${goal} ${finalStageName.toLowerCase()} entries next quarter.`;

  forecastList.innerHTML = stages.map((stage, index) => `
    <div class="conversion-row">
      <p class="conversion-name">${escapeHtml(stage)}</p>
      <p class="conversion-rate">${recommendedTotals[index]} total | ${(recommendedTotals[index] / 3).toFixed(1)}/mo</p>
    </div>
  `).join("");

  return recommendedTotals;
}

function buildReport(stages, stageTotals, recommendedTotals) {
  const finalStageName = stages[stages.length - 1] ?? "Final Stage";
  const firstStageName = stages[0] ?? "First Stage";
  const finalStageTotal = stageTotals[stageTotals.length - 1] ?? 0;
  const firstStageTotal = stageTotals[0] ?? 0;
  const overallQuarterConversion = formatPercent(finalStageTotal, firstStageTotal);

  const conversionLines = [];
  for (let i = 0; i < stages.length - 1; i += 1) {
    conversionLines.push(`${stages[i]} to ${stages[i + 1]}: ${formatPercent(stageTotals[i + 1], stageTotals[i])}`);
  }

  const totalsLines = stages.map((stage, index) => `${stage}: ${stageTotals[index] ?? 0}`);
  const forecastLines = recommendedTotals.length > 0
    ? stages.map((stage, index) => `${stage}: ${recommendedTotals[index]} total for next quarter`)
    : ["No next-quarter goal entered."];

  return [
    "Quarterly KPI Report",
    "",
    `Process: ${stages.join(" > ")}`,
    `Quarter snapshot: ${firstStageTotal} ${firstStageName.toLowerCase()} entries to ${finalStageTotal} ${finalStageName.toLowerCase()} entries (${overallQuarterConversion})`,
    "",
    "Quarter totals:",
    ...totalsLines,
    "",
    "Average micro conversions:",
    ...conversionLines,
    "",
    "Next-quarter KPI targets:",
    ...forecastLines,
  ].join("\n");
}

function updateResults() {
  const stages = getSelectedStages();
  const quarterData = getQuarterData(stages);
  const stageTotals = stages.map((_, stageIndex) =>
    quarterData.reduce((sum, month) => sum + month[stageIndex], 0)
  );

  const firstStageName = stages[0] ?? "First Stage";
  const finalStageName = stages[stages.length - 1] ?? "Final Stage";
  const firstStageTotal = stageTotals[0] ?? 0;
  const finalStageTotal = stageTotals[stageTotals.length - 1] ?? 0;
  const overallQuarterConversion = formatPercent(finalStageTotal, firstStageTotal);

  if (quarterTotalLabel) {
    quarterTotalLabel.textContent = `Quarterly total ${finalStageName.toLowerCase()}`;
  }
  if (quarterTotalNote) {
    quarterTotalNote.textContent = `Total ${finalStageName.toLowerCase()} entries across all 3 months`;
  }

  quarterTotal.textContent = String(finalStageTotal);
  monthlyAverage.textContent = (finalStageTotal / 3).toFixed(1);
  summaryHeadline.textContent = `${finalStageTotal} ${finalStageName} From ${firstStageTotal} ${firstStageName}${firstStageTotal === 1 ? "" : "s"}`;
  summaryPercent.textContent = `${overallQuarterConversion} Total Conversion Rate`;
  summaryCopy.textContent =
    "This is your current output. Now we break down each stage to understand what is driving it and what needs to change to impact your next quarter.";

  conversionList.innerHTML = stages.slice(0, -1).map((stage, index) => `
    <div class="conversion-row">
      <p class="conversion-name">${escapeHtml(stage)} to ${escapeHtml(stages[index + 1])}</p>
      <p class="conversion-rate">${formatPercent(stageTotals[index + 1], stageTotals[index])}</p>
    </div>
  `).join("");

  if (!conversionList.innerHTML.trim()) {
    conversionList.innerHTML = `
      <div class="conversion-row">
        <p class="conversion-name">No conversion steps selected yet</p>
        <p class="conversion-rate">0.0%</p>
      </div>
    `;
  }

  const recommendedTotals = buildForecast(stages, stageTotals);
  latestReport = buildReport(stages, stageTotals, recommendedTotals);

  const warnings = [];
  quarterData.forEach((month, monthIndex) => {
    for (let i = 0; i < month.length - 1; i += 1) {
      if (month[i + 1] > month[i] && month[i] > 0) {
        warnings.push(`${monthNames[monthIndex]} has more ${stages[i + 1]} than ${stages[i]}.`);
      }
    }
  });

  if (warnings.length > 0) {
    warningCopy.hidden = false;
    warningCopy.textContent = `${warnings.join(" ")} Double-check those monthly counts if that is not intentional.`;
  } else {
    warningCopy.hidden = true;
    warningCopy.textContent = "";
  }
}

function createEmailDraft() {
  const recipient = emailInput.value.trim();
  const subject = encodeURIComponent("Quarterly KPI Report");
  const body = encodeURIComponent(latestReport);
  const mailtoUrl = recipient
    ? `mailto:${encodeURIComponent(recipient)}?subject=${subject}&body=${body}`
    : `mailto:?subject=${subject}&body=${body}`;

  window.location.href = mailtoUrl;
}

function goToDataStep() {
  const stages = getSelectedStages();
  if (stages.length < 2) {
    window.alert("Please select at least two stages in your sales process.");
    return;
  }

  renderMonthInputs(stages);
  const processText = stages.join(" > ");
  selectedProcess.textContent = processText;
  selectedProcessResults.textContent = processText;
  setHeroContent("data");
  processStep.classList.add("hidden");
  resultsStep.classList.add("hidden");
  dataStep.classList.remove("hidden");
}

function goToResultsStep() {
  updateResults();
  setHeroContent("results");
  dataStep.classList.add("hidden");
  processStep.classList.add("hidden");
  resultsStep.classList.remove("hidden");
}

function goToProcessStep() {
  setHeroContent("process");
  dataStep.classList.add("hidden");
  resultsStep.classList.add("hidden");
  processStep.classList.remove("hidden");
}

renderStageOptions();
setHeroContent("process");

continueButton.addEventListener("click", goToDataStep);
backToProcessButton.addEventListener("click", goToProcessStep);
backToDataButton.addEventListener("click", () => {
  setHeroContent("data");
  resultsStep.classList.add("hidden");
  dataStep.classList.remove("hidden");
});
backToProcessFromResultsButton.addEventListener("click", goToProcessStep);
generateResultsButton.addEventListener("click", goToResultsStep);
goalInput.addEventListener("input", updateResults);
emailReportButton.addEventListener("click", createEmailDraft);
