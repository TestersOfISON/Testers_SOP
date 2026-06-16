const chatWindow = document.getElementById('chat-window');
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');
const statusBar = document.getElementById('status-bar');
const progressContainer = document.getElementById('progress-container');
const progressBar = document.getElementById('progress-bar');

let aiWorker = null;

// Initialize Web Worker
function initWorker() {
    if (window.Worker) {
        // Create the worker
        aiWorker = new Worker('js/local_ai_worker.js', { type: 'module' });
        window.aiWorker = aiWorker;
        
        // Initialize the Critic AI worker
        window.criticAiWorker = new Worker('js/critic_ai_worker.js');

        // Listen for messages from the worker
        aiWorker.onmessage = function(e) {
            const data = e.data;
            
            switch (data.status) {
                case 'initiate':
                    // Model starting to download
                    statusBar.innerHTML = `Downloading model: ${data.name}...`;
                    progressContainer.style.display = 'block';
                    break;
                case 'progress':
                    // Download progress
                    const p = Math.round((data.loaded / data.total) * 100);
                    progressBar.style.width = `${p}%`;
                    break;
                case 'done':
                    // Download complete
                    statusBar.innerHTML = `Model downloaded. Loading into GPU...`;
                    progressBar.style.width = `100%`;
                    break;
                case 'ready':
                    // Ready to chat
                    progressContainer.style.display = 'none';
                    statusBar.innerHTML = `Status: ✅ Model Ready & Context Loaded!`;
                    chatInput.disabled = false;
                    sendBtn.disabled = false;
                    chatInput.focus();
                    break;
                case 'update':
                    // Streaming response
                    updateLastMessage(data.output, true);
                    break;
                case 'complete':
                    // Generation finished
                    updateLastMessage(data.output, false);
                    chatInput.disabled = false;
                    sendBtn.disabled = false;
                    chatInput.focus();
                    break;
                case 'error':
                    statusBar.innerHTML = `Status: ❌ Error: ${data.message}`;
                    window.dispatchEvent(new CustomEvent('ai_extract_error', { detail: data.message }));
                    break;
                case 'extract_complete':
                    window.dispatchEvent(new CustomEvent('ai_extract_complete', { detail: data.output }));
                    break;
                case 'generation_complete':
                    window.dispatchEvent(new CustomEvent('ai_generation_complete', { detail: data.output }));
                    break;
            }
        };

        // Catch global worker errors (like import failures)
        aiWorker.onerror = function(e) {
            statusBar.innerHTML = `Status: ❌ Fatal Worker Error: ${e.message || 'Failed to load script or import module'}`;
        };

        // Tell worker to load model
        aiWorker.postMessage({ type: 'load' });
    } else {
        statusBar.innerHTML = "Status: ❌ Your browser doesn't support Web Workers.";
    }
}

function appendMessage(text, isUser) {
    const div = document.createElement('div');
    div.className = `message ${isUser ? 'user' : 'ai'}`;
    div.innerText = text;
    chatWindow.appendChild(div);
    chatWindow.scrollTop = chatWindow.scrollHeight;
    return div;
}

let currentAIMessageDiv = null;

function updateLastMessage(text, isStreaming) {
    if (!currentAIMessageDiv) {
        currentAIMessageDiv = appendMessage(text, false);
    } else {
        currentAIMessageDiv.innerText = text;
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }
    
    if (!isStreaming) {
        currentAIMessageDiv = null; // Reset for next message
    }
}

function sendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;

    // UI Updates
    appendMessage(text, true);
    chatInput.value = '';
    chatInput.disabled = true;
    sendBtn.disabled = true;

    // Send to worker
    aiWorker.postMessage({
        type: 'generate',
        prompt: text
    });
}

sendBtn.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

// Start initialization
initWorker();
