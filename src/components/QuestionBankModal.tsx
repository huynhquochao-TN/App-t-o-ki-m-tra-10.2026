import React, { useState } from 'react';
import { Database, Plus, Trash2, Copy, Edit3, X, Check, Search, Filter } from 'lucide-react';
import { Question, CognitiveLevel } from '../types';
import { MathText } from './MathText';

interface QuestionBankModalProps {
  isOpen: boolean;
  onClose: () => void;
  bankQuestions: Question[];
  onAddQuestionToExam: (q: Question) => void;
  onDeleteQuestionFromBank: (qId: string) => void;
  onDuplicateQuestionInBank: (q: Question) => void;
  onEditBankQuestion: (q: Question) => void;
}

export const QuestionBankModal: React.FC<QuestionBankModalProps> = ({
  isOpen,
  onClose,
  bankQuestions,
  onAddQuestionToExam,
  onDeleteQuestionFromBank,
  onDuplicateQuestionInBank,
  onEditBankQuestion,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGrade, setFilterGrade] = useState('ALL');
  const [filterLevel, setFilterLevel] = useState('ALL');
  const [filterType, setFilterType] = useState('ALL');
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

  if (!isOpen) return null;

  const filtered = bankQuestions.filter(q => {
    if (searchTerm) {
      const match =
        q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.topic?.toLowerCase().includes(searchTerm.toLowerCase());
      if (!match) return false;
    }
    if (filterGrade !== 'ALL' && q.grade !== filterGrade) return false;
    if (filterLevel !== 'ALL' && q.level !== filterLevel) return false;
    if (filterType !== 'ALL' && q.questionType !== filterType) return false;
    return true;
  });

  const handleAdd = (q: Question) => {
    onAddQuestionToExam(q);
    setAddedIds(prev => new Set([...prev, q.id]));
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-4xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                NGÂN HÀNG CÂU HỎI TOÁN THPT
              </h3>
              <p className="text-xs text-slate-500">
                Lưu trữ, lọc, chỉnh sửa, nhân bản và tái sử dụng câu hỏi ({bankQuestions.length} câu)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Toolbar */}
        <div className="my-4 grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
          <div className="relative sm:col-span-1">
            <Search className="w-4 h-4 absolute left-2.5 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm nội dung..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-2 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:outline-none"
            />
          </div>

          <select
            value={filterGrade}
            onChange={e => setFilterGrade(e.target.value)}
            className="p-2 bg-slate-50 rounded-xl border border-slate-200"
          >
            <option value="ALL">Tất cả các lớp</option>
            <option value="Toán 10">Toán 10</option>
            <option value="Toán 11">Toán 11</option>
            <option value="Toán 12">Toán 12</option>
          </select>

          <select
            value={filterLevel}
            onChange={e => setFilterLevel(e.target.value)}
            className="p-2 bg-slate-50 rounded-xl border border-slate-200"
          >
            <option value="ALL">Tất cả mức độ</option>
            <option value="nhan_biet">Nhận biết</option>
            <option value="thong_hieu">Thông hiểu</option>
            <option value="van_dung">Vận dụng</option>
            <option value="van_dung_cao">Vận dụng cao</option>
          </select>

          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            className="p-2 bg-slate-50 rounded-xl border border-slate-200"
          >
            <option value="ALL">Tất cả dạng câu</option>
            <option value="multiple_choice">Trắc nghiệm 4 lựa chọn</option>
            <option value="true_false">Đúng / Sai</option>
            <option value="short_answer">Trả lời ngắn</option>
            <option value="essay">Tự luận</option>
          </select>
        </div>

        {/* Question List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              Chưa có câu hỏi nào trong ngân hàng phù hợp bộ lọc.
            </div>
          ) : (
            filtered.map((q, idx) => {
              const isAdded = addedIds.has(q.id);
              return (
                <div
                  key={q.id || idx}
                  className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-blue-300 transition space-y-2 shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-900">{q.grade}</span>
                      <span className="text-slate-400">•</span>
                      <span className="font-medium text-slate-700">{q.topic}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium">
                        {q.level}
                      </span>
                      <span className="text-blue-700 font-semibold">{q.score}đ</span>
                    </div>

                    <div className="flex items-center space-x-1.5">
                      <button
                        onClick={() => handleAdd(q)}
                        disabled={isAdded}
                        className={`inline-flex items-center px-2.5 py-1 rounded-lg font-semibold transition ${
                          isAdded
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-3.5 h-3.5 mr-1" /> Đã thêm
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5 mr-1" /> Thêm vào đề
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => onDuplicateQuestionInBank(q)}
                        title="Nhân bản câu này"
                        className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onEditBankQuestion(q)}
                        title="Chỉnh sửa câu"
                        className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onDeleteQuestionFromBank(q.id)}
                        title="Xóa khỏi ngân hàng"
                        className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="text-slate-900 leading-relaxed">
                    <MathText content={q.question} />
                  </div>

                  {q.options && (
                    <div className="grid grid-cols-2 gap-1.5 text-slate-700 pl-2">
                      {q.options.map((opt, oIdx) => (
                        <div key={oIdx}>
                          <MathText content={opt} />
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded-lg">
                    <strong className="text-slate-700">Đáp án:</strong> {q.correctAnswer}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
