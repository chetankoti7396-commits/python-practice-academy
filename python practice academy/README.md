# Python Practice Academy

> **"Master Python. One Challenge at a Time."**

**Python Practice Academy** is an open-access, browser-native coding education platform featuring **72 progressive Python challenges across 7 curriculum levels**, in-browser execution, granular test evaluation, interactive concept demos, practice modes, guided projects, and local-first progress tracking with ₹0 starting budget.

---

## 🌟 Upgraded Features

### 1. Clearer Test Feedback
- **Granular Test Case Breakdown**: For each test in a challenge, view the exact **Test Input**, **Expected Output**, and **Actual Output** produced by your code.
- **Beginner-Friendly Error Explanations**: When an attempt fails, receive a plain-English explanation of why the output differed (e.g. casing differences, missing output, unexpected type conversion, or specific Python runtime exceptions).
- **Clear Pass/Fail Indicators**: Color-coded badges and summary metrics (`Passed X of Y`) make test status obvious at a glance.

### 2. Mistakes Review & One-Click Retries
- **Dedicated Mistakes Hub**: Direct access via the navigation bar (`#mistakes`) and top alert banners.
- **Unresolved Challenge Tracking**: Automatically tracks challenges attempted with failed tests that are not yet solved.
- **Latest Attempt Context**: Displays the timestamp, latest failure feedback, and code excerpt.
- **One-Click Retry**: Loads the challenge directly into the workspace with your previous code draft preserved.

### 3. Personalized Next Steps
- **Smart Adaptive Recommendations**: Suggests the optimal next challenge on the Homepage, Progress dashboard, and Mistakes hub.
- **Context-Aware Explanations**: Plain-English rationale (e.g., reinforcing a prerequisite after repeated failed attempts, or stepping up to the next curriculum level upon milestone completion).
- **Direct One-Click Navigation**: Jump straight into the recommended challenge.

### 4. Progress Backup and Restore
- **Export Progress**: Download your full progress—completed challenges, attempt logs, code drafts, bookmarks, and notes—as a clean JSON file (`python_practice_academy_backup_YYYY-MM-DD.json`).
- **Validated Import with Confirmation**: Thorough validation checks schema version, data integrity, and question bounds. Displays a summary preview modal (challenges solved, attempts, bookmarks) and requires confirmation before replacing local progress.

### 5. Progress History & Topic Focus Areas
- **Verification History**: Chronological log of attempts with timestamps, pass/fail badges, and evaluation details.
- **Focus Area Detection**: Analyzes pass/fail ratios across curriculum levels to spotlight topics where additional practice is recommended.
- **Curriculum Progress Bars**: Real-time completion percentages for each of the 7 levels.

### 6. Practice Modes
- **Daily Practice Sprint**: Quick 3-challenge daily routine designed to build consistency without burnout.
- **Timed Speed Quiz**: 5 randomized challenges with an active 10-minute countdown timer and instant scorecard report.
- **Topic-Focused Drills**: Select any specific level (e.g., Loops, Functions, Exceptions) to practice targeted problem sets.

### 7. Guided Projects
- **Real-World Applications**:
  1. *Personal Expense & Budget Manager*
  2. *High-Low Number Guessing Game Engine*
- **Milestone Stepper**: 4 progressive sub-steps per project with dedicated instructions, starter code, and in-place verification before unlocking the next milestone.

### 8. Editor Preferences
- **Font Size Adjustments**: Choose between Small (13px), Medium (15px - default), and Large (18px).
- **Word Wrapping Toggle**: Enable or disable horizontal scrolling versus automatic line wrapping.
- **Editor Themes**: Choose from *Dark Navy*, *Monokai Cyber*, *Warm Light (Paper)*, or *High Contrast*.
- **Persistent Storage**: Saved in browser `localStorage` and applied consistently across questions.

