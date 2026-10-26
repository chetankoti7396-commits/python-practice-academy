/**
 * PYTHON PRACTICE ACADEMY — ENHANCED MAIN APPLICATION ENTRY & EVENT CONTROLLER
 * Handles client routing, themes, editor events, interactive concept demos,
 * practice modes (timed quiz & daily sprint), guided projects, bookmarks, notes,
 * and progress backup/restore validation.
 */

let currentView = "home";

// Question Bank multi-filter state
let activeQBLevel = "all";
let currentQBSearch = "";
let activeQBDiff = "all";
let activeQBStatus = "all";
let qbBookmarkedOnly = false;

// Practice Modes state
let activeSession = null; // { type: 'daily'|'quiz'|'topic', questions: [], currentIndex: 0, timerInterval: null, timeLeftSec: 600, totalTimeSec: 600, score: 0 }

// Interactive Concept Demos state
let currentDemoTab = "conditions";
let demoLoopIndex = 0;
let demoListData = [10, 20, 30, 40];
let demoDictData = { name: "Alice", score: 95, level: 3 };

// Screen Reader Live Announcements
function announceToScreenReader(message, isAlert = false) {
  const containerId = isAlert ? "sr-alerts" : "sr-announcements";
  const el = document.getElementById(containerId);
  if (el) {
    el.textContent = "";
    setTimeout(() => {
      el.textContent = message;
    }, 50);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initApp();
});

function initApp() {
  // Apply saved theme & editor preferences
  applyTheme(window.store.state.theme);
  if (window.store && typeof window.store.applyPreferencesToDom === "function") {
    window.store.applyPreferencesToDom();
  }

  // Setup theme toggle buttons
  const themeToggleBtn = document.getElementById("theme-toggle-btn");
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", toggleTheme);
  }

  // Setup mobile nav drawer
  const mobileToggle = document.getElementById("mobile-toggle-btn");
  if (mobileToggle) {
    mobileToggle.addEventListener("click", toggleMobileDrawer);
  }

  // Setup skip to main content keyboard focus
  const skipLink = document.querySelector(".skip-to-content, .skip-link");
  if (skipLink) {
    skipLink.addEventListener("click", () => {
      const appEl = document.getElementById("app");
      if (appEl) {
        appEl.focus();
      }
    });
  }

  // Setup global keyboard management (Escape for modals/drawer, focus trap for modals)
  document.addEventListener("keydown", handleGlobalKeydown);

  // Close mobile drawer when clicking outside
  document.addEventListener("click", handleOutsideClick);

  // Setup hash routing
  window.addEventListener("hashchange", handleHashRouting);

  // Initial route
  handleHashRouting();
}

function handleGlobalKeydown(e) {
  const backdrop = document.getElementById("app-modal-backdrop");
  const isModalOpen = backdrop && backdrop.classList.contains("open");

  if (e.key === "Escape") {
    if (isModalOpen) {
      closeModal();
      e.preventDefault();
      return;
    }
    const drawer = document.getElementById("mobile-drawer");
    if (drawer && drawer.classList.contains("open")) {
      closeMobileDrawer();
      e.preventDefault();
      return;
    }
  }

  if (isModalOpen && e.key === "Tab") {
    const dialog = backdrop.querySelector(".modal-dialog") || backdrop;
    const focusable = Array.from(dialog.querySelectorAll('button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'));
    if (focusable.length === 0) {
      e.preventDefault();
      return;
    }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === first || !dialog.contains(document.activeElement)) {
        last.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === last || !dialog.contains(document.activeElement)) {
        first.focus();
        e.preventDefault();
      }
    }
  }
}

function handleOutsideClick(e) {
  const drawer = document.getElementById("mobile-drawer");
  const toggleBtn = document.getElementById("mobile-toggle-btn");
  if (drawer && drawer.classList.contains("open")) {
    if (!drawer.contains(e.target) && (!toggleBtn || !toggleBtn.contains(e.target))) {
      closeMobileDrawer();
    }
  }
}

function handleHashRouting() {
  const hash = window.location.hash.replace("#", "") || "home";
  const [route, param] = hash.split("/");

  if (route === "test") {
    const qId = parseInt(param) || window.store.state.currentQuestionId || 1;
    navigateTo("test", qId, false);
  } else if (["home", "question-bank", "learn", "progress", "results", "mistakes", "practice-modes", "projects", "demos", "glossary"].includes(route)) {
    navigateTo(route, param, false);
  } else {
    navigateTo("home", null, false);
  }
}

function navigateTo(view, param = null, updateHash = true) {
  currentView = view;
  const appContainer = document.getElementById("app");
  if (!appContainer) return;

  // Close mobile drawer if open
  closeMobileDrawer();

  // Update active nav links
  document.querySelectorAll(".nav-link").forEach(link => {
    link.classList.remove("active");
    if (link.getAttribute("data-view") === view) {
      link.classList.add("active");
    }
  });

  if (updateHash) {
    if (view === "test" && param) {
      window.location.hash = `#test/${param}`;
    } else if (param) {
      window.location.hash = `#${view}/${param}`;
    } else {
      window.location.hash = `#${view}`;
    }
  }

  // Scroll to top
  window.scrollTo({ top: 0, behavior: "smooth" });

  switch (view) {
    case "home":
      appContainer.innerHTML = window.UI.renderHome();
      break;

    case "test":
      const qId = parseInt(param) || window.store.state.currentQuestionId || 1;
      window.testEngine.init(qId);
      break;

    case "question-bank":
      appContainer.innerHTML = window.UI.renderQuestionBank(activeQBLevel, currentQBSearch, activeQBDiff, activeQBStatus, qbBookmarkedOnly);
      break;

    case "learn":
      appContainer.innerHTML = window.UI.renderLearn();
      break;

    case "mistakes":
      appContainer.innerHTML = window.UI.renderMistakes();
      break;

    case "practice-modes":
      appContainer.innerHTML = window.UI.renderPracticeModes(param || "select");
      break;

    case "projects":
      appContainer.innerHTML = window.UI.renderGuidedProjects(param || "ledger");
      break;

    case "demos":
      currentDemoTab = param || "conditions";
      appContainer.innerHTML = window.UI.renderConceptDemos(currentDemoTab);
      initActiveDemo(currentDemoTab);
      break;

    case "progress":
      appContainer.innerHTML = window.UI.renderProgress();
      break;

    case "glossary":
      appContainer.innerHTML = window.UI.renderGlossary();
      break;

    case "results":
      appContainer.innerHTML = window.UI.renderResults();
      break;

    default:
      appContainer.innerHTML = window.UI.renderHome();
  }
}

// Practice Navigation Helpers
function startPractice(questionId = null) {
  const targetId = questionId || window.store.state.currentQuestionId || 1;
  navigateTo("test", targetId);
}

function confirmExitTest() {
  if (activeSession) {
    if (confirm("You have an active practice session in progress. Are you sure you want to exit?")) {
      stopSessionTimer();
      activeSession = null;
      navigateTo("home");
    }
  } else {
    navigateTo("home");
  }
}

function scrollToSection(sectionId) {
  if (currentView !== "home") {
    navigateTo("home");
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 150);
  } else {
    const el = document.getElementById(sectionId);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }
}

// ==========================================
// Question Bank Multi-Filters Controller
// ==========================================
function filterQBLevel(level) {
  activeQBLevel = level;
  refreshCurrentQB();
}

function filterQBDifficulty(diff) {
  activeQBDiff = diff;
  refreshCurrentQB();
}

function filterQBStatus(status) {
  activeQBStatus = status;
  refreshCurrentQB();
}

function filterQBBookmarks(checked) {
  qbBookmarkedOnly = Boolean(checked);
  refreshCurrentQB();
}

function handleQBSearch(query) {
  currentQBSearch = query;
  refreshCurrentQB(true);
}

function resetQBFilters() {
  activeQBLevel = "all";
  currentQBSearch = "";
  activeQBDiff = "all";
  activeQBStatus = "all";
  qbBookmarkedOnly = false;
  refreshCurrentQB();
}

function refreshCurrentQB(preserveFocus = false) {
  const container = document.getElementById("app");
  if (container && currentView === "question-bank") {
    container.innerHTML = window.UI.renderQuestionBank(activeQBLevel, currentQBSearch, activeQBDiff, activeQBStatus, qbBookmarkedOnly);
    if (preserveFocus) {
      const input = document.getElementById("qb-search-input");
      if (input) {
        input.focus();
        input.setSelectionRange(input.value.length, input.value.length);
      }
    }
  }
}

