import { NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";

export const authOptions: NextAuthOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID || "",
      clientSecret: process.env.DISCORD_CLIENT_SECRET || "",
      authorization: { params: { scope: "identify guilds guilds.members.read", prompt: "none" } },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.accessToken = account.access_token;
        const guildId = process.env.DISCORD_GUILD_ID;
        
        if (guildId && account.access_token) {
          try {
            const res = await fetch(`https://discord.com/api/users/@me/guilds/${guildId}/member`, {
              headers: { Authorization: `Bearer ${account.access_token}` },
            });
            
            if (res.ok) {
              const memberData = await res.json();
              token.roles = memberData.roles;
            } else {
              token.roles = [];
            }
          } catch (e) {
            token.roles = [];
          }
        } else {
          token.roles = ["123456789012345678"];
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).roles = token.roles || [];
        (session.user as any).id = token.sub;
      }
      return session;
    },
  },
};
