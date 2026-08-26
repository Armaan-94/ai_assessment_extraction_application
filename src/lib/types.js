/**
 * @typedef {Object} Question
 * @property {string} id - Unique ID (e.g., "q1", "q2a")
 * @property {string} number - Original numbering (e.g., "1", "11(a)")
 * @property {string} text - Full question text
 * @property {number|null} marks - Maximum marks if mentioned
 * @property {number} pageNumber - Page index in question paper (0-based)
 */

/**
 * @typedef {Object} BoundingBox
 * @property {number} yMin - Top edge (0-1000 normalized)
 * @property {number} xMin - Left edge (0-1000 normalized)
 * @property {number} yMax - Bottom edge (0-1000 normalized)
 * @property {number} xMax - Right edge (0-1000 normalized)
 */

/**
 * @typedef {Object} AnswerRegion
 * @property {number} pageIndex - Page index in answer sheet (0-based)
 * @property {BoundingBox} boundingBox - Normalized bounding box
 */

/**
 * @typedef {Object} MappedAnswer
 * @property {string} questionId - Linked question ID
 * @property {string} questionNumber - Original question number
 * @property {string} extractedText - OCR'd answer text
 * @property {AnswerRegion[]} regions - Answer location(s), can span pages
 * @property {'answered'|'unanswered'|'unmatched'} status
 */

/**
 * @typedef {Object} GradingResult
 * @property {string} questionId
 * @property {number|null} score - Score given
 * @property {number|null} maxScore - Maximum possible
 * @property {'correct'|'partial'|'incorrect'|'unanswered'} evaluation
 * @property {string} feedback - AI-generated feedback
 */

/**
 * @typedef {Object} AssessmentState
 * @property {Question[]} questions
 * @property {MappedAnswer[]} answers
 * @property {MappedAnswer[]} unmatchedAnswers - Answers not mapped to any question
 * @property {GradingResult[]} grades
 * @property {string[]} questionPaperImages - base64 page images
 * @property {string[]} answerSheetImages - base64 page images
 * @property {'idle'|'uploading'|'extracting-questions'|'extracting-answers'|'grading'|'complete'|'error'} status
 * @property {string|null} error
 * @property {number} progress - 0-100
 */
