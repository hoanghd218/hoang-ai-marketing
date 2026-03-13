# Content Pillars Automation System — Hoang AI Marketing

> 5 Pillars | 35+ Skills | 4 Agents | 3 External APIs

---

## Tong quan he thong

```mermaid
graph TB
    subgraph TITLE[" "]
        direction TB
        T["🎯 CONTENT PILLARS AUTOMATION SYSTEM<br/>Hoàng AI Marketing"]
    end

    style TITLE fill:none,stroke:none
    style T fill:#1e3a5f,stroke:#1e3a5f,color:#fff,font-size:18px
```

---

## PILLAR 1: AI Demo & Tutorials (40%)

**Agent: `mkt-pillar1-ai-demo-researcher`**

```mermaid
graph TD
    subgraph P1["🟣 PILLAR 1 — AI Demo & Tutorials (40%)"]
        direction TB

        YTF["🔵 youtube-trend-finder<br/>channels: ai-tech"]
        YTT["🔵 youtube-transcript<br/>parallel, max 5"]

        CVA["🟠 mkt-competitor-video-<br/>strategy-analyzer ⭐NEW"]
        IE["🔵 mkt-insight-extractor"]
        SSA["🔵 script-storytelling-analyzer"]

        CKC["🟠 mkt-content-knowledge-<br/>compiler ⭐NEW"]
        CSV["🔵 mkt-create-script-<br/>storytelling-video"]

        NOTION1["🟡 Notion"]
        TELE1["🟡 Telegram"]
        YT1["🟡 YouTube Script"]

        YTF --> YTT
        YTT --> CVA
        YTT --> IE
        YTT --> SSA
        CVA --> CKC
        IE --> CKC
        SSA --> CKC
        CKC --> CSV
        CSV --> NOTION1
        CSV --> TELE1
        CSV --> YT1
    end

    style P1 fill:#f0f0ff,stroke:#6d28d9,stroke-width:2px
    style CVA fill:#fed7aa,stroke:#c2410c,color:#000
    style CKC fill:#fed7aa,stroke:#c2410c,color:#000
    style YTF fill:#dbeafe,stroke:#1e40af,color:#000
    style YTT fill:#dbeafe,stroke:#1e40af,color:#000
    style IE fill:#dbeafe,stroke:#1e40af,color:#000
    style SSA fill:#dbeafe,stroke:#1e40af,color:#000
    style CSV fill:#dbeafe,stroke:#1e40af,color:#000
    style NOTION1 fill:#fef3c7,stroke:#b45309,color:#000
    style TELE1 fill:#fef3c7,stroke:#b45309,color:#000
    style YT1 fill:#fef3c7,stroke:#b45309,color:#000
```

---

## PILLAR 2: One Person Business (25%)

**Manual trigger — no agent**

```mermaid
graph TD
    subgraph P2["PILLAR 2 — One Person Business (25%)"]
        direction TB

        BVF["🔵 breakout-video-finder<br/>Dan Koe, Chris Do, Justin Welsh"]
        YTT2["🔵 youtube-transcript"]
        CSV2["🔵 mkt-create-script-<br/>storytelling-video"]

        SLIDE["🔵 mkt-edu-slide-nano"]
        FB2["🔵 video-to-facebook-posts"]
        IMG2["🔵 image-post-creator"]

        OUT_YT["🟡 YouTube"]
        OUT_FB["🟡 Facebook"]
        OUT_TT["🟡 TikTok"]

        BVF --> YTT2
        YTT2 --> CSV2
        CSV2 --> SLIDE
        CSV2 --> FB2
        CSV2 --> IMG2
        SLIDE --> OUT_YT
        FB2 --> OUT_FB
        IMG2 --> OUT_TT
    end

    style P2 fill:#f0fff0,stroke:#047857,stroke-width:2px
    style BVF fill:#dbeafe,stroke:#1e40af,color:#000
    style YTT2 fill:#dbeafe,stroke:#1e40af,color:#000
    style CSV2 fill:#dbeafe,stroke:#1e40af,color:#000
    style SLIDE fill:#dbeafe,stroke:#1e40af,color:#000
    style FB2 fill:#dbeafe,stroke:#1e40af,color:#000
    style IMG2 fill:#dbeafe,stroke:#1e40af,color:#000
    style OUT_YT fill:#fef3c7,stroke:#b45309,color:#000
    style OUT_FB fill:#fef3c7,stroke:#b45309,color:#000
    style OUT_TT fill:#fef3c7,stroke:#b45309,color:#000
```

---

## PILLAR 3: AI News & Trends (15%)

