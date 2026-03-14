# Slide Prompts — OpenClaw AI Providers

**Topic:** Tổng quan AI Models OpenClaw hỗ trợ + Chi tiết OpenAI Provider + PI Integration + Gateway Architecture
**Total slides:** 9
**Style:** Chalkboard Dev Explainer
**Aspect ratio:** 16:9

---

## Slide Plan

| # | Section | Concept | Layout | Title |
|---|---------|---------|--------|-------|
| 1 | Tổng quan | OpenClaw + 23+ Providers | Hub-and-Spoke | "OpenClaw — 23+ AI Providers" |
| 2 | So sánh | Claude là lựa chọn tốt nhất | Scoreboard / Metrics | "Tại Sao Chọn Claude?" |
| 3 | OpenAI Chi tiết | 2 cách kết nối OpenAI | Split Comparison | "API Key vs Codex Subscription" |
| 4 | OpenAI Models | Models hỗ trợ | Grid / Matrix | "OpenAI Models Trên OpenClaw" |
| 5 | Nâng cao | Tính năng transport & optimization | Layered Stack | "Tính Năng Nâng Cao OpenAI" |
| 6 | PI Integration | Pi Agent nhúng vào OpenClaw | Sandwich / Wrapper | "PI — Nhúng AI Agent Vào OpenClaw" |
| 7 | PI Integration | Tool pipeline 6 tầng | Layered Stack | "Tool Pipeline — 6 Tầng Xử Lý" |
| 8 | Gateway | Kiến trúc Gateway tổng quan | Hub-and-Spoke | "Gateway Architecture" |
| 9 | Gateway | Request flow Client → Gateway → Agent | Linear Flow | "Request Flow — Từ Client Đến AI" |

---

## Slide 1: OpenClaw — 23+ AI Providers

**Section:** Tổng quan providers
**Script context:** OpenClaw là nền tảng kết nối đa nhà cung cấp AI, hỗ trợ 23+ providers từ Anthropic, OpenAI đến các provider local như Ollama
**Layout:** Hub-and-Spoke

### Prompt

```
A developer explainer diagram drawn on a matte black chalkboard background. TITLE AT TOP: "OpenClaw — 23+ AI Providers" Subtitle: "Một Nền Tảng, Mọi AI Model" LAYOUT: hub-and-spoke diagram. CENTER: large rounded gold circle with robot doodle icon text: OpenClaw. Surrounding 8 spokes evenly distributed connected by chalk lines from center. Spoke 1 (green panel with chalk sparkle effects): brain icon text: Anthropic, small caption: "Claude Code CLI", small gold star icon next to it with text: "Tốt Nhất". Spoke 2 (blue panel): gear icon text: OpenAI, small caption: "API + Codex". Spoke 3 (blue panel): cloud icon text: Amazon Bedrock, small caption: "AWS". Spoke 4 (purple panel): server rack icon text: Ollama, small caption: "Local Models". Spoke 5 (blue panel): globe icon text: OpenRouter, small caption: "Multi-Model". Spoke 6 (blue panel): database cylinder icon text: LiteLLM, small caption: "Unified Gateway". Spoke 7 (gray panel): server rack icon text: Mistral + Together AI, small caption: "Open Source". Spoke 8 (gray panel): globe icon text: Qwen + GLM + MiniMax, small caption: "China Providers". Below the diagram: dashed chalk box with text: "+15 providers" followed by small labels: NVIDIA, Hugging Face, vLLM, Cloudflare, Vercel, Venice AI, Deepgram. SIGNATURE: small chalk-style text "@tranvanhoang.com" in the bottom-right corner of the image as a subtle watermark signature. STYLE REQUIREMENTS: hand-drawn chalkboard explainer style white chalk handwritten typography slightly imperfect handwritten strokes chalk marker lettering looks like hand written with a chalk pen on a blackboard NOT a modern sans-serif font NOT typed text NOT digital UI font TEXT STYLE: clean readable chalk handwriting solid white strokes no chalk dust no speckled texture high contrast readable letters VISUAL STYLE: hand drawn developer whiteboard diagram chalkboard presentation slide engineering explainer diagram clean chalk marker lines minimal texture presentation quality readability NEGATIVE PROMPT: modern sans serif font helvetica font arial font clean digital UI typography vector UI infographic photorealistic 3D render glossy UI
```

