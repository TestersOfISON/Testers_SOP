const fetch = require('node-fetch');
const nodemailer = require('nodemailer');

const FIREBASE_URL = "https://qa-lead-dashboard-default-rtdb.firebaseio.com/user_stories.json";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const EMAIL_RECIPIENT = process.env.EMAIL_RECIPIENT || EMAIL_USER;

if (!GEMINI_API_KEY || !EMAIL_USER || !EMAIL_PASS) {
    console.error("Missing required environment variables (GEMINI_API_KEY, EMAIL_USER, or EMAIL_PASS).");
    process.exit(1);
}

async function run() {
    console.log("Fetching data from Firebase...");
    let fbData = null;
    try {
        const res = await fetch(FIREBASE_URL);
        fbData = await res.json();
    } catch (e) {
        console.error("Error fetching Firebase data:", e);
        process.exit(1);
    }

    if (!fbData) {
        console.log("No data found in Firebase.");
        process.exit(0);
    }

    console.log("Processing data...");
    let rawData = "";
    
    // Parse firebase data identically to how index.html does it for the dashboard
    for (const [key, usData] of Object.entries(fbData)) {
        const epic = usData.epicKey || "Unknown Epic";
        let assignee = usData.assignee || usData.assignedToName || "Unassigned";
        
        let progress = '0%';
        let hasAnomaly = false;
        let anomalyDetails = [];
        
        // Calculate progress and anomalies
        if (usData.timeline) {
            const tl = usData.timeline;
            if (tl.storyStartedAt && tl.designFinishedAt) {
                const diffMins = (new Date(tl.designFinishedAt) - new Date(tl.storyStartedAt)) / 60000;
                if (diffMins < 2 && diffMins > 0) {
                    hasAnomaly = true;
                    anomalyDetails.push(`Design Phase Rushed (${diffMins.toFixed(1)}m)`);
                }
            }
            if (tl.executionStartedAt && tl.executionFinishedAt) {
                const diffMins = (new Date(tl.executionFinishedAt) - new Date(tl.executionStartedAt)) / 60000;
                if (diffMins < 2 && diffMins > 0) {
                    hasAnomaly = true;
                    anomalyDetails.push(`Execution Phase Rushed (${diffMins.toFixed(1)}m)`);
                }
            }
        }
        
        if (usData.testers) {
            let testerData = usData.testers[assignee] || Object.values(usData.testers)[0];
            if (testerData) {
                progress = testerData.overallProgress || '0';
            }
        }

        let flags = [];
        if (hasAnomaly) flags.push("Suspiciously fast completion (Anomaly)");
        
        rawData += `User Story: ${key}, Epic: ${epic}, Assignee: ${assignee}, Progress: ${progress}, Flags: ${flags.length ? flags.join(', ') : 'None'}\n`;
    }

    if (!rawData) {
        console.log("No active user stories found.");
        process.exit(0);
    }

    console.log("Generating report with Gemini...");
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 7);
    const dateString = `${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}`;

    const systemPrompt = `You are an AI QA Manager named Ghidul. Analyze this raw weekly testing data and write a professional, concise executive summary.
You MUST strictly follow this exact Markdown template structure:

## Weekly Testing Executive Summary
**📅 Reporting Period:** ${dateString}
**Prepared by:** Ghidul, AI QA Manager

---

### 📊 Quick Glance Snapshot
(Provide a 3-4 bullet point summary of total active stories, average progress, and overall health of the sprint.)

### 🏆 Wins of the Week
(Highlight specific testers who made significant progress (>30%) or completed tasks. Use bullet points.)

### ⚠️ Risks & Blockers
(Use a Markdown table with columns: [User Story | Assignee | Issue/Risk] to list unassigned stories, anomalies like "Suspiciously fast completion", or stories stalled at low progress.)

### ✅ Recommended Next Steps for Lead Admin
(Provide a numbered checklist of 2-3 specific, actionable tasks the Lead Admin must do today based on the risks above.)

Raw Data:
${rawData}`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    
    let markdownReport = "";
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ role: "user", parts: [{ text: systemPrompt }] }]
            })
        });
        
        const data = await response.json();
        if (data.error) {
            console.error("Gemini API Error:", data.error.message);
            process.exit(1);
        }
        markdownReport = data.candidates[0].content.parts[0].text;
    } catch (e) {
        console.error("Error communicating with Gemini:", e);
        process.exit(1);
    }

    console.log("Sending email...");
    
    // Convert markdown to basic HTML for the email
    let htmlReport = markdownReport
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n\* (.*?)/g, '<br>• $1')
        .replace(/\n- (.*?)/g, '<br>• $1')
        .replace(/\n/g, '<br>');

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: EMAIL_USER,
            pass: EMAIL_PASS
        }
    });

    let mailOptions = {
        from: `"Libra QA AI (Ghidul)" <${EMAIL_USER}>`,
        to: EMAIL_RECIPIENT,
        subject: 'Weekly QA Executive Report 📊',
        html: `<div style="font-family: sans-serif; line-height: 1.5; color: #333;">
                <h2 style="color: #2563eb;">Libra Automated QA Weekly Report</h2>
                <p>Hello Lead Admin,</p>
                <p>Here is your weekly summary of testing progress, timelines, and anomaly detections across the Libra team:</p>
                <hr>
                <div>${htmlReport}</div>
                <hr>
                <p style="font-size: 0.8rem; color: #888;">Generated securely via GitHub Actions by Ghidul AI.</p>
               </div>`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully!");
    } catch (e) {
        console.error("Error sending email:", e);
        process.exit(1);
    }
}

run();
