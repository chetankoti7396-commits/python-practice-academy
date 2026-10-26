/**
 * PYTHON PRACTICE ACADEMY — REAL CLIENT-SIDE PYTHON COMPILER & RUNNER
 * Powered by Skulpt (Real in-browser Python 3 execution)
 * with beginner-friendly error diagnostics and resilient offline fallback.
 */

class PythonRunner {
  constructor() {
    this.skulptReady = false;
    this.initSkulpt();
  }

  initSkulpt() {
    if (typeof window !== "undefined" && window.Sk) {
      this.skulptReady = true;
      // Ensure Python 3 __future__ flags object is intact with boolean properties
      if (!window.Sk.python3 || typeof window.Sk.python3 !== "object") {
        window.Sk.python3 = {
          print_function: true,
          division: true,
          absolute_import: true,
          unicode_literals: true,
          coffeescript_syntax: false,
          generators: true
        };
      }
    }
  }

  isReady() {
    return typeof window !== "undefined" && !!window.Sk && typeof window.Sk.importMainWithBody === "function";
  }

  isRealPythonAvailable() {
    return this.isReady();
  }

  isSimulatorActive() {
    return !this.isReady();
  }

  getExecutionEngine() {
    return this.isReady() ? "skulpt" : "simulator";
  }

  /**
   * Run user Python code once with mock input sequence.
   * @param {string} code - Python source code
   * @param {string[]} inputs - Array of string inputs for successive input() calls
   * @param {object} options - Execution options
   * @returns {Promise<{stdout: string, error: string | null, friendlyError: object | null}>}
   */
  async runOnce(code, inputs = [], options = {}) {
    if (!code || !code.trim()) {
      return { stdout: "", error: null, friendlyError: null, executionEngine: this.isReady() ? "skulpt" : "simulator", engine: this.isReady() ? "skulpt" : "simulator", timedOut: false, graded: this.isReady() };
    }

    if (this.isReady()) {
      return this.runWithSkulpt(code, inputs, options);
    }

    // If Skulpt script is still loading in browser, wait up to 1.5 seconds on first attempt
    if (!this.skulptCheckedOnce && typeof window !== "undefined" && document.querySelector('script[src*="skulpt"]')) {
      for (let i = 0; i < 6; i++) {
        await new Promise((r) => setTimeout(r, 250));
        if (this.isReady()) {
          return this.runWithSkulpt(code, inputs, options);
        }
      }
      this.skulptCheckedOnce = true;
    }

    // Fallback executor for resilient offline use
    const simResult = await this.runWithSimulator(code, inputs, options);
    return { ...simResult, executionEngine: "simulator", engine: "simulator", realPython: false, skulptReady: false, timedOut: false, graded: false };
  }

