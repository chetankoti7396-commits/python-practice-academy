/**
 * PYTHON PRACTICE ACADEMY — LEARNING CONTENT & GLOSSARY REPOSITORY
 * Contains:
 * 1. Comprehensive Beginner Python Glossary (linked from challenges and learn page)
 * 2. Line-by-Line Worked Examples for all 7 Curriculum Levels with similar challenge links
 */

const GLOSSARY_DATA = [
  {
    id: "variable",
    term: "Variable",
    category: "Basics & Types",
    definition: "A named storage container in memory used to hold data (like numbers, text, or lists) so you can use and change it later.",
    example: "name = \"Alex\"\nage = 20\nprint(name)",
    tip: "Variable names in Python must start with a letter or underscore, cannot contain spaces, and are case-sensitive (Score and score are different).",
    relatedQuestions: [1, 2, 3, 10]
  },
  {
    id: "string",
    term: "String (str)",
    category: "Basics & Types",
    definition: "A sequence of text characters wrapped in single quotes ('...') or double quotes (\"...\"). Strings can contain letters, numbers, spaces, and symbols.",
    example: "greeting = \"Hello, World!\"\nprint(greeting[0])  # 'H'",
    tip: "The input() function always returns text as a string, even if the user types digits. To do math, convert with int() or float().",
    relatedQuestions: [1, 2, 31, 32, 34]
  },
  {
    id: "integer",
    term: "Integer (int)",
    category: "Basics & Types",
    definition: "A whole number without a decimal point (positive, negative, or zero), such as 5, -12, or 0.",
    example: "count = 10\ntemperature = -3\nresult = count + temperature",
    tip: "Use int(text) to convert a string of digits into a whole number before doing calculations.",
    relatedQuestions: [3, 4, 7, 11]
  },
  {
    id: "float",
    term: "Float (float)",
    category: "Basics & Types",
    definition: "A number with a fractional/decimal point, such as 3.14, 0.5, or -20.0.",
    example: "pi = 3.14159\nprice = float(input(\"Price: \"))",
    tip: "Standard division with a single slash (a / b) always produces a float in Python 3 (e.g., 4 / 2 becomes 2.0).",
    relatedQuestions: [6, 8, 9, 53]
  },
  {
    id: "boolean",
    term: "Boolean (bool)",
    category: "Basics & Types",
    definition: "A logical data type that can have only one of two values: True or False (always capitalized in Python).",
    example: "is_logged_in = True\nis_game_over = False",
    tip: "Comparison operators like ==, >, <, and != evaluate to a boolean True or False.",
    relatedQuestions: [11, 14, 15]
  },
  {
    id: "type-conversion",
    term: "Type Conversion / Casting",
    category: "Basics & Types",
    definition: "The process of converting a value from one data type to another using conversion functions like int(), float(), str(), or list().",
    example: "raw = \"42\"\nnumber = int(raw)  # converts text '42' into integer 42",
    tip: "Attempting int(\"hello\") will raise a ValueError because letters cannot be converted into numbers.",
    relatedQuestions: [3, 7, 8, 61]
  },
  {
    id: "condition",
    term: "Condition / Conditional",
    category: "Control Flow",
    definition: "A decision-making statement (if, elif, else) that runs a specific block of code only when an expression evaluates to True.",
    example: "score = 85\nif score >= 90:\n    print(\"Grade A\")\nelif score >= 80:\n    print(\"Grade B\")\nelse:\n    print(\"Keep practicing\")",
    tip: "Always end if and elif statements with a colon (:) and indent the code block beneath them by 4 spaces.",
    relatedQuestions: [11, 12, 13, 14, 19]
  },
  {
    id: "modulo",
    term: "Modulo Operator (%)",
    category: "Control Flow",
    definition: "An arithmetic operator that divides one number by another and returns only the remainder.",
    example: "print(10 % 3)  # Outputs 1 (because 10 = 3*3 + 1)\nprint(14 % 2)  # Outputs 0 (even number)",
    tip: "Use num % 2 == 0 to check if a number is even, and num % 2 != 0 to check if it's odd.",
    relatedQuestions: [11, 15, 16]
  },
  {
    id: "loop",
    term: "Loop (for & while)",
    category: "Control Flow",
    definition: "A programming structure that repeats a block of code multiple times until a condition is met or an iterable is exhausted.",
    example: "# for loop\nfor i in range(5):\n    print(i)\n\n# while loop\ncount = 3\nwhile count > 0:\n    print(count)\n    count -= 1",
    tip: "In a while loop, make sure the loop variable changes inside the block so the condition eventually becomes False to prevent an infinite loop.",
    relatedQuestions: [21, 22, 23, 24, 25, 30]
  },
  {
    id: "range",
    term: "range() Function",
    category: "Control Flow",
    definition: "A built-in helper that generates a sequence of numbers. range(stop) starts at 0 and goes up to stop-1. range(start, stop, step) allows custom bounds and steps.",
    example: "for i in range(1, 6):\n    print(i)  # Prints 1, 2, 3, 4, 5 (stops before 6)",
    tip: "Remember that range(stop) stops *before* the stop value, not including it.",
    relatedQuestions: [21, 24, 25]
  },
  {
    id: "list",
    term: "List",
    category: "Data Structures",
    definition: "An ordered, mutable (changeable) collection of items enclosed in square brackets [...]. Items can be of different types.",
    example: "fruits = [\"apple\", \"banana\", \"cherry\"]\nfruits.append(\"mango\")\nprint(fruits[0])  # \"apple\"",
    tip: "Use len(my_list) to get the total number of items, and .append(item) to add a new item to the end.",
    relatedQuestions: [35, 36, 37, 38, 39]
  },
  {
    id: "indexing",
    term: "Indexing & Slicing",
    category: "Data Structures",
    definition: "Accessing individual elements or sub-sequences using zero-based position numbers in brackets [index] or [start:stop:step].",
    example: "text = \"Python\"\nprint(text[0])     # 'P' (first character)\nprint(text[-1])    # 'n' (last character)\nprint(text[0:3])   # 'Pyt' (from index 0 up to 3)",
    tip: "Python indexing always starts at 0, not 1. Negative indices count backward from the end.",
    relatedQuestions: [31, 32, 33, 36]
  },
  {
    id: "dictionary",
    term: "Dictionary (dict)",
    category: "Data Structures",
    definition: "An unordered collection of key-value pairs enclosed in curly braces {key: value}. Keys must be unique and immutable.",
    example: "scores = {\"Alex\": 92, \"Priya\": 98}\nprint(scores[\"Priya\"])  # 98\nscores[\"Sam\"] = 85      # Add new key-value pair",
    tip: "Use dict.get(key, default) to safely retrieve a value without crashing if the key doesn't exist.",
    relatedQuestions: [49, 54, 55, 60]
  },
  {
    id: "tuple",
    term: "Tuple",
    category: "Data Structures",
    definition: "An ordered, immutable (cannot be changed after creation) sequence of elements enclosed in parentheses (...).",
    example: "point = (10, 20)\nx, y = point  # Tuple unpacking",
    tip: "Tuples are faster and safer than lists for data that should never be modified, like coordinates or RGB colors.",
    relatedQuestions: [10, 56, 57]
  },
  {
    id: "set",
    term: "Set",
    category: "Data Structures",
    definition: "An unordered collection of unique elements enclosed in curly braces {item1, item2} or created with set(). Automatically discards duplicates.",
    example: "numbers = {1, 2, 2, 3}\nprint(numbers)  # {1, 2, 3}",
    tip: "Use set1 & set2 to find common items (intersection) and set1 | set2 for the union.",
    relatedQuestions: [38, 58, 59]
  },
  {
    id: "function",
    term: "Function & def",
    category: "Functions",
    definition: "A reusable, named block of code defined with the def keyword that performs an action and can accept inputs and return a result.",
    example: "def greet(name):\n    return f\"Hello, {name}!\"\n\nmessage = greet(\"Sam\")\nprint(message)",
    tip: "Variables created inside a function are local to that function and cannot be accessed outside it.",
    relatedQuestions: [51, 52, 53]
  },
  {
    id: "parameter",
    term: "Parameter & Argument",
    category: "Functions",
    definition: "A parameter is the variable name listed inside the function's parentheses in its definition. An argument is the actual value passed to the function when calling it.",
    example: "def add(a, b):   # 'a' and 'b' are parameters\n    return a + b\n\nresult = add(5, 7)  # 5 and 7 are arguments",
    tip: "Make sure you pass the expected number of arguments matching the parameters, or define default parameter values like def greet(name='learner'):.",
    relatedQuestions: [51, 52]
  },
  {
    id: "return",
    term: "Return Value",
    category: "Functions",
    definition: "The output value that a function sends back to the code that called it using the return statement. If no return statement is used, the function returns None.",
    example: "def square(n):\n    return n * n\n\nx = square(4)  # x becomes 16",
    tip: "return immediately terminates execution of the function. Any code placed after return in that function will not execute.",
    relatedQuestions: [51, 52, 53]
  },
  {
    id: "exception",
    term: "Exception / Error Handling",
    category: "Exceptions & Files",
    definition: "Handling runtime errors gracefully using try and except blocks so your program continues running instead of crashing.",
    example: "try:\n    num = int(input(\"Enter a number: \"))\n    print(100 / num)\nexcept ValueError:\n    print(\"That was not a valid number!\")\nexcept ZeroDivisionError:\n    print(\"Cannot divide by zero!\")",
    tip: "Always specify the exception type (e.g. except ValueError:) rather than a bare except: so you don't hide unexpected bugs.",
    relatedQuestions: [6, 61, 62, 63]
  },
  {
    id: "class",
    term: "Class & Object (OOP)",
    category: "Classes & OOP",
    definition: "A blueprint (class) for creating objects that bundle data attributes (variables) and methods (functions) together into a single structure.",
    example: "class Dog:\n    def __init__(self, name):\n        self.name = name\n    def bark(self):\n        return f\"{self.name} says Woof!\"\n\nmy_dog = Dog(\"Buddy\")\nprint(my_dog.bark())",
    tip: "self represents the specific instance of the class and must be the first parameter in all instance methods.",
    relatedQuestions: [67, 68, 69, 70, 71, 72]
  },
  {
    id: "indentation",
    term: "Indentation",
    category: "Basics & Types",
    definition: "The whitespace (usually 4 spaces) at the beginning of a line that tells Python which block of code belongs to a statement (like an if, for, while, or def).",
    example: "if True:\n    print(\"Inside the if block\")\nprint(\"Outside the block\")",
    tip: "Never mix tabs and spaces. In this academy, pressing the Tab key automatically inserts 4 spaces.",
    relatedQuestions: [1, 11, 21, 51]
  }
];

