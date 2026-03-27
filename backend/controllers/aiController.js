const asyncHandler = require('express-async-handler');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Opportunity = require('../models/Opportunity');
const User = require('../models/User');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// @desc    Get AI-powered job recommendations for the logged-in student
// @route   GET /api/ai/recommendations
// @access  Private/Student
const getRecommendations = asyncHandler(async (req, res) => {
    const student = await User.findById(req.user._id);
    const opportunities = await Opportunity.find({ status: 'open' }).lean();

    if (!student.skills || student.skills.length === 0) return res.json([]);
    if (opportunities.length === 0) return res.json([]);

    // 1. CALCULATE MATHEMATICAL MATCH SCORE
    const calculatedMatches = opportunities.map(opp => {
        if (!opp.skills || opp.skills.length === 0) return { ...opp, matchScore: 0 };

        const matched = opp.skills.filter(jobSkill => 
            student.skills.some(userSkill => 
                userSkill.toLowerCase().trim() === jobSkill.toLowerCase().trim() ||
                userSkill.toLowerCase().includes(jobSkill.toLowerCase()) ||
                jobSkill.toLowerCase().includes(userSkill.toLowerCase())
            )
        );

        const score = Math.round((matched.length / opp.skills.length) * 100);
        return { ...opp, matchScore: score };
    })
    .filter(o => o.matchScore > 0) // HARD FILTER: Must have at least one matching skill
    .sort((a, b) => b.matchScore - a.matchScore);

    // 2. USE AI ONLY TO REFINEMENT RANKING AND SEMANTIC MATCHES (e.g. CSS vs Tailwind)
    // We only send the top 15 "candidate" jobs to AI for final sorting
    const candidates = calculatedMatches.slice(0, 15);
    
    if (candidates.length === 0) return res.json([]);

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `
Act as a job matching assistant. 
Student Skills: ${student.skills.join(', ')}
Candidate Jobs (JSON with matchScore):
${JSON.stringify(candidates.map(c => ({ id: c._id, position: c.position, skills: c.skills, matchScore: c.matchScore })))}

TASK:
Review the calculated matchScores. If you see semantic matches (like "Node.js" and "Backend") that the basic calculator missed, you may adjust the score UP slightly. If it's a weak match despite sharing a generic word, adjust it DOWN.
Return ONLY a JSON array: [{"id":"<id>","matchScore":<number_10_to_100>}]
    `.trim();

    try {
        const result = await model.generateContent(prompt);
        const responseText = result.response.text().trim();
        const jsonMatch = responseText.match(/\[[\s\S]*\]/);
        
        if (jsonMatch) {
            const aiScores = JSON.parse(jsonMatch[0]);
            const finalResults = candidates.map(c => {
                const aiScore = aiScores.find(as => as.id.toString() === c._id.toString());
                return { ...c, matchScore: aiScore ? aiScore.matchScore : c.matchScore };
            })
            .sort((a, b) => b.matchScore - a.matchScore);
            return res.json(finalResults);
        }
        res.json(candidates);
    } catch {
        res.json(candidates);
    }
});

// @desc    Get AI-powered skill gap analysis for a student
// @route   POST /api/ai/skill-gap
// @access  Private/Student
const getSkillGapAnalysis = asyncHandler(async (req, res) => {
    const { opportunityId } = req.body;
    const student = await User.findById(req.user._id);
    const opportunity = await Opportunity.findById(opportunityId);

    if (!opportunity) {
        res.status(404);
        throw new Error('Opportunity not found');
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
You are a career advisor AI.
Analyze the skill gap between a student and a job opportunity.

Student Skills: ${student.skills.join(', ') || 'None listed'}
Student Major: ${student.major || 'Not specified'}

Job Title: ${opportunity.position}
Required Skills: ${opportunity.skills.join(', ')}
Job Description: ${opportunity.description}

Provide a JSON response with:
{
  "matchingSkills": ["skill1", "skill2"],
  "missingSkills": ["skill3", "skill4"],
  "matchPercentage": <number 0-100>,
  "recommendation": "<1-2 sentence advice on what to learn>"
}
Return ONLY valid JSON, no other text.
    `.trim();

    try {
        const result = await model.generateContent(prompt);
        const responseText = result.response.text().trim();
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error('No JSON in response');
        const analysis = JSON.parse(jsonMatch[0]);
        res.json(analysis);
    } catch (err) {
        console.error('Gemini skill-gap error:', err.message);
        res.status(500);
        throw new Error('AI analysis failed. Please try again later.');
    }
});

module.exports = { getRecommendations, getSkillGapAnalysis };