### 9. Accessibility & Inclusive Design
- **Accessible Navigation**: Top "Skip to main content" link moves keyboard focus directly to `#app`, with logical tab ordering and high-contrast visible focus rings (`:focus-visible`) in both light and dark themes.
- **Mobile Drawer Accessibility**: Semantic hamburger button with dynamic `aria-expanded` and `aria-controls` bindings, drawer with `aria-hidden`, keyboard navigation, outside-click dismissal, and `Escape` key close.
- **Modal Dialog Accessibility**: Modal linked with its title via `aria-labelledby="modal-title"`, trapped keyboard focus (`Tab` / `Shift+Tab`), focus restoration to previously active elements upon dismissal, and `Escape` key support.
- **Screen Reader Announcements**: Live region elements (`aria-live="polite"` and `role="alert"`) automatically announce test validation results, runtime execution errors, timer countdown milestones (5m, 3m, 1m, 30s, 0s), and dialog states.
- **Semantic Footer Controls**: Replaced unclickable spans with keyboard-accessible `<button>` and `<a>` elements with proper accessible focus outlines.
- **Reduced Motion & Contrast**: Respects system `prefers-reduced-motion` and aims for readable contrast across both light and dark themes; formal WCAG audit/verification has not been completed.

### 10. Achievements & Milestones (12 Badges)
- Earn badges based on real saved progress:
  - `First Code Execution`, `Python Novice` (5 solved), `Variables Virtuoso` (Level 1), `Logic Commander` (Level 2), `Loop Luminary` (Level 3), `String & List Specialist` (Level 4), `Project Architect` (Level 5), `Pure Logic` (10 unassisted solves), `Grit & Persistence` (retrying and solving after failures), `Midpoint Milestone` (25 solved), `Speed Runner` (Timed quiz), and `Guided Craftsman` (Completed guided project).
- View earned badges and locked progress directly on the Progress Dashboard.

### 11. Bookmarks and Notes
- **Challenge Bookmarks**: Star any challenge (★) from the test workspace or question bank to quickly locate it later.
- **Private Notes**: Dedicated expandable notes drawer in each challenge workspace with automatic local saving.

### 12. Multi-Filter Question Bank
- Combine multiple filters simultaneously:
  - **Topic / Level**: All or specific levels (L1–L7)
  - **Difficulty**: Beginner, Intermediate, Advanced
  - **Completion Status**: Solved, Unsolved, or Needs Review (Mistakes)
  - **Bookmarks**: Filter specifically by starred challenges
  - **Keyword Search**: Instant query matching on titles, descriptions, and topics.

### 13. Expanded Curriculum (72 Challenges across 7 Levels)
- **Level 1**: Variables and Basic Maths (Q1–Q10)
- **Level 2**: Conditions and Decision Making (Q11–Q20)
- **Level 3**: Loops and Repetition (Q21–Q30)
- **Level 4**: Strings and Lists (Q31–Q40)
- **Level 5**: Mini Projects and Problem Solving (Q41–Q50)
- **Level 6**: Functions, Dictionaries & Sets (Q51–Q60)
- **Level 7**: Exceptions, Files & Classes (Q61–Q72)

### 14. Interactive Concept Demos & Syntax Reference
- **Conditions Visualizer**: Drag a score slider (0–100) and watch the matching `if/elif/else` branch light up with dynamic evaluation notes.
- **Loops Stepper**: Step through `range(start, stop, step)` iteration-by-iteration, observing loop variable `i` and output tape accumulation.
- **String Slicing Visualizer**: Inspect positive `[0..N]` and negative `[-N..-1]` indices on live text with customizable `[start:stop:step]` boundaries.
- **List Operations**: Interactive visual list supporting `append`, `pop`, `sort`, and `reverse`.
- **Dictionary Playground**: Key-value store demo with dynamic addition, lookup, and updates.
- **Syntax Cheat Sheet & Reference Guide**: Accessible directly from the Learn view (`#learn`) or footer link, containing quick reference syntax tables for variables, conditionals, loops, data structures, and functions.

