function toggleBugBeautifier() {
    const modal = document.getElementById('bug-beautifier-modal');
    if (modal) {
        modal.style.display = modal.style.display === 'none' || modal.style.display === '' ? 'flex' : 'none';
    }
}

let attachedImagesBase64 = [];

document.addEventListener('paste', function(e) {
    if (e.target.id !== 'bug-raw-notes') return;
    
    const items = (e.clipboardData || e.originalEvent.clipboardData).items;
    for (let index in items) {
        const item = items[index];
        if (item.kind === 'file' && item.type.startsWith('image/')) {
            const blob = item.getAsFile();
            const reader = new FileReader();
            reader.onload = function(event) {
                const base64String = event.target.result;
                attachedImagesBase64.push({
                    mimeType: item.type,
                    data: base64String.split(',')[1]
                });
                renderImagePreviews();
            };
            reader.readAsDataURL(blob);
        }
    }
});

function renderImagePreviews() {
    const container = document.getElementById('bug-image-preview-container');
    if (!container) return;
    
    container.innerHTML = '';
    attachedImagesBase64.forEach((imgObj, idx) => {
        const img = document.createElement('img');
        img.src = `data:${imgObj.mimeType};base64,${imgObj.data}`;
        img.style.height = '60px';
        img.style.borderRadius = '4px';
        img.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
        img.style.cursor = 'pointer';
        img.title = 'Click to remove';
        img.onclick = () => {
            attachedImagesBase64.splice(idx, 1);
            renderImagePreviews();
        };
        container.appendChild(img);
    });
}

function sanitizeText(text) {
    // Replace account numbers/CIFs (5 or more digits)
    let sanitized = text.replace(/\b\d{5,}\b/g, '[REDACTED_NUMBER]');
    // Replace standard currency formats
    sanitized = sanitized.replace(/(\$|€|£)?\b\d+(?:[.,]\d{2})?\s*(?:[A-Za-z]{3})?\b/g, (match, p1, offset, string) => {
        // Prevent matching simple small numbers like 1, 2, 3 as amounts unless they have currency symbols or are large
        if (p1 || match.includes('.') || match.includes(',') || parseInt(match) > 100) {
            return '[REDACTED_AMOUNT]';
        }
        return match;
    });
    // Replace emails
    sanitized = sanitized.replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[REDACTED_EMAIL]');
    return sanitized;
}

async function formatBugReport() {
    const inputArea = document.getElementById('bug-raw-notes');
    const titleOut = document.getElementById('bug-out-title');
    const descOut = document.getElementById('bug-out-desc');
    const stepsOut = document.getElementById('bug-out-steps');
    const qaMessage = document.getElementById('bug-qa-message');
    
    const rawText = inputArea ? inputArea.value.trim() : '';

    if (!rawText && attachedImagesBase64.length === 0) {
        alert("Please enter some notes or paste an image first.");
        return;
    }

    qaMessage.style.display = 'block';
    qaMessage.innerText = "Scrubbing PII and consulting AI... Please wait...";
    titleOut.value = "";
    descOut.value = "";
    stepsOut.value = "";

    const scrubbedText = sanitizeText(rawText);

    // Call Gemini API
    const apiKey = localStorage.getItem('gemini_api_key');
    if (!apiKey) {
        qaMessage.innerText = "Error: Please set your Gemini API Key in the AI Settings (✨) first.";
        return;
    }

    const model = localStorage.getItem('gemini_ai_model') || 'gemini-2.5-flash';
    
    const systemInstruction = `You are an expert QA Lead at Libra Bank, specializing in Temenos T24 migrations (MM to AA). 
Your task is to review the provided unstructured bug notes (and optionally screenshots) and format them into a highly professional bug report.
The text has already been scrubbed of PII. DO NOT invent any PII.

IMPORTANT QA RULES:
1. The title MUST strictly follow this format: "[User story ID] - [SubModule] - Issue Summary".
2. If the user provides incomplete information (missing 'Actual Result', missing 'Expected Result', vague 'Steps', OR missing the 'User story ID'), DO NOT guess.
3. Instead, set "status" to "qa_needed" and populate "qa_message" asking them specifically for the missing details. (e.g., "QA Request: Please provide the User story ID and specify what the actual result was.")

If all necessary information is present (or mostly inferable from text and screenshots), set "status" to "success", clear the "qa_message", and format the bug into the following fields:

You must output valid JSON ONLY, using this EXACT schema:
{
  "status": "success" | "qa_needed",
  "qa_message": "...",
  "title": "[User story ID] - [SubModule] - Issue Summary",
  "description": "Expected Result: [What should happen]\\n\\nActual Result: [What actually happens]",
  "steps": "1. \\n2. \\n3. "
}

Output ONLY the raw JSON object. Do not include markdown \`\`\`json wrappers.\`;

    try {
        let apiContents = [];
        if (scrubbedText) {
            apiContents.push({ text: scrubbedText });
        }
        attachedImagesBase64.forEach(img => {
            apiContents.push({
                inlineData: {
                    mimeType: img.mimeType,
                    data: img.data
                }
            });
        });

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                system_instruction: {
                    parts: [{ text: systemInstruction }]
                },
                contents: [{
                    parts: apiContents
                }]
            })
        });

        const data = await response.json();
        if (data.error) {
            qaMessage.innerText = "API Error: " + data.error.message;
            return;
        }

        let formattedText = data.candidates[0].content.parts[0].text;
        formattedText = formattedText.trim();
        if (formattedText.startsWith('\`\`\`json')) {
            formattedText = formattedText.replace(/^\`\`\`json/, '').replace(/\`\`\`$/, '').trim();
        }

        try {
            const resultObj = JSON.parse(formattedText);
            
            if (resultObj.status === "qa_needed") {
                qaMessage.style.display = 'block';
                qaMessage.innerText = "⚠️ " + resultObj.qa_message;
            } else {
                qaMessage.style.display = 'none';
                qaMessage.innerText = "";
            }
            
            titleOut.value = resultObj.title || "";
            descOut.value = resultObj.description || "";
            stepsOut.value = resultObj.steps || "";
            
        } catch (e) {
            qaMessage.style.display = 'block';
            qaMessage.innerText = "Error parsing AI response as JSON. Raw Output: " + formattedText;
        }

    } catch (error) {
        qaMessage.style.display = 'block';
        qaMessage.innerText = "Connection Error: " + error.message;
    }
}

function copyBugReport() {
    const titleOut = document.getElementById('bug-out-title');
    const descOut = document.getElementById('bug-out-desc');
    const stepsOut = document.getElementById('bug-out-steps');
    
    if (!titleOut || !descOut || !stepsOut) return;
    
    const combined = `**Title:** ${titleOut.value}\n\n**Steps to Reproduce:**\n${stepsOut.value}\n\n**Description:**\n${descOut.value}`;
    
    navigator.clipboard.writeText(combined).then(() => {
        alert("Bug report copied to clipboard!");
    }).catch(err => {
        alert("Failed to copy: " + err);
    });
}
