---
description: Phân tích videos.json → content ideas → draft contents → báo cáo tổng quan
argument-hint: [path to videos.json or date folder, default: today]
allowed-tools: Read, Write, Edit, Glob, Grep, Skill, Task, Bash(mkdir:*)
---

# Research Result to Contents

Đọc file kết quả research (`videos.json`) từ command `mkt-find-trend-videos-subscribed`, phân tích từng video bằng skill `mkt-video-to-content-idea`, tạo content drafts chính thức, và xuất báo cáo tổng quan.

## Input

Xác định file `videos.json`:

1. Nếu user truyền path cụ thể: dùng path đó
2. Nếu user truyền ngày (YYYY-MM-DD): dùng `workspace/content/YYYY-MM-DD/videos.json`
3. Nếu không truyền gì: dùng ngày hôm nay `workspace/content/$(date +%Y-%m-%d)/videos.json`

**Argument:** `$ARGUMENTS`

Đọc file `videos.json` và parse danh sách videos. Nếu file không tồn tại, báo lỗi và dừng.

## Output Structure

```
workspace/content/YYYY-MM-DD/
├── videos.json              # (đã có từ trước)
├── transcripts/             # (đã có từ trước)
├── images/                  # (đã có từ trước)
├── ideas/                   # (đã có hoặc tạo mới)
│   ├── <video_id>.md        # Phân tích chi tiết từng video
│   └── ...
├── contents/                # NỘI DUNG CHÍNH THỨC (mới tạo)
│   ├── <slug>-facebook.md   # Draft Facebook post
│   ├── <slug>-short-video.md # Draft short video script
│   ├── <slug>-actionable.md  # Draft actionable post
│   └── ...
└── report.md                # BÁO CÁO TỔNG QUAN (mới tạo)
```

## Workflow

### Phase 1: Đọc và chuẩn bị dữ liệu

1. Đọc `videos.json`
2. Tạo folder `contents/` nếu chưa có: `mkdir -p workspace/content/YYYY-MM-DD/contents`
3. Kiểm tra xem đã có file phân tích trong `ideas/` chưa (từ lần chạy trước)

### Phase 2: Phân tích từng video (parallel sub-agents)

Với mỗi video trong `videos.json` mà có transcript (transcript != null):

**Nếu đã có file phân tích `ideas/<video_id>.md`:** đọc file có sẵn, không phân tích lại.

**Nếu chưa có:** Spawn **parallel sub-agents** (max 3 concurrent) — mỗi agent là `general-purpose`, chạy skill `mkt-video-to-content-idea` với prompt:

```
Sử dụng skill /mkt-video-to-content-idea để phân tích video này và đề xuất content ideas.

**Video:** <title>
**Video ID:** <video_id>
**Views:** <views>
**URL:** <url>
**Transcript path:** workspace/content/<YYYY-MM-DD>/transcripts/<video_id>.txt

Đọc transcript từ file trên. Đọc insights đã trích xuất:

**Insights:**
<insights array từ videos.json>

**Yêu cầu:**
1. Đọc toàn bộ transcript
2. Chạy đúng quy trình 5 bước của skill mkt-video-to-content-idea
3. Lưu kết quả vào: workspace/content/<YYYY-MM-DD>/ideas/<video_id>.md
4. Return JSON tóm tắt:
{
  "video_id": "<video_id>",
  "score": <điểm trung bình>,
  "rating": "XANH|VÀNG|ĐỎ",
  "content_ideas": [
    {
      "title": "Tên content",
      "format": "Facebook Post|Short Video|Actionable Post|Infographic",
      "draft": "Tóm tắt ngắn nội dung draft"
    }
  ],
  "analysis_file": "ideas/<video_id>.md"
}
```

### Phase 3: Tạo content drafts chính thức

Sau khi có kết quả phân tích tất cả video, với mỗi content idea có rating XANH hoặc VÀNG:

1. Đọc file phân tích `ideas/<video_id>.md`
2. Lấy phần draft tương ứng
3. Tạo file content chính thức trong `contents/`:
   - Tên file: `<video_id>-<format-slug>.md` (ví dụ: `f95-O8C88uw-facebook-post-1.md`)
   - Nội dung: Draft đã viết trong file ideas, sẵn sàng copy-paste

**Format file content:**

```markdown
---
video: <title>
video_id: <video_id>
format: <Facebook Post | Short Video | Actionable Post | Infographic>
rating: <XANH | VÀNG>
score: <X/10>
date: <YYYY-MM-DD>
status: draft
---

# <Tên content idea>

<Nội dung draft đầy đủ - copy-paste ready>
```

### Phase 4: Cập nhật videos.json

Cập nhật `videos.json` — thêm field `content_analysis` cho mỗi video:

```json
{
  "content_analysis": {
    "score": 8.2,
    "rating": "XANH",
    "content_ideas": [...],
    "analysis_file": "ideas/<video_id>.md"
  }
}
```

### Phase 5: Tạo báo cáo tổng quan

Tạo file `workspace/content/YYYY-MM-DD/report.md`:

```markdown
# Báo cáo Content — YYYY-MM-DD

## Tổng quan

- **Tổng video phân tích:** X
- **XANH (nên làm ngay):** X video
- **VÀNG (cần chọn góc):** X video
- **ĐỎ (bỏ qua):** X video
- **Tổng content drafts:** X bài

## Video đánh giá cao nhất

| # | Video | Kênh | Views | Điểm | Rating | Content Ideas |
|---|-------|------|-------|------|--------|---------------|
| 1 | [Title](url) | Channel | 1,234 | 8.2 | XANH | 5 ideas |

## Danh sách Content Drafts

| # | Tiêu đề | Format | Từ video | File |
|---|---------|--------|----------|------|
| 1 | Tên content | Facebook Post | Video title | contents/slug.md |

## Folder

- **Ideas:** workspace/content/YYYY-MM-DD/ideas/
- **Contents:** workspace/content/YYYY-MM-DD/contents/
- **Transcripts:** workspace/content/YYYY-MM-DD/transcripts/
```

### Phase 6: Output tóm tắt cho user

In ra terminal:

```
## Kết quả phân tích — YYYY-MM-DD

X video → Y content ideas → Z drafts

🟢 XANH: [tên video 1] (8.2/10) — 5 content ideas
🟡 VÀNG: [tên video 2] (6.5/10) — 2 content ideas
🔴 ĐỎ: [tên video 3] (3.0/10) — bỏ qua

📄 Báo cáo: workspace/content/YYYY-MM-DD/report.md
📁 Contents: workspace/content/YYYY-MM-DD/contents/
```

## Rules

- **PHẢI** đọc toàn bộ transcript khi phân tích — không bỏ sót
- **PHẢI** dùng skill `mkt-video-to-content-idea` đúng quy trình 5 bước
- **PHẢI** viết tiếng Việt CÓ DẤU trong tất cả content drafts
- **PHẢI** áp dụng brand voice từ `MY RESOURCES/BRANDVOICE.MD`
- **KHÔNG** ép ra content nếu video rating ĐỎ
- **KHÔNG** phân tích lại video đã có file ideas
- Nếu `videos.json` đã có field `content_analysis`, bỏ qua Phase 2 cho video đó — chỉ tạo content drafts (Phase 3)
- Content drafts phải copy-paste ready — không có placeholder, không có TODO
