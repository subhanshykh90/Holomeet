// import NextAuth from "next-auth";
// import GoogleProvider from "next-auth/providers/google";
// import GitHubProvider from "next-auth/providers/github";
// import FacebookProvider from "next-auth/providers/facebook";
// import { connectDB } from "@/lib/mongodb";
// import User from "@/models/User";

// export const authOptions = {
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     }),
//     GitHubProvider({
//       clientId: process.env.GITHUB_ID,
//       clientSecret: process.env.GITHUB_SECRET,
//     }),
//     FacebookProvider({
//       clientId: process.env.FACEBOOK_ID,
//       clientSecret: process.env.FACEBOOK_SECRET,
//     }),
//   ],

//   callbacks: {
//     async signIn({ user, account, profile }) {
//       try {
//         await connectDB();
//         const userExists = await User.findOne({ email: user.email });
//         if (!userExists) {
//           await User.create({
//             name: user.name,
//             email: user.email,
//             image: user.image,
//             provider: account?.provider || "unknown",
//           });
//           console.log("New user created:", user.email);
//         } else if (userExists.provider !== account?.provider) {
//           userExists.provider = account?.provider || userExists.provider;
//           await userExists.save();
//         }
//         return true;
//       } catch (error) {
//         console.error("Error in signIn callback:", error);
//         return false;
//       }
//     },

//     // ✅ userId MongoDB se fetch karo
//     async jwt({ token, user, account }) {
//       if (account) token.provider = account.provider;

//       if (token.email && !token.userId) {
//         await connectDB();
//         const dbUser = await User.findOne({ email: token.email });
//         if (dbUser) {
//           token.userId = dbUser._id.toString();
//         }
//       }

//       return token;
//     },

//     // ✅ session mein id expose karo
//     async session({ session, token }) {
//       session.user.provider = token.provider;
//       session.user.id = token.userId;
//       return session;
//     },
//   },

//   secret: process.env.NEXTAUTH_SECRET,
// };

// const handler = NextAuth(authOptions);
// export { handler as GET, handler as POST };


// app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth"; // ← pulls from lib/auth.js which has CredentialsProvider

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
