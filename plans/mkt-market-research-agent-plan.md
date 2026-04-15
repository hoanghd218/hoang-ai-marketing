# Market Research Agent — Kế Hoạch Quy Trình

**Tên agent đề xuất**: `mkt-market-research-agent`
**Vị trí**: `.claude/agents/mkt-market-research-agent.md`
**Ngày lập plan**: 2026-04-05
**Owner**: Hoang (AI Marketing)

---

## 1. Mục tiêu (4-in-1)

Agent thực hiện **4 loại nghiên cứu thị trường** trong một quy trình thống nhất, phục vụ quyết định kinh doanh của Hoang (khoá học AI, phần mềm, AI Agent solutions, cộng đồng AI Freedom Builders):

1. **Idea Validation** — validate ý tưởng sản phẩm/khoá học mới trước khi đầu tư sản xuất
2. **Competitor Intelligence** — theo dõi đối thủ trong ngành AI/automation (VN + Global)
3. **Audience Deep Research** — hiểu sâu pain/desire/objection của SME VN & office workers
4. **Gap Analysis** — phát hiện ngách trống, nhu cầu chưa được đáp ứng

**Phạm vi**: Global + Vietnam song song (VN là core, Global để benchmark và dự báo trend sớm 6–12 tháng).

---

## 2. Input Schema

```yaml
research_topic: "AI Agent cho SME Việt Nam"   # bắt buộc
research_type:                                  # chọn 1 hoặc nhiều
  - idea_validation
  - competitor_intel
  - audience_research
  - gap_analysis
scope: global_and_vn                           # vn_only | global_and_vn
time_window: 90d                               # 7d | 30d | 90d | 365d
target_persona: "SME owner VN 28-45"           # mặc định WHO10X TECH
product_hypothesis: "Khoá học xây AI Agent..." # optional, cho idea_validation
depth: standard                                # quick | standard | deep
output_formats: [md, docx, notion]             # subset of [md, docx, pdf, notion]
notify_telegram: true
```

---

## 3. Kiến trúc — 6 Phase × 4 Module

Agent được tổ chức thành **6 phase tuần tự**, trong mỗi phase có các **module chạy song song** để tiết kiệm thời gian.

### Phase 1 — SCOPE & BRIEF (5 phút)

**Mục đích**: Chuyển research request → research brief có cấu trúc.

Hoạt động:
- Parse input, map sang 4 research_type
- Load persona từ `MY RESOURCES/WHO10X TECH.MD` và brand context từ `CLAUDE.md`
- Sinh **Research Brief** (research questions cụ thể, hypotheses cần test, success criteria)
- Tạo folder output: `research/market/[YYYY-MM-DD]-[slug]/`

Output: `00-brief.md`

---

### Phase 2 — DATA COLLECTION (song song, 15–25 phút)

**Mục đích**: Thu thập dữ liệu thô từ 4 luồng song song.

**Module 2A — Social & Video Signals (VN + Global)**
- `youtube-trend-finder` → trending videos theo keyword (VN + EN)
- `breakout-video-finder` → video viral bất thường (2x view/sub)
- `mkt-youtube-topic-researcher` → topic landscape trên YouTube
- X.com trending posts (Grok API) — trực tiếp qua script `search_x_posts.py`

**Module 2B — Web & News Intelligence**
- `mkt-ai-news-aggregator` → tin AI mới nhất (Perplexity + GitHub + X)
- `WebSearch` → báo cáo thị trường, Statista, ReportLinker, CB Insights snippets
- `WebFetch` → website đối thủ trực tiếp (pricing page, landing page, about page)
- Google Trends search (qua WebSearch) để check interest-over-time

**Module 2C — Community & Discussion (VN-specific)**
- Facebook groups SME VN, cộng đồng AI VN → qua **Claude in Chrome** (`mcp__Claude_in_Chrome__navigate` + `get_page_text`)
- Reddit (r/SideProject, r/Entrepreneur, r/artificial) → WebFetch/WebSearch
- Quora Vietnam, Voz forum → WebFetch
- Review/comment trên các khoá học đối thủ (Unica, Kyna, Gitiho, Skillshare…)

**Module 2D — Specialized MCP Discovery (optional)**
- Gọi `mcp__mcp-registry__search_mcp_registry` với keywords `["market research", "similarweb", "statista", "crunchbase"]`
- Nếu tìm thấy MCP phù hợp → `suggest_connectors` cho Hoang duyệt cài
- Nếu chưa có → fallback về WebSearch

Output: `01-raw/` folder chứa các file JSON/MD dạng thô, đặt tên theo nguồn (vd `youtube-trends.json`, `competitor-websites.md`, `fb-groups-discussions.md`).

---

### Phase 3 — EXTRACT & STRUCTURE (10 phút)

