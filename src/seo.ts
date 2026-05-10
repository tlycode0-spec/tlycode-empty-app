import { getAssetUrl } from "./utils";

export const SITE_URL = "https://ctemespolujinak.cz";
export const SITE_NAME = "Čteme spolu jinak";
export const SITE_DESCRIPTION = "Pohádky s piktogramy a komunikační karty pro děti s opožděným vývojem řeči. Společné čtení, které pomáhá najít první slova.";
export const SITE_LOCALE = "cs_CZ";
export const AUTHOR_NAME = "Tereza";
export const AUTHOR_JOB_TITLE = "Autorka projektu Čteme spolu jinak";
export const CONTACT_EMAIL = "ahoj@ctemespolujinak.cz";
export const INSTAGRAM_URL = "https://instagram.com/ctemespolujinak";
export const LINKTREE_URL = "https://linktr.ee/ctemespolujinak";

export function siteUrl(path: string): string {
    if (stringStartsWith(path, "http")) return path;
    if (path === "" || path === "/") return SITE_URL + "/";
    if (stringStartsWith(path, "/")) return SITE_URL + path;
    return SITE_URL + "/" + path;
}

export function defaultOgImage(): string {
    return getAssetUrl("images/home/hero-mom-reading.webp");
}

function ldScript(obj: Record<string, any>): string {
    const json = jsonEncode(obj);
    const safe = stringReplace(json, "</", "<\\/");
    return `<script type="application/ld+json">${safe}</script>`;
}

export function organizationLd(): string {
    return ldScript({
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": SITE_NAME,
        "url": SITE_URL,
        "logo": getAssetUrl("images/home/hero-avatar.webp"),
        "description": SITE_DESCRIPTION,
        "email": CONTACT_EMAIL,
        "founder": {
            "@type": "Person",
            "name": AUTHOR_NAME,
            "jobTitle": AUTHOR_JOB_TITLE,
        },
        "contactPoint": {
            "@type": "ContactPoint",
            "email": CONTACT_EMAIL,
            "contactType": "customer service",
            "availableLanguage": ["cs"],
        },
        "sameAs": [INSTAGRAM_URL, LINKTREE_URL],
        "areaServed": "CZ",
    });
}

export function websiteLd(): string {
    return ldScript({
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": SITE_NAME,
        "url": SITE_URL,
        "inLanguage": "cs-CZ",
        "description": SITE_DESCRIPTION,
        "publisher": {
            "@type": "Organization",
            "name": SITE_NAME,
            "url": SITE_URL,
        },
    });
}

export function personLd(image: string): string {
    return ldScript({
        "@context": "https://schema.org",
        "@type": "Person",
        "name": AUTHOR_NAME,
        "jobTitle": AUTHOR_JOB_TITLE,
        "url": siteUrl("/kdo-jsem"),
        "image": image,
        "email": CONTACT_EMAIL,
        "worksFor": {
            "@type": "Organization",
            "name": SITE_NAME,
            "url": SITE_URL,
        },
        "sameAs": [INSTAGRAM_URL, LINKTREE_URL],
    });
}

export interface BreadcrumbItem {
    name: string;
    path: string;
}

export function breadcrumbLd(items: BreadcrumbItem[]): string {
    const elements: any[] = [];
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        elements.push({
            "@type": "ListItem",
            "position": i + 1,
            "name": item.name,
            "item": siteUrl(item.path),
        });
    }
    return ldScript({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": elements,
    });
}

export interface FaqEntry {
    question: string;
    answer: string;
}

export function faqLd(items: FaqEntry[]): string {
    const elements: any[] = [];
    for (const item of items) {
        elements.push({
            "@type": "Question",
            "name": item.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": item.answer,
            },
        });
    }
    return ldScript({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": elements,
    });
}

export interface ProductLdInput {
    name: string;
    description: string;
    image: string;
    canonicalPath: string;
    priceCzk: string;
    isFree: boolean;
    isComingSoon: boolean;
    purchaseUrl: string;
    audienceMinAge: number;
    audienceMaxAge: number;
}

export function productLd(p: ProductLdInput): string {
    let availability = "https://schema.org/InStock";
    if (p.isComingSoon) availability = "https://schema.org/PreOrder";

    const offer: Record<string, any> = {
        "@type": "Offer",
        "url": p.purchaseUrl,
        "priceCurrency": "CZK",
        "price": p.isFree ? "0" : p.priceCzk,
        "availability": availability,
        "seller": {
            "@type": "Organization",
            "name": SITE_NAME,
            "url": SITE_URL,
        },
    };

    return ldScript({
        "@context": "https://schema.org",
        "@type": "Product",
        "name": p.name,
        "description": p.description,
        "image": [p.image],
        "url": siteUrl(p.canonicalPath),
        "brand": {
            "@type": "Brand",
            "name": SITE_NAME,
        },
        "audience": {
            "@type": "PeopleAudience",
            "suggestedMinAge": p.audienceMinAge,
            "suggestedMaxAge": p.audienceMaxAge,
        },
        "inLanguage": "cs-CZ",
        "offers": offer,
    });
}

export interface ItemListEntry {
    name: string;
    path: string;
}

export function itemListLd(items: ItemListEntry[]): string {
    const elements: any[] = [];
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        elements.push({
            "@type": "ListItem",
            "position": i + 1,
            "url": siteUrl(item.path),
            "name": item.name,
        });
    }
    return ldScript({
        "@context": "https://schema.org",
        "@type": "ItemList",
        "itemListElement": elements,
    });
}