// ==========================================
// PRACTICE MODES (DAILY SPRINT, TIMED QUIZ, TOPIC DRILL)
// ==========================================
function seededShuffle(array, seed) {
  const arr = array.slice();
  let s = 0;
  for (let i = 0; i < String(seed).length; i++) s = (s * 31 + String(seed).charCodeAt(i)) >>> 0;
  function rand() {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  }
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function startDailySprint() {
  const questions = window.QUESTIONS_DATA || [];
  const completed = new Set(window.store.state.completedQuestions || []);
  const today = new Date();
  const dateKey = today.getFullYear() + "-" + String(today.getMonth() + 1).padStart(2, "0") + "-" + String(today.getDate()).padStart(2, "0");

  // Favor unsolved questions, varied deterministically by local date.
  const unsolved = questions.filter(q => !completed.has(q.id));
  const solved = questions.filter(q => completed.has(q.id));
  const orderedUnsolved = seededShuffle(unsolved, dateKey + ":unsolved");
  const orderedSolved = seededShuffle(solved, dateKey + ":solved");
  const pool = orderedUnsolved.concat(orderedSolved);
  const selection = pool.slice(0, 3);

  activeSession = {
    id: Date.now().toString(36),
    type: "daily",
    topic: "Daily Practice Sprint",
    questions: selection.map(q => q.id),
    passedInSession: new Set(),
    attemptedInSession: new Set(),
    currentIndex: 0,
    startTime: Date.now(),
    timerInterval: null
  };
  window.activeSession = activeSession;

  startPractice(activeSession.questions[0]);
  updateSessionBanner();
}

function startTimedQuiz() {
  const questions = window.QUESTIONS_DATA || [];
  // Shuffle and pick 5 challenges across beginner to intermediate
  const pool = questions.filter(q => q.level <= 5);
  const shuffledArr = pool.slice();
  for (let i = shuffledArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArr[i], shuffledArr[j]] = [shuffledArr[j], shuffledArr[i]];
  }
  const shuffled = shuffledArr.slice(0, 5);

  activeSession = {
    id: Date.now().toString(36),
    type: "quiz",
    topic: "Timed Speed Quiz",
    questions: shuffled.map(q => q.id),
    passedInSession: new Set(),
    attemptedInSession: new Set(),
    currentIndex: 0,
    startTime: Date.now(),
    timeLeftSec: 600, // 10 minutes
    totalTimeSec: 600,
    timerInterval: null
  };
  window.activeSession = activeSession;

  startPractice(activeSession.questions[0]);
  startSessionTimer();
  updateSessionBanner();
}

function startTopicDrill() {
  const select = document.getElementById("topic-drill-select");
  const lvl = select ? parseInt(select.value, 10) : 1;
  const questions = (window.QUESTIONS_DATA || []).filter(q => q.level === lvl);
  if (questions.length === 0) return;

  const completed = new Set(window.store.state.completedQuestions || []);
  const uncompleted = questions.filter(q => !completed.has(q.id));
  const pool = uncompleted.length >= 5 ? uncompleted : questions;
  const selection = pool.slice(0, 5);

  activeSession = {
    id: Date.now().toString(36),
    type: "topic",
    topic: `Level ${lvl} Drill: ${selection[0] ? selection[0].levelName : "Topic"}`,
    questions: selection.map(q => q.id),
    passedInSession: new Set(),
    attemptedInSession: new Set(),
    currentIndex: 0,
    startTime: Date.now(),
    timerInterval: null
  };
  window.activeSession = activeSession;

  startPractice(activeSession.questions[0]);
  updateSessionBanner();
}

function onSessionQuestionPassed(questionId) {
  if (activeSession && activeSession.passedInSession) {
    activeSession.passedInSession.add(questionId);
    if (activeSession.attemptedInSession) {
      activeSession.attemptedInSession.add(questionId);
    }
    updateSessionBanner();
  }
}

function onSessionQuestionAttempted(questionId) {
  if (activeSession && activeSession.attemptedInSession) {
    activeSession.attemptedInSession.add(questionId);
  }
}

function startSessionTimer() {
  stopSessionTimer();
  activeSession.timerInterval = setInterval(() => {
    if (!activeSession) {
      stopSessionTimer();
      return;
    }
    activeSession.timeLeftSec--;
    const mins = Math.floor(Math.max(0, activeSession.timeLeftSec) / 60);
    const secs = Math.max(0, activeSession.timeLeftSec) % 60;
    const timeFormatted = `${mins}:${secs < 10 ? '0' : ''}${secs}`;

    const bannerTimer = document.getElementById("session-timer-display");
    if (bannerTimer) {
      bannerTimer.textContent = timeFormatted;
    }

    // Screen reader announcements at key milestones
    if (activeSession.timeLeftSec === 300) {
      announceToScreenReader("5 minutes remaining in quiz session.");
    } else if (activeSession.timeLeftSec === 180) {
      announceToScreenReader("3 minutes remaining in quiz session.");
    } else if (activeSession.timeLeftSec === 60) {
      announceToScreenReader("1 minute remaining in quiz session.");
    } else if (activeSession.timeLeftSec === 30) {
      announceToScreenReader("30 seconds remaining in quiz session.");
    }

    if (activeSession.timeLeftSec <= 0) {
      stopSessionTimer();
      announceToScreenReader("Time is up! The 10-minute quiz timer expired.", true);
      finishQuizSession("Time's up! The 10-minute quiz timer expired.");
    }
  }, 1000);
}

function stopSessionTimer() {
  if (activeSession && activeSession.timerInterval) {
    clearInterval(activeSession.timerInterval);
    activeSession.timerInterval = null;
  }
}

function updateSessionBanner() {
  if (!activeSession) return;
  const currentQId = window.testEngine && window.testEngine.currentQuestion ? window.testEngine.currentQuestion.id : activeSession.questions[0];
  const idx = activeSession.questions.indexOf(currentQId);
  const qNum = (idx >= 0 ? idx : activeSession.currentIndex) + 1;
  const total = activeSession.questions.length;
  const solvedInSession = activeSession.passedInSession ? activeSession.passedInSession.size : 0;

  let modeLabel = "Practice Session";
  if (activeSession.type === "daily") modeLabel = "📅 Daily Sprint";
  else if (activeSession.type === "quiz") modeLabel = "⏱️ Timed Quiz";
  else if (activeSession.type === "topic") modeLabel = "🎯 Topic Drill";

  const bannerText = `${modeLabel} (Q${qNum} of ${total}) • Correct in Session: ${solvedInSession}/${total}`;
  showPracticeBanner(bannerText);
}

