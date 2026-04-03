import { NextResponse } from "next/server"

export async function GET(req: Request) {

const { searchParams } = new URL(req.url)
const repo = searchParams.get("repo")
const owner = process.env.GITHUB_USERNAME

if (!repo || !owner) {
  return NextResponse.json([])
}

try {

const res = await fetch(
  `https://api.github.com/repos/${owner}/${repo}/contents`,
  {
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    },
  }
)

const data = await res.json()

const folders = data.filter((item: any) => item.type === "dir")

return NextResponse.json(folders)

} catch (err) {
return NextResponse.json([])
}

}