# Slide Prompts — Các Cách Cài Đặt OpenClaw

**Source:** https://docs.openclaw.ai/install
**Total slides:** 4
**Style:** Chalkboard Dev Explainer
**Aspect ratio:** 16:9

---

## Slide Plan

| # | Section | Concept | Layout | Title |
|---|---------|---------|--------|-------|
| 1 | Tổng quan | 5 cách cài OpenClaw | Hub-and-Spoke | Các Cách Cài Đặt OpenClaw |
| 2 | Cách 1 | Installer Script (Recommended) | Split Comparison | Cài Nhanh Bằng Script |
| 3 | Cách 2-3 | npm vs pnpm | Split Comparison | npm vs pnpm |
| 4 | Cách 4-5 | From Source + Alternatives | Grid / Matrix | Cách Cài Nâng Cao |

---

## Slide 1: Tổng Quan Các Cách Cài Đặt

**Section:** Tổng quan
**Script context:** OpenClaw có 5 phương pháp cài đặt chính: Installer Script, npm, pnpm, From Source, và các cách thay thế (Docker, Nix, Bun...)
**Layout:** Hub-and-Spoke

### Prompt

```
A developer explainer diagram drawn on a matte black chalkboard background. TITLE AT TOP: "Các Cách Cài Đặt OpenClaw" Subtitle: "5 Phương Pháp Từ Đơn Giản Đến Nâng Cao" LAYOUT: hub-and-spoke diagram. CENTER: large green circle with terminal window icon, text: OpenClaw. Surrounding spokes evenly distributed: Spoke 1 (gold panel, top, largest with a small star icon): terminal window icon, text: Installer Script, small label: "(Recommended)". Spoke 2 (blue panel, top-right): package box icon, text: npm. Spoke 3 (blue panel, bottom-right): package box icon, text: pnpm. Spoke 4 (purple panel, bottom-left): gear/cog icon, text: From Source. Spoke 5 (gray panel, top-left): cloud icon, text: Docker / Nix / Bun. Connected by chalk lines from center to each spoke. Small chalk note at bottom: "Node 24 recommended | Node 22 LTS (22.16+) supported" SIGNATURE: small chalk-style text "@tranvanhoang.com" in the bottom-right corner of the image as a subtle watermark signature. STYLE REQUIREMENTS: hand-drawn chalkboard explainer style white chalk handwritten typography slightly imperfect handwritten strokes chalk marker lettering looks like hand written with a chalk pen on a blackboard NOT a modern sans-serif font NOT typed text NOT digital UI font TEXT STYLE: clean readable chalk handwriting solid white strokes no chalk dust no speckled texture high contrast readable letters VISUAL STYLE: hand drawn developer whiteboard diagram chalkboard presentation slide engineering explainer diagram clean chalk marker lines minimal texture presentation quality readability NEGATIVE PROMPT: modern sans serif font helvetica font arial font clean digital UI typography vector UI infographic photorealistic 3D render glossy UI
```

---

## Slide 2: Installer Script (Recommended)

**Section:** Cách 1 — Installer Script
**Script context:** Cách đơn giản nhất, chỉ cần 1 lệnh curl (macOS/Linux) hoặc PowerShell (Windows). Tự động detect Node, cài đặt và onboarding.
**Layout:** Split Comparison

### Prompt

```
A developer explainer diagram drawn on a matte black chalkboard background. TITLE AT TOP: "Cài Nhanh Bằng Script" Subtitle: "1 Lệnh Duy Nhất — Tự Động Setup" LAYOUT: split layout with a vertical dashed chalk divider. LEFT SIDE Title: macOS / Linux. Green panel with white chalk outline. Inside: laptop icon with Apple/Linux logo doodle. Text: curl -fsSL https://openclaw.ai/install.sh | bash. Caption below in smaller chalk text: "Tự Động Cài Node + Onboarding". Small gold note panel below: terminal window icon, text: --no-onboard "Bỏ Qua Hướng Dẫn". RIGHT SIDE Title: Windows. Blue panel with white chalk outline. Inside: monitor icon with Windows logo doodle. Text: iwr -useb https://openclaw.ai/install.ps1 | iex. Caption below in smaller chalk text: "PowerShell — WSL2 Recommended". Small green checkmark icon at bottom center with text: "Recommended" with chalk sparkle effects around it. SIGNATURE: small chalk-style text "@tranvanhoang.com" in the bottom-right corner of the image as a subtle watermark signature. STYLE REQUIREMENTS: hand-drawn chalkboard explainer style white chalk handwritten typography slightly imperfect handwritten strokes chalk marker lettering looks like hand written with a chalk pen on a blackboard NOT a modern sans-serif font NOT typed text NOT digital UI font TEXT STYLE: clean readable chalk handwriting solid white strokes no chalk dust no speckled texture high contrast readable letters VISUAL STYLE: hand drawn developer whiteboard diagram chalkboard presentation slide engineering explainer diagram clean chalk marker lines minimal texture presentation quality readability NEGATIVE PROMPT: modern sans serif font helvetica font arial font clean digital UI typography vector UI infographic photorealistic 3D render glossy UI
```

