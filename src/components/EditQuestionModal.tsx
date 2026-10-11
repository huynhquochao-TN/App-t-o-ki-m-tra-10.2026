import React, { useState } from 'react';
import { Edit3, X, Check, Plus, Trash2 } from 'lucide-react';
import { Question, CognitiveLevel, QuestionCategory } from '../types';

interface EditQuestionModalProps {
  question: Question | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedQuestion: Question) => void;
}

export const EditQuestionModal: React.FC<EditQuestionModalProps> = ({
  question,
  isOpen,
  onClose,
  onSave,
}) => {
  if (!isOpen || !question) return null;

  const [formData, setFormData] = useState<Question>({ ...question });

  const handleOptionChange = (idx: number, val: string) => {
    const opts = [...(formData.options || [])];
    opts[idx] = val;
    setFormData({ ...formData, options: opts });
  };

  const handleSubItemChange = (idx: number, text: string, isCorrect: boolean) => {
    const subs = [...(formData.subItems || [])];
    subs[idx] = { ...subs[idx], text, isCorrect };
    setFormData({ ...formData, subItems: subs });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <Edit3 className="w-5 h-5 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Chỉnh sửa câu hỏi ({formData.id})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto space-y-4 py-3 text-xs pr-1">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Mức độ nhận thức</label>
              <select
                value={formData.level}
                onChange={e => setFormData({ ...formData, level: e.target.value as CognitiveLevel })}
                className="w-full p-2 bg-slate-50 rounded-lg border border-slate-200 font-medium"
              >
                <option value="nhan_biet">Nhận biết</option>
                <option value="thong_hieu">Thông hiểu</option>
                <option value="van_dung">Vận dụng</option>
                <option value="van_dung_cao">Vận dụng cao</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Điểm số</label>
              <input
                type="number"
                step="0.05"
                value={formData.score}
                onChange={e => setFormData({ ...formData, score: parseFloat(e.target.value) || 0 })}
                className="w-full p-2 bg-slate-50 rounded-lg border border-slate-200 font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Nội dung câu hỏi (sử dụng công thức LaTeX trong $...$)
            </label>
            <textarea
              rows={4}
              value={formData.question}
              onChange={e => setFormData({ ...formData, question: e.target.value })}
              className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 font-mono text-xs focus:bg-white leading-relaxed"
            />
          </div>

          {/* Options if Multiple Choice */}
          {formData.questionType === 'multiple_choice' && formData.options && (
            <div className="space-y-2">
              <label className="block font-semibold text-slate-700">Các phương án lựa chọn:</label>
              {formData.options.map((opt, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  <span className="font-bold text-slate-700 w-6 text-center">
                    {['A', 'B', 'C', 'D'][idx] || idx + 1}.
                  </span>
                  <input
                    type="text"
                    value={opt}
                    onChange={e => handleOptionChange(idx, e.target.value)}
                    className="flex-1 p-2 bg-slate-50 rounded-lg border border-slate-200 focus:bg-white"
                  />
                </div>
              ))}
            </div>
          )}

          {/* SubItems if True/False */}
          {formData.questionType === 'true_false' && formData.subItems && (
            <div className="space-y-2">
              <label className="block font-semibold text-slate-700">Các ý xét tính Đúng/Sai:</label>
              {formData.subItems.map((sub, idx) => (
                <div key={idx} className="flex items-center space-x-2 p-2 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="font-bold text-slate-700 w-5">{sub.id})</span>
                  <input
                    type="text"
                    value={sub.text}
                    onChange={e => handleSubItemChange(idx, e.target.value, sub.isCorrect)}
                    className="flex-1 p-1.5 bg-white rounded border border-slate-200"
                  />
                  <button
                    type="button"
                    onClick={() => handleSubItemChange(idx, sub.text, !sub.isCorrect)}
                    className={`px-2.5 py-1 rounded text-xs font-bold transition ${
                      sub.isCorrect ? 'bg-emerald-600 text-white' : 'bg-red-500 text-white'
                    }`}
                  >
                    {sub.isCorrect ? 'ĐÚNG' : 'SAI'}
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Đáp án đúng</label>
              <input
                type="text"
                value={formData.correctAnswer}
                onChange={e => setFormData({ ...formData, correctAnswer: e.target.value })}
                className="w-full p-2 bg-slate-50 rounded-lg border border-slate-200 font-bold"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Yêu cầu cần đạt</label>
              <input
                type="text"
                value={formData.learningOutcome}
                onChange={e => setFormData({ ...formData, learningOutcome: e.target.value })}
                className="w-full p-2 bg-slate-50 rounded-lg border border-slate-200"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Lời giải chi tiết & Bareme chấm
            </label>
            <textarea
              rows={4}
              value={formData.explanation}
              onChange={e => setFormData({ ...formData, explanation: e.target.value })}
              className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 font-mono text-xs focus:bg-white leading-relaxed"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition"
            >
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
