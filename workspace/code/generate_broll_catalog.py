"""
Generate _catalog.json from _index.json + folder scan.
Adds rich semantic metadata (tags, mood, visual, best_for) for AI-powered GIF selection.

Usage: python3 workspace/code/generate_broll_catalog.py
"""

import json
import os
import re

BROLL_DIR = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "assets", "reels", "broll_gifs"
)
INDEX_PATH = os.path.join(BROLL_DIR, "_index.json")
CATALOG_PATH = os.path.join(BROLL_DIR, "_catalog.json")

# ============================================================
# Category metadata — hand-curated for semantic richness
# ============================================================

CATEGORY_META = {
    "01_tien_bac": {
        "name_vi": "Tiền bạc / Làm giàu",
        "name_en": "Money / Wealth",
        "emotion": ["excited", "ambitious", "greedy"],
        "use_when": "Nói về tiền, thu nhập, passive income, kiếm tiền online, ROI, doanh thu, lợi nhuận, giá trị tài chính",
        "default_mood": "hype",
    },
    "02_met_moi": {
        "name_vi": "Mệt mỏi / Kiệt sức",
        "name_en": "Tired / Exhausted",
        "emotion": ["tired", "frustrated", "overwhelmed"],
        "use_when": "Nói về làm việc quá sức, burnout, thiếu ngủ, mệt mỏi với công việc thủ công, cần tự động hóa",
        "default_mood": "sad",
    },
    "03_hop_hanh": {
        "name_vi": "Họp hành / Văn phòng",
        "name_en": "Meetings / Office",
        "emotion": ["bored", "annoyed", "resigned"],
        "use_when": "Nói về họp hành vô bổ, công việc văn phòng, Zoom call, lãng phí thời gian trong meeting",
        "default_mood": "funny",
    },
    "04_AI_cong_nghe": {
        "name_vi": "AI / Công nghệ",
        "name_en": "AI / Technology",
        "emotion": ["amazed", "futuristic", "curious"],
        "use_when": "Nói về AI, automation, công nghệ mới, robot, machine learning, chatbot, tool AI, demo công nghệ",
        "default_mood": "serious",
    },
    "05_coding": {
        "name_vi": "Lập trình / Code",
        "name_en": "Programming / Coding",
        "emotion": ["focused", "frustrated", "proud"],
        "use_when": "Nói về code, lập trình, debug, developer life, vibe coding, no-code, build app",
        "default_mood": "funny",
    },
    "06_shock_bat_ngo": {
        "name_vi": "Sốc / Bất ngờ",
        "name_en": "Shock / Surprise",
        "emotion": ["shocked", "amazed", "disbelief"],
        "use_when": "Nói về kết quả bất ngờ, số liệu gây sốc, plot twist, reveal, thông tin gây ngạc nhiên",
        "default_mood": "shock",
    },
    "07_thanh_cong": {
        "name_vi": "Thành công / Ăn mừng",
        "name_en": "Success / Celebration",
        "emotion": ["triumphant", "joyful", "proud"],
        "use_when": "Nói về đạt mục tiêu, kết quả tốt, milestone, thành tựu, ăn mừng, victory moment",
        "default_mood": "hype",
    },
    "08_that_bai_fail": {
        "name_vi": "Thất bại / Fail",
        "name_en": "Failure / Epic Fail",
        "emotion": ["disappointed", "desperate", "helpless"],
        "use_when": "Nói về lỗi, thất bại, sai lầm, bug, crash, mất dữ liệu, kết quả tệ, cảnh báo sai lầm",
        "default_mood": "funny",
    },
    "09_suy_nghi": {
        "name_vi": "Suy nghĩ / Tư duy",
        "name_en": "Thinking / Deep Thought",
        "emotion": ["contemplative", "confused", "enlightened"],
        "use_when": "Nói về suy nghĩ, phân tích, đặt câu hỏi, so sánh lựa chọn, brainstorm, strategy",
        "default_mood": "neutral",
    },
    "10_toc_do_nang_suat": {
        "name_vi": "Tốc độ / Năng suất",
        "name_en": "Speed / Productivity",
        "emotion": ["energetic", "determined", "efficient"],
        "use_when": "Nói về tốc độ, năng suất, hiệu quả, tiết kiệm thời gian, automation nhanh, workflow tối ưu",
        "default_mood": "hype",
    },
    "11_lazy_tri_hoan": {
        "name_vi": "Lười biếng / Trì hoãn",
        "name_en": "Lazy / Procrastination",
        "emotion": ["lazy", "unmotivated", "guilty"],
        "use_when": "Nói về trì hoãn, lười biếng, chưa bắt đầu, scroll phone cả ngày, thiếu động lực",
        "default_mood": "funny",
    },
    "12_so_sanh_before_after": {
        "name_vi": "So sánh / Before-After",
        "name_en": "Comparison / Before-After",
        "emotion": ["impressed", "motivated", "transformative"],
        "use_when": "Nói về trước/sau, so sánh kết quả, transformation, upgrade, level up, glow up nhờ AI",
        "default_mood": "hype",
    },
    "13_data_bieu_do": {
        "name_vi": "Dữ liệu / Biểu đồ",
        "name_en": "Data / Charts",
        "emotion": ["analytical", "serious", "impressed"],
        "use_when": "Nói về số liệu, thống kê, biểu đồ, analytics, dashboard, data-driven, ROI numbers",
        "default_mood": "serious",
    },
    "14_dien_thoai_mxh": {
        "name_vi": "Điện thoại / Mạng xã hội",
        "name_en": "Phone / Social Media",
        "emotion": ["addicted", "distracted", "connected"],
        "use_when": "Nói về social media, viral, content creator, notification, online marketing, digital life",
        "default_mood": "neutral",
    },
    "15_giai_thich": {
        "name_vi": "Giải thích / Hướng dẫn",
        "name_en": "Explanation / Teaching",
        "emotion": ["authoritative", "helpful", "clear"],
        "use_when": "Nói về giải thích concept, hướng dẫn step-by-step, breaking down, phân tích, dạy kiến thức",
        "default_mood": "serious",
    },
    "16_stress": {
        "name_vi": "Stress / Áp lực",
        "name_en": "Stress / Pressure",
        "emotion": ["anxious", "overwhelmed", "panicked"],
        "use_when": "Nói về deadline, áp lực công việc, stress, quá tải, chaos, cần giải pháp gấp",
        "default_mood": "sad",
    },
    "17_dong_y": {
        "name_vi": "Đồng ý / Tán thành",
        "name_en": "Agreement / Approval",
        "emotion": ["supportive", "confident", "affirming"],
        "use_when": "Nói về đồng tình, xác nhận, approve, đúng rồi, facts, chính xác, ủng hộ quan điểm",
        "default_mood": "hype",
    },
    "18_khong_dong_y": {
        "name_vi": "Không đồng ý / Phản đối",
        "name_en": "Disagreement / Rejection",
        "emotion": ["dismissive", "defiant", "critical"],
        "use_when": "Nói về phản bác, bác bỏ myth, nói không, sai lầm cần tránh, stop doing this",
        "default_mood": "serious",
    },
    "19_doi_cho_loading": {
        "name_vi": "Đợi chờ / Loading",
        "name_en": "Waiting / Loading",
        "emotion": ["impatient", "bored", "anticipating"],
        "use_when": "Nói về chờ đợi, loading, buffer, kết quả chưa ra, quá trình xử lý, suspense",
        "default_mood": "funny",
    },
    "20_phan_ung_da_nang": {
        "name_vi": "Phản ứng đa năng",
        "name_en": "Versatile Reactions",
        "emotion": ["sarcastic", "amused", "skeptical"],
        "use_when": "Phản ứng chung: nghi ngờ, mỉa mai, bình thản, drama, khi không có category cụ thể phù hợp",
        "default_mood": "funny",
    },
}