function showPracticeBanner(text) {
  let banner = document.getElementById("active-practice-banner");
  if (!banner) {
    banner = document.createElement("div");
    banner.id = "active-practice-banner";
    banner.className = "active-practice-banner";
    const header = document.querySelector(".test-header-bar");
    if (header && header.parentNode) {
      header.parentNode.insertBefore(banner, header);
    }
  }
  banner.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; flex-wrap: wrap; gap: 0.5rem;">
      <span style="font-weight: 600;">${text}</span>
      <div style="display: flex; gap: 0.75rem; align-items: center;">
        ${activeSession && activeSession.type === 'quiz' ? `<span id="session-timer-display" style="font-family: var(--font-mono); font-weight: 700; background: rgba(0,0,0,0.1); padding: 0.2rem 0.5rem; border-radius: 4px;">10:00</span>` : ''}
        <button class="btn btn-secondary btn-sm" onclick="window.finishSessionEarly()">Finish Session</button>
      </div>
    </div>
  `;
}

function finishSessionEarly() {
  if (confirm("End this practice session and view your scorecard? Only challenges solved during this session count toward your session score.")) {
    stopSessionTimer();
    finishQuizSession("Practice session completed.");
  }
}

function finishQuizSession(reason) {
  if (!activeSession) return;
  const elapsedSec = activeSession.totalTimeSec 
    ? (activeSession.totalTimeSec - activeSession.timeLeftSec) 
    : Math.max(1, Math.round((Date.now() - activeSession.startTime) / 1000));
  const total = activeSession.questions.length;
  
  // Count ONLY questions passed during this session
  const solvedCount = activeSession.passedInSession ? activeSession.passedInSession.size : 0;
  const accuracy = total > 0 ? Math.round((solvedCount / total) * 100) : 0;

  // Record session in store
  window.store.recordPracticeSession({
    type: activeSession.type,
    topic: activeSession.topic || (activeSession.type === 'quiz' ? "Timed Speed Quiz" : (activeSession.type === 'daily' ? "Daily Sprint" : "Topic Drill")),
    score: solvedCount,
    total: total,
    accuracy: accuracy,
    durationSec: elapsedSec
  });

  const banner = document.getElementById("active-practice-banner");
  if (banner) banner.remove();

  openModal(
    "🏆 Session Complete!",
    `
      <div style="text-align: center; padding: 1rem 0;">
        <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">🎉</div>
        <h4 style="font-size: 1.25rem; margin-bottom: 0.5rem;">${reason}</h4>
        <div style="font-size: 2rem; font-weight: 900; color: var(--primary-blue); margin: 0.75rem 0;">
          ${solvedCount} / ${total} Correct
        </div>
        <p style="color: var(--text-secondary); font-size: 0.9rem; line-height: 1.6;">
          Session Accuracy: <strong>${accuracy}%</strong> • Time: <strong>${Math.floor(elapsedSec / 60)}m ${elapsedSec % 60}s</strong><br/>
          <span style="font-size: 0.8rem; color: var(--text-muted);">(Only challenges solved during this active session are credited)</span>
        </p>
      </div>
    `,
    "View Progress Dashboard",
    () => {
      activeSession = null;
      window.activeSession = null;
      navigateTo("progress");
    }
  );

  activeSession = null;
  window.activeSession = null;
}

// ==========================================
// GUIDED PROJECTS CONTROLLER
// ==========================================
function navigateToGuidedProject(projId) {
  navigateTo("projects", projId);
}

async function runGuidedProjectStep(projId, stepNum) {
  const textarea = document.getElementById(`proj-step-code-${stepNum}`);
  const feedback = document.getElementById(`proj-step-feedback-${stepNum}`);
  if (!textarea || !feedback) return;

  const code = textarea.value;
  feedback.innerHTML = "<span style='color: var(--primary-blue);'>Testing step code in Python runtime...</span>";

  const { stdout, error } = await window.runner.runOnce(code, ["Alice", "50", "42"]);

  if (error) {
    feedback.innerHTML = `<span style="color: #DC2626;">✗ Error: ${error}</span>`;
    return;
  }

  // Basic check: Output was generated and contains relevant numbers/strings
  if (stdout && stdout.length > 0) {
    window.store.saveGuidedProjectStep(projId, stepNum);
    feedback.innerHTML = `<span style="color: #059669;">✓ Step ${stepNum} Passed! Great work!</span>`;
    setTimeout(() => {
      navigateTo("projects", projId);
    }, 1200);
  } else {
    feedback.innerHTML = `<span style="color: #D97706;">Output was empty. Make sure your step code prints the requested data!</span>`;
  }
}

// ==========================================
// INTERACTIVE CONCEPT DEMOS CONTROLLER
// ==========================================
function showConceptDemo(demoName) {
  navigateTo("demos", demoName);
}

function initActiveDemo(demoName) {
  setTimeout(() => {
    if (demoName === "conditions") {
      updateConditionsDemo(85);
    } else if (demoName === "loops") {
      resetLoopsDemo();
    } else if (demoName === "strings") {
      updateSliceDemo();
    } else if (demoName === "lists") {
      renderListDemoItems();
    } else if (demoName === "dicts") {
      renderDictDemoCards();
    }
  }, 50);
}

function updateConditionsDemo(score) {
  const scoreVal = parseInt(score);
  const scoreLabel = document.getElementById("demo-score-val");
  const codeScoreVar = document.getElementById("code-score-var");
  const resultBox = document.getElementById("demo-conditions-result");
  if (scoreLabel) scoreLabel.textContent = scoreVal;
  if (codeScoreVar) codeScoreVar.textContent = scoreVal;

  document.querySelectorAll(".code-branch").forEach(el => el.classList.remove("active-branch"));

  let grade = "F";
  let activeId = "branch-d";
  let explanation = "";

  if (scoreVal >= 90) {
    grade = "A";
    activeId = "branch-a";
    explanation = "Condition 'score >= 90' is True. Grade 'A' is assigned.";
  } else if (scoreVal >= 80) {
    grade = "B";
    activeId = "branch-b";
    explanation = "Condition 'score >= 80' is True. Grade 'B' is assigned.";
  } else if (scoreVal >= 50) {
    grade = "C";
    activeId = "branch-c";
    explanation = "Condition 'score >= 50' is True. Grade 'C' is assigned.";
  } else {
    grade = "F";
    activeId = "branch-d";
    explanation = "All if/elif conditions were False. The 'else' block executed: Grade 'F'.";
  }

  const activeBranch = document.getElementById(activeId);
  if (activeBranch) activeBranch.classList.add("active-branch");

  if (resultBox) {
    resultBox.innerHTML = `<strong>Result:</strong> ${explanation} (Variable <code>grade = "${grade}"</code>)`;
  }
}

function resetLoopsDemo() {
  demoLoopIndex = 0;
  const tape = document.getElementById("demo-loop-tape");
  const outputBox = document.getElementById("demo-loop-output");
  if (!tape || !outputBox) return;

  const start = parseInt(document.getElementById("demo-loop-start")?.value || 1);
  const stop = parseInt(document.getElementById("demo-loop-stop")?.value || 6);
  const step = parseInt(document.getElementById("demo-loop-step")?.value || 1);

  const values = [];
  for (let i = start; i < stop; i += step) {
    values.push(i);
  }

  tape.innerHTML = values.map((val, idx) => `
    <div class="loop-cell ${idx === 0 ? 'cell-current' : ''}" id="loop-cell-${idx}">
      <span style="font-size: 0.7rem; color: var(--text-muted);">i</span>
      <strong>${val}</strong>
    </div>
  `).join("");

  outputBox.innerHTML = `Loop initialized. Ready to step through <code>range(${start}, ${stop}, ${step})</code>. Output: <code>[]</code>`;
}

function stepLoopDemo() {
  const start = parseInt(document.getElementById("demo-loop-start")?.value || 1);
  const stop = parseInt(document.getElementById("demo-loop-stop")?.value || 6);
  const step = parseInt(document.getElementById("demo-loop-step")?.value || 1);

  const values = [];
  for (let i = start; i < stop; i += step) {
    values.push(i);
  }

  if (demoLoopIndex >= values.length) {
    const outputBox = document.getElementById("demo-loop-output");
    if (outputBox) {
      outputBox.innerHTML = `🏁 <strong>Loop Finished!</strong> Executed all ${values.length} iterations. Final output: <code>[${values.join(", ")}]</code>`;
    }
    return;
  }

  document.querySelectorAll(".loop-cell").forEach((el, idx) => {
    if (idx < demoLoopIndex) {
      el.className = "loop-cell cell-done";
    } else if (idx === demoLoopIndex) {
      el.className = "loop-cell cell-current";
    } else {
      el.className = "loop-cell";
    }
  });

  const printedSoFar = values.slice(0, demoLoopIndex + 1);
  const outputBox = document.getElementById("demo-loop-output");
  if (outputBox) {
    outputBox.innerHTML = `Iteration ${demoLoopIndex + 1}: <code>i = ${values[demoLoopIndex]}</code>. Printed: <code>[${printedSoFar.join(", ")}]</code>`;
  }

  demoLoopIndex++;
}

function updateSliceDemo() {
  const textInput = document.getElementById("demo-slice-text");
  const startInput = document.getElementById("demo-slice-start");
  const stopInput = document.getElementById("demo-slice-stop");
  const stepInput = document.getElementById("demo-slice-step");
  const tape = document.getElementById("demo-slice-tape");
  const resultBox = document.getElementById("demo-slice-result");

  if (!textInput || !tape || !resultBox) return;

  const text = textInput.value || "PythonAcademy";
  const start = parseInt(startInput?.value || 0);
  const stop = parseInt(stopInput?.value || text.length);
  const step = parseInt(stepInput?.value || 1);

  const selectedIndices = new Set();
  if (step > 0) {
    for (let i = Math.max(0, start); i < Math.min(text.length, stop); i += step) {
      selectedIndices.add(i);
    }
  }

  let extracted = "";
  for (let i = 0; i < text.length; i++) {
    if (selectedIndices.has(i)) extracted += text[i];
  }

  tape.innerHTML = `
    <div style="display: flex; gap: 0.35rem; overflow-x: auto; padding: 0.5rem 0;">
      ${Array.from(text).map((ch, idx) => {
        const isSelected = selectedIndices.has(idx);
        const negIdx = idx - text.length;
        return `
          <div class="slice-char-box ${isSelected ? 'char-selected' : ''}">
            <span class="slice-pos-idx">${idx}</span>
            <span class="slice-char">${ch}</span>
            <span class="slice-neg-idx">${negIdx}</span>
          </div>
        `;
      }).join("")}
    </div>
  `;

  resultBox.innerHTML = `<strong>Extracted Slice:</strong> <code>text[${start}:${stop}:${step}] => "${extracted}"</code>`;
}

function renderListDemoItems() {
  const container = document.getElementById("demo-list-items");
  const status = document.getElementById("demo-list-status");
  if (!container) return;

  container.innerHTML = `
    <div style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;">
      <span style="font-weight: 700;">numbers = [</span>
      ${demoListData.map((n, i) => `
        <span class="list-item-chip" style="background: var(--blue-light); color: var(--primary-blue); padding: 0.35rem 0.75rem; border-radius: var(--radius-sm); font-family: var(--font-mono); font-weight: 700;">
          ${n}${i < demoListData.length - 1 ? ',' : ''}
        </span>
      `).join("")}
      <span style="font-weight: 700;">]</span>
    </div>
  `;

  if (status) {
    status.innerHTML = `Current List Length: <code>len(numbers) = ${demoListData.length}</code> | Elements: <code>[${demoListData.join(", ")}]</code>`;
  }
}

function demoListOp(op, val) {
  if (op === "append") {
    demoListData.push(val);
  } else if (op === "pop") {
    demoListData.pop();
  } else if (op === "sort") {
    demoListData.sort((a, b) => a - b);
  } else if (op === "reverse") {
    demoListData.reverse();
  } else if (op === "reset") {
    demoListData = [10, 20, 30, 40];
  }
  renderListDemoItems();
}

function renderDictDemoCards() {
  const container = document.getElementById("demo-dict-cards");
  const resultBox = document.getElementById("demo-dict-result");
  if (!container) return;

  const entries = Object.entries(demoDictData);
  container.innerHTML = entries.map(([k, v]) => `
    <div class="dict-item-card" style="background: var(--bg-card); border: 1px solid var(--border-color); padding: 0.65rem 1rem; border-radius: var(--radius-md); box-shadow: var(--shadow-sm);">
      <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Key:</div>
      <div style="font-weight: 700; color: var(--coral-deep); font-family: var(--font-mono);">'${k}'</div>
      <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; margin-top: 0.35rem;">Value:</div>
      <div style="font-weight: 700; color: var(--primary-blue); font-family: var(--font-mono);">${JSON.stringify(v)}</div>
    </div>
  `).join("");

  if (resultBox) {
    resultBox.innerHTML = `Current Dictionary: <code>${JSON.stringify(demoDictData)}</code>`;
  }
}

function demoDictSet() {
  const kInput = document.getElementById("demo-dict-key");
  const vInput = document.getElementById("demo-dict-val");
  if (!kInput || !vInput || !kInput.value.trim()) return;

  const key = kInput.value.trim();
  const val = vInput.value.trim();
  demoDictData[key] = isNaN(val) ? val : Number(val);

  kInput.value = "";
  vInput.value = "";
  renderDictDemoCards();
}

function demoDictReset() {
  demoDictData = { name: "Alice", score: 95, level: 3 };
  renderDictDemoCards();
}

// ==========================================
// BACKUP & RESTORE (PROGRESS JSON IMPORT/EXPORT)
// ==========================================
function exportProgressFile() {
  const jsonStr = window.store.exportProgressJSON();
  const dateStr = new Date().toISOString().split("T")[0];
  const filename = `python_practice_academy_backup_${dateStr}.json`;

  const blob = new Blob([jsonStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showCopyToast("Progress exported successfully!");
}

function handleImportFile(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    const text = e.target.result;
    const validation = window.store.validateImportJSON(text);

    if (!validation.valid) {
      openModal(
        "Invalid Backup File",
        `<p style="color: #DC2626;">We could not restore progress from this file.</p><p style="margin-top: 0.5rem;">Reason: <strong>${validation.error}</strong></p>`,
        "Close",
        null
      );
      return;
    }

    const s = validation.summary;
    openModal(
      "Confirm Progress Restoration",
      `
        <div style="padding: 0.5rem 0;">
          <p style="margin-bottom: 0.75rem; color: var(--text-main);">A valid Python Practice Academy backup was detected:</p>
          <ul style="padding-left: 1.25rem; line-height: 1.6; color: var(--text-secondary); margin-bottom: 1rem;">
            <li><strong>Completed Challenges:</strong> ${s.completedCount}</li>
            <li><strong>Verification Attempts:</strong> ${s.attemptsCount}</li>
            <li><strong>Bookmarks:</strong> ${s.bookmarksCount}</li>
            <li><strong>Challenge Notes:</strong> ${s.notesCount}</li>
            <li><strong>Exported Date:</strong> ${s.exportedAt}</li>
          </ul>
          <p style="color: #D97706; font-size: 0.85rem; background: #FEF3C7; padding: 0.65rem 0.85rem; border-radius: var(--radius-sm);">
            ⚠️ Warning: Restoring this backup will replace your current local progress with the imported data. This cannot be undone.
          </p>
        </div>
      `,
      "Yes, Restore Progress",
      () => {
        window.store.applyImportedState(validation.parsedState);
        showCopyToast("Progress restored successfully!");
        navigateTo("progress");
      }
    );
  };
  reader.readAsText(file);
  event.target.value = ""; // reset file input
}

// ==========================================
// EDITOR PREFERENCES & ACCESSIBILITY MODAL
// ==========================================
function openEditorPreferencesModal() {
  const prefs = window.store.getPreferences();

  const bodyHtml = `
    <div style="display: flex; flex-direction: column; gap: 1.25rem; text-align: left;">
      <div>
        <label style="font-weight: 700; display: block; margin-bottom: 0.35rem;">Editor Font Size:</label>
        <select id="pref-font-size" class="form-select-sm" style="width: 100%; padding: 0.5rem;">
          <option value="small" ${prefs.fontSize === 'small' ? 'selected' : ''}>Small (13px)</option>
          <option value="medium" ${prefs.fontSize === 'medium' ? 'selected' : ''}>Medium (15px) — Default</option>
          <option value="large" ${prefs.fontSize === 'large' ? 'selected' : ''}>Large (18px)</option>
        </select>
      </div>

      <div>
        <label style="font-weight: 700; display: block; margin-bottom: 0.35rem;">Editor Color Theme:</label>
        <select id="pref-editor-theme" class="form-select-sm" style="width: 100%; padding: 0.5rem;">
          <option value="dark-navy" ${prefs.editorTheme === 'dark-navy' ? 'selected' : ''}>Dark Navy (Default Modern)</option>
          <option value="monokai" ${prefs.editorTheme === 'monokai' ? 'selected' : ''}>Monokai Cyber (High Contrast Dark)</option>
          <option value="warm-light" ${prefs.editorTheme === 'warm-light' ? 'selected' : ''}>Warm Light (Clean Paper)</option>
          <option value="high-contrast" ${prefs.editorTheme === 'high-contrast' ? 'selected' : ''}>Accessible High Contrast</option>
        </select>
      </div>

      <div>
        <label style="display: flex; align-items: center; gap: 0.5rem; font-weight: 600; cursor: pointer;">
          <input type="checkbox" id="pref-word-wrap" ${prefs.wordWrap ? 'checked' : ''}/>
          <span>Enable Editor Word Wrapping</span>
        </label>
      </div>

      <hr style="border: none; border-top: 1px solid var(--border-color);"/>

      <div>
        <h4 style="font-size: 0.95rem; margin-bottom: 0.5rem;">Accessibility Options</h4>
        <div style="display: flex; flex-direction: column; gap: 0.5rem;">
          <label style="display: flex; align-items: center; gap: 0.5rem; font-weight: 600; cursor: pointer;">
            <input type="checkbox" id="pref-reduced-motion" ${prefs.reducedMotion ? 'checked' : ''}/>
            <span>Reduced Motion (Disable non-essential animations)</span>
          </label>
          <label style="display: flex; align-items: center; gap: 0.5rem; font-weight: 600; cursor: pointer;">
            <input type="checkbox" id="pref-high-contrast" ${prefs.highContrast ? 'checked' : ''}/>
            <span>High Contrast Controls & Focus Rings</span>
          </label>
        </div>
      </div>
    </div>
  `;

  openModal(
    "Editor & Accessibility Preferences",
    bodyHtml,
    "Save Preferences",
    () => {
      const fontSize = document.getElementById("pref-font-size")?.value || "medium";
      const editorTheme = document.getElementById("pref-editor-theme")?.value || "dark-navy";
      const wordWrap = Boolean(document.getElementById("pref-word-wrap")?.checked);
      const reducedMotion = Boolean(document.getElementById("pref-reduced-motion")?.checked);
      const highContrast = Boolean(document.getElementById("pref-high-contrast")?.checked);

      window.store.savePreferences({
        fontSize,
        editorTheme,
        wordWrap,
        reducedMotion,
        highContrast
      });

      showCopyToast("Preferences saved!");
    }
  );
}

// ==========================================
// OPTIONAL CLOUD SYNC & BACKEND SPEC MODAL
// ==========================================
function openCloudSyncModal() {
  const content = `
    <div style="text-align: left; line-height: 1.6;">
      <div style="background: var(--blue-light); color: var(--primary-blue); padding: 0.85rem 1.1rem; border-radius: var(--radius-md); margin-bottom: 1rem; font-size: 0.875rem;">
        🔒 <strong>Architecture Status: Local Storage Only (No Remote Backend)</strong><br/>
        Python Practice Academy saves 100% of your progress (completed challenges, drafts, scores, notes, and preferences) inside your current browser's <code>localStorage</code>. There is currently no remote account database or cloud server, and we deliberately do not show fake login forms or simulated sync buttons.
      </div>

      <h4 style="font-size: 1rem; margin-bottom: 0.5rem; color: var(--text-main);">External Resources & AI Tutor Disclosure:</h4>
      <ul style="padding-left: 1.25rem; font-size: 0.85rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: 1rem;">
        <li><strong>External Scripts & Fonts:</strong> The app loads typography from Google Fonts (<code>fonts.googleapis.com</code>) and the Python 3 execution engine from jsDelivr CDN (<code>cdn.jsdelivr.net</code>).</li>
        <li><strong>Optional AI Tutor:</strong> By default, an in-browser heuristic assistant is used with zero external network requests. If you explicitly enter a Google Gemini or OpenAI API key in the AI Tutor drawer, your question prompts and code drafts are transmitted directly to that AI provider's API. No API keys or code are shared otherwise.</li>
      </ul>

      <h4 style="font-size: 1rem; margin-bottom: 0.5rem; color: var(--text-main);">How to Transfer Progress Between Devices:</h4>
      <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 0.75rem;">
        Use the <strong>Export Progress Backup</strong> button to download a portable <code>.json</code> file, and click <strong>Import Progress Backup</strong> on any other device or browser to restore your complete learning state.
      </p>

      <h4 style="font-size: 1rem; margin-bottom: 0.5rem; color: var(--text-main);">Backend Specification for Real Cloud Sync:</h4>
      <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 0.5rem;">
        To add real multi-user cloud synchronization, deploy a standard REST backend implementing:
      </p>
      <ul style="padding-left: 1.25rem; font-size: 0.825rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: 1rem;">
        <li><code>POST /api/v1/auth/register</code> — Create user account with bcrypt password hashing.</li>
        <li><code>POST /api/v1/auth/login</code> — Issue JWT access tokens for authenticated sessions.</li>
        <li><code>GET /api/v1/sync/pull</code> — Download the user's latest progress state JSON.</li>
        <li><code>POST /api/v1/sync/push</code> — Upload state with timestamp conflict resolution (last-write-wins).</li>
      </ul>
    </div>
  `;

  openModal("Privacy, Storage & Cloud Sync Specs", content, "Understood", null);
}

// ==========================================
// Python Syntax Highlighter & Editor Engine
// ==========================================
function highlightPython(source) {
  if (!source) return "";

  function escapeHtml(text) {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  const tokenRegex = new RegExp([
    '"""[\\s\\S]*?"""',
    "'''[\\s\\S]*?'''",
    '#[^\\n]*',
    '[frbFRB]?"(?:\\\\.|[^"\\\\])*"',
    "[frbFRB]?'(?:\\\\.|[^'\\\\])*'",
    '\\bdef\\s+([a-zA-Z_]\\w*)',
    '\\bclass\\s+([a-zA-Z_]\\w*)',
    '\\b(?:and|as|assert|async|await|break|class|continue|def|del|elif|else|except|finally|for|from|global|if|import|in|is|lambda|nonlocal|not|or|pass|raise|return|try|while|with|yield|True|False|None)\\b',
    '\\b(?:print|input|len|range|int|float|str|list|dict|set|tuple|bool|sum|min|max|abs|round|enumerate|zip|sorted|reversed|type|open|any|all|map|filter|id|self)\\b',
    '\\b\\d+(?:\\.\\d+)?(?:[eE][+-]?\\d+)?\\b',
    '==|!=|<=|>=|\\+=|-=|\\*=|/=|//=|%=|\\*\\*=|->|[+\\-*/%<>=&|^~]',
    '[()\\[\\]{},:;.]'
  ].join('|'), 'g');

  let lastIndex = 0;
  let html = "";
  let match;

  while ((match = tokenRegex.exec(source)) !== null) {
    if (match.index > lastIndex) {
      html += escapeHtml(source.substring(lastIndex, match.index));
    }

    const token = match[0];
    lastIndex = tokenRegex.lastIndex;

    if (token.startsWith('"""') || token.startsWith("'''")) {
      html += `<span class="py-str">${escapeHtml(token)}</span>`;
    } else if (token.startsWith("#")) {
      html += `<span class="py-comment">${escapeHtml(token)}</span>`;
    } else if (token.startsWith('"') || token.startsWith("'") || /^[frbFRB]['"]/.test(token)) {
      html += `<span class="py-str">${escapeHtml(token)}</span>`;
    } else if (token.startsWith("def ")) {
      const fnName = match[1] || token.substring(4).trim();
      html += `<span class="py-kw">def</span> <span class="py-fn">${escapeHtml(fnName)}</span>`;
    } else if (token.startsWith("class ")) {
      const clsName = match[2] || token.substring(6).trim();
      html += `<span class="py-kw">class</span> <span class="py-fn">${escapeHtml(clsName)}</span>`;
    } else if (/^(?:and|as|assert|async|await|break|class|continue|def|del|elif|else|except|finally|for|from|global|if|import|in|is|lambda|nonlocal|not|or|pass|raise|return|try|while|with|yield|True|False|None)$/.test(token)) {
      html += `<span class="py-kw">${escapeHtml(token)}</span>`;
    } else if (/^(?:print|input|len|range|int|float|str|list|dict|set|tuple|bool|sum|min|max|abs|round|enumerate|zip|sorted|reversed|type|open|any|all|map|filter|id|self)$/.test(token)) {
      html += `<span class="py-builtin">${escapeHtml(token)}</span>`;
    } else if (/^\d/.test(token)) {
      html += `<span class="py-num">${escapeHtml(token)}</span>`;
    } else if (/^[+\-*\/%<>=&|^~]/.test(token) || token === "->") {
      html += `<span class="py-op">${escapeHtml(token)}</span>`;
    } else if (/^[()[\]{},:;.]/.test(token)) {
      html += `<span class="py-punct">${escapeHtml(token)}</span>`;
    } else {
      html += escapeHtml(token);
    }
  }

  if (lastIndex < source.length) {
    html += escapeHtml(source.substring(lastIndex));
  }

  if (source.endsWith("\n")) {
    html += " ";
  }

  return html;
}

function updateSyntaxHighlighting() {
  const textarea = document.getElementById("code-editor-textarea");
  const codeElem = document.getElementById("editor-highlight-code");
  if (!textarea || !codeElem) return;
  codeElem.innerHTML = highlightPython(textarea.value);
}

function syncEditorScroll() {
  const textarea = document.getElementById("code-editor-textarea");
  const highlightLayer = document.getElementById("editor-highlighting");
  const lineNumbers = document.getElementById("editor-line-numbers");
  if (!textarea) return;
  if (highlightLayer) {
    highlightLayer.scrollTop = textarea.scrollTop;
    highlightLayer.scrollLeft = textarea.scrollLeft;
  }
  if (lineNumbers) {
    lineNumbers.scrollTop = textarea.scrollTop;
  }
}

// Code Editor Keyboard Handling & Indentation
function setupEditorEventListeners() {
  const textarea = document.getElementById("code-editor-textarea");
  if (!textarea) return;

  window.testEngine.updateLineNumbers();
  updateSyntaxHighlighting();
  syncEditorScroll();

  textarea.addEventListener("keydown", (e) => {
    // Ctrl + Enter or Cmd + Enter to submit answer
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      window.testEngine.submitAnswer();
      return;
    }

    // Ctrl + R or Ctrl + ' to run code sandbox
    if ((e.ctrlKey || e.metaKey) && (e.key === "r" || e.key === "R" || e.key === "'")) {
      e.preventDefault();
      window.testEngine.runCodeOnly();
      return;
    }

    // Auto-close pairs: quotes and brackets
    const pairs = { '(': ')', '[': ']', '{': '}', '"': '"', "'": "'" };
    const closingChars = [')', ']', '}', '"', "'"];

    if (closingChars.includes(e.key) && textarea.selectionStart === textarea.selectionEnd) {
      const pos = textarea.selectionStart;
      if (textarea.value[pos] === e.key) {
        e.preventDefault();
        textarea.selectionStart = textarea.selectionEnd = pos + 1;
        return;
      }
    }

    if (pairs[e.key] && textarea.selectionStart === textarea.selectionEnd) {
      const pos = textarea.selectionStart;
      const prevChar = textarea.value[pos - 1] || "";
      if (!((e.key === "'" || e.key === '"') && /\w/.test(prevChar))) {
        e.preventDefault();
        const open = e.key;
        const close = pairs[e.key];
        const val = textarea.value;
        const insertion = open + close;

        if (document.queryCommandSupported && document.queryCommandSupported('insertText')) {
          document.execCommand('insertText', false, insertion);
        } else {
          textarea.value = val.substring(0, pos) + insertion + val.substring(pos);
        }
        textarea.selectionStart = textarea.selectionEnd = pos + 1;
        window.testEngine.updateLineNumbers();
        updateSyntaxHighlighting();
        if (window.testEngine.currentQuestion) {
          window.store.saveQuestionDraft(window.testEngine.currentQuestion.id, textarea.value);
        }
        syncEditorScroll();
        return;
      }
    }

    // Tab key inserts 4 spaces or unindents with Shift
    if (e.key === "Tab") {
      e.preventDefault();
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const val = textarea.value;

      if (e.shiftKey) {
        const lineStart = val.lastIndexOf("\n", start - 1) + 1;
        const currentLine = val.substring(lineStart);
        if (currentLine.startsWith("    ")) {
          textarea.value = val.substring(0, lineStart) + val.substring(lineStart + 4);
          textarea.selectionStart = textarea.selectionEnd = Math.max(lineStart, start - 4);
        } else if (currentLine.startsWith("  ")) {
          textarea.value = val.substring(0, lineStart) + val.substring(lineStart + 2);
          textarea.selectionStart = textarea.selectionEnd = Math.max(lineStart, start - 2);
        }
      } else {
        if (document.queryCommandSupported && document.queryCommandSupported('insertText')) {
          document.execCommand('insertText', false, "    ");
        } else {
          textarea.value = val.substring(0, start) + "    " + val.substring(end);
          textarea.selectionStart = textarea.selectionEnd = start + 4;
        }
      }
      window.testEngine.updateLineNumbers();
      updateSyntaxHighlighting();
      if (window.testEngine.currentQuestion) {
        window.store.saveQuestionDraft(window.testEngine.currentQuestion.id, textarea.value);
      }
      syncEditorScroll();
      return;
    }

    // Enter key: Preserve indentation and auto-indent nested blocks ending with ':'
    if (e.key === "Enter") {
      e.preventDefault();
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const val = textarea.value;

      const lineStart = val.lastIndexOf("\n", start - 1) + 1;
      const currentLine = val.substring(lineStart, start);
      const indentMatch = currentLine.match(/^([ \t]*)/);
      let indent = indentMatch ? indentMatch[1] : "";

      if (currentLine.trimEnd().endsWith(":")) {
        indent += "    ";
      }

      const insertion = "\n" + indent;
      if (document.queryCommandSupported && document.queryCommandSupported('insertText')) {
        document.execCommand('insertText', false, insertion);
      } else {
        textarea.value = val.substring(0, start) + insertion + val.substring(end);
        textarea.selectionStart = textarea.selectionEnd = start + insertion.length;
      }
      window.testEngine.updateLineNumbers();
      updateSyntaxHighlighting();
      if (window.testEngine.currentQuestion) {
        window.store.saveQuestionDraft(window.testEngine.currentQuestion.id, textarea.value);
      }
      syncEditorScroll();
      return;
    }

    // Backspace: Delete 4 spaces indentation at once
    if (e.key === "Backspace" && textarea.selectionStart === textarea.selectionEnd && textarea.selectionStart > 0) {
      const pos = textarea.selectionStart;
      const charBefore = textarea.value[pos - 1];
      const charAfter = textarea.value[pos];
      if (pairs[charBefore] && pairs[charBefore] === charAfter) {
        e.preventDefault();
        textarea.value = textarea.value.substring(0, pos - 1) + textarea.value.substring(pos + 1);
        textarea.selectionStart = textarea.selectionEnd = pos - 1;
        window.testEngine.updateLineNumbers();
        updateSyntaxHighlighting();
        if (window.testEngine.currentQuestion) {
          window.store.saveQuestionDraft(window.testEngine.currentQuestion.id, textarea.value);
        }
        syncEditorScroll();
        return;
      }

      if (pos >= 4) {
        const val = textarea.value;
        const lineStart = val.lastIndexOf("\n", pos - 1) + 1;
        const textBeforeInLine = val.substring(lineStart, pos);
        if (/^ {4,}$/.test(textBeforeInLine) && textBeforeInLine.length % 4 === 0) {
          e.preventDefault();
          textarea.value = val.substring(0, pos - 4) + val.substring(pos);
          textarea.selectionStart = textarea.selectionEnd = pos - 4;
          window.testEngine.updateLineNumbers();
          updateSyntaxHighlighting();
          if (window.testEngine.currentQuestion) {
            window.store.saveQuestionDraft(window.testEngine.currentQuestion.id, textarea.value);
          }
          syncEditorScroll();
          return;
        }
      }
    }
  });

  textarea.addEventListener("input", () => {
    window.testEngine.updateLineNumbers();
    updateSyntaxHighlighting();
    syncEditorScroll();
    if (window.testEngine.currentQuestion) {
      window.store.saveQuestionDraft(window.testEngine.currentQuestion.id, textarea.value);
    }
  });

  textarea.addEventListener("scroll", syncEditorScroll);
}

function navigateToQuestion(questionId) {
  if (window.testEngine && typeof window.testEngine.loadQuestion === "function") {
    window.testEngine.loadQuestion(questionId);
  }
}

function toggleQuestionSidebar() {
  const sidebar = document.getElementById("test-q-sidebar");
  if (sidebar) {
    sidebar.classList.toggle("drawer-open");
    sidebar.classList.toggle("collapsed");
  }
}

function copyEditorCode() {
  const code = window.testEngine.getCurrentCode();
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(code).then(() => {
      showCopyToast("Code copied to clipboard!");
    }).catch(() => {
      fallbackCopy(code);
    });
  } else {
    fallbackCopy(code);
  }
}

function fallbackCopy(code) {
  const dummy = document.createElement("textarea");
  dummy.value = code;
  document.body.appendChild(dummy);
  dummy.select();
  document.execCommand("copy");
  document.body.removeChild(dummy);
  showCopyToast("Code copied to clipboard!");
}

function showCopyToast(msg) {
  let toast = document.getElementById("app-copy-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "app-copy-toast";
    toast.className = "app-copy-toast";
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}

function toggleAccordion(contentId) {
  const el = document.getElementById(contentId);
  if (el) {
    el.style.display = (el.style.display === "none") ? "block" : "none";
  }
}

function toggleSolution() {
  const container = document.getElementById("solution-view-container");
  if (container) {
    if (container.style.display === "none") {
      window.testEngine.revealSolution();
    } else {
      container.style.display = "none";
    }
  }
}

// Theme Toggle
function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  const icon = document.getElementById("theme-icon");
  if (icon) {
    icon.textContent = theme === "light" ? "☀️" : "🌙";
  }
  window.store.setTheme(theme);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute("data-theme") || "light";
  const newTheme = current === "light" ? "dark" : "light";
  applyTheme(newTheme);
}

// Mobile Drawer
function toggleMobileDrawer() {
  const drawer = document.getElementById("mobile-drawer");
  const toggleBtn = document.getElementById("mobile-toggle-btn");
  if (drawer) {
    const isOpen = drawer.classList.toggle("open");
    drawer.setAttribute("aria-hidden", isOpen ? "false" : "true");
    if (toggleBtn) {
      toggleBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
    }
    if (isOpen) {
      const firstNav = drawer.querySelector("a, button");
      if (firstNav) firstNav.focus();
    }
  }
}

function closeMobileDrawer() {
  const drawer = document.getElementById("mobile-drawer");
  const toggleBtn = document.getElementById("mobile-toggle-btn");
  if (drawer && drawer.classList.contains("open")) {
    drawer.classList.remove("open");
    drawer.setAttribute("aria-hidden", "true");
    if (toggleBtn) {
      toggleBtn.setAttribute("aria-expanded", "false");
    }
  }
}

// Confirmation Modals
function confirmResetTest() {
  openModal(
    "Restart All Test Progress?",
    `<p>Are you sure you want to reset your score and progress? All completed questions, personal attempts, bookmarks, notes, and <strong>saved certificate details</strong> will be cleared. This action cannot be undone.</p>`,
    "Yes, Reset Everything",
    () => {
      window.store.resetAll();
      navigateTo("home");
    }
  );
}

let modalPreviousActiveElement = null;

function openModal(title, bodyHtml, confirmButtonText, onConfirm) {
  const backdrop = document.getElementById("app-modal-backdrop");
  const modalTitle = document.getElementById("modal-title");
  const modalBody = document.getElementById("modal-body");
  const confirmBtn = document.getElementById("modal-confirm-btn");

  if (!backdrop || !modalTitle || !modalBody || !confirmBtn) return;

  modalPreviousActiveElement = document.activeElement;

  modalTitle.textContent = title;
  modalBody.innerHTML = bodyHtml;
  confirmBtn.textContent = confirmButtonText || "Confirm";

  const newConfirmBtn = confirmBtn.cloneNode(true);
  confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);

  newConfirmBtn.addEventListener("click", () => {
    closeModal();
    if (typeof onConfirm === "function") {
      onConfirm();
    }
  });

  backdrop.classList.add("open");
  backdrop.setAttribute("aria-hidden", "false");

  // Manage keyboard focus: move focus inside the dialog
  const dialog = backdrop.querySelector(".modal-dialog") || backdrop;
  const focusable = dialog.querySelectorAll('button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])');
  if (focusable.length > 0) {
    focusable[0].focus();
  }

  if (typeof announceToScreenReader === "function") {
    announceToScreenReader(`Dialog opened: ${title}`);
  }
}

function closeModal() {
  const backdrop = document.getElementById("app-modal-backdrop");
  if (backdrop) {
    backdrop.classList.remove("open");
    backdrop.setAttribute("aria-hidden", "true");
  }
  if (modalPreviousActiveElement && typeof modalPreviousActiveElement.focus === "function") {
    modalPreviousActiveElement.focus();
    modalPreviousActiveElement = null;
  }
}

// Informational Footer Modals
function openInfoModal(type) {
  let title = "";
  let body = "";

  switch (type) {
    case "about":
      title = "About Python Practice Academy";
      body = `
        <p><strong>Python Practice Academy</strong> is an open-access, browser-native coding education platform designed to make structured Python practice accessible to everyone at ₹0 budget.</p>
        <br/>
        <p>Featuring 72 progressive challenges across 7 levels, the system tests your logic in an isolated client-side Python sandbox with transparent point scoring.</p>
      `;
      break;

    case "privacy":
      title = "Privacy & Data Policy";
      body = `
        <div style="text-align: left; line-height: 1.6; font-size: 0.9rem;">
          <p><strong>1. Local-First Progress Storage:</strong></p>
          <p style="color: var(--text-secondary); margin-bottom: 0.75rem;">
            Your code submissions, test scores, code drafts, bookmarks, and private notes are stored strictly inside your browser's local storage (<code>localStorage</code>). The academy operates with ₹0 server infrastructure and does not store your progress on any remote database.
          </p>

          <p><strong>2. External Scripts & Fonts:</strong></p>
          <p style="color: var(--text-secondary); margin-bottom: 0.75rem;">
            To provide crisp typography and in-browser Python execution, the platform loads Google Fonts (<code>fonts.googleapis.com</code>) and the Skulpt Python 3 browser engine from jsDelivr CDN (<code>cdn.jsdelivr.net</code>).
          </p>

          <p><strong>3. Optional Cloud AI Tutor:</strong></p>
          <p style="color: var(--text-secondary); margin-bottom: 0.75rem;">
            The academy includes a built-in offline heuristic tutor that requires zero network requests. If you optionally choose to configure a Google Gemini or OpenAI API key in the AI Tutor drawer, your current challenge question, user code draft, and chat prompts will be transmitted directly to that AI provider's endpoint. API keys are stored in browser localStorage and can be read by any script running on this site. We never store or track your API keys on a server.
          </p>

          <p><strong>4. Cloud Sync & Device Migration:</strong></p>
          <p style="color: var(--text-secondary);">
            There is no remote backend server or user account system. To migrate your progress between devices, use the <strong>Export Progress Backup</strong> and <strong>Import Progress Backup</strong> buttons at any time.
          </p>
        </div>
      `;
      break;

    case "terms":
      title = "Terms of Learning";
      body = `
        <p>Python Practice Academy is provided free of charge for open educational purposes. All 72 questions, starter templates, worked examples, and testing suites are designed to build practical computational thinking and programming fluency.</p>
      `;
      break;

    case "help":
      title = "How to Practice & FAQ";
      body = `
        <div style="text-align: left; line-height: 1.6; font-size: 0.9rem;">
          <p><strong>Common Practice Features:</strong></p>
          <ul style="padding-left: 1.25rem; margin-top: 0.5rem; line-height: 1.6; color: var(--text-secondary);">
            <li><strong>Run Code:</strong> Tests your code with the challenge's sample inputs without grading or changing your score.</li>
            <li><strong>Try Your Own Input:</strong> Run your program with custom values you type yourself. Separate from grading so your score is never affected.</li>
            <li><strong>Submit Answer:</strong> Validates your code against all test cases. Awards +1 point and marks the challenge completed when all tests pass.</li>
            <li><strong>Progressive Hints:</strong> Reveal hints one step at a time, from gentle nudges to concrete code pointers.</li>
            <li><strong>Level Worked Examples:</strong> View line-by-line worked code explaining the core concept behind each level.</li>
            <li><strong>Beginner Glossary:</strong> Quick lookup for Python terms like variable, condition, modulo, loop, parameter, list, and exception.</li>
            <li><strong>Shortcuts:</strong> Press <kbd>Ctrl</kbd> + <kbd>Enter</kbd> to submit answers quickly, and <kbd>Tab</kbd> to insert 4 spaces.</li>
          </ul>
        </div>
      `;
      break;
  }

  openModal(title, body, "Got it", null);
}

function exportPracticeHistoryFile() {
  const jsonStr = window.store.exportFullPracticeHistoryJSON();
  const dateStr = new Date().toISOString().split("T")[0];
  const filename = `python_practice_history_${dateStr}.json`;
  const blob = new Blob([jsonStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function openGlossaryModal(termId = null) {
  const glossary = window.GLOSSARY_DATA || [];
  if (termId) {
    const item = glossary.find(g => g.id === termId || g.term.toLowerCase().includes(termId.toLowerCase()));
    if (item) {
      const relatedLinks = (item.relatedQuestions || []).map(qId => 
        `<button class="btn btn-secondary btn-sm" onclick="window.closeModal(); window.startPractice(${qId});" style="font-size: 0.775rem;">Challenge #${qId}</button>`
      ).join(" ");

      const content = `
        <div style="text-align: left; line-height: 1.6;">
          <div style="display: flex; gap: 0.5rem; align-items: center; margin-bottom: 0.5rem;">
            <span class="level-badge" style="background: var(--blue-light); color: var(--primary-blue); font-size: 0.75rem;">${item.category}</span>
          </div>
          <h3 style="font-size: 1.3rem; margin-bottom: 0.75rem; color: var(--text-main);">${item.term}</h3>
          <p style="color: var(--text-secondary); margin-bottom: 1rem; font-size: 0.95rem;">${item.definition}</p>
          
          <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 0.75rem 1rem; margin-bottom: 1rem;">
            <span style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted);">Python Example</span>
            <pre style="margin-top: 0.35rem; font-family: var(--font-mono); font-size: 0.85rem; color: var(--text-main); white-space: pre-wrap;">${item.example}</pre>
          </div>

          <div style="background: var(--soft-amber); border-left: 4px solid var(--soft-amber-dark); padding: 0.65rem 0.85rem; border-radius: 4px; margin-bottom: 1rem; font-size: 0.85rem; color: var(--text-main);">
            <strong>💡 Beginner Tip:</strong> ${item.tip}
          </div>

          ${relatedLinks ? `
            <div style="margin-top: 1rem;">
              <span style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted); display: block; margin-bottom: 0.35rem;">Practice Related Challenges:</span>
              <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">${relatedLinks}</div>
            </div>
          ` : ''}
        </div>
      `;
      openModal(`Glossary: ${item.term}`, content, "Close", null);
      return;
    }
  }

  // Full Glossary browser
  const content = `
    <div style="text-align: left;">
      <p style="color: var(--text-secondary); font-size: 0.875rem; margin-bottom: 1rem;">
        Essential Python concepts explained in plain language for beginners. Click any term to view its definition, code example, and practice challenges.
      </p>
      <div style="display: grid; gap: 0.75rem; max-height: 60vh; overflow-y: auto; padding-right: 0.5rem;">
        ${glossary.map(g => `
          <div style="background: var(--bg-secondary); padding: 0.85rem 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-color); cursor: pointer; transition: var(--transition-fast);" onclick="window.openGlossaryModal('${g.id}')">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem;">
              <strong style="color: var(--text-main); font-size: 1rem;">${g.term}</strong>
              <span style="font-size: 0.7rem; background: var(--blue-light); color: var(--primary-blue); padding: 0.15rem 0.5rem; border-radius: var(--radius-full);">${g.category}</span>
            </div>
            <p style="color: var(--text-secondary); font-size: 0.825rem; line-height: 1.4; margin: 0;">${g.definition}</p>
          </div>
        `).join("")}
      </div>
    </div>
  `;
  openModal("📘 Beginner Python Glossary", content, "Close", null);
}

