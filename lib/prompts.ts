import type { QuestionCategory, Difficulty, Question } from './types';

const USER_BACKGROUND = `
The candidate has 9 years of marketing experience at PepsiCo, a global FMCG / CPG company.
They are a senior marketing professional (Manager level) with deep expertise in:
- Brand management and portfolio strategy
- Large-scale campaign development and go-to-market execution
- Consumer insights, data-driven marketing, and agency management
- Cross-functional leadership across sales, finance, supply chain, and R&D
- P&L ownership and budget management at significant scale ($XM campaigns)
- Trade marketing, shelf strategy, and retailer relationships in FMCG

They are likely transitioning into a new marketing leadership role or an adjacent function
(e.g., growth marketing, product marketing, or a CMO-track role at a mid-size company).

When generating questions: reference real FMCG contexts — brand launches, consumer trends,
shelf space battles, retail partnerships, seasonal campaigns, agency management.
When giving feedback: evaluate for strategic thinking, not just task execution. A strong answer
from this candidate should show leadership, business impact, and cross-functional influence.
`.trim();

export function buildGenerateQuestionsPrompt(
  category: QuestionCategory,
  difficulty: Difficulty,
  jobDescription: string
): { system: string; user: string } {
  const categoryDescriptions: Record<QuestionCategory, string> = {
    behavioral:
      'behavioral questions using the STAR method (Situation, Task, Action, Result) that probe past leadership and campaign experiences',
    case:
      'open-ended case questions requiring structured marketing problem-solving, brand strategy, and business judgment',
    situational:
      'situational judgment questions presenting hypothetical marketing leadership scenarios that test decision-making and stakeholder management',
  };

  const difficultyGuidance: Record<Difficulty, string> = {
    easy: 'foundational, suitable for screening interviews — test clear communication and basic marketing competencies',
    medium:
      'moderately complex, suitable for mid-process interviews — require concrete examples of business impact and cross-functional work',
    hard:
      'highly challenging, suitable for senior/director-level final rounds — require nuanced strategic judgment, measurable results at scale, and executive presence',
  };

  const jobContext = jobDescription.trim()
    ? `\n\nJob Description / Role Context:\n${jobDescription.trim()}\n\nTailor all questions specifically to this role, mapping the candidate's FMCG marketing background against the role's requirements.`
    : '';

  const system = `You are an expert interview coach specializing in senior marketing roles at consumer goods, CPG, tech, and consulting companies. You generate rigorous, realistic interview questions tailored to experienced marketing professionals.

Candidate background:
${USER_BACKGROUND}${jobContext}

Difficulty guidance for this session: ${difficultyGuidance[difficulty]}

You must respond with ONLY valid JSON — no markdown, no explanation, no code fences. The JSON must be an array of exactly 5 question objects.`;

  const user = `Generate 5 ${difficulty} ${categoryDescriptions[category]}.

Each question object must have this exact shape:
{
  "id": "q1",
  "text": "The interview question text",
  "category": "${category}",
  "difficulty": "${difficulty}",
  "multipleChoice": [
    "Describes owning the full campaign P&L, aligning cross-functional stakeholders early...",
    "Focuses on the creative process and agency collaboration, hits deadline but misses business impact...",
    "Executes the plan as directed by leadership, references social engagement as success metric...",
    "Talks broadly about campaign theme without specifying leadership role or quantifiable results..."
  ],
  "hint": "A brief one-sentence hint about what a strong answer should include, calibrated to a senior FMCG marketer"
}

For behavioral questions: probe leadership of major campaigns, budget decisions, agency management, cross-functional conflict resolution, and market share impact.
For case questions: focus on brand positioning challenges, launching into new channels, declining category dynamics, portfolio rationalization, or competitive response strategies.
For situational questions: focus on competing priorities across brands/channels, managing up or down in a matrix org, ethical marketing decisions, crisis communications, or agency relationship management.

Multiple choice options must be realistic and calibrated for a senior FMCG marketer — option A should represent the most strategic and business-impact-driven approach. The options should feel like real interview differentiators, not obvious.`;

  return { system, user };
}

export function buildAnalyzeAnswerPrompt(
  question: Question,
  answer: string,
  isMultipleChoice: boolean
): { system: string; user: string } {
  const system = `You are an expert interview coach who evaluates interview answers for senior marketing professionals with FMCG / CPG backgrounds targeting marketing leadership roles.

Candidate background:
${USER_BACKGROUND}

You must respond with ONLY valid JSON — no markdown, no explanation, no code fences.`;

  const answerNote = isMultipleChoice
    ? `The candidate selected this multiple-choice option: "${answer}"

The answer text is prefixed with its quality level in brackets (e.g. "[Quality: strongest approach]").
Score accordingly: "strongest approach" = 8–10 (use 10 if the option is comprehensive and leaves nothing out), "good but incomplete" = 6–7, "weaker approach" = 4–5, "poor approach" = 1–3.
Be precise — 10 is achievable, do not default to 8 for the best option.`
    : `The candidate wrote this free-form answer:\n"${answer}"`;

  const starInstruction =
    question.category === 'behavioral'
      ? `
Also include a "starAnalysis" object evaluating how well the answer covers each STAR component:
{
  "situation": "assessment of how clearly the context/situation was set",
  "task": "assessment of how well they defined their role and the challenge",
  "action": "assessment of the specific actions they took — was it strategic or just executional?",
  "result": "assessment of measurable outcomes — did they quantify impact at FMCG/PepsiCo scale?"
}`
      : '';

  const user = `Evaluate this interview answer from a senior FMCG marketing professional.

Question: "${question.text}"
Category: ${question.category} | Difficulty: ${question.difficulty}

${answerNote}

Respond with this exact JSON shape:
{
  "questionId": "${question.id}",
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "improvements": ["improvement 1", "improvement 2", "improvement 3"],${starInstruction ? '\n  "starAnalysis": { "situation": "...", "task": "...", "action": "...", "result": "..." },' : ''}
  "score": 7,
  "overallComment": "Two to three sentence assessment with specific coaching advice relevant to a senior FMCG marketer targeting a leadership role."
}

Evaluation guidelines:
- strengths: 2–4 specific things the answer demonstrated well — prioritize strategic thinking, leadership, and business impact
- improvements: 2–4 specific gaps — call out if the answer was too executional and lacked strategic framing, or if it lacked quantified impact (e.g., "A stronger answer would mention the % market share gain or revenue impact of the campaign")
- score: integer 1–10 calibrated for a senior marketing role (7 = solid, 9 = excellent, 10 = truly outstanding with no gaps — 10 is achievable, award it when deserved)
- overallComment: must mention the FMCG / CPG context and whether the answer reflects the seniority and scale expected at PepsiCo level
${question.category === 'behavioral' ? '- starAnalysis: be specific about whether each component was present, concrete, and compelling — note if the Result lacked business metrics' : ''}`;

  return { system, user };
}