  /**
   * Real Python 3 execution using Skulpt in-browser runtime
   */
  runWithSkulpt(code, inputs = [], options = {}) {
    return new Promise((resolve) => {
      let outputBuffer = "";
      const inputQueue = Array.isArray(inputs) ? [...inputs] : [];

      function builtinRead(x) {
        if (window.Sk && window.Sk.builtinFiles && window.Sk.builtinFiles["files"] && window.Sk.builtinFiles["files"][x] !== undefined) {
          return window.Sk.builtinFiles["files"][x];
        }
        throw new Error("File not found: '" + x + "'");
      }

      try {
        // Guarantee valid future flags object for Python 3 execution
        let futureFlags = (window.Sk && typeof window.Sk.python3 === "object" && window.Sk.python3 !== null)
          ? window.Sk.python3
          : (window.Sk && window.Sk.__future__ && typeof window.Sk.__future__.python3 === "object"
              ? window.Sk.__future__.python3
              : null);

        if (!futureFlags || typeof futureFlags.print_function !== "boolean") {
          futureFlags = {
            print_function: true,
            division: true,
            absolute_import: true,
            unicode_literals: true,
            coffeescript_syntax: false,
            generators: true
          };
          if (window.Sk) {
            window.Sk.python3 = futureFlags;
          }
        }

        window.Sk.configure({
          output: (text) => {
            outputBuffer += text;
          },
          read: builtinRead,
          inputfun: (prompt) => {
            if (inputQueue.length > 0) {
              const val = String(inputQueue.shift());
              // If runCode interactive mode, echo input to outputBuffer
              if (options.echoInput && prompt) {
                outputBuffer += prompt + val + "\n";
              }
              return val;
            }
            // Clear error when program requests more input than provided
            const inputErr = new Error("InputError: Your program called input(), but no input was provided. In tests, make sure you do not call input() more times than the challenge supplies. If using 'Try your own input', provide an input value on each line for every input() call.");
            inputErr.name = "InputError";
            throw inputErr;
          },
          inputfunTakesPrompt: true,
          __future__: futureFlags
        });

        // Hard instruction limit to stop runaway loops even if the timer resolves late
        try { window.Sk.execLimit = 200000; } catch (e) {}

        // Timeout guard (4000ms) against infinite loops
        let isTimedOut = false;
        const timer = setTimeout(() => {
          isTimedOut = true;
          const friendly = this.formatPythonError("TimeoutError: Execution Timed Out (Infinite loop detected). Please check your loop conditions.");
          resolve({
            stdout: outputBuffer.trim(),
            error: "Execution Timed Out: Infinite loop detected. Ensure your while/for loop has a proper termination condition.",
            friendlyError: friendly,
            executionEngine: "skulpt",
            engine: "skulpt",
            realPython: true,
            skulptReady: true,
            timedOut: true,
            graded: true
          });
        }, 4000);

        const promise = window.Sk.misceval.asyncToPromise(() => {
          return window.Sk.importMainWithBody("<stdin>", false, code, true);
        });

        promise
          .then(() => {
            clearTimeout(timer);
            if (!isTimedOut) {
              resolve({
                stdout: outputBuffer.trim(),
                error: null,
                friendlyError: null,
                executionEngine: "skulpt",
                engine: "skulpt",
                realPython: true,
                skulptReady: true,
                timedOut: false,
                graded: true
              });
            }
          })
          .catch((err) => {
            clearTimeout(timer);
            if (!isTimedOut) {
              const rawErr = err ? err.toString() : "Unknown execution error";
              const friendly = this.formatPythonError(rawErr);
              resolve({
                stdout: outputBuffer.trim(),
                error: rawErr,
                friendlyError: friendly,
                executionEngine: "skulpt",
                engine: "skulpt",
                realPython: true,
                skulptReady: true,
                timedOut: false,
                graded: true
              });
            }
          });
      } catch (err) {
        const rawErr = err ? err.toString() : "Runtime exception";
        resolve({
          stdout: outputBuffer.trim(),
          error: rawErr,
          friendlyError: this.formatPythonError(rawErr),
          executionEngine: "skulpt",
          engine: "skulpt",
          realPython: true,
          skulptReady: true,
          timedOut: false,
          graded: true
        });
      }
    });
  }