---

## Slide 2: Tại Sao Chọn Claude Subscription?

**Section:** So sánh providers — nhấn mạnh Claude là lựa chọn tốt nhất
**Script context:** Claude subscription đang là lựa chọn tốt nhất cho coding với OpenClaw nhờ CLI integration, code quality, context window lớn, và hỗ trợ tiếng Việt
**Layout:** Scoreboard / Metrics Dashboard

### Prompt

```
A developer explainer diagram drawn on a matte black chalkboard background. TITLE AT TOP: "Tại Sao Chọn Claude?" Subtitle: "So Sánh 3 Provider Hàng Đầu" LAYOUT: horizontal row of 3 metric cards across 16:9 width. Card 1 (green panel, LARGER than others as hero card, chalk sparkle effects around it): large gold star icon at top, large chalk text: Claude, below: brain icon, four small green labels stacked: "CLI Tích Hợp", "Code Gen #1", "200K Context", "Tiếng Việt Tốt", at bottom: gold banner text: "Lựa Chọn Tốt Nhất" with chalk sparkle. Card 2 (blue panel, normal size): gear icon at top, large chalk text: OpenAI, below: three small blue labels stacked: "GPT-5.4", "Codex Sub", "API Key", at bottom: small text: "Phổ Biến". Card 3 (gray panel, normal size): server icon at top, large chalk text: Ollama, below: three small gray labels stacked: "Local", "Miễn Phí", "Tự Host", at bottom: small text: "Nâng Cao". Below all cards: dashed chalk line, below that: chalk text: "Gợi Ý: Bắt Đầu Với Claude → Thêm Provider Sau" with curved chalk arrow pointing to Card 1. SIGNATURE: small chalk-style text "@tranvanhoang.com" in the bottom-right corner of the image as a subtle watermark signature. STYLE REQUIREMENTS: hand-drawn chalkboard explainer style white chalk handwritten typography slightly imperfect handwritten strokes chalk marker lettering looks like hand written with a chalk pen on a blackboard NOT a modern sans-serif font NOT typed text NOT digital UI font TEXT STYLE: clean readable chalk handwriting solid white strokes no chalk dust no speckled texture high contrast readable letters VISUAL STYLE: hand drawn developer whiteboard diagram chalkboard presentation slide engineering explainer diagram clean chalk marker lines minimal texture presentation quality readability NEGATIVE PROMPT: modern sans serif font helvetica font arial font clean digital UI typography vector UI infographic photorealistic 3D render glossy UI
```

---

## Slide 3: API Key vs Codex Subscription

**Section:** Chi tiết OpenAI — 2 cách kết nối
**Script context:** OpenClaw hỗ trợ 2 cách kết nối OpenAI: API Key trả theo usage hoặc Codex Subscription qua OAuth
**Layout:** Split Comparison

### Prompt

