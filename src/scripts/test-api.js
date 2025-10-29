#!/usr/bin/env node

/**
 * Simple test script for the Learning Path Agent MVP API
 *
 * Usage: node src/scripts/test-api.js
 */

const API_BASE = process.env.API_BASE || 'http://localhost:8080';

async function testAPI() {
  console.log('🧪 Testing Learning Path Agent MVP API\n');
  console.log(`API Base URL: ${API_BASE}\n`);

  try {
    // Test 1: Health Check
    console.log('1️⃣  Testing health check...');
    const healthResponse = await fetch(`${API_BASE}/health`);
    const healthData = await healthResponse.json();
    console.log('   ✅ Health check passed:', healthData.status);
    console.log();

    // Test 2: Create Session
    console.log('2️⃣  Creating new learning session...');
    const createSessionResponse = await fetch(`${API_BASE}/api/sessions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        goal: 'I want to learn Vercel deployment',
      }),
    });
    const sessionData = await createSessionResponse.json();
    console.log('   ✅ Session created:', sessionData.sessionId);
    console.log('   Phase:', sessionData.phase);
    console.log();

    const sessionId = sessionData.sessionId;

    // Test 3: Get First Question
    console.log('3️⃣  Getting first assessment question...');
    const firstQuestionResponse = await fetch(
      `${API_BASE}/api/sessions/${sessionId}/assessment/next`
    );
    const firstQuestionData = await firstQuestionResponse.json();
    console.log('   ✅ Question received:');
    console.log('   ', firstQuestionData.question.question);
    console.log('   Progress:', firstQuestionData.progress);
    console.log();

    // Test 4: Submit Answer to Question 1
    console.log('4️⃣  Submitting answer to question 1...');
    const answer1Response = await fetch(
      `${API_BASE}/api/sessions/${sessionId}/assessment/answer`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId: firstQuestionData.question.id,
          answer: 'I have 2 years of experience with React and have built several production applications. I am comfortable with hooks, state management, and routing.',
        }),
      }
    );
    const answer1Data = await answer1Response.json();
    console.log('   ✅ Answer submitted');
    console.log('   Progress:', answer1Data.progress);
    console.log();

    // Test 5: Get Second Question
    console.log('5️⃣  Getting second assessment question...');
    const secondQuestionResponse = await fetch(
      `${API_BASE}/api/sessions/${sessionId}/assessment/next`
    );
    const secondQuestionData = await secondQuestionResponse.json();
    console.log('   ✅ Question received:');
    console.log('   ', secondQuestionData.question.question);
    console.log();

    // Test 6: Submit Answer to Question 2
    console.log('6️⃣  Submitting answer to question 2...');
    const answer2Response = await fetch(
      `${API_BASE}/api/sessions/${sessionId}/assessment/answer`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId: secondQuestionData.question.id,
          answer: 'I have deployed a few projects using Netlify and GitHub Pages, but I am not familiar with Vercel yet. I understand basic deployment concepts.',
        }),
      }
    );
    const answer2Data = await answer2Response.json();
    console.log('   ✅ Answer submitted');
    console.log('   Progress:', answer2Data.progress);
    console.log();

    // Test 7: Get Third Question
    console.log('7️⃣  Getting third assessment question...');
    const thirdQuestionResponse = await fetch(
      `${API_BASE}/api/sessions/${sessionId}/assessment/next`
    );
    const thirdQuestionData = await thirdQuestionResponse.json();
    console.log('   ✅ Question received:');
    console.log('   ', thirdQuestionData.question.question);
    console.log();

    // Test 8: Submit Answer to Question 3
    console.log('8️⃣  Submitting answer to question 3...');
    const answer3Response = await fetch(
      `${API_BASE}/api/sessions/${sessionId}/assessment/answer`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId: thirdQuestionData.question.id,
          answer: 'Yes, I use Git daily for version control. I am comfortable with basic commands like commit, push, pull, and branching.',
        }),
      }
    );
    const answer3Data = await answer3Response.json();
    console.log('   ✅ Answer submitted');
    console.log('   Assessment completed:', answer3Data.completed);
    console.log();

    // Test 9: Generate Learning Path
    console.log('9️⃣  Generating learning path...');
    const generatePathResponse = await fetch(
      `${API_BASE}/api/sessions/${sessionId}/path/generate`,
      {
        method: 'POST',
      }
    );
    const generatePathData = await generatePathResponse.json();
    console.log('   ✅ Learning path generated!');
    console.log('   Path ID:', generatePathData.pathId);
    console.log();

    // Test 10: Get Learning Path
    console.log('🔟 Retrieving learning path...');
    const getPathResponse = await fetch(
      `${API_BASE}/api/sessions/${sessionId}/path`
    );
    const pathData = await getPathResponse.json();
    console.log('   ✅ Learning path retrieved!');
    console.log();
    console.log('📚 LEARNING PATH SUMMARY:');
    console.log('   Goal:', pathData.learningPath.goal);
    console.log('   Knowledge Level:', pathData.learningPath.knowledgeLevel);
    console.log('   Total Modules:', pathData.learningPath.modules.length);
    console.log('   Total Videos:', pathData.learningPath.totalVideos);
    console.log();
    console.log('📖 MODULES:');
    pathData.learningPath.modules.forEach((module, index) => {
      console.log(`   ${index + 1}. ${module.topic}`);
      console.log(`      ${module.explanation}`);
      console.log(`      Videos: ${module.videos.length}`);
      module.videos.forEach((video, vIndex) => {
        console.log(`         ${vIndex + 1}) ${video.title} (${video.duration})`);
        console.log(`            ${video.url}`);
      });
      console.log();
    });

    console.log('✅ All tests passed!\n');
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error(error);
    process.exit(1);
  }
}

testAPI();