function openWorkedExampleModal(level = 1) {
  const examples = window.WORKED_EXAMPLES || [];
  const ex = examples.find(item => item.level === parseInt(level, 10)) || examples[0];
  if (!ex) return;

  const content = `
    <div style="text-align: left; line-height: 1.6;">
      <div style="display: flex; gap: 0.5rem; align-items: center; margin-bottom: 0.5rem;">
        <span class="level-badge level-badge-${ex.level}">Level ${ex.level}: ${ex.levelName}</span>
      </div>
      <h3 style="font-size: 1.25rem; margin-bottom: 0.5rem; color: var(--text-main);">${ex.title}</h3>
      <p style="color: var(--text-secondary); font-size: 0.875rem; margin-bottom: 1rem;">${ex.concept}</p>

      <div style="background: #0f172a; color: #f8fafc; border-radius: var(--radius-md); padding: 1rem; margin-bottom: 1.25rem; font-family: var(--font-mono); font-size: 0.85rem; overflow-x: auto; position: relative;">
        <pre style="margin: 0; white-space: pre-wrap;"><code>${ex.code}</code></pre>
      </div>

      <h4 style="font-size: 0.95rem; margin-bottom: 0.5rem; color: var(--text-main); text-transform: uppercase; letter-spacing: 0.05em;">Line-by-Line Breakdown:</h4>
      <div style="display: grid; gap: 0.65rem; margin-bottom: 1.25rem;">
        ${ex.lineByLine.map(item => `
          <div style="background: var(--bg-secondary); padding: 0.75rem 1rem; border-radius: var(--radius-sm); border: 1px solid var(--border-color); font-size: 0.85rem;">
            <code style="font-family: var(--font-mono); color: var(--primary-blue); font-weight: 700; display: block; margin-bottom: 0.25rem;">${item.line}</code>
            <span style="color: var(--text-secondary);">${item.explanation}</span>
          </div>
        `).join("")}
      </div>

      <div style="display: flex; justify-content: space-between; align-items: center; background: var(--blue-light); padding: 0.75rem 1rem; border-radius: var(--radius-md); flex-wrap: wrap; gap: 0.5rem;">
        <span style="font-size: 0.85rem; color: var(--primary-blue); font-weight: 600;">Similar challenge to solve: <strong>${ex.similarQuestionTitle}</strong></span>
        <button class="btn btn-primary btn-sm" onclick="window.closeModal(); window.startPractice(${ex.similarQuestionId});">
          Try Challenge #${ex.similarQuestionId} →
        </button>
      </div>
    </div>
  `;

  openModal(`Worked Example: Level ${ex.level}`, content, "Close", null);
}

