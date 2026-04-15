# Remotion Studio

Video ngắn (TikTok, Reels, Shorts) được tạo bằng Remotion + React.

## Setup

```bash
cd workspace/video-projects/remotion-studio
npm install
```

## Chạy Preview

```bash
npx remotion studio
```

Mở `http://localhost:3000`, chọn composition bên trái để preview.

## Render ra MP4

```bash
# Cú pháp
npx remotion render src/index.ts <TÊN_COMPOSITION> <output.mp4>

# Ví dụ
npx remotion render src/index.ts HeyGenShort out/heygen.mp4
npx remotion render src/index.ts DarkMinimal out/dark.mp4
```

### Render với custom props

```bash
npx remotion render src/index.ts HeyGenShort out/video.mp4 --props=props/heygen-short.json
```

## Compositions

| Tên | Mô tả | Kích thước |
|-----|--------|------------|
| `DarkMinimal` | Text overlay tối giản | 1080x1920 |
| `BoldHighlight` | Text highlight đậm | 1080x1920 |
| `EpicFullscreen` | Text toàn màn hình | 1080x1920 |
| `ImageKenBurns` | Ảnh zoom effect | 1080x1080 |
| `ProgressiveReduction` | Giảm dần text | 1080x1920 |
| `PromptTyping` | Hiệu ứng gõ chữ | 1080x1920 |
| `HeyGenShort` | Video ngắn HeyGen avatar | 1080x1920 |
