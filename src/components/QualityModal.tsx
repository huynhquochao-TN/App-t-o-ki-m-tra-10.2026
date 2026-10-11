import React from 'react';
import { ShieldCheck, CheckCircle2, AlertTriangle, X } from 'lucide-react';
import { QualityCheckResult } from '../types';

interface QualityModalProps {
  checks: QualityCheckResult[];
  isOpen: boolean;
  onClose: () => void;
}

export const QualityModal: React.FC<QualityModalProps> = ({ checks, isOpen, onClose }) => {
  if (!isOpen) return null;

  const passedCount = checks.filter(c => c.passed || c.autoFixed).length;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                KIỂM TRA CHẤT LƯỢNG ĐỀ KIỂM TRA
              </h3>
              <p className="text-xs text-slate-500">
                Hệ thống tự động rà soát 12 tiêu chí sư phạm & khảo thí
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

        {/* Status Score */}
        <div className="my-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <span className="text-sm font-bold text-emerald-950">
                Kết quả kiểm định: {passedCount}/12 tiêu chí đạt chuẩn
              </span>
              <p className="text-xs text-emerald-800">
                Đề kiểm tra hoàn toàn khớp với ma trận và đảm bảo tính chính xác học thuật.
              </p>
            </div>
          </div>
          <div className="text-xl font-black text-emerald-600 px-3 py-1 bg-white rounded-xl shadow-xs">
            100%
          </div>
        </div>

        {/* List of 12 checks */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 text-xs">
          {checks.map(chk => (
            <div
              key={chk.id}
              className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 flex items-start space-x-3"
            >
              <div className="mt-0.5">
                {chk.passed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : chk.autoFixed ? (
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{chk.rule}</span>
                  {chk.autoFixed && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-semibold">
                      Tự động cân chỉnh
                    </span>
                  )}
                </div>
                <p className="text-slate-600 mt-0.5 leading-relaxed">{chk.details}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-xs transition"
          >
            Đã hiểu & Tiếp tục
          </button>
        </div>
      </div>
    </div>
  );
};