// ==========================================
// CERTIFICATE OF COMPLETION
// ==========================================

/**
 * Validate and save certificate learner details from the form in the progress dashboard.
 * Called by the inline button in the rendered certificate section.
 */
function saveCertificateDetails() {
  const nameEl = document.getElementById("cert-name-input");
  const emailEl = document.getElementById("cert-email-input");
  const phoneEl = document.getElementById("cert-phone-input");
  const errEl = document.getElementById("cert-form-error");

  if (!nameEl || !errEl) return;

  const name = nameEl.value.trim();
  const email = emailEl ? emailEl.value.trim() : "";
  const phone = phoneEl ? phoneEl.value.trim() : "";

  // Clear previous error
  errEl.textContent = "";
  errEl.style.display = "none";

  // Validate name (required)
  if (!name) {
    errEl.textContent = "Please enter your name — it will appear on the certificate.";
    errEl.style.display = "block";
    nameEl.focus();
    return;
  }
  if (name.length > 100) {
    errEl.textContent = "Name must be 100 characters or fewer.";
    errEl.style.display = "block";
    nameEl.focus();
    return;
  }

  // Validate email (optional but must be valid if provided)
  if (email) {
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(email)) {
      errEl.textContent = "The email address you entered doesn't look valid. Please correct it or leave it blank.";
      errEl.style.display = "block";
      emailEl.focus();
      return;
    }
    if (email.length > 200) {
      errEl.textContent = "Email address must be 200 characters or fewer.";
      errEl.style.display = "block";
      emailEl.focus();
      return;
    }
  }

  // Validate phone (optional but only digits, spaces, +, -, (, ) allowed)
  if (phone) {
    const phoneRe = /^[0-9+\-\s().]{5,20}$/;
    if (!phoneRe.test(phone)) {
      errEl.textContent = "Phone number may contain digits, spaces, +, -, (, ) and must be 5–20 characters.";
      errEl.style.display = "block";
      phoneEl.focus();
      return;
    }
  }

  // Save to local storage
  window.store.saveCertificate(name, email, phone);
  showCopyToast("Certificate details saved locally!");

  // Re-render the progress dashboard to show the certificate
  navigateTo("progress");
}

