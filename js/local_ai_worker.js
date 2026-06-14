import { CreateMLCEngine } from "https://esm.run/@mlc-ai/webllm";
import { create, insert, search } from "https://esm.run/@orama/orama";

class WebLLMSingleton {
    static engine = null;
    static oramaDb = null;
    static model = "Phi-3-mini-4k-instruct-q4f16_1-MLC";

    static async getInstance(progressCallback) {
        if (this.engine === null) {
            this.engine = await CreateMLCEngine(this.model, {
                initProgressCallback: progressCallback
            });
        }
        return this.engine;
    }

    static async getOrama() {
        if (this.oramaDb === null) {
            this.oramaDb = await create({
                schema: {
                    title: 'string',
                    content: 'string'
                }
            });

            try {
                // Fetch generic context for Local RAG
                const response1 = await fetch('../knowledge_base/t24_mapping.md');
                const text1 = await response1.text();
                const sections1 = text1.split('\n## ');
                
                for (let i = 1; i < sections1.length; i++) {
                    const lines = sections1[i].split('\n');
                    const title = lines[0].trim();
                    const content = lines.slice(1).join('\n').trim();
                    
                    // Semantic Chunking: Split large context into paragraph-level blocks
                    const chunks = content.split(/\n\s*\n/);
                    for (let chunk of chunks) {
                        if (chunk.trim().length > 15) {
                            await insert(this.oramaDb, { title: title, content: chunk.trim() });
                        }
                    }
                }

                // Fetch SENSITIVE context for Local RAG
                const response2 = await fetch('../knowledge_base/t24_sensitive_logic.md');
                if (response2.ok) {
                    const text2 = await response2.text();
                    const sections2 = text2.split('\n## ');
                    
                    for (let i = 1; i < sections2.length; i++) {
                        const lines = sections2[i].split('\n');
                        const title = lines[0].trim();
                        const content = lines.slice(1).join('\n').trim();
                        
                        // Semantic Chunking for Sensitive DB: Prevent LLM Overload
                        const chunks = content.split(/\n\s*\n/);
                        for (let chunk of chunks) {
                            if (chunk.trim().length > 15) {
                                await insert(this.oramaDb, { title: title, content: chunk.trim() });
                            }
                        }
                    }
                }

                // Fetch ARCHITECTURE context for Local RAG
                const response3 = await fetch('../knowledge_base/t24_architecture.md');
                if (response3.ok) {
                    const text3 = await response3.text();
                    const sections3 = text3.split('\n## ');
                    for (let i = 1; i < sections3.length; i++) {
                        const lines = sections3[i].split('\n');
                        const title = lines[0].trim();
                        const content = lines.slice(1).join('\n').trim();
                        const chunks = content.split(/\n\s*\n/);
                        for (let chunk of chunks) {
                            if (chunk.trim().length > 15) {
                                await insert(this.oramaDb, { title: title, content: chunk.trim() });
                            }
                        }
                    }
                }

                // Fetch FULL TRANSCRIPTS context for Local RAG
                const response4 = await fetch('../knowledge_base/t24_transcripts.md');
                if (response4.ok) {
                    const text4 = await response4.text();
                    const sections4 = text4.split('\n## ');
                    for (let i = 1; i < sections4.length; i++) {
                        const lines = sections4[i].split('\n');
                        const title = lines[0].trim();
                        const content = lines.slice(1).join('\n').trim();
                        const paragraphs = content.split(/\n\s*\n/);
                        for (let chunk of paragraphs) {
                            if (chunk.trim().length > 30) {
                                await insert(this.oramaDb, { title: title, content: chunk.trim() });
                            }
                        }
                    }
                }

                // Fetch MULTI-MODAL VIDEO NOTES for Local RAG
                const response5 = await fetch('../playlist.json');
                if (response5.ok) {
                    const text5 = await response5.text();
                    const playlistLines = text5.split('\n');
                    for (let line of playlistLines) {
                        if (line.trim().length === 0) continue;
                        try {
                            const videoData = JSON.parse(line);
                            const videoId = videoData.id;
                            const videoTitle = videoData.title;
                            
                            // Try to fetch the specific video notes generated by the multi-modal subagent
                            const notesResponse = await fetch(`../knowledge_base/t24_video_notes/${videoId}.md`);
                            if (notesResponse.ok) {
                                const notesText = await notesResponse.text();
                                const chunks = notesText.split(/\n\s*\n/);
                                for (let chunk of chunks) {
                                    if (chunk.trim().length > 30) {
                                        await insert(this.oramaDb, { title: `Multi-Modal: ${videoTitle}`, content: chunk.trim() });
                                    }
                                }
                            }
                        } catch (e) {
                            // JSON parse error or missing file, safely skip
                        }
                    }
                }

            } catch (error) {
                console.warn("Could not load T24 mappings for RAG", error);
            }
        }
        return this.oramaDb;
    }
}

