export interface ChapterPreset {
  chapter: string;
  topics: {
    name: string;
    scope: string;
    outcomes: string;
  }[];
}

export interface GradeCurriculum {
  grade: string;
  chapters: ChapterPreset[];
}

export const VIETNAMESE_MATH_CURRICULUM: Record<string, GradeCurriculum> = {
  'Toán 10': {
    grade: 'Toán 10',
    chapters: [
      {
        chapter: 'Chương 1: Mệnh đề và Tập hợp',
        topics: [
          {
            name: 'Mệnh đề toán học, mệnh đề phủ định, mệnh đề kéo theo',
            scope: 'Khái niệm mệnh đề, các kí hiệu với mọi, tồn tại, mệnh đề đảo',
            outcomes: 'Nhận biết mệnh đề, xác định tính đúng sai, lập mệnh đề phủ định'
          },
          {
            name: 'Tập hợp và các phép toán trên tập hợp',
            scope: 'Tập con, tập bằng nhau, giao, hợp, hiệu của hai tập hợp, các khoảng đoạn số thực',
            outcomes: 'Thực hiện thành thạo các phép toán giao, hợp, hiệu trên các khoảng, đoạn số thực'
          }
        ]
      },
      {
        chapter: 'Chương 2: Bất phương trình và Hệ bất phương trình bậc nhất hai ẩn',
        topics: [
          {
            name: 'Bất phương trình bậc nhất hai ẩn',
            scope: 'Biểu diễn miền nghiệm của bất phương trình bậc nhất hai ẩn trên mặt phẳng tọa độ',
            outcomes: 'Xác định miền nghiệm, giải bài toán thực tế quy về BPT bậc nhất hai ẩn'
          },
          {
            name: 'Hệ bất phương trình bậc nhất hai ẩn và bài toán tối ưu quy hoạch tuyến tính',
            scope: 'Hệ BPT bậc nhất hai ẩn, tìm giá trị lớn nhất/nhỏ nhất của biểu thức F = ax + by',
            outcomes: 'Biểu diễn miền đa giác nghiệm, giải bài toán tối ưu kinh tế thực tế'
          }
        ]
      },
      {
        chapter: 'Chương 3: Hệ thức lượng trong tam giác',
        topics: [
          {
            name: 'Giá trị lượng giác của một góc từ 0° đến 180°',
            scope: 'Định nghĩa sin, cos, tan, cot trên nửa đường tròn đơn vị',
            outcomes: 'Tính giá trị lượng giác góc đặc biệt, áp dụng các hệ thức lượng giác cơ bản'
          },
          {
            name: 'Định lí côsin, định lí sin và công thức tính diện tích tam giác',
            scope: 'Định lí sin, cosin, công thức Hê-rông, bán kính đường tròn nội/ngoại tiếp',
            outcomes: 'Giải tam giác và ứng dụng giải bài toán đo đạc khoảng cách thực tế'
          }
        ]
      },
      {
        chapter: 'Chương 4: Véctơ và các phép toán',
        topics: [
          {
            name: 'Khái niệm véctơ, hai véctơ cùng phương, bằng nhau',
            scope: 'Độ dài véctơ, véctơ không, góc giữa hai véctơ',
            outcomes: 'Nhận biết các tính chất cơ bản của véctơ trong hình phẳng'
          },
          {
            name: 'Tổng, hiệu của hai véctơ và tích của véctơ với một số',
            scope: 'Quy tắc 3 điểm, quy tắc hình bình hành, quy tắc trung điểm, trọng tâm tam giác',
            outcomes: 'Phân tích một véctơ theo hai véctơ không cùng phương, chứng minh thẳng hàng'
          },
          {
            name: 'Tích vô hướng của hai véctơ và ứng dụng',
            scope: 'Công thức tích vô hướng, biểu thức tọa độ, tính góc và độ dài đoạn thẳng',
            outcomes: 'Tính công cơ học, góc giữa hai lực, chứng minh vuông góc'
          }
        ]
      },
      {
        chapter: 'Chương 5: Phương pháp tọa độ trong mặt phẳng Oxy',
        topics: [
          {
            name: 'Tọa độ của véctơ và tọa độ của điểm',
            scope: 'Hệ trục tọa độ Oxy, tọa độ trung điểm, trọng tâm, tích vô hướng trong hệ tọa độ',
            outcomes: 'Tìm tọa độ điểm, độ dài đoạn thẳng, khoảng cách giữa hai điểm'
          },
          {
            name: 'Phương trình đường thẳng trong mặt phẳng',
            scope: 'Phương trình tham số, phương trình tổng quát, khoảng cách từ điểm đến đường thẳng, góc giữa hai đường thẳng',
            outcomes: 'Viết phương trình đường thẳng qua các điểm cho trước, tính khoảng cách và góc'
          },
          {
            name: 'Phương trình đường tròn',
            scope: 'Phương trình chính tắc (x-a)^2 + (y-b)^2 = R^2, tiếp tuyến của đường tròn',
            outcomes: 'Xác định tâm và bán kính đường tròn, viết phương trình tiếp tuyến'
          },
          {
            name: 'Ba đường cônic (Elip, Hypebol, Parabol)',
            scope: 'Phương trình chính tắc của elip, hypebol, parabol và các yếu tố tiêu cự, đỉnh, tâm sai',
            outcomes: 'Nhận biết và viết phương trình chính tắc của các đường conic, ứng dụng thực tế'
          }
        ]
      },
      {
        chapter: 'Chương 6: Hàm số, đồ thị và đại số tổ hợp',
        topics: [
          {
            name: 'Hàm số bậc hai và đồ thị parabol',
            scope: 'Tập xác định, sự biến thiên, đỉnh và trục đối xứng của hàm số y = ax^2 + bx + c',
            outcomes: 'Lập bảng biến thiên, vẽ đồ thị, ứng dụng tìm quỹ đạo chuyển động, doanh thu lớn nhất'
          },
          {
            name: 'Quy tắc đếm, hoán vị, chỉnh hợp, tổ hợp',
            scope: 'Quy tắc cộng, quy tắc nhân, sơ đồ cây, công thức P_n, A_n^k, C_n^k',
            outcomes: 'Vận dụng giải các bài toán đếm sắp xếp, chọn người/đồ vật trong thực tế'
          },
          {
            name: 'Nhị thức Newton bậc 4 và bậc 5',
            scope: 'Khai triển nhị thức (a+b)^4, (a+b)^5, tam giác Pascal',
            outcomes: 'Khai triển và tìm hệ số của số hạng trong khai triển nhị thức Newton'
          }
        ]
      },
      {
        chapter: 'Chương 7: Thống kê và Xác suất cổ điển',
        topics: [
          {
            name: 'Số đặc trưng đo xu thế trung tâm và mức độ phân tán',
            scope: 'Số trung bình, trung vị, tứ phân vị, mốt, khoảng biến thiên, khoảng tứ phân vị, phương sai, độ lệch chuẩn',
            outcomes: 'Tính và so sánh độ phân tán của hai mẫu số liệu thực tế'
          },
          {
            name: 'Xác suất của biến cố trong mô hình xác suất cổ điển',
            scope: 'Không gian mẫu, biến cố, công thức tính xác suất P(A) = n(A)/n(Omega)',
            outcomes: 'Tính xác suất biến cố trong các phép thử gieo xúc xắc, rút bài, chọn mẫu'
          }
        ]
      }
    ]
  },
  'Toán 11': {
    grade: 'Toán 11',
    chapters: [
      {
        chapter: 'Chương 1: Hàm số lượng giác và Phương trình lượng giác',
        topics: [
          {
            name: 'Góc lượng giác và các công thức lượng giác',
            scope: 'Đơn vị radian, công thức cộng, nhân đôi, biến đổi tích thành tổng, tổng thành tích',
            outcomes: 'Áp dụng công thức rút gọn biểu thức và tính giá trị lượng giác'
          },
          {
            name: 'Hàm số lượng giác và đồ thị (sin, cos, tan, cot)',
            scope: 'Tập xác định, tuần hoàn, chu kỳ, tính chẵn lẻ và đồ thị',
            outcomes: 'Xác định chu kỳ, tập giá trị, khảo sát dao động điều hòa vật lý'
          },
          {
            name: 'Phương trình lượng giác cơ bản',
            scope: 'Giải phương trình sin x = m, cos x = m, tan x = m, cot x = m',
            outcomes: 'Tìm tập nghiệm và biểu diễn nghiệm trên đường tròn lượng giác'
          }
        ]
      },
      {
        chapter: 'Chương 2: Dãy số, Cấp số cộng và Cấp số nhân',
        topics: [
          {
            name: 'Dãy số và số hạng tổng quát',
            scope: 'Dãy tăng, giảm, bị chặn, cách cho dãy số bằng hệ thức truy hồi',
            outcomes: 'Dự đoán số hạng tổng quát và chứng minh tính bị chặn'
          },
          {
            name: 'Cấp số cộng (CSC)',
            scope: 'Công sai d, số hạng tổng quát u_n = u_1 + (n-1)d, tổng n số hạng S_n',
            outcomes: 'Xác định các yếu tố của CSC, giải bài toán thực tế lãi đơn, phân chia công việc'
          },
          {
            name: 'Cấp số nhân (CSN)',
            scope: 'Công bội q, số hạng tổng quát u_n = u_1 * q^(n-1), tổng S_n, cấp số nhân lùi vô hạn',
            outcomes: 'Giải bài toán lãi kép, tăng trưởng dân số, phân rã phóng xạ'
          }
        ]
      },
      {
        chapter: 'Chương 3: Giới hạn và Hàm số liên tục',
        topics: [
          {
            name: 'Giới hạn của dãy số',
            scope: 'Định nghĩa, các giới hạn đặc biệt, định lí về phép toán giới hạn',
            outcomes: 'Khử các dạng vô định vô cùng trên vô cùng, vô cùng trừ vô cùng'
          },
          {
            name: 'Giới hạn của hàm số tại một điểm và vô cực',
            scope: 'Giới hạn một bên, giới hạn hữu hạn, giới hạn vô cực, dạng 0/0',
            outcomes: 'Khử dạng vô định 0/0 bằng nhân liên hợp hoặc phân tích nhân tử'
          },
          {
            name: 'Hàm số liên tục và định lí giá trị trung gian',
            scope: 'Tính liên tục tại một điểm, trên một khoảng, chứng minh phương trình có nghiệm',
            outcomes: 'Chứng minh phương trình có ít nhất một nghiệm trong khoảng (a; b)'
          }
        ]
      },
      {
        chapter: 'Chương 4: Đường thẳng và mặt phẳng trong không gian (Quan hệ song song)',
        topics: [
          {
            name: 'Đại cương về đường thẳng và mặt phẳng',
            scope: 'Các tiên đề Ơ-clit trong không gian, giao tuyến của hai mặt phẳng, giao điểm đường và mặt',
            outcomes: 'Tìm giao tuyến của hai mặt phẳng, tìm thiết diện cắt khối đa diện'
          },
          {
            name: 'Hai đường thẳng song song và chéo nhau',
            scope: 'Vị trí tương đối của hai đường thẳng, định lí ba giao tuyến',
            outcomes: 'Chứng minh hai đường thẳng song song trong không gian'
          },
          {
            name: 'Đường thẳng song song với mặt phẳng, hai mặt phẳng song song',
            scope: 'Điều kiện đường song song mặt, hai mặt song song, định lí Ta-lét trong không gian',
            outcomes: 'Chứng minh quan hệ song song, tìm thiết diện song song'
          }
        ]
      },
      {
        chapter: 'Chương 5: Một số yếu tố thống kê và Xác suất',
        topics: [
          {
            name: 'Các số đặc trưng đo xu thế trung tâm của mẫu số liệu ghép nhóm',
            scope: 'Số trung bình, nhóm chứa trung vị, nhóm chứa mốt và công thức tính',
            outcomes: 'Tính và giải thích ý nghĩa của trung vị, tứ phân vị cho dữ liệu phân nhóm'
          },
          {
            name: 'Biến cố giao, biến cố hợp và quy tắc tính xác suất',
            scope: 'Công thức cộng xác suất cho biến cố xung khắc, công thức nhân cho biến cố độc lập',
            outcomes: 'Vận dụng tính xác suất trong trò chơi, bắn bia, kiểm tra y tế'
          }
        ]
      },
      {
        chapter: 'Chương 6: Hàm số mũ và Hàm số lôgarit',
        topics: [
          {
            name: 'Lũy thừa và Lôgarit',
            scope: 'Tính chất lũy thừa với số mũ thực, định nghĩa và tính chất của log_a(b), ln, log',
            outcomes: 'Biến đổi biểu thức chứa lũy thừa và logarit thành thạo'
          },
          {
            name: 'Hàm số mũ và hàm số lôgarit',
            scope: 'Tập xác định, đạo hàm, tính đơn điệu và đồ thị của y = a^x và y = log_a(x)',
            outcomes: 'Khảo sát đồ thị, ứng dụng trong mô hình tăng trưởng và phân rã'
          },
          {
            name: 'Phương trình và bất phương trình mũ, lôgarit cơ bản',
            scope: 'Giải phương trình đưa về cùng cơ số, đặt ẩn phụ',
            outcomes: 'Tìm tập nghiệm của phương trình, bất phương trình mũ và logarit'
          }
        ]
      },
      {
        chapter: 'Chương 7: Đạo hàm',
        topics: [
          {
            name: 'Định nghĩa đạo hàm và ý nghĩa hình học',
            scope: 'Giới hạn tỉ số số gia, tiếp tuyến của đường cong, hệ số góc tiếp tuyến',
            outcomes: 'Viết phương trình tiếp tuyến của đồ thị hàm số tại một điểm'
          },
          {
            name: 'Quy tắc tính đạo hàm của các hàm số cơ bản và hàm hợp',
            scope: 'Đạo hàm hàm đa thức, lượng giác, mũ, logarit, quy tắc u+v, u.v, u/v, u(v(x))',
            outcomes: 'Tính đạo hàm cấp 1, cấp 2 và ứng dụng giải bài toán vận tốc tức thời'
          }
        ]
      },
      {
        chapter: 'Chương 8: Quan hệ vuông góc trong không gian',
        topics: [
          {
            name: 'Đường thẳng vuông góc với mặt phẳng',
            scope: 'Điều kiện vuông góc, định lí ba đường vuông góc',
            outcomes: 'Chứng minh đường thẳng vuông góc với mặt phẳng, đường vuông góc với đường'
          },
          {
            name: 'Hai mặt phẳng vuông góc và góc giữa hai mặt phẳng',
            scope: 'Điều kiện vuông góc của hai mặt phẳng, góc phẳng nhị diện',
            outcomes: 'Xác định góc giữa đường thẳng và mặt phẳng, góc giữa hai mặt phẳng'
          },
          {
            name: 'Khoảng cách trong không gian',
            scope: 'Khoảng cách từ điểm đến mặt phẳng, khoảng cách giữa hai đường thẳng chéo nhau',
            outcomes: 'Tính khoảng cách bằng phương pháp hình chiếu hoặc thể tích'
          }
        ]
      }
    ]
  },
  'Toán 12': {
    grade: 'Toán 12',
    chapters: [
      {
        chapter: 'Chương 1: Ứng dụng đạo hàm để khảo sát và vẽ đồ thị hàm số',
        topics: [
          {
            name: 'Tính đơn điệu của hàm số (Đồng biến, nghịch biến)',
            scope: 'Dấu của đạo hàm bậc nhất f\'(x), các khoảng đơn điệu của hàm số bậc ba, phân thức bậc nhất/bậc nhất',
            outcomes: 'Tìm khoảng đơn điệu, tìm tham số m để hàm số đơn điệu trên khoảng'
          },
          {
            name: 'Cực trị của hàm số',
            scope: 'Điểm cực đại, cực tiểu, điều kiện cần và đủ của cực trị',
            outcomes: 'Tìm cực trị của hàm số, giải bài toán cực trị có chứa tham số'
          },
          {
            name: 'Giá trị lớn nhất và giá trị nhỏ nhất của hàm số (GTLN, GTNN)',
            scope: 'Tìm Max - Min trên đoạn [a; b], trên khoảng, ứng dụng bài toán tối ưu thực tế',
            outcomes: 'Giải bài toán tối ưu chi phí, diện tích lớn nhất, thể tích cực đại trong kinh tế kỹ thuật'
          },
          {
            name: 'Đường tiệm cận của đồ thị hàm số',
            scope: 'Tiệm cận đứng, tiệm cận ngang, tiệm cận xiên của đồ thị hàm phân thức',
            outcomes: 'Xác định đúng các đường tiệm cận của đồ thị hàm số y = (ax+b)/(cx+d) và y = (ax^2+bx+c)/(dx+e)'
          },
          {
            name: 'Khảo sát sự biến thiên và vẽ đồ thị hàm số',
            scope: 'Quy trình khảo sát, tâm đối xứng, trục đối xứng, biện luận số nghiệm phương trình bằng đồ thị',
            outcomes: 'Đọc bảng biến thiên, nhận diện đồ thị hàm số, biện luận số nghiệm'
          }
        ]
      },
      {
        chapter: 'Chương 2: Tọa độ trong không gian Oxyz',
        topics: [
          {
            name: 'Hệ trục tọa độ Oxyz và các phép toán véctơ trong không gian',
            scope: 'Tọa độ điểm, véctơ, tích vô hướng, độ dài véctơ, góc giữa hai véctơ trong không gian',
            outcomes: 'Thực hiện phép toán véctơ, xác định trọng tâm, trung điểm, tính khoảng cách giữa hai điểm'
          },
          {
            name: 'Phương trình mặt cầu trong không gian',
            scope: 'Dạng (x-a)^2 + (y-b)^2 + (z-c)^2 = R^2 và x^2 + y^2 + z^2 - 2ax - 2by - 2cz + d = 0',
            outcomes: 'Tìm tâm và bán kính mặt cầu, lập phương trình mặt cầu đi qua các điểm hoặc tiếp xúc'
          },
          {
            name: 'Phương trình mặt phẳng',
            scope: 'Véctơ pháp tuyến, tích có hướng của hai véctơ, phương trình tổng quát của mặt phẳng',
            outcomes: 'Lập phương trình mặt phẳng qua 3 điểm, qua điểm và song song/vuông góc mặt khác'
          },
          {
            name: 'Phương trình đường thẳng trong không gian',
            scope: 'Véctơ chỉ phương, phương trình tham số, phương trình chính tắc của đường thẳng',
            outcomes: 'Viết phương trình đường thẳng, xét vị trí tương đối giữa đường và mặt, giữa hai đường'
          }
        ]
      },
      {
        chapter: 'Chương 3: Các số đặc trưng đo mức độ phân tán của mẫu số liệu ghép nhóm',
        topics: [
          {
            name: 'Khoảng biến thiên và khoảng tứ phân vị của mẫu số liệu ghép nhóm',
            scope: 'Công thức tính khoảng biến thiên R, độ trải giữa Delta_Q = Q3 - Q1',
            outcomes: 'Đánh giá mức độ đồng đều của dữ liệu kinh tế, xã hội'
          },
          {
            name: 'Phương sai và độ lệch chuẩn của mẫu số liệu ghép nhóm',
            scope: 'Công thức tính s^2 và s cho mẫu ghép nhóm',
            outcomes: 'So sánh mức độ rủi ro hoặc phân tán của hai tập dữ liệu thống kê'
          }
        ]
      },
      {
        chapter: 'Chương 4: Nguyên hàm, Tích phân và Ứng dụng',
        topics: [
          {
            name: 'Nguyên hàm và các phương pháp tìm nguyên hàm',
            scope: 'Bảng nguyên hàm cơ bản, phương pháp đổi biến số, phương pháp nguyên hàm từng phần',
            outcomes: 'Tìm họ nguyên hàm của các hàm đa thức, lượng giác, mũ và phân thức'
          },
          {
            name: 'Tích phân và tính chất của tích phân',
            scope: 'Định nghĩa tích phân Newton-Leibniz, đổi cận đổi biến, tích phân từng phần',
            outcomes: 'Tính tích phân xác định, áp dụng tính chất tích phân'
          },
          {
            name: 'Ứng dụng hình học của tích phân (Diện tích và Thể tích)',
            scope: 'Tính diện tích hình phẳng giới hạn bởi các đường cong, thể tích khối tròn xoay quanh trục Ox',
            outcomes: 'Giải bài toán thực tế tính dung tích bể chứa, diện tích mảnh đất có biên cong'
          }
        ]
      },
      {
        chapter: 'Chương 5: Xác suất có điều kiện và Công thức xác suất toàn phần',
        topics: [
          {
            name: 'Xác suất có điều kiện',
            scope: 'Định nghĩa P(A|B) = P(AB)/P(B), công thức nhân xác suất',
            outcomes: 'Tính xác suất của biến cố A khi biết biến cố B đã xảy ra'
          },
          {
            name: 'Công thức xác suất toàn phần và công thức Bayes',
            scope: 'Hệ biến cố đầy đủ, công thức xác suất toàn phần P(B) = sum P(A_i)*P(B|A_i), công thức Bayes',
            outcomes: 'Vận dụng tính xác suất trong chẩn đoán y tế, sàng lọc bệnh, kiểm tra chất lượng sản phẩm'
          }
        ]
      }
    ]
  }
};
