import { Question, ExamMatrix, MatrixRow, SpecificationItem, ExamConfig } from '../types';

export function calculateMatrixFromQuestions(questions: Question[], totalScoreScale: number): ExamMatrix {
  // Group questions by topic & subTopic
  const topicMap = new Map<string, Question[]>();

  questions.forEach(q => {
    const key = `${q.topic || 'Kiến thức chung'}|||${q.subTopic || 'Trọng tâm'}`;
    if (!topicMap.has(key)) {
      topicMap.set(key, []);
    }
    topicMap.get(key)!.push(q);
  });

  const grandTotalScore = questions.reduce((sum, q) => sum + (Number(q.score) || 0), 0);
  const effectiveTotalScore = grandTotalScore > 0 ? grandTotalScore : totalScoreScale;

  const rows: MatrixRow[] = [];

  let sumNBCount = 0;
  let sumNBScore = 0;
  let sumTHCount = 0;
  let sumTHScore = 0;
  let sumVDCount = 0;
  let sumVDScore = 0;
  let sumVDCCount = 0;
  let sumVDCScore = 0;

  topicMap.forEach((qList, key) => {
    const [topic, subTopic] = key.split('|||');

    const nbList = qList.filter(q => q.level === 'nhan_biet');
    const thList = qList.filter(q => q.level === 'thong_hieu');
    const vdList = qList.filter(q => q.level === 'van_dung');
    const vdcList = qList.filter(q => q.level === 'van_dung_cao');

    const nbScore = nbList.reduce((s, q) => s + (Number(q.score) || 0), 0);
    const thScore = thList.reduce((s, q) => s + (Number(q.score) || 0), 0);
    const vdScore = vdList.reduce((s, q) => s + (Number(q.score) || 0), 0);
    const vdcScore = vdcList.reduce((s, q) => s + (Number(q.score) || 0), 0);

    const rowScore = nbScore + thScore + vdScore + vdcScore;
    const rowCount = qList.length;

    sumNBCount += nbList.length;
    sumNBScore += nbScore;
    sumTHCount += thList.length;
    sumTHScore += thScore;
    sumVDCount += vdList.length;
    sumVDScore += vdScore;
    sumVDCCount += vdcList.length;
    sumVDCScore += vdcScore;

    rows.push({
      topic,
      subTopic,
      nhanBiet: {
        count: nbList.length,
        score: Math.round(nbScore * 100) / 100,
        percentage: effectiveTotalScore > 0 ? Math.round((nbScore / effectiveTotalScore) * 100) : 0
      },
      thongHieu: {
        count: thList.length,
        score: Math.round(thScore * 100) / 100,
        percentage: effectiveTotalScore > 0 ? Math.round((thScore / effectiveTotalScore) * 100) : 0
      },
      vanDung: {
        count: vdList.length,
        score: Math.round(vdScore * 100) / 100,
        percentage: effectiveTotalScore > 0 ? Math.round((vdScore / effectiveTotalScore) * 100) : 0
      },
      vanDungCao: {
        count: vdcList.length,
        score: Math.round(vdcScore * 100) / 100,
        percentage: effectiveTotalScore > 0 ? Math.round((vdcScore / effectiveTotalScore) * 100) : 0
      },
      totalCount: rowCount,
      totalScore: Math.round(rowScore * 100) / 100,
      totalPercentage: effectiveTotalScore > 0 ? Math.round((rowScore / effectiveTotalScore) * 100) : 0
    });
  });

  return {
    rows,
    totalNhanBiet: {
      count: sumNBCount,
      score: Math.round(sumNBScore * 100) / 100,
      percentage: effectiveTotalScore > 0 ? Math.round((sumNBScore / effectiveTotalScore) * 100) : 0
    },
    totalThongHieu: {
      count: sumTHCount,
      score: Math.round(sumTHScore * 100) / 100,
      percentage: effectiveTotalScore > 0 ? Math.round((sumTHScore / effectiveTotalScore) * 100) : 0
    },
    totalVanDung: {
      count: sumVDCount,
      score: Math.round(sumVDScore * 100) / 100,
      percentage: effectiveTotalScore > 0 ? Math.round((sumVDScore / effectiveTotalScore) * 100) : 0
    },
    totalVanDungCao: {
      count: sumVDCCount,
      score: Math.round(sumVDCScore * 100) / 100,
      percentage: effectiveTotalScore > 0 ? Math.round((sumVDCScore / effectiveTotalScore) * 100) : 0
    },
    grandTotalCount: questions.length,
    grandTotalScore: Math.round(grandTotalScore * 100) / 100,
    grandTotalPercentage: 100
  };
}

