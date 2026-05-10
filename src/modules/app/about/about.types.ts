import { HeaderData, FooterData, ContactData } from "../home/home.types";

export interface AboutHero {
    quote: string;
    intro: string;
    image: string;
    imageAlt: string;
}

export interface AboutBody {
    heading: string;
    paragraphs: string[];
    signature: string;
}

export interface AboutPageProps {
    header: HeaderData;
    backLabel: string;
    backHref: string;
    pageTitle: string;
    hero: AboutHero;
    body: AboutBody;
    contact: ContactData;
    footer: FooterData;
}