```
A developer explainer diagram drawn on a matte black chalkboard background. TITLE AT TOP: "Kết Nối OpenAI — 2 Cách" Subtitle: "API Key vs Codex Subscription" LAYOUT: split layout with a vertical dashed chalk divider spanning full 16:9 width. LEFT SIDE Title: "Option A: API Key". Three stacked panels connected by curved chalk arrows top to bottom. Top panel (blue): key icon text: "Lấy Key Từ Dashboard", small caption: "platform.openai.com". Middle panel (blue): terminal window icon text: "Chạy Onboard", small code text: openclaw onboard --openai-api-key. Bottom panel (gold): dollar sign icon text: "Trả Theo Usage", caption: "Pay-per-token". Small label: "Linh Hoạt". RIGHT SIDE Title: "Option B: Codex Sub". Three stacked panels connected by curved chalk arrows top to bottom. Top panel (purple): user silhouette icon text: "Đăng Nhập ChatGPT", small caption: "OAuth Sign-in". Middle panel (purple): terminal window icon text: "Auth Login", small code text: openclaw models auth login --provider openai-codex. Bottom panel (green): checkmark icon text: "Dùng Subscription", caption: "Trả Theo Tháng". Small label: "Đơn Giản". Below the split: dashed chalk box spanning full width with gold star icon and text: "Tip: Claude Subscription Vẫn Là Lựa Chọn Tốt Nhất Cho Coding!" with chalk sparkle effects. SIGNATURE: small chalk-style text "@tranvanhoang.com" in the bottom-right corner of the image as a subtle watermark signature. STYLE REQUIREMENTS: hand-drawn chalkboard explainer style white chalk handwritten typography slightly imperfect handwritten strokes chalk marker lettering looks like hand written with a chalk pen on a blackboard NOT a modern sans-serif font NOT typed text NOT digital UI font TEXT STYLE: clean readable chalk handwriting solid white strokes no chalk dust no speckled texture high contrast readable letters VISUAL STYLE: hand drawn developer whiteboard diagram chalkboard presentation slide engineering explainer diagram clean chalk marker lines minimal texture presentation quality readability NEGATIVE PROMPT: modern sans serif font helvetica font arial font clean digital UI typography vector UI infographic photorealistic 3D render glossy UI
```

---

## Slide 4: OpenAI Models Trên OpenClaw

**Section:** Chi tiết OpenAI — Models hỗ trợ
**Script context:** OpenClaw hỗ trợ GPT-5.4, GPT-5.4-pro qua API key và GPT-5.4 qua Codex subscription
**Layout:** Grid / Matrix

### Prompt

```
A developer explainer diagram drawn on a matte black chalkboard background. TITLE AT TOP: "OpenAI Models Trên OpenClaw" Subtitle: "Model Nào, Kết Nối Nào?" LAYOUT: 3x3 grid matrix centered in 16:9 frame. Column headers (top row, bold chalk text): Model | "Kết Nối" | "Ghi Chú". Row 1: blue panel text: openai/gpt-5.4 | blue panel with key icon text: API Key | gray panel text: "Mạnh Nhất". Row 2: purple panel text: openai/gpt-5.4-pro | purple panel with key icon text: API Key | gold panel text: "Pro Features". Row 3: green panel text: openai-codex/gpt-5.4 | green panel with user icon text: Codex Sub | green panel text: "Dùng Sub Có Sẵn". Grid lines: dashed chalk lines between cells. Below the grid: dashed chalk box with text: "Format: provider/model" and small example: openai/gpt-5.4. Right side of box: gold star with text: "Claude Vẫn Tốt Hơn Cho Code!" with chalk sparkle. SIGNATURE: small chalk-style text "@tranvanhoang.com" in the bottom-right corner of the image as a subtle watermark signature. STYLE REQUIREMENTS: hand-drawn chalkboard explainer style white chalk handwritten typography slightly imperfect handwritten strokes chalk marker lettering looks like hand written with a chalk pen on a blackboard NOT a modern sans-serif font NOT typed text NOT digital UI font TEXT STYLE: clean readable chalk handwriting solid white strokes no chalk dust no speckled texture high contrast readable letters VISUAL STYLE: hand drawn developer whiteboard diagram chalkboard presentation slide engineering explainer diagram clean chalk marker lines minimal texture presentation quality readability NEGATIVE PROMPT: modern sans serif font helvetica font arial font clean digital UI typography vector UI infographic photorealistic 3D render glossy UI
```

---

## Slide 5: Tính Năng Nâng Cao OpenAI

**Section:** Chi tiết OpenAI — Transport, Warm-up, Priority, Compaction
**Script context:** OpenClaw hỗ trợ nhiều tính năng nâng cao khi dùng OpenAI: 3 transport modes, WebSocket warm-up, priority processing, và server-side compaction
**Layout:** Layered Stack

### Prompt