**Agent: `mkt-daily-ai-news-scout`**

```mermaid
graph TD
    subgraph P3["🟣 PILLAR 3 — AI News & Trends (15%)"]
        direction TB

        AGG["🟠 mkt-ai-news-aggregator ⭐NEW"]

        PERP["🟢 Perplexity Sonar API"]
        GH["🟢 GitHub Trending API"]
        GROK["🟢 xAI Grok API"]

        DIGEST["📄 digest.json"]

        NCB["🟠 mkt-news-to-content-brief ⭐NEW"]

        SV["🔵 mkt-create-script-short-video"]
        FBP["🔵 video-to-facebook-posts"]
        TELE3["🟡 Telegram<br/>top 3 briefs"]

        AGG --> PERP
        AGG --> GH
        AGG --> GROK
        PERP --> DIGEST
        GH --> DIGEST
        GROK --> DIGEST
        DIGEST --> NCB
        NCB --> SV
        NCB --> FBP
        NCB --> TELE3
    end

    style P3 fill:#fff0f0,stroke:#dc2626,stroke-width:2px
    style AGG fill:#fed7aa,stroke:#c2410c,color:#000
    style NCB fill:#fed7aa,stroke:#c2410c,color:#000
    style PERP fill:#a7f3d0,stroke:#047857,color:#000
    style GH fill:#a7f3d0,stroke:#047857,color:#000
    style GROK fill:#a7f3d0,stroke:#047857,color:#000
    style DIGEST fill:#f3f4f6,stroke:#64748b,color:#000
    style SV fill:#dbeafe,stroke:#1e40af,color:#000
    style FBP fill:#dbeafe,stroke:#1e40af,color:#000
    style TELE3 fill:#fef3c7,stroke:#b45309,color:#000
```

---

## PILLAR 4: Mindset & Chuyen doi so (10%)

**Two branches — no agent**

```mermaid
graph TD
    subgraph P4["PILLAR 4 — Mindset & CĐS (10%)"]
        direction TB

        subgraph A["Branch A: Sách"]
            BOOK["📚 Book excerpt"]
            BWP["🔵 mkt-book-to-wisdom-posts<br/>6 formats"]
            IMGA["🔵 image-post-creator"]
            FBA["🟡 Facebook<br/>Wisdom Posts"]

            BOOK --> BWP
            BWP --> IMGA
            IMGA --> FBA
        end

        subgraph B["Branch B: Video Repurpose"]
            YTT4["🔵 youtube-transcript<br/>Simon Sinek, Ali Abdaal"]
            REP["🟠 mkt-content-repurposer ⭐NEW"]

            OUT_W["Wisdom posts"]
            OUT_F["Facebook posts"]
            OUT_S["Short video scripts"]
            OUT_R["Reels text overlay"]
            PACK["📄 content-pack.md<br/>4-5 pieces"]

            YTT4 --> REP
            REP --> OUT_W
            REP --> OUT_F
            REP --> OUT_S
            REP --> OUT_R
            OUT_W --> PACK
            OUT_F --> PACK
            OUT_S --> PACK
            OUT_R --> PACK
        end
    end

    style P4 fill:#fffff0,stroke:#b45309,stroke-width:2px
    style A fill:#f0f9ff,stroke:#93c5fd
    style B fill:#fef9f0,stroke:#fed7aa
    style BOOK fill:#f3f4f6,stroke:#64748b,color:#000
    style BWP fill:#dbeafe,stroke:#1e40af,color:#000
    style IMGA fill:#dbeafe,stroke:#1e40af,color:#000
    style FBA fill:#fef3c7,stroke:#b45309,color:#000
    style YTT4 fill:#dbeafe,stroke:#1e40af,color:#000
    style REP fill:#fed7aa,stroke:#c2410c,color:#000
    style OUT_W fill:#e0f2fe,stroke:#0284c7,color:#000
    style OUT_F fill:#e0f2fe,stroke:#0284c7,color:#000
    style OUT_S fill:#e0f2fe,stroke:#0284c7,color:#000
    style OUT_R fill:#e0f2fe,stroke:#0284c7,color:#000
    style PACK fill:#f3f4f6,stroke:#64748b,color:#000
```

---

## PILLAR 5: Behind-the-scenes (10%)

**Manual trigger — no agent**

