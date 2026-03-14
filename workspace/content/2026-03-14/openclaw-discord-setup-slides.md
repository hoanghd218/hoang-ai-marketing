# Slide Prompts — Cài Đặt OpenClaw Trên Discord

**Source:** https://docs.openclaw.ai/channels/discord
**Total slides:** 3
**Style:** Chalkboard Dev Explainer
**Aspect ratio:** 16:9

---

## Slide Plan

| # | Section | Concept | Layout | Title |
|---|---------|---------|--------|-------|
| 1 | Bước 1-3 | Tạo Discord Bot + lấy Token | Vertical Step Ladder | Tạo Discord Bot |
| 2 | Bước 4 | Cấu hình Permissions & Intents | Grid / Matrix | Quyền Và Intents |
| 3 | Bước 5-9 | Kết nối OpenClaw + Pairing | Linear Flow | Kết Nối OpenClaw + Discord |

---

## Slide 1: Tạo Discord Bot & Lấy Token

**Section:** Bước 1-3 — Discord Developer Portal
**Script context:** Vào Discord Developer Portal tạo Application mới, thêm Bot, copy Token để xác thực.
**Layout:** Vertical Step Ladder

### Prompt

```
A developer explainer diagram drawn on a matte black chalkboard background. TITLE AT TOP: "Tạo Discord Bot" Subtitle: "Developer Portal → Bot → Token" LAYOUT: vertical step ladder with 4 numbered steps. Step 1 (blue panel): monitor icon, text: Discord Developer Portal, caption: "Tạo Application Mới". Curved chalk arrow down. Step 2 (blue panel): robot doodle icon, text: "Thêm Bot", caption: "Đặt Tên Cho Agent". Curved chalk arrow down. Step 3 (gold panel): gear/cog icon, text: "Bật Intents", caption: Message Content + Server Members. Curved chalk arrow down. Step 4 (green panel): checkmark icon, text: "Copy Token", caption: "Lưu Token An Toàn". Numbers: large chalk-drawn numerals (1, 2, 3, 4) on the left side. A small red warning triangle at bottom with text: "Token = Mật Khẩu — Không Commit Lên Git" SIGNATURE: small chalk-style text "@tranvanhoang.com" in the bottom-right corner of the image as a subtle watermark signature. STYLE REQUIREMENTS: hand-drawn chalkboard explainer style white chalk handwritten typography slightly imperfect handwritten strokes chalk marker lettering looks like hand written with a chalk pen on a blackboard NOT a modern sans-serif font NOT typed text NOT digital UI font TEXT STYLE: clean readable chalk handwriting solid white strokes no chalk dust no speckled texture high contrast readable letters VISUAL STYLE: hand drawn developer whiteboard diagram chalkboard presentation slide engineering explainer diagram clean chalk marker lines minimal texture presentation quality readability NEGATIVE PROMPT: modern sans serif font helvetica font arial font clean digital UI typography vector UI infographic photorealistic 3D render glossy UI
```

---

## Slide 2: Permissions & Intents

**Section:** Bước 4 — Cấu hình quyền cho Bot
**Script context:** Chọn OAuth2 scopes (bot + applications.commands) và Bot Permissions (View Channels, Send Messages, Read History, Embed Links, Attach Files). Bật Gateway Intents cần thiết.
**Layout:** Grid / Matrix

### Prompt

```
A developer explainer diagram drawn on a matte black chalkboard background. TITLE AT TOP: "Quyền Và Intents" Subtitle: "Cấu Hình Cho Discord Bot" LAYOUT: two sections side-by-side spanning full 16:9 width. LEFT SECTION (~55% width): title "Bot Permissions" in gold chalk. A 2x3 grid of small panels: Row 1: green panel with checkmark icon text: View Channels, green panel with checkmark icon text: Send Messages. Row 2: green panel with checkmark icon text: Read History, green panel with checkmark icon text: Embed Links. Row 3: green panel with checkmark icon text: Attach Files, gray panel with question mark icon text: Add Reactions, caption: "(Optional)". Dashed chalk grid lines separating cells. RIGHT SECTION (~40% width): title "Gateway Intents" in gold chalk. 3 stacked panels: Top panel (green, largest): bell notification icon, text: Message Content, label: "Required" with green checkmark. Middle panel (blue): user silhouette icon, text: Server Members, label: "Recommended". Bottom panel (gray): clock icon, text: Presence, label: "Optional". Small chalk note at bottom center: OAuth2 Scopes: bot + applications.commands SIGNATURE: small chalk-style text "@tranvanhoang.com" in the bottom-right corner of the image as a subtle watermark signature. STYLE REQUIREMENTS: hand-drawn chalkboard explainer style white chalk handwritten typography slightly imperfect handwritten strokes chalk marker lettering looks like hand written with a chalk pen on a blackboard NOT a modern sans-serif font NOT typed text NOT digital UI font TEXT STYLE: clean readable chalk handwriting solid white strokes no chalk dust no speckled texture high contrast readable letters VISUAL STYLE: hand drawn developer whiteboard diagram chalkboard presentation slide engineering explainer diagram clean chalk marker lines minimal texture presentation quality readability NEGATIVE PROMPT: modern sans serif font helvetica font arial font clean digital UI typography vector UI infographic photorealistic 3D render glossy UI
```

---

## Slide 3: Kết Nối OpenClaw Với Discord

**Section:** Bước 5-9 — Config + Pairing
**Script context:** Set token trong OpenClaw config, chạy gateway, DM bot để nhận pairing code, approve code để hoàn tất kết nối.
**Layout:** Linear Flow

### Prompt

```
A developer explainer diagram drawn on a matte black chalkboard background. TITLE AT TOP: "Kết Nối OpenClaw + Discord" Subtitle: "Config → Gateway → Pairing → Done" LAYOUT: linear horizontal flow with 4 panels connected by curved chalk arrows, left-to-right direction. Panel 1 (blue panel): terminal window icon, text: Config Token, caption: openclaw config set, small code text: channels.discord.token. Curved chalk arrow right. Panel 2 (blue panel): server rack icon, text: "Chạy Gateway", caption: openclaw gateway, small code text: channels.discord.enabled = true. Curved chalk arrow right. Panel 3 (gold panel): speech bubble icon, text: DM Bot, caption: "Nhận Pairing Code", small text: "Code Hết Hạn Sau 1h". Curved chalk arrow right. Panel 4 (green panel with chalk sparkle effects): checkmark icon, text: Approve Code, caption: openclaw pairing approve, small text: "Kết Nối Thành Công!". Below the flow: a dashed chalk box with terminal window icon and text: "Kiểm Tra:" followed by three small blue labels: openclaw doctor, openclaw channels status, openclaw logs. SIGNATURE: small chalk-style text "@tranvanhoang.com" in the bottom-right corner of the image as a subtle watermark signature. STYLE REQUIREMENTS: hand-drawn chalkboard explainer style white chalk handwritten typography slightly imperfect handwritten strokes chalk marker lettering looks like hand written with a chalk pen on a blackboard NOT a modern sans-serif font NOT typed text NOT digital UI font TEXT STYLE: clean readable chalk handwriting solid white strokes no chalk dust no speckled texture high contrast readable letters VISUAL STYLE: hand drawn developer whiteboard diagram chalkboard presentation slide engineering explainer diagram clean chalk marker lines minimal texture presentation quality readability NEGATIVE PROMPT: modern sans serif font helvetica font arial font clean digital UI typography vector UI infographic photorealistic 3D render glossy UI
```
