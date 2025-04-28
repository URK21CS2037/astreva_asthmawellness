# ml-api/app.py

from flask import Flask, request, jsonify
from flask_cors import CORS  # ✅ Import CORS
from asthma_predictor import main as predict

app = Flask(__name__)
CORS(app)  # ✅ Enable CORS for all routes

@app.route("/predict-asthma", methods=["POST"])
def predict_asthma():
    import subprocess, json

    input_json = json.dumps(request.json)
    result = subprocess.run(
    [r"C:\Users\Admin\Downloads\astreva_tailwind_fixed_full\.venv\Scripts\python.exe", "asthma_predictor.py"],
    input=input_json.encode(),
    stdout=subprocess.PIPE,
    stderr=subprocess.PIPE
)


    if result.returncode != 0:
        print("❌ Subprocess stderr:", result.stderr.decode())  # <-- Add this
        return jsonify({"error": result.stderr.decode()}), 500

    return jsonify(json.loads(result.stdout.decode()))


if __name__ == "__main__":
    app.run(port=5001, debug=True)
