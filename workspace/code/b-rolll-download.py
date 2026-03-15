"""
🎬 B-ROLL GIF DOWNLOADER cho Video Editor
==========================================
Script tự động tải GIF từ Giphy theo danh mục keyword.

HƯỚNG DẪN:
1. Lấy API Key miễn phí tại: https://developers.giphy.com/dashboard/
   - Tạo tài khoản → Create App → chọn "API" → copy API Key
2. Paste API Key vào biến GIPHY_API_KEY bên dưới
3. Chạy: python download_broll_gifs.py
4. GIF sẽ được tải vào thư mục "broll_gifs/" chia theo từng folder

Mỗi keyword tải 3 GIF (có thể chỉnh NUM_GIFS_PER_KEYWORD)
"""

import os
import requests
import time
import json

# ============================================================
# ⚙️ CẤU HÌNH - CHỈNH SỬA TẠI ĐÂY
# ============================================================

GIPHY_API_KEY = "z4uWw1oPy9vzwYrmC6U38zloJRvpC0Hh"  # <-- Paste API key vào đây
NUM_GIFS_PER_KEYWORD = 3                    # Số GIF tải cho mỗi keyword
OUTPUT_DIR = "broll_gifs"                   # Thư mục lưu GIF
GIF_QUALITY = "downsized_medium"            # Chất lượng: original, downsized_medium, fixed_width
RATING = "g"                                # Rating: g, pg, pg-13, r

# ============================================================
# 📋 DANH SÁCH KEYWORD THEO DANH MỤC
# ============================================================

CATEGORIES = {
    "01_tien_bac": [
        "money rain",
        "make it rain cash",
        "stonks meme",
        "dollar eyes",
        "payday celebration",
        "passive income",
    ],
    "02_met_moi": [
        "tired exhausted",
        "falling asleep at desk",
        "burnout",
        "coffee addict",
        "monday mood",
        "zombie mode",
    ],
    "03_hop_hanh": [
        "boring meeting",
        "zoom call funny",
        "this meeting could be email",
        "pretending to listen",
        "office presentation",
    ],
    "04_AI_cong_nghe": [
        "artificial intelligence",
        "robot futuristic",
        "matrix code rain",
        "AI brain neural",
        "iron man hologram",
        "chatbot AI",
        "futuristic technology",
    ],
    "05_coding": [
        "hacker typing",
        "programming coding",
        "debugging developer",
        "it works meme",
        "fix bug create more bugs",
        "developer life",
    ],
    "06_shock_bat_ngo": [
        "mind blown",
        "surprised pikachu",
        "jaw drop shocked",
        "plot twist",
        "wait what meme",
        "shooketh",
    ],
    "07_thanh_cong": [
        "celebration victory",
        "we did it",
        "confetti celebration",
        "mic drop",
        "nailed it success",
        "lets go hype",
    ],
    "08_that_bai_fail": [
        "epic fail",
        "this is fine fire",
        "disaster fail",
        "error 404",
        "blue screen of death",
        "everything is broken",
    ],
    "09_suy_nghi": [
        "thinking hmm",
        "calculating math meme",
        "galaxy brain",
        "confused math lady",
        "big brain time",
        "processing thinking",
    ],
    "10_toc_do_nang_suat": [
        "fast speed",
        "productivity hustle",
        "multitasking",
        "speedrun",
        "time lapse working",
    ],
    "11_lazy_tri_hoan": [
        "lazy procrastination",
        "couch potato",
        "not today",
        "scrolling phone bored",
        "do nothing lazy",
    ],
    "12_so_sanh_before_after": [
        "before and after",
        "expectation vs reality",
        "glow up transformation",
        "level up upgrade",
    ],
    "13_data_bieu_do": [
        "chart going up",
        "data visualization",
        "analytics dashboard",
        "big data",
        "statistics numbers",
    ],
    "14_dien_thoai_mxh": [
        "scrolling phone",
        "social media notification",
        "viral trending",
        "content creator",
        "doom scrolling",
    ],
    "15_giai_thich": [
        "let me explain",
        "pointing whiteboard",
        "ted talk explaining",
        "breaking news announcement",
        "teaching lesson",
    ],
    "16_stress": [
        "stress panic",
        "deadline pressure",
        "overwhelmed chaos",
        "anxiety help",
        "crying stressed",
    ],
    "17_dong_y": [
        "thumbs up approved",
        "clapping agree",
        "nodding yes",
        "exactly correct facts",
        "100 percent agree",
    ],
    "18_khong_dong_y": [
        "nope reject",
        "denied cancelled",
        "delete trash bye",
        "no way disagree",
    ],
    "19_doi_cho_loading": [
        "waiting loading",
        "buffering patience",
        "hourglass waiting",
        "skeleton waiting meme",
        "any minute now",
    ],
    "20_phan_ung_da_nang": [
        "side eye look",
        "eye roll sarcastic",
        "shrug whatever",
        "cool cool cool",
        "sipping tea drama",
        "eating popcorn watching",
        "facepalm reaction",
        "wink smirk",
    ],
}


# ============================================================
# 🔧 LOGIC TẢI GIF
# ============================================================

