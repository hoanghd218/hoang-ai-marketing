# Research Report: Grok + OpenRouter + xAI API for X.com Trending Posts

**Date:** 2026-02-25
**Goal:** Build Python script to fetch trending X.com posts with URL, content, views, engagement metrics using Grok/xAI.

---

## 1. Grok Models on OpenRouter

| Model ID (OpenRouter) | Context | Input $/M | Output $/M | Notes |
|---|---|---|---|---|
| `x-ai/grok-4.1-fast` | 2M | $0.20 | $0.50 | Best agentic/tool-calling; free on OpenRouter (limited) |
| `x-ai/grok-4-fast` | 2M | $0.20 | $0.50 | Multimodal, SOTA cost-efficiency |
| `x-ai/grok-4` | 256K | $3.00 | $15.00 | Flagship reasoning, parallel tool calling |
| `x-ai/grok-3` | 131K | $3.00 | $15.00 | Previous gen flagship |
| `x-ai/grok-3-mini` | 131K | $0.30 | $0.50 | Lightweight reasoning |

**Key IDs to use:**
- OpenRouter: `x-ai/grok-4.1-fast` (best for agentic use case, cheapest)
- xAI native: `grok-4-1-fast` (note: no dots in xAI's own API)

---

## 2. Real-Time X.com Access: OpenRouter vs xAI Native API

**CRITICAL FINDING: OpenRouter does NOT provide X.com real-time access.**

OpenRouter provides access to the language model itself only — it is a model gateway. The `x_search` tool and other Agent Tools (web_search, code_execution) are only available through xAI's native Responses API at `api.x.ai`.

When using Grok via OpenRouter, you get text generation only. No live X data.

**To access X.com real-time data → must use xAI's native API directly.**

> Note: The old xAI Live Search API was retired on 2026-01-12 (returns 410 Gone). Must use the new Agent Tools / Responses API.

---

## 3. OpenRouter API Format (for reference)

Use if you only need the LLM, not X search:

```python
from openai import OpenAI

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key="<OPENROUTER_API_KEY>",
    default_headers={
        "HTTP-Referer": "https://yourdomain.com",  # Required
        "X-Title": "Your App Name"                  # Optional
    }
)

response = client.chat.completions.create(
    model="x-ai/grok-4.1-fast",
    messages=[{"role": "user", "content": "Hello"}]
)
```

Endpoint: `https://openrouter.ai/api/v1`
Auth: `Authorization: Bearer <OPENROUTER_API_KEY>`
Format: OpenAI-compatible (Chat Completions)

---

## 4. xAI Native API

### Setup
- Console: https://console.x.ai
- Auth: email or X account
- New users: $25 free credits on signup + $150/mo via data sharing program = $175 first month

### Pricing
| Model | Input $/M | Output $/M | Tool Calls |
|---|---|---|---|
| `grok-4.1-fast` | $0.20 | $0.50 | $5/1K calls |
| `grok-4-fast` | $0.20 | $0.50 | $5/1K calls |
| `grok-4` | $3.00 | $15.00 | $5/1K calls |

**Tool calls (x_search, web_search, code_execution): $5 per 1,000 calls** — very cheap.

### Endpoint
```
POST https://api.x.ai/v1/responses
```

### Responses API Format (with x_search)

**cURL:**
```bash
curl https://api.x.ai/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $XAI_API_KEY" \
  -d '{
    "model": "grok-4-1-fast",
    "input": [
      {"role": "user", "content": "Find trending posts about AI automation on X this week"}
    ],
    "tools": [
      {"type": "x_search"}
    ]
  }'
```

**Python (xAI SDK):**
```python
pip install xai-sdk
```

```python
import os
from xai_sdk import Client
from xai_sdk.chat import user
from xai_sdk.tools import x_search

client = Client(api_key=os.getenv("XAI_API_KEY"))
chat = client.chat.create(
    model="grok-4-1-fast",
    tools=[x_search()],
)
chat.append(user("Find top trending X posts about 'AI automation' from this week with URLs and engagement"))

response, _ = chat.stream()
print(response.citations)  # List of URLs from X posts
```

**Python (OpenAI SDK pointing to xAI):**
```python
from openai import OpenAI

client = OpenAI(
    api_key=os.getenv("XAI_API_KEY"),
    base_url="https://api.x.ai/v1"
)
# Note: Responses API (/v1/responses) format differs from Chat Completions (/v1/chat/completions)
# For tool use with x_search, use /v1/responses endpoint directly via requests
```

### x_search Tool Parameters
```json
{
  "type": "x_search",
  "allowed_x_handles": ["elonmusk", "sama"],  // max 10
  "excluded_x_handles": ["spam_account"],      // max 10
  "from_date": "2026-02-18",                   // ISO8601
  "to_date": "2026-02-25",                     // ISO8601
  "enable_image_understanding": true,
  "enable_video_understanding": true
}
```

Supports: keyword search, semantic search, user search, thread fetch.

---

## 5. Grok x_search: Can It Return Specific Posts with URLs/Metrics?

### What it DOES return
- `response.citations` — list of X post URLs encountered during search
- `response.inline_citations` — markdown links embedded in text (e.g., `[[1]](https://x.com/user/status/123)`)
- Response text summarizes/synthesizes the posts found
- Post content (text), author, timestamp, thread context

### What it does NOT reliably return (key limitation)
- **Raw engagement metrics as structured data** (like_count, retweet_count, view_count as JSON fields)
- The response is LLM-generated text with citations, not a structured JSON of tweets
- View/impression counts are NOT confirmed to be returned as structured fields
- Grok synthesizes info from X posts but doesn't expose raw API metrics

### Workaround for structured data
Combine x_search with structured outputs:
```python
# Ask Grok to extract and return structured data
prompt = """
Search X for trending posts about 'AI automation' from the past 7 days.
For each post found, return a JSON array with fields:
- url: the x.com post URL
- author: username
- content: post text (first 280 chars)
- likes: like count if visible
- retweets: retweet count if visible
- date: posted date
Return only the JSON array, no prose.
"""
```

This works but is unreliable for metrics — Grok may or may not have metric data visible in the X context it accesses.

---

## 6. Alternative Approaches

### Option A: xAI API with x_search (RECOMMENDED for content discovery)
**Best for:** Finding trending posts by topic, getting URLs, understanding what's viral.
**Limitation:** Metrics are LLM-extracted (not raw API data), may be imprecise.
**Cost:** ~$5/1K x_search calls + minimal token cost.

```python
# Recommended approach: use Grok to find posts, then optionally fetch metrics via X API
```

### Option B: X API v2 Direct (RECOMMENDED for accurate metrics)
**Best for:** Accurate view counts, engagement metrics as structured JSON.
**Endpoint:** `https://api.twitter.com/2/tweets/search/recent`
**Pricing:**
- Free: no read access (write only, 1,500 tweets/month)
- Basic: $100/mo — 15K reads/month
- Pro: $5,000/mo — 1M reads/month
- Pay-per-use: newly launched pilot model

**Python (Tweepy):**
```python
pip install tweepy
```
```python
import tweepy

client = tweepy.Client(bearer_token="YOUR_BEARER_TOKEN")
tweets = client.search_recent_tweets(
    query="AI automation -is:retweet lang:en",
    max_results=10,
    tweet_fields=["public_metrics", "created_at", "author_id"],
    expansions=["author_id"]
)
for tweet in tweets.data:
    print(tweet.text, tweet.public_metrics)
    # public_metrics: {retweet_count, reply_count, like_count, quote_count, impression_count}
```

**Limitation:** `impression_count` (views) requires OAuth 2.0 user auth for posts you own. For others' posts, impressions may not be available on Basic tier.

### Option C: Apify Scrapers (RECOMMENDED for view counts without X API)
**Best for:** Getting view counts + engagement without expensive X API Pro tier.
**Actors:**
- `apify/twitter-scraper` — full tweet data with engagement
- `apidojo/tweet-scraper` — TweetScraper V2
- `api-ninja/x-twitter-advanced-search` — 50+ filters

**Returns:** text, likes, retweets, replies, quotes, bookmarks, **view count**, media, user info.
**Cost:** Pay-as-you-go, ~95% cheaper than X API Pro.
**API:**
```python
from apify_client import ApifyClient

client = ApifyClient("APIFY_API_TOKEN")
run = client.actor("apidojo/tweet-scraper").call(run_input={
    "searchTerms": ["AI automation"],
    "maxItems": 20,
    "sort": "Top"  # or "Latest"
})
for item in client.dataset(run["defaultDatasetId"]).iterate_items():
    print(item)  # includes viewCount, likeCount, retweetCount, etc.
```

### Option D: Hybrid Approach (BEST for production)
1. Use **xAI x_search** to find what's trending (topic discovery + URLs)
2. Use **Apify** or **X API v2** to fetch precise metrics for those URLs

---

## 7. Recommended Implementation Plan

**Goal:** Python script, input = keyword, output = trending X posts with URL + content + metrics.

**Recommended stack:**
- **Primary:** xAI Responses API + x_search → get trending post URLs and content
- **Metrics:** Apify Twitter scraper (if accurate view counts needed) OR parse Grok's response for best-effort metrics
- **Fallback:** X API v2 Basic ($100/mo) for structured metric data

**Minimal viable approach (cheapest):**
```
xAI API (x_search) → prompt Grok to return structured JSON of posts → parse response
Cost: ~$5/1K searches + token cost
Limitation: view counts may be approximate/missing
```

**Production approach:**
```
xAI API (x_search) → get post URLs → Apify scraper → get precise metrics
Cost: xAI ($5/1K) + Apify (pay-per-use)
Advantage: accurate metrics including view counts
```

---

## Unresolved Questions

1. **Does x_search return view/impression counts as part of its citation data?** Official docs don't confirm this. The response format via citations gives URLs but metric data is LLM-summarized.

2. **Grok's x_search access scope** — Does it index all X posts or only public/verified? Unclear from docs.

3. **Apify scraper reliability** — X.com periodically blocks scrapers; need to validate specific actor uptime.

4. **X API pay-per-use pricing** — Still in pilot as of Feb 2026; pricing per search call not yet published publicly.

5. **xAI SDK `xai-sdk` package stability** — Whether to use the Python SDK vs direct HTTP to `/v1/responses`.

---

## Sources

- [xAI Models & Pricing](https://docs.x.ai/developers/models)
- [xAI API Landing](https://x.ai/api)
- [xAI X Search Tool Docs](https://docs.x.ai/developers/tools/x-search)
- [xAI Tools Overview](https://docs.x.ai/docs/guides/tools/overview)
- [xAI Search Tools Guide](https://docs.x.ai/docs/guides/tools/search-tools)
- [xAI Citations Docs](https://docs.x.ai/developers/tools/citations)
- [Grok 4.1 Fast Release](https://x.ai/news/grok-4-1-fast)
- [OpenRouter xAI Provider](https://openrouter.ai/provider/xai)
- [OpenRouter Grok 4.1 Fast](https://openrouter.ai/x-ai/grok-4.1-fast)
- [OpenRouter Quickstart](https://openrouter.ai/docs/quickstart)
- [xAI SDK Python GitHub](https://github.com/xai-org/xai-sdk-python)
- [Apiyi x_search + web_search Guide](https://help.apiyi.com/en/xai-grok-api-x-search-web-search-guide-en.html)
- [X API v2 Docs](https://docs.x.com/x-api/introduction)
- [X API Pricing 2026](https://www.xpoz.ai/blog/guides/understanding-twitter-api-pricing-tiers-and-alternatives/)
- [Apify Twitter Scrapers](https://apify.com/scrapers/twitter)
- [Best Twitter Scrapers 2026 — Apify Blog](https://blog.apify.com/best-twitter-x-scrapers/)
