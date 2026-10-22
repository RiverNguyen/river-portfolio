import assert from "node:assert/strict"
import { test } from "node:test"

import { GET } from "./route"

process.env.LASTFM_API_KEY = "k"
process.env.LASTFM_USERNAME = "u"

const track = (nowPlaying: boolean, image = "https://lastfm/a.jpg") => ({
  name: "Song",
  url: "https://last.fm/s",
  artist: { "#text": "Artist" },
  image: [{ size: "medium", "#text": image }],
  ...(nowPlaying ? { "@attr": { nowplaying: "true" } } : {}),
})
const base = { title: "Song", artist: "Artist", url: "https://last.fm/s" }

let clock = Date.now()
Date.now = () => clock

async function respond(payload: unknown) {
  clock += 31_000 // step past the route's 30s cache
  globalThis.fetch = (async () =>
    new Response(
      JSON.stringify({ recenttracks: { track: payload } })
    )) as typeof fetch
  return (await GET()).json()
}

test("returns the now-playing track from an array", async () => {
  assert.deepEqual(await respond([track(true), track(false)]), {
    ...base,
    image: "https://lastfm/a.jpg",
  })
})

test("handles a lone track object and drops the placeholder image", async () => {
  const placeholder = "https://x/2a96cbd8b46e442fc41c2b86b821562f.png"
  assert.deepEqual(await respond(track(true, placeholder)), base)
})

test("returns null when nothing is playing", async () => {
  assert.equal(await respond([track(false)]), null)
})
