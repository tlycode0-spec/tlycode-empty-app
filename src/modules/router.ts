import {
    renderAbout,
    renderCookies,
    renderFreeSample,
    renderHome,
    renderLlmsTxt,
    renderMaterials,
    renderMaterialKnizkyRozvojReci,
    renderMaterialKomunikacniKarty,
    renderMaterialMedvedMaty,
    renderPrivacy,
    renderRobots,
    renderSitemap,
    renderTerms,
} from "./app";
import { RouterPaths } from "./types";

// Router
export function getRouter(): { path: RouterPaths; route: RouteFunction, type: "action" | "render" }[] {
    return [
        { path: "/", route: renderHome, type: "render" },
        { path: "/kdo-jsem", route: renderAbout, type: "render" },
        { path: "/materialy", route: renderMaterials, type: "render" },
        { path: "/materialy/knizky-rozvoj-reci", route: renderMaterialKnizkyRozvojReci, type: "render" },
        { path: "/materialy/medved-maty", route: renderMaterialMedvedMaty, type: "render" },
        { path: "/materialy/komunikacni-karty", route: renderMaterialKomunikacniKarty, type: "render" },
        { path: "/zdarma", route: renderFreeSample, type: "render" },
        { path: "/obchodni-podminky", route: renderTerms, type: "render" },
        { path: "/ochrana-udaju", route: renderPrivacy, type: "render" },
        { path: "/zasady-cookies", route: renderCookies, type: "render" },
        { path: "/sitemap.xml", route: renderSitemap, type: "render" },
        { path: "/robots.txt", route: renderRobots, type: "render" },
        { path: "/llms.txt", route: renderLlmsTxt, type: "render" },
    ];
}
