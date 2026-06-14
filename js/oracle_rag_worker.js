import { create, insert, search } from "https://esm.run/@orama/orama";

class OracleRagDB {
    static oramaDb = null;

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
                if (response1.ok) {
                    const text1 = await response1.text();
                    const sections1 = text1.split('\n## ');
                    for (let i = 1; i < sections1.length; i++) {
                        const lines = sections1[i].split('\n');
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

                const response2 = await fetch('../knowledge_base/t24_sensitive_logic.md');
                if (response2.ok) {
                    const text2 = await response2.text();
                    const sections2 = text2.split('\n## ');
                    for (let i = 1; i < sections2.length; i++) {
                        const lines = sections2[i].split('\n');
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
                            // ignore
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

self.addEventListener('message', async (event) => {
    const data = event.data;

    if (data.type === 'load_rag_only') {
        try {
            await OracleRagDB.getOrama();
            self.postMessage({ status: 'ready' });
        } catch (error) {
            console.error("Worker load error:", error);
            self.postMessage({ status: 'error', message: error.message });
        }
    }

    if (data.type === 'rag_search') {
        try {
            const db = await OracleRagDB.getOrama();
            const searchResult = await search(db, {
                term: data.prompt,
                properties: ['content', 'title'],
                limit: 5
            });
            
            let ragContext = "";
            if (searchResult.hits.length > 0) {
                ragContext = searchResult.hits.map(hit => `[Source: ${hit.document.title}]\n${hit.document.content}`).join('\n\n');
            }

            self.postMessage({
                status: 'rag_complete',
                queryId: data.queryId,
                output: ragContext
            });
        } catch (error) {
            console.error("RAG Search Error:", error);
            self.postMessage({ status: 'rag_error', queryId: data.queryId, message: error.message });
        }
    }
});
