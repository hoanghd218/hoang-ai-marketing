#!/usr/bin/env python3
"""Generate Excalidraw diagram for CUONG-HOA-CONTENT Daily Workflows."""
import json
import os

seed_counter = 1000

def next_seed():
    global seed_counter
    seed_counter += 1
    return seed_counter

def rect(id, x, y, w, h, bg, stroke, rounded=True, stroke_style="solid", sw=2, bound=None):
    el = {
        "type": "rectangle", "id": id,
        "x": x, "y": y, "width": w, "height": h, "angle": 0,
        "strokeColor": stroke, "backgroundColor": bg,
        "fillStyle": "solid", "strokeWidth": sw, "strokeStyle": stroke_style,
        "roughness": 1, "opacity": 100,
        "seed": next_seed(), "version": 1, "versionNonce": next_seed(),
        "isDeleted": False, "groupIds": [],
        "boundElements": bound, "link": None, "locked": False,
    }
    if rounded:
        el["roundness"] = {"type": 3}
    return el

def text(id, x, y, w, h, txt, fs=16, ff=1, align="center", va="middle", sc="#1e1e1e", cid=None):
    return {
        "type": "text", "id": id,
        "x": x, "y": y, "width": w, "height": h,
        "text": txt, "fontSize": fs, "fontFamily": ff,
        "textAlign": align, "verticalAlign": va, "angle": 0,
        "strokeColor": sc, "backgroundColor": "transparent",
        "fillStyle": "solid", "strokeWidth": 2, "strokeStyle": "solid",
        "roughness": 1, "opacity": 100,
        "seed": next_seed(), "version": 1, "versionNonce": next_seed(),
        "isDeleted": False, "groupIds": [],
        "boundElements": None, "link": None, "locked": False,
        "containerId": cid, "originalText": txt,
        "autoResize": True, "lineHeight": 1.25
    }

def arrow(id, x, y, pts, sc="#1e1e1e", ss="solid", sw=2, end="arrow", start=None):
    xs = [p[0] for p in pts]
    ys = [p[1] for p in pts]
    return {
        "type": "arrow", "id": id,
        "x": x, "y": y,
        "width": max(xs) - min(xs), "height": max(ys) - min(ys),
        "angle": 0, "strokeColor": sc, "backgroundColor": "transparent",
        "fillStyle": "solid", "strokeWidth": sw, "strokeStyle": ss,
        "roughness": 1, "opacity": 100,
        "seed": next_seed(), "version": 1, "versionNonce": next_seed(),
        "isDeleted": False, "groupIds": [],
        "boundElements": None, "link": None, "locked": False,
        "points": pts, "startArrowhead": start, "endArrowhead": end,
        "startBinding": None, "endBinding": None
    }

# Layout constants
HX = 70       # header x
HW = 795      # header width
HH = 36       # header height
BW = 175      # box width
BH = 75       # box height
BG = 30       # box gap horizontal
BX = [70, 275, 480, 685]  # box x positions

elements = []

# ========== TITLE ==========
elements.append(text("title", 155, 20, 630, 40,
    "CUONG-HOA-CONTENT DAILY WORKFLOWS", fs=28, sc="#1e1e1e"))

# ========== HELPER: Create a phase ==========
def make_phase(prefix, hdr_y, hdr_text, hdr_bg, hdr_stroke, box_bg, boxes_data, labels=None, show_approved=False):
    """Create all elements for one phase."""
    els = []
    box_y = hdr_y + HH + 28
    mid_y = box_y + BH // 2

    # Header bar
    els.append(rect(f"{prefix}-hdr", HX, hdr_y, HW, HH, hdr_bg, hdr_stroke))
    els.append(text(f"{prefix}-hdr-txt", HX, hdr_y + 6, HW, 24, hdr_text, fs=18, sc=hdr_stroke))

    # Boxes + text
    for i, (icon, line1, line2) in enumerate(boxes_data):
        x = BX[i]
        bid = f"{prefix}-b{i+1}"
        content = f"{icon} {line1}\n{line2}"
        els.append(rect(bid, x, box_y, BW, BH, box_bg, "#868e96"))
        lines = content.count("\n") + 1
        th = lines * 18
        ty = box_y + (BH - th) // 2
        els.append(text(f"{bid}-txt", x + 8, ty, BW - 16, th, content, fs=14))

    # Horizontal arrows between boxes
    for i in range(3):
        ax = BX[i] + BW
        els.append(arrow(f"{prefix}-arr-{i+1}", ax, mid_y, [[0, 0], [BG, 0]]))

    # Labels under boxes
    if labels:
        for (idx, lbl_text) in labels:
            lx = BX[idx] + 10
            els.append(text(f"{prefix}-lbl-{idx}", lx, box_y + BH + 5, BW - 20, 16,
                           lbl_text, fs=11, sc="#868e96"))

    # Approved indicator
    if show_approved:
        els.append(text(f"{prefix}-appr", HX + HW // 2 - 60, box_y + BH + 30, 120, 20,
                       "✅ Approved", fs=14, sc="#2f9e44"))

    return els, box_y

