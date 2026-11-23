// DeepSeek peak plugin for OpenCode.
// Injects the current Beijing price window into every model request and
// registers the deepseek-peak skill, so one `plugins` entry installs both.
// V2: default export with id + setup.
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { hint } from "./peak.mjs"

const dir = path.dirname(fileURLToPath(import.meta.url))
const skillFile = path.join(dir, "SKILL.md")

function readSkill() {
  try {
    const raw = fs.readFileSync(skillFile, "utf8")
    const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
    if (!match) return
    const meta = {}
    for (const line of match[1].split(/\r?\n/)) {
      const at = line.indexOf(":")
      if (at > 0) meta[line.slice(0, at).trim()] = line.slice(at + 1).trim()
    }
    return {
      id: "deepseek-peak",
      name: meta.name || "DeepSeek Peak Hours",
      description: meta.description,
      path: skillFile,
      content: match[2],
    }
  } catch {
    return
  }
}

export default {
  id: "deepseek-peak",

  async setup(ctx) {
    const skill = readSkill()
    if (skill) {
      await ctx.skill.transform((editor) => {
        editor.add(skill)
      })
    }

    const addWindow = (event) => {
      event.system.push({ type: "text", text: hint(new Date()) })
    }
    await ctx.session.hook("context", addWindow)
    await ctx.session.hook("compaction", addWindow)
  },
}
