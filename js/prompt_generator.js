/**
 * prompt_generator.js — Controller for AI Prompt Generator V2
 * 
 * V2: Uses the deterministic PromptEngine (prompt_engine.js) instead of the
 * broken WebLLM Worker. Instant generation, zero hallucination, 100% private.
 */

// Removed aiWorker initialization as we are shifting to API Key engine

/**
 * Data Security Pipeline - Strips PII/NPI before sending to API
 */
function sanitizePayload(text) {
    if (!text) return text;
    let sanitized = text;
    
    // Mask IPs
    sanitized = sanitized.replace(/\b(?:\d{1,3}\.){3}\d{1,3}\b/g, '[SERVER_IP]');
    
    // Mask Arrangement IDs (AA followed by 10-12 digits)
    sanitized = sanitized.replace(/\bAA\d{10,12}\b/g, '[T24_ARRANGEMENT_ID]');
    
    // Mask 10+ digit Account Numbers
    sanitized = sanitized.replace(/\b\d{10,16}\b/g, '[ACCOUNT_NUMBER]');
    
    // Mask specific employee/BA names (case insensitive)
    const baNames = ['cristian', 'razvan', 'teodora', 'john', 'doe'];
    const nameRegex = new RegExp(`\\b(${baNames.join('|')})\\b`, 'gi');
    sanitized = sanitized.replace(nameRegex, '[BA_NAME]');
    
    return sanitized;
}

