/**
 * PYTHON PRACTICE ACADEMY — ENHANCED STORAGE & STATE MANAGER (v2)
 * Resilient, privacy-friendly, local-only persistence.
 * Supports bookmarks, notes, editor preferences, guided projects,
 * practice sessions, mistake tracking, and verified import/export.
 */

const STORAGE_KEY = "python_practice_academy_v2";
const LEGACY_STORAGE_KEY = "python_practice_academy_v1";

const DEFAULT_PREFERENCES = {
  fontSize: "medium",      // 'small' (13px), 'medium' (15px), 'large' (18px)
  wordWrap: true,          // boolean
  editorTheme: "dark-navy",// 'dark-navy' | 'monokai' | 'warm-light' | 'high-contrast'
  reducedMotion: false,    // boolean
  highContrast: false      // boolean
};

const DEFAULT_STATE = {
  version: 2,
  currentQuestionId: 1,
  score: 0,
  completedQuestions: [],       // array of question IDs
  assistedQuestions: [],        // array of question IDs where solution was viewed
  codeDrafts: {},               // { [id]: string }
  attempts: [],                 // [ { id, questionId, timestamp, passed, codeSnippet, details } ]
  unresolvedMistakes: {},       // { [questionId]: { questionId, failedCount, latestAttempt, timestamp } }
  bookmarks: [],                // [ questionId, ... ]
  notes: {},                    // { [questionId]: string }
  preferences: { ...DEFAULT_PREFERENCES },
  guidedProjects: {},           // { [projId]: { currentStep, completedSteps: [] } }
  practiceSessions: [],         // [ { id, type, topic, date, score, total, accuracy, durationSec } ]
  practiceDates: [],           // [ "YYYY-MM-DD" local dates with at least one completed challenge ]
  theme: "light",
  startedAt: new Date().toISOString(),
  lastActive: new Date().toISOString(),
  certificate: null             // { name, email, phone, issuedAt } — stored locally only, never sent anywhere
};

class ProgressStore {
  constructor() {
    this.state = this.loadState();
  }

  getMaxQuestionId() {
    if (typeof window !== "undefined" && Array.isArray(window.QUESTIONS_DATA) && window.QUESTIONS_DATA.length > 0) {
      return window.QUESTIONS_DATA.length;
    }
    return 72;
  }

  // Load state with deep validation & legacy v1 auto-migration
  loadState() {
    try {
      if (typeof window === "undefined" || !window.localStorage) {
        return { ...DEFAULT_STATE };
      }

      let raw = localStorage.getItem(STORAGE_KEY);
      let isLegacy = false;

      // Check for legacy v1 state if v2 doesn't exist yet
      if (!raw) {
        raw = localStorage.getItem(LEGACY_STORAGE_KEY);
        if (raw) isLegacy = true;
      }

      if (!raw) {
        return { ...DEFAULT_STATE };
      }

      const parsed = JSON.parse(raw);

      if (typeof parsed !== "object" || parsed === null) {
        console.warn("Corrupted progress state detected. Reverting to default schema.");
        return { ...DEFAULT_STATE };
      }

      const maxQ = 200; // Allow dynamic scaling

      const state = {
        version: 2,
        currentQuestionId: Number.isInteger(parsed.currentQuestionId) && parsed.currentQuestionId >= 1 && parsed.currentQuestionId <= maxQ ? parsed.currentQuestionId : 1,
        score: Array.isArray(parsed.completedQuestions) ? parsed.completedQuestions.length : 0,
        completedQuestions: Array.isArray(parsed.completedQuestions) 
          ? parsed.completedQuestions.filter(id => Number.isInteger(id) && id >= 1 && id <= maxQ) 
          : [],
        assistedQuestions: Array.isArray(parsed.assistedQuestions) 
          ? parsed.assistedQuestions.filter(id => Number.isInteger(id) && id >= 1 && id <= maxQ) 
          : [],
        codeDrafts: typeof parsed.codeDrafts === "object" && parsed.codeDrafts !== null ? parsed.codeDrafts : {},
        attempts: Array.isArray(parsed.attempts) ? parsed.attempts.slice(0, 300) : [],
        unresolvedMistakes: typeof parsed.unresolvedMistakes === "object" && parsed.unresolvedMistakes !== null ? parsed.unresolvedMistakes : {},
        bookmarks: Array.isArray(parsed.bookmarks) 
          ? parsed.bookmarks.filter(id => Number.isInteger(id) && id >= 1 && id <= maxQ) 
          : [],
        notes: typeof parsed.notes === "object" && parsed.notes !== null ? parsed.notes : {},
        preferences: {
          ...DEFAULT_PREFERENCES,
          ...(typeof parsed.preferences === "object" && parsed.preferences !== null ? parsed.preferences : {})
        },
        guidedProjects: typeof parsed.guidedProjects === "object" && parsed.guidedProjects !== null ? parsed.guidedProjects : {},
        practiceSessions: Array.isArray(parsed.practiceSessions) ? parsed.practiceSessions.slice(0, 100) : [],
        practiceDates: Array.isArray(parsed.practiceDates) ? parsed.practiceDates.filter(d => typeof d === "string" && /^\d{4}-\d{2}-\d{2}$/.test(d)).slice(0, 3650) : [],
        theme: parsed.theme === "dark" ? "dark" : "light",
        startedAt: parsed.startedAt || new Date().toISOString(),
        lastActive: new Date().toISOString(),
        // Certificate: preserve if it was saved; validate its shape
        certificate: (
          parsed.certificate &&
          typeof parsed.certificate === "object" &&
          typeof parsed.certificate.name === "string" &&
          parsed.certificate.name.trim().length > 0 &&
          typeof parsed.certificate.issuedAt === "string"
        ) ? {
          name: parsed.certificate.name.trim(),
          email: typeof parsed.certificate.email === "string" ? parsed.certificate.email.trim() : "",
          phone: typeof parsed.certificate.phone === "string" ? parsed.certificate.phone.trim() : "",
          issuedAt: parsed.certificate.issuedAt
        } : null
      };

      // Populate unresolved mistakes from attempts if migrating or unpopulated
      const completedSet = new Set(state.completedQuestions);
      if (Object.keys(state.unresolvedMistakes).length === 0 && Array.isArray(state.attempts)) {
        for (let i = state.attempts.length - 1; i >= 0; i--) {
          const att = state.attempts[i];
          if (!att.passed && !completedSet.has(att.questionId)) {
            if (!state.unresolvedMistakes[att.questionId]) {
              state.unresolvedMistakes[att.questionId] = {
                questionId: att.questionId,
                failedCount: 1,
                latestAttempt: att,
                timestamp: att.timestamp
              };
            } else {
              state.unresolvedMistakes[att.questionId].failedCount++;
              state.unresolvedMistakes[att.questionId].latestAttempt = att;
              state.unresolvedMistakes[att.questionId].timestamp = att.timestamp;
            }
          }
        }
      }

      // Clean out any completed questions from unresolved mistakes
      for (const qId of state.completedQuestions) {
        if (state.unresolvedMistakes[qId]) {
          delete state.unresolvedMistakes[qId];
        }
      }

      // Recalculate score strictly from unique completed questions
      state.score = state.completedQuestions.length;

      // If we loaded from legacy, persist to new key immediately
      if (isLegacy) {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch (e) {
          console.warn("Could not write migrated state to v2 key", e);
        }
      }

      return state;
    } catch (err) {
      console.error("Failed to load progress from localStorage:", err);
      return { ...DEFAULT_STATE };
    }
  }

