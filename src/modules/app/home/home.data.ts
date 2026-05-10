import { getAssetUrl } from "../../../utils";
import { HomePageProps } from "./home.types";

export function getHomeData(): HomePageProps {
    return {
        header: {
            logo: getAssetUrl("images/home/hero-avatar.webp"),
            logoAlt: "Čteme spolu jinak",
            brandName: "Čteme spolu jinak",
            links: [
                { label: "Domů", href: "/" },
                { label: "Materiály", href: "/materialy" },
                { label: "O Mně", href: "/kdo-jsem", highlight: true },
            ],
        },
        hero: {
            image: getAssetUrl("images/home/hero-mom-reading.webp"),
            imageAlt: "Maminka čte se svým dítětem obrázkovou knížku",
            headingBefore: "Hravý ",
            headingHighlight: "rozvoj řeči",
            headingAfter: " přes obrázky, příběhy a společné čtení 📚",
            subheading: "Jednoduché příběhy doplněné o vizuální zobrazení textu, které podporují společné povídání a rozvoj řeči.",
            note: "Stačí 10 minut denně společného čtení a povídání.",
            ctaLabel: "Stáhnout ukázku zdarma",
            ctaHref: "/zdarma",
            badges: ["zdarma ke stažení", "vhodné pro děti 2–5 let"],
            quote: "Každé dítě si zaslouží být slyšet – někdy jen potřebuje trochu pomoci najít svá první slova.",
        },
        products: {
            heading: "Co opravdu pomáhá?",
            intro: "Knížky pro děti na ",
            introHighlight: "podporu rozvoje řeči",
            introAfter: " vznikly z vlastní zkušenosti u syna s opožděným vývojem řeči. Jsou tvořeny tak, aby pomáhaly rodičům podporovat řeč jejich dětí pomocí jednoduchých příběhů a obrázků.",
            products: [
                {
                    image: getAssetUrl("images/home/product1.webp"),
                    imageAlt: "Pohádky s piktogramy — Bagr a náklaďák na stavbě",
                    badge: "Novinka",
                    badgeColor: "orange",
                    title: "Pohádky s piktogramy: Bagr a náklaďák na stavbě",
                    description: "Příběh o stroji, který se ztratí na stavbě — s velkými obrázky uprostřed textu, aby si dítě \"četlo\" společně s vámi.",
                    ctaLabel: "Chci objevit příběh",
                    ctaHref: "/materialy/knizky-rozvoj-reci",
                },
                {
                    image: getAssetUrl("images/home/product2.webp"),
                    imageAlt: "Medvěd Maty a sovička",
                    badge: "Připravujeme",
                    badgeColor: "gray",
                    title: "Medvěd Maty a sovička",
                    description: "Příběh o hledání a přátelství. Připravujeme další díl ze série pohádek — brzy bude k dispozici.",
                    ctaLabel: "Brzy k dispozici",
                    ctaHref: "/materialy/medved-maty",
                    isComingSoon: true,
                },
            ],
        },
        audience: {
            heading: "Pro koho je projekt určený",
            subheading: "Děti které:",
            items: [
                {
                    icon: getAssetUrl("images/home/icon-teddy.webp"),
                    iconAlt: "začínají mluvit",
                    line1: "začínají mluvit",
                    line2: "později",
                },
                {
                    icon: getAssetUrl("images/home/icon-speech.webp"),
                    iconAlt: "mají opožděný",
                    line1: "mají opožděný",
                    line2: "vývoj řeči",
                },
                {
                    icon: getAssetUrl("images/home/icon-visual.webp"),
                    iconAlt: "potřebují vizuální",
                    line1: "potřebují vizuální",
                    line2: "podporu komunikace",
                },
                {
                    icon: getAssetUrl("images/home/icon-understand.webp"),
                    iconAlt: "lépe rozumí",
                    line1: "lépe rozumí",
                    line2: "obrázkům než slovům",
                },
            ],
        },
        benefits: {
            heading: "Jak Čteme spolu jinak pomáhá dětem",
            intro: "Pomocí materiálů, které vytvářím, se děti učí rozumět světu, komunikovat a vyjadřovat své myšlenky:",
            bullets: [
                "rozvíjí slovní zásobu",
                "pomáhají dětem porozumět situacím",
                "podporují komunikaci mezi rodičem a dítětem",
                "učí děti vyjadřovat emoce",
            ],
            image: getAssetUrl("images/home/mom-child-cards.webp"),
            imageAlt: "Maminka s dítětem a komunikačními kartami",
        },
        faq: {
            heading: "Nejčastější otázky rodičů",
            items: [
                {
                    question: "Pomůže to i dětem, které ještě nemluví?",
                    answer: "Ano! Materiály jsou navrženy tak, aby fungovaly i bez slov. Děti se učí rozumět obrázkům, ukazovat a postupně pojmenovávat – každý krok vpřed se počítá.",
                },
                {
                    question: "Musím být logoped?",
                    answer: "Vůbec ne. Materiály jsou vytvořeny pro rodiče bez odborného vzdělání. Jsou jednoduché, intuitivní a doplněné návody, jak s nimi pracovat.",
                },
                {
                    question: "Od jakého věku jsou materiály vhodné?",
                    answer: "Materiály jsou vhodné přibližně od 1,5 roku. Hodí se pro děti, které začínají komunikovat, i pro starší děti s opožděným vývojem řeči.",
                },
            ],
        },
        contact: {
            instagramHandle: "@ctemespolujinak",
            instagramUrl: "https://instagram.com/ctemespolujinak",
            email: "ahoj@ctemespolujinak.cz",
            linktreeLabel: "Linktree",
            linktreeUrl: "https://linktr.ee/ctemespolujinak",
        },
        footer: {
            links: [
                { label: "Obchodní podmínky", href: "/obchodni-podminky" },
                { label: "Ochrana údajů", href: "/ochrana-udaju" },
                { label: "Zásady cookies (EU)", href: "/zasady-cookies" },
            ],
            copyright: "© 2025 Čteme spolu jinak. S láskou pro rodiče a jejich děti.",
        },
    };
}
