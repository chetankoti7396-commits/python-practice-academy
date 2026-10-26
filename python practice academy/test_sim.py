import json
import re

# Let's inspect how to write the JS simulator
simulator_js = """
function simulatePython(code, inputs = []) {
  const outputLines = [];
  const inputQueue = Array.isArray(inputs) ? [...inputs] : [];

  // Built-in environment
  const __print = (...args) => {
    outputLines.push(args.map(a => (typeof a === "object" && a !== null ? (Array.isArray(a) ? `[${a.join(', ')}]` : JSON.stringify(a)) : String(a))).join(" "));
  };

  const __input = (prompt) => {
    if (inputQueue.length > 0) return String(inputQueue.shift());
    return "";
  };

  // Convert Python code to JS
  const lines = code.split(/\\r?\\n/);
  const jsLines = [
    "var __print = arguments[0];",
    "var __input = arguments[1];",
    "function int(x) { return parseInt(x, 10) || 0; }",
    "function float(x) { return parseFloat(x) || 0; }",
    "function str(x) { return String(x); }",
    "function len(x) { return x ? (x.length !== undefined ? x.length : Object.keys(x).length) : 0; }",
    "function sum(x) { return Array.isArray(x) ? x.reduce((a, b) => Number(a) + Number(b), 0) : 0; }",
    "function max(...x) { const arr = (x.length === 1 && Array.isArray(x[0])) ? x[0] : x; return Math.max(...arr.map(Number)); }",
    "function min(...x) { const arr = (x.length === 1 && Array.isArray(x[0])) ? x[0] : x; return Math.min(...arr.map(Number)); }",
    "function abs(x) { return Math.abs(Number(x)); }",
    "function range(a, b, step) {",
    "  if (b === undefined) { b = a; a = 0; }",
    "  step = step || 1;",
    "  const res = [];",
    "  for (let i = a; step > 0 ? i < b : i > b; i += step) res.push(i);",
    "  return res;",
    "}"
  ];

  const indentStack = [0];

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    if (!trimmed || trimmed.startsWith("#")) continue;

    const currentIndent = rawLine.search(/\\S/);

    // Pop indents
    while (indentStack.length > 1 && currentIndent < indentStack[indentStack.length - 1]) {
      indentStack.pop();
      jsLines.push("}");
    }

    let l = trimmed;

    // input()
    l = l.replace(/\\binput\\((.*?)\\)/g, '__input($1)');

    // print(...)
    if (l.startsWith("print(") && l.endsWith(")")) {
      const inner = l.slice(6, -1);
      jsLines.push(`__print(${inner});`);
      continue;
    }

    // def func(args):
    const defMatch = l.match(/^def\\s+([a-zA-Z_]\\w*)\\s*\\((.*?)\\)\\s*:/);
    if (defMatch) {
      let [_, fnName, args] = defMatch;
      const cleanArgs = args.split(',').map(a => a.trim()).filter(a => a !== 'self').join(', ');
      if (indentStack.length > 1 && indentStack[indentStack.length - 1] > 0 && jsLines[jsLines.length - 1].includes("class ")) {
        if (fnName === "__init__") fnName = "constructor";
        jsLines.push(`${fnName}(${cleanArgs}) {`);
      } else {
        jsLines.push(`function ${fnName}(${cleanArgs}) {`);
      }
      indentStack.push(currentIndent + 4);
      continue;
    }

    // class Name or class Name(Parent):
    const classMatch = l.match(/^class\\s+([a-zA-Z_]\\w*)(?:\\((.*?)\\))?\\s*:/);
    if (classMatch) {
      const [_, clsName, parent] = classMatch;
      if (parent && parent.trim()) {
        jsLines.push(`class ${clsName} extends ${parent.trim()} {`);
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
      // close previous if block
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

    // for x in arr:
    const forMatch = l.match(/^for\\s+([a-zA-Z_]\\w*)\\s+in\\s+(.*?)\\s*:/);
    if (forMatch) {
      const [_, varName, iter] = forMatch;
      jsLines.push(`for (var ${varName} of ${iter}) {`);
      indentStack.push(currentIndent + 4);
      continue;
    }

    // for _ in range(...):
    const forRangeMatch = l.match(/^for\\s+_\\s+in\\s+(.*?)\\s*:/);
    if (forRangeMatch) {
      const [_, iter] = forRangeMatch;
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

    // Common Python keywords & replacements
    l = l.replace(/\\bself\\./g, "this.");
    l = l.replace(/\\bsuper\\(\\)\\.__init__\\(/g, "super(");
    l = l.replace(/\\bTrue\\b/g, "true");
    l = l.replace(/\\bFalse\\b/g, "false");
    l = l.replace(/\\bNone\\b/g, "null");
    l = l.replace(/\\band\\b/g, "&&");
    l = l.replace(/\\bor\\b/g, "||");
    l = l.replace(/\\bnot\\b/g, "!");
    l = l.replace(/\\.strip\\(\\)/g, ".trim()");
    l = l.replace(/\\.lower\\(\\)/g, ".toLowerCase()");
    l = l.replace(/\\.upper\\(\\)/g, ".toUpperCase()");

    // var assignment if top-level or method
    if (/^[a-zA-Z_]\\w*\\s*=\\s*/.test(l) && !/^(var|let|const|return|this\\.)/.test(l)) {
      l = "var " + l;
    }

    jsLines.push(l + (l.endsWith(";") ? "" : ";"));
  }

  while (indentStack.length > 1) {
    indentStack.pop();
    jsLines.push("}");
  }

  try {
    const fn = new Function(jsLines.join("\\n"));
    fn(__print, __input);
    return { stdout: outputLines.join("\\n").trim(), error: null };
  } catch(e) {
    return { stdout: outputLines.join("\\n").trim(), error: e.message };
  }
}
"""

print("Simulator draft ready")
