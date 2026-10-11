/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  FileText,
  CheckCircle2,
  Award,
  Layers,
  FileCheck,
  AlertCircle,
  Sparkles,
  Printer,
  Copy,
  Download,
  Shuffle,
  ShieldCheck,
  ChevronRight,
  BookOpen,
} from 'lucide-react';
import {
  ExamConfig,
  ExamPackage,
  Question,
  ExamVariant,
  ExamMatrix,
  SpecificationItem,
  RubricItem,
  QualityCheckResult,
} from './types';
import { Header } from './components/Header';
import { ConfigWizard } from './components/ConfigWizard';
import { ExamViewer } from './components/ExamViewer';
import { AnswerKeyViewer } from './components/AnswerKeyViewer';
import { RubricViewer } from './components/RubricViewer';
import { MatrixViewer } from './components/MatrixViewer';
import { SpecificationViewer } from './components/SpecificationViewer';
import { QualityModal } from './components/QualityModal';
import { QuestionBankModal } from './components/QuestionBankModal';
import { ImportMatrixModal } from './components/ImportMatrixModal';
import { EditQuestionModal } from './components/EditQuestionModal';
import { calculateMatrixFromQuestions, generateSpecificationsFromQuestions } from './utils/matrixUtils';
import { generateVariants } from './utils/variantGenerator';
import { runQualityChecks } from './utils/qualityChecker';
import { copyExamToClipboard, downloadAsWordDoc, downloadAnswersAsDoc } from './utils/exportUtils';

const DEFAULT_CONFIG: ExamConfig = {
  schoolName: 'TRƯỜNG THPT CHUYÊN QUỐC GIA',
  grade: 'Toán 12',
  customGrade: '',
  subject: 'Toán học',
  examType: 'Kiểm tra giữa kỳ',
  title: 'ĐỀ KIỂM TRA GIỮA HỌC KỲ I MÔN TOÁN',
  durationMinutes: 45,
  customDuration: '',
  academicYear: '2024 - 2025',
  semester: 'Học kỳ 1',
  topic: 'Ứng dụng đạo hàm để khảo sát và vẽ đồ thị hàm số',
  chapter: 'Chương 1: Khảo sát hàm số',
  knowledgeScope: 'Tính đơn điệu, cực trị, giá trị lớn nhất - nhỏ nhất, đường tiệm cận',
  testedContent: 'Nhận biết bảng biến thiên, tìm m để hàm số đơn điệu, bài toán tối ưu thực tế',
  learningOutcomes: 'Vận dụng thành thạo đạo hàm giải quyết bài toán khảo sát và ứng dụng thực tiễn',
  teacherNotes: 'Ưu tiên bài toán có ý nghĩa thực tiễn, số liệu đẹp, không gây nhầm lẫn',
  rawLessonText: '',
  referenceMode: 'upload_plus_standard',
  referenceDocuments: [],
  multipleChoiceCount: 12,
  trueFalseCount: 4,
  shortAnswerCount: 6,
  matchingCount: 0,
  fillInCount: 0,
  essayCount: 0,
  selectedEssaySubTypes: ['Vận dụng thực tế', 'Giải bài tập'],
  distributionMode: 'percentage',
  levelPercent: {
    nhan_biet: 40,
    thong_hieu: 30,
    van_dung: 20,
    van_dung_cao: 10,
  },
  levelCount: {
    nhan_biet: 8,
    thong_hieu: 8,
    van_dung: 4,
    van_dung_cao: 2,
  },
  scoreScale: 10,
  customScoreScale: 10,
  variantCount: 1,
  preserveTeacherQuestions: true,
  teacherQuestions: [],
};