// Listen for messages from the main thread
self.addEventListener('message', async (event) => {
    const data = event.data;

    // Initialization Request
    if (data.type === 'load') {
        try {
            self.postMessage({ status: 'initiate', name: WebLLMSingleton.model });

            // Initialize Engine
            await WebLLMSingleton.getInstance((progress) => {
                self.postMessage({ 
                    status: 'progress', 
                    loaded: progress.progress * 100, 
                    total: 100 
                });
            });

            // Initialize Orama DB asynchronously
            await WebLLMSingleton.getOrama();
            
            self.postMessage({ status: 'done' });
            self.postMessage({ status: 'ready' });
        } catch (error) {
            console.error(error);
            self.postMessage({ status: 'error', message: error.message });
        }
    }

    // JSON Extraction Request (Multi-Agent Pipeline)
    if (data.type === 'extract_rules') {
        try {
            const engine = await WebLLMSingleton.getInstance();
            const db = await WebLLMSingleton.getOrama();

            // 1. RAG Search
            let ragContext = "";
            const searchResult = await search(db, {
                term: data.prompt,
                properties: ['content', 'title'],
                limit: 1
            });
            
            if (searchResult.hits.length > 0) {
                ragContext = `\n\nRelevant T24 Banking Context:\n[${searchResult.hits[0].document.title}]\n${searchResult.hits[0].document.content}`;
            }

            // 2. KV Cache Optimized Prompt (System prompt remains entirely static)
            const systemPrompt = `You are a strict data extraction AI for Temenos T24. Extract the conditional triggers and field updates from the provided banking user story. 
Output strictly a JSON object with a single key 'rules' containing an array of objects with 'condition' (string) and 'updates' (array of strings). Do not output any conversational text.
Example Output:
{"rules": [{"condition": "deposit rolls over", "updates": ["MATURITY.DATE = NEW.DATE"]}]}`;

            const feedbackContext = (data.feedback && data.feedback.length > 0) 
                ? `\n\nCRITICAL CONSTRAINTS (Avoid these previous errors):\n${data.feedback.join('\n')}`
                : '';

            const userPrompt = `User Story:\n${data.prompt}${ragContext}${feedbackContext}`;

            // PASS 1: The Extractor Agent
            const reply1 = await engine.chat.completions.create({
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt }
                ],
                temperature: 0.1,
                max_tokens: 500,
                response_format: { type: "json_object" }
            });

            const extractedJsonString = reply1.choices[0].message.content.trim();
            let parsedJson = [];

            try {
                parsedJson = JSON.parse(extractedJsonString).rules || [];
            } catch (e) {
                // Fallback catch if json_object format slightly fails
                const match = extractedJsonString.match(/\[\s*\{.*\}\s*\]/s);
                if (match) parsedJson = JSON.parse(match[0]);
            }

            // PASS 2: The Critic Agent (Multi-Agent Reflection)
            const criticSystemPrompt = `You are an expert QA Reviewer for T24 banking logic. Verify that the extracted JSON perfectly captures the triggers and updates from the User Story. 
Output strictly a JSON object with a single key 'rules' containing the validated array.`;
            
            const criticUserPrompt = `User Story:\n${data.prompt}\n\nExtracted JSON:\n${extractedJsonString}\n\nIs this accurate? If yes, return it exactly. If no, fix the logic and return the corrected JSON object.`;

            const reply2 = await engine.chat.completions.create({
                messages: [
                    { role: 'system', content: criticSystemPrompt },
                    { role: 'user', content: criticUserPrompt }
                ],
                temperature: 0.1,
                max_tokens: 500,
                response_format: { type: "json_object" }
            });

            const criticJsonString = reply2.choices[0].message.content.trim();
            
            try {
                const finalObj = JSON.parse(criticJsonString);
                if (finalObj.rules && Array.isArray(finalObj.rules)) {
                    parsedJson = finalObj.rules;
                }
            } catch (e) {
                // If the critic fails, we silently default to the Extractor's output
                console.warn("Critic Agent failed to output valid JSON, defaulting to Extractor.");
            }

            // Return to UI
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