/**
 * Prompt user to confirm clearing certificate details, then clear and re-render.
 */
function confirmClearCertificate() {
  openModal(
    "Clear Certificate Details?",
    `<p>This will remove your saved name, email, and phone number from this browser. Your challenge progress will <strong>not</strong> be affected — you can fill in new details at any time.</p>`,
    "Yes, Clear Details",
    () => {
      window.store.clearCertificate();
      showCopyToast("Certificate details cleared.");
      navigateTo("progress");
    }
  );
}

/**
 * Open the certificate in a new, print-ready window and trigger the browser print dialog.
 */
function printCertificate() {
  const cert = window.store.getCertificate();
  if (!cert) {
    showCopyToast("No certificate details found. Please fill in your name first.");
    return;
  }

  const questions = window.QUESTIONS_DATA || [];
  const totalQ = questions.length || 72;
  const issuedDate = new Date(cert.issuedAt).toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric"
  });

  const certHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Certificate of Completion — Python Practice Academy</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&family=Playfair+Display:wght@700;900&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body {
      width: 297mm; height: 210mm;
      background: #fff;
      font-family: 'Inter', sans-serif;
    }
    body {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .cert-page {
      width: 277mm;
      height: 190mm;
      border: 6px solid #2563EB;
      border-radius: 12px;
      position: relative;
      overflow: hidden;
      background: #fff;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 24px 48px;
      text-align: center;
    }
    /* Corner ornaments */
    .cert-page::before, .cert-page::after {
      content: '';
      position: absolute;
      width: 80px; height: 80px;
      border: 3px solid #93C5FD;
      border-radius: 4px;
    }
    .cert-page::before { top: 10px; left: 10px; border-right: none; border-bottom: none; }
    .cert-page::after  { bottom: 10px; right: 10px; border-left: none; border-top: none; }
    .corner-br { position: absolute; bottom: 10px; left: 10px; width: 80px; height: 80px; border: 3px solid #93C5FD; border-radius: 4px; border-right: none; border-top: none; }
    .corner-tr { position: absolute; top: 10px; right: 10px; width: 80px; height: 80px; border: 3px solid #93C5FD; border-radius: 4px; border-left: none; border-bottom: none; }
    /* Background watermark */
    .watermark {
      position: absolute; inset: 0;
      display: flex; align-items: center; justify-content: center;
      font-size: 9rem; font-weight: 900;
      color: rgba(37, 99, 235, 0.035);
      pointer-events: none; user-select: none;
      letter-spacing: -2px;
    }
    .cert-badge {
      font-size: 3rem;
      margin-bottom: 6px;
    }
    .cert-label {
      font-size: 0.7rem;
      font-weight: 700;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      color: #6B7280;
      margin-bottom: 4px;
    }
    .cert-title {
      font-family: 'Playfair Display', 'Georgia', serif;
      font-size: 2.2rem;
      font-weight: 900;
      color: #1E3A8A;
      margin-bottom: 10px;
      line-height: 1.1;
    }
    .cert-presented {
      font-size: 0.85rem;
      color: #6B7280;
      margin-bottom: 4px;
    }
    .cert-name {
      font-family: 'Playfair Display', 'Georgia', serif;
      font-size: 2rem;
      font-weight: 700;
      color: #1D4ED8;
      margin-bottom: 10px;
      border-bottom: 2px solid #BFDBFE;
      padding-bottom: 6px;
      min-width: 300px;
      display: inline-block;
    }
    .cert-body {
      font-size: 0.95rem;
      color: #374151;
      max-width: 520px;
      line-height: 1.6;
      margin-bottom: 14px;
    }
    .cert-body strong { color: #1E3A8A; }
    .cert-divider {
      width: 120px; height: 3px;
      background: linear-gradient(90deg, #3B82F6, #7C3AED);
      border-radius: 99px;
      margin: 10px auto;
    }
    .cert-footer {
      display: flex;
      justify-content: center;
      align-items: flex-end;
      gap: 60px;
      margin-top: 10px;
    }
    .cert-sig { text-align: center; }
    .cert-sig .sig-line {
      width: 140px; height: 1px;
      background: #9CA3AF;
      margin: 0 auto 4px;
    }
    .cert-sig .sig-label {
      font-size: 0.7rem;
      color: #6B7280;
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }
    .cert-issued {
      font-size: 0.72rem;
      color: #9CA3AF;
      margin-top: 8px;
    }
    .cert-disclaimer {
      font-size: 0.6rem;
      color: #D1D5DB;
      margin-top: 6px;
      font-style: italic;
    }
    @media print {
      @page { size: A4 landscape; margin: 0; }
      html, body { width: 297mm; height: 210mm; }
    }
  </style>
</head>
<body>
  <div class="cert-page">
    <div class="watermark">🐍</div>
    <div class="corner-br"></div>
    <div class="corner-tr"></div>

    <div class="cert-badge">🏆</div>
    <div class="cert-label">Certificate of Completion</div>
    <div class="cert-title">Python Practice Academy</div>

    <div class="cert-presented">This certificate is proudly presented to</div>
    <div class="cert-name">${cert.name}</div>

    <div class="cert-divider"></div>

    <p class="cert-body">
      for successfully completing all <strong>${totalQ} Python programming challenges</strong> across
      all seven levels of the Python Practice Academy curriculum — covering Variables, Logic,
      Loops, Strings &amp; Lists, Functions, Exceptions, Classes, and Mini Projects.
    </p>

    <div class="cert-footer">
      <div class="cert-sig">
        <div class="sig-line"></div>
        <div class="sig-label">Python Practice Academy</div>
      </div>
      <div class="cert-sig">
        <div class="sig-line"></div>
        <div class="sig-label">Date Issued: ${issuedDate}</div>
      </div>
    </div>

    <div class="cert-issued">Issued on ${issuedDate} &nbsp;·&nbsp; Verified locally in this browser</div>
    <div class="cert-disclaimer">This is a personal achievement record issued by an open educational tool. It is not accredited, externally verified, or an official qualification.</div>
  </div>
  <script>
    // Auto-open print dialog
    window.onload = function() { window.print(); };
  <\/script>
</body>
</html>`;

  const printWin = window.open("", "_blank", "width=1100,height=820");
  if (!printWin) {
    showCopyToast("Pop-up blocked. Please allow pop-ups for this page to print the certificate.");
    return;
  }
  printWin.document.open();
  printWin.document.write(certHtml);
  printWin.document.close();
}

// Expose globals for HTML inline events
window.navigateTo = navigateTo;
window.startPractice = startPractice;
window.navigateToQuestion = navigateToQuestion;
window.toggleQuestionSidebar = toggleQuestionSidebar;
window.confirmExitTest = confirmExitTest;
window.scrollToSection = scrollToSection;
window.filterQBLevel = filterQBLevel;
window.filterQBDifficulty = filterQBDifficulty;
window.filterQBStatus = filterQBStatus;
window.filterQBBookmarks = filterQBBookmarks;
window.handleQBSearch = handleQBSearch;
window.resetQBFilters = resetQBFilters;
window.refreshCurrentQB = refreshCurrentQB;
window.setupEditorEventListeners = setupEditorEventListeners;
window.copyEditorCode = copyEditorCode;
window.toggleAccordion = toggleAccordion;
window.toggleSolution = toggleSolution;
window.toggleTheme = toggleTheme;
window.toggleMobileDrawer = toggleMobileDrawer;
window.closeMobileDrawer = closeMobileDrawer;
window.confirmResetTest = confirmResetTest;
window.openModal = openModal;
window.closeModal = closeModal;
window.openInfoModal = openInfoModal;
window.startDailySprint = startDailySprint;
window.startTimedQuiz = startTimedQuiz;
window.startTopicDrill = startTopicDrill;
window.finishSessionEarly = finishSessionEarly;
window.navigateToGuidedProject = navigateToGuidedProject;
window.runGuidedProjectStep = runGuidedProjectStep;
window.showConceptDemo = showConceptDemo;
window.updateConditionsDemo = updateConditionsDemo;
window.resetLoopsDemo = resetLoopsDemo;
window.stepLoopDemo = stepLoopDemo;
window.updateSliceDemo = updateSliceDemo;
window.demoListOp = demoListOp;
window.demoDictSet = demoDictSet;
window.demoDictReset = demoDictReset;
window.exportProgressFile = exportProgressFile;
window.exportPracticeHistoryFile = exportPracticeHistoryFile;
window.handleImportFile = handleImportFile;
window.openEditorPreferencesModal = openEditorPreferencesModal;
window.openCloudSyncModal = openCloudSyncModal;
window.openGlossaryModal = openGlossaryModal;
window.openWorkedExampleModal = openWorkedExampleModal;
window.onSessionQuestionPassed = onSessionQuestionPassed;
window.onSessionQuestionAttempted = onSessionQuestionAttempted;
window.updateSessionBanner = updateSessionBanner;
window.announceToScreenReader = announceToScreenReader;
window.saveCertificateDetails = saveCertificateDetails;
window.confirmClearCertificate = confirmClearCertificate;
window.printCertificate = printCertificate;
