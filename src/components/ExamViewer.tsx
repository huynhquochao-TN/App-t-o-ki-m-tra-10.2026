import React from 'react';
import {
  RotateCcw,
  Edit3,
  Trash2,
  BookmarkPlus,
  AlertCircle,
  Plus,
  Copy,
  Download,
  CheckCircle,
  Clock,
  Printer
} from 'lucide-react';
import { ExamVariant, Question, ExamPackage, CognitiveLevel } from '../types';
import { MathText } from './MathText';

interface ExamViewerProps {
  variant: ExamVariant;
  pkg: ExamPackage;
  onRegenerateQuestion: (q: Question) => void;
  onEditQuestion: (q: Question) => void;
  onDeleteQuestion: (qId: string) => void;
  onSaveToBank: (q: Question) => void;
  onAddNewQuestion: () => void;
  onCopyExam: () => void;
  onDownloadDoc: () => void;
  onPrint: () => void;
}

export const ExamViewer: React.FC<ExamViewerProps> = ({
  variant,
  pkg,
  onRegenerateQuestion,
  onEditQuestion,
  onDeleteQuestion,
  onSaveToBank,
  onAddNewQuestion,
  onCopyExam,
  onDownloadDoc,
  onPrint,
}) => {
  const config = pkg.config;
  const questions = variant.questions;

  // Group questions by category
  const mcQuestions = questions.filter(q => q.questionType === 'multiple_choice');
  const tfQuestions = questions.filter(q => q.questionType === 'true_false');
  const saQuestions = questions.filter(q => q.questionType === 'short_answer');
  const essayQuestions = questions.filter(q => q.questionType === 'essay');
  const otherQuestions = questions.filter(
    q => !['multiple_choice', 'true_false', 'short_answer', 'essay'].includes(q.questionType)
  );

  let currentQuestionIndex = 0;

  const renderLevelBadge = (level: CognitiveLevel) => {
    switch (level) {
      case 'nhan_biet':
        return <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-medium">NB</span>;
      case 'thong_hieu':
        return <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-medium">TH</span>;
      case 'van_dung':
        return <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 font-medium">VD</span>;
      case 'van_dung_cao':
        return <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 font-medium">VDC</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {/* Top action bar inside preview */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200 print:hidden text-xs">
        <div className="flex items-center space-x-2">
          <span className="font-semibold text-slate-700">Mã đề:</span>
          <span className="px-2.5 py-1 bg-blue-600 text-white font-bold rounded-lg">
            {variant.code}
          </span>
          <span className="text-slate-500">({questions.length} câu - {pkg.matrix.grandTotalScore} điểm)</span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onCopyExam}
            title="Sao chép đề thi"
            className="inline-flex items-center px-2.5 py-1.5 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-100 transition"
          >
            <Copy className="w-3.5 h-3.5 mr-1 text-slate-500" />
            Sao chép
          </button>
          <button
            onClick={onDownloadDoc}
            title="Xuất file Word (.doc)"
            className="inline-flex items-center px-2.5 py-1.5 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-100 transition"
          >
            <Download className="w-3.5 h-3.5 mr-1 text-blue-600" />
            Xuất Word
          </button>
          <button
            onClick={onPrint}
            title="In đề thi khổ A4"
            className="inline-flex items-center px-2.5 py-1.5 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg hover:bg-blue-100 transition"
          >
            <Printer className="w-3.5 h-3.5 mr-1 text-blue-600" />
            In đề
          </button>
        </div>
      </div>

      {/* A4 Paper Container */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 sm:p-10 font-sans print:border-none print:shadow-none print:p-0">
        {/* Header Bộ GD&ĐT */}
        <div className="grid grid-cols-2 gap-4 pb-4 border-b-2 border-slate-900 mb-6 text-center text-xs sm:text-sm">
          <div>
            <p className="font-semibold uppercase tracking-wider text-slate-800">
              SỞ GIÁO DỤC VÀ ĐÀO TẠO
            </p>
            <p className="font-bold uppercase text-slate-900 text-xs sm:text-base">
              {config.schoolName || 'TRƯỜNG THPT .........................'}
            </p>
            <div className="w-20 h-0.5 bg-slate-400 mx-auto mt-1" />
            <p className="text-[11px] text-slate-600 mt-2 font-mono">
              (Đề thi gồm có {Math.ceil(questions.length / 8) || 1} trang)
            </p>
          </div>

          <div>
            <p className="font-bold uppercase text-slate-900 text-xs sm:text-base">
              {config.title || 'ĐỀ KIỂM TRA MÔN TOÁN'}
            </p>
            <p className="font-semibold text-slate-800 text-xs">
              Môn: {config.subject || 'Toán học'} – Lớp: {config.grade === 'Khác' ? config.customGrade : config.grade}
            </p>
            <p className="text-[11px] text-slate-600 italic">
              Thời gian làm bài: {config.durationMinutes} phút (Không kể thời gian phát đề)
            </p>
            <div className="inline-block mt-2 px-3 py-0.5 border border-slate-900 font-bold text-xs uppercase">
              MÃ ĐỀ: {variant.code}
            </div>
          </div>
        </div>

        {/* Student info box */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-4 mb-6 border-b border-dashed border-slate-300 text-xs italic text-slate-700">
          <div>
            Họ và tên thí sinh: ............................................................................
          </div>
          <div>
            Số báo danh: ....................................................................................
          </div>
        </div>

        {/* SECTION 1: Multiple choice */}
        {mcQuestions.length > 0 && (
          <div className="mb-8 space-y-4">
            <div className="bg-slate-100/70 p-2.5 rounded-lg border-l-4 border-blue-600">
              <h3 className="text-xs sm:text-sm font-bold uppercase text-slate-900">
                PHẦN I. Câu trắc nghiệm nhiều phương án lựa chọn
              </h3>
              <p className="text-[11px] text-slate-600 italic">
                Thí sinh trả lời từ câu 1 đến câu {mcQuestions.length}. Mỗi câu hỏi thí sinh chỉ chọn một phương án.
                (Tổng {mcQuestions.reduce((s, q) => s + q.score, 0)} điểm)
              </p>
            </div>

            <div className="space-y-5">
              {mcQuestions.map(q => {
                currentQuestionIndex++;
                const qNum = currentQuestionIndex;
                return (
                  <div
                    key={q.id}
                    className="p-3.5 rounded-xl border border-slate-200 hover:border-blue-300 transition group relative bg-white"
                  >
                    {/* Header item with badges & tools */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center space-x-1.5">
                        <span className="font-bold text-sm text-slate-900">
                          Câu {qNum}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">
                          ({q.score}đ)
                        </span>
                        {renderLevelBadge(q.level)}
                        {q.needsTeacherReview && (
                          <span
                            title="Cần giáo viên kiểm tra lại tính logic toán học"
                            className="inline-flex items-center px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-semibold"
                          >
                            <AlertCircle className="w-3 h-3 mr-0.5 text-amber-600" />
                            Cần kiểm tra
                          </span>
                        )}
                        {q.teacherProvided && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                            Giáo viên tự nhập
                          </span>
                        )}
                      </div>

                      {/* Action buttons on question */}
                      <div className="flex items-center space-x-1 print:hidden opacity-80 group-hover:opacity-100 transition">
                        <button
                          type="button"
                          onClick={() => onRegenerateQuestion(q)}
                          title="Tạo lại riêng câu này với bài toán mới"
                          className="p-1 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onEditQuestion(q)}
                          title="Chỉnh sửa nội dung câu hỏi"
                          className="p-1 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onSaveToBank(q)}
                          title="Lưu câu này vào Ngân hàng câu hỏi"
                          className="p-1 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded"
                        >
                          <BookmarkPlus className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteQuestion(q.id)}
                          title="Xóa câu hỏi này khỏi đề"
                          className="p-1 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Question text */}
                    <div className="text-xs sm:text-sm text-slate-900 leading-relaxed mb-3">
                      <MathText content={q.question} />
                    </div>

                    {/* Options A, B, C, D */}
                    {q.options && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-slate-800">
                        {q.options.map((opt, optIdx) => (
                          <div
                            key={optIdx}
                            className="p-2 rounded-lg bg-slate-50/70 border border-slate-200/80 hover:bg-blue-50/40 transition"
                          >
                            <MathText content={opt} />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SECTION 2: True/False */}
        {tfQuestions.length > 0 && (
          <div className="mb-8 space-y-4">
            <div className="bg-slate-100/70 p-2.5 rounded-lg border-l-4 border-emerald-600">
              <h3 className="text-xs sm:text-sm font-bold uppercase text-slate-900">
                PHẦN II. Câu trắc nghiệm đúng sai
              </h3>
              <p className="text-[11px] text-slate-600 italic">
                Thí sinh trả lời từ câu {currentQuestionIndex + 1} đến câu{' '}
                {currentQuestionIndex + tfQuestions.length}. Trong mỗi ý a), b), c), d) ở mỗi câu, thí sinh chọn đúng hoặc sai.
                (Tổng {tfQuestions.reduce((s, q) => s + q.score, 0)} điểm)
              </p>
            </div>

            <div className="space-y-5">
              {tfQuestions.map(q => {
                currentQuestionIndex++;
                const qNum = currentQuestionIndex;
                return (
                  <div
                    key={q.id}
                    className="p-3.5 rounded-xl border border-slate-200 hover:border-emerald-300 transition group relative bg-white"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center space-x-1.5">
                        <span className="font-bold text-sm text-slate-900">
                          Câu {qNum}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">
                          ({q.score}đ)
                        </span>
                        {renderLevelBadge(q.level)}
                        {q.needsTeacherReview && (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-semibold">
                            <AlertCircle className="w-3 h-3 mr-0.5 text-amber-600" />
                            Cần kiểm tra
                          </span>
                        )}
                      </div>

                      <div className="flex items-center space-x-1 print:hidden opacity-80 group-hover:opacity-100 transition">
                        <button
                          type="button"
                          onClick={() => onRegenerateQuestion(q)}
                          title="Tạo lại câu này"
                          className="p-1 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onEditQuestion(q)}
                          title="Chỉnh sửa"
                          className="p-1 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onSaveToBank(q)}
                          title="Lưu vào ngân hàng"
                          className="p-1 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded"
                        >
                          <BookmarkPlus className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteQuestion(q.id)}
                          title="Xóa câu"
                          className="p-1 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="text-xs sm:text-sm text-slate-900 leading-relaxed mb-3">
                      <MathText content={q.question} />
                    </div>

                    {q.subItems && (
                      <div className="space-y-1.5 pl-2 text-xs sm:text-sm text-slate-800">
                        {q.subItems.map((sub, sIdx) => (
                          <div
                            key={sIdx}
                            className="flex items-start space-x-2 p-2 rounded-lg bg-slate-50/70 border border-slate-200/80"
                          >
                            <span className="font-bold text-slate-900">
                              {sub.id})
                            </span>
                            <div className="flex-1">
                              <MathText content={sub.text} />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SECTION 3: Short answer */}
        {saQuestions.length > 0 && (
          <div className="mb-8 space-y-4">
            <div className="bg-slate-100/70 p-2.5 rounded-lg border-l-4 border-amber-600">
              <h3 className="text-xs sm:text-sm font-bold uppercase text-slate-900">
                PHẦN III. Câu trắc nghiệm trả lời ngắn
              </h3>
              <p className="text-[11px] text-slate-600 italic">
                Thí sinh trả lời từ câu {currentQuestionIndex + 1} đến câu{' '}
                {currentQuestionIndex + saQuestions.length}. Mỗi câu hỏi điền kết quả vào ô tương ứng.
                (Tổng {saQuestions.reduce((s, q) => s + q.score, 0)} điểm)
              </p>
            </div>

            <div className="space-y-5">
              {saQuestions.map(q => {
                currentQuestionIndex++;
                const qNum = currentQuestionIndex;
                return (
                  <div
                    key={q.id}
                    className="p-3.5 rounded-xl border border-slate-200 hover:border-amber-300 transition group relative bg-white"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center space-x-1.5">
                        <span className="font-bold text-sm text-slate-900">
                          Câu {qNum}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">
                          ({q.score}đ)
                        </span>
                        {renderLevelBadge(q.level)}
                      </div>

                      <div className="flex items-center space-x-1 print:hidden opacity-80 group-hover:opacity-100 transition">
                        <button
                          type="button"
                          onClick={() => onRegenerateQuestion(q)}
                          className="p-1 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onEditQuestion(q)}
                          className="p-1 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onSaveToBank(q)}
                          className="p-1 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded"
                        >
                          <BookmarkPlus className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteQuestion(q.id)}
                          className="p-1 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="text-xs sm:text-sm text-slate-900 leading-relaxed mb-3">
                      <MathText content={q.question} />
                    </div>

                    <div className="p-2 border border-dashed border-slate-300 rounded-lg text-xs text-slate-400 italic">
                      Đáp số: ..............................................................
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SECTION 4: Essay */}
        {essayQuestions.length > 0 && (
          <div className="mb-8 space-y-4">
            <div className="bg-slate-100/70 p-2.5 rounded-lg border-l-4 border-purple-600">
              <h3 className="text-xs sm:text-sm font-bold uppercase text-slate-900">
                PHẦN IV. Tự luận
              </h3>
              <p className="text-[11px] text-slate-600 italic">
                (Tổng {essayQuestions.reduce((s, q) => s + q.score, 0)} điểm)
              </p>
            </div>

            <div className="space-y-5">
              {essayQuestions.map(q => {
                currentQuestionIndex++;
                const qNum = currentQuestionIndex;
                return (
                  <div
                    key={q.id}
                    className="p-3.5 rounded-xl border border-slate-200 hover:border-purple-300 transition group relative bg-white"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center space-x-1.5">
                        <span className="font-bold text-sm text-slate-900">
                          Câu {qNum}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">
                          ({q.score}đ)
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 font-medium">
                          {q.essaySubType || 'Giải bài tập'}
                        </span>
                        {renderLevelBadge(q.level)}
                      </div>

                      <div className="flex items-center space-x-1 print:hidden opacity-80 group-hover:opacity-100 transition">
                        <button
                          type="button"
                          onClick={() => onRegenerateQuestion(q)}
                          className="p-1 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onEditQuestion(q)}
                          className="p-1 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onSaveToBank(q)}
                          className="p-1 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded"
                        >
                          <BookmarkPlus className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteQuestion(q.id)}
                          className="p-1 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="text-xs sm:text-sm text-slate-900 leading-relaxed">
                      <MathText content={q.question} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SECTION 5: Other */}
        {otherQuestions.length > 0 && (
          <div className="mb-8 space-y-4">
            <div className="bg-slate-100/70 p-2.5 rounded-lg border-l-4 border-slate-600">
              <h3 className="text-xs sm:text-sm font-bold uppercase text-slate-900">
                PHẦN KHÁC (Ghép nối / Điền khuyết)
              </h3>
            </div>
            <div className="space-y-4">
              {otherQuestions.map(q => {
                currentQuestionIndex++;
                const qNum = currentQuestionIndex;
                return (
                  <div key={q.id} className="p-3.5 rounded-xl border border-slate-200">
                    <span className="font-bold text-sm text-slate-900 mr-2">Câu {qNum} ({q.score}đ):</span>
                    <MathText content={q.question} />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer on printed page */}
        <div className="text-center pt-8 border-t border-slate-200 text-xs text-slate-600">
          <p className="font-bold uppercase tracking-wider text-slate-700">------------------ HẾT ------------------</p>
          <p className="italic mt-1">Cán bộ coi thi không giải thích gì thêm.</p>
        </div>
      </div>

      {/* Button: Thêm câu mới */}
      <div className="flex justify-center print:hidden">
        <button
          type="button"
          onClick={onAddNewQuestion}
          className="inline-flex items-center px-4 py-2 rounded-xl text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 hover:bg-blue-100 transition shadow-xs"
        >
          <Plus className="w-4 h-4 mr-1 text-blue-600" />
          Thêm câu hỏi mới vào đề
        </button>
      </div>

      {/* Academic Safety Notice (Requirement 26) */}
      <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-3 text-center text-xs text-amber-900 print:hidden leading-relaxed">
        <strong>Lưu ý học thuật:</strong> Đề được AI hỗ trợ tạo. Giáo viên cần kiểm duyệt nội dung, đáp án và mức độ phù hợp trước khi sử dụng chính thức.
      </div>
    </div>
  );
};
