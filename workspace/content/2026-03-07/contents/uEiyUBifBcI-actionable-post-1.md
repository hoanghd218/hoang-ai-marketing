---
video: "Claude Code Skills Just Got Even Better"
video_id: uEiyUBifBcI
format: Actionable Post
rating: VÀNG
score: 7/10
date: 2026-03-07
status: draft
---

# 10 skills nhưng skill nào cũng bị gọi nhầm? Đây là cách sửa

Bạn cài 10 skills cho AI. Nhưng mỗi lần ra lệnh, nó cứ gọi nhầm skill.
Hoặc tệ hơn -- không gọi skill nào cả.

Đây là lỗi mà hầu hết người dùng Claude Code đều gặp khi có nhiều skills. Và nguyên nhân đơn giản hơn bạn nghĩ: phần mô tả skill quá mơ hồ.

Giống như bạn thuê 10 nhân viên nhưng không ai biết rõ mình phụ trách gì. Khi có việc, ai cũng giơ tay -- hoặc không ai giơ.

Cách sửa chỉ 3 bước:

Bước 1: Mở skill cần sửa, đọc lại phần description (dòng "USE WHEN..." trong file SKILL.md). Tự hỏi: nếu bạn là AI, đọc dòng này bạn có hiểu khi nào cần gọi skill này không?

Bước 2: Dùng tính năng Trigger Tuning của Anthropic. Nói: "Test trigger accuracy cho skill này." AI sẽ tự tạo các câu lệnh thử, kiểm tra xem skill có được gọi đúng không.

Bước 3: Xem kết quả và để AI tự viết lại phần description cho chính xác hơn. AI sẽ phân tích những câu nào trigger đúng, những câu nào bị miss, rồi tự cập nhật.

Kết quả: skill được gọi đúng lúc, đúng chỗ, không còn bị nhầm.

Lời khuyên từ Anthropic: Đừng scale lên nhiều skills khi chưa làm trigger tuning. Giống như tuyển 10 nhân viên nhưng không ai biết rõ mình phụ trách gì -- loạn là chắc.

System đúng -- một người làm bằng mười.

Bạn đang có bao nhiêu skills trong Claude Code? Comment số lượng -- mình sẽ gợi ý cách tổ chức.
