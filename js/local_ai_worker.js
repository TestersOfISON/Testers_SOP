import { CreateMLCEngine } from "https://esm.run/@mlc-ai/webllm";

class WebLLMSingleton {
    static engine = null;
    static model = "Phi-3-mini-4k-instruct-q4f16_1-MLC"; // 3.8B WebGPU Model (~2.2GB)

    static async getInstance(progressCallback) {
        if (this.engine === null) {
            this.engine = await CreateMLCEngine(this.model, {
                initProgressCallback: progressCallback
            });
        }
        return this.engine;
    }
}

// Listen for messages from the main thread
self.addEventListener('message', async (event) => {
    const data = event.data;

    // Initialization Request
    if (data.type === 'load') {
        try {
            // Post initiate event
            self.postMessage({ status: 'initiate', name: WebLLMSingleton.model });

            // Initialize engine with progress callback mapping to the UI
            await WebLLMSingleton.getInstance((progress) => {
                // WebLLM progress.progress is a float from 0.0 to 1.0
                self.postMessage({ 
                    status: 'progress', 
                    loaded: progress.progress * 100, 
                    total: 100 
                });
            });
            
            // Engine initialized
            self.postMessage({ status: 'done' });
            self.postMessage({ status: 'ready' });
        } catch (error) {
            console.error(error);
            self.postMessage({ status: 'error', message: error.message });
        }
    }

    // JSON Extraction Request
    if (data.type === 'extract_rules') {
        try {
            const engine = await WebLLMSingleton.getInstance();
            const systemPrompt = `You are a strict data extraction AI for Temenos T24. Extract the conditional triggers and field updates from the provided banking user story. 
Output strictly a JSON array of objects with 'condition' (string) and 'updates' (array of strings). Do not output any conversational text or markdown blocks. 
Example Output:
[{"condition": "deposit rolls over", "updates": ["MATURITY.DATE = NEW.DATE"]}]`;

            const messages = [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: data.prompt }
            ];

            // WebLLM uses OpenAI compatible chat completions
            const reply = await engine.chat.completions.create({
                messages,
                temperature: 0.1,
                max_tokens: 500,
            });

            const finalOutput = reply.choices[0].message.content.trim();

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
            console.error(error);
            self.postMessage({ status: 'error', message: error.message });
        }
    }
});
