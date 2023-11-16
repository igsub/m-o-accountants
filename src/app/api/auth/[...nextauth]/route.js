import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import CredentialsProvider from "next-auth/providers/credentials"
import db from "@/modules/db"
import { createHmac } from "crypto";

export const hashPassword = (password) => {
  return createHmac('sha256', password).digest('hex');
};

const options = {
	providers: [
		CredentialsProvider({
			id: "credentials",
			name: "credentials",
			credentials: {
				email: { label: "Email", type: "text", placeholder: "admin@gmail.com" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				if (!credentials.email || !credentials.password) {
					return null
				}

				const user = await db.user.findUnique({
					where: { email: credentials.email },
					select: {
						id: true,
						name: true,
						email: true,
						password: true,
					},
				})

				if (user && user.password === hashPassword(credentials.password)) {
					return user
				} else {
					return null
				}
			},
		}),
	],
	adapter: PrismaAdapter(db),
	secret: process.env.NEXTAUTH_SECRET,
	session: { strategy: "jwt" },
	debug: process.env.NODE_ENV === "development",
	pages: {
    signIn: '/login',
  },
}

const handler = NextAuth(options)

export { handler as GET, handler as POST }