def search_giphy(keyword, limit=3):
    """Tìm GIF trên Giphy theo keyword"""
    url = "https://api.giphy.com/v1/gifs/search"
    params = {
        "api_key": GIPHY_API_KEY,
        "q": keyword,
        "limit": limit,
        "rating": RATING,
        "lang": "en",
    }
    try:
        resp = requests.get(url, params=params, timeout=10)
        resp.raise_for_status()
        return resp.json().get("data", [])
    except Exception as e:
        print(f"   ❌ Lỗi tìm kiếm '{keyword}': {e}")
        return []


def download_gif(url, filepath):
    """Tải GIF từ URL về file"""
    try:
        resp = requests.get(url, timeout=30)
        resp.raise_for_status()
        with open(filepath, "wb") as f:
            f.write(resp.content)
        size_mb = len(resp.content) / (1024 * 1024)
        return True, size_mb
    except Exception as e:
        print(f"   ❌ Lỗi tải: {e}")
        return False, 0


def sanitize_filename(name):
    """Chuẩn hóa tên file"""
    return "".join(c if c.isalnum() or c in "._- " else "_" for c in name).strip()


def main():
    if GIPHY_API_KEY == "PASTE_YOUR_API_KEY_HERE":
        print("=" * 60)
        print("⚠️  BẠN CHƯA NHẬP API KEY!")
        print()
        print("1. Vào https://developers.giphy.com/dashboard/")
        print("2. Tạo tài khoản (miễn phí)")
        print("3. Nhấn 'Create an App' → chọn 'API'")
        print("4. Copy API Key")
        print("5. Paste vào biến GIPHY_API_KEY trong file này")
        print("=" * 60)
        return

    # Thống kê
    total_keywords = sum(len(kws) for kws in CATEGORIES.values())
    total_expected = total_keywords * NUM_GIFS_PER_KEYWORD
    total_downloaded = 0
    total_failed = 0
    total_size = 0

    print("🎬 B-ROLL GIF DOWNLOADER")
    print("=" * 60)
    print(f"📁 Thư mục lưu : {OUTPUT_DIR}/")
    print(f"📋 Danh mục     : {len(CATEGORIES)}")
    print(f"🔑 Keywords     : {total_keywords}")
    print(f"📥 Dự kiến tải  : ~{total_expected} GIFs")
    print(f"🎨 Chất lượng   : {GIF_QUALITY}")
    print("=" * 60)

    os.makedirs(OUTPUT_DIR, exist_ok=True)

    # Lưu index để dễ tìm kiếm sau
    index = {}

    for cat_idx, (category, keywords) in enumerate(CATEGORIES.items(), 1):
        cat_dir = os.path.join(OUTPUT_DIR, category)
        os.makedirs(cat_dir, exist_ok=True)

        print(f"\n📂 [{cat_idx}/{len(CATEGORIES)}] {category}")
        print("-" * 40)

        index[category] = []

        for kw_idx, keyword in enumerate(keywords, 1):
            print(f"   🔍 ({kw_idx}/{len(keywords)}) Tìm: \"{keyword}\"")

            gifs = search_giphy(keyword, limit=NUM_GIFS_PER_KEYWORD)

            if not gifs:
                print(f"      ⚠️  Không tìm thấy GIF")
                total_failed += NUM_GIFS_PER_KEYWORD
                continue

            for i, gif in enumerate(gifs):
                gif_url = gif.get("images", {}).get(GIF_QUALITY, {}).get("url")
                if not gif_url:
                    gif_url = gif.get("images", {}).get("original", {}).get("url")

                if not gif_url:
                    total_failed += 1
                    continue

                title = sanitize_filename(gif.get("title", f"gif_{i}"))[:50]
                filename = f"{sanitize_filename(keyword)}_{i+1}_{title}.gif"
                filepath = os.path.join(cat_dir, filename)

                if os.path.exists(filepath):
                    print(f"      ⏭️  Đã có: {filename}")
                    total_downloaded += 1
                    continue

                success, size = download_gif(gif_url, filepath)
                if success:
                    total_downloaded += 1
                    total_size += size
                    print(f"      ✅ {filename} ({size:.1f}MB)")
                    index[category].append({
                        "keyword": keyword,
                        "file": filename,
                        "giphy_url": gif.get("url", ""),
                    })
                else:
                    total_failed += 1

            # Chờ 0.5s giữa mỗi keyword (tránh rate limit)
            time.sleep(0.5)

    # Lưu file index
    index_path = os.path.join(OUTPUT_DIR, "_index.json")
    with open(index_path, "w", encoding="utf-8") as f:
        json.dump(index, f, ensure_ascii=False, indent=2)

    # Tạo file README
    readme_path = os.path.join(OUTPUT_DIR, "_README.txt")
    with open(readme_path, "w", encoding="utf-8") as f:
        f.write("🎬 B-ROLL GIF COLLECTION\n")
        f.write("=" * 40 + "\n\n")
        for category, keywords in CATEGORIES.items():
            f.write(f"📂 {category}/\n")
            for kw in keywords:
                f.write(f"   - {kw}\n")
            f.write("\n")

    # Kết quả
    print("\n" + "=" * 60)
    print("🎉 HOÀN TẤT!")
    print(f"   ✅ Đã tải   : {total_downloaded} GIFs")
    print(f"   ❌ Thất bại  : {total_failed}")
    print(f"   💾 Tổng dung : {total_size:.1f} MB")
    print(f"   📁 Thư mục  : {os.path.abspath(OUTPUT_DIR)}/")
    print(f"   📋 Index    : {index_path}")
    print("=" * 60)


if __name__ == "__main__":
    main()