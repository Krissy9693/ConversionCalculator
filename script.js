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
const hero = document.querySelector("#hero");
const widgetTitle = document.querySelector("#widget-title");
const heroCopy = document.querySelector("#hero-copy");
const stagePicker = document.querySelector("#stage-picker");
const processStep = document.querySelector("#process-step");
const dataStep = document.querySelector("#data-step");
const resultsStep = document.querySelector("#results-step");
const improvementStep = document.querySelector("#improvement-step");
const continueButton = document.querySelector("#continue-button");
const backToProcessButton = document.querySelector("#back-to-process-button");
const backToDataButton = document.querySelector("#back-to-data-button");
const backToProcessFromResultsButton = document.querySelector("#back-to-process-from-results-button");
const generateResultsButton = document.querySelector("#generate-results-button");
const showImprovementsButton = document.querySelector("#show-improvements-button");
const backToResultsButton = document.querySelector("#back-to-results-button");
const backToDataFromImprovementButton = document.querySelector("#back-to-data-from-improvement-button");
const monthsPanel = document.querySelector("#months-panel");
const selectedProcess = document.querySelector("#selected-process");
const selectedProcessResults = document.querySelector("#selected-process-results");
const summaryHeadline = document.querySelector("#summary-headline");
const summaryPercent = document.querySelector("#summary-percent");
const summaryCopy = document.querySelector("#summary-copy");
const warningCopy = document.querySelector("#warning-copy");
const quarterTotal = document.querySelector("#quarter-total");
const quarterTotalLabel = document.querySelector("#quarter-total-label");
const quarterTotalNote = document.querySelector("#quarter-total-note");
const monthlyAverage = document.querySelector("#monthly-average");
const conversionList = document.querySelector("#conversion-list");
const goalLabel = document.querySelector("#goal-label");
const goalInput = document.querySelector("#goal-input");
const forecastNote = document.querySelector("#forecast-note");
const forecastList = document.querySelector("#forecast-list");
const emailInput = document.querySelector("#email-input");
const emailReportButton = document.querySelector("#email-report-button");
const previewReportButton = document.querySelector("#preview-report-button");
const improvementStageName = document.querySelector("#improvement-stage-name");
const improvementRate = document.querySelector("#improvement-rate");
const improvementSummary = document.querySelector("#improvement-summary");
const improvementDiagnosis = document.querySelector("#improvement-diagnosis");
const improvementTips = document.querySelector("#improvement-tips");

const heroContent = {
  process: [
    "First, build your funnel the way it actually works today.",
    "Choose the stages that match your process from first contact to signed agreement.",
    "Then, enter your numbers from the last three months.",
    "This allows us to calculate your conversion rates at each step, not just the end result.",
    "Once complete, you will see where your opportunities are, where deals are falling off, and exactly what needs to improve to reach your next quarter goals.",
  ],
};

let latestReport = "";
let latestWeakestStage = null;
let latestExpandedReportData = null;
const REPORT_STORAGE_KEY = "microConversionExpandedReport";

