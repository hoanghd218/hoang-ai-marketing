# Slide Prompts — OpenClaw Agent Concepts

**Source:** OpenClaw Documentation (agent, agent-loop, system-prompt, context, agent-workspace)
**Total slides:** 8
**Style:** Chalkboard Dev Explainer
**Aspect ratio:** 16:9

---

## Slide Plan

| # | Section | Concept | Layout | Title |
|---|---------|---------|--------|-------|
| 1 | Agent Overview | Agent runtime + 6 bootstrap files | Hub-and-Spoke | OpenClaw Agent |
| 2 | Agent Loop | 4-stage pipeline | Linear Flow | Agent Loop |
| 3 | Agent Loop Detail | Agentic loop cycle | Circular Loop | Vòng Lặp Agent |
| 4 | System Prompt | Prompt layers | Layered Stack | System Prompt |
| 5 | Prompt Modes | Full vs Minimal vs None | Split Comparison | 3 Prompt Modes |
| 6 | Context | Everything in context window | Input → Transform → Output | Context Window |
| 7 | Workspace | Workspace files & structure | Hub-and-Spoke | Agent Workspace |
| 8 | Workspace vs Config | Workspace vs ~/.openclaw/ | Split Comparison | Workspace vs Config |

---

## Slide 1: OpenClaw Agent Overview

**Section:** Agent Overview
**Doc context:** OpenClaw operates a single embedded agent runtime using a workspace directory. On startup, 6 bootstrap files are injected into context.
**Layout:** Hub-and-Spoke

### Prompt

```
A developer explainer diagram drawn on a matte black chalkboard background. TITLE AT TOP: "OpenClaw Agent" Subtitle: "Kiến Trúc Tổng Quan" LAYOUT: hub-and-spoke diagram. CENTER: large rounded blue panel with robot doodle icon text: OpenClaw Agent Runtime. Surrounding 6 spokes evenly distributed connected by chalk lines from center. Spoke 1 (green panel): document icon text: AGENTS.md. Caption: "Hướng Dẫn Hoạt Động". Spoke 2 (purple panel): heart icon text: SOUL.md. Caption: "Tính Cách & Giới Hạn". Spoke 3 (gold panel): gear icon text: TOOLS.md. Caption: "Hướng Dẫn Công Cụ". Spoke 4 (blue panel): user silhouette icon text: USER.md. Caption: "Thông Tin Người Dùng". Spoke 5 (red panel): lightning bolt icon text: BOOTSTRAP.md. Caption: "Khởi Tạo Lần Đầu". Spoke 6 (gray panel): badge icon text: IDENTITY.md. Caption: "Tên & Nhận Diện". Each spoke: rounded soft panel with white chalk outline. Small chalk annotation near center: "6 Bootstrap Files" with a curved arrow pointing outward. SIGNATURE: small chalk-style text "@tranvanhoang.com" in the bottom-right corner of the image as a subtle watermark signature. STYLE REQUIREMENTS: hand-drawn chalkboard explainer style white chalk handwritten typography slightly imperfect handwritten strokes chalk marker lettering looks like hand written with a chalk pen on a blackboard NOT a modern sans-serif font NOT typed text NOT digital UI font TEXT STYLE: clean readable chalk handwriting solid white strokes no chalk dust no speckled texture high contrast readable letters VISUAL STYLE: hand drawn developer whiteboard diagram chalkboard presentation slide engineering explainer diagram clean chalk marker lines minimal texture presentation quality readability NEGATIVE PROMPT: modern sans serif font helvetica font arial font clean digital UI typography vector UI infographic photorealistic 3D render glossy UI
```

---

## Slide 2: Agent Loop — 4-Stage Pipeline

**Section:** Agent Loop
**Doc context:** The execution follows a four-stage pipeline: RPC handling → Command execution → Pi Agent runtime → Event bridging.
**Layout:** Linear Flow

### Prompt

