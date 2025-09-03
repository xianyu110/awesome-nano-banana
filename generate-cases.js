const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const casesDir = path.join(__dirname, 'cases');
const outputFile = path.join(__dirname, 'cases-data.json');

function loadCaseData(caseId) {
  try {
    const casePath = path.join(casesDir, caseId.toString(), 'case.yml');
    if (!fs.existsSync(casePath)) return null;

    const yamlContent = fs.readFileSync(casePath, 'utf8');
    const data = yaml.load(yamlContent);

    return {
      id: parseInt(caseId),
      ...data,
      category: getCategoryFromTitle(data.title || data.title_en || ''),
      tags: generateTags(data.title || data.title_en || '')
    };
  } catch (error) {
    console.warn(`Failed to load case ${caseId}:`, error.message);
    return null;
  }
}

function getCategoryFromTitle(title) {
  if (!title) return 'other';
  const titleLower = title.toLowerCase();

  if (titleLower.includes('3d') || titleLower.includes('立体') || titleLower.includes('model')) {
    return '3d';
  } else if (titleLower.includes('动漫') || titleLower.includes('anime') || titleLower.includes('q版') || titleLower.includes('chibi')) {
    return 'anime';
  } else if (titleLower.includes('写实') || titleLower.includes('realistic') || titleLower.includes('photo')) {
    return 'realistic';
  } else if (titleLower.includes('创意') || titleLower.includes('合成') || titleLower.includes('creative')) {
    return 'creative';
  }
  return 'other';
}

function generateTags(title) {
  if (!title) return [];
  const tags = [];
  const titleLower = title.toLowerCase();

  if (titleLower.includes('3d') || titleLower.includes('立体')) tags.push('3D');
  if (titleLower.includes('动漫') || titleLower.includes('anime')) tags.push('动漫');
  if (titleLower.includes('q版') || titleLower.includes('chibi')) tags.push('Q版');
  if (titleLower.includes('写实')) tags.push('写实');
  if (titleLower.includes('创意')) tags.push('创意');
  if (titleLower.includes('风格')) tags.push('风格转换');
  if (titleLower.includes('合成')) tags.push('图像合成');

  return tags;
}

function generateCasesData() {
  const cases = [];
  // Check for case directories from 1 to 200
  for (let i = 1; i <= 200; i++) {
    const caseData = loadCaseData(i);
    if (caseData) {
      cases.push(caseData);
    }
  }

  fs.writeFileSync(outputFile, JSON.stringify(cases, null, 2));
  console.log(`Generated data for ${cases.length} cases`);
}

if (require.main === module) {
  generateCasesData();
}

module.exports = { generateCasesData, loadCaseData, getCategoryFromTitle, generateTags };
