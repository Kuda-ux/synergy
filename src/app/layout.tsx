import type { Metadata } from "next";
import { IBM_Plex_Mono, Inter, Sora } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { getAnnouncements, getStoreHours, getZwgRate } from "@/lib/settings";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/constants";
import { organisationJsonLd } from "@/lib/seo";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const sora = Sora({ variable: "--font-sora", subsets: ["latin"] });
const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${SITE_NAME} — Robotics, Electronics & STEM Education Store`,
    template: `%s | ${SITE_NAME}`,
  },
  description: `${SITE_TAGLINE}. Shop robotics kits, electronic components, IoT devices and embedded systems for learning, innovation and industry.`,
  openGraph: {
    siteName: SITE_NAME,
    type: "website",
    locale: "en_ZW",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [announcements, zwgCentsPerUsd, storeHours] = await Promise.all([
    getAnnouncements(),
    getZwgRate(),
    getStoreHours(),
  ]);

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${sora.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <Providers config={{ zwgCentsPerUsd }}>
          <AnnouncementBar messages={announcements} />
          <SiteHeader />
          <main id="main" className="flex-1">
            {children}
          </main>
          <SiteFooter storeHours={storeHours} />
        </Providers>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organisationJsonLd()) }}
        />
      </body>
    </html>
  );
}
