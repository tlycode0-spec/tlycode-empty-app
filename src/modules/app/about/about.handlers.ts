import { getReactPageTemplate } from "../../../react";
import { AUTHOR_NAME, SITE_NAME, breadcrumbLd, personLd, siteUrl } from "../../../seo";
import { getAboutData } from "./about.data";

export function renderAbout(request: Request, response: Response): Response {
    const data = getAboutData();
    response.content = getReactPageTemplate(
        "Kdo jsem | Čteme spolu jinak",
        "AboutPage",
        data as unknown as Record<string, any>,
        {
            seo: {
                description: "Příběh autorky projektu Čteme spolu jinak — proč a jak vznikly knížky pro děti s opožděným vývojem řeči. Z vlastní zkušenosti maminky pro další rodiny.",
                keywords: "Tereza, autorka, příběh, opožděný vývoj řeči, maminka, projekt Čteme spolu jinak",
                canonicalUrl: siteUrl("/kdo-jsem"),
                ogImage: data.hero.image,
                ogType: "profile",
                siteName: SITE_NAME,
                author: AUTHOR_NAME,
                jsonLd: [
                    personLd(data.hero.image),
                    breadcrumbLd([
                        { name: "Domů", path: "/" },
                        { name: "Kdo jsem", path: "/kdo-jsem" },
                    ]),
                ],
            },
        }
    );
    return response;
}