### 15. Privacy Disclosure, Offline Fallback & Cloud Sync Specification
- **Current Architecture**: Python Practice Academy is a **100% client-side web application** with ₹0 server hosting costs. All drafts, scores, and preferences are stored locally in your browser's `localStorage`.
- **External Network Assets**:
  - The site loads typography from Google Fonts (`fonts.googleapis.com`) and the Skulpt Python 3 browser engine from jsDelivr CDN (`cdn.jsdelivr.net`).
  - No user telemetry, marketing analytics, or tracking cookies are collected or shared.
  - Optional AI Tutor: Uses an offline heuristic engine by default; if you provide a personal Gemini or OpenAI API key, prompts are sent directly to that provider's API from your browser.
- **Offline Resilience & Engine Fallback**:
  - When CDN access is unavailable or offline, the platform activates a limited built-in JavaScript Python Simulator for experimentation only. The simulator is not a complete Python runtime, does not support the full standard library, and cannot grade submissions. Grading requires the real Skulpt Python engine.
- **Cloud Sync Status**:
  - Cloud progress sync is not implemented. All progress is stored locally in the browser. Use Export/Import JSON backups to move progress between devices.
  - Learners can securely transfer complete progress across computers using the **Export Progress** and **Import Progress** JSON backup tools.
  - Backend technical specification: REST endpoints (`/api/v1/auth/register`, `/api/v1/auth/login`, `/api/v1/sync/pull`, `/api/v1/sync/push`) with JWT authentication and last-write-wins timestamp conflict resolution.

---

## 📂 Project Structure

```
python practice academy/
├── index.html              # Main SPA container, accessible navigation, header, modals, footer
├── css/
│   └── style.css           # Pastel design system, WCAG AA dark mode, editor themes & components
├── js/
│   ├── app.js              # Routing, event controllers, multi-filter QB, timers, concept demos
│   ├── ai-tutor.js         # In-browser intelligent Python tutor & optional Gemini/OpenAI integration
│   ├── questions.js        # 72-question repository across 7 levels with complete test suites
│   ├── python-runner.js    # In-browser Python 3 execution sandbox & granular test evaluator
│   ├── test-engine.js      # Test runner, rich feedback rendering, bookmarks, notes, and retries
│   ├── storage.js          # Resilient storage manager (v2), backup/restore validator, badges, smart recommendations
│   └── ui.js               # Dynamic component views (Home, Test, QB, Learn, Mistakes, Modes, Projects, Demos, Progress)
├── package.json            # Manifest and local preview scripts
└── README.md               # Complete platform documentation
```

---

## 🚀 Running the Project Locally

Run **Python Practice Academy** with zero configuration:

### Option 1: Direct Browser Launch
Open `index.html` directly in Google Chrome, Microsoft Edge, Firefox, or Safari.

### Option 2: Using Node.js / npx
```bash
npx serve .
```
Then navigate to `http://localhost:3000`.

---

## 🌐 Publishing Online (Free / ₹0 Budget)

- **GitHub Pages**: Push this directory to GitHub, go to **Repository Settings** -> **Pages**, choose the `main` branch, and click **Save**.
- **Netlify**: Drag and drop the folder into [app.netlify.com/drop](https://app.netlify.com/drop).
- **Vercel**: Deploy as a static directory with zero build commands.
```

---

## 🚀 Running the Project Locally

Run **Python Practice Academy** with zero configuration:

### Option 1: Direct Browser Launch
Open `index.html` directly in Google Chrome, Microsoft Edge, Firefox, or Safari.

### Option 2: Using Node.js / npx
```bash
npx serve .
```
Then navigate to `http://localhost:3000`.

---

## 🌐 Publishing Online (Free / ₹0 Budget)

- **GitHub Pages**: Push this directory to GitHub, go to **Repository Settings** -> **Pages**, choose the `main` branch, and click **Save**.
- **Netlify**: Drag and drop the folder into [app.netlify.com/drop](https://app.netlify.com/drop).
- **Vercel**: Deploy as a static directory with zero build commands.
