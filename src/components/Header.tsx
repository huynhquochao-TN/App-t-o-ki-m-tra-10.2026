import React from 'react';
import {
  FileText,
  Printer,
  RotateCcw,
  Trash2,
  Database,
  FileSpreadsheet,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

interface HeaderProps {
  onOpenQuestionBank: () => void;
  onOpenImportMatrix: () => void;
  onOpenQualityModal: () => void;
  onPrint: () => void;
  onResetConfig: () => void;
  onRestoreConfig: () => void;
  hasExam: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenQuestionBank,
  onOpenImportMatrix,
  onOpenQualityModal,
  onPrint,
  onResetConfig,
  onRestoreConfig,
  hasExam,
}) => {
  return (
    <header className="bg-white border-b border-blue-100 sticky top-0 z-30 shadow-xs print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-blue-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                  RA ĐỀ KIỂM TRA AI – CẤP THPT
                </h1>
                <span className="hidden md:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                  Toán 10 - 11 - 12
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Chuẩn GDPT 2018 & Định dạng Đề thi Quốc Gia mới nhất
              </p>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            <button
              onClick={onOpenImportMatrix}
              title="Tải ma trận / đặc tả có sẵn"
              className="inline-flex items-center px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 transition"
            >
              <FileSpreadsheet className="w-4 h-4 mr-1 text-blue-600" />
              <span className="hidden lg:inline">Tải ma trận</span>
            </button>

            <button
              onClick={onOpenQuestionBank}
              title="Ngân hàng câu hỏi"
              className="inline-flex items-center px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 transition"
            >
              <Database className="w-4 h-4 mr-1 text-emerald-600" />
              <span className="hidden lg:inline">Ngân hàng câu</span>
            </button>

            {hasExam && (
              <button
                onClick={onOpenQualityModal}
                title="Kiểm tra chất lượng đề theo 12 tiêu chí"
                className="inline-flex items-center px-2.5 py-1.5 rounded-lg text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition"
              >
                <ShieldCheck className="w-4 h-4 mr-1 text-blue-600" />
                <span className="hidden sm:inline">Kiểm tra đề</span>
              </button>
            )}

            {hasExam && (
              <button
                onClick={onPrint}
                title="In đề thi chuẩn khổ A4"
                className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition"
              >
                <Printer className="w-4 h-4 mr-1" />
                <span>In đề</span>
              </button>
            )}

            <div className="h-5 w-px bg-slate-200 mx-1 hidden sm:block" />

            <button
              onClick={onRestoreConfig}
              title="Khôi phục cấu hình gần nhất từ bộ nhớ"
              className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={onResetConfig}
              title="Xóa toàn bộ cấu hình"
              className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