# ============================================================
# Keyword → tag/visual mapping helpers
# ============================================================

KEYWORD_ENRICHMENT = {
    # 01
    "money rain": {"tags": ["money", "rain", "cash", "rich"], "visual": "Bills/cash falling from sky like rain"},
    "make it rain cash": {"tags": ["money", "rain", "throwing", "cash"], "visual": "Person throwing money in the air"},
    "stonks meme": {"tags": ["stocks", "meme", "investing", "growth"], "visual": "Stonks meme man with rising arrow chart"},
    "dollar eyes": {"tags": ["money", "eyes", "greedy", "excited"], "visual": "Character with dollar signs in eyes"},
    "payday celebration": {"tags": ["payday", "celebration", "salary", "happy"], "visual": "Person celebrating payday with joy"},
    "passive income": {"tags": ["passive", "income", "money", "automated"], "visual": "Money flowing in passively, relaxed wealth"},
    # 02
    "tired exhausted": {"tags": ["tired", "exhausted", "sleepy", "burnout"], "visual": "Person falling asleep or extremely tired"},
    "falling asleep at desk": {"tags": ["sleeping", "desk", "office", "tired"], "visual": "Person dozing off at work desk"},
    "burnout": {"tags": ["burnout", "exhausted", "overwork", "drained"], "visual": "Person showing signs of complete burnout"},
    "coffee addict": {"tags": ["coffee", "caffeine", "morning", "energy"], "visual": "Person desperately drinking/needing coffee"},
    "monday mood": {"tags": ["monday", "mood", "depressed", "work"], "visual": "Dreading Monday morning feeling"},
    "zombie mode": {"tags": ["zombie", "tired", "dead", "walking"], "visual": "Person in zombie-like exhausted state"},
    # 03
    "boring meeting": {"tags": ["meeting", "boring", "office", "yawn"], "visual": "Person bored in a dull meeting"},
    "zoom call funny": {"tags": ["zoom", "video call", "remote", "funny"], "visual": "Funny moment on a video call"},
    "this meeting could be email": {"tags": ["meeting", "email", "waste", "time"], "visual": "Frustrated person in unnecessary meeting"},
    "pretending to listen": {"tags": ["fake", "listening", "distracted", "meeting"], "visual": "Person pretending to pay attention"},
    "office presentation": {"tags": ["presentation", "office", "slides", "speaking"], "visual": "Person giving an office presentation"},
    # 04
    "artificial intelligence": {"tags": ["AI", "intelligence", "brain", "neural"], "visual": "AI brain or neural network visualization"},
    "robot futuristic": {"tags": ["robot", "future", "tech", "android"], "visual": "Futuristic robot or android"},
    "matrix code rain": {"tags": ["matrix", "code", "green", "hacker"], "visual": "Green code rain like The Matrix"},
    "AI brain neural": {"tags": ["AI", "brain", "neural", "network"], "visual": "Neural network or AI brain visualization"},
    "iron man hologram": {"tags": ["hologram", "iron man", "tech", "interface"], "visual": "Holographic interface like Iron Man"},
    "chatbot AI": {"tags": ["chatbot", "AI", "conversation", "bot"], "visual": "AI chatbot interaction"},
    "futuristic technology": {"tags": ["future", "tech", "sci-fi", "innovation"], "visual": "Futuristic technology scene"},
    # 05
    "hacker typing": {"tags": ["hacker", "typing", "keyboard", "fast"], "visual": "Person typing rapidly on keyboard like a hacker"},
    "programming coding": {"tags": ["programming", "code", "developer", "screen"], "visual": "Code on screen, developer working"},
    "debugging developer": {"tags": ["debug", "bug", "fix", "developer"], "visual": "Developer frustrated while debugging"},
    "it works meme": {"tags": ["works", "success", "meme", "surprise"], "visual": "Celebration when code finally works"},
    "fix bug create more bugs": {"tags": ["bug", "fix", "broken", "cycle"], "visual": "Fixing one bug creates more bugs"},
    "developer life": {"tags": ["developer", "life", "code", "programmer"], "visual": "Day in the life of a developer"},
    # 06
    "mind blown": {"tags": ["mind blown", "amazed", "explosion", "wow"], "visual": "Head exploding with amazement"},
    "surprised pikachu": {"tags": ["pikachu", "surprised", "meme", "face"], "visual": "Surprised Pikachu face meme"},
    "jaw drop shocked": {"tags": ["jaw drop", "shocked", "stunned", "omg"], "visual": "Jaw dropping in shock and disbelief"},
    "plot twist": {"tags": ["plot twist", "unexpected", "surprise", "turn"], "visual": "Dramatic plot twist reaction"},
    "wait what meme": {"tags": ["wait", "what", "confused", "surprised"], "visual": "Double-take 'wait what' reaction"},
    "shooketh": {"tags": ["shook", "shocked", "shaking", "disbelief"], "visual": "Person visibly shaken and shocked"},
    # 07
    "celebration victory": {"tags": ["celebration", "victory", "win", "champion"], "visual": "Celebrating a big victory"},
    "we did it": {"tags": ["success", "team", "achievement", "celebration"], "visual": "Group celebration after achieving goal"},
    "confetti celebration": {"tags": ["confetti", "party", "celebration", "festive"], "visual": "Confetti raining down in celebration"},
    "mic drop": {"tags": ["mic drop", "boss", "confident", "done"], "visual": "Dropping microphone after epic moment"},
    "nailed it success": {"tags": ["nailed it", "perfect", "success", "proud"], "visual": "Perfect execution, nailed it moment"},
    "lets go hype": {"tags": ["hype", "energy", "lets go", "pumped"], "visual": "Hyped up and ready to go"},
    # 08
    "epic fail": {"tags": ["fail", "epic", "disaster", "mistake"], "visual": "Something going spectacularly wrong"},
    "this is fine fire": {"tags": ["fire", "fine", "calm", "disaster"], "visual": "Dog sitting in burning room saying 'this is fine'"},
    "disaster fail": {"tags": ["disaster", "crash", "destruction", "fail"], "visual": "Everything falling apart catastrophically"},
    "error 404": {"tags": ["error", "404", "not found", "broken"], "visual": "Error 404 not found screen"},
    "blue screen of death": {"tags": ["BSOD", "crash", "windows", "error"], "visual": "Windows blue screen of death"},
    "everything is broken": {"tags": ["broken", "crash", "chaos", "desperate"], "visual": "Everything breaking down at once"},
    # 09
    "thinking hmm": {"tags": ["thinking", "hmm", "pondering", "consider"], "visual": "Person deep in thought, chin on hand"},
    "calculating math meme": {"tags": ["calculating", "math", "numbers", "brain"], "visual": "Math equations floating around head"},
    "galaxy brain": {"tags": ["galaxy brain", "genius", "big brain", "smart"], "visual": "Expanding brain meme, galaxy brain"},
    "confused math lady": {"tags": ["confused", "math", "woman", "meme"], "visual": "Woman confused with math equations"},
    "big brain time": {"tags": ["big brain", "smart", "genius", "idea"], "visual": "Expanded brain, big brain time meme"},
    "processing thinking": {"tags": ["processing", "loading", "thinking", "compute"], "visual": "Brain processing/loading information"},
    # 10
    "fast speed": {"tags": ["fast", "speed", "quick", "rapid"], "visual": "Something moving extremely fast"},
    "productivity hustle": {"tags": ["productivity", "hustle", "work", "efficient"], "visual": "Person working with high productivity"},
    "multitasking": {"tags": ["multitask", "multiple", "busy", "juggling"], "visual": "Person juggling multiple tasks at once"},
    "speedrun": {"tags": ["speedrun", "fast", "record", "quick"], "visual": "Speed running through tasks rapidly"},
    "time lapse working": {"tags": ["timelapse", "working", "progress", "fast"], "visual": "Time-lapse of work being done quickly"},
    # 11
    "lazy procrastination": {"tags": ["lazy", "procrastination", "delay", "tomorrow"], "visual": "Person lazily avoiding work"},
    "couch potato": {"tags": ["couch", "lazy", "potato", "relaxing"], "visual": "Person being a couch potato"},
    "not today": {"tags": ["nope", "not today", "refuse", "lazy"], "visual": "Refusing to do anything today"},
    "scrolling phone bored": {"tags": ["scrolling", "phone", "bored", "wasting"], "visual": "Mindlessly scrolling on phone"},
    "do nothing lazy": {"tags": ["nothing", "lazy", "idle", "chill"], "visual": "Person doing absolutely nothing"},
    # 12
    "before and after": {"tags": ["before", "after", "comparison", "change"], "visual": "Side-by-side before and after comparison"},
    "expectation vs reality": {"tags": ["expectation", "reality", "comparison", "truth"], "visual": "Expectation vs reality contrast"},
    "glow up transformation": {"tags": ["glow up", "transform", "upgrade", "better"], "visual": "Dramatic transformation/glow up"},
    "level up upgrade": {"tags": ["level up", "upgrade", "evolve", "improve"], "visual": "Leveling up or upgrading power"},
    # 13
    "chart going up": {"tags": ["chart", "growth", "up", "increase"], "visual": "Graph/chart line going up dramatically"},
    "data visualization": {"tags": ["data", "visualization", "infographic", "chart"], "visual": "Beautiful data visualization or dashboard"},
    "analytics dashboard": {"tags": ["analytics", "dashboard", "metrics", "KPI"], "visual": "Analytics dashboard with metrics"},
    "big data": {"tags": ["big data", "data", "massive", "information"], "visual": "Big data visualization flowing"},
    "statistics numbers": {"tags": ["statistics", "numbers", "data", "math"], "visual": "Statistics and numbers display"},
    # 14
    "scrolling phone": {"tags": ["scrolling", "phone", "mobile", "app"], "visual": "Person scrolling through phone"},
    "social media notification": {"tags": ["notification", "social media", "alert", "ping"], "visual": "Social media notifications popping up"},
    "viral trending": {"tags": ["viral", "trending", "popular", "hot"], "visual": "Something going viral and trending"},
    "content creator": {"tags": ["content", "creator", "influencer", "camera"], "visual": "Content creator working on content"},
    "doom scrolling": {"tags": ["doom scroll", "addicted", "phone", "endless"], "visual": "Endlessly scrolling through feed"},
    # 15
    "let me explain": {"tags": ["explain", "teach", "point", "lecture"], "visual": "Person explaining something earnestly"},
    "pointing whiteboard": {"tags": ["whiteboard", "pointing", "teaching", "diagram"], "visual": "Person pointing at whiteboard explanation"},
    "ted talk explaining": {"tags": ["ted talk", "speech", "explain", "stage"], "visual": "Speaker explaining on stage like TED"},
    "breaking news announcement": {"tags": ["breaking news", "announcement", "alert", "important"], "visual": "Breaking news announcement style"},
    "teaching lesson": {"tags": ["teaching", "lesson", "class", "education"], "visual": "Teacher giving a lesson"},
    # 16
    "stress panic": {"tags": ["stress", "panic", "anxiety", "worried"], "visual": "Person in visible stress and panic"},
    "deadline pressure": {"tags": ["deadline", "pressure", "urgent", "clock"], "visual": "Racing against a tight deadline"},
    "overwhelmed chaos": {"tags": ["overwhelmed", "chaos", "too much", "drowning"], "visual": "Person drowning in chaos and work"},
    "anxiety help": {"tags": ["anxiety", "nervous", "worried", "help"], "visual": "Person experiencing anxiety"},
    "crying stressed": {"tags": ["crying", "stressed", "tears", "breakdown"], "visual": "Person crying from stress"},
    # 17
    "thumbs up approved": {"tags": ["thumbs up", "approve", "good", "yes"], "visual": "Thumbs up approval gesture"},
    "clapping agree": {"tags": ["clapping", "applause", "agree", "bravo"], "visual": "Clapping in agreement and approval"},
    "nodding yes": {"tags": ["nodding", "yes", "agree", "affirmative"], "visual": "Person nodding in agreement"},
    "exactly correct facts": {"tags": ["exactly", "correct", "facts", "right"], "visual": "Pointing and saying 'exactly right'"},
    "100 percent agree": {"tags": ["100%", "agree", "totally", "absolute"], "visual": "Complete agreement, 100 percent"},
    # 18
    "nope reject": {"tags": ["nope", "reject", "no", "refuse"], "visual": "Firmly saying nope/no way"},
    "denied cancelled": {"tags": ["denied", "cancelled", "rejected", "stop"], "visual": "Request denied stamp or gesture"},
    "delete trash bye": {"tags": ["delete", "trash", "bye", "remove"], "visual": "Throwing something in the trash/deleting"},
    "no way disagree": {"tags": ["no way", "disagree", "refuse", "impossible"], "visual": "Strong disagreement gesture"},
    # 19
    "waiting loading": {"tags": ["waiting", "loading", "patience", "slow"], "visual": "Loading spinner or waiting animation"},
    "buffering patience": {"tags": ["buffering", "loading", "circle", "slow"], "visual": "Buffering circle spinning endlessly"},
    "hourglass waiting": {"tags": ["hourglass", "time", "waiting", "sand"], "visual": "Hourglass with sand running down"},
    "skeleton waiting meme": {"tags": ["skeleton", "waiting", "forever", "meme"], "visual": "Skeleton that waited too long meme"},
    "any minute now": {"tags": ["waiting", "soon", "impatient", "tapping"], "visual": "Impatiently waiting for something"},
    # 20
    "side eye look": {"tags": ["side eye", "suspicious", "look", "judging"], "visual": "Giving a suspicious side-eye look"},
    "eye roll sarcastic": {"tags": ["eye roll", "sarcastic", "annoyed", "whatever"], "visual": "Sarcastic eye roll reaction"},
    "shrug whatever": {"tags": ["shrug", "whatever", "don't care", "meh"], "visual": "Shrugging shoulders, don't care"},
    "cool cool cool": {"tags": ["cool", "chill", "okay", "fine"], "visual": "Saying cool cool cool sarcastically"},
    "sipping tea drama": {"tags": ["tea", "drama", "sipping", "watching"], "visual": "Sipping tea while watching drama"},
    "eating popcorn watching": {"tags": ["popcorn", "watching", "drama", "entertainment"], "visual": "Eating popcorn watching events unfold"},
    "facepalm reaction": {"tags": ["facepalm", "disappointed", "cringe", "ugh"], "visual": "Facepalm in disappointment"},
    "wink smirk": {"tags": ["wink", "smirk", "flirty", "knowing"], "visual": "Winking or smirking knowingly"},
}