const WORKED_EXAMPLES = [
  {
    level: 1,
    levelName: "Variables and Basic Maths",
    title: "Reading User Input, Converting Numbers, and Calculating a Total",
    concept: "How to take user input, convert text to numbers, do arithmetic, and display the result formatted.",
    code: `# Step 1: Read two inputs from the user\nprice_input = input("Enter item price: ")\nquantity_input = input("Enter quantity: ")\n\n# Step 2: Convert strings to numbers\nprice = float(price_input)    # float for currency\nquantity = int(quantity_input) # int for whole items\n\n# Step 3: Compute the total\ntotal = price * quantity\n\n# Step 4: Display the result with formatting\nprint(f"Total Cost: \${total:.2f}")`,
    lineByLine: [
      {
        line: 'price_input = input("Enter item price: ")',
        explanation: 'The input() function asks the user to type something and pauses. Whatever they type is stored in price_input as a string (text).'
      },
      {
        line: 'quantity_input = input("Enter quantity: ")',
        explanation: 'Reads the second input for quantity, also stored as a string.'
      },
      {
        line: 'price = float(price_input)',
        explanation: 'Converts the price string into a floating-point number so decimals (like 4.50) can be calculated.'
      },
      {
        line: 'quantity = int(quantity_input)',
        explanation: 'Converts the quantity string into a whole number integer.'
      },
      {
        line: 'total = price * quantity',
        explanation: 'Multiplies the two numbers using the * operator and stores the result in variable total.'
      },
      {
        line: 'print(f"Total Cost: ${total:.2f}")',
        explanation: 'Uses an f-string to embed total formatted to two decimal places (:.2f) and displays it on screen.'
      }
    ],
    similarQuestionId: 3,
    similarQuestionTitle: "Challenge #3: Sum of Two Numbers"
  },
  {
    level: 2,
    levelName: "Conditions and Decision Making",
    title: "Multi-Branch Decision Making with if / elif / else",
    concept: "How to check conditions in order and run different code based on the outcome.",
    code: `temperature = float(input("Enter temperature in Celsius: "))\n\nif temperature >= 30:\n    print("Hot day")\nelif temperature >= 20:\n    print("Pleasant day")\nelif temperature >= 10:\n    print("Cool day")\nelse:\n    print("Cold day")`,
    lineByLine: [
      {
        line: 'temperature = float(input(...))',
        explanation: 'Reads user input and converts it directly into a float number for comparison.'
      },
      {
        line: 'if temperature >= 30:',
        explanation: 'Checks if temperature is 30 or greater. If True, Python executes the indented print and skips all remaining elif/else blocks.'
      },
      {
        line: 'elif temperature >= 20:',
        explanation: 'If the first condition was False, Python checks this branch. Because previous was < 30, this covers 20 to 29.9.'
      },
      {
        line: 'elif temperature >= 10:',
        explanation: 'Checks the next threshold if both earlier conditions were False.'
      },
      {
        line: 'else:',
        explanation: 'The catch-all default that executes if none of the if/elif conditions were True (temperature < 10).'
      }
    ],
    similarQuestionId: 11,
    similarQuestionTitle: "Challenge #11: Check Even or Odd"
  },
  {
    level: 3,
    levelName: "Loops and Repetition",
    title: "Accumulator Pattern with a for Loop and range()",
    concept: "How to loop through a sequence of numbers and accumulate a running sum.",
    code: `n = int(input("Enter upper limit: "))\ntotal_sum = 0\n\nfor i in range(1, n + 1):\n    total_sum += i\n\nprint(f"Sum from 1 to {n} is: {total_sum}")`,
    lineByLine: [
      {
        line: 'n = int(input("Enter upper limit: "))',
        explanation: 'Reads the target integer limit up to which we want to sum.'
      },
      {
        line: 'total_sum = 0',
        explanation: 'Initializes the accumulator variable at 0 before starting the loop.'
      },
      {
        line: 'for i in range(1, n + 1):',
        explanation: 'Generates numbers from 1 up to n (because range stops one before the second argument, n + 1 includes n).'
      },
      {
        line: '    total_sum += i',
        explanation: 'Adds current number i to running total_sum on each iteration (shorthand for total_sum = total_sum + i).'
      },
      {
        line: 'print(f"Sum from 1 to {n} is: {total_sum}")',
        explanation: 'Outputs the final accumulated sum after the loop finishes.'
      }
    ],
    similarQuestionId: 24,
    similarQuestionTitle: "Challenge #24: Sum of Integers from 1 to 100"
  },
  {
    level: 4,
    levelName: "Strings and Lists",
    title: "Processing and Filtering Words in a List",
    concept: "How to split text into a list, iterate over it, and build a new filtered list.",
    code: `sentence = input("Enter a sentence: ")\nwords = sentence.split()\n\nlong_words = []\nfor word in words:\n    if len(word) > 4:\n        long_words.append(word)\n\nprint("Words with >4 letters:", " ".join(long_words))\nprint("Count:", len(long_words))`,
    lineByLine: [
      {
        line: 'words = sentence.split()',
        explanation: 'Splits the string at every space into a list of individual words, e.g. ["Python", "is", "awesome"].'
      },
      {
        line: 'long_words = []',
        explanation: 'Initializes an empty list to store words that meet our length criteria.'
      },
      {
        line: 'for word in words:',
        explanation: 'Iterates through each word in the words list one at a time.'
      },
      {
        line: '    if len(word) > 4:\n        long_words.append(word)',
        explanation: 'Checks if length of the current word is greater than 4. If yes, adds it to the end of long_words.'
      },
      {
        line: '" ".join(long_words)',
        explanation: 'Joins all elements of long_words into a single string separated by spaces.'
      }
    ],
    similarQuestionId: 35,
    similarQuestionTitle: "Challenge #35: Create and Print a List"
  },
  {
    level: 5,
    levelName: "Mini Projects & Problem Solving",
    title: "Interactive Menu and State Tracker",
    concept: "Combining loops, input handling, and lists to create a miniature terminal application.",
    code: `tasks = []\nwhile True:\n    command = input("Enter (add <task> / list / exit): ").strip()\n    if command == "exit":\n        print("Goodbye!")\n        break\n    elif command.startswith("add "):\n        item = command[4:].strip()\n        tasks.append(item)\n        print(f"Added: {item}")\n    elif command == "list":\n        for idx, task in enumerate(tasks, 1):\n            print(f"{idx}. {task}")\n    else:\n        print("Unknown command")`,
    lineByLine: [
      {
        line: 'while True:',
        explanation: 'Creates a loop that continues running indefinitely until we explicitly execute break.'
      },
      {
        line: 'if command == "exit": break',
        explanation: 'Checks for the exit command and breaks out of the loop cleanly.'
      },
      {
        line: 'elif command.startswith("add "):',
        explanation: 'Slices everything after "add " (index 4 onward) and appends it to the tasks list.'
      },
      {
        line: 'for idx, task in enumerate(tasks, 1):',
        explanation: 'Loops through tasks providing a 1-based index number (1, 2, 3...) for clear display.'
      }
    ],
    similarQuestionId: 41,
    similarQuestionTitle: "Challenge #41: Four-Operation Interactive Calculator"
  },
  {
    level: 6,
    levelName: "Functions, Dictionaries & Sets",
    title: "Creating Reusable Functions with Dictionary Lookups",
    concept: "How to define a function that performs safe key-value dictionary lookups and returns a calculated result.",
    code: `prices = {"apple": 1.5, "banana": 0.75, "mango": 2.0}\n\ndef calculate_bill(item_name, quantity):\n    if item_name in prices:\n        return prices[item_name] * quantity\n    else:\n        return None\n\nitem = input("Item: ").strip().lower()\nqty = int(input("Quantity: "))\n\ntotal = calculate_bill(item, qty)\nif total is not None:\n    print(f"Total: \${total:.2f}")\nelse:\n    print("Item not found in price catalog")`,
    lineByLine: [
      {
        line: 'prices = {"apple": 1.5, ...}',
        explanation: 'Creates a dictionary mapping item names (keys) to their unit price (values).'
      },
      {
        line: 'def calculate_bill(item_name, quantity):',
        explanation: 'Defines a function named calculate_bill that takes two parameters: item_name and quantity.'
      },
      {
        line: 'if item_name in prices: return prices[item_name] * quantity',
        explanation: 'Checks if item_name exists as a key in the dictionary. If found, returns price multiplied by quantity.'
      },
      {
        line: 'return None',
        explanation: 'Returns None if the item does not exist, allowing caller to handle missing items safely.'
      },
      {
        line: 'total = calculate_bill(item, qty)',
        explanation: 'Calls the function with user inputs and stores the returned value in variable total.'
      }
    ],
    similarQuestionId: 55,
    similarQuestionTitle: "Challenge #55: Dictionary Inventory Price Calculator"
  },
  {
    level: 7,
    levelName: "Exceptions, Files & Classes",
    title: "Defensive Coding with try/except and Introductory Classes",
    concept: "How to use try/except to guard against crashes, and how to build a clean Python class with methods.",
    code: `class BankAccount:\n    def __init__(self, owner, balance=0.0):\n        self.owner = owner\n        self.balance = float(balance)\n    \n    def deposit(self, amount):\n        if amount <= 0:\n            raise ValueError("Deposit must be positive")\n        self.balance += amount\n        return self.balance\n\n# Safe user interaction with try/except\ntry:\n    account = BankAccount("Alex", 100.0)\n    user_dep = float(input("Deposit amount: "))\n    new_bal = account.deposit(user_dep)\n    print(f"Success! New balance: \${new_bal:.2f}")\nexcept ValueError as err:\n    print(f"Transaction failed: {err}")`,
    lineByLine: [
      {
        line: 'class BankAccount:',
        explanation: 'Defines the blueprint for a BankAccount object.'
      },
      {
        line: 'def __init__(self, owner, balance=0.0):',
        explanation: 'The constructor method called automatically when creating a new BankAccount. Sets up self.owner and self.balance.'
      },
      {
        line: 'def deposit(self, amount):',
        explanation: 'A method that modifies the internal account balance after verifying the amount is valid.'
      },
      {
        line: 'try: ... except ValueError as err:',
        explanation: 'Guards the code block. If the user enters invalid text or a negative deposit, ValueError is caught and handled nicely without crashing.'
      }
    ],
    similarQuestionId: 61,
    similarQuestionTitle: "Challenge #61: Safe Integer Input"
  }
];

if (typeof window !== "undefined") {
  window.GLOSSARY_DATA = GLOSSARY_DATA;
  window.WORKED_EXAMPLES = WORKED_EXAMPLES;
}
