import React, { useState } from 'react';
import { Download, Copy, CheckCircle2 } from 'lucide-react';
import { ExamVariant, ExamPackage } from '../types';
import { MathText } from './MathText';
import { downloadAnswersAsDoc } from '../utils/exportUtils';

interface AnswerKeyViewerProps {
  pkg: ExamPackage;
  activeVariantIndex: number;
  onSelectVariant: (idx: number) => void;
}

export const AnswerKeyViewer: React.FC<AnswerKeyViewerProps> = ({
  pkg,
  activeVariantIndex,
  onSelectVariant,
}) => {
  const currentVariant = pkg.variants[activeVariantIndex] || pkg.variants[0];
  const [copied, setCopied] = useState(false);

  const handleCopyTable = () => {
    let str = `BẢNG ĐÁP ÁN - MÃ ĐỀ ${currentVariant.code}\nCâu\tĐáp án\tĐiểm\n`;
    currentVariant.answerSheet.forEach(a => {
      if (a.type === 'true_false' && a.subAnswers) {
        const sub = a.subAnswers.map(s => `${s.id}: ${s.val ? 'Đ' : 'S'}`).join('; ');
        str += `${a.questionNumber}\t${sub}\t${a.score}\n`;
      } else {
        str += `${a.questionNumber}\t${a.answer}\t${a.score}\n`;
      }
    });
    navigator.clipboard.writeText(str);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const mcAnswers = currentVariant.answerSheet.filter(a => a.type === 'multiple_choice');
  const tfAnswers = currentVariant.answerSheet.filter(a => a.type === 'true_false');
  const saAnswers = currentVariant.answerSheet.filter(a => a.type === 'short_answer');
  const essayQuestions = currentVariant.questions.filter(q => q.questionType === 'essay');

  return (
    <div className="space-y-5">
      {/* Variant Selector & Export */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold text-slate-700">Chọn Mã đề:</span>
          <div className="flex space-x-1.5">
            {pkg.variants.map((v, idx) => (
              <button
                key={v.code}
                type="button"
                onClick={() => onSelectVariant(idx)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  activeVariantIndex === idx
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Mã {v.code}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopyTable}
            className="inline-flex items-center px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
          >
            <Copy className="w-3.5 h-3.5 mr-1 text-slate-500" />
            {copied ? 'Đã sao chép!' : 'Sao chép bảng'}
          </button>
          <button
            onClick={() => downloadAnswersAsDoc(pkg)}
            className="inline-flex items-center px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition"
          >
            <Download className="w-3.5 h-3.5 mr-1" />
            Xuất Đáp án (.doc)
          </button>
        </div>
      </div>

      {/* Answer Sheet Table: Trắc nghiệm 4 lựa chọn */}
      {mcAnswers.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-3.5 bg-blue-50/70 border-b border-blue-100 flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase text-blue-900">
              Bảng đáp án Phần I – Trắc nghiệm 4 lựa chọn (Mã đề {currentVariant.code})
            </h3>
            <span className="text-[11px] text-blue-700 font-semibold">{mcAnswers.length} câu</span>
          </div>

          <div className="p-4 overflow-x-auto">
            <table className="w-full text-xs text-center border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 border-b border-slate-200 font-bold">
                  <th className="py-2 px-3 border border-slate-200">Câu</th>
                  {mcAnswers.map(a => (
                    <th key={a.questionNumber} className="py-2 px-2 border border-slate-200 min-w-8">
                      {a.questionNumber}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white font-bold text-blue-700">
                  <td className="py-2.5 px-3 border border-slate-200 bg-slate-50 text-slate-800">
                    Đáp án
                  </td>
                  {mcAnswers.map(a => (
                    <td key={a.questionNumber} className="py-2.5 px-2 border border-slate-200">
                      {a.answer}
                    </td>
                  ))}
                </tr>
                <tr className="bg-slate-50/50 text-slate-600">
                  <td className="py-2 px-3 border border-slate-200 font-medium">Điểm</td>
                  {mcAnswers.map(a => (
                    <td key={a.questionNumber} className="py-2 px-2 border border-slate-200 text-[11px]">
                      {a.score}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Answer Sheet Table: Đúng / Sai */}
      {tfAnswers.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-3.5 bg-emerald-50/70 border-b border-emerald-100 flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase text-emerald-900">
              Bảng đáp án Phần II – Trắc nghiệm Đúng / Sai (Mã đề {currentVariant.code})
            </h3>
            <span className="text-[11px] text-emerald-700 font-semibold">{tfAnswers.length} câu</span>
          </div>

          <div className="p-4 overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 border-b border-slate-200 font-bold">
                  <th className="py-2 px-3 border border-slate-200 w-16 text-center">Câu</th>
                  <th className="py-2 px-3 border border-slate-200">Ý a)</th>
                  <th className="py-2 px-3 border border-slate-200">Ý b)</th>
                  <th className="py-2 px-3 border border-slate-200">Ý c)</th>
                  <th className="py-2 px-3 border border-slate-200">Ý d)</th>
                  <th className="py-2 px-3 border border-slate-200 w-16 text-center">Điểm</th>
                </tr>
              </thead>
              <tbody>
                {tfAnswers.map(a => {
                  const subMap: Record<string, boolean> = {};
                  a.subAnswers?.forEach(s => { subMap[s.id] = s.val; });
                  return (
                    <tr key={a.questionNumber} className="border-b border-slate-200 hover:bg-slate-50">
                      <td className="py-2 px-3 border border-slate-200 text-center font-bold text-slate-900">
                        Câu {a.questionNumber}
                      </td>
                      {['a', 'b', 'c', 'd'].map(letter => {
                        const isTrue = subMap[letter] ?? true;
                        return (
                          <td key={letter} className="py-2 px-3 border border-slate-200">
                            <span className={`inline-block px-2 py-0.5 rounded font-bold text-[11px] ${
                              isTrue ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {letter}) {isTrue ? 'Đúng' : 'Sai'}
                            </span>
                          </td>
                        );
                      })}
                      <td className="py-2 px-3 border border-slate-200 text-center font-semibold text-slate-700">
                        {a.score}đ
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Answer Sheet Table: Trả lời ngắn */}
      {saAnswers.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-3.5 bg-amber-50/70 border-b border-amber-100 flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase text-amber-900">
              Bảng đáp án Phần III – Trả lời ngắn (Mã đề {currentVariant.code})
            </h3>
            <span className="text-[11px] text-amber-700 font-semibold">{saAnswers.length} câu</span>
          </div>

          <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {saAnswers.map(a => (
              <div key={a.questionNumber} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <span className="font-bold text-slate-800 block mb-1">Câu {a.questionNumber} ({a.score}đ):</span>
                <div className="font-mono font-bold text-amber-700 bg-white p-1.5 rounded border border-amber-200 text-center">
                  <MathText content={a.answer} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lời giải chi tiết từng câu */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 border-b pb-2 flex items-center">
          <CheckCircle2 className="w-4 h-4 text-blue-600 mr-2" />
          Lời giải & Hướng dẫn chi tiết từng câu (Mã đề {currentVariant.code})
        </h3>

        <div className="space-y-4">
          {currentVariant.questions.map((q, idx) => (
            <div key={q.id || idx} className="p-4 rounded-xl bg-slate-50/70 border border-slate-200 space-y-2 text-xs sm:text-sm">
              <div className="flex items-center justify-between font-bold text-slate-900 border-b border-slate-200 pb-1.5">
                <span>Câu {idx + 1} ({q.score}đ) - {q.topic}</span>
                <span className="text-blue-700">Đáp án: {q.correctAnswer}</span>
              </div>
              <div className="text-slate-700 text-xs italic">
                <MathText content={q.question} />
              </div>
              <div className="p-3 bg-white rounded-lg border border-slate-200/80 leading-relaxed text-slate-800">
                <span className="font-bold text-blue-800 block mb-1">Lời giải chi tiết:</span>
                <MathText content={q.explanation || 'Đang cập nhật lời giải'} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