const improvementLibrary = {
  lead_to_call: {
    standard: {
      summary: "Your first conversion point is where momentum either starts or stalls. Improving this stage creates more real opportunities for everything downstream.",
      diagnosis: [
        "You are generating interest, but not enough of those leads are turning into real conversations.",
        "This usually points to a follow-up, contact, or booking-friction issue more than a sales issue.",
      ],
      tips: [
        ["Respond Faster Than You Think You Need To", "Speed to lead is one of the biggest drivers of conversion at this stage. Your goal is to respond within minutes, not hours."],
        ["Make Your Outreach About Booking The Call", "Your first touch should move the lead to a conversation. Every message should clearly point to one next step: scheduling the call."],
        ["Use Multiple Channels Immediately", "Send a text, an email, and place a call within your first outreach window to increase your chances of connection."],
        ["Follow Up Consistently For 5 To 7 Days", "Most teams give up too early. Stay in front of the lead long enough to connect and vary your messaging slightly."],
        ["Make It Easy To Take The Next Step", "Include a calendar link or offer specific times. Remove friction anywhere you can."],
      ],
    },
    low: {
      summary: "This stage is currently your biggest constraint. Until this improves, nothing downstream will matter as much.",
      diagnosis: [
        "You are losing a significant number of opportunities before a real conversation even starts.",
        "At this level, the issue is usually slow response time, weak outreach, inconsistent follow-up, or no clear path to book a call.",
      ],
      tips: [
        ["Respond Immediately, Not Eventually", "Your goal is to respond within minutes of a lead coming in. Waiting even a few hours can sharply reduce connection rates."],
        ["Make Your Only Goal Booking The Call", "Do not over-explain your services in the first touch. Every message should point to scheduling the call."],
        ["Use Text, Email, And A Call In The First Touch", "A multi-touch approach in the first hour gives you a much better chance of making contact."],
        ["Follow Up Every Day For At Least 5 To 7 Days", "If someone reached out, they had intent. Stay consistent until you get a clear yes or no."],
        ["Remove Friction From Scheduling", "Use a calendar link or offer specific times so it is easy to say yes."],
      ],
    },
  },
  call_to_consult: {
    standard: {
      summary: "You are getting people into conversation. The next opportunity is making those calls create enough trust and direction to move forward.",
      diagnosis: [
        "This stage improves when the call has stronger structure, clearer discovery, and a more direct close to the next step.",
        "If the conversation feels informative but not decisive, momentum tends to drop here.",
      ],
      tips: [
        ["Start Every Call With A Clear Structure", "Set expectations at the beginning of the call so they know what you will cover and what the outcome will be."],
        ["Ask More Than You Explain", "Your goal is to understand their situation, goals, and concerns before explaining your process."],
        ["Stop Over-Explaining Your Service", "Focus on what matters to them and keep your explanations tied to their specific situation."],
        ["Summarize Before Moving Forward", "Repeat back what you heard so they feel understood and aligned before you ask for commitment."],
        ["Close To A Specific, Dated Next Step", "Never end the call without a clear next action. Offer timing options and guide them to a decision."],
      ],
    },
    low: {
      summary: "You are getting people on the phone, but the conversation is not creating enough trust or direction to move forward.",
      diagnosis: [
        "At this level, the issue is not usually price or competition. It is how the call is being handled.",
        "This typically means too much talking, weak structure, or no clear transition into the next step.",
      ],
      tips: [
        ["Open Every Call With A Clear Agenda", "Set expectations immediately and tell them what the goal of the conversation is."],
        ["Ask More Questions Than You Answer", "If you are doing most of the talking, you are probably missing the information that drives the decision."],
        ["Stop Explaining Everything About Your Service", "Connect your solution to their needs instead of walking through every process detail."],
        ["Summarize What You Heard Before Moving Forward", "This builds trust and confirms alignment before you ask them to continue."],
        ["Close To A Specific, Scheduled Next Step", "Do not leave the call open-ended. Offer options and guide them to a decision."],
      ],
    },
  },
  consult_to_agreement: {
    standard: {
      summary: "Interest is there, but this stage improves when you carry momentum forward with more structure after the meeting.",
      diagnosis: [
        "The handoff from conversation to agreement needs to feel fast, clear, and directly tied to what the prospect wants.",
        "Delays or vague next steps can quickly cool off a warm opportunity here.",
      ],
      tips: [
        ["Set Expectations Before The Meeting Ends", "Clearly define what happens next, when they will receive the agreement, and when you will follow up."],
        ["Send The Agreement Quickly", "Momentum matters. Aim to send agreements within 24 hours."],
        ["Tie Your Recommendation Back To Their Goals", "Reinforce why your recommendation aligns with what they told you they want to accomplish."],
        ["Pair The Agreement With A Scheduled Follow-Up", "Do not send the agreement and wait. Set a time to review it together."],
        ["Remove Ambiguity In Your Communication", "Be clear about what they should do next, what decisions need to be made, and what the timeline looks like."],
      ],
    },
    low: {
      summary: "You are creating interest, but you are not carrying momentum forward strongly enough after the conversation.",
      diagnosis: [
        "At this level, deals tend to stall because the next step is not clearly structured.",
        "Common issues include no clear next step, delayed follow-up, and a weak transition from conversation to agreement.",
      ],
      tips: [
        ["Set The Next Step Before The Meeting Ends", "Tell them exactly what happens next, when they will receive the agreement, and when you will reconnect."],
        ["Send The Agreement Within 24 Hours", "The longer you wait, the more momentum you lose."],
        ["Recap Their Goals Before Sending Anything", "Tie your recommendation directly to the outcomes they said they want."],
        ["Schedule A Follow-Up When You Send The Agreement", "Do not send and wait. Set time to review it together."],
        ["Be Explicit About What Happens Next", "Remove ambiguity so they know what decisions need to be made and what the timeline is."],
      ],
    },
  },
  agreement_to_signed: {
    standard: {
      summary: "You are getting opportunities to the final stage. The biggest opportunity now is managing the close with more structure and guidance.",
      diagnosis: [
        "This stage improves when the agreement is paired with a follow-up plan, a guided review, and consistent reinforcement of value.",
        "If the agreement is sent passively, decisions often slow down here.",
      ],
      tips: [
        ["Never Send An Agreement Without A Follow-Up Plan", "Always control what happens after it is delivered by setting the next step."],
        ["Guide Them Through The Review Process", "Offer to walk through the agreement together and answer questions in real time."],
        ["Address Objections Before They Surface", "Think through the most common concerns and proactively speak to them."],
        ["Reinforce Value, Not Just Terms", "Tie everything back to their goals and what success looks like for them."],
        ["Follow Up Consistently And Clearly", "Stay present without being pushy. Direct follow-ups with clear next steps work best."],
      ],
    },
    low: {
      summary: "Deals are reaching the final stage, but they are not closing. This is usually a process issue in how the final step is being managed.",
      diagnosis: [
        "At this level, agreements are often being sent without structure, a guided review process, or consistent follow-up.",
        "Right now, too much of the final decision is being left to the prospect instead of being actively led.",
      ],
      tips: [
        ["Never Send An Agreement Without A Scheduled Next Step", "Set a review call immediately instead of relying on them to come back to you."],
        ["Walk Them Through The Agreement Live", "Guide them through key points and answer questions in real time."],
        ["Address Objections Before They Surface", "Speak to common concerns before they become blockers."],
        ["Reinforce Value, Not Just Terms", "Tie the decision back to their goals and what success looks like."],
        ["Follow Up With Consistency And Clarity", "Clear, direct follow-ups outperform passive check-ins every time."],
      ],
    },
  },
  generic: {
    standard: {
      summary: "This is the weakest point in your current funnel, which makes it the highest-leverage place to improve first.",
      diagnosis: [
        "When one stage underperforms the others, that is usually the first place to tighten messaging, process, and follow-up.",
        "Improving this one step can create a ripple effect through the rest of your quarter.",
      ],
      tips: [
        ["Clarify The Next Step", "Make sure the prospect always knows exactly what happens next and when."],
        ["Reduce Friction", "Look for anything that makes it harder to continue and simplify it."],
        ["Increase Speed", "Faster follow-up and faster handoffs protect momentum."],
        ["Lead The Process More Directly", "Do not leave the next action open-ended."],
        ["Review Messaging And Consistency", "Make sure communication is clear, specific, and repeated often enough."],
      ],
    },
    low: {
      summary: "This stage is a major bottleneck in your funnel and should be the first place you focus.",
      diagnosis: [
        "At this level, the issue is likely process clarity, speed, and consistency rather than just individual performance.",
        "Until this conversion improves, the rest of the funnel will stay underfed.",
      ],
      tips: [
        ["Respond Faster", "Protect momentum as quickly as possible."],
        ["Clarify The Next Action", "Tell prospects exactly what to do next."],
        ["Follow Up More Consistently", "Do not assume one touch is enough."],
        ["Use Multiple Touchpoints", "Do not rely on a single channel or a single attempt."],
        ["Remove Unnecessary Friction", "Make it easier to move forward at every handoff."],
      ],
    },
  },
};

