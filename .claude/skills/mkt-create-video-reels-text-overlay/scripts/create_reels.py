#!/usr/bin/env python3
# /// script
# requires-python = ">=3.10"
# dependencies = ["Pillow>=10.0"]
# ///
"""
Create short Reels/TikTok video with text overlay on background video + music.

Usage:
    uv run scripts/create_reels.py --message "Your message here" \
        --video assets/videos/city-night-rain.mp4 \
        --music assets/music/lo-fi-chill-beat.mp3 \
        --output output.mp4

    # With watermark
    uv run scripts/create_reels.py --message "Your message" \
        --video input.mp4 --music bg.mp3 \
        --watermark "@hoang.ai" --output output.mp4

    # Custom font
    uv run scripts/create_reels.py --message "Your message" \
        --video input.mp4 --music bg.mp3 \
        --font /path/to/font.ttf --output output.mp4
"""
import argparse
import json
import os
import subprocess
import sys
import tempfile
import textwrap
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


# ── Constants ──────────────────────────────────────────────────────────
CANVAS_W, CANVAS_H = 1080, 1920  # 9:16 portrait
MAX_DURATION = 8  # seconds
FONT_SIZE_TITLE = 38
FONT_SIZE_BODY = 34
LINE_SPACING = 12
TEXT_COLOR = (255, 255, 255, 255)  # white
SHADOW_COLOR = (0, 0, 0, 200)  # semi-transparent black
SHADOW_OFFSET = 3
TEXT_PADDING = 60  # horizontal padding
WATERMARK_SIZE = 36
WATERMARK_COLOR = (255, 255, 255, 180)


def find_system_font():
    """Find a Vietnamese-compatible system font.

    Returns (path, index) tuple. Index is for .ttc collections.
    """
    # Check workspace/assets/reels/fonts/ first (custom fonts, including subdirs)
    skill_dir = Path(__file__).parent.parent.parent.parent / "workspace" / "assets" / "reels" / "fonts"
    if skill_dir.exists():
        # Prefer Be Vietnam Pro Light for thin/elegant style
        light = skill_dir / "Be_Vietnam_Pro" / "BeVietnamPro-Light.ttf"
        if light.exists():
            return str(light), 0
        for f in list(skill_dir.rglob("*.ttf")) + list(skill_dir.rglob("*.otf")):
            return str(f), 0

    # Avenir Next Demi Bold — clean modern sans-serif, Vietnamese support
    avenir = "/System/Library/Fonts/Avenir Next.ttc"
    if os.path.exists(avenir):
        return avenir, 2  # index 2 = Demi Bold

    # Fallback candidates
    fallbacks = [
        "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
        "/System/Library/Fonts/Supplemental/Arial.ttf",
        "/System/Library/Fonts/Helvetica.ttc",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
    ]
    for font_path in fallbacks:
        if os.path.exists(font_path):
            return font_path, 0
    return None, 0