# ========== PHASE 1: GET INSIGHTS ==========
p1_data = [
    ("📄", "Nguồn tin", "YT Trending · X.com\nTikTok · FB Guru"),
    ("📂", "Kho Content Ideas", "ideas.md"),
    ("🤖", "AI: Đề xuất", "3 góc nhìn content"),
    ("👤", "CEO: Review", "& Approve ý tưởng"),
]
p1_els, p1_box_y = make_phase("p1", 85, "PHASE 1: GET INSIGHTS",
    "#a5d8ff", "#1971c2", "#f0f9ff", p1_data,
    labels=[(2, "/content-brief")], show_approved=True)
elements.extend(p1_els)

# Down arrow P1 → P2
P2_HDR_Y = 325
elements.append(arrow("p1-down", HX + HW // 2, p1_box_y + BH + 55, [[0, 0], [0, 35]]))

# ========== PHASE 2: WRITE POST ==========
p2_data = [
    ("🎤", "Voice-to-Post", "Làm sạch transcript"),
    ("🔍", "Source Verify", "Thẩm định số liệu"),
    ("🤖", "AI: Viết bài", "Đa nền tảng & giọng"),
    ("👤", "CEO: Review", "Bản nhập"),
]
p2_els, p2_box_y = make_phase("p2", P2_HDR_Y, "PHASE 2: WRITE POST",
    "#ffc9c9", "#e03131", "#fff5f5", p2_data,
    labels=[(0, "voice-to-post"), (1, "source-verify"), (2, "/write-post · style-mixer")],
    show_approved=True)
elements.extend(p2_els)

# Down arrow P2 → P3
P3_HDR_Y = 570
elements.append(arrow("p2-down", HX + HW // 2, p2_box_y + BH + 55, [[0, 0], [0, 35]]))

# ========== PHASE 3: PUBLISH ==========
p3_data = [
    ("🚀", "Đăng ngay", "/publish-content"),
    ("📅", "Lên Lịch", "/batch-schedule"),
    ("⚙️", "Publishing Engine", "Postiz CLI + GHL API"),
    ("📱", "Output", "X · FB · IG · LinkedIn"),
]
p3_els, p3_box_y = make_phase("p3", P3_HDR_Y, "PHASE 3: PUBLISH — Phân phối",
    "#ffec99", "#f08c00", "#fffbeb", p3_data)
elements.extend(p3_els)

# Down arrow P3 → P4
P4_HDR_Y = 780
elements.append(arrow("p3-down", HX + HW // 2, p3_box_y + BH + 10, [[0, 0], [0, 35]]))

# ========== PHASE 4: REVIEW & LEARN ==========
p4_data = [
    ("📊", "Thu thập", "Engagement data"),
    ("🔑", "So sánh", "Draft vs Published"),
    ("📓", "Cập nhật", "MEMORY.md · Learnings"),
    ("🔄", "Feedback Loop", "Quay lại Phase 1"),
]
p4_els, p4_box_y = make_phase("p4", P4_HDR_Y, "PHASE 4: REVIEW & LEARN",
    "#d0bfff", "#9c36b5", "#faf5ff", p4_data,
    labels=[(1, "/post-review"), (2, "learning-logger")])
elements.extend(p4_els)

# ========== FEEDBACK ARROW (right side, dashed red) ==========
FB_X = 905
fb_bottom_y = p4_box_y + BH // 2
fb_top_y = 103  # Phase 1 header middle

# L-shaped arrow: goes right from P4, up, then left to P1
# Start from right of P4 row, go up to P1 header level, point left with arrow
elements.append(arrow("fb-arrow", FB_X, fb_top_y,
    [[0, 0], [0, fb_bottom_y - fb_top_y]],
    sc="#e03131", ss="dashed", sw=2, start="arrow", end=None))

# Small arrow pointing left at the top (to Phase 1)
elements.append(arrow("fb-arrow-top", HX + HW + 5, fb_top_y,
    [[0, 0], [FB_X - HX - HW - 5, 0]],
    sc="#e03131", ss="dashed", sw=2, end=None, start=None))

# Arrow head pointing left into Phase 1
elements.append(arrow("fb-arrow-point", HX + HW, fb_top_y,
    [[0, 0], [-30, 0]],
    sc="#e03131", ss="dashed", sw=2, end="arrow", start=None))

# Feedback text (vertical)
elements.append(text("fb-text", FB_X + 12, 400, 20, 260,
    "F\ne\ne\nd\nb\na\nc\nk", fs=18, sc="#e03131"))

# ========== BUILD DOCUMENT ==========
doc = {
    "type": "excalidraw",
    "version": 2,
    "source": "https://excalidraw.com",
    "elements": elements,
    "appState": {
        "viewBackgroundColor": "#ffffff",
        "gridSize": None
    },
    "files": {}
}

# Write output
output_path = os.path.join(os.path.dirname(__file__), "cuong-hoa-content-daily-workflows.excalidraw")
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(doc, f, indent=2, ensure_ascii=False)

print(f"Generated: {output_path}")
print(f"Total elements: {len(elements)}")
