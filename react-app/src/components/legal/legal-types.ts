import type {
  HeaderData,
  FooterData,
  ContactData,
} from '../home/shared-types';

export type LegalBlock =
  | { kind: 'paragraph'; text: string }
  | { kind: 'subheading'; text: string }
  | { kind: 'list'; items: string[] };

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
