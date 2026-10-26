import re

with open('js/learning-content.js', 'r', encoding='utf-8') as f:
    text = f.read()

print("CURRICULUM_DATA in learning-content.js:")
matches = re.findall(r'level:\s*(\d+),\s*title:\s*["\']([^"\']+)["\'],\s*subtitle:\s*["\']([^"\']+)["\'],\s*questionRange:\s*["\']([^"\']+)["\']', text)
for m in matches:
    print(f"Level {m[0]}: title='{m[1]}', subtitle='{m[2]}', range='{m[3]}'")

# Also check worked examples in learning-content.js
print("\nWORKED_EXAMPLES in learning-content.js:")
we = re.findall(r'level:\s*(\d+),\s*title:\s*["\']([^"\']+)["\']', text)
for w in we:
    print(f"Example Level {w[0]}: '{w[1]}'")
