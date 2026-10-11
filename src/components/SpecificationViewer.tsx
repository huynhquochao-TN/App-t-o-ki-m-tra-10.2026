import React from 'react';
import { FileCheck, Download } from 'lucide-react';
import { SpecificationItem, ExamConfig } from '../types';

interface SpecificationViewerProps {
  specifications: SpecificationItem[];
  config: ExamConfig;
}

export const SpecificationViewer: React.FC<SpecificationViewerProps> = ({
  specifications,
  config,
}) => {
  const getLevelLabel = (lvl: string) => {
    switch (lvl) {
      case 'nhan_biet': return 'Nhận biết';
      case 'thong_hieu': return 'Thông hiểu';
      case 'van_dung': return 'Vận dụng';
      case 'van_dung_cao': return 'Vận dụng cao';
      default: return lvl;
    }
  };

  const getLevelColor = (lvl: string) => {
    switch (lvl) {
      case 'nhan_biet': return 'bg-blue-50 text-blue-700';
      case 'thong_hieu': return 'bg-emerald-50 text-emerald-700';
      case 'van_dung': return 'bg-amber-50 text-amber-700';
      case 'van_dung_cao': return 'bg-purple-50 text-purple-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const handleExportDoc = () => {
    let text = `BẢN ĐẶC TẢ MA TRẬN ĐỀ KIỂM TRA MÔN TOÁN\n`;
    text += `Môn: ${config.subject || 'Toán học'} - Lớp: ${config.grade}\n\n`;
    text += `TT | Chủ đề | Đơn vị kiến thức | Mức độ | Dạng câu hỏi | Yêu cầu cần đạt | Số câu | Số điểm\n`;
    specifications.forEach((sp, idx) => {
      text += `${idx + 1} | ${sp.topic} | ${sp.subTopic} | ${getLevelLabel(sp.level)} | ${sp.questionType} | ${sp.learningOutcome} | ${sp.count} | ${sp.score}đ\n`;
    });
    const blob = new Blob([text], { type: 'application/msword;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Ban_Dac_Ta_De_Kiem_Tra.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5">
      {/* Header Info */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center">
            <FileCheck className="w-5 h-5 text-blue-600 mr-2" />
            BẢN ĐẶC TẢ MA TRẬN ĐỀ KIỂM TRA
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Quy định chuẩn yêu cầu cần đạt, mức độ tư duy và số điểm chi tiết từng câu hỏi
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportDoc}
          className="inline-flex items-center px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-xs transition shrink-0"
        >
          <Download className="w-3.5 h-3.5 mr-1.5" />
          Xuất Bản đặc tả (.doc)
        </button>
      </div>

      {/* Specifications Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse min-w-[750px]">
            <thead>
              <tr className="bg-slate-100 text-slate-800 border-b border-slate-200 font-bold">
                <th className="py-3 px-3 border border-slate-200 w-12 text-center">Câu</th>
                <th className="py-3 px-3 border border-slate-200">Chủ đề</th>
                <th className="py-3 px-3 border border-slate-200">Đơn vị kiến thức</th>
                <th className="py-3 px-3 border border-slate-200">Mức độ</th>
                <th className="py-3 px-3 border border-slate-200">Dạng câu hỏi</th>
                <th className="py-3 px-4 border border-slate-200 min-w-[200px]">Yêu cầu cần đạt</th>
                <th className="py-3 px-2 border border-slate-200 text-center w-16">Số câu</th>
                <th className="py-3 px-2 border border-slate-200 text-center w-16">Điểm</th>
              </tr>
            </thead>
            <tbody>
              {specifications.map((spec, idx) => (
                <tr key={spec.id || idx} className="border-b border-slate-200 hover:bg-slate-50">
                  <td className="py-2.5 px-3 border border-slate-200 text-center font-bold text-slate-700">
                    {spec.questionNumbers?.join(', ') || idx + 1}
                  </td>
                  <td className="py-2.5 px-3 border border-slate-200 font-semibold text-slate-900">
                    {spec.topic}
                  </td>
                  <td className="py-2.5 px-3 border border-slate-200 text-slate-700">
                    {spec.subTopic}
                  </td>
                  <td className="py-2.5 px-3 border border-slate-200 text-center">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${getLevelColor(spec.level)}`}>
                      {getLevelLabel(spec.level)}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 border border-slate-200 text-slate-700">
                    {spec.questionType}
                  </td>
                  <td className="py-2.5 px-4 border border-slate-200 text-slate-600 leading-relaxed">
                    {spec.learningOutcome}
                  </td>
                  <td className="py-2.5 px-2 border border-slate-200 text-center font-bold text-slate-800">
                    {spec.count}
                  </td>
                  <td className="py-2.5 px-2 border border-slate-200 text-center font-bold text-blue-700">
                    {spec.score}đ
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-slate-100 font-bold text-slate-900">
                <td colSpan={6} className="py-3 px-4 border border-slate-200 text-right uppercase">
                  Tổng cộng:
                </td>
                <td className="py-3 px-2 border border-slate-200 text-center text-blue-900">
                  {specifications.reduce((s, x) => s + (x.count || 1), 0)} câu
                </td>
                <td className="py-3 px-2 border border-slate-200 text-center text-blue-900">
                  {Math.round(specifications.reduce((s, x) => s + (x.score || 0), 0) * 100) / 100}đ
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};
