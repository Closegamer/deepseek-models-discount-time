import test from "node:test"
import assert from "node:assert/strict"
import { hint, isPeak, line, status } from "./peak.mjs"

const at = (iso) => new Date(iso)
const next = (iso) => status(at(iso)).edge?.toISOString()

test("peak windows on a normal Tuesday", () => {
  assert.equal(isPeak(at("2026-11-24T08:59:00+08:00")), false)
  assert.equal(isPeak(at("2026-11-24T09:00:00+08:00")), true)
  assert.equal(isPeak(at("2026-11-24T11:59:00+08:00")), true)
  assert.equal(isPeak(at("2026-11-24T12:00:00+08:00")), false)
  assert.equal(isPeak(at("2026-11-24T13:59:00+08:00")), false)
  assert.equal(isPeak(at("2026-11-24T14:00:00+08:00")), true)
  assert.equal(isPeak(at("2026-11-24T17:59:00+08:00")), true)
  assert.equal(isPeak(at("2026-11-24T18:00:00+08:00")), false)
})

test("weekends and Chinese holidays are off-peak", () => {
  assert.equal(isPeak(at("2026-11-28T10:00:00+08:00")), false) // Saturday
  assert.equal(isPeak(at("2026-10-01T10:00:00+08:00")), false) // National Day, Thursday
  assert.equal(isPeak(at("2027-01-01T10:00:00+08:00")), false) // New Year, Friday
  assert.equal(isPeak(at("2027-01-04T09:00:00+08:00")), true) // first working day after
})

test("next change jumps over nights, weekends and holidays", () => {
  assert.equal(next("2026-11-24T08:30:00+08:00"), "2026-11-24T01:00:00.000Z")
  assert.equal(next("2026-11-24T11:30:00+08:00"), "2026-11-24T04:00:00.000Z")
  assert.equal(next("2026-11-24T12:30:00+08:00"), "2026-11-24T06:00:00.000Z")
  assert.equal(next("2026-11-24T17:30:00+08:00"), "2026-11-24T10:00:00.000Z")
  assert.equal(next("2026-11-24T18:30:00+08:00"), "2026-11-25T01:00:00.000Z")
  assert.equal(next("2026-11-27T18:30:00+08:00"), "2026-11-30T01:00:00.000Z") // Friday to Monday
  assert.equal(next("2026-09-30T18:30:00+08:00"), "2026-10-08T01:00:00.000Z") // over Golden Week
  assert.equal(next("2026-12-31T18:30:00+08:00"), "2027-01-04T01:00:00.000Z") // over New Year
})

test("lines show the discount state and the next edge", () => {
  assert.match(line(at("2026-11-24T10:00:00+08:00")), /^Discount OFF, full price/)
  assert.match(line(at("2026-11-24T20:00:00+08:00")), /^Discount ON, half price/)
  assert.match(line(at("2026-11-24T10:00:00+08:00")), /Next edge 12:00 Beijing(, \d{2}:\d{2} local)?, in 2h 0m/)
  assert.match(line(at("2026-11-24T20:00:00+08:00")), /Next edge 09:00 Beijing(, \d{2}:\d{2} local)?, in 13h 0m/)
  assert.match(hint(at("2026-11-24T10:00:00+08:00")), /^Discount OFF .*full token price/)
  assert.match(hint(at("2026-11-24T20:00:00+08:00")), /^Discount ON .*half token price/)
})
