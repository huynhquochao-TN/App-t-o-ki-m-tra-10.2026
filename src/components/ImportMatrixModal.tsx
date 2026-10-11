import React, { useState } from 'react';
import { FileSpreadsheet, Upload, Sparkles, X, CheckCircle2 } from 'lucide-react';
import { ExamConfig } from '../types';

interface ImportMatrixModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyParsedConfig: (parsedConfig: Partial<ExamConfig>) => void;
}

export const ImportMatrixModal: React.FC<ImportMatrixModalProps> = ({
  isOpen,
  onClose,
  onApplyParsedConfig,
}) => {
  const [matrixText, setMatrixText] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleParse = async () => {
    if (!matrixText.trim()) return;
    setIsParsing(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/parse-matrix-spec', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawText: matrixText }),
      });

      const data = await res.json();
      if (data.success && data.parsed) {
        onApplyParsedConfig({
          topic: data.parsed.topic || 'Chủ đề từ ma trận',
          multipleChoiceCount: data.parsed.multipleChoiceCount ?? 12,
          trueFalseCount: data.parsed.trueFalseCount ?? 4,
          shortAnswerCount: data.parsed.shortAnswerCount ?? 6,
          essayCount: data.parsed.essayCount ?? 0,
          levelPercent: data.parsed.levelPercent || {
            nhan_biet: 40,
            thong_hieu: 30,
            van_dung: 20,
            van_dung_cao: 10,
          },
          scoreScale: data.parsed.scoreScale || 10,
        });
        onClose();
      } else {
        setErrorMsg('Không thể phân tích ma trận. Vui lòng kiểm tra lại văn bản.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Lỗi kết nối máy chủ');
    } finally {
      setIsParsing(false);
    }
  };

  const handleSample = () => {
    setMatrixText(`MA TRẬN ĐỀ KIỂM TRA GIỮA KỲ 1 MÔN TOÁN 12
Chủ đề 1: Đơn điệu và Cực trị hàm số. Nhận biết: 4 câu TN (1.0đ), Thông hiểu: 3 câu TN (0.75đ), Vận dụng: 1 câu Đúng/Sai (1.0đ).
Chủ đề 2: Giá trị lớn nhất, nhỏ nhất và Tiệm cận. Nhận biết: 3 câu TN (0.75đ), Thông hiểu: 3 câu TN (0.75đ), Vận dụng: 2 câu trả lời ngắn (1.0đ).
Chủ đề 3: Tọa độ véctơ trong không gian Oxyz. Nhận biết: 2 câu TN (0.5đ), Thông hiểu: 1 câu Đúng/Sai (1.0đ), Vận dụng cao: 1 câu trả lời ngắn (0.5đ).
Tổng cộng: 12 câu trắc nghiệm 4 lựa chọn, 4 câu Đúng/Sai, 6 câu trả lời ngắn. Thang điểm 10.`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                TẢI MA TRẬN / BẢN ĐẶC TẢ CÓ SẴN
              </h3>
              <p className="text-xs text-slate-500">
                AI sẽ đọc ma trận của thầy/cô và thiết lập đề thi chính xác theo tỷ lệ đó
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

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-700">
              Dán nội dung ma trận hoặc đặc tả:
            </label>
            <button
              type="button"
              onClick={handleSample}
              className="text-xs text-blue-600 hover:underline font-medium"
            >
              Chèn mẫu ma trận chuẩn
            </button>
          </div>
          <textarea
            rows={8}
            value={matrixText}
            onChange={e => setMatrixText(e.target.value)}
            placeholder="Dán nội dung bảng ma trận từ Word, Excel hoặc văn bản bản đặc tả vào đây..."
            className="w-full text-xs font-mono p-3 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:border-blue-500 leading-relaxed"
          />
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 text-red-700 rounded-xl text-xs border border-red-200">
            {errorMsg}
          </div>
        )}

        <div className="pt-2 flex items-center justify-between">
          <p className="text-[11px] text-slate-500 italic">
            * AI sẽ tự động phân loại số lượng câu, tỷ lệ các mức độ và số điểm theo đúng ma trận đã cung cấp.
          </p>
          <div className="flex space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Hủy
            </button>
            <button
              onClick={handleParse}
              disabled={isParsing || !matrixText.trim()}
              className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-xl shadow-xs transition flex items-center space-x-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isParsing ? 'Đang phân tích...' : 'Áp dụng ma trận'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