```
A developer explainer diagram drawn on a matte black chalkboard background. TITLE AT TOP: "Agent Loop Pipeline" Subtitle: "4 Giai Đoạn Xử Lý" LAYOUT: linear horizontal flow with 4 panels connected by thick curved chalk arrows left to right spanning full 16:9 width. Panel 1 (blue): envelope icon text: "1. RPC". Caption: "Nhận Yêu Cầu". Small annotations below: "validate params" "resolve session". Panel 2 (gold): gear icon text: "2. Command". Caption: "Chuẩn Bị". Small annotations below: "load skills" "resolve model". Panel 3 (purple): server rack icon with brain icon text: "3. Pi Agent". Caption: "Suy Luận & Công Cụ". Small annotations below: "inference" "tool execution". Panel 4 (green): lightning bolt icon text: "4. Event Bridge". Caption: "Trả Kết Quả". Small annotations below: "stream events" "persist session". Each panel: rounded soft panel with white chalk outline. Below the flow: dashed chalk line with small clock icon and text: "Timeout: 600s". SIGNATURE: small chalk-style text "@tranvanhoang.com" in the bottom-right corner of the image as a subtle watermark signature. STYLE REQUIREMENTS: hand-drawn chalkboard explainer style white chalk handwritten typography slightly imperfect handwritten strokes chalk marker lettering looks like hand written with a chalk pen on a blackboard NOT a modern sans-serif font NOT typed text NOT digital UI font TEXT STYLE: clean readable chalk handwriting solid white strokes no chalk dust no speckled texture high contrast readable letters VISUAL STYLE: hand drawn developer whiteboard diagram chalkboard presentation slide engineering explainer diagram clean chalk marker lines minimal texture presentation quality readability NEGATIVE PROMPT: modern sans serif font helvetica font arial font clean digital UI typography vector UI infographic photorealistic 3D render glossy UI
```

---

## Slide 3: Vòng Lặp Agent (Agentic Loop)

**Section:** Agent Loop Detail
**Doc context:** Agentic loop: intake → context assembly → model inference → tool execution → streaming replies → persistence.
**Layout:** Circular Loop

### Prompt

```
A developer explainer diagram drawn on a matte black chalkboard background. TITLE AT TOP: "Vòng Lặp Agent" Subtitle: "Intake → Inference → Tool → Reply" LAYOUT: circular loop with 5 chalk-drawn nodes arranged in a large circle centered in the 16:9 frame connected by thick curved chalk arrows forming a continuous clockwise loop. Top node (blue panel): envelope icon text: "1. Intake". Caption: "Nhận Tin Nhắn". Top-right node (gold panel): document with magnifying glass icon text: "2. Context". Caption: "Lắp Ráp Ngữ Cảnh". Right-bottom node (purple panel): brain icon text: "3. Inference". Caption: "Suy Luận AI". Left-bottom node (gold panel): gear icon text: "4. Tool Exec". Caption: "Thực Thi Công Cụ". Top-left node (green panel): speech bubble icon text: "5. Reply". Caption: "Trả Lời & Lưu". CENTER of the circle: large chalk text: Agent Loop with small robot doodle. Below the circle: small chalk annotation: "Lặp lại cho đến khi hoàn thành". SIGNATURE: small chalk-style text "@tranvanhoang.com" in the bottom-right corner of the image as a subtle watermark signature. STYLE REQUIREMENTS: hand-drawn chalkboard explainer style white chalk handwritten typography slightly imperfect handwritten strokes chalk marker lettering looks like hand written with a chalk pen on a blackboard NOT a modern sans-serif font NOT typed text NOT digital UI font TEXT STYLE: clean readable chalk handwriting solid white strokes no chalk dust no speckled texture high contrast readable letters VISUAL STYLE: hand drawn developer whiteboard diagram chalkboard presentation slide engineering explainer diagram clean chalk marker lines minimal texture presentation quality readability NEGATIVE PROMPT: modern sans serif font helvetica font arial font clean digital UI typography vector UI infographic photorealistic 3D render glossy UI
```

