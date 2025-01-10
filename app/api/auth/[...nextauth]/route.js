import User from "@/models/User";
import { connectDB } from "@/lib/mongodb";
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
                await connectDB();
                console.log("Database connected");


                const user = await User.findOne({ email });

                if (!user) {                
                console.log("No user found with this email");

                  return null;
                }
                
                const passwordMatch = await bcrypt.compare(password, user.password);

                console.log("Password from credentials:", password);
                console.log("Password in database:", user.password);
      
                if (!passwordMatch) {
                    console.log("Password mismatch");

                  return null;
                  console.log("Password mismatch");

                }
      
                // Return user object with required fields
                return { id: user._id, name: user.name, email: user.email };

              } catch (error) {
                console.log("Error: ", error);
                return null;
              }
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/",
        signOut: "/logout",
    },
    callbacks: {
      async session({ session, token }) {
        // Add the user ID to the session object
        if (token?.id) {
          session.user.id = token.id;
        }
        return session;
      },
      async jwt({ token, user }) {
        // Add the user ID to the token
        if (user?.id) {
          token.id = user.id;
        }
        return token;
      },
    },

};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };