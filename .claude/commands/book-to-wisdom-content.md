---
description: Bóc kiến thức từ sách → tạo Facebook wisdom posts + render ảnh
argument-hint: [tên sách hoặc đoạn trích — ví dụ: "4 Mùa Cuộc Sống - Jim Rohn"]
allowed-tools: Bash(python3:*), Bash(mkdir:*), Bash(rm:*), Read, Write, Task, AskUserQuestion
---

# Book to Wisdom Content

Bóc kiến thức từ sách và tạo Facebook wisdom posts hoàn chỉnh (text + ảnh).

**Input:** $ARGUMENTS — tên sách, đoạn trích sách, hoặc topic cụ thể.

## Output Structure

```
workspace/content/YYYY-MM-DD/[book-slug]/
├── [book-slug]-wisdom-posts.md    # Tất cả posts (caption + image text)
├── [book-slug]-post-1.png         # Ảnh post 1
├── [book-slug]-post-2.png         # Ảnh post 2
└── [book-slug]-post-3.png         # Ảnh post 3 (nếu có)
```

## QUAN TRỌNG: Ngôn ngữ output

**BẮT BUỘC viết tiếng Việt CÓ DẤU đầy đủ** trong mọi output (wisdom posts, caption, image text, report). Không bao giờ xuất tiếng Việt không dấu.

- ✅ Đúng: "Thành công không đến từ một kỹ năng duy nhất"
- ❌ Sai: "Thanh cong khong den tu mot ky nang duy nhat"

Áp dụng cho: wisdom points, caption, image text, report, và mọi nội dung tiếng Việt khác.

## Quy tắc: Ghi nhận nguồn người nổi tiếng

Khi nội dung wisdom đến từ **người nổi tiếng** (tác giả sách, diễn giả, doanh nhân, nhà tư tưởng...), **BẮT BUỘC** hiển thị tên họ ở ít nhất 1 trong 3 vị trí:

1. **Hook / dòng mở đầu caption** — ví dụ: "Jim Rohn từng nói: ..."
2. **Caption** — nhắc tên trong phần nội dung hoặc cuối caption — ví dụ: "— Trích từ Jim Rohn"
3. **Image Text** — đưa tên vào nội dung ảnh — ví dụ: dòng tiêu đề "Jim Rohn dạy rằng..." hoặc attribution "— Jim Rohn"

**Mục đích:** Tăng uy tín (social proof), thu hút người tìm kiếm theo tên, và tôn trọng nguồn gốc kiến thức.

## Workflow

### Phase 1: Extract Wisdom & Generate Posts

**Song song đọc 2 file reference** — dùng 2 lệnh Read cùng lúc:

1. Read `.claude/skills/mkt-book-to-wisdom-posts/SKILL.md`
2. Read `.claude/skills/mkt-book-to-wisdom-posts/references/post_formats.md`

Sau khi có cả 2 file:

3. Từ input `$ARGUMENTS`, extract 5-10 wisdom points
4. Chọn 2-3 format phù hợp nhất
5. Tạo posts (caption + image text)

Lưu output ra `workspace/content/YYYY-MM-DD/[book-slug]/[book-slug]-wisdom-posts.md`

### Phase 2: Render Images (SONG SONG)

**QUAN TRỌNG:** Render tất cả ảnh SONG SONG bằng Task sub-agents. Mỗi post là 1 Task agent chạy đồng thời.

Trước khi render, trình bày tổng quan tất cả posts cho user xác nhận 1 lần duy nhất:

```json
{"questions": [
  {"question": "Tạo ảnh cho tất cả posts?", "header": "Xác nhận", "multiSelect": false, "options": [
    {"label": "Tạo hết (Recommended)", "description": "Render ảnh song song cho tất cả posts"},
    {"label": "Chọn post cụ thể", "description": "Chỉ render một số posts"},
    {"label": "Chỉ lấy text", "description": "Không render ảnh, chỉ giữ text posts"}
  ]}
]}
```

Sau khi user confirm, launch tất cả Task agents **CÙNG LÚC trong 1 message** — mỗi agent render 1 ảnh:

```
Task agent cho mỗi post:
- subagent_type: "general-purpose"
- prompt: Bao gồm:
  1. Nội dung Image Text của post đó
  2. Toàn bộ SKILL.md của image-post-creator (design system, 6 dạng ảnh, prompt mẫu)
  3. Workflow: auto-classify → extract content → build prompt → generate (KHÔNG cần confirm)
  4. Generate command:
     cd .claude/skills/image-post-creator && python3 scripts/generate.py "<prompt>" -o <output-path> -ar 1:1 --size 2K -v
  5. Output path: workspace/content/YYYY-MM-DD/<book-slug>/<book-slug>-post-<N>.png
```

**Map format gợi ý** (skill sẽ tự detect, nhưng để tham khảo):

| Post Format | Dạng ảnh |
|-------------|----------|
| Progressive Reduction | Progressive / Escalation |
| Never Too Late List | Numbered List |
| Contrast Pairs | Contrast Pairs |
| Numbered Skills List | Numbered List |
| Intangible Assets | Numbered List |
| Bold Statement + List | Quote / Statement |

### Phase 3: Output Report

Đợi tất cả Task agents hoàn thành, sau đó:

1. **Lưu báo cáo ra file** `workspace/content/YYYY-MM-DD/[book-slug]-report.md`
2. **Hiển thị báo cáo** cho user trong terminal

Nội dung báo cáo:

```markdown
# 📚 BOOK TO WISDOM CONTENT — [Tên sách]

📝 Posts: X bài | 🖼️ Images: Y ảnh đã render
📁 Folder: `workspace/content/YYYY-MM-DD/`

---

## POST #1 — [Format name]

**📌 Caption:**
[caption text — copy-paste ready]

**🖼️ Image Text:**
[full image content đã dùng để tạo ảnh]

**🎨 Image Prompt:**
```
[full prompt đã dùng để generate ảnh]
```

**📸 Ảnh:** `workspace/content/YYYY-MM-DD/images/[slug]-post-1.png`

---

## POST #2 — [Format name]

**📌 Caption:**
[caption text]

**🖼️ Image Text:**
[image content]

**🎨 Image Prompt:**
```
[prompt]
```

**📸 Ảnh:** `workspace/content/YYYY-MM-DD/images/[slug]-post-2.png`

---

(POST #3 nếu có)
```

## Error Handling

| Lỗi | Xử lý |
|------|--------|
| Sách không quen, không có đoạn trích | Hỏi user cung cấp key passages hoặc summary |
| Render ảnh lỗi (1 agent fail) | Báo lỗi ảnh đó, các ảnh khác vẫn thành công |
| Input quá ngắn (< 20 từ) | Hỏi user cung cấp thêm context |