---

## Slide 3: npm vs pnpm

**Section:** Cách 2-3 — Package Manager
**Script context:** Cài qua npm hoặc pnpm — cần Node 24 (recommended) hoặc Node 22 LTS. pnpm cần thêm bước approve-builds.
**Layout:** Split Comparison

### Prompt

```
A developer explainer diagram drawn on a matte black chalkboard background. TITLE AT TOP: "Cài Qua Package Manager" Subtitle: "npm vs pnpm — 2 Bước Đơn Giản" LAYOUT: split layout with a vertical dashed chalk divider. LEFT SIDE Title: npm. Blue panel with white chalk outline containing 2 numbered steps stacked vertically. Step 1 (blue panel): terminal window icon, text: npm install -g openclaw@latest. Curved chalk arrow down. Step 2 (green panel): checkmark icon, text: openclaw onboard --install-daemon. Small red warning panel below with warning triangle icon: "Lỗi sharp?" text: SHARP_IGNORE_GLOBAL_LIBVIPS=1. RIGHT SIDE Title: pnpm. Purple panel with white chalk outline containing 3 numbered steps stacked vertically. Step 1 (blue panel): terminal window icon, text: pnpm add -g openclaw@latest. Curved chalk arrow down. Step 2 (gold panel): gear/cog icon, text: pnpm approve-builds -g. Caption: "Bắt Buộc". Curved chalk arrow down. Step 3 (green panel): checkmark icon, text: openclaw onboard --install-daemon. SIGNATURE: small chalk-style text "@tranvanhoang.com" in the bottom-right corner of the image as a subtle watermark signature. STYLE REQUIREMENTS: hand-drawn chalkboard explainer style white chalk handwritten typography slightly imperfect handwritten strokes chalk marker lettering looks like hand written with a chalk pen on a blackboard NOT a modern sans-serif font NOT typed text NOT digital UI font TEXT STYLE: clean readable chalk handwriting solid white strokes no chalk dust no speckled texture high contrast readable letters VISUAL STYLE: hand drawn developer whiteboard diagram chalkboard presentation slide engineering explainer diagram clean chalk marker lines minimal texture presentation quality readability NEGATIVE PROMPT: modern sans serif font helvetica font arial font clean digital UI typography vector UI infographic photorealistic 3D render glossy UI
```

---

## Slide 4: From Source + Alternatives

**Section:** Cách 4-5 — Nâng cao
**Script context:** Cài từ source code cho contributors. Các phương pháp thay thế: Docker, Podman, Nix, Ansible, Bun.
**Layout:** Grid / Matrix

### Prompt

```
A developer explainer diagram drawn on a matte black chalkboard background. TITLE AT TOP: "Cách Cài Nâng Cao" Subtitle: "From Source + Các Phương Pháp Thay Thế" LAYOUT: two sections stacked. TOP SECTION (~55% height): purple panel with title "From Source" and gear/cog icon. Inside: vertical step ladder with 4 numbered steps in a horizontal flow left-to-right. Step 1 (blue panel): text: git clone. Step 2 (blue panel): text: pnpm install. Step 3 (gold panel): text: pnpm build. Step 4 (green panel): text: pnpm link --global. Connected by curved chalk arrows. Small chalk note below: "Dành Cho Contributors". BOTTOM SECTION (~40% height): title "Phương Pháp Thay Thế" with 5 small panels in a horizontal row evenly spaced. Panel 1 (blue): cloud icon, text: Docker. Panel 2 (blue): cloud icon, text: Podman. Panel 3 (purple): gear/cog icon, text: Nix. Panel 4 (gold): server rack icon, text: Ansible. Panel 5 (gray): terminal window icon, text: Bun. Small chalk note: Bun panel has caption "CLI Only". SIGNATURE: small chalk-style text "@tranvanhoang.com" in the bottom-right corner of the image as a subtle watermark signature. STYLE REQUIREMENTS: hand-drawn chalkboard explainer style white chalk handwritten typography slightly imperfect handwritten strokes chalk marker lettering looks like hand written with a chalk pen on a blackboard NOT a modern sans-serif font NOT typed text NOT digital UI font TEXT STYLE: clean readable chalk handwriting solid white strokes no chalk dust no speckled texture high contrast readable letters VISUAL STYLE: hand drawn developer whiteboard diagram chalkboard presentation slide engineering explainer diagram clean chalk marker lines minimal texture presentation quality readability NEGATIVE PROMPT: modern sans serif font helvetica font arial font clean digital UI typography vector UI infographic photorealistic 3D render glossy UI
```