---

## Slide 4: System Prompt — Các Lớp Cấu Trúc

**Section:** System Prompt
**Doc context:** System prompt contains: Tooling, Safety, Skills, Self-Update, Workspace, Documentation, Bootstrap Files, Sandbox Info, Date & Time, Runtime Details.
**Layout:** Layered Stack

### Prompt

```
A developer explainer diagram drawn on a matte black chalkboard background. TITLE AT TOP: "System Prompt" Subtitle: "Cấu Trúc Nhiều Lớp" LAYOUT: layered stack of 6 horizontal panels stacked vertically centered in 16:9 frame, widest at top narrowing slightly. Top layer (blue panel): shield icon text: "Safety & Guardrails". Caption: "Giới Hạn An Toàn". Second layer (gold panel): gear icon text: "Tools & Skills". Caption: "Danh Sách Công Cụ". Third layer (purple panel): document icon text: "Bootstrap Files". Caption: "AGENTS.md SOUL.md USER.md". Fourth layer (green panel): server rack icon text: "Workspace & Docs". Caption: "Thư Mục Làm Việc". Fifth layer (gray panel): clock icon text: "Runtime Info". Caption: "OS, Model, Date/Time". Bottom layer (red panel): lightning bolt icon text: "Run Overrides". Caption: "Tuỳ Chỉnh Mỗi Lần Chạy". Vertical dashed chalk arrows between layers pointing downward. Left side bracket label: "OpenClaw System Prompt". Right side: small chalk annotation: "Token limit" with warning triangle. SIGNATURE: small chalk-style text "@tranvanhoang.com" in the bottom-right corner of the image as a subtle watermark signature. STYLE REQUIREMENTS: hand-drawn chalkboard explainer style white chalk handwritten typography slightly imperfect handwritten strokes chalk marker lettering looks like hand written with a chalk pen on a blackboard NOT a modern sans-serif font NOT typed text NOT digital UI font TEXT STYLE: clean readable chalk handwriting solid white strokes no chalk dust no speckled texture high contrast readable letters VISUAL STYLE: hand drawn developer whiteboard diagram chalkboard presentation slide engineering explainer diagram clean chalk marker lines minimal texture presentation quality readability NEGATIVE PROMPT: modern sans serif font helvetica font arial font clean digital UI typography vector UI infographic photorealistic 3D render glossy UI
```

---

## Slide 5: 3 Prompt Modes

**Section:** Prompt Modes
**Doc context:** Full mode (all sections for primary agents), Minimal mode (sub-agents, omits Skills/Memory/Self-Update), None (base identity only).
**Layout:** Split Comparison (3 columns)

### Prompt

```
A developer explainer diagram drawn on a matte black chalkboard background. TITLE AT TOP: "3 Prompt Modes" Subtitle: "Full — Minimal — None" LAYOUT: three horizontal panels side-by-side spanning full 16:9 width separated by vertical dashed chalk dividers. LEFT panel (~33% width) Title: "Full Mode" with green checkmark. Green border. Five stacked items with checkmarks: checkmark text: "Tools & Skills". checkmark text: "Safety". checkmark text: "Bootstrap Files". checkmark text: "Memory Recall". checkmark text: "Self-Update". Small robot doodle. Caption: "Agent Chính". CENTER panel (~33% width) Title: "Minimal Mode" with gold warning triangle. Gold border. Three items with checkmarks and two with X marks: checkmark text: "Tools". checkmark text: "Safety". checkmark text: "AGENTS.md TOOLS.md". X mark red text: "Skills Memory". X mark red text: "Self-Update". Small smaller robot doodle. Caption: "Sub-Agent". RIGHT panel (~33% width) Title: "None Mode" with gray circle. Gray border. Single item: checkmark text: "Base Identity". Four items with X marks: X mark text: "Tools". X mark text: "Skills". X mark text: "Bootstrap". X mark text: "Memory". Small minimalist dot. Caption: "Chỉ Danh Tính". SIGNATURE: small chalk-style text "@tranvanhoang.com" in the bottom-right corner of the image as a subtle watermark signature. STYLE REQUIREMENTS: hand-drawn chalkboard explainer style white chalk handwritten typography slightly imperfect handwritten strokes chalk marker lettering looks like hand written with a chalk pen on a blackboard NOT a modern sans-serif font NOT typed text NOT digital UI font TEXT STYLE: clean readable chalk handwriting solid white strokes no chalk dust no speckled texture high contrast readable letters VISUAL STYLE: hand drawn developer whiteboard diagram chalkboard presentation slide engineering explainer diagram clean chalk marker lines minimal texture presentation quality readability NEGATIVE PROMPT: modern sans serif font helvetica font arial font clean digital UI typography vector UI infographic photorealistic 3D render glossy UI
```

