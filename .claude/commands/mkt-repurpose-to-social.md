---
description: Repurpose script/transcript thành bài viết Facebook, Instagram carousel, LinkedIn — review rồi đăng qua Blotato
argument-hint: [path to script or transcript file]
allowed-tools: Read, Write, Edit, Glob, Grep, Skill, Agent, Bash(mkdir:*)
---

# Repurpose Script to Social Posts

Nhận 1 file script/transcript tham khảo, repurpose thành content cho 3 nền tảng (Facebook, Instagram carousel, LinkedIn). User review xong thì đăng qua Blotato.

## Input

**Argument:** `$ARGUMENTS`

1. Nếu user truyền path cụ thể: đọc file đó
2. Nếu không truyền: hỏi user path đến file script/transcript

Đọc file input và xác nhận nội dung với user trước khi bắt đầu.

## Phase 0: Hỏi user chọn nền tảng

**TRƯỚC KHI làm bất cứ gì**, hỏi user:

```
Bạn muốn tạo content cho nền tảng nào?
1. Facebook
2. Instagram (carousel)
3. LinkedIn
4. Tất cả

Chọn số hoặc tên nền tảng (có thể chọn nhiều, ví dụ: 1,3)
```

Chỉ spawn sub-agents cho các nền tảng user đã chọn. Không tạo content cho nền tảng không được chọn.

## Output Structure

```
workspace/content/YYYY-MM-DD/social-posts/
├── <slug>-facebook.md
├── <slug>-ig-carousel.md
└── <slug>-linkedin.md
```

## Workflow

### Phase 1: Đọc và phân tích input

1. Đọc file script/transcript
2. Đọc brand voice: `MY RESOURCES/BRANDVOICE.MD`
3. Tạo folder output: `mkdir -p workspace/content/$(date +%Y-%m-%d)/social-posts`
4. Xác định slug từ tên file hoặc nội dung chính

### Phase 2: Tạo content cho 3 nền tảng (parallel sub-agents)

Spawn **3 sub-agents song song**, mỗi agent tạo content cho 1 nền tảng:

#### Agent 1: Facebook Post
Sử dụng skill `/video-to-facebook-posts` hoặc `/mkt-content-repurposer` để tạo Facebook post.

Prompt cho agent:
```
Đọc file script: <path>
Đọc brand voice: MY RESOURCES/BRANDVOICE.MD

Sử dụng skill /video-to-facebook-posts để phân tích nội dung và tạo Facebook post.
Nếu nội dung không phải transcript video, hãy dùng skill /mkt-content-repurposer với focus platform = Facebook.

Yêu cầu:
- Viết tiếng Việt có dấu
- Áp dụng brand voice Hoàng
- Content phải copy-paste ready
- Lưu vào: workspace/content/<YYYY-MM-DD>/social-posts/<slug>-facebook.md
```

#### Agent 2: Instagram Carousel
Sử dụng skill `/mkt-carousel-creator` để tạo carousel slides cho Instagram.

Prompt cho agent:
```
Đọc file script: <path>
Đọc brand voice: MY RESOURCES/BRANDVOICE.MD

Sử dụng skill /mkt-carousel-creator để tạo Instagram carousel (mode: IG 1:1).
Input là nội dung từ script/transcript trên.

Yêu cầu:
- Write in ENGLISH (Instagram uses English for global audience)
- Tối thiểu 5 slides, tối đa 10 slides
- Mỗi slide có text + visual direction
- Lưu vào: workspace/content/<YYYY-MM-DD>/social-posts/<slug>-ig-carousel.md
```

#### Agent 3: LinkedIn Post
Sử dụng skill `/mkt-linkedin-post-creator` để tạo LinkedIn post.

Prompt cho agent:
```
Đọc file script: <path>
Đọc brand voice: MY RESOURCES/BRANDVOICE.MD

Sử dụng skill /mkt-linkedin-post-creator để tạo LinkedIn post từ nội dung script.

Yêu cầu:
- Write in ENGLISH (LinkedIn uses English for global audience)
- Professional tone phù hợp LinkedIn
- Áp dụng brand voice Hoàng (adapted to English)
- Content phải copy-paste ready
- Lưu vào: workspace/content/<YYYY-MM-DD>/social-posts/<slug>-linkedin.md
```

### Phase 3: Hiển thị kết quả để user review

Sau khi 3 agents hoàn thành, hiển thị cho user:

```
## Content đã tạo — sẵn sàng review

### 1. Facebook Post
📄 File: workspace/content/YYYY-MM-DD/social-posts/<slug>-facebook.md
<Hiển thị preview 5 dòng đầu>

### 2. Instagram Carousel
📄 File: workspace/content/YYYY-MM-DD/social-posts/<slug>-ig-carousel.md
<Hiển thị số slides và tiêu đề>

### 3. LinkedIn Post
📄 File: workspace/content/YYYY-MM-DD/social-posts/<slug>-linkedin.md
<Hiển thị preview 5 dòng đầu>

---
Hãy review các file trên. Khi sẵn sàng, cho tôi biết:
- Muốn chỉnh sửa bài nào?
- Muốn đăng lên nền tảng nào? (Facebook / Instagram / LinkedIn / tất cả)
```

### Phase 4: Đăng bài qua Blotato (sau khi user confirm)

**CHỈ thực hiện khi user xác nhận muốn đăng.** Hỏi rõ:
1. Đăng lên nền tảng nào? (có thể chọn nhiều)
2. Đăng ngay hay hẹn giờ?

Sử dụng Blotato MCP tools:
- `mcp__blotato__blotato_list_accounts` — lấy danh sách accounts đã kết nối
- `mcp__blotato__blotato_create_post` — tạo bài đăng

**Mapping nền tảng → account:**
- Facebook → page "KIẾN TRÚC OCEAN" hoặc account Facebook đã kết nối
- LinkedIn → company page "BIM Speed Solutions" hoặc account LinkedIn đã kết nối
- Instagram → (kiểm tra qua blotato_list_accounts)

**Quy trình đăng mỗi bài:**
1. Đọc file content tương ứng
2. Hỏi user xác nhận nội dung cuối cùng
3. Gọi `blotato_create_post` với nội dung và account phù hợp
4. Kiểm tra status bằng `blotato_get_post_status`
5. Báo kết quả cho user

## Rules

- **PHẢI** đọc brand voice trước khi tạo content
- **PHẢI** viết tiếng Việt CÓ DẤU
- **PHẢI** hỏi user review trước khi đăng — KHÔNG tự động đăng
- **PHẢI** hỏi user chọn nền tảng cụ thể trước khi đăng
- **KHÔNG** đăng bài mà chưa được user xác nhận
- Content phải copy-paste ready — không placeholder, không TODO
- Nếu user muốn chỉnh sửa, chỉnh file rồi hiển thị lại để review