```mermaid
graph TD
    subgraph P5["PILLAR 5 — Behind-the-scenes (10%)"]
        direction TB

        RAW["📝 Raw notes / metrics /<br/>lessons learned"]
        BIP["🟠 mkt-build-in-public-<br/>post-creator ⭐NEW<br/>5 templates"]
        IMG5["🔵 image-post-creator"]
        FB5["🟡 Facebook<br/>BIP Posts"]

        RAW --> BIP
        BIP --> IMG5
        IMG5 --> FB5
    end

    style P5 fill:#f5f0ff,stroke:#7c3aed,stroke-width:2px
    style RAW fill:#f3f4f6,stroke:#64748b,color:#000
    style BIP fill:#fed7aa,stroke:#c2410c,color:#000
    style IMG5 fill:#dbeafe,stroke:#1e40af,color:#000
    style FB5 fill:#fef3c7,stroke:#b45309,color:#000
```

---

## Shared Infrastructure

```mermaid
graph LR
    subgraph INFRA["Shared Infrastructure"]
        direction TB

        subgraph AGENTS["🟣 Agents"]
            AG1["mkt-pillar1-ai-demo-researcher<br/>P1 end-to-end"]
            AG2["mkt-daily-ai-news-scout<br/>P3 end-to-end"]
            AG3["trend-researcher<br/>YouTube research"]
        end

        subgraph APIS["🟢 External APIs"]
            API1["YouTube Data v3"]
            API2["Perplexity Sonar"]
            API3["xAI Grok"]
            API4["GitHub API"]
            API5["Notion API"]
            API6["Telegram Bot"]
        end

        subgraph KB["📚 Knowledge Base"]
            KB1["hooks-that-work.md"]
            KB2["title-formulas.md"]
            KB3["video-structures.md"]
            KB4["insights-library.md"]
        end

        subgraph CH["📺 Monitored Channels"]
            CH1["ai-tech: 9 channels"]
            CH2["one-person-business: 3 channels"]
            CH3["mindset: 2 channels"]
        end
    end

    style INFRA fill:#f8fafc,stroke:#64748b,stroke-width:2px
    style AGENTS fill:#ddd6fe,stroke:#6d28d9
    style APIS fill:#a7f3d0,stroke:#047857
    style KB fill:#fef3c7,stroke:#b45309
    style CH fill:#dbeafe,stroke:#1e40af
    style AG1 fill:#ddd6fe,stroke:#6d28d9,color:#000
    style AG2 fill:#ddd6fe,stroke:#6d28d9,color:#000
    style AG3 fill:#ddd6fe,stroke:#6d28d9,color:#000
    style API1 fill:#a7f3d0,stroke:#047857,color:#000
    style API2 fill:#a7f3d0,stroke:#047857,color:#000
    style API3 fill:#a7f3d0,stroke:#047857,color:#000
    style API4 fill:#a7f3d0,stroke:#047857,color:#000
    style API5 fill:#a7f3d0,stroke:#047857,color:#000
    style API6 fill:#a7f3d0,stroke:#047857,color:#000
    style KB1 fill:#fef3c7,stroke:#b45309,color:#000
    style KB2 fill:#fef3c7,stroke:#b45309,color:#000
    style KB3 fill:#fef3c7,stroke:#b45309,color:#000
    style KB4 fill:#fef3c7,stroke:#b45309,color:#000
    style CH1 fill:#dbeafe,stroke:#1e40af,color:#000
    style CH2 fill:#dbeafe,stroke:#1e40af,color:#000
    style CH3 fill:#dbeafe,stroke:#1e40af,color:#000
```

---

## Legend

```mermaid
graph LR
    EX["🔵 Existing Skill"]
    NW["🟠 NEW Skill ⭐"]
    API["🟢 External API"]
    AG["🟣 Agent"]
    OUT["🟡 Output Channel"]

    style EX fill:#dbeafe,stroke:#1e40af,color:#000
    style NW fill:#fed7aa,stroke:#c2410c,color:#000
    style API fill:#a7f3d0,stroke:#047857,color:#000
    style AG fill:#ddd6fe,stroke:#6d28d9,color:#000
    style OUT fill:#fef3c7,stroke:#b45309,color:#000
```

---

## New Items Created

### 6 New Skills
1. `mkt-competitor-video-strategy-analyzer` — P1
2. `mkt-content-knowledge-compiler` — P1
3. `mkt-ai-news-aggregator` (+ 3 Python scripts) — P3
4. `mkt-news-to-content-brief` — P3
5. `mkt-content-repurposer` — P4
6. `mkt-build-in-public-post-creator` (+ templates) — P5

### 2 New Agents
1. `mkt-pillar1-ai-demo-researcher` — P1 end-to-end
2. `mkt-daily-ai-news-scout` — P3 end-to-end
