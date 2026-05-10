import { getHomeData } from "../home/home.data";
import { LegalPageProps } from "./legal.types";

function commonChrome() {
    const home = getHomeData();
    return {
        header: home.header,
        backLabel: "← Zpět na hlavní stránku",
        backHref: "/",
        contact: home.contact,
        footer: home.footer,
    };
}

export function getTermsData(): LegalPageProps {
    return {
        ...commonChrome(),
        pageTitle: "Obchodní podmínky",
        intro: [
            { kind: "paragraph", text: "Všeobecné obchodní podmínky pro poskytovatele služeb a digitálního obsahu" },
            { kind: "subheading", text: "Poskytovatel:" },
            { kind: "paragraph", text: "Jméno podnikatele: Tereza Miklášová" },
            { kind: "paragraph", text: "Místo podnikání: Sibiřská 1103/64, 621 00, Brno - Řečkovice" },
            { kind: "paragraph", text: "IČO: 02114992" },
            { kind: "paragraph", text: "e-mail: ahoj@ctemespolujinak.cz" },
            { kind: "paragraph", text: "(dále jen „Poskytovatel\")" },
        ],
        sections: [
            {
                title: "I. Distanční smlouvy",
                blocks: [
                    { kind: "paragraph", text: "Tyto všeobecné obchodní podmínky upravují vzájemná práva a povinnosti fyzické osoby, která uzavírá smlouvu o poskytování služeb nebo smlouvu o poskytování digitálního obsahu jako spotřebitel, nebo fyzické či právnické osoby v rámci své podnikatelské činnosti (dále jen „zákazník\") prostřednictvím webových stránek www.ctemespolujinak.cz a jedná se tedy o distanční smlouvy a pro ně stanovené obchodní podmínky." },
                    { kind: "paragraph", text: "Zákazník při smluvním vztahu s Poskytovatelem souhlasí s použitím komunikačních prostředků na dálku při uzavírání distanční smlouvy." },
                    { kind: "paragraph", text: "Poskytovatel neúčtuje zákazníkům jakékoliv další poplatky za použití komunikačních prostředků pro uzavření distanční smlouvy nad rámec základní sazby, kterou zákazník platí za používání těchto komunikačních prostředků." },
                ],
            },
            {
                title: "II. Objednávka a uzavření smlouvy",
                blocks: [
                    { kind: "paragraph", text: "Smluvní vztah (uzavření distanční smlouvy) mezi Poskytovatelem a jeho zákazníky vzniká potvrzením doručené objednávky, která je Poskytovatelem zaslána zákazníkovi na jeho e-mailovou adresu, nesjednají-li smluvní strany jinak." },
                    { kind: "paragraph", text: "Uvede-li zákazník v objednávce své IČO a fakturační údaje, a tedy zamýšlí využít služby či produkty Poskytovatele v rámci své podnikatelské činnosti, nebude na něj pohlíženo v rámci smluvního vztahu jako na spotřebitele a jeho smluvní vztah s Poskytovatelem bude posuzován jako smluvní vztah dvou podnikajících osob; v opačném případě se má za to, že zákazník je v postavení spotřebitele a na vztah s Poskytovatelem se uplatní ujednání z. č. 634/1992 Sb., o ochraně spotřebitele." },
                    { kind: "paragraph", text: "Webové stránky Poskytovatele obsahují seznam a popis služeb a digitálního obsahu včetně uvedení ceny." },
                    { kind: "paragraph", text: "Pro objednání zákazník provede příslušnou volbu na webové stránce a vyplní objednávkový formulář a svůj nákup stvrdí vyjádřením souhlasu s upozorněním na povinnost platby." },
                    { kind: "paragraph", text: "Poskytovatel bez zbytečného odkladu po obdržení objednávky zákazníkovi potvrdí přijetí objednávky e-mailem." },
                ],
            },
            {
                title: "III. Cena a platební podmínky",
                blocks: [
                    { kind: "paragraph", text: "Zákazník získává přístup k produktům po zaplacení plné stanovené ceny." },
                    { kind: "paragraph", text: "Stanovuje se lhůta splatnosti v délce trvání 7 dnů." },
                    { kind: "paragraph", text: "Daňový doklad – fakturu Poskytovatel zašle v elektronické podobě na e-mailovou adresu zákazníka." },
                    { kind: "paragraph", text: "Způsob platby si zákazník vybere při vyplňování objednávkového formuláře:" },
                    { kind: "list", items: ["bankovním převodem na účet", "online platební kartou"] },
                    { kind: "paragraph", text: "V případě platební metody bankovní převod na účet obdrží zákazník platební údaje v e-mailu potvrzujícím přijetí objednávky." },
                    { kind: "paragraph", text: "Platba prostřednictvím online platební karty probíhá prostřednictvím platební brány společnosti Comgate a.s., Gočárova třída 1754/48b, Hradec Králové, e-mail: platby-podpora@comgate.cz, tel: +420 228 224 267, https://www.comgate.cz/cz/platebni-brana. Jedná se o zabezpečenou platební metodu, kdy žádné údaje, které při platbě zákazník zadá, nejsou Poskytovateli předávány. Případný dotaz k této platební metodě může zákazník směřovat přímo na výše uvedenou společnost." },
                    { kind: "paragraph", text: "Platba je úspěšně dokončena zobrazením potvrzující zprávy a jejím zasláním e-mailem." },
                    { kind: "paragraph", text: "Způsoby platby mohou být napojeny na platební bránu externího dodavatele, který poskytuje technologii bezpečného zpracovávání online plateb." },
                    { kind: "paragraph", text: "Poskytovatel přijímá úhradu svých produktů v českých korunách. V případě, provede-li zákazník úhradu za produkty v jiné měně, budou uhrazené prostředky přepočítány a připsány na účet Poskytovatele v českých korunách dle aktuálních podmínek a kurzu banky Poskytovatele." },
                ],
            },
            {
                title: "IV. Dodací podmínky",
                blocks: [
                    { kind: "subheading", text: "a) Produkty" },
                    { kind: "subheading", text: "(i) Online kurzy" },
                    { kind: "paragraph", text: "Při koupi online produktu (zejména online kurzy, záznamy apod.) může být Poskytovatelem zákazníkovi po uhrazení ceny vytvořen uživatelský účet k členské sekci. V případě, bude-li online produkt šířen jiným způsobem než prostřednictvím členské sekce, budou zákazníkovi zaslány přístupové údaje k jiné platformě, jejímž prostřednictvím bude kurz či záznam dostupný, či bude šířen e-mailem či jinou, Poskytovatelem vyhrazenou formou." },
                    { kind: "subheading", text: "(ii) Materiály ke stažení či zhlédnutí" },
                    { kind: "paragraph", text: "V případě produktů, které se stahují z webového prostředí (e-booky, pracovní listy, šablony apod.), zašle Poskytovatel zákazníkům odkazy a další přístupové údaje, na jejichž základě jim bude umožněno si zakoupený produkt stáhnout." },
                    { kind: "subheading", text: "(iii) Konzultace" },
                    { kind: "paragraph", text: "Poskytovatel sjedná se zákazníkem či prostřednictvím rezervačního systému stanoví k výběru zákazníka termíny pro tento typ produktů. Je možné nejpozději ve lhůtě 48 hodin před touto událostí požádat o změnu termínu ze zvlášť závažných důvodů na straně zákazníka (např. nemoc apod.)." },
                    { kind: "subheading", text: "(iv) Služby" },
                    { kind: "paragraph", text: "Jednotlivé služby budou poskytnuty způsobem a v čase uvedeném na webu Poskytovatele." },
                    { kind: "subheading", text: "b) Balíčky produktů" },
                    { kind: "paragraph", text: "Poskytovatel výslovně stanovuje a upozorňuje zákazníky, že některé jeho služby sestávají z kombinace digitálního obsahu a služeb. V případě zakoupení takového balíčku se v případě nevyčerpání všech součástí či nevyčerpání v předem stanoveném období z důvodů na straně zákazníka uhrazené prostředky za tyto součásti balíčku nevrací." },
                    { kind: "subheading", text: "c) Společná pravidla" },
                    { kind: "paragraph", text: "V případě, že Poskytovatel pro čerpání některých služeb vytvoří pro své zákazníky uživatelské účty, je zákazník v takovém případě povinen dodržovat mlčenlivost o přístupových údajích ke svému členskému účtu." },
                    { kind: "paragraph", text: "Poskytovatel si vyhrazuje právo poskytovat produkty pouze po dobu stanovenou v popisu konkrétní služby či produktu." },
                    { kind: "paragraph", text: "Těmito obchodními podmínkami se řídí také právní poměry mezi Poskytovatelem a zákazníkem, pokud Poskytovatel poskytne digitální obsah za osobní údaje namísto odměny, tzv. „magnet\" (a Poskytovatel poskytnuté osobní údaje zpracovává i pro jiné účely než poskytnutí digitálního obsahu nebo splnění svých zákonných povinností)." },
                    { kind: "paragraph", text: "Poskytovatel zpřístupní zákazníkovi zakoupený digitální obsah v nejnovější verzi dostupné v době uzavření smlouvy o poskytování digitálního obsahu se zákazníkem. Poskytovatel neposkytuje aktualizace zakoupeného digitálního obsahu." },
                ],
            },
            {
                title: "V. Odstoupení od smlouvy",
                blocks: [
                    { kind: "paragraph", text: "Zákazník je oprávněn od smlouvy uzavřené s Poskytovatelem odstoupit, stanoví-li tak uzavřená smlouva, tyto obchodní podmínky nebo příslušná ustanovení občanského zákoníku." },
                    { kind: "paragraph", text: "Obecně má zákazník v postavení spotřebitele u smluv uzavřených distančním způsobem dle § 1829 NOZ právo od smlouvy odstoupit ve lhůtě 14 dnů ode dne uzavření smlouvy. Toto právo je u zákazníka v postavení podnikatele vyloučeno." },
                    { kind: "paragraph", text: "Upozornění na výjimku odstoupení od smlouvy uzavřené na dálku u digitálního obsahu pro spotřebitele: není-li u konkrétního produktu typu digitální obsah stanoveno jinak, Poskytovatel informuje zákazníka prostřednictvím svých stránek a zákazník výslovně uděluje prostřednictvím možností na stránkách Poskytovatele souhlas, že je mu digitální obsah zpřístupněn bezodkladně po zaplacení kupní ceny. V takovém případě pak zákazník ztrácí právo na odstoupení od smlouvy ve 14denní lhůtě od uzavření smlouvy o poskytnutí digitálního obsahu. Z důvodu těchto okolností hodných zvláštního zřetele je u digitálního obsahu nabízeného prostřednictvím stránek či dalších internetových služeb Poskytovatele vyloučena možnost odstoupit v uvedené lhůtě do 14 dnů od smlouvy uzavřené způsobem na dálku a požadovat vrácení celé uhrazené ceny." },
                    { kind: "paragraph", text: "Zákazník v postavení spotřebitele je oprávněn od smlouvy na poskytnutí digitálního obsahu uzavřené způsobem na dálku odstoupit v případě, nedodá-li Poskytovatel digitální produkt bezodkladně po jeho zaplacení nebo v dodatečné lhůtě stanovené zákazníkem (pokud není výslovně v popisu produktu stanoveno pozdější datum dodání). Zákazník může od smlouvy odstoupit bez dodatečné lhůty jen v případě, že je z prohlášení Poskytovatele nebo z okolností zjevné, že poskytovatel digitální obsah neposkytne anebo vyplývá-li z ujednání stran nebo z okolností při uzavření smlouvy, že je plnění v určeném čase nezbytné. Výslovně se však stanovuje, že toto ujednání se nepoužije v případě tzv. předprodejů a dalších případů, kdy je stanoveno pozdější datum dodání plnění." },
                    { kind: "paragraph", text: "Odstoupení zákazník může zaslat Poskytovateli e-mailem na adresu ahoj@ctemespolujinak.cz nebo písemně na adresu jeho místa podnikání, které je uvedeno v těchto obchodních podmínkách v jejich úvodu, ale také jakoukoliv jinou formou. Odstoupení od smlouvy postačuje prokazatelně odeslat Poskytovateli i poslední den 14denní lhůty od uzavření smlouvy." },
                    { kind: "paragraph", text: "V případě řádně učiněného odstoupení od smlouvy Poskytovatel vrátí přijaté peněžní prostředky nejpozději do 14 dnů od přijetí odstoupení." },
                    { kind: "paragraph", text: "Poskytovatel je oprávněn od smlouvy odstoupit, jestliže není možné z objektivních důvodů produkt za původních podmínek poskytnout, plnění se stane objektivně nemožným nebo protiprávním. Odstoupení Poskytovatele bude vždy zdůvodněno ze zákonem stanovených nebo v těchto podmínkách uvedených důvodů. Odstoupení je účinné doručením oznámení zákazníkovi." },
                ],
            },
            {
                title: "VI. Odpovědnost za vady a reklamace",
                blocks: [
                    { kind: "paragraph", text: "Zákazník je oprávněn uplatnit svá práva vznikající z vadného plnění, a to v případě, vykazuje-li produkt vadu či jiný rozpor s jeho objednávkou. Práva vznikající z vadného plnění se řídí platnými právními předpisy, zejména ust. § 1914 – 1925 občanského zákoníku. U služeb pak také § 2099 až 2112 občanského zákoníku a pro zákazníky, kteří jsou v postavení spotřebitele, pak také § 2158 až 2160 občanského zákoníku, kdy se v souvislosti s ust. § 2615 použijí u služeb přiměřeně uvedená ustanovení jako u kupní smlouvy. U digitálního obsahu pak ustanoveními § 2389a – 2389s občanského zákoníku a pro zákazníky v postavení spotřebitele pak také ustanoveními § 2389g až 2389s občanského zákoníku." },
                    { kind: "paragraph", text: "Poskytovatel odpovídá za to, že produkt při převzetí nevykazuje vady." },
                    { kind: "paragraph", text: "Vadu je povinen zákazník uplatnit u Poskytovatele e-mailem bezodkladně po jejím zjištění na e-mailovou adresu ahoj@ctemespolujinak.cz, případně jiným způsobem. Vadu lze zákazníkem v postavení podnikatele vytknout při převzetí plnění. Vadu lze zákazníkem v postavení spotřebitele vytknout v maximální zákonné objektivní reklamační lhůtě, která je stanovena šest měsíců od převzetí předmětu plnění. Vadu krytou zárukou lze vytknout nejpozději v reklamační lhůtě určené délkou záruční doby, pokud je záruční doba delší než šest měsíců, u digitálního obsahu je 24 měsíců, nestanoví-li ji výslovně Poskytovatel delší." },
                    { kind: "paragraph", text: "Zákazník může požadovat odstranění vady, přiměřenou slevu nebo odstoupit od smlouvy. Volbu vyřešení reklamace provede zákazník. Zákazník však není oprávněn od smlouvy odstoupit, jedná-li se o vadu nevýznamnou." },
                    { kind: "paragraph", text: "Stanovuje se v souladu se zákonem, že přiměřená sleva se určí jako rozdíl mezi hodnotou produktu bez vady a vadného produktu, který byl zákazníkovi poskytnut. Má-li být produkt poskytován po určitou dobu, zohlední se doba, po kterou byl poskytován vadně." },
                    { kind: "paragraph", text: "Peněžité částky, které má Poskytovatel z důvodu vadného plnění vydat zákazníkovi, ať už z titulu poskytnutí přiměřené slevy či pokud zákazník odstoupí od smlouvy, vrátí Poskytovatel na vlastní náklady bez zbytečného odkladu, nejpozději však do čtrnácti dnů ode dne, kdy zákazník uplatnil u Poskytovatele příslušné právo z vadného plnění." },
                    { kind: "paragraph", text: "Stanovuje se lhůta 30 dnů pro vyřešení nároků zákazníka z titulu odpovědnosti za vady, s tím, že Poskytovatel je povinen zákazníka do konce této lhůty vyrozumět o výsledku reklamačního řízení a v případě, není-li možné v této lhůtě nároky zákazníka vyřešit, je třeba mu o tom předem poskytnout informaci a ve lhůtě 30 dnů jej o průběhu reklamačního řízení informovat." },
                    { kind: "paragraph", text: "Zřídil-li Poskytovatel provozovnu, zajistí, aby po celou otevírací dobu byl přítomen pracovník oprávněný k přijetí reklamací." },
                ],
            },
            {
                title: "VII. Závěrečná ustanovení",
                blocks: [
                    { kind: "paragraph", text: "Poskytovatel je autorem a vykonavatelem autorských práv k službám a produktům, webům a jejich jednotlivým součástem, mají-li charakter autorského díla, není-li v rámci webů uvedeno jinak. Poskytovatel je autorem a vykonavatelem autorských práv k součástem online produktů, mají-li charakter autorského díla. Užití díla bez souhlasu Poskytovatele či jakýkoliv jiný neoprávněný výkon práv k dílům je zakázán." },
                    { kind: "paragraph", text: "K mimosoudnímu řešení spotřebitelských sporů (ADR) ze smlouvy je příslušná: Česká obchodní inspekce, Ústřední inspektorát – oddělení ADR, Gorazdova 1929/64, Praha 2, 120 00, e-mail: adr@coi.cz, web: adr.coi.cz. Platformu pro řešení sporů online nacházející se na internetové adrese http://ec.europa.eu/consumers/odr je rovněž možné využít při řešení sporů mezi Poskytovatelem a zákazníkem ze smlouvy, v případě, jedná-li se o spotřebitelský spor." },
                    { kind: "paragraph", text: "Jakékoli hodnocení produktů nebo poskytovatele (recenze), které je uvedeno na webových stránkách, pochází od osoby, které byl digitální obsah skutečně zpřístupněn nebo která využila službu." },
                    { kind: "paragraph", text: "Znění těchto všeobecných obchodních podmínek může Poskytovatel měnit či doplňovat a tyto změny jsou účinné zveřejněním nových všeobecných obchodních podmínek (jejich změn) na webu Poskytovatele. Tímto ustanovením nejsou dotčena práva a povinnosti vzniklá po dobu účinnosti předchozího znění obchodních podmínek." },
                    { kind: "paragraph", text: "Je-li některé ustanovení obchodních podmínek neplatné nebo neúčinné, nebo se takovým stane, namísto neplatných ustanovení nastoupí ustanovení, jehož smysl se neplatnému ustanovení co nejvíce přibližuje. Neplatností nebo neúčinností jednoho ustanovení není dotčena platnost ostatních ustanovení." },
                ],
            },
        ],
        closing: "Tyto všeobecné obchodní podmínky nabývají platnosti a účinnosti ke dni 30.04.2026.",
    };
}

