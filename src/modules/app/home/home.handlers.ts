import { getReactPageTemplate } from "../../../react";
import {
    AUTHOR_NAME,
    SITE_NAME,
    breadcrumbLd,
    defaultOgImage,
    faqLd,
    organizationLd,
    personLd,
    siteUrl,
    websiteLd,
} from "../../../seo";
import { getHomeData } from "./home.data";

export function renderHome(request: Request, response: Response): Response {
    const data = getHomeData();
    response.content = getReactPageTemplate(
        "Čteme spolu jinak | Pohádky s piktogramy pro rozvoj řeči",
        "HomePage",
        data as unknown as Record<string, any>,
        {
            seo: {
                description: "Pohádky s piktogramy a komunikační karty pro děti s opožděným vývojem řeči. Společné čtení, které pomáhá najít první slova. Ukázka ke stažení zdarma.",
                keywords: "pohádky pro děti, opožděný vývoj řeči, komunikační karty, knížky pro děti, piktogramy, rozvoj řeči, čtení s dítětem, mateřská logopedie",
                canonicalUrl: siteUrl("/"),
                ogImage: defaultOgImage(),
                siteName: SITE_NAME,
                author: AUTHOR_NAME,
                jsonLd: [
                    organizationLd(),
                    websiteLd(),
                    personLd(data.hero.image),
                    breadcrumbLd([{ name: "Domů", path: "/" }]),
                    faqLd(data.faq.items),
                ],
            },
        }
    );
    return response;
}