function escapeHtml(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;").replaceAll("'", "&#39;");
}

function setHeroVisible(visible) {
  hero.classList.toggle("hidden-hero", !visible);
  widgetTitle.textContent = "Stop Guessing. Start Converting.";
  heroCopy.innerHTML = heroContent.process.map((text) => `<p>${escapeHtml(text)}</p>`).join("");
}

function parseCount(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
}

function formatPercent(numerator, denominator) {
  if (denominator <= 0) return "0.0%";
  return `${((numerator / denominator) * 100).toFixed(1)}%`;
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

function renderMonthInputs(stages) {
  monthsPanel.innerHTML = monthNames.map((monthName, monthIndex) => `
    <section class="month-card">
      <h3 class="month-title">${monthName}</h3>
      <div class="month-fields">
        ${stages.map((stage, stageIndex) => `
          <label class="field">
            <span>${stage}</span>
            <input type="number" min="0" step="1" data-month-index="${monthIndex}" data-stage-index="${stageIndex}" value="0">
          </label>
        `).join("")}
      </div>
    </section>
  `).join("");
}

function getQuarterData(stages) {
  return monthNames.map((_, monthIndex) => stages.map((_, stageIndex) => {
    const input = monthsPanel.querySelector(`[data-month-index="${monthIndex}"][data-stage-index="${stageIndex}"]`);
    return parseCount(input?.value ?? 0);
  }));
}

function buildForecast(stages, stageTotals) {
  const finalStageName = stages[stages.length - 1] ?? "Agreement Signed";
  goalLabel.textContent = finalStageName === "Agreement Signed" ? "Target Agreements Signed for Next Quarter" : `Target ${finalStageName} for Next Quarter`;
  const goal = parseCount(goalInput.value);
  if (goal <= 0) {
    forecastNote.textContent = "Enter your target and we will map out exactly what your funnel needs to produce at each stage to hit it.";
    forecastList.innerHTML = "";
    return [];
  }
  const ratios = [];
  for (let i = 0; i < stages.length - 1; i += 1) {
    ratios.push(stageTotals[i] > 0 ? stageTotals[i + 1] / stageTotals[i] : 0);
  }
  if (ratios.some((ratio) => ratio <= 0)) {
    forecastNote.textContent = "Enter enough quarter data for each stage before using the KPI planner. Right now at least one conversion step has no usable baseline.";
    forecastList.innerHTML = "";
    return [];
  }
  const recommendedTotals = new Array(stages.length).fill(0);
  recommendedTotals[stages.length - 1] = goal;
  for (let i = stages.length - 2; i >= 0; i -= 1) {
    recommendedTotals[i] = Math.ceil(recommendedTotals[i + 1] / ratios[i]);
  }
  forecastNote.textContent = `Enter your target and we will map out exactly what your funnel needs to produce at each stage to hit it.`;
  forecastList.innerHTML = stages.map((stage, index) => `
    <div class="conversion-row">
      <p class="conversion-name">${escapeHtml(stage)}</p>
      <p class="conversion-rate">${recommendedTotals[index]} Total | ${(recommendedTotals[index] / 3).toFixed(1)}/Mo</p>
    </div>
  `).join("");
  return recommendedTotals;
}

function getImprovementKey(fromStage, toStage) {
  const from = fromStage.toLowerCase();
  const to = toStage.toLowerCase();
  if (from.includes("new lead") && (to.includes("discovery") || to.includes("qualification"))) return "lead_to_call";
  if ((from.includes("discovery") || from.includes("qualification")) && (to.includes("onsite") || to.includes("consultation") || to.includes("call one") || to.includes("call two"))) return "call_to_consult";
  if ((from.includes("onsite") || from.includes("consultation") || from.includes("call one") || from.includes("call two")) && to.includes("agreement sent")) return "consult_to_agreement";
  if (from.includes("agreement sent") && to.includes("agreement signed")) return "agreement_to_signed";
  return "generic";
}

function renderImprovementStep(stageName, rateText, improvementData, isVeryLow) {
  improvementStageName.textContent = stageName;
  improvementRate.textContent = `${rateText} ${isVeryLow ? "Very Low Conversion" : "Current Conversion"}`;
  improvementSummary.textContent = improvementData.summary;
  improvementDiagnosis.innerHTML = improvementData.diagnosis.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("");
  improvementTips.innerHTML = improvementData.tips.map(([title, copy]) => `
    <article class="tip-card">
      <h4>${escapeHtml(title)}</h4>
      <p>${escapeHtml(copy)}</p>
    </article>
  `).join("");
}

function buildExpandedReportData(stages, stageTotals, overall, plan) {
  const firstStageName = stages[0] ?? "New Lead";
  const finalStageName = stages[stages.length - 1] ?? "Agreement Signed";
  const firstStageTotal = stageTotals[0] ?? 0;
  const finalStageTotal = stageTotals[stageTotals.length - 1] ?? 0;
  const goal = parseCount(goalInput.value);
  const improvementData = latestWeakestStage
    ? improvementLibrary[latestWeakestStage.key][latestWeakestStage.isVeryLow ? "low" : "standard"]
    : improvementLibrary.generic.standard;

  return {
    brandName: "Kristen Lopez Consulting",
    snapshot: {
      headline: `${finalStageTotal} ${finalStageName} From ${firstStageTotal} ${firstStageName}${firstStageTotal === 1 ? "" : "s"}`,
      rateLine: `${overall} Total Conversion Rate`,
      support: "This report breaks down what your funnel is currently producing and what needs to change to impact your next quarter.",
    },
    totals: stages.map((stage, index) => ({
      label: stage,
      value: String(stageTotals[index] ?? 0),
    })),
    conversions: stages.slice(0, -1).map((stage, index) => ({
      title: `${stage} To ${stages[index + 1]}`,
      note: `Measured from your full 3-month totals`,
      value: formatPercent(stageTotals[index + 1], stageTotals[index]),
    })),
    priorityFocus: {
      title: latestWeakestStage ? `${latestWeakestStage.from} To ${latestWeakestStage.to}` : "No stage identified yet",
      summary: improvementData.summary,
      diagnosis: improvementData.diagnosis,
      tips: improvementData.tips.map(([title, copy]) => ({ title, copy })),
    },
    goalSummary: goal > 0
      ? `Your target is ${goal} ${finalStageName.toLowerCase()} for next quarter. The plan below maps out what each stage needs to produce to support that target.`
      : "Enter a target inside the calculator to see a quarter-by-quarter production plan here.",
    forecast: plan.length
      ? stages.map((stage, index) => ({
          title: stage,
          note: `${(plan[index] / 3).toFixed(1)} per month`,
          value: `${plan[index]} Total`,
        }))
      : [{ title: "Next Quarter Plan", note: "", value: "No target entered yet" }],
  };
}

function saveExpandedReportData() {
  if (!latestExpandedReportData) {
    return;
  }

  window.localStorage.setItem(REPORT_STORAGE_KEY, JSON.stringify(latestExpandedReportData));
}

function updateResults() {
  const stages = getSelectedStages();
  const quarterData = getQuarterData(stages);
  const stageTotals = stages.map((_, stageIndex) => quarterData.reduce((sum, month) => sum + month[stageIndex], 0));
  const firstStageName = stages[0] ?? "New Lead";
  const finalStageName = stages[stages.length - 1] ?? "Agreement Signed";
  const firstStageTotal = stageTotals[0] ?? 0;
  const finalStageTotal = stageTotals[stageTotals.length - 1] ?? 0;
  const overall = formatPercent(finalStageTotal, firstStageTotal);

  summaryHeadline.textContent = `${finalStageTotal} ${finalStageName} From ${firstStageTotal} ${firstStageName}${firstStageTotal === 1 ? "" : "s"}`;
  summaryPercent.textContent = `${overall} Total Conversion Rate`;
  summaryCopy.textContent = "This is your current output. Now we break down each stage to understand what is driving it and what needs to change to impact your next quarter.";
  quarterTotalLabel.textContent = `Quarterly Total ${finalStageName}`;
  quarterTotalNote.textContent = `Total ${finalStageName.toLowerCase()} across all 3 months`;
  quarterTotal.textContent = String(finalStageTotal);
  monthlyAverage.textContent = (finalStageTotal / 3).toFixed(1);

  conversionList.innerHTML = stages.slice(0, -1).map((stage, index) => `
    <div class="conversion-row">
      <p class="conversion-name">${escapeHtml(stage)} To ${escapeHtml(stages[index + 1])}</p>
      <p class="conversion-rate">${formatPercent(stageTotals[index + 1], stageTotals[index])}</p>
    </div>
  `).join("");

  let weakest = null;
  stages.slice(0, -1).forEach((stage, index) => {
    const fromTotal = stageTotals[index];
    const toTotal = stageTotals[index + 1];
    const rateValue = fromTotal > 0 ? (toTotal / fromTotal) * 100 : 0;
    if (!weakest || rateValue < weakest.rateValue) {
      weakest = {
        from: stage,
        to: stages[index + 1],
        rateValue,
        rateText: formatPercent(toTotal, fromTotal),
      };
    }
  });

  if (weakest) {
    const key = getImprovementKey(weakest.from, weakest.to);
    const isVeryLow = weakest.rateValue < 50;
    const improvementData = improvementLibrary[key][isVeryLow ? "low" : "standard"];
    latestWeakestStage = { ...weakest, key, isVeryLow };
    renderImprovementStep(`${weakest.from} To ${weakest.to}`, weakest.rateText, improvementData, isVeryLow);
  }

  const warnings = [];
  quarterData.forEach((month, monthIndex) => {
    for (let i = 0; i < month.length - 1; i += 1) {
      if (month[i + 1] > month[i] && month[i] > 0) warnings.push(`${monthNames[monthIndex]} has more ${stages[i + 1]} than ${stages[i]}.`);
    }
  });
  if (warnings.length > 0) {
    warningCopy.hidden = false;
    warningCopy.textContent = `${warnings.join(" ")} Double-check those monthly counts if that is not intentional.`;
  } else {
    warningCopy.hidden = true;
    warningCopy.textContent = "";
  }

  const plan = buildForecast(stages, stageTotals);
  latestExpandedReportData = buildExpandedReportData(stages, stageTotals, overall, plan);
  latestReport = [
    "Quarterly KPI Report",
    "",
    `Process: ${stages.join(" > ")}`,
    `${finalStageTotal} ${finalStageName} From ${firstStageTotal} ${firstStageName}${firstStageTotal === 1 ? "" : "s"}`,
    `${overall} Total Conversion Rate`,
    "",
    "Average Micro Conversions:",
    ...stages.slice(0, -1).map((stage, index) => `${stage} To ${stages[index + 1]}: ${formatPercent(stageTotals[index + 1], stageTotals[index])}`),
    "",
    "Lowest Micro Conversion:",
    ...(latestWeakestStage ? [`${latestWeakestStage.from} To ${latestWeakestStage.to}: ${latestWeakestStage.rateText}`] : ["No stage available."]),
    "",
    "Next Quarter KPI Targets:",
    ...(plan.length ? stages.map((stage, index) => `${stage}: ${plan[index]}`) : ["No target entered yet."]),
  ].join("\n");
}

function goToDataStep() {
  const stages = getSelectedStages();
  if (stages.length < 2) {
    window.alert("Please select at least two stages.");
    return;
  }
  renderMonthInputs(stages);
  const processText = stages.join(" > ");
  selectedProcess.textContent = processText;
  selectedProcessResults.textContent = processText;
  setHeroVisible(false);
  processStep.classList.add("hidden");
  resultsStep.classList.add("hidden");
  improvementStep.classList.add("hidden");
  dataStep.classList.remove("hidden");
}

function goToResultsStep() {
  updateResults();
  setHeroVisible(false);
  dataStep.classList.add("hidden");
  processStep.classList.add("hidden");
  improvementStep.classList.add("hidden");
  resultsStep.classList.remove("hidden");
}

function goToProcessStep() {
  setHeroVisible(true);
  dataStep.classList.add("hidden");
  resultsStep.classList.add("hidden");
  improvementStep.classList.add("hidden");
  processStep.classList.remove("hidden");
}

function goToImprovementStep() {
  updateResults();
  setHeroVisible(false);
  processStep.classList.add("hidden");
  dataStep.classList.add("hidden");
  resultsStep.classList.add("hidden");
  improvementStep.classList.remove("hidden");
}

function createEmailDraft() {
  const recipient = emailInput.value.trim();
  const subject = encodeURIComponent("Quarterly KPI Report");
  const body = encodeURIComponent(latestReport);
  window.location.href = recipient ? `mailto:${encodeURIComponent(recipient)}?subject=${subject}&body=${body}` : `mailto:?subject=${subject}&body=${body}`;
}

function previewExpandedReport() {
  updateResults();
  saveExpandedReportData();
  const encodedReport = encodeURIComponent(JSON.stringify(latestExpandedReportData));
  window.open(`./report-template.html#report=${encodedReport}`, "_blank");
}

renderStageOptions();
setHeroVisible(true);
continueButton.addEventListener("click", goToDataStep);
backToProcessButton.addEventListener("click", goToProcessStep);
backToDataButton.addEventListener("click", () => { setHeroVisible(false); resultsStep.classList.add("hidden"); dataStep.classList.remove("hidden"); });
backToProcessFromResultsButton.addEventListener("click", goToProcessStep);
generateResultsButton.addEventListener("click", goToResultsStep);
showImprovementsButton.addEventListener("click", goToImprovementStep);
backToResultsButton.addEventListener("click", goToResultsStep);
backToDataFromImprovementButton.addEventListener("click", () => {
  setHeroVisible(false);
  improvementStep.classList.add("hidden");
  dataStep.classList.remove("hidden");
});
goalInput.addEventListener("input", updateResults);
emailReportButton.addEventListener("click", createEmailDraft);
previewReportButton.addEventListener("click", previewExpandedReport);