window.generateACMatrix = async function() {
    const userStory = document.getElementById('in-user-story').value.trim();
    if (!userStory) {
        showPGToast('⚠️ Please paste a user story first.', 'warning');
        return;
    }

    const btnAc = document.getElementById('btn-gen-ac');
    const outAc = document.getElementById('out-ac');
    
    btnAc.disabled = true;
    btnAc.innerText = '⚙️ Consulting AI...';
    outAc.value = 'Connecting to Gemini AI Engine...';

    const apiKey = localStorage.getItem('gemini_api_key');
    if (!apiKey) {
        outAc.value = 'Error: Please configure your Gemini API Key in the settings (✨) first.';
        btnAc.disabled = false;
        btnAc.innerText = '✨ Generate AC & Matrix';
        showPGToast('❌ API Key Missing', 'error');
        return;
    }
    const model = localStorage.getItem('gemini_ai_model') || 'gemini-2.5-flash';

    const systemInstruction = `You are a Senior QA Automation Engineer at Libra Bank specializing in Temenos T24 testing.
Your task is to analyze the provided raw User Story and convert it into a highly professional Acceptance Criteria list and a Test Coverage Matrix.

You MUST use EXACTLY the following structure (Markdown):

### Acceptance Criteria
1. **[Criteria Name]:** [Detailed criteria based strictly on the user story]
(Add as many criteria as logically necessary)

### Test Coverage Matrix
| Test Case ID | Description | Condition/Amount | Expected Result |
|---|---|---|---|
| TC-01 | [Description] | [Condition] | [Expected Result] |
(Add as many test cases as logically necessary, ensuring you cover negative/edge cases if fields are mandatory)

Rules:
- DO NOT hallucinate banking features not mentioned in the story.
- DO NOT wrap the entire response in an outer \`\`\`markdown block. Just output the raw markdown text directly.
- **Dummy Data Mandate:** Use explicit dummy data standards when generating test values (e.g., use CUST-9999 for ID, use John Doe for names) to prevent realistic-looking data hallucination.`;

    const sanitizedStory = sanitizePayload(userStory);
    const payload = {
        system_instruction: { parts: [{ text: systemInstruction }] },
        contents: [{ parts: [{ text: "User Story:\n" + sanitizedStory }] }]
    };

    const makeRequest = async (key) => {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (res.status === 429) {
            let keysArray = [];
            try { keysArray = JSON.parse(localStorage.getItem('gemini_api_keys')); } catch(e) {}
            if (keysArray && keysArray.length > 1) {
                window.currentKeyIndex = (window.currentKeyIndex || 0) + 1;
                if (window.currentKeyIndex < keysArray.length) {
                    const nextKey = keysArray[window.currentKeyIndex];
                    localStorage.setItem('gemini_api_key', nextKey);
                    console.warn(`[AI Key Rotation] Limit hit. Rotating to key index ${window.currentKeyIndex}...`);
                    return makeRequest(nextKey);
                } else {
                    throw new Error('All API keys in the rotation pool have been exhausted (429 Rate Limit).');
                }
            }
        }
        return res;
    };

    try {
        const response = await makeRequest(apiKey);
        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error.message);
        }

        let result = data.candidates[0].content.parts[0].text.trim();
        
        // Cleanup markdown wrappers if present
        if (result.startsWith('\`\`\`markdown')) result = result.replace(/^\`\`\`markdown/, '');
        if (result.startsWith('\`\`\`')) result = result.replace(/^\`\`\`/, '');
        if (result.endsWith('\`\`\`')) result = result.replace(/\`\`\`$/, '');

        outAc.value = result.trim();
        showPGToast('✅ Intelligent Matrix generated successfully!', 'success');

    } catch (err) {
        outAc.value = 'Error: ' + err.message;
        showPGToast('❌ Generation failed', 'error');
    } finally {
        btnAc.disabled = false;
        btnAc.innerText = '✨ Generate AC & Matrix';
    }
};

window.generateUiPathPrompt = async function() {
    const acContext = document.getElementById('out-ac').value.trim();
    const userStory = document.getElementById('in-user-story').value.trim();
    
    if (!acContext || !userStory) {
        showPGToast('⚠️ Please provide the User Story and generate the Acceptance Criteria & Matrix first.', 'warning');
        return;
    }

    const outUp = document.getElementById('out-uipath');
    const apiKey = localStorage.getItem('gemini_api_key');
    if (!apiKey) {
        outUp.value = 'Error: Please configure your Gemini API Key in the settings (✨) first.';
        showPGToast('❌ API Key Missing', 'error');
        return;
    }
    const model = localStorage.getItem('gemini_ai_model') || 'gemini-2.5-flash';

    outUp.value = 'Connecting to Gemini API to generate T24 UiPath Meta-Prompt...';

    const systemInstruction = `# SYSTEM ROLE:
You are an Expert T24 Core Banking QA Architect. Your sole function is to generate strict, enterprise-grade prompts that will be fed into UiPath Test Manager to generate step-by-step manual test scripts. 

# OPERATIONAL RULES:
1. **Zero Context Bleed:** Treat every request as a completely isolated environment. Never reuse business logic, module names, or fields from previous conversations.
2. **Architectural Accuracy:** Before generating anything, analyze the raw User Story to determine if the feature is a Real-Time UI Action (e.g., AA.ARRANGEMENT.ACTIVITY, CUSTOMER input) OR a Batch Routine (End-of-Day/COB). Your output must reflect this architecture.
3. **No Placeholders:** Never use vague expected results like "updated according to business rules." You must extract and state the exact fields, exact dropdown values, or exact error messages.
4. **Strict Categorization:** You must correctly label scenarios as 'Happy Path', 'Negative', 'Configuration', or 'Edge Case'. A scenario expecting a system error is a 'Negative' flow, not a 'Happy Path'.

# REQUIRED OUTPUT FORMAT:
Whenever the user provides a User Story and Acceptance Criteria, you must output EXACTLY the following Markdown structure, filling in the bracketed variables with precision. Do not output anything outside of this template.

---

# **Role:**
Expert QA Analyst for a Core Banking System (Temenos T24).

# **Objective:**
Generate EXACTLY [Insert Total Number] explicitly defined MANUAL test cases in English for UiPath Test Manager based on the user story: "[Insert Story ID & Title]".

# **Context:**
This user story defines a [Real-Time UI / Batch COB] process in T24.
* **Execution:** [1-2 sentences explaining how the feature is triggered based on the AC].
* **Validation:** [1 sentence explaining the core rule being tested].

# **Instructions:**

## **Instruction 1: Test Case Generation Rules**
* **NO DATA-DRIVEN VARIABLES.** You must write out each scenario individually.
* Write steps strictly for a human tester executing the process manually on the T24 UI.
* Use explicit T24 navigation commands (e.g., navigating to the application, triggering the service/verifying COB completion, checking ENQ records).
* Maximum 10 steps per scenario. Include Maker/Checker steps if authorization is mentioned.
* Format all titles strictly as: [Story ID] - [Scenario Type] - [Description]

## **Instruction 2: Required Step-by-Step Flow Adaptation**
* **For Happy Path:** [Define the generic 3-step flow based on the specific architecture].
* **For Negative Flow:** [Define how the tester triggers the error and asserts the block].
* **For Edge Case:** [Define how to test the exception or background logic].

## **Instruction 3: Exact Scope Boundaries (Generate exactly [Total Number] distinct scenarios)**
* **Scenario 1: [Scenario Type]** -> Description: [Short phrase] | Condition: [Exact precondition] | Expected Result: [Exact field value or exact error message].
* **Scenario 2: [Scenario Type]** -> Description: [Short phrase] | Condition: [Exact precondition] | Expected Result: [Exact field value or exact error message].
[Continue for all identified scenarios required to achieve 100% AC coverage...]

# **Notes:**
* Ensure exactly [Total Number] individual test cases are generated with clear Action and Expected Result columns. Output each separately.`;

    const sanitizedStory = sanitizePayload(userStory);
    const sanitizedAc = sanitizePayload(acContext);

    const payload = {
        system_instruction: { parts: [{ text: systemInstruction }] },
        contents: [{ parts: [{ text: `User Story:\n${sanitizedStory}\n\nAcceptance Criteria & Matrix:\n${sanitizedAc}` }] }]
    };

    const makeRequest = async (key) => {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (res.status === 429) {
            let keysArray = [];
            try { keysArray = JSON.parse(localStorage.getItem('gemini_api_keys')); } catch(e) {}
            if (keysArray && keysArray.length > 1) {
                window.currentKeyIndex = (window.currentKeyIndex || 0) + 1;
                if (window.currentKeyIndex < keysArray.length) {
                    const nextKey = keysArray[window.currentKeyIndex];
                    localStorage.setItem('gemini_api_key', nextKey);
                    console.warn(`[AI Key Rotation] Limit hit. Rotating to key index ${window.currentKeyIndex}...`);
                    return makeRequest(nextKey);
                } else {
                    throw new Error('All API keys in the rotation pool have been exhausted (429 Rate Limit).');
                }
            }
        }
        return res;
    };

    try {
        const response = await makeRequest(apiKey);
        const data = await response.json();
        
        if (data.error) throw new Error(data.error.message);

        let result = data.candidates[0].content.parts[0].text.trim();
        if (result.startsWith('\`\`\`markdown')) result = result.replace(/^\`\`\`markdown/, '');
        if (result.startsWith('\`\`\`')) result = result.replace(/^\`\`\`/, '');
        if (result.endsWith('\`\`\`')) result = result.replace(/\`\`\`$/, '');

        outUp.value = result.trim();
        showPGToast('✅ UiPath BDD Prompt generated successfully!', 'success');

    } catch (err) {
        outUp.value = 'Error: ' + err.message;
        showPGToast('❌ Generation failed', 'error');
    }
};



/**
 * Copy content to clipboard
 */
window.copyPGOutput = function(elementId) {
    const el = document.getElementById(elementId);
    if (!el || !el.value.trim()) {
        showPGToast('⚠️ Nothing to copy.', 'warning');
        return;
    }

    navigator.clipboard.writeText(el.value).then(function() {
        showPGToast('📋 Copied to clipboard!', 'success');
    }).catch(function() {
        // Fallback for older browsers
        el.select();
        document.execCommand('copy');
        showPGToast('📋 Copied to clipboard!', 'success');
    });
};

/**
 * Clear all fields
 */
window.clearPGFields = function() {
    ['in-user-story', 'out-ac', 'out-uipath'].forEach(function(id) {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
    showPGToast('🗑️ All fields cleared.', 'info');
};

/**
 * Toast notification for the Prompt Generator section
 */
function showPGToast(message, type) {
    // Remove existing toast
    const existing = document.getElementById('pg-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'pg-toast';
    
    const colors = {
        success: { bg: 'rgba(16, 185, 129, 0.15)', border: '#10b981', text: '#10b981' },
        warning: { bg: 'rgba(245, 158, 11, 0.15)', border: '#f59e0b', text: '#f59e0b' },
        error:   { bg: 'rgba(239, 68, 68, 0.15)', border: '#ef4444', text: '#ef4444' },
        info:    { bg: 'rgba(59, 130, 246, 0.15)', border: '#3b82f6', text: '#3b82f6' }
    };
    const c = colors[type] || colors.info;

    toast.style.cssText = `
        position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%);
        background: ${c.bg}; border: 1px solid ${c.border}; color: ${c.text};
        padding: 12px 24px; border-radius: 12px; font-weight: 600; font-size: 0.95rem;
        z-index: 99999; backdrop-filter: blur(10px); box-shadow: 0 8px 30px rgba(0,0,0,0.15);
        animation: pgToastIn 0.3s ease-out;
    `;
    toast.textContent = message;

    // Add animation keyframes if not already added
    if (!document.getElementById('pg-toast-styles')) {
        const style = document.createElement('style');
        style.id = 'pg-toast-styles';
        style.textContent = `
            @keyframes pgToastIn { from { opacity: 0; transform: translateX(-50%) translateY(20px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }
            @keyframes pgToastOut { from { opacity: 1; transform: translateX(-50%) translateY(0); } to { opacity: 0; transform: translateX(-50%) translateY(20px); } }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(toast);

    setTimeout(function() {
        toast.style.animation = 'pgToastOut 0.3s ease-in forwards';
        setTimeout(function() { toast.remove(); }, 300);
    }, 3000);
}