  save() {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        this.state.lastActive = new Date().toISOString();
        this.state.score = this.state.completedQuestions.length;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      }
    } catch (err) {
      console.error("Failed to save progress to localStorage:", err);
    }
  }

  getQuestionDraft(questionId, defaultStarter = "") {
    if (this.state.codeDrafts && this.state.codeDrafts[questionId] !== undefined) {
      return this.state.codeDrafts[questionId];
    }
    return defaultStarter;
  }

  saveQuestionDraft(questionId, code) {
    if (!this.state.codeDrafts) this.state.codeDrafts = {};
    this.state.codeDrafts[questionId] = code;
    this.save();
  }

  markQuestionComplete(questionId, isAssisted = false) {
    if (!this.state.completedQuestions.includes(questionId)) {
      this.state.completedQuestions.push(questionId);
    }
    if (isAssisted && !this.state.assistedQuestions.includes(questionId)) {
      this.state.assistedQuestions.push(questionId);
    }
    if (this.state.unresolvedMistakes && this.state.unresolvedMistakes[questionId]) {
      delete this.state.unresolvedMistakes[questionId];
    }
    // A day counts for the streak only when at least one challenge is completed.
    this.recordPracticeDate(new Date());
    this.save();
  }

  // Local-date helpers (consistent local boundaries)
  toLocalDateKey(date) {
    const d = (date instanceof Date) ? date : new Date(date);
    if (isNaN(d.getTime())) return null;
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return y + "-" + m + "-" + day;
  }

  recordPracticeDate(date) {
    if (!this.state.practiceDates) this.state.practiceDates = [];
    const key = this.toLocalDateKey(date || new Date());
    if (!key) return false;
    if (!this.state.practiceDates.includes(key)) {
      this.state.practiceDates.push(key);
      this.state.practiceDates.sort();
    }
    this.save();
    return true;
  }

  // Aliases for different naming expectations
  recordCompletionDate(date) { return this.recordPracticeDate(date); }
  recordStreakDate(date) { return this.recordPracticeDate(date); }
  markPracticeDate(date) { return this.recordPracticeDate(date); }

  getPracticeDates() {
    if (!Array.isArray(this.state.practiceDates)) return [];
    return [...this.state.practiceDates].sort();
  }

  getCurrentStreak() {
    const set = new Set(this.getPracticeDates());
    if (set.size === 0) return 0;
    const todayKey = this.toLocalDateKey(new Date());
    let cursor = todayKey;
    if (!set.has(cursor)) {
      // allow streak to continue through yesterday if nothing completed today yet
      const y = new Date();
      y.setDate(y.getDate() - 1);
      cursor = this.toLocalDateKey(y);
      if (!set.has(cursor)) return 0;
    }
    let count = 0;
    const d = new Date(cursor + "T00:00:00");
    while (set.has(this.toLocalDateKey(d))) {
      count++;
      d.setDate(d.getDate() - 1);
    }
    return count;
  }

  getLongestStreak() {
    const dates = this.getPracticeDates();
    if (dates.length === 0) return 0;
    let longest = 1;
    let current = 1;
    for (let i = 1; i < dates.length; i++) {
      const prev = new Date(dates[i - 1] + "T00:00:00");
      const curr = new Date(dates[i] + "T00:00:00");
      const diffDays = Math.round((curr - prev) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        current++;
        if (current > longest) longest = current;
      } else if (diffDays > 1) {
        current = 1;
      }
    }
    return longest;
  }

  getStreakInfo() {
    return {
      current: this.getCurrentStreak(),
      longest: this.getLongestStreak(),
      practiceDates: this.getPracticeDates(),
      explanation: "A day counts only when at least one challenge is completed. Dates use your local calendar. Missing a day resets the current streak to 0; the longest streak keeps your best run."
    };
  }

  isQuestionComplete(questionId) {
    return this.state.completedQuestions.includes(questionId);
  }

  isQuestionAssisted(questionId) {
    return this.state.assistedQuestions.includes(questionId);
  }

  recordAttempt(questionId, passed, code, details = "") {
    const attempt = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
      questionId,
      timestamp: new Date().toISOString(),
      passed: Boolean(passed),
      codeSnippet: (code || "").substring(0, 300),
      details: details ? String(details).substring(0, 200) : ""
    };
    if (!this.state.attempts) this.state.attempts = [];
    this.state.attempts.unshift(attempt);
    if (this.state.attempts.length > 300) {
      this.state.attempts.pop();
    }

    if (!this.state.unresolvedMistakes) this.state.unresolvedMistakes = {};

    if (passed) {
      delete this.state.unresolvedMistakes[questionId];
    } else if (!this.isQuestionComplete(questionId)) {
      const existing = this.state.unresolvedMistakes[questionId] || {
        questionId,
        failedCount: 0,
        firstFailedAt: attempt.timestamp
      };
      existing.failedCount = (existing.failedCount || 0) + 1;
      existing.latestAttempt = attempt;
      existing.timestamp = attempt.timestamp;
      this.state.unresolvedMistakes[questionId] = existing;
    }

    this.save();
  }

  setCurrentQuestion(questionId) {
    const maxQ = this.getMaxQuestionId();
    if (Number.isInteger(questionId) && questionId >= 1 && questionId <= maxQ) {
      this.state.currentQuestionId = questionId;
      this.save();
    }
  }

  // ==========================================
  // BOOKMARKS & NOTES
  // ==========================================
  toggleBookmark(questionId) {
    if (!this.state.bookmarks) this.state.bookmarks = [];
    const index = this.state.bookmarks.indexOf(questionId);
    if (index >= 0) {
      this.state.bookmarks.splice(index, 1);
    } else {
      this.state.bookmarks.push(questionId);
    }
    this.save();
    return this.isBookmarked(questionId);
  }

  isBookmarked(questionId) {
    return Array.isArray(this.state.bookmarks) && this.state.bookmarks.includes(questionId);
  }

  getBookmarks() {
    return Array.isArray(this.state.bookmarks) ? [...this.state.bookmarks] : [];
  }

  getNote(questionId) {
    return (this.state.notes && this.state.notes[questionId]) || "";
  }

  saveNote(questionId, noteText) {
    if (!this.state.notes) this.state.notes = {};
    if (noteText && noteText.trim()) {
      this.state.notes[questionId] = noteText.trim();
    } else {
      delete this.state.notes[questionId];
    }
    this.save();
  }

  // ==========================================
  // PREFERENCES
  // ==========================================
  getPreferences() {
    return { ...DEFAULT_PREFERENCES, ...(this.state.preferences || {}) };
  }

  savePreferences(updates = {}) {
    this.state.preferences = {
      ...this.getPreferences(),
      ...updates
    };
    this.save();
    this.applyPreferencesToDom();
  }

  applyPreferencesToDom() {
    if (typeof document === "undefined") return;
    const prefs = this.getPreferences();

    // Editor Font Size
    const editor = document.querySelector(".editor-panel");
    if (editor) {
      editor.setAttribute("data-font-size", prefs.fontSize || "medium");
      editor.setAttribute("data-editor-theme", prefs.editorTheme || "dark-navy");
      if (prefs.wordWrap) {
        editor.classList.add("editor-word-wrap");
      } else {
        editor.classList.remove("editor-word-wrap");
      }
    }

    // Reduced Motion
    if (prefs.reducedMotion) {
      document.documentElement.setAttribute("data-reduced-motion", "true");
    } else {
      document.documentElement.removeAttribute("data-reduced-motion");
    }

    // High Contrast
    if (prefs.highContrast) {
      document.documentElement.setAttribute("data-high-contrast", "true");
    } else {
      document.documentElement.removeAttribute("data-high-contrast");
    }
  }

  // ==========================================
  // GUIDED PROJECTS & PRACTICE MODES
  // ==========================================
  getGuidedProjectProgress(projId) {
    if (!this.state.guidedProjects) this.state.guidedProjects = {};
    return this.state.guidedProjects[projId] || { currentStep: 1, completedSteps: [] };
  }

  saveGuidedProjectStep(projId, stepNum) {
    if (!this.state.guidedProjects) this.state.guidedProjects = {};
    const current = this.getGuidedProjectProgress(projId);
    if (!current.completedSteps.includes(stepNum)) {
      current.completedSteps.push(stepNum);
    }
    current.currentStep = Math.max(current.currentStep, stepNum + 1);
    this.state.guidedProjects[projId] = current;
    this.save();
  }

  recordPracticeSession(session) {
    if (!this.state.practiceSessions) this.state.practiceSessions = [];
    const total = session.total || 0;
    const score = session.score || 0;
    const accuracy = session.accuracy !== undefined ? session.accuracy : (total > 0 ? Math.round((score / total) * 100) : 0);
    const entry = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2, 4),
      type: session.type || "quiz", // 'daily' | 'quiz' | 'topic'
      topic: session.topic || "General",
      date: new Date().toISOString(),
      score,
      total,
      accuracy,
      durationSec: session.durationSec || 0
    };
    this.state.practiceSessions.unshift(entry);
    if (this.state.practiceSessions.length > 100) {
      this.state.practiceSessions.pop();
    }
    this.save();
  }

  // ==========================================
  // MISTAKES & REVIEW
  // ==========================================
  getMistakes() {
    const completedSet = new Set(this.state.completedQuestions || []);
    const mistakesMap = new Map();

    // 1. Primary source: persistent unresolvedMistakes table
    if (this.state.unresolvedMistakes && typeof this.state.unresolvedMistakes === "object") {
      for (const [idStr, m] of Object.entries(this.state.unresolvedMistakes)) {
        const qId = parseInt(idStr, 10);
        if (!completedSet.has(qId)) {
          mistakesMap.set(qId, {
            questionId: qId,
            latestAttempt: m.latestAttempt || m,
            failedCount: m.failedCount || 1,
            timestamp: m.timestamp || (m.latestAttempt && m.latestAttempt.timestamp) || new Date().toISOString()
          });
        }
      }
    }

    // 2. Secondary source: recent attempts scan (in case unresolvedMistakes missed any legacy items)
    const attempts = this.state.attempts || [];
    for (const att of attempts) {
      if (!completedSet.has(att.questionId)) {
        if (!mistakesMap.has(att.questionId)) {
          mistakesMap.set(att.questionId, {
            questionId: att.questionId,
            latestAttempt: att,
            failedCount: att.passed ? 0 : 1,
            timestamp: att.timestamp
          });
        }
      }
    }

    // Convert to array and prioritize:
    // 1. Highest failedCount (repeated failed attempts need review most)
    // 2. Most recent failure timestamp
    const list = Array.from(mistakesMap.values());
    list.sort((a, b) => {
      if (b.failedCount !== a.failedCount) {
        return b.failedCount - a.failedCount;
      }
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });

    return list;
  }

  // ==========================================
  // PERSONALIZED NEXT STEPS RECOMMENDATION
  // ==========================================
  getPersonalizedRecommendation() {
    const allQuestions = (typeof window !== "undefined" && window.QUESTIONS_DATA) || [];
    if (allQuestions.length === 0) return null;

    const completed = new Set(this.state.completedQuestions || []);
    const mistakes = this.getMistakes();

    // 1. Unresolved mistakes: prioritize based on recent & repeated failed attempts
    if (mistakes.length > 0) {
      const targetMistake = mistakes[0];
      const q = allQuestions.find(item => item.id === targetMistake.questionId);
      if (q) {
        const failMsg = targetMistake.failedCount > 1 
          ? `You have attempted Challenge #${q.id} ("${q.title}") ${targetMistake.failedCount} times recently without passing.`
          : `You recently attempted Challenge #${q.id} ("${q.title}") but haven't solved it yet.`;
        return {
          question: q,
          badge: targetMistake.failedCount > 1 ? `Top Priority Review (${targetMistake.failedCount} fails)` : "Review Recommendation",
          reason: `${failMsg} Retrying now while the logic is fresh will solidify your ${q.levelName} skills!`,
          actionText: `Retry Challenge #${q.id} →`,
          isMistake: true,
          failedCount: targetMistake.failedCount
        };
      }
    }

    // 2. No unresolved mistakes: recommend next uncompleted challenge in progressive path
    for (let i = 0; i < allQuestions.length; i++) {
      const q = allQuestions[i];
      if (!completed.has(q.id)) {
        const lvlQuestions = allQuestions.filter(item => item.level === q.level);
        const solvedInLvl = lvlQuestions.filter(item => completed.has(item.id)).length;
        
        let reason = "";
        let badge = `Next Challenge (Level ${q.level})`;

        if (completed.size === 0 && q.id === 1) {
          badge = "Start Here! 🌱";
          reason = "Welcome to Python Practice Academy! Start with Challenge #1 to practice basic output with print() and get familiar with the editor.";
        } else if (solvedInLvl === 0 && q.level > 1) {
          badge = `Level ${q.level} Milestone 🚀`;
          reason = `Milestone unlocked! You've mastered previous topics. Step into Level ${q.level}: ${q.levelName} with "${q.title}".`;
        } else {
          reason = `You have completed ${solvedInLvl} of ${lvlQuestions.length} challenges in Level ${q.level} (${q.levelName}). Keep your momentum going with "${q.title}"!`;
        }

        return {
          question: q,
          badge,
          reason,
          actionText: `Solve Challenge #${q.id} →`,
          isMistake: false
        };
      }
    }

    // 3. All completed!
    return {
      question: allQuestions[0],
      badge: "Mastery Achieved! 🏆",
      reason: `Congratulations! You have completed all ${allQuestions.length || 72} challenges in Python Practice Academy. Challenge yourself with a Timed Speed Quiz or Guided Project to maintain peak fluency.`,
      actionText: "Try Practice Modes →",
      isAllCompleted: true
    };
  }

  // ==========================================
  // ACHIEVEMENTS & BADGES
  // ==========================================
  getEarnedBadges() {
    const completed = new Set(this.state.completedQuestions || []);
    const assisted = new Set(this.state.assistedQuestions || []);
    const attempts = this.state.attempts || [];
    const questions = (typeof window !== "undefined" && window.QUESTIONS_DATA) || [];

    const isLvlComplete = (lvl) => {
      const qInLvl = questions.filter(q => q.level === lvl);
      return qInLvl.length > 0 && qInLvl.every(q => completed.has(q.id));
    };

    // Calculate unassisted solves
    const unassistedCount = Array.from(completed).filter(id => !assisted.has(id)).length;

    // Calculate resilient retries (failed once, then passed)
    const passedAfterFail = attempts.some(a => a.passed && attempts.some(b => b.questionId === a.questionId && !b.passed));

    const badges = [
      {
        id: "first_run",
        icon: "🚀",
        title: "First Code Execution",
        desc: "Ran your first Python program in the browser sandbox.",
        earned: attempts.length > 0
      },
      {
        id: "novice_solver",
        icon: "🌱",
        title: "Python Novice",
        desc: "Solved 5 Python challenges successfully.",
        earned: completed.size >= 5,
        progress: `${Math.min(completed.size, 5)}/5`
      },
      {
        id: "lvl1_master",
        icon: "🔢",
        title: "Variables Virtuoso",
        desc: "Mastered all Level 1 (Variables & Maths) challenges.",
        earned: isLvlComplete(1)
      },
      {
        id: "lvl2_master",
        icon: "🔀",
        title: "Logic Commander",
        desc: "Mastered all Level 2 (Conditions & Logic) challenges.",
        earned: isLvlComplete(2)
      },
      {
        id: "lvl3_master",
        icon: "🔁",
        title: "Loop Luminary",
        desc: "Mastered all Level 3 (Loops & Repetition) challenges.",
        earned: isLvlComplete(3)
      },
      {
        id: "lvl4_master",
        icon: "📜",
        title: "String & List Specialist",
        desc: "Mastered all Level 4 (Strings & Lists) challenges.",
        earned: isLvlComplete(4)
      },
      {
        id: "lvl5_master",
        icon: "🛠️",
        title: "Project Architect",
        desc: "Mastered all Level 5 Mini Projects.",
        earned: isLvlComplete(5)
      },
      {
        id: "pure_logic",
        icon: "🧠",
        title: "Pure Logic",
        desc: "Solved at least 10 challenges without viewing solutions.",
        earned: unassistedCount >= 10,
        progress: `${Math.min(unassistedCount, 10)}/10`
      },
      {
        id: "streak_resilience",
        icon: "🛡️",
        title: "Grit & Persistence",
        desc: "Retried and conquered a challenge after a failed attempt.",
        earned: passedAfterFail
      },
      {
        id: "halfway",
        icon: "⭐",
        title: "Midpoint Milestone",
        desc: "Completed 25 challenges in the academy.",
        earned: completed.size >= 25,
        progress: `${Math.min(completed.size, 25)}/25`
      },
      {
        id: "quiz_ace",
        icon: "⏱️",
        title: "Speed Runner",
        desc: "Completed a timed practice quiz session.",
        earned: (this.state.practiceSessions || []).some(s => s.type === "quiz")
      },
      {
        id: "guided_builder",
        icon: "🏗️",
        title: "Guided Craftsman",
        desc: "Completed all steps of a guided multi-step project.",
        earned: Object.values(this.state.guidedProjects || {}).some(p => p.completedSteps && p.completedSteps.length >= 4)
      }
    ];

    return badges;
  }

  // ==========================================
  // BACKUP & RESTORE (IMPORT / EXPORT)
  // ==========================================
  exportProgressJSON() {
    const exportData = {
      app: "Python Practice Academy",
      schemaVersion: 2,
      exportedAt: new Date().toISOString(),
      summary: {
        score: this.state.completedQuestions.length,
        totalAttempts: (this.state.attempts || []).length,
        unresolvedMistakesCount: Object.keys(this.state.unresolvedMistakes || {}).length,
        practiceSessionsCount: (this.state.practiceSessions || []).length,
        bookmarksCount: (this.state.bookmarks || []).length,
        notesCount: Object.keys(this.state.notes || {}).length,
        hasCertificate: this.state.certificate !== null && this.state.certificate !== undefined
      },
      data: { ...this.state }
    };
    return JSON.stringify(exportData, null, 2);
  }

  exportFullPracticeHistoryJSON() {
    const historyData = {
      app: "Python Practice Academy - Practice & Activity Archive",
      schemaVersion: 2,
      exportedAt: new Date().toISOString(),
      summary: {
        totalAttempts: (this.state.attempts || []).length,
        unresolvedMistakesCount: Object.keys(this.state.unresolvedMistakes || {}).length,
        practiceSessionsCount: (this.state.practiceSessions || []).length,
        solvedCount: (this.state.completedQuestions || []).length
      },
      unresolvedMistakes: this.getMistakes(),
      attempts: this.state.attempts || [],
      practiceSessions: this.state.practiceSessions || []
    };
    return JSON.stringify(historyData, null, 2);
  }

  validateImportJSON(jsonText) {
    // Accept either a JSON string or an already-parsed object.
    let parsed = null;
    if (typeof jsonText === "string") {
      try {
        parsed = JSON.parse(jsonText);
      } catch (e) {
        return { valid: false, error: "Failed to parse JSON: " + e.message };
      }
    } else if (jsonText && typeof jsonText === "object") {
      parsed = jsonText;
    } else {
      return { valid: false, error: "The provided backup is empty." };
    }

    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      return { valid: false, error: "Invalid backup format: expected a JSON object." };
    }

    const MAX_Q = 72;
    const maxBytes = 5 * 1024 * 1024;
    try {
      if (JSON.stringify(parsed).length > maxBytes) {
        return { valid: false, error: "Backup is too large (over 5 MB)." };
      }
    } catch (e) {
      return { valid: false, error: "Backup could not be measured for size." };
    }

    // Schema version checks (optional but must be 2 when present)
    if (parsed.schemaVersion !== undefined && parsed.schemaVersion !== 2) {
      return { valid: false, error: "Unsupported schema version. Expected version 2." };
    }

    const target = (parsed.data && typeof parsed.data === "object" && !Array.isArray(parsed.data)) ? parsed.data : parsed;

    if (target.version !== undefined && target.version !== 2) {
      return { valid: false, error: "Unsupported state version. Expected version 2." };
    }

    // Core required field
    if (!Array.isArray(target.completedQuestions)) {
      return { valid: false, error: "Missing required 'completedQuestions' progress list." };
    }
    if (target.completedQuestions.length > MAX_Q) {
      return { valid: false, error: "completedQuestions exceeds the 72-question limit." };
    }

    const isInt = (v) => Number.isInteger(v);
    const inRange = (v) => isInt(v) && v >= 1 && v <= MAX_Q;

    // IDs must be valid and unique
    const completedIds = [];
    const completedSet = new Set();
    for (const id of target.completedQuestions) {
      if (!inRange(id)) {
        return { valid: false, error: "Invalid question ID in completedQuestions: " + id };
      }
      if (completedSet.has(id)) {
        return { valid: false, error: "Duplicate question ID in completedQuestions: " + id };
      }
      completedSet.add(id);
      completedIds.push(id);
    }

    // Optional arrays
    const validateIdArray = (arr, name, limit) => {
      if (arr === undefined) return [];
      if (!Array.isArray(arr)) {
        throw new Error(name + " must be an array.");
      }
      if (arr.length > limit) {
        throw new Error(name + " exceeds the allowed size (" + limit + ").");
      }
      const out = [];
      const seen = new Set();
      for (const id of arr) {
        if (!inRange(id)) throw new Error("Invalid question ID in " + name + ": " + id);
        if (seen.has(id)) continue;
        seen.add(id);
        out.push(id);
      }
      return out;
    };

    let assistedQuestions, bookmarks;
    try {
      assistedQuestions = validateIdArray(target.assistedQuestions, "assistedQuestions", MAX_Q);
      bookmarks = validateIdArray(target.bookmarks, "bookmarks", MAX_Q);
    } catch (e) {
      return { valid: false, error: e.message };
    }

    // currentQuestionId
    let currentQuestionId = 1;
    if (target.currentQuestionId !== undefined) {
      if (!inRange(target.currentQuestionId)) {
        return { valid: false, error: "Invalid currentQuestionId." };
      }
      currentQuestionId = target.currentQuestionId;
    }

    // codeDrafts
    let codeDrafts = {};
    if (target.codeDrafts !== undefined) {
      if (typeof target.codeDrafts !== "object" || target.codeDrafts === null || Array.isArray(target.codeDrafts)) {
        return { valid: false, error: "codeDrafts must be an object." };
      }
      const keys = Object.keys(target.codeDrafts);
      if (keys.length > MAX_Q) {
        return { valid: false, error: "codeDrafts exceeds the 72-question limit." };
      }
      for (const k of keys) {
        const id = Number(k);
        if (!inRange(id)) {
          return { valid: false, error: "Invalid codeDraft key: " + k };
        }
        const v = target.codeDrafts[k];
        if (typeof v !== "string") {
          return { valid: false, error: "codeDraft for question " + k + " must be a string." };
        }
        if (v.length > 50000) {
          return { valid: false, error: "codeDraft for question " + k + " is too large." };
        }
        codeDrafts[id] = v;
      }
    }

    // notes
    let notes = {};
    if (target.notes !== undefined) {
      if (typeof target.notes !== "object" || target.notes === null || Array.isArray(target.notes)) {
        return { valid: false, error: "notes must be an object." };
      }
      const keys = Object.keys(target.notes);
      if (keys.length > MAX_Q) {
        return { valid: false, error: "notes exceeds the 72-question limit." };
      }
      for (const k of keys) {
        const id = Number(k);
        if (!inRange(id)) {
          return { valid: false, error: "Invalid note key: " + k };
        }
        const v = target.notes[k];
        if (typeof v !== "string") {
          return { valid: false, error: "Note for question " + k + " must be a string." };
        }
        if (v.length > 10000) {
          return { valid: false, error: "Note for question " + k + " is too large." };
        }
        notes[id] = v.trim();
      }
    }

    // unresolvedMistakes
    let unresolvedMistakes = {};
    if (target.unresolvedMistakes !== undefined) {
      if (typeof target.unresolvedMistakes !== "object" || target.unresolvedMistakes === null || Array.isArray(target.unresolvedMistakes)) {
        return { valid: false, error: "unresolvedMistakes must be an object." };
      }
      const keys = Object.keys(target.unresolvedMistakes);
      if (keys.length > MAX_Q) {
        return { valid: false, error: "unresolvedMistakes exceeds the 72-question limit." };
      }
      for (const k of keys) {
        const id = Number(k);
        if (!inRange(id)) {
          return { valid: false, error: "Invalid unresolvedMistake key: " + k };
        }
        const v = target.unresolvedMistakes[k];
        if (typeof v !== "object" || v === null || Array.isArray(v)) {
          return { valid: false, error: "Invalid unresolvedMistake entry for question " + k };
        }
        unresolvedMistakes[id] = v;
      }
    }

    // attempts
    let attempts = [];
    if (target.attempts !== undefined) {
      if (!Array.isArray(target.attempts)) {
        return { valid: false, error: "attempts must be an array." };
      }
      if (target.attempts.length > 300) {
        return { valid: false, error: "attempts exceeds the allowed size (300)." };
      }
      for (const a of target.attempts) {
        if (typeof a !== "object" || a === null || Array.isArray(a)) {
          return { valid: false, error: "Invalid attempt entry." };
        }
        if (a.questionId !== undefined && !inRange(a.questionId)) {
          return { valid: false, error: "Invalid questionId in attempt." };
        }
        if (a.passed !== undefined && typeof a.passed !== "boolean") {
          return { valid: false, error: "Invalid passed flag in attempt." };
        }
        attempts.push({
          id: typeof a.id === "string" ? a.id.slice(0, 64) : (Date.now().toString(36) + Math.random().toString(36).substr(2, 5)),
          questionId: inRange(a.questionId) ? a.questionId : null,
          timestamp: typeof a.timestamp === "string" ? a.timestamp : new Date().toISOString(),
          passed: Boolean(a.passed),
          codeSnippet: typeof a.codeSnippet === "string" ? a.codeSnippet.slice(0, 300) : "",
          details: typeof a.details === "string" ? a.details.slice(0, 200) : ""
        });
      }
    }

    // preferences
    const allowedFontSize = ["small", "medium", "large"];
    const allowedEditorTheme = ["dark-navy", "monokai", "warm-light", "high-contrast"];
    let preferences = { ...DEFAULT_PREFERENCES };
    if (target.preferences !== undefined) {
      if (typeof target.preferences !== "object" || target.preferences === null || Array.isArray(target.preferences)) {
        return { valid: false, error: "preferences must be an object." };
      }
      const p = target.preferences;
      if (p.fontSize !== undefined && !allowedFontSize.includes(p.fontSize)) {
        return { valid: false, error: "Invalid fontSize preference." };
      }
      if (p.editorTheme !== undefined && !allowedEditorTheme.includes(p.editorTheme)) {
        return { valid: false, error: "Invalid editorTheme preference." };
      }
      if (p.wordWrap !== undefined && typeof p.wordWrap !== "boolean") {
        return { valid: false, error: "Invalid wordWrap preference." };
      }
      if (p.reducedMotion !== undefined && typeof p.reducedMotion !== "boolean") {
        return { valid: false, error: "Invalid reducedMotion preference." };
      }
      if (p.highContrast !== undefined && typeof p.highContrast !== "boolean") {
        return { valid: false, error: "Invalid highContrast preference." };
      }
      preferences = { ...preferences, ...p };
    }

    // guidedProjects
    let guidedProjects = {};
    if (target.guidedProjects !== undefined) {
      if (typeof target.guidedProjects !== "object" || target.guidedProjects === null || Array.isArray(target.guidedProjects)) {
        return { valid: false, error: "guidedProjects must be an object." };
      }
      guidedProjects = target.guidedProjects;
    }

    // practiceSessions
    let practiceSessions = [];
    if (target.practiceSessions !== undefined) {
      if (!Array.isArray(target.practiceSessions)) {
        return { valid: false, error: "practiceSessions must be an array." };
      }
      if (target.practiceSessions.length > 100) {
        return { valid: false, error: "practiceSessions exceeds the allowed size (100)." };
      }
      practiceSessions = target.practiceSessions.slice(0, 100);
    }

    // theme
    const theme = target.theme === "dark" ? "dark" : "light";

    // startedAt
    const startedAt = typeof target.startedAt === "string" ? target.startedAt : new Date().toISOString();

    // certificate
    let certificate = null;
    if (target.certificate !== undefined && target.certificate !== null) {
      if (typeof target.certificate !== "object" || Array.isArray(target.certificate)) {
        return { valid: false, error: "certificate must be an object or null." };
      }
      const c = target.certificate;
      if (typeof c.name !== "string" || !c.name.trim()) {
        return { valid: false, error: "certificate name is required." };
      }
      if (typeof c.issuedAt !== "string") {
        return { valid: false, error: "certificate issuedAt must be a string." };
      }
      certificate = {
        name: c.name.trim().slice(0, 120),
        email: typeof c.email === "string" ? c.email.trim().slice(0, 200) : "",
        phone: typeof c.phone === "string" ? c.phone.trim().slice(0, 60) : "",
        issuedAt: c.issuedAt
      };
    }

    // practiceDates
    let practiceDates = [];
    if (target.practiceDates !== undefined) {
      if (!Array.isArray(target.practiceDates)) {
        return { valid: false, error: "practiceDates must be an array." };
      }
      practiceDates = target.practiceDates.filter(d => typeof d === "string" && /^\d{4}-\d{2}-\d{2}$/.test(d)).slice(0, 3650);
    }

    // score consistency
    const score = completedIds.length;

    const summary = {
      completedCount: completedIds.length,
      attemptsCount: attempts.length,
      unresolvedMistakesCount: Object.keys(unresolvedMistakes).length,
      bookmarksCount: bookmarks.length,
      notesCount: Object.keys(notes).length,
      exportedAt: parsed.exportedAt || target.lastActive || "Unknown"
    };

    const parsedState = {
      version: 2,
      currentQuestionId,
      score,
      completedQuestions: completedIds,
      assistedQuestions,
      codeDrafts,
      attempts,
      unresolvedMistakes,
      bookmarks,
      notes,
      preferences,
      guidedProjects,
      practiceSessions,
      practiceDates,
      theme,
      startedAt,
      lastActive: new Date().toISOString(),
      certificate
    };

    return { valid: true, summary, parsedState };
  }

  applyImportedState(newState) {
    if (!newState || typeof newState !== "object") return false;
    this.state = { ...newState };
    this.save();
    this.applyPreferencesToDom();
    return true;
  }

  resetAll() {
    this.state = {
      version: 2,
      currentQuestionId: 1,
      score: 0,
      completedQuestions: [],
      assistedQuestions: [],
      codeDrafts: {},
      attempts: [],
      unresolvedMistakes: {},
      bookmarks: [],
      notes: {},
      guidedProjects: {},
      practiceSessions: [],
      practiceDates: [],
      theme: this.state ? this.state.theme : "light",
      preferences: { ...(this.state && this.state.preferences ? this.state.preferences : DEFAULT_PREFERENCES) },
      startedAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
      certificate: null   // Certificate details are cleared along with all other progress on reset
    };
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (err) {
      console.warn("Storage removal warning:", err);
    }
    this.save();
  }

  setTheme(theme) {
    this.state.theme = theme === "dark" ? "dark" : "light";
    this.save();
  }

  // ==========================================
  // CERTIFICATE DETAILS (local-only storage)
  // ==========================================

  /**
   * Returns true if the learner has completed every challenge.
   */
  isCertificateEligible() {
    const questions = (typeof window !== "undefined" && window.QUESTIONS_DATA) || [];
    const totalQ = questions.length || 72;
    return (this.state.completedQuestions || []).length >= totalQ;
  }

  /**
   * Returns the saved certificate details, or null if none saved.
   * Shape: { name, email, phone, issuedAt }
   */
  getCertificate() {
    return this.state.certificate || null;
  }

  /**
   * Save certificate details locally. Email and phone are optional.
   * @param {string} name - Required display name on certificate
   * @param {string} [email] - Optional, stored locally only
   * @param {string} [phone] - Optional, stored locally only
   * @param {string} [issuedAt] - ISO date string; defaults to now
   */
  saveCertificate(name, email = "", phone = "", issuedAt = null) {
    if (!name || !name.trim()) return false;
    this.state.certificate = {
      name: name.trim(),
      email: (email || "").trim(),
      phone: (phone || "").trim(),
      issuedAt: issuedAt || new Date().toISOString()
    };
    this.save();
    return true;
  }

  /**
   * Remove saved certificate details (does not affect challenge progress).
   */
  clearCertificate() {
    this.state.certificate = null;
    this.save();
  }

  // Aliases for compatibility with alternate naming used by tests/docs
  exportProgressJson() { return this.exportProgressJSON(); }
  validateImportData(data) { return this.validateImportJSON(data); }
  getScore() { return this.state.score || 0; }
  getMaxQuestions() { return 72; }
}

// Global instance
const store = new ProgressStore();
if (typeof window !== "undefined") {
  window.store = store;
}
