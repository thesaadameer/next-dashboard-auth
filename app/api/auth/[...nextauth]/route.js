// app/api/auth/[...nextauth]/route.js

import dbConnect from "@/lib/mongodb";
import User from "@/models/user";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {},

      async authorize(credentials) {
        const { email, password } = credentials;

        try {
          // Connect to MongoDB using the new dbConnect method
          await dbConnect();

          // Find the user in the database
          const user = await User.findOne({ email });

          if (!user) {
            return null;
          }

          const passwordsMatch = await bcrypt.compare(password, user.password);

          if (!passwordsMatch) {
            return null;
          }

          return {
            id: user._id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (error) {
          console.log("Error while authorizing: ", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 60 * 60, // Set session expiry to 1 hour (in seconds)
  },
  jwt: {
    maxAge: 60 * 60, // Set JWT token expiry to 1 hour (in seconds)
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/",
  },
  callbacks: {
    async session({ session, token }) {
      session.user.role = token.role; // Add role to session
      session.expires = new Date(token.exp * 1000).toISOString(); // Set session expiry based on token
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role; // Add role to JWT token
        token.exp = Math.floor(Date.now() / 1000) + 60 * 60; // Set token expiration to 1 hour from current time
      }
      return token;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