---

## Slide 6: Context Window — Mọi Thứ Gửi Đến Model

**Section:** Context
**Doc context:** Context = everything sent to model: System Prompt + Conversation History + Tool Calls/Results + Attachments, bounded by token limit.
**Layout:** Input → Transform → Output

### Prompt

```
A developer explainer diagram drawn on a matte black chalkboard background. TITLE AT TOP: "Context Window" Subtitle: "Mọi Thứ Gửi Đến Model" LAYOUT: three-section horizontal flow spanning full 16:9 width. LEFT (Input, ~35% width): 4 stacked panels representing inputs. Top panel (blue): document icon text: "System Prompt". Second panel (gold): speech bubble icon text: "Conversation History". Third panel (purple): gear icon text: "Tool Calls & Results". Bottom panel (gray): image icon text: "Attachments". Label above: "Đầu Vào". CENTER (Transform, ~30% width): larger green panel with brain and gear icon. text: "Model Inference". Sub-labels below in smaller text: "Token Limit" "Compaction" "Pruning". Small gauge meter drawing showing context fullness. RIGHT (Output, ~30% width): two stacked panels. Top panel (green): speech bubble icon text: "Assistant Reply". Bottom panel (gold): gear icon text: "Tool Actions". Label above: "Đầu Ra". Thick curved chalk arrows: Inputs → Model → Outputs. Below center: small chalk commands: "/status" "/context list" "/compact". SIGNATURE: small chalk-style text "@tranvanhoang.com" in the bottom-right corner of the image as a subtle watermark signature. STYLE REQUIREMENTS: hand-drawn chalkboard explainer style white chalk handwritten typography slightly imperfect handwritten strokes chalk marker lettering looks like hand written with a chalk pen on a blackboard NOT a modern sans-serif font NOT typed text NOT digital UI font TEXT STYLE: clean readable chalk handwriting solid white strokes no chalk dust no speckled texture high contrast readable letters VISUAL STYLE: hand drawn developer whiteboard diagram chalkboard presentation slide engineering explainer diagram clean chalk marker lines minimal texture presentation quality readability NEGATIVE PROMPT: modern sans serif font helvetica font arial font clean digital UI typography vector UI infographic photorealistic 3D render glossy UI
```

---

## Slide 7: Agent Workspace — Nhà Của Agent

**Section:** Workspace
**Doc context:** Workspace is the agent's home directory containing bootstrap files, memory, skills, and canvas. Default: ~/.openclaw/workspace.
**Layout:** Hub-and-Spoke

### Prompt

