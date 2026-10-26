import subprocess

res = subprocess.run([
    r"C:\Program Files\Google\Chrome\Application\chrome.exe",
    "--headless=new",
    "--no-sandbox",
    "--disable-gpu",
    "--allow-file-access-from-files",
    "--virtual-time-budget=15000",
    "--dump-dom",
    r"file:///C:/Users/cheta/OneDrive/Documents/python practice academy/test_console.html"
], capture_output=True, text=True, encoding="utf-8", errors="ignore")

idx = res.stdout.find('id="CONSOLE_REPORT"')
if idx != -1:
    end_idx = res.stdout.find('</div>', idx)
    print("CONSOLE REPORT:")
    print(res.stdout[idx+20:end_idx])
else:
    print("Not found. Dumping last 1000 chars of stdout:")
    print(res.stdout[-1000:] if len(res.stdout) > 1000 else res.stdout)
    if res.stderr:
        print("STDERR:\n", res.stderr[:500])