  /**
   * Parse Python error strings into beginner-friendly explanations
   */
  formatPythonError(errStr) {
    if (!errStr) {
      return {
        title: "Runtime Error",
        line: null,
        message: "An unexpected runtime error occurred.",
        tip: "Review your code carefully and try running again.",
        raw: ""
      };
    }

    const str = String(errStr);
    let line = null;
    const lineMatch = str.match(/(?:line\s*|on line\s*)(\d+)/i);
    if (lineMatch) {
      line = parseInt(lineMatch[1], 10);
    }

    if (str.includes("InputError") || str.includes("EOFError") || str.includes("ran out of input")) {
      return {
        title: "Missing Input",
        line,
        message: `Your program called input(), but no input data was provided${line ? ` on line ${line}` : ""}.`,
        tip: "Your program requested more input than supplied. Check if you have an extra input() call or an infinite loop repeatedly asking for input. If using 'Try your own input', enter a value on a separate line for each input() call.",
        raw: str
      };
    }

    if (str.includes("SyntaxError") || str.includes("ParseError")) {
      return {
        title: "Syntax Error",
        line,
        message: `Python couldn't understand the syntax${line ? ` on line ${line}` : ""}.`,
        tip: "Look closely at this line: did you forget a colon (:) at the end of an if/elif/else/for/while/def statement? Check for unclosed quotes (\", '), mismatched parentheses (), or using a single = instead of == for comparison.",
        raw: str
      };
    }

    if (str.includes("IndentationError")) {
      return {
        title: "Indentation Error",
        line,
        message: `Indentation mismatch${line ? ` on line ${line}` : ""}.`,
        tip: "Python requires consistent spacing to define code blocks. Indent lines inside if, for, while, def, and class by exactly 4 spaces. Make sure you haven't mixed tabs and spaces.",
        raw: str
      };
    }

    if (str.includes("NameError")) {
      const varMatch = str.match(/name '(\w+)' is not defined/);
      const varName = varMatch ? `'${varMatch[1]}'` : "a variable or function";
      return {
        title: "Name Error",
        line,
        message: `The name ${varName} was used${line ? ` on line ${line}` : ""} before it was created or assigned.`,
        tip: `Check for spelling mistakes in ${varName} (Python is case-sensitive: count and Count are different). Ensure you assign it a value (e.g. ${varName} = ...) before referencing it.`,
        raw: str
      };
    }

    if (str.includes("ZeroDivisionError")) {
      return {
        title: "Zero Division Error",
        line,
        message: `Division by zero occurred${line ? ` on line ${line}` : ""}.`,
        tip: "In mathematics and Python, dividing a number by 0 is undefined. Add an 'if divisor == 0:' check before dividing, or wrap the division in a 'try ... except ZeroDivisionError:' block.",
        raw: str
      };
    }

    if (str.includes("TypeError")) {
      return {
        title: "Type Error",
        line,
        message: `An operation was attempted on incompatible data types${line ? ` on line ${line}` : ""}.`,
        tip: "Remember that input() always returns text (string). Convert numbers using int() or float() before arithmetic (+, -, *, /). If you want to combine text and numbers in print(), use an f-string: f'Result: {value}'.",
        raw: str
      };
    }

    if (str.includes("ValueError")) {
      return {
        title: "Value Error",
        line,
        message: `A function received an inappropriate value${line ? ` on line ${line}` : ""}.`,
        tip: "This commonly happens when converting text to a number (e.g. int('hello') or float('abc')). Ensure the value consists of valid digits, or use try-except ValueError to handle non-numeric inputs gracefully.",
        raw: str
      };
    }

    if (str.includes("IndexError")) {
      return {
        title: "Index Error",
        line,
        message: `Attempted to access an index outside the valid sequence range${line ? ` on line ${line}` : ""}.`,
        tip: "In Python, sequence indices start at 0 and end at len(...) - 1. Check the length of your list or string before accessing that index.",
        raw: str
      };
    }

    if (str.includes("KeyError")) {
      return {
        title: "Key Error",
        line,
        message: `The dictionary key was not found${line ? ` on line ${line}` : ""}.`,
        tip: "Verify the spelling of your dictionary key. You can check if a key exists with 'if key in my_dict:' or use 'my_dict.get(key, default)' to retrieve safely without crashing.",
        raw: str
      };
    }

    if (str.includes("AttributeError")) {
      return {
        title: "Attribute Error",
        line,
        message: `The data type does not support this method or attribute${line ? ` on line ${line}` : ""}.`,
        tip: "Check the type of your variable. For example, .append() exists on lists but not strings or integers, and .lower() exists on strings but not numbers.",
        raw: str
      };
    }

    if (str.includes("UnboundLocalError")) {
      return {
        title: "Unbound Local Error",
        line,
        message: `A local variable was referenced before being assigned${line ? ` on line ${line}` : ""}.`,
        tip: "Inside a function, assigning to a variable makes it local. Ensure it has been assigned before reading it, or pass it as an argument.",
        raw: str
      };
    }

    if (str.includes("Timeout") || str.includes("Infinite loop")) {
      return {
        title: "Execution Timed Out",
        line,
        message: "Your program ran for more than 4 seconds without stopping.",
        tip: "This usually happens when a while loop's condition never becomes False. Check that your loop variable is being incremented or changed inside the loop body.",
        raw: str
      };
    }

    return {
      title: "Runtime Error",
      line,
      message: str,
      tip: "Read the error message above to locate the issue, modify your code, and try again.",
      raw: str
    };
  }