**Mục đích**: Biến raw data → structured facts.

- `youtube-transcript` → extract transcript top 5–10 video đối thủ (parallel max 5)
- `mkt-competitor-video-strategy-analyzer` → phân tích hook/title/structure/thumbnail của đối thủ
- `mkt-insight-extractor` → extract pain/desire/objection từ comments, transcripts, discussions
- Parse website đối thủ → extract: giá, positioning, USP, social proof, CTA, guarantee

Output: `02-structured/` gồm `competitors.json`, `audience-insights.md`, `pricing-benchmark.md`, `content-gaps.md`.

---

### Phase 4 — ANALYZE (15 phút)

**Mục đích**: Biến structured facts → insight có giá trị quyết định.

Bốn phân tích chuyên biệt, mỗi cái mapping với 1 research_type:

**4A. Idea Validation Analysis**
- Demand signal score (search volume, video views growth, discussion frequency)
- Willingness-to-pay estimate (từ pricing đối thủ + comment về giá)
- Red flags (market saturation, declining interest, legal risks)
- Go/No-Go recommendation với confidence level

**4B. Competitor Matrix**
- Bảng so sánh: Tên / Sản phẩm / Giá / USP / Audience size / Content cadence / Điểm mạnh / Điểm yếu
- Phân nhóm: Direct competitor | Indirect | Substitute | Aspirational
- Market share estimate (VN)
- Ưu tiên: Top 3 đối thủ VN + Top 3 global đáng học

**4C. Audience Psychographic Profile**
- Top 5 pain points (rank by frequency)
- Top 5 desires (rank by emotional intensity)
- Top 5 objections (rank by blocking power)
- Hành trình khách hàng (awareness → consideration → decision)
- Cross-check với persona WHO10X TECH → điểm khớp/lệch

**4D. Gap Analysis & Opportunity Map**
- Nhu cầu được nói đến nhưng chưa ai giải quyết tốt (whitespace)
- Đối thủ làm dở ở đâu (underserved segments)
- Xu hướng global chưa vào VN (arbitrage opportunity)
- Ranking 5–10 cơ hội theo (Impact × Fit × Ease)

Output: `03-analysis/` gồm 4 file tương ứng.

---

### Phase 5 — SYNTHESIZE REPORT (10 phút)

**Mục đích**: Gộp 4 phân tích thành 1 báo cáo executive-ready.

Template báo cáo:
1. **Executive Summary** (1 trang) — key findings + top recommendations
2. **Research Questions & Answers** (từ brief)
3. **Market Landscape** — size, growth, segments (VN + Global)
4. **Competitor Matrix** (bảng + nhận định)
5. **Audience Deep Dive** (pain/desire/objection + journey)
6. **Opportunity Map** (ranked gaps)
7. **Strategic Recommendations** cho Hoang:
   - Có nên theo đuổi ý tưởng này không? (Go/No-Go)
   - Positioning đề xuất
   - Pricing đề xuất
   - Content angles để bắt đầu test (liên kết với 5 Content Pillars)
8. **Next Actions** (checklist 7–14 ngày tới)
9. **Appendix** — nguồn dữ liệu, methodology, limitations

Output đa định dạng (chạy song song ở Phase 6):
- `report.md` — nguồn gốc, Markdown thuần
- `report.docx` — dùng skill **docx** (chuyên nghiệp, có TOC, heading, bảng)
- `report.pdf` — dùng skill **pdf** để convert từ docx
- Notion sync — dùng database mới "Market Research" (cần Hoang tạo)

---

### Phase 6 — DISTRIBUTE & ARCHIVE (5 phút)

Hoạt động song song:
- Save `report.md` vào `research/market/[date]-[slug]/report.md`
- Gọi skill **docx** tạo `report.docx` professional
- Gọi skill **pdf** tạo `report.pdf` từ docx
- Sync executive summary + top 5 opportunities vào Notion (database "Market Research")
- `mkt-content-knowledge-compiler` → thêm learnings vào knowledge base dài hạn
- `telegram-notifier` → gửi Hoang tin nhắn gồm: tiêu đề, Go/No-Go verdict, top 3 insight, link file
- Optional: `mkt-research-result-to-contents` → chuyển research thành content angle sẵn sàng đẩy vào pipeline video

---

## 4. Skill & Tool Orchestration Map

| Phase | Skills/Tools sử dụng | Chạy song song? |
|-------|----------------------|-----------------|
| 1. Scope | Read (CLAUDE.md, persona), Write (brief) | Không |
| 2. Collect | youtube-trend-finder, breakout-video-finder, mkt-youtube-topic-researcher, mkt-ai-news-aggregator, WebSearch, WebFetch, Claude in Chrome (FB groups), mcp-registry search | Có (4 module parallel) |
| 3. Extract | youtube-transcript, mkt-competitor-video-strategy-analyzer, mkt-insight-extractor | Có (transcript parallel max 5) |
| 4. Analyze | LLM reasoning + cross-reference với persona WHO10X TECH | 4 phân tích parallel |
| 5. Synthesize | docx skill, pdf skill | Format outputs parallel |
| 6. Distribute | notion-video-trend-sync (adapt), telegram-notifier, mkt-content-knowledge-compiler, mkt-research-result-to-contents | Có |

