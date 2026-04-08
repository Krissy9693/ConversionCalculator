(function () {
  const STORAGE_KEY = "microConversionExpandedReport";

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll("\"", "&quot;")
      .replaceAll("'", "&#39;");
  }

  function readReportData() {
    try {
      const hash = window.location.hash || "";
      const prefix = "#report=";
      if (hash.startsWith(prefix)) {
        return JSON.parse(decodeURIComponent(hash.slice(prefix.length)));
      }
    } catch (error) {
      // Fall through to localStorage fallback.
    }

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      return null;
    }
  }

  function renderEmptyState() {
    document.querySelector("#report-subtitle").textContent = "Open this page after generating results inside the calculator.";
  }

  function renderMetricCards(container, items) {
    container.innerHTML = items.map((item) => `
      <article class="metric-card">
        <p class="metric-label">${escapeHtml(item.label)}</p>
        <p class="metric-value">${escapeHtml(item.value)}</p>
      </article>
    `).join("");
  }

  function renderRows(container, items) {
    container.innerHTML = items.map((item) => `
      <article class="report-row">
        <div>
          <p class="report-row-title">${escapeHtml(item.title)}</p>
          ${item.note ? `<p class="report-row-note">${escapeHtml(item.note)}</p>` : ""}
        </div>
        <p class="report-row-value">${escapeHtml(item.value)}</p>
      </article>
    `).join("");
  }

  function renderTips(container, items) {
    container.innerHTML = items.map((item) => `
      <article class="tip-card">
        <h4>${escapeHtml(item.title)}</h4>
        <p>${escapeHtml(item.copy)}</p>
      </article>
    `).join("");
  }

  function renderBodyCopy(container, paragraphs) {
    container.innerHTML = paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("");
  }

  function renderReport(data) {
    document.querySelector("#report-subtitle").textContent = `Prepared for ${data.brandName} using the last 3 months of funnel data.`;
    document.querySelector("#snapshot-headline").textContent = data.snapshot.headline;
    document.querySelector("#snapshot-rate").textContent = data.snapshot.rateLine;
    document.querySelector("#snapshot-support").textContent = data.snapshot.support;
    document.querySelector("#priority-focus").textContent = data.priorityFocus.title;
    document.querySelector("#weakest-stage-title").textContent = data.priorityFocus.title;
    document.querySelector("#weakest-stage-summary").textContent = data.priorityFocus.summary;
    document.querySelector("#goal-copy").textContent = data.goalSummary;

    renderMetricCards(document.querySelector("#totals-grid"), data.totals);
    renderRows(document.querySelector("#conversion-list"), data.conversions);
    renderBodyCopy(document.querySelector("#diagnosis-copy"), data.priorityFocus.diagnosis);
    renderTips(document.querySelector("#tips-list"), data.priorityFocus.tips);
    renderRows(document.querySelector("#forecast-list"), data.forecast);
  }

  const reportData = readReportData();
  if (!reportData) {
    renderEmptyState();
    return;
  }

  renderReport(reportData);
})();
