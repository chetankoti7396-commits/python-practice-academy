/**
 * PYTHON PRACTICE ACADEMY — COMPLETE 50-QUESTION DATA BANK
 * Categorized into 5 progressive levels.
 */

const QUESTIONS_DATA = [
  // ==========================================
  // LEVEL 1: VARIABLES AND BASIC MATHS (Q1-Q10)
  // ==========================================
  {
    id: 1,
    level: 1,
    levelName: "Variables and Basic Maths",
    title: "Print Your Name",
    difficulty: "Beginner",
    description: "Write a Python program that prints your name (or any name) to the console using the built-in print() function.",
    requirements: [
      "Use the print() function.",
      "Output a non-empty string containing a name."
    ],
    sampleInput: "No input required",
    sampleOutput: "Alice",
    hint: "You can print directly like print('Alice'), or store it in a variable like name = 'Alice' then print(name). Any name will pass!",
    starterCode: "# Write a program to print your name\n# Example: print(\"Alex\")\n\n",
    solutionCode: "name = \"Alex\"\nprint(name)",
    explanation: "The print() function outputs data to standard output. String literals are enclosed in quotes.",
    testCases: [
      { input: [], expectedCriteria: "Prints a non-empty name (any name is accepted)", validate: (out) => out.trim().length > 0, desc: "Prints a non-empty name" }
    ]
  },
  {
    id: 2,
    level: 1,
    levelName: "Variables and Basic Maths",
    title: "Greeting from User Name",
    difficulty: "Beginner",
    description: "Ask the user to enter their name using input(), and print a warm greeting in the format: 'Hello, <name>!'",
    requirements: [
      "Read name using input().",
      "Print greeting containing 'Hello' and the user's name."
    ],
    sampleInput: "Alex",
    sampleOutput: "Hello, Alex!",
    hint: "You can format strings using f-strings: f\"Hello, {name}!\" or concatenation.",
    starterCode: "# Ask the user for their name and print a greeting\nname = input(\"Enter your name: \")\n",
    solutionCode: "name = input(\"Enter your name: \")\nprint(f\"Hello, {name}!\")",
    explanation: "f-strings (formatted string literals) allow embedding expressions inside string literals using curly braces {}.",
    testCases: [
      { input: ["Alex"], validate: (out) => out.toLowerCase().includes("hello") && out.toLowerCase().includes("alex"), desc: "Greets 'Alex' properly" },
      { input: ["Priya"], validate: (out) => out.toLowerCase().includes("hello") && out.toLowerCase().includes("priya"), desc: "Greets 'Priya' properly" }
    ]
  },
  {
    id: 3,
    level: 1,
    levelName: "Variables and Basic Maths",
    title: "Sum of Two Numbers",
    difficulty: "Beginner",
    description: "Prompt the user for two integers, convert the inputs to numbers, calculate their sum, and print the result.",
    requirements: [
      "Read two inputs.",
      "Convert inputs using int() or float().",
      "Print their arithmetic sum."
    ],
    sampleInput: "15\n25",
    sampleOutput: "40",
    hint: "Remember that input() returns a string. Wrap it in int() or float() before addition.",
    starterCode: "# Ask for two numbers and print their sum\nnum1 = int(input(\"Enter first number: \"))\nnum2 = int(input(\"Enter second number: \"))\n",
    solutionCode: "num1 = float(input(\"Enter first number: \"))\nnum2 = float(input(\"Enter second number: \"))\nprint(num1 + num2)",
    explanation: "In Python, arithmetic addition uses the '+' operator. String conversion to numbers is essential since input() returns string values.",
    testCases: [
      { input: ["10", "20"], validate: (out) => out.includes("30"), desc: "10 + 20 = 30" },
      { input: ["5", "7"], validate: (out) => out.includes("12"), desc: "5 + 7 = 12" }
    ]
  },
  {
    id: 4,
    level: 1,
    levelName: "Variables and Basic Maths",
    title: "Difference of Two Numbers",
    difficulty: "Beginner",
    description: "Ask the user for two numbers, subtract the second number from the first, and print their difference.",
    requirements: [
      "Read two numeric inputs.",
      "Calculate num1 - num2.",
      "Print the resulting difference."
    ],
    sampleInput: "50\n20",
    sampleOutput: "30",
    hint: "Subtract using the '-' operator after converting inputs to integers or floats.",
    starterCode: "# Ask for two numbers and print their difference (num1 - num2)\n",
    solutionCode: "num1 = float(input(\"First: \"))\nnum2 = float(input(\"Second: \"))\nprint(num1 - num2)",
    explanation: "Subtraction is performed using the '-' operator in Python.",
    testCases: [
      { input: ["50", "20"], validate: (out) => out.includes("30"), desc: "50 - 20 = 30" },
      { input: ["10", "15"], validate: (out) => out.includes("-5"), desc: "10 - 15 = -5" }
    ]
  },
  {
    id: 5,
    level: 1,
    levelName: "Variables and Basic Maths",
    title: "Product of Two Numbers",
    difficulty: "Beginner",
    description: "Ask the user for two numbers and print their mathematical product (multiplication).",
    requirements: [
      "Read two numbers from user input.",
      "Calculate num1 * num2.",
      "Print the product."
    ],
    sampleInput: "6\n7",
    sampleOutput: "42",
    hint: "Use the asterisk (*) operator to multiply numbers.",
    starterCode: "# Ask for two numbers and print their product\n",
    solutionCode: "num1 = float(input(\"Enter first: \"))\nnum2 = float(input(\"Enter second: \"))\nprint(num1 * num2)",
    explanation: "Multiplication in Python uses the '*' operator.",
    testCases: [
      { input: ["6", "7"], validate: (out) => out.includes("42"), desc: "6 * 7 = 42" },
      { input: ["4", "0"], validate: (out) => out.includes("0"), desc: "4 * 0 = 0" }
    ]
  },
  {
    id: 6,
    level: 1,
    levelName: "Variables and Basic Maths",
    title: "Quotient with Division-by-Zero Protection",
    difficulty: "Beginner",
    description: "Ask the user for two numbers. Divide the first by the second and print the quotient. If the second number is zero, print an informative error message instead of crashing.",
    requirements: [
      "Read dividend and divisor.",
      "Check if divisor is 0.",
      "Safely handle zero division."
    ],
    sampleInput: "20\n4",
    sampleOutput: "5.0",
    hint: "Use an 'if num2 == 0:' condition or a try-except ZeroDivisionError block.",
    starterCode: "# Safely divide two numbers\na = float(input(\"Dividend: \"))\nb = float(input(\"Divisor: \"))\n",
    solutionCode: "a = float(input(\"Dividend: \"))\nb = float(input(\"Divisor: \"))\nif b == 0:\n    print(\"Cannot divide by zero\")\nelse:\n    print(a / b)",
    explanation: "Dividing by zero raises a ZeroDivisionError in Python. Guarding with an 'if b == 0' or try/except prevents the program from crashing.",
    testCases: [
      { input: ["20", "4"], validate: (out) => out.includes("5"), desc: "20 / 4 = 5.0" },
      { input: ["10", "0"], validate: (out) => out.toLowerCase().includes("cannot") || out.toLowerCase().includes("zero") || out.toLowerCase().includes("error"), desc: "Handles 10 / 0 safely" }
    ]
  },
  {
    id: 7,
    level: 1,
    levelName: "Variables and Basic Maths",
    title: "Age in Months Calculator",
    difficulty: "Beginner",
    description: "Ask the user for their age in years (integer) and calculate their approximate age in months (years * 12). Print the result.",
    requirements: [
      "Input age in years.",
      "Multiply by 12.",
      "Print age in months."
    ],
    sampleInput: "25",
    sampleOutput: "300",
    hint: "months = years * 12",
    starterCode: "# Ask for age in years and calculate age in months\nyears = int(input(\"Enter your age in years: \"))\n",
    solutionCode: "years = int(input(\"Enter your age in years: \"))\nmonths = years * 12\nprint(f\"Age in months: {months}\")",
    explanation: "Converting between time units involves multiplying by constant conversion factors.",
    testCases: [
      { input: ["25"], validate: (out) => out.includes("300"), desc: "25 years -> 300 months" },
      { input: ["2"], validate: (out) => out.includes("24"), desc: "2 years -> 24 months" }
    ]
  },
  {
    id: 8,
    level: 1,
    levelName: "Variables and Basic Maths",
    title: "Rectangle Area Calculator",
    difficulty: "Beginner",
    description: "Ask the user for the length and width of a rectangle. Calculate and print the area (length * width).",
    requirements: [
      "Input length and width.",
      "Calculate area = length * width.",
      "Print calculated area."
    ],
    sampleInput: "8\n5",
    sampleOutput: "40",
    hint: "Area of a rectangle is computed by multiplying its length by width.",
    starterCode: "# Calculate rectangle area\nlength = float(input(\"Length: \"))\nwidth = float(input(\"Width: \"))\n",
    solutionCode: "length = float(input(\"Length: \"))\nwidth = float(input(\"Width: \"))\nprint(length * width)",
    explanation: "The formula for the area of a rectangle is length multiplied by width.",
    testCases: [
      { input: ["8", "5"], validate: (out) => out.includes("40"), desc: "8 * 5 = 40" },
      { input: ["10.5", "2"], validate: (out) => out.includes("21"), desc: "10.5 * 2 = 21" }
    ]
  },
  {
    id: 9,
    level: 1,
    levelName: "Variables and Basic Maths",
    title: "Celsius to Fahrenheit Converter",
    difficulty: "Beginner",
    description: "Convert a temperature entered in Celsius to Fahrenheit using the standard formula: F = (C * 9/5) + 32. Print the converted temperature.",
    requirements: [
      "Input temperature in Celsius.",
      "Apply (celsius * 9/5) + 32.",
      "Print result in Fahrenheit."
    ],
    sampleInput: "25",
    sampleOutput: "77.0",
    hint: "f = (c * 9/5) + 32",
    starterCode: "# Convert Celsius to Fahrenheit\ncelsius = float(input(\"Temperature in Celsius: \"))\n",
    solutionCode: "celsius = float(input(\"Temperature in Celsius: \"))\nfahrenheit = (celsius * 9/5) + 32\nprint(fahrenheit)",
    explanation: "Operator precedence ensures division and multiplication are evaluated before addition.",
    testCases: [
      { input: ["0"], validate: (out) => out.includes("32"), desc: "0°C = 32°F" },
      { input: ["100"], validate: (out) => out.includes("212"), desc: "100°C = 212°F" }
    ]
  },
  {
    id: 10,
    level: 1,
    levelName: "Variables and Basic Maths",
    title: "Swap Two Variables",
    difficulty: "Beginner",
    description: "Given two variable values a and b from input, swap their contents so a has b's value and b has a's value, then print both.",
    requirements: [
      "Input two values.",
      "Swap values of variables a and b.",
      "Print swapped values."
    ],
    sampleInput: "Apple\nBanana",
    sampleOutput: "Banana\nApple",
    hint: "In Python, you can swap elegantly using tuple unpacking: a, b = b, a.",
    starterCode: "a = input(\"Value A: \")\nb = input(\"Value B: \")\n# Swap them here\n",
    solutionCode: "a = input(\"Value A: \")\nb = input(\"Value B: \")\na, b = b, a\nprint(f\"{a} {b}\")",
    explanation: "Python enables simultaneous assignment using tuple unpacking: a, b = b, a swops variables in memory without requiring an explicit temporary variable.",
    testCases: [
      { input: ["X", "Y"], validate: (out) => {
          const lines = out.split(/\s+/).filter(Boolean);
          return lines.indexOf("Y") !== -1 && lines.indexOf("X") > lines.indexOf("Y");
        }, desc: "Swaps X and Y" }
    ]
  },

  // ==========================================
  // LEVEL 2: CONDITIONS & DECISION MAKING (Q11-Q20)
  // ==========================================
  {
    id: 11,
    level: 2,
    levelName: "Conditions and Decision Making",
    title: "Check Even or Odd",
    difficulty: "Beginner",
    description: "Ask the user for an integer. Check if it is even or odd using the modulo operator (%). Print 'Even' or 'Odd'.",
    requirements: [
      "Input integer number.",
      "Check remainder using num % 2 == 0.",
      "Print 'Even' or 'Odd'."
    ],
    sampleInput: "14",
    sampleOutput: "Even",
    hint: "An even number divided by 2 has remainder 0 (num % 2 == 0).",
    starterCode: "# Check if a number is even or odd\nnum = int(input(\"Enter an integer: \"))\n",
    solutionCode: "num = int(input(\"Enter an integer: \"))\nif num % 2 == 0:\n    print(\"Even\")\nelse:\n    print(\"Odd\")",
    explanation: "The modulo operator % returns the division remainder. An even integer always has 0 remainder when divided by 2.",
    testCases: [
      { input: ["8"], validate: (out) => out.toLowerCase().includes("even"), desc: "8 is Even" },
      { input: ["13"], validate: (out) => out.toLowerCase().includes("odd"), desc: "13 is Odd" }
    ]
  },
  {
    id: 12,
    level: 2,
    levelName: "Conditions and Decision Making",
    title: "Find Larger of Two Numbers",
    difficulty: "Beginner",
    description: "Ask the user for two numbers. Print which number is larger, or report that both numbers are equal if they have the same value.",
    requirements: [
      "Compare two numbers.",
      "Print the larger number or state equality."
    ],
    sampleInput: "45\n12",
    sampleOutput: "45 is larger",
    hint: "Use if num1 > num2: ... elif num2 > num1: ... else: ...",
    starterCode: "# Compare two numbers\nnum1 = float(input(\"First: \"))\nnum2 = float(input(\"Second: \"))\n",
    solutionCode: "num1 = float(input(\"First: \"))\nnum2 = float(input(\"Second: \"))\nif num1 > num2:\n    print(f\"{num1} is larger\")\nelif num2 > num1:\n    print(f\"{num2} is larger\")\nelse:\n    print(\"Numbers are equal\")",
    explanation: "if-elif-else constructs allow checking multiple mutually exclusive branch conditions sequentially.",
    testCases: [
      { input: ["45", "12"], validate: (out) => out.includes("45"), desc: "Identifies 45 as larger" },
      { input: ["7", "7"], validate: (out) => out.toLowerCase().includes("equal"), desc: "Identifies equality" }
    ]
  },
  {
    id: 13,
    level: 2,
    levelName: "Conditions and Decision Making",
    title: "Largest of Three Numbers",
    difficulty: "Beginner",
    description: "Ask the user for three numbers and determine the largest among them. Print the largest value.",
    requirements: [
      "Input three numbers.",
      "Find and print the maximum value."
    ],
    sampleInput: "12\n95\n34",
    sampleOutput: "95",
    hint: "You can compare with nested/chained conditions or use Python's built-in max(a, b, c).",
    starterCode: "# Find largest of three numbers\na = float(input(\"A: \"))\nb = float(input(\"B: \"))\nc = float(input(\"C: \"))\n",
    solutionCode: "a = float(input(\"A: \"))\nb = float(input(\"B: \"))\nc = float(input(\"C: \"))\nprint(max(a, b, c))",
    explanation: "max() finds the highest value among arguments, or you can use if a >= b and a >= c logic.",
    testCases: [
      { input: ["12", "95", "34"], validate: (out) => out.includes("95"), desc: "Identifies 95 as max" },
      { input: ["100", "50", "20"], validate: (out) => out.includes("100"), desc: "Identifies 100 as max" }
    ]
  },
  {
    id: 14,
    level: 2,
    levelName: "Conditions and Decision Making",
    title: "Pass or Fail Checker",
    difficulty: "Beginner",
    description: "Ask the user for student marks (out of 100). If the marks are at least 35, print 'Pass'; otherwise print 'Fail'.",
    requirements: [
      "Read numeric marks.",
      "Check if marks >= 35.",
      "Print 'Pass' or 'Fail'."
    ],
    sampleInput: "42",
    sampleOutput: "Pass",
    hint: "Use >= 35 to test passing grade.",
    starterCode: "# Pass or Fail based on threshold of 35\nmarks = float(input(\"Enter marks: \"))\n",
    solutionCode: "marks = float(input(\"Enter marks: \"))\nif marks >= 35:\n    print(\"Pass\")\nelse:\n    print(\"Fail\")",
    explanation: "A standard boundary check using the greater-than-or-equal-to operator >=.",
    testCases: [
      { input: ["42"], validate: (out) => out.toLowerCase().includes("pass"), desc: "42 is Pass" },
      { input: ["28"], validate: (out) => out.toLowerCase().includes("fail"), desc: "28 is Fail" },
      { input: ["35"], validate: (out) => out.toLowerCase().includes("pass"), desc: "35 boundary is Pass" }
    ]
  },
  {
    id: 15,
    level: 2,
    levelName: "Conditions and Decision Making",
    title: "Leap Year Checker",
    difficulty: "Intermediate",
    description: "Check if a given year is a leap year. A year is a leap year if it is divisible by 4, except end-of-century years which must also be divisible by 400. Print 'Leap Year' or 'Not a Leap Year'.",
    requirements: [
      "Check (year % 4 == 0 and year % 100 != 0) or (year % 400 == 0).",
      "Print appropriate leap year message."
    ],
    sampleInput: "2024",
    sampleOutput: "Leap Year",
    hint: "Remember the 100 and 400 year rules for century years like 1900 vs 2000.",
    starterCode: "# Check if year is a leap year\nyear = int(input(\"Enter year: \"))\n",
    solutionCode: "year = int(input(\"Enter year: \"))\nif (year % 4 == 0 and year % 100 != 0) or (year % 400 == 0):\n    print(\"Leap Year\")\nelse:\n    print(\"Not a Leap Year\")",
    explanation: "The Gregorian leap year rule specifies divisible by 4, not divisible by 100 unless divisible by 400.",
    testCases: [
      { input: ["2024"], validate: (out) => out.toLowerCase().includes("leap") && !out.toLowerCase().includes("not"), desc: "2024 is Leap Year" },
      { input: ["1900"], validate: (out) => out.toLowerCase().includes("not"), desc: "1900 is Not Leap Year" },
      { input: ["2000"], validate: (out) => out.toLowerCase().includes("leap") && !out.toLowerCase().includes("not"), desc: "2000 is Leap Year" }
    ]
  },
  {
    id: 16,
    level: 2,
    levelName: "Conditions and Decision Making",
    title: "Divisibility by 5 and 10",
    difficulty: "Beginner",
    description: "Ask the user for an integer. Check if the number is divisible by both 5 and 10. Print 'Divisible by both' or 'Not divisible by both'.",
    requirements: [
      "Input an integer.",
      "Check divisibility by both 5 and 10.",
      "Print confirmation."
    ],
    sampleInput: "50",
    sampleOutput: "Divisible by both",
    hint: "A number divisible by 10 is automatically divisible by 5, or check (num % 5 == 0 and num % 10 == 0).",
    starterCode: "# Check divisibility by both 5 and 10\nnum = int(input(\"Enter integer: \"))\n",
    solutionCode: "num = int(input(\"Enter integer: \"))\nif num % 5 == 0 and num % 10 == 0:\n    print(\"Divisible by both\")\nelse:\n    print(\"Not divisible by both\")",
    explanation: "The 'and' logical operator returns True only when both sub-conditions evaluate to True.",
    testCases: [
      { input: ["50"], validate: (out) => out.toLowerCase().includes("divisible by both") && !out.toLowerCase().includes("not"), desc: "50 is divisible by both" },
      { input: ["25"], validate: (out) => out.toLowerCase().includes("not"), desc: "25 is not divisible by both 5 and 10" }
    ]
  },
  {
    id: 17,
    level: 2,
    levelName: "Conditions and Decision Making",
    title: "Positive, Negative, or Zero",
    difficulty: "Beginner",
    description: "Ask for a number. Determine whether it is 'Positive', 'Negative', or 'Zero' and print the classification.",
    requirements: [
      "Input a number.",
      "Check if > 0, < 0, or == 0.",
      "Print classification."
    ],
    sampleInput: "-8",
    sampleOutput: "Negative",
    hint: "Use if num > 0: ... elif num < 0: ... else: ...",
    starterCode: "# Classify number as positive, negative, or zero\nnum = float(input(\"Enter number: \"))\n",
    solutionCode: "num = float(input(\"Enter number: \"))\nif num > 0:\n    print(\"Positive\")\nelif num < 0:\n    print(\"Negative\")\nelse:\n    print(\"Zero\")",
    explanation: "Real numbers are partitioned into strictly positive numbers, negative numbers, and zero.",
    testCases: [
      { input: ["15"], validate: (out) => out.toLowerCase().includes("positive"), desc: "15 is Positive" },
      { input: ["-3"], validate: (out) => out.toLowerCase().includes("negative"), desc: "-3 is Negative" },
      { input: ["0"], validate: (out) => out.toLowerCase().includes("zero"), desc: "0 is Zero" }
    ]
  },
  {
    id: 18,
    level: 2,
    levelName: "Conditions and Decision Making",
    title: "Age Group Classifier",
    difficulty: "Beginner",
    description: "Classify age into age groups:\n- Child: 0 to 12 years\n- Teenager: 13 to 19 years\n- Adult: 20 years and older\nPrint the corresponding group.",
    requirements: [
      "Input age as integer.",
      "Check ranges: 0-12 (Child), 13-19 (Teenager), 20+ (Adult).",
      "Print group name."
    ],
    sampleInput: "16",
    sampleOutput: "Teenager",
    hint: "Use range comparisons like 0 <= age <= 12.",
    starterCode: "# Age classification\nage = int(input(\"Enter age: \"))\n",
    solutionCode: "age = int(input(\"Enter age: \"))\nif age <= 12:\n    print(\"Child\")\nelif age <= 19:\n    print(\"Teenager\")\nelse:\n    print(\"Adult\")",
    explanation: "Sequential boundary checks simplify logic because previous if checks already eliminate lower numbers.",
    testCases: [
      { input: ["8"], validate: (out) => out.toLowerCase().includes("child"), desc: "8 is Child" },
      { input: ["15"], validate: (out) => out.toLowerCase().includes("teenager"), desc: "15 is Teenager" },
      { input: ["25"], validate: (out) => out.toLowerCase().includes("adult"), desc: "25 is Adult" }
    ]
  },
  {
    id: 19,
    level: 2,
    levelName: "Conditions and Decision Making",
    title: "Academic Grade Calculator",
    difficulty: "Beginner",
    description: "Ask for student marks (0 to 100) and assign grades:\n- 90 and above: A\n- 80 to 89: B\n- 70 to 79: C\n- 60 to 69: D\n- Below 60: F\nPrint the awarded grade letter.",
    requirements: [
      "Input marks.",
      "Assign correct grade letter A, B, C, D, or F.",
      "Print grade letter."
    ],
    sampleInput: "85",
    sampleOutput: "Grade: B",
    hint: "Order checks from highest (>= 90) downwards to avoid overlapping logic.",
    starterCode: "# Grade calculator\nmarks = float(input(\"Enter marks: \"))\n",
    solutionCode: "marks = float(input(\"Enter marks: \"))\nif marks >= 90:\n    print(\"Grade: A\")\nelif marks >= 80:\n    print(\"Grade: B\")\nelif marks >= 70:\n    print(\"Grade: C\")\nelif marks >= 60:\n    print(\"Grade: D\")\nelse:\n    print(\"Grade: F\")",
    explanation: "Standard grading ladder using if-elif chains evaluated from highest tier to lowest.",
    testCases: [
      { input: ["95"], validate: (out) => out.includes("A"), desc: "95 earns A" },
      { input: ["82"], validate: (out) => out.includes("B"), desc: "82 earns B" },
      { input: ["55"], validate: (out) => out.includes("F"), desc: "55 earns F" }
    ]
  },
  {
    id: 20,
    level: 2,
    levelName: "Conditions and Decision Making",
    title: "Vowel or Consonant Checker",
    difficulty: "Beginner",
    description: "Ask the user for a single alphabetical character. Determine if it is a vowel (A, E, I, O, U) or a consonant. If the input is not a single letter, print 'Invalid input'.",
    requirements: [
      "Input character.",
      "Check length == 1 and isalpha().",
      "Print 'Vowel', 'Consonant', or 'Invalid input'."
    ],
    sampleInput: "e",
    sampleOutput: "Vowel",
    hint: "Use char.lower() in 'aeiou' to identify vowels cleanly.",
    starterCode: "# Vowel, Consonant, or Invalid\nch = input(\"Enter a single letter: \")\n",
    solutionCode: "ch = input(\"Enter a single letter: \")\nif len(ch) != 1 or not ch.isalpha():\n    print(\"Invalid input\")\nelif ch.lower() in \"aeiou\":\n    print(\"Vowel\")\nelse:\n    print(\"Consonant\")",
    explanation: "String membership test 'ch.lower() in vowels' concisely validates vowels while handling uppercase and lowercase.",
    testCases: [
      { input: ["a"], validate: (out) => out.toLowerCase().includes("vowel"), desc: "'a' is Vowel" },
      { input: ["z"], validate: (out) => out.toLowerCase().includes("consonant"), desc: "'z' is Consonant" },
      { input: ["12"], validate: (out) => out.toLowerCase().includes("invalid"), desc: "'12' is Invalid" }
    ]
  },

  // ==========================================
  // LEVEL 3: LOOPS AND REPETITION (Q21-Q30)
  // ==========================================
  {
    id: 21,
    level: 3,
    levelName: "Loops and Repetition",
    title: "Print Numbers 1 to 10",
    difficulty: "Beginner",
    description: "Write a program that uses a loop (for or while) to print the numbers from 1 to 10, each on a new line.",
    requirements: [
      "Use a loop (for or while).",
      "Print numbers 1 through 10."
    ],
    sampleInput: "No input",
    sampleOutput: "1\n2\n3\n4\n5\n6\n7\n8\n9\n10",
    hint: "Use for i in range(1, 11): print(i)",
    starterCode: "# Print numbers 1 to 10 using a loop\n",
    solutionCode: "for i in range(1, 11):\n    print(i)",
    explanation: "The range(start, stop) function in Python produces integers from start up to stop - 1.",
    testCases: [
      { input: [], validate: (out) => {
          for (let i = 1; i <= 10; i++) {
            if (!out.includes(String(i))) return false;
          }
          return true;
        }, desc: "Contains numbers 1 through 10" }
    ]
  },
  {
    id: 22,
    level: 3,
    levelName: "Loops and Repetition",
    title: "Countdown from 10 Down to 1",
    difficulty: "Beginner",
    description: "Use a loop to print numbers in reverse order from 10 down to 1.",
    requirements: [
      "Use loop.",
      "Print countdown 10 down to 1."
    ],
    sampleInput: "No input",
    sampleOutput: "10\n9\n8\n7\n6\n5\n4\n3\n2\n1",
    hint: "Use range(10, 0, -1) with a negative step.",
    starterCode: "# Print 10 down to 1\n",
    solutionCode: "for i in range(10, 0, -1):\n    print(i)",
    explanation: "A negative step in range(start, stop, step) decrements the counter each iteration.",
    testCases: [
      { input: [], validate: (out) => {
          const idx10 = out.indexOf("10");
          const idx1 = out.lastIndexOf("1");
          return idx10 !== -1 && idx1 > idx10;
        }, desc: "Prints 10 before 1" }
    ]
  },
  {
    id: 23,
    level: 3,
    levelName: "Loops and Repetition",
    title: "Multiplication Table Generator",
    difficulty: "Beginner",
    description: "Ask the user for an integer n. Print the multiplication table for that number from 1 to 10 in the format: 'n x i = result'.",
    requirements: [
      "Input integer n.",
      "Loop from 1 to 10.",
      "Print formatted table equations."
    ],
    sampleInput: "5",
    sampleOutput: "5 x 1 = 5\n5 x 2 = 10\n...\n5 x 10 = 50",
    hint: "Loop through range(1, 11) and print f\"{n} x {i} = {n * i}\".",
    starterCode: "# Multiplication table of n\nn = int(input(\"Enter number: \"))\n",
    solutionCode: "n = int(input(\"Enter number: \"))\nfor i in range(1, 11):\n    print(f\"{n} x {i} = {n * i}\")",
    explanation: "Multiplying the loop index by the target value prints consecutive table entries.",
    testCases: [
      { input: ["5"], validate: (out) => out.includes("50") && out.includes("25"), desc: "Generates table for 5" },
      { input: ["3"], validate: (out) => out.includes("30") && out.includes("15"), desc: "Generates table for 3" }
    ]
  },
  {
    id: 24,
    level: 3,
    levelName: "Loops and Repetition",
    title: "Sum of Integers from 1 to 100",
    difficulty: "Beginner",
    description: "Write a program that calculates the sum of all integers from 1 to 100 using a loop and prints the final total.",
    requirements: [
      "Use loop or sum(range(1, 101)).",
      "Calculate 1+2+...+100 = 5050.",
      "Print total."
    ],
    sampleInput: "No input",
    sampleOutput: "5050",
    hint: "Accumulate total in a variable: total += i.",
    starterCode: "# Calculate sum of integers 1 to 100\ntotal = 0\n",
    solutionCode: "total = sum(range(1, 101))\nprint(total)",
    explanation: "Summing numbers from 1 to n yields n*(n+1)/2. For n=100, the sum is 5050.",
    testCases: [
      { input: [], validate: (out) => out.includes("5050"), desc: "Output contains 5050" }
    ]
  },
  {
    id: 25,
    level: 3,
    levelName: "Loops and Repetition",
    title: "Print Even Numbers from 1 to 50",
    difficulty: "Beginner",
    description: "Print all even numbers between 1 and 50 inclusive using a loop.",
    requirements: [
      "Loop from 1 to 50 (or 2 to 50 step 2).",
      "Print even numbers."
    ],
    sampleInput: "No input",
    sampleOutput: "2\n4\n6\n...\n50",
    hint: "range(2, 51, 2) jumps directly through even numbers.",
    starterCode: "# Print even numbers from 1 to 50\n",
    solutionCode: "for i in range(2, 51, 2):\n    print(i)",
    explanation: "Using step=2 starting at 2 steps through even integers cleanly without extra if conditions.",
    testCases: [
      { input: [], validate: (out) => out.includes("2") && out.includes("48") && out.includes("50") && !out.includes("3 "), desc: "Prints even numbers up to 50" }
    ]
  },
  {
    id: 26,
    level: 3,
    levelName: "Loops and Repetition",
    title: "Factorial of a Non-Negative Integer",
    difficulty: "Intermediate",
    description: "Ask the user for a non-negative integer n. Compute and print its factorial (n!). Note: 0! = 1.",
    requirements: [
      "Input non-negative integer n.",
      "Compute factorial n * (n-1) * ... * 1.",
      "Handle 0! = 1.",
      "Print result."
    ],
    sampleInput: "5",
    sampleOutput: "120",
    hint: "Initialize fact = 1 and multiply fact *= i for i in range(1, n + 1).",
    starterCode: "# Calculate factorial\nn = int(input(\"Enter non-negative integer: \"))\n",
    solutionCode: "n = int(input(\"Enter non-negative integer: \"))\nfact = 1\nfor i in range(1, n + 1):\n    fact *= i\nprint(fact)",
    explanation: "Factorial of n is the product of all positive integers less than or equal to n. 0! is defined as 1.",
    testCases: [
      { input: ["5"], validate: (out) => out.includes("120"), desc: "5! = 120" },
      { input: ["0"], validate: (out) => out.includes("1"), desc: "0! = 1" },
      { input: ["6"], validate: (out) => out.includes("720"), desc: "6! = 720" }
    ]
  },
  {
    id: 27,
    level: 3,
    levelName: "Loops and Repetition",
    title: "Count Digits in an Integer",
    difficulty: "Intermediate",
    description: "Ask for an integer and count the number of digits it contains. Handle zero (1 digit) and negative numbers correctly.",
    requirements: [
      "Input integer.",
      "Handle negative numbers by taking absolute value.",
      "Print count of digits."
    ],
    sampleInput: "-1024",
    sampleOutput: "4",
    hint: "You can convert abs(num) to a string: len(str(abs(num))).",
    starterCode: "# Count digits in integer\nnum = int(input(\"Enter integer: \"))\n",
    solutionCode: "num = int(input(\"Enter integer: \"))\ncount = len(str(abs(num)))\nprint(count)",
    explanation: "The number of digits in an integer equals the character length of its absolute value representation.",
    testCases: [
      { input: ["-1024"], validate: (out) => out.includes("4"), desc: "-1024 has 4 digits" },
      { input: ["0"], validate: (out) => out.includes("1"), desc: "0 has 1 digit" },
      { input: ["78901"], validate: (out) => out.includes("5"), desc: "78901 has 5 digits" }
    ]
  },
  {
    id: 28,
    level: 3,
    levelName: "Loops and Repetition",
    title: "Reverse Digits of an Integer",
    difficulty: "Intermediate",
    description: "Ask for an integer and print its digits in reverse. For example, 1234 becomes 4321.",
    requirements: [
      "Input integer.",
      "Reverse digits.",
      "Print reversed integer/string."
    ],
    sampleInput: "1234",
    sampleOutput: "4321",
    hint: "String slicing with a step of -1: str(num)[::-1] reverses strings effortlessly.",
    starterCode: "# Reverse digits of integer\nnum = int(input(\"Enter integer: \"))\n",
    solutionCode: "num = int(input(\"Enter integer: \"))\nrev = str(abs(num))[::-1]\nif num < 0:\n    print(\"-\" + rev)\nelse:\n    print(rev)",
    explanation: "Slicing with syntax [::-1] walks through characters from end to beginning.",
    testCases: [
      { input: ["1234"], validate: (out) => out.includes("4321"), desc: "1234 reversed is 4321" },
      { input: ["500"], validate: (out) => out.includes("005") || out.includes("5"), desc: "Reverses 500" }
    ]
  },
  {
    id: 29,
    level: 3,
    levelName: "Loops and Repetition",
    title: "Print First N Natural Numbers",
    difficulty: "Beginner",
    description: "Ask the user for an integer n. Print the first n natural numbers starting from 1 up to n.",
    requirements: [
      "Input positive integer n.",
      "Loop from 1 to n.",
      "Print each number."
    ],
    sampleInput: "4",
    sampleOutput: "1\n2\n3\n4",
    hint: "range(1, n + 1) generates numbers up to n.",
    starterCode: "# Print first n natural numbers\nn = int(input(\"Enter n: \"))\n",
    solutionCode: "n = int(input(\"Enter n: \"))\nfor i in range(1, n + 1):\n    print(i)",
    explanation: "Natural numbers are positive counting numbers {1, 2, 3, ...}.",
    testCases: [
      { input: ["4"], validate: (out) => out.includes("1") && out.includes("2") && out.includes("3") && out.includes("4"), desc: "Prints 1 through 4" }
    ]
  },
  {
    id: 30,
    level: 3,
    levelName: "Loops and Repetition",
    title: "Generate Fibonacci Sequence",
    difficulty: "Intermediate",
    description: "Ask the user for n (number of terms). Generate and print the first n terms of the Fibonacci sequence starting with 0, 1, 1, 2, 3, 5...",
    requirements: [
      "Input n terms.",
      "Generate Fibonacci series.",
      "Print the terms."
    ],
    sampleInput: "6",
    sampleOutput: "0 1 1 2 3 5",
    hint: "Keep track of previous two terms: a, b = b, a + b.",
    starterCode: "# Generate Fibonacci sequence\nn = int(input(\"Number of terms: \"))\n",
    solutionCode: "n = int(input(\"Number of terms: \"))\na, b = 0, 1\nfib = []\nfor _ in range(n):\n    fib.append(str(a))\n    a, b = b, a + b\nprint(\" \".join(fib))",
    explanation: "Each Fibonacci term is the sum of the preceding two terms.",
    testCases: [
      { input: ["6"], validate: (out) => out.includes("0") && out.includes("1") && out.includes("2") && out.includes("3") && out.includes("5"), desc: "First 6 terms: 0 1 1 2 3 5" }
    ]
  },

  // ==========================================
  // LEVEL 4: STRINGS AND LISTS (Q31-Q40)
  // ==========================================
  {
    id: 31,
    level: 4,
    levelName: "Strings and Lists",
    title: "Word Length Counter",
    difficulty: "Beginner",
    description: "Ask the user for a word or phrase and print its total character length using the len() function.",
    requirements: [
      "Input text.",
      "Calculate length using len().",
      "Print length integer."
    ],
    sampleInput: "Python",
    sampleOutput: "6",
    hint: "len(text) returns the number of characters in text.",
    starterCode: "# Print length of input word\ntext = input(\"Enter a word: \")\n",
    solutionCode: "text = input(\"Enter a word: \")\nprint(len(text))",
    explanation: "The built-in len() function returns the number of items in an iterable, including string characters.",
    testCases: [
      { input: ["Python"], validate: (out) => out.includes("6"), desc: "'Python' length is 6" },
      { input: ["Hello World"], validate: (out) => out.includes("11"), desc: "'Hello World' length is 11" }
    ]
  },
  {
    id: 32,
    level: 4,
    levelName: "Strings and Lists",
    title: "Reverse a String",
    difficulty: "Beginner",
    description: "Ask the user for a word or phrase and print it reversed character-by-character.",
    requirements: [
      "Input text string.",
      "Reverse string characters.",
      "Print reversed result."
    ],
    sampleInput: "developer",
    sampleOutput: "repoleved",
    hint: "Use string slicing with step -1: text[::-1]",
    starterCode: "# Print word reversed\nword = input(\"Enter word: \")\n",
    solutionCode: "word = input(\"Enter word: \")\nprint(word[::-1])",
    explanation: "String slicing syntax [start:stop:step] reverses strings easily when step is -1.",
    testCases: [
      { input: ["developer"], validate: (out) => out.includes("repoleved"), desc: "'developer' -> 'repoleved'" }
    ]
  },
  {
    id: 33,
    level: 4,
    levelName: "Strings and Lists",
    title: "Palindrome Word Checker",
    difficulty: "Intermediate",
    description: "Check whether an input word is a palindrome (reads identically forwards and backwards, ignoring case). Print 'Palindrome' or 'Not a palindrome'.",
    requirements: [
      "Input word.",
      "Compare normalized word with reversed version.",
      "Print palindrome status."
    ],
    sampleInput: "radar",
    sampleOutput: "Palindrome",
    hint: "Lower-case the word first: clean = word.lower(), then check clean == clean[::-1].",
    starterCode: "# Check if word is palindrome\nword = input(\"Enter a word: \")\n",
    solutionCode: "word = input(\"Enter a word: \").strip().lower()\nif word == word[::-1]:\n    print(\"Palindrome\")\nelse:\n    print(\"Not a palindrome\")",
    explanation: "A palindrome reads the same both forward and backward.",
    testCases: [
      { input: ["radar"], validate: (out) => out.toLowerCase().includes("palindrome") && !out.toLowerCase().includes("not"), desc: "'radar' is Palindrome" },
      { input: ["python"], validate: (out) => out.toLowerCase().includes("not"), desc: "'python' is Not a palindrome" }
    ]
  },
  {
    id: 34,
    level: 4,
    levelName: "Strings and Lists",
    title: "Count Vowels in a Sentence",
    difficulty: "Intermediate",
    description: "Ask the user for a sentence. Count the total occurrences of vowels (a, e, i, o, u, case-insensitive) and print the total count.",
    requirements: [
      "Input sentence.",
      "Count vowels (a, e, i, o, u).",
      "Print count integer."
    ],
    sampleInput: "OpenAI and Google build intelligent AI models",
    sampleOutput: "19",
    hint: "Iterate over each character in sentence.lower() and check if char in 'aeiou'.",
    starterCode: "# Count vowels in sentence\nsentence = input(\"Enter sentence: \")\n",
    solutionCode: "sentence = input(\"Enter sentence: \")\ncount = sum(1 for ch in sentence.lower() if ch in \"aeiou\")\nprint(count)",
    explanation: "A generator expression combined with sum() concisely tallies matched criteria.",
    testCases: [
      { input: ["hello world"], validate: (out) => out.includes("3"), desc: "'hello world' has 3 vowels" },
      { input: ["sky rhythm"], validate: (out) => out.includes("0"), desc: "'sky rhythm' has 0 vowels" }
    ]
  },
  {
    id: 35,
    level: 4,
    levelName: "Strings and Lists",
    title: "Create and Print a List",
    difficulty: "Beginner",
    description: "Create a list containing five numbers of your choice. Print the entire list and the number of elements it contains.",
    requirements: [
      "Create a list of 5 numbers.",
      "Print the list.",
      "Print the list length."
    ],
    sampleInput: "No input",
    sampleOutput: "[10, 20, 30, 40, 50]\n5",
    hint: "Define numbers = [1, 2, 3, 4, 5] and print(numbers) followed by print(len(numbers)).",
    starterCode: "# Create list of 5 numbers and print it\n",
    solutionCode: "nums = [10, 20, 30, 40, 50]\nprint(nums)\nprint(len(nums))",
    explanation: "Lists are ordered, mutable sequences defined with square brackets [].",
    testCases: [
      { input: [], validate: (out) => out.includes("[") && out.includes("5"), desc: "Prints list and length 5" }
    ]
  },
  {
    id: 36,
    level: 4,
    levelName: "Strings and Lists",
    title: "Find Largest Number in a List",
    difficulty: "Intermediate",
    description: "Given a space-separated list of numbers entered by the user, parse them into a list of integers and find the largest number.",
    requirements: [
      "Parse numbers using input().split().",
      "Find maximum value.",
      "Print maximum number."
    ],
    sampleInput: "4 12 9 88 23 15",
    sampleOutput: "88",
    hint: "Convert tokens: nums = [int(x) for x in input().split()], then use max(nums).",
    starterCode: "# Find largest number in list\nraw = input(\"Enter space-separated numbers: \")\n",
    solutionCode: "nums = [int(x) for x in input(\"Enter numbers: \").split()]\nprint(max(nums))",
    explanation: "The split() method separates strings by whitespace, and list comprehension converts each token.",
    testCases: [
      { input: ["4 12 9 88 23 15"], validate: (out) => out.includes("88"), desc: "Finds 88 as largest" },
      { input: ["-5 -20 -3"], validate: (out) => out.includes("-3"), desc: "Finds -3 as largest negative" }
    ]
  },
  {
    id: 37,
    level: 4,
    levelName: "Strings and Lists",
    title: "Sum of All Numbers in a List",
    difficulty: "Beginner",
    description: "Given a space-separated sequence of numbers, compute the sum of all elements in the list and print the result.",
    requirements: [
      "Parse numbers from input.",
      "Sum all numbers.",
      "Print sum."
    ],
    sampleInput: "10 20 30 40",
    sampleOutput: "100",
    hint: "Use sum(nums) on the parsed list of integers.",
    starterCode: "# Sum of numbers in list\nraw = input(\"Enter space-separated numbers: \")\n",
    solutionCode: "nums = [float(x) for x in input(\"Enter numbers: \").split()]\nprint(int(sum(nums)))",
    explanation: "sum() calculates the sum of all items in an iterable.",
    testCases: [
      { input: ["10 20 30 40"], validate: (out) => out.includes("100"), desc: "Sum is 100" }
    ]
  },
  {
    id: 38,
    level: 4,
    levelName: "Strings and Lists",
    title: "Remove Duplicates Preserving Order",
    difficulty: "Intermediate",
    description: "Given a space-separated list of items, remove duplicate values while preserving their original first-occurrence order. Print the cleaned list.",
    requirements: [
      "Input space-separated items.",
      "Remove duplicates preserving order.",
      "Print resulting list."
    ],
    sampleInput: "apple banana apple cherry banana",
    sampleOutput: "apple banana cherry",
    hint: "Iterate through items and append to a new list only if not already present.",
    starterCode: "# Remove duplicates preserving order\nitems = input(\"Enter items: \").split()\n",
    solutionCode: "items = input(\"Enter items: \").split()\nunique = []\nfor item in items:\n    if item not in unique:\n        unique.append(item)\nprint(\" \".join(unique))",
    explanation: "While set() removes duplicates, it does not guarantee preservation of original order; maintaining a dedicated seen list or dict.fromkeys() preserves sequence order.",
    testCases: [
      { input: ["apple banana apple cherry banana"], validate: (out) => out.includes("apple") && out.includes("banana") && out.includes("cherry"), desc: "Deduplicates preserving order" }
    ]
  },
  {
    id: 39,
    level: 4,
    levelName: "Strings and Lists",
    title: "Sort Numbers in Ascending Order",
    difficulty: "Intermediate",
    description: "Given a space-separated list of numbers, sort them in ascending order and print the sorted list.",
    requirements: [
      "Input numbers.",
      "Sort numerically (ascending).",
      "Print sorted numbers."
    ],
    sampleInput: "9 2 7 1 5",
    sampleOutput: "1 2 5 7 9",
    hint: "Use sorted() or list.sort(). Ensure items are converted to numbers first, not sorted as strings!",
    starterCode: "# Sort numbers in ascending order\nraw = input(\"Enter numbers: \")\n",
    solutionCode: "nums = [int(x) for x in input(\"Enter numbers: \").split()]\nnums.sort()\nprint(\" \".join(map(str, nums)))",
    explanation: "Numerical sorting requires integer conversion; otherwise '10' would sort before '2' in lexicographical order.",
    testCases: [
      { input: ["9 2 7 1 5"], validate: (out) => {
          const idx1 = out.indexOf("1");
          const idx9 = out.indexOf("9");
          return idx1 !== -1 && idx9 > idx1;
        }, desc: "Sorts 9 2 7 1 5 to ascending" }
    ]
  },
  {
    id: 40,
    level: 4,
    levelName: "Strings and Lists",
    title: "Character Frequency in String",
    difficulty: "Beginner",
    description: "Ask the user for a text string and a target character. Count and print how many times that character appears in the string.",
    requirements: [
      "Input string.",
      "Input target character.",
      "Print count of occurrences."
    ],
    sampleInput: "banana\na",
    sampleOutput: "3",
    hint: "Python strings have a built-in text.count(target_char) method.",
    starterCode: "# Count character occurrences\ntext = input(\"Enter text: \")\ntarget = input(\"Enter character to count: \")\n",
    solutionCode: "text = input(\"Enter text: \")\ntarget = input(\"Enter character: \")\nprint(text.count(target))",
    explanation: "str.count(sub) returns the number of non-overlapping occurrences of substring sub.",
    testCases: [
      { input: ["banana", "a"], validate: (out) => out.includes("3"), desc: "'a' appears 3 times in 'banana'" },
      { input: ["mississippi", "s"], validate: (out) => out.includes("4"), desc: "'s' appears 4 times in 'mississippi'" }
    ]
  },

  // ==========================================
  // LEVEL 5: MINI PROJECTS (Q41-Q50)
  // ==========================================
  {
    id: 41,
    level: 5,
    levelName: "Mini Projects and Problem Solving",
    title: "Four-Operation Interactive Calculator",
    difficulty: "Intermediate",
    description: "Build a calculator program that takes two numbers and an operator (+, -, *, /) and outputs the calculated result. Guard against division by zero.",
    requirements: [
      "Input num1, operator (+, -, *, /), num2.",
      "Perform arithmetic calculation.",
      "Prevent division by zero.",
      "Print result."
    ],
    sampleInput: "12\n*\n8",
    sampleOutput: "96",
    hint: "Use if/elif branches based on operator string.",
    starterCode: "# Four-function calculator\nnum1 = float(input(\"First number: \"))\nop = input(\"Operator (+, -, *, /): \")\nnum2 = float(input(\"Second number: \"))\n",
    solutionCode: "num1 = float(input(\"First: \"))\nop = input(\"Op: \").strip()\nnum2 = float(input(\"Second: \"))\nif op == '+':\n    print(num1 + num2)\nelif op == '-':\n    print(num1 - num2)\nelif op == '*':\n    print(num1 * num2)\nelif op == '/':\n    print(\"Error\" if num2 == 0 else num1 / num2)\nelse:\n    print(\"Invalid operator\")",
    explanation: "A clean dispatcher for arithmetic operators with safety protection against ZeroDivisionError.",
    testCases: [
      { input: ["12", "*", "8"], validate: (out) => out.includes("96"), desc: "12 * 8 = 96" },
      { input: ["10", "/", "0"], validate: (out) => out.toLowerCase().includes("error") || out.toLowerCase().includes("cannot"), desc: "Handles division by zero" }
    ]
  },
  {
    id: 42,
    level: 5,
    levelName: "Mini Projects and Problem Solving",
    title: "Number Guessing Game Logic",
    difficulty: "Intermediate",
    description: "Write the logic for a number guessing comparison. Given a secret target number and a player's guess, report 'Too high', 'Too low', or 'Correct! You got it!'.",
    requirements: [
      "Read target number and guess.",
      "Compare guess with target.",
      "Print 'Too high', 'Too low', or 'Correct'."
    ],
    sampleInput: "42\n30",
    sampleOutput: "Too low",
    hint: "if guess < target: print('Too low') elif guess > target: print('Too high') else: print('Correct!')",
    starterCode: "# Guessing comparison logic\ntarget = int(input(\"Target number: \"))\nguess = int(input(\"Your guess: \"))\n",
    solutionCode: "target = int(input(\"Target: \"))\nguess = int(input(\"Guess: \"))\nif guess < target:\n    print(\"Too low\")\nelif guess > target:\n    print(\"Too high\")\nelse:\n    print(\"Correct!\")",
    explanation: "Binary search style feedback guides players to refine guesses.",
    testCases: [
      { input: ["42", "30"], validate: (out) => out.toLowerCase().includes("low"), desc: "30 is Too low for 42" },
      { input: ["42", "50"], validate: (out) => out.toLowerCase().includes("high"), desc: "50 is Too high for 42" },
      { input: ["42", "42"], validate: (out) => out.toLowerCase().includes("correct"), desc: "42 is Correct" }
    ]
  },
  {
    id: 43,
    level: 5,
    levelName: "Mini Projects and Problem Solving",
    title: "Secure Password Strength Checker",
    difficulty: "Intermediate",
    description: "Check if a password candidate meets safety criteria: at least 8 characters long, contains at least one digit, and contains at least one letter. Print 'Strong' or 'Weak: <reason>'. Do not store passwords.",
    requirements: [
      "Check length >= 8.",
      "Check presence of at least one digit (any(c.isdigit() for c in pw)).",
      "Check presence of at least one letter.",
      "Print 'Strong' or 'Weak'."
    ],
    sampleInput: "Python2026",
    sampleOutput: "Strong",
    hint: "Use any(c.isdigit() for c in pw) and any(c.isalpha() for c in pw).",
    starterCode: "# Password strength validator\npw = input(\"Enter candidate password: \")\n",
    solutionCode: "pw = input(\"Password: \")\nhas_digit = any(c.isdigit() for c in pw)\nhas_alpha = any(c.isalpha() for c in pw)\nif len(pw) >= 8 and has_digit and has_alpha:\n    print(\"Strong\")\nelse:\n    print(\"Weak\")",
    explanation: "Enforcing minimum length alongside character composition rules protects against simple credential attacks.",
    testCases: [
      { input: ["Python2026"], validate: (out) => out.toLowerCase().includes("strong"), desc: "'Python2026' is Strong" },
      { input: ["short"], validate: (out) => out.toLowerCase().includes("weak"), desc: "'short' is Weak" }
    ]
  },
  {
    id: 44,
    level: 5,
    levelName: "Mini Projects and Problem Solving",
    title: "Quiz Grader System",
    difficulty: "Intermediate",
    description: "Given a list of 5 correct answer keys and 5 student answers, calculate the total score out of 5 and print the score and percentage.",
    requirements: [
      "Compare 5 answers with key.",
      "Count correct answers.",
      "Print final score (e.g., 'Score: 4/5 (80%)')."
    ],
    sampleInput: "A B C D A\nA B C D B",
    sampleOutput: "Score: 4/5 (80.0%)",
    hint: "Loop through zip(keys, student_answers) and increment score for matches.",
    starterCode: "# Compare answer key with student answers\nkeys = input(\"Answer keys: \").split()\nanswers = input(\"Student answers: \").split()\n",
    solutionCode: "keys = input(\"Keys: \").split()\nanswers = input(\"Answers: \").split()\ncorrect = sum(1 for k, a in zip(keys, answers) if k.upper() == a.upper())\nprint(f\"Score: {correct}/5 ({correct/5 * 100:.1f}%)\")",
    explanation: "zip() pairs up corresponding elements from two sequences for side-by-side comparison.",
    testCases: [
      { input: ["A B C D A", "A B C D B"], validate: (out) => out.includes("4/5") || out.includes("80"), desc: "Scores 4/5 (80%)" }
    ]
  },
  {
    id: 45,
    level: 5,
    levelName: "Mini Projects and Problem Solving",
    title: "To-Do List Manager",
    difficulty: "Intermediate",
    description: "Create a program that takes three task descriptions, stores them in a list, and prints a numbered to-do list.",
    requirements: [
      "Input 3 tasks.",
      "Store tasks in a list.",
      "Print numbered list (1. Task, 2. Task, 3. Task)."
    ],
    sampleInput: "Read docs\nWrite code\nRun tests",
    sampleOutput: "1. Read docs\n2. Write code\n3. Run tests",
    hint: "Use enumerate(tasks, 1) to get 1-based indexing for display.",
    starterCode: "# Numbered to-do list\ntasks = []\n",
    solutionCode: "tasks = [input() for _ in range(3)]\nfor i, task in enumerate(tasks, 1):\n    print(f\"{i}. {task}\")",
    explanation: "enumerate(iterable, start=1) generates pairs of (index, item) starting at 1.",
    testCases: [
      { input: ["Read docs", "Write code", "Run tests"], validate: (out) => out.includes("1. Read docs") && out.includes("2. Write code") && out.includes("3. Run tests"), desc: "Prints formatted numbered list" }
    ]
  },
  {
    id: 46,
    level: 5,
    levelName: "Mini Projects and Problem Solving",
    title: "Student Marks Total and Average",
    difficulty: "Intermediate",
    description: "Ask for marks across 5 subjects. Calculate and print the total marks and the average percentage.",
    requirements: [
      "Input 5 marks.",
      "Calculate total sum.",
      "Calculate average (total / 5).",
      "Print total and average."
    ],
    sampleInput: "80\n90\n75\n85\n70",
    sampleOutput: "Total: 400.0\nAverage: 80.0",
    hint: "total = sum(marks), avg = total / len(marks).",
    starterCode: "# Student marks calculator\nmarks = []\n",
    solutionCode: "marks = [float(input()) for _ in range(5)]\ntotal = sum(marks)\navg = total / 5\nprint(f\"Total: {total}\")\nprint(f\"Average: {avg}\")",
    explanation: "Average is the sum divided by the number of observations.",
    testCases: [
      { input: ["80", "90", "75", "85", "70"], validate: (out) => out.includes("400") && out.includes("80"), desc: "Total 400, Avg 80" }
    ]
  },
  {
    id: 47,
    level: 5,
    levelName: "Mini Projects and Problem Solving",
    title: "Rock-Paper-Scissors Match Engine",
    difficulty: "Intermediate",
    description: "Evaluate a Rock-Paper-Scissors round. Given Player 1's move and Player 2's move (rock, paper, or scissors), determine if Player 1 wins, Player 2 wins, or it is a Tie.",
    requirements: [
      "Input player 1 and player 2 moves.",
      "Handle rock beats scissors, scissors beats paper, paper beats rock.",
      "Print 'Player 1 wins', 'Player 2 wins', or 'Tie'."
    ],
    sampleInput: "rock\nscissors",
    sampleOutput: "Player 1 wins",
    hint: "Check tie first (p1 == p2), then check the 3 winning combinations for Player 1.",
    starterCode: "# Rock-Paper-Scissors evaluator\np1 = input(\"Player 1: \").strip().lower()\np2 = input(\"Player 2: \").strip().lower()\n",
    solutionCode: "p1 = input(\"P1: \").lower().strip()\np2 = input(\"P2: \").lower().strip()\nif p1 == p2:\n    print(\"Tie\")\nelif (p1 == 'rock' and p2 == 'scissors') or (p1 == 'scissors' and p2 == 'paper') or (p1 == 'paper' and p2 == 'rock'):\n    print(\"Player 1 wins\")\nelse:\n    print(\"Player 2 wins\")",
    explanation: "Game resolution can be modeled using compound Boolean expressions checking win conditions.",
    testCases: [
      { input: ["rock", "scissors"], validate: (out) => out.toLowerCase().includes("player 1 wins"), desc: "Rock beats scissors" },
      { input: ["rock", "rock"], validate: (out) => out.toLowerCase().includes("tie"), desc: "Same moves result in Tie" }
    ]
  },
  {
    id: 48,
    level: 5,
    levelName: "Mini Projects and Problem Solving",
    title: "Banking Ledger Simulation",
    difficulty: "Advanced",
    description: "Build an educational simulation of a bank account ledger. Start with a balance of $1000. Take an action ('deposit' or 'withdraw') and an amount. If withdrawing more than the balance, print 'Insufficient funds'. Otherwise update and print the new balance. (Label as simulation).",
    requirements: [
      "Initial balance $1000.",
      "Support 'deposit' and 'withdraw'.",
      "Check for overdraft (insufficient funds).",
      "Print updated balance."
    ],
    sampleInput: "withdraw\n250",
    sampleOutput: "Simulation Balance: $750.0",
    hint: "balance = 1000.0, if action == 'withdraw' and amount > balance: ...",
    starterCode: "# Banking simulation (educational only)\nbalance = 1000.0\naction = input(\"Action (deposit/withdraw): \").lower()\namount = float(input(\"Amount: \"))\n",
    solutionCode: "balance = 1000.0\naction = input().lower().strip()\namount = float(input())\nif action == 'deposit':\n    balance += amount\n    print(f\"Simulation Balance: ${balance:.1f}\")\nelif action == 'withdraw':\n    if amount > balance:\n        print(\"Insufficient funds\")\n    else:\n        balance -= amount\n        print(f\"Simulation Balance: ${balance:.1f}\")",
    explanation: "Maintains financial transaction invariants such as non-negative account balances.",
    testCases: [
      { input: ["withdraw", "250"], validate: (out) => out.includes("750"), desc: "Withdraw 250 from 1000 = 750" },
      { input: ["withdraw", "1500"], validate: (out) => out.toLowerCase().includes("insufficient"), desc: "Rejects overdraft attempt" }
    ]
  },
  {
    id: 49,
    level: 5,
    levelName: "Mini Projects and Problem Solving",
    title: "Contact Book with Dictionaries",
    difficulty: "Advanced",
    description: "Store contact names and phone numbers using a Python dictionary. Given two contact entries to store and a search name, look up and print the phone number, or 'Contact not found'.",
    requirements: [
      "Create dictionary.",
      "Store contacts.",
      "Search by contact name.",
      "Print number or 'Contact not found'."
    ],
    sampleInput: "Alice 9876543210\nBob 9123456780\nAlice",
    sampleOutput: "9876543210",
    hint: "Use contacts.get(search_name, 'Contact not found').",
    starterCode: "# Contact book lookup using dictionary\ncontacts = {}\n",
    solutionCode: "contacts = {}\nfor _ in range(2):\n    parts = input().split()\n    contacts[parts[0]] = parts[1]\nquery = input().strip()\nprint(contacts.get(query, \"Contact not found\"))",
    explanation: "Dictionaries provide key-value lookups with average O(1) time complexity.",
    testCases: [
      { input: ["Alice 9876543210", "Bob 9123456780", "Alice"], validate: (out) => out.includes("9876543210"), desc: "Finds Alice's number" },
      { input: ["Alice 9876543210", "Bob 9123456780", "Charlie"], validate: (out) => out.toLowerCase().includes("not found"), desc: "Reports missing contact" }
    ]
  },
  {
    id: 50,
    level: 5,
    levelName: "Mini Projects and Problem Solving",
    title: "Student Grade Management System",
    difficulty: "Advanced",
    description: "Manage grades for 3 students. For each student, enter their name and numeric marks (0-100). Store in a dictionary, print each student with their Pass/Fail status (>= 35 is Pass), and report the class topper (highest marks).",
    requirements: [
      "Input 3 students: name and marks.",
      "Print status for each student.",
      "Find and print student with highest marks (Topper)."
    ],
    sampleInput: "Rohan 88\nPooja 94\nKaran 32",
    sampleOutput: "Rohan: Pass\nPooja: Pass\nKaran: Fail\nTopper: Pooja",
    hint: "Keep track of highest marks and corresponding student name in a loop or using max().",
    starterCode: "# Student grade manager\nstudents = {}\n",
    solutionCode: "students = {}\nfor _ in range(3):\n    name, marks = input().split()\n    students[name] = float(marks)\nfor name, marks in students.items():\n    status = \"Pass\" if marks >= 35 else \"Fail\"\n    print(f\"{name}: {status}\")\ntopper = max(students, key=students.get)\nprint(f\"Topper: {topper}\")",
    explanation: "Combines dictionaries, formatted reporting, conditional expressions, and max() with a key extractor.",
    testCases: [
      { input: ["Rohan 88", "Pooja 94", "Karan 32"], expectedOutput: "Rohan: Pass\nPooja: Pass\nKaran: Fail\nTopper: Pooja", validate: (out) => out.includes("Pooja") && out.includes("Fail") && out.includes("Pass"), desc: "Identifies Pass/Fail and Topper" }
    ]
  },

  // ==========================================
  // LEVEL 6: FUNCTIONS, DICTIONARIES, TUPLES & SETS (Q51-Q60)
  // ==========================================
  {
    id: 51,
    level: 6,
    levelName: "Functions, Dictionaries & Sets",
    title: "Function: Return Square of a Number",
    difficulty: "Beginner",
    description: "Define a function named square(n) that takes a number n and returns its square (n * n). Read an integer from user input, call square(), and print the returned result.",
    requirements: [
      "Define a function def square(n): ...",
      "Function must return the square.",
      "Read an integer input and print the square."
    ],
    sampleInput: "5",
    sampleOutput: "25",
    hint: "Use the 'def' keyword to define functions and 'return n * n' to send the result back.",
    starterCode: "# Define square(n) and print square of input\ndef square(n):\n    # Write your code here\n    pass\n\nnum = int(input(\"Enter number: \"))\n",
    solutionCode: "def square(n):\n    return n * n\n\nnum = int(input(\"Enter number: \"))\nprint(square(num))",
    explanation: "Functions encapsulate reusable logic. The return keyword hands control and the calculated value back to the caller.",
    testCases: [
      { input: ["5"], expectedOutput: "25", validate: (out) => out.trim().includes("25"), desc: "Square of 5 is 25" },
      { input: ["-4"], expectedOutput: "16", validate: (out) => out.trim().includes("16"), desc: "Square of -4 is 16" }
    ]
  },
  {
    id: 52,
    level: 6,
    levelName: "Functions, Dictionaries & Sets",
    title: "Function: Maximum of Three Numbers",
    difficulty: "Beginner",
    description: "Write a function named max_of_three(a, b, c) that returns the largest of three given numbers without using Python's built-in max(). Read three numbers, pass them to your function, and print the returned maximum.",
    requirements: [
      "Define def max_of_three(a, b, c): ...",
      "Do not use the built-in max() function.",
      "Return the highest value.",
      "Print the returned result."
    ],
    sampleInput: "12\n45\n23",
    sampleOutput: "45",
    hint: "Compare a, b, and c using if/elif conditions, or keep track of the largest variable.",
    starterCode: "# Define max_of_three(a, b, c)\ndef max_of_three(a, b, c):\n    # Return largest value\n    pass\n\n",
    solutionCode: "def max_of_three(a, b, c):\n    largest = a\n    if b > largest:\n        largest = b\n    if c > largest:\n        largest = c\n    return largest\n\na = float(input())\nb = float(input())\nc = float(input())\nprint(int(max_of_three(a, b, c)) if max_of_three(a, b, c).is_integer() else max_of_three(a, b, c))",
    explanation: "Stepwise comparison keeps the algorithm independent of built-in helpers.",
    testCases: [
      { input: ["12", "45", "23"], expectedOutput: "45", validate: (out) => out.includes("45"), desc: "Finds 45 as maximum" },
      { input: ["-5", "-2", "-9"], expectedOutput: "-2", validate: (out) => out.includes("-2"), desc: "Finds -2 as maximum negative" }
    ]
  },
  {
    id: 53,
    level: 6,
    levelName: "Functions, Dictionaries & Sets",
    title: "Function: Temperature Converter",
    difficulty: "Beginner",
    description: "Create a function celsius_to_fahrenheit(c) that converts temperature from Celsius to Fahrenheit using the formula (C * 9/5) + 32. Read Celsius from input, call the function, and print the Fahrenheit temperature.",
    requirements: [
      "Define def celsius_to_fahrenheit(c): ...",
      "Apply formula: (c * 9/5) + 32.",
      "Print resulting Fahrenheit value."
    ],
    sampleInput: "25",
    sampleOutput: "77.0",
    hint: "Convert input to float first: c = float(input()).",
    starterCode: "# Celsius to Fahrenheit converter function\ndef celsius_to_fahrenheit(c):\n    pass\n\nc = float(input(\"Enter Celsius: \"))\n",
    solutionCode: "def celsius_to_fahrenheit(c):\n    return (c * 9/5) + 32\n\nc = float(input(\"Enter Celsius: \"))\nresult = celsius_to_fahrenheit(c)\nprint(round(result, 1))",
    explanation: "Mathematical formulas encapsulated within functions can be reused across different data inputs.",
    testCases: [
      { input: ["0"], expectedOutput: "32.0", validate: (out) => out.includes("32"), desc: "0°C is 32°F" },
      { input: ["100"], expectedOutput: "212.0", validate: (out) => out.includes("212"), desc: "100°C is 212°F" },
      { input: ["25"], expectedOutput: "77.0", validate: (out) => out.includes("77"), desc: "25°C is 77°F" }
    ]
  },
  {
    id: 54,
    level: 6,
    levelName: "Functions, Dictionaries & Sets",
    title: "Dictionary: Word Length Mapping",
    difficulty: "Intermediate",
    description: "Read a space-separated sentence from the user. Create a dictionary where each word is a key, and its character length is the value. Print each word and its length in the format: 'word: length'.",
    requirements: [
      "Split input into words.",
      "Construct dictionary mapping each word to len(word).",
      "Print each entry formatted as 'word: length'."
    ],
    sampleInput: "apple banana pear",
    sampleOutput: "apple: 5\nbanana: 6\npear: 4",
    hint: "Iterate over words: lengths = {w: len(w) for w in words}.",
    starterCode: "# Word length mapping\nsentence = input(\"Enter sentence: \")\nwords = sentence.split()\n",
    solutionCode: "sentence = input(\"Enter sentence: \")\nwords = sentence.split()\nlengths = {w: len(w) for w in words}\nfor w, l in lengths.items():\n    print(f\"{w}: {l}\")",
    explanation: "Dictionary comprehensions provide an elegant syntax for transforming iterables into key-value pairs.",
    testCases: [
      { input: ["apple banana pear"], expectedOutput: "apple: 5\nbanana: 6\npear: 4", validate: (out) => out.includes("apple: 5") && out.includes("banana: 6") && out.includes("pear: 4"), desc: "Maps lengths for apple, banana, pear" }
    ]
  },
  {
    id: 55,
    level: 6,
    levelName: "Functions, Dictionaries & Sets",
    title: "Dictionary: Inventory Price Calculator",
    difficulty: "Intermediate",
    description: "Given a catalog of items with prices {'apple': 2.0, 'banana': 1.5, 'cookie': 3.0}, ask the user for an item name and quantity. If item exists, calculate and print 'Total: $<amount>'. If not found, print 'Item not found'.",
    requirements: [
      "Store price dictionary.",
      "Check item existence in catalog.",
      "Compute price * quantity or report missing item."
    ],
    sampleInput: "apple\n3",
    sampleOutput: "Total: $6.0",
    hint: "Use 'if item in prices:' or prices.get(item).",
    starterCode: "# Inventory price calculator\nprices = {'apple': 2.0, 'banana': 1.5, 'cookie': 3.0}\nitem = input(\"Item: \").strip().lower()\nqty = int(input(\"Quantity: \"))\n",
    solutionCode: "prices = {'apple': 2.0, 'banana': 1.5, 'cookie': 3.0}\nitem = input().strip().lower()\nqty = int(input())\nif item in prices:\n    total = prices[item] * qty\n    print(f\"Total: ${total:.1f}\")\nelse:\n    print(\"Item not found\")",
    explanation: "Dictionaries provide fast key membership checks using the 'in' operator.",
    testCases: [
      { input: ["apple", "3"], expectedOutput: "Total: $6.0", validate: (out) => out.includes("6") && out.toLowerCase().includes("total"), desc: "Calculates $6.0 for 3 apples" },
      { input: ["mango", "2"], expectedOutput: "Item not found", validate: (out) => out.toLowerCase().includes("not found"), desc: "Reports missing item" }
    ]
  },
  {
    id: 56,
    level: 6,
    levelName: "Functions, Dictionaries & Sets",
    title: "Tuple: Coordinate Distance & Unpacking",
    difficulty: "Intermediate",
    description: "Read four numbers: x1, y1, x2, y2 representing points (x1, y1) and (x2, y2). Pack them into two tuples point1 and point2. Unpack them, calculate Euclidean distance: sqrt((x2 - x1)**2 + (y2 - y1)**2), and print the distance rounded to 1 decimal place.",
    requirements: [
      "Store coordinates in tuples.",
      "Unpack tuples to perform arithmetic.",
      "Calculate Euclidean distance and print rounded to 1 decimal place."
    ],
    sampleInput: "0\n0\n3\n4",
    sampleOutput: "5.0",
    hint: "Square root can be computed with ((x2 - x1)**2 + (y2 - y1)**2) ** 0.5.",
    starterCode: "# Tuple coordinates and distance\nx1 = float(input())\ny1 = float(input())\nx2 = float(input())\ny2 = float(input())\n",
    solutionCode: "x1, y1 = float(input()), float(input())\nx2, y2 = float(input()), float(input())\np1 = (x1, y1)\np2 = (x2, y2)\na, b = p1\nc, d = p2\ndist = ((c - a)**2 + (d - b)**2) ** 0.5\nprint(f\"{dist:.1f}\")",
    explanation: "Tuples are immutable sequences, ideal for grouping related values like coordinates.",
    testCases: [
      { input: ["0", "0", "3", "4"], expectedOutput: "5.0", validate: (out) => out.includes("5"), desc: "Distance between (0,0) and (3,4) is 5.0" },
      { input: ["1", "1", "4", "5"], expectedOutput: "5.0", validate: (out) => out.includes("5"), desc: "Distance between (1,1) and (4,5) is 5.0" }
    ]
  },
  {
    id: 57,
    level: 6,
    levelName: "Functions, Dictionaries & Sets",
    title: "Tuple: Swap Values Using Packing",
    difficulty: "Beginner",
    description: "Read two items from input. Swap their values using Python's idiomatic tuple packing/unpacking (a, b = b, a) and print the swapped values separated by a space.",
    requirements: [
      "Read two inputs into a and b.",
      "Swap using a, b = b, a.",
      "Print swapped values."
    ],
    sampleInput: "apple\norange",
    sampleOutput: "orange apple",
    hint: "Python evaluates the right side as a tuple (b, a) before unpacking to a, b.",
    starterCode: "# Swap two values using tuple assignment\na = input(\"First: \")\nb = input(\"Second: \")\n",
    solutionCode: "a = input()\nb = input()\na, b = b, a\nprint(f\"{a} {b}\")",
    explanation: "Tuple packing and unpacking allows seamless value swapping without temporary variables.",
    testCases: [
      { input: ["apple", "orange"], expectedOutput: "orange apple", validate: (out) => out.trim().includes("orange apple"), desc: "Swaps 'apple' and 'orange'" },
      { input: ["10", "20"], expectedOutput: "20 10", validate: (out) => out.trim().includes("20 10"), desc: "Swaps '10' and '20'" }
    ]
  },
  {
    id: 58,
    level: 6,
    levelName: "Functions, Dictionaries & Sets",
    title: "Set: Find Common Items (Intersection)",
    difficulty: "Intermediate",
    description: "Read two lines of space-separated words. Convert each line to a Python set. Compute the intersection (common words) and print them sorted alphabetically, or 'No common items' if empty.",
    requirements: [
      "Convert inputs into sets: set(line.split()).",
      "Find intersection using the & operator or .intersection().",
      "Print sorted items or 'No common items'."
    ],
    sampleInput: "red green blue\nblue yellow red",
    sampleOutput: "blue red",
    hint: "common = sorted(set1 & set2). Use ' '.join(common).",
    starterCode: "# Common items using set intersection\nline1 = input(\"First line: \")\nline2 = input(\"Second line: \")\n",
    solutionCode: "set1 = set(input().split())\nset2 = set(input().split())\ncommon = sorted(set1 & set2)\nif common:\n    print(\" \".join(common))\nelse:\n    print(\"No common items\")",
    explanation: "Sets represent unordered collections of unique elements, supporting high-speed mathematical set operations like intersection.",
    testCases: [
      { input: ["red green blue", "blue yellow red"], expectedOutput: "blue red", validate: (out) => out.includes("blue") && out.includes("red"), desc: "Finds common items 'blue' and 'red'" },
      { input: ["cat dog", "fish bird"], expectedOutput: "No common items", validate: (out) => out.toLowerCase().includes("no common"), desc: "Reports no common items" }
    ]
  },
  {
    id: 59,
    level: 6,
    levelName: "Functions, Dictionaries & Sets",
    title: "Set: Remove Duplicates & Count Unique",
    difficulty: "Beginner",
    description: "Read a space-separated sequence of numbers. Use a set to eliminate duplicate numbers, print the count of unique numbers, and print the sorted unique numbers.",
    requirements: [
      "Parse numbers from input.",
      "Deduplicate with set().",
      "Print unique count on first line, sorted numbers on second line."
    ],
    sampleInput: "4 2 4 1 2 5",
    sampleOutput: "4\n1 2 4 5",
    hint: "unique = sorted(set(int(x) for x in input().split())). Then print len(unique) and ' '.join(map(str, unique)).",
    starterCode: "# Unique elements with set\nraw = input(\"Enter numbers: \")\n",
    solutionCode: "nums = [int(x) for x in input().split()]\nunique = sorted(set(nums))\nprint(len(unique))\nprint(\" \".join(map(str, unique)))",
    explanation: "Passing an iterable to set() automatically discards all duplicate elements.",
    testCases: [
      { input: ["4 2 4 1 2 5"], expectedOutput: "4\n1 2 4 5", validate: (out) => out.includes("4") && out.includes("1 2 4 5"), desc: "Unique count 4 and sorted elements" }
    ]
  },
  {
    id: 60,
    level: 6,
    levelName: "Functions, Dictionaries & Sets",
    title: "Dictionary: Invert Key-Value Mapping",
    difficulty: "Intermediate",
    description: "Given student-roll pairs (e.g. 'Alice 101' and 'Bob 102') and a target roll number, store them in a dictionary mapping name to roll, invert the dictionary so roll maps to name, and print the name corresponding to the target roll, or 'Not found'.",
    requirements: [
      "Input 2 pairs of student and roll.",
      "Input target roll number to search.",
      "Invert dictionary (roll: name) and lookup target roll."
    ],
    sampleInput: "Alice 101\nBob 102\n101",
    sampleOutput: "Alice",
    hint: "inverted = {v: k for k, v in original.items()}.",
    starterCode: "# Invert dictionary mapping\ncontacts = {}\n",
    solutionCode: "d = {}\nfor _ in range(2):\n    name, roll = input().split()\n    d[name] = roll\ninverted = {v: k for k, v in d.items()}\ntarget = input().strip()\nprint(inverted.get(target, \"Not found\"))",
    explanation: "Dictionary inversion allows reverse lookup by transforming values into keys.",
    testCases: [
      { input: ["Alice 101", "Bob 102", "101"], expectedOutput: "Alice", validate: (out) => out.includes("Alice"), desc: "Finds Alice for roll 101" },
      { input: ["Alice 101", "Bob 102", "999"], expectedOutput: "Not found", validate: (out) => out.toLowerCase().includes("not found"), desc: "Reports missing roll number" }
    ]
  },

  // ==========================================
  // LEVEL 7: EXCEPTIONS, FILES & INTRODUCTORY CLASSES (Q61-Q72)
  // ==========================================
  {
    id: 61,
    level: 7,
    levelName: "Exceptions, Files & Classes",
    title: "Exception Handling: Safe Integer Input",
    difficulty: "Beginner",
    description: "Write a program that takes user input and attempts to convert it to an integer inside a try-except block. If valid, print 'Valid: <number>'. If a ValueError occurs, print 'Invalid integer'.",
    requirements: [
      "Wrap int() conversion in try-except ValueError.",
      "Print 'Valid: <num>' on success.",
      "Print 'Invalid integer' on ValueError."
    ],
    sampleInput: "42",
    sampleOutput: "Valid: 42",
    hint: "try: val = int(raw); print(f'Valid: {val}') except ValueError: print('Invalid integer')",
    starterCode: "# Safe integer input with try/except\nraw = input(\"Enter value: \")\n",
    solutionCode: "raw = input()\ntry:\n    val = int(raw)\n    print(f\"Valid: {val}\")\nexcept ValueError:\n    print(\"Invalid integer\")",
    explanation: "try-except blocks catch runtime exceptions and prevent programs from crashing abruptly on invalid inputs.",
    testCases: [
      { input: ["42"], expectedOutput: "Valid: 42", validate: (out) => out.includes("Valid: 42"), desc: "Accepts 42 as valid integer" },
      { input: ["hello"], expectedOutput: "Invalid integer", validate: (out) => out.toLowerCase().includes("invalid"), desc: "Catches ValueError on text input" }
    ]
  },
  {
    id: 62,
    level: 7,
    levelName: "Exceptions, Files & Classes",
    title: "Exception Handling: Safe Division Guard",
    difficulty: "Beginner",
    description: "Read two numbers: numerator and denominator. Attempt to divide them. Use a try-except block to catch ZeroDivisionError and print 'Cannot divide by zero'. Otherwise, print the calculated quotient.",
    requirements: [
      "Read numerator and denominator.",
      "Handle ZeroDivisionError cleanly.",
      "Print quotient or error message."
    ],
    sampleInput: "10\n2",
    sampleOutput: "5.0",
    hint: "try: print(num / den) except ZeroDivisionError: print('Cannot divide by zero')",
    starterCode: "# Safe division handling\nnum = float(input(\"Numerator: \"))\nden = float(input(\"Denominator: \"))\n",
    solutionCode: "num = float(input())\nden = float(input())\ntry:\n    res = num / den\n    print(f\"{res:.1f}\")\nexcept ZeroDivisionError:\n    print(\"Cannot divide by zero\")",
    explanation: "Catching ZeroDivisionError handles undefined arithmetic operations gracefully.",
    testCases: [
      { input: ["10", "2"], expectedOutput: "5.0", validate: (out) => out.includes("5"), desc: "10 / 2 = 5.0" },
      { input: ["10", "0"], expectedOutput: "Cannot divide by zero", validate: (out) => out.toLowerCase().includes("cannot divide by zero"), desc: "Catches ZeroDivisionError safely" }
    ]
  },
  {
    id: 63,
    level: 7,
    levelName: "Exceptions, Files & Classes",
    title: "Exception Handling: Multiple Exceptions",
    difficulty: "Intermediate",
    description: "Given a list items = [10, 20, 30], ask the user for an index and a divisor. Try to access items[index] and divide it by the divisor. Catch IndexError (print 'Index out of range') and ZeroDivisionError (print 'Zero divisor'). If successful, print the result.",
    requirements: [
      "Access items[index] and compute value / divisor.",
      "Catch IndexError and ZeroDivisionError separately.",
      "Print result or specific error message."
    ],
    sampleInput: "1\n5",
    sampleOutput: "4.0",
    hint: "Use multiple except clauses: except IndexError: ... except ZeroDivisionError: ...",
    starterCode: "# Multiple exceptions\nitems = [10, 20, 30]\nidx = int(input(\"Index: \"))\ndiv = float(input(\"Divisor: \"))\n",
    solutionCode: "items = [10, 20, 30]\ntry:\n    idx = int(input())\n    div = float(input())\n    print(f\"{items[idx] / div:.1f}\")\nexcept IndexError:\n    print(\"Index out of range\")\nexcept ZeroDivisionError:\n    print(\"Zero divisor\")",
    explanation: "A single try block can have multiple except clauses to differentiate error types.",
    testCases: [
      { input: ["1", "5"], expectedOutput: "4.0", validate: (out) => out.includes("4"), desc: "20 / 5 = 4.0" },
      { input: ["9", "2"], expectedOutput: "Index out of range", validate: (out) => out.toLowerCase().includes("index out of range"), desc: "Catches IndexError" },
      { input: ["0", "0"], expectedOutput: "Zero divisor", validate: (out) => out.toLowerCase().includes("zero divisor"), desc: "Catches ZeroDivisionError" }
    ]
  },
  {
    id: 64,
    level: 7,
    levelName: "Exceptions, Files & Classes",
    title: "File Simulator: Read Multiline Text Stream",
    difficulty: "Intermediate",
    description: "Simulate reading a file stream: read lines of text until the user enters 'END'. Count the total non-empty lines and total words across all lines. Print 'Lines: <count>' and 'Words: <count>'.",
    requirements: [
      "Read lines until 'END'.",
      "Count total lines and total words.",
      "Print 'Lines: X' and 'Words: Y'."
    ],
    sampleInput: "Python is great\nIt is versatile\nEND",
    sampleOutput: "Lines: 2\nWords: 6",
    hint: "Use a while True loop, break when line == 'END', and accumulate word count with len(line.split()).",
    starterCode: "# File stream reader simulator\nlines_count = 0\nwords_count = 0\n",
    solutionCode: "lines = 0\nwords = 0\nwhile True:\n    line = input()\n    if line == 'END':\n        break\n    lines += 1\n    words += len(line.split())\nprint(f\"Lines: {lines}\")\nprint(f\"Words: {words}\")",
    explanation: "Streaming file reading processes data incrementally, keeping memory usage constant.",
    testCases: [
      { input: ["Python is great", "It is versatile", "END"], expectedOutput: "Lines: 2\nWords: 6", validate: (out) => out.includes("Lines: 2") && out.includes("Words: 6"), desc: "2 lines, 6 words" }
    ]
  },
  {
    id: 65,
    level: 7,
    levelName: "Exceptions, Files & Classes",
    title: "File Simulator: Log File Error Counter",
    difficulty: "Intermediate",
    description: "Simulate scanning a log file. Read log entries until 'STOP'. Count how many lines contain '[ERROR]' and how many contain '[INFO]'. Print 'Errors: <count>' and 'Infos: <count>'.",
    requirements: [
      "Process log stream until 'STOP'.",
      "Count occurrences of '[ERROR]' and '[INFO]'.",
      "Print tally counts."
    ],
    sampleInput: "[INFO] Server started\n[ERROR] Connection failed\n[INFO] Client ping\n[ERROR] Database timeout\nSTOP",
    sampleOutput: "Errors: 2\nInfos: 2",
    hint: "Check if '[ERROR]' in line, and if '[INFO]' in line.",
    starterCode: "# Log scanner simulator\nerrors = 0\ninfos = 0\n",
    solutionCode: "errors = 0\ninfos = 0\nwhile True:\n    line = input()\n    if line == 'STOP':\n        break\n    if '[ERROR]' in line:\n        errors += 1\n    if '[INFO]' in line:\n        infos += 1\nprint(f\"Errors: {errors}\")\nprint(f\"Infos: {infos}\")",
    explanation: "Log analysis relies on sequential string pattern recognition to triage system events.",
    testCases: [
      { input: ["[INFO] Server started", "[ERROR] Connection failed", "[INFO] Client ping", "[ERROR] Database timeout", "STOP"], expectedOutput: "Errors: 2\nInfos: 2", validate: (out) => out.includes("Errors: 2") && out.includes("Infos: 2"), desc: "Counts 2 errors and 2 infos" }
    ]
  },
  {
    id: 66,
    level: 7,
    levelName: "Exceptions, Files & Classes",
    title: "File Simulator: Config Key-Value Parser",
    difficulty: "Intermediate",
    description: "Simulate parsing a configuration file. Read lines in the format 'KEY=VALUE' until 'DONE'. Then read a query key. Print the value associated with that key, or 'Not configured' if it does not exist.",
    requirements: [
      "Split lines by '=' into key and value.",
      "Store in config dictionary.",
      "Query target key and print value or 'Not configured'."
    ],
    sampleInput: "HOST=localhost\nPORT=8080\nDONE\nPORT",
    sampleOutput: "8080",
    hint: "parts = line.split('=', 1), config[parts[0]] = parts[1].",
    starterCode: "# Config file parser simulator\nconfig = {}\n",
    solutionCode: "config = {}\nwhile True:\n    line = input().strip()\n    if line == 'DONE':\n        break\n    if '=' in line:\n        k, v = line.split('=', 1)\n        config[k.strip()] = v.strip()\ntarget = input().strip()\nprint(config.get(target, \"Not configured\"))",
    explanation: "Parsing configuration files maps textual settings to in-memory dictionaries for runtime parameterization.",
    testCases: [
      { input: ["HOST=localhost", "PORT=8080", "DONE", "PORT"], expectedOutput: "8080", validate: (out) => out.includes("8080"), desc: "Finds PORT value 8080" },
      { input: ["HOST=localhost", "PORT=8080", "DONE", "DB_NAME"], expectedOutput: "Not configured", validate: (out) => out.toLowerCase().includes("not configured"), desc: "Reports missing key" }
    ]
  },
  {
    id: 67,
    level: 7,
    levelName: "Exceptions, Files & Classes",
    title: "Class: Create a Rectangle Class",
    difficulty: "Intermediate",
    description: "Define a class named Rectangle with an __init__(self, width, height) constructor, an area(self) method (returns width * height), and a perimeter(self) method (returns 2 * (width + height)). Read width and height from input, instantiate the class, and print 'Area: <area>' and 'Perimeter: <perimeter>'.",
    requirements: [
      "Define class Rectangle with __init__, area, and perimeter methods.",
      "Instantiate with input dimensions.",
      "Print formatted Area and Perimeter."
    ],
    sampleInput: "5\n4",
    sampleOutput: "Area: 20.0\nPerimeter: 18.0",
    hint: "class Rectangle:\n    def __init__(self, w, h): self.w, self.h = w, h\n    def area(self): return self.w * self.h",
    starterCode: "# Define Rectangle class\nclass Rectangle:\n    pass\n\nw = float(input(\"Width: \"))\nh = float(input(\"Height: \"))\n",
    solutionCode: "class Rectangle:\n    def __init__(self, width, height):\n        self.width = width\n        self.height = height\n    def area(self):\n        return self.width * self.height\n    def perimeter(self):\n        return 2 * (self.width + self.height)\n\nw = float(input())\nh = float(input())\nrect = Rectangle(w, h)\nprint(f\"Area: {rect.area():.1f}\")\nprint(f\"Perimeter: {rect.perimeter():.1f}\")",
    explanation: "Object-oriented classes bundle data attributes and computational methods together into single cohesive abstractions.",
    testCases: [
      { input: ["5", "4"], expectedOutput: "Area: 20.0\nPerimeter: 18.0", validate: (out) => out.includes("20") && out.includes("18"), desc: "Area 20, Perimeter 18" },
      { input: ["10", "2.5"], expectedOutput: "Area: 25.0\nPerimeter: 25.0", validate: (out) => out.includes("25"), desc: "Area 25, Perimeter 25" }
    ]
  },
  {
    id: 68,
    level: 7,
    levelName: "Exceptions, Files & Classes",
    title: "Class: BankAccount with Encapsulation",
    difficulty: "Advanced",
    description: "Define a class BankAccount with __init__(self, owner, balance=0.0). Add methods: deposit(self, amount), withdraw(self, amount) which prints 'Insufficient funds' if amount > balance, and get_balance(self). Read initial balance, deposit amount, and withdraw amount, and print the final balance.",
    requirements: [
      "Define class BankAccount with owner and balance.",
      "Implement deposit, withdraw, and get_balance.",
      "Reject overdraft with 'Insufficient funds'.",
      "Print final balance: 'Balance: $<amt>'."
    ],
    sampleInput: "100\n50\n30",
    sampleOutput: "Balance: $120.0",
    hint: "Remember to update self.balance during deposit and withdraw.",
    starterCode: "# BankAccount class\nclass BankAccount:\n    pass\n\ninit_bal = float(input(\"Initial balance: \"))\n",
    solutionCode: "class BankAccount:\n    def __init__(self, balance=0.0):\n        self.balance = balance\n    def deposit(self, amount):\n        self.balance += amount\n    def withdraw(self, amount):\n        if amount > self.balance:\n            print(\"Insufficient funds\")\n        else:\n            self.balance -= amount\n    def get_balance(self):\n        return self.balance\n\nacc = BankAccount(float(input()))\nacc.deposit(float(input()))\nacc.withdraw(float(input()))\nprint(f\"Balance: ${acc.get_balance():.1f}\")",
    explanation: "Encapsulation safeguards internal state (like account balance) behind verified method interfaces.",
    testCases: [
      { input: ["100", "50", "30"], expectedOutput: "Balance: $120.0", validate: (out) => out.includes("120"), desc: "100 + 50 - 30 = 120" },
      { input: ["50", "20", "100"], expectedOutput: "Insufficient funds\nBalance: $70.0", validate: (out) => out.toLowerCase().includes("insufficient") && out.includes("70"), desc: "Rejects overdraft of 100 on 70 balance" }
    ]
  },
  {
    id: 69,
    level: 7,
    levelName: "Exceptions, Files & Classes",
    title: "Class: Student Grade Tracker",
    difficulty: "Advanced",
    description: "Define a class Student with __init__(self, name) and an internal list self.grades = []. Add methods add_grade(self, grade) and get_average(self). Read a student name and 3 numeric grades, instantiate Student, add the grades, and print '<name>: Average <avg>'.",
    requirements: [
      "Define class Student with name and grades list.",
      "Implement add_grade and get_average methods.",
      "Print student name and average rounded to 1 decimal place."
    ],
    sampleInput: "Priya\n85\n90\n95",
    sampleOutput: "Priya: Average 90.0",
    hint: "get_average returns sum(self.grades) / len(self.grades) if grades else 0.",
    starterCode: "# Student grade tracker class\nclass Student:\n    pass\n\nname = input(\"Student name: \")\n",
    solutionCode: "class Student:\n    def __init__(self, name):\n        self.name = name\n        self.grades = []\n    def add_grade(self, grade):\n        self.grades.append(grade)\n    def get_average(self):\n        return sum(self.grades) / len(self.grades) if self.grades else 0.0\n\ns = Student(input().strip())\nfor _ in range(3):\n    s.add_grade(float(input()))\nprint(f\"{s.name}: Average {s.get_average():.1f}\")",
    explanation: "Instances maintain independent state (unique student name and specific grades list).",
    testCases: [
      { input: ["Priya", "85", "90", "95"], expectedOutput: "Priya: Average 90.0", validate: (out) => out.includes("Priya") && out.includes("90"), desc: "Priya with average 90.0" },
      { input: ["Alex", "70", "75", "80"], expectedOutput: "Alex: Average 75.0", validate: (out) => out.includes("Alex") && out.includes("75"), desc: "Alex with average 75.0" }
    ]
  },
  {
    id: 70,
    level: 7,
    levelName: "Exceptions, Files & Classes",
    title: "Class: Book and Library Catalog System",
    difficulty: "Advanced",
    description: "Define a class Book with attributes title and author. Define class Library with an internal list books and methods add_book(self, book) and find_by_author(self, author). Read two books formatted as 'Title - Author' and a target author. Print the titles of matching books separated by a comma, or 'No books found'.",
    requirements: [
      "Define Book and Library classes.",
      "Library maintains a collection of Book objects.",
      "Search by author and print matching book titles or 'No books found'."
    ],
    sampleInput: "1984 - George Orwell\nAnimal Farm - George Orwell\nGeorge Orwell",
    sampleOutput: "1984, Animal Farm",
    hint: "matches = [b.title for b in self.books if b.author.lower() == author.lower()].",
    starterCode: "# Book and Library system\nclass Book:\n    pass\n\nclass Library:\n    pass\n",
    solutionCode: "class Book:\n    def __init__(self, title, author):\n        self.title = title.strip()\n        self.author = author.strip()\n\nclass Library:\n    def __init__(self):\n        self.books = []\n    def add_book(self, book):\n        self.books.append(book)\n    def find_by_author(self, author):\n        return [b.title for b in self.books if b.author.lower() == author.strip().lower()]\n\nlib = Library()\nfor _ in range(2):\n    t, a = input().split('-')\n    lib.add_book(Book(t, a))\ntarget = input().strip()\nmatches = lib.find_by_author(target)\nprint(\", \".join(matches) if matches else \"No books found\")",
    explanation: "Composition connects multiple domain objects together, modeling real-world associations like libraries containing books.",
    testCases: [
      { input: ["1984 - George Orwell", "Animal Farm - George Orwell", "George Orwell"], expectedOutput: "1984, Animal Farm", validate: (out) => out.includes("1984") && out.includes("Animal Farm"), desc: "Finds 1984 and Animal Farm for George Orwell" },
      { input: ["The Hobbit - Tolkien", "Dune - Herbert", "Asimov"], expectedOutput: "No books found", validate: (out) => out.toLowerCase().includes("no books found"), desc: "Reports no books found" }
    ]
  },
  {
    id: 71,
    level: 7,
    levelName: "Exceptions, Files & Classes",
    title: "Class Inheritance: Employee and Manager",
    difficulty: "Advanced",
    description: "Define a base class Employee with attributes name and salary, and a method get_details() returning '<name> earns $<salary>'. Define a subclass Manager that inherits from Employee, accepts an additional department attribute, and overrides get_details() to return '<name> manages <department> and earns $<salary>'. Read an employee name, salary, and department, create a Manager instance, and print their details.",
    requirements: [
      "Create base class Employee with name, salary, and get_details().",
      "Create subclass Manager inheriting Employee with department attribute.",
      "Read name, salary, and department, then print manager.get_details()."
    ],
    sampleInput: "Sarah\n85000\nEngineering",
    sampleOutput: "Sarah manages Engineering and earns $85000",
    hint: "class Manager(Employee): def __init__(self, name, salary, dept): super().__init__(name, salary); self.department = dept",
    starterCode: "# Class inheritance with Employee and Manager\nclass Employee:\n    pass\n\nclass Manager(Employee):\n    pass\n",
    solutionCode: "class Employee:\n    def __init__(self, name, salary):\n        self.name = name.strip()\n        self.salary = str(salary).strip()\n    def get_details(self):\n        return f\"{self.name} earns ${self.salary}\"\n\nclass Manager(Employee):\n    def __init__(self, name, salary, department):\n        super().__init__(name, salary)\n        self.department = department.strip()\n    def get_details(self):\n        return f\"{self.name} manages {self.department} and earns ${self.salary}\"\n\nname = input().strip()\nsalary = input().strip()\ndept = input().strip()\nmgr = Manager(name, salary, dept)\nprint(mgr.get_details())",
    explanation: "Inheritance allows a subclass to reuse and extend behavior from a parent class using super().__init__().",
    testCases: [
      { input: ["Sarah", "85000", "Engineering"], expectedOutput: "Sarah manages Engineering and earns $85000", validate: (out) => out.includes("Sarah manages Engineering") && out.includes("85000"), desc: "Sarah manages Engineering and earns $85000" },
      { input: ["David", "62000", "Marketing"], expectedOutput: "David manages Marketing and earns $62000", validate: (out) => out.includes("David manages Marketing") && out.includes("62000"), desc: "David manages Marketing and earns $62000" }
    ]
  },
  {
    id: 72,
    level: 7,
    levelName: "Exceptions, Files & Classes",
    title: "Capstone System: Contact Book Directory & Validation",
    difficulty: "Advanced",
    description: "Build an interactive contact directory system. Define a class Contact with name and phone. Define class ContactBook with a dictionary of contacts and methods add_contact(name, phone) and search(name). Read an integer N for the number of contacts to add, followed by N lines each formatted as 'Name,Phone'. Then read a query name. If the query name exists (case-insensitive), print 'Found: <Name> - <Phone>'. If not found, print 'Contact not found'. If a phone contains non-digit characters, print 'Invalid phone number' and do not add it.",
    requirements: [
      "Read N and add N contacts to ContactBook.",
      "Validate phone numbers contains only digits.",
      "Search for a contact name case-insensitively.",
      "Print 'Found: <Name> - <Phone>' or 'Contact not found'."
    ],
    sampleInput: "2\nAlice,9876543210\nBob,1234567890\nAlice",
    sampleOutput: "Found: Alice - 9876543210",
    hint: "Store contacts in a dictionary with lowercase names as keys: contacts[name.lower()] = Contact(name, phone).",
    starterCode: "# Capstone Contact Book System\nclass Contact:\n    pass\n\nclass ContactBook:\n    pass\n",
    solutionCode: "class Contact:\n    def __init__(self, name, phone):\n        self.name = name.strip()\n        phone_clean = phone.strip()\n        if not phone_clean.isdigit():\n            raise ValueError(\"Invalid phone number\")\n        self.phone = phone_clean\n\nclass ContactBook:\n    def __init__(self):\n        self.contacts = {}\n    def add_contact(self, name, phone):\n        try:\n            c = Contact(name, phone)\n            self.contacts[name.strip().lower()] = c\n        except ValueError:\n            print(\"Invalid phone number\")\n    def search(self, name):\n        key = name.strip().lower()\n        if key in self.contacts:\n            c = self.contacts[key]\n            return f\"Found: {c.name} - {c.phone}\"\n        return \"Contact not found\"\n\nn = int(input().strip())\nbook = ContactBook()\nfor _ in range(n):\n    line = input().strip()\n    if ',' in line:\n        name, phone = line.split(',', 1)\n        book.add_contact(name, phone)\nq = input().strip()\nprint(book.search(q))",
    explanation: "This capstone combines classes, dictionaries, validation with exceptions, and dynamic lookups into an integrated software module.",
    testCases: [
      { input: ["2", "Alice,9876543210", "Bob,1234567890", "Alice"], expectedOutput: "Found: Alice - 9876543210", validate: (out) => out.includes("Found: Alice - 9876543210"), desc: "Finds Alice with valid phone" },
      { input: ["2", "Alice,9876543210", "Bob,1234567890", "Charlie"], expectedOutput: "Contact not found", validate: (out) => out.toLowerCase().includes("contact not found"), desc: "Reports contact not found for Charlie" },
      { input: ["1", "Eve,abc123", "Eve"], expectedOutput: "Invalid phone number\nContact not found", validate: (out) => out.includes("Invalid phone number"), desc: "Rejects non-numeric phone and reports not found" }
    ]
  }
];

// Helper to retrieve challenge of the day deterministically
function getChallengeOfTheDay() {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 0);
  const diff = now - startOfYear;
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  const questionIndex = dayOfYear % QUESTIONS_DATA.length;
  return QUESTIONS_DATA[questionIndex];
}

// Export for module systems or attach to global window
if (typeof window !== "undefined") {
  window.QUESTIONS_DATA = QUESTIONS_DATA;
  window.QUESTIONS = QUESTIONS_DATA;
  window.getChallengeOfTheDay = getChallengeOfTheDay;
}
