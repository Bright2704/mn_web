import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectMongoDB } from "@/lib/mongodb"
import User from '@/models/user'
import bcrypt from 'bcryptjs'

const authOptions = {
  providers: [
    CredentialsProvider({       
      name: "credentials",         
      credentials: {},
      async authorize(credentials, req) {           
        const { email, password } = credentials;

        try {
          await connectMongoDB();
          const user = await User.findOne({ email });

          if (!user) {
            return null;
          }

          const passwordMatch = await bcrypt.compare(password, user.password)

          if (!passwordMatch) {
            return null;
          }

          return user;
        } catch(error) {
          console.log("Error: ", error);
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // If this is the first sign in, user object is available
        token.name = user.name;
        token.email = user.email;
      }
      
      // Fetch the user's role from the database
      try {
        await connectMongoDB();
        const dbUser = await User.findOne({ name: token.name });
        if (dbUser) {
          token.role = dbUser.role;
        }
      } catch (error) {
        console.log("Error fetching user role:", error);
      }

      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login"
  }
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST};