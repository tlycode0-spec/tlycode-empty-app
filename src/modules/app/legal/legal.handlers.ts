import { getReactPageTemplate } from "../../../react";
import { AUTHOR_NAME, SITE_NAME, breadcrumbLd, defaultOgImage, siteUrl } from "../../../seo";
import { getCookiesData, getPrivacyData, getTermsData } from "./legal.data";

export function renderTerms(request: Request, response: Response): Response {
    response.content = getReactPageTemplate(
        "Obchodní podmínky | Čteme spolu jinak",
        "LegalPage",
        getTermsData() as unknown as Record<string, any>,
        {
            seo: {
                description: "Všeobecné obchodní podmínky projektu Čteme spolu jinak.",
                canonicalUrl: siteUrl("/obchodni-podminky"),
                ogImage: defaultOgImage(),
                siteName: SITE_NAME,
                author: AUTHOR_NAME,
                jsonLd: [
                    breadcrumbLd([
                        { name: "Domů", path: "/" },
                        { name: "Obchodní podmínky", path: "/obchodni-podminky" },
                    ]),
                ],
            },
        }
    );
    return response;
}

export function renderPrivacy(request: Request, response: Response): Response {
    response.content = getReactPageTemplate(
        "Ochrana údajů | Čteme spolu jinak",
        "LegalPage",
        getPrivacyData() as unknown as Record<string, any>,
        {
            seo: {
                description: "Zásady ochrany osobních údajů projektu Čteme spolu jinak.",
                canonicalUrl: siteUrl("/ochrana-udaju"),
                ogImage: defaultOgImage(),
                siteName: SITE_NAME,
                author: AUTHOR_NAME,
                jsonLd: [
                    breadcrumbLd([
                        { name: "Domů", path: "/" },
                        { name: "Ochrana údajů", path: "/ochrana-udaju" },
                    ]),
                ],
            },
        }
    );
    return response;
}

export function renderCookies(request: Request, response: Response): Response {
    response.content = getReactPageTemplate(
        "Zásady cookies (EU) | Čteme spolu jinak",
        "LegalPage",
        getCookiesData() as unknown as Record<string, any>,
        {
            seo: {
                description: "Zásady použití cookies na webu Čteme spolu jinak.",
                canonicalUrl: siteUrl("/zasady-cookies"),
                ogImage: defaultOgImage(),
                siteName: SITE_NAME,
                author: AUTHOR_NAME,
                jsonLd: [
                    breadcrumbLd([
                        { name: "Domů", path: "/" },
                        { name: "Zásady cookies", path: "/zasady-cookies" },
                    ]),
                ],
            },
        }
    );
    return response;
}
