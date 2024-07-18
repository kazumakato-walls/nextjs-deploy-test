import type { Metadata } from "next";
import { Inter,Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import Header from"../components/Header"
import NextAuthProvider from './providers/NextAuth'
import { MantineProvider, ColorSchemeScript } from '@mantine/core';
import '@mantine/core/styles.css';
import { theme } from './theme';

const inter = Inter({ subsets: ["latin"] });
const notoSansJP = Noto_Sans_JP({ weight: "400", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Walls Cloud Services",
  description: "株式会社Wallsが展開するWebサービスです。",
};
export default function RootLayout(
  { children }: { children: React.ReactNode }) 
{
  return (
    <html lang="ja">
      <head>
        <ColorSchemeScript />
        <link rel="shortcut icon" href="/wcd_logo.svg" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <body className={notoSansJP.className}>
      <NextAuthProvider>
      <MantineProvider theme={theme}>
        <Header />{children}
      </MantineProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}


