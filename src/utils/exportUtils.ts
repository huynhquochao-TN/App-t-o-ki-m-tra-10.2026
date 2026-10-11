import { ExamVariant, ExamPackage, ExamMatrix, SpecificationItem, RubricItem } from '../types';

export function copyExamToClipboard(variant: ExamVariant, pkg: ExamPackage): boolean {
  try {
    const text = formatExamAsPlainText(variant, pkg);
    navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Copy failed:', err);
    return false;
  }
}

export function formatExamAsPlainText(variant: ExamVariant, pkg: ExamPackage): string {
  const config = pkg.config;
  let result = `SỞ GIÁO DỤC VÀ ĐÀO TẠO\nTRƯỜNG: ${config.schoolName || 'TRƯỜNG THPT .........................'}\n`;
  result += `ĐỀ KIỂM TRA: ${config.title || 'MÔN TOÁN'} - NĂM HỌC ${config.academicYear || '2024 - 2025'}\n`;
  result += `Môn: ${config.subject || 'Toán học'} - Lớp: ${config.grade === 'Khác' ? config.customGrade : config.grade}\n`;
  result += `Thời gian làm bài: ${config.durationMinutes} phút (Không kể thời gian phát đề)\n`;
  result += `MÃ ĐỀ THI: ${variant.code}\n\n`;
  result += `Họ và tên thí sinh: ....................................................\nSố báo danh: .............................................................\n\n`;
  result += `------------------------------------------------------------------------\n\n`;

  // Group by question types
  const mc = variant.questions.filter(q => q.questionType === 'multiple_choice');
  const tf = variant.questions.filter(q => q.questionType === 'true_false');
  const sa = variant.questions.filter(q => q.questionType === 'short_answer');
  const essay = variant.questions.filter(q => q.questionType === 'essay');
  const other = variant.questions.filter(
    q => !['multiple_choice', 'true_false', 'short_answer', 'essay'].includes(q.questionType)
  );

  let qNumber = 1;

  if (mc.length > 0) {
    result += `PHẦN I. Câu trắc nghiệm nhiều phương án lựa chọn (${mc.reduce((s, q) => s + q.score, 0)} điểm)\n`;
    result += `Thí sinh trả lời từ câu 1 đến câu ${mc.length}. Mỗi câu hỏi thí sinh chỉ chọn một phương án.\n\n`;
    mc.forEach(q => {
      result += `Câu ${qNumber++} (${q.score}đ): ${q.question}\n`;
      if (q.options) {
        q.options.forEach(opt => {
          result += `  ${opt}\n`;
        });
      }
      result += `\n`;
    });
  }

  if (tf.length > 0) {
    result += `PHẦN II. Câu trắc nghiệm đúng sai (${tf.reduce((s, q) => s + q.score, 0)} điểm)\n`;
    result += `Thí sinh trả lời từ câu ${qNumber} đến câu ${qNumber + tf.length - 1}. Trong mỗi ý a), b), c), d) ở mỗi câu, thí sinh chọn đúng hoặc sai.\n\n`;
    tf.forEach(q => {
      result += `Câu ${qNumber++} (${q.score}đ): ${q.question}\n`;
      if (q.subItems) {
        q.subItems.forEach(s => {
          result += `  ${s.id}) ${s.text}\n`;
        });
      }
      result += `\n`;
    });
  }

  if (sa.length > 0) {
    result += `PHẦN III. Câu trắc nghiệm trả lời ngắn (${sa.reduce((s, q) => s + q.score, 0)} điểm)\n`;
    result += `Thí sinh trả lời từ câu ${qNumber} đến câu ${qNumber + sa.length - 1}.\n\n`;
    sa.forEach(q => {
      result += `Câu ${qNumber++} (${q.score}đ): ${q.question}\n\n`;
    });
  }

  if (essay.length > 0) {
    result += `PHẦN IV. Tự luận (${essay.reduce((s, q) => s + q.score, 0)} điểm)\n\n`;
    essay.forEach(q => {
      result += `Câu ${qNumber++} (${q.score}đ) [${q.essaySubType || 'Tự luận'}]: ${q.question}\n\n`;
    });
  }

  if (other.length > 0) {
    result += `PHẦN KHÁC (${other.reduce((s, q) => s + q.score, 0)} điểm)\n\n`;
    other.forEach(q => {
      result += `Câu ${qNumber++} (${q.score}đ): ${q.question}\n\n`;
    });
  }

  result += `------------------ HẾT ------------------\n`;
  result += `Cán bộ coi thi không giải thích gì thêm.\n`;
  return result;
}

