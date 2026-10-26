import subprocess
import time
import os

chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
test_url = "file:///" + os.path.abspath("e2e_verify.html").replace("\\", "/")

cmd = [
    chrome_path,
    "--headless=new",
    "--no-sandbox",
    "--disable-gpu",
    "--allow-file-access-from-files",
    "--dump-dom",
    test_url
]

proc = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8")
print("STDOUT:\n", proc.stdout[-1500:] if len(proc.stdout) > 1500 else proc.stdout)
if proc.stderr:
    print("STDERR:\n", proc.stderr[:500])
