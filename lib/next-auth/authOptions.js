import CredentialsProvider from 'next-auth/providers/credentials'

export const authOptions = {
  /* providers */
  providers: [
    CredentialsProvider({
      id: 'credentials',
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: 'my-project',
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        personal_id: {
          label: 'email',
          type: 'email',
          placeholder: 'jsmith@example.com',
        },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        const payload = {
          personal_id: credentials.personal_id,
          password: credentials.password,
        }
        const backendUrl = process.env.NEXT_PUBLIC_URL;
        const res = await fetch(backendUrl + '/auth/logintest', {
          method: 'POST',
          body: JSON.stringify(payload),
          headers: {
            'Content-Type': 'application/json',
          },
        })

        const user = await res.json()
        if (!res.ok) {
          throw new Error(user.message)
        }
        // If no error and we have user data, return it
        if (res.ok && user) {
          return user
        }

        // Return null if user data could not be retrieved
        return null
      },
    }),
    // ...add more providers here
  ],
  // secret: process.env.JWT_SECRET,
  secret: process.env.NEXT_PUBLIC_AUTH_SECRET,
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (account && user) {
        return {
          ...token,
          accessToken: user.token,
          refreshToken: user.refreshToken,
          data: user.data
        }
      }

      return token
    },

    async session({ session, token }) {
      session.user.accessToken = token.accessToken[0]
      // session.user.refreshToken = token.refreshToken
      // session.user.accessTokenExpires = token.accessTokenExpires
      session.user.data = token.data[0]

      return session
    },
  },
  theme: {
    colorScheme: 'auto', // "auto" | "dark" | "light"
    brandColor: '', // Hex color code #33FF5D
    logo: '/vercel.svg', // Absolute URL to image
  },
  // Enable debug messages in the console if you are having problems
  debug: process.env.NODE_ENV === 'development',
}

