/**
 * PYTHON PRACTICE ACADEMY — ENHANCED TEST ENGINE CONTROLLER
 * Coordinates state, code execution, scoring, rich test feedback, bookmarks, notes, and question navigation.
 */

class TestEngine {
  constructor() {
    this.currentQuestion = null;
    this.isSubmitting = false;
    this.revealedHints = {}; // { [questionId]: number }
  }

  getTotalQuestions() {
    return (window.QUESTIONS_DATA && window.QUESTIONS_DATA.length) || 72;
  }

  init(questionId = null) {
    const targetId = questionId || window.store.state.currentQuestionId || 1;
    this.loadQuestion(targetId);
  }

  loadQuestion(questionId) {
    const q = (window.QUESTIONS_DATA || []).find(item => item.id === questionId);
    if (!q) {
      console.error(`Question ID ${questionId} not found.`);
      return;
    }

    // Save current draft before switching questions
    if (this.currentQuestion && this.currentQuestion.id !== questionId) {
      const existingCode = this.getCurrentCode();
      if (existingCode !== null && existingCode !== undefined) {
        window.store.saveQuestionDraft(this.currentQuestion.id, existingCode);
      }
    }

    this.currentQuestion = q;
    window.store.setCurrentQuestion(questionId);

    // Update URL hash without causing a page jump
    if (window.location.hash !== `#test/${questionId}`) {
      try {
        history.replaceState(null, "", `#test/${questionId}`);
      } catch (e) {
        window.location.hash = `#test/${questionId}`;
      }
    }

    // Render test view via UI module
    if (window.UI && typeof window.UI.renderTestWorkspace === "function") {
      window.UI.renderTestWorkspace(this.currentQuestion);
    } else if (typeof window.renderTestWorkspace === "function") {
      window.renderTestWorkspace(this.currentQuestion);
    }

    // Apply editor preferences
    if (window.store && typeof window.store.applyPreferencesToDom === "function") {
      window.store.applyPreferencesToDom();
    }

    // Setup line numbers and syntax highlighting
    this.updateLineNumbers();
    if (typeof window.updateSyntaxHighlighting === "function") {
      window.updateSyntaxHighlighting();
    }

    // Update AI Tutor context if open
    if (window.aiTutor && typeof window.aiTutor.updateContextPill === "function") {
      window.aiTutor.updateContextPill();
    }

    // Render progressive hints for current question
    this.renderHintsUI();
  }

  getCurrentCode() {
    const textarea = document.getElementById("code-editor-textarea");
    return textarea ? textarea.value : "";
  }

  setCurrentCode(code) {
    const textarea = document.getElementById("code-editor-textarea");
    if (textarea) {
      textarea.value = code;
      this.updateLineNumbers();
      if (typeof window.updateSyntaxHighlighting === "function") {
        window.updateSyntaxHighlighting();
      }
      if (this.currentQuestion) {
        window.store.saveQuestionDraft(this.currentQuestion.id, code);
      }
    }
  }

  updateLineNumbers() {
    const textarea = document.getElementById("code-editor-textarea");
    const lineNumbers = document.getElementById("editor-line-numbers");
    if (!textarea || !lineNumbers) return;

    const linesCount = textarea.value.split("\n").length;
    let numbersHtml = "";
    for (let i = 1; i <= Math.max(linesCount, 12); i++) {
      numbersHtml += `<div>${i}</div>`;
    }
    lineNumbers.innerHTML = numbersHtml;
  }

