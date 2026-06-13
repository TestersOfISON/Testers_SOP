/**
 * prompt_engine.js — T24 Domain-Specific Expert System (Prompt Generator V3.0)
 * 
 * Replaces the basic text parser with a Dynamic T24 Rule Engine.
 * - Extracts dynamic preconditions and field updates.
 * - Applies Cross-Segment Multipliers (PF, PJ, PRE) automatically.
 * - Avoids context bleeding by removing hardcoded guarantees logic.
 */

window.PromptEngine = (function() {

  const T24_SEGMENTS = ['PF (Retail)', 'PJ (Corporate)', 'PRE (Premium)'];
  const KNOWN_ROUTINES = ['LBK.SOLDARE.GARANTII', 'LBK.DIMINUARE.GARANTII.EOM', 'EOD.MM.STATEMENTS', 'LBK.ACTUALIZARE.CASH.COLL'];

  function isRoutine(name) {
    return KNOWN_ROUTINES.includes(name) || (name.split('.').length >= 3 && name === name.toUpperCase());
  }

  // ============================================================================
  // SECTION 1: USER STORY PARSER (DYNAMIC T24 RULE EXTRACTION)
  // ============================================================================

  function parseUserStory(text) {
    const parsed = {
      id: '', title: '', routines: [], conditions: [], updates: [],
      routineType: 'GENERIC', // 'LIQUIDATION' | 'SYNCHRONIZATION' | 'GENERIC'
      rawText: text
    };

    if (!text || !text.trim()) return parsed;

    // ID and Title
    const idMatch = text.match(/([A-Z]{1,10}-\d{1,10})\s*[-–]\s*(.+?)(?:\n|$)/);
    if (idMatch) {
      parsed.id = idMatch[1].trim();
      parsed.title = idMatch[2].trim();
    }

    // Dynamic Routine Type Classification
    const upperText = text.toUpperCase();
    if (upperText.includes('LBK.SOLDARE.GARANTII') || upperText.includes('LIQUIDATE') || upperText.includes('LIQUIDATION')) {
      parsed.routineType = 'LIQUIDATION';
    } else if (upperText.includes('LBK.ACTUALIZARE') || upperText.includes('UPDATE') || upperText.includes('SYNCHRONIZE')) {
      parsed.routineType = 'SYNCHRONIZATION';
    }

    // Field vs Routine extraction
    const wordPattern = /\b([A-Z][A-Z0-9]*(?:\.[A-Z][A-Z0-9]*)+)\b/g;
    const routineSet = new Set();
    let wordMatch;
    while ((wordMatch = wordPattern.exec(text)) !== null) {
      const candidate = wordMatch[1];
      if (candidate.match(/^(AS\.IS|TO\.BE|US\.NAME)$/)) continue;
      if (isRoutine(candidate)) {
        routineSet.add(candidate);
      }
    }
    parsed.routines = Array.from(routineSet);

    // Extract dynamic conditions
    const lines = text.split('\n');
    lines.forEach(line => {
      const l = line.trim();
      if (l.startsWith('•') || l.startsWith('-') || l.startsWith('*')) {
        const lower = l.toLowerCase();
        if (lower.includes('when') || lower.includes('if') || lower.includes('where') || lower.includes('selects')) {
          parsed.conditions.push(l.replace(/^[•\-*]\s*(when|if|where|selects)?\s*/i, '').trim());
        }
      }
    });
    
    // Extract dynamic updates (Field=Value)
    const updatePattern = /([A-Z][A-Z0-9]*(?:\.[A-Z][A-Z0-9]*)*)\s*=\s*([^ \n,]+)/g;
    let upMatch;
    const updateSet = new Set();
    while ((upMatch = updatePattern.exec(text)) !== null) {
      if (!isRoutine(upMatch[1])) {
        updateSet.add(`${upMatch[1]} = ${upMatch[2]}`);
      }
    }
    parsed.updates = Array.from(updateSet);
    
    // Fallbacks if extraction fails
    if (parsed.conditions.length === 0) parsed.conditions.push("Target records matching user story criteria");
    if (parsed.updates.length === 0) parsed.updates.push("Fields updated according to business rules");

    return parsed;
  }

  // ============================================================================
  // SECTION 2: DYNAMIC MATRIX GENERATOR
  // ============================================================================

  function generateAcceptanceCriteria(parsed) {
    const sections = [];
    sections.push(`## Acceptance Criteria — ${parsed.id || 'US-XXXX'}`);
    sections.push(`**${parsed.title || 'User Story'}**\n`);
    sections.push(`> 🧠 **T24 Dynamic Rule Engine Applied:** Cross-segment permutations (PF/PJ/PRE) dynamically generated based on extracted business rules.\n`);

    const matrix = buildT24ExpertMatrix(parsed);
    
    sections.push(`### Business Rules & Acceptance Criteria\n`);
    const mainRoutine = parsed.routines[0] || 'batch routine';
    
    if (parsed.routineType === 'LIQUIDATION') {
      sections.push(`#### AC-1: Dynamic Liquidation Execution`);
      sections.push(`- **GIVEN** ${parsed.conditions[0]}`);
      sections.push(`- **WHEN** the ${mainRoutine} executes during COB (or is manually triggered intra-day)`);
      sections.push(`- **THEN** the record transitions to liquidated state`);
      sections.push(`- **AND** the system updates fields: ${parsed.updates.join(', ')}\n`);
    } else if (parsed.routineType === 'SYNCHRONIZATION') {
      sections.push(`#### AC-1: Dynamic Synchronization Execution`);
      sections.push(`- **GIVEN** ${parsed.conditions[0]}`);
      sections.push(`- **WHEN** the ${mainRoutine} executes during COB (or is manually triggered intra-day)`);
      sections.push(`- **THEN** the record synchronizes with the active deposit`);
      sections.push(`- **AND** the system updates fields: ${parsed.updates.join(', ')}\n`);
    } else {
      sections.push(`#### AC-1: Core execution and field updates`);
      sections.push(`- **GIVEN** ${parsed.conditions[0]}`);
      sections.push(`- **WHEN** the ${mainRoutine} executes`);
      sections.push(`- **THEN** fields are updated: ${parsed.updates.join(', ')}\n`);
    }

    sections.push(`#### AC-2: Reject locked or active bypass records (Negative Flow)`);
    sections.push(`- **GIVEN** the record explicitly fails the criteria or is manually locked`);
    sections.push(`- **WHEN** the ${mainRoutine} executes`);
    sections.push(`- **THEN** the system bypasses the record and applies no field changes\n`);

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

    function addScenario(type, condition, result) {
      T24_SEGMENTS.forEach(segment => {
        rows.push({
          id: `TC-${String(idCounter++).padStart(3, '0')}`,
          segment: segment,
          type: type,
          condition: condition,
          result: result
        });
      });
    }

    const dynCondition = parsed.conditions[0];
    const dynResult = `Fields updated: ${parsed.updates.join(', ')} and verify systemic audit log update`;

    // 1. Primary Happy Path -> 3 tests (PF, PJ, PRE)
    addScenario('Happy Path', dynCondition, dynResult);
    
    // 2. Secondary Happy Path (Alternative condition) -> 3 tests
    const altCondition = parsed.conditions.length > 1 ? parsed.conditions[1] : `${dynCondition} (Alternative Trigger)`;
    addScenario('Happy Path', altCondition, dynResult);
    
    // 3. Negative Flow -> 3 tests
    addScenario('Negative', 'Condition explicitly NOT met (e.g., active deposit bypass)', 'Record bypassed, no fields updated');
    
    // 4. Locked record exceptions (Edge Case) -> 3 tests
    addScenario('Edge Case', 'Record locked by another user/process during COB execution', 'Routine logs exception, skips record without crashing batch');

    return rows;
  }

  // ============================================================================
  // SECTION 3: INSTRUCTIONAL PROMPT GENERATOR
  // ============================================================================

  function generateUiPathBDD(acText) {
    if (!acText || !acText.trim()) return '';

    const matrixRows = extractMatrix(acText);
    const numCases = matrixRows.length;
    
    const titleMatch = acText.match(/##\s*Acceptance Criteria\s*[—\-]\s*([A-Z]+-\d+)\s*\n\*\*(.+?)\*\*/);
    const id = titleMatch ? titleMatch[1] : 'US-XXXX';
    const title = titleMatch ? titleMatch[2] : 'Feature Under Test';
    const fullStoryTitle = `${id} - ${title}`;
    
    const isLiquidation = acText.includes('Dynamic Liquidation');
    const isSync = acText.includes('Dynamic Synchronization');
    const detectedRoutine = isLiquidation ? 'Liquidation' : isSync ? 'Synchronization' : 'Batch Update';

    const sections = [];
    sections.push(`# **Role:**`);
    sections.push(`Expert QA Analyst for a Core Banking System (Temenos T24).\n`);
    
    sections.push(`# **Objective:**`);
    sections.push(`Generate EXACTLY ${numCases} explicitly defined MANUAL test cases in English for UiPath Test Manager based on the user story: "${fullStoryTitle}".\n`);
    
    sections.push(`# **Context:**`);
    sections.push(`This user story defines a core T24 banking ${detectedRoutine} process.`);
    sections.push(`* **Execution:** The routine evaluates dynamic preconditions and applies exact field updates across specific segments.`);
    sections.push(`* **Segments:** Testing must be explicitly duplicated across three customer segments: PF (Retail), PJ (Corporate), and PRE (Professional).`);
    sections.push(`* **Resilience:** It must handle negative flows (bypass criteria) and edge cases (concurrent record locks) gracefully.\n`);

    sections.push(`# **Instructions:**\n`);
    sections.push(`## **Instruction 1: Test Case Generation Rules**`);
    sections.push(`* **NO DATA-DRIVEN VARIABLES.** You must write out each of the ${numCases} scenarios individually using the exact segments provided in the scope list below.`);
    sections.push(`* Write steps strictly for a human tester executing the process manually on the T24 UI.`);
    sections.push(`* Use explicit T24 navigation commands (e.g., navigating to the application, triggering the service/verifying COB completion, checking ENQ records).`);
    sections.push(`* Maximum 10 steps per scenario.`);
    sections.push(`* Format all titles strictly as: ${id} - [Scenario Type] - [Segment] - [Description]\n`);

    sections.push(`## **Instruction 2: Required Step-by-Step Flow Adaptation**`);
    sections.push(`Adapt the step-by-step flow based on the scenario expected result:`);
    if (isLiquidation) {
      sections.push(`* **For Happy Path (Closure):** Set up the exact conditions for liquidation -> Trigger the execution -> Assert the fields are correctly zeroed/updated -> Verify systemic audit log.`);
    } else if (isSync) {
      sections.push(`* **For Happy Path (Synchronization):** Set up the exact conditions for the update -> Trigger the execution -> Assert the synced fields are updated correctly -> Verify systemic audit log.`);
    } else {
      sections.push(`* **For Happy Path:** Set up the required precondition data -> Trigger the execution -> Assert the expected field updates are applied -> Verify systemic audit log.`);
    }
    sections.push(`* **For Negative Flow:** Set up data that explicitly violates the criteria -> Trigger execution -> Assert the record was bypassed and no fields updated.`);
    sections.push(`* **For Edge Case:** Set up the edge case condition (locked record) -> Trigger execution -> Assert the system handles it gracefully without crashing the batch.\n`);

    sections.push(`## **Instruction 3: Exact Scope Boundaries (Generate exactly ${numCases} distinct scenarios)**`);
    if (matrixRows.length > 0) {
      matrixRows.forEach((row, i) => {
        const shortType = row.type.includes('Happy') ? 'Happy Path' : row.type.includes('Negative') ? 'Negative' : 'Edge Case';
        const shortSeg = row.segment.split(' ')[0];
        sections.push(`* **Scenario ${i+1}: ${shortType} ${shortSeg}** -> Segment: ${row.segment} | Condition: ${row.condition.substring(0, 75)}... | Expected Result: ${row.result}`);
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