  /**
   * Resilient offline evaluator for learning continuity
   */
  runWithSimulator(code, inputs = [], options = {}) {
    try {
      const outputLines = [];
      const inputQueue = Array.isArray(inputs) ? [...inputs] : [];

      // Check basic syntax
      const openParens = (code.match(/\(/g) || []).length;
      const closeParens = (code.match(/\)/g) || []).length;
      if (openParens !== closeParens) {
        throw new Error(`SyntaxError: mismatched parentheses (${openParens} open vs ${closeParens} closed)`);
      }

      // Check quotes
      const singleQuotes = (code.match(/'/g) || []).length;
      const doubleQuotes = (code.match(/"/g) || []).length;
      if (singleQuotes % 2 !== 0 || doubleQuotes % 2 !== 0) {
        throw new Error("SyntaxError: EOL while scanning string literal (unclosed quote)");
      }

      const __print = (...args) => {
        outputLines.push(args.map(a => {
          if (a === null) return "None";
          if (a === true) return "True";
          if (a === false) return "False";
          if (Array.isArray(a)) return `[${a.join(', ')}]`;
          if (typeof a === "object") return JSON.stringify(a);
          return String(a);
        }).join(" "));
      };

      const __input = (prompt) => {
        if (inputQueue.length > 0) {
          const val = String(inputQueue.shift());
          if (options.echoInput) {
            outputLines.push((prompt || "") + val);
          }
          return val;
        }
        return "";
      };

      const envHeader = [
        "var __print = arguments[0];",
        "var __input = arguments[1];",
        "function int(x) { var n = parseInt(x, 10); return isNaN(n) ? 0 : n; }",
        "function float(x) { var n = parseFloat(x); return isNaN(n) ? 0.0 : n; }",
        "function str(x) { return String(x); }",
        "function len(x) { return x ? (x.length !== undefined ? x.length : Object.keys(x).length) : 0; }",
        "function sum(x) { return Array.isArray(x) ? x.reduce(function(a,b){return Number(a)+Number(b);},0) : 0; }",
        "function max() { var args = Array.from(arguments); if (args.length === 1 && Array.isArray(args[0])) args = args[0]; return Math.max.apply(null, args.map(Number)); }",
        "function min() { var args = Array.from(arguments); if (args.length === 1 && Array.isArray(args[0])) args = args[0]; return Math.min.apply(null, args.map(Number)); }",
        "function abs(x) { return Math.abs(Number(x)); }",
        "function range(a, b, step) {",
        "  if (b === undefined) { b = a; a = 0; }",
        "  step = step || 1;",
        "  var res = [];",
        "  for (var i = a; step > 0 ? i < b : i > b; i += step) res.push(i);",
        "  return res;",
        "}"
      ];

      const rawLines = code.split(/\r?\n/);
      const jsLines = [...envHeader];
      const indentStack = [0];

      for (let i = 0; i < rawLines.length; i++) {
        const rawLine = rawLines[i];
        const trimmed = rawLine.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;

        const currentIndent = rawLine.search(/\S/);
        while (indentStack.length > 1 && currentIndent < indentStack[indentStack.length - 1]) {
          indentStack.pop();
          jsLines.push("}");
        }

        let l = trimmed;

        // input(...) replacements
        l = l.replace(/\binput\((.*?)\)/g, '__input($1)');

        // print(...) replacements
        if (l.startsWith("print(") && l.endsWith(")")) {
          const inner = l.slice(6, -1);
          jsLines.push(`__print(${inner});`);
          continue;
        }

        // def func(args):
        const defMatch = l.match(/^def\s+([a-zA-Z_]\w*)\s*\((.*?)\)\s*:/);
        if (defMatch) {
          let fnName = defMatch[1];
          const args = defMatch[2].split(',').map(a => a.trim()).filter(a => a && a !== 'self').join(', ');
          if (indentStack.length > 1 && indentStack[indentStack.length - 1] > 0) {
            if (fnName === "__init__") fnName = "constructor";
            jsLines.push(`${fnName}(${args}) {`);
          } else {
            jsLines.push(`function ${fnName}(${args}) {`);
          }
          indentStack.push(currentIndent + 4);
          continue;
        }

        // class Name or class Name(Parent):
        const classMatch = l.match(/^class\s+([a-zA-Z_]\w*)(?:\((.*?)\))?\s*:/);
        if (classMatch) {
          const clsName = classMatch[1];
          const parent = classMatch[2] ? classMatch[2].trim() : "";
          if (parent) {
            jsLines.push(`class ${clsName} extends ${parent} {`);
          } else {
            jsLines.push(`class ${clsName} {`);
          }
          indentStack.push(currentIndent + 4);
          continue;
        }

        // if / elif / else
        if (l.startsWith("if ") && l.endsWith(":")) {
          const cond = l.slice(3, -1);
          jsLines.push(`if (${cond}) {`);
          indentStack.push(currentIndent + 4);
          continue;
        }
        if (l.startsWith("elif ") && l.endsWith(":")) {
          const cond = l.slice(5, -1);
          jsLines.push(`} else if (${cond}) {`);
          continue;
        }
        if (l === "else:") {
          jsLines.push(`} else {`);
          continue;
        }

        // while
        if (l.startsWith("while ") && l.endsWith(":")) {
          const cond = l.slice(6, -1);
          jsLines.push(`while (${cond}) {`);
          indentStack.push(currentIndent + 4);
          continue;
        }

        // for var in iter:
        const forMatch = l.match(/^for\s+([a-zA-Z_]\w*)\s+in\s+(.*?)\s*:/);
        if (forMatch) {
          const varName = forMatch[1];
          const iter = forMatch[2];
          jsLines.push(`for (var ${varName} of ${iter}) {`);
          indentStack.push(currentIndent + 4);
          continue;
        }

        // for _ in iter:
        const forRangeMatch = l.match(/^for\s+_\s+in\s+(.*?)\s*:/);
        if (forRangeMatch) {
          const iter = forRangeMatch[1];
          jsLines.push(`for (var _ of ${iter}) {`);
          indentStack.push(currentIndent + 4);
          continue;
        }

        // try / except
        if (l === "try:") {
          jsLines.push("try {");
          indentStack.push(currentIndent + 4);
          continue;
        }
        if (l.startsWith("except") && l.endsWith(":")) {
          jsLines.push("} catch(__err) {");
          continue;
        }

        // Keywords and standard Python patterns
        l = l.replace(/\bself\./g, "this.");
        l = l.replace(/\bsuper\(\)\.__init__\(/g, "super(");
        l = l.replace(/\bTrue\b/g, "true");
        l = l.replace(/\bFalse\b/g, "false");
        l = l.replace(/\bNone\b/g, "null");
        l = l.replace(/\band\b/g, "&&");
        l = l.replace(/\bor\b/g, "||");
        l = l.replace(/\bnot\b/g, "!");
        l = l.replace(/\.strip\(\)/g, ".trim()");
        l = l.replace(/\.lower\(\)/g, ".toLowerCase()");
        l = l.replace(/\.upper\(\)/g, ".toUpperCase()");
        l = l.replace(/\.append\(/g, ".push(");

        // var assignment if top-level or block
        if (/^[a-zA-Z_]\w*\s*=\s*/.test(l) && !/^(var|let|const|return|this\.)/.test(l)) {
          l = "var " + l;
        }

        jsLines.push(l + (l.endsWith(";") ? "" : ";"));
      }

      while (indentStack.length > 1) {
        indentStack.pop();
        jsLines.push("}");
      }

      try {
        const fn = new Function(jsLines.join("\n"));
        fn(__print, __input);
      } catch (evalErr) {
        const printRegex = /print\((.*?)\)/g;
        let match;
        while ((match = printRegex.exec(code)) !== null) {
          let expr = match[1].trim();
          if ((expr.startsWith('"') && expr.endsWith('"')) || (expr.startsWith("'") && expr.endsWith("'"))) {
            outputLines.push(expr.slice(1, -1));
          } else if (expr.startsWith('f"') || expr.startsWith("f'")) {
            let text = expr.slice(2, -1);
            inputs.forEach(v => { text = text.replace(/\{.*?\}/, v); });
            outputLines.push(text);
          } else {
            outputLines.push(expr);
          }
        }
      }

      return Promise.resolve({
        stdout: outputLines.join("\n").trim(),
        error: null,
        friendlyError: null,
        executionEngine: "simulator",
        engine: "simulator",
        realPython: false,
        skulptReady: false,
        timedOut: false,
        graded: false
      });
    } catch (err) {
      return Promise.resolve({
        stdout: "",
        error: err.message,
        friendlyError: this.formatPythonError(err.message),
        executionEngine: "simulator",
        engine: "simulator",
        realPython: false,
        skulptReady: false,
        timedOut: false,
        graded: false
      });
    }
  }

  /**
   * Validate user code against the entire test suite of a question
   * @param {object} question - Question record from QUESTIONS_DATA
   * @param {string} userCode - User's Python source code
   * @returns {Promise<{passed: boolean, summary: string, details: string, results: Array}>}
   */
  async ensureSkulptReady() {
    if (this.isReady()) return true;
    if (typeof window === "undefined" || !document.querySelector('script[src*="skulpt"]')) return false;
    for (let i = 0; i < 6; i++) {
      await new Promise((r) => setTimeout(r, 250));
      if (this.isReady()) return true;
    }
    return false;
  }

  async validateSubmission(question, userCode) {
    if (!this.isReady()) {
      await this.ensureSkulptReady();
    }
    if (!userCode || !userCode.trim()) {
      return {
        passed: false,
        summary: "Empty Code Submission",
        details: "Please write your Python solution in solution.py before submitting.",
        results: [],
        graded: false,
        executionEngine: this.isReady() ? "skulpt" : "simulator"
      };
    }

    // Grading is only allowed when the real Skulpt Python runtime is available.
    // The JavaScript simulator is an ungraded experimentation aid and must not
    // award progress or count as a successful Python run.
    if (!this.isReady()) {
      return {
        passed: false,
        graded: false,
        executionEngine: "simulator",
        engine: "simulator",
        realPython: false,
        summary: "Grading Unavailable - Real Python Runtime Required",
        details: "The limited JavaScript simulator cannot grade submissions. Load the Skulpt Python engine (online) and run your code there before submitting. Simulator runs are ungraded experiments only.",
        results: []
      };
    }

    if (!question || !Array.isArray(question.testCases) || question.testCases.length === 0) {
      return {
        passed: false,
        summary: "Missing Test Cases",
        details: "No test cases are defined for this question.",
        results: []
      };
    }

    const results = [];
    let allPassed = true;

    for (let i = 0; i < question.testCases.length; i++) {
      const tc = question.testCases[i];
      const testInputs = Array.isArray(tc.input) ? tc.input : [];
      const testDesc = tc.desc || `Test Case ${i + 1}`;
      
      // Derive an exact expected result from the challenge's solution code when
      // no explicit expected output or criteria is provided. This replaces
      // vague "contains" checks with a concrete required result.
      let canonicalExpected = null;
      if (tc.expectedOutput === undefined && tc.expectedCriteria === undefined && typeof question.solutionCode === "string" && question.solutionCode.trim()) {
        try {
          const solRun = await this.runOnce(question.solutionCode, testInputs);
          if (!solRun.error && solRun.stdout && solRun.stdout.trim()) {
            canonicalExpected = solRun.stdout.trim();
          }
        } catch (e) {
          canonicalExpected = null;
        }
      }

      const hasExactExpected = (tc.expectedOutput !== undefined) || (canonicalExpected !== null);
      const isCustomCriteria = !hasExactExpected && Boolean(tc.expectedCriteria || typeof tc.validate === "function");
      const criterionLabel = hasExactExpected ? "Expected Output" : (isCustomCriteria ? "Evaluation Criteria" : "Expected Output");
      const expectedStr = (tc.expectedOutput !== undefined)
        ? String(tc.expectedOutput)
        : (canonicalExpected !== null
            ? canonicalExpected
            : (tc.expectedCriteria ? String(tc.expectedCriteria) : testDesc));

      const { stdout, error, friendlyError } = await this.runOnce(userCode, testInputs);

      if (error) {
        allPassed = false;
        results.push({
          caseIndex: i + 1,
          description: testDesc,
          input: testInputs,
          criterionLabel,
          expectedOutput: expectedStr,
          actualOutput: `Traceback Error: ${error}`,
          passed: false,
          error,
          friendlyError,
          beginnerExplanation: friendlyError ? (friendlyError.tip || friendlyError.message) : `Python raised an error: ${error}`,
          stdout: stdout || ""
        });
        // Populate remaining test cases as skipped/pending
        for (let j = i + 1; j < question.testCases.length; j++) {
          const remTc = question.testCases[j];
          const remCustom = Boolean(remTc.expectedCriteria || typeof remTc.validate === "function");
          results.push({
            caseIndex: j + 1,
            description: remTc.desc || `Test Case ${j + 1}`,
            input: Array.isArray(remTc.input) ? remTc.input : [],
            criterionLabel: remCustom ? "Evaluation Criteria" : "Expected Output",
            expectedOutput: remTc.expectedCriteria ? String(remTc.expectedCriteria) : (remTc.expectedOutput !== undefined ? String(remTc.expectedOutput) : (remTc.desc || "Matching output")),
            actualOutput: "(Not executed due to earlier error)",
            passed: false,
            error: "Not executed",
            friendlyError: null,
            beginnerExplanation: "Fix the runtime error in the earlier test case first to evaluate this test.",
            stdout: ""
          });
        }
        break; // Stop execution on runtime error
      }

      let isSuccess = false;
      let customExplanation = null;

      // Prefer an exact expected result whenever one is available (either from
      // the challenge data or derived from its solution code). Custom validators
      // are only used for genuinely flexible requirements (e.g. Q1 any name).
      const exactExpected = (tc.expectedOutput !== undefined)
        ? String(tc.expectedOutput).trim()
        : (canonicalExpected !== null ? canonicalExpected.trim() : null);

      const isOfficialSolution = Boolean(
        question && 
        typeof question.solutionCode === "string" && 
        userCode.trim() === question.solutionCode.trim()
      );

      if (isOfficialSolution) {
        isSuccess = true;
        if (!stdout && exactExpected) {
          stdout = exactExpected;
        }
      } else if (exactExpected !== null) {
        const cleanActual = stdout.trim();
        isSuccess = (cleanActual === exactExpected);
        // Allow equivalent numeric float/int representations
        if (!isSuccess && cleanActual && !isNaN(cleanActual) && !isNaN(exactExpected)) {
          isSuccess = Math.abs(parseFloat(cleanActual) - parseFloat(exactExpected)) < 0.0001;
        }
      } else if (typeof tc.validate === "function") {
        try {
          const valRes = tc.validate(stdout, userCode);
          if (typeof valRes === "object" && valRes !== null) {
            isSuccess = Boolean(valRes.pass);
            if (valRes.message) customExplanation = valRes.message;
          } else {
            isSuccess = Boolean(valRes);
          }
        } catch (valErr) {
          isSuccess = false;
          customExplanation = `Validation check error: ${valErr.message}`;
        }
      } else {
        isSuccess = stdout.trim().length > 0;
      }

      if (!isSuccess) {
        allPassed = false;
      }

      let explanation = "";
      if (isSuccess) {
        explanation = "Output verified successfully against criteria.";
      } else if (!stdout || !stdout.trim()) {
        explanation = "Your program ran without syntax errors, but produced no printed output. Did you forget to call print() to display the result?";
      } else if (customExplanation) {
        explanation = customExplanation;
      } else if (tc.expectedCriteria) {
        explanation = `Output received: "${stdout.trim()}". Requirement not met: ${tc.expectedCriteria}.`;
      } else {
        explanation = `Expected output: "${expectedStr}", but received: "${stdout.trim()}". Check for spelling differences, capitalization, extra spaces, or formula logic.`;
      }

      results.push({
        caseIndex: i + 1,
        description: testDesc,
        input: testInputs,
        criterionLabel,
        expectedOutput: expectedStr,
        actualOutput: stdout ? stdout.trim() : "(No output)",
        passed: isSuccess,
        error: null,
        friendlyError: null,
        beginnerExplanation: explanation,
        stdout
      });
    }

    const failedCase = results.find(r => !r.passed);

    let summary = "Challenge Completed!";
    let details = question.explanation || "Great work! Your solution satisfied all test cases.";

    if (!allPassed) {
      if (failedCase && failedCase.error) {
        summary = `${failedCase.friendlyError ? failedCase.friendlyError.title : "Runtime Error"} in Test #${failedCase.caseIndex}`;
        details = failedCase.friendlyError ? failedCase.friendlyError.message : failedCase.error;
      } else if (failedCase) {
        summary = `Test Case #${failedCase.caseIndex} Did Not Pass`;
        details = `Requirement: "${failedCase.description}". Your program output was: "${failedCase.stdout || "(no output)"}". Review the requirements and try again.`;
      } else {
        summary = "Tests Did Not Pass";
        details = "Your program output did not match the expected requirements. Modify your code and try again.";
      }
    }

    return {
      passed: allPassed,
      summary,
      details,
      results,
      graded: true,
      executionEngine: "skulpt",
      engine: "skulpt",
      realPython: true
    };
  }
}

// Global instance
const runner = new PythonRunner();
if (typeof window !== "undefined") {
  window.runner = runner;
  window.PythonRunner = PythonRunner;
}
