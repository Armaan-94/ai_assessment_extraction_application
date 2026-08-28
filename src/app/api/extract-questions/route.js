import { NextResponse } from 'next/server';
import { model } from '@/lib/gemini';
import { PROMPTS } from '@/lib/prompts';
import { SchemaType } from '@google/generative-ai';

export const maxDuration = 60;

export async function POST(req) {
  try {
    const { images } = await req.json();

    if (!images || images.length === 0) {
      return NextResponse.json({ error: 'No images provided' }, { status: 400 });
    }

    const allQuestions = [];

    // Define the expected output schema for questions
    const questionSchema = {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          id: { type: SchemaType.STRING, description: 'A unique identifier for the question (e.g., q1, q1a)' },
          number: { type: SchemaType.STRING, description: 'The exact question number as printed (e.g., "1", "11(a)")' },
          text: { type: SchemaType.STRING, description: 'The full text of the question' },
          marks: { type: SchemaType.NUMBER, description: 'The maximum marks for the question, if mentioned', nullable: true },
        },
        required: ['id', 'number', 'text'],
      },
    };

    // Process each page
    for (let i = 0; i < images.length; i++) {
      const match = images[i].match(/^data:(image\/\w+);base64,(.+)$/);
      const mimeType = match ? match[1] : 'image/jpeg';
      const base64Data = match ? match[2] : images[i].replace(/^data:image\/\w+;base64,/, '');

      const imagePart = {
        inlineData: {
          data: base64Data,
          mimeType,
        },
      };

      const result = await model.generateContent({
        contents: [
          { role: 'user', parts: [imagePart, { text: PROMPTS.EXTRACT_QUESTIONS }] }
        ],
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: questionSchema,
        },
      });

      const responseText = result.response.text();
      let extractedQuestions = [];
      try {
        extractedQuestions = JSON.parse(responseText);
      } catch (e) {
        console.error('Failed to parse Gemini response', e);
        continue;
      }

      // Add page number to each question
      extractedQuestions.forEach(q => {
        q.pageNumber = i;
        allQuestions.push(q);
      });
    }

    // Gemini assigns ids per-page with no visibility into other pages' ids,
    // so collisions are possible (e.g. two different questions both getting "q1").
    // De-duplicate here to guarantee ids stay unique across the whole document,
    // since every downstream match (answers, grading, UI selection) keys off id.
    const seenIds = new Set();
    allQuestions.forEach((q, idx) => {
      const baseId = q.id || `q${idx}`;
      let uniqueId = baseId;
      let suffix = 2;
      while (seenIds.has(uniqueId)) {
        uniqueId = `${baseId}_${suffix++}`;
      }
      seenIds.add(uniqueId);
      q.id = uniqueId;
    });

    return NextResponse.json({ questions: allQuestions });
  } catch (error) {
    console.error('Error extracting questions:', error);
    return NextResponse.json({ error: error.message || 'Failed to extract questions' }, { status: 500 });
  }
}
