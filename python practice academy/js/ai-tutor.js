/**
 * PYTHON PRACTICE ACADEMY — AI TUTOR & DOUBT SOLVER
 * Intelligent, contextual conversational tutor for Python learners.
 * Features:
 * - Understands current challenge, user code draft, test errors, and hints
 * - In-browser intelligent heuristic Python reasoning engine (100% Free, zero config)
 * - Optional user-configured Google Gemini (or OpenAI) API integration
 * - Quick prompt chips (Explain problem, Find bugs, Progressive hint, Syntax guide)
 */

class AITutor {
  constructor() {
    this.isOpen = false;
    this.messages = [];
    this.isLoading = false;
    this.apiKey = this.loadApiKey();
    this.provider = this.loadProvider(); // 'builtin' | 'gemini' | 'openai'
    this.geminiModel = "gemini-1.5-flash";
    this.init();
  }

  loadApiKey() {
    try {
      return localStorage.getItem("ppa_ai_api_key") || "";
    } catch (e) {
      return "";
    }
  }

  saveApiKey(key, provider = "gemini") {
    this.apiKey = key.trim();
    if (this.apiKey.startsWith("sk-")) {
      this.provider = "openai";
    } else if (this.apiKey.startsWith("AIzaSy")) {
      this.provider = "gemini";
    } else {
      this.provider = provider;
    }
    try {
      localStorage.setItem("ppa_ai_api_key", this.apiKey);
      localStorage.setItem("ppa_ai_provider", this.provider);
    } catch (e) {
      console.warn("Storage save error", e);
    }
  }

  loadProvider() {
    try {
      const stored = localStorage.getItem("ppa_ai_provider");
      const key = this.loadApiKey();
      if (key && key.startsWith("sk-")) return "openai";
      if (key && key.startsWith("AIzaSy")) return "gemini";
      return stored || (key ? "gemini" : "builtin");
    } catch (e) {
      return "builtin";
    }
  }

