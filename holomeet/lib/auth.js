// // lib/auth.js
// import GoogleProvider from "next-auth/providers/google";
// import GitHubProvider from "next-auth/providers/github";
// import FacebookProvider from "next-auth/providers/facebook";
// import CredentialsProvider from "next-auth/providers/credentials";
// import { connectDB } from "@/lib/mongodb";
// import Register from "@/models/Registration"; // ← now inside holomeet/models/
// import bcrypt from "bcryptjs";

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

//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         email:    { label: "Email",    type: "text"     },
//         password: { label: "Password", type: "password" },
//       },

//       async authorize(credentials) {
//         await connectDB();

//         const user = await Register.findOne({ Email: credentials.email });

//         if (!user) {
//           throw new Error("No account found with this email");
//         }

//         if (!user.Password) {
//           throw new Error("This account uses social login. Please use Google/GitHub.");
//         }

//         const isMatch = await bcrypt.compare(credentials.password, user.Password);
//         if (!isMatch) {
//           throw new Error("Incorrect password");
//         }

//         return {
//           id:       user._id.toString(),
//           name:     user.Firstname + " " + user.Secondname,
//           email:    user.Email,
//           provider: "credentials",
//         };
//       },
//     }),
//   ],

//   session: { strategy: "jwt" },

//   callbacks: {
//     async signIn({ user, account }) {
//       if (account.provider !== "credentials") {
//         await connectDB();
//         const exist = await Register.findOne({ Email: user.email });
//         if (!exist) {
//           await Register.create({
//             Firstname:  user.name?.split(" ")[0] || "User",
//             Secondname: user.name?.split(" ").slice(1).join(" ") || "",
//             Email:      user.email,
//             Usertype:   "Student",
//           });
//         }
//       }
//       return true;
//     },

//     async jwt({ token, user, account }) {
//       if (user) {
//         token.id       = user.id;
//         token.name     = user.name;
//         token.email    = user.email;
//         token.provider = account?.provider || user.provider || "credentials";
//       }
//       return token;
//     },

//     async session({ session, token }) {
//       session.user.id       = token.id;
//       session.user.name     = token.name;
//       session.user.email    = token.email;
//       session.user.provider = token.provider;
//       return session;
//     },
//   },

//   secret: process.env.NEXTAUTH_SECRET,

//   pages: {
//     signIn: "/login",
//   },
// };

// lib/auth.js
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "@/lib/mongodb";
import Register from "@/models/Registration";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),

    FacebookProvider({
      clientId: process.env.FACEBOOK_ID,
      clientSecret: process.env.FACEBOOK_SECRET,
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email:    { label: "Email",    type: "text"     },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        await connectDB();

        const user = await Register.findOne({ Email: credentials.email });

        if (!user) {
          throw new Error("No account found with this email");
        }

        if (!user.Password) {
          throw new Error("This account uses social login. Please use Google/GitHub.");
        }

        const isMatch = await bcrypt.compare(credentials.password, user.Password);
        if (!isMatch) {
          throw new Error("Incorrect password");
        }

        return {
          id:       user._id.toString(),
          name:     user.Firstname + " " + user.Secondname,
          email:    user.Email,
          provider: "credentials",
        };
      },
    }),
  ],

  session: { strategy: "jwt" },

  callbacks: {
    async signIn({ user, account }) {
      if (account.provider !== "credentials") {
        await connectDB();
        const exist = await Register.findOne({ Email: user.email });
        if (!exist) {
          await Register.create({
            Firstname:  user.name?.split(" ")[0] || "User",
            Secondname: user.name?.split(" ").slice(1).join(" ") || "",
            Email:      user.email,
            Usertype:   "Student",
          });
        }
      }
      return true;
    },

    async jwt({ token, user, account }) {
      if (user) {
        token.provider = account?.provider || user.provider || "credentials";
        token.name     = user.name;
        token.email    = user.email;

        if (user.id) {
          // CredentialsProvider — id directly available hai
          token.id = user.id;
        } else {
          // Social login (Google/GitHub/Facebook) — DB se id fetch karo
          await connectDB();
          const dbUser = await Register.findOne({ Email: user.email });
          token.id = dbUser?._id.toString() ?? user.email; // fallback: email
        }
      }
      return token;
    },

    async session({ session, token }) {
      session.user.id       = token.id;
      session.user.name     = token.name;
      session.user.email    = token.email;
      session.user.provider = token.provider;
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,

  pages: {
    signIn: "/login",
  },
};