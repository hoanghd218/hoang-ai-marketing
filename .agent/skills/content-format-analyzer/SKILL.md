---
name: content-format-analyzer
description: Analyze transcripts or content to classify them into the 4A content framework (Actionable, Analytical, Aspirational, Anthropological). Use when analyzing YouTube transcripts, blog posts, social media content, or any text to determine its content format and approach. Input is transcript text; output is the primary 4A category and specific content format classification.
---

# Content Format Analyzer

Phân tích transcript/content và đưa ra đánh giá chi tiết theo **4A Framework** + **220 Proven Viral Formats**.

## References

- [4A Framework](references/4a_framework.md) - Framework phân loại nội dung theo 4 nhóm
- [220 Viral Formats](references/220_viral_formats.md) - Bộ sưu tập 220 định dạng video đã chứng minh viral

---

## Output Format (dưới 2000 ký tự cho Notion)

```
📊 PHÂN TÍCH NỘI DUNG

🎯 4A CLASSIFICATION
• Primary: [Actionable/Analytical/Aspirational/Anthropological]
• Secondary: [danh sách phụ nếu có]
• Lý do: [1 dòng giải thích]

🎬 VIRAL FORMAT
• Format: #[ID] [Tên format] ([Tên tiếng Việt])
• Confidence: [High/Medium/Low]
• Lý do: [1 dòng]

🪝 HOOK ANALYSIS
• Hook: "[trích dẫn 3-5 giây đầu]"
• Type: [Question/Contradiction/Result/Story/Bold/Curiosity]
• Score: [X]/10
• Feedback: [1-2 dòng góp ý]

🔥 VIRAL POTENTIAL: [X]/10
✅ Strengths: [liệt kê ngắn gọn]
⚠️ Weaknesses: [liệt kê ngắn gọn]  
💡 Suggestions: [liệt kê ngắn gọn]
```

---

## Quick Reference

| 4A Category | Câu hỏi nhận diện |
|-------------|-------------------|
| **Actionable** | Giúp người xem LÀM gì đó? |
| **Analytical** | Giúp người xem HIỂU sâu hơn? |
| **Aspirational** | Khơi gợi CẢM XÚC mạnh? |
| **Anthropological** | Đưa ra GÓC NHÌN độc đáo? |

**Hook Types**: Question | Contradiction | Result-First | Story | Bold Statement | Curiosity Gap

→ Chi tiết: [4a_framework.md](references/4a_framework.md) | [220_viral_formats.md](references/220_viral_formats.md)

---

## Example Output

**Input**: Transcript video review 30 AI tools của Google

```json
{
  "aaaa_classification": {
    "primary": "Actionable",
    "secondary": ["Analytical"],
    "reasoning": "Video chủ yếu chia sẻ tool và cách dùng, kèm ranking - mục đích là giúp người xem chọn đúng tool"
  },
  "viral_format": {
    "format_id": "19",
    "format_name": "Countdown List",
    "format_name_vi": "Danh sách đếm ngược",
    "confidence": "high",
    "reasoning": "Video xếp hạng 30 tools với format countdown ranking điển hình"
  },
  "hook_analysis": {
    "hook_text": "Tôi vừa dành 2 tuần test tất cả 30 công cụ AI của Google vì tôi thấy nhiều người confuse về công cụ nào thực sự đáng dùng",
    "hook_type": "Result-First + Curiosity Gap",
    "hook_score": "8/10",
    "hook_feedback": "Hook mạnh: 1) Số cụ thể (2 tuần, 30 tools), 2) Pain point rõ ràng (confused). Cải thiện: thêm số liệu kết quả ('và chỉ có 5 cái đáng dùng')"
  },
  "viral_potential": {
    "score": "8/10",
    "strengths": [
      "Hook có số liệu cụ thể gây uy tín",
      "Nội dung practical và hữu ích",
      "Format ranking dễ theo dõi"
    ],
    "weaknesses": [
      "Video dài có thể mất người xem giữa chừng",
      "Thiếu visual demo cho một số tools"
    ],
    "improvement_suggestions": [
      "Thêm timestamp cho từng tool category",
      "Tạo phần 'quick picks' đầu video",
      "Thêm B-roll demo khi giới thiệu mỗi tool"
    ]
  }
}
```
