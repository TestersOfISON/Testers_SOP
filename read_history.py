import json

log_file = r"C:\Users\vigne\.gemini\antigravity\brain\b85e891a-02ba-45af-978a-b5069bc0b8bb\.system_generated\logs\transcript.jsonl"

with open(log_file, "r", encoding="utf-8") as f:
    for line in f:
        try:
            obj = json.loads(line)
            if obj.get("source") == "USER_EXPLICIT":
                print(f"Step {obj.get('step_index')}:")
                print(obj.get("content"))
                print("-" * 50)
        except Exception as e:
            pass
