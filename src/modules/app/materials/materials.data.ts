import { getAssetUrl } from "../../../utils";
import { getHomeData } from "../home/home.data";
import { MaterialsPageProps } from "./materials.types";

export function getMaterialsData(): MaterialsPageProps {
    const home = getHomeData();
    return {
        header: home.header,
        backLabel: "← Zpět na hlavní stránku",
        backHref: "/",
        hero: {
            title: "Materiály na podporu rozvoje řeči",
            intro: "Knížky a komunikační karty navržené tak, aby pomáhaly dětem rozumět světu, rozvíjet slovní zásobu a prožívat radost ze společného čtení.",
            note: "Každý materiál vznikl z osobní zkušenosti — testovaný doma, s láskou k malým čtenářům.",
        },
        items: [
            {
                slug: "knizky-rozvoj-reci",
                image: getAssetUrl("images/home/product1.webp"),
                imageAlt: "Pohádky s piktogramy — Bagr a náklaďák na stavbě",
                badge: "Novinka",
                badgeColor: "orange",
                title: "Pohádky s piktogramy: Bagr a náklaďák na stavbě",
                description: "První díl ze série Pohádky s piktogramy. Příběh o stroji, který se ztratí na stavbě — s obrázky uprostřed textu, aby si dítě \"četlo\" společně s vámi.",
                ageRange: "2–5 let",
                price: "od 249 Kč",
                ctaLabel: "Detail příběhu",
                ctaHref: "/materialy/knizky-rozvoj-reci",
            },
            {
                slug: "medved-maty",
                image: getAssetUrl("images/home/product2.webp"),
                imageAlt: "Medvěd Maty a sovička",
                badge: "Připravujeme",
                badgeColor: "gray",
                title: "Medvěd Maty a sovička",
                description: "Příběh o hledání a přátelství. Další díl ze série pohádek právě připravujeme — brzy bude k dispozici.",
                ageRange: "3–6 let",
                price: "Brzy",
                ctaLabel: "Brzy k dispozici",
                ctaHref: "/materialy/medved-maty",
                isComingSoon: true,
            },
            {
                slug: "komunikacni-karty",
                image: getAssetUrl("images/home/mom-child-cards.webp"),
                imageAlt: "Komunikační karty pro děti",
                badge: "Zdarma",
                badgeColor: "green",
                title: "Komunikační karty pro každý den",
                description: "Sada obrázkových karet, které pomáhají dětem vyjadřovat své potřeby, pocity a zážitky bez zbytečného stresu. Ke stažení zdarma.",
                ageRange: "1,5–5 let",
                price: "Zdarma",
                ctaLabel: "Stáhnout zdarma",
                ctaHref: "https://ctemespolujinak.gumroad.com/l/oqjzck",
            },
            {
                slug: "ukazka-zdarma",
                image: getAssetUrl("images/home/hero-mom-reading.webp"),
                imageAlt: "Maminka čte se svým dítětem obrázkovou knížku",
                badge: "Zdarma",
                badgeColor: "green",
                title: "Ukázka knihy zdarma",
                description: "Krátký příběh s obrázkovou podporou textu — vyzkoušejte si, jak materiály fungují, ještě než si některý objednáte.",
                ageRange: "2–5 let",
                price: "Zdarma",
                ctaLabel: "Stáhnout zdarma",
                ctaHref: "/zdarma",
            },
        ],
        contact: home.contact,
        footer: home.footer,
    };
}
