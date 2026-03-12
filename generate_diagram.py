import json
import uuid

# Configuration
BG_COLOR = "#1a1a2e"
STROKE_COLOR_PRIMARY = "#cdd6f4"
STROKE_COLOR_SECONDARY = "#a6adc8"
STROKE_COLOR_HIGHLIGHT = "#f38ba8"
STROKE_COLOR_SUCCESS = "#a6e3a1"
STROKE_COLOR_WARNING = "#f9e2af"
STROKE_COLOR_INFO = "#89b4fa"

# Element creation helpers
def create_text(x, y, text, color=STROKE_COLOR_PRIMARY, size=20, font=3, width=None, height=25):
    if width is None:
        width = len(text) * (size * 0.6)
    return {
        "id": str(uuid.uuid4()),
        "type": "text",
        "x": x,
        "y": y,
        "width": width,
        "height": height,
        "angle": 0,
        "strokeColor": color,
        "backgroundColor": "transparent",
        "fillStyle": "hachure",
        "strokeWidth": 1,
        "strokeStyle": "solid",
        "roughness": 1,
        "opacity": 100,
        "groupIds": [],
        "strokeSharpness": "sharp",
        "seed": 1,
        "version": 1,
        "versionNonce": 1,
        "isDeleted": False,
        "boundElements": None,
        "updated": 1,
        "link": None,
        "locked": False,
        "text": text,
        "fontSize": size,
        "fontFamily": font,
        "textAlign": "left",
        "verticalAlign": "top",
        "baseline": size - 4
    }

def create_rectangle(x, y, w, h, stroke_color=STROKE_COLOR_PRIMARY, bg_color="transparent", stroke_style="solid"):
    return {
        "id": str(uuid.uuid4()),
        "type": "rectangle",
        "x": x,
        "y": y,
        "width": w,
        "height": h,
        "angle": 0,
        "strokeColor": stroke_color,
        "backgroundColor": bg_color,
        "fillStyle": "solid" if bg_color != "transparent" else "hachure",
        "strokeWidth": 2,
        "strokeStyle": stroke_style,
        "roughness": 1,
        "opacity": 100,
        "groupIds": [],
        "strokeSharpness": "round",
        "seed": 1,
        "version": 1,
        "versionNonce": 1,
        "isDeleted": False,
        "boundElements": [],
        "updated": 1,
        "link": None,
        "locked": False
    }

def create_ellipse(x, y, w, h, stroke_color=STROKE_COLOR_PRIMARY, bg_color="transparent"):
    return {
        "id": str(uuid.uuid4()),
        "type": "ellipse",
        "x": x,
        "y": y,
        "width": w,
        "height": h,
        "angle": 0,
        "strokeColor": stroke_color,
        "backgroundColor": bg_color,
        "fillStyle": "solid" if bg_color != "transparent" else "hachure",
        "strokeWidth": 2,
        "strokeStyle": "solid",
        "roughness": 1,
        "opacity": 100,
        "groupIds": [],
        "strokeSharpness": "round",
        "seed": 1,
        "version": 1,
        "versionNonce": 1,
        "isDeleted": False,
        "boundElements": [],
        "updated": 1,
        "link": None,
        "locked": False
    }

def create_arrow(start_x, start_y, end_x, end_y, start_element=None, end_element=None, stroke_style="solid", stroke_color=STROKE_COLOR_SECONDARY, point_start=False):
    arrow = {
        "id": str(uuid.uuid4()),
        "type": "arrow",
        "x": start_x,
        "y": start_y,
        "width": abs(end_x - start_x),
        "height": abs(end_y - start_y),
        "angle": 0,
        "strokeColor": stroke_color,
        "backgroundColor": "transparent",
        "fillStyle": "hachure",
        "strokeWidth": 2,
        "strokeStyle": stroke_style,
        "roughness": 1,
        "opacity": 100,
        "groupIds": [],
        "strokeSharpness": "round",
        "seed": 1,
        "version": 1,
        "versionNonce": 1,
        "isDeleted": False,
        "boundElements": None,
        "updated": 1,
        "link": None,
        "locked": False,
        "points": [
            [0, 0],
            [end_x - start_x, end_y - start_y]
        ],
        "startBinding": None,
        "endBinding": None,
        "lastCommittedPoint": None,
        "startArrowhead": "arrow" if point_start else None,
        "endArrowhead": "arrow"
    }
    
    # Simple binding integration
    if start_element:
        arrow["startBinding"] = {"elementId": start_element["id"], "gap": 5, "focus": 0}
        if "boundElements" not in start_element or start_element["boundElements"] is None:
            start_element["boundElements"] = []
        start_element["boundElements"].append({"id": arrow["id"], "type": "arrow"})
        
    if end_element:
        arrow["endBinding"] = {"elementId": end_element["id"], "gap": 5, "focus": 0}
        if "boundElements" not in end_element or end_element["boundElements"] is None:
            end_element["boundElements"] = []
        end_element["boundElements"].append({"id": arrow["id"], "type": "arrow"})
        
    return arrow