```
A developer explainer diagram drawn on a matte black chalkboard background. TITLE AT TOP: "Agent Workspace" Subtitle: "Nhà Của Agent" LAYOUT: hub-and-spoke diagram. CENTER: large rounded blue panel with laptop and home icon text: ~/.openclaw/workspace. Surrounding 6 spokes evenly distributed connected by chalk lines from center. Spoke 1 (green panel): document icon text: "Bootstrap Files". Caption: "AGENTS SOUL USER". Spoke 2 (purple panel): brain icon text: "memory/". Caption: "Nhật Ký Hàng Ngày". Spoke 3 (gold panel): gear icon text: "skills/". Caption: "Skill Overrides". Spoke 4 (blue panel): monitor icon text: "canvas/". Caption: "UI Files". Spoke 5 (gray panel): document icon text: MEMORY.md. Caption: "Bộ Nhớ Dài Hạn". Spoke 6 (red panel): clock icon text: HEARTBEAT.md. Caption: "Checklist Định Kỳ". Each spoke: rounded soft panel with white chalk outline. Bottom annotation: small chalk text: "Default cwd — Không Phải Sandbox". SIGNATURE: small chalk-style text "@tranvanhoang.com" in the bottom-right corner of the image as a subtle watermark signature. STYLE REQUIREMENTS: hand-drawn chalkboard explainer style white chalk handwritten typography slightly imperfect handwritten strokes chalk marker lettering looks like hand written with a chalk pen on a blackboard NOT a modern sans-serif font NOT typed text NOT digital UI font TEXT STYLE: clean readable chalk handwriting solid white strokes no chalk dust no speckled texture high contrast readable letters VISUAL STYLE: hand drawn developer whiteboard diagram chalkboard presentation slide engineering explainer diagram clean chalk marker lines minimal texture presentation quality readability NEGATIVE PROMPT: modern sans serif font helvetica font arial font clean digital UI typography vector UI infographic photorealistic 3D render glossy UI
```

---

## Slide 8: Workspace vs Config

**Section:** Workspace vs Config
**Doc context:** Workspace (~/.openclaw/workspace) is for agent files & memory. Config (~/.openclaw/) stores configuration, credentials, OAuth tokens, session transcripts.
**Layout:** Split Comparison

### Prompt

```
A developer explainer diagram drawn on a matte black chalkboard background. TITLE AT TOP: "Workspace vs Config" Subtitle: "Hai Thư Mục Khác Nhau" LAYOUT: split layout with a vertical dashed chalk divider spanning full 16:9 width. LEFT SIDE Title: "Workspace" with home icon. Green border. Path: ~/.openclaw/workspace. Four stacked panels with checkmarks. Panel 1 (green): document icon text: "Bootstrap Files". Caption: "AGENTS SOUL USER". Panel 2 (blue): brain icon text: "memory/". Caption: "Nhật Ký AI". Panel 3 (gold): gear icon text: "skills/". Caption: "Skill Overrides". Panel 4 (purple): monitor icon text: "canvas/". Caption: "UI Files". Small annotation: "Agent Làm Việc Ở Đây". Git icon with text: "Nên backup bằng Git". RIGHT SIDE Title: "Config ~/.openclaw/" with lock icon. Gray border. Four stacked panels. Panel 1 (gray): document icon text: "openclaw.json". Caption: "Cấu Hình Chính". Panel 2 (red): lock icon text: "Credentials". Caption: "OAuth Tokens". Panel 3 (blue): document icon text: "Sessions". Caption: "Lịch Sử Hội Thoại". Panel 4 (gold): gear icon text: "Managed Skills". Caption: "Skills Cài Đặt". Small annotation: "Không Chia Sẻ". Warning triangle with text: "Không Lưu Secrets Trong Workspace!" SIGNATURE: small chalk-style text "@tranvanhoang.com" in the bottom-right corner of the image as a subtle watermark signature. STYLE REQUIREMENTS: hand-drawn chalkboard explainer style white chalk handwritten typography slightly imperfect handwritten strokes chalk marker lettering looks like hand written with a chalk pen on a blackboard NOT a modern sans-serif font NOT typed text NOT digital UI font TEXT STYLE: clean readable chalk handwriting solid white strokes no chalk dust no speckled texture high contrast readable letters VISUAL STYLE: hand drawn developer whiteboard diagram chalkboard presentation slide engineering explainer diagram clean chalk marker lines minimal texture presentation quality readability NEGATIVE PROMPT: modern sans serif font helvetica font arial font clean digital UI typography vector UI infographic photorealistic 3D render glossy UI
```
