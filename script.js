document.documentElement.classList.add("js");

const menuToggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");
const year = document.querySelector("[data-year]");
const productionOrigin = "https://miraichi-mms-site.pages.dev";

function getPublishedPageUrl() {
  const rawPath = window.location.pathname.replace(/\/$/, "/index.html");
  const path = rawPath === "/" ? "/index.html" : rawPath;
  return `${productionOrigin}${path}${window.location.hash || ""}`;
}

function updateLanguageLinks() {
  const switches = document.querySelectorAll("[data-language-switch]");
  if (!switches.length) {
    return;
  }

  const currentPath = `${window.location.pathname}${window.location.hash || ""}`;
  const publishedUrl = encodeURIComponent(getPublishedPageUrl());
  const targets = {
    ja: currentPath || "/",
    en: `https://translate.google.com/translate?sl=ja&tl=en&u=${publishedUrl}`,
    zh: `https://translate.google.com/translate?sl=ja&tl=zh-TW&u=${publishedUrl}`,
  };

  switches.forEach((switcher) => {
    switcher.querySelectorAll("[data-lang]").forEach((link) => {
      const lang = link.dataset.lang;
      if (!lang || !targets[lang]) {
        return;
      }
      link.href = targets[lang];
      if (lang === "ja") {
        link.removeAttribute("target");
        link.removeAttribute("rel");
      }
    });
  });
}

updateLanguageLinks();

function protectLinkedInLinks() {
  document.querySelectorAll("[data-linkedin-profile]").forEach((link) => {
    if (!(link instanceof HTMLAnchorElement)) {
      return;
    }

    const profile = link.dataset.linkedinProfile;
    if (!profile) {
      return;
    }

    const directUrl = `https://www.linkedin.com/in/${profile}/`;
    link.href = directUrl;
    link.target = "_blank";
    link.rel = "noopener";
    link.addEventListener("click", (event) => {
      event.preventDefault();
      window.open(directUrl, "_blank", "noopener");
    });
  });
}

protectLinkedInLinks();

if (year) {
  year.textContent = new Date().getFullYear();
}

if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = document.body.classList.toggle("menu-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "メニューを閉じる" : "メニューを開く");
  });

  nav.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      document.body.classList.remove("menu-open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "メニューを開く");
    }
  });
}

const revealTargets = [
  ".intro .section-inner",
  ".section:not(.hero) .section-heading",
  ".tool-strip",
  ".mms-grid",
  ".business-grid",
  ".steps-faq-grid",
  ".leader-grid",
  ".events-hero-grid",
  ".event-stats > *",
  ".event-grid > *",
  ".theme-list > *",
  ".source-grid",
  ".contact-inner",
  ".service-grid > *",
  ".reason-list > *",
  ".voice-grid > *",
  ".business-list > *",
  ".audience-grid > *",
  ".flow > *",
  ".faq-list > *",
].join(",");

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const revealItems = Array.from(document.querySelectorAll(revealTargets));

if (revealItems.length) {
  const staggerGroups = [
    ".service-grid",
    ".reason-list",
    ".voice-grid",
    ".business-list",
    ".audience-grid",
    ".flow",
    ".faq-list",
    ".event-stats",
    ".event-grid",
    ".theme-list",
  ];

  revealItems.forEach((item) => {
    item.classList.add("reveal");

    const group = staggerGroups.find((selector) => item.parentElement?.matches(selector));
    if (group && item.parentElement) {
      const index = Array.from(item.parentElement.children).indexOf(item);
      item.style.transitionDelay = `${Math.min(index * 0.1, 0.4)}s`;
    }
  });

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  } else {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.15 }
    );

    revealItems.forEach((item) => observer.observe(item));
  }
}

const eventList = document.querySelector("[data-event-list]");
const eventSearch = document.querySelector("[data-event-search]");
const eventCount = document.querySelector("[data-event-count]");
const eventFilter = document.querySelector("[data-event-filter]");
const proofMetrics = document.querySelector("[data-proof-metrics]");
const reportGrid = document.querySelector("[data-report-grid]");
const pastEvents = Array.isArray(window.MIRAICHI_PAST_EVENTS) ? window.MIRAICHI_PAST_EVENTS : [];
const activityData = window.MIRAICHI_ACTIVITY || { noteStats: null, reports: [] };

const noteReportMatchers = [
  { match: /どケチ駆動開発|cloudflare/i, label: "noteレポート" },
  { match: /gemini.*canvas/i, label: "noteレポート" },
  { match: /agent skills|自分専用/i, label: "noteレポート" },
  { match: /manus.*放置型/i, label: "noteレポート" },
  { match: /コードレビュー/i, label: "noteレポート" },
  { match: /x発信/i, label: "noteレポート" },
  { match: /スライド自動生成/i, label: "noteレポート" },
  { match: /hyperframes|remotion|動画制作/i, label: "noteレポート" },
  { match: /cursor 3/i, label: "noteレポート" },
  { match: /line.*ai秘書/i, label: "noteレポート" },
  { match: /discord.*ai相棒/i, label: "noteレポート" },
  { match: /google workspace/i, label: "noteレポート" },
  { match: /vercel|hp制作|ホームページ/i, label: "noteレポート" },
];

