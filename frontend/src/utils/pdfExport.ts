export function exportReportToPDF(
  experimentTitle: string,
  userName: string,
  schoolName: string,
  conclusion: string
) {
  const content = `
===========================================================
BẢN TƯỜNG TRÌNH THỰC HÀNH VẬT LÝ — GDPT 2018
===========================================================
Tên bài thực hành: ${experimentTitle}
Họ và tên học sinh: ${userName}
Trường THPT/THCS: ${schoolName}
Ngày thực hiện: ${new Date().toLocaleDateString('vi-VN')}

1. MỤC TIÊU & YÊU CẦU CẦN ĐẠT:
   - Nắm vững nguyên lý và thao tác chính xác thiết bị thí nghiệm.
   - Xử lý số liệu và xác định đúng giá trị kèm sai số.

2. KẾT LUẬN & ĐÁNH GIÁ:
${conclusion || 'Học sinh đã hoàn thành đầy đủ các bước thực hành và thu thập số liệu đạt tiêu chuẩn SGK.'}
===========================================================
  `.trim();

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Ban-Tuong-Trinh-${experimentTitle.replace(/\s+/g, '-')}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
