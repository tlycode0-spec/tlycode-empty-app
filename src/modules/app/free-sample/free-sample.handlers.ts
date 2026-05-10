import { getReactPageTemplate } from "../../../react";
import {
    AUTHOR_NAME,
    SITE_NAME,
    breadcrumbLd,
    productLd,
    siteUrl,
} from "../../../seo";
import { getFreeSampleData } from "./free-sample.data";

export function renderFreeSample(request: Request, response: Response): Response {
    const data = getFreeSampleData();
    response.content = getReactPageTemplate(
        "Ukázka knihy zdarma | Čteme spolu jinak",
        "FreeSamplePage",
        data as unknown as Record<string, any>,
        {
            seo: {
                description: "Ukázka knihy zdarma ke stažení — krátký příběh s obrázkovou podporou textu pro děti 2–5 let. Vyzkoušejte si, jak fungují materiály na rozvoj řeči.",
                keywords: "ukázka zdarma, knížka pro děti zdarma, PDF zdarma, pohádky s piktogramy, opožděný vývoj řeči",
                canonicalUrl: siteUrl("/zdarma"),
                ogImage: data.hero.image,
                ogType: "product",
                siteName: SITE_NAME,
                author: AUTHOR_NAME,
                jsonLd: [
                    breadcrumbLd([
                        { name: "Domů", path: "/" },
                        { name: "Materiály", path: "/materialy" },
                        { name: "Ukázka zdarma", path: "/zdarma" },
                    ]),
                    productLd({
                        name: "Ukázka knihy zdarma",
                        description: "Krátký příběh s obrázkovou podporou textu pro děti 2–5 let.",
                        image: data.hero.image,
                        canonicalPath: "/zdarma",
                        priceCzk: "0",
                        isFree: true,
                        isComingSoon: false,
                        purchaseUrl: data.ctaHref,
                        audienceMinAge: 2,
                        audienceMaxAge: 5,
                    }),
                ],
            },
        }
    );
    return response;
}
