import type { MetadataRoute } from "next";
import { site } from "@/lib/config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // 관리자·주문·인증·API는 검색 색인에서 제외
      disallow: ["/admin", "/admin/", "/order/", "/api/", "/mypage", "/login"],
    },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