  /**
   * Run user code in isolated Python sandbox against sample inputs.
   * Does NOT award points and does NOT advance question.
   */
  async runCodeOnly() {
    if (!this.currentQuestion) return;
    const code = this.getCurrentCode();
    window.store.saveQuestionDraft(this.currentQuestion.id, code);

    const terminalStdout = document.getElementById("terminal-stdout");
    const feedbackBox = document.getElementById("feedback-container");

    if (terminalStdout) {
      terminalStdout.innerHTML = "<span style='color: #38BDF8;'>▶ Executing solution.py in real Python 3 environment...</span>";
    }

    // Use sample input for this challenge if available
    const sampleInputTokens = (this.currentQuestion.testCases && this.currentQuestion.testCases[0])
      ? this.currentQuestion.testCases[0].input || []
      : [];

    const startTime = performance.now();
    const { stdout, error, friendlyError } = await window.runner.runOnce(code, sampleInputTokens, { echoInput: true });
    const durationMs = Math.round(performance.now() - startTime);

    if (terminalStdout) {
      if (error) {
        if (typeof window.announceToScreenReader === "function") {
          window.announceToScreenReader(`Code execution error: ${friendlyError ? friendlyError.title : error}`, true);
        }
        let errHtml = `<span style="color: #F87171; font-weight: 600;">Traceback (most recent call last):</span>\n`;
        errHtml += `<span style="color: #FCA5A5;">${this.escapeHtml(error)}</span>\n\n`;
        if (friendlyError) {
          errHtml += `<span style="color: #FBBF24;">💡 Beginner Help (${this.escapeHtml(friendlyError.title)}):</span>\n`;
          errHtml += `<span style="color: #E2E8F0;">${this.escapeHtml(friendlyError.message)}</span>\n`;
          errHtml += `<span style="color: #93C5FD; margin-top: 0.25rem; display: block;">👉 Next Step: ${this.escapeHtml(friendlyError.tip)}</span>`;
        }
        terminalStdout.innerHTML = errHtml;
      } else {
        if (typeof window.announceToScreenReader === "function") {
          window.announceToScreenReader("Code executed successfully against sample inputs.");
        }
        const inputNotice = sampleInputTokens.length > 0 
          ? `[Sample Input Used: ${sampleInputTokens.map(s => JSON.stringify(s)).join(", ")}]\n[💡 How input() works: Each time your code calls input(), it reads the next value sequentially]\n\n`
          : "[No input required for this challenge]\n\n";
        const cleanOut = stdout ? this.escapeHtml(stdout) : "[Program finished successfully with no printed output. Use print() to display output]";
        terminalStdout.innerHTML = `<span style="color: #94A3B8;">${inputNotice}</span>${cleanOut}\n\n<span style="color: #34D399; font-size: 0.8rem;">----------------------------------------\nExecution finished in ${durationMs}ms with exit code 0.</span>`;
      }
    }

    if (feedbackBox) {
      feedbackBox.innerHTML = `
        <div class="feedback-box feedback-info">
          <strong>Sandbox Execution Finished (Not Graded)</strong>
          <span>Your code was executed against sample inputs without grading. Use <strong>Try Your Own Input</strong> to test custom values, or click <strong>Submit Answer</strong> when you are ready to evaluate all test cases.</span>
        </div>
      `;
    }
  }