export function getPrivacyData(): LegalPageProps {
    return {
        ...commonChrome(),
        pageTitle: "Ochrana osobních údajů",
        intro: [],
        sections: [
            {
                title: "1. Správce údajů",
                blocks: [{ kind: "paragraph", text: "Správcem osobních údajů je provozovatel webu Čteme spolu jinak." }],
            },
            {
                title: "2. Jaké údaje shromažďujeme",
                blocks: [{ kind: "paragraph", text: "Můžeme shromažďovat údaje jako e-mailovou adresu (při přihlášení k odběru), údaje o prohlížení webu a cookies pro analýzu návštěvnosti." }],
            },
            {
                title: "3. Účel zpracování",
                blocks: [{ kind: "paragraph", text: "Údaje používáme pro zlepšení služeb, zasílání novinek (se souhlasem) a analýzu návštěvnosti webu." }],
            },
            {
                title: "4. Vaše práva",
                blocks: [{ kind: "paragraph", text: "Máte právo na přístup k údajům, jejich opravu, výmaz, omezení zpracování a právo vznést námitku. Kontaktujte nás pro uplatnění těchto práv." }],
            },
            {
                title: "5. Doba uchovávání",
                blocks: [{ kind: "paragraph", text: "Údaje uchováváme pouze po dobu nezbytnou pro naplnění účelu zpracování nebo po dobu stanovenou zákonem." }],
            },
        ],
        closing: "",
    };
}