```
A developer explainer diagram drawn on a matte black chalkboard background. TITLE AT TOP: "Tính Năng Nâng Cao" Subtitle: "OpenAI Provider Config" LAYOUT: layered stack of 4 horizontal panels stacked vertically centered in 16:9 frame, top-to-bottom. Top layer (blue panel, widest): globe icon text: Transport Modes, right side three small labels: SSE | WebSocket | Auto, small caption: "Auto = WS First, SSE Fallback". Vertical dashed chalk arrow down. Second layer (gold panel): lightning bolt icon text: WebSocket Warm-up, right side: clock icon with text: "Giảm Latency", small caption: "Bật Mặc Định — Nhanh Hơn Từ Lượt Đầu". Vertical dashed chalk arrow down. Third layer (purple panel): server rack icon text: Priority Processing, right side four small labels: auto | default | flex | priority, small caption: "Chọn Mức Ưu Tiên". Vertical dashed chalk arrow down. Bottom layer (green panel): database cylinder icon text: Server-Side Compaction, right side: text "70% Context", small caption: "Tự Động Nén Khi Gần Hết Context Window". Labels on left side from top to bottom: "Network" "Speed" "Priority" "Memory". Below the stack: dashed chalk box with gold star icon and text: "Nhớ: Claude + OpenClaw = Combo Tốt Nhất!" with chalk sparkle effects. SIGNATURE: small chalk-style text "@tranvanhoang.com" in the bottom-right corner of the image as a subtle watermark signature. STYLE REQUIREMENTS: hand-drawn chalkboard explainer style white chalk handwritten typography slightly imperfect handwritten strokes chalk marker lettering looks like hand written with a chalk pen on a blackboard NOT a modern sans-serif font NOT typed text NOT digital UI font TEXT STYLE: clean readable chalk handwriting solid white strokes no chalk dust no speckled texture high contrast readable letters VISUAL STYLE: hand drawn developer whiteboard diagram chalkboard presentation slide engineering explainer diagram clean chalk marker lines minimal texture presentation quality readability NEGATIVE PROMPT: modern sans serif font helvetica font arial font clean digital UI typography vector UI infographic photorealistic 3D render glossy UI
```

---

## Slide 6: PI — Nhúng AI Agent Vào OpenClaw

**Section:** PI Integration Architecture
**Script context:** OpenClaw không chạy Pi như subprocess mà nhúng trực tiếp Pi Agent SDK vào bên trong — tạo AgentSession, inject tools, custom system prompt, session persistence
**Layout:** Sandwich / Wrapper Pattern

### Prompt

```
A developer explainer diagram drawn on a matte black chalkboard background. TITLE AT TOP: "PI — Nhúng AI Agent" Subtitle: "Embedded, Không Phải Subprocess" LAYOUT: concentric rounded rectangles (3 layers) centered in 16:9 frame. OUTER layer (blue panel, largest): text: OpenClaw Gateway, small icons on corners: speech bubble (Discord), envelope (Telegram), smartphone (WhatsApp), monitor (WebChat). MIDDLE layer (gold panel): text: PI Embedded Runner, small caption below: runEmbeddedPiAgent(), three small labels inside: "Custom Tools" "System Prompt" "Session Persist". INNER layer (green panel with chalk sparkle effects, smallest): brain icon text: AgentSession, small caption: createAgentSession(), small label: "Claude / GPT / Gemini". Chalk arrows on left side entering from outside to inside with label: "Tin Nhắn Đến". Chalk arrows on right side exiting from inside to outside with label: "Trả Lời". Below the diagram: dashed chalk box with four small blue panels in a row: pi-ai | pi-agent-core | pi-coding-agent | pi-tui, caption above: "4 Packages". SIGNATURE: small chalk-style text "@tranvanhoang.com" in the bottom-right corner of the image as a subtle watermark signature. STYLE REQUIREMENTS: hand-drawn chalkboard explainer style white chalk handwritten typography slightly imperfect handwritten strokes chalk marker lettering looks like hand written with a chalk pen on a blackboard NOT a modern sans-serif font NOT typed text NOT digital UI font TEXT STYLE: clean readable chalk handwriting solid white strokes no chalk dust no speckled texture high contrast readable letters VISUAL STYLE: hand drawn developer whiteboard diagram chalkboard presentation slide engineering explainer diagram clean chalk marker lines minimal texture presentation quality readability NEGATIVE PROMPT: modern sans serif font helvetica font arial font clean digital UI typography vector UI infographic photorealistic 3D render glossy UI
```

