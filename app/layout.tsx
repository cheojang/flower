import type { Metadata, Viewport } from "next";
import { Noto_Sans_KR, Gowun_Batang } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingConsult from "@/components/FloatingConsult";
import { site } from "@/lib/config";

const sans = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-pretendard",
  display: "swap",
});

const serif = Gowun_Batang({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-gowun",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} ${site.nameEn} · 양재꽃시장 꽃집`,
    template: `%s · ${site.name}`,
  },
  description: `${site.description} 양재 화훼센타 안에서 매일 새벽 경매로 들어온 신선한 꽃을 직영가로. 꽃다발·꽃바구니·개업화환·플라워클래스, 매장 픽업과 배송. ${site.address}`,
  keywords: [
    "양재 꽃집",
    "양재꽃시장",
    "양재 화훼센타",
    "양재 꽃다발",
    "서초 꽃집",
    "서초 꽃배달",
    "양재동 꽃집",
    "개업화환",
    "플라워 클래스",
    "꽃다발 주문",
    site.name,
    site.nameEn,
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: `${site.name} · 양재꽃시장 화훼센타 안의 꽃집`,
    description: site.description,
    url: site.url,
    siteName: `${site.name} ${site.nameEn}`,
    locale: "ko_KR",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FBF6F0",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={`${sans.variable} ${serif.variable}`}>
      <body className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <FloatingConsult />
      </body>
    </html>
  );
}
