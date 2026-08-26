import { NextResponse } from 'next/server';
import { model } from '@/lib/gemini';
import { PROMPTS } from '@/lib/prompts';
import { SchemaType } from '@google/generative-ai';

export async function POST(req) {
  try {
    const { questions, answers } = await req.json();

    if (!questions || !answers) {
      return NextResponse.json({ error: 'Missing questions or answers' }, { status: 400 });
    }

    const gradingSchema = {
      type: SchemaType.OBJECT,
      properties: {
        score: { type: SchemaType.NUMBER, description: 'The assigned score' },
        evaluation: { 
          type: SchemaType.STRING, 
          description: 'Overall evaluation: correct, partial, or incorrect',
          enum: ['correct', 'partial', 'incorrect']
        },
        feedback: { type: SchemaType.STRING, description: 'Brief feedback explaining the score' },
      },
      required: ['score', 'evaluation', 'feedback'],
    };

    const grades = [];
    let totalScore = 0;
    let maxPossibleScore = 0;

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    // Process grading sequentially to respect Gemini free tier rate limits (15 RPM)
    for (const question of questions) {
      const maxMarks = question.marks || 10;
      maxPossibleScore += maxMarks;

      const answer = answers.find(a => a.questionId === question.id);
      
      if (!answer) {
        grades.push({
          questionId: question.id,
          score: 0,
          maxScore: maxMarks,
          evaluation: 'unanswered',
          feedback: 'No answer found for this question.'
        });
        continue;
      }

      const prompt = PROMPTS.GRADE_ANSWERS(question.text, answer.extractedText, maxMarks);

      try {
        const result = await model.generateContent({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: 'application/json',
            responseSchema: gradingSchema,
          },
        });

        const evaluationResult = JSON.parse(result.response.text());
        
        grades.push({
          questionId: question.id,
          score: evaluationResult.score,
          maxScore: maxMarks,
          evaluation: evaluationResult.evaluation,
          feedback: evaluationResult.feedback
        });
        
        totalScore += evaluationResult.score;
        
        // Wait 1 second between API calls to avoid 429 Too Many Requests
        await sleep(1000);
      } catch (e) {
        console.error(`Failed to grade question ${question.id}`, e);
        grades.push({
          questionId: question.id,
          score: 0,
          maxScore: maxMarks,
          evaluation: 'incorrect',
          feedback: 'Error during grading.'
        });
      }
    }

    return NextResponse.json({ 
      grades, 
      summary: {
        total: maxPossibleScore,
        scored: totalScore,
        percentage: maxPossibleScore > 0 ? (totalScore / maxPossibleScore) * 100 : 0
      }
    });

  } catch (error) {
    console.error('Error grading answers:', error);
    return NextResponse.json({ error: error.message || 'Failed to grade' }, { status: 500 });
  }
}
