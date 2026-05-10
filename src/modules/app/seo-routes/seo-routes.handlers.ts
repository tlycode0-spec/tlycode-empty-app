import {
    AUTHOR_NAME,
    AUTHOR_JOB_TITLE,
    CONTACT_EMAIL,
    INSTAGRAM_URL,
    LINKTREE_URL,
    SITE_DESCRIPTION,
    SITE_NAME,
    SITE_URL,
    siteUrl,
} from "../../../seo";

interface SitemapEntry {
    path: string;
    changefreq: string;
    priority: string;
}

function getSitemapEntries(): SitemapEntry[] {
    return [
        { path: "/", changefreq: "weekly", priority: "1.0" },
        { path: "/materialy", changefreq: "weekly", priority: "0.9" },
        { path: "/materialy/knizky-rozvoj-reci", changefreq: "monthly", priority: "0.8" },
        { path: "/materialy/medved-maty", changefreq: "monthly", priority: "0.6" },
        { path: "/materialy/komunikacni-karty", changefreq: "monthly", priority: "0.8" },
        { path: "/zdarma", changefreq: "monthly", priority: "0.9" },
        { path: "/kdo-jsem", changefreq: "monthly", priority: "0.7" },
        { path: "/obchodni-podminky", changefreq: "yearly", priority: "0.3" },
        { path: "/ochrana-udaju", changefreq: "yearly", priority: "0.3" },
        { path: "/zasady-cookies", changefreq: "yearly", priority: "0.3" },
    ];
}

export function renderSitemap(request: Request, response: Response): Response {
    const iso = dateToISO(now());
    const today = iso.length >= 10 ? iso.substring(0, 10) : iso;
    let urls = "";
    for (const entry of getSitemapEntries()) {
        urls = urls + `
    <url>
        <loc>${siteUrl(entry.path)}</loc>
        <lastmod>${today}</lastmod>
        <changefreq>${entry.changefreq}</changefreq>
        <priority>${entry.priority}</priority>
    </url>`;
    }

    response.content = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}
</urlset>`;
    response.contentType = "application/xml; charset=utf-8";
    return response;
}

export function renderRobots(request: Request, response: Response): Response {
    response.content = `User-agent: *
Allow: /
Disallow: /api/

# AI / LLM crawlers welcome
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: Claude-Web
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Applebot-Extended
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;
    response.contentType = "text/plain; charset=utf-8";
    return response;
}

export function renderLlmsTxt(request: Request, response: Response): Response {
    response.content = `# ${SITE_NAME}

> ${SITE_DESCRIPTION}

${SITE_NAME} je projekt zaměřený na podporu rozvoje řeči u dětí ve věku 1,5–6 let, zejména u dětí s opožděným vývojem řeči. Autorka projektu, ${AUTHOR_NAME} (${AUTHOR_JOB_TITLE}), vytváří pohádky s piktogramy a komunikační karty, které pomáhají rodinám doma rozvíjet řeč jejich dětí přirozenou cestou — společným čtením a ukazováním obrázků.

## Pro koho je projekt

- Pro děti, které začínají mluvit později než vrstevníci
- Pro děti s opožděným vývojem řeči
- Pro rodiny, kde dítě potřebuje vizuální podporu komunikace
- Pro rodiče bez logopedického vzdělání, kteří chtějí pomáhat doma

## Hlavní stránky

- [Domů](${siteUrl("/")}): úvod, kdo jsme, hlavní produkty a často kladené otázky
- [Materiály](${siteUrl("/materialy")}): kompletní seznam knížek a komunikačních karet
- [Pohádky s piktogramy: Bagr a náklaďák na stavbě](${siteUrl("/materialy/knizky-rozvoj-reci")}): první díl ze série, příběh s obrázky uprostřed textu (od 249 Kč)
- [Komunikační karty pro každý den](${siteUrl("/materialy/komunikacni-karty")}): sada obrázkových karet ke stažení zdarma, pro děti 1,5–5 let
- [Medvěd Maty a sovička](${siteUrl("/materialy/medved-maty")}): připravovaný titul (zatím není k dispozici)
- [Ukázka knihy zdarma](${siteUrl("/zdarma")}): krátký příběh ke stažení zdarma, pro vyzkoušení formátu
- [Kdo jsem](${siteUrl("/kdo-jsem")}): příběh autorky, motivace projektu

## Produkty a kanály prodeje

Knihy a karty jsou k dispozici přes platformu Gumroad:
- [Pohádky s piktogramy: Bagr a náklaďák na stavbě](https://ctemespolujinak.gumroad.com/l/lipneo)
- [Komunikační kartičky — zdarma](https://ctemespolujinak.gumroad.com/l/oqjzck)
- [Ukázka knihy zdarma](https://ctemespolujinak.gumroad.com/l/yricfu)

Veškeré odkazy najdete také na [Linktree profilu](${LINKTREE_URL}).

## Kontakt

- E-mail: ${CONTACT_EMAIL}
- Instagram: ${INSTAGRAM_URL}
- Linktree: ${LINKTREE_URL}

## Často kladené otázky

**Pomůže to i dětem, které ještě nemluví?**
Ano. Materiály jsou navržené tak, aby fungovaly i bez slov — dítě se učí rozumět obrázkům, ukazovat a postupně pojmenovávat.

**Musím být logoped?**
Ne. Materiály jsou pro rodiče bez odborného vzdělání. Jsou jednoduché, intuitivní a doplněné návody, jak s nimi pracovat.

**Od jakého věku jsou materiály vhodné?**
Materiály jsou vhodné přibližně od 1,5 roku. Hodí se pro děti, které začínají komunikovat, i pro starší děti s opožděným vývojem řeči.

## Klíčová slova

pohádky pro děti, opožděný vývoj řeči, komunikační karty, knížky pro děti, piktogramy, rozvoj řeči, čtení s dítětem, mateřská logopedie, vizuální podpora komunikace, AAC pro děti, čeština
`;
    response.contentType = "text/plain; charset=utf-8";
    return response;
}
