import type { HeaderData, FooterData, ContactData } from '../home/shared-types';

export interface FreeSampleHero {
  title: string;
  intro: string;
  image: string;
  imageAlt: string;
}

export interface FreeSampleStep {
  number: string;
  title: string;
  description: string;
}

export interface FreeSamplePageProps {
  header: HeaderData;
  backLabel: string;
  backHref: string;
  hero: FreeSampleHero;
  stepsTitle: string;
  steps: FreeSampleStep[];
  insideTitle: string;
  inside: string[];
  ctaTitle: string;
  ctaText: string;
  ctaLabel: string;
  ctaHref: string;
  ctaNote: string;
  contact: ContactData;
  footer: FooterData;
}
