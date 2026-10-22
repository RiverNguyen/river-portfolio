import assert from "node:assert/strict"
import { test } from "node:test"

import { decodeSession, encodeSession, SESSION_MAX_AGE } from "./session"

const user = { login: "octocat", name: "Octo", avatar: "https://x/a.png" }

test("round-trips a valid session", () => {
  assert.deepEqual(decodeSession(encodeSession(user, "s"), "s"), user)
})

test("rejects a wrong secret or a tampered payload", () => {
  const value = encodeSession(user, "s")
  assert.equal(decodeSession(value, "other"), null)

  const [, mac] = value.split(".")
  const forged = Buffer.from(
    JSON.stringify({ ...user, login: "RiverNguyen", exp: Date.now() + 1e9 })
  ).toString("base64url")
  assert.equal(decodeSession(`${forged}.${mac}`, "s"), null)
})

test("rejects expired and malformed values", () => {
  const value = encodeSession(user, "s", 0)
  assert.equal(decodeSession(value, "s", SESSION_MAX_AGE * 1000 + 1), null)
  assert.equal(decodeSession(undefined, "s"), null)
  assert.equal(decodeSession("garbage", "s"), null)
})
