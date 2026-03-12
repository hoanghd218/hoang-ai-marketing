# Grok x_search & OpenRouter Integration Analysis
**Date**: 2026-02-25 | **Status**: Complete

---

## Executive Summary

**Key Finding**: Grok can access real-time X.com data via xAI's native API with x_search tools, but **OpenRouter does NOT support x_search tool capability**. For trending X posts, recommend direct xAI API or third-party scrapers (Apify, Bright Data).

---

## 1. Can Grok Access Real-Time X.com Data Through OpenRouter?

**Answer: NO (with caveat)**

### Why Not
- OpenRouter routes requests to underlying model providers but **strips tool/function calling capabilities**
- x_search is an xAI-native tool only available through xAI's official API (`api.x.ai/v1/responses`)
- OpenRouter's routing doesn't preserve specialized tools from origin providers

### Workaround
If using OpenRouter, you lose x_search access. Must call xAI API directly to use x_search tools.

---

## 2. Best Approach for Getting Trending X Posts with Grok

### Option A: Direct xAI API + x_search Tool (Recommended)
**Pros**:
- Real-time access to X posts via x_search tool
- Supports keyword, semantic, user search, thread fetch
- Built-in citations and URL extraction
- Includes engagement metrics (likes, reposts, replies, views)

**Implementation**:
```python
from xai_sdk import Client
from xai_sdk.tools import x_search

client = Client(api_key="$XAI_API_KEY")
response = client.chat.create(
    model="grok-4-1-fast-reasoning",
    tools=[x_search()],
    messages=[{
        "role": "user",
        "content": "Show trending posts about AI automation from last 7 days"
    }]
)
# Returns: posts with URLs, engagement metrics, citations
```

**Filtering Options**:
- `allowed_x_handles`: Restrict to specific users
- `from_date` / `to_date`: ISO8601 format (YYYY-MM-DD)
- Search operators: keyword, semantic, user search modes

**Pricing**: $5 per 1,000 tool calls (x_search usage)

### Option B: X API v2 (Native, But Limited)
**Pros**: Official, no rate limiting concerns
**Cons**: No built-in trending endpoint; limited to search recent tweets

### Option C: Apify Twitter Scraper (Cost-Effective Alternative)
**Pros**:
- 95% cheaper than X API
- Extracts: text, engagement (likes, reposts, views), media, user info
- Supports "Latest", "Top", "People" tabs for trending
- Batch processing, CSV/JSON export

**Use Case**: When price and reliability matter more than integration simplicity

### Option D: Bright Data Scraper API
**Pros**: Enterprise-grade, structured data, proxy network
**Cons**: Higher cost but reliable for scale

---

## 3. xAI API Live Search Feature (x_search Tool)

### How It Works

**Endpoint**: `https://api.x.ai/v1/responses` (POST)

**Request Format**:
```json
{
  "model": "grok-4-1-fast-reasoning",
  "stream": true,
  "input": [
    { "role": "user", "content": "What are trending X posts about [topic]?" }
  ],
  "tools": [
    { "type": "x_search" },
    { "type": "web_search" },
    { "type": "code_interpreter" }
  ]
}
```

**Response Format**:
- **Citations**: `response.citations` — List of all URLs encountered
- **Inline Citations**: Markdown links like `[[1]](https://x.com/user/status/12345)`
- **Tool Results**: Grok processes x_search results and synthesizes response

### Key Capabilities
| Capability | Notes |
|-----------|-------|
| Keyword Search | Find posts by keywords |
| Semantic Search | Understand meaning, not just text match |
| User Search | Find posts from specific X handles |
| Thread Fetch | Retrieve full conversation threads |
| Date Filtering | `from_date`, `to_date` in ISO8601 |
| Handle Whitelist | `allowed_x_handles` parameter |

### Important: API Migration
- **Retired**: Original Live Search API (Jan 12, 2026) → 410 Gone status
- **Current**: All new code must use Agent Tools API (x_search within tool definitions)

### Authentication
1. Go to `console.x.ai`
2. Sign up with email or X account
3. Generate API key (shown once — store securely)
4. Use in header: `Authorization: Bearer $XAI_API_KEY`

### Pricing Tiers
| Model | Input Cost | Output Cost | Use Case |
|-------|-----------|-----------|----------|
| Grok 4.1 Fast | $0.20/M tokens | $0.50/M tokens | Budget-friendly, real-time |
| Grok 4 | $3.00/M tokens | $15.00/M tokens | High-accuracy reasoning |

**New User Credits**: $25 free + $150/month via data sharing program

---

## Architecture Comparison: Direct xAI vs OpenRouter

```
OpenRouter (No x_search):
┌─────────────────┐
│ Your Code       │
│ (no tools)      │
└────────┬────────┘
         │ (standard chat)
         ▼
    OpenRouter
         │ (stripped tools)
         ▼
    xAI Grok
    (no x_search access)

Direct xAI API (✓ x_search):
┌─────────────────┐
│ Your Code       │
│ (with x_search) │
└────────┬────────┘
         │ (tools enabled)
         ▼
    xAI API
         │ (executes x_search)
         ▼
    X.com Data
    (real-time posts, engagement)
```

---

## Implementation Recommendation

### For Trending X Post Collection

1. **Primary**: Use xAI Grok x_search directly
   - Simplest integration
   - Real-time, built-in X data access
   - Cost: $5/1000 calls (minimal for occasional use)

2. **Fallback**: Apify Twitter Scraper
   - When volume > 100 requests/day (cheaper at scale)
   - No API key rate limits
   - Better for batch processing

3. **Avoid**: OpenRouter for x_search
   - Tools not supported through proxy routing

---

## Unresolved Questions

1. **x_search response format**: Official docs don't show exact JSON structure of post URLs returned (e.g., does it return `https://x.com/user/status/123` or parsed objects?)
   - **Workaround**: Test with xAI SDK to see actual response format

2. **View count accuracy**: Does x_search return real-time view counts or cached metrics?
   - **Likely**: Real-time via X's backend, but needs verification

3. **Rate limits**: What are xAI's rate limits on x_search tool calls?
   - **Known**: Pricing is $5/1000 calls, but per-minute limits unclear

4. **OpenRouter x_search support**: Might OpenRouter add x_search support in future?
   - **Current**: No support as of Feb 2026; unlikely near-term

---

## Sources

- [xAI Models & Pricing](https://docs.x.ai/developers/models)
- [xAI Grok API Pricing 2026 Guide](https://www.aifreeapi.com/en/posts/xai-grok-api-pricing)
- [xAI API Documentation](https://x.ai/api)
- [xAI Web Search Tools](https://docs.x.ai/docs/guides/tools/search-tools)
- [xAI X Search Tool Docs](https://docs.x.ai/developers/tools/x-search)
- [X API v2 Documentation](https://docs.x.com/x-api/introduction)
- [Fetch Tweets Using X API - Python Guide](https://qodex.ai/blog/fetch-tweets-using-twitter-api)
- [Apify Twitter/X Scrapers](https://apify.com/scrapers/twitter)
- [Best Twitter/X Scrapers 2026](https://blog.apify.com/best-twitter-x-scrapers/)
- [Top Twitter/X Data Providers 2026](https://brightdata.com/blog/web-data/best-twitter-x-data-providers)
- [Apify vs X API Cost Comparison](https://medium.com/@rishikeshjadhav21/how-i-replaced-the-expensive-x-twitter-api-with-apify-saving-95-while-getting-faster-b9525e4d6312)
