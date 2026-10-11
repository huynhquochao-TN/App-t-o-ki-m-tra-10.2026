import { Question, ExamVariant, TrueFalseSubItem } from '../types';

// Deterministic or seeded shuffle for variants
function shuffleArray<T>(array: T[], seed: number): T[] {
  const result = [...array];
  let m = result.length;
  let t: T;
  let i: number;

  const pseudoRandom = (s: number) => {
    const x = Math.sin(s++) * 10000;
    return x - Math.floor(x);
  };

  let curSeed = seed;
  while (m) {
    i = Math.floor(pseudoRandom(curSeed++) * m--);
    t = result[m];
    result[m] = result[i];
    result[i] = t;
  }
  return result;
}

export function generateVariants(
  baseQuestions: Question[],
  variantCount: number = 1,
  examTitle: string = 'ĐỀ KIỂM TRA MÔN TOÁN'
): ExamVariant[] {
  const variants: ExamVariant[] = [];
  const variantCodes = ['101', '102', '103', '104'];

  for (let vIdx = 0; vIdx < variantCount; vIdx++) {
    const code = variantCodes[vIdx] || `${101 + vIdx}`;
    
    // For variant 101, keep base order. For others, shuffle questions within each section
    let variantQuestions: Question[] = [];

    if (vIdx === 0) {
      variantQuestions = baseQuestions.map(q => ({ ...q }));
    } else {
      // Group questions by section: multiple_choice, true_false, short_answer, essay
      // To preserve logical exam flow while shuffling within sections
      const mc = baseQuestions.filter(q => q.questionType === 'multiple_choice');
      const tf = baseQuestions.filter(q => q.questionType === 'true_false');
      const sa = baseQuestions.filter(q => q.questionType === 'short_answer');
      const other = baseQuestions.filter(
        q => !['multiple_choice', 'true_false', 'short_answer'].includes(q.questionType)
      );

      const shuffledMc = shuffleArray(mc, vIdx * 17 + 3);
      const shuffledTf = shuffleArray(tf, vIdx * 29 + 7);
      const shuffledSa = shuffleArray(sa, vIdx * 41 + 11);
      const shuffledOther = shuffleArray(other, vIdx * 53 + 13);

      const combined = [...shuffledMc, ...shuffledTf, ...shuffledSa, ...shuffledOther];

      // Shuffle options for multiple choice questions in variants > 0
      variantQuestions = combined.map((origQ, qIdx) => {
        const qCopy: Question = { ...origQ, id: `V${code}-Q${qIdx + 1}` };

        if (qCopy.questionType === 'multiple_choice' && qCopy.options && qCopy.options.length === 4) {
          // Extract option texts without "A. ", "B. "
          const cleanTexts = qCopy.options.map(opt => opt.replace(/^[A-D][\.\:\)]\s*/, ''));
          
          // Determine which original option was correct
          const correctLetter = (qCopy.correctAnswer || 'A').toUpperCase().trim().charAt(0);
          const origCorrectIndex = ['A', 'B', 'C', 'D'].indexOf(correctLetter);
          const correctText = origCorrectIndex >= 0 ? cleanTexts[origCorrectIndex] : cleanTexts[0];

          // Permute options
          const permuted = shuffleArray(cleanTexts, (vIdx + 1) * 31 + qIdx * 7);
          
          // Re-label with A, B, C, D
          qCopy.options = permuted.map((text, i) => `${['A', 'B', 'C', 'D'][i]}. ${text}`);

          // Find new correct index
          const newCorrectIndex = permuted.findIndex(t => t === correctText);
          qCopy.correctAnswer = ['A', 'B', 'C', 'D'][newCorrectIndex >= 0 ? newCorrectIndex : 0];
        }

        // Shuffle subItems in True/False
        if (qCopy.questionType === 'true_false' && qCopy.subItems && qCopy.subItems.length > 0) {
          const shuffledSubs: TrueFalseSubItem[] = shuffleArray(qCopy.subItems, (vIdx + 1) * 19 + qIdx);
          // Re-assign a, b, c, d ids
          qCopy.subItems = shuffledSubs.map((item, i) => ({
            ...item,
            id: ['a', 'b', 'c', 'd'][i] || `${i + 1}`,
          }));
        }

        return qCopy;
      });
    }

    // Build answer sheet
    const answerSheet = variantQuestions.map((q, idx) => {
      let subAnswers: { id: string; val: boolean }[] | undefined = undefined;
      if (q.questionType === 'true_false' && q.subItems) {
        subAnswers = q.subItems.map(s => ({ id: s.id, val: s.isCorrect }));
      }

      return {
        questionNumber: idx + 1,
        type: q.questionType,
        answer: q.correctAnswer,
        subAnswers,
        score: q.score,
      };
    });

    variants.push({
      code,
      title: `${examTitle} - Mã đề ${code}`,
      questions: variantQuestions,
      answerSheet,
    });
  }

  return variants;
}
