/**
 * prompt_engine.js — T24 Domain-Specific Expert System (Prompt Generator V2.1)
 * 
 * Replaces the basic text parser with a T24-aware rule engine.
 * - Understands T24 Batch Routines vs Data Fields.
 * - Groups multiple field assertions into single execution steps.
 * - Applies Cross-Segment Multipliers (PF, PJ, PRE).
 * - Enforces strict Gherkin formatting.
 * - Detects cross-module impacts (e.g., orphaned records, active deposits).
 */

window.PromptEngine = (function() {

  // --- T24 KNOWLEDGE GRAPH & RULES ---
  const T24_ROUTINES = ['LBK.SOLDARE.GARANTII', 'LBK.DIMINUARE.GARANTII.EOM', 'EOD.MM.STATEMENTS'];
  const T24_SEGMENTS = ['PF (Retail)', 'PJ (Corporate)', 'PRE (Premium)'];
  
  function isRoutine(name) {
    return T24_ROUTINES.includes(name) || (name.split('.').length >= 3 && name === name.toUpperCase());
  }
  
  function isField(name) {
    return name.includes('.') && name === name.toUpperCase() && !isRoutine(name);
  }

  // ============================================================================
  // SECTION 1: USER STORY PARSER (T24 AWARE)
  // ============================================================================

  function parseUserStory(text) {
    const parsed = {
      id: '', title: '', actor: '', goal: '', benefit: '',
      affectedApps: [], fieldNames: [], routines: [], conditions: [],
      updates: [], asIsSteps: [], toBeSteps: [],
      isGuaranteeProcess: false, hasAA: false, hasMM: false,
      rawText: text
    };

    if (!text || !text.trim()) return parsed;

    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);

    // ID and Title
    const idMatch = text.match(/([A-Z]{1,10}-\d{1,10})\s*[-–]\s*(.+?)(?:\n|$)/);
    if (idMatch) {
      parsed.id = idMatch[1].trim();
      parsed.title = idMatch[2].trim();
    }

    // T24 specific flags
    parsed.isGuaranteeProcess = text.toLowerCase().includes('guarantee') || text.includes('GARANTII');
    parsed.hasAA = text.includes(' AA ') || text.includes('AA deposit');
    parsed.hasMM = text.includes(' MM ');

    // Field vs Routine extraction
    const wordPattern = /\b([A-Z][A-Z0-9]*(?:\.[A-Z][A-Z0-9]*)+)\b/g;
    const fieldSet = new Set();
    const routineSet = new Set();
    let wordMatch;
    while ((wordMatch = wordPattern.exec(text)) !== null) {
      const candidate = wordMatch[1];
      if (candidate.match(/^(AS\.IS|TO\.BE|US\.NAME)$/)) continue;
      
      if (isRoutine(candidate)) {
        routineSet.add(candidate);
      } else {
        fieldSet.add(candidate);
      }
    }
    parsed.fieldNames = Array.from(fieldSet);
    parsed.routines = Array.from(routineSet);

    // Aggregate updates per step (fixing the 3-step assertion inflation)
    const blocks = text.split(/•|-|\*/).slice(1);
    blocks.forEach(block => {
      const updatePattern = /([A-Z][A-Z0-9]*(?:\.[A-Z][A-Z0-9]*)*)\s*=\s*(0|TODAY|NULL|[A-Z]+)/g;
      let upMatch;
      const blockUpdates = [];
      while ((upMatch = updatePattern.exec(block)) !== null) {
        if (!isRoutine(upMatch[1])) {
          blockUpdates.push(`${upMatch[1]} = ${upMatch[2]}`);
        }
      }
      
      if (blockUpdates.length > 0) {
        parsed.updates.push(blockUpdates);
      }
    });

    return parsed;
  }

  // ============================================================================
  // SECTION 2: EXPERT SYSTEM ACCEPTANCE CRITERIA
  // ============================================================================

  function generateAcceptanceCriteria(parsed) {
    const sections = [];
    sections.push(`## Acceptance Criteria — ${parsed.id || 'US-XXXX'}`);
    sections.push(`**${parsed.title || 'User Story'}**\n`);
    sections.push(`> 🧠 **T24 Expert System Analysis Applied:** Cross-segment permutations (PF/PJ/PRE) and orphaned/locked record rules enabled based on detected core banking routine.\n`);

    const matrix = buildT24ExpertMatrix(parsed);
    
    // Output standard AC format
    sections.push(`### Business Rules & Acceptance Criteria\n`);
    let acCount = 1;
    
    // Grouped logic for Guarantee Liquidation
    if (parsed.isGuaranteeProcess && parsed.routines.includes('LBK.SOLDARE.GARANTII')) {
      sections.push(`#### AC-1: Liquidate orphaned guarantees (No active LD/PD)`);
      sections.push(`- **GIVEN** a guarantee record exists with VAL.EVAL.INT > 0`);
      sections.push(`- **AND** there are no active LD or PD records attached`);
      sections.push(`- **WHEN** the ${parsed.routines[0] || 'batch routine'} executes during COB (or is manually triggered intra-day)`);
      sections.push(`- **THEN** the record transitions to liquidated state`);
      sections.push(`- **AND** the system updates fields simultaneously: NOMINAL.VALUE = 0, VAL.EVAL.INT = 0, EXPIRY.DATE = TODAY\n`);
      
      sections.push(`#### AC-2: Liquidate guarantees attached to closed AA/MM deposits`);
      sections.push(`- **GIVEN** a guarantee has COLLATERAL.CODE = 100`);
      sections.push(`- **AND** it is linked to an AA or MM deposit where STATUS = LIQ`);
      sections.push(`- **WHEN** the batch routine executes during COB (or is manually triggered intra-day)`);
      sections.push(`- **THEN** it bypasses any active LD/PD checks and forces liquidation`);
      sections.push(`- **AND** the system updates fields simultaneously: NOMINAL.VALUE = 0, VAL.EVAL.INT = 0, EXPIRY.DATE = TODAY\n`);

      sections.push(`#### AC-3: Reject locked or active deposit records (Negative Flow)`);
      sections.push(`- **GIVEN** a guarantee is linked to an active AA deposit`);
      sections.push(`- **WHEN** the batch routine executes during COB (or is manually triggered intra-day)`);
      sections.push(`- **THEN** the system bypasses the record and applies no field changes\n`);
    } else {
      // Generic fallback for non-guarantee processes
      sections.push(`#### AC-1: Core execution and field updates`);
      sections.push(`- **GIVEN** the preconditions outlined in the user story are met`);
      sections.push(`- **WHEN** the routine executes`);
      sections.push(`- **THEN** the expected outcome is applied correctly\n`);
    }

    // --- Enterprise Test Coverage Matrix ---
    sections.push(`## Enterprise Test Coverage Matrix (12-Execution Standard)`);
    sections.push(`*Includes Segment Multipliers and Cross-Module Exceptions*\n`);
    sections.push(`| ID | Segment | Scenario Type | Condition | Expected Result |`);
    sections.push(`|---|---|---|---|---|`);

    matrix.forEach(row => {
      sections.push(`| ${row.id} | ${row.segment} | ${row.type} | ${row.condition} | ${row.result} |`);
    });

    return sections.join('\n');
  }

  function buildT24ExpertMatrix(parsed) {
    const rows = [];
    let idCounter = 1;

    // Helper to add permutations
    function addScenario(type, condition, result, isSegmented = true) {
      if (isSegmented) {
        T24_SEGMENTS.forEach(segment => {
          rows.push({
            id: `TC-${String(idCounter++).padStart(3, '0')}`,
            segment: segment,
            type: type,
            condition: condition,
            result: result
          });
        });
      } else {
        rows.push({
          id: `TC-${String(idCounter++).padStart(3, '0')}`,
          segment: 'ALL',
          type: type,
          condition: condition,
          result: result
        });
      }
    }

    if (parsed.isGuaranteeProcess) {
      // 1. Orphaned records (Happy Path) -> 3 tests (PF, PJ, PRE)
      addScenario('Happy Path', 'Orphaned guarantee (No active LD/PD attached), VAL.EVAL.INT > 0', 'Fields zeroed: NOMINAL.VALUE=0, VAL.EVAL.INT=0, EXPIRY.DATE=TODAY and verify systemic audit log update');
      
      // 2. Liquidated MM/AA deposits (Happy Path) -> 3 tests
      addScenario('Happy Path', 'COLLATERAL.CODE=100, attached AA/MM deposit is STATUS=LIQ (even if LD active)', 'Fields zeroed: NOMINAL.VALUE=0, VAL.EVAL.INT=0, EXPIRY.DATE=TODAY and verify systemic audit log update');
      
      // 3. Active AA bypass (Negative) -> 3 tests
      addScenario('Negative', 'Attached AA deposit is ACTIVE', 'Record bypassed, no fields updated');
      
      // 4. Locked record exceptions (Edge Case) -> 3 tests
      addScenario('Edge Case', 'Record locked by another user/process during COB execution', 'Routine logs exception, skips record without crashing batch');
    } else {
      // Generic
      addScenario('Happy Path', 'Standard qualifying criteria met', 'Fields updated successfully');
      addScenario('Negative', 'Qualifying criteria explicitly NOT met', 'Record bypassed');
      addScenario('Edge Case', 'Required data fields are null', 'Exception logged, batch continues');
    }

    return rows;
  }

  // ============================================================================
  // SECTION 3: UIPATH BDD GHERKIN GENERATOR
  // ============================================================================

  function generateUiPathBDD(acText) {
    if (!acText || !acText.trim()) return '';

    const matrixRows = extractMatrix(acText);
    const numCases = matrixRows.length;
    
    // Extract title/ID
    const titleMatch = acText.match(/##\s*Acceptance Criteria\s*[—\-]\s*([A-Z]+-\d+)\s*\n\*\*(.+?)\*\*/);
    const id = titleMatch ? titleMatch[1] : 'US-XXXX';
    const title = titleMatch ? titleMatch[2] : 'Feature Under Test';
    const fullStoryTitle = `${id} - ${title}`;
    
    const isGuarantee = acText.includes('LBK.SOLDARE.GARANTII');

    const sections = [];
    sections.push(`# **Role:**`);
    sections.push(`Expert QA Analyst for a Core Banking System (Temenos T24).\n`);
    
    sections.push(`# **Objective:**`);
    sections.push(`Generate EXACTLY ${numCases} explicitly defined MANUAL test cases in English for UiPath Test Manager based on the user story: "${fullStoryTitle}".\n`);
    
    sections.push(`# **Context:**`);
    if (isGuarantee) {
      sections.push(`The system relies on an automated batch service (\`LBK.SOLDARE.GARANTII\`) to clean up orphaned guarantees. When a collateral deposit is manually liquidated, the attached guarantee is left behind. This service runs during COB (Close of Business) to detect these orphaned guarantees and systemicly close them.`);
      sections.push(`* **Trigger:** The service runs when no active LD/PD records are attached, or when the attached AA/MM deposit STATUS = LIQ.`);
      sections.push(`* **Action:** The system automatically zeros out the balances (\`NOMINAL.VALUE = 0\`, \`VAL.EVAL.INT = 0\`) and sets \`EXPIRY.DATE = TODAY\`.`);
      sections.push(`* **Negative/Exceptions:** It must bypass active deposits and safely skip records that are locked by a user.`);
      sections.push(`* **Segments:** Testing must be explicitly duplicated across three customer segments: PF (Retail), PJ (Corporate), and PRE (Professional).\n`);
    } else {
      sections.push(`This user story defines a core T24 banking process or batch routine update.`);
      sections.push(`* **Execution:** The process validates specific preconditions and qualifying criteria before applying field updates.`);
      sections.push(`* **Resilience:** The process must handle edge cases like null fields or concurrent record locks gracefully.\n`);
    }

    sections.push(`# **Instructions:**\n`);
    sections.push(`## **Instruction 1: Test Case Generation Rules**`);
    sections.push(`* **NO DATA-DRIVEN VARIABLES.** You must write out each of the ${numCases} scenarios individually using the exact segments provided in the scope list below.`);
    sections.push(`* Write steps strictly for a human tester executing the process manually on the T24 UI.`);
    sections.push(`* Use explicit T24 navigation commands (e.g., navigating to the application, triggering the service/verifying COB completion, checking ENQ records).`);
    sections.push(`* Maximum 10 steps per scenario.`);
    sections.push(`* Format all titles strictly as: ${id} - [Scenario Type] - [Segment] - [Description]\n`);

    sections.push(`## **Instruction 2: Required Step-by-Step Flow Adaptation**`);
    if (isGuarantee) {
      sections.push(`Adapt the step-by-step flow based on the scenario expected result:`);
      sections.push(`* **For Happy Path (Orphan Closure):** Set up an orphaned guarantee (liquidated deposit) for the specific segment -> Trigger/Wait for \`LBK.SOLDARE.GARANTII\` service -> Open the COLLATERAL record -> Assert NOMINAL.VALUE=0, VAL.EVAL.INT=0, EXPIRY.DATE=TODAY -> Verify the systemic audit log.`);
      sections.push(`* **For Negative Flow (Active Bypass):** Set up a guarantee with an ACTIVE deposit for the specific segment -> Trigger/Wait for service -> Open COLLATERAL record -> Assert record was completely bypassed (no fields updated).`);
      sections.push(`* **For Edge Case (Record Locked):** Set up an orphaned guarantee -> Open the record in 'Input' mode to lock it -> Trigger/Wait for service -> Assert the routine safely skipped the record and logged an exception without crashing.\n`);
    } else {
      sections.push(`Adapt the step-by-step flow based on the scenario expected result:`);
      sections.push(`* **For Happy Path:** Set up the required precondition data in T24 -> Trigger the execution -> Assert the expected field updates have been applied -> Verify systemic audit log.`);
      sections.push(`* **For Negative Flow:** Set up data that explicitly violates the criteria -> Trigger execution -> Assert the record was bypassed.`);
      sections.push(`* **For Edge Case:** Set up the edge case condition (e.g. locked record or null fields) -> Trigger execution -> Assert the system handles it gracefully without crashing the batch.\n`);
    }

    sections.push(`## **Instruction 3: Exact Scope Boundaries (Generate exactly ${numCases} distinct scenarios)**`);
    if (matrixRows.length > 0) {
      matrixRows.forEach((row, i) => {
        const shortType = row.type.includes('Happy') ? 'Happy Path' : row.type.includes('Negative') ? 'Negative' : 'Edge Case';
        const shortSeg = row.segment.split(' ')[0];
        let desc = '';
        if (row.condition.includes('STATUS=LIQ')) desc = ` (STATUS=LIQ)`;
        sections.push(`* **Scenario ${i+1}: ${shortType} ${shortSeg}${desc}** -> Segment: ${row.segment} | Condition: ${row.condition.substring(0, 60)}... | Expected Result: ${row.result}`);
      });
    }

    sections.push(`\n# **Notes:**`);
    sections.push(`* Ensure exactly ${numCases} individual test cases are generated with clear Action and Expected Result columns.`);
    sections.push(`* Do not merge or group any of the scenarios; output each separately so they can be assigned to individual testing team members.`);

    return sections.join('\n');
  }

  function extractMatrix(text) {
    const rows = [];
    const lines = text.split('\n');
    let inTable = false;
    let headerSkipped = false;

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('| ID') || trimmed.startsWith('|ID')) { inTable = true; headerSkipped = false; continue; }
      if (inTable && trimmed.match(/^\|[-\s|]+\|$/)) { headerSkipped = true; continue; }
      if (inTable && headerSkipped && trimmed.startsWith('|')) {
        const cells = trimmed.split('|').map(c => c.trim()).filter(c => c);
        if (cells.length >= 5) {
          rows.push({ id: cells[0], segment: cells[1], type: cells[2], condition: cells[3], result: cells[4] });
        }
      }
      if (inTable && headerSkipped && !trimmed.startsWith('|') && trimmed !== '') inTable = false;
    }
    return rows;
  }

  return {
    parseUserStory: parseUserStory,
    generateAcceptanceCriteria: generateAcceptanceCriteria,
    generateUiPathBDD: generateUiPathBDD
  };

})();
