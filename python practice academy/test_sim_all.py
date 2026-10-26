import json

# Let's test the simulator transpilation on all 72 questions
with open('js/questions.js', 'r', encoding='utf-8') as f:
    q_content = f.read()

# Extract solution codes
pattern = r'id:\s*(\d+).*?solutionCode:\s*("(?:[^"\\]|\\.)*")'
# We will use Node or Python to test