---

## 5. Output Folder Structure

```
research/market/2026-04-05-ai-agent-sme-vn/
├── 00-brief.md
├── 01-raw/
│   ├── youtube-trends-vn.json
│   ├── youtube-trends-global.json
│   ├── breakout-videos.json
│   ├── ai-news.md
│   ├── competitor-websites.md
│   ├── fb-groups-discussions.md
│   └── reddit-discussions.md
├── 02-structured/
│   ├── competitors.json
│   ├── audience-insights.md
│   ├── pricing-benchmark.md
│   └── content-gaps.md
├── 03-analysis/
│   ├── idea-validation.md
│   ├── competitor-matrix.md
│   ├── audience-profile.md
│   └── opportunity-map.md
├── report.md
├── report.docx
└── report.pdf
```

---

## 6. Depth Modes

| Mode | Thời gian | Scope | Dùng khi |
|------|-----------|-------|----------|
| **Quick** | 15–20 phút | 1 research_type, 5 sources, 3 competitors | Test ý tưởng nhanh, quyết định trong ngày |
| **Standard** | 45–60 phút | 2–3 research_type, 10 sources, 5–7 competitors | Quyết định launch sản phẩm, content pillar mới |
| **Deep** | 90–120 phút | 4 research_type, 20+ sources, 10+ competitors, FB groups crawl | Quyết định đầu tư lớn, pivot chiến lược |

---

## 7. Error Handling & Fallbacks

- YouTube API fail → dùng WebSearch với query `site:youtube.com [keyword]`
- Perplexity/news fail → dùng WebSearch + WebFetch trực tiếp
- Claude in Chrome không khả dụng (computer use off) → bỏ qua Module 2C, ghi chú limitation vào report
- MCP registry không có connector → báo cho Hoang và fallback về web scraping
- Telegram bot fail → log warning, vẫn save file local

---

## 8. Scheduling (Optional)

Có thể kết hợp skill **schedule** để:
- **Weekly competitor scan** — quét đối thủ chính 7 ngày/lần, alert khi phát hiện thay đổi pricing/launch mới
- **Monthly market pulse** — báo cáo tổng quan thị trường AI VN hàng tháng
- **On-demand** — chạy khi Hoang có ý tưởng mới cần validate

---

## 9. Success Metrics

Agent được coi là thành công khi:
- ✅ Báo cáo trả lời được 100% research questions trong brief
- ✅ Có ít nhất 5 cơ hội cụ thể (không mơ hồ) trong Opportunity Map
- ✅ Competitor matrix có ít nhất 5 đối thủ với đầy đủ 8 trường
- ✅ Recommendation rõ ràng Go/No-Go kèm lý do
- ✅ Hoang có thể ra quyết định sau khi đọc executive summary (1 trang)
- ✅ Thời gian chạy < 60 phút ở Standard mode

---

## 10. Roadmap Triển Khai

**Giai đoạn 1 — MVP (1–2 ngày)**
- Viết file agent `.claude/agents/mkt-market-research-agent.md`
- Test với 1 research_type (audience research) + 1 topic cụ thể
- Output: chỉ `report.md`

**Giai đoạn 2 — Full 4-in-1 (3–5 ngày)**
- Thêm 3 research_type còn lại
- Tích hợp docx + pdf output
- Test end-to-end với 2 topic thực tế

**Giai đoạn 3 — Automation & Scheduling (ongoing)**
- Tạo Notion "Market Research" database
- Setup weekly competitor scan với schedule
- Tạo command `/market-research [topic]` để trigger nhanh

---

## 11. Câu hỏi cần Hoang quyết định trước khi build

1. **Notion database "Market Research"**: Hoang tự tạo hay muốn mình đề xuất schema?
2. **Telegram bot**: đã có sẵn (dùng cho `mkt-daily-ai-news-scout`) — có dùng chung không?
3. **Claude in Chrome cho FB groups**: có cần bật computer use không, hay skip Module 2C ở MVP?
4. **MVP topic test**: bạn muốn test agent với topic nào đầu tiên? (gợi ý: "AI Agent cho SME VN" hoặc "Vibe Coding course market VN")
5. **Ưu tiên build theo Roadmap hay build ngay Full 4-in-1?**

---

*File này là plan nháp — sau khi Hoang feedback, mình sẽ tạo agent file thực sự trong `.claude/agents/`.*
