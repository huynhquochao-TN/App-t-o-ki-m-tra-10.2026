import React from 'react';
import { Layers, Download } from 'lucide-react';
import { ExamMatrix, ExamConfig } from '../types';
import { downloadMatrixAsDoc } from '../utils/exportUtils';

interface MatrixViewerProps {
  matrix: ExamMatrix;
  config: ExamConfig;
}

export const MatrixViewer: React.FC<MatrixViewerProps> = ({ matrix, config }) => {
  return (
    <div className="space-y-5">
      {/* Header Info */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center">
            <Layers className="w-5 h-5 text-blue-600 mr-2" />
            MA TRẬN ĐỀ KIỂM TRA MÔN TOÁN
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Môn: {config.subject || 'Toán học'} – {config.grade === 'Khác' ? config.customGrade : config.grade} – Chuẩn Chương trình GDPT 2018
          </p>
        </div>

        <button
          type="button"
          onClick={() => downloadMatrixAsDoc(matrix, config)}
          className="inline-flex items-center px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-xs transition shrink-0"
        >
          <Download className="w-3.5 h-3.5 mr-1.5" />
          Xuất Ma trận (.doc)
        </button>
      </div>

      {/* Main Matrix Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-slate-100 text-slate-800 border-b border-slate-200 font-bold text-center">
                <th rowSpan={2} className="py-3 px-3 border border-slate-200 w-12">TT</th>
                <th rowSpan={2} className="py-3 px-4 border border-slate-200 text-left">
                  Chủ đề / Đơn vị kiến thức
                </th>
                <th colSpan={3} className="py-2 px-2 border border-slate-200 bg-blue-50 text-blue-900">
                  Nhận biết
                </th>
                <th colSpan={3} className="py-2 px-2 border border-slate-200 bg-emerald-50 text-emerald-900">
                  Thông hiểu
                </th>
                <th colSpan={3} className="py-2 px-2 border border-slate-200 bg-amber-50 text-amber-900">
                  Vận dụng
                </th>
                <th colSpan={3} className="py-2 px-2 border border-slate-200 bg-purple-50 text-purple-900">
                  Vận dụng cao
                </th>
                <th colSpan={3} className="py-2 px-2 border border-slate-200 bg-slate-200 text-slate-900">
                  Tổng cộng
                </th>
              </tr>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 text-[11px] text-center">
                {/* NB */}
                <th className="py-1 px-1.5 border border-slate-200">Số câu</th>
                <th className="py-1 px-1.5 border border-slate-200">Điểm</th>
                <th className="py-1 px-1.5 border border-slate-200">%</th>
                {/* TH */}
                <th className="py-1 px-1.5 border border-slate-200">Số câu</th>
                <th className="py-1 px-1.5 border border-slate-200">Điểm</th>
                <th className="py-1 px-1.5 border border-slate-200">%</th>
                {/* VD */}
                <th className="py-1 px-1.5 border border-slate-200">Số câu</th>
                <th className="py-1 px-1.5 border border-slate-200">Điểm</th>
                <th className="py-1 px-1.5 border border-slate-200">%</th>
                {/* VDC */}
                <th className="py-1 px-1.5 border border-slate-200">Số câu</th>
                <th className="py-1 px-1.5 border border-slate-200">Điểm</th>
                <th className="py-1 px-1.5 border border-slate-200">%</th>
                {/* Total */}
                <th className="py-1 px-1.5 border border-slate-200 font-bold">Số câu</th>
                <th className="py-1 px-1.5 border border-slate-200 font-bold">Điểm</th>
                <th className="py-1 px-1.5 border border-slate-200 font-bold">%</th>
              </tr>
            </thead>
            <tbody>
              {matrix.rows.map((row, idx) => (
                <tr key={idx} className="border-b border-slate-200 hover:bg-slate-50 text-center">
                  <td className="py-2.5 px-3 border border-slate-200 font-medium text-slate-600">
                    {idx + 1}
                  </td>
                  <td className="py-2.5 px-4 border border-slate-200 text-left font-semibold text-slate-800">
                    <div>{row.topic}</div>
                    <div className="text-[10px] text-slate-400 font-normal">{row.subTopic}</div>
                  </td>
                  {/* NB */}
                  <td className="py-2.5 px-1.5 border border-slate-200 font-medium">{row.nhanBiet.count || '-'}</td>
                  <td className="py-2.5 px-1.5 border border-slate-200 text-slate-600">{row.nhanBiet.score ? `${row.nhanBiet.score}đ` : '-'}</td>
                  <td className="py-2.5 px-1.5 border border-slate-200 text-slate-500">{row.nhanBiet.percentage ? `${row.nhanBiet.percentage}%` : '-'}</td>
                  {/* TH */}
                  <td className="py-2.5 px-1.5 border border-slate-200 font-medium">{row.thongHieu.count || '-'}</td>
                  <td className="py-2.5 px-1.5 border border-slate-200 text-slate-600">{row.thongHieu.score ? `${row.thongHieu.score}đ` : '-'}</td>
                  <td className="py-2.5 px-1.5 border border-slate-200 text-slate-500">{row.thongHieu.percentage ? `${row.thongHieu.percentage}%` : '-'}</td>
                  {/* VD */}
                  <td className="py-2.5 px-1.5 border border-slate-200 font-medium">{row.vanDung.count || '-'}</td>
                  <td className="py-2.5 px-1.5 border border-slate-200 text-slate-600">{row.vanDung.score ? `${row.vanDung.score}đ` : '-'}</td>
                  <td className="py-2.5 px-1.5 border border-slate-200 text-slate-500">{row.vanDung.percentage ? `${row.vanDung.percentage}%` : '-'}</td>
                  {/* VDC */}
                  <td className="py-2.5 px-1.5 border border-slate-200 font-medium">{row.vanDungCao.count || '-'}</td>
                  <td className="py-2.5 px-1.5 border border-slate-200 text-slate-600">{row.vanDungCao.score ? `${row.vanDungCao.score}đ` : '-'}</td>
                  <td className="py-2.5 px-1.5 border border-slate-200 text-slate-500">{row.vanDungCao.percentage ? `${row.vanDungCao.percentage}%` : '-'}</td>
                  {/* Row Total */}
                  <td className="py-2.5 px-1.5 border border-slate-200 font-bold text-blue-900 bg-slate-50/50">{row.totalCount}</td>
                  <td className="py-2.5 px-1.5 border border-slate-200 font-bold text-blue-900 bg-slate-50/50">{row.totalScore}đ</td>
                  <td className="py-2.5 px-1.5 border border-slate-200 font-bold text-blue-900 bg-slate-50/50">{row.totalPercentage}%</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              {/* Grand Total Row */}
              <tr className="bg-slate-100 font-bold text-slate-900 text-center border-t-2 border-slate-300">
                <td colSpan={2} className="py-3 px-4 border border-slate-200 text-right uppercase">
                  Tổng cộng từng mức độ:
                </td>
                {/* Total NB */}
                <td className="py-3 px-1.5 border border-slate-200 text-blue-700">{matrix.totalNhanBiet.count} câu</td>
                <td className="py-3 px-1.5 border border-slate-200 text-blue-700">{matrix.totalNhanBiet.score}đ</td>
                <td className="py-3 px-1.5 border border-slate-200 text-blue-700">{matrix.totalNhanBiet.percentage}%</td>
                {/* Total TH */}
                <td className="py-3 px-1.5 border border-slate-200 text-emerald-700">{matrix.totalThongHieu.count} câu</td>
                <td className="py-3 px-1.5 border border-slate-200 text-emerald-700">{matrix.totalThongHieu.score}đ</td>
                <td className="py-3 px-1.5 border border-slate-200 text-emerald-700">{matrix.totalThongHieu.percentage}%</td>
                {/* Total VD */}
                <td className="py-3 px-1.5 border border-slate-200 text-amber-700">{matrix.totalVanDung.count} câu</td>
                <td className="py-3 px-1.5 border border-slate-200 text-amber-700">{matrix.totalVanDung.score}đ</td>
                <td className="py-3 px-1.5 border border-slate-200 text-amber-700">{matrix.totalVanDung.percentage}%</td>
                {/* Total VDC */}
                <td className="py-3 px-1.5 border border-slate-200 text-purple-700">{matrix.totalVanDungCao.count} câu</td>
                <td className="py-3 px-1.5 border border-slate-200 text-purple-700">{matrix.totalVanDungCao.score}đ</td>
                <td className="py-3 px-1.5 border border-slate-200 text-purple-700">{matrix.totalVanDungCao.percentage}%</td>
                {/* Grand Total */}
                <td className="py-3 px-1.5 border border-slate-200 bg-blue-100 text-blue-900">{matrix.grandTotalCount} câu</td>
                <td className="py-3 px-1.5 border border-slate-200 bg-blue-100 text-blue-900">{matrix.grandTotalScore}đ</td>
                <td className="py-3 px-1.5 border border-slate-200 bg-blue-100 text-blue-900">100%</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};
