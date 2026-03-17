export async function GET(req:Request){

const { searchParams } = new URL(req.url)

const repo = searchParams.get("repo")

const username = process.env.GITHUB_USERNAME
const token = process.env.GITHUB_TOKEN

const res = await fetch(
`https://api.github.com/repos/${username}/${repo}/contents`,
{
headers:{
Authorization:`Bearer ${token}`,
Accept:"application/vnd.github+json"
}
}
)

const data = await res.json()

const folders = Array.isArray(data)
? data.filter((item:any)=>item.type==="dir")
: []

return Response.json(folders)

}