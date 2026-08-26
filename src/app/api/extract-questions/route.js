import { NextResponse } from 'next/server';
import { model } from '@/lib/gemini';
import { PROMPTS } from '@/lib/prompts';
import { SchemaType } from '@google/generative-ai';

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
      const base64Data = images[i].replace(/^data:image\/\w+;base64,/, '');
      
      const imagePart = {
        inlineData: {
          data: base64Data,
          mimeType: 'image/jpeg',
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

    return NextResponse.json({ questions: allQuestions });
  } catch (error) {
    console.error('Error extracting questions:', error);
    return NextResponse.json({ error: error.message || 'Failed to extract questions' }, { status: 500 });
  }
}
