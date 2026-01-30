import os
import signal
import subprocess
import sys

def kill_port_8000():
    try:
        # Find PID using netstat (Windows)
        cmd = 'netstat -ano | findstr :8000'
        output = subprocess.check_output(cmd, shell=True).decode()
        lines = output.strip().split('\n')
        for line in lines:
            parts = line.split()
            if 'LISTENING' in line:
                pid = parts[-1]
                print(f"Killing PID {pid} on port 8000")
                os.system(f"taskkill /F /PID {pid}")
                return
        print("No process found on port 8000")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    kill_port_8000()
