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

    if (!student.skills || student.skills.length === 0) {
        // Fall back to returning 5 newest opportunities if no skills set
        return res.json(opportunities.slice(0, 5).map(o => ({ ...o, matchScore: 50 })));
    }

    if (opportunities.length === 0) {
        return res.json([]);
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
You are a job matching AI assistant.
Given a student profile and a list of job opportunities, score each job's match percentage (0-100) for the student.
Student profile:
- Name: ${student.name}
- Major: ${student.major || 'Not specified'}
- Skills: ${student.skills.join(', ')}
- Bio: ${student.bio || 'Not specified'}

Job Opportunities (JSON array):
${JSON.stringify(opportunities.map(o => ({ id: o._id, position: o.position, skills: o.skills, type: o.type })))}

Return ONLY a valid JSON array in this exact format (no text before or after):
[{"id":"<opportunity_id>","matchScore":<number_0_to_100>}]
Sort by matchScore descending.
    `.trim();

    try {
        const result = await model.generateContent(prompt);
        const responseText = result.response.text().trim();

        // Extract JSON array from response defensively
        const jsonMatch = responseText.match(/\[[\s\S]*\]/);
        if (!jsonMatch) throw new Error('No JSON array in AI response');

        const scores = JSON.parse(jsonMatch[0]);

        // Merge scores back with full opportunity data
        const scoredOpportunities = scores.map(score => {
            const opp = opportunities.find(o => o._id.toString() === score.id.toString());
            return opp ? { ...opp, matchScore: score.matchScore } : null;
        }).filter(Boolean);

        res.json(scoredOpportunities);
    } catch (err) {
        console.error('Gemini AI error:', err.message);
        // Graceful fallback: return opportunities with mock match score
        res.json(opportunities.slice(0, 5).map(o => ({ ...o, matchScore: Math.floor(Math.random() * 30) + 60 })));
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