export function getCookiesData(): LegalPageProps {
    return {
        ...commonChrome(),
        pageTitle: "Zásady cookies (EU)",
        intro: [],
        sections: [
            {
                title: "1. Co jsou cookies",
                blocks: [{ kind: "paragraph", text: "Cookies jsou malé textové soubory, které se ukládají do vašeho zařízení při návštěvě webových stránek. Pomáhají nám zapamatovat si vaše preference a zlepšit váš zážitek z prohlížení." }],
            },
            {
                title: "2. Jaké cookies používáme",
                blocks: [
                    { kind: "list", items: [
                        "Nezbytné cookies: Zajišťují základní funkce webu.",
                        "Analytické cookies: Pomáhají nám pochopit, jak web používáte.",
                        "Funkční cookies: Pamatují si vaše preference.",
                    ] },
                ],
            },
            {
                title: "3. Správa cookies",
                blocks: [{ kind: "paragraph", text: "Cookies můžete spravovat v nastavení svého prohlížeče. Můžete je odmítnout nebo smazat, ale některé funkce webu pak nemusí fungovat správně." }],
            },
            {
                title: "4. Souhlas",
                blocks: [{ kind: "paragraph", text: "Používáním tohoto webu souhlasíte s používáním cookies v souladu s těmito zásadami. Svůj souhlas můžete kdykoli odvolat změnou nastavení prohlížeče." }],
            },
        ],
        closing: "",
    };
}