elements = []

# ==========================================================
# HEADER
# ==========================================================
title_y = 50
title = create_text(500, title_y, "CONTENT PRODUCTION PIPELINE", color=STROKE_COLOR_PRIMARY, size=36)
elements.append(title)

# Draw divider
divider_y = 120
elements.append(create_arrow(50, divider_y, 1450, divider_y, stroke_style="dashed", stroke_color=STROKE_COLOR_SECONDARY))

# ==========================================================
# COMMAND 1: mkt-find-trend-videos-subscribed
# ==========================================================
cmd1_y = 160
cmd1_text = create_text(50, cmd1_y, "1. FIND TREND VIDEOS (/mkt-find-trend-videos-subscribed)", color=STROKE_COLOR_INFO, size=24)
elements.append(cmd1_text)

# Phase 1: Fetch
phase1_box = create_rectangle(100, 220, 250, 80, stroke_color=STROKE_COLOR_INFO)
phase1_text = create_text(115, 235, "Phase 1: Fetch\nyoutube-trend-finder", size=16)
elements.append(phase1_box)
elements.append(phase1_text)

# Phase 2: Parallel Download (Fan-Out)
hub1_y_center = 260
hub1 = create_ellipse(450, 230, 80, 60, stroke_color=STROKE_COLOR_INFO)
hub1_text = create_text(465, 250, "Batch", size=16)
elements.append(hub1)
elements.append(hub1_text)
elements.append(create_arrow(350, 260, 450, 260, start_element=phase1_box, end_element=hub1))

# Target column for Phase 2
col2_x = 650
phase2_items = ["Sub-Agent: Video 1\nThumbnail & Transcript", "Sub-Agent: Video 2\nThumbnail & Transcript", "... Max 5 Concurrent"]
phase2_boxes = []

for i, label in enumerate(phase2_items):
    y_pos = 180 + (i * 90)
    box = create_rectangle(col2_x, y_pos, 220, 60, stroke_color=STROKE_COLOR_SECONDARY)
    text = create_text(col2_x + 10, y_pos + 10, label, size=14)
    elements.append(box)
    elements.append(text)
    elements.append(create_arrow(530, 260, col2_x, y_pos + 30, start_element=hub1, end_element=box))
    phase2_boxes.append(box)

# Storage (videos.json, transcripts, images)
storage_y = 400
storage_box = create_rectangle(650, storage_y, 220, 100, stroke_color=STROKE_COLOR_WARNING, stroke_style="dashed")
storage_text = create_text(660, storage_y + 10, "Local Storage\n- videos.json\n- transcripts/\n- images/", size=16, color=STROKE_COLOR_WARNING)
elements.append(storage_box)
elements.append(storage_text)

# Phase 3: Insights extraction
hub2 = create_ellipse(950, 230, 80, 60, stroke_color=STROKE_COLOR_INFO)
hub2_text = create_text(965, 250, "Batch", size=16)
elements.append(hub2)
elements.append(hub2_text)

for box in phase2_boxes:
    elements.append(create_arrow(col2_x + 220, box["y"] + 30, 950, 260, start_element=box, end_element=hub2))

col4_x = 1150
phase3_items = ["Extract Insights (V1)\n5-Type Framework", "Extract Insights (V2)\n5-Type Framework", "... Max 5 Concurrent"]
phase3_boxes = []

for i, label in enumerate(phase3_items):
    y_pos = 180 + (i * 90)
    box = create_rectangle(col4_x, y_pos, 220, 60, stroke_color=STROKE_COLOR_SECONDARY)
    text = create_text(col4_x + 10, y_pos + 10, label, size=14)
    elements.append(box)
    elements.append(text)
    elements.append(create_arrow(1030, 260, col4_x, y_pos + 30, start_element=hub2, end_element=box))
    phase3_boxes.append(box)

# Save/Sync loop
sync_box = create_rectangle(1150, storage_y, 220, 80, stroke_color=STROKE_COLOR_SUCCESS)
sync_text = create_text(1160, storage_y + 10, "Phase 5: Sync to Notion\n(notion-create-pages)", size=14, color=STROKE_COLOR_SUCCESS)
elements.append(sync_box)
elements.append(sync_text)

