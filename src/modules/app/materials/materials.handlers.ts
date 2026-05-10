import { getReactPageTemplate } from "../../../react";
import {
    AUTHOR_NAME,
    SITE_NAME,
    breadcrumbLd,
    defaultOgImage,
    itemListLd,
    siteUrl,
} from "../../../seo";
import { getMaterialsData } from "./materials.data";

export function renderMaterials(request: Request, response: Response): Response {
    const data = getMaterialsData();
    const listItems = data.items.map(it => {
        const path = stringStartsWith(it.ctaHref, "http") ? "/materialy" : it.ctaHref;
        return { name: it.title, path: path };
    });

    response.content = getReactPageTemplate(
        "Materiály na podporu rozvoje řeči | Čteme spolu jinak",
        "MaterialsPage",
        data as unknown as Record<string, any>,
        {
            seo: {
                description: "Knížky a komunikační karty na podporu rozvoje řeči u dětí 1,5–6 let. Pohádky s piktogramy, komunikační karty zdarma a ukázka ke stažení.",
                keywords: "knížky pro děti, komunikační karty, pohádky s piktogramy, opožděný vývoj řeči, materiály na rozvoj řeči, ukázka zdarma",
                canonicalUrl: siteUrl("/materialy"),
                ogImage: defaultOgImage(),
                siteName: SITE_NAME,
                author: AUTHOR_NAME,
                jsonLd: [
                    breadcrumbLd([
                        { name: "Domů", path: "/" },
                        { name: "Materiály", path: "/materialy" },
                    ]),
                    itemListLd(listItems),
                ],
            },
        }
    );
    return response;
}