---

## Slide 7: Tool Pipeline — 6 Tầng Xử Lý

**Section:** PI Integration — Tool Architecture
**Script context:** Tools đi qua 6 tầng xử lý: base tools → custom replacements → platform tools → policy filtering → schema normalization → signal wrapping
**Layout:** Layered Stack

### Prompt

```
A developer explainer diagram drawn on a matte black chalkboard background. TITLE AT TOP: "Tool Pipeline — 6 Tầng" Subtitle: "Từ Core Tools Đến Agent" LAYOUT: layered stack of 6 horizontal panels stacked vertically centered in 16:9 frame, top-to-bottom with curved chalk arrows between each layer pointing downward. Layer 1 (blue panel): gear icon text: "1. Base Tools", right side small labels: read | bash | edit | write, small caption: "Pi Core". Curved chalk arrow down. Layer 2 (gold panel): gear icon with wrench text: "2. Custom Tools", right side small labels: sandbox exec | process, small caption: "OpenClaw Thay Thế". Curved chalk arrow down. Layer 3 (purple panel): speech bubble icon text: "3. Platform Tools", right side small labels: Discord | Telegram | Slack | WhatsApp, small caption: "Theo Kênh". Curved chalk arrow down. Layer 4 (red panel): lock icon text: "4. Policy Filter", right side small labels: profile | provider | group, small caption: "Phân Quyền". Curved chalk arrow down. Layer 5 (gold panel): gear icon text: "5. Schema Normalize", right side small labels: Gemini fix | OpenAI fix, small caption: "Tương Thích Provider". Curved chalk arrow down. Layer 6 (green panel with chalk sparkle effects): checkmark icon text: "6. Signal Wrap", right side: text: Abort Signal, small caption: "Hủy Bỏ An Toàn". Left side labels from top to bottom: "Core" "Replace" "Channel" "Auth" "Compat" "Safe". SIGNATURE: small chalk-style text "@tranvanhoang.com" in the bottom-right corner of the image as a subtle watermark signature. STYLE REQUIREMENTS: hand-drawn chalkboard explainer style white chalk handwritten typography slightly imperfect handwritten strokes chalk marker lettering looks like hand written with a chalk pen on a blackboard NOT a modern sans-serif font NOT typed text NOT digital UI font TEXT STYLE: clean readable chalk handwriting solid white strokes no chalk dust no speckled texture high contrast readable letters VISUAL STYLE: hand drawn developer whiteboard diagram chalkboard presentation slide engineering explainer diagram clean chalk marker lines minimal texture presentation quality readability NEGATIVE PROMPT: modern sans serif font helvetica font arial font clean digital UI typography vector UI infographic photorealistic 3D render glossy UI
```

---

## Slide 8: Gateway Architecture

**Section:** Gateway — Kiến trúc tổng quan
**Script context:** Gateway là daemon trung tâm kết nối tất cả messaging providers, expose WebSocket API, quản lý clients, nodes, và canvas host
**Layout:** Hub-and-Spoke

### Prompt

