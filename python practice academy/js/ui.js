/**
 * PYTHON PRACTICE ACADEMY — ENHANCED UI VIEW CONTROLLER & TEMPLATES
 * Renders:
 * 1. Home (Hero, Smart Recommendations, 7 Levels, Mistakes Banner)
 * 2. Test Workspace (Editor, Bookmarks, Notes, Preferences, Granular Test Feedback)
 * 3. Question Bank (Full Multi-filter: Topic, Difficulty, Status, Bookmarks, Search)
 * 4. Learn Hub (Curriculum reference for Levels 1–7)
 * 5. Mistakes Review (Latest results, code snippets, one-click retries)
 * 6. Practice Modes (Daily Sprint, Timed Quiz, Topic Practice)
 * 7. Guided Projects (Step-by-step multi-tier projects with verification)
 * 8. Interactive Concept Demos (Conditions, Loops, Strings, Lists, Dicts)
 * 9. Progress Dashboard (History, Weakest Topics, 12 Badges, Backup/Restore JSON)
 * 10. Results & Certificate
 */

const UI = {
  escapeHtml(str) {
    if (str === null || str === undefined) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  },

  // ==========================================
  // 1. HOMEPAGE
  // ==========================================
  renderHome() {
    const questions = window.QUESTIONS_DATA || [];
    const totalQ = questions.length || 72;
    const cotd = window.getChallengeOfTheDay ? window.getChallengeOfTheDay() : questions[0];
    const completedCount = window.store.state.completedQuestions.length;
    const isCompleted = (id) => window.store.isQuestionComplete(id);
    const mistakes = window.store.getMistakes ? window.store.getMistakes() : [];
    const recommendation = window.store.getPersonalizedRecommendation ? window.store.getPersonalizedRecommendation() : null;

    // Calculate level stats for all 7 levels
    const levels = [
      { lvl: 1, name: "Variables and Basic Maths", diff: "Beginner" },
      { lvl: 2, name: "Conditions and Decision Making", diff: "Beginner" },
      { lvl: 3, name: "Loops and Repetition", diff: "Intermediate" },
      { lvl: 4, name: "Strings and Lists", diff: "Intermediate" },
      { lvl: 5, name: "Mini Projects and Problem Solving", diff: "Advanced" },
      { lvl: 6, name: "Functions, Dictionaries & Sets", diff: "Intermediate" },
      { lvl: 7, name: "Exceptions, Files & Classes", diff: "Advanced" }
    ];

    const levelStats = levels.map(l => {
      const qInLevel = questions.filter(q => q.level === l.lvl);
      const solvedInLevel = qInLevel.filter(q => isCompleted(q.id)).length;
      return {
        level: l.lvl,
        name: l.name,
        diff: l.diff,
        total: qInLevel.length || 10,
        solved: solvedInLevel,
        pct: qInLevel.length > 0 ? Math.round((solvedInLevel / qInLevel.length) * 100) : 0,
        startQId: qInLevel[0]?.id || 1
      };
    });

    return `
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="container hero-grid">
          <div>
            <div class="hero-badge-pill">
              <span class="hero-badge-dot"></span>
              Interactive Python Learning Platform • ${totalQ} Challenges
            </div>
            <h1 class="hero-headline">
              Your Journey to Python Mastery Starts Here.
            </h1>
            <p class="hero-subtext">
              Practice real programming challenges, improve your problem-solving skills, and track your progress across 7 structured Python curriculum levels.
            </p>
            <div class="hero-cta-group">
              <button class="btn btn-primary btn-lg" onclick="window.startPractice()">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                ${completedCount > 0 ? `Resume Practicing (${completedCount}/${totalQ})` : "Start Practicing"}
              </button>
              <button class="btn btn-secondary btn-lg" onclick="window.navigateTo('practice-modes')">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                Practice Modes
              </button>
              <button class="btn btn-secondary btn-lg" onclick="window.scrollToSection('learning-path-section')">
                Learning Path
              </button>
            </div>

            <!-- Mistakes Alert Banner if user has uncompleted attempts -->
            ${mistakes.length > 0 ? `
              <div class="mistakes-quick-alert" onclick="window.navigateTo('mistakes')" role="alert">
                <div style="display: flex; align-items: center; gap: 0.75rem;">
                  <span style="font-size: 1.25rem;">⚠️</span>
                  <div>
                    <strong>Review ${mistakes.length} Unresolved ${mistakes.length === 1 ? 'Challenge' : 'Challenges'}</strong>
                    <p style="font-size: 0.825rem; margin: 0; color: var(--text-secondary);">
                      You attempted these challenges earlier. Click here to review your mistakes and retry with one click.
                    </p>
                  </div>
                </div>
                <button class="btn btn-secondary btn-sm" style="flex-shrink: 0;">Review Now →</button>
              </div>
            ` : ''}

            <!-- 3 Learning Feature Cards -->
            <div class="hero-feature-cards">
              <div class="feature-mini-card">
                <div class="feature-mini-icon" style="background: var(--peach-soft); color: var(--coral-deep);">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <div class="feature-mini-title">${totalQ} Coding Challenges</div>
                <div class="feature-mini-desc">Variables, conditions, loops, data structures, exceptions, files & classes.</div>
              </div>
              <div class="feature-mini-card">
                <div class="feature-mini-icon" style="background: var(--blue-light); color: var(--primary-blue);">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                </div>
                <div class="feature-mini-title">Granular Test Feedback</div>
                <div class="feature-mini-desc">See exact test inputs, expected outputs, actual outputs, and beginner tips.</div>
              </div>
              <div class="feature-mini-card">
                <div class="feature-mini-icon" style="background: var(--mint-accent); color: var(--mint-accent-dark);">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                </div>
                <div class="feature-mini-title">Local & Private</div>
                <div class="feature-mini-desc">Zero tracking, no paywalls. Backup & restore your progress anytime as JSON.</div>
              </div>
            </div>
          </div>

          <!-- Hero Visual: Floating Code Card with live preview -->
          <div class="hero-visual">
            <div class="code-mockup-card">
              <div class="code-mockup-header">
                <div class="traffic-dots">
                  <span class="traffic-dot dot-red"></span>
                  <span class="traffic-dot dot-yellow"></span>
                  <span class="traffic-dot dot-green"></span>
                </div>
                <div class="mockup-tab-title">main.py — Python 3.12</div>
                <span style="font-size: 0.775rem; color: #059669; background: var(--mint-accent); padding: 0.2rem 0.6rem; border-radius: var(--radius-full); font-weight: 700;">● In-Browser Ready</span>
              </div>
              <div class="code-mockup-body">
<span style="color: #9DAABF;"># Python Practice Academy</span>
<span style="color: #2563EB; font-weight: 700;">def</span> <span style="color: var(--coral-deep); font-weight: 700;">master_python</span>(solved, total):
    fluency = (solved / total) * <span style="color: var(--soft-amber-dark);">100</span>
    <span style="color: #2563EB; font-weight: 700;">return</span> <span style="color: #059669;">f"Progress: {fluency:.1f}% ({solved}/{total})"</span>

print(master_python(<span style="color: var(--soft-amber-dark);">${completedCount}</span>, <span style="color: var(--soft-amber-dark);">${totalQ}</span>))
              </div>
            </div>

            <!-- Personalized Recommendation Callout Card -->
            ${recommendation ? `
              <div class="recommendation-hero-card">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
                  <span class="rec-badge">${recommendation.badge}</span>
                  <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 600;">Personalized</span>
                </div>
                <h4 style="font-size: 1.05rem; margin-bottom: 0.25rem; color: var(--text-main); font-weight: 700;">
                  #${recommendation.question.id}: ${recommendation.question.title}
                </h4>
                <p style="font-size: 0.825rem; color: var(--text-secondary); line-height: 1.45; margin-bottom: 0.75rem;">
                  ${recommendation.reason}
                </p>
                <button class="btn btn-primary btn-sm" onclick="window.startPractice(${recommendation.question.id})">
                  ${recommendation.actionText}
                </button>
              </div>
            ` : ''}
          </div>
        </div>
      </section>

      <!-- Quick Learning Hub & Practice Modes Bar -->
      <section class="section-py" style="padding-top: 1rem; padding-bottom: 2rem;">
        <div class="container">
          <div class="quick-nav-pills-bar">
            <button class="quick-nav-pill" onclick="window.navigateTo('practice-modes')">
              <span>⏱️</span>
              <div>
                <strong>Practice Modes</strong>
                <small>Daily session & Timed quiz</small>
              </div>
            </button>
            <button class="quick-nav-pill" onclick="window.navigateTo('projects')">
              <span>🏗️</span>
              <div>
                <strong>Guided Projects</strong>
                <small>Build real Python apps</small>
              </div>
            </button>
            <button class="quick-nav-pill" onclick="window.navigateTo('demos')">
              <span>⚡</span>
              <div>
                <strong>Interactive Demos</strong>
                <small>Sliders for loops & strings</small>
              </div>
            </button>
            <button class="quick-nav-pill" onclick="window.navigateTo('mistakes')">
              <span>🔄</span>
              <div>
                <strong>Review Mistakes (${mistakes.length})</strong>
                <small>One-click retries</small>
              </div>
            </button>
          </div>
        </div>
      </section>

      <!-- Challenge of the Day -->
      <section class="section-py">
        <div class="container">
          <div class="cotd-card">
            <div class="cotd-badge">🎯 Challenge of the Day</div>
            <div class="cotd-content">
              <div>
                <span class="level-badge level-badge-${cotd.level}">Level ${cotd.level}: ${cotd.levelName}</span>
                <h3 style="font-size: 1.4rem; margin: 0.6rem 0 0.4rem; color: var(--text-main);">${cotd.title}</h3>
                <p style="color: var(--text-secondary); max-width: 600px; font-size: 0.9rem; line-height: 1.5;">${cotd.description}</p>
              </div>
              <div style="display: flex; gap: 0.75rem; align-items: center; flex-wrap: wrap;">
                <button class="btn btn-primary" onclick="window.startPractice(${cotd.id})">
                  Solve Today's Challenge →
                </button>
                <button class="btn btn-secondary btn-sm" onclick="window.store.toggleBookmark(${cotd.id}); window.navigateTo('home');">
                  ${window.store.isBookmarked(cotd.id) ? '★ Bookmarked' : '☆ Bookmark'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Structured Learning Path (All 7 Levels) -->
      <section id="learning-path-section" class="section-py">
        <div class="container">
          <div class="section-header">
            <span class="section-tag">Curriculum</span>
            <h2 class="section-title">Structured Learning Path (${totalQ} Challenges)</h2>
            <p class="section-desc">
              Master the foundational and advanced building blocks of Python programming across seven progressively challenging tiers.
            </p>
          </div>

          <div class="learning-path-grid">
            ${levelStats.map(lvl => `
              <div class="level-card">
                <div class="level-card-header">
                  <span class="level-badge level-badge-${lvl.level}">Level ${lvl.level}</span>
                  <span class="level-diff-badge diff-${lvl.diff.toLowerCase()}">${lvl.diff}</span>
                </div>
                <h3 class="level-title">${lvl.name}</h3>
                <div class="level-progress-meta">
                  <span>${lvl.total} Challenges</span>
                  <span>${lvl.solved}/${lvl.total} Solved</span>
                </div>
                <div class="progress-bar-bg" style="margin-bottom: 1rem;">
                  <div class="progress-bar-fill" style="width: ${lvl.pct}%;"></div>
                </div>
                <button class="btn btn-secondary" style="width: 100%;" onclick="window.startPractice(${lvl.startQId})">
                  ${lvl.solved > 0 ? `Continue Level ${lvl.level}` : `Start Level ${lvl.level}`}
                </button>
              </div>
            `).join("")}
          </div>
        </div>
      </section>

      <!-- Why Practice With Us -->
      <section class="section-py">
        <div class="container">
          <div class="section-header">
            <span class="section-tag">Platform Advantages</span>
            <h2 class="section-title">Why Practice With Python Practice Academy</h2>
            <p class="section-desc">
              Engineered with clean developer-first principles, fully private, accessible to all learners.
            </p>
          </div>

          <div class="features-grid">
            <div class="feature-box">
              <div class="feature-icon-wrapper" style="background: var(--peach-soft); color: var(--coral-deep);">⚡</div>
              <h3 class="feature-title">Zero Setup, Instant Start</h3>
              <p class="feature-desc">No installations, compilers, or pip packages needed. Runs real client-side Python 3 directly in your web browser.</p>
            </div>
            <div class="feature-box">
              <div class="feature-icon-wrapper" style="background: var(--blue-light); color: var(--primary-blue);">🔒</div>
              <h3 class="feature-title">100% Client-Side Privacy</h3>
              <p class="feature-desc">Your code never leaves your device. All progress, bookmarks, and drafts are saved locally with zero tracking.</p>
            </div>
            <div class="feature-box">
              <div class="feature-icon-wrapper" style="background: var(--mint-accent); color: var(--mint-accent-dark);">💾</div>
              <h3 class="feature-title">Backup & Restore</h3>
              <p class="feature-desc">Export your completed challenges and drafts as a portable JSON file, and restore anytime with verified safety.</p>
            </div>
            <div class="feature-box">
              <div class="feature-icon-wrapper" style="background: var(--soft-amber); color: var(--soft-amber-dark);">🎯</div>
              <h3 class="feature-title">Unlimited Retries</h3>
              <p class="feature-desc">Learning requires iteration. Never be locked out or penalized for incorrect attempts. Learn from beginner tips.</p>
            </div>
            <div class="feature-box">
              <div class="feature-icon-wrapper" style="background: var(--coral-light); color: var(--coral-deep);">💡</div>
              <h3 class="feature-title">Expanded Curriculum</h3>
              <p class="feature-desc">${totalQ} curated challenges covering variables, conditions, loops, strings, lists, dicts, tuples, sets, exceptions, files & OOP.</p>
            </div>
            <div class="feature-box">
              <div class="feature-icon-wrapper" style="background: var(--peach); color: var(--coral-deep);">📊</div>
              <h3 class="feature-title">Adaptive Analytics</h3>
              <p class="feature-desc">Identify your weakest topics, track recent attempts over time, earn 12 badges, and review unresolved mistakes.</p>
            </div>
          </div>
        </div>
      </section>
    `;
  },

  // ==========================================
  // 2. QUESTION SIDEBAR (72 CHALLENGES)
  // ==========================================
  renderQuestionSidebar(currentQId) {
    const questions = window.QUESTIONS_DATA || [];
    const isCompleted = (id) => window.store.isQuestionComplete(id);
    const isAssisted = (id) => window.store.isQuestionAssisted(id);
    const isBookmarked = (id) => window.store.isBookmarked(id);
    const solvedCount = window.store.state.completedQuestions.length;
    const totalQ = questions.length || 72;

    const levels = [
      { level: 1, name: "Variables and Basic Maths" },
      { level: 2, name: "Conditions and Decision Making" },
      { level: 3, name: "Loops and Repetition" },
      { level: 4, name: "Strings and Lists" },
      { level: 5, name: "Mini Projects and Problem Solving" },
      { level: 6, name: "Functions, Dictionaries & Sets" },
      { level: 7, name: "Exceptions, Files & Classes" }
    ];

    let sectionsHtml = "";
    for (const lvl of levels) {
      const qList = questions.filter(item => item.level === lvl.level);
      if (qList.length === 0) continue;
      const lvlSolved = qList.filter(item => isCompleted(item.id)).length;

      let pillsHtml = "";
      for (const item of qList) {
        const activeClass = item.id === currentQId ? "active" : "";
        const completeClass = isCompleted(item.id) ? "completed" : "";
        const assistClass = isAssisted(item.id) ? "assisted" : "";
        const bookmarkClass = isBookmarked(item.id) ? "bookmarked-pill" : "";

        pillsHtml += `
          <button 
            type="button" 
            class="q-nav-pill ${activeClass} ${completeClass} ${assistClass} ${bookmarkClass}" 
            data-qid="${item.id}"
            title="Q${item.id}: ${item.title}"
            aria-label="Challenge ${item.id}: ${item.title}"
            onclick="window.navigateToQuestion(${item.id})"
          >
            ${item.id}
            ${completeClass ? '<span class="q-check-dot">✓</span>' : ''}
            ${bookmarkClass ? '<span class="q-star-dot">★</span>' : ''}
          </button>
        `;
      }

      sectionsHtml += `
        <div class="q-level-section">
          <div class="q-level-header">
            <span>L${lvl.level}: ${lvl.name}</span>
            <span class="q-lvl-badge">${lvlSolved}/${qList.length}</span>
          </div>
          <div class="q-level-pills-grid">
            ${pillsHtml}
          </div>
        </div>
      `;
    }

    return `
      <aside id="test-q-sidebar" class="q-sidebar" aria-label="Question Navigator">
        <div class="q-sidebar-head">
          <div style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
            <span class="q-sidebar-title">Challenges (${totalQ})</span>
            <span id="sidebar-solved-count" class="q-sidebar-score-pill">${solvedCount}/${totalQ} Solved</span>
          </div>
        </div>
        <div class="q-sidebar-scroll">
          ${sectionsHtml}
        </div>
      </aside>
    `;
  },

  // ==========================================
  // 3. TEST WORKSPACE (QUESTION INTERFACE)
  // ==========================================
  renderTestWorkspace(q) {
    const isCompleted = window.store.isQuestionComplete(q.id);
    const isAssisted = window.store.isQuestionAssisted(q.id);
    const isBookmarked = window.store.isBookmarked(q.id);
    const currentNote = window.store.getNote(q.id);
    const draftCode = window.store.getQuestionDraft(q.id, q.starterCode);
    const questions = window.QUESTIONS_DATA || [];
    const totalQ = questions.length || 72;
    const score = window.store.state.completedQuestions.length;
    const progressPct = Math.min(100, (score / totalQ) * 100);
    const sidebarHtml = this.renderQuestionSidebar(q.id);

    const workspaceHtml = `
      <div class="container test-workspace-container">
        <!-- Test Header Bar -->
        <div class="test-header-bar">
          <div class="test-header-info">
            <span class="test-q-badge">Question ${q.id} of ${totalQ}</span>
            <span class="level-badge level-badge-${q.level}">Level ${q.level}: ${q.levelName}</span>
            <span class="level-diff-badge diff-${q.difficulty.toLowerCase()}">${q.difficulty}</span>
            ${isCompleted ? '<span style="color: #059669; font-size: 0.85rem; font-weight: 700; background: var(--mint-accent); padding: 0.25rem 0.65rem; border-radius: var(--radius-full);">✓ Completed</span>' : ''}
            ${isAssisted ? '<span style="color: var(--soft-amber-dark); font-size: 0.8rem; font-weight: 700; background: var(--soft-amber); padding: 0.25rem 0.65rem; border-radius: var(--radius-full);">(Assisted)</span>' : ''}
          </div>

          <div class="test-progress-wrapper">
            <div style="display: flex; justify-content: space-between; font-size: 0.775rem; color: var(--text-secondary); margin-bottom: 0.35rem; font-weight: 600;">
              <span>Score: <strong id="test-score-display" style="color: var(--primary-blue);">${score} / ${totalQ} Pts</strong></span>
              <span>${Math.round(progressPct)}%</span>
            </div>
            <div class="progress-bar-bg">
              <div id="test-progress-bar" class="progress-bar-fill" style="width: ${progressPct}%;"></div>
            </div>
          </div>

          <div style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;">
            <!-- Bookmark Button -->
            <button 
              id="btn-bookmark-question" 
              class="btn btn-secondary btn-sm ${isBookmarked ? 'bookmarked' : ''}" 
              onclick="window.testEngine.toggleBookmarkCurrent()" 
              aria-pressed="${isBookmarked ? 'true' : 'false'}"
              title="Bookmark this challenge"
            >
              ${isBookmarked ? '★ Bookmarked' : '☆ Bookmark'}
            </button>

            <!-- Editor Preferences Button -->
            <button class="btn btn-secondary btn-sm" onclick="window.openEditorPreferencesModal()" title="Editor Settings (Font size, Theme, Wrap)">
              ⚙️ Settings
            </button>

            <!-- Level Worked Example Quick Link -->
            <button class="btn btn-secondary btn-sm" onclick="window.openWorkedExampleModal(${q.level})" title="Line-by-line worked example for Level ${q.level}">
              📖 Level ${q.level} Example
            </button>

            <!-- Beginner Glossary Quick Link -->
            <button class="btn btn-secondary btn-sm" onclick="window.openGlossaryModal()" title="Beginner Python Glossary">
              📘 Glossary
            </button>

            <button id="btn-toggle-q-nav" class="btn btn-secondary btn-sm" onclick="window.toggleQuestionSidebar()" title="Toggle Questions Navigator">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><circle cx="4" cy="6" r="1.5"/><circle cx="4" cy="12" r="1.5"/><circle cx="4" cy="18" r="1.5"/></svg>
              Questions (${totalQ})
            </button>
            <button class="btn btn-secondary btn-sm ai-header-btn" onclick="window.aiTutor.open()" title="Ask AI Python Tutor" style="background: var(--blue-light); color: var(--primary-blue); border-color: rgba(37, 99, 235, 0.25);">
              <span style="color: var(--primary-blue);">✨</span> Ask AI Tutor
            </button>
            <button class="btn btn-secondary btn-sm" onclick="window.testEngine.prevQuestion()" ${q.id <= 1 ? "disabled style='opacity: 0.4; cursor: not-allowed;'" : ""}>
              ← Prev
            </button>
            <button class="btn btn-secondary btn-sm" onclick="window.testEngine.nextQuestion()" ${q.id >= totalQ ? "disabled style='opacity: 0.4; cursor: not-allowed;'" : ""}>
              Next →
            </button>
            <button class="btn btn-ghost btn-sm" onclick="window.confirmExitTest()">
              Exit Test
            </button>
          </div>
        </div>

        <!-- Split Test Workspace -->
        <div class="test-workspace-split">
          <!-- 1. Question Navigator Sidebar -->
          ${sidebarHtml}

          <!-- 2. Problem Description Panel -->
          <div class="problem-panel">
            <div class="problem-title-row">
              <h2 class="problem-title">${q.title}</h2>
            </div>
            <p class="problem-instructions">${q.description}</p>

            <!-- Plain-Language Beginner Guide (Requirement 7) -->
            ${(() => {
              const guide = q.guide || {
                objective: q.description,
                steps: [
                  "Read any necessary input values with input().",
                  "Convert string inputs to int or float if doing math.",
                  "Compute the result and output it with print()."
                ],
                inputDescription: q.sampleInput || "No input required",
                outputDescription: q.sampleOutput,
                example: `Input: ${q.sampleInput || "None"} -> Output: ${q.sampleOutput}`,
                unfamiliarTerms: []
              };
              return `
                <div class="collapsible-box plain-guide-box">
                  <div class="collapsible-header" onclick="window.toggleAccordion('plain-guide-content')">
                    <span>📖 Plain-Language Guide (Step-by-Step)</span>
                    <span id="plain-guide-toggle-icon">▼</span>
                  </div>
                  <div id="plain-guide-content" class="collapsible-content">
                    <div style="margin-bottom: 0.75rem;">
                      <strong style="color: var(--text-main); font-size: 0.85rem;">🎯 What is this asking?</strong>
                      <p style="color: var(--text-secondary); font-size: 0.85rem; margin-top: 0.25rem; line-height: 1.5;">
                        ${this.escapeHtml(guide.objective)}
                      </p>
                    </div>

                    <div style="margin-bottom: 0.75rem;">
                      <strong style="color: var(--text-main); font-size: 0.85rem;">🪜 Step-by-Step Approach:</strong>
                      <ol style="padding-left: 1.25rem; color: var(--text-secondary); font-size: 0.825rem; line-height: 1.5; margin-top: 0.25rem;">
                        ${(guide.steps || []).map(s => `<li>${this.escapeHtml(s)}</li>`).join("")}
                      </ol>
                    </div>

                    <div style="background: var(--bg-secondary); padding: 0.75rem 1rem; border-radius: var(--radius-sm); border: 1px solid var(--border-color); font-size: 0.825rem; margin-bottom: 0.75rem;">
                      <div><strong>Input Provided:</strong> <code style="color: var(--primary-blue);">${this.escapeHtml(guide.inputDescription || q.sampleInput || "No input required")}</code></div>
                      <div style="margin-top: 0.35rem;"><strong>Expected Output:</strong> <code style="color: #059669;">${this.escapeHtml(guide.outputDescription || q.sampleOutput)}</code></div>
                      ${guide.example ? `<div style="margin-top: 0.35rem; color: var(--text-secondary);"><strong>Small Example:</strong> ${this.escapeHtml(guide.example)}</div>` : ''}
                    </div>

                    ${(guide.unfamiliarTerms && guide.unfamiliarTerms.length > 0) ? `
                      <div>
                        <strong style="color: var(--text-main); font-size: 0.8rem; display: block; margin-bottom: 0.35rem;">📘 Key Terms in Context (Click to open glossary):</strong>
                        <div style="display: flex; gap: 0.4rem; flex-wrap: wrap;">
                          ${guide.unfamiliarTerms.map(t => `
                            <button class="glossary-term-chip" onclick="window.openGlossaryModal('${t.termId || t.term}')" title="Click to view full definition and examples">
                              <strong>${this.escapeHtml(t.term)}</strong>: <em>${this.escapeHtml(t.explanation)}</em> ↗
                            </button>
                          `).join("")}
                        </div>
                      </div>
                    ` : ''}
                  </div>
                </div>
              `;
            })()}

            <div>
              <h4 style="font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); margin-bottom: 0.5rem;">Requirements</h4>
              <ul style="padding-left: 1.25rem; font-size: 0.875rem; color: var(--text-secondary); line-height: 1.6;">
                ${q.requirements.map(req => `<li>${req}</li>`).join("")}
              </ul>
            </div>

            <!-- Sample Input & Output -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div class="io-example-card">
                <div class="io-example-header">Sample Input</div>
                <div class="io-code-block">${q.sampleInput || "No input required"}</div>
              </div>
              <div class="io-example-card">
                <div class="io-example-header">Expected Output</div>
                <div class="io-code-block">${q.sampleOutput}</div>
              </div>
              <div style="grid-column: span 2; font-size: 0.775rem; color: var(--text-muted); background: var(--bg-secondary); padding: 0.5rem 0.75rem; border-radius: var(--radius-xs); border: 1px solid var(--border-color); line-height: 1.45;">
                💡 <strong>How input() uses sample inputs:</strong> When you click <em>Run Code</em>, each time your Python program calls <code>input()</code>, it automatically reads the next line from the sample input above.
              </div>
            </div>

            <!-- Progressive Hints (Requirement 8) -->
            <div class="collapsible-box">
              <div class="collapsible-header" onclick="window.toggleAccordion('progressive-hints-box')">
                <span>💡 Progressive Hints (<span id="hints-count-badge">0 hints revealed</span>)</span>
                <span id="hints-toggle-icon">▼</span>
              </div>
              <div id="progressive-hints-box" class="collapsible-content" style="display: none;">
                <div id="hints-progressive-container" style="display: grid; gap: 0.65rem; margin-bottom: 0.75rem;"></div>
                <button id="btn-reveal-next-hint" class="btn btn-secondary btn-sm" onclick="window.testEngine.revealNextHint()">
                  Reveal Next Hint →
                </button>
              </div>
            </div>

            <!-- Private Notes Collapsible -->
            <div class="collapsible-box">
              <div class="collapsible-header" onclick="window.toggleAccordion('notes-content')">
                <span>📝 Private Notes for this Challenge</span>
                <span id="note-saved-indicator" style="font-size: 0.75rem; color: #059669; font-weight: 600;"></span>
                <span>▼</span>
              </div>
              <div id="notes-content" class="collapsible-content" style="display: none;">
                <textarea 
                  id="challenge-notes-textarea" 
                  class="challenge-notes-input" 
                  placeholder="Jot down notes, logic reflections, or tricky edge cases for this challenge... (saved automatically in browser)"
                  oninput="window.testEngine.saveNoteCurrent(this.value)"
                >${currentNote}</textarea>
              </div>
            </div>

            <!-- Solution Reveal Collapsible -->
            <div class="collapsible-box">
              <div class="collapsible-header" onclick="window.toggleSolution()">
                <span>🔓 View Reference Solution (Assisted)</span>
                <span>▶</span>
              </div>
              <div id="solution-view-container" class="collapsible-content" style="display: none;">
                <div class="solution-warning">
                  ⚠️ Note: Viewing the reference solution will mark this question as "Assisted". Try using the progressive hints above first!
                </div>
                <pre class="io-code-block">${q.solutionCode}</pre>
                <p style="margin-top: 0.75rem; font-size: 0.825rem; color: var(--text-muted);">${q.explanation}</p>
              </div>
            </div>
          </div>

          <!-- 3. Code Editor Panel & Real Python Terminal -->
          <div class="editor-panel dark-navy-editor">
            <!-- Toolbar with Copy, Reset, and solution.py tab -->
            <div class="editor-toolbar">
              <div class="editor-tab">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                solution.py
              </div>
              <div class="editor-actions">
                <button class="btn btn-ghost btn-sm" onclick="window.copyEditorCode()" title="Copy code">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                  Copy
                </button>
                <button class="btn btn-ghost btn-sm" onclick="window.testEngine.resetCurrentCode()" title="Reset code to starter template">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                  Reset
                </button>
              </div>
            </div>

            <!-- Code Area with Line Numbers & Syntax Highlighting -->
            <div class="editor-code-container">
              <div id="editor-line-numbers" class="editor-line-numbers">
                <div>1</div><div>2</div><div>3</div><div>4</div><div>5</div><div>6</div>
              </div>
              <div class="editor-code-wrapper">
                <pre id="editor-highlighting" class="editor-highlight-layer" aria-hidden="true"><code id="editor-highlight-code" class="language-python"></code></pre>
                <textarea 
                  id="code-editor-textarea" 
                  class="editor-textarea" 
                  spellcheck="false" 
                  autocomplete="off" 
                  autocorrect="off" 
                  autocapitalize="off"
                  placeholder="# Write your Python code here..."
                  aria-label="Python Code Editor"
                >${draftCode}</textarea>
              </div>
            </div>

            <!-- Try Your Own Input Drawer (Requirement 9) -->
            <div id="custom-input-drawer" class="custom-input-drawer" style="display: none;">
              <div class="custom-input-header">
                <span style="font-weight: 700; font-size: 0.85rem; color: #C084FC;">⌨️ Try Your Own Input (Interactive Sandbox — Not Graded)</span>
                <button class="btn-icon btn-sm" onclick="window.testEngine.toggleCustomInputDrawer()" aria-label="Close custom input drawer" style="color: #cbd5e1;">✕</button>
              </div>
              <p class="custom-input-desc">
                Enter your custom inputs below (one per line). Each <code>input()</code> call reads the next line. Running with custom input is strictly for your personal testing and <strong>does not grade or change your score</strong>.
              </p>
              <textarea id="custom-input-textarea" class="custom-input-textarea" placeholder="Line 1: first input&#10;Line 2: second input..." aria-label="Custom Input Values"></textarea>
              <div style="display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 0.5rem;">
                <button class="btn btn-secondary btn-sm" onclick="window.testEngine.toggleCustomInputDrawer()">Close</button>
                <button class="btn btn-primary btn-sm" onclick="window.testEngine.runWithCustomInput()" style="background: #9333EA; border-color: #A855F7;">
                  ▶ Run With My Input
                </button>
              </div>
            </div>

            <!-- Terminal Output Console -->
            <div class="terminal-console">
              <div class="terminal-header">
                <span>Output Console</span>
                <span id="runtime-status-tag" style="color: #38BDF8;">Python 3 Runtime (Client-Side)</span>
              </div>
              <div id="terminal-stdout" class="terminal-stdout" aria-live="polite">Click "Run Code", "Try Your Own Input", or "Submit Answer" to execute your program.</div>
            </div>

            <!-- Granular Test Feedback Notification Area -->
            <div id="feedback-container" style="padding: 0 1.25rem 1rem;"></div>

            <!-- Bottom Action Bar -->
            <div class="editor-bottom-bar">
              <div class="shortcut-hint">
                <span class="shortcut-kbd">Ctrl</span> + <span class="shortcut-kbd">Enter</span> to Submit
              </div>
              <div style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;">
                <button class="btn btn-secondary btn-sm" onclick="window.aiTutor.open()" title="Ask AI for help on this problem" style="background: var(--blue-light); color: var(--primary-blue); border-color: rgba(37, 99, 235, 0.25);">
                  <span style="color: var(--primary-blue);">✨</span> Ask AI
                </button>
                <button class="btn btn-secondary btn-sm" onclick="window.testEngine.toggleCustomInputDrawer()" title="Test code with custom values you type yourself">
                  ⌨️ Try Your Own Input
                </button>
                <button class="btn btn-secondary btn-sm btn-run-code" onclick="window.testEngine.runCodeOnly()" title="Execute code against sample input without grading">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                  Run Code
                </button>
                <button id="btn-submit-answer" class="btn btn-primary" onclick="window.testEngine.submitAnswer()" title="Validate code against all test suites">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m5 12 5 5L20 7"/></svg>
                  Submit Answer
                </button>
              </div>
            </div>
          </div>
        </div>

        ${UI.renderCertificateSection()}
        <!-- /CERTIFICATE -->

      </div>
    `;

    const appContainer = document.getElementById("app");
    if (appContainer) {
      appContainer.innerHTML = workspaceHtml;
      const textarea = document.getElementById("code-editor-textarea");
      if (textarea) {
        textarea.value = draftCode;
      }
      window.testEngine.updateLineNumbers();
      if (typeof window.updateSyntaxHighlighting === "function") {
        window.updateSyntaxHighlighting();
      }
      window.setupEditorEventListeners();
    }
  },

  // ==========================================
  // 4. QUESTION BANK (MULTI-FILTER & SEARCH)
  // ==========================================
  renderQuestionBank(activeLevel = "all", searchQuery = "", difficulty = "all", status = "all", bookmarkedOnly = false) {
    const questions = window.QUESTIONS_DATA || [];
    const isCompleted = (id) => window.store.isQuestionComplete(id);
    const isAssisted = (id) => window.store.isQuestionAssisted(id);
    const isBookmarked = (id) => window.store.isBookmarked(id);
    const mistakesSet = new Set((window.store.getMistakes ? window.store.getMistakes() : []).map(m => m.questionId));

    const filtered = questions.filter(q => {
      const matchLevel = activeLevel === "all" || q.level === parseInt(activeLevel);
      const matchDiff = difficulty === "all" || q.difficulty.toLowerCase() === difficulty.toLowerCase();
      
      let matchStatus = true;
      if (status === "solved") matchStatus = isCompleted(q.id);
      else if (status === "unsolved") matchStatus = !isCompleted(q.id);
      else if (status === "mistakes") matchStatus = mistakesSet.has(q.id);

      const matchBookmark = !bookmarkedOnly || isBookmarked(q.id);

      const matchQuery = !searchQuery || 
        q.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        q.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.levelName.toLowerCase().includes(searchQuery.toLowerCase());

      return matchLevel && matchDiff && matchStatus && matchBookmark && matchQuery;
    });

    return `
      <div class="container section-py">
        <div class="section-header">
          <span class="section-tag">Curriculum Repository</span>
          <h2 class="section-title">${questions.length} Python Practice Questions</h2>
          <p class="section-desc">
            Explore challenges, filter simultaneously by topic level, difficulty, completion status, or your bookmarks.
          </p>
        </div>

        <div class="qb-controls-card">
          <!-- Search Bar -->
          <div style="display: flex; gap: 0.75rem; align-items: center; margin-bottom: 1rem; flex-wrap: wrap;">
            <input 
              type="text" 
              id="qb-search-input" 
              class="qb-search-input" 
              placeholder="Search questions (e.g. 'reverse', 'prime', 'dictionary', 'class')..." 
              value="${searchQuery}"
              oninput="window.handleQBSearch(this.value)"
              style="flex-grow: 1; margin: 0;"
              aria-label="Search questions"
            />
            <button class="btn btn-secondary btn-sm" onclick="window.resetQBFilters()">Reset Filters</button>
          </div>

          <!-- Filter Controls Matrix -->
          <div class="qb-filters-matrix">
            <!-- Level / Topic Filter -->
            <div class="filter-group">
              <label class="filter-label">Topic / Level:</label>
              <div class="qb-filters">
                <button class="filter-pill ${activeLevel === 'all' ? 'active' : ''}" onclick="window.filterQBLevel('all')">All</button>
                <button class="filter-pill ${activeLevel === '1' ? 'active' : ''}" onclick="window.filterQBLevel('1')">L1: Variables</button>
                <button class="filter-pill ${activeLevel === '2' ? 'active' : ''}" onclick="window.filterQBLevel('2')">L2: Conditions</button>
                <button class="filter-pill ${activeLevel === '3' ? 'active' : ''}" onclick="window.filterQBLevel('3')">L3: Loops</button>
                <button class="filter-pill ${activeLevel === '4' ? 'active' : ''}" onclick="window.filterQBLevel('4')">L4: Strings/Lists</button>
                <button class="filter-pill ${activeLevel === '5' ? 'active' : ''}" onclick="window.filterQBLevel('5')">L5: Projects</button>
                <button class="filter-pill ${activeLevel === '6' ? 'active' : ''}" onclick="window.filterQBLevel('6')">L6: Functions/Dicts</button>
                <button class="filter-pill ${activeLevel === '7' ? 'active' : ''}" onclick="window.filterQBLevel('7')">L7: Classes/Files</button>
              </div>
            </div>

            <!-- Difficulty & Status Filter Bar -->
            <div style="display: flex; gap: 1.5rem; flex-wrap: wrap; margin-top: 0.75rem; align-items: center;">
              <div style="display: flex; gap: 0.5rem; align-items: center;">
                <span class="filter-label" style="margin: 0;">Difficulty:</span>
                <select id="qb-filter-diff" class="form-select-sm" onchange="window.filterQBDifficulty(this.value)">
                  <option value="all" ${difficulty === 'all' ? 'selected' : ''}>All Difficulties</option>
                  <option value="beginner" ${difficulty === 'beginner' ? 'selected' : ''}>Beginner</option>
                  <option value="intermediate" ${difficulty === 'intermediate' ? 'selected' : ''}>Intermediate</option>
                  <option value="advanced" ${difficulty === 'advanced' ? 'selected' : ''}>Advanced</option>
                </select>
              </div>

              <div style="display: flex; gap: 0.5rem; align-items: center;">
                <span class="filter-label" style="margin: 0;">Status:</span>
                <select id="qb-filter-status" class="form-select-sm" onchange="window.filterQBStatus(this.value)">
                  <option value="all" ${status === 'all' ? 'selected' : ''}>All Statuses</option>
                  <option value="solved" ${status === 'solved' ? 'selected' : ''}>✓ Solved</option>
                  <option value="unsolved" ${status === 'unsolved' ? 'selected' : ''}>Unsolved</option>
                  <option value="mistakes" ${status === 'mistakes' ? 'selected' : ''}>⚠️ Needs Review</option>
                </select>
              </div>

              <div>
                <label style="display: inline-flex; align-items: center; gap: 0.4rem; font-size: 0.85rem; font-weight: 600; cursor: pointer;">
                  <input 
                    type="checkbox" 
                    id="qb-filter-bookmark" 
                    ${bookmarkedOnly ? 'checked' : ''} 
                    onchange="window.filterQBBookmarks(this.checked)"
                  />
                  <span>★ Bookmarked Only (${window.store.getBookmarks().length})</span>
                </label>
              </div>
            </div>
          </div>

          <div style="margin-top: 0.75rem; font-size: 0.8rem; color: var(--text-muted); display: flex; justify-content: space-between;">
            <span>Showing <strong>${filtered.length}</strong> of ${questions.length} challenges</span>
          </div>
        </div>

        <!-- Question Cards Grid -->
        <div class="qb-grid">
          ${filtered.length === 0 ? `
            <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem; background: var(--bg-card); border-radius: var(--radius-xl); border: 1px solid var(--border-color);">
              <span style="font-size: 2rem;">🔍</span>
              <h3 style="margin: 0.75rem 0 0.25rem;">No matching challenges found</h3>
              <p style="color: var(--text-secondary); font-size: 0.9rem;">Try adjusting your keyword search or clearing some filters.</p>
              <button class="btn btn-secondary btn-sm" onclick="window.resetQBFilters()" style="margin-top: 1rem;">Clear All Filters</button>
            </div>
          ` : filtered.map(q => {
            const isSolved = isCompleted(q.id);
            const isAssistedFlag = isAssisted(q.id);
            const isStarred = isBookmarked(q.id);
            return `
              <div class="qb-card ${isSolved ? 'solved' : ''}">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                  <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <span style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-muted); font-weight: 700;">#${q.id}</span>
                    <button 
                      class="btn-star-icon ${isStarred ? 'starred' : ''}" 
                      onclick="window.store.toggleBookmark(${q.id}); window.refreshCurrentQB();"
                      title="${isStarred ? 'Remove bookmark' : 'Bookmark challenge'}"
                    >
                      ${isStarred ? '★' : '☆'}
                    </button>
                  </div>
                  <div style="display: flex; gap: 0.4rem; align-items: center;">
                    <span class="level-diff-badge diff-${q.difficulty.toLowerCase()}">${q.difficulty}</span>
                    ${isSolved ? '<span style="color: #059669; font-size: 0.8rem; font-weight: 700; background: var(--mint-accent); padding: 0.2rem 0.6rem; border-radius: var(--radius-full);">✓ Solved</span>' : ''}
                  </div>
                </div>
                <h3 style="font-size: 1.15rem; margin-bottom: 0.5rem; color: var(--text-main);">${q.title}</h3>
                <p style="font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 1.25rem; flex-grow: 1; line-height: 1.5;">
                  ${q.description.substring(0, 110)}...
                </p>
                <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-color); padding-top: 0.85rem;">
                  <span class="level-badge level-badge-${q.level}" style="font-size: 0.725rem; padding: 0.2rem 0.55rem;">Level ${q.level}</span>
                  <button class="btn btn-secondary btn-sm" onclick="window.startPractice(${q.id})">
                    ${isSolved ? "Practice Again" : "Solve Challenge →"}
                  </button>
                </div>
              </div>
            `;
          }).join("")}
        </div>

        ${UI.renderCertificateSection()}
        <!-- /CERTIFICATE -->

      </div>
    `;
  },

  // ==========================================
  // 5. REVIEW MISTAKES VIEW
  // ==========================================
  renderMistakes() {
    const questions = window.QUESTIONS_DATA || [];
    const mistakes = window.store.getMistakes ? window.store.getMistakes() : [];
    const rec = window.store.getPersonalizedRecommendation ? window.store.getPersonalizedRecommendation() : null;

    return `
      <div class="container section-py">
        <div class="section-header">
          <span class="section-tag">Learning from Errors</span>
          <h2 class="section-title">Review Unresolved Mistakes</h2>
          <p class="section-desc">
            Challenges you have attempted with failing tests that are not yet solved. Unresolved mistakes are permanently preserved until you pass them, prioritized by repeated struggles so you know exactly where to focus.
          </p>
        </div>

        <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-bottom: 1.5rem; flex-wrap: wrap;">
          <button class="btn btn-secondary btn-sm" onclick="window.exportPracticeHistoryFile()" title="Download full history of all attempts and mistakes as JSON">
            📥 Export Practice History (JSON)
          </button>
        </div>

        ${mistakes.length === 0 ? `
          <div class="empty-mistakes-card" style="margin-bottom: 2rem;">
            <span style="font-size: 3rem;">🎉</span>
            <h3 style="font-size: 1.4rem; margin: 0.75rem 0 0.5rem;">Zero Unresolved Mistakes!</h3>
            <p style="color: var(--text-secondary); max-width: 480px; margin: 0 auto 1.5rem; line-height: 1.5;">
              You have successfully solved every challenge you have attempted so far. Keep up the flawless progress!
            </p>
            <div style="display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap;">
              <button class="btn btn-primary" onclick="window.startPractice(${rec ? rec.question.id : 1})">
                ${rec ? `Continue with Challenge #${rec.question.id} →` : "Continue Practicing →"}
              </button>
              <button class="btn btn-secondary" onclick="window.navigateTo('practice-modes')">Try Timed Quiz</button>
            </div>
          </div>

          ${rec ? `
            <div class="recommendation-callout-box">
              <div style="display: flex; align-items: center; justify-content: space-between; gap: 1rem; flex-wrap: wrap;">
                <div>
                  <span class="rec-badge">${rec.badge}</span>
                  <h4 style="margin: 0.35rem 0 0.2rem; font-size: 1.1rem; color: var(--text-main);">
                    Recommended Next Challenge: #${rec.question.id} — ${rec.question.title}
                  </h4>
                  <p style="color: var(--text-secondary); font-size: 0.85rem; margin: 0; line-height: 1.45;">
                    ${rec.reason}
                  </p>
                </div>
                <button class="btn btn-primary" onclick="window.startPractice(${rec.question.id})">
                  ${rec.actionText}
                </button>
              </div>
            </div>
          ` : ''}
        ` : `
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 0.5rem;">
            <span style="font-weight: 700; color: var(--text-main);">
              <strong>${mistakes.length}</strong> ${mistakes.length === 1 ? 'challenge requires' : 'challenges require'} review (Ranked by failed attempts & recency)
            </span>
            <button class="btn btn-secondary btn-sm" onclick="window.startPractice(${mistakes[0].questionId})">
              Retry Highest Priority (#${mistakes[0].questionId}) →
            </button>
          </div>

          <div class="mistakes-list-grid">
            ${mistakes.map(m => {
              const q = questions.find(item => item.id === m.questionId);
              if (!q) return '';
              const latest = m.latestAttempt;
              const dateStr = latest ? new Date(latest.timestamp).toLocaleDateString() + ' ' + new Date(latest.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
              return `
                <div class="mistake-review-card">
                  <div class="mistake-card-top">
                    <div>
                      <div style="display: flex; gap: 0.5rem; align-items: center; margin-bottom: 0.35rem; flex-wrap: wrap;">
                        <span style="font-family: var(--font-mono); font-weight: 700; color: var(--text-muted);">#${q.id}</span>
                        <span class="level-badge level-badge-${q.level}">Level ${q.level}: ${q.levelName}</span>
                        <span class="level-diff-badge diff-${q.difficulty.toLowerCase()}">${q.difficulty}</span>
                        ${m.failedCount > 1 
                          ? `<span style="background: #FEE2E2; color: #DC2626; font-weight: 700; padding: 0.15rem 0.5rem; border-radius: var(--radius-full); font-size: 0.725rem;">Repeated struggle: ${m.failedCount} fails</span>`
                          : `<span style="background: #FEF3C7; color: #D97706; font-weight: 600; padding: 0.15rem 0.5rem; border-radius: var(--radius-full); font-size: 0.725rem;">1 failed attempt</span>`
                        }
                      </div>
                      <h3 style="font-size: 1.2rem; color: var(--text-main); margin-bottom: 0.4rem;">${q.title}</h3>
                      <p style="font-size: 0.875rem; color: var(--text-secondary); line-height: 1.5;">${q.description}</p>
                    </div>
                    <div style="text-align: right; flex-shrink: 0;">
                      <button class="btn btn-primary" onclick="window.startPractice(${q.id})">
                        Retry Challenge →
                      </button>
                    </div>
                  </div>

                  <!-- Latest Attempt Context -->
                  <div class="mistake-meta-box">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.4rem; font-size: 0.8rem; flex-wrap: wrap; gap: 0.35rem;">
                      <span style="color: #E11D48; font-weight: 700;">✗ Latest Result: Failed</span>
                      <span style="color: var(--text-muted);">${dateStr}</span>
                    </div>
                    ${latest && latest.details ? `
                      <div style="font-size: 0.825rem; color: var(--text-secondary); margin-bottom: 0.5rem;">
                        <strong>Failure Feedback:</strong> ${latest.details}
                      </div>
                    ` : ''}
                    ${latest && latest.codeSnippet ? `
                      <div style="font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.25rem; font-weight: 700;">Your Saved Code Draft:</div>
                      <pre class="mistake-code-preview"><code>${latest.codeSnippet}</code></pre>
                    ` : ''}
                  </div>
                </div>
              `;
            }).join("")}
          </div>
        `}
      </div>
    `;
  },

  // ==========================================
  // 6. PRACTICE MODES (DAILY, QUIZ, TOPIC)
  // ==========================================
  renderPracticeModes(activeMode = "select") {
    return `
      <div class="container section-py">
        <div class="section-header">
          <span class="section-tag">Targeted Training</span>
          <h2 class="section-title">Practice Modes</h2>
          <p class="section-desc">
            Select a tailored workout: tackle a 3-challenge daily sprint, test your speed in a timed quiz, or drill a focused topic.
          </p>
        </div>

        <div class="modes-selection-grid">
          <!-- Daily Practice Sprint -->
          <div class="mode-card">
            <div class="mode-card-icon" style="background: var(--peach-soft); color: var(--coral-deep);">
              📅
            </div>
            <h3 class="mode-card-title">Daily Practice Sprint</h3>
            <p class="mode-card-desc">
              A quick 3-challenge workout curated for today to keep your daily coding streak alive without overwhelming you.
            </p>
            <ul class="mode-bullets">
              <li>3 progressive questions</li>
              <li>Untimed, focused practice</li>
              <li>Preserves all drafts</li>
            </ul>
            <button class="btn btn-primary" style="width: 100%; margin-top: auto;" onclick="window.startDailySprint()">
              Start Daily Sprint →
            </button>
          </div>

          <!-- Timed Quiz Mode -->
          <div class="mode-card">
            <div class="mode-card-icon" style="background: var(--blue-light); color: var(--primary-blue);">
              ⏱️
            </div>
            <h3 class="mode-card-title">Timed Speed Quiz</h3>
            <p class="mode-card-desc">
              Test your logic against the clock! 5 randomized challenges with a live 10-minute countdown timer and instant scoring report.
            </p>
            <ul class="mode-bullets">
              <li>5 randomized challenges</li>
              <li>10-minute countdown timer</li>
              <li>Summary score & accuracy</li>
            </ul>
            <button class="btn btn-primary" style="width: 100%; margin-top: auto;" onclick="window.startTimedQuiz()">
              Launch Timed Quiz →
            </button>
          </div>

          <!-- Topic-Focused Drill -->
          <div class="mode-card">
            <div class="mode-card-icon" style="background: var(--mint-accent); color: var(--mint-accent-dark);">
              🎯
            </div>
            <h3 class="mode-card-title">Topic & Level Focus</h3>
            <p class="mode-card-desc">
              Drill specifically into topics where you want reinforcement, such as loops, dictionaries, or exception handling.
            </p>
            <div style="margin-bottom: 1.25rem;">
              <select id="topic-drill-select" class="form-select-sm" style="width: 100%; padding: 0.5rem;">
                <option value="1">Level 1: Variables and Basic Maths</option>
                <option value="2">Level 2: Conditions and Decision Making</option>
                <option value="3">Level 3: Loops and Repetition</option>
                <option value="4">Level 4: Strings and Lists</option>
                <option value="5">Level 5: Mini Projects and Problem Solving</option>
                <option value="6">Level 6: Functions, Dictionaries & Sets</option>
                <option value="7">Level 7: Exceptions, Files & Classes</option>
              </select>
            </div>
            <button class="btn btn-secondary" style="width: 100%; margin-top: auto;" onclick="window.startTopicDrill()">
              Start Topic Drill →
            </button>
          </div>
        </div>

        <!-- Practice Sessions History -->
        <div style="margin-top: 3rem;">
          <h3 style="font-size: 1.25rem; margin-bottom: 1rem;">Past Practice Sessions</h3>
          ${(window.store.state.practiceSessions || []).length === 0 ? `
            <div style="background: var(--bg-card); padding: 2rem; text-align: center; border-radius: var(--radius-xl); border: 1px solid var(--border-color); color: var(--text-secondary);">
              No practice sessions recorded yet. Launch a timed quiz or daily sprint above to record your session history!
            </div>
          ` : `
            <div class="history-table-card">
              <table class="table-app">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Mode</th>
                    <th>Score</th>
                    <th>Duration</th>
                  </tr>
                </thead>
                <tbody>
                  ${(window.store.state.practiceSessions || []).slice(0, 5).map(s => `
                    <tr>
                      <td>${new Date(s.date).toLocaleDateString()}</td>
                      <td><strong>${s.type.toUpperCase()}</strong> (${s.topic || 'General'})</td>
                      <td>${s.score} / ${s.total} (${Math.round((s.score / (s.total || 1)) * 100)}%)</td>
                      <td>${Math.floor(s.durationSec / 60)}m ${s.durationSec % 60}s</td>
                    </tr>
                  `).join("")}
                </tbody>
              </table>
            </div>
          `}
        </div>

        ${UI.renderCertificateSection()}
        <!-- /CERTIFICATE -->

      </div>
    `;
  },

  // ==========================================
  // 7. GUIDED PROJECTS VIEW
  // ==========================================
  renderGuidedProjects(activeProjId = "ledger") {
    const projects = [
      {
        id: "ledger",
        title: "Personal Expense & Budget Manager",
        level: "Intermediate",
        desc: "Build a complete financial tracking tool step-by-step: handle deposits, categories, validation, and final summary reporting.",
        steps: [
          {
            step: 1,
            title: "Step 1: Balance & Category Setup",
            desc: "Initialize a balance of 500.0 and a dictionary of categories {'food': 0, 'travel': 0}. Print the initial balance and categories.",
            starter: "# Step 1: Initialize balance and categories\nbalance = 500.0\ncategories = {'food': 0.0, 'travel': 0.0}\nprint(balance)\nprint(categories)\n",
            test: (out) => out.includes("500") && out.includes("food")
          },
          {
            step: 2,
            title: "Step 2: Add Expense Function",
            desc: "Define a function add_expense(cat, amt) that checks if amt <= balance. If valid, deducts from balance and adds to category. Otherwise prints 'Over budget'.",
            starter: "balance = 500.0\ncategories = {'food': 0.0, 'travel': 0.0}\n\ndef add_expense(cat, amt):\n    global balance\n    if amt <= balance:\n        balance -= amt\n        categories[cat] = categories.get(cat, 0.0) + amt\n        print(f\"New Balance: {balance}\")\n    else:\n        print(\"Over budget\")\n\nadd_expense('food', 50.0)\n",
            test: (out) => out.includes("450")
          },
          {
            step: 3,
            title: "Step 3: Category Percentage Breakdown",
            desc: "Calculate what percentage of total expenses went to food vs travel and print a formatted summary.",
            starter: "categories = {'food': 100.0, 'travel': 50.0}\ntotal = sum(categories.values())\nfor cat, amt in categories.items():\n    pct = (amt / total) * 100\n    print(f\"{cat}: {pct:.1f}%\")\n",
            test: (out) => out.includes("food: 66.7%") || out.includes("travel: 33.3%")
          },
          {
            step: 4,
            title: "Step 4: Final Challenge — Complete CLI Expense App",
            desc: "Synthesize all steps into a complete interactive expense program that takes 3 commands, updates balance, and prints the final ledger report.",
            starter: "# Final combined Expense App\nbalance = 1000.0\nexpenses = {}\nfor _ in range(2):\n    cat, amt = input().split()\n    amt = float(amt)\n    balance -= amt\n    expenses[cat] = expenses.get(cat, 0.0) + amt\nprint(f\"Remaining: {balance}\")\nprint(expenses)\n",
            test: (out) => out.includes("Remaining:")
          }
        ]
      },
      {
        id: "game",
        title: "High-Low Number Guessing Game Engine",
        level: "Beginner–Intermediate",
        desc: "Construct an interactive game logic engine step-by-step: bounds checking, comparison feedback, score multipliers, and final replay loop.",
        steps: [
          {
            step: 1,
            title: "Step 1: Input Validation & Bounds Check",
            desc: "Read a user's guess and ensure it is between 1 and 100 inclusive. Print 'Valid guess' or 'Out of bounds'.",
            starter: "guess = int(input())\nif 1 <= guess <= 100:\n    print(\"Valid guess\")\nelse:\n    print(\"Out of bounds\")\n",
            test: (out) => out.includes("Valid guess") || out.includes("Out of bounds")
          },
          {
            step: 2,
            title: "Step 2: Comparison Feedback Engine",
            desc: "Compare guess with target. Print 'Too high', 'Too low', or 'Correct!'.",
            starter: "target = 42\nguess = int(input())\nif guess > target: print(\"Too high\")\nelif guess < target: print(\"Too low\")\nelse: print(\"Correct!\")\n",
            test: (out) => out.includes("Too high") || out.includes("Too low") || out.includes("Correct")
          },
          {
            step: 3,
            title: "Step 3: Attempt Counter & Score Calculation",
            desc: "Calculate player score: start with 100 points, deduct 10 points for each wrong attempt.",
            starter: "attempts = 3\nscore = max(0, 100 - (attempts * 10))\nprint(f\"Score: {score}\")\n",
            test: (out) => out.includes("Score: 70")
          },
          {
            step: 4,
            title: "Step 4: Final Challenge — Complete Replayable Game Logic",
            desc: "Assemble all components into a multi-round game evaluator that prints the round summary and final rating.",
            starter: "# Final game engine\ntarget = 50\nguesses = [30, 60, 50]\nfor g in guesses:\n    if g == target:\n        print(\"Found it!\")\n        break\n    elif g < target:\n        print(\"Higher\")\n    else:\n        print(\"Lower\")\n",
            test: (out) => out.includes("Found it!")
          }
        ]
      }
    ];

    const currentProj = projects.find(p => p.id === activeProjId) || projects[0];
    const savedProgress = window.store.getGuidedProjectProgress ? window.store.getGuidedProjectProgress(currentProj.id) : { currentStep: 1, completedSteps: [] };

    return `
      <div class="container section-py">
        <div class="section-header">
          <span class="section-tag">Step-by-Step Learning</span>
          <h2 class="section-title">Guided Projects</h2>
          <p class="section-desc">
            Break larger real-world programs into small, guided milestones with instant validation and a final synthesis challenge.
          </p>
        </div>

        <!-- Project Selector Tabs -->
        <div style="display: flex; gap: 1rem; margin-bottom: 2rem; flex-wrap: wrap;">
          ${projects.map(p => {
            const active = p.id === currentProj.id;
            const prog = window.store.getGuidedProjectProgress ? window.store.getGuidedProjectProgress(p.id) : { completedSteps: [] };
            return `
              <button 
                class="btn ${active ? 'btn-primary' : 'btn-secondary'}" 
                onclick="window.navigateToGuidedProject('${p.id}')"
              >
                ${p.title} (${prog.completedSteps.length}/4 Steps)
              </button>
            `;
          }).join("")}
        </div>

        <!-- Active Project Card -->
        <div class="guided-project-container">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
            <div>
              <span class="level-diff-badge diff-intermediate">${currentProj.level}</span>
              <h3 style="font-size: 1.5rem; margin: 0.5rem 0 0.25rem;">${currentProj.title}</h3>
              <p style="color: var(--text-secondary); max-width: 600px; font-size: 0.9rem;">${currentProj.desc}</p>
            </div>
            <div style="text-align: right;">
              <div style="font-weight: 700; font-size: 1.25rem; color: var(--primary-blue);">
                ${savedProgress.completedSteps.length} / 4 Steps Completed
              </div>
            </div>
          </div>

          <!-- Step Progression Stepper -->
          <div class="stepper-bar">
            ${currentProj.steps.map(s => {
              const isDone = savedProgress.completedSteps.includes(s.step);
              const isCurrent = savedProgress.currentStep === s.step;
              return `
                <div class="stepper-step ${isDone ? 'done' : ''} ${isCurrent ? 'current' : ''}">
                  <div class="stepper-circle">${isDone ? '✓' : s.step}</div>
                  <span class="stepper-label">Step ${s.step}</span>
                </div>
              `;
            }).join("")}
          </div>

          <!-- Steps Content Accordion/List -->
          <div style="display: flex; flex-direction: column; gap: 1.5rem; margin-top: 2rem;">
            ${currentProj.steps.map(s => {
              const isDone = savedProgress.completedSteps.includes(s.step);
              return `
                <div class="guided-step-card ${isDone ? 'step-completed' : ''}">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                    <h4 style="font-size: 1.15rem; color: var(--text-main);">${s.title}</h4>
                    ${isDone ? '<span style="color: #059669; font-weight: 700; background: var(--mint-accent); padding: 0.2rem 0.6rem; border-radius: var(--radius-full); font-size: 0.8rem;">✓ Step Complete</span>' : ''}
                  </div>
                  <p style="color: var(--text-secondary); font-size: 0.875rem; line-height: 1.5; margin-bottom: 1rem;">
                    ${s.desc}
                  </p>
                  
                  <div style="background: var(--bg-main); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 0.75rem; margin-bottom: 0.75rem;">
                    <textarea 
                      id="proj-step-code-${s.step}" 
                      class="editor-textarea" 
                      style="height: 110px; font-size: 0.85rem; background: #0F172A; color: #F8FAFC; border-radius: var(--radius-sm); padding: 0.75rem; width: 100%; border: none;"
                    >${s.starter}</textarea>
                  </div>

                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div id="proj-step-feedback-${s.step}" style="font-size: 0.825rem; font-weight: 600;"></div>
                    <button class="btn btn-secondary btn-sm" onclick="window.runGuidedProjectStep('${currentProj.id}', ${s.step})">
                      Validate Step ${s.step} →
                    </button>
                  </div>
                </div>
              `;
            }).join("")}
          </div>
        </div>

        ${UI.renderCertificateSection()}
        <!-- /CERTIFICATE -->

      </div>
    `;
  },

  // ==========================================
  // 8. INTERACTIVE CONCEPT DEMOS
  // ==========================================
  renderConceptDemos(activeDemo = "conditions") {
    return `
      <div class="container section-py">
        <div class="section-header">
          <span class="section-tag">Hands-on Visualizer</span>
          <h2 class="section-title">Interactive Concept Demos</h2>
          <p class="section-desc">
            Change sample inputs and see the execution branch, string slice, or list state update live before your eyes.
          </p>
        </div>

        <!-- Demo Selector Tabs -->
        <div style="display: flex; gap: 0.75rem; justify-content: center; margin-bottom: 2rem; flex-wrap: wrap;">
          <button class="filter-pill ${activeDemo === 'conditions' ? 'active' : ''}" onclick="window.showConceptDemo('conditions')">Conditions (If/Else)</button>
          <button class="filter-pill ${activeDemo === 'loops' ? 'active' : ''}" onclick="window.showConceptDemo('loops')">Loops (For/Range)</button>
          <button class="filter-pill ${activeDemo === 'strings' ? 'active' : ''}" onclick="window.showConceptDemo('strings')">String Slicing</button>
          <button class="filter-pill ${activeDemo === 'lists' ? 'active' : ''}" onclick="window.showConceptDemo('lists')">List Operations</button>
          <button class="filter-pill ${activeDemo === 'dicts' ? 'active' : ''}" onclick="window.showConceptDemo('dicts')">Dictionaries</button>
        </div>

        <div class="interactive-demo-card">
          <!-- 1. CONDITIONS DEMO -->
          ${activeDemo === 'conditions' ? `
            <div>
              <h3 style="font-size: 1.3rem; margin-bottom: 0.5rem;">Conditional Branching (If / Elif / Else)</h3>
              <p style="color: var(--text-secondary); margin-bottom: 1.5rem; font-size: 0.9rem;">
                Adjust the student score slider to see which condition evaluates to <code>True</code> and which code block executes.
              </p>

              <div style="margin-bottom: 1.5rem;">
                <label style="font-weight: 700; display: block; margin-bottom: 0.5rem;">
                  Score: <span id="demo-score-val" style="color: var(--primary-blue); font-size: 1.25rem;">85</span>
                </label>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value="85" 
                  id="demo-score-slider" 
                  style="width: 100%; max-width: 400px;" 
                  oninput="window.updateConditionsDemo(this.value)"
                />
              </div>

              <!-- Interactive Code Block -->
              <pre class="interactive-code-block" id="demo-conditions-code">
score = <span id="code-score-var">85</span>

<span id="branch-a" class="code-branch">if score >= 90:
    grade = "A"   # Excellent</span>
<span id="branch-b" class="code-branch active-branch">elif score >= 80:
    grade = "B"   # Very Good (Active Branch)</span>
<span id="branch-c" class="code-branch">elif score >= 50:
    grade = "C"   # Pass</span>
<span id="branch-d" class="code-branch">else:
    grade = "F"   # Needs improvement</span>
              </pre>

              <div id="demo-conditions-result" class="demo-result-callout" style="background: var(--blue-light); border-left: 4px solid var(--primary-blue);">
                <strong>Result:</strong> Condition <code>score >= 80</code> is True. <code>grade = "B"</code> was assigned.
              </div>
            </div>
          ` : ''}

          <!-- 2. LOOPS DEMO -->
          ${activeDemo === 'loops' ? `
            <div>
              <h3 style="font-size: 1.3rem; margin-bottom: 0.5rem;">For Loops & range(start, stop, step)</h3>
              <p style="color: var(--text-secondary); margin-bottom: 1.5rem; font-size: 0.9rem;">
                Change range parameters and click "Step Forward" to watch the loop counter advance one iteration at a time.
              </p>

              <div style="display: flex; gap: 1rem; margin-bottom: 1.5rem; flex-wrap: wrap; align-items: center;">
                <div>
                  <label style="font-size: 0.8rem; font-weight: 700; color: var(--text-muted);">Start</label>
                  <input type="number" id="demo-loop-start" value="1" style="width: 70px; padding: 0.4rem; border-radius: var(--radius-sm); border: 1px solid var(--border-color);" onchange="window.resetLoopsDemo()"/>
                </div>
                <div>
                  <label style="font-size: 0.8rem; font-weight: 700; color: var(--text-muted);">Stop (Exclusive)</label>
                  <input type="number" id="demo-loop-stop" value="6" style="width: 70px; padding: 0.4rem; border-radius: var(--radius-sm); border: 1px solid var(--border-color);" onchange="window.resetLoopsDemo()"/>
                </div>
                <div>
                  <label style="font-size: 0.8rem; font-weight: 700; color: var(--text-muted);">Step</label>
                  <input type="number" id="demo-loop-step" value="1" style="width: 70px; padding: 0.4rem; border-radius: var(--radius-sm); border: 1px solid var(--border-color);" onchange="window.resetLoopsDemo()"/>
                </div>
                <div style="margin-top: 1rem;">
                  <button class="btn btn-primary btn-sm" onclick="window.stepLoopDemo()">Step Forward ⏩</button>
                  <button class="btn btn-secondary btn-sm" onclick="window.resetLoopsDemo()">Reset Loop 🔄</button>
                </div>
              </div>

              <div id="demo-loop-tape" class="loop-visual-tape" style="display: flex; gap: 0.5rem; margin-bottom: 1.25rem;">
                <!-- Generated by JS -->
              </div>

              <div id="demo-loop-output" class="demo-result-callout" style="background: var(--mint-accent); border-left: 4px solid var(--mint-accent-dark);">
                Printed Output so far: <code>[]</code>
              </div>
            </div>
          ` : ''}

          <!-- 3. STRING SLICING DEMO -->
          ${activeDemo === 'strings' ? `
            <div>
              <h3 style="font-size: 1.3rem; margin-bottom: 0.5rem;">String Slicing Visualizer [start:stop:step]</h3>
              <p style="color: var(--text-secondary); margin-bottom: 1.5rem; font-size: 0.9rem;">
                Understand how Python indices work! Positive indices count from 0, negative indices count backwards from -1.
              </p>

              <div style="margin-bottom: 1.25rem;">
                <label style="font-size: 0.85rem; font-weight: 700; display: block; margin-bottom: 0.35rem;">Sample String:</label>
                <input type="text" id="demo-slice-text" value="PythonAcademy" class="qb-search-input" style="max-width: 300px; margin: 0;" oninput="window.updateSliceDemo()"/>
              </div>

              <div style="display: flex; gap: 1rem; margin-bottom: 1.5rem; flex-wrap: wrap;">
                <div>
                  <label style="font-size: 0.8rem; font-weight: 700; color: var(--text-muted);">Start Index</label>
                  <input type="number" id="demo-slice-start" value="0" style="width: 70px; padding: 0.4rem; border-radius: var(--radius-sm); border: 1px solid var(--border-color);" onchange="window.updateSliceDemo()"/>
                </div>
                <div>
                  <label style="font-size: 0.8rem; font-weight: 700; color: var(--text-muted);">Stop Index</label>
                  <input type="number" id="demo-slice-stop" value="6" style="width: 70px; padding: 0.4rem; border-radius: var(--radius-sm); border: 1px solid var(--border-color);" onchange="window.updateSliceDemo()"/>
                </div>
                <div>
                  <label style="font-size: 0.8rem; font-weight: 700; color: var(--text-muted);">Step</label>
                  <input type="number" id="demo-slice-step" value="1" style="width: 70px; padding: 0.4rem; border-radius: var(--radius-sm); border: 1px solid var(--border-color);" onchange="window.updateSliceDemo()"/>
                </div>
              </div>

              <!-- Character Boxes Grid -->
              <div id="demo-slice-tape" class="slice-char-tape" style="margin-bottom: 1.5rem;"></div>

              <div id="demo-slice-result" class="demo-result-callout" style="background: var(--peach-soft); border-left: 4px solid var(--coral-deep);">
                <strong>Extracted Slice:</strong> <code>text[0:6:1] => "Python"</code>
              </div>
            </div>
          ` : ''}

          <!-- 4. LIST OPERATIONS DEMO -->
          ${activeDemo === 'lists' ? `
            <div>
              <h3 style="font-size: 1.3rem; margin-bottom: 0.5rem;">List Operations Playground</h3>
              <p style="color: var(--text-secondary); margin-bottom: 1.5rem; font-size: 0.9rem;">
                Manipulate a list in real-time. Notice how <code>append</code> adds to the end, <code>pop</code> removes the last element, and <code>sort</code> reorganizes items.
              </p>

              <div style="display: flex; gap: 0.5rem; margin-bottom: 1.5rem; flex-wrap: wrap;">
                <button class="btn btn-secondary btn-sm" onclick="window.demoListOp('append', Math.floor(Math.random() * 90 + 10))">+ append(num)</button>
                <button class="btn btn-secondary btn-sm" onclick="window.demoListOp('pop')">- pop()</button>
                <button class="btn btn-secondary btn-sm" onclick="window.demoListOp('sort')">.sort()</button>
                <button class="btn btn-secondary btn-sm" onclick="window.demoListOp('reverse')">.reverse()</button>
                <button class="btn btn-secondary btn-sm" onclick="window.demoListOp('reset')">Reset List</button>
              </div>

              <div id="demo-list-items" class="list-visual-row" style="margin-bottom: 1.25rem;">
                <!-- Filled dynamically -->
              </div>

              <div id="demo-list-status" class="demo-result-callout" style="background: var(--blue-light); border-left: 4px solid var(--primary-blue);">
                Current List Length: <code>4</code> | Expression: <code>numbers = [10, 20, 30, 40]</code>
              </div>
            </div>
          ` : ''}

          <!-- 5. DICTIONARIES DEMO -->
          ${activeDemo === 'dicts' ? `
            <div>
              <h3 style="font-size: 1.3rem; margin-bottom: 0.5rem;">Dictionary Key-Value Mapping</h3>
              <p style="color: var(--text-secondary); margin-bottom: 1.5rem; font-size: 0.9rem;">
                Dictionaries store associations between unique keys and values. Try adding an entry or searching by key.
              </p>

              <div style="display: flex; gap: 0.75rem; margin-bottom: 1.5rem; flex-wrap: wrap; align-items: center;">
                <input type="text" id="demo-dict-key" placeholder="Key (e.g. 'role')" style="padding: 0.4rem; border-radius: var(--radius-sm); border: 1px solid var(--border-color); width: 140px;"/>
                <input type="text" id="demo-dict-val" placeholder="Value (e.g. 'Admin')" style="padding: 0.4rem; border-radius: var(--radius-sm); border: 1px solid var(--border-color); width: 140px;"/>
                <button class="btn btn-primary btn-sm" onclick="window.demoDictSet()">Set Key-Value</button>
                <button class="btn btn-secondary btn-sm" onclick="window.demoDictReset()">Reset</button>
              </div>

              <div id="demo-dict-cards" class="dict-visual-cards" style="display: flex; gap: 0.75rem; flex-wrap: wrap; margin-bottom: 1.5rem;">
                <!-- Populated dynamically -->
              </div>

              <div id="demo-dict-result" class="demo-result-callout" style="background: var(--mint-accent); border-left: 4px solid var(--mint-accent-dark);">
                Current Dictionary: <code>{'name': 'Alice', 'score': 95, 'level': 3}</code>
              </div>
            </div>
          ` : ''}
        </div>

        ${UI.renderCertificateSection()}
        <!-- /CERTIFICATE -->

      </div>
    `;
  },

  // ==========================================
  // 9. LEARN PYTHON REFERENCE HUB
  // ==========================================
  renderLearn() {
    return `
      <div class="container section-py">
        <div class="section-header">
          <span class="section-tag">Reference Guide</span>
          <h2 class="section-title">Python Syntax Cheat Sheet & Reference Guide</h2>
          <p class="section-desc">
            Essential Python 3 syntax, code patterns, and tips tailored for all 7 practice academy levels (Challenges 1 to 72).
          </p>
        </div>

        <div style="display: flex; justify-content: flex-end; margin-bottom: 1.5rem; gap: 0.75rem; flex-wrap: wrap;">
          <button class="btn btn-secondary" onclick="window.navigateTo('question-bank')">
            Browse All 72 Challenges →
          </button>
          <button class="btn btn-primary" onclick="window.navigateTo('demos')">
            ⚡ Open Interactive Concept Demos →
          </button>
        </div>

        <div style="display: grid; gap: 2rem;">
          <!-- Level 1 Reference -->
          <div class="feature-box">
            <span class="level-badge level-badge-1" style="margin-bottom: 0.75rem;">Level 1 Reference</span>
            <h3 style="font-size: 1.35rem; margin-bottom: 0.5rem;">Variables, Data Types & Standard I/O</h3>
            <p style="color: var(--text-secondary); margin-bottom: 1rem;">
              Python uses dynamic typing. Use <code>print()</code> for stdout and <code>input()</code> to read text. Convert text to numbers using <code>int()</code> or <code>float()</code>.
            </p>
            <pre class="io-code-block"># Printing and formatted strings (f-strings)
name = input("Enter name: ")
age = int(input("Enter age: "))
print(f"Hello {name}, in 5 years you will be {age + 5}!")

# Safe division check
a, b = 10, 0
quotient = a / b if b != 0 else "Cannot divide by zero"</pre>
          </div>

          <!-- Level 2 Reference -->
          <div class="feature-box">
            <span class="level-badge level-badge-2" style="margin-bottom: 0.75rem;">Level 2 Reference</span>
            <h3 style="font-size: 1.35rem; margin-bottom: 0.5rem;">Conditions and Boolean Logic</h3>
            <p style="color: var(--text-secondary); margin-bottom: 1rem;">
              Use <code>if</code>, <code>elif</code>, and <code>else</code> blocks. Combine logical statements using <code>and</code>, <code>or</code>, and <code>not</code>.
            </p>
            <pre class="io-code-block">marks = 85
if marks >= 90:
    grade = "A"
elif marks >= 80:
    grade = "B"
elif marks >= 35:
    grade = "Pass"
else:
    grade = "Fail"</pre>
          </div>

          <!-- Level 3 Reference -->
          <div class="feature-box">
            <span class="level-badge level-badge-3" style="margin-bottom: 0.75rem;">Level 3 Reference</span>
            <h3 style="font-size: 1.35rem; margin-bottom: 0.5rem;">Loops and Iteration</h3>
            <p style="color: var(--text-secondary); margin-bottom: 1rem;">
              Iterate over numbers using <code>range(start, stop, step)</code>. Use <code>while</code> loops for condition-controlled iteration.
            </p>
            <pre class="io-code-block"># Loop from 1 to 10
for i in range(1, 11):
    print(i)

# Countdown from 10 to 1
for i in range(10, 0, -1):
    print(i)</pre>
          </div>

          <!-- Level 4 Reference -->
          <div class="feature-box">
            <span class="level-badge level-badge-4" style="margin-bottom: 0.75rem;">Level 4 Reference</span>
            <h3 style="font-size: 1.35rem; margin-bottom: 0.5rem;">Strings & List Operations</h3>
            <p style="color: var(--text-secondary); margin-bottom: 1rem;">
              Slice strings using <code>text[start:end:step]</code>. Lists support <code>append()</code>, <code>sort()</code>, <code>len()</code>, and comprehensions.
            </p>
            <pre class="io-code-block"># Reversing strings and checking palindromes
word = "radar"
is_palindrome = word == word[::-1]

# List operations
numbers = [4, 1, 9, 3]
numbers.sort()                     # [1, 3, 4, 9]
total = sum(numbers)               # 17</pre>
          </div>

          <!-- Level 5 Reference -->
          <div class="feature-box">
            <span class="level-badge level-badge-5" style="margin-bottom: 0.75rem;">Level 5 Reference</span>
            <h3 style="font-size: 1.35rem; margin-bottom: 0.5rem;">Mini Projects & Problem Solving</h3>
            <p style="color: var(--text-secondary); margin-bottom: 1rem;">
              Build miniature interactive applications combining loops, input validation, running state, and list accumulation.
            </p>
            <pre class="io-code-block"># Command loop with state tracking
tasks = []
while True:
    cmd = input("Action (add/list/exit): ").strip().lower()
    if cmd == "exit":
        break
    elif cmd == "list":
        for i, t in enumerate(tasks, 1):
            print(f"{i}. {t}")
    elif cmd.startswith("add "):
        tasks.append(cmd[4:].strip())
        print("Task recorded")</pre>
          </div>

          <!-- Level 6 Reference (Functions & Dictionaries) -->
          <div class="feature-box">
            <span class="level-badge level-badge-6" style="margin-bottom: 0.75rem;">Level 6 Reference</span>
            <h3 style="font-size: 1.35rem; margin-bottom: 0.5rem;">Functions, Dictionaries, Tuples & Sets</h3>
            <p style="color: var(--text-secondary); margin-bottom: 1rem;">
              Functions modularize logic with <code>def</code> and <code>return</code>. Dictionaries map keys to values. Sets enforce uniqueness. Tuples group immutable data.
            </p>
            <pre class="io-code-block"># Reusable function
def calculate_area(w, h):
    return w * h

# Dictionary mapping
prices = {"apple": 2.5, "banana": 1.2}
print(prices.get("apple", 0))

# Set deduplication
unique_items = set([1, 2, 2, 3])  # {1, 2, 3}</pre>
          </div>

          <!-- Level 7 Reference (Exceptions & Classes) -->
          <div class="feature-box">
            <span class="level-badge level-badge-7" style="margin-bottom: 0.75rem;">Level 7 Reference</span>
            <h3 style="font-size: 1.35rem; margin-bottom: 0.5rem;">Exceptions, Files & Object-Oriented Classes</h3>
            <p style="color: var(--text-secondary); margin-bottom: 1rem;">
              Catch exceptions using <code>try-except</code> blocks. Define classes using <code>class</code> and initialize instance attributes via <code>__init__</code>.
            </p>
            <pre class="io-code-block"># Safe error handling
try:
    num = int(input())
    result = 100 / num
except (ValueError, ZeroDivisionError) as e:
    result = "Invalid input or division by zero"

# Class definition
class Student:
    def __init__(self, name):
        self.name = name
        self.grades = []
    
    def add_grade(self, g):
        self.grades.append(g)</pre>
          </div>
        </div>

        ${UI.renderCertificateSection()}
        <!-- /CERTIFICATE -->

      </div>
    `;
  },

  // ==========================================
  // GLOSSARY PAGE
  // ==========================================
  renderGlossary() {
    const glossary = window.GLOSSARY_DATA || [];
    return `
      <div class="container section-py">
        <div class="section-header">
          <span class="section-tag">Beginner Glossary</span>
          <h2 class="section-title">Python Terms Explained</h2>
          <p class="section-desc">
            Plain-language definitions for common Python words. Click any term for examples and related challenges.
          </p>
        </div>
        <div style="display: grid; gap: 1rem;">
          ${glossary.map(g => `
            <div class="feature-box" style="cursor: pointer;" onclick="window.openGlossaryModal('${g.id}')">
              <h3 style="font-size: 1.15rem; margin-bottom: 0.35rem; color: var(--text-main);">${g.term}</h3>
              <p style="color: var(--text-secondary); font-size: 0.875rem; line-height: 1.5;">${g.definition}</p>
              <div style="margin-top: 0.5rem; font-size: 0.75rem; color: var(--text-muted);">
                Related challenges: ${(g.relatedQuestions || []).map(id => `#${id}`).join(", ")}
              </div>
            </div>
          `).join("")}
        </div>

        ${UI.renderCertificateSection()}
        <!-- /CERTIFICATE -->

      </div>
    `;
  },

  // ==========================================
  // 10. PROGRESS DASHBOARD & ANALYTICS
  // ==========================================
  renderProgress() {
    const questions = window.QUESTIONS_DATA || [];
    const totalQ = questions.length || 72;
    const completed = window.store.state.completedQuestions;
    const score = completed.length;
    const pct = Math.round((score / totalQ) * 100);
    const attempts = window.store.state.attempts || [];
    const bookmarks = window.store.getBookmarks();
    const badges = window.store.getEarnedBadges ? window.store.getEarnedBadges() : [];
    const earnedCount = badges.filter(b => b.earned).length;
    const recommendation = window.store.getPersonalizedRecommendation ? window.store.getPersonalizedRecommendation() : null;
    const isEligible = window.store.isCertificateEligible ? window.store.isCertificateEligible() : (score >= totalQ);
    const cert = window.store.getCertificate ? window.store.getCertificate() : null;
    const streakInfo = window.store.getStreakInfo ? window.store.getStreakInfo() : { current: 0, longest: 0, explanation: "" };

    // Level breakdown
    const levels = [
      { lvl: 1, name: "Variables & Maths" },
      { lvl: 2, name: "Conditions & Logic" },
      { lvl: 3, name: "Loops & Repetition" },
      { lvl: 4, name: "Strings & Lists" },
      { lvl: 5, name: "Mini Projects" },
      { lvl: 6, name: "Functions & Dicts" },
      { lvl: 7, name: "Exceptions & Classes" }
    ];

    const levelRows = levels.map(l => {
      const qInLevel = questions.filter(q => q.level === l.lvl);
      const solvedInLevel = qInLevel.filter(q => window.store.isQuestionComplete(q.id)).length;
      return {
        level: l.lvl,
        name: l.name,
        total: qInLevel.length || 10,
        solved: solvedInLevel,
        pct: qInLevel.length > 0 ? Math.round((solvedInLevel / qInLevel.length) * 100) : 0
      };
    });

    // Identify Weakest Topics for extra practice
    const topicStats = levels.map(l => {
      const qInLevel = new Set(questions.filter(q => q.level === l.lvl).map(q => q.id));
      const attemptsInLvl = attempts.filter(a => qInLevel.has(a.questionId));
      const passedInLvl = attemptsInLvl.filter(a => a.passed).length;
      const accuracy = attemptsInLvl.length > 0 ? Math.round((passedInLvl / attemptsInLvl.length) * 100) : 100;
      return {
        level: l.lvl,
        name: l.name,
        attemptsCount: attemptsInLvl.length,
        accuracy
      };
    }).filter(t => t.attemptsCount >= 2 && t.accuracy < 80);

    return `
      <div class="container section-py">
        <!-- Dashboard Hero Card -->
        <div class="progress-hero-card">
          <div class="progress-ring-container">
            <svg width="170" height="170" viewBox="0 0 170 170" style="transform: rotate(-90deg);">
              <circle cx="85" cy="85" r="70" stroke="#F2E3D9" stroke-width="12" fill="none"/>
              <circle cx="85" cy="85" r="70" stroke="url(#blue-grad)" stroke-width="12" fill="none"
                stroke-dasharray="439.8"
                stroke-dashoffset="${439.8 - (439.8 * pct) / 100}"
                stroke-linecap="round"
                style="transition: stroke-dashoffset 0.8s ease;"
              />
              <defs>
                <linearGradient id="blue-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#FF9278"/>
                  <stop offset="100%" stop-color="#2563EB"/>
                </linearGradient>
              </defs>
            </svg>
            <div class="progress-ring-text">
              <div class="progress-ring-percent">${pct}%</div>
              <div class="progress-ring-sub">Completed</div>
            </div>
          </div>

          <div>
            <h2 style="font-size: 1.75rem; margin-bottom: 0.5rem;">Your Python Mastery Journey</h2>
            <p style="color: var(--text-secondary); margin-bottom: 1.25rem;">
              You have completed <strong>${score} out of ${totalQ}</strong> challenges. ${totalQ - score} challenges remaining to attain full mastery certification.
            </p>
            <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
              <button class="btn btn-primary" onclick="window.startPractice()">
                ${score === totalQ ? "Review Challenges" : "Resume Practicing"}
              </button>
              <button class="btn btn-secondary" onclick="window.exportProgressFile()">
                 📥 Export Backup (JSON)
               </button>
               <button class="btn btn-secondary" onclick="window.exportPracticeHistoryFile()">
                 📜 Export Practice History
               </button>
              <button class="btn btn-secondary" onclick="document.getElementById('import-file-input').click()">
                📤 Import Backup...
              </button>
              <input type="file" id="import-file-input" style="display: none;" accept=".json" onchange="window.handleImportFile(event)"/>
              <button class="btn btn-secondary" onclick="window.openCloudSyncModal()">
                ☁️ Cloud Sync Info
              </button>
              <button class="btn btn-ghost" onclick="window.confirmResetTest()">
                Reset Progress...
              </button>
            </div>
          </div>

          <div style="background: var(--mint-accent); padding: 1.25rem 1.75rem; border-radius: var(--radius-xl); text-align: center; border: 1px solid rgba(13, 148, 136, 0.15);">
            <div style="font-size: 2.25rem; font-weight: 800; color: #0D9488;">${streakInfo.current}</div>
            <div style="font-size: 0.8rem; color: #0D9488; font-weight: 700; text-transform: uppercase;">Current Streak</div>
            <div style="font-size: 0.75rem; color: #0D9488; margin-top: 0.25rem;">Longest: ${streakInfo.longest} days</div>
          </div>
          <div style="background: var(--mint-accent); padding: 1.25rem 1.75rem; border-radius: var(--radius-xl); text-align: center; border: 1px solid rgba(13, 148, 136, 0.15);">
            <div style="font-size: 2.25rem; font-weight: 800; color: #0D9488;">${score}</div>
            <div style="font-size: 0.8rem; color: #0D9488; font-weight: 700; text-transform: uppercase;">Points Earned</div>
          </div>
        </div>

        <!-- Personalized Recommendation Banner -->
        ${recommendation ? `
          <div class="recommendation-callout-box" style="margin-bottom: 2rem;">
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 1rem; flex-wrap: wrap;">
              <div>
                <span class="rec-badge">${recommendation.badge}</span>
                <h4 style="margin: 0.35rem 0 0.2rem; font-size: 1.1rem; color: var(--text-main);">
                  Suggested Next Challenge: #${recommendation.question.id} — ${recommendation.question.title}
                </h4>
                <p style="color: var(--text-secondary); font-size: 0.85rem; margin: 0; line-height: 1.45;">
                  ${recommendation.reason}
                </p>
              </div>
              <button class="btn btn-primary" onclick="window.startPractice(${recommendation.question.id})">
                ${recommendation.actionText}
              </button>
            </div>
          </div>
        ` : ''}

        <!-- Focus Areas / Weakest Topics -->
        ${topicStats.length > 0 ? `
          <div class="weakness-alert-card" style="margin-bottom: 2rem;">
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <span style="font-size: 1.5rem;">🎯</span>
              <div>
                <h4 style="margin: 0 0 0.2rem; color: #B45309;">Recommended Focus Area</h4>
                <p style="margin: 0; font-size: 0.85rem; color: var(--text-secondary);">
                  You encountered more repeated attempts in <strong>${topicStats.map(t => `${t.name} (${t.accuracy}% accuracy)`).join(", ")}</strong>. Reviewing these topics will boost your confidence!
                </p>
              </div>
            </div>
          </div>
        ` : ''}

        <!-- Achievements & Badges (12 Badges) -->
        <div style="margin-bottom: 2.5rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
            <div>
              <h3 style="font-size: 1.25rem; margin-bottom: 0.2rem;">Achievements & Milestones</h3>
              <p style="color: var(--text-secondary); font-size: 0.85rem; margin: 0;">Badges unlocked through real local practice progress.</p>
            </div>
            <span class="q-sidebar-score-pill" style="font-size: 0.8rem;">${earnedCount} of ${badges.length} Unlocked</span>
          </div>

          <div class="badges-grid">
            ${badges.map(b => `
              <div class="badge-card ${b.earned ? 'earned' : 'locked'}">
                <div class="badge-icon">${b.icon}</div>
                <div class="badge-title">${b.title}</div>
                <div class="badge-desc">${b.desc}</div>
                <div class="badge-footer">
                  ${b.earned 
                    ? '<span class="badge-earned-tag">✓ Unlocked</span>' 
                    : `<span class="badge-locked-tag">🔒 Locked ${b.progress ? `(${b.progress})` : ''}</span>`}
                </div>
              </div>
            `).join("")}
          </div>
        </div>

        <!-- Curriculum Level Progress -->
        <h3 style="font-size: 1.25rem; margin-bottom: 1.25rem;">Curriculum Level Progress</h3>
        <div class="dashboard-breakdown-grid" style="margin-bottom: 2.5rem;">
          ${levelRows.map(row => `
            <div class="level-card">
              <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                <span class="level-badge level-badge-${row.level}">Level ${row.level}</span>
                <span style="font-weight: 700; font-size: 0.85rem; color: var(--text-main);">${row.pct}%</span>
              </div>
              <div style="font-size: 1rem; font-weight: 700; margin-bottom: 0.75rem; color: var(--text-main);">${row.name}</div>
              <div class="progress-bar-bg" style="margin-bottom: 0.75rem;">
                <div class="progress-bar-fill" style="width: ${row.pct}%;"></div>
              </div>
              <div style="font-size: 0.8rem; color: var(--text-secondary);">${row.solved} of ${row.total} Completed</div>
            </div>
          `).join("")}
        </div>

        <!-- Recent Verification Attempts History -->
        <h3 style="font-size: 1.25rem; margin-bottom: 1.25rem;">Recent Verification History</h3>
        <div class="history-table-card">          ${attempts.length === 0 ? `
            <p style="color: var(--text-secondary); text-align: center; padding: 2.5rem 0;">No attempts recorded yet. Start solving questions to log your progress!</p>
          ` : `
            <table class="table-app">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Challenge</th>
                  <th>Result</th>
                  <th>Evaluation Detail</th>
                </tr>
              </thead>
              <tbody>
                ${attempts.slice(0, 15).map(att => {
                  const q = questions.find(item => item.id === att.questionId);
                  const dateStr = new Date(att.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' (' + new Date(att.timestamp).toLocaleDateString() + ')';
                  return `
                    <tr>
                      <td style="font-family: var(--font-mono); font-size: 0.8rem;">${dateStr}</td>
                      <td>
                        <button class="link-btn" onclick="window.startPractice(${att.questionId})">
                          <strong>#${att.questionId}</strong>: ${q ? q.title : 'Challenge'}
                        </button>
                      </td>
                      <td>
                        ${att.passed 
                          ? '<span style="color: #059669; font-weight: 700; background: var(--mint-accent); padding: 0.2rem 0.55rem; border-radius: var(--radius-full); font-size: 0.775rem;">✓ Passed</span>' 
                          : '<span style="color: #E11D48; font-weight: 700; background: #FFE4E6; padding: 0.2rem 0.55rem; border-radius: var(--radius-full); font-size: 0.775rem;">✗ Failed</span>'}
                      </td>
                      <td style="font-size: 0.8rem; color: var(--text-secondary); max-width: 250px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                        ${att.details || att.codeSnippet || ""}
                      </td>
                    </tr>
                  `;
                }).join("")}
              </tbody>
            </table>
          `}
        </div>

        ${UI.renderCertificateSection()}
        <!-- /CERTIFICATE -->

      </div>
    `;
  },

  // ==========================================
  // 11. RESULTS & CERTIFICATE PAGE
  // ==========================================
  renderResults() {
    const questions = window.QUESTIONS_DATA || [];
    const totalQ = questions.length || 72;
    const completed = window.store.state.completedQuestions;
    const score = completed.length;
    const pct = Math.round((score / totalQ) * 100);

    let masteryTitle = "Python Apprentice";
    if (score >= 65) masteryTitle = "Master Python Architect";
    else if (score >= 50) masteryTitle = "Senior Python Practitioner";
    else if (score >= 35) masteryTitle = "Intermediate Developer";
    else if (score >= 15) masteryTitle = "Junior Python Coder";

    return `
      <div class="container section-py">
        <div class="results-hero">
          <div class="results-badge-award">🏆</div>
          <h2 style="font-size: 2.25rem; margin-bottom: 0.5rem;">Academy Evaluation Complete!</h2>
          <div style="display: inline-block; padding: 0.35rem 1rem; border-radius: var(--radius-full); background: var(--pale-sky); color: var(--primary-blue); font-weight: 700; margin-bottom: 1.5rem;">
            Rank: ${masteryTitle}
          </div>
          <div style="font-size: 3.5rem; font-weight: 900; line-height: 1; margin-bottom: 0.5rem; color: var(--text-main);">
            ${score} <span style="font-size: 1.75rem; color: var(--text-secondary); font-weight: 600;">/ ${totalQ}</span>
          </div>
          <p style="font-size: 1.1rem; color: var(--text-secondary); max-width: 540px; margin: 0 auto 2rem;">
            You have solved ${score} challenges with an overall completion score of ${pct}%.
          </p>

          <div style="display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap;">
            <button class="btn btn-primary" onclick="window.navigateTo('question-bank')">
              Review Question Bank
            </button>
            <button class="btn btn-secondary" onclick="window.navigateTo('mistakes')">
              Review Mistakes
            </button>
            <button class="btn btn-secondary" onclick="window.confirmResetTest()">
              Practice Again (Reset Test)
            </button>
          </div>
        </div>

        ${UI.renderCertificateSection()}
        <!-- /CERTIFICATE -->

      </div>
    `;
  },

  renderCertificateSection() {
    const questions = window.QUESTIONS_DATA || [];
    const totalQ = questions.length || 72;
    const score = (window.store && window.store.state && Array.isArray(window.store.state.completedQuestions)) ? window.store.state.completedQuestions.length : 0;
    const pct = Math.round((score / totalQ) * 100);
    const isEligible = window.store && typeof window.store.isCertificateEligible === "function" ? window.store.isCertificateEligible() : (score >= totalQ);
    const cert = window.store && typeof window.store.getCertificate === "function" ? window.store.getCertificate() : null;
    return `
        <section aria-labelledby="cert-section-heading" style="margin-top: 3rem;">
          <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.25rem;">
            <span style="font-size: 1.75rem;" aria-hidden="true">🎓</span>
            <div>
              <h3 id="cert-section-heading" style="font-size: 1.25rem; margin: 0 0 0.15rem;">Certificate of Completion</h3>
              <p style="color: var(--text-secondary); font-size: 0.82rem; margin: 0;">
                Earn your personal certificate by completing all ${totalQ} challenges.
              </p>
            </div>
          </div>

          ${!isEligible ? `
            <div class="cert-locked-card" role="status" aria-live="polite">
              <div class="cert-lock-icon" aria-hidden="true">🔒</div>
              <h4 class="cert-locked-title">Certificate Locked</h4>
              <p class="cert-locked-desc">
                You have completed <strong>${score} of ${totalQ}</strong> challenges.
                <strong>${totalQ - score} more challenge${totalQ - score === 1 ? '' : 's'}</strong> to go before your certificate is unlocked.
              </p>
              <div class="cert-progress-bar-wrap" aria-label="Progress: ${score} of ${totalQ} challenges">
                <div class="cert-progress-bar-fill" style="width: ${pct}%;"></div>
              </div>
              <p class="cert-progress-label">${pct}% complete — keep going!</p>
              <button class="btn btn-primary" onclick="window.startPractice()" style="margin-top: 1rem;">
                Continue Practicing →
              </button>
            </div>
          ` : cert ? `
            <div class="cert-issued-card">
              <div class="cert-issued-header">
                <span aria-hidden="true" style="font-size: 2rem;">🏆</span>
                <div>
                  <h4 style="margin: 0 0 0.2rem; color: #1E3A8A;">Certificate Ready!</h4>
                  <p style="margin: 0; font-size: 0.85rem; color: var(--text-secondary);">
                    Issued on ${new Date(cert.issuedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                </div>
              </div>
              <div class="cert-preview-card" aria-label="Certificate preview for ${UI.escapeHtml(cert.name)}">
                <div class="cert-preview-watermark" aria-hidden="true">🐍</div>
                <div class="cert-preview-badge" aria-hidden="true">🏆</div>
                <div class="cert-preview-label">Certificate of Completion</div>
                <div class="cert-preview-title">Python Practice Academy</div>
                <div class="cert-preview-presented">This certificate is presented to</div>
                <div class="cert-preview-name">${UI.escapeHtml(cert.name)}</div>
                <div class="cert-preview-divider"></div>
                <p class="cert-preview-body">
                  for successfully completing all <strong>${totalQ} Python programming challenges</strong>
                  across all seven levels of the academy curriculum.
                </p>
                <div class="cert-preview-date">Issued: ${new Date(cert.issuedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</div>
              </div>
              <div class="cert-issued-actions">
                <button class="btn btn-primary" onclick="window.printCertificate()" aria-label="Print or save certificate as PDF">
                  🖨️ Print / Save as PDF
                </button>
                <button class="btn btn-secondary" onclick="window.showEditCertForm()" aria-label="Edit certificate details">
                  ✏️ Edit Details
                </button>
                <button class="btn btn-ghost" onclick="window.confirmClearCertificate()" aria-label="Clear saved certificate details">
                  🗑 Clear Details
                </button>
              </div>
            </div>
            <div id="cert-edit-form-wrap" style="display: none; margin-top: 1.5rem;">
              ${UI._renderCertForm(cert.name, cert.email, cert.phone)}
            </div>
          ` : `
            <div class="cert-eligible-card">
              <div class="cert-eligible-header">
                <span aria-hidden="true" style="font-size: 1.75rem;">🎉</span>
                <div>
                  <h4 style="margin: 0 0 0.2rem; color: #065F46;">All ${totalQ} Challenges Completed!</h4>
                  <p style="margin: 0; font-size: 0.85rem; color: var(--text-secondary);">
                    You have earned your certificate. Enter your name below to generate it.
                  </p>
                </div>
              </div>
              ${UI._renderCertForm("", "", "")}
            </div>
          `}
        </section>
    `;
  }
};

if (typeof window !== "undefined") {
  window.UI = UI;
  window.escapeHtml = UI.escapeHtml.bind(UI);
  window.renderTestWorkspace = UI.renderTestWorkspace.bind(UI);
  window.renderQuestionSidebar = UI.renderQuestionSidebar.bind(UI);
}
