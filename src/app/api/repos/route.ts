import { NextResponse } from "next/server"

export async function GET(req: Request) {

  const { searchParams } = new URL(req.url)
  const user = searchParams.get("user")

  if (!user) return NextResponse.json([])

  try {

    const res = await fetch(
      `https://api.github.com/users/${user}/repos?per_page=50`,
      {
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`, // ✅ FIXED
        },
        cache: "no-store",
      }
    )

    if (!res.ok) {
      const text = await res.text()
      console.log("❌ GitHub API failed:", res.status, text)
      return NextResponse.json([])
    }

    const data = await res.json()

    console.log("✅ Repo count:", data.length)

    return NextResponse.json(Array.isArray(data) ? data : [])

  } catch (err) {
    console.log("❌ Fetch error:", err)
    return NextResponse.json([])
  }
}