import { getAssetUrl } from "../../../utils";
import { getHomeData } from "../home/home.data";
import { MaterialDetailContent, MaterialDetailPageProps } from "./materials.types";

function getDetails(): MaterialDetailContent[] {
    return [
        {
            slug: "knizky-rozvoj-reci",
            title: "Pohádky s piktogramy — Bagr a náklaďák na stavbě",
            tagline: "První díl ze série Pohádky s piktogramy. Příběh o stroji, který se ztratí na stavbě — a o tom, jak ho ostatní pomohou najít.",
            image: getAssetUrl("images/home/product1.webp"),
            imageAlt: "Pohádky s piktogramy — Bagr a náklaďák na stavbě",
            badge: "Novinka",
            badgeColor: "orange",
            ageRange: "2–5 let",
            price: "od 249 Kč",
            paragraphs: [
                "Bagr a náklaďák celý den makají na velké stavbě. Když pak nastane večer a všichni mají končit, malý náklaďák se nemůže najít — někde se ztratil mezi pískem, betonem a materiálem. Bagr s ostatními stroji se ho vydá hledat a postupně objevují, kudy mohl jet a kde se mohl zaseknout.",
                "Příběh je psaný s pravidelným rytmem a krátkými větami. Klíčová slova — bagr, náklaďák, písek, kolo, světlo — jsou nahrazená velkým barevným piktogramem přímo na řádce. Dítě je při čtení vidí, ukazuje, postupně pojmenovává.",
                "Pohádka nepotřebuje, aby dítě umělo číst písmena. Stačí, že umí poznat obrázek. Společně s rodičem tak \"čte\" celý příběh: rodič říká text, dítě doplňuje slova, která zná z obrázků.",
            ],
            highlightsTitle: "Co kniha přináší",
            highlights: [
                "Piktogramy místo neznámých slov — dítě \"čte\" s vámi i bez znalosti písmen",
                "Krátký a opakující se text — buduje pocit jistoty a předvídatelnosti",
                "Téma blízké dětem — stavba, stroje, pomoc kamarádovi",
                "Návod pro rodiče na konci, jak s knížkou pracovat den po dni",
                "Pevné zaoblené stránky odolné dětským rukám i opakovanému listování",
            ],
            factsTitle: "Co najdete uvnitř",
            facts: [
                { label: "Doporučený věk", value: "2–5 let" },
                { label: "Formát", value: "A5 na výšku, pevné stránky" },
                { label: "Jazyk", value: "Čeština" },
                { label: "Obsahuje návod pro rodiče", value: "Ano" },
                { label: "Cena", value: "od 249 Kč" },
                { label: "Platforma", value: "Gumroad (PDF + tisk)" },
            ],
            forWhomTitle: "Pro koho je kniha",
            forWhom: [
                "Pro děti, které začínají mluvit později než vrstevníci",
                "Pro děti s opožděným vývojem řeči, kterým slova zatím \"nesedí\"",
                "Pro rodiče, kteří chtějí konkrétní materiál do ruky a nehledat na internetu",
                "Pro rodiny, kde čtení před spaním je rituálem, na který se obě strany těší",
            ],
            ctaLabel: "Koupit na Gumroad",
            ctaHref: "https://ctemespolujinak.gumroad.com/l/lipneo",
            ctaNote: "Po koupi obratem získáš PDF k vytištění doma na A4. Bezpečná platba přes Gumroad.",
            seoDescription: "Pohádky s piktogramy: Bagr a náklaďák na stavbě — první díl série pro děti od 2 do 5 let. Příběh s obrázkovou podporou textu, ideální pro rodiny s opožděným vývojem řeči.",
        },
        {
            slug: "medved-maty",
            title: "Medvěd Maty a sovička",
            tagline: "Příběh o hledání, kamarádství a o tom, že řešení je často blíž, než si myslíme. Připravujeme — brzy bude k dispozici.",
            image: getAssetUrl("images/home/product2.webp"),
            imageAlt: "Medvěd Maty a sovička",
            badge: "Připravujeme",
            badgeColor: "gray",
            ageRange: "3–6 let",
            price: "Brzy",
            paragraphs: [
                "Medvěd Maty ztratí ve vysoké trávě svou oblíbenou hračku a nemůže ji najít. Až mu pomůže malá moudrá sovička, která vidí to, co Maty přehlédl. Z hledání se stane procházka po lese plná barev, zvuků a malých objevů — a hlavně začátek velkého kamarádství.",
                "Příběh je psaný tak, aby ho dítě mohlo prožívat na více úrovních: nejmladší ukazují obrázky a opakují slova, větší se ptají \"co bude dál\" a pojmenovávají emoce — Maty je nejdřív smutný, pak nervózní, pak má radost. Společně s rodičem se učí, že velké pocity mají jména.",
                "Knížka je momentálně ve výrobě. Pokud chceš dostat zprávu, jakmile bude k dispozici, napiš mi e-mail a já ti dám vědět jako prvnímu.",
            ],
            highlightsTitle: "Co příběh otevírá",
            highlights: [
                "Pojmenování emocí — smutek, nervozita, radost, vděčnost — v reálné situaci",
                "Téma \"když si nevím rady, můžu o pomoc požádat\" — důležité i pro malé děti",
                "Klidná, předvídatelná struktura příběhu vhodná pro večerní čtení",
                "Otázky pro rodiče v závěru, které pomohou vrátit se k příběhu i druhý den",
            ],
            factsTitle: "Co plánujeme",
            facts: [
                { label: "Doporučený věk", value: "3–6 let" },
                { label: "Formát", value: "A4 na šířku" },
                { label: "Jazyk", value: "Čeština" },
                { label: "Ilustrace", value: "Ručně malované, tlumené barvy" },
                { label: "Stav", value: "Připravujeme" },
            ],
            forWhomTitle: "Pro koho je knížka",
            forWhom: [
                "Pro děti, které začínají rozumět složitějším příběhům s pointou",
                "Pro citlivé děti, které řeší vlastní pocity (nervozita, ztráta věci, samota)",
                "Pro rodiče, kteří hledají téma \"jak mluvit s dítětem o emocích\" v podobě příběhu",
            ],
            ctaLabel: "Brzy k dispozici",
            ctaHref: "mailto:ahoj@ctemespolujinak.cz?subject=Z%C3%A1jem%20o%20Medv%C4%9Bda%20Matyho%20a%20sovi%C4%8Dku&body=Dobr%C3%BD%20den%2C%0A%0Acht%C4%9Bl(a)%20bych%20dostat%20zpr%C3%A1vu%2C%20jakmile%20bude%20kn%C3%AD%C5%BEka%20Medv%C4%9Bd%20Maty%20a%20sovi%C4%8Dka%20k%20dispozici.%0A%0AD%C4%9Bkuji.",
            ctaNote: "Knížku připravujeme. Napiš a já ti pošlu zprávu, jakmile bude k dispozici.",
            seoDescription: "Medvěd Maty a sovička — připravovaná obrázková knížka pro děti od 3 do 6 let o kamarádství, emocích a hledání. Brzy k dispozici.",
            isComingSoon: true,
        },
        {
            slug: "komunikacni-karty",
            title: "Komunikační karty pro každý den",
            tagline: "Když dítě ještě nemá slova, ale potřebuje říct, co cítí. Sada ke stažení zdarma.",
            image: getAssetUrl("images/home/mom-child-cards.webp"),
            imageAlt: "Komunikační karty pro děti",
            badge: "Zdarma",
            badgeColor: "green",
            ageRange: "1,5–5 let",
            price: "Zdarma",
            paragraphs: [
                "Sada obrázkových karet, které dítěti dávají způsob, jak vyjádřit potřeby a pocity bez tlaku na řeč. Žízeň, hlad, únava, smutek, radost, \"chci ven\", \"bolí mě\" — věci, které malé dítě prožívá denně, ale neumí je vždy pojmenovat.",
                "Karty se doma nepokládají na poličku — vytisknete si je doma, dáte na lednici, k jídelnímu stolu, do tašky. Postupně se stanou součástí běžné komunikace: dítě ukáže, rodič slovo pojmenuje a zopakuje. Z ukázání se časem stane slovo.",
                "Sada vznikla ve spolupráci s logopedy a je testovaná v rodinách dětí s opožděným vývojem řeči i u dětí, které si jen potřebují trochu jistoty navíc. K dispozici úplně zdarma — stačí stáhnout, vytisknout, používat.",
            ],
            highlightsTitle: "Co karty řeší",
            highlights: [
                "Snižují frustraci u dítěte, které ještě nemá dostatek slov",
                "Dávají rodiči jasný signál — vím, co dítě chce, a můžu na to reagovat",
                "Přirozeně přechází do mluvení — dítě nejdřív ukáže, pak slovo říká samo",
                "Vhodné i do školky / k babičce — funguje napříč prostředími",
            ],
            factsTitle: "Co je v sadě",
            facts: [
                { label: "Doporučený věk", value: "1,5–5 let" },
                { label: "Formát", value: "PDF k vytištění (A4)" },
                { label: "Témata", value: "Potřeby, pocity, jídlo, rutina dne" },
                { label: "Cena", value: "Zdarma" },
                { label: "Platforma", value: "Gumroad" },
            ],
            forWhomTitle: "Pro koho jsou karty",
            forWhom: [
                "Pro děti, které ještě nemluví nebo mluví minimálně",
                "Pro děti, které se ve stresu \"zaseknou\" a nedokáží říct, co potřebují",
                "Pro rodiče, kteří chtějí konkrétní pomůcku do běžného dne (ráno, jídlo, spánek)",
                "Pro logopedy a chůvy jako doplněk individuální práce",
            ],
            ctaLabel: "Stáhnout zdarma",
            ctaHref: "https://ctemespolujinak.gumroad.com/l/oqjzck",
            ctaNote: "Stažení je úplně zdarma přes platformu Gumroad — bez registrace, bez tlaku na placení.",
            seoDescription: "Komunikační karty pro děti od 1,5 do 5 let — sada obrázkových karet ke stažení zdarma. Pomáhají dítěti vyjádřit potřeby a pocity i bez slov.",
        },
    ];
}

export function findMaterialDetailBySlug(slug: string): MaterialDetailContent | null {
    const items = getDetails();
    for (const item of items) {
        if (item.slug === slug) return item;
    }
    return null;
}

export function getMaterialDetailPageProps(slug: string): MaterialDetailPageProps | null {
    const detail = findMaterialDetailBySlug(slug);
    if (detail === null) return null;
    const home = getHomeData();
    return {
        header: home.header,
        backLabel: "← Zpět na materiály",
        backHref: "/materialy",
        detail: detail,
        contact: home.contact,
        footer: home.footer,
    };
}
