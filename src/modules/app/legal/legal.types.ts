import { HeaderData, FooterData, ContactData } from "../home/home.types";

export type LegalBlock =
    | { kind: "paragraph"; text: string }
    | { kind: "subheading"; text: string }
    | { kind: "list"; items: string[] };

export interface LegalSection {
    title: string;
    blocks: LegalBlock[];
}

export interface LegalPageProps {
    header: HeaderData;
    backLabel: string;
    backHref: string;
    pageTitle: string;
    intro: LegalBlock[];
    sections: LegalSection[];
    closing: string;
    contact: ContactData;
    footer: FooterData;
}
