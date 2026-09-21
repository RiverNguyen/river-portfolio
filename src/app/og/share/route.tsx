import { readFile } from "node:fs/promises"
import { join } from "node:path"

import { ImageResponse } from "next/og"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const title = searchParams.get("title") ?? "River Nguyen"
  const subtitle =
    searchParams.get("subtitle") ?? "Frontend developer · Next.js & React"
  const kind = searchParams.get("kind") ?? "project"

  const robotoCondensedMedium = await readFile(
    join(process.cwd(), "src/assets/fonts/RobotoCondensed-Medium.ttf")
  )

  const kindLabel =
    kind === "blog" ? "Blog" : kind === "hire" ? "Hire" : "Case study"

  return new ImageResponse(
    (
      <div
        tw="flex w-full h-full flex-col justify-between bg-black text-white p-16"
        style={{ fontFamily: "RobotoCondensed" }}
      >
        <div tw="flex items-center justify-between w-full">
          <p tw="text-2xl tracking-widest uppercase text-zinc-400 m-0">
            rivernguyen.id.vn
          </p>
          <p tw="text-xl tracking-widest uppercase text-zinc-500 m-0 border border-zinc-700 px-4 py-2">
            {kindLabel}
          </p>
        </div>
        <div tw="flex flex-col gap-4 max-w-[900px]">
          <h1 tw="text-6xl font-medium leading-tight m-0">{title}</h1>
          <p tw="text-3xl text-zinc-400 m-0 leading-snug">{subtitle}</p>
        </div>
        <p tw="text-xl text-zinc-600 m-0">Nguyễn Đình Giang (River)</p>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "RobotoCondensed",
          data: robotoCondensedMedium,
          style: "normal",
          weight: 500,
        },
      ],
    }
  )
}
