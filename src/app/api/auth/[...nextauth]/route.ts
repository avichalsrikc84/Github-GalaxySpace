import NextAuth from "next-auth"
import GitHubProvider from "next-auth/providers/github"

const handler = NextAuth({
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],

  callbacks: {
    async jwt({ token, profile }: any) {
      if (profile) {
        token.login = profile.login   // ✅ GitHub username
      }
      return token
    },

    async session({ session, token }: any) {
      if (session.user) {
        session.user.username = token.login   // ✅ attach username
      }
      return session
    },
  },
})

export { handler as GET, handler as POST }