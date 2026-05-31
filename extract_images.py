import json
import base64
import os

transcript_path = r'c:\Users\vigne\.gemini\antigravity\brain\b85e891a-02ba-45af-978a-b5069bc0b8bb\.system_generated\logs\transcript.jsonl'

images = []
with open(transcript_path, 'r', encoding='utf-8') as f:
    for line in f:
        try:
            data = json.loads(line)
            if data.get('type') == 'USER_INPUT':
                content = data.get('content')
                if isinstance(content, list):
                    for item in content:
                        if isinstance(item, dict) and item.get('type') == 'image_url':
                            url_data = item.get('image_url', {}).get('url', '')
                            if url_data.startswith('data:image'):
                                base64_str = url_data.split(',')[1]
                                images.append(base64_str)
        except:
            pass

print(f"Found {len(images)} images in the transcript.")

# The last 3 images in the transcript should be the ones from the latest prompt
if len(images) >= 3:
    last_three = images[-3:]
    names = ['manual_img_1.png', 'manual_img_2.png', 'manual_img_3.png']
    for i, b64 in enumerate(last_three):
        filepath = os.path.join(r'c:\Users\vigne\Downloads\Libra', names[i])
        with open(filepath, 'wb') as img_f:
            img_f.write(base64.b64decode(b64))
        print(f"Saved {names[i]}")
else:
    print("Not enough images found.")
