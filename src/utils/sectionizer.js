/**
 * Sectionizer Module: Parses contract text into distinct legal sections.
 */

export function sectionizeContract(contractText) {
  if (!contractText || typeof contractText !== 'string') {
    return [{ title: 'Preamble', text: '', startLine: 1 }];
  }

  const lines = contractText.split('\n');
  const sections = [];
  let currentSection = { title: 'Preamble', text: '', startLine: 1 };

  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    
    // Strict Header Detection Heuristic (DI-08)
    const isExplicitHeaderKeyword = /^(SECTION|ARTICLE|CLAUSE|SCHEDULE|EXHIBIT)\s+([A-Z0-9\.]+|\d+)/i.test(trimmed);
    const isNumberedHeading = /^\d+[\.\)]\s+[A-Z0-9\s]{3,}/.test(trimmed);
    const isAllCapsTitle = /^[A-Z0-9\s\,\.\-\&]{4,60}:?$/.test(trimmed) && trimmed === trimmed.toUpperCase() && !trimmed.startsWith('THIS AGREEMENT');
    const isColonHeader = /^[A-Z0-9\s]{4,40}:$/.test(trimmed);

    const isHeader = (isExplicitHeaderKeyword || isNumberedHeading || isAllCapsTitle || isColonHeader) && trimmed.length < 80;

    if (isHeader) {
      if (currentSection.text.trim()) {
        sections.push(currentSection);
      }
      currentSection = { title: trimmed, text: trimmed + '\n', startLine: idx + 1 };
    } else {
      currentSection.text += line + '\n';
    }
  });

  if (currentSection.text.trim()) {
    sections.push(currentSection);
  }

  return sections;
}
