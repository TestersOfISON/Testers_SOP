import { pipeline, env } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2';

// Set up env for browser execution
env.allowLocalModels = false;

class PipelineSingleton {
    static task = 'text-generation';
    static model = 'Xenova/Qwen1.5-0.5B-Chat'; // Very lightweight model (under 500MB)
    static instance = null;

    static async getInstance(progress_callback = null) {
        if (this.instance === null) {
            this.instance = pipeline(this.task, this.model, { progress_callback });
        }
        return this.instance;
    }
}

let t24Context = "";

// Fetch the mapping file to inject into the AI's context
async function fetchT24KnowledgeBase() {
    try {
        const response = await fetch('../knowledge_base/t24_mapping.md');
        if (response.ok) {
            t24Context = await response.text();
            // Truncate to save context window space (small models have small context windows)
            t24Context = t24Context.substring(0, 1500) + "...(truncated for prototype)";
        } else {
            console.error("Failed to load t24 mapping file");
        }
    } catch (e) {
        console.error("Error fetching t24 mapping:", e);
    }
}

// Listen for messages from the main thread
self.addEventListener('message', async (event) => {
    const data = event.data;

    if (data.type === 'load') {
        try {
            await fetchT24KnowledgeBase();
            
            // Initialize pipeline and send progress to UI
            await PipelineSingleton.getInstance(x => {
                self.postMessage(x);
            });
            
            self.postMessage({ status: 'ready' });
        } catch (error) {
            self.postMessage({ status: 'error', message: error.message });
        }
    }

    if (data.type === 'generate') {
        try {
            const generator = await PipelineSingleton.getInstance();

            // Construct the prompt with T24 context
            const systemPrompt = `You are an AI assistant for Libra Bank. Use the following mapping context to answer the user's question:\n\n${t24Context}\n\n`;
            
            const messages = [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: data.prompt }
            ];

            // Use the chat template (Qwen format)
            const text = `<|im_start|>system\n${systemPrompt}<|im_end|>\n<|im_start|>user\n${data.prompt}<|im_end|>\n<|im_start|>assistant\n`;

            const output = await generator(text, {
                max_new_tokens: 250,
                temperature: 0.1,
                repetition_penalty: 1.2
            });

            // Send final result
            const generatedStr = output[0].generated_text;
            let finalOutput = generatedStr;
            
            // Extract only the assistant's response
            if (generatedStr.includes('<|im_start|>assistant\n')) {
                finalOutput = generatedStr.split('<|im_start|>assistant\n').pop().trim();
            } else if (generatedStr.includes('<|im_start|> assistant\n')) {
                finalOutput = generatedStr.split('<|im_start|> assistant\n').pop().trim();
            } else {
                // Fallback replace
                finalOutput = generatedStr.replace(text, "").trim();
            }

            self.postMessage({
                status: 'complete',
                output: finalOutput
            });

        } catch (error) {
            self.postMessage({ status: 'error', message: error.message });
        }
    }

    if (data.type === 'extract_rules') {
        try {
            const generator = await PipelineSingleton.getInstance();
            const systemPrompt = `You are a strict data extraction AI for Temenos T24. Extract the conditional triggers and field updates from the provided banking user story. Output strictly a JSON array of objects with 'condition' (string) and 'updates' (array of strings). Do not output any conversational text. Example: [{"condition": "deposit rolls over", "updates": ["MATURITY.DATE = NEW.DATE"]}]`;
            
            const text = `<|im_start|>system\n${systemPrompt}<|im_end|>\n<|im_start|>user\n${data.prompt}<|im_end|>\n<|im_start|>assistant\n`;

            const output = await generator(text, {
                max_new_tokens: 300,
                temperature: 0.1,
                repetition_penalty: 1.1
            });

            const generatedStr = output[0].generated_text;
            let finalOutput = generatedStr;
            
            if (generatedStr.includes('<|im_start|>assistant\n')) {
                finalOutput = generatedStr.split('<|im_start|>assistant\n').pop().trim();
            } else {
                finalOutput = generatedStr.replace(text, "").trim();
            }

            let parsedJson = [];
            try {
                parsedJson = JSON.parse(finalOutput);
            } catch (e) {
                const jsonMatch = finalOutput.match(/\[\s*\{.*\}\s*\]/s);
                if (jsonMatch) {
                    parsedJson = JSON.parse(jsonMatch[0]);
                } else {
                    throw new Error("Failed to extract valid JSON array.");
                }
            }

            self.postMessage({
                status: 'extract_complete',
                output: parsedJson
            });

        } catch (error) {
            self.postMessage({ status: 'error', message: error.message });
        }
    }
});
