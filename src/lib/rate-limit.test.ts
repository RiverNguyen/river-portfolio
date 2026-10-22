import assert from "node:assert/strict"
import { test } from "node:test"

import { getClientIp, isRateLimited } from "./rate-limit"

// Force the in-memory path regardless of the developer's shell env (getRedis reads env lazily).
for (const key of [
  "UPSTASH_REDIS_REST_URL",
  "UPSTASH_REDIS_REST_TOKEN",
  "KV_REST_API_URL",
  "KV_REST_API_TOKEN",
]) {
  delete process.env[key]
}

test("allows up to the limit, then blocks", async () => {
  const key = `test:${crypto.randomUUID()}`
  for (let i = 0; i < 3; i++) {
    assert.equal(await isRateLimited(key, 3, 60_000), false)
  }
  assert.equal(await isRateLimited(key, 3, 60_000), true)
})

test("resets after the window", async () => {
  const key = `test:${crypto.randomUUID()}`
  assert.equal(await isRateLimited(key, 1, 20), false)
  assert.equal(await isRateLimited(key, 1, 20), true)
  await new Promise((resolve) => setTimeout(resolve, 30))
  assert.equal(await isRateLimited(key, 1, 20), false)
})

test("keys are independent", async () => {
  const a = `test:${crypto.randomUUID()}`
  const b = `test:${crypto.randomUUID()}`
  assert.equal(await isRateLimited(a, 1, 60_000), false)
  assert.equal(await isRateLimited(a, 1, 60_000), true)
  assert.equal(await isRateLimited(b, 1, 60_000), false)
})

test("reads the first x-forwarded-for hop, then x-real-ip", () => {
  const req = (headers: Record<string, string>) =>
    new Request("http://localhost", { headers })
  assert.equal(
    getClientIp(req({ "x-forwarded-for": "1.1.1.1, 2.2.2.2" })),
    "1.1.1.1"
  )
  assert.equal(getClientIp(req({ "x-real-ip": "3.3.3.3" })), "3.3.3.3")
  assert.equal(getClientIp(req({})), "unknown")
})