# best_for mapping by category
CATEGORY_BEST_FOR = {
    "01_tien_bac": ["hook về thu nhập/kiếm tiền", "reveal kết quả tài chính", "nói về passive income/ROI"],
    "02_met_moi": ["mô tả pain point làm việc thủ công", "trước khi giới thiệu giải pháp", "nói về burnout"],
    "03_hop_hanh": ["pain point lãng phí thời gian", "trước khi giới thiệu automation", "nói về làm việc không hiệu quả"],
    "04_AI_cong_nghe": ["giới thiệu tool AI mới", "demo công nghệ", "nói về tương lai AI"],
    "05_coding": ["demo code/vibe coding", "nói về lập trình/no-code", "developer humor"],
    "06_shock_bat_ngo": ["hook gây sốc", "reveal số liệu bất ngờ", "plot twist trong story"],
    "07_thanh_cong": ["show kết quả thành công", "milestone/achievement", "kết video tích cực"],
    "08_that_bai_fail": ["cảnh báo sai lầm", "show lỗi thường gặp", "before khi fix"],
    "09_suy_nghi": ["đặt câu hỏi cho viewer", "phân tích/so sánh", "transition suy nghĩ"],
    "10_toc_do_nang_suat": ["show tốc độ automation", "before/after năng suất", "nói về tiết kiệm thời gian"],
    "11_lazy_tri_hoan": ["mô tả thói quen xấu", "pain point trì hoãn", "trước khi motivate"],
    "12_so_sanh_before_after": ["so sánh trước/sau dùng AI", "transformation", "upgrade/level up"],
    "13_data_bieu_do": ["show số liệu/thống kê", "chứng minh bằng data", "analytics/dashboard demo"],
    "14_dien_thoai_mxh": ["nói về social media/marketing", "content creator life", "digital tools"],
    "15_giai_thich": ["giải thích concept", "hướng dẫn step-by-step", "teaching moment"],
    "16_stress": ["pain point áp lực", "trước khi giới thiệu giải pháp", "nói về deadline"],
    "17_dong_y": ["xác nhận quan điểm", "đồng ý với viewer", "emphasize key point"],
    "18_khong_dong_y": ["bác bỏ myth/sai lầm", "nói KHÔNG với cách cũ", "phản bác quan điểm sai"],
    "19_doi_cho_loading": ["chờ kết quả AI xử lý", "suspense trước reveal", "nói về tốc độ chậm"],
    "20_phan_ung_da_nang": ["reaction đa năng", "comedic relief", "transition giữa các phần"],
}


