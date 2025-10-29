import { Env, AssessmentQuestion, KnowledgeLevel } from '../types';

// Generate assessment questions based on learning goal
export async function generateAssessmentQuestions(
  goal: string,
  ai: Env['REASONER']
): Promise<AssessmentQuestion[]> {
  const prompt = `You are an educational assessment expert. A learner wants to: "${goal}"

Generate 3 assessment questions to evaluate their current knowledge level. Questions should:
1. Be open-ended to allow various expertise levels
2. Cover prerequisite knowledge needed for the goal
3. Help identify knowledge gaps

Return ONLY a JSON array in this format:
[
  {
    "id": "q1",
    "question": "What is your experience with...",
    "topicArea": "react"
  },
  {
    "id": "q2",
    "question": "Have you worked with...",
    "topicArea": "deployment"
  }
]`;

  try {
    const response = await ai.generateText({
      prompt,
      temperature: 0.7,
      maxTokens: 800,
    });

    // Parse the response
    const text = response.text.trim();

    // Extract JSON from markdown code blocks if present
    let jsonText = text;
    if (text.includes('```json')) {
      const match = text.match(/```json\n([\s\S]*?)\n```/);
      if (match) {
        jsonText = match[1];
      }
    } else if (text.includes('```')) {
      const match = text.match(/```\n([\s\S]*?)\n```/);
      if (match) {
        jsonText = match[1];
      }
    }

    const questions = JSON.parse(jsonText);
    return questions;
  } catch (error) {
    console.error('Failed to generate questions:', error);

    // Fallback to default questions
    return [
      {
        id: 'q1',
        question: 'What is your experience with web development and frontend frameworks?',
        topicArea: 'frontend',
      },
      {
        id: 'q2',
        question: 'Have you deployed web applications before? If so, what tools or platforms have you used?',
        topicArea: 'deployment',
      },
      {
        id: 'q3',
        question: 'Are you familiar with version control systems like Git?',
        topicArea: 'git',
      },
    ];
  }
}

// Evaluate user answer and determine knowledge level
export async function evaluateAnswer(
  question: AssessmentQuestion,
  answer: string,
  ai: Env['REASONER']
): Promise<KnowledgeLevel> {
  const prompt = `You are an educational assessor. Evaluate this learner's response:

Question: ${question.question}
Topic Area: ${question.topicArea}
Answer: ${answer}

Assess their knowledge level as:
- "none": No knowledge or experience
- "basic": Beginner level understanding
- "intermediate": Comfortable with core concepts
- "advanced": Deep expertise

Also provide a confidence score from 0.0 to 1.0.

Return ONLY a JSON object in this format:
{
  "level": "intermediate",
  "confidence": 0.8
}`;

  try {
    const response = await ai.generateText({
      prompt,
      temperature: 0.3,
      maxTokens: 200,
    });

    // Parse the response
    const text = response.text.trim();

    // Extract JSON from markdown code blocks if present
    let jsonText = text;
    if (text.includes('```json')) {
      const match = text.match(/```json\n([\s\S]*?)\n```/);
      if (match) {
        jsonText = match[1];
      }
    } else if (text.includes('```')) {
      const match = text.match(/```\n([\s\S]*?)\n```/);
      if (match) {
        jsonText = match[1];
      }
    }

    const evaluation = JSON.parse(jsonText);

    return {
      topic: question.topicArea,
      level: evaluation.level,
      confidence: evaluation.confidence,
    };
  } catch (error) {
    console.error('Failed to evaluate answer:', error);

    // Fallback to basic evaluation based on answer length
    const wordCount = answer.split(/\s+/).length;
    let level: KnowledgeLevel['level'] = 'none';
    let confidence = 0.5;

    if (wordCount > 50) {
      level = 'advanced';
      confidence = 0.7;
    } else if (wordCount > 20) {
      level = 'intermediate';
      confidence = 0.6;
    } else if (wordCount > 5) {
      level = 'basic';
      confidence = 0.5;
    }

    return {
      topic: question.topicArea,
      level,
      confidence,
    };
  }
}

// Determine overall knowledge level from individual assessments
export function determineOverallLevel(
  knowledgeLevels: KnowledgeLevel[]
): string {
  if (knowledgeLevels.length === 0) return 'beginner';

  const levelScores = {
    none: 0,
    basic: 1,
    intermediate: 2,
    advanced: 3,
  };

  const avgScore =
    knowledgeLevels.reduce((sum, kl) => sum + levelScores[kl.level], 0) /
    knowledgeLevels.length;

  if (avgScore >= 2.5) return 'advanced';
  if (avgScore >= 1.5) return 'intermediate';
  return 'beginner';
}

// Identify knowledge gaps based on goal and assessed levels
export function identifyKnowledgeGaps(
  goal: string,
  knowledgeLevels: KnowledgeLevel[]
): string[] {
  const gaps: string[] = [];

  // Check for common prerequisites based on goal
  const lowerGoal = goal.toLowerCase();

  if (lowerGoal.includes('vercel') || lowerGoal.includes('deploy')) {
    // Check deployment prerequisites
    const hasDeployment = knowledgeLevels.some(
      kl => kl.topic === 'deployment' && kl.level !== 'none'
    );
    const hasGit = knowledgeLevels.some(
      kl => kl.topic === 'git' && kl.level !== 'none'
    );

    if (!hasDeployment) {
      gaps.push('deployment-basics');
    }
    if (!hasGit) {
      gaps.push('git-basics');
    }
  }

  if (lowerGoal.includes('react') || lowerGoal.includes('next')) {
    const hasReact = knowledgeLevels.some(
      kl => kl.topic === 'frontend' && kl.level !== 'none'
    );

    if (!hasReact) {
      gaps.push('react-basics');
    }
  }

  return gaps;
}
