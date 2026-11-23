// DeepSeek API peak pricing windows, Beijing time (UTC+8, no DST).
// Peak: Mon-Fri 09:00-12:00 and 14:00-18:00. Off-peak is half price.
// Source: https://api-docs.deepseek.com/quick_start/pricing
import { pathToFileURL } from "node:url"

const BEIJING_OFFSET = 8 * 60 * 60 * 1000
const MINUTE = 60 * 1000

// shortcut: holidays cover 2026-2027 only. Add the State Council dates each
// November, when the next year's schedule is published.
const HOLIDAY_RANGES = [
  // 2026
  "2026-01-01..2026-01-03", // New Year
  "2026-02-15..2026-02-23", // Spring Festival
  "2026-04-04..2026-04-06", // Qingming
  "2026-05-01..2026-05-05", // Labour Day
  "2026-06-19..2026-06-21", // Dragon Boat
  "2026-09-25..2026-09-27", // Mid-Autumn
  "2026-10-01..2026-10-07", // National Day
  // 2027
  "2027-01-01..2027-01-03", // New Year
  "2027-02-05..2027-02-13", // Spring Festival
  "2027-04-03..2027-04-05", // Qingming
  "2027-05-01..2027-05-05", // Labour Day
  "2027-06-09..2027-06-09", // Dragon Boat
  "2027-09-15..2027-09-15", // Mid-Autumn
  "2027-10-01..2027-10-07", // National Day
]

const HOLIDAYS = new Set()
for (const range of HOLIDAY_RANGES) {
  const [from, to] = range.split("..")
  const end = Date.parse(`${to}T00:00:00Z`)
  for (let t = Date.parse(`${from}T00:00:00Z`); t <= end; t += 24 * 60 * MINUTE) {
    HOLIDAYS.add(new Date(t).toISOString().slice(0, 10))
  }
}

function beijing(now) {
  const d = new Date(now.getTime() + BEIJING_OFFSET)
  return {
    key: d.toISOString().slice(0, 10),
    hour: d.getUTCHours(),
    minute: d.getUTCMinutes(),
    weekday: d.getUTCDay(), // 0 = Sunday
  }
}

export function isPeak(now) {
  const bj = beijing(now)
  if (bj.weekday === 0 || bj.weekday === 6) return false
  if (HOLIDAYS.has(bj.key)) return false
  return (bj.hour >= 9 && bj.hour < 12) || (bj.hour >= 14 && bj.hour < 18)
}

function nextChange(now) {
  const peak = isPeak(now)
  let t = Math.ceil(now.getTime() / MINUTE) * MINUTE
  for (let i = 0; i < 14 * 24 * 60; i++, t += MINUTE) {
    if (isPeak(new Date(t)) !== peak) return new Date(t)
  }
  return undefined
}

function beijingClock(date) {
  const d = new Date(date.getTime() + BEIJING_OFFSET)
  const hm = `${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")}`
  const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d.getUTCDay()]
  return { hm, day }
}

function remaining(ms) {
  const minutes = Math.round(ms / MINUTE)
  if (minutes < 1) return "<1m"
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return h ? `${h}h ${m}m` : `${m}m`
}

export function status(now) {
  const peak = isPeak(now)
  const edge = nextChange(now)
  return {
    peak,
    edge,
    now: beijingClock(now),
    left: edge ? remaining(edge.getTime() - now.getTime()) : "unknown",
  }
}

// One line for the plugin's system prompt.
export function hint(now) {
  const s = status(now)
  const edge = s.edge ? `${beijingClock(s.edge).hm} Beijing, in ${s.left}` : "unknown"
  if (s.peak) {
    return `Discount OFF (peak pricing, full token price, 2x off-peak), Beijing ${s.now.hm} ${s.now.day}. Next edge ${edge}. Say this once in one short line, starting with "Discount OFF", near the start of the session, and warn the user before any long or expensive task. Do not repeat it in later replies.`
  }
  return `Discount ON (off-peak pricing, half token price), Beijing ${s.now.hm} ${s.now.day}. Next edge ${edge}. Give the user a one-line green light starting with "Discount ON", once near the start of the session. Do not repeat it in later replies.`
}

// One line for a shell check, plain text for old terminals.
export function line(now) {
  const s = status(now)
  const edge = s.edge ? `${beijingClock(s.edge).hm} Beijing, in ${s.left}` : "unknown"
  if (s.peak) {
    return `Discount OFF, full price (2x), Beijing ${s.now.hm} ${s.now.day}. Next edge ${edge}. Warn before a long task.`
  }
  return `Discount ON, half price, Beijing ${s.now.hm} ${s.now.day}. Next edge ${edge}. Green light.`
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const s = status(new Date())
  console.log(line(new Date()))
  process.exit(s.peak ? 2 : 0)
}