const attendanceMatchers = [
  { match: /もうパワポには絶対に戻れない|非常識なスライド制作/i, label: "1,200名超え" },
];

function getAttendanceLabel(event) {
  const matched = attendanceMatchers.find((item) => item.match.test(event.title));
  return matched ? matched.label : "公開なし";
}

function hasNoteReport(event) {
  return noteReportMatchers.some((item) => item.match.test(event.title));
}

function normalizeEvent(event) {
  return {
    ...event,
    attendanceLabel: getAttendanceLabel(event),
    hasAttendance: getAttendanceLabel(event) !== "公開なし",
    hasReport: hasNoteReport(event),
    isOffline: /県|都|府|道|市|区/.test(event.place || "") && event.place !== "オンライン",
  };
}

const enrichedEvents = pastEvents.map(normalizeEvent);

function renderActivityProof() {
  if (!proofMetrics || !reportGrid || !activityData.noteStats) {
    return;
  }

  const metrics = [
    {
      label: "Peatix Followers",
      value: activityData.noteStats.peatixFollowers,
      text: "Peatixでフォローされている公開コミュニティ規模",
    },
    {
      label: "Archive",
      value: `${activityData.noteStats.archiveCount}本`,
      text: "note上で読めるセミナーアーカイブの蓄積",
    },
    {
      label: "Report",
      value: activityData.noteStats.registrationHighlight,
      text: "開催レポート側で確認できた強い反響の一例",
    },
    {
      label: "Series",
      value: `${activityData.noteStats.dockerCount}本 / ${activityData.noteStats.webCount}本`,
      text: "Docker入門とWeb開発入門の継続シリーズ",
    },
  ];

  proofMetrics.textContent = "";
  const metricFragment = document.createDocumentFragment();
  metrics.forEach((metric) => {
    const card = document.createElement("article");
    const label = document.createElement("span");
    label.textContent = metric.label;
    const value = document.createElement("strong");
    value.textContent = metric.value;
    const text = document.createElement("p");
    text.textContent = metric.text;
    card.append(label, value, text);
    metricFragment.append(card);
  });
  proofMetrics.append(metricFragment);

  reportGrid.textContent = "";
  const reportFragment = document.createDocumentFragment();
  activityData.reports.forEach((report, index) => {
    const card = document.createElement("article");
    card.className = "report-card";
    const tag = document.createElement("span");
    tag.textContent = index < 4 ? "開催レポート" : "告知・活動報告";
    const title = document.createElement("h3");
    title.textContent = report.title;
    const text = document.createElement("p");
    text.textContent = report.excerpt || "noteで活動報告の詳細を読めます。";
    const link = document.createElement("a");
    link.href = report.href;
    link.target = "_blank";
    link.rel = "noopener";
    link.textContent = "noteで読む";
    card.append(tag, title, text, link);
    reportFragment.append(card);
  });
  reportGrid.append(reportFragment);
}

function renderPastEvents(query = "", filter = "all") {
  if (!eventList) {
    return;
  }

  const normalizedQuery = query.trim().toLowerCase();
  const byFilter = enrichedEvents.filter((event) => {
    if (filter === "attendance") {
      return event.hasAttendance;
    }
    if (filter === "online") {
      return !event.isOffline;
    }
    if (filter === "offline") {
      return event.isOffline;
    }
    if (filter === "report") {
      return event.hasReport;
    }
    return true;
  });
  const visibleEvents = normalizedQuery
    ? byFilter.filter((event) =>
        `${event.date} ${event.title} ${event.place} ${event.attendanceLabel}`.toLowerCase().includes(normalizedQuery)
      )
    : byFilter;

  eventList.textContent = "";

  const fragment = document.createDocumentFragment();
  visibleEvents.forEach((event) => {
    const link = document.createElement("a");
    link.className = "past-event-item";
    link.href = event.href;
    link.target = "_blank";
    link.rel = "noopener";

    const date = document.createElement("span");
    date.className = "past-event-date";
    date.textContent = event.date || "開催日";

    const title = document.createElement("span");
    title.className = "past-event-title";
    title.textContent = event.title;

    const place = document.createElement("span");
    place.className = "past-event-place";
    place.textContent = event.place || "Peatix";

    const attendance = document.createElement("span");
    attendance.className = `past-event-attendance${event.hasAttendance ? " is-known" : ""}`;
    attendance.textContent = event.attendanceLabel;

    link.append(date, title, place, attendance);
    fragment.append(link);
  });

  if (!visibleEvents.length) {
    const empty = document.createElement("p");
    empty.className = "event-browser-note";
    empty.textContent = "一致するイベントがありません。別のキーワードで検索してください。";
    fragment.append(empty);
  }

  eventList.append(fragment);

  if (eventCount) {
    eventCount.textContent = String(visibleEvents.length);
  }
}

if (eventList && pastEvents.length) {
  renderPastEvents();
  eventSearch?.addEventListener("input", (event) => {
    renderPastEvents(event.target.value, eventFilter?.value || "all");
  });
  eventFilter?.addEventListener("change", (event) => {
    renderPastEvents(eventSearch?.value || "", event.target.value);
  });
}

renderActivityProof();
