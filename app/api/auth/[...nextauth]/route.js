import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectMongoDB } from "@/lib/mongodb";
import User from '@/models/user';
import bcrypt from 'bcryptjs';

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

          const passwordMatch = await bcrypt.compare(password, user.password);

          if (!passwordMatch) {
            return null;
          }

          return user;  // Return full user object (including user_id)
        } catch (error) {
          console.log("Error: ", error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // If this is the first sign in, the user object is available
        token.name = user.name;
        token.email = user.email;
        token.user_id = user.user_id; // Add user_id to the token
      }
      
      // Fetch the user's role and user_id from the database if needed
      try {
        await connectMongoDB();
        const dbUser = await User.findOne({ name: token.name });
        if (dbUser) {
          token.role = dbUser.role;
          token.user_id = dbUser.user_id;  // Ensure token always has the user_id
        }
      } catch (error) {
        console.log("Error fetching user details:", error);
      }

      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role;
        session.user.user_id = token.user_id; // Add user_id to session object
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
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