  /**
   * Run user code with custom values they enter themselves.
   * Completely separate from grading — does NOT change test results or score.
   */
  async runWithCustomInput() {
    if (!this.currentQuestion) return;
    const inputArea = document.getElementById("custom-input-textarea");
    const rawInputText = inputArea ? inputArea.value : "";
    const code = this.getCurrentCode();
    window.store.saveQuestionDraft(this.currentQuestion.id, code);

    // Split custom inputs line by line (empty lines trimmed)
    const customTokens = rawInputText.split(/\r?\n/).map(line => line.trim()).filter(line => line.length > 0);

    const terminalStdout = document.getElementById("terminal-stdout");
    const feedbackBox = document.getElementById("feedback-container");

    if (terminalStdout) {
      terminalStdout.innerHTML = "<span style='color: #A855F7;'>▶ Executing solution.py with your custom inputs...</span>";
    }

    const startTime = performance.now();
    const { stdout, error, friendlyError } = await window.runner.runOnce(code, customTokens, { echoInput: true });
    const durationMs = Math.round(performance.now() - startTime);

    if (terminalStdout) {
      let banner = `<span style="color: #C084FC; font-weight: 700;">==================================================\nTRY YOUR OWN INPUT (Interactive Sandbox — Not Graded)\n==================================================</span>\n`;
      banner += `<span style="color: #94A3B8;">Entered inputs (${customTokens.length}): ${customTokens.length > 0 ? customTokens.map(s => JSON.stringify(s)).join(", ") : "None"}</span>\n\n`;

      if (error) {
        if (typeof window.announceToScreenReader === "function") {
          window.announceToScreenReader(`Custom input execution error: ${friendlyError ? friendlyError.title : error}`, true);
        }
        let errHtml = banner + `<span style="color: #F87171; font-weight: 600;">Traceback (most recent call last):</span>\n`;
        errHtml += `<span style="color: #FCA5A5;">${this.escapeHtml(error)}</span>\n\n`;
        if (friendlyError) {
          errHtml += `<span style="color: #FBBF24;">💡 Beginner Help (${this.escapeHtml(friendlyError.title)}):</span>\n`;
          errHtml += `<span style="color: #E2E8F0;">${this.escapeHtml(friendlyError.message)}</span>\n`;
          errHtml += `<span style="color: #93C5FD; margin-top: 0.25rem; display: block;">👉 Next Step: ${this.escapeHtml(friendlyError.tip)}</span>`;
        }
        terminalStdout.innerHTML = errHtml;
      } else {
        if (typeof window.announceToScreenReader === "function") {
          window.announceToScreenReader("Custom input code executed successfully.");
        }
        const cleanOut = stdout ? this.escapeHtml(stdout) : "[Program finished with no printed output]";
        terminalStdout.innerHTML = `${banner}${cleanOut}\n\n<span style="color: #34D399; font-size: 0.8rem;">----------------------------------------\nExecution finished in ${durationMs}ms (Status: Ungraded experimentation).</span>`;
      }
    }

    if (feedbackBox) {
      feedbackBox.innerHTML = `
        <div class="feedback-box feedback-info" style="border-left-color: #A855F7;">
          <strong style="color: #9333EA;">Try Your Own Input Run Complete</strong>
          <span>This run used the inputs you typed in the custom input drawer. Because this is your private sandbox, your challenge progress and scores remain unchanged. Click <strong>Submit Answer</strong> when ready for evaluation.</span>
        </div>
      `;
    }
  }

  toggleCustomInputDrawer() {
    const drawer = document.getElementById("custom-input-drawer");
    if (!drawer) return;
    const isHidden = drawer.style.display === "none" || !drawer.style.display;
    drawer.style.display = isHidden ? "block" : "none";
    if (isHidden) {
      const textarea = document.getElementById("custom-input-textarea");
      if (textarea) textarea.focus();
    }
  }

  revealNextHint() {
    if (!this.currentQuestion) return;
    const hints = Array.isArray(this.currentQuestion.hints) 
      ? this.currentQuestion.hints 
      : (this.currentQuestion.hint ? [this.currentQuestion.hint] : []);

    const qId = this.currentQuestion.id;
    const currentCount = this.revealedHints[qId] || 0;
    if (currentCount < hints.length) {
      this.revealedHints[qId] = currentCount + 1;
    }

    this.renderHintsUI();
  }