```
A developer explainer diagram drawn on a matte black chalkboard background. TITLE AT TOP: "Gateway Architecture" Subtitle: "Trung Tâm Điều Khiển OpenClaw" LAYOUT: hub-and-spoke diagram. CENTER: large rounded gold circle with server rack icon text: Gateway, small caption: "127.0.0.1:18789", small label: WebSocket API. TOP spokes (Messaging Providers) connected by chalk lines from center, 5 spokes in upper half: Spoke 1 (green panel): speech bubble icon text: WhatsApp. Spoke 2 (blue panel): envelope icon text: Telegram. Spoke 3 (purple panel): speech bubble icon text: Discord. Spoke 4 (blue panel): envelope icon text: Slack. Spoke 5 (gray panel): smartphone icon text: iMessage. BOTTOM-LEFT spokes (Clients) connected by chalk lines, 3 spokes: Spoke 6 (blue panel): laptop icon text: macOS App, small label: "role: client". Spoke 7 (blue panel): terminal window icon text: CLI, small label: "role: client". Spoke 8 (blue panel): globe icon text: Web UI, small label: "role: client". BOTTOM-RIGHT spokes (Nodes) connected by chalk lines, 2 spokes: Spoke 9 (gold panel): smartphone icon text: iOS/Android, small label: "role: node". Spoke 10 (gold panel): monitor icon text: "Headless", small label: "role: node". Below the diagram: small dashed chalk box with lock icon and text: "Pairing-Based Trust — Local Auto-Approve, Remote Challenge Nonce". SIGNATURE: small chalk-style text "@tranvanhoang.com" in the bottom-right corner of the image as a subtle watermark signature. STYLE REQUIREMENTS: hand-drawn chalkboard explainer style white chalk handwritten typography slightly imperfect handwritten strokes chalk marker lettering looks like hand written with a chalk pen on a blackboard NOT a modern sans-serif font NOT typed text NOT digital UI font TEXT STYLE: clean readable chalk handwriting solid white strokes no chalk dust no speckled texture high contrast readable letters VISUAL STYLE: hand drawn developer whiteboard diagram chalkboard presentation slide engineering explainer diagram clean chalk marker lines minimal texture presentation quality readability NEGATIVE PROMPT: modern sans serif font helvetica font arial font clean digital UI typography vector UI infographic photorealistic 3D render glossy UI
```

---

## Slide 9: Request Flow — Từ Client Đến AI

**Section:** Gateway — Request flow
**Script context:** Client kết nối → handshake → subscribe events → gửi agent request → Gateway stream response từ PI Agent
**Layout:** Linear Flow

### Prompt

```
A developer explainer diagram drawn on a matte black chalkboard background. TITLE AT TOP: "Request Flow" Subtitle: "Từ Client Đến AI Agent" LAYOUT: linear horizontal flow with 6 panels connected by curved chalk arrows, left-to-right direction spanning full 16:9 width. Panel 1 (blue panel): laptop icon text: Client, caption: "req:connect", small text: WebSocket. Curved chalk arrow right. Panel 2 (gold panel): lock icon text: Handshake, caption: "Challenge Nonce", small text: "Sign + Verify". Curved chalk arrow right. Panel 3 (blue panel): checkmark icon text: "Snapshot", caption: "Presence + Health", small text: "ACK". Curved chalk arrow right. Panel 4 (purple panel): speech bubble icon text: "Agent Request", caption: "Gửi Tin Nhắn", small text: "Subscribe Events". Curved chalk arrow right. Panel 5 (gold panel): brain icon text: PI Agent, caption: "Xử Lý + Tools", small text: "Stream Events". Curved chalk arrow right. Panel 6 (green panel with chalk sparkle effects): checkmark icon text: "Response", caption: "Trả Lời User", small text: "Qua Kênh Chat". Below the flow: dashed chalk box with text: "Events:" followed by five small labels: agent | chat | presence | health | heartbeat. Right side: small gold star with text: "Claude = Best Agent Model". SIGNATURE: small chalk-style text "@tranvanhoang.com" in the bottom-right corner of the image as a subtle watermark signature. STYLE REQUIREMENTS: hand-drawn chalkboard explainer style white chalk handwritten typography slightly imperfect handwritten strokes chalk marker lettering looks like hand written with a chalk pen on a blackboard NOT a modern sans-serif font NOT typed text NOT digital UI font TEXT STYLE: clean readable chalk handwriting solid white strokes no chalk dust no speckled texture high contrast readable letters VISUAL STYLE: hand drawn developer whiteboard diagram chalkboard presentation slide engineering explainer diagram clean chalk marker lines minimal texture presentation quality readability NEGATIVE PROMPT: modern sans serif font helvetica font arial font clean digital UI typography vector UI infographic photorealistic 3D render glossy UI
```
