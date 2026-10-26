import subprocess
import json

res = subprocess.run([
    r"C:\Program Files\Google\Chrome\Application\chrome.exe",
    "--headless=new",
    "--no-sandbox",
    "--disable-gpu",
    "--allow-file-access-from-files",
    "--virtual-time-budget=15000",
    "--dump-dom",
    r"file:///C:/Users/cheta/OneDrive/Documents/python practice academy/test_runner.html"
], capture_output=True, text=True, encoding="utf-8", errors="ignore")

idx = res.stdout.find('id="ALL_TEST_RESULTS"')
if idx != -1:
    end_idx = res.stdout.find('</div>', idx)
    content = res.stdout[idx+22:end_idx]
    try:
        data = json.loads(content)
        print("COMPREHENSIVE TEST REPORT:")
        print(json.dumps(data, indent=2, ensure_ascii=True))
    except Exception as e:
        print("Raw content error:", e, content.encode("ascii", "replace").decode("ascii"))
else:
    print("ALL_TEST_RESULTS not found! Output length:", len(res.stdout))
    print("STDERR:", res.stderr.encode("ascii", "replace").decode("ascii"))