export default function App() {
  const [config, setConfig] = useState<ExamConfig>(() => {
    try {
      const saved = localStorage.getItem('math_exam_config_last');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_CONFIG;
  });

  const [examPackage, setExamPackage] = useState<ExamPackage | null>(null);
  const [activeTab, setActiveTab] = useState<'exam' | 'answers' | 'rubric' | 'matrix' | 'specifications'>('exam');
  const [activeVariantIndex, setActiveVariantIndex] = useState<number>(0);

  // Generation status
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState('');
  const [generationSuccessNotice, setGenerationSuccessNotice] = useState(false);

  // Modals
  const [showQualityModal, setShowQualityModal] = useState(false);
  const [showQuestionBankModal, setShowQuestionBankModal] = useState(false);
  const [showImportMatrixModal, setShowImportMatrixModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  // Question bank state (persisted)
  const [bankQuestions, setBankQuestions] = useState<Question[]>(() => {
    try {
      const saved = localStorage.getItem('math_exam_question_bank');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  // Save config on change
  useEffect(() => {
    try {
      localStorage.setItem('math_exam_config_last', JSON.stringify(config));
    } catch {}
  }, [config]);

  // Save question bank on change
  useEffect(() => {
    try {
      localStorage.setItem('math_exam_question_bank', JSON.stringify(bankQuestions));
    } catch {}
  }, [bankQuestions]);

  // Handle Generate Exam
  const handleGenerateExam = async () => {
    setIsGenerating(true);
    setGenerationSuccessNotice(false);

    try {
      // Step 1: Phân tích yêu cầu
      setGenerationStep('Đang phân tích yêu cầu…');
      await new Promise(r => setTimeout(r, 450));

      // Step 2: Xây dựng ma trận
      setGenerationStep('Đang xây dựng ma trận…');
      await new Promise(r => setTimeout(r, 450));

      // Step 3: Đang tạo câu hỏi
      setGenerationStep('Đang tạo câu hỏi…');
      const res = await fetch('/api/generate-exam', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config }),
      });

      const data = await res.json();
      if (!data.success || !data.questions) {
        throw new Error(data.error || 'Lỗi khi tạo câu hỏi');
      }

      const rawQuestions: Question[] = data.questions;

      // Step 4: Đang kiểm tra đáp án
      setGenerationStep('Đang kiểm tra đáp án…');
      await new Promise(r => setTimeout(r, 400));

      // Build Matrix
      const matrix = calculateMatrixFromQuestions(rawQuestions, config.customScoreScale || config.scoreScale);

      // Run Quality Checks (12 criteria)
      const { checks, fixedQuestions } = runQualityChecks(rawQuestions, config, matrix);

      // Recalculate specifications
      const specs = generateSpecificationsFromQuestions(fixedQuestions);

      // Step 5: Đang hoàn thiện đề
      setGenerationStep('Đang hoàn thiện đề…');
      const variants = generateVariants(fixedQuestions, config.variantCount, config.title);

      const pkg: ExamPackage = {
        id: `EXAM-${Date.now()}`,
        createdAt: new Date().toISOString(),
        config,
        variants,
        activeVariantIndex: 0,
        matrix,
        specifications: specs,
        rubric: [],
        qualityChecks: checks,
      };

      setExamPackage(pkg);
      setActiveVariantIndex(0);
      setGenerationSuccessNotice(true);
      setTimeout(() => setGenerationSuccessNotice(false), 5000);
    } catch (err: any) {
      console.error('Exam generation error:', err);
      alert(`Lỗi: ${err.message || 'Không thể tạo đề thi'}`);
    } finally {
      setIsGenerating(false);
      setGenerationStep('');
    }
  };

  // Generate Matrix Only
  const handleGenerateMatrixOnly = () => {
    // Generate placeholder items matching the count configuration
    const totalCount =
      config.multipleChoiceCount +
      config.trueFalseCount +
      config.shortAnswerCount +
      config.matchingCount +
      config.fillInCount +
      config.essayCount;

    if (totalCount === 0) {
      alert('Vui lòng chọn số lượng câu hỏi trước khi tạo ma trận');
      return;
    }

    const mockQuestions: Question[] = [];
    const totalScore = config.customScoreScale || config.scoreScale || 10;
    const itemScore = Math.round((totalScore / totalCount) * 100) / 100;

    let nbLeft = Math.round(totalCount * (config.levelPercent.nhan_biet / 100));
    let thLeft = Math.round(totalCount * (config.levelPercent.thong_hieu / 100));
    let vdLeft = Math.round(totalCount * (config.levelPercent.van_dung / 100));
    let vdcLeft = totalCount - nbLeft - thLeft - vdLeft;

    for (let i = 0; i < totalCount; i++) {
      let lvl: any = 'nhan_biet';
      if (nbLeft > 0) { lvl = 'nhan_biet'; nbLeft--; }
      else if (thLeft > 0) { lvl = 'thong_hieu'; thLeft--; }
      else if (vdLeft > 0) { lvl = 'van_dung'; vdLeft--; }
      else { lvl = 'van_dung_cao'; vdcLeft--; }

      mockQuestions.push({
        id: `Q${i + 1}`,
        subject: config.subject,
        grade: config.grade,
        topic: config.topic || 'Kiến thức chung',
        subTopic: config.testedContent || 'Trọng tâm bài học',
        questionType: i < config.multipleChoiceCount ? 'multiple_choice' : 'short_answer',
        level: lvl,
        question: `Câu hỏi minh họa theo ma trận ${i + 1}`,
        correctAnswer: 'A',
        explanation: 'Lời giải chi tiết',
        score: itemScore,
        learningOutcome: config.learningOutcomes || 'Chuẩn yêu cầu cần đạt',
      });
    }

    const matrix = calculateMatrixFromQuestions(mockQuestions, totalScore);
    const specs = generateSpecificationsFromQuestions(mockQuestions);
    const variants = generateVariants(mockQuestions, config.variantCount, config.title);

    const pkg: ExamPackage = {
      id: `MATRIX-${Date.now()}`,
      createdAt: new Date().toISOString(),
      config,
      variants,
      activeVariantIndex: 0,
      matrix,
      specifications: specs,
      rubric: [],
      qualityChecks: [],
    };

    setExamPackage(pkg);
    setActiveTab('matrix');
  };

  // Generate Equivalent Exam (Requirement 18)
  const handleGenerateEquivalent = async () => {
    if (!examPackage) return;
    setIsGenerating(true);
    setGenerationStep('Đang tạo bộ đề tương đương (giữ nguyên cấu trúc & ma trận)…');

    try {
      const res = await fetch('/api/generate-exam', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          config: {
            ...config,
            title: `${config.title} (Đề tương đương)`,
          },
        }),
      });

      const data = await res.json();
      if (!data.success || !data.questions) {
        throw new Error('Không thể tạo đề tương đương');
      }

      const matrix = calculateMatrixFromQuestions(data.questions, config.customScoreScale || config.scoreScale);
      const specs = generateSpecificationsFromQuestions(data.questions);
      const { checks, fixedQuestions } = runQualityChecks(data.questions, config, matrix);
      const variants = generateVariants(fixedQuestions, config.variantCount, `${config.title} (Tương đương)`);

      setExamPackage({
        id: `EXAM-EQ-${Date.now()}`,
        createdAt: new Date().toISOString(),
        config: { ...config, title: `${config.title} (Tương đương)` },
        variants,
        activeVariantIndex: 0,
        matrix,
        specifications: specs,
        rubric: [],
        qualityChecks: checks,
      });

      setGenerationSuccessNotice(true);
      setTimeout(() => setGenerationSuccessNotice(false), 5000);
    } catch (err: any) {
      alert(`Lỗi: ${err.message}`);
    } finally {
      setIsGenerating(false);
      setGenerationStep('');
    }
  };

  // Regenerate single question (Requirement 17)
  const handleRegenerateQuestion = async (oldQuestion: Question) => {
    if (!examPackage) return;
    try {
      const res = await fetch('/api/regenerate-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: oldQuestion, config }),
      });

      const data = await res.json();
      if (data.success && data.question) {
        const updatedList = examPackage.variants[activeVariantIndex].questions.map(q =>
          q.id === oldQuestion.id ? { ...data.question, id: oldQuestion.id } : q
        );

        const newVariants = generateVariants(updatedList, config.variantCount, config.title);
        const newMatrix = calculateMatrixFromQuestions(updatedList, config.customScoreScale || config.scoreScale);
        const newSpecs = generateSpecificationsFromQuestions(updatedList);

        setExamPackage({
          ...examPackage,
          variants: newVariants,
          matrix: newMatrix,
          specifications: newSpecs,
        });
      }
    } catch (err: any) {
      alert(`Không thể tạo lại câu: ${err.message}`);
    }
  };

  // Delete question
  const handleDeleteQuestion = (qId: string) => {
    if (!examPackage) return;
    const currentQuestions = examPackage.variants[activeVariantIndex].questions;
    if (currentQuestions.length <= 1) {
      alert('Đề kiểm tra cần có ít nhất 1 câu hỏi.');
      return;
    }

    const updated = currentQuestions.filter(q => q.id !== qId);
    // Re-index IDs
    updated.forEach((q, idx) => {
      q.id = `Q${String(idx + 1).padStart(2, '0')}`;
    });

    const newVariants = generateVariants(updated, config.variantCount, config.title);
    const newMatrix = calculateMatrixFromQuestions(updated, config.customScoreScale || config.scoreScale);
    const newSpecs = generateSpecificationsFromQuestions(updated);

    setExamPackage({
      ...examPackage,
      variants: newVariants,
      matrix: newMatrix,
      specifications: newSpecs,
    });
  };

  // Save question to Bank
  const handleSaveToBank = (q: Question) => {
    const exists = bankQuestions.some(item => item.id === q.id || item.question === q.question);
    if (!exists) {
      setBankQuestions(prev => [
        { ...q, id: `BANK-${Date.now()}-${Math.random().toString(36).substring(2, 6)}` },
        ...prev,
      ]);
      alert('Đã lưu câu hỏi vào Ngân hàng câu hỏi thành công!');
    } else {
      alert('Câu hỏi này đã có trong Ngân hàng.');
    }
  };

  // Add question from Bank to Exam
  const handleAddQuestionFromBank = (q: Question) => {
    if (!examPackage) {
      // Add to config teacher questions if no exam yet
      setConfig(prev => ({
        ...prev,
        teacherQuestions: [...prev.teacherQuestions, q],
      }));
      return;
    }

    const currentQuestions = examPackage.variants[activeVariantIndex].questions;
    const newQ: Question = {
      ...q,
      id: `Q${String(currentQuestions.length + 1).padStart(2, '0')}`,
    };
    const updated = [...currentQuestions, newQ];
    const newVariants = generateVariants(updated, config.variantCount, config.title);
    const newMatrix = calculateMatrixFromQuestions(updated, config.customScoreScale || config.scoreScale);
    const newSpecs = generateSpecificationsFromQuestions(updated);

    setExamPackage({
      ...examPackage,
      variants: newVariants,
      matrix: newMatrix,
      specifications: newSpecs,
    });
  };

  // Add new blank question
  const handleAddNewQuestion = () => {
    if (!examPackage) return;
    const currentQuestions = examPackage.variants[activeVariantIndex].questions;
    const newQ: Question = {
      id: `Q${String(currentQuestions.length + 1).padStart(2, '0')}`,
      subject: config.subject,
      grade: config.grade,
      topic: config.topic || 'Toán học',
      questionType: 'multiple_choice',
      level: 'thong_hieu',
      question: 'Cho hàm số $y = f(x)$. Khẳng định nào sau đây là đúng?',
      options: ['A. $f\'(x) > 0$', 'B. $f\'(x) < 0$', 'C. $f\'(x) = 0$', 'D. Không xác định'],
      correctAnswer: 'A',
      explanation: 'Lời giải chi tiết.',
      score: 0.25,
      learningOutcome: 'Nhận biết kiến thức cơ bản',
    };
    setEditingQuestion(newQ);
  };

  // Save edited question
  const handleSaveEditedQuestion = (updatedQ: Question) => {
    if (!examPackage) return;
    const currentQuestions = examPackage.variants[activeVariantIndex].questions;
    const exists = currentQuestions.some(q => q.id === updatedQ.id);

    let nextList: Question[] = [];
    if (exists) {
      nextList = currentQuestions.map(q => (q.id === updatedQ.id ? updatedQ : q));
    } else {
      nextList = [...currentQuestions, updatedQ];
    }

    const newVariants = generateVariants(nextList, config.variantCount, config.title);
    const newMatrix = calculateMatrixFromQuestions(nextList, config.customScoreScale || config.scoreScale);
    const newSpecs = generateSpecificationsFromQuestions(nextList);

    setExamPackage({
      ...examPackage,
      variants: newVariants,
      matrix: newMatrix,
      specifications: newSpecs,
    });
  };

  // Reset config
  const handleResetConfig = () => {
    if (confirm('Bạn có chắc chắn muốn xóa toàn bộ cấu hình và đưa về mặc định?')) {
      setConfig(DEFAULT_CONFIG);
      setExamPackage(null);
      localStorage.removeItem('math_exam_config_last');
    }
  };

  // Restore config
  const handleRestoreConfig = () => {
    try {
      const saved = localStorage.getItem('math_exam_config_last');
      if (saved) {
        setConfig(JSON.parse(saved));
        alert('Đã khôi phục cấu hình gần nhất thành công.');
      } else {
        alert('Chưa có cấu hình nào được lưu trong bộ nhớ.');
      }
    } catch {}
  };

  const currentVariant = examPackage?.variants[activeVariantIndex] || examPackage?.variants[0];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Header */}
      <Header
        onOpenQuestionBank={() => setShowQuestionBankModal(true)}
        onOpenImportMatrix={() => setShowImportMatrixModal(true)}
        onOpenQualityModal={() => setShowQualityModal(true)}
        onPrint={() => window.print()}
        onResetConfig={handleResetConfig}
        onRestoreConfig={handleRestoreConfig}
        hasExam={!!examPackage}
      />

      {/* Main App Grid */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-5 print:p-0 print:block">
        {/* LEFT COLUMN: Setup Configuration Wizard (5 cols on lg) */}
        <div className="lg:col-span-5 h-[calc(100vh-6rem)] sticky top-20 print:hidden flex flex-col">
          <ConfigWizard
            config={config}
            onChange={setConfig}
            onGenerateExam={handleGenerateExam}
            onGenerateMatrixOnly={handleGenerateMatrixOnly}
            onGenerateEquivalent={handleGenerateEquivalent}
            hasExam={!!examPackage}
            isGenerating={isGenerating}
            generationStep={generationStep}
          />
        </div>

        {/* RIGHT COLUMN: Exam Output & 5 Result Tabs (7 cols on lg) */}
        <div className="lg:col-span-7 flex flex-col space-y-4 print:w-full print:block">
          {/* Success Banner Notice */}
          {generationSuccessNotice && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-xs text-emerald-900 shadow-xs print:hidden animate-fade-in">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span className="font-bold">
                  Đề đã được tạo và kiểm tra thành công theo chuẩn GDPT 2018!
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowQualityModal(true)}
                className="underline font-semibold hover:text-emerald-700"
              >
                Xem 12 tiêu chí kiểm định
              </button>
            </div>
          )}

          {/* 5 Result Tabs */}
          {examPackage ? (
            <div className="space-y-4">
              {/* Tab Selector Navigation Bar */}
              <div className="bg-white p-1.5 rounded-2xl border border-slate-200 shadow-xs flex items-center space-x-1 overflow-x-auto scrollbar-none print:hidden">
                <button
                  type="button"
                  onClick={() => setActiveTab('exam')}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                    activeTab === 'exam'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>TAB 1 – ĐỀ KIỂM TRA</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('answers')}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                    activeTab === 'answers'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>TAB 2 – ĐÁP ÁN</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('rubric')}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                    activeTab === 'rubric'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>TAB 3 – HƯỚNG DẪN CHẤM</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('matrix')}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                    activeTab === 'matrix'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>TAB 4 – MA TRẬN</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('specifications')}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                    activeTab === 'specifications'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <FileCheck className="w-3.5 h-3.5" />
                  <span>TAB 5 – BẢN ĐẶC TẢ</span>
                </button>
              </div>

              {/* TAB 1: ĐỀ KIỂM TRA */}
              {activeTab === 'exam' && currentVariant && (
                <ExamViewer
                  variant={currentVariant}
                  pkg={examPackage}
                  onRegenerateQuestion={handleRegenerateQuestion}
                  onEditQuestion={q => setEditingQuestion(q)}
                  onDeleteQuestion={handleDeleteQuestion}
                  onSaveToBank={handleSaveToBank}
                  onAddNewQuestion={handleAddNewQuestion}
                  onCopyExam={() => {
                    const ok = copyExamToClipboard(currentVariant, examPackage);
                    if (ok) alert('Đã sao chép đề kiểm tra vào bộ nhớ tạm!');
                  }}
                  onDownloadDoc={() => downloadAsWordDoc(currentVariant, examPackage)}
                  onPrint={() => window.print()}
                />
              )}

              {/* TAB 2: ĐÁP ÁN */}
              {activeTab === 'answers' && (
                <AnswerKeyViewer
                  pkg={examPackage}
                  activeVariantIndex={activeVariantIndex}
                  onSelectVariant={setActiveVariantIndex}
                />
              )}

              {/* TAB 3: HƯỚNG DẪN CHẤM */}
              {activeTab === 'rubric' && (
                <RubricViewer pkg={examPackage} />
              )}

              {/* TAB 4: MA TRẬN */}
              {activeTab === 'matrix' && (
                <MatrixViewer matrix={examPackage.matrix} config={config} />
              )}

              {/* TAB 5: BẢN ĐẶC TẢ */}
              {activeTab === 'specifications' && (
                <SpecificationViewer
                  specifications={examPackage.specifications}
                  config={config}
                />
              )}
            </div>
          ) : (
            /* Welcome / Empty State */
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-8 sm:p-12 text-center flex flex-col items-center justify-center min-h-[500px] space-y-5">
              <div className="w-16 h-16 rounded-3xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shadow-inner">
                <BookOpen className="w-8 h-8" />
              </div>
              <div className="max-w-md space-y-2">
                <h3 className="text-lg font-bold text-slate-900">
                  Sẵn sàng tạo đề kiểm tra Toán THPT
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Thiết lập lớp học, chủ đề kiến thức hoặc tải tài liệu tham chiếu ở cột bên trái.
                  Bấm <strong>“TẠO ĐỀ KIỂM TRA”</strong> để AI tạo ma trận, đặc tả, đề thi và đáp án chuẩn sư phạm.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleGenerateExam}
                  disabled={isGenerating}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 transition flex items-center space-x-1.5"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>TẠO ĐỀ MẪU NGAY</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowImportMatrixModal(true)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
                >
                  Tải ma trận có sẵn
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* MODALS */}
      {showQualityModal && (
        <QualityModal
          checks={examPackage?.qualityChecks || []}
          isOpen={showQualityModal}
          onClose={() => setShowQualityModal(false)}
        />
      )}

      {showQuestionBankModal && (
        <QuestionBankModal
          isOpen={showQuestionBankModal}
          onClose={() => setShowQuestionBankModal(false)}
          bankQuestions={bankQuestions}
          onAddQuestionToExam={handleAddQuestionFromBank}
          onDeleteQuestionFromBank={id => setBankQuestions(prev => prev.filter(q => q.id !== id))}
          onDuplicateQuestionInBank={q => {
            const copyQ = {
              ...q,
              id: `BANK-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
              question: `${q.question} (Bản sao)`,
            };
            setBankQuestions(prev => [copyQ, ...prev]);
          }}
          onEditBankQuestion={q => {
            setEditingQuestion(q);
          }}
        />
      )}

      {showImportMatrixModal && (
        <ImportMatrixModal
          isOpen={showImportMatrixModal}
          onClose={() => setShowImportMatrixModal(false)}
          onApplyParsedConfig={parsed => {
            setConfig(prev => ({
              ...prev,
              ...parsed,
            }));
            alert('Đã áp dụng cấu hình ma trận thành công! Thầy/cô có thể bấm TẠO ĐỀ KIỂM TRA ngay.');
          }}
        />
      )}

      {editingQuestion && (
        <EditQuestionModal
          question={editingQuestion}
          isOpen={!!editingQuestion}
          onClose={() => setEditingQuestion(null)}
          onSave={handleSaveEditedQuestion}
        />
      )}
    </div>
  );
}
