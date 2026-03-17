export async function GET(){

const username = process.env.GITHUB_USERNAME
const token = process.env.GITHUB_TOKEN

const res = await fetch(
`https://api.github.com/users/${username}/repos`,
{
headers:{
Authorization:`Bearer ${token}`,
Accept:"application/vnd.github+json"
}
}
)

const data = await res.json()

if(!Array.isArray(data)){
return Response.json([])
}

return Response.json(data)

}