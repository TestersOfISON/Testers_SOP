/**
 * prompt_engine.js — Deterministic Template Engine for AI Prompt Generator V2
 * 
 * Replaces the broken 0.5B LLM approach with a rule-based parser + template system.
 * Runs 100% locally in the browser. Zero data leaves the machine.
 * Zero hallucination risk. Instant results. Consistent quality.
 * 
 * Architecture:
 *   1. parseUserStory(text)           → Structured data object
 *   2. generateAcceptanceCriteria(p)  → Formatted AC + Test Coverage Matrix
 *   3. generateUiPathBDD(acText)      → Markdown BDD scenarios for UiPath Test Manager
 */

// ============================================================================
// SECTION 1: USER STORY PARSER
// ============================================================================

window.PromptEngine = (function() {

  /**
   * Parses raw user story text into a structured object.
   * Extracts: ID, title, actor, goal, benefit, AS IS, TO BE, steps, fields, conditions, etc.
   */
  function parseUserStory(text) {
    const parsed = {
      id: '',
      title: '',
      actor: '',
      goal: '',
      benefit: '',
      affectedApps: [],
      impactReports: '',
      documented: '',
      asIsDescription: '',
      asIsSteps: [],
      toBeDescription: '',
      toBeSteps: [],
      fieldNames: [],
      conditions: [],
      triggers: [],
      schedulingInfo: [],
      rawText: text
    };

    if (!text || !text.trim()) return parsed;

    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);

    // --- Extract ID and Title ---
    // Pattern: "WF-8185 - Automated Services for Guarantee Updates- LBK.SOLDARE.GARANTII"
    const idMatch = text.match(/([A-Z]{1,10}-\d{1,10})\s*[-–]\s*(.+?)(?:\n|$)/);
    if (idMatch) {
      parsed.id = idMatch[1].trim();
      parsed.title = idMatch[2].trim();
    }

    // --- Extract User Story statement ---
    // Pattern: "As a ..., I need to ..., so that ..."
    const usMatch = text.match(/(?:User\s*story\s*:\s*)?As\s+(?:a|an)\s+(.+?),\s*I\s+(?:need|want|should)\s+(?:to\s+)?(.+?),\s*so\s+that\s+(.+?)(?:\.|$)/is);
    if (usMatch) {
      parsed.actor = usMatch[1].trim();
      parsed.goal = usMatch[2].trim();
      parsed.benefit = usMatch[3].trim();
    }

    // --- Extract affected applications ---
    const appMatch = text.match(/Aplicatii\s+influentate\s*:\s*(.+?)(?:\n|$)/i);
    if (appMatch) {
      parsed.affectedApps = appMatch[1].split(/[,;]/).map(a => a.trim()).filter(a => a);
    }

    // --- Extract report impact ---
    const reportMatch = text.match(/Impact_rapoarte_existente\s*:\s*(.+?)(?:\n|$)/i);
    if (reportMatch) {
      parsed.impactReports = reportMatch[1].trim();
    }

    // --- Extract documentation status ---
    const docMatch = text.match(/Documentat\s*:\s*(.+?)(?:\n|$)/i);
    if (docMatch) {
      parsed.documented = docMatch[1].trim();
    }

    // --- Extract AS IS section ---
    const asIsMatch = text.match(/AS\s+IS\s*:?\s*\n?([\s\S]*?)(?=TO\s+BE|$)/i);
    if (asIsMatch) {
      const asIsBlock = asIsMatch[1].trim();
      parsed.asIsDescription = asIsBlock;
      parsed.asIsSteps = extractSteps(asIsBlock);
    }

    // --- Extract TO BE section ---
    const toBeMatch = text.match(/TO\s+BE\s*:?\s*\n?([\s\S]*?)$/i);
    if (toBeMatch) {
      const toBeBlock = toBeMatch[1].trim();
      parsed.toBeDescription = toBeBlock;
      parsed.toBeSteps = extractSteps(toBeBlock);
    }

    // --- Extract field names (T24-style: UPPERCASE.WITH.DOTS) ---
    const fieldPattern = /\b([A-Z][A-Z0-9]*(?:\.[A-Z][A-Z0-9]*)+)\b/g;
    const fieldSet = new Set();
    let fieldMatch;
    while ((fieldMatch = fieldPattern.exec(text)) !== null) {
      // Filter out common non-field patterns
      const candidate = fieldMatch[1];
      if (!candidate.match(/^(AS\.IS|TO\.BE|US\.NAME)$/)) {
        fieldSet.add(candidate);
      }
    }
    parsed.fieldNames = Array.from(fieldSet);

    // --- Extract conditions (patterns like FIELD = VALUE, FIELD > VALUE) ---
    const condPattern = /([A-Z][A-Z0-9]*(?:\.[A-Z][A-Z0-9]*)*)\s*(=|>|<|>=|<=|!=)\s*([A-Z0-9]+(?:\s*\+\s*[A-Z0-9]+)?)/g;
    const condSet = new Set();
    let condMatch;
    while ((condMatch = condPattern.exec(text)) !== null) {
      condSet.add(`${condMatch[1]} ${condMatch[2]} ${condMatch[3]}`);
    }
    parsed.conditions = Array.from(condSet);

    // --- Extract scheduling/trigger info ---
    const schedPatterns = [
      /(?:Runs|triggered|executed)\s+(?:during|before|after|at)\s+(.+?)(?:\.|$)/gi,
      /(?:COB|EOM|EOD|SOD)\b/gi
    ];
    const triggerSet = new Set();
    schedPatterns.forEach(pattern => {
      let m;
      while ((m = pattern.exec(text)) !== null) {
        triggerSet.add(m[0].trim());
      }
    });
    parsed.triggers = Array.from(triggerSet);

    // --- Extract update actions (setting fields to values) ---
    const updatePattern = /([A-Z][A-Z0-9]*(?:\.[A-Z][A-Z0-9]*)*)\s*=\s*(0|TODAY|NULL|[A-Z]+)/g;
    const updates = [];
    let upMatch;
    while ((upMatch = updatePattern.exec(text)) !== null) {
      updates.push({ field: upMatch[1], value: upMatch[2] });
    }
    parsed.updates = deduplicateUpdates(updates);

    return parsed;
  }

  /**
   * Extract step items from a block of text.
   * Recognizes bullet points (•, -, *) and numbered lists.
   */
  function extractSteps(block) {
    const steps = [];
    const lines = block.split('\n');
    let currentStep = null;

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      // Main step: starts with •, -, *, or a number
      const mainStepMatch = trimmed.match(/^[•\-\*]\s+(.+)/) || trimmed.match(/^\d+[.)]\s+(.+)/);
      // Sub-step: starts with o, ◦, or is indented with - 
      const subStepMatch = trimmed.match(/^o\s+(.+)/) || trimmed.match(/^[◦]\s+(.+)/);

      if (mainStepMatch) {
        currentStep = { text: mainStepMatch[1].trim(), subSteps: [] };
        steps.push(currentStep);
      } else if (subStepMatch && currentStep) {
        currentStep.subSteps.push(subStepMatch[1].trim());
      } else if (currentStep && trimmed.startsWith('o ')) {
        currentStep.subSteps.push(trimmed.substring(2).trim());
      } else if (currentStep) {
        // Continuation of the current step
        currentStep.text += ' ' + trimmed;
      } else {
        // Standalone line becomes a step
        steps.push({ text: trimmed, subSteps: [] });
      }
    }

    return steps;
  }

  /**
   * Remove duplicate field update entries
   */
  function deduplicateUpdates(updates) {
    const seen = new Set();
    return updates.filter(u => {
      const key = `${u.field}=${u.value}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }


  // ============================================================================
  // SECTION 2: ACCEPTANCE CRITERIA GENERATOR
  // ============================================================================

  /**
   * Generates Acceptance Criteria and a Test Coverage Matrix from the parsed user story.
   */
  function generateAcceptanceCriteria(parsed) {
    const sections = [];
    const id = parsed.id || 'US-XXXX';
    const title = parsed.title || 'User Story';

    // --- Header ---
    sections.push(`## Acceptance Criteria — ${id}`);
    sections.push(`**${title}**\n`);

    // --- Generate ACs from AS IS steps ---
    let acCounter = 1;
    const acList = [];

    if (parsed.asIsSteps.length > 0) {
      sections.push(`### Existing Behavior (AS IS) — Retained`);
      parsed.asIsSteps.forEach(step => {
        const ac = buildACFromStep(step, acCounter, 'AS IS');
        if (ac) {
          sections.push(ac.text);
          acList.push(ac.meta);
          acCounter++;
        }
      });
      sections.push('');
    }

    // --- Generate ACs from TO BE steps (the changes) ---
    if (parsed.toBeSteps.length > 0 || parsed.toBeDescription) {
      sections.push(`### New/Modified Behavior (TO BE) — Changes`);
      
      if (parsed.toBeSteps.length > 0) {
        parsed.toBeSteps.forEach(step => {
          const ac = buildACFromStep(step, acCounter, 'TO BE');
          if (ac) {
            sections.push(ac.text);
            acList.push(ac.meta);
            acCounter++;
          }
        });
      } else if (parsed.toBeDescription) {
        // If no structured steps, create AC from the description
        const ac = buildACFromDescription(parsed.toBeDescription, acCounter);
        sections.push(ac.text);
        acList.push(ac.meta);
        acCounter++;
      }
      sections.push('');
    }

    // If no AS IS / TO BE found, derive from the overall text
    if (acList.length === 0) {
      sections.push(`### Acceptance Criteria`);
      const fallbackAC = buildFallbackAC(parsed, acCounter);
      fallbackAC.forEach(ac => {
        sections.push(ac.text);
        acList.push(ac.meta);
      });
      sections.push('');
    }

    // --- Test Coverage Matrix ---
    sections.push(`## Test Coverage Matrix\n`);
    sections.push(`| ID | Type | Scenario | Preconditions | Expected Result | Priority |`);
    sections.push(`|---|---|---|---|---|---|`);

    const matrix = buildTestMatrix(parsed, acList);
    matrix.forEach(row => {
      sections.push(`| ${row.id} | ${row.type} | ${row.scenario} | ${row.preconditions} | ${row.expected} | ${row.priority} |`);
    });

    return sections.join('\n');
  }

  /**
   * Build a single Acceptance Criterion from a parsed step
   */
  function buildACFromStep(step, index, source) {
    if (!step.text || step.text.length < 10) return null;

    const conditions = extractConditionsFromText(step.text);
    const updates = step.subSteps.length > 0 ? step.subSteps : extractActionsFromText(step.text);
    
    let acText = `### AC-${index}: ${summarizeStep(step.text)}\n`;
    
    if (conditions.length > 0) {
      acText += `- **GIVEN** ${conditions[0]}\n`;
      conditions.slice(1).forEach(c => {
        acText += `- **AND** ${c}\n`;
      });
    } else {
      acText += `- **GIVEN** the preconditions described in the ${source} specification\n`;
    }
    
    acText += `- **WHEN** the service processes this record\n`;
    
    if (updates.length > 0) {
      acText += `- **THEN** ${updates[0]}\n`;
      updates.slice(1).forEach(u => {
        acText += `- **AND** ${u}\n`;
      });
    } else {
      acText += `- **THEN** the expected behavior is applied as specified\n`;
    }

    const meta = {
      id: `AC-${index}`,
      summary: summarizeStep(step.text),
      source: source,
      conditions: conditions,
      actions: updates,
      rawStep: step.text
    };

    return { text: acText, meta: meta };
  }

  /**
   * Build AC from a description block (when no structured steps exist)
   */
  function buildACFromDescription(desc, index) {
    const summary = desc.substring(0, 120).replace(/\n/g, ' ').trim();
    let acText = `### AC-${index}: ${summary}\n`;
    acText += `- **GIVEN** the system is configured as described\n`;
    acText += `- **WHEN** the service is executed\n`;
    acText += `- **THEN** the new behavior described in TO BE section is applied\n`;

    return {
      text: acText,
      meta: { id: `AC-${index}`, summary: summary, source: 'TO BE', conditions: [], actions: [], rawStep: desc }
    };
  }

  /**
   * Build fallback ACs when no AS IS / TO BE structure is found
   */
  function buildFallbackAC(parsed, startIndex) {
    const results = [];
    let idx = startIndex;

    // From the user story goal
    if (parsed.goal) {
      let acText = `### AC-${idx}: ${capitalize(parsed.goal.substring(0, 100))}\n`;
      acText += `- **GIVEN** ${parsed.actor || 'the system'} is operational\n`;
      acText += `- **WHEN** the described process is triggered\n`;
      acText += `- **THEN** ${parsed.goal}\n`;
      if (parsed.benefit) {
        acText += `- **AND** ${parsed.benefit}\n`;
      }
      results.push({
        text: acText,
        meta: { id: `AC-${idx}`, summary: parsed.goal.substring(0, 100), source: 'User Story', conditions: [], actions: [], rawStep: parsed.goal }
      });
      idx++;
    }

    // From field updates
    if (parsed.updates && parsed.updates.length > 0) {
      let acText = `### AC-${idx}: Field updates are applied correctly\n`;
      acText += `- **GIVEN** the qualifying conditions are met\n`;
      acText += `- **WHEN** the service processes the record\n`;
      parsed.updates.forEach(u => {
        acText += `- **THEN** ${u.field} is set to ${u.value}\n`;
      });
      results.push({
        text: acText,
        meta: { id: `AC-${idx}`, summary: 'Field updates applied', source: 'Fields', conditions: parsed.conditions, actions: parsed.updates.map(u => `${u.field} = ${u.value}`), rawStep: '' }
      });
    }

    return results;
  }

  /**
   * Extract conditions from free text (e.g., "where VAL.EVAL.INT > 0")
   */
  function extractConditionsFromText(text) {
    const conditions = [];
    
    // Pattern: "where FIELD > VALUE" or "with FIELD = VALUE"
    const condPatterns = [
      /(?:where|with|if|when)\s+([A-Z][A-Z0-9.]*\s*[><=!]+\s*\w+)/gi,
      /([A-Z][A-Z0-9]*(?:\.[A-Z][A-Z0-9]*)+)\s*=\s*(\d+|[A-Z]+)/g,
      /(?:STATUS|status)\s*=\s*([A-Z]+)/gi,
      /(?:COLLATERAL\.CODE)\s*=\s*(\d+)/gi,
      /no\s+active\s+[A-Z/]+\s+records?\s+(?:are\s+)?attached/gi
    ];

    condPatterns.forEach(pattern => {
      let m;
      while ((m = pattern.exec(text)) !== null) {
        const cond = m[0].trim();
        if (!conditions.includes(cond) && cond.length < 120) {
          conditions.push(cond);
        }
      }
    });

    // If nothing found, try to extract the main clause
    if (conditions.length === 0) {
      const clause = text.substring(0, 100).trim();
      if (clause) conditions.push(clause);
    }

    return conditions;
  }

  /**
   * Extract action items from free text
   */
  function extractActionsFromText(text) {
    const actions = [];
    
    // Look for field assignment patterns
    const assignPattern = /([A-Z][A-Z0-9]*(?:\.[A-Z][A-Z0-9]*)*)\s*=\s*(0|TODAY|NULL|[A-Z0-9]+)/g;
    let m;
    while ((m = assignPattern.exec(text)) !== null) {
      actions.push(`${m[1]} is set to ${m[2]}`);
    }

    // Look for "liquidates", "updates", "sets" action verbs
    const verbPattern = /(?:liquidat(?:es|ed|ing)|updat(?:es|ed|ing)|set(?:s|ting))\s+(.+?)(?:\.|,|$)/gi;
    while ((m = verbPattern.exec(text)) !== null) {
      const action = m[0].trim().replace(/\.$/, '');
      if (!actions.includes(action) && action.length < 100) {
        actions.push(action);
      }
    }

    return actions.length > 0 ? actions : ['the expected outcome is achieved'];
  }

  /**
   * Summarize a step into a short title
   */
  function summarizeStep(text) {
    // Try to extract the core action (first meaningful clause)
    let summary = text
      .replace(/\s+/g, ' ')
      .replace(/,\s*and\s+if\s+.*/i, '')
      .trim();

    if (summary.length > 100) {
      summary = summary.substring(0, 97) + '...';
    }

    return capitalize(summary);
  }

  /**
   * Capitalize first letter
   */
  function capitalize(str) {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
  }


  /**
   * Build the Test Coverage Matrix rows
   */
  function buildTestMatrix(parsed, acList) {
    const rows = [];
    let hpCount = 1, negCount = 1, edgeCount = 1;

    // --- HAPPY PATH scenarios from each AC ---
    acList.forEach(ac => {
      rows.push({
        id: `HP-${String(hpCount).padStart(2, '0')}`,
        type: 'Happy Path',
        scenario: `Verify: ${ac.summary.substring(0, 80)}`,
        preconditions: ac.conditions.length > 0 ? ac.conditions.slice(0, 2).join('; ') : 'Standard preconditions met',
        expected: ac.actions.length > 0 ? ac.actions.slice(0, 2).join('; ') : 'Expected outcome achieved',
        priority: 'High'
      });
      hpCount++;
    });

    // --- NEGATIVE scenarios (inverse conditions) ---
    if (parsed.conditions.length > 0) {
      parsed.conditions.forEach(cond => {
        const negCond = negateCondition(cond);
        if (negCond) {
          rows.push({
            id: `NEG-${String(negCount).padStart(2, '0')}`,
            type: 'Negative',
            scenario: `Verify NO action when: ${negCond}`,
            preconditions: negCond,
            expected: 'No changes applied to the record',
            priority: 'High'
          });
          negCount++;
        }
      });
    }

    // Add a generic negative if none were generated
    if (negCount === 1) {
      rows.push({
        id: `NEG-01`,
        type: 'Negative',
        scenario: 'Verify no action when qualifying conditions are NOT met',
        preconditions: 'Conditions from AC criteria are inverted/not met',
        expected: 'Record remains unchanged',
        priority: 'High'
      });
      negCount++;
    }

    // --- EDGE CASE scenarios ---
    // Edge case: empty/null field values
    if (parsed.fieldNames.length > 0) {
      rows.push({
        id: `EDGE-${String(edgeCount).padStart(2, '0')}`,
        type: 'Edge Case',
        scenario: `Verify behavior when key fields (${parsed.fieldNames.slice(0, 2).join(', ')}) are null or empty`,
        preconditions: 'One or more key fields contain null/empty values',
        expected: 'Service handles gracefully without errors',
        priority: 'Medium'
      });
      edgeCount++;
    }

    // Edge case: concurrent/timing
    if (parsed.triggers.length > 0) {
      rows.push({
        id: `EDGE-${String(edgeCount).padStart(2, '0')}`,
        type: 'Edge Case',
        scenario: `Verify service execution timing: ${parsed.triggers[0]}`,
        preconditions: 'Service is triggered at the specified schedule',
        expected: 'Service completes without timing conflicts',
        priority: 'Medium'
      });
      edgeCount++;
    }

    // Edge case: boundary values
    rows.push({
      id: `EDGE-${String(edgeCount).padStart(2, '0')}`,
      type: 'Edge Case',
      scenario: 'Verify behavior with boundary/extreme values in key fields',
      preconditions: 'Fields contain maximum/minimum allowed values',
      expected: 'Service processes correctly without overflow or truncation',
      priority: 'Low'
    });
    edgeCount++;

    // Edge case for TO BE changes specifically
    if (parsed.toBeDescription) {
      rows.push({
        id: `EDGE-${String(edgeCount).padStart(2, '0')}`,
        type: 'Edge Case',
        scenario: 'Verify backward compatibility — AS IS behavior unchanged for non-affected records',
        preconditions: 'Records that do NOT match TO BE criteria',
        expected: 'Original AS IS behavior is preserved exactly',
        priority: 'High'
      });
    }

    return rows;
  }

  /**
   * Negate a condition for negative test scenarios
   */
  function negateCondition(condition) {
    if (condition.includes('>')) return condition.replace('>', '<=');
    if (condition.includes('<')) return condition.replace('<', '>=');
    if (condition.includes('= 0')) return condition.replace('= 0', '> 0');
    if (condition.includes('= LIQ')) return condition.replace('= LIQ', '= ACT (active, not liquidated)');
    if (condition.match(/=\s*\d+/)) return condition.replace(/=\s*(\d+)/, '≠ $1');
    if (condition.toLowerCase().includes('no active')) return condition.replace(/no active/i, 'active');
    return `NOT (${condition})`;
  }


  // ============================================================================
  // SECTION 3: UiPath BDD PROMPT GENERATOR
  // ============================================================================

  /**
   * Generates a structured Markdown BDD prompt for UiPath Test Manager.
   * Parses the Acceptance Criteria text and converts each AC + matrix row into
   * properly formatted Given/When/Then scenarios.
   */
  function generateUiPathBDD(acText) {
    if (!acText || !acText.trim()) return '';

    const sections = [];
    
    // --- Extract Feature name ---
    const headerMatch = acText.match(/##\s*Acceptance Criteria\s*[-—]\s*([^\n]+)/);
    const featureName = headerMatch ? headerMatch[1].trim() : 'Feature Under Test';

    // --- Extract all ACs ---
    const acBlocks = extractACBlocks(acText);
    
    // --- Extract matrix rows ---
    const matrixRows = extractMatrixRows(acText);

    // --- Build the BDD Document ---
    sections.push(`# UiPath Test Manager — BDD Test Scenarios`);
    sections.push(`## Feature: ${featureName}\n`);
    sections.push(`> **Generated for UiPath Test Manager**`);
    sections.push(`> Import this prompt directly into UiPath Test Manager's AI scenario generator for maximum accuracy.\n`);

    // --- Prerequisites ---
    sections.push(`### Prerequisites`);
    sections.push(`- Access to T24 system with appropriate user permissions`);
    sections.push(`- Test data prepared according to preconditions below`);
    sections.push(`- COB/EOD batch environment available for execution\n`);

    // --- Happy Path Scenarios ---
    const happyRows = matrixRows.filter(r => r.type.toLowerCase().includes('happy'));
    if (happyRows.length > 0) {
      sections.push(`---`);
      sections.push(`## Happy Path Scenarios\n`);
      happyRows.forEach((row, i) => {
        sections.push(buildBDDScenario(row, acBlocks, i + 1));
      });
    }

    // --- Negative Scenarios ---
    const negRows = matrixRows.filter(r => r.type.toLowerCase().includes('negative'));
    if (negRows.length > 0) {
      sections.push(`---`);
      sections.push(`## Negative Scenarios\n`);
      negRows.forEach((row, i) => {
        sections.push(buildBDDScenario(row, acBlocks, i + 1));
      });
    }

    // --- Edge Case Scenarios ---
    const edgeRows = matrixRows.filter(r => r.type.toLowerCase().includes('edge'));
    if (edgeRows.length > 0) {
      sections.push(`---`);
      sections.push(`## Edge Case Scenarios\n`);
      edgeRows.forEach((row, i) => {
        sections.push(buildBDDScenario(row, acBlocks, i + 1));
      });
    }

    // If no matrix was found, generate from AC blocks directly
    if (matrixRows.length === 0 && acBlocks.length > 0) {
      sections.push(`---`);
      sections.push(`## Test Scenarios\n`);
      acBlocks.forEach((ac, i) => {
        sections.push(buildBDDFromAC(ac, i + 1));
      });
    }

    // --- Footer ---
    sections.push(`---`);
    sections.push(`## Automation Notes`);
    sections.push(`- **Max steps per scenario:** 50 (split into Part1/Part2 if exceeded)`);
    sections.push(`- **Naming convention:** ScrumName - USName - [scenario type]`);
    sections.push(`- **Labels:** Attach the User Story ID and scenario type (positive, negative, edge_case)`);
    sections.push(`- **Evidence:** Capture screenshots at each THEN verification step`);

    return sections.join('\n');
  }

  /**
   * Extract AC blocks from the generated AC text
   */
  function extractACBlocks(text) {
    const blocks = [];
    const acPattern = /###\s*(AC-\d+):\s*(.+?)(?=\n###|\n##|\n---|\n\||\Z)/gs;
    let m;
    while ((m = acPattern.exec(text)) !== null) {
      const block = {
        id: m[1],
        title: m[2].trim(),
        body: m[0],
        givens: [],
        whens: [],
        thens: []
      };

      // Extract Given/When/Then from the block
      const givenPattern = /\*\*(?:GIVEN|AND)\*\*\s+(.+)/g;
      const whenPattern = /\*\*WHEN\*\*\s+(.+)/g;
      const thenPattern = /\*\*(?:THEN|AND)\*\*\s+(.+)/g;

      let gm;
      while ((gm = givenPattern.exec(m[0])) !== null) block.givens.push(gm[1].trim());
      while ((gm = whenPattern.exec(m[0])) !== null) block.whens.push(gm[1].trim());
      while ((gm = thenPattern.exec(m[0])) !== null) block.thens.push(gm[1].trim());

      blocks.push(block);
    }
    return blocks;
  }

  /**
   * Extract matrix rows from the test coverage matrix table
   */
  function extractMatrixRows(text) {
    const rows = [];
    const lines = text.split('\n');
    let inTable = false;
    let headerSkipped = false;

    for (const line of lines) {
      const trimmed = line.trim();
      
      // Detect table start
      if (trimmed.startsWith('| ID') || trimmed.startsWith('|ID')) {
        inTable = true;
        headerSkipped = false;
        continue;
      }

      // Skip separator line
      if (inTable && trimmed.match(/^\|[-\s|]+\|$/)) {
        headerSkipped = true;
        continue;
      }

      // Parse data rows
      if (inTable && headerSkipped && trimmed.startsWith('|')) {
        const cells = trimmed.split('|').map(c => c.trim()).filter(c => c);
        if (cells.length >= 5) {
          rows.push({
            id: cells[0],
            type: cells[1],
            scenario: cells[2],
            preconditions: cells[3],
            expected: cells[4],
            priority: cells[5] || 'Medium'
          });
        }
      }

      // End of table
      if (inTable && headerSkipped && !trimmed.startsWith('|') && trimmed !== '') {
        inTable = false;
      }
    }

    return rows;
  }

  /**
   * Build a BDD scenario from a matrix row, enriched with AC details
   */
  function buildBDDScenario(row, acBlocks, index) {
    const lines = [];
    lines.push(`### Scenario ${row.id}: ${row.scenario}\n`);

    // Find matching AC block for richer context
    const matchingAC = acBlocks.find(ac => row.scenario.toLowerCase().includes(ac.title.toLowerCase().substring(0, 30)));

    // Build GIVEN
    if (matchingAC && matchingAC.givens.length > 0) {
      lines.push(`**Given** ${matchingAC.givens[0]}`);
      matchingAC.givens.slice(1).forEach(g => {
        lines.push(`**And** ${g}`);
      });
    } else {
      // Use preconditions from the matrix
      const preconds = row.preconditions.split(';').map(p => p.trim()).filter(p => p);
      if (preconds.length > 0) {
        lines.push(`**Given** ${preconds[0]}`);
        preconds.slice(1).forEach(p => {
          lines.push(`**And** ${p}`);
        });
      } else {
        lines.push(`**Given** the system preconditions are met`);
      }
    }

    // Build WHEN
    if (matchingAC && matchingAC.whens.length > 0) {
      lines.push(`**When** ${matchingAC.whens[0]}`);
    } else {
      lines.push(`**When** the service/process is triggered`);
    }

    // Build THEN
    if (matchingAC && matchingAC.thens.length > 0) {
      lines.push(`**Then** ${matchingAC.thens[0]}`);
      matchingAC.thens.slice(1).forEach(t => {
        lines.push(`**And** ${t}`);
      });
    } else {
      const expected = row.expected.split(';').map(e => e.trim()).filter(e => e);
      if (expected.length > 0) {
        lines.push(`**Then** ${expected[0]}`);
        expected.slice(1).forEach(e => {
          lines.push(`**And** ${e}`);
        });
      }
    }

    lines.push('');
    return lines.join('\n');
  }

  /**
   * Build a BDD scenario directly from an AC block (fallback when no matrix)
   */
  function buildBDDFromAC(ac, index) {
    const lines = [];
    lines.push(`### Scenario ${index}: ${ac.title}\n`);

    if (ac.givens.length > 0) {
      lines.push(`**Given** ${ac.givens[0]}`);
      ac.givens.slice(1).forEach(g => lines.push(`**And** ${g}`));
    } else {
      lines.push(`**Given** the system is in a valid state`);
    }

    if (ac.whens.length > 0) {
      lines.push(`**When** ${ac.whens[0]}`);
    } else {
      lines.push(`**When** the service is executed`);
    }

    if (ac.thens.length > 0) {
      lines.push(`**Then** ${ac.thens[0]}`);
      ac.thens.slice(1).forEach(t => lines.push(`**And** ${t}`));
    } else {
      lines.push(`**Then** the expected outcome is achieved`);
    }

    lines.push('');
    return lines.join('\n');
  }


  // ============================================================================
  // PUBLIC API
  // ============================================================================

  return {
    parseUserStory: parseUserStory,
    generateAcceptanceCriteria: generateAcceptanceCriteria,
    generateUiPathBDD: generateUiPathBDD
  };

})();
