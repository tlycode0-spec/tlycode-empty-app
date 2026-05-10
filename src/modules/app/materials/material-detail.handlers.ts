import { getReactPageTemplate } from "../../../react";
import {
    AUTHOR_NAME,
    SITE_NAME,
    breadcrumbLd,
    productLd,
    siteUrl,
} from "../../../seo";
import { getMaterialDetailPageProps } from "./material-detail.data";
import { MaterialDetailContent } from "./materials.types";

interface AgeRange {
    min: number;
    max: number;
}

function parseAgeRange(text: string): AgeRange {
    const match = regexMatch(text, "([0-9]+(?:[,.][0-9]+)?)[^0-9]+([0-9]+)");
    if (match !== null && match.length >= 3) {
        const minStr = stringReplace(match[1], ",", ".");
        const minNum = parseFloat(minStr);
        const maxNum = parseFloat(match[2]);
        return {
            min: isNaN(minNum) ? 1 : minNum,
            max: isNaN(maxNum) ? 6 : maxNum,
        };
    }
    return { min: 1, max: 6 };
}

function priceNumber(text: string): string {
    const match = regexMatch(text, "([0-9]+)");
    if (match !== null && match.length >= 2) return match[1];
    return "0";
}

function detailPath(slug: string): string {
    return "/materialy/" + slug;
}

function detailJsonLd(detail: MaterialDetailContent): string[] {
    const path = detailPath(detail.slug);
    const isFree = stringContains(toLower(detail.price), "zdarma");
    const isComingSoon = detail.isComingSoon === true;
    const purchaseUrl = stringStartsWith(detail.ctaHref, "http") ? detail.ctaHref : siteUrl(path);
    const age = parseAgeRange(detail.ageRange);

    return [
        breadcrumbLd([
            { name: "Domů", path: "/" },
            { name: "Materiály", path: "/materialy" },
            { name: detail.title, path: path },
        ]),
        productLd({
            name: detail.title,
            description: detail.seoDescription,
            image: detail.image,
            canonicalPath: path,
            priceCzk: priceNumber(detail.price),
            isFree: isFree,
            isComingSoon: isComingSoon,
            purchaseUrl: purchaseUrl,
            audienceMinAge: age.min,
            audienceMaxAge: age.max,
        }),
    ];
}

function renderDetailBySlug(slug: string, response: Response): Response {
    const props = getMaterialDetailPageProps(slug);
    if (props === null) {
        response.status = 404;
        response.content = "Materiál nenalezen.";
        return response;
    }
    const path = detailPath(slug);
    response.content = getReactPageTemplate(
        props.detail.title + " | Čteme spolu jinak",
        "MaterialDetailPage",
        props as unknown as Record<string, any>,
        {
            seo: {
                description: props.detail.seoDescription,
                canonicalUrl: siteUrl(path),
                ogImage: props.detail.image,
                ogType: "product",
                siteName: SITE_NAME,
                author: AUTHOR_NAME,
                jsonLd: detailJsonLd(props.detail),
            },
        }
    );
    return response;
}

export function renderMaterialKnizkyRozvojReci(request: Request, response: Response): Response {
    return renderDetailBySlug("knizky-rozvoj-reci", response);
}

export function renderMaterialMedvedMaty(request: Request, response: Response): Response {
    return renderDetailBySlug("medved-maty", response);
}

export function renderMaterialKomunikacniKarty(request: Request, response: Response): Response {
    return renderDetailBySlug("komunikacni-karty", response);
}
