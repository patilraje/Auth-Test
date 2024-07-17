import NextAuth, { NextAuthOptions } from 'next-auth';
import OktaProvider from 'next-auth/providers/okta';
import GitHubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';

export const options: NextAuthOptions = {
  debug: true,
  callbacks: {
    session: ({ session, token }) => ({
      ...session,
      user: {
        ...session.user,
        id: token.sub,
      },
    }),
  },
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    OktaProvider({
      clientId: process.env.OKTA_CLIENT_ID as string,
      clientSecret: process.env.OKTA_CLIENT_SECRET as string,
      // Set the issuer to the Okta domain without the /oauth2/default
      issuer: process.env.OKTA_DOMAIN, // Ensure this is in the format: https://yourDomain.okta.com
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username:', type: 'text', placeholder: 'your-cool-username' },
        password: { label: 'Password:', type: 'password', placeholder: 'your-awesome-password' },
      },
      async authorize(credentials) {
        const user = { id: '42', name: 'Dave', password: 'nextauth' };

        if (credentials?.username === user.name && credentials?.password === user.password) {
          return user;
        } else {
          return null;
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(options);