  init() {
    // Initial welcome message
    this.messages = [
      {
        role: "assistant",
        text: "👋 Hi! I'm your **AI Python Tutor**. I can explain concepts, help you find bugs in your code, or give gentle hints without spoiling the answer. Pick a quick action below or type any question!"
      }
    ];
  }

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    this.isOpen = true;
    let drawer = document.getElementById("ai-tutor-drawer");
    if (!drawer) {
      this.createDrawerDOM();
      drawer = document.getElementById("ai-tutor-drawer");
    }
    if (drawer) {
      drawer.classList.add("open");
    }
    const fab = document.getElementById("ai-tutor-fab");
    if (fab) {
      fab.classList.add("active");
    }
    this.renderMessages();
    this.updateContextPill();
  }

  close() {
    this.isOpen = false;
    const drawer = document.getElementById("ai-tutor-drawer");
    if (drawer) {
      drawer.classList.remove("open");
    }
    const fab = document.getElementById("ai-tutor-fab");
    if (fab) {
      fab.classList.remove("active");
    }
  }

  updateContextPill() {
    const pill = document.getElementById("ai-context-pill");
    if (!pill) return;
    const q = window.testEngine && window.testEngine.currentQuestion;
    if (q) {
      pill.innerHTML = `<span style="color: var(--primary-blue); font-weight: 700;">Active Context:</span> Q${q.id} — ${q.title}`;
    } else {
      pill.innerHTML = `<span style="color: var(--text-secondary);">Context: General Python Help</span>`;
    }
  }

  createDrawerDOM() {
    const drawer = document.createElement("div");
    drawer.id = "ai-tutor-drawer";
    drawer.className = "ai-tutor-drawer";
    drawer.innerHTML = `
      <div class="ai-drawer-header">
        <div class="ai-drawer-title">
          <div class="ai-avatar-icon">✨</div>
          <div>
            <div style="font-weight: 700; font-size: 0.95rem; color: var(--text-main); display: flex; align-items: center; gap: 0.4rem;">
              AI Python Tutor
              <span id="ai-model-badge" class="ai-model-badge">AI Assistant</span>
            </div>
            <div style="font-size: 0.725rem; color: var(--text-secondary);">Real-time doubt solver & code mentor</div>
          </div>
        </div>
        <div style="display: flex; gap: 0.25rem; align-items: center;">
          <button class="btn-icon btn-sm" onclick="window.aiTutor.openSettingsModal()" title="AI Settings / API Key" style="width: 2rem; height: 2rem;">⚙️</button>
          <button class="btn-icon btn-sm" onclick="window.aiTutor.clearChat()" title="Clear Chat" style="width: 2rem; height: 2rem;">🗑️</button>
          <button class="btn-icon btn-sm" onclick="window.aiTutor.close()" title="Close Drawer" style="width: 2rem; height: 2rem;">✕</button>
        </div>
      </div>

      <div id="ai-context-pill" class="ai-context-pill"></div>

      <!-- Quick Action Prompt Chips -->
      <div class="ai-quick-chips">
        <button class="ai-chip" onclick="window.aiTutor.handleQuickPrompt('explain')">💡 Explain Problem</button>
        <button class="ai-chip" onclick="window.aiTutor.handleQuickPrompt('debug')">🔍 Find Bug in My Code</button>
        <button class="ai-chip" onclick="window.aiTutor.handleQuickPrompt('hint')">🚀 Give Me a Hint</button>
        <button class="ai-chip" onclick="window.aiTutor.handleQuickPrompt('syntax')">📘 Python Syntax Guide</button>
      </div>

      <!-- Messages Body -->
      <div id="ai-messages-container" class="ai-messages-container"></div>

      <!-- Input Bar -->
      <div class="ai-input-wrapper">
        <form id="ai-chat-form" onsubmit="window.aiTutor.handleFormSubmit(event)">
          <div class="ai-input-bar">
            <textarea 
              id="ai-user-input" 
              class="ai-textarea" 
              rows="1" 
              placeholder="Ask anything about Python or this problem..." 
              onkeydown="window.aiTutor.handleInputKeydown(event)"
            ></textarea>
            <button type="submit" id="ai-send-btn" class="ai-send-btn" title="Send message">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </div>
        </form>
      </div>
    `;

    document.body.appendChild(drawer);

    // Also inject floating FAB if not already present
    if (!document.getElementById("ai-tutor-fab")) {
      const fab = document.createElement("button");
      fab.id = "ai-tutor-fab";
      fab.className = "ai-tutor-fab";
      fab.title = "Ask AI Python Tutor";
      fab.onclick = () => this.toggle();
      fab.innerHTML = `
        <span class="ai-fab-sparkle">✨</span>
        <span class="ai-fab-text">Ask AI</span>
      `;
      document.body.appendChild(fab);
    }
  }

  handleInputKeydown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      this.handleFormSubmit(e);
    }
  }

  handleFormSubmit(e) {
    if (e) e.preventDefault();
    const input = document.getElementById("ai-user-input");
    if (!input) return;
    const text = input.value.trim();
    if (!text || this.isLoading) return;
    input.value = "";
    this.sendUserMessage(text);
  }

  handleQuickPrompt(type) {
    const q = window.testEngine && window.testEngine.currentQuestion;
    if (!q) {
      this.sendUserMessage("Can you explain how to practice Python effectively on this website?");
      return;
    }

    switch (type) {
      case "explain":
        this.sendUserMessage(`Can you explain the problem "${q.title}" in simple words and what it asks me to do?`);
        break;
      case "debug":
        this.sendUserMessage(`Can you check my current code for "${q.title}" and tell me what might be wrong or missing?`);
        break;
      case "hint":
        this.sendUserMessage(`Can you give me a step-by-step hint for "${q.title}" without giving the full solution?`);
        break;
      case "syntax":
        this.sendUserMessage(`What Python syntax, functions, or methods are recommended for solving "${q.title}"?`);
        break;
    }
  }

  async sendUserMessage(text) {
    this.messages.push({ role: "user", text });
    this.renderMessages();

    this.isLoading = true;
    this.renderLoading();

    const q = window.testEngine ? window.testEngine.currentQuestion : null;
    const userCode = window.testEngine ? window.testEngine.getCurrentCode() : "";
    const terminalEl = document.getElementById("terminal-stdout");
    const terminalOutput = terminalEl ? terminalEl.textContent : "";

    try {
      let responseText = "";

      // If user provided an API Key (supports Gemini AIzaSy... and OpenAI sk-...)
      let effectiveProvider = this.provider;
      if (this.apiKey) {
        if (this.apiKey.startsWith("sk-")) {
          effectiveProvider = "openai";
        } else if (this.apiKey.startsWith("AIzaSy")) {
          effectiveProvider = "gemini";
        }
      }

      if (this.apiKey && effectiveProvider === "gemini") {
        responseText = await this.callGeminiAPI(text, q, userCode, terminalOutput);
      } else if (this.apiKey && effectiveProvider === "openai") {
        responseText = await this.callOpenAIAPI(text, q, userCode, terminalOutput);
      } else {
        // Built-in intelligent offline tutor
        await new Promise(r => setTimeout(r, 450)); // natural micro-delay
        responseText = this.generateBuiltinResponse(text, q, userCode, terminalOutput);
      }

      this.messages.push({ role: "assistant", text: responseText });
    } catch (err) {
      console.error("AI Tutor error:", err);
      this.messages.push({
        role: "assistant",
        text: `⚠️ **Note:** I ran into an issue connecting to the AI service: *${err.message}*.\n\nFalling back to our in-browser AI knowledge engine:\n\n${this.generateBuiltinResponse(text, q, userCode, terminalOutput)}`
      });
    } finally {
      this.isLoading = false;
      this.renderMessages();
    }
  }

  /**
   * Built-in intelligent reasoning engine (100% Free, zero dependencies)
   */
  generateBuiltinResponse(query, q, code, terminalOutput) {
    const qLower = query.toLowerCase();

    if (!q) {
      return "Python Practice Academy features 72 structured challenges across 7 levels. Select any challenge from the Practice Tests or Question Bank to get started, and I'll analyze your code and logic in real time!";
    }

    // 1. Debugging / Bug checking request
    if (qLower.includes("bug") || qLower.includes("wrong") || qLower.includes("fail") || qLower.includes("check my code") || qLower.includes("error")) {
      return this.analyzeCodeForBugs(q, code, terminalOutput);
    }

    // 2. Explanation of the problem
    if (qLower.includes("explain the problem") || qLower.includes("simple words") || qLower.includes("what it asks") || qLower.includes("don't understand")) {
      return `### 📘 Problem Breakdown: **${q.title}**\n\n` +
        `**What is the goal?**\n${q.description}\n\n` +
        `**Key Requirements:**\n` +
        q.requirements.map(r => `• ${r}`).join("\n") + "\n\n" +
        `**Input / Output Example:**\n` +
        `• When input is: \`${q.sampleInput || "None"}\`\n` +
        `• Your program should print: \`${q.sampleOutput}\`\n\n` +
        `💡 *Need help getting started? Write the input reading first, then apply the logic step by step.*`;
    }

    // 3. Hint request
    if (qLower.includes("hint") || qLower.includes("clue") || qLower.includes("guide")) {
      return `### 💡 Gentle Hint for **${q.title}**\n\n` +
        `**Core Idea:** ${q.hint}\n\n` +
        `**Approach:**\n` +
        `1. Make sure you read the inputs properly using \`input()\`. If doing math, remember to wrap it in \`int()\` or \`float()\`, because \`input()\` returns a string!\n` +
        `2. Write out the calculation or conditional logic.\n` +
        `3. Use \`print(...)\` to display the final answer.\n\n` +
        `Would you like me to inspect your current code draft to see where to plug this in?`;
    }

    // 4. Syntax & functions recommendation
    if (qLower.includes("syntax") || qLower.includes("function") || qLower.includes("method") || qLower.includes("how to")) {
      let syntaxTips = "";
      if (q.level === 1) {
        syntaxTips = "• \`print(\"text\")\` — prints to console\n• \`int(input())\` — reads integer from user\n• \`f\"Hello {name}\"\` — formatted string interpolation\n• Arithmetic operators: \`+\`, \`-\`, \`*\`, \`/\`, \`%\`";
      } else if (q.level === 2) {
        syntaxTips = "• \`if condition:\` ... \`elif:\` ... \`else:\`\n• Comparisons: \`==\`, \`!=\`, \`>\`, \`<\`, \`>=\`, \`<=\`\n• Logical operators: \`and\`, \`or\`, \`not\`\n• Modulo for even/odd: \`num % 2 == 0\`";
      } else if (q.level === 3) {
        syntaxTips = "• \`for i in range(1, 11):\` — loop from 1 to 10\n• \`for i in range(10, 0, -1):\` — countdown\n• \`while condition:\` — loop while True\n• Accumulator: \`total += value\`";
      } else if (q.level === 4) {
        syntaxTips = "• Length: \`len(text)\` or \`len(items)\`\n• String reverse: \`text[::-1]\`\n• Parsing list: \`[int(x) for x in input().split()]\`\n• Useful built-ins: \`max(list)\`, \`sum(list)\`, \`list.sort()\`";
      } else {
        syntaxTips = "• Dictionaries: \`data[key] = value\`, \`data.get(key, default)\`\n• Loops over collections: \`for key, val in dict.items():\`\n• Functions: \`def my_func(arg): return result\`";
      }
      return `### 🛠️ Recommended Python Syntax for Level ${q.level}\n\n${syntaxTips}\n\nNeed an example of how to apply any of these? Just ask!`;
    }

    // 5. General intelligent response
    return `### 💡 Tutor Response on **${q.title}**\n\n` +
      `You asked: *"${query}"*\n\n` +
      `Here is a targeted breakdown:\n` +
      `• **Task Target:** ${q.description}\n` +
      `• **Key Concept:** ${q.explanation}\n\n` +
      `If you have written some code in the editor, click **"🔍 Find Bug in My Code"** above and I'll analyze your lines directly to pinpoint where it diverges!`;
  }

  /**
   * Detailed code inspection engine
   */
  analyzeCodeForBugs(q, code, terminalOutput) {
    if (!code || !code.trim() || code.trim() === q.starterCode.trim()) {
      return `### 🔍 Code Analysis\n\nYour editor currently only contains the initial starter comments or is empty.\n\n**Quick Start Plan:**\n1. Look at the requirement: *${q.requirements[0] || q.description}*\n2. Try writing the first 1-2 lines to read input or assign variables.\n3. Click **Run Sandbox** to see your output!`;
    }

    const issues = [];
    const suggestions = [];

    // Check for common beginner Python pitfalls
    if (code.includes("input(") && !code.includes("int(") && !code.includes("float(") && (q.id === 3 || q.id === 4 || q.id === 5 || q.id === 7 || q.id === 8 || q.id === 9 || q.id === 11 || q.id === 16 || q.id === 26)) {
      issues.push("`input()` returns strings by default! If you add two strings like `'5' + '5'`, Python produces `'55'`, not `10`.");
      suggestions.push("Wrap `input(...)` in `int(...)` or `float(...)`, for example: `num = int(input(\"Enter number: \"))`.");
    }

    if (!code.includes("print(")) {
      issues.push("Your code does not appear to contain a `print()` call.");
      suggestions.push("Python requires `print(...)` to display output in the console for test evaluation.");
    }

    if ((q.id === 11 || q.id === 14 || q.id === 15 || q.id === 16 || q.id === 17 || q.id === 18 || q.id === 19 || q.id === 20) && !code.includes("if")) {
      issues.push("This question tests **Conditions**, but your code doesn't have an `if` statement yet.");
      suggestions.push("Add conditional branching: `if <condition>:` ... `else:`.");
    }

    if ((q.id >= 21 && q.id <= 30) && !code.includes("for ") && !code.includes("while ") && !code.includes("sum(range")) {
      issues.push("This challenge tests **Loops**, but no `for` or `while` loop was found.");
      suggestions.push("Use a loop such as `for i in range(...):` to repeat the operation.");
    }

    if (code.includes("==") && code.includes("=") && (code.match(/if\s+[a-zA-Z0-9_]+\s*=\s*[a-zA-Z0-9_]+/))) {
      issues.push("Single `=` assignment found inside an `if` condition.");
      suggestions.push("Use double equals `==` to check equality; single `=` is only for assigning values.");
    }

    // Terminal error inspection
    if (terminalOutput && terminalOutput.includes("Error")) {
      issues.push(`The terminal reported: \`${terminalOutput.split("\n")[0]}\``);
    }

    let result = `### 🔍 Code Inspection for **${q.title}**\n\n`;
    if (issues.length > 0) {
      result += `**Observations to Check:**\n` + issues.map(i => `⚠️ ${i}`).join("\n\n") + `\n\n`;
      result += `**Recommended Fix:**\n` + suggestions.map(s => `✅ ${s}`).join("\n\n");
    } else {
      result += `Your code structure looks promising! Make sure the printed text matches the expected output format:\n` +
        `• **Expected:** \`${q.sampleOutput}\`\n\n` +
        `Click **"Run Sandbox"** or **"Submit Answer"** to test against the validation test suite.`;
    }

    return result;
  }

  /**
   * Real Google Gemini API live streaming/call
   */
  async callGeminiAPI(userQuery, q, code, terminalOutput) {
    const systemPrompt = `You are an expert, encouraging Python tutor at Python Practice Academy.
Your role is to guide students to understand Python concepts and solve programming problems.
Do NOT simply give away the entire complete solution immediately unless they explicitly insist.
Instead, diagnose their reasoning, explain errors, provide hints, and show concise illustrative snippets.
Be friendly, encouraging, and format responses with clean markdown and code blocks.

CURRENT CONTEXT:
Question ID: ${q ? q.id : "General"}
Title: ${q ? q.title : "General"}
Level: ${q ? q.levelName : "Python"}
Description: ${q ? q.description : "None"}
Requirements: ${q ? q.requirements.join("; ") : "None"}
Sample Output: ${q ? q.sampleOutput : "None"}

STUDENT'S CURRENT CODE IN EDITOR:
\`\`\`python
${code || "# (empty)"}
\`\`\`

LAST TERMINAL OUTPUT / ERROR:
${terminalOutput || "(no terminal output yet)"}
`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.geminiModel}:generateContent?key=${this.apiKey}`;

    const payload = {
      contents: [
        {
          role: "user",
          parts: [
            { text: systemPrompt },
            { text: `Student Question: ${userQuery}` }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 800
      }
    };

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      throw new Error(errJson.error?.message || `HTTP ${res.status}`);
    }

    const data = await res.json();
    const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    return candidateText || "I reviewed your question, but could not produce a response. Please try again!";
  }

  /**
   * Real OpenAI API live call
   */
  async callOpenAIAPI(userQuery, q, code, terminalOutput) {
    const systemPrompt = `You are an encouraging Python tutor at Python Practice Academy. Help the student with problem "${q ? q.title : 'Python'}". Don't immediately give full code away; guide them patiently with hints and explanations.`;

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Context: Question: ${q?.title}\nCode:\n${code}\nTerminal: ${terminalOutput}\n\nQuestion: ${userQuery}` }
        ],
        temperature: 0.7,
        max_tokens: 600
      })
    });

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      throw new Error(errJson.error?.message || `HTTP ${res.status}`);
    }

    const data = await res.json();
    return data.choices?.[0]?.message?.content || "No response received.";
  }

  renderMessages() {
    const container = document.getElementById("ai-messages-container");
    if (!container) return;

    let html = "";
    this.messages.forEach(msg => {
      const isUser = msg.role === "user";
      html += `
        <div class="ai-msg-row ${isUser ? 'user-row' : 'assistant-row'}">
          <div class="ai-msg-bubble ${isUser ? 'user-bubble' : 'assistant-bubble'}">
            ${this.formatMarkdown(msg.text)}
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
    container.scrollTop = container.scrollHeight;

    // Update model badge
    const badge = document.getElementById("ai-model-badge");
    if (badge) {
      if (this.apiKey && this.provider === "gemini") {
        badge.textContent = "Gemini Flash";
      } else if (this.apiKey && this.provider === "openai") {
        badge.textContent = "ChatGPT 4o-mini";
      } else {
        badge.textContent = "Offline Tutor (Free)";
      }
    }
  }

  renderLoading() {
    const container = document.getElementById("ai-messages-container");
    if (!container) return;
    const loadingHtml = `
      <div id="ai-loading-indicator" class="ai-msg-row assistant-row">
        <div class="ai-msg-bubble assistant-bubble ai-typing-indicator">
          <span></span><span></span><span></span>
        </div>
      </div>
    `;
    container.insertAdjacentHTML("beforeend", loadingHtml);
    container.scrollTop = container.scrollHeight;
  }

  clearChat() {
    this.init();
    this.renderMessages();
  }

  formatMarkdown(text) {
    if (!text) return "";
    let safe = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    // Code blocks
    safe = safe.replace(/```python([\s\S]*?)```/g, (m, code) => {
      return `<pre class="ai-code-block"><code>${code.trim()}</code></pre>`;
    });
    safe = safe.replace(/```([\s\S]*?)```/g, (m, code) => {
      return `<pre class="ai-code-block"><code>${code.trim()}</code></pre>`;
    });

    // Inline code
    safe = safe.replace(/`([^`]+)`/g, '<code class="ai-inline-code">$1</code>');

    // Headings
    safe = safe.replace(/^### (.*$)/gim, '<div class="ai-h3">$1</div>');
    safe = safe.replace(/^## (.*$)/gim, '<div class="ai-h2">$1</div>');

    // Bold
    safe = safe.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

    // Italic
    safe = safe.replace(/\*([^*]+)\*/g, '<em>$1</em>');

    // Bullets
    safe = safe.replace(/^[•\-] (.*$)/gim, '<div class="ai-bullet">• $1</div>');

    // Line breaks
    safe = safe.replace(/\n\n/g, '<div style="height: 0.6rem;"></div>');
    safe = safe.replace(/\n/g, '<br/>');

    return safe;
  }

  openSettingsModal() {
    const modalBackdrop = document.getElementById("app-modal-backdrop");
    const modalTitle = document.getElementById("modal-title");
    const modalBody = document.getElementById("modal-body");
    const confirmBtn = document.getElementById("modal-confirm-btn");

    if (!modalBackdrop || !modalTitle || !modalBody || !confirmBtn) return;

    modalTitle.textContent = "AI Tutor Settings";
    modalBody.innerHTML = `
      <p style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 1rem;">
        By default, the <strong>In-Browser AI Tutor</strong> works 100% free with ₹0 cost, using our built-in problem solver and code inspector.
      </p>
      <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1.25rem;">
        Optionally, you can connect your own Google Gemini or OpenAI API key for live cloud answers. Keys are stored in this browser's localStorage and can be read by any script running on this site, so only use keys you can afford to expose. When AI is enabled, the selected provider receives your current challenge, code draft, and prompts.
      </p>

      <div style="margin-bottom: 1rem;">
        <label style="display: block; font-size: 0.8rem; font-weight: 700; margin-bottom: 0.4rem; color: var(--text-main);">AI Engine Provider:</label>
        <select id="ai-provider-select" style="width: 100%; padding: 0.65rem; border-radius: var(--radius-md); background: #F8FAFC; color: var(--text-main); border: 1px solid var(--border-color); outline: none;">
          <option value="builtin" ${this.provider === 'builtin' ? 'selected' : ''}>Built-in In-Browser Tutor (100% Free, Zero Config)</option>
          <option value="gemini" ${this.provider === 'gemini' ? 'selected' : ''}>Google Gemini 1.5 Flash (Free API Key)</option>
          <option value="openai" ${this.provider === 'openai' ? 'selected' : ''}>OpenAI ChatGPT (User API Key)</option>
        </select>
      </div>

      <div style="margin-bottom: 1.25rem;">
        <label style="display: block; font-size: 0.8rem; font-weight: 700; margin-bottom: 0.4rem; color: var(--text-main);">API Key (Leave empty to use Free Built-in Tutor):</label>
        <input 
          type="password" 
          id="ai-api-key-input" 
          placeholder="AIzaSy... or sk-..." 
          value="" 
          style="width: 100%; padding: 0.65rem 0.85rem; border-radius: var(--radius-md); background: #F8FAFC; color: var(--text-main); border: 1px solid var(--border-color); font-family: var(--font-mono); font-size: 0.85rem; outline: none;"
        />
        <div style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 0.35rem;">
          Saved key (if any) is loaded into this field securely after opening; it is never embedded in page HTML.
        </div>
        <div style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 0.35rem;">
          Get a free Gemini API key from <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener" style="color: var(--primary-blue); font-weight: 600;">Google AI Studio</a>.
        </div>
        <div style="margin-top: 0.75rem;">
          <button type="button" class="btn btn-ghost btn-sm" id="ai-remove-key-btn" style="color: #DC2626;">Remove Saved API Key</button>
        </div>
      </div>
    `;

    confirmBtn.textContent = "Save Settings";
    confirmBtn.onclick = () => {
      const provSelect = document.getElementById("ai-provider-select");
      const keyInput = document.getElementById("ai-api-key-input");
      const newKey = keyInput ? keyInput.value.trim() : "";
      const newProv = provSelect ? provSelect.value : "builtin";

      this.saveApiKey(newKey, newKey ? newProv : "builtin");
      this.renderMessages();
      window.closeModal();
    };

    const removeBtn = document.getElementById("ai-remove-key-btn");
    if (removeBtn) {
      removeBtn.onclick = () => {
        this.saveApiKey("", "builtin");
        const keyInput = document.getElementById("ai-api-key-input");
        if (keyInput) keyInput.value = "";
        const provSelect = document.getElementById("ai-provider-select");
        if (provSelect) provSelect.value = "builtin";
        this.renderMessages();
        window.closeModal();
      };
    }

    modalBackdrop.classList.add("open");
    // Load saved key into the field without embedding it in HTML.
    const keyInput = document.getElementById("ai-api-key-input");
    if (keyInput) keyInput.value = this.apiKey || "";
  }
}

// Global instance
const aiTutor = new AITutor();
if (typeof window !== "undefined") {
  window.aiTutor = aiTutor;
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      aiTutor.createDrawerDOM();
    });
  } else {
    aiTutor.createDrawerDOM();
  }
}
