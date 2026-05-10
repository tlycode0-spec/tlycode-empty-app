import { getAssetUrl } from "../../../utils";
import { getHomeData } from "../home/home.data";
import { FreeSamplePageProps } from "./free-sample.types";

export function getFreeSampleData(): FreeSamplePageProps {
    const home = getHomeData();
    return {
        header: home.header,
        backLabel: "← Zpět na materiály",
        backHref: "/materialy",
        hero: {
            title: "Ukázka zdarma ke stažení",
            intro: "Krátký příběh s obrázkovou podporou textu. Vyzkoušejte si doma, jak naše knížky fungují, ještě než si některou objednáte.",
            image: getAssetUrl("images/home/hero-mom-reading.webp"),
            imageAlt: "Maminka čte se svým dítětem obrázkovou knížku",
        },
        stepsTitle: "Jak ukázku získáte",
        steps: [
            {
                number: "1",
                title: "Klikněte na tlačítko",
                description: "Otevře se vám stránka s ukázkou na platformě Gumroad — žádná registrace, jen jméno a e-mail.",
            },
            {
                number: "2",
                title: "Stáhněte si PDF",
                description: "Po potvrzení obratem získáte PDF, které si vytisknete doma na A4.",
            },
            {
                number: "3",
                title: "Čtěte společně",
                description: "Sedněte si s dítětem, ukazujte si obrázky a slova. Bez tlaku, bez \"zopakuj to po mně\".",
            },
        ],
        insideTitle: "Co v ukázce najdete",
        inside: [
            "Krátký příběh ze série, kterou používáme doma",
            "Velké barevné obrázky přímo v textu — dítě \"čte\" společně s vámi",
            "Návod pro rodiče: jak s knížkou pracovat den po dni",
            "Doporučení, kterou knížku vybrat podle věku dítěte",
        ],
        ctaTitle: "Stáhnout ukázku zdarma",
        ctaText: "Ukázka je dostupná přes platformu Gumroad. Stažení je úplně zdarma — bez registrace, bez tlaku na placení.",
        ctaLabel: "Stáhnout zdarma na Gumroadu",
        ctaHref: "https://ctemespolujinak.gumroad.com/l/yricfu",
        ctaNote: "Stáhne se PDF k vytištění doma na A4.",
        contact: home.contact,
        footer: home.footer,
    };
}
