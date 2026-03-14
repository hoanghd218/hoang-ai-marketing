# Slide Prompts — Cài Đặt OpenClaw Trên Telegram

**Source:** https://docs.openclaw.ai/channels/telegram
**Total slides:** 3
**Style:** Chalkboard Dev Explainer
**Aspect ratio:** 16:9

---

## Slide Plan

| # | Section | Concept | Layout | Title |
|---|---------|---------|--------|-------|
| 1 | Bước 1 | Tạo Bot qua BotFather + lấy Token | Vertical Step Ladder | Tạo Telegram Bot |
| 2 | Bước 2-3 | Config Token + Gateway + Pairing | Linear Flow | Kết Nối OpenClaw + Telegram |
| 3 | Bước 4 | Cấu hình Group + Privacy Mode | Split Comparison | DM vs Group |

---

## Slide 1: Tạo Telegram Bot Qua BotFather

**Section:** Bước 1 — BotFather
**Script context:** Mở Telegram, tìm @BotFather (xác nhận đúng handle), gửi /newbot, đặt tên, nhận token.
**Layout:** Vertical Step Ladder

### Prompt

```
A developer explainer diagram drawn on a matte black chalkboard background. TITLE AT TOP: "Tạo Telegram Bot" Subtitle: "BotFather — 3 Bước Lấy Token" LAYOUT: vertical step ladder with 3 numbered steps. Step 1 (blue panel): speech bubble icon, text: "Tìm @BotFather", caption: "Xác Nhận Đúng Handle". Curved chalk arrow down. Step 2 (blue panel): terminal window icon, text: /newbot, caption: "Đặt Tên Cho Bot". Curved chalk arrow down. Step 3 (green panel with chalk sparkle effects): checkmark icon, text: "Copy Token", caption: "Định Dạng: 123:abc". Numbers: large chalk-drawn numerals (1, 2, 3) on the left side. A small red warning triangle at bottom with text: "Token = Mật Khẩu — Không Chia Sẻ" SIGNATURE: small chalk-style text "@tranvanhoang.com" in the bottom-right corner of the image as a subtle watermark signature. STYLE REQUIREMENTS: hand-drawn chalkboard explainer style white chalk handwritten typography slightly imperfect handwritten strokes chalk marker lettering looks like hand written with a chalk pen on a blackboard NOT a modern sans-serif font NOT typed text NOT digital UI font TEXT STYLE: clean readable chalk handwriting solid white strokes no chalk dust no speckled texture high contrast readable letters VISUAL STYLE: hand drawn developer whiteboard diagram chalkboard presentation slide engineering explainer diagram clean chalk marker lines minimal texture presentation quality readability NEGATIVE PROMPT: modern sans serif font helvetica font arial font clean digital UI typography vector UI infographic photorealistic 3D render glossy UI
```

---

## Slide 2: Kết Nối OpenClaw Với Telegram

**Section:** Bước 2-3 — Config + Gateway + Pairing
**Script context:** Set token trong config, chạy openclaw gateway, DM bot để nhận pairing code, approve code. Không cần openclaw channels login.
**Layout:** Linear Flow

### Prompt

```
A developer explainer diagram drawn on a matte black chalkboard background. TITLE AT TOP: "Kết Nối OpenClaw + Telegram" Subtitle: "Config → Gateway → Pairing → Done" LAYOUT: linear horizontal flow with 4 panels connected by curved chalk arrows, left-to-right direction. Panel 1 (blue panel): terminal window icon, text: Config Token, caption: channels.telegram.botToken, small code text: enabled = true. Curved chalk arrow right. Panel 2 (blue panel): server rack icon, text: "Chạy Gateway", caption: openclaw gateway. Curved chalk arrow right. Panel 3 (gold panel): speech bubble icon, text: DM Bot, caption: "Nhận Pairing Code", small text: "Code Hết Hạn Sau 1h". Curved chalk arrow right. Panel 4 (green panel with chalk sparkle effects): checkmark icon, text: Approve Code, caption: openclaw pairing approve, small text: "Kết Nối Thành Công!". Below the flow: a dashed chalk box with gold text: "Lưu Ý: Không Cần openclaw channels login" SIGNATURE: small chalk-style text "@tranvanhoang.com" in the bottom-right corner of the image as a subtle watermark signature. STYLE REQUIREMENTS: hand-drawn chalkboard explainer style white chalk handwritten typography slightly imperfect handwritten strokes chalk marker lettering looks like hand written with a chalk pen on a blackboard NOT a modern sans-serif font NOT typed text NOT digital UI font TEXT STYLE: clean readable chalk handwriting solid white strokes no chalk dust no speckled texture high contrast readable letters VISUAL STYLE: hand drawn developer whiteboard diagram chalkboard presentation slide engineering explainer diagram clean chalk marker lines minimal texture presentation quality readability NEGATIVE PROMPT: modern sans serif font helvetica font arial font clean digital UI typography vector UI infographic photorealistic 3D render glossy UI
```

---

## Slide 3: DM vs Group — Cấu Hình Quyền

**Section:** Bước 4 — DM Policy + Group Setup
**Script context:** DM dùng pairing/allowlist/open. Group cần tắt Privacy Mode qua BotFather /setprivacy, hoặc set bot làm admin. Có thể yêu cầu @mention hoặc không.
**Layout:** Split Comparison

### Prompt

```
A developer explainer diagram drawn on a matte black chalkboard background. TITLE AT TOP: "DM vs Group" Subtitle: "Cấu Hình Quyền Truy Cập" LAYOUT: split layout with a vertical dashed chalk divider. LEFT SIDE Title: "Tin Nhắn Riêng (DM)". 3 stacked panels: Top panel (green panel): checkmark icon, text: pairing, caption: "Mặc Định — Duyệt Code". Middle panel (blue panel): user silhouette icon, text: allowlist, caption: "Chỉ User ID Cụ Thể". Bottom panel (gold panel with warning triangle icon): text: open, caption: "Ai Cũng Nhắn Được". RIGHT SIDE Title: "Nhóm (Group)". 3 stacked panels: Top panel (gold panel): gear/cog icon, text: /setprivacy, caption: "Tắt Privacy Mode". Small red note below: "Xóa + Thêm Lại Bot". Middle panel (blue panel): speech bubble icon, text: requireMention, caption: "Cần @bot Hay Không". Bottom panel (green panel): user silhouette icon, text: allowFrom, caption: "Giới Hạn User". Small purple note at bottom center: "Bot Admin = Nhận Mọi Tin Nhắn" SIGNATURE: small chalk-style text "@tranvanhoang.com" in the bottom-right corner of the image as a subtle watermark signature. STYLE REQUIREMENTS: hand-drawn chalkboard explainer style white chalk handwritten typography slightly imperfect handwritten strokes chalk marker lettering looks like hand written with a chalk pen on a blackboard NOT a modern sans-serif font NOT typed text NOT digital UI font TEXT STYLE: clean readable chalk handwriting solid white strokes no chalk dust no speckled texture high contrast readable letters VISUAL STYLE: hand drawn developer whiteboard diagram chalkboard presentation slide engineering explainer diagram clean chalk marker lines minimal texture presentation quality readability NEGATIVE PROMPT: modern sans serif font helvetica font arial font clean digital UI typography vector UI infographic photorealistic 3D render glossy UI
```
