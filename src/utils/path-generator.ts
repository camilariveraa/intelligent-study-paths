import {
  Env,
  LearningPath,
  LearningModule,
  KnowledgeLevel,
} from '../types';
import { searchVideosByTopic } from '../data/mock-videos';

// Generate a complete learning path
export async function generateLearningPath(
  sessionId: string,
  goal: string,
  knowledgeLevel: string,
  gaps: string[],
  ai: Env['REASONER']
): Promise<LearningPath> {
  // Generate topic structure
  const modules = await generateModules(goal, knowledgeLevel, gaps, ai);

  // Count total videos
  const totalVideos = modules.reduce((sum, m) => sum + m.videos.length, 0);

  const learningPath: LearningPath = {
    id: `path-${Date.now()}`,
    sessionId,
    goal,
    knowledgeLevel,
    modules,
    totalVideos,
    createdAt: new Date(),
  };

  return learningPath;
}

// Generate learning modules with topics and videos
async function generateModules(
  goal: string,
  knowledgeLevel: string,
  gaps: string[],
  ai: Env['REASONER']
): Promise<LearningModule[]> {
  const prompt = `You are a curriculum designer. Create a learning path for: "${goal}"

Current Knowledge Level: ${knowledgeLevel}
Knowledge Gaps: ${gaps.length > 0 ? gaps.join(', ') : 'none identified'}

Generate 3-4 learning modules in logical order (prerequisites first). For each module provide:
1. topic: Main topic name (use kebab-case like "deployment-basics")
2. explanation: Why this module comes at this position
3. order: Sequential number starting from 1

Return ONLY a JSON array in this format:
[
  {
    "topic": "deployment-basics",
    "explanation": "Understanding core deployment concepts before platform-specific features",
    "order": 1
  }
]`;

  try {
    const response = await ai.generateText({
      prompt,
      temperature: 0.6,
      maxTokens: 1000,
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

    const moduleTemplates = JSON.parse(jsonText);

    // Enhance modules with videos
    const modules: LearningModule[] = [];

    for (const template of moduleTemplates) {
      const videos = searchVideosByTopic(template.topic);

      modules.push({
        id: `module-${template.order}`,
        order: template.order,
        topic: template.topic,
        explanation: template.explanation,
        videos: videos.slice(0, 3), // Limit to 3 videos per module
      });
    }

    return modules;
  } catch (error) {
    console.error('Failed to generate modules:', error);

    // Fallback to default structure
    return createDefaultModules(goal, gaps);
  }
}

// Create default modules when AI generation fails
function createDefaultModules(
  goal: string,
  gaps: string[]
): LearningModule[] {
  const modules: LearningModule[] = [];
  let order = 1;

  // Add modules for identified gaps
  for (const gap of gaps) {
    const videos = searchVideosByTopic(gap);
    modules.push({
      id: `module-${order}`,
      order,
      topic: gap,
      explanation: `Foundation knowledge needed for your goal: ${goal}`,
      videos: videos.slice(0, 3),
    });
    order++;
  }

  // Add main goal module
  const lowerGoal = goal.toLowerCase();
  let mainTopic = 'general';

  if (lowerGoal.includes('vercel')) {
    mainTopic = 'vercel-basics';
  } else if (lowerGoal.includes('react')) {
    mainTopic = 'react-basics';
  } else if (lowerGoal.includes('deploy')) {
    mainTopic = 'deployment-basics';
  }

  const mainVideos = searchVideosByTopic(mainTopic);
  modules.push({
    id: `module-${order}`,
    order,
    topic: mainTopic,
    explanation: `Core content for: ${goal}`,
    videos: mainVideos.slice(0, 3),
  });

  return modules;
}
