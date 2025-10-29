import { Video } from '../types';

// Mock video data for MVP testing
export const MOCK_VIDEOS: Record<string, Video[]> = {
  'deployment-basics': [
    {
      id: 'v1',
      videoId: 'abc123',
      title: 'Web Deployment Fundamentals',
      url: 'https://youtube.com/watch?v=abc123',
      channel: 'Tech Education',
      duration: '15:30',
      thumbnailUrl: 'https://i.ytimg.com/vi/abc123/hqdefault.jpg',
      topics: ['deployment', 'hosting', 'web basics'],
    },
    {
      id: 'v2',
      videoId: 'def456',
      title: 'Understanding Build vs Runtime',
      url: 'https://youtube.com/watch?v=def456',
      channel: 'Developer Academy',
      duration: '12:45',
      thumbnailUrl: 'https://i.ytimg.com/vi/def456/hqdefault.jpg',
      topics: ['build process', 'deployment', 'ci/cd'],
    },
  ],

  'vercel-basics': [
    {
      id: 'v3',
      videoId: 'ghi789',
      title: 'Vercel Platform Overview',
      url: 'https://youtube.com/watch?v=ghi789',
      channel: 'Vercel',
      duration: '20:15',
      thumbnailUrl: 'https://i.ytimg.com/vi/ghi789/hqdefault.jpg',
      topics: ['vercel', 'deployment', 'platform'],
    },
    {
      id: 'v4',
      videoId: 'jkl012',
      title: 'Deploy Next.js to Vercel in 5 Minutes',
      url: 'https://youtube.com/watch?v=jkl012',
      channel: 'Next.js Tutorials',
      duration: '8:30',
      thumbnailUrl: 'https://i.ytimg.com/vi/jkl012/hqdefault.jpg',
      topics: ['vercel', 'nextjs', 'deployment', 'tutorial'],
    },
  ],

  'vercel-advanced': [
    {
      id: 'v5',
      videoId: 'mno345',
      title: 'Vercel Edge Functions Explained',
      url: 'https://youtube.com/watch?v=mno345',
      channel: 'Vercel',
      duration: '18:20',
      thumbnailUrl: 'https://i.ytimg.com/vi/mno345/hqdefault.jpg',
      topics: ['vercel', 'edge functions', 'serverless'],
    },
    {
      id: 'v6',
      videoId: 'pqr678',
      title: 'Advanced Vercel Configuration',
      url: 'https://youtube.com/watch?v=pqr678',
      channel: 'DevOps Masters',
      duration: '25:10',
      thumbnailUrl: 'https://i.ytimg.com/vi/pqr678/hqdefault.jpg',
      topics: ['vercel', 'configuration', 'advanced'],
    },
  ],

  'git-basics': [
    {
      id: 'v7',
      videoId: 'stu901',
      title: 'Git for Beginners',
      url: 'https://youtube.com/watch?v=stu901',
      channel: 'Programming with Mosh',
      duration: '30:00',
      thumbnailUrl: 'https://i.ytimg.com/vi/stu901/hqdefault.jpg',
      topics: ['git', 'version control', 'basics'],
    },
    {
      id: 'v8',
      videoId: 'vwx234',
      title: 'Git Workflow Essentials',
      url: 'https://youtube.com/watch?v=vwx234',
      channel: 'FreeCodeCamp',
      duration: '22:45',
      thumbnailUrl: 'https://i.ytimg.com/vi/vwx234/hqdefault.jpg',
      topics: ['git', 'workflow', 'collaboration'],
    },
  ],

  'react-basics': [
    {
      id: 'v9',
      videoId: 'yza567',
      title: 'React Crash Course',
      url: 'https://youtube.com/watch?v=yza567',
      channel: 'Traversy Media',
      duration: '45:00',
      thumbnailUrl: 'https://i.ytimg.com/vi/yza567/hqdefault.jpg',
      topics: ['react', 'javascript', 'frontend'],
    },
    {
      id: 'v10',
      videoId: 'bcd890',
      title: 'React Hooks Deep Dive',
      url: 'https://youtube.com/watch?v=bcd890',
      channel: 'Web Dev Simplified',
      duration: '35:20',
      thumbnailUrl: 'https://i.ytimg.com/vi/bcd890/hqdefault.jpg',
      topics: ['react', 'hooks', 'advanced'],
    },
  ],
};

// Helper to search videos by topic
export function searchVideosByTopic(query: string): Video[] {
  const lowerQuery = query.toLowerCase();
  const results: Video[] = [];

  // Search through all categories
  for (const [category, videos] of Object.entries(MOCK_VIDEOS)) {
    for (const video of videos) {
      // Check if query matches category, topics, or title
      if (
        category.includes(lowerQuery) ||
        video.topics.some(t => t.includes(lowerQuery)) ||
        video.title.toLowerCase().includes(lowerQuery)
      ) {
        results.push(video);
      }
    }
  }

  // Remove duplicates by video ID
  const unique = Array.from(
    new Map(results.map(v => [v.videoId, v])).values()
  );

  return unique;
}
