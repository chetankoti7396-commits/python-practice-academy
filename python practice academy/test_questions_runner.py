import json
import subprocess

res = subprocess.run([
    r"C:\Program Files\Google\Chrome\Application\chrome.exe",
    "--headless=new",
    "--no-sandbox",
    "--disable-gpu",
    "--allow-file-access-from-files",
    "--virtual-time-budget=20000",
    "--dump-dom",
    r"file:///C:/Users/cheta/OneDrive/Documents/python practice academy/test_all_qs.html"
], capture_output=True, text=True, encoding="utf-8", errors="ignore")

idx = res.stdout.find('id="results"')
if idx != -1:
    end_idx = res.stdout.find('</div>', idx)
    data = json.loads(res.stdout[idx+13:end_idx])
    print(f"Total: {data['total']}, Passed: {data['passed']}, Failed: {len(data['failed'])}")
    for f in data['failed'][:15]:
        print(f" - Q{f['id']}: {f['title']} -> {f.get('summary', f.get('error'))}")
else:
    print("Results not found")
