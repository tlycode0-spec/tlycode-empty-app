import type { HeaderData, FooterData, ContactData } from '../home/shared-types';

export interface MaterialItem {
  slug: string;
  image: string;
  imageAlt: string;
  badge: string;
  badgeColor: 'orange' | 'green' | 'blue' | 'gray';
  title: string;
  description: string;
  ageRange: string;
  price: string;
  ctaLabel: string;
  ctaHref: string;
  isComingSoon?: boolean;
}

export interface MaterialsHero {
  title: string;
  intro: string;
  note: string;
}

export interface MaterialsPageProps {
  header: HeaderData;
  backLabel: string;
  backHref: string;
  hero: MaterialsHero;
  items: MaterialItem[];
  contact: ContactData;
  footer: FooterData;
}

export interface MaterialDetailFact {
  label: string;
  value: string;
}

export interface MaterialDetailContent {
  slug: string;
  title: string;
  tagline: string;
  image: string;
  imageAlt: string;
  badge: string;
  badgeColor: 'orange' | 'green' | 'blue' | 'gray';
  ageRange: string;
  price: string;
  paragraphs: string[];
  highlightsTitle: string;
  highlights: string[];
  factsTitle: string;
  facts: MaterialDetailFact[];
  forWhomTitle: string;
  forWhom: string[];
  ctaLabel: string;
  ctaHref: string;
  ctaNote: string;
  seoDescription: string;
  isComingSoon?: boolean;
}

export interface MaterialDetailPageProps {
  header: HeaderData;
  backLabel: string;
  backHref: string;
  detail: MaterialDetailContent;
  contact: ContactData;
  footer: FooterData;
}
