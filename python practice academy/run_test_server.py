import http.server
import socketserver
import subprocess
import os
import sys
import threading
import urllib.parse

PORT = 8089
test_result = None

class Handler(http.server.SimpleHTTPRequestHandler):
    def do_POST(self):
        global test_result
        if self.path == "/report":
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length).decode('utf-8')
            test_result = post_data
            self.send_response(200)
            self.send_header('Content-Type', 'text/plain')
            self.end_headers()
            self.wfile.write(b"OK")
        else:
            self.send_response(404)
            self.end_headers()

    def log_message(self, format, *args):
        # silence normal request logging
        pass

server = socketserver.TCPServer(("127.0.0.1", PORT), Handler)
server_thread = threading.Thread(target=server.serve_forever)
server_thread.daemon = True
server_thread.start()

chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
test_url = f"http://127.0.0.1:{PORT}/e2e_verify.html"

proc = subprocess.Popen([
    chrome_path,
    "--headless=new",
    "--no-sandbox",
    "--disable-gpu",
    test_url
])

# Wait up to 25 seconds for test_result
import time
start = time.time()
while time.time() - start < 25:
    if test_result is not None:
        break
    time.sleep(0.5)

proc.terminate()
server.shutdown()

if test_result:
    print("=== TEST REPORT RECEIVED ===")
    print(test_result)
else:
    print("ERROR: Timed out waiting for test report.")
    sys.exit(1)
