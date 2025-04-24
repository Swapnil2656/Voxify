"""
Run the fixed backend on port 8001
"""
import uvicorn
from fixed_backend import app

if __name__ == "__main__":
    print("Starting PolyLingo Fixed Backend on port 8004")
    uvicorn.run(app, host="0.0.0.0", port=8004)