  renderHintsUI() {
    if (!this.currentQuestion) return;
    const qId = this.currentQuestion.id;
    const hints = Array.isArray(this.currentQuestion.hints) 
      ? this.currentQuestion.hints 
      : (this.currentQuestion.hint ? [this.currentQuestion.hint] : []);

    const revealedCount = this.revealedHints[qId] || 0;
    const container = document.getElementById("hints-progressive-container");
    const countBadge = document.getElementById("hints-count-badge");
    const revealBtn = document.getElementById("btn-reveal-next-hint");

    if (countBadge) {
      countBadge.textContent = `${revealedCount} of ${hints.length} revealed`;
    }

    if (container) {
      if (revealedCount === 0) {
        container.innerHTML = `
          <div style="font-size: 0.85rem; color: var(--text-muted); font-style: italic; padding: 0.5rem 0;">
            Hints are hidden so you can try solving first. Click "Reveal Next Hint" below for a gentle nudge!
          </div>
        `;
      } else {
        container.innerHTML = hints.slice(0, revealedCount).map((h, i) => {
          let stageLabel = "Gentle Nudge";
          if (i === 1) stageLabel = "Specific Clue";
          else if (i >= 2) stageLabel = "Syntax & Logic Pointer";
          return `
            <div class="hint-progressive-card">
              <div class="hint-card-header">
                <span style="font-weight: 700; color: #D97706;">💡 Hint ${i + 1} (${stageLabel})</span>
              </div>
              <div style="font-size: 0.875rem; color: var(--text-secondary); line-height: 1.5; margin-top: 0.25rem;">
                ${this.escapeHtml(h)}
              </div>
            </div>
          `;
        }).join("");
      }
    }

    if (revealBtn) {
      if (revealedCount >= hints.length) {
        revealBtn.disabled = true;
        revealBtn.innerHTML = "All Hints Revealed ✓";
        revealBtn.style.opacity = "0.6";
      } else {
        revealBtn.disabled = false;
        revealBtn.style.opacity = "1";
        const nextNum = revealedCount + 1;
        let nextLabel = "Gentle Nudge";
        if (nextNum === 2) nextLabel = "Specific Clue";
        else if (nextNum >= 3) nextLabel = "Syntax Pointer";
        revealBtn.innerHTML = `Reveal Hint ${nextNum} (${nextLabel}) →`;
      }
    }
  }

