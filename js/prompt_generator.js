/**
 * prompt_generator.js — Controller for AI Prompt Generator V2
 * 
 * V2: Uses the deterministic PromptEngine (prompt_engine.js) instead of the
 * broken WebLLM Worker. Instant generation, zero hallucination, 100% private.
 */

window.generateACMatrix = async function() {
    const userStory = document.getElementById('in-user-story').value.trim();
    if (!userStory) {
        showPGToast('⚠️ Please paste a user story first.', 'warning');
        return;
    }

    const btnAc = document.getElementById('btn-gen-ac');
    const outAc = document.getElementById('out-ac');
    
    // Brief UI feedback
    btnAc.disabled = true;
    btnAc.innerText = '⚙️ Analyzing...';

    // Promise wrapper for AI Worker communication
    const extractJSON = () => new Promise((resolve, reject) => {
        const onSuccess = (e) => {
            window.removeEventListener('ai_extract_complete', onSuccess);
            window.removeEventListener('ai_extract_error', onError);
            resolve(e.detail);
        };
        const onError = (e) => {
            window.removeEventListener('ai_extract_complete', onSuccess);
            window.removeEventListener('ai_extract_error', onError);
            reject(new Error(e.detail));
        };
        
        window.addEventListener('ai_extract_complete', onSuccess);
        window.addEventListener('ai_extract_error', onError);
        
        window.aiWorker.postMessage({ type: 'extract_rules', prompt: userStory, feedback: criticFeedback });
    });

    let attempts = 0;
    const maxAttempts = 3;
    let finalResult = '';
    let criticFeedback = [];

    while (attempts < maxAttempts) {
        attempts++;
        try {
            outAc.value = `Attempt ${attempts}/${maxAttempts}: Generating Draft Matrix...`;
            
            let aiExtractedRules = null;
            if (window.aiWorker) {
                outAc.value = `Attempt ${attempts}/${maxAttempts}: AI Worker analyzing banking logic...`;
                try {
                    aiExtractedRules = await extractJSON();
                } catch (e) {
                    console.warn("AI extraction failed, using deterministic fallback", e);
                }
            }

            // Phase 1: Use the local AI pipeline to generate the Markdown directly
            outAc.value = `Attempt ${attempts}/${maxAttempts}: AI Worker generating native markdown...`;
            const generateMarkdown = () => new Promise((resolve, reject) => {
                const onSuccess = (e) => {
                    window.removeEventListener('ai_generation_complete', onSuccess);
                    window.removeEventListener('ai_extract_error', onError);
                    resolve(e.detail);
                };
                const onError = (e) => {
                    window.removeEventListener('ai_generation_complete', onSuccess);
                    window.removeEventListener('ai_extract_error', onError);
                    reject(new Error(e.detail));
                };
                window.addEventListener('ai_generation_complete', onSuccess);
                window.addEventListener('ai_extract_error', onError);
                
                window.aiWorker.postMessage({ type: 'generate_ac_matrix', prompt: userStory, extractedJson: aiExtractedRules });
            });
            
            let result = '';
            if (window.aiWorker && aiExtractedRules) {
                try {
                    result = await generateMarkdown();
                } catch (e) {
                    console.warn("Generation failed, falling back to static JS templates", e);
                    const parsed = window.PromptEngine.parseUserStory(userStory, aiExtractedRules, criticFeedback);
                    result = window.PromptEngine.generateAcceptanceCriteria(parsed);
                }
            } else {
                const parsed = window.PromptEngine.parseUserStory(userStory, aiExtractedRules, criticFeedback);
                result = window.PromptEngine.generateAcceptanceCriteria(parsed);
            }
            
            outAc.value = `Attempt ${attempts}/${maxAttempts}: Critic AI reviewing draft...`;
            
            let criticApproved = true;
            let criticFlags = [];
            
            if (window.criticAiWorker) {
                const criticPromise = new Promise((resolve) => {
                    const onMsg = (e) => {
                        if (e.data.status === 'review_complete') {
                            window.criticAiWorker.removeEventListener('message', onMsg);
                            resolve(e.data);
                        }
                    };
                    window.criticAiWorker.addEventListener('message', onMsg);
                    window.criticAiWorker.postMessage({ type: 'review_matrix', matrix: result, prompt: userStory });
                });
                const criticResponse = await criticPromise;
                criticApproved = criticResponse.approved;
                criticFlags = criticResponse.flags;
            }
            
            if (criticApproved) {
                outAc.value = result;
                btnAc.disabled = false;
                btnAc.innerText = '✨ Generate AC & Matrix';
                showPGToast('✅ Intelligent Matrix generated successfully!', 'success');
                return;
            } else {
                criticFeedback = criticFlags;
                finalResult = result;
                outAc.value = `Attempt ${attempts}/${maxAttempts}: Critic rejected draft. Regenerating...\nFlags:\n${criticFlags.join('\n')}`;
                // small delay for UI updates so user sees the text
                await new Promise(r => setTimeout(r, 600)); 
            }

        } catch (err) {
            outAc.value = 'Error: ' + err.message;
            btnAc.disabled = false;
            btnAc.innerText = '✨ Generate AC & Matrix';
            showPGToast('❌ Generation failed: ' + err.message, 'error');
            return;
        }
    }
    
    // If it reaches here, max attempts failed
    outAc.value = criticFeedback.join('\n\n') + '\n\n---\n\n' + finalResult;
    btnAc.disabled = false;
    btnAc.innerText = '✨ Generate AC & Matrix';
    showPGToast('🚨 Critic AI Flag: Hallucination detected after max retries!', 'error');
};

window.generateUiPathPrompt = function() {
    const acContext = document.getElementById('in-ac-matrix').value.trim();
    if (!acContext) {
        showPGToast('⚠️ Please paste the Acceptance Criteria & Matrix into the input box first.', 'warning');
        return;
    }

    const btnUp = document.getElementById('btn-gen-uipath');
    const outUp = document.getElementById('out-uipath');

    // Brief UI feedback
    btnUp.disabled = true;
    btnUp.innerText = '⚙️ Generating...';
    outUp.value = 'Crafting AI Instructional Prompt Template...';

    requestAnimationFrame(function() {
        setTimeout(function() {
            try {
                const result = window.PromptEngine.generateUiPathBDD(acContext);
                
                outUp.value = result;
                btnUp.disabled = false;
                btnUp.innerText = '🚀 Generate UiPath Prompt';
                showPGToast('✅ UiPath BDD Prompt generated successfully!', 'success');
            } catch (err) {
                outUp.value = 'Error: ' + err.message;
                btnUp.disabled = false;
                btnUp.innerText = '🚀 Generate UiPath Prompt';
                showPGToast('❌ Generation failed: ' + err.message, 'error');
            }
        }, 150);
    });
};

/**
 * Transfer Step 1 output into Step 2 input automatically
 */
window.transferACToStep2 = function() {
    const outAc = document.getElementById('out-ac');
    const inAcMatrix = document.getElementById('in-ac-matrix');
    
    if (!outAc || !outAc.value.trim()) {
        showPGToast('⚠️ Nothing to transfer. Generate the AC & Matrix first.', 'warning');
        return;
    }

    inAcMatrix.value = outAc.value;
    showPGToast('✅ Transferred to Step 2 input!', 'success');
    
    // Scroll Step 2 into view if needed
    inAcMatrix.focus();
    inAcMatrix.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
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
    ['in-user-story', 'out-ac', 'in-ac-matrix', 'out-uipath'].forEach(function(id) {
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
