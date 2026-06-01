def test():
    description = "Dark mode toggle theme button"
    # What the browser sees:
    text = "🌙"
    title = ""
    id_attr = "btn-theme-switch"
    class_attr = "theme-toggle"
    
    combined_text = f"{text} {title} {id_attr} {class_attr}".lower()
    
    keywords = description.lower().split()
    matches = sum(1 for k in keywords if k in combined_text)
    
    score = matches / len(keywords) if keywords else 0
    print(f"Combined text: {combined_text}")
    print(f"Keywords: {keywords}")
    print(f"Matches: {matches}, Score: {score}")

test()