def create_text_overlay(
    message: str,
    output_path: str,
    font_path: str | None = None,
    watermark: str | None = None,
):
    """Generate a transparent PNG with text overlay using Pillow.

    Text style matches the reference: white bold text centered vertically,
    with dark shadow for readability on any video background.
    """
    img = Image.new("RGBA", (CANVAS_W, CANVAS_H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Load fonts
    if font_path:
        font_file, font_idx = font_path, 0
    else:
        font_file, font_idx = find_system_font()
    if font_file:
        try:
            font_body = ImageFont.truetype(font_file, FONT_SIZE_BODY, index=font_idx)
            font_title = ImageFont.truetype(font_file, FONT_SIZE_TITLE, index=font_idx)
            font_wm = ImageFont.truetype(font_file, WATERMARK_SIZE, index=font_idx)
        except Exception:
            font_body = font_title = ImageFont.load_default()
            font_wm = ImageFont.load_default()
    else:
        font_body = font_title = ImageFont.load_default()
        font_wm = ImageFont.load_default()

    # ── Wrap text ──────────────────────────────────────────────────
    # Split message into lines, respecting existing newlines
    raw_lines = message.strip().split("\n")
    wrapped_lines = []
    max_chars = 34  # chars per line for 1080px width at font size 44

    for line in raw_lines:
        line = line.strip()
        if not line:
            wrapped_lines.append("")
            continue
        sub_lines = textwrap.wrap(line, width=max_chars)
        wrapped_lines.extend(sub_lines)

    # ── Calculate text block dimensions ────────────────────────────
    line_heights = []
    line_widths = []
    for line in wrapped_lines:
        if not line:
            line_heights.append(FONT_SIZE_BODY // 2)
            line_widths.append(0)
            continue
        bbox = draw.textbbox((0, 0), line, font=font_body)
        line_heights.append(bbox[3] - bbox[1])
        line_widths.append(bbox[2] - bbox[0])

    total_text_h = sum(line_heights) + LINE_SPACING * (len(wrapped_lines) - 1)

    # Center text block vertically (slightly below center for Reels aesthetic)
    start_y = (CANVAS_H - total_text_h) // 2 + 40

    # ── Draw text with shadow ──────────────────────────────────────
    y = start_y
    for i, line in enumerate(wrapped_lines):
        if not line:
            y += line_heights[i] + LINE_SPACING
            continue

        x = (CANVAS_W - line_widths[i]) // 2  # center-aligned like reference

        # Draw shadow (multiple offsets for thick shadow effect)
        for dx in range(-SHADOW_OFFSET, SHADOW_OFFSET + 1):
            for dy in range(-SHADOW_OFFSET, SHADOW_OFFSET + 1):
                if dx == 0 and dy == 0:
                    continue
                draw.text((x + dx, y + dy), line, font=font_body, fill=SHADOW_COLOR)

        # Draw main text
        draw.text((x, y), line, font=font_body, fill=TEXT_COLOR)

        y += line_heights[i] + LINE_SPACING

    # ── Watermark (top-right) ──────────────────────────────────────
    if watermark:
        wm_bbox = draw.textbbox((0, 0), watermark, font=font_wm)
        wm_w = wm_bbox[2] - wm_bbox[0]
        wm_x = CANVAS_W - wm_w - 40
        wm_y = 60

        # Shadow for watermark
        for dx in (-2, 0, 2):
            for dy in (-2, 0, 2):
                if dx == 0 and dy == 0:
                    continue
                draw.text(
                    (wm_x + dx, wm_y + dy),
                    watermark,
                    font=font_wm,
                    fill=(0, 0, 0, 150),
                )
        draw.text((wm_x, wm_y), watermark, font=font_wm, fill=WATERMARK_COLOR)

    img.save(output_path, "PNG")
    return output_path


def get_video_duration(video_path: str) -> float:
    """Get video duration in seconds using ffprobe."""
    cmd = [
        "ffprobe", "-v", "error",
        "-show_entries", "format=duration",
        "-of", "default=noprint_wrappers=1:nokey=1",
        video_path,
    ]
    result = subprocess.run(cmd, capture_output=True, text=True)
    return float(result.stdout.strip())


def compose_video(
    video_path: str,
    music_path: str | None,
    overlay_path: str,
    output_path: str,
    duration: float = MAX_DURATION,
    fade_in: float = 0.8,
    fade_out: float = 0.8,
):
    """Compose final video: background video + text overlay PNG + music.

    Uses FFmpeg to:
    1. Trim video to max duration
    2. Scale to 1080x1920 (9:16)
    3. Overlay transparent text PNG
    4. Mix background music (lowered volume)
    5. Add fade in/out
    """
    # Get source video duration
    src_duration = get_video_duration(video_path)
    trim_duration = min(duration, src_duration)
    fade_out_start = trim_duration - fade_out

    # Build filter complex
    filters = []

    # Scale video to 9:16, crop center, darken for text readability
    filters.append(
        f"[0:v]trim=0:{trim_duration},setpts=PTS-STARTPTS,"
        f"scale=1080:1920:force_original_aspect_ratio=increase,"
        f"crop=1080:1920,"
        f"eq=brightness=-0.25:saturation=0.7,"
        f"fade=t=in:st=0:d={fade_in},"
        f"fade=t=out:st={fade_out_start}:d={fade_out}[bg]"
    )

    # Overlay text PNG directly (fade handled by video layer)
    filters.append("[bg][1:v]overlay=0:0[vout]")

    filter_complex = ";".join(filters)

    cmd = [
        "ffmpeg", "-y",
        "-i", video_path,        # input 0: background video
        "-i", overlay_path,      # input 1: text overlay PNG
    ]

    if music_path:
        cmd.extend(["-i", music_path])  # input 2: music

        # Audio: mix original video audio (if any) with music
        audio_filter = (
            f"[2:a]atrim=0:{trim_duration},asetpts=PTS-STARTPTS,"
            f"volume=1,"
            f"afade=t=in:st=0:d={fade_in},"
            f"afade=t=out:st={fade_out_start}:d={fade_out}[aout]"
        )
        filter_complex += f";{audio_filter}"

        cmd.extend([
            "-filter_complex", filter_complex,
            "-map", "[vout]",
            "-map", "[aout]",
        ])
    else:
        cmd.extend([
            "-filter_complex", filter_complex,
            "-map", "[vout]",
            "-an",
        ])

    cmd.extend([
        "-c:v", "libx264",
        "-preset", "medium",
        "-crf", "18",
        "-c:a", "aac",
        "-b:a", "192k",
        "-t", str(trim_duration),
        "-pix_fmt", "yuv420p",
        "-movflags", "+faststart",
        output_path,
    ])

    print(f"Running FFmpeg...")
    print(f"  Video: {video_path}")
    print(f"  Music: {music_path or 'none'}")
    print(f"  Duration: {trim_duration}s")
    print(f"  Output: {output_path}")

    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        print(f"FFmpeg error:\n{result.stderr}", file=sys.stderr)
        sys.exit(1)

    print(f"Done! Output: {output_path}")
    return output_path


def main():
    parser = argparse.ArgumentParser(
        description="Create Reels/TikTok video with text overlay"
    )
    parser.add_argument(
        "--message", "-m", required=True,
        help="Text message to overlay on video (supports \\n for newlines)"
    )
    parser.add_argument(
        "--video", "-v", required=True,
        help="Path to background video (.mp4)"
    )
    parser.add_argument(
        "--music", required=False, default=None,
        help="Path to background music (.mp3). Optional."
    )
    parser.add_argument(
        "--output", "-o", required=True,
        help="Output video file path (.mp4)"
    )
    parser.add_argument(
        "--watermark", "-w", default=None,
        help="Watermark text (e.g. @hoang.ai). Placed top-right."
    )
    parser.add_argument(
        "--font", "-f", default=None,
        help="Path to .ttf/.otf font file. Auto-detects if not provided."
    )
    parser.add_argument(
        "--duration", "-d", type=float, default=MAX_DURATION,
        help=f"Max video duration in seconds (default: {MAX_DURATION})"
    )
    args = parser.parse_args()

    # Validate inputs
    if not os.path.exists(args.video):
        print(f"Error: Video file not found: {args.video}", file=sys.stderr)
        sys.exit(1)
    if args.music and not os.path.exists(args.music):
        print(f"Error: Music file not found: {args.music}", file=sys.stderr)
        sys.exit(1)

    # Replace literal \n with actual newlines
    message = args.message.replace("\\n", "\n")

    # Create text overlay PNG
    with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as tmp:
        overlay_path = tmp.name

    try:
        print("Generating text overlay...")
        create_text_overlay(
            message=message,
            output_path=overlay_path,
            font_path=args.font,
            watermark=args.watermark,
        )

        # Compose final video
        os.makedirs(os.path.dirname(os.path.abspath(args.output)), exist_ok=True)
        compose_video(
            video_path=args.video,
            music_path=args.music,
            overlay_path=overlay_path,
            output_path=args.output,
            duration=args.duration,
        )
    finally:
        if os.path.exists(overlay_path):
            os.unlink(overlay_path)


if __name__ == "__main__":
    main()
