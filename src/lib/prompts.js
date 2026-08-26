export const PROMPTS = {
  EXTRACT_QUESTIONS: `Analyze this question paper page. Extract EVERY question exactly as printed.
Rules:
- Preserve original question numbering exactly.
- Treat labeled sub-parts as SEPARATE questions (e.g., "11(a)" and "11(b)" are two entries).
- Include the marks/weightage if mentioned.
- Maintain the printed order.
Return the result as a structured JSON array of question objects.`,

  EXTRACT_ANSWERS: (questionsContext) => `You are analyzing a handwritten answer sheet. Here are the questions from the question paper:
${questionsContext}

For this answer sheet page, identify every handwritten answer.
For each answer:
1. Match it to the corresponding question by the student's written question number.
2. Extract the answer text as accurately as possible.
3. Return bounding box coordinates [ymin, xmin, ymax, xmax] normalized 0-1000.
4. If an answer doesn't match any known question, mark it as "unmatched" (or do not link a questionId).
5. Students may answer out of order — match by their written labels.
Return the result as a structured JSON array of mapped answers.`,

  GRADE_ANSWERS: (questionText, answerText, maxMarks) => `You are an expert teacher evaluating a student's answer.
Question: ${questionText}
Max Marks: ${maxMarks || 'Not specified (assume out of 10)'}
Student Answer: ${answerText}

Evaluate the student's answer.
Provide:
- Score (a number).
- Evaluation: "correct", "partial", or "incorrect".
- Brief, constructive feedback explaining the evaluation (max 2 sentences).
Be fair but thorough. Return the result as a structured JSON object.`
};
