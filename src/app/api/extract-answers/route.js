import { NextResponse } from 'next/server';
import { model } from '@/lib/gemini';
import { PROMPTS } from '@/lib/prompts';
import { SchemaType } from '@google/generative-ai';

export const maxDuration = 60;

export async function POST(req) {
  try {
    const { images, questions } = await req.json();

    if (!images || images.length === 0 || !questions) {
      return NextResponse.json({ error: 'Missing images or questions context' }, { status: 400 });
    }

    const allAnswers = [];
    const unmatchedAnswers = [];

    // Format questions context for the prompt
    const questionsContext = questions.map(q => `[${q.id}] ${q.number}: ${q.text}`).join('\n');

    const answerSchema = {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          questionId: { type: SchemaType.STRING, description: 'The ID of the matched question, or empty string if unmatched', nullable: true },
          extractedText: { type: SchemaType.STRING, description: 'The handwritten text extracted from the region' },
          box_2d: {
            type: SchemaType.ARRAY,
            items: { type: SchemaType.INTEGER },
            description: 'Bounding box coordinates: [ymin, xmin, ymax, xmax] (normalized 0-1000)',
          }
        },
        required: ['extractedText', 'box_2d'],
      },
    };

    // Process each page of the answer sheet
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

      const prompt = PROMPTS.EXTRACT_ANSWERS(questionsContext);

      const result = await model.generateContent({
        contents: [
          { role: 'user', parts: [imagePart, { text: prompt }] }
        ],
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: answerSchema,
        },
      });

      const responseText = result.response.text();
      let extractedRegions = [];
      try {
        extractedRegions = JSON.parse(responseText);
      } catch (e) {
        console.error('Failed to parse answers from page ' + i, e);
        continue;
      }

      // Process and map the extracted regions
      extractedRegions.forEach(region => {
        const [yMin, xMin, yMax, xMax] = region.box_2d || [0, 0, 0, 0];
        const boundingBox = { yMin, xMin, yMax, xMax };
        const answerRegion = { pageIndex: i, boundingBox };

        // Only trust a questionId that actually exists in the known question list.
        // The model doesn't reliably return an empty string for "no match" — it
        // sometimes echoes back words like "unmatched" or "none" verbatim instead,
        // which would otherwise slip through as a phantom match.
        const matchedQ = questions.find(q => q.id === region.questionId);

        if (!matchedQ) {
          unmatchedAnswers.push({
            extractedText: region.extractedText,
            regions: [answerRegion]
          });
        } else {
          // See if we already have an answer for this question (e.g. spanning multiple pages)
          const existingAnswer = allAnswers.find(a => a.questionId === region.questionId);
          if (existingAnswer) {
            existingAnswer.extractedText += '\n' + region.extractedText;
            existingAnswer.regions.push(answerRegion);
          } else {
            allAnswers.push({
              questionId: region.questionId,
              questionNumber: matchedQ.number,
              extractedText: region.extractedText,
              regions: [answerRegion],
              status: 'answered'
            });
          }
        }
      });
    }

    return NextResponse.json({ answers: allAnswers, unmatchedAnswers });
  } catch (error) {
    console.error('Error extracting answers:', error);
    return NextResponse.json({ error: error.message || 'Failed to extract answers' }, { status: 500 });
  }
}