def extract_title_from_filename(filename: str) -> str:
    """Extract GIF title from filename pattern: 'keyword_N_Title.gif'"""
    name = filename.rsplit(".gif", 1)[0]
    parts = name.split("_", 2)
    if len(parts) >= 3:
        return parts[2].strip()
    return name


def build_file_entry(keyword: str, filename: str, category: str, giphy_url: str) -> dict:
    """Build enriched file entry for catalog."""
    enrichment = KEYWORD_ENRICHMENT.get(keyword, {})
    cat_meta = CATEGORY_META.get(category, {})

    # Tags: from enrichment or derive from keyword
    tags = enrichment.get("tags", keyword.lower().split()[:4])

    # Mood: from category default
    mood = cat_meta.get("default_mood", "neutral")

    # Visual: from enrichment or derive from title
    title = extract_title_from_filename(filename)
    visual = enrichment.get("visual", f"{title}" if title else f"{keyword} reaction GIF")

    # best_for: from category defaults
    best_for = CATEGORY_BEST_FOR.get(category, ["general reaction"])

    return {
        "file": filename,
        "tags": tags,
        "mood": mood,
        "visual": visual,
        "best_for": best_for,
    }


def scan_folder_for_missing(category_dir: str, indexed_files: set) -> list:
    """Find GIF files in folder not in index."""
    missing = []
    if not os.path.isdir(category_dir):
        return missing
    for f in os.listdir(category_dir):
        if f.lower().endswith(".gif") and f not in indexed_files:
            missing.append(f)
    return sorted(missing)


