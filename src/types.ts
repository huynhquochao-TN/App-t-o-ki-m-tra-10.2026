export type GradeLevel = 'Toán 10' | 'Toán 11' | 'Toán 12' | string;

export type ExamType =
  | 'Kiểm tra thường xuyên'
  | 'Kiểm tra 15 phút'
  | 'Kiểm tra giữa kỳ'
  | 'Kiểm tra cuối kỳ'
  | 'Đề ôn tập'
  | 'Đề luyện tập'
  | 'Đề khảo sát'
  | 'Đề tuyển chọn học sinh'
  | 'Đề tự tạo';

export type CognitiveLevel = 'nhan_biet' | 'thong_hieu' | 'van_dung' | 'van_dung_cao';

export type QuestionCategory =
  | 'multiple_choice' // 4 lựa chọn A/B/C/D
  | 'true_false' // Đúng/Sai (Định dạng tốt nghiệp 2025: 4 ý a,b,c,d)
  | 'short_answer' // Trả lời ngắn (điền kết quả)
  | 'matching' // Ghép nối
  | 'fill_in' // Điền khuyết
  | 'essay'; // Tự luận

export type EssaySubType =
  | 'Câu hỏi ngắn'
  | 'Giải thích'
  | 'Trình bày'
  | 'Giải bài tập'
  | 'Phân tích'
  | 'So sánh'
  | 'Chứng minh'
  | 'Vận dụng thực tế'
  | 'Đọc hiểu'
  | 'Viết đoạn/bài';

export interface TrueFalseSubItem {
  id: string; // 'a' | 'b' | 'c' | 'd'
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: string; // Q01, Q02...
  subject: string;
  grade: string;
  topic: string;
  subTopic?: string;
  questionType: QuestionCategory;
  essaySubType?: EssaySubType;
  level: CognitiveLevel;
  question: string;
  options?: string[]; // Cho trắc nghiệm 4 lựa chọn (A, B, C, D)
  subItems?: TrueFalseSubItem[]; // Cho câu Đúng/Sai (ý a, b, c, d)
  correctAnswer: string;
  explanation: string;
  score: number;
  learningOutcome: string;
  needsTeacherReview?: boolean;
  reviewReason?: string;
  teacherProvided?: boolean;
  verificationNote?: string;
}

export interface MatrixCell {
  count: number;
  score: number;
  percentage: number;
}

export interface MatrixRow {
  topic: string;
  subTopic: string;
  nhanBiet: MatrixCell;
  thongHieu: MatrixCell;
  vanDung: MatrixCell;
  vanDungCao: MatrixCell;
  totalCount: number;
  totalScore: number;
  totalPercentage: number;
}

export interface ExamMatrix {
  rows: MatrixRow[];
  totalNhanBiet: MatrixCell;
  totalThongHieu: MatrixCell;
  totalVanDung: MatrixCell;
  totalVanDungCao: MatrixCell;
  grandTotalCount: number;
  grandTotalScore: number;
  grandTotalPercentage: number;
}

export interface SpecificationItem {
  id: string;
  topic: string;
  subTopic: string;
  learningOutcome: string;
  level: CognitiveLevel;
  questionType: string;
  questionNumbers: number[];
  count: number;
  score: number;
}

export interface GradingStep {
  content: string;
  stepScore: number;
}

export interface RubricItem {
  questionId: string;
  questionNumber: number;
  steps: GradingStep[];
  totalScore: number;
  notes?: string;
}

export interface ExamVariant {
  code: string; // 101, 102, 103, 104
  title: string;
  questions: Question[];
  answerSheet: {
    questionNumber: number;
    type: QuestionCategory;
    answer: string;
    subAnswers?: { id: string; val: boolean }[];
    score: number;
  }[];
}

export interface ExamConfig {
  schoolName: string;
  grade: string;
  customGrade: string;
  subject: string;
  examType: ExamType;
  title: string;
  durationMinutes: number;
  customDuration: string;
  academicYear: string;
  semester: string;
  
  // Knowledge scope
  topic: string;
  chapter: string;
  knowledgeScope: string;
  testedContent: string;
  learningOutcomes: string;
  teacherNotes: string;
  rawLessonText: string;
  
  // Reference materials mode
  referenceMode: 'upload_only' | 'upload_plus_standard' | 'teacher_input_only';
  referenceDocuments: {
    id: string;
    name: string;
    type: string;
    size: number;
    content: string;
  }[];
  
  // Question type counts
  multipleChoiceCount: number; // 4 đáp án A/B/C/D
  trueFalseCount: number; // Đúng/Sai 4 ý
  shortAnswerCount: number; // Trả lời ngắn
  matchingCount: number; // Ghép nối
  fillInCount: number; // Điền khuyết
  essayCount: number; // Tự luận
  selectedEssaySubTypes: EssaySubType[];
  
  // Level distribution
  distributionMode: 'percentage' | 'count';
  levelPercent: {
    nhan_biet: number;
    thong_hieu: number;
    van_dung: number;
    van_dung_cao: number;
  };
  levelCount: {
    nhan_biet: number;
    thong_hieu: number;
    van_dung: number;
    van_dung_cao: number;
  };
  
  // Score scale
  scoreScale: 10 | 20 | 100 | number;
  customScoreScale: number;
  
  // Variants
  variantCount: 1 | 2 | 3 | 4;
  
  // Teacher pre-supplied questions
  preserveTeacherQuestions: boolean;
  teacherQuestions: Question[];
}

export interface QualityCheckResult {
  id: number;
  rule: string;
  passed: boolean;
  details: string;
  autoFixed?: boolean;
}

export interface ExamPackage {
  id: string;
  createdAt: string;
  config: ExamConfig;
  variants: ExamVariant[]; // Mã đề 101, 102, ...
  activeVariantIndex: number;
  matrix: ExamMatrix;
  specifications: SpecificationItem[];
  rubric: RubricItem[];
  qualityChecks: QualityCheckResult[];
}