export function generateSpecificationsFromQuestions(questions: Question[]): SpecificationItem[] {
  // Map specifications for each question or grouped questions
  const specs: SpecificationItem[] = [];

  questions.forEach((q, idx) => {
    const qNum = idx + 1;
    const typeLabel =
      q.questionType === 'multiple_choice'
        ? 'Trắc nghiệm 4 phương án (A,B,C,D)'
        : q.questionType === 'true_false'
        ? 'Trắc nghiệm Đúng/Sai (4 ý a,b,c,d)'
        : q.questionType === 'short_answer'
        ? 'Trắc nghiệm trả lời ngắn'
        : q.questionType === 'matching'
        ? 'Ghép nối tương ứng'
        : q.questionType === 'fill_in'
        ? 'Điền khuyết'
        : `Tự luận (${q.essaySubType || 'Giải bài tập'})`;

    specs.push({
      id: `SPEC-${qNum}`,
      topic: q.topic || 'Kiến thức chung',
      subTopic: q.subTopic || 'Trọng tâm bài học',
      learningOutcome: q.learningOutcome || 'Vận dụng kiến thức giải toán',
      level: q.level,
      questionType: typeLabel,
      questionNumbers: [qNum],
      count: 1,
      score: q.score || 0
    });
  });

  return specs;
}

export function autoAllocateScores(config: ExamConfig): {
  mcScore: number;
  tfScore: number;
  saScore: number;
  matchScore: number;
  fillScore: number;
  essayScore: number;
} {
  const totalScore = config.customScoreScale || config.scoreScale || 10;
  const totalCount =
    config.multipleChoiceCount +
    config.trueFalseCount +
    config.shortAnswerCount +
    config.matchingCount +
    config.fillInCount +
    config.essayCount;

  if (totalCount === 0) {
    return { mcScore: 0.25, tfScore: 1.0, saScore: 0.5, matchScore: 0.5, fillScore: 0.5, essayScore: 1.0 };
  }

  // Standard MoET 2025 weighting:
  // Part 1: Multiple choice ~ 0.25 pts/question
  // Part 2: True/False ~ 1.0 pts/question (0.1 for 1, 0.25 for 2, 0.5 for 3, 1.0 for 4)
  // Part 3: Short answer ~ 0.5 pts/question
  // Part 4: Essay ~ remaining points proportionally

  let rawWeights = {
    mc: config.multipleChoiceCount * 0.25,
    tf: config.trueFalseCount * 1.0,
    sa: config.shortAnswerCount * 0.5,
    match: config.matchingCount * 0.5,
    fill: config.fillInCount * 0.5,
    essay: config.essayCount * 1.5,
  };

  const sumWeights = Object.values(rawWeights).reduce((a, b) => a + b, 0);

  if (sumWeights === 0) {
    const evenScore = totalScore / totalCount;
    return {
      mcScore: evenScore,
      tfScore: evenScore,
      saScore: evenScore,
      matchScore: evenScore,
      fillScore: evenScore,
      essayScore: evenScore,
    };
  }

  const factor = totalScore / sumWeights;

  const roundToQuarter = (val: number) => Math.round(val * 4) / 4;

  return {
    mcScore: config.multipleChoiceCount > 0 ? roundToQuarter(0.25 * factor) || 0.25 : 0,
    tfScore: config.trueFalseCount > 0 ? roundToQuarter(1.0 * factor) || 1.0 : 0,
    saScore: config.shortAnswerCount > 0 ? roundToQuarter(0.5 * factor) || 0.5 : 0,
    matchScore: config.matchingCount > 0 ? roundToQuarter(0.5 * factor) || 0.5 : 0,
    fillScore: config.fillInCount > 0 ? roundToQuarter(0.5 * factor) || 0.5 : 0,
    essayScore: config.essayCount > 0 ? roundToQuarter(1.5 * factor) || 1.5 : 0,
  };
}