def main():
    # Load existing index
    with open(INDEX_PATH, "r", encoding="utf-8") as f:
        index = json.load(f)

    catalog = {"version": 1, "total_files": 0, "categories": {}}

    for category, entries in index.items():
        cat_meta = CATEGORY_META.get(category, {})

        cat_entry = {
            "name_vi": cat_meta.get("name_vi", category),
            "name_en": cat_meta.get("name_en", category),
            "emotion": cat_meta.get("emotion", []),
            "use_when": cat_meta.get("use_when", ""),
            "files": [],
        }

        indexed_files = set()

        # Process indexed files
        for entry in entries:
            keyword = entry["keyword"]
            filename = entry["file"]
            giphy_url = entry.get("giphy_url", "")
            indexed_files.add(filename)

            file_entry = build_file_entry(keyword, filename, category, giphy_url)
            cat_entry["files"].append(file_entry)

        # Scan for missing files not in index
        category_dir = os.path.join(BROLL_DIR, category)
        missing = scan_folder_for_missing(category_dir, indexed_files)
        for filename in missing:
            # Derive keyword from filename
            keyword_guess = filename.split("_")[0] if "_" in filename else category
            file_entry = build_file_entry(keyword_guess, filename, category, "")
            cat_entry["files"].append(file_entry)

        catalog["categories"][category] = cat_entry
        catalog["total_files"] += len(cat_entry["files"])

    # Write catalog
    with open(CATALOG_PATH, "w", encoding="utf-8") as f:
        json.dump(catalog, f, ensure_ascii=False, indent=2)

    print(f"Generated {CATALOG_PATH}")
    print(f"Total files: {catalog['total_files']}")
    print(f"Categories: {len(catalog['categories'])}")
    for cat, data in catalog["categories"].items():
        print(f"  {cat}: {len(data['files'])} files")


if __name__ == "__main__":
    main()
