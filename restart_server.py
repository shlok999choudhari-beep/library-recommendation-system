import os
import subprocess
import time

print("Restarting backend server...")

# Kill existing server
try:
    cmd = 'netstat -ano | findstr :8000'
    output = subprocess.check_output(cmd, shell=True).decode()
    lines = output.strip().split('\n')
    for line in lines:
        if 'LISTENING' in line:
            pid = line.split()[-1]
            print(f"Killing PID {pid}")
            os.system(f"taskkill /F /PID {pid}")
            time.sleep(1)
except:
    print("No existing server found")

print("\nNow start the server manually:")
print("cd backend")
print("uvicorn app.main:app --reload --host 127.0.0.1 --port 8000")
