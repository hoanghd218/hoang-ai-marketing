# Insight Extraction: Claude Code /btw — Half the Tokens, Double the Speed

**Content Type:** Feature Breakdown / Tip
**Source:** Video transcript (Anthropic Claude Code /btw feature)

---

## Summary

Anthropic released `/btw` — a side-channel command in Claude Code's terminal mode that lets you inject follow-up instructions or ask questions without interrupting the main execution thread. Before `/btw`, changing course mid-task required pressing Escape (killing the thread, wasting tokens on background tool calls, and forcing Claude to re-read your codebase from scratch). Asking a related question required opening an entirely new Claude Code session — burning 10-20K tokens just on startup overhead each time. `/btw` eliminates both problems by opening a lightweight side panel that shares the main thread's full context. Three biggest takeaways: (1) You can steer long-running tasks in real-time like a guided missile instead of firing blind mortar rounds and waiting to see where they land. (2) Everything stays in one unified context window, so response quality goes up and token costs go down. (3) It dramatically improves your one-shot success rate — you no longer need to know everything upfront because you can make mid-flight adjustments.

---

## Key Insights

### 1. /btw Is a Side-Channel, Not an Interruption — `Paradigm Shift`
Before `/btw`, there were only two options when you wanted to change something mid-task: (a) Escape to kill the thread entirely, or (b) open a new Claude Code session. Both waste tokens and break context. `/btw` introduces a third option — a lightweight side panel that shares the same context as the main thread. You can inject corrections, ask questions, or redirect without stopping anything. The main thread keeps executing above while you interact below.

### 2. The Mortar vs. Missile Mental Model — `Mental Model`
Without `/btw`, prompting Claude Code is like firing a mortar — you launch the prompt, wait to see where it lands, then adjust your next shot. With `/btw`, it's like a guided missile — you fire the prompt and continuously adjust its trajectory mid-flight until it hits the target. This fundamentally changes the prompting strategy from "get it perfect upfront" to "start and steer."

### 3. Token Cost of Context-Switching Is Massive — `Diagnosis`
Every new Claude Code session has a fixed 10-20K token startup cost for loading system prompts, tool definitions, and project context. Before `/btw`, asking a simple follow-up question about your current task meant paying that full cost again in a new window. `/btw` eliminates this by keeping everything in the same session, with zero additional context-loading overhead.

### 4. Unified Context = Higher Quality Responses — `Principle`
When you ask a question in a separate Claude Code session, that session has no memory of what you were doing — it has to re-discover your codebase, re-read files, and rebuild context from scratch. `/btw` gives the side conversation access to everything the main thread has already loaded. This means answers are more accurate and contextually relevant because they inherit the full working memory.

### 5. One-Shot Success Rate Goes Up — `Principle`
The biggest practical impact: you don't need to perfectly specify everything in your initial prompt. You can fire off a complex task ("build me an app") and make micro-adjustments as Claude works through the substeps — changing output format, redirecting approach, or adding requirements you forgot. This turns one-shot from "nail it on the first try" to "steer it to success."

### 6. How to Use /btw — `How-To`
Syntax: Type `/btw` followed by a space and your message in the same line — don't press Enter after `/btw` alone. It opens a yellow-highlighted side panel. You have three options after reading the response: press Space, Enter, or Escape to dismiss and return to the main thread. Requires terminal mode in Claude Code (Settings → enable "Use Terminal"). Available in Claude Code v2.1.73+.

### 7. Terminal Mode Is Where Features Land First — `Principle`
Despite the GUI being more popular, Anthropic develops features for the terminal version first. The GUI eventually catches up, but if you want cutting-edge features like `/btw`, you need to be running in terminal mode. Enable it via the extension settings in VS Code.

---

```json
{
  "summary": "Anthropic released /btw — a side-channel command in Claude Code's terminal mode that lets you inject follow-up instructions or ask questions without interrupting the main execution thread. Before /btw, changing course required killing the thread (wasting tokens on background calls) or opening a new session (10-20K token startup cost). /btw opens a lightweight side panel sharing the main thread's full context. Three takeaways: (1) Steer long-running tasks in real-time like a guided missile. (2) Unified context means better responses and lower costs. (3) One-shot success rate goes up because you can make mid-flight adjustments.",
  "insights": [
    {
      "type": "Paradigm Shift",
      "title": "/btw Is a Side-Channel, Not an Interruption",
      "explanation": "Before /btw, the only options were killing the thread (Escape) or opening a new session. Both waste tokens and break context. /btw introduces a lightweight side panel sharing the same context — you inject corrections, ask questions, or redirect without stopping the main execution."
    },
    {
      "type": "Mental Model",
      "title": "The Mortar vs. Missile Mental Model",
      "explanation": "Without /btw, prompting is like firing a mortar — launch and hope it lands right. With /btw, it's a guided missile — you fire the prompt and continuously adjust its trajectory mid-flight. This shifts strategy from 'get it perfect upfront' to 'start and steer.'"
    },
    {
      "type": "Diagnosis",
      "title": "Token Cost of Context-Switching Is Massive",
      "explanation": "Every new Claude Code session has a fixed 10-20K token startup cost. Before /btw, a simple follow-up question meant paying that full cost again in a new window. /btw eliminates this with zero additional context-loading overhead."
    },
    {
      "type": "Principle",
      "title": "Unified Context = Higher Quality Responses",
      "explanation": "A separate session has no memory of your current work — it must re-discover files and rebuild context from scratch. /btw gives the side conversation access to everything the main thread has loaded, producing more accurate and contextually relevant answers."
    },
    {
      "type": "Principle",
      "title": "One-Shot Success Rate Goes Up",
      "explanation": "You don't need to perfectly specify everything upfront. Fire off a complex task and make micro-adjustments as Claude works through substeps — changing output format, redirecting approach, adding forgotten requirements. One-shot becomes 'steer it to success.'"
    },
    {
      "type": "How-To",
      "title": "How to Use /btw",
      "explanation": "Type /btw followed by space and your message in the same line. Opens a yellow side panel. Press Space, Enter, or Escape to dismiss and return to the main thread. Requires terminal mode (Settings → Use Terminal) and Claude Code v2.1.73+."
    },
    {
      "type": "Principle",
      "title": "Terminal Mode Is Where Features Land First",
      "explanation": "Anthropic develops features for terminal first, GUI catches up later. For cutting-edge features like /btw, run in terminal mode via the VS Code extension settings."
    }
  ]
}
```
