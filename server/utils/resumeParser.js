const pdfParse = require('pdf-parse');
const { NlpManager } = require('node-nlp');

// Initialize NLP manager
const manager = new NlpManager({ languages: ['en'] });

// Common skills dictionary
const commonSkills = [
    'javascript', 'python', 'java', 'c++', 'react', 'node.js', 'angular',
    'vue.js', 'mongodb', 'sql', 'postgresql', 'mysql', 'aws', 'docker',
    'kubernetes', 'git', 'agile', 'scrum', 'machine learning', 'ai',
    'data science', 'html', 'css', 'typescript', 'php', 'ruby', 'swift',
    'kotlin', 'flutter', 'react native', 'android', 'ios'
];

// Common education keywords
const educationKeywords = [
    'bachelor', 'master', 'phd', 'degree', 'university', 'college',
    'certification', 'diploma', 'b.tech', 'b.e', 'm.tech', 'mba'
];

// Train NLP manager with skills and education keywords
commonSkills.forEach(skill => {
    manager.addDocument('en', skill, 'skill');
});

educationKeywords.forEach(keyword => {
    manager.addDocument('en', keyword, 'education');
});

// Initialize NLP manager
(async () => {
    await manager.train();
})();

// Extract skills from text
const extractSkills = async (text) => {
    const words = text.toLowerCase().split(/\s+/);
    const skills = new Set();

    // Direct matching from common skills
    words.forEach(word => {
        if (commonSkills.includes(word)) {
            skills.add(word);
        }
    });

    // NLP-based matching
    const entities = await manager.extractEntities(text);
    entities.forEach(entity => {
        if (entity.entity === 'skill') {
            skills.add(entity.sourceText.toLowerCase());
        }
    });

    return Array.from(skills);
};

// Extract education information
const extractEducation = async (text) => {
    const education = [];
    const lines = text.split('\n');

    for (const line of lines) {
        const entities = await manager.extractEntities(line);
        if (entities.some(e => e.entity === 'education')) {
            education.push(line.trim());
        }
    }

    return education;
};

// Main resume parsing function
const parseResume = async (buffer) => {
    try {
        const data = await pdfParse(buffer);
        const text = data.text;

        // Parallel processing of skills and education
        const [skills, education] = await Promise.all([
            extractSkills(text),
            extractEducation(text)
        ]);

        return {
            skills,
            education,
            rawText: text
        };
    } catch (error) {
        console.error('Error parsing resume:', error);
        throw new Error('Failed to parse resume');
    }
};

module.exports = {
    parseResume,
    extractSkills,
    extractEducation
};