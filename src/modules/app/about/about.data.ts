import { getAssetUrl } from "../../../utils";
import { getHomeData } from "../home/home.data";
import { AboutPageProps } from "./about.types";

export function getAboutData(): AboutPageProps {
    const home = getHomeData();
    return {
        header: home.header,
        backLabel: "← Zpět na hlavní stránku",
        backHref: "/",
        pageTitle: "Proč vzniklo Čteme spolu jinak",
        hero: {
            quote: "„Hledala jsem knížky, které by pomohly mému synovi rozvíjet řeč. Když jsem je nenašla, začala jsem je tvořit sama.\"",
            intro: "Ahoj, jsem maminka.",
            image: getAssetUrl("images/home/about-photo.webp"),
            imageAlt: "Tereza – autorka projektu Čteme spolu jinak",
        },
        body: {
            heading: "Projekt vznikl z osobní zkušenosti.",
            paragraphs: [
                "Věřím, že každé dítě si zaslouží radost z příběhů – bez ohledu na to, v jaké fázi vývoje řeči se právě nachází.",
                "Když se u mého syna objevilo opoždění ve vývoji řeči, začala jsem hledat knížky a materiály, které by nám pomohly.",
                "Jenže jsem zjistila, že knížek s obrázkovou podporou textu je na trhu omezené množství.",
                "Proto jsem je začala tvořit sama.",
                "Dnes vytvářím komunikační karty, jednoduché příběhy s obrázky a materiály, které pomáhají dětem rozvíjet řeč přirozenou a hravou formou.",
                "Mým cílem je pomáhat i dalším rodinám, které procházejí podobnou situací, aby pro ně jejich cesta k prvním slůvkům byla jednodušší.",
            ],
            signature: "S láskou, Tereza",
        },
        contact: home.contact,
        footer: home.footer,
    };
}
