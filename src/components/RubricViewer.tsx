import React from 'react';
import { Award, CheckCircle, AlertTriangle, FileText } from 'lucide-react';
import { ExamPackage, Question } from '../types';
import { MathText } from './MathText';

interface RubricViewerProps {
  pkg: ExamPackage;
}

export const RubricViewer: React.FC<RubricViewerProps> = ({ pkg }) => {
  const variant = pkg.variants[0];
  const questions = variant.questions;

  // Generate rubric parts from questions
  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center">
            <Award className="w-5 h-5 text-blue-600 mr-2" />
            HƯỚNG DẪN CHẤM & BIỂU ĐIỂM CHI TIẾT
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Áp dụng cho kỳ thi: {pkg.config.title} - Thang điểm chuẩn: {pkg.matrix.grandTotalScore} điểm
          </p>
        </div>
        <div className="flex items-center space-x-3 text-xs">
          <div className="px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 font-bold">
            Tổng: {pkg.matrix.grandTotalScore} điểm
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 font-semibold">
            {questions.length} câu hỏi
          </div>
        </div>
      </div>

      {/* General Grading Principles */}
      <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 space-y-1.5 leading-relaxed">
        <h4 className="font-bold flex items-center text-amber-950">
          <AlertTriangle className="w-4 h-4 mr-1.5 text-amber-600" />
          NGUYÊN TẮC CHUNG KHI CHẤM THI:
        </h4>
        <ul className="list-disc list-inside space-y-1 pl-1 text-[11px] sm:text-xs">
          <li><strong>Phần trắc nghiệm:</strong> Chấm đúng đáp án đạt điểm tối đa của câu. Không trừ điểm câu sai. Với câu trắc nghiệm Đúng/Sai, thí sinh chọn đúng 1 ý đạt 0.1đ, đúng 2 ý đạt 0.25đ, đúng 3 ý đạt 0.5đ, đúng 4 ý đạt 1.0đ.</li>
          <li><strong>Phần tự luận:</strong> Chấm theo từng bước biến đổi logic. Học sinh làm theo cách khác đúng với chương trình học vẫn cho điểm tối đa tương ứng.</li>
          <li>Điểm toàn bài làm tròn đến 0.25 điểm hoặc theo quy định của nhà trường.</li>
        </ul>
      </div>

      {/* Detailed Rubric Table for Questions */}
      <div className="space-y-4">
        {questions.map((q, idx) => {
          const qNum = idx + 1;
          const isEssay = q.questionType === 'essay';
          const isTrueFalse = q.questionType === 'true_false';

          return (
            <div
              key={q.id || idx}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden"
            >
              <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-xs sm:text-sm text-slate-900">
                    Câu {qNum} ({q.score} điểm)
                  </span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-medium">
                    {q.questionType === 'multiple_choice'
                      ? 'Trắc nghiệm 4 lựa chọn'
                      : q.questionType === 'true_false'
                      ? 'Trắc nghiệm Đúng/Sai'
                      : q.questionType === 'short_answer'
                      ? 'Trả lời ngắn'
                      : `Tự luận (${q.essaySubType || 'Giải bài tập'})`}
                  </span>
                </div>
                <span className="text-xs font-bold text-blue-700">
                  {q.score}đ
                </span>
              </div>

              <div className="p-4 space-y-3 text-xs sm:text-sm">
                <div>
                  <span className="font-semibold text-slate-700 text-xs block mb-1">
                    Yêu cầu cần đạt / Nội dung câu hỏi:
                  </span>
                  <div className="p-2.5 bg-slate-50 rounded-lg text-slate-800 text-xs">
                    <MathText content={q.question} />
                  </div>
                </div>

                {/* Rubric Breakdown */}
                {isEssay ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-100 text-slate-700 border-b">
                          <th className="py-2 px-3 border border-slate-200 text-left">Nội dung yêu cầu / Bước giải</th>
                          <th className="py-2 px-3 border border-slate-200 text-center w-28">Điểm thành phần</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="py-2 px-3 border border-slate-200">
                            <strong>Bước 1:</strong> Thiết lập điều kiện xác định, công thức áp dụng hoặc đạo hàm / biến đổi phương trình.
                          </td>
                          <td className="py-2 px-3 border border-slate-200 text-center font-bold text-blue-700">
                            {Math.round((q.score * 0.35) * 100) / 100}đ
                          </td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2 px-3 border border-slate-200">
                            <strong>Bước 2:</strong> Thực hiện các phép tính đại số / giải tích / hình học, lập bảng biến thiên hoặc phương trình tọa độ.
                          </td>
                          <td className="py-2 px-3 border border-slate-200 text-center font-bold text-blue-700">
                            {Math.round((q.score * 0.45) * 100) / 100}đ
                          </td>
                        </tr>
                        <tr>
                          <td className="py-2 px-3 border border-slate-200">
                            <strong>Bước 3:</strong> Đối chiếu điều kiện, biện luận và đưa ra kết luận bài toán rõ ràng kèm đơn vị.
                          </td>
                          <td className="py-2 px-3 border border-slate-200 text-center font-bold text-blue-700">
                            {Math.round((q.score * 0.2) * 100) / 100}đ
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ) : isTrueFalse ? (
                  <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 text-xs space-y-1">
                    <p className="font-bold text-emerald-950">Quy tắc thang điểm thành phần:</p>
                    <p className="text-slate-700">- Thí sinh chọn đúng 1 ý trong 4 ý: <strong>0.1 điểm</strong></p>
                    <p className="text-slate-700">- Thí sinh chọn đúng 2 ý trong 4 ý: <strong>0.25 điểm</strong></p>
                    <p className="text-slate-700">- Thí sinh chọn đúng 3 ý trong 4 ý: <strong>0.5 điểm</strong></p>
                    <p className="text-slate-700">- Thí sinh chọn đúng cả 4 ý: <strong>1.0 điểm</strong></p>
                  </div>
                ) : (
                  <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100 text-xs flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-800">Đáp án chuẩn: </span>
                      <span className="font-bold text-blue-700">{q.correctAnswer}</span>
                    </div>
                    <span className="font-bold text-emerald-700">Điểm tối đa: {q.score}đ</span>
                  </div>
                )}

                {/* Explanation / Solution */}
                <div className="text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-800 block mb-1">Hướng dẫn giải / Bareme chi tiết:</span>
                  <div className="text-slate-700 leading-relaxed">
                    <MathText content={q.explanation || 'Theo chuẩn đáp án.'} />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
