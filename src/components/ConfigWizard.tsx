import React, { useState } from 'react';
import {
  BookOpen,
  Calendar,
  Layers,
  FileCheck,
  Percent,
  Sliders,
  Upload,
  AlertTriangle,
  Sparkles,
  Plus,
  Trash2,
  FileText,
  CheckCircle2,
  HelpCircle,
  Clock,
  Shuffle
} from 'lucide-react';
import { ExamConfig, ExamType, EssaySubType, CognitiveLevel, Question } from '../types';
import { VIETNAMESE_MATH_CURRICULUM } from '../data/curriculumData';

interface ConfigWizardProps {
  config: ExamConfig;
  onChange: (newConfig: ExamConfig) => void;
  onGenerateExam: () => void;
  onGenerateMatrixOnly: () => void;
  onGenerateEquivalent?: () => void;
  hasExam: boolean;
  isGenerating: boolean;
  generationStep: string;
}

export const ConfigWizard: React.FC<ConfigWizardProps> = ({
  config,
  onChange,
  onGenerateExam,
  onGenerateMatrixOnly,
  onGenerateEquivalent,
  hasExam,
  isGenerating,
  generationStep,
}) => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [showAddTeacherQuestionModal, setShowAddTeacherQuestionModal] = useState<boolean>(false);
  const [newTeacherQ, setNewTeacherQ] = useState<Partial<Question>>({
    questionType: 'multiple_choice',
    level: 'thong_hieu',
    question: '',
    options: ['A. ', 'B. ', 'C. ', 'D. '],
    correctAnswer: 'A',
    score: 0.25,
    explanation: ''
  });

  // Calculate total questions
  const totalQuestions =
    config.multipleChoiceCount +
    config.trueFalseCount +
    config.shortAnswerCount +
    config.matchingCount +
    config.fillInCount +
    config.essayCount;

  // Percentage sum check
  const totalPercent =
    config.levelPercent.nhan_biet +
    config.levelPercent.thong_hieu +
    config.levelPercent.van_dung +
    config.levelPercent.van_dung_cao;
  const isPercentValid = totalPercent === 100;

  // Handle preset selection
  const handleSelectCurriculumTopic = (chapterName: string, topicObj: { name: string; scope: string; outcomes: string }) => {
    onChange({
      ...config,
      chapter: chapterName,
      topic: topicObj.name,
      knowledgeScope: topicObj.scope,
      testedContent: topicObj.scope,
      learningOutcomes: topicObj.outcomes,
      title: `Kiểm tra ${config.grade} - ${topicObj.name}`
    });
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string || '';
        const newDoc = {
          id: `DOC-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          name: file.name,
          type: file.type || 'text/plain',
          size: file.size,
          content: content.slice(0, 50000) // Keep text sample
        };

        onChange({
          ...config,
          referenceDocuments: [...config.referenceDocuments, newDoc]
        });
      };
      reader.readAsText(file);
    });
  };

  const handleRemoveDoc = (id: string) => {
    onChange({
      ...config,
      referenceDocuments: config.referenceDocuments.filter(d => d.id !== id)
    });
  };

  // Add teacher manual question
  const handleAddTeacherQuestion = () => {
    if (!newTeacherQ.question?.trim()) return;
    const q: Question = {
      id: `TQ-${Date.now().toString().slice(-4)}`,
      subject: config.subject,
      grade: config.grade,
      topic: config.topic || 'Giáo viên tự soạn',
      questionType: newTeacherQ.questionType || 'multiple_choice',
      level: (newTeacherQ.level as CognitiveLevel) || 'thong_hieu',
      question: newTeacherQ.question || '',
      options: newTeacherQ.options || [],
      correctAnswer: newTeacherQ.correctAnswer || 'A',
      explanation: newTeacherQ.explanation || 'Giáo viên cung cấp',
      score: Number(newTeacherQ.score) || 0.25,
      learningOutcome: 'Đúng chuẩn kiến thức',
      teacherProvided: true
    };

    onChange({
      ...config,
      teacherQuestions: [...config.teacherQuestions, q]
    });
    setShowAddTeacherQuestionModal(false);
    setNewTeacherQ({
      questionType: 'multiple_choice',
      level: 'thong_hieu',
      question: '',
      options: ['A. ', 'B. ', 'C. ', 'D. '],
      correctAnswer: 'A',
      score: 0.25,
      explanation: ''
    });
  };

  const steps = [
    { num: 1, title: 'Lớp học', icon: BookOpen },
    { num: 2, title: 'Nội dung kiến thức', icon: Layers },
    { num: 3, title: 'Tài liệu tham chiếu', icon: Upload },
    { num: 4, title: 'Loại đề & Thời gian', icon: Clock },
    { num: 5, title: 'Dạng câu hỏi', icon: FileCheck },
    { num: 6, title: 'Mức độ', icon: Percent },
    { num: 7, title: 'Thang điểm & Mã đề', icon: Sliders },
  ];

  const currentGradeData = VIETNAMESE_MATH_CURRICULUM[config.grade];

  return (
    <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden flex flex-col h-full">
      {/* Wizard Step Tabs */}
      <div className="bg-slate-50 border-b border-slate-200 p-2 overflow-x-auto scrollbar-none flex items-center space-x-1">
        {steps.map(s => {
          const Icon = s.icon;
          const isActive = activeStep === s.num;
          return (
            <button
              key={s.num}
              onClick={() => setActiveStep(s.num)}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition ${
                isActive
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                isActive ? 'bg-white text-blue-600' : 'bg-slate-200 text-slate-700'
              }`}>
                {s.num}
              </span>
              <span>{s.title}</span>
            </button>
          );
        })}
      </div>

      {/* Step Contents */}
      <div className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-5">
        {/* STEP 1: CHỌN LỚP */}
        {activeStep === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Bước 1 – Chọn hoặc Nhập lớp học
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {['Toán 10', 'Toán 11', 'Toán 12', 'Khác'].map(g => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => onChange({ ...config, grade: g })}
                    className={`py-2.5 px-3 rounded-xl border text-sm font-semibold transition ${
                      config.grade === g
                        ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-xs'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {config.grade === 'Khác' && (
              <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nhập lớp tùy chỉnh (áp dụng cho mọi lớp/chuyên đề)
                </label>
                <input
                  type="text"
                  value={config.customGrade}
                  onChange={e => onChange({ ...config, customGrade: e.target.value })}
                  placeholder="Ví dụ: Lớp 12 Chuyên Toán, Lớp 11 Nâng cao, Ôn thi ĐGNL..."
                  className="w-full text-sm px-3 py-2 bg-white rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Tên trường THPT</label>
                <input
                  type="text"
                  value={config.schoolName}
                  onChange={e => onChange({ ...config, schoolName: e.target.value })}
                  placeholder="Trường THPT Chuyên / THPT..."
                  className="w-full text-sm px-3 py-2 bg-slate-50 rounded-lg border border-slate-200 focus:bg-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Phân môn</label>
                <input
                  type="text"
                  value={config.subject}
                  onChange={e => onChange({ ...config, subject: e.target.value })}
                  className="w-full text-sm px-3 py-2 bg-slate-50 rounded-lg border border-slate-200 focus:bg-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Năm học</label>
                <input
                  type="text"
                  value={config.academicYear}
                  onChange={e => onChange({ ...config, academicYear: e.target.value })}
                  className="w-full text-sm px-3 py-2 bg-slate-50 rounded-lg border border-slate-200 focus:bg-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Học kỳ</label>
                <select
                  value={config.semester}
                  onChange={e => onChange({ ...config, semester: e.target.value })}
                  className="w-full text-sm px-3 py-2 bg-slate-50 rounded-lg border border-slate-200 focus:bg-white focus:outline-none focus:border-blue-500"
                >
                  <option value="Học kỳ 1">Học kỳ 1</option>
                  <option value="Học kỳ 2">Học kỳ 2</option>
                  <option value="Cả năm">Cả năm / Ôn tập tốt nghiệp</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: NHẬP NỘI DUNG KIẾN THỨC */}
        {activeStep === 2 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Bước 2 – Nhập nội dung kiến thức
              </label>
              {currentGradeData && (
                <span className="text-[11px] text-blue-600 font-medium">
                  Có sẵn thư viện SGK {config.grade}
                </span>
              )}
            </div>

            {/* Quick Presets from 2018 curriculum */}
            {currentGradeData && (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2">
                <span className="text-xs font-semibold text-slate-700 block">
                  Chọn nhanh theo Chương & Bài chuẩn GDPT 2018:
                </span>
                <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1">
                  {currentGradeData.chapters.map(ch => (
                    <div key={ch.chapter} className="border-b border-slate-200/60 pb-1 last:border-none">
                      <span className="text-[11px] font-semibold text-slate-800 block">
                        {ch.chapter}
                      </span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {ch.topics.map(tp => (
                          <button
                            key={tp.name}
                            type="button"
                            onClick={() => handleSelectCurriculumTopic(ch.chapter, tp)}
                            className="text-[11px] px-2 py-1 bg-white border border-slate-200 rounded-md text-slate-700 hover:border-blue-500 hover:text-blue-600 text-left transition"
                          >
                            + {tp.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Tên bài / Chủ đề (*)</label>
                <input
                  type="text"
                  value={config.topic}
                  onChange={e => onChange({ ...config, topic: e.target.value })}
                  placeholder="Ví dụ: Khảo sát sự biến thiên và đồ thị hàm số"
                  className="w-full text-sm px-3 py-2 bg-slate-50 rounded-lg border border-slate-200 focus:bg-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Chương</label>
                <input
                  type="text"
                  value={config.chapter}
                  onChange={e => onChange({ ...config, chapter: e.target.value })}
                  placeholder="Ví dụ: Chương 1 - Ứng dụng đạo hàm"
                  className="w-full text-sm px-3 py-2 bg-slate-50 rounded-lg border border-slate-200 focus:bg-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Phạm vi kiến thức</label>
                <input
                  type="text"
                  value={config.knowledgeScope}
                  onChange={e => onChange({ ...config, knowledgeScope: e.target.value })}
                  placeholder="Tính đơn điệu, cực trị, GTLN-GTNN, tiệm cận..."
                  className="w-full text-sm px-3 py-2 bg-slate-50 rounded-lg border border-slate-200 focus:bg-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Nội dung cần kiểm tra</label>
                <input
                  type="text"
                  value={config.testedContent}
                  onChange={e => onChange({ ...config, testedContent: e.target.value })}
                  placeholder="Trọng tâm bài toán tham số m, bài toán thực tế..."
                  className="w-full text-sm px-3 py-2 bg-slate-50 rounded-lg border border-slate-200 focus:bg-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Yêu cầu cần đạt</label>
              <input
                type="text"
                value={config.learningOutcomes}
                onChange={e => onChange({ ...config, learningOutcomes: e.target.value })}
                placeholder="Học sinh vận dụng thành thạo định nghĩa đạo hàm, tìm cực trị..."
                className="w-full text-sm px-3 py-2 bg-slate-50 rounded-lg border border-slate-200 focus:bg-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Ghi chú riêng của giáo viên
              </label>
              <input
                type="text"
                value={config.teacherNotes}
                onChange={e => onChange({ ...config, teacherNotes: e.target.value })}
                placeholder="Ví dụ: Tránh bài toán bấm máy tính casio quá nhanh, tăng cường bài toán thực tế..."
                className="w-full text-sm px-3 py-2 bg-slate-50 rounded-lg border border-slate-200 focus:bg-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Vùng dán nội dung bài học / Giáo án / SGK
              </label>
              <textarea
                rows={4}
                value={config.rawLessonText}
                onChange={e => onChange({ ...config, rawLessonText: e.target.value })}
                placeholder="Dán toàn bộ nội dung bài học, định lí, bài tập mẫu từ sách giáo khoa hoặc kế hoạch bài dạy tại đây..."
                className="w-full text-xs font-mono p-3 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:border-blue-500 leading-relaxed"
              />
            </div>
          </div>
        )}

        {/* STEP 3: TÀI LIỆU THAM CHIẾU */}
        {activeStep === 3 && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Bước 3 – Tài liệu tham chiếu
              </label>
              <p className="text-xs text-slate-500">
                Cung cấp tài liệu (PDF, Word, TXT, Giáo án, Ma trận cũ, Đề kiểm tra cũ...). AI sẽ ưu tiên tuyệt đối nội dung tài liệu này.
              </p>
            </div>

            {/* Mode selection */}
            <div className="space-y-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <span className="text-xs font-bold text-slate-800 block">Chế độ tham chiếu dữ liệu:</span>
              <label className="flex items-start space-x-2 text-xs text-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="refMode"
                  checked={config.referenceMode === 'upload_only'}
                  onChange={() => onChange({ ...config, referenceMode: 'upload_only' })}
                  className="mt-0.5 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <span className="font-semibold text-blue-900">Chỉ sử dụng tài liệu đã cung cấp</span>
                  <p className="text-[11px] text-slate-500">
                    Tuyệt đối không tự bổ sung kiến thức bên ngoài tài liệu. Nếu thiếu dữ kiện, hệ thống sẽ cảnh báo thay vì bịa thông tin.
                  </p>
                </div>
              </label>

              <label className="flex items-start space-x-2 text-xs text-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="refMode"
                  checked={config.referenceMode === 'upload_plus_standard'}
                  onChange={() => onChange({ ...config, referenceMode: 'upload_plus_standard' })}
                  className="mt-0.5 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <span className="font-semibold text-slate-800">Tài liệu tải lên + kiến thức chương trình phổ thông</span>
                  <p className="text-[11px] text-slate-500">
                    Kết hợp tài liệu của giáo viên với chuẩn kiến thức GDPT 2018 để đề thi phong phú.
                  </p>
                </div>
              </label>

              <label className="flex items-start space-x-2 text-xs text-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="refMode"
                  checked={config.referenceMode === 'teacher_input_only'}
                  onChange={() => onChange({ ...config, referenceMode: 'teacher_input_only' })}
                  className="mt-0.5 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <span className="font-semibold text-slate-800">Giáo viên tự nhập nội dung</span>
                  <p className="text-[11px] text-slate-500">
                    Dựa vào các trường nhập liệu ở Bước 2.
                  </p>
                </div>
              </label>
            </div>

            {/* Upload Area */}
            <div className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl p-4 text-center transition bg-slate-50/50">
              <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <label className="cursor-pointer block">
                <span className="text-xs font-semibold text-blue-600 hover:underline">
                  Bấm để tải lên tài liệu
                </span>
                <span className="text-xs text-slate-500"> (PDF, Word .docx, .txt, hình ảnh giáo án)</span>
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Uploaded Documents List */}
            {config.referenceDocuments.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-slate-700 block">
                  Tài liệu đã tải ({config.referenceDocuments.length}):
                </span>
                {config.referenceDocuments.map(doc => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-2.5 bg-blue-50/50 border border-blue-100 rounded-xl text-xs"
                  >
                    <div className="flex items-center space-x-2 overflow-hidden">
                      <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                      <span className="font-medium text-slate-800 truncate">{doc.name}</span>
                      <span className="text-[10px] text-slate-500">({Math.round(doc.size / 1024)} KB)</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveDoc(doc.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* STEP 4: LOẠI ĐỀ & THỜI GIAN */}
        {activeStep === 4 && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Bước 4 – Loại đề kiểm tra & Thời gian
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  'Kiểm tra thường xuyên',
                  'Kiểm tra 15 phút',
                  'Kiểm tra giữa kỳ',
                  'Kiểm tra cuối kỳ',
                  'Đề ôn tập',
                  'Đề luyện tập',
                  'Đề khảo sát',
                  'Đề tuyển chọn học sinh',
                  'Đề tự tạo',
                ].map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => onChange({ ...config, examType: type as ExamType })}
                    className={`p-2 rounded-xl text-xs font-medium border text-left transition ${
                      config.examType === type
                        ? 'border-blue-600 bg-blue-50 text-blue-700 font-semibold'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tên đề</label>
              <input
                type="text"
                value={config.title}
                onChange={e => onChange({ ...config, title: e.target.value })}
                placeholder="ĐỀ KIỂM TRA ĐỊNH KỲ MÔN TOÁN"
                className="w-full text-sm px-3 py-2 bg-slate-50 rounded-lg border border-slate-200 focus:bg-white focus:outline-none focus:border-blue-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Thời gian làm bài:
              </label>
              <div className="flex flex-wrap gap-2">
                {[10, 15, 30, 45, 60, 90, 120].map(mins => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => onChange({ ...config, durationMinutes: mins })}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                      config.durationMinutes === mins
                        ? 'border-blue-600 bg-blue-600 text-white'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {mins} phút
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: HÌNH THỨC CÂU HỎI */}
        {activeStep === 5 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Bước 5 – Hình thức & Số lượng câu hỏi
                </label>
                <p className="text-xs text-slate-500">
                  Hệ thống tự tính tổng số câu và phân chia điểm tự động.
                </p>
              </div>
              <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold">
                Tổng: {totalQuestions} câu
              </div>
            </div>

            {/* Trắc nghiệm */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-3">
              <span className="text-xs font-bold text-slate-900 block flex items-center">
                <FileCheck className="w-4 h-4 text-blue-600 mr-1.5" />
                Dạng Trắc nghiệm (Chuẩn cấu trúc ĐGNL / Thi tốt nghiệp 2025)
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-slate-200">
                  <div>
                    <span className="font-semibold text-slate-800 block">4 lựa chọn (A/B/C/D)</span>
                    <span className="text-[11px] text-slate-400">Dạng nhiều phương án</span>
                  </div>
                  <input
                    type="number"
                    min={0}
                    max={50}
                    value={config.multipleChoiceCount}
                    onChange={e => onChange({ ...config, multipleChoiceCount: Math.max(0, parseInt(e.target.value) || 0) })}
                    className="w-14 text-center font-bold px-2 py-1 bg-slate-50 border border-slate-300 rounded-md"
                  />
                </div>

                <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-slate-200">
                  <div>
                    <span className="font-semibold text-slate-800 block">Đúng / Sai (4 ý a,b,c,d)</span>
                    <span className="text-[11px] text-slate-400">Định dạng thi mới 2025</span>
                  </div>
                  <input
                    type="number"
                    min={0}
                    max={20}
                    value={config.trueFalseCount}
                    onChange={e => onChange({ ...config, trueFalseCount: Math.max(0, parseInt(e.target.value) || 0) })}
                    className="w-14 text-center font-bold px-2 py-1 bg-slate-50 border border-slate-300 rounded-md"
                  />
                </div>

                <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-slate-200">
                  <div>
                    <span className="font-semibold text-slate-800 block">Trả lời ngắn</span>
                    <span className="text-[11px] text-slate-400">Điền số hoặc đáp số</span>
                  </div>
                  <input
                    type="number"
                    min={0}
                    max={20}
                    value={config.shortAnswerCount}
                    onChange={e => onChange({ ...config, shortAnswerCount: Math.max(0, parseInt(e.target.value) || 0) })}
                    className="w-14 text-center font-bold px-2 py-1 bg-slate-50 border border-slate-300 rounded-md"
                  />
                </div>

                <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-slate-200">
                  <div>
                    <span className="font-semibold text-slate-800 block">Ghép nối & Điền khuyết</span>
                    <span className="text-[11px] text-slate-400">Kiểm tra liên hệ</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <input
                      type="number"
                      min={0}
                      max={10}
                      value={config.matchingCount}
                      onChange={e => onChange({ ...config, matchingCount: Math.max(0, parseInt(e.target.value) || 0) })}
                      className="w-12 text-center font-bold px-1 py-1 bg-slate-50 border border-slate-300 rounded-md"
                      title="Ghép nối"
                    />
                    <span className="text-slate-400">/</span>
                    <input
                      type="number"
                      min={0}
                      max={10}
                      value={config.fillInCount}
                      onChange={e => onChange({ ...config, fillInCount: Math.max(0, parseInt(e.target.value) || 0) })}
                      className="w-12 text-center font-bold px-1 py-1 bg-slate-50 border border-slate-300 rounded-md"
                      title="Điền khuyết"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Tự luận */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 flex items-center">
                  <FileText className="w-4 h-4 text-emerald-600 mr-1.5" />
                  Dạng Tự luận
                </span>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-slate-600 font-medium">Số câu tự luận:</span>
                  <input
                    type="number"
                    min={0}
                    max={10}
                    value={config.essayCount}
                    onChange={e => onChange({ ...config, essayCount: Math.max(0, parseInt(e.target.value) || 0) })}
                    className="w-14 text-center font-bold px-2 py-1 bg-white border border-slate-300 rounded-md text-xs"
                  />
                </div>
              </div>

              {config.essayCount > 0 && (
                <div>
                  <span className="text-[11px] text-slate-500 block mb-1.5">
                    Chọn các dạng bài tự luận ưu tiên:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      'Giải bài tập',
                      'Chứng minh',
                      'Vận dụng thực tế',
                      'Giải thích',
                      'Phân tích',
                      'Trình bày',
                      'So sánh',
                      'Câu hỏi ngắn'
                    ].map(st => {
                      const isSelected = config.selectedEssaySubTypes?.includes(st as EssaySubType);
                      return (
                        <button
                          key={st}
                          type="button"
                          onClick={() => {
                            const cur = config.selectedEssaySubTypes || [];
                            const next = isSelected
                              ? cur.filter(x => x !== st)
                              : [...cur, st as EssaySubType];
                            onChange({ ...config, selectedEssaySubTypes: next });
                          }}
                          className={`text-xs px-2.5 py-1 rounded-lg border transition ${
                            isSelected
                              ? 'bg-emerald-600 text-white border-emerald-600 font-medium'
                              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          {st}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 6: PHÂN BỔ MỨC ĐỘ CÂU HỎI */}
        {activeStep === 6 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Bước 6 – Phân bổ 4 mức độ nhận thức
                </label>
                <p className="text-xs text-slate-500">
                  Theo chuẩn Bộ GD&ĐT: Nhận biết, Thông hiểu, Vận dụng, Vận dụng cao.
                </p>
              </div>
              <div className="flex items-center space-x-1 bg-slate-100 p-0.5 rounded-lg text-xs">
                <button
                  type="button"
                  onClick={() => onChange({ ...config, distributionMode: 'percentage' })}
                  className={`px-2.5 py-1 rounded-md font-medium transition ${
                    config.distributionMode === 'percentage' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Tỷ lệ %
                </button>
                <button
                  type="button"
                  onClick={() => onChange({ ...config, distributionMode: 'count' })}
                  className={`px-2.5 py-1 rounded-md font-medium transition ${
                    config.distributionMode === 'count' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Số câu
                </button>
              </div>
            </div>

            {/* Warning if percentage != 100% */}
            {config.distributionMode === 'percentage' && !isPercentValid && (
              <div className="flex items-center p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs">
                <AlertTriangle className="w-4 h-4 mr-2 shrink-0 text-amber-600" />
                <span>Tổng tỷ lệ hiện là <strong>{totalPercent}%</strong>. Tổng bắt buộc phải bằng <strong>100%</strong>.</span>
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Nhận biết */}
              <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100">
                <span className="text-xs font-bold text-blue-900 block mb-1">Nhận biết</span>
                <span className="text-[10px] text-slate-500 block mb-2">Khái niệm, nhận diện</span>
                {config.distributionMode === 'percentage' ? (
                  <div className="flex items-center space-x-1">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={config.levelPercent.nhan_biet}
                      onChange={e => onChange({
                        ...config,
                        levelPercent: { ...config.levelPercent, nhan_biet: parseInt(e.target.value) || 0 }
                      })}
                      className="w-full text-sm font-bold p-1.5 bg-white border border-blue-200 rounded-lg text-center"
                    />
                    <span className="text-xs text-slate-500">%</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-1">
                    <input
                      type="number"
                      min={0}
                      max={50}
                      value={config.levelCount.nhan_biet}
                      onChange={e => onChange({
                        ...config,
                        levelCount: { ...config.levelCount, nhan_biet: parseInt(e.target.value) || 0 }
                      })}
                      className="w-full text-sm font-bold p-1.5 bg-white border border-blue-200 rounded-lg text-center"
                    />
                    <span className="text-xs text-slate-500">câu</span>
                  </div>
                )}
              </div>

              {/* Thông hiểu */}
              <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100">
                <span className="text-xs font-bold text-emerald-900 block mb-1">Thông hiểu</span>
                <span className="text-[10px] text-slate-500 block mb-2">Áp dụng trực tiếp</span>
                {config.distributionMode === 'percentage' ? (
                  <div className="flex items-center space-x-1">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={config.levelPercent.thong_hieu}
                      onChange={e => onChange({
                        ...config,
                        levelPercent: { ...config.levelPercent, thong_hieu: parseInt(e.target.value) || 0 }
                      })}
                      className="w-full text-sm font-bold p-1.5 bg-white border border-emerald-200 rounded-lg text-center"
                    />
                    <span className="text-xs text-slate-500">%</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-1">
                    <input
                      type="number"
                      min={0}
                      max={50}
                      value={config.levelCount.thong_hieu}
                      onChange={e => onChange({
                        ...config,
                        levelCount: { ...config.levelCount, thong_hieu: parseInt(e.target.value) || 0 }
                      })}
                      className="w-full text-sm font-bold p-1.5 bg-white border border-emerald-200 rounded-lg text-center"
                    />
                    <span className="text-xs text-slate-500">câu</span>
                  </div>
                )}
              </div>

              {/* Vận dụng */}
              <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-100">
                <span className="text-xs font-bold text-amber-900 block mb-1">Vận dụng</span>
                <span className="text-[10px] text-slate-500 block mb-2">Biến đổi, tính toán</span>
                {config.distributionMode === 'percentage' ? (
                  <div className="flex items-center space-x-1">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={config.levelPercent.van_dung}
                      onChange={e => onChange({
                        ...config,
                        levelPercent: { ...config.levelPercent, van_dung: parseInt(e.target.value) || 0 }
                      })}
                      className="w-full text-sm font-bold p-1.5 bg-white border border-amber-200 rounded-lg text-center"
                    />
                    <span className="text-xs text-slate-500">%</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-1">
                    <input
                      type="number"
                      min={0}
                      max={50}
                      value={config.levelCount.van_dung}
                      onChange={e => onChange({
                        ...config,
                        levelCount: { ...config.levelCount, van_dung: parseInt(e.target.value) || 0 }
                      })}
                      className="w-full text-sm font-bold p-1.5 bg-white border border-amber-200 rounded-lg text-center"
                    />
                    <span className="text-xs text-slate-500">câu</span>
                  </div>
                )}
              </div>

              {/* Vận dụng cao */}
              <div className="p-3 bg-purple-50/50 rounded-xl border border-purple-100">
                <span className="text-xs font-bold text-purple-900 block mb-1">Vận dụng cao</span>
                <span className="text-[10px] text-slate-500 block mb-2">Cực trị, phân hóa</span>
                {config.distributionMode === 'percentage' ? (
                  <div className="flex items-center space-x-1">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={config.levelPercent.van_dung_cao}
                      onChange={e => onChange({
                        ...config,
                        levelPercent: { ...config.levelPercent, van_dung_cao: parseInt(e.target.value) || 0 }
                      })}
                      className="w-full text-sm font-bold p-1.5 bg-white border border-purple-200 rounded-lg text-center"
                    />
                    <span className="text-xs text-slate-500">%</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-1">
                    <input
                      type="number"
                      min={0}
                      max={50}
                      value={config.levelCount.van_dung_cao}
                      onChange={e => onChange({
                        ...config,
                        levelCount: { ...config.levelCount, van_dung_cao: parseInt(e.target.value) || 0 }
                      })}
                      className="w-full text-sm font-bold p-1.5 bg-white border border-purple-200 rounded-lg text-center"
                    />
                    <span className="text-xs text-slate-500">câu</span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Presets for distribution */}
            <div className="flex items-center space-x-2 pt-1 text-xs">
              <span className="text-slate-500">Mẫu phân bổ phổ biến:</span>
              <button
                type="button"
                onClick={() => onChange({
                  ...config,
                  distributionMode: 'percentage',
                  levelPercent: { nhan_biet: 40, thong_hieu: 30, van_dung: 20, van_dung_cao: 10 }
                })}
                className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700"
              >
                40-30-20-10 (Đề chuẩn)
              </button>
              <button
                type="button"
                onClick={() => onChange({
                  ...config,
                  distributionMode: 'percentage',
                  levelPercent: { nhan_biet: 30, thong_hieu: 30, van_dung: 25, van_dung_cao: 15 }
                })}
                className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700"
              >
                30-30-25-15 (Khảo sát)
              </button>
            </div>
          </div>
        )}

        {/* STEP 7: THANG ĐIỂM, MÃ ĐỀ & CÂU HỎI GIÁO VIÊN */}
        {activeStep === 7 && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Bước 7 – Thang điểm, Số mã đề & Câu hỏi tự nhập
              </label>
            </div>

            {/* Thang điểm */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
              <span className="text-xs font-bold text-slate-800 block">Thang điểm tổng:</span>
              <div className="flex items-center space-x-2">
                {[10, 20, 100].map(sc => (
                  <button
                    key={sc}
                    type="button"
                    onClick={() => onChange({ ...config, scoreScale: sc, customScoreScale: sc })}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                      (config.customScoreScale || config.scoreScale) === sc
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {sc} điểm
                  </button>
                ))}
                <div className="flex items-center space-x-1 pl-2">
                  <span className="text-xs text-slate-500">Tự nhập:</span>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={config.customScoreScale || config.scoreScale}
                    onChange={e => onChange({ ...config, customScoreScale: Number(e.target.value) || 10 })}
                    className="w-16 text-center font-bold px-2 py-1 bg-white border border-slate-300 rounded-lg text-xs"
                  />
                  <span className="text-xs text-slate-500">đ</span>
                </div>
              </div>
            </div>

            {/* Số mã đề */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Số mã đề (đảo câu, đảo đáp án):</span>
                  <span className="text-[11px] text-slate-500">
                    Hệ thống sẽ tạo tương ứng các mã đề 101, 102, 103, 104 với phiếu đáp án riêng biệt.
                  </span>
                </div>
              </div>
              <div className="flex space-x-2 pt-1">
                {[1, 2, 3, 4].map(v => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => onChange({ ...config, variantCount: v as any })}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition ${
                      config.variantCount === v
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {v} mã đề {v > 1 ? `(101 → ${100 + v})` : '(Mã 101)'}
                  </button>
                ))}
              </div>
            </div>

            {/* Chế độ nhập câu hỏi của giáo viên */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Câu hỏi do giáo viên nhập sẵn:</span>
                  <span className="text-[11px] text-slate-500">
                    Đã có {config.teacherQuestions?.length || 0} câu tự nhập.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddTeacherQuestionModal(true)}
                  className="inline-flex items-center px-2.5 py-1.5 rounded-lg text-xs font-medium text-blue-700 bg-blue-100 hover:bg-blue-200 transition"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  Thêm câu hỏi
                </button>
              </div>

              <label className="flex items-center space-x-2 text-xs text-slate-700 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={config.preserveTeacherQuestions}
                  onChange={e => onChange({ ...config, preserveTeacherQuestions: e.target.checked })}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="font-semibold text-slate-800">
                  Giữ nguyên tuyệt đối câu hỏi giáo viên đã nhập (AI không chỉnh sửa các câu này, chỉ sinh thêm câu còn thiếu)
                </span>
              </label>

              {config.teacherQuestions?.length > 0 && (
                <div className="space-y-1.5 max-h-36 overflow-y-auto">
                  {config.teacherQuestions.map((q, i) => (
                    <div key={q.id || i} className="flex items-center justify-between p-2 bg-white rounded-lg border border-slate-200 text-xs">
                      <span className="truncate max-w-[80%] font-medium text-slate-700">
                        {i + 1}. {q.question}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = config.teacherQuestions.filter((_, idx) => idx !== i);
                          onChange({ ...config, teacherQuestions: updated });
                        }}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Progress & Generation status */}
      {isGenerating && (
        <div className="bg-blue-50/80 border-t border-blue-100 p-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-blue-900 font-semibold">
            <span className="flex items-center">
              <Sparkles className="w-4 h-4 mr-1.5 text-blue-600 animate-spin" />
              {generationStep || 'Đang xử lý đề kiểm tra...'}
            </span>
          </div>
          <div className="w-full bg-blue-200/60 rounded-full h-1.5 overflow-hidden">
            <div className="bg-blue-600 h-1.5 rounded-full animate-pulse w-3/4"></div>
          </div>
        </div>
      )}

      {/* Primary Execution Buttons Footer */}
      <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center gap-2">
        <button
          type="button"
          onClick={onGenerateExam}
          disabled={isGenerating || totalQuestions === 0}
          className="w-full sm:flex-1 py-3 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-800 hover:to-blue-700 shadow-md shadow-blue-600/25 disabled:opacity-50 transition flex items-center justify-center space-x-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>TẠO ĐỀ KIỂM TRA</span>
        </button>

        <button
          type="button"
          onClick={onGenerateMatrixOnly}
          disabled={isGenerating}
          className="w-full sm:w-auto py-3 px-4 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 shadow-xs transition flex items-center justify-center space-x-1.5"
        >
          <Layers className="w-4 h-4 text-blue-600" />
          <span>TẠO MA TRẬN</span>
        </button>

        {hasExam && onGenerateEquivalent && (
          <button
            type="button"
            onClick={onGenerateEquivalent}
            disabled={isGenerating}
            title="Tạo bộ đề mới tương đương giữ nguyên cấu trúc và ma trận"
            className="w-full sm:w-auto py-3 px-3 rounded-xl text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition flex items-center justify-center space-x-1"
          >
            <Shuffle className="w-4 h-4" />
            <span className="hidden md:inline">Đề tương đương</span>
          </button>
        )}
      </div>

      {/* Modal: Thêm câu hỏi giáo viên */}
      {showAddTeacherQuestionModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 space-y-4 shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-sm font-bold text-slate-900">Thêm câu hỏi của giáo viên</h3>
              <button
                type="button"
                onClick={() => setShowAddTeacherQuestionModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Dạng câu</label>
              <select
                value={newTeacherQ.questionType}
                onChange={e => setNewTeacherQ({ ...newTeacherQ, questionType: e.target.value as any })}
                className="w-full text-xs p-2 bg-slate-50 border rounded-lg"
              >
                <option value="multiple_choice">Trắc nghiệm 4 lựa chọn (A, B, C, D)</option>
                <option value="true_false">Trắc nghiệm Đúng / Sai</option>
                <option value="short_answer">Trả lời ngắn</option>
                <option value="essay">Tự luận</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Mức độ nhận thức</label>
              <select
                value={newTeacherQ.level}
                onChange={e => setNewTeacherQ({ ...newTeacherQ, level: e.target.value as any })}
                className="w-full text-xs p-2 bg-slate-50 border rounded-lg"
              >
                <option value="nhan_biet">Nhận biết</option>
                <option value="thong_hieu">Thông hiểu</option>
                <option value="van_dung">Vận dụng</option>
                <option value="van_dung_cao">Vận dụng cao</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nội dung câu hỏi (chứa LaTeX $...$)</label>
              <textarea
                rows={3}
                value={newTeacherQ.question}
                onChange={e => setNewTeacherQ({ ...newTeacherQ, question: e.target.value })}
                placeholder="Cho hàm số $y = x^3 - 3x$... Tính..."
                className="w-full text-xs p-2.5 bg-slate-50 border rounded-lg focus:bg-white"
              />
            </div>

            {newTeacherQ.questionType === 'multiple_choice' && (
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">Các phương án (A, B, C, D)</label>
                {['A', 'B', 'C', 'D'].map((letter, idx) => (
                  <input
                    key={letter}
                    type="text"
                    value={newTeacherQ.options?.[idx] || ''}
                    onChange={e => {
                      const opts = [...(newTeacherQ.options || ['', '', '', ''])];
                      opts[idx] = e.target.value;
                      setNewTeacherQ({ ...newTeacherQ, options: opts });
                    }}
                    placeholder={`Phương án ${letter}...`}
                    className="w-full text-xs p-2 bg-slate-50 border rounded-lg"
                  />
                ))}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Đáp án đúng</label>
                <input
                  type="text"
                  value={newTeacherQ.correctAnswer}
                  onChange={e => setNewTeacherQ({ ...newTeacherQ, correctAnswer: e.target.value })}
                  placeholder="A hoặc 5 hoặc Đúng/Sai..."
                  className="w-full text-xs p-2 bg-slate-50 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Điểm số</label>
                <input
                  type="number"
                  step="0.25"
                  value={newTeacherQ.score}
                  onChange={e => setNewTeacherQ({ ...newTeacherQ, score: parseFloat(e.target.value) || 0.25 })}
                  className="w-full text-xs p-2 bg-slate-50 border rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Lời giải / Hướng dẫn chấm</label>
              <textarea
                rows={2}
                value={newTeacherQ.explanation}
                onChange={e => setNewTeacherQ({ ...newTeacherQ, explanation: e.target.value })}
                placeholder="Lời giải chi tiết từng bước..."
                className="w-full text-xs p-2.5 bg-slate-50 border rounded-lg"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddTeacherQuestionModal(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleAddTeacherQuestion}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs"
              >
                Lưu vào đề
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
