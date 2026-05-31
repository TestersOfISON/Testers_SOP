import json

transcript_path = r'c:\Users\vigne\.gemini\antigravity\brain\b85e891a-02ba-45af-978a-b5069bc0b8bb\.system_generated\logs\transcript.jsonl'

with open(transcript_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

last_content = None
for line in lines:
    try:
        data = json.loads(line)
        if data.get('type') == 'USER_INPUT':
            last_content = data.get('content')
    except:
        pass

if last_content and isinstance(last_content, list):
    for item in last_content:
        print("Found item type:", item.get('type'))
        if item.get('type') == 'image_url':
            url_data = item.get('image_url', {}).get('url', '')
            print("URL starts with:", url_data[:30])
        elif item.get('type') == 'image':
            print("Keys in image:", item.keys())
            source = item.get('source', {})
            print("Source keys:", source.keys())
            data_str = source.get('data', '')
            print("Data starts with:", data_str[:30])
