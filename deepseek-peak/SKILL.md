---
name: DeepSeek Peak Hours
description: Check the Beijing peak price window for DeepSeek tokens. Peak means full price, off-peak is half price. Use when the user asks about token cost, pricing, peak or off-peak hours, the cheapest time to run, or before starting a long or expensive task.
---

# DeepSeek Peak Hours

DeepSeek API tokens cost full price during peak hours and half price off-peak. All times are Beijing time (UTC+8, no daylight saving).

1. Peak: Monday to Friday, 09:00-12:00 and 14:00-18:00.
2. Off-peak: every other time, plus all of Saturday, Sunday, and Chinese public holidays.

The same peak windows in UTC are 01:00-04:00 and 06:00-10:00, Monday to Friday, excluding Chinese public holidays. Source: https://api-docs.deepseek.com/quick_start/pricing

## Check

Run `node <skill folder>/peak.mjs`, where `<skill folder>` is the base directory shown for this skill. Exit code 2 means peak, 0 means off-peak.

Tell the user in one or two lines: start with 🔴 during peak or 🟢 off-peak, then the state, the exact Beijing time when it changes, and the price factor.

## Rules

1. During peak, show 🔴 and warn that tokens cost full price (2x off-peak) before starting a long or expensive task.
2. During off-peak, show 🟢 and give a green light.
3. Never delay or schedule work yourself. Report the window and let the user decide.
