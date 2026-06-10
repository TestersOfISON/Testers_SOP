function toggleBugBeautifier() {
    const modal = document.getElementById('bug-beautifier-modal');
    if (modal.style.display === 'none' || modal.style.display === '') {
        modal.style.display = 'flex';
    } else {
        modal.style.display = 'none';
    }
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
    const outputArea = document.getElementById('bug-formatted-output');
    const rawText = inputArea.value.trim();

    if (!rawText) {
        alert("Please enter your notes first.");
        return;
    }

    outputArea.value = "Scrubbing PII and formatting bug report... Please wait...";

    const scrubbedText = sanitizeText(rawText);
    
    // Call Gemini API
    const apiKey = localStorage.getItem('gemini_api_key');
    if (!apiKey) {
        outputArea.value = "Error: Please set your Gemini API Key in the AI Settings (✨) first.";
        return;
    }

    const model = localStorage.getItem('gemini_model') || 'gemini-1.5-flash';
    
    const systemInstruction = `You are an expert QA Lead at Libra Bank, specializing in Temenos T24 migrations (MM to AA). 
Your task is to take the provided messy notes and format them into a highly professional bug report.
The text has already been scrubbed of PII. DO NOT invent any PII.
Follow this EXACT format:

**Title:** [T24 Module] - [SubModule] - Issue Summary

**Description:**
A clear, professional summary of the issue.

**Steps to Reproduce:**
(Provide an ordered list specifically tailored for a T24 environment, e.g., inputting commands, navigating menus).
1. 
2. 
3. 

**Expected Result:**
[What should happen]

**Actual Result:**
[What actually happens]`;

    try {
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
                    parts: [{ text: scrubbedText }]
                }]
            })
        });

        const data = await response.json();
        if (data.error) {
            outputArea.value = "API Error: " + data.error.message;
            return;
        }

        const formattedText = data.candidates[0].content.parts[0].text;
        outputArea.value = formattedText;

    } catch (error) {
        outputArea.value = "Connection Error: " + error.message;
    }
}

function copyBugReport() {
    const outputArea = document.getElementById('bug-formatted-output');
    if (!outputArea.value) return;
    outputArea.select();
    document.execCommand('copy');
    alert("Bug report copied to clipboard!");
}
