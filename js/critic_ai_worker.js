// critic_ai_worker.js - Step 2: Multi-Agent Validation

self.onmessage = async function(e) {
    if (e.data.type === 'review_matrix') {
        const { matrix, prompt } = e.data;
        const upperPrompt = prompt.toUpperCase();
        
        let approved = true;
        let flags = [];

        // 1. Check for Synchronization Hallucination
        if (matrix.includes('System automatically synchronizes')) {
            const hasSyncKeywords = upperPrompt.includes('SYNCHRONIZATION') || upperPrompt.includes('SYNCHRONIZE') || upperPrompt.includes('LBK.ACTUALIZARE');
            if (!hasSyncKeywords) {
                approved = false;
                flags.push('Critic AI Flag: Synchronization hallucination detected. The original user story does not explicitly request a cross-module synchronization.');
            }
        }

        // 2. Check for Restriction Hallucination
        if (matrix.includes('System triggers restriction/override')) {
            const hasRestrKeywords = upperPrompt.includes('RESTRICTION') || upperPrompt.includes('VALIDATION') || upperPrompt.includes('BLOCK');
            if (!hasRestrKeywords) {
                approved = false;
                flags.push('Critic AI Flag: Restriction hallucination detected. The original user story does not explicitly request a UI transaction restriction.');
            }
        }

        // 3. Check for Configuration Hallucination
        if (matrix.includes('System assigns correct CATEGORY')) {
            const hasConfigKeywords = upperPrompt.includes('CATEGORY') || upperPrompt.includes('CONFIGURE');
            if (!hasConfigKeywords) {
                approved = false;
                flags.push('Critic AI Flag: Configuration hallucination detected. The original user story does not explicitly request a GL Category parameterization.');
            }
        }
        
        // 4. General Sanity Check
        if (!matrix.includes('AC-1')) {
            approved = false;
            flags.push('Critic AI Flag: Structural malformation. The matrix is missing Acceptance Criteria.');
        }

        self.postMessage({
            status: 'review_complete',
            approved: approved,
            flags: flags,
            matrix: matrix
        });
    }
};