export function downloadAsWordDoc(variant: ExamVariant, pkg: ExamPackage) {
  const content = formatExamAsPlainText(variant, pkg);
  const blob = new Blob([content], { type: 'application/msword;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `De_Kiem_Tra_Toan_${variant.code}_${pkg.config.grade.replace(/\s+/g, '_')}.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadAnswersAsDoc(pkg: ExamPackage) {
  let text = `ĐÁP ÁN VÀ THANG ĐIỂM CHI TIẾT - ${pkg.config.title}\n\n`;
  pkg.variants.forEach(v => {
    text += `=== MÃ ĐỀ: ${v.code} ===\n`;
    text += `BẢNG ĐÁP ÁN:\n`;
    v.answerSheet.forEach(ans => {
      if (ans.type === 'true_false' && ans.subAnswers) {
        const subStr = ans.subAnswers.map(s => `${s.id}: ${s.val ? 'Đ' : 'S'}`).join(' | ');
        text += `Câu ${ans.questionNumber} (${ans.score}đ): [${subStr}]\n`;
      } else {
        text += `Câu ${ans.questionNumber} (${ans.score}đ): ${ans.answer}\n`;
      }
    });
    text += `\nLỜI GIẢI CHI TIẾT:\n`;
    v.questions.forEach((q, idx) => {
      text += `Câu ${idx + 1}: ${q.correctAnswer}\nLời giải: ${q.explanation}\n\n`;
    });
    text += `\n---------------------------------------\n\n`;
  });

  const blob = new Blob([text], { type: 'application/msword;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Dap_An_Chi_Tiet_${pkg.config.title.replace(/\s+/g, '_')}.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadMatrixAsDoc(matrix: ExamMatrix, config: any) {
  let text = `MA TRẬN ĐỀ KIỂM TRA MÔN TOÁN\n`;
  text += `Chủ đề: ${config.topic || 'Tổng hợp'}\n\n`;
  text += `Chủ đề / Đơn vị kiến thức | Nhận biết (câu/đ) | Thông hiểu (câu/đ) | Vận dụng (câu/đ) | Vận dụng cao (câu/đ) | Tổng cộng\n`;
  matrix.rows.forEach(r => {
    text += `${r.topic} - ${r.subTopic} | ${r.nhanBiet.count}c (${r.nhanBiet.score}đ) | ${r.thongHieu.count}c (${r.thongHieu.score}đ) | ${r.vanDung.count}c (${r.vanDung.score}đ) | ${r.vanDungCao.count}c (${r.vanDungCao.score}đ) | ${r.totalCount}c (${r.totalScore}đ - ${r.totalPercentage}%)\n`;
  });
  text += `\nTỔNG CỘNG:\n`;
  text += `- Nhận biết: ${matrix.totalNhanBiet.count} câu, ${matrix.totalNhanBiet.score} điểm (${matrix.totalNhanBiet.percentage}%)\n`;
  text += `- Thông hiểu: ${matrix.totalThongHieu.count} câu, ${matrix.totalThongHieu.score} điểm (${matrix.totalThongHieu.percentage}%)\n`;
  text += `- Vận dụng: ${matrix.totalVanDung.count} câu, ${matrix.totalVanDung.score} điểm (${matrix.totalVanDung.percentage}%)\n`;
  text += `- Vận dụng cao: ${matrix.totalVanDungCao.count} câu, ${matrix.totalVanDungCao.score} điểm (${matrix.totalVanDungCao.percentage}%)\n`;
  text += `TỔNG TOÀN ĐỀ: ${matrix.grandTotalCount} câu, ${matrix.grandTotalScore} điểm (100%)\n`;

  const blob = new Blob([text], { type: 'application/msword;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Ma_Tran_De_Kiem_Tra.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