  /**
   * Submit answer: validates code against all test suites,
   * awards points strictly once, updates progress and renders
   * granular input, expected output or criteria, and beginner explanation for all test cases.
   */
  async submitAnswer() {
    if (this.isSubmitting || !this.currentQuestion) return;
    this.isSubmitting = true;

    const submitBtn = document.getElementById("btn-submit-answer");
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <span class="btn-spinner"></span>
        Validating...
      `;
    }

    const code = this.getCurrentCode();
    window.store.saveQuestionDraft(this.currentQuestion.id, code);

    const feedbackBox = document.getElementById("feedback-container");
    const terminalStdout = document.getElementById("terminal-stdout");

    if (terminalStdout) {
      terminalStdout.innerHTML = "<span style='color: #60A5FA;'>Validating solution against all test suites in Python runtime...</span>";
    }

    try {
      const result = await window.runner.validateSubmission(this.currentQuestion, code);

      // Record this attempt in storage history with summary
      const passedCount = result.results.filter(r => r.passed).length;
      const totalCases = result.results.length;
      const attemptDetail = result.passed ? "All tests passed" : `Passed ${passedCount} of ${totalCases} tests`;
      window.store.recordAttempt(this.currentQuestion.id, result.passed, code, attemptDetail);

      // Notify active practice session if one is running
      if (result.passed) {
        if (typeof window.onSessionQuestionPassed === "function") {
          window.onSessionQuestionPassed(this.currentQuestion.id);
        }
      } else {
        if (typeof window.onSessionQuestionAttempted === "function") {
          window.onSessionQuestionAttempted(this.currentQuestion.id);
        }
      }

      const totalQ = this.getTotalQuestions();
      const isLastQuestion = this.currentQuestion.id >= totalQ;

      // Construct detailed test case feedback UI cards
      const testCardsHtml = result.results.map(r => {
        const badgeColor = r.passed ? "var(--mint-accent-dark)" : "#DC2626";
        const badgeBg = r.passed ? "var(--mint-accent)" : "#FEE2E2";
        const badgeText = r.passed ? "✓ PASSED" : "✗ FAILED";

        const inputStr = (r.input && r.input.length > 0) 
          ? r.input.map(x => JSON.stringify(x)).join(", ") 
          : "None (No input needed)";

        const criterionLabel = r.criterionLabel || "Expected Output";

        return `
          <div class="test-result-card ${r.passed ? 'test-card-passed' : 'test-card-failed'}">
            <div class="test-result-header">
              <span class="test-case-title">Test #${r.caseIndex}: ${this.escapeHtml(r.description)}</span>
              <span class="test-status-pill" style="background: ${badgeBg}; color: ${badgeColor};">${badgeText}</span>
            </div>
            
            <div class="test-result-grid">
              <div class="test-detail-item">
                <span class="test-detail-label">Test Input</span>
                <code class="test-detail-val">${this.escapeHtml(inputStr)}</code>
              </div>
              <div class="test-detail-item">
                <span class="test-detail-label">${this.escapeHtml(criterionLabel)}</span>
                <code class="test-detail-val">${this.escapeHtml(r.expectedOutput || "Matching output")}</code>
              </div>
              <div class="test-detail-item">
                <span class="test-detail-label">Your Actual Output</span>
                <code class="test-detail-val">${this.escapeHtml(r.actualOutput || r.stdout || "(Empty)")}</code>
              </div>
            </div>

            ${!r.passed && r.beginnerExplanation ? `
              <div class="test-tip-callout">
                <span style="font-weight: 700; color: #D97706;">💡 Why did this fail?</span>
                <p style="margin-top: 0.25rem; font-size: 0.85rem; color: var(--text-secondary); line-height: 1.45;">
                  ${this.escapeHtml(r.beginnerExplanation)}
                </p>
              </div>
            ` : ''}
          </div>
        `;
      }).join("");

      if (result.passed) {
        if (typeof window.announceToScreenReader === "function") {
          window.announceToScreenReader(`Challenge ${this.currentQuestion.id} passed! All ${totalCases} test cases passed. +1 point awarded.`);
        }
        // Award point strictly if not already completed
        const wasAlreadyCompleted = window.store.isQuestionComplete(this.currentQuestion.id);
        window.store.markQuestionComplete(this.currentQuestion.id);

        if (terminalStdout) {
          let testLog = `<span style="color: #34D399; font-weight: 700;">==================================================\nALL ${result.results.length} TEST CASES PASSED FOR CHALLENGE ${this.currentQuestion.id}\n==================================================</span>\n\n`;
          testLog += result.results.map(r => {
            return `✓ [Test #${r.caseIndex}] ${this.escapeHtml(r.description)} -> PASSED\n${r.stdout ? `  Output: ${this.escapeHtml(r.stdout)}` : "  Output verified"}`;
          }).join("\n\n");
          terminalStdout.innerHTML = testLog;
        }

        if (feedbackBox) {
          feedbackBox.innerHTML = `
            <div class="feedback-box feedback-success" style="margin-bottom: 1rem;">
              <div style="display: flex; align-items: center; justify-content: space-between; gap: 1rem; flex-wrap: wrap;">
                <div>
                  <strong style="font-size: 1.05rem;">🎉 ${wasAlreadyCompleted ? "Challenge Solved!" : "Correct! +1 Point Awarded"}</strong>
                  <p style="margin-top: 0.35rem; line-height: 1.5;">${this.escapeHtml(result.details)}</p>
                </div>
                <div>
                  ${
                    isLastQuestion
                      ? `<button class="btn btn-primary" onclick="window.navigateTo('results')">View Final Results & Certificate →</button>`
                      : `<button class="btn btn-success" id="btn-next-question-banner" onclick="window.testEngine.nextQuestion()">Next Challenge →</button>`
                  }
                </div>
              </div>
            </div>
            <div class="test-breakdown-wrapper">
              <div style="font-size: 0.85rem; font-weight: 700; color: var(--text-secondary); margin-bottom: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em;">
                Test Suite Evaluation (${passedCount}/${totalCases} Passed)
              </div>
              ${testCardsHtml}
            </div>
          `;
        }

        // Update score badge in header and sidebar
        this.updateHeaderScore();
        this.updateSidebarPill(this.currentQuestion.id, true);

      } else {
        // Did not pass
        if (typeof window.announceToScreenReader === "function") {
          window.announceToScreenReader(`Challenge ${this.currentQuestion.id} tests failed. Passed ${passedCount} of ${totalCases} test cases. ${result.details}`, true);
        }
        if (terminalStdout) {
          let failureLog = `<span style="color: #F87171; font-weight: 700;">==================================================\nTEST SUITE FAILED (Passed ${passedCount} of ${totalCases})\n==================================================</span>\n\n`;
          failureLog += result.results.map(r => {
            const icon = r.passed ? "✓ PASSED" : "✗ FAILED";
            const color = r.passed ? "#34D399" : "#F87171";
            let detail = "";
            if (r.error) {
              detail = `Error: ${this.escapeHtml(r.error)}`;
              if (r.friendlyError) {
                detail += `\nTip: ${this.escapeHtml(r.friendlyError.tip || r.friendlyError.message)}`;
              }
            } else {
              detail = `Your Output: "${this.escapeHtml(r.stdout || '')}"\nExpected: "${this.escapeHtml(r.expectedOutput || '')}"`;
            }
            return `<span style="color: ${color}; font-weight: 600;">[Test #${r.caseIndex}] ${this.escapeHtml(r.description)}: ${icon}</span>\n  ${detail}`;
          }).join("\n\n");
          terminalStdout.innerHTML = failureLog;
        }

        if (feedbackBox) {
          feedbackBox.innerHTML = `
            <div class="feedback-box feedback-error" style="margin-bottom: 1rem;">
              <strong>${this.escapeHtml(result.summary)}</strong>
              <p style="line-height: 1.5;">${this.escapeHtml(result.details)}</p>
              <div style="display: flex; gap: 0.75rem; align-items: center; margin-top: 0.75rem; flex-wrap: wrap;">
                <span style="font-size: 0.8rem; opacity: 0.9;">✨ Your code is preserved. Review the test breakdown below and retry!</span>
                <button class="btn btn-secondary btn-sm" onclick="window.navigateTo('mistakes')" style="font-size: 0.775rem;">
                  View In Mistakes Review
                </button>
              </div>
            </div>
            <div class="test-breakdown-wrapper">
              <div style="font-size: 0.85rem; font-weight: 700; color: var(--text-secondary); margin-bottom: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em;">
                Test Suite Evaluation (${passedCount}/${totalCases} Passed)
              </div>
              ${testCardsHtml}
            </div>
          `;
        }
      }
    } catch (err) {
      console.error(err);
      if (typeof window.announceToScreenReader === "function") {
        window.announceToScreenReader(`System error executing tests: ${err.message}`, true);
      }
      if (feedbackBox) {
        feedbackBox.innerHTML = `
          <div class="feedback-box feedback-error">
            <strong>System Error</strong>
            <p>${this.escapeHtml(err.message)}</p>
          </div>
        `;
      }
    } finally {
      this.isSubmitting = false;
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m5 12 5 5L20 7"/></svg>
          Submit Answer
        `;
      }
    }
  }

  nextQuestion() {
    if (window.activeSession && Array.isArray(window.activeSession.questions)) {
      const qList = window.activeSession.questions;
      const curIdx = qList.indexOf(this.currentQuestion.id);
      if (curIdx >= 0 && curIdx < qList.length - 1) {
        window.activeSession.currentIndex = curIdx + 1;
        if (typeof window.updateSessionBanner === "function") {
          window.updateSessionBanner();
        }
        this.loadQuestion(qList[curIdx + 1]);
        return;
      } else if (curIdx === qList.length - 1) {
        if (typeof window.finishQuizSession === "function") {
          window.finishQuizSession("All challenges in this practice session completed!");
        }
        return;
      }
    }

    const totalQ = this.getTotalQuestions();
    if (this.currentQuestion && this.currentQuestion.id < totalQ) {
      this.loadQuestion(this.currentQuestion.id + 1);
    } else {
      window.navigateTo("results");
    }
  }

  prevQuestion() {
    if (window.activeSession && Array.isArray(window.activeSession.questions)) {
      const qList = window.activeSession.questions;
      const curIdx = qList.indexOf(this.currentQuestion.id);
      if (curIdx > 0) {
        window.activeSession.currentIndex = curIdx - 1;
        if (typeof window.updateSessionBanner === "function") {
          window.updateSessionBanner();
        }
        this.loadQuestion(qList[curIdx - 1]);
        return;
      }
    }

    if (this.currentQuestion && this.currentQuestion.id > 1) {
      this.loadQuestion(this.currentQuestion.id - 1);
    }
  }

  resetCurrentCode() {
    if (!this.currentQuestion) return;
    if (confirm("Reset solution.py to starter template? Your unsaved edits for this question will be cleared.")) {
      this.setCurrentCode(this.currentQuestion.starterCode);
    }
  }

  revealSolution() {
    if (!this.currentQuestion) return;
    if (confirm("Revealing the solution will mark this question as 'Assisted'. Are you sure you want to view the solution?")) {
      window.store.markQuestionComplete(this.currentQuestion.id, true);
      const solutionContainer = document.getElementById("solution-view-container");
      if (solutionContainer) {
        solutionContainer.style.display = "block";
      }
      this.updateSidebarPill(this.currentQuestion.id, true, true);
      this.updateHeaderScore();
    }
  }

  toggleBookmarkCurrent() {
    if (!this.currentQuestion) return;
    const isNowBookmarked = window.store.toggleBookmark(this.currentQuestion.id);
    const starBtn = document.getElementById("btn-bookmark-question");
    if (starBtn) {
      starBtn.classList.toggle("bookmarked", isNowBookmarked);
      starBtn.setAttribute("aria-pressed", isNowBookmarked ? "true" : "false");
      starBtn.innerHTML = isNowBookmarked ? "★ Bookmarked" : "☆ Bookmark";
    }
  }

  saveNoteCurrent(noteText) {
    if (!this.currentQuestion) return;
    window.store.saveNote(this.currentQuestion.id, noteText);
    const indicator = document.getElementById("note-saved-indicator");
    if (indicator) {
      indicator.textContent = "Saved";
      setTimeout(() => { if (indicator) indicator.textContent = ""; }, 1500);
    }
  }

  updateHeaderScore() {
    const totalQ = this.getTotalQuestions();
    const solvedCount = window.store.state.completedQuestions.length;
    const scoreBadge = document.getElementById("test-score-display");
    if (scoreBadge) {
      scoreBadge.textContent = `${solvedCount} / ${totalQ} Pts`;
    }
    const progressBar = document.getElementById("test-progress-bar");
    if (progressBar) {
      const pct = Math.min(100, (solvedCount / totalQ) * 100);
      progressBar.style.width = `${pct}%`;
    }
    const sidebarCount = document.getElementById("sidebar-solved-count");
    if (sidebarCount) {
      sidebarCount.textContent = `${solvedCount}/${totalQ} Solved`;
    }
  }

  updateSidebarPill(questionId, isCompleted = false, isAssisted = false) {
    const pill = document.querySelector(`.q-nav-pill[data-qid="${questionId}"]`);
    if (pill) {
      if (isCompleted) pill.classList.add("completed");
      if (isAssisted || window.store.isQuestionAssisted(questionId)) pill.classList.add("assisted");
    }
  }

  escapeHtml(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
}

const testEngine = new TestEngine();
if (typeof window !== "undefined") {
  window.testEngine = testEngine;
  window.TestEngine = TestEngine;
}
