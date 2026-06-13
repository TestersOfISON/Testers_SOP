window.promptGenWorker = null;
window.isPromptGenModelReady = false;

window.initPromptGenerator = function() {
    if (window.promptGenWorker) return;
    
    const statusEl = document.getElementById('pg-status');
    if(statusEl) statusEl.innerText = 'Initializing AI Model...';
    
    window.promptGenWorker = new Worker('js/local_ai_worker.js', { type: 'module' });
    
    window.promptGenWorker.onmessage = function(e) {
        const data = e.data;
        const statusEl = document.getElementById('pg-status');
        
        if (data.status === 'initiate') {
            if(statusEl) statusEl.innerText = `Downloading model: ${data.name}...`;
        } else if (data.status === 'progress') {
            const p = Math.round((data.loaded / data.total) * 100);
            if(statusEl) statusEl.innerText = `Downloading... ${p}%`;
        } else if (data.status === 'done') {
            if(statusEl) statusEl.innerText = `Loading into GPU...`;
        } else if (data.status === 'ready') {
            window.isPromptGenModelReady = true;
            if(statusEl) {
                statusEl.innerText = '✅ Local AI Model Ready (100% Private)';
                statusEl.style.color = '#10b981';
            }
            const btnAc = document.getElementById('btn-gen-ac');
            const btnUp = document.getElementById('btn-gen-uipath');
            if(btnAc) btnAc.disabled = false;
            if(btnUp) btnUp.disabled = false;
        } else if (data.status === 'complete') {
            if (window.currentGenTask === 'ac') {
                document.getElementById('out-ac').value = data.output;
                const btnAc = document.getElementById('btn-gen-ac');
                if(btnAc) {
                    btnAc.disabled = false;
                    btnAc.innerText = 'Generate AC & Matrix';
                }
            } else if (window.currentGenTask === 'uipath') {
                document.getElementById('out-uipath').value = data.output;
                const btnUp = document.getElementById('btn-gen-uipath');
                if(btnUp) {
                    btnUp.disabled = false;
                    btnUp.innerText = 'Generate UiPath Prompt';
                }
            }
        } else if (data.status === 'error') {
            alert("AI Error: " + data.message);
            if (window.currentGenTask === 'ac') {
                const btnAc = document.getElementById('btn-gen-ac');
                if(btnAc) {
                    btnAc.disabled = false;
                    btnAc.innerText = 'Generate AC & Matrix';
                }
            } else if (window.currentGenTask === 'uipath') {
                const btnUp = document.getElementById('btn-gen-uipath');
                if(btnUp) {
                    btnUp.disabled = false;
                    btnUp.innerText = 'Generate UiPath Prompt';
                }
            }
        }
    };
    
    window.promptGenWorker.postMessage({ type: 'load' });
};

window.generateACMatrix = function() {
    const userStory = document.getElementById('in-user-story').value.trim();
    if (!userStory) return alert("Please paste a user story first.");
    if (!window.isPromptGenModelReady) return alert("Model is still loading. Please wait.");
    
    window.currentGenTask = 'ac';
    const btnAc = document.getElementById('btn-gen-ac');
    btnAc.disabled = true;
    btnAc.innerText = 'Generating... (Please wait)';
    document.getElementById('out-ac').value = 'AI is analyzing requirements...';
    
    const prompt = `You are a Senior QA Analyst. Based on the following User Story, draft the Acceptance Criteria and a Test Coverage Matrix (Happy Path, Negative, Edge Cases). Do not write anything else.\n\nUser Story:\n${userStory}`;
    
    window.promptGenWorker.postMessage({
        type: 'generate',
        prompt: prompt
    });
};

window.generateUiPathPrompt = function() {
    const acContext = document.getElementById('in-ac-matrix').value.trim();
    if (!acContext) return alert("Please paste the Acceptance Criteria & Matrix into the input box first.");
    if (!window.isPromptGenModelReady) return alert("Model is still loading. Please wait.");
    
    window.currentGenTask = 'uipath';
    const btnUp = document.getElementById('btn-gen-uipath');
    btnUp.disabled = true;
    btnUp.innerText = 'Generating... (Please wait)';
    document.getElementById('out-uipath').value = 'AI is crafting the UiPath prompt...';
    
    const prompt = `Convert the following Acceptance Criteria and Test Coverage Matrix into a perfectly structured Markdown BDD (Given/When/Then) Prompt intended for UiPath Test Manager. Ensure extreme detail for automation steps. Do not include introductory text, just output the prompt.\n\nContext:\n${acContext}`;
    
    window.promptGenWorker.postMessage({
        type: 'generate',
        prompt: prompt
    });
};