for box in phase3_boxes:
    elements.append(create_arrow(col4_x + 110, box["y"] + 60, 1260, storage_y, start_element=box, end_element=sync_box, stroke_style="dashed"))

elements.append(create_arrow(870, storage_y + 50, 1150, storage_y + 50, start_element=storage_box, end_element=sync_box))

# Divider Phase 1/2
divider2_y = 550
elements.append(create_arrow(50, divider2_y, 1450, divider2_y, stroke_style="dashed", stroke_color=STROKE_COLOR_SECONDARY))

# ==========================================================
# COMMAND 2: mkt-research-result-to-contents
# ==========================================================
cmd2_y = 580
cmd2_text = create_text(50, cmd2_y, "2. RESEARCH TO CONTENTS (/mkt-research-result-to-contents)", color=STROKE_COLOR_INFO, size=24)
elements.append(cmd2_text)

# Input Phase
p2_in_box = create_rectangle(100, 650, 250, 80, stroke_color=STROKE_COLOR_WARNING, stroke_style="dashed")
p2_in_text = create_text(115, 665, "Read Local Data\nvideos.json & transcripts/", size=16, color=STROKE_COLOR_WARNING)
elements.append(p2_in_box)
elements.append(p2_in_text)

# Connect Phase 1 storage to Phase 2 input
elements.append(create_arrow(760, 500, 225, 650, start_element=storage_box, end_element=p2_in_box, stroke_style="dashed"))

# Fan-out to Analysis
p2_hub1 = create_ellipse(450, 660, 80, 60, stroke_color=STROKE_COLOR_INFO)
p2_hub1_text = create_text(465, 680, "Batch", size=16)
elements.append(p2_hub1)
elements.append(p2_hub1_text)
elements.append(create_arrow(350, 690, 450, 690, start_element=p2_in_box, end_element=p2_hub1))

# Target column for Analysis
p2_col2_x = 650
p2_analysis_items = ["Analyze Video 1\n(mkt-video-to-content-idea)", "Analyze Video 2\n(mkt-video-to-content-idea)", "... Max 3 Concurrent"]
p2_analysis_boxes = []

for i, label in enumerate(p2_analysis_items):
    y_pos = 610 + (i * 90)
    box = create_rectangle(p2_col2_x, y_pos, 220, 60, stroke_color=STROKE_COLOR_SECONDARY)
    text = create_text(p2_col2_x + 10, y_pos + 10, label, size=14)
    elements.append(box)
    elements.append(text)
    elements.append(create_arrow(530, 690, p2_col2_x, y_pos + 30, start_element=p2_hub1, end_element=box))
    p2_analysis_boxes.append(box)

# Rating Filter
filter_hub = create_ellipse(950, 660, 80, 60, stroke_color=STROKE_COLOR_SUCCESS)
filter_text = create_text(960, 675, "Filter:\nXANH/VÀNG", size=12, color=STROKE_COLOR_SUCCESS)
elements.append(filter_hub)
elements.append(filter_text)

for box in p2_analysis_boxes:
    elements.append(create_arrow(p2_col2_x + 220, box["y"] + 30, 950, 690, start_element=box, end_element=filter_hub))

# Output content generation
p2_col4_x = 1150
p2_output_items = ["Draft FB Post\ncontents/<slug>-fb.md", "Draft Short Video\ncontents/<slug>-short.md", "Update Report\nreport.md & videos.json"]
p2_output_boxes = []

for i, label in enumerate(p2_output_items):
    y_pos = 610 + (i * 90)
    box = create_rectangle(p2_col4_x, y_pos, 220, 60, stroke_color=STROKE_COLOR_HIGHLIGHT)
    text = create_text(p2_col4_x + 10, y_pos + 10, label, size=14, color=STROKE_COLOR_HIGHLIGHT)
    elements.append(box)
    elements.append(text)
    elements.append(create_arrow(1030, 690, p2_col4_x, y_pos + 30, start_element=filter_hub, end_element=box))
    p2_output_boxes.append(box)

# Generate JSON
diagram = {
    "type": "excalidraw",
    "version": 2,
    "source": "Python Generator",
    "elements": elements,
    "appState": {
        "viewBackgroundColor": BG_COLOR,
        "gridSize": None
    },
    "files": {}
}

import os
os.makedirs("workspace/diagrams", exist_ok=True)
with open("workspace/diagrams/content_production_pipeline.excalidraw", "w", encoding="utf-8") as f:
    json.dump(diagram, f, indent=2, ensure_ascii=False)
print("Created workspace/diagrams/content_production_pipeline.excalidraw")
